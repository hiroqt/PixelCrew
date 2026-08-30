/**
 * PIXEL CREW — Dynamic Directed Acyclic Graph (DAG) Task Engine
 * 
 * Manages task graph construction, topological sorting, cycle detection,
 * and parallel dependency resolution.
 */

import { createTask, TASK_STATUS, validateTask } from '../protocol/task.js';

export class TaskGraph {
  constructor(tasks = []) {
    this.tasks = new Map();
    this.completedTaskIds = new Set();
    this.runningTaskIds = new Set();
    this.failedTaskIds = new Set();

    for (const t of tasks) {
      this.addTask(t);
    }
  }

  /**
   * Adds a task to the graph
   */
  addTask(taskInput) {
    const task = taskInput.id && taskInput.title ? taskInput : createTask(taskInput);
    validateTask(task);
    this.tasks.set(task.id, task);
    if (task.status === TASK_STATUS.COMPLETED) {
      this.completedTaskIds.add(task.id);
    } else if (task.status === TASK_STATUS.RUNNING) {
      this.runningTaskIds.add(task.id);
    } else if (task.status === TASK_STATUS.FAILED) {
      this.failedTaskIds.add(task.id);
    }
    return task;
  }

  getTask(id) {
    return this.tasks.get(id) || null;
  }

  getAllTasks() {
    return Array.from(this.tasks.values());
  }

  /**
   * Detects cycles in the task graph using DFS
   */
  hasCycle() {
    const visited = new Set();
    const recursionStack = new Set();

    const dfs = (taskId) => {
      visited.add(taskId);
      recursionStack.add(taskId);

      const task = this.tasks.get(taskId);
      if (task && Array.isArray(task.dependencies)) {
        for (const depId of task.dependencies) {
          if (!this.tasks.has(depId)) {
            // Unresolved external dependency
            continue;
          }
          if (!visited.has(depId)) {
            if (dfs(depId)) return true;
          } else if (recursionStack.has(depId)) {
            return true;
          }
        }
      }

      recursionStack.delete(taskId);
      return false;
    };

    for (const taskId of this.tasks.keys()) {
      if (!visited.has(taskId)) {
        if (dfs(taskId)) return true;
      }
    }
    return false;
  }

  /**
   * Returns topological ordering of tasks
   */
  getTopologicalOrder() {
    if (this.hasCycle()) {
      throw new Error('Cannot compute topological order: Cycle detected in task graph');
    }

    const visited = new Set();
    const order = [];

    const visit = (taskId) => {
      if (visited.has(taskId)) return;
      visited.add(taskId);

      const task = this.tasks.get(taskId);
      if (task && Array.isArray(task.dependencies)) {
        for (const depId of task.dependencies) {
          if (this.tasks.has(depId)) {
            visit(depId);
          }
        }
      }
      order.push(task);
    };

    for (const taskId of this.tasks.keys()) {
      visit(taskId);
    }

    return order;
  }

  /**
   * Returns all tasks ready to run (dependencies completed and task is queued/pending)
   */
  getReadyTasks() {
    const ready = [];
    for (const [id, task] of this.tasks.entries()) {
      if (task.status === TASK_STATUS.QUEUED || task.status === TASK_STATUS.PENDING) {
        const depsMet = task.dependencies.every(depId => this.completedTaskIds.has(depId));
        if (depsMet) {
          ready.push(task);
        }
      }
    }
    return ready;
  }

  markRunning(taskId) {
    const task = this.tasks.get(taskId);
    if (!task) return;
    task.status = TASK_STATUS.RUNNING;
    task.updatedAt = Date.now();
    this.runningTaskIds.add(taskId);
  }

  markCompleted(taskId, result = null) {
    const task = this.tasks.get(taskId);
    if (!task) return;
    task.status = TASK_STATUS.COMPLETED;
    task.result = result;
    task.updatedAt = Date.now();
    this.runningTaskIds.delete(taskId);
    this.completedTaskIds.add(taskId);
  }

  markFailed(taskId, error = null) {
    const task = this.tasks.get(taskId);
    if (!task) return;
    task.status = TASK_STATUS.FAILED;
    task.error = typeof error === 'string' ? error : (error?.message || 'Unknown error');
    task.updatedAt = Date.now();
    this.runningTaskIds.delete(taskId);
    this.failedTaskIds.add(taskId);
  }

  isCompleted() {
    return this.tasks.size > 0 && this.tasks.size === this.completedTaskIds.size;
  }

  hasFailed() {
    return this.failedTaskIds.size > 0;
  }

  reset() {
    this.completedTaskIds.clear();
    this.runningTaskIds.clear();
    this.failedTaskIds.clear();
    for (const task of this.tasks.values()) {
      task.status = TASK_STATUS.QUEUED;
      task.result = null;
      task.error = null;
      task.updatedAt = Date.now();
    }
  }

  toJSON() {
    return Array.from(this.tasks.values());
  }
}
