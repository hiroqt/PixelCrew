/**
 * PIXEL CREW — /de-slop Command
 * 
 * Strips AI cliché marketing copy and injects grounded, authentic product value propositions.
 */

import { PixelCommand } from './command.interface.js';
import { ClarifyCommand } from './clarify.js';

export class DeSlopCommand extends PixelCommand {
  constructor() {
    super({
      name: 'de-slop',
      aliases: ['deslop', 'clarify', 'clean-copy', 'copy'],
      description: 'Floor 42 De-Slop: Strip AI marketing clichés with grounded technical value propositions',
      usage: '/de-slop [section]',
      category: 'content'
    });
    this.clarifyCmd = new ClarifyCommand();
  }

  async execute(context, args = []) {
    return await this.clarifyCmd.execute(context, args);
  }
}
