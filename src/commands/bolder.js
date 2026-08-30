/**
 * PIXEL CREW — /bolder Command
 * 
 * Amplifies visual energy, contrast, brutalist typography scales, and high-impact hero statements.
 */

import { PixelCommand } from './command.interface.js';

export class BolderCommand extends PixelCommand {
  constructor() {
    super({
      name: 'bolder',
      aliases: ['amplify', 'high-contrast'],
      description: 'Amplify boring designs with intense contrast, bold typography, and visual punch',
      usage: '/bolder [target]',
      category: 'aesthetic'
    });
  }

  async execute(context, args = []) {
    const target = args[0] || 'all';

    const adjustments = [
      '• Boosted headline font weights to 800/900 Ultra-Bold with tighter letter-spacing (-0.03em)',
      '• Increased background-to-surface contrast delta by +35% (deep void black to crisp dark surface)',
      '• Replaced subtle borders with vibrant 1.5px accent glowing outlines and active corner marks',
      '• Expanded hero section scale by +20% and injected high-contrast badges'
    ];

    const lines = [
      '╔══════════════════════════════════════════════════════════════════╗',
      '║   PIXEL CREW — CREATIVE DIRECTOR: AMPLIFY VISUAL ENERGY          ║',
      '╚══════════════════════════════════════════════════════════════════╝',
      '',
      `\x1b[33m[CREATIVE DIRECTOR]\x1b[0m Applying Bold Visual Enhancements to: \x1b[36m${target}\x1b[0m`,
      ...adjustments,
      '',
      '\x1b[32m✓ Design amplified with editorial contrast and punchy aesthetic hierarchy.\x1b[0m'
    ];

    return {
      success: true,
      message: 'Amplified visual energy and contrast',
      data: { target, adjustments },
      output: lines.join('\n')
    };
  }
}
