/**
 * PIXEL CREW — /craft Command
 * 
 * Full shape-then-build multi-agent sprint pipeline from brief to verified codebase.
 */

import { PixelCommand } from './command.interface.js';

export class CraftCommand extends PixelCommand {
  constructor() {
    super({
      name: 'craft',
      aliases: ['sprint', 'ship'],
      description: 'Full shape-then-build multi-agent sprint pipeline with visual iteration',
      usage: '/craft <prompt> [--target <nextjs|vanilla>] [--out <dir>]',
      category: 'creation'
    });
  }

  async execute(context, args = []) {
    const prompt = args.filter(a => !a.startsWith('-')).join(' ');
    if (!prompt) {
      return {
        success: false,
        message: 'Please provide a prompt for /craft. Example: /craft Build modern SaaS analytics platform',
        output: '\x1b[31mError: Please provide a prompt for /craft.\x1b[0m\nExample: /craft Build an AI engineering studio with Next.js'
      };
    }

    const options = {
      targetFramework: 'nextjs',
      ...context.options
    };

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--target' && args[i + 1]) options.targetFramework = args[++i];
      else if (args[i] === '--out' && args[i + 1]) options.outputDir = args[++i];
    }

    if (context.engine?.submitOneShotTask) {
      const result = await context.engine.submitOneShotTask(prompt, options);
      return {
        success: true,
        message: `Swarm craft pipeline completed for: "${prompt}"`,
        data: result,
        output: result?.outputDir ? `\x1b[32m✓ Swarm crafted project at:\x1b[0m \x1b[36m${result.outputDir}\x1b[0m` : 'Craft pipeline completed successfully.'
      };
    }

    return {
      success: true,
      message: `Dispatched /craft sprint: "${prompt}"`,
      data: { prompt, options },
      output: `\x1b[32m✓ Swarm sprint initiated for:\x1b[0m "${prompt}"`
    };
  }
}
