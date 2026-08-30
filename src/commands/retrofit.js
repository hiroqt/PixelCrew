/**
 * PIXEL CREW — /retrofit Command
 * 
 * Retrofit design system: pulls existing project styles, Tailwind tokens, and CSS variables into .pixel-crew/tokens.json.
 */

import { PixelCommand } from './command.interface.js';
import { ExtractCommand } from './extract.js';

export class RetrofitCommand extends PixelCommand {
  constructor() {
    super({
      name: 'retrofit',
      aliases: ['extract', 'extract-tokens', 'tokens'],
      description: 'Floor 42 Retrofit: Harvest reusable UI components and tokens into centralized design system',
      usage: '/retrofit [--dry-run]',
      category: 'design'
    });
    this.extractCmd = new ExtractCommand();
  }

  async execute(context, args = []) {
    return await this.extractCmd.execute(context, args);
  }
}
