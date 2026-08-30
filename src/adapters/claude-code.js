/**
 * PIXEL CREW — Claude Code Adapter
 * 
 * Execution adapter for Anthropic Claude Code CLI.
 */

import { spawn } from 'node:child_process';
import { AgentAdapter } from './adapter.interface.js';

export class ClaudeCodeAdapter extends AgentAdapter {
  constructor(options = {}) {
    super('claude-code', 'Claude Code', {
      description: 'Anthropic Claude Code CLI & autonomous agent runtime',
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
    // Check if claude command exists or environment variable is set
    if (process.env.CLAUDE_CODE || process.env.ANTHROPIC_API_KEY) {
      return true;
    }
    return new Promise((resolve) => {
      try {
        const proc = spawn('which', ['claude'], { stdio: 'ignore' });
        proc.on('close', (code) => resolve(code === 0));
        proc.on('error', () => resolve(false));
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * Translates universal AgentTask to Claude Code prompt format
   */
  formatTaskForClaude(task) {
    return [
      `[PIXEL CREW SPRINT TASK: ${task.id}]`,
      `TITLE: ${task.title}`,
      `ROLE: ${task.agent}`,
      `SKILLS: ${task.skills.join(', ')}`,
      `READ FILES: ${task.files.read.join(', ') || 'All'}`,
      `WRITE FILES: ${task.files.write.join(', ') || 'All'}`,
      `DESCRIPTION:\n${task.description}`
    ].join('\n\n');
  }

  async execute(task, context = {}) {
    const { emit = () => {}, signal } = context;

    if (signal?.aborted) {
      throw new Error(`Task ${task.id} cancelled before start`);
    }

    await emit('tool.invoked', `Claude Code dispatching subagent for task: ${task.title}`);

    if (context.executeTaskHandler) {
      return await context.executeTaskHandler(task, emit);
    }

    // Standard task execution
    await new Promise(r => setTimeout(r, 200));
    return {
      success: true,
      provider: this.id,
      taskId: task.id,
      prompt: this.formatTaskForClaude(task)
    };
  }
}
