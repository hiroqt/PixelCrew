/**
 * PIXEL CREW — Cursor Adapter
 * 
 * Execution adapter for Cursor IDE, Composer, and .cursorrules rulesets.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { AgentAdapter } from './adapter.interface.js';

export class CursorAdapter extends AgentAdapter {
  constructor(options = {}) {
    super('cursor', 'Cursor IDE', {
      description: 'Cursor AI editor environment & Composer agent integration',
      capabilities: {
        fileAccess: true,
        terminalAccess: true,
        subagents: false,
        backgroundTasks: true,
        streaming: true,
        toolCalls: true
      },
      ...options
    });
  }

  async detect() {
    if (process.env.CURSOR || process.env.CURSOR_AGENT) {
      return true;
    }
    // Check if .cursorrules exists in workspace
    try {
      await fs.access(path.join(process.cwd(), '.cursorrules'));
      return true;
    } catch {}

    return new Promise((resolve) => {
      try {
        const proc = spawn('which', ['cursor'], { stdio: 'ignore' });
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

    await emit('tool.invoked', `Cursor agent applying task context to workspace: ${task.title}`);

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
