/**
 * PIXEL CREW — Universal Agent Adapter Interface
 * 
 * Abstract contract implemented by every coding agent execution environment
 * (Claude Code, Codex, Cursor, Kiro, Antigravity, and Generic CLI).
 */

import { normalizeCapabilities } from '../protocol/agent.js';

export class AgentAdapter {
  constructor(id, name, options = {}) {
    if (!id || !name) {
      throw new Error('AgentAdapter must have an id and name');
    }
    this.id = id;
    this.name = name;
    this.icon = options.icon || '🤖';
    this.description = options.description || '';
    this.capabilities = normalizeCapabilities(options.capabilities || {});
  }

  /**
   * Returns a confidence score for whether this provider is currently active
   * (>= 1000: active runtime session, >= 200: workspace config, >= 50: installed app/cli, 0: not detected)
   * @param {string} targetDir
   * @returns {Promise<number>}
   */
  async detectScore(targetDir = process.cwd()) {
    const isDetected = await this.detect(targetDir);
    return isDetected ? 100 : 0;
  }

  /**
   * Detects if this provider/IDE is available in the current environment
   * @param {string} targetDir
   * @returns {Promise<boolean>}
   */
  async detect(targetDir = process.cwd()) {
    return false;
  }

  /**
   * Returns normalized capabilities of this agent provider
   * @returns {Promise<import('../protocol/agent.js').AgentCapabilities>}
   */
  async getCapabilities() {
    return this.capabilities;
  }

  /**
   * Executes a standard AgentTask on this provider
   * @param {import('../protocol/task.js').AgentTask} task
   * @param {object} context
   * @returns {Promise<any>}
   */
  async execute(task, context = {}) {
    throw new Error(`execute() not implemented for adapter: ${this.name}`);
  }

  /**
   * Cancels a running task on this provider
   * @param {string} taskId
   * @returns {Promise<void>}
   */
  async cancel(taskId) {
    // Optional cancel override
  }

  /**
   * Returns current status of a running task on this provider
   * @param {string} taskId
   * @returns {Promise<{ status: string, progress?: number }>}
   */
  async getStatus(taskId) {
    return { status: 'unknown' };
  }
}
