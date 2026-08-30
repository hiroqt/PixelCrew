/**
 * PIXEL CREW — /critique Command
 * 
 * Runs 6-dimension Anti-AI design & UX review (Originality, Hierarchy, Typography, Layout, Brand, Slop Penalty).
 */

import { PixelCommand } from './command.interface.js';
import { ReviewCommand } from './review.js';

export class CritiqueCommand extends PixelCommand {
  constructor() {
    super({
      name: 'critique',
      aliases: ['review-ui', 'design-critique'],
      description: 'Run 6-dimension Anti-AI design review: hierarchy, clarity, typography, and originality',
      usage: '/critique',
      category: 'quality'
    });
    this.reviewCmd = new ReviewCommand();
  }

  async execute(context, args = []) {
    return await this.reviewCmd.execute(context, args);
  }
}
