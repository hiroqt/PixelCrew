/**
 * PIXEL CREW — /render Command
 * 
 * 6-dimension Anti-AI aesthetic review and visual rendering audit.
 */

import { PixelCommand } from './command.interface.js';
import { ReviewCommand } from './review.js';

export class RenderCommand extends PixelCommand {
  constructor() {
    super({
      name: 'render',
      aliases: ['critique', 'review', 'review-ui', 'design-critique'],
      description: 'Floor 42 Render: 6-dimension Anti-AI design & UX audit (Originality, Hierarchy, Bento Flow >= 8.5/10)',
      usage: '/render',
      category: 'quality'
    });

    this.reviewCmd = new ReviewCommand();
  }

  async execute(context, args = []) {
    return await this.reviewCmd.execute(context, args);
  }
}
