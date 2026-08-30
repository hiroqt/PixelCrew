/**
 * PIXEL CREW — Kiro Adapter
 * 
 * Execution adapter for Kiro coding agent runtime.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
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

  async detect(targetDir = process.cwd()) {
    // 1. Environment variables (Active Kiro session/agent environment)
    if (
      process.env.KIRO ||
      process.env.KIRO_AGENT ||
      process.env.KIRO_SESSION ||
      process.env.KIRO_WORKSPACE ||
      process.env.KIRO_APP_DIR ||
      process.env.KIRO_CONFIG_DIR ||
      process.env.KIRO_PATH
    ) {
      return true;
    }

    // 2. Target Workspace files/folders (.kiro, .kirorules, kiro.json, .kiro.json)
    const indicators = ['.kiro', '.kirorules', 'kiro.json', '.kiro.json'];
    for (const item of indicators) {
      try {
        await fs.access(path.join(targetDir, item));
        return true;
      } catch {}
    }

    // 3. User Home Directory (~/.kiro, ~/.config/kiro)
    try {
      const home = os.homedir();
      if (home) {
        try {
          await fs.access(path.join(home, '.kiro'));
          return true;
        } catch {}
        try {
          await fs.access(path.join(home, '.config', 'kiro'));
          return true;
        } catch {}
      }
    } catch {}

    // 4. macOS Application bundle detection
    if (process.platform === 'darwin') {
      const macApps = [
        '/Applications/Kiro.app',
        path.join(os.homedir() || '', 'Applications', 'Kiro.app'),
        '/Applications/Kiro IDE.app'
      ];
      for (const appPath of macApps) {
        try {
          await fs.access(appPath);
          return true;
        } catch {}
      }
    }

    // 5. Binary CLI in PATH (kiro, kiro-cli, kiro-agent, kiro-ai)
    const binaries = ['kiro', 'kiro-cli', 'kiro-agent', 'kiro-ai'];
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
