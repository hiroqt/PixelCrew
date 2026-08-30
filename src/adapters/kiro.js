/**
 * PIXEL CREW — Kiro Adapter
 * 
 * Execution adapter for Kiro coding agent runtime.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { AgentAdapter } from './adapter.interface.js';

export class KiroAdapter extends AgentAdapter {
  constructor(options = {}) {
    super('kiro', 'Kiro', {
      description: 'Kiro autonomous agent and multi-agent runtime',
      capabilities: {
        fileAccess: true,
        terminalAccess: true,
        subagents: true,
        backgroundTasks: true,
        streaming: true,
        toolCalls: true
      },
      ...options
    });
  }

  async detect() {
    if (process.env.KIRO || process.env.KIRO_AGENT) {
      return true;
    }
    try {
      await fs.access(path.join(process.cwd(), '.kiro'));
      return true;
    } catch {}

    return new Promise((resolve) => {
      try {
        const proc = spawn('which', ['kiro'], { stdio: 'ignore' });
        proc.on('close', (code) => resolve(code === 0));
        proc.on('error', () => resolve(false));
      } catch {
        resolve(false);
      }
    });
  }

  async execute(task, context = {}) {
    const { emit = () => {}, signal } = context;

    if (signal?.aborted) {
      throw new Error(`Task ${task.id} cancelled before start`);
    }

    await emit('tool.invoked', `Kiro agent executing task: ${task.title}`);

    if (context.executeTaskHandler) {
      return await context.executeTaskHandler(task, emit);
    }

    await new Promise(r => setTimeout(r, 200));
    return {
      success: true,
      provider: this.id,
      taskId: task.id
    };
  }
}
