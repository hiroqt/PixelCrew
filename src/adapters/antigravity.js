/**
 * PIXEL CREW — Antigravity Adapter
 * 
 * Execution adapter for Google Antigravity (AGY) SDK, IDE, and subagent sidecars.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { AgentAdapter } from './adapter.interface.js';

export class AntigravityAdapter extends AgentAdapter {
  constructor(options = {}) {
    super('antigravity', 'Google Antigravity', {
      icon: '🪐',
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

  async detectScore(targetDir = process.cwd()) {
    let score = 0;

    // 1. Active Antigravity session / IDE environment variables (+1000 points)
    if (
      process.env.ANTIGRAVITY_AGENT ||
      process.env.ANTIGRAVITY_CONVERSATION_ID ||
      process.env.ANTIGRAVITY_EDITOR_APP_ROOT ||
      process.env.ANTIGRAVITY_APP_DIR ||
      process.env.ANTIGRAVITY_TRAJECTORY_ID ||
      process.env.ANTIGRAVITY_LS_ADDRESS ||
      process.env.AGY_SESSION ||
      process.env.ANTIGRAVITY ||
      process.env.AGY ||
      process.env.AGY_WORKSPACE ||
      process.env.GEMINI_CLI
    ) {
      score += 1000;
    }

    // 2. Workspace indicators (.agents/, .agent/, .gemini/, GEMINI.md, AGENTS.md) (+200 points)
    const indicators = ['.agents', '.agent', '.gemini', 'GEMINI.md', 'AGENTS.md'];
    for (const item of indicators) {
      try {
        await fs.access(path.join(targetDir, item));
        score += 200;
        break;
      } catch {}
    }

    // 3. User home directory (~/.gemini, ~/.agents, ~/.config/antigravity) (+50 points)
    try {
      const home = os.homedir();
      if (home) {
        try {
          await fs.access(path.join(home, '.gemini'));
          score += 50;
        } catch {}
        try {
          await fs.access(path.join(home, '.agents'));
          score += 50;
        } catch {}
      }
    } catch {}

    // 4. macOS Application bundle (+30 points)
    if (process.platform === 'darwin') {
      const macApps = [
        '/Applications/Antigravity.app',
        path.join(os.homedir() || '', 'Applications', 'Antigravity.app'),
        '/Applications/Google Antigravity.app'
      ];
      for (const appPath of macApps) {
        try {
          await fs.access(appPath);
          score += 30;
          break;
        } catch {}
      }
    }

    // 5. Binary CLI in PATH (+30 points)
    const binaries = ['agy', 'antigravity', 'gemini', 'google-antigravity'];
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
