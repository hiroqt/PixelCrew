/**
 * PIXEL CREW — /document Command
 * 
 * Generates or updates root DESIGN.md and PRODUCT.md from active codebase context.
 */

import { PixelCommand } from './command.interface.js';
import { analyzeCodebase } from '../scaffold/analyzer.js';
import { safeWriteFile } from '../utils/fs-safe.js';
import path from 'node:path';

export class DocumentCommand extends PixelCommand {
  constructor() {
    super({
      name: 'document',
      aliases: ['doc', 'gen-docs'],
      description: 'Generate root DESIGN.md and PRODUCT.md from existing project code',
      usage: '/document [--dry-run]',
      category: 'documentation'
    });
  }

  async execute(context, args = []) {
    const targetDir = context.targetDir || process.cwd();
    const dryRun = args.includes('--dry-run') || Boolean(context.options?.dryRun);

    const profile = await analyzeCodebase(targetDir);

    const designMd = `# Design System Specification (${profile.projectName})

## 🎨 Visual Identity & Archetype
- **Frameworks**: ${profile.frameworks.join(', ') || 'Standard Web'}
- **Languages**: ${profile.languages.join(', ') || 'JavaScript / TypeScript'}
- **Styling Architecture**: ${profile.styling.join(', ') || 'Tailwind CSS / Custom CSS Tokens'}

## 📐 Layout & Asymmetry Rules
- Intentional whitespace and Bento grid topologies.
- Fluid clamp typography scales matching 360px mobile to 4K display.
- Strict rejection of generic AI templates (no purple gradient blobs, no repeating uniform 3-card rows).

## 🛡️ Anti-AI Constraints
- WCAG 2.1 AA/AAA compliance on all text contrasts.
- Zero placeholder copy (*"Lorem ipsum", "Supercharge your workflow"*).
`;

    const productMd = `# Product Architecture Specification (${profile.projectName})

## 🚀 Product Scope
- **Backend & APIs**: ${profile.backend.join(', ') || 'Node.js Route Handlers'}
- **Database & Data Modeling**: ${profile.database.join(', ') || 'SQL / Relational Schema'}
- **Testing & QA**: ${profile.testing.join(', ') || 'Vitest / Playwright'}
- **Authentication & Security**: ${profile.auth.join(', ') || 'Session / Token-based'}

## 🗺️ Engineering Pillars
1. **Design-First Synthesis**: Creative Direction decouples visual personality before code generation.
2. **Context-Aware Adaptation**: Permissions and skills are tailored specifically to detected dependencies.
3. **Observability**: Live telemetry streaming via Floor 42 dashboard.
`;

    const designPath = path.join(targetDir, 'DESIGN.md');
    const productPath = path.join(targetDir, 'PRODUCT.md');

    await safeWriteFile(designPath, designMd, { dryRun, targetDir });
    await safeWriteFile(productPath, productMd, { dryRun, targetDir });

    const lines = [
      `\x1b[32m\x1b[1m✓ Generated Project Architecture Documentation:\x1b[0m`,
      `  • \x1b[36m${path.relative(targetDir, designPath) || 'DESIGN.md'}\x1b[0m`,
      `  • \x1b[36m${path.relative(targetDir, productPath) || 'PRODUCT.md'}\x1b[0m`
    ];

    if (dryRun) {
      lines.unshift('\x1b[33m[DRY RUN PREVIEW] — No files written to disk.\x1b[0m');
    }

    return {
      success: true,
      message: 'Generated DESIGN.md and PRODUCT.md specifications',
      data: { designPath, productPath, profile },
      output: lines.join('\n')
    };
  }
}
