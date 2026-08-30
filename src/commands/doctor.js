/**
 * PIXEL CREW — /doctor Command
 * 
 * Performs comprehensive environment diagnostics, toolchain verification,
 * and coding agent provider availability detection.
 */

import { spawn } from 'node:child_process';
import { PixelCommand } from './command.interface.js';
import { defaultProviderRegistry } from '../adapters/index.js';

export class DoctorCommand extends PixelCommand {
  constructor() {
    super({
      name: 'doctor',
      aliases: ['diagnose', 'env', 'health'],
      description: 'Scan development environment and check coding agent provider availability',
      usage: '/doctor',
      category: 'diagnostics'
    });
  }

  async checkCommand(cmd, args = ['--version']) {
    return new Promise((resolve) => {
      try {
        const proc = spawn(cmd, args, { stdio: 'pipe' });
        let out = '';
        proc.stdout.on('data', (d) => { out += d; });
        proc.on('close', (code) => {
          if (code === 0) resolve({ available: true, version: out.trim().split('\n')[0] });
          else resolve({ available: false, version: null });
        });
        proc.on('error', () => resolve({ available: false, version: null }));
      } catch {
        resolve({ available: false, version: null });
      }
    });
  }

  async execute(context, args) {
    const registry = context.providerRegistry || defaultProviderRegistry;

    // Check basic runtime tools
    const nodeVer = process.version;
    const gitCheck = await this.checkCommand('git');

    // Check agent providers
    const { available, missing } = await registry.scanEnvironment(true);

    const lines = [];
    lines.push('╔══════════════════════════════════════════════════════════════════╗');
    lines.push('║   PIXEL CREW — ENVIRONMENT & PROVIDER DIAGNOSTICS                ║');
    lines.push('╚══════════════════════════════════════════════════════════════════╝');
    lines.push('');
    lines.push('CORE ENVIRONMENT:');
    lines.push(`  Node.js (${nodeVer})`.padEnd(32) + ' ✓ Available');
    lines.push(`  Git (${gitCheck.version || 'installed'})`.padEnd(32) + (gitCheck.available ? ' ✓ Available' : ' ✗ Not detected'));
    lines.push('');
    lines.push('CODING AGENT PROVIDERS:');

    const allAdapters = registry.getAllAdapters();
    for (const adapter of allAdapters) {
      const isAvail = available.some(a => a.id === adapter.id);
      const mark = isAvail ? '✓ Available' : '✗ Not detected';
      const label = `  ${adapter.name} (${adapter.id})`;
      lines.push(label.padEnd(32) + ` ${mark}`);
    }

    lines.push('');
    lines.push('RECOMMENDED RUNTIME STRATEGY:');
    const primary = available.find(a => a.id !== 'generic') || registry.getAdapter('generic');
    lines.push(`  Primary:  ${primary.name} [${primary.id}]`);
    lines.push(`  Fallback: Generic CLI Agent (Local execution)`);

    return {
      success: true,
      message: `Environment check completed: ${available.length} providers available`,
      data: {
        nodeVersion: nodeVer,
        git: gitCheck,
        availableProviders: available.map(a => a.id),
        missingProviders: missing.map(a => a.id),
        recommended: primary.id
      },
      output: lines.join('\n')
    };
  }
}
