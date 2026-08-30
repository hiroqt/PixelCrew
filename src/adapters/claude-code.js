/**
 * PIXEL CREW — Claude Code Adapter
 * 
 * Execution adapter for Anthropic Claude Code CLI.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { AgentAdapter } from './adapter.interface.js';

export class ClaudeCodeAdapter extends AgentAdapter {
  constructor(options = {}) {
    super('claude-code', 'Claude Code', {
      icon: '🤖',
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

  async detectScore(targetDir = process.cwd()) {
    let score = 0;

    // 1. Environment variables (Active Claude Code session) (+1000 points)
    if (
      process.env.CLAUDE_CODE ||
      process.env.CLAUDE_AGENT ||
      process.env.CLAUDE_SESSION ||
      process.env.CLAUDE_WORKSPACE ||
      process.env.CLAUDE_APP_DIR
    ) {
      score += 1000;
    }

    // 2. Workspace indicators (.claude/, .claude-plugin/, CLAUDE.md, claude.json, .claude.json) (+200 points)
    const indicators = ['.claude', '.claude-plugin', 'CLAUDE.md', 'claude.json', '.claude.json'];
    for (const item of indicators) {
      try {
        await fs.access(path.join(targetDir, item));
        score += 200;
        break;
      } catch {}
    }

    // 3. User home directory (~/.claude, ~/.claude.json) (+50 points)
    try {
      const home = os.homedir();
      if (home) {
        try {
          await fs.access(path.join(home, '.claude'));
          score += 50;
        } catch {}
        try {
          await fs.access(path.join(home, '.claude.json'));
          score += 50;
        } catch {}
      }
    } catch {}

    // 4. macOS Application bundle detection (+30 points)
    if (process.platform === 'darwin') {
      const macApps = [
        '/Applications/Claude.app',
        path.join(os.homedir() || '', 'Applications', 'Claude.app'),
        '/Applications/Claude Code.app'
      ];
      for (const appPath of macApps) {
        try {
          await fs.access(appPath);
          score += 30;
          break;
        } catch {}
      }
    }

    // 5. Binary CLI in PATH (claude, claude-code, claude-cli) (+30 points)
    const binaries = ['claude', 'claude-code', 'claude-cli'];
    for (const bin of binaries) {
      const isFound = await new Promise((resolve) => {
        try {
          const cmd = process.platform === 'win32' ? 'where' : 'which';
          const proc = spawn(cmd, [bin], { stdio: 'ignore' });
          proc.on('close', (code) => resolve(code === 0));
          proc.on('error', () => resolve(false));
        } catch {
          resolve(false);
        }
      });
      if (isFound) {
        score += 30;
        break;
      }
    }

    return score;
  }

  async detect(targetDir = process.cwd()) {
    const score = await this.detectScore(targetDir);
    return score > 0;
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
