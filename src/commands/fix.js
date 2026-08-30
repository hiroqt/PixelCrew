/**
 * PIXEL CREW — /fix Command
 * 
 * Generates targeted repair and remediation tasks for detected issues.
 */

import { PixelCommand } from './command.interface.js';

export class FixCommand extends PixelCommand {
  constructor() {
    super({
      name: 'fix',
      aliases: ['repair', 'patch'],
      description: 'Create targeted repair tasks for detected problems or bugs',
      usage: '/fix <issue description>',
      category: 'execution'
    });
  }

  async execute(context, args) {
    const issue = args.join(' ');
    if (!issue) {
      return {
        success: false,
        message: 'Please specify the issue to fix. Example: /fix Fix mobile responsive overflow on project grid'
      };
    }

    const taskPrompt = `Fix and remediate issue: ${issue}`;
    if (context.engine?.submitTask) {
      const result = await context.engine.submitTask(taskPrompt, context.options || {});
      return {
        success: true,
        message: `Fix task dispatched for: "${issue}"`,
        data: result,
        output: `Remediation sprint triggered for: "${issue}"`
      };
    }

    return {
      success: true,
      message: `Fix task created: "${issue}"`,
      data: { issue }
    };
  }
}
