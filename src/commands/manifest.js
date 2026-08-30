/**
 * PIXEL CREW — /manifest Command
 * 
 * Generates or updates root DESIGN.md and PRODUCT.md architecture specifications.
 */

import { PixelCommand } from './command.interface.js';
import { DocumentCommand } from './document.js';

export class ManifestCommand extends PixelCommand {
  constructor() {
    super({
      name: 'manifest',
      aliases: ['document', 'doc', 'gen-docs'],
      description: 'Floor 42 Manifest: Generate root DESIGN.md and PRODUCT.md architecture blueprints',
      usage: '/manifest [--dry-run]',
      category: 'documentation'
    });
    this.docCmd = new DocumentCommand();
  }

  async execute(context, args = []) {
    return await this.docCmd.execute(context, args);
  }
}
