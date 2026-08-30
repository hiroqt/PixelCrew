/**
 * PIXEL CREW — Cursor Adapter
 * 
 * Execution adapter for Cursor IDE, Composer, and .cursorrules rulesets.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
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

  async detect(targetDir = process.cwd()) {
    // 1. Environment variables
    if (
      process.env.CURSOR ||
      process.env.CURSOR_AGENT ||
      process.env.CURSOR_SESSION ||
      process.env.CURSOR_WORKSPACE ||
      process.env.CURSOR_APP_DIR ||
      process.env.CURSOR_CONFIG_DIR ||
      process.env.CURSOR_PATH
    ) {
      return true;
    }

    // 2. Workspace indicators (.cursorrules, .cursor/, .cursor/rules, cursor.json)
    const indicators = ['.cursorrules', '.cursor', 'cursor.json', '.cursor.json'];
    for (const item of indicators) {
      try {
        await fs.access(path.join(targetDir, item));
        return true;
      } catch {}
    }

    // 3. User home directory
    try {
      const home = os.homedir();
      if (home) {
        try {
          await fs.access(path.join(home, '.cursor'));
          return true;
        } catch {}
        try {
          await fs.access(path.join(home, '.cursorrules'));
          return true;
        } catch {}
      }
    } catch {}

    // 4. macOS Application bundle detection
    if (process.platform === 'darwin') {
      const macApps = [
        '/Applications/Cursor.app',
        path.join(os.homedir() || '', 'Applications', 'Cursor.app')
      ];
      for (const appPath of macApps) {
        try {
          await fs.access(appPath);
          return true;
        } catch {}
      }
    }

    // 5. Binary CLI in PATH (cursor, cursor-cli, cursor-agent)
    const binaries = ['cursor', 'cursor-cli', 'cursor-agent'];
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
