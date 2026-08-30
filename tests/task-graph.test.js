import test from 'node:test';
import assert from 'node:assert/strict';
import { TaskGraph } from '../src/core/task-graph.js';
import { Scheduler } from '../src/core/scheduler.js';
import { AgentRuntime } from '../src/core/agent-runtime.js';
import { EventBus } from '../src/core/event-bus.js';
import { createTask, TASK_STATUS } from '../src/protocol/task.js';
import { GenericAdapter } from '../src/adapters/generic.js';

test('TaskGraph detects DAG dependencies and ready tasks', () => {
  const t1 = createTask({ id: 'task-1', title: 'Design System', agent: 'creativeDirector', dependencies: [] });
  const t2 = createTask({ id: 'task-2', title: 'Frontend UI', agent: 'frontend', dependencies: ['task-1'] });
  const t3 = createTask({ id: 'task-3', title: 'Backend APIs', agent: 'backend', dependencies: [] });
  const t4 = createTask({ id: 'task-4', title: 'E2E Testing', agent: 'qa', dependencies: ['task-2', 'task-3'] });

  const graph = new TaskGraph([t1, t2, t3, t4]);

  assert.equal(graph.hasCycle(), false);
  const readyInitially = graph.getReadyTasks();
  assert.equal(readyInitially.length, 2);
  const readyIds = readyInitially.map(t => t.id).sort();
  assert.deepEqual(readyIds, ['task-1', 'task-3']);

  // Complete task-1
  graph.markCompleted('task-1');
  const readyAfter1 = graph.getReadyTasks();
  assert.equal(readyAfter1.some(t => t.id === 'task-2'), true);

  // Complete task-2 and task-3
  graph.markCompleted('task-2');
  graph.markCompleted('task-3');
  const readyFinal = graph.getReadyTasks();
  assert.equal(readyFinal.length, 1);
  assert.equal(readyFinal[0].id, 'task-4');

  graph.markCompleted('task-4');
  assert.equal(graph.isCompleted(), true);
});

test('TaskGraph detects circular dependencies', () => {
  const t1 = createTask({ id: 'task-a', title: 'Task A', agent: 'frontend', dependencies: ['task-b'] });
  const t2 = createTask({ id: 'task-b', title: 'Task B', agent: 'backend', dependencies: ['task-a'] });

  const graph = new TaskGraph([t1, t2]);
  assert.equal(graph.hasCycle(), true);
  assert.throws(() => graph.getTopologicalOrder(), /Cycle detected/);
});

test('Scheduler and AgentRuntime execute TaskGraph to completion', async () => {
  const t1 = createTask({ id: 't1', title: 'Setup Tokens', agent: 'creativeDirector', dependencies: [] });
  const t2 = createTask({ id: 't2', title: 'Assemble Components', agent: 'frontend', dependencies: ['t1'] });

  const graph = new TaskGraph([t1, t2]);
  const eventBus = new EventBus();
  const runtime = new AgentRuntime({ eventBus });
  const scheduler = new Scheduler({ agentRuntime: runtime, maxConcurrent: 2 });

  const adapter = new GenericAdapter();
  const events = [];
  eventBus.on('event', (evt) => events.push(evt));

  const result = await scheduler.execute(graph, {
    executeTaskHandler: async (task, emit) => {
      return { ok: true, taskId: task.id };
    }
  });

  assert.equal(result.success, true);
  assert.equal(result.completed, 2);
  assert.equal(graph.isCompleted(), true);
  assert.ok(events.length >= 4);
});
