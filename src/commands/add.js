/**
 * PIXEL CREW — /add Command
 * 
 * Installs skills into target workspace and syncs across agent IDEs (.claude, .cursor, .kiro, .agents).
 */

import { PixelCommand } from './command.interface.js';
import { installSkill } from '../scaffold/installer.js';
import { DryRunReporter } from '../utils/fs-safe.js';

export class AddCommand extends PixelCommand {
  constructor() {
    super({
      name: 'add',
      aliases: ['install', 'add-skill'],
      description: 'Install and configure skills across agent IDEs (.claude, .cursor, .kiro, .agents)',
      usage: '/add <skill-name> [--dry-run] [--provider <name>]',
      category: 'scaffold'
    });
  }

  async execute(context = {}, args = []) {
    const rawSkill = args.find(a => !a.startsWith('-'));
    if (!rawSkill) {
      return {
        success: false,
        message: 'Please provide a skill name or ID to install.',
        output: '\x1b[31mError: Please specify a skill to install.\x1b[0m\nUsage: npx pixel-crew add <skill-name> [--dry-run] [--provider <name>]\nExample: npx pixel-crew add design/ui-design --dry-run'
      };
    }

    const options = context.options || {};
    const dryRun = args.includes('--dry-run') || Boolean(options.dryRun);
    const providerArgIdx = args.findIndex(a => a === '--provider' || a === '-p');
    const provider = providerArgIdx !== -1 && args[providerArgIdx + 1] ? args[providerArgIdx + 1] : (options.provider || null);

    const isGlobal = args.includes('--global') || args.includes('-g') || Boolean(options.global);
    const scopeArgIdx = args.findIndex(a => a === '--scope');
    const scope = scopeArgIdx !== -1 && args[scopeArgIdx + 1] ? args[scopeArgIdx + 1] : (isGlobal ? 'global' : (options.scope || 'project'));

    const targetDir = context.targetDir || process.cwd();
    const reporter = new DryRunReporter(targetDir);

    const result = await installSkill(targetDir, rawSkill, {
      dryRun,
      provider,
      scope,
      reporter
    });

    if (dryRun) {
      return {
        success: true,
        message: `Dry-run preview for skill ${result.skillId}`,
        data: result,
        output: reporter.formatOutput()
      };
    }

    const lines = [
      `\x1b[32m\x1b[1m✓ Installed skill:\x1b[0m \x1b[36m${result.skillId}\x1b[0m (${result.skillName})`,
      `  \x1b[90mTarget Providers:\x1b[0m ${result.providers.join(', ')}`
    ];

    for (const w of result.writtenPaths) {
      lines.push(`  \x1b[32m+\x1b[0m [${w.provider}] ${w.path}`);
    }

    lines.push('\n\x1b[32mSkill successfully synchronized into workspace!\x1b[0m');

    return {
      success: true,
      message: `Successfully installed skill: ${result.skillId}`,
      data: result,
      output: lines.join('\n')
    };
  }
}
