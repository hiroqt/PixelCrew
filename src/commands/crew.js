/**
 * PIXEL CREW — /crew & /agents Command
 * 
 * Manages, inspects, and displays active agent roster, expressions, and statuses.
 */

import { PixelCommand } from './command.interface.js';
import { AGENT_ROLES } from '../protocol/agent.js';

export class CrewCommand extends PixelCommand {
  constructor() {
    super({
      name: 'crew',
      aliases: ['agents', 'roster'],
      description: 'Manage or inspect active swarm agent roster',
      usage: '/crew [spawn <agent> | list]',
      category: 'management'
    });
  }

  async execute(context, args) {
    const sub = (args[0] || 'list').toLowerCase();

    if (sub === 'spawn' && args[1]) {
      const agentKey = args[1];
      const role = AGENT_ROLES[agentKey];
      if (!role) {
        return {
          success: false,
          message: `Unknown agent role: "${agentKey}". Available: ${Object.keys(AGENT_ROLES).join(', ')}`
        };
      }
      return {
        success: true,
        message: `Spawned agent workstation: ${role.name} (${role.title})`,
        data: { agent: role }
      };
    }

    // List roster
    const state = context.engine?.getState ? context.engine.getState() : {};
    const config = context.engine?.getConfig ? context.engine.getConfig() : {};

    const rosterLines = [];
    rosterLines.push('╔══════════════════════════════════════════════════════════════════╗');
    rosterLines.push('║   PIXEL CREW — ACTIVE AGENT ROSTER                               ║');
    rosterLines.push('╚══════════════════════════════════════════════════════════════════╝');

    const agentsList = config?.agents ? Object.entries(config.agents) : Object.entries(AGENT_ROLES);

    for (const [key, meta] of agentsList) {
      const aState = state.agents?.[key] || {};
      const status = aState.state || 'IDLE';
      const expr = aState.expression || '●_●';
      const current = aState.currentTask || meta.role || meta.title || 'Standing by';
      rosterLines.push(`  ${key.padEnd(16)} [${status.padEnd(9)}] ${expr}  ${current}`);
    }

    return {
      success: true,
      message: `Active roster has ${agentsList.length} agent workstations`,
      data: { roster: agentsList },
      output: rosterLines.join('\n')
    };
  }
}
