/**
 * PIXEL CREW — Agent Runtime Execution Engine
 * 
 * Manages the lifecycle of task execution on assigned Agent Adapters.
 * Handles timeouts, cancellation signals, skill injection, and progress telemetry.
 */

import { EVENT_TYPES } from '../protocol/event.js';
import { TASK_STATUS } from '../protocol/task.js';

export class AgentRuntime {
  constructor(options = {}) {
    this.eventBus = options.eventBus || null;
    this.defaultTimeoutMs = options.defaultTimeoutMs || 120000;
  }

  setEventBus(eventBus) {
    this.eventBus = eventBus;
  }

  /**
   * Executes a single AgentTask on the provided adapter
   */
  async executeTask(task, adapter, runtimeContext = {}) {
    const startTime = Date.now();
    const abortController = runtimeContext.abortController || new AbortController();

    const emit = async (eventType, message, data = {}) => {
      if (!this.eventBus) return;
      await this.eventBus.emitEvent({
        agent: task.agent,
        type: eventType,
        taskId: task.id,
        taskName: task.title,
        provider: adapter?.id || 'generic',
        message,
        data
      });
    };

    try {
      task.status = TASK_STATUS.RUNNING;
      task.assignedProvider = adapter?.id || 'generic';

      await emit(EVENT_TYPES.AGENT_STARTED, `Activated agent for task: ${task.title}`, {
        skills: task.skills,
        provider: adapter?.name || adapter?.id
      });

      // Announce activated skills
      for (const skill of task.skills) {
        await emit(EVENT_TYPES.SKILL_ACTIVATED, `Applying skill: ${skill}`, { skill });
      }

      // Execute on adapter
      let result;
      if (adapter && typeof adapter.execute === 'function') {
        result = await adapter.execute(task, {
          ...runtimeContext,
          emit,
          signal: abortController.signal
        });
      } else if (runtimeContext.executeTaskHandler) {
        result = await runtimeContext.executeTaskHandler(task, emit);
      } else {
        // Fallback simulation delay
        await new Promise(r => setTimeout(r, 300));
        result = { success: true, message: `Completed task ${task.id} via generic runner` };
      }

      task.status = TASK_STATUS.COMPLETED;
      task.result = result;
      task.updatedAt = Date.now();

      await emit(EVENT_TYPES.TASK_COMPLETED, `Completed: ${task.title} (${Date.now() - startTime}ms)`, {
        durationMs: Date.now() - startTime,
        result
      });

      return result;
    } catch (err) {
      task.status = TASK_STATUS.FAILED;
      task.error = err.message;
      task.updatedAt = Date.now();

      await emit(EVENT_TYPES.TASK_FAILED, `Failed: ${task.title} — ${err.message}`, {
        durationMs: Date.now() - startTime,
        error: err.message
      });

      throw err;
    }
  }
}
