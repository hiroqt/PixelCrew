/**
 * PIXEL CREW — Autonomous Agent Runtime & DAG Task Queue
 * 
 * Manages dynamic DAG task scheduling, parallel execution, and granular event streaming.
 */

import { EventEmitter } from 'node:events';

export class TaskQueue extends EventEmitter {
  constructor(tasks = []) {
    super();
    this.tasks = new Map(tasks.map(t => [t.id, { ...t }]));
    this.completedTasks = new Set();
    this.runningTasks = new Set();
    this.failedTasks = new Set();
    this.history = [];
  }

  /**
   * Retrieves all tasks currently ready for execution
   * (all dependencies completed and task is currently queued)
   */
  getReadyTasks() {
    const ready = [];
    for (const [id, task] of this.tasks.entries()) {
      if (task.status === 'queued') {
        const depsMet = task.dependsOn.every(depId => this.completedTasks.has(depId));
        if (depsMet) {
          ready.push(task);
        }
      }
    }
    return ready;
  }

  isCompleted() {
    return this.tasks.size === this.completedTasks.size;
  }

  hasFailed() {
    return this.failedTasks.size > 0;
  }

  /**
   * Executes the entire DAG with autonomous agent dispatching
   */
  async execute(runtimeContext = {}, onEvent = () => {}) {
    const emit = (event) => {
      this.history.push(event);
      this.emit('event', event);
      onEvent(event);
    };

    while (!this.isCompleted() && !this.hasFailed()) {
      const readyTasks = this.getReadyTasks();

      if (readyTasks.length === 0 && this.runningTasks.size === 0) {
        throw new Error('Deadlock detected in Task Graph: cyclic dependency or unmet prerequisite');
      }

      // Execute all ready tasks in parallel batch
      const promises = readyTasks.map(async (task) => {
        task.status = 'running';
        this.runningTasks.add(task.id);

        emit({
          type: 'agent.started',
          agent: task.agentId,
          taskId: task.id,
          taskName: task.name,
          message: `Workstation activated for: ${task.name}`
        });

        // Activate required skills
        for (const skill of task.skills) {
          emit({
            type: 'skill.activated',
            agent: task.agentId,
            taskId: task.id,
            skill,
            message: `Applying skill: ${skill}`
          });
        }

        // Execute actual agent task payload if handler exists
        if (runtimeContext.executeTaskHandler) {
          try {
            await runtimeContext.executeTaskHandler(task, emit);
          } catch (err) {
            task.status = 'failed';
            this.failedTasks.add(task.id);
            this.runningTasks.delete(task.id);
            emit({
              type: 'task.failed',
              agent: task.agentId,
              taskId: task.id,
              error: err.message
            });
            throw err;
          }
        } else {
          await new Promise(r => setTimeout(r, 400));
        }

        task.status = 'completed';
        this.runningTasks.delete(task.id);
        this.completedTasks.add(task.id);

        emit({
          type: 'task.completed',
          agent: task.agentId,
          taskId: task.id,
          taskName: task.name,
          message: `Completed: ${task.name}`
        });
      });

      await Promise.all(promises);
    }

    return {
      success: !this.hasFailed(),
      completedCount: this.completedTasks.size,
      totalTasks: this.tasks.size,
      history: this.history
    };
  }
}
