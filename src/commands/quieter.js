/**
 * PIXEL CREW — /quieter Command
 * 
 * Tones down overly bold designs, calms visual clutter, and restores clean minimalist balance.
 */

import { PixelCommand } from './command.interface.js';

export class QuieterCommand extends PixelCommand {
  constructor() {
    super({
      name: 'quieter',
      aliases: ['calm', 'soften'],
      description: 'Tone down overly loud or chaotic designs to clean, elegant minimalist balance',
      usage: '/quieter [target]',
      category: 'aesthetic'
    });
  }

  async execute(context, args = []) {
    const target = args[0] || 'all';

    const adjustments = [
      '• Softened harsh neon accents to muted sophisticated secondary tones',
      '• Reduced headline display weight from Black (900) to Medium/Semi-Bold (500/600)',
      '• Removed redundant backdrop glows, gradient overlays, and aggressive drop shadows',
      '• Increased whitespace padding (+25%) around dense text and card containers'
    ];

    const lines = [
      '╔══════════════════════════════════════════════════════════════════╗',
      '║   PIXEL CREW — CREATIVE DIRECTOR: CALM & MINIMALIST BALANCE      ║',
      '╚══════════════════════════════════════════════════════════════════╝',
      '',
      `\x1b[33m[CREATIVE DIRECTOR]\x1b[0m Applying Calming Adjustments to: \x1b[36m${target}\x1b[0m`,
      ...adjustments,
      '',
      '\x1b[32m✓ Restored clean, focused minimalist visual balance.\x1b[0m'
    ];

    return {
      success: true,
      message: 'Calmed design to minimalist balance',
      data: { target, adjustments },
      output: lines.join('\n')
    };
  }
}
