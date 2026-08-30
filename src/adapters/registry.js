/**
 * PIXEL CREW — Provider Registry & Dynamic Strategy Engine
 * 
 * Manages coding agent providers, executes environment scans, and resolves
 * the optimal adapter based on task requirements and selected runtime strategies.
 */

import { GenericAdapter } from './generic.js';
import { ClaudeCodeAdapter } from './claude-code.js';
import { CodexAdapter } from './codex.js';
import { CursorAdapter } from './cursor.js';
import { KiroAdapter } from './kiro.js';
import { AntigravityAdapter } from './antigravity.js';

export class ProviderRegistry {
  constructor() {
    this.adapters = new Map();
    this.detectedCache = new Map();
    this.lastScanTime = 0;

    // Register built-in providers
    this.registerAdapter(new GenericAdapter());
    this.registerAdapter(new ClaudeCodeAdapter());
    this.registerAdapter(new CodexAdapter());
    this.registerAdapter(new CursorAdapter());
    this.registerAdapter(new KiroAdapter());
    this.registerAdapter(new AntigravityAdapter());
  }

  registerAdapter(adapter) {
    if (!adapter?.id) {
      throw new Error('Adapter must have a unique id');
    }
    this.adapters.set(adapter.id, adapter);
  }

  getAdapter(id) {
    return this.adapters.get(id) || null;
  }

  getAllAdapters() {
    return Array.from(this.adapters.values());
  }

  /**
   * Scans system to detect available providers
   * @param {boolean} forceRefresh
   * @returns {Promise<{ available: import('./adapter.interface.js').AgentAdapter[], missing: import('./adapter.interface.js').AgentAdapter[] }>}
   */
  async scanEnvironment(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && now - this.lastScanTime < 5000 && this.detectedCache.size > 0) {
      const available = [];
      const missing = [];
      for (const adapter of this.adapters.values()) {
        if (this.detectedCache.get(adapter.id)) {
          available.push(adapter);
        } else {
          missing.push(adapter);
        }
      }
      return { available, missing };
    }

    const available = [];
    const missing = [];

    for (const adapter of this.adapters.values()) {
      try {
        const isDetected = await adapter.detect();
        this.detectedCache.set(adapter.id, isDetected);
        if (isDetected) {
          available.push(adapter);
        } else {
          missing.push(adapter);
        }
      } catch {
        this.detectedCache.set(adapter.id, false);
        missing.push(adapter);
      }
    }

    this.lastScanTime = now;
    return { available, missing };
  }

  /**
   * Selects the best adapter for a given task based on strategy
   * @param {import('../protocol/task.js').AgentTask} task
   * @param {string} strategy - 'auto' | 'hybrid' | specific provider id
   */
  async getBestAgent(task, strategy = 'auto') {
    // If specific adapter explicitly requested
    if (strategy && strategy !== 'auto' && strategy !== 'hybrid') {
      const explicit = this.getAdapter(strategy);
      if (explicit) return explicit;
    }

    // Check if task itself specifies an assigned provider
    if (task?.assignedProvider) {
      const assigned = this.getAdapter(task.assignedProvider);
      if (assigned) return assigned;
    }

    const { available } = await this.scanEnvironment();

    // Priority ordering for 'auto' strategy:
    // Claude Code -> Antigravity -> Cursor -> Codex -> Kiro -> Generic
    const priorityOrder = ['claude-code', 'antigravity', 'cursor', 'codex', 'kiro', 'generic'];

    if (strategy === 'hybrid') {
      // Hybrid crew strategy:
      // - Design / Frontend -> Claude Code / Cursor
      // - Backend / Data -> Codex / Antigravity
      // - QA / Review -> Claude Code / Generic
      if (task.agent === 'frontend' || task.agent === 'creativeDirector') {
        const preferred = available.find(a => a.id === 'claude-code' || a.id === 'cursor');
        if (preferred) return preferred;
      } else if (task.agent === 'backend' || task.agent === 'database') {
        const preferred = available.find(a => a.id === 'codex' || a.id === 'antigravity');
        if (preferred) return preferred;
      }
    }

    for (const id of priorityOrder) {
      const match = available.find(a => a.id === id);
      if (match) return match;
    }

    return this.getAdapter('generic');
  }
}
