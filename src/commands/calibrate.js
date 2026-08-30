/**
 * PIXEL CREW — /calibrate Command
 * 
 * Multi-viewport calibration: ensures flawless layout and ergonomics from 360px mobile up to 4K ultra-wide.
 */

import { PixelCommand } from './command.interface.js';
import { AdaptCommand } from './adapt.js';

export class CalibrateCommand extends PixelCommand {
  constructor() {
    super({
      name: 'calibrate',
      aliases: ['adapt', 'responsive', 'viewports'],
      description: 'Floor 42 Calibrate: Responsive multi-viewport calibration (360px mobile to 4K desktop)',
      usage: '/calibrate [viewport]',
      category: 'quality'
    });
    this.adaptCmd = new AdaptCommand();
  }

  async execute(context, args = []) {
    return await this.adaptCmd.execute(context, args);
  }
}
