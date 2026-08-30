/**
 * PIXEL CREW — Decoupled Universal Core Orchestrator
 * 
 * Orchestrates multi-agent pipelines, task graph scheduling, provider routing,
 * and real-time state telemetry completely decoupled from specific IDEs.
 */

import { EventEmitter } from 'node:events';
import fs from 'node:fs/promises';
import path from 'node:path';
import { TaskGraph } from './task-graph.js';
import { Scheduler } from './scheduler.js';
import { AgentRuntime } from './agent-runtime.js';
import { EventBus } from './event-bus.js';
import { AGENT_STATES, AGENT_EXPRESSIONS, ORCHESTRATOR_EXPRESSIONS } from '../protocol/agent.js';
import { EVENT_TYPES } from '../protocol/event.js';
import { TASK_STATUS } from '../protocol/task.js';

export class CoreOrchestrator extends EventEmitter {
  constructor(rootDir = process.cwd(), options = {}) {
    super();
    this.rootDir = rootDir;
    this.options = options;

    // Filesystem compatibility paths (.pixel-crew primary, .pixel-agents legacy fallback)
    this.crewDir = path.join(rootDir, '.pixel-crew');
    this.agentsDir = path.join(rootDir, '.pixel-agents');
    this.activeDir = this.crewDir;

    this.eventBus = new EventBus();
    this.agentRuntime = new AgentRuntime({ eventBus: this.eventBus });
    this.scheduler = new Scheduler({
      maxConcurrent: options.maxConcurrent || 4,
      agentRuntime: this.agentRuntime
    });

    this.providerRegistry = null;
    this.skillRegistry = null;
    this.config = null;
    this.state = null;
    this.activeTaskGraph = null;
    this.activeSprintAbort = null;

    // Forward events from eventBus to orchestrator listeners
    this.eventBus.on('event', (evt) => {
      this.emit('event', evt);
      this.emit('agent_event', evt);
      this.syncStateFromEvent(evt);
    });
  }

  setProviderRegistry(registry) {
    this.providerRegistry = registry;
    this.scheduler.setProviderRegistry(registry);
  }

  setSkillRegistry(registry) {
    this.skillRegistry = registry;
  }

  async initialize() {
    // Check if .pixel-crew exists, fallback to .pixel-agents
    let hasCrewDir = false;
    try {
      await fs.access(this.crewDir);
      hasCrewDir = true;
      this.activeDir = this.crewDir;
    } catch {
      try {
        await fs.access(this.agentsDir);
        this.activeDir = this.agentsDir;
      } catch {
        this.activeDir = this.crewDir;
      }
    }

    const configPath = path.join(this.activeDir, 'config.json');
    const statePath = path.join(this.activeDir, 'state.json');
    const eventsPath = path.join(this.activeDir, 'events.jsonl');

    // Register log paths on event bus
    this.eventBus.addLogFilePath(eventsPath);
    if (this.activeDir !== this.agentsDir) {
      // Also register legacy path if .pixel-agents exists
      try {
        await fs.access(this.agentsDir);
        this.eventBus.addLogFilePath(path.join(this.agentsDir, 'events.jsonl'));
      } catch {}
    }

    // Load Config
    try {
      const raw = await fs.readFile(configPath, 'utf-8');
      this.config = JSON.parse(raw);
    } catch {
      this.config = {
        project: path.basename(this.rootDir),
        orchestrator: { enabled: true, maxConcurrentAgents: 4, runtimeStrategy: 'auto' },
        agents: {},
        dashboard: { enabled: true, port: 4747 }
      };
    }

    // Load State
    try {
      const raw = await fs.readFile(statePath, 'utf-8');
      this.state = JSON.parse(raw);
    } catch {
      this.state = {
        status: 'READY',
        activeTask: 'Waiting for tasks',
        startedAt: null,
        completedAt: null,
        orchestrator: { state: AGENT_STATES.IDLE, expression: ORCHESTRATOR_EXPRESSIONS.IDLE, activeSubtasks: 0, totalSubtasks: 0, progress: 0 },
        agents: {}
      };
    }

    // Load Events
    await this.eventBus.loadFromDisk(eventsPath);

    return this;
  }

