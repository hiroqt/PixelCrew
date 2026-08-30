/**
 * PIXEL CREW — /roster Command
 * 
 * Inspects Floor 42 agent workstations, active task assignments, and state.
 */

import { PixelCommand } from './command.interface.js';
import { CrewCommand } from './crew.js';

export class RosterCommand extends PixelCommand {
  constructor() {
    super({
      name: 'roster',
      aliases: ['crew', 'agents', 'squad'],
      description: 'Floor 42 Roster: Inspect active agent workstations, assigned tasks, and sprite states',
      usage: '/roster [spawn|list]',
      category: 'orchestration'
    });
    this.crewCmd = new CrewCommand();
  }

  async execute(context, args = []) {
    return await this.crewCmd.execute(context, args);
  }
}
