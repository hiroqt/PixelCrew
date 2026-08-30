/**
 * PIXEL CREW — Codex Adapter
 * 
 * Execution adapter for OpenAI Codex / CLI environments.
 */

import { spawn } from 'node:child_process';
import { AgentAdapter } from './adapter.interface.js';

export class CodexAdapter extends AgentAdapter {
  constructor(options = {}) {
    super('codex', 'Codex', {
      description: 'OpenAI Codex & Assistant code execution environment',
      capabilities: {
        fileAccess: true,
        terminalAccess: true,
        subagents: false,
        backgroundTasks: false,
        streaming: true,
        toolCalls: true
      },
      ...options
    });
  }

  async detect() {
    if (process.env.OPENAI_API_KEY || process.env.CODEX_API_KEY) {
      return true;
    }
    return new Promise((resolve) => {
      try {
        const proc = spawn('which', ['codex'], { stdio: 'ignore' });
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

    await emit('tool.invoked', `Codex engine executing task: ${task.title}`);

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
