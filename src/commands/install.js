/**
 * PIXEL CREW — /install Command
 * 
 * Interactive Floor 42 Workstation Dispatcher & Multi-Agent Installer
 */

import { PixelCommand } from './command.interface.js';
import { promptWorkstationSetup, deployToWorkstations } from '../scaffold/workstations.js';
import { DryRunReporter } from '../utils/fs-safe.js';

export class InstallCommand extends PixelCommand {
  constructor() {
    super({
      name: 'install',
      aliases: ['setup', 'harness', 'workstations'],
      description: 'Interactive Floor 42 Agent Workstation Installer & Cross-IDE Dispatcher',
      usage: '/install [--global] [--dry-run] [--scope <detected|global|all>]',
      category: 'scaffold'
    });
  }

  async execute(context = {}, args = []) {
    const targetDir = context.targetDir || process.cwd();
    const options = context.options || {};
    const dryRun = args.includes('--dry-run') || Boolean(options.dryRun);

    const isGlobal = args.includes('--global') || args.includes('-g') || Boolean(options.global);
    const scopeArgIdx = args.findIndex(a => a === '--scope');
    const scope = scopeArgIdx !== -1 && args[scopeArgIdx + 1] ? args[scopeArgIdx + 1] : (isGlobal ? 'global' : options.scope);

    const reporter = new DryRunReporter(targetDir);

    const deploymentPlan = await promptWorkstationSetup(targetDir, {
      ...options,
      scope,
      dryRun
    });

    const result = await deployToWorkstations(targetDir, deploymentPlan, {
      dryRun,
      reporter
    });

    if (dryRun) {
      return {
        success: true,
        message: 'Dry-run preview for workstation deployment',
        data: result,
        output: reporter.formatOutput()
      };
    }

    const lines = [
      '\n\x1b[32m\x1b[1mPixel Crew Workstations Deployed Successfully!\x1b[0m\n',
      `  \x1b[90mDeployment Strategy:\x1b[0m \x1b[36m${deploymentPlan.plan.toUpperCase()}\x1b[0m`,
      `  \x1b[90mActive Workstations:\x1b[0m ${result.deployedCount} target(s)\n`
    ];

    for (const w of result.workstations) {
      lines.push(`  \x1b[32m✓\x1b[0m [${w.scope.toUpperCase()}] \x1b[1m${w.name}\x1b[0m \x1b[90m->\x1b[0m \x1b[33m${w.displayPath}\x1b[0m`);
    }

    lines.push('\n\x1b[1mReady in Your IDE Chatbox:\x1b[0m');
    lines.push('  • Initialize workspace: type \x1b[36minit\x1b[0m or \x1b[36m/pixelcrew init\x1b[0m');
    lines.push('  • Full-stack sprint:    type \x1b[36m/pixelcrew assemble "Build portfolio with Next.js & Tailwind"\x1b[0m');
    lines.push('  • UX & Architecture:    type \x1b[36m/pixelcrew blueprint "Design SaaS dashboard"\x1b[0m\n');

    return {
      success: true,
      message: `Successfully deployed to ${result.deployedCount} workstations`,
      data: result,
      output: lines.join('\n')
    };
  }
}
