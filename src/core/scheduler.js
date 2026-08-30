/**
 * PIXEL CREW — Core Scheduler & Concurrency Dispatcher
 * 
 * Schedules task batches from a TaskGraph to Worker Slots respecting dependencies,
 * concurrency limits, and provider routing.
 */

import { EventEmitter } from 'node:events';
import { TASK_STATUS } from '../protocol/task.js';

export class Scheduler extends EventEmitter {
  constructor(options = {}) {
    super();
    this.maxConcurrent = options.maxConcurrent || 4;
    this.agentRuntime = options.agentRuntime || null;
    this.providerRegistry = options.providerRegistry || null;
    this.abortController = null;
    this.activeWorkers = new Set();
  }

  setAgentRuntime(runtime) {
    this.agentRuntime = runtime;
  }

  setProviderRegistry(registry) {
    this.providerRegistry = registry;
  }

  /**
   * Executes a TaskGraph until completion or error
   */
  async execute(taskGraph, options = {}) {
    this.abortController = new AbortController();
    const runtimeStrategy = options.strategy || 'auto';
    const handler = options.executeTaskHandler || null;

    if (taskGraph.hasCycle()) {
      throw new Error('Deadlock detected in TaskGraph: Cyclic dependencies present');
    }

    const runningPromises = new Map();

    while (!taskGraph.isCompleted() && !taskGraph.hasFailed()) {
      if (this.abortController.signal.aborted) {
        throw new Error('Scheduler execution aborted');
      }

      const readyTasks = taskGraph.getReadyTasks();

      // If no tasks ready and none running, graph is stuck
      if (readyTasks.length === 0 && runningPromises.size === 0) {
        if (!taskGraph.isCompleted()) {
          throw new Error('TaskGraph stalled: unresolvable dependencies or missing prerequisite tasks');
        }
        break;
      }

      // Fill available concurrency slots
      const availableSlots = this.maxConcurrent - runningPromises.size;
      const tasksToDispatch = readyTasks.slice(0, Math.max(0, availableSlots));

      for (const task of tasksToDispatch) {
        taskGraph.markRunning(task.id);

        const taskPromise = (async () => {
          let adapter = null;
          if (this.providerRegistry) {
            adapter = await this.providerRegistry.getBestAgent(task, runtimeStrategy);
          }

          if (this.agentRuntime) {
            return await this.agentRuntime.executeTask(task, adapter, {
              abortController: this.abortController,
              executeTaskHandler: handler,
              ...options
            });
          } else if (handler) {
            return await handler(task);
          } else {
            await new Promise(r => setTimeout(r, 200));
            return { success: true };
          }
        })()
          .then((result) => {
            taskGraph.markCompleted(task.id, result);
            this.emit('task_completed', { task, result });
          })
          .catch((err) => {
            taskGraph.markFailed(task.id, err);
            this.emit('task_failed', { task, error: err });
            throw err;
          })
          .finally(() => {
            runningPromises.delete(task.id);
          });

        runningPromises.set(task.id, taskPromise);
      }

      if (runningPromises.size > 0) {
        // Wait for at least one running task to finish before next loop iteration
        await Promise.race(runningPromises.values());
      }
    }

    // Wait for any remaining tasks to settle
    if (runningPromises.size > 0) {
      await Promise.all(runningPromises.values());
    }

    return {
      success: !taskGraph.hasFailed(),
      completed: taskGraph.completedTaskIds.size,
      total: taskGraph.tasks.size,
      tasks: taskGraph.getAllTasks()
    };
  }

  cancel() {
    if (this.abortController) {
      this.abortController.abort();
    }
  }
}
