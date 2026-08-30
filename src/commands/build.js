/**
 * PIXEL CREW — /build Command
 * 
 * Starts project implementation or synthesis workflow.
 */

import { PixelCommand } from './command.interface.js';

export class BuildCommand extends PixelCommand {
  constructor() {
    super({
      name: 'build',
      aliases: ['compile'],
      description: 'Start implementation and code synthesis',
      usage: '/build [objective]',
      category: 'execution'
    });
  }

  async execute(context, args) {
    const prompt = args.join(' ') || 'Build and synthesize current project features';

    if (context.engine?.submitTask) {
      const result = await context.engine.submitTask(prompt, context.options || {});
      return {
        success: true,
        message: `Build execution finished for: "${prompt}"`,
        data: result,
        output: typeof result === 'string' ? result : 'Build completed.'
      };
    }

    return {
      success: true,
      message: `Build dispatched: "${prompt}"`,
      data: { prompt }
    };
  }
}
