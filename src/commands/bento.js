/**
 * PIXEL CREW — /bento Command
 * 
 * Reorganizes sections into asymmetric Bento grid topologies, fluid gutters, and balanced whitespace.
 */

import { PixelCommand } from './command.interface.js';
import { LayoutCommand } from './layout.js';

export class BentoCommand extends PixelCommand {
  constructor() {
    super({
      name: 'bento',
      aliases: ['layout', 'grid', 'grid-flow'],
      description: 'Floor 42 Bento: Reorganize sections into asymmetric Bento grid topologies',
      usage: '/bento [section]',
      category: 'ux'
    });
    this.layoutCmd = new LayoutCommand();
  }

  async execute(context, args = []) {
    return await this.layoutCmd.execute(context, args);
  }
}
