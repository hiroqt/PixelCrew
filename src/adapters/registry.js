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
   * Scans system to detect available providers and determine the active runtime
   * @param {boolean} forceRefresh
   * @param {string} targetDir
   * @returns {Promise<{ activeProvider: string, activeProviderName: string, activeProviderIcon: string, activeProviderDescription: string, available: import('./adapter.interface.js').AgentAdapter[], missing: import('./adapter.interface.js').AgentAdapter[] }>}
   */
  async scanEnvironment(forceRefresh = false, targetDir = process.cwd()) {
    const now = Date.now();
    if (!forceRefresh && now - this.lastScanTime < 4000 && this.detectedCache.size > 0 && this.lastScanResult) {
      return this.lastScanResult;
    }

    const availableWithScores = [];
    const missing = [];

    for (const adapter of this.adapters.values()) {
      try {
        const score = typeof adapter.detectScore === 'function' 
          ? await adapter.detectScore(targetDir) 
          : ((await adapter.detect(targetDir)) ? 100 : 0);

        this.detectedCache.set(adapter.id, score > 0);
        if (score > 0) {
          availableWithScores.push({ adapter, score });
        } else {
          missing.push(adapter);
        }
      } catch {
        this.detectedCache.set(adapter.id, false);
        missing.push(adapter);
      }
    }

    // Sort available adapters by confidence score descending
    availableWithScores.sort((a, b) => {
      // Prioritize higher score
      if (b.score !== a.score) return b.score - a.score;
      // If score is equal, prioritize Antigravity / Kiro / Claude over generic
      if (a.adapter.id === 'generic') return 1;
      if (b.adapter.id === 'generic') return -1;
      return 0;
    });

    const available = availableWithScores.map(item => item.adapter);
    const top = available.find(a => a.id !== 'generic') || available[0] || this.getAdapter('generic');

    this.lastScanTime = now;
    this.lastScanResult = {
      activeProvider: top?.id || 'generic',
      activeProviderName: top?.name || 'Generic CLI Runner',
      activeProviderIcon: top?.icon || '💻',
      activeProviderDescription: top?.description || '',
      available,
      missing
    };

    return this.lastScanResult;
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

    const { activeProvider, available } = await this.scanEnvironment();

    if (strategy === 'hybrid') {
      // Hybrid crew strategy:
      // - Design / Frontend -> Claude Code / Cursor / Antigravity
      // - Backend / Data -> Codex / Antigravity / Kiro
      // - QA / Review -> Claude Code / Generic / Antigravity
      if (task.agent === 'frontend' || task.agent === 'creativeDirector') {
        const preferred = available.find(a => a.id === 'claude-code' || a.id === 'cursor' || a.id === 'antigravity');
        if (preferred) return preferred;
      } else if (task.agent === 'backend' || task.agent === 'database') {
        const preferred = available.find(a => a.id === 'codex' || a.id === 'antigravity' || a.id === 'kiro');
        if (preferred) return preferred;
      }
    }

    // In 'auto' mode: Use the top-scored active provider
    if (activeProvider) {
      const activeAdapter = this.getAdapter(activeProvider);
      if (activeAdapter) return activeAdapter;
    }

    if (available.length > 0) {
      return available[0];
    }

    return this.getAdapter('generic');
  }
}
