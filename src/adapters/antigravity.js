/**
 * PIXEL CREW — Antigravity Adapter
 * 
 * Execution adapter for Google Antigravity (AGY) SDK, IDE, and subagent sidecars.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { AgentAdapter } from './adapter.interface.js';

export class AntigravityAdapter extends AgentAdapter {
  constructor(options = {}) {
    super('antigravity', 'Google Antigravity', {
      description: 'Google Antigravity SDK & Advanced Agentic Coding environment',
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
    if (process.env.ANTIGRAVITY_APP_DIR || process.env.AGY_SESSION || process.env.GEMINI_API_KEY) {
      return true;
    }
    // Check if .gemini or .agents directory exists
    try {
      await fs.access(path.join(process.cwd(), '.agents'));
      return true;
    } catch {}

    return new Promise((resolve) => {
      try {
        const proc = spawn('which', ['agy'], { stdio: 'ignore' });
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

    await emit('tool.invoked', `Antigravity agent executing task: ${task.title}`);

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
