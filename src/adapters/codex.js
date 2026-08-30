/**
 * PIXEL CREW — Codex Adapter
 * 
 * Execution adapter for OpenAI Codex / CLI environments.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
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

  async detect(targetDir = process.cwd()) {
    // 1. Environment variables
    if (
      process.env.OPENAI_API_KEY ||
      process.env.CODEX_API_KEY ||
      process.env.CODEX ||
      process.env.CODEX_AGENT ||
      process.env.CODEX_SESSION ||
      process.env.CODEX_WORKSPACE ||
      process.env.CODEX_APP_DIR
    ) {
      return true;
    }

    // 2. Workspace indicators (.codex/, .codexrules, codex.json, .codex.json)
    const indicators = ['.codex', '.codexrules', 'codex.json', '.codex.json'];
    for (const item of indicators) {
      try {
        await fs.access(path.join(targetDir, item));
        return true;
      } catch {}
    }

    // 3. User home directory (~/.codex, ~/.openai)
    try {
      const home = os.homedir();
      if (home) {
        try {
          await fs.access(path.join(home, '.codex'));
          return true;
        } catch {}
        try {
          await fs.access(path.join(home, '.openai'));
          return true;
        } catch {}
      }
    } catch {}

    // 4. macOS Application bundle detection
    if (process.platform === 'darwin') {
      const macApps = [
        '/Applications/Codex.app',
        path.join(os.homedir() || '', 'Applications', 'Codex.app')
      ];
      for (const appPath of macApps) {
        try {
          await fs.access(appPath);
          return true;
        } catch {}
      }
    }

    // 5. Binary CLI in PATH (codex, codex-cli, codex-agent, openai)
    const binaries = ['codex', 'codex-cli', 'codex-agent', 'openai'];
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
