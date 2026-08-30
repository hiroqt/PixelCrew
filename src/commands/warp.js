/**
 * PIXEL CREW — /warp Command
 * 
 * Full-stack performance speedrun: streaming SSR, bundle minification, and AST prompt caching.
 */

import { PixelCommand } from './command.interface.js';
import { OptimizeCommand } from './optimize.js';

export class WarpCommand extends PixelCommand {
  constructor() {
    super({
      name: 'warp',
      aliases: ['optimize', 'perf', 'speed', 'turbo'],
      description: 'Floor 42 Warp Speed: Streaming SSR, bundle minification, and AST token caching',
      usage: '/warp',
      category: 'performance'
    });
    this.optimizeCmd = new OptimizeCommand();
  }

  async execute(context, args = []) {
    return await this.optimizeCmd.execute(context, args);
  }
}
