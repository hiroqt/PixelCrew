/**
 * PIXEL CREW — /stop & /resume Command
 * 
 * Controls active swarm execution lifecycle (aborting or resuming sprints).
 */

import { PixelCommand } from './command.interface.js';

export class StopCommand extends PixelCommand {
  constructor() {
    super({
      name: 'stop',
      aliases: ['abort', 'cancel', 'halt'],
      description: 'Stop or cancel active multi-agent orchestration sprint',
      usage: '/stop',
      category: 'lifecycle'
    });
  }

  async execute(context, args) {
    if (context.engine?.cancelActiveExecution) {
      context.engine.cancelActiveExecution();
    }
    return {
      success: true,
      message: 'Active orchestration sprint aborted.',
      output: 'Swarm stopped and returned to standby.'
    };
  }
}

export class ResumeCommand extends PixelCommand {
  constructor() {
    super({
      name: 'resume',
      aliases: ['unpause', 'continue'],
      description: 'Resume paused orchestration sprint',
      usage: '/resume',
      category: 'lifecycle'
    });
  }

  async execute(context, args) {
    return {
      success: true,
      message: 'Swarm ready to resume tasks.',
      output: 'Standing by for new sprint tasks.'
    };
  }
}
