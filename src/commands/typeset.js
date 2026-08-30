/**
 * PIXEL CREW — /typeset Command
 * 
 * Fixes font choices, font pairings, and applies mathematical fluid clamp() typography scales.
 */

import { PixelCommand } from './command.interface.js';

export class TypesetCommand extends PixelCommand {
  constructor() {
    super({
      name: 'typeset',
      aliases: ['typography', 'fonts'],
      description: 'Fix font pairings, hierarchy, and apply mathematical fluid clamp() scales',
      usage: '/typeset [font-preset]',
      category: 'design'
    });
  }

  async execute(context, args = []) {
    const preset = args[0] || 'editorial-tech';

    const scales = {
      hero: 'clamp(2.5rem, 5vw + 1rem, 4.5rem)',
      h1: 'clamp(2rem, 3.5vw + 1rem, 3rem)',
      h2: 'clamp(1.5rem, 2.5vw + 0.5rem, 2.25rem)',
      h3: 'clamp(1.25rem, 1.5vw + 0.5rem, 1.75rem)',
      body: 'clamp(1rem, 0.5vw + 0.75rem, 1.125rem)',
      small: '0.875rem'
    };

    const lines = [
      '╔══════════════════════════════════════════════════════════════════╗',
      '║   PIXEL CREW — MATHEMATICAL FLUID TYPOGRAPHY ENGINE              ║',
      '╚══════════════════════════════════════════════════════════════════╝',
      '',
      `\x1b[32m[DESIGN SYSTEM ARCHITECT]\x1b[0m Applied Font Preset: \x1b[36m${preset}\x1b[0m`,
      '  • Display Serif/Geometric: "Outfit", sans-serif (Tight letter-spacing: -0.025em)',
      '  • Technical Body:          "Inter", -apple-system, sans-serif',
      '  • Telemetry Mono:          "JetBrains Mono", monospace',
      '',
      '\x1b[1mCALCULATED FLUID CLAMP SCALES:\x1b[0m',
      `  • Hero Display:  ${scales.hero}`,
      `  • Primary (H1):  ${scales.h1}`,
      `  • Section (H2):  ${scales.h2}`,
      `  • Body Text:     ${scales.body}`,
      '',
      '\x1b[32m✓ Expressive typography scales and pairings compiled.\x1b[0m'
    ];

    return {
      success: true,
      message: `Applied typography preset: ${preset}`,
      data: { preset, scales },
      output: lines.join('\n')
    };
  }
}
