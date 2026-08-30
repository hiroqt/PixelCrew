/**
 * PIXEL CREW — /oneshot Command
 * 
 * Synthesizes a complete, production-grade, anti-AI website and project from prompt.
 */

import { PixelCommand } from './command.interface.js';

export class OneShotCommand extends PixelCommand {
  constructor() {
    super({
      name: 'oneshot',
      aliases: ['generate', 'create'],
      description: 'Build a complete website from a prompt with multi-agent synthesis',
      usage: '/oneshot <prompt> [--target <nextjs|vanilla>] [--out <dir>]',
      category: 'creation'
    });
  }

  async execute(context, args) {
    const prompt = args.filter(a => !a.startsWith('--')).join(' ');
    if (!prompt) {
      return {
        success: false,
        message: 'Please provide a prompt for /oneshot. Example: /oneshot Build modern portfolio for an AI engineer'
      };
    }

    const options = {
      targetFramework: 'nextjs',
      outputDir: null,
      ...context.options
    };

    // Check args for flags
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--target' && args[i + 1]) {
        options.targetFramework = args[++i];
      } else if (args[i] === '--out' && args[i + 1]) {
        options.outputDir = args[++i];
      }
    }

    if (context.engine?.submitOneShotTask) {
      const result = await context.engine.submitOneShotTask(prompt, options);
      return {
        success: true,
        message: `OneShot generation completed for: "${prompt}"`,
        data: result,
        output: result?.outputDir ? `Generated site at: ${result.outputDir}` : 'Site generated successfully.'
      };
    }

    return {
      success: true,
      message: `Dispatched /oneshot: "${prompt}"`,
      data: { prompt, options }
    };
  }
}
