/**
 * PIXEL CREW — /chromatic Command
 * 
 * Strategic HSL color token calibration, dark mode elevation surfaces, and glowing neon tiers.
 */

import { PixelCommand } from './command.interface.js';
import { ColorizeCommand } from './colorize.js';

export class ChromaticCommand extends PixelCommand {
  constructor() {
    super({
      name: 'chromatic',
      aliases: ['colorize', 'palette', 'theme', 'neon'],
      description: 'Floor 42 Chromatic: Strategic HSL color palette, dark mode surfaces, and accent tiers',
      usage: '/chromatic [palette-name]',
      category: 'design'
    });
    this.colorizeCmd = new ColorizeCommand();
  }

  async execute(context, args = []) {
    return await this.colorizeCmd.execute(context, args);
  }
}
