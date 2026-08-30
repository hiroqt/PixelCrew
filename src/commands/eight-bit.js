/**
 * PIXEL CREW — /8bit Command
 * 
 * Injects retro arcade delight: procedural 8-bit Web Audio feedback chimes, phosphor CRT scanlines, and tactile micro-interactions.
 */

import { PixelCommand } from './command.interface.js';
import { DelightCommand } from './delight.js';

export class EightBitCommand extends PixelCommand {
  constructor() {
    super({
      name: '8bit',
      aliases: ['delight', 'retro', 'joy', 'sfx'],
      description: 'Floor 42 8-Bit: Injects retro arcade Web Audio chimes, CRT scanlines, and tactile ergonomics',
      usage: '/8bit',
      category: 'delight'
    });
    this.delightCmd = new DelightCommand();
  }

  async execute(context, args = []) {
    return await this.delightCmd.execute(context, args);
  }
}
