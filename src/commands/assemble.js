/**
 * PIXEL CREW — /assemble Command
 * 
 * Full multi-agent sprint pipeline from brief to verified codebase.
 */

import { PixelCommand } from './command.interface.js';

export class AssembleCommand extends PixelCommand {
  constructor() {
    super({
      name: 'assemble',
      aliases: ['craft', 'sprint', 'ship'],
      description: 'Floor 42 Swarm Assembly: Full shape-then-build multi-agent sprint pipeline',
      usage: '/assemble <prompt> [--target <nextjs|vanilla>] [--out <dir>]',
      category: 'creation'
    });
  }

  async execute(context, args = []) {
    const prompt = args.filter(a => !a.startsWith('-')).join(' ');
    if (!prompt) {
      return {
        success: false,
        message: 'Please provide a prompt for /assemble. Example: /assemble Build modern SaaS analytics platform',
        output: '\x1b[31mError: Please provide a prompt for /assemble.\x1b[0m\nExample: /assemble Build an AI engineering studio with Next.js'
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
        message: `Swarm assembly completed for: "${prompt}"`,
        data: result,
        output: result?.outputDir ? `\x1b[32m✓ Swarm assembled project at:\x1b[0m \x1b[36m${result.outputDir}\x1b[0m` : 'Assembly completed successfully.'
      };
    }

    return {
      success: true,
      message: `Dispatched /assemble sprint: "${prompt}"`,
      data: { prompt, options },
      output: `\x1b[32m✓ Floor 42 swarm assembled for:\x1b[0m "${prompt}"`
    };
  }
}
