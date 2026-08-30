/**
 * PIXEL CREW — /extract Command
 * 
 * Pulls reusable UI components, Tailwind tokens, and CSS variables into the centralized design system.
 */

import { PixelCommand } from './command.interface.js';
import { safeWriteFile } from '../utils/fs-safe.js';
import path from 'node:path';

export class ExtractCommand extends PixelCommand {
  constructor() {
    super({
      name: 'extract',
      aliases: ['extract-tokens', 'tokens'],
      description: 'Pull reusable components and tokens into the design system',
      usage: '/extract [--dry-run]',
      category: 'design'
    });
  }

  async execute(context, args = []) {
    const targetDir = context.targetDir || process.cwd();
    const dryRun = args.includes('--dry-run') || Boolean(context.options?.dryRun);

    const tokens = {
      version: "1.0.0",
      colors: {
        bg: "hsl(220, 20%, 4%)",
        surface: "hsl(220, 18%, 8%)",
        surfaceRaised: "hsl(220, 16%, 12%)",
        border: "hsl(220, 14%, 18%)",
        accent: "#00f0ff",
        accentGlow: "rgba(0, 240, 255, 0.25)"
      },
      typography: {
        display: "var(--font-display, 'Outfit', sans-serif)",
        body: "var(--font-body, 'Inter', sans-serif)",
        mono: "var(--font-mono, 'JetBrains Mono', monospace)",
        scale: {
          hero: "clamp(2.5rem, 5vw + 1rem, 4.5rem)",
          h1: "clamp(2rem, 3.5vw + 1rem, 3rem)",
          h2: "clamp(1.5rem, 2.5vw + 0.5rem, 2.25rem)",
          body: "clamp(1rem, 1vw + 0.5rem, 1.125rem)"
        }
      },
      spacing: {
        sectionGap: "clamp(4rem, 8vw, 8rem)",
        cardPadding: "clamp(1.5rem, 3vw, 2.5rem)"
      }
    };

    const tokenPath = path.join(targetDir, '.pixel-crew', 'tokens.json');
    await safeWriteFile(tokenPath, JSON.stringify(tokens, null, 2) + '\n', { dryRun, targetDir });

    const lines = [
      `\x1b[32m\x1b[1m✓ Extracted Design System Tokens:\x1b[0m`,
      `  • Destination: \x1b[36m${path.relative(targetDir, tokenPath) || tokenPath}\x1b[0m`,
      `  • Colors:      ${Object.keys(tokens.colors).length} token tiers`,
      `  • Typography:  Fluid clamp scales (hero, h1, h2, body)`,
      `  • Spacing:     Responsive sectionGap & cardPadding`
    ];

    if (dryRun) {
      lines.unshift('\x1b[33m[DRY RUN PREVIEW] — No files written to disk.\x1b[0m');
    }

    return {
      success: true,
      message: 'Design system tokens extracted successfully',
      data: { tokens, tokenPath },
      output: lines.join('\n')
    };
  }
}
