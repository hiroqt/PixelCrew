/**
 * PIXEL CREW — /sync Command
 * 
 * Synchronizes all workspace skills across detected agent environments (.claude, .cursor, .kiro, .agents).
 */

import { PixelCommand } from './command.interface.js';
import { syncSkills } from '../scaffold/installer.js';
import { DryRunReporter } from '../utils/fs-safe.js';

export class SyncCommand extends PixelCommand {
  constructor() {
    super({
      name: 'sync',
      aliases: ['sync-skills', 're-sync'],
      description: 'Synchronize skills across all detected IDE agent folders',
      usage: '/sync [--dry-run] [--provider <name>]',
      category: 'scaffold'
    });
  }

  async execute(context = {}, args = []) {
    const options = context.options || {};
    const dryRun = args.includes('--dry-run') || Boolean(options.dryRun);
    const providerArgIdx = args.findIndex(a => a === '--provider' || a === '-p');
    const provider = providerArgIdx !== -1 && args[providerArgIdx + 1] ? args[providerArgIdx + 1] : (options.provider || null);

    const targetDir = context.targetDir || process.cwd();
    const reporter = new DryRunReporter(targetDir);

    const result = await syncSkills(targetDir, {
      dryRun,
      provider,
      reporter
    });

    if (dryRun) {
      return {
        success: true,
        message: 'Dry-run preview for skill synchronization',
        data: result,
        output: reporter.formatOutput()
      };
    }

    const lines = [
      `\x1b[32m\x1b[1m✓ Synchronized ${result.skillsSynced.length} skills across workspace:\x1b[0m`,
      `  \x1b[90mSkills:\x1b[0m ${result.skillsSynced.join(', ')}`
    ];

    return {
      success: true,
      message: `Successfully synchronized ${result.skillsSynced.length} skills`,
      data: result,
      output: lines.join('\n')
    };
  }
}
