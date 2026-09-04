/**
 * PIXEL CREW — /commands & /help Command
 * 
 * Displays the complete Floor 42 multi-agent command suite, aliases, and usage.
 */

import { PixelCommand } from './command.interface.js';
import { FLOOR42_COMMANDS } from '../scaffold/commands-catalog.js';

export class CommandsCommand extends PixelCommand {
  constructor() {
    super({
      name: 'commands',
      aliases: ['slash-commands', 'help', 'menu', 'palette', 'cmds'],
      description: 'Display all available Floor 42 multi-agent slash commands and usage guide',
      usage: '/commands [category]',
      category: 'operations'
    });
  }

  async execute(context = {}, args = []) {
    const filterCategory = args[0]?.toLowerCase();

    const banner = `\x1b[36m
 ╔══════════════════════════════════════════════════════════════════╗
 ║   PIXEL CREW — FLOOR 42 MULTI-AGENT COMMAND SUITE               ║
 ║   Autonomous Retro Tech Startup Office & Engineering Swarm       ║
 ╚══════════════════════════════════════════════════════════════════╝\x1b[0m`;

    const sections = [
      {
        id: 'architecture',
        title: '🚀 FLOOR 42 CREATION & ARCHITECTURE:',
        color: '\x1b[32m'
      },
      {
        id: 'aesthetic',
        title: '🎨 RETRO AESTHETIC & ANTI-AI DIRECTION:',
        color: '\x1b[35m'
      },
      {
        id: 'hardening',
        title: '🛡️ PRODUCTION HARDENING & SRE:',
        color: '\x1b[33m'
      },
      {
        id: 'operations',
        title: '🏢 FLOOR 42 OPERATIONS:',
        color: '\x1b[36m'
      }
    ];

    const lines = [banner, ''];

    for (const sec of sections) {
      if (filterCategory && filterCategory !== sec.id && !sec.id.includes(filterCategory)) {
        continue;
      }

      lines.push(`\x1b[1m${sec.title}\x1b[0m`);
      const cmds = FLOOR42_COMMANDS.filter(c => c.category === sec.id);

      for (const cmd of cmds) {
        const cmdName = `/${cmd.name}`.padEnd(24);
        const aliases = cmd.aliases && cmd.aliases.length > 0 ? ` \x1b[90m(aliases: ${cmd.aliases.map(a => `/${a}`).join(', ')})\x1b[0m` : '';
        lines.push(`  ${sec.color}${cmdName}\x1b[0m ${cmd.description}${aliases}`);
      }
      lines.push('');
    }

    lines.push('\x1b[1mUSAGE IN IDE CHATBOX:\x1b[0m');
    lines.push('  Type any slash command directly in your AI IDE prompt (e.g. \x1b[36m/assemble\x1b[0m, \x1b[36m/blueprint\x1b[0m, \x1b[36m/recap\x1b[0m).');
    lines.push('  Or execute via terminal: \x1b[33mnpx pixelcrew <command> [args]\x1b[0m\n');

    const output = lines.join('\n');

    return {
      success: true,
      message: 'PixelCrew Floor 42 Command Suite',
      output,
      data: { commands: FLOOR42_COMMANDS }
    };
  }
}