  getState() {
    return this.state;
  }

  getConfig() {
    return this.config;
  }

  getEvents() {
    return this.eventBus.getHistory();
  }

  async emitEvent(eventData) {
    return await this.eventBus.emitEvent(eventData);
  }

  syncStateFromEvent(event) {
    if (!this.state) return;

    if (event.type === EVENT_TYPES.ORCHESTRATION_STARTED) {
      this.state.status = 'RUNNING';
      this.state.activeTask = event.taskName || event.message;
      this.state.startedAt = event.timestamp;
      this.state.completedAt = null;
      this.state.orchestrator = {
        state: AGENT_STATES.WORKING,
        expression: ORCHESTRATOR_EXPRESSIONS.COORDINATING,
        progress: 5
      };
    } else if (event.type === EVENT_TYPES.ORCHESTRATION_COMPLETED) {
      this.state.status = 'COMPLETED';
      this.state.completedAt = event.timestamp;
      this.state.orchestrator = {
        state: AGENT_STATES.COMPLETED,
        expression: ORCHESTRATOR_EXPRESSIONS.COMPLETED,
        progress: 100
      };
    } else if (event.type === EVENT_TYPES.AGENT_STARTED) {
      if (event.agent && this.state.agents) {
        this.state.agents[event.agent] = {
          state: AGENT_STATES.WORKING,
          expression: AGENT_EXPRESSIONS.WORKING,
          currentTask: event.taskName || event.message,
          provider: event.provider
        };
      }
    } else if (event.type === EVENT_TYPES.TASK_COMPLETED) {
      if (event.agent && this.state.agents) {
        this.state.agents[event.agent] = {
          state: AGENT_STATES.COMPLETED,
          expression: AGENT_EXPRESSIONS.COMPLETED,
          currentTask: `Completed: ${event.taskName || ''}`,
          provider: event.provider
        };
      }
    }

    this.emit('state_change', { state: this.state });
  }

  /**
   * Dispatches and executes a TaskGraph
   */
  async executeTaskGraph(taskGraph, options = {}) {
    this.activeTaskGraph = taskGraph;

    await this.emitEvent({
      agent: 'orchestrator',
      type: EVENT_TYPES.ORCHESTRATION_STARTED,
      taskName: options.title || 'Multi-Agent Task Sprint',
      message: `Orchestrator dispatching DAG task graph (${taskGraph.tasks.size} tasks)`
    });

    try {
      const result = await this.scheduler.execute(taskGraph, {
        strategy: options.strategy || this.config?.orchestrator?.runtimeStrategy || 'auto',
        ...options
      });

      await this.emitEvent({
        agent: 'orchestrator',
        type: EVENT_TYPES.ORCHESTRATION_COMPLETED,
        taskName: options.title || 'Multi-Agent Task Sprint',
        message: `Orchestration completed successfully (${result.completed}/${result.total} tasks resolved)`
      });

      return result;
    } catch (err) {
      await this.emitEvent({
        agent: 'orchestrator',
        type: EVENT_TYPES.ORCHESTRATION_FAILED,
        taskName: options.title || 'Multi-Agent Task Sprint',
        message: `Orchestration sprint failed: ${err.message}`,
        data: { error: err.message }
      });
      throw err;
    } finally {
      this.activeTaskGraph = null;
    }
  }

  cancelActiveExecution() {
    this.scheduler.cancel();
    if (this.state) {
      this.state.status = 'READY';
      this.state.orchestrator.state = AGENT_STATES.IDLE;
      this.state.orchestrator.expression = ORCHESTRATOR_EXPRESSIONS.IDLE;
    }
  }
}
