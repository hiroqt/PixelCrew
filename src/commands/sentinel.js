/**
 * PIXEL CREW — /sentinel Command
 * 
 * Defensive security hardening: OWASP compliance, SQL sanitization, RFC 7807 envelopes, and rate limits.
 */

import { PixelCommand } from './command.interface.js';
import { HardenCommand } from './harden.js';

export class SentinelCommand extends PixelCommand {
  constructor() {
    super({
      name: 'sentinel',
      aliases: ['harden', 'secure', 'defense'],
      description: 'Floor 42 Sentinel: Security defense, OWASP audit, RFC 7807 envelopes, and rate limiting',
      usage: '/sentinel',
      category: 'engineering'
    });
    this.hardenCmd = new HardenCommand();
  }

  async execute(context, args = []) {
    return await this.hardenCmd.execute(context, args);
  }
}
