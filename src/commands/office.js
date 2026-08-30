/**
 * PIXEL CREW — /office Command
 * 
 * Boots Floor 42 real-time startup office visual dashboard and opens live site preview.
 */

import { PixelCommand } from './command.interface.js';
import { LiveCommand } from './live.js';

export class OfficeCommand extends PixelCommand {
  constructor() {
    super({
      name: 'office',
      aliases: ['live', 'dashboard', 'preview', 'startup-office'],
      description: 'Floor 42 Office: Launch retro startup office dashboard (port 4747) and live site preview',
      usage: '/office [--port <number>]',
      category: 'orchestration'
    });
    this.liveCmd = new LiveCommand();
  }

  async execute(context, args = []) {
    return await this.liveCmd.execute(context, args);
  }
}
