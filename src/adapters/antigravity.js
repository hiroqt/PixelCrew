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

  async detect(targetDir = process.cwd()) {
    // 1. Environment variables
    if (
      process.env.ANTIGRAVITY_APP_DIR ||
      process.env.AGY_SESSION ||
      process.env.GEMINI_API_KEY ||
      process.env.ANTIGRAVITY ||
      process.env.AGY ||
      process.env.AGY_WORKSPACE ||
      process.env.GOOGLE_API_KEY
    ) {
      return true;
    }

    // 2. Workspace indicators (.agents/, .agent/, .gemini/, GEMINI.md, AGENTS.md)
    const indicators = ['.agents', '.agent', '.gemini', 'GEMINI.md', 'AGENTS.md', 'mcp_config.json'];
    for (const item of indicators) {
      try {
        await fs.access(path.join(targetDir, item));
        return true;
      } catch {}
    }

    // 3. User home directory (~/.gemini, ~/.agents, ~/.config/antigravity)
    try {
      const home = os.homedir();
      if (home) {
        try {
          await fs.access(path.join(home, '.gemini'));
          return true;
        } catch {}
        try {
          await fs.access(path.join(home, '.agents'));
          return true;
        } catch {}
        try {
          await fs.access(path.join(home, '.config', 'antigravity'));
          return true;
        } catch {}
      }
    } catch {}

    // 4. macOS Application bundle detection
    if (process.platform === 'darwin') {
      const macApps = [
        '/Applications/Antigravity.app',
        path.join(os.homedir() || '', 'Applications', 'Antigravity.app'),
        '/Applications/Google Antigravity.app'
      ];
      for (const appPath of macApps) {
        try {
          await fs.access(appPath);
          return true;
        } catch {}
      }
    }

    // 5. Binary CLI in PATH (agy, antigravity, gemini, google-antigravity)
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
      if (isFound) return true;
    }

    return false;
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
