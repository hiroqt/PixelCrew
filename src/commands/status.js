/**
 * PIXEL CREW — /status Command
 * 
 * Displays orchestration progress, active sprint metrics, and swarm state.
 */

import { PixelCommand } from './command.interface.js';

export class StatusCommand extends PixelCommand {
  constructor() {
    super({
      name: 'status',
      aliases: ['progress', 'info'],
      description: 'Show orchestration sprint progress and active state',
      usage: '/status',
      category: 'inspection'
    });
  }

  async execute(context, args) {
    const state = context.engine?.getState ? context.engine.getState() : {};
    const config = context.engine?.getConfig ? context.engine.getConfig() : {};

    const isRunning = state?.status === 'RUNNING';
    const statusTag = isRunning ? '● RUNNING' : 'STANDBY';

    const output = [
      `╔══════════════════════════════════════════════════════════════════╗`,
      `║   PIXEL CREW — SWARM ORCHESTRATION STATUS                       ║`,
      `╚══════════════════════════════════════════════════════════════════╝`,
      ``,
      `PROJECT:     ${config?.project || 'my-app'}`,
      `STATUS:      ${statusTag}`,
      `ACTIVE TASK: ${state?.activeTask || 'None'}`,
      `STARTED:     ${state?.startedAt ? new Date(state.startedAt).toLocaleTimeString() : 'N/A'}`,
      `PROGRESS:    ${state?.orchestrator?.progress || 0}%`,
      ``,
      `ORCHESTRATOR EXPRESSION: ${state?.orchestrator?.expression || '◉_◉'}`
    ].join('\n');

    return {
      success: true,
      message: `Swarm is currently in ${state?.status || 'READY'} state`,
      data: { state, config },
      output
    };
  }
}
