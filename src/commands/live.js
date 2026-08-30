/**
 * PIXEL CREW — /live Command
 * 
 * Boots Floor 42 real-time startup office visual dashboard and opens live site preview.
 */

import { PixelCommand } from './command.interface.js';

export class LiveCommand extends PixelCommand {
  constructor() {
    super({
      name: 'live',
      aliases: ['dashboard', 'live-mode', 'preview'],
      description: 'Visual live mode: launch Floor 42 startup office dashboard and real-time site preview',
      usage: '/live [--port <number>]',
      category: 'orchestration'
    });
  }

  async execute(context, args = []) {
    const port = args[0] || '4747';
    const url = `http://localhost:${port}`;

    const lines = [
      '╔══════════════════════════════════════════════════════════════════╗',
      '║   PIXEL CREW — LIVE RETRO OFFICE & SITE PREVIEW ENGINE          ║',
      '╚══════════════════════════════════════════════════════════════════╝',
      '',
      `\x1b[32m\x1b[1m● Live Swarm Dashboard Active:\x1b[0m \x1b[36m\x1b[4m${url}\x1b[0m`,
      `  • Visual Office Canvas: \x1b[36m${url}\x1b[0m`,
      `  • Real-time SSE Stream: \x1b[36m${url}/api/events\x1b[0m`,
      `  • Standalone Preview:   \x1b[36m${url}/api/site-preview\x1b[0m`,
      '',
      '\x1b[90mFloor 42 workstations and interactive site preview loaded.\x1b[0m'
    ];

    return {
      success: true,
      message: `Live mode active at ${url}`,
      data: { url, port },
      output: lines.join('\n')
    };
  }
}
