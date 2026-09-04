/**
 * PIXEL CREW — Cursor IDE Slash Commands & Rules Generator
 * 
 * Generates .cursor/commands/*.md, .cursor/rules/pixelcrew.mdc, and .cursorrules
 * so that all 24 Floor 42 commands are recognized in Cursor Composer and chat.
 */

import path from 'node:path';
import { FLOOR42_COMMANDS } from './commands-catalog.js';

/**
 * Generates all Cursor IDE command and rule files
 */
export function generateCursorFiles(targetDir, isGlobal = false) {
  const baseDir = isGlobal ? targetDir : path.join(targetDir, '.cursor');
  const files = [];

  // 1. Generate individual command markdown files in .cursor/commands/
  for (const cmd of FLOOR42_COMMANDS) {
    const cmdPath = path.join(baseDir, 'commands', `${cmd.name}.md`);
    const cmdContent = `---
description: ${cmd.description}
---

# /${cmd.name}

${cmd.prompt}
`;
    files.push({ path: cmdPath, content: cmdContent });
  }

  // 2. Cursor MDC Rules
  const cursorMdcContent = `---
description: PixelCrew Autonomous Multi-Agent Engineering Swarm & Anti-AI Design Suite
globs: *
alwaysApply: true
---

# 🏢 PixelCrew — Autonomous Multi-Agent Engineering Swarm (Floor 42)

When the user invokes \`/pixelcrew <command>\`, \`@pixelcrew\`, or direct slash commands (\`/assemble\`, \`/blueprint\`, \`/boss-fight\`, \`/render\`, \`/recap\`, \`/sentinel\`, \`/audit\`, \`/warp\`, \`/polish\`, etc.):

## ⚡ Available Swarm Commands:
${FLOOR42_COMMANDS.map(c => `- \`/${c.name}\`: ${c.description}`).join('\n')}

## 🛡️ Anti-AI Slop Enforcement:
- Enforce intentional asymmetry (Bento grids), fluid clamp() typography, and high-contrast surface tiers.
- Ban generic AI tropes: purple gradient blobs, floating fake sparkles, uniform card repetition, and cliché buzzwords.
`;

  files.push({ path: path.join(baseDir, 'rules', 'pixelcrew.mdc'), content: cursorMdcContent });

  // 3. Workspace .cursorrules
  if (!isGlobal) {
    const cursorRulesContent = `# 🏢 PixelCrew Swarm Rules for Cursor

You are integrated with PixelCrew, an autonomous multi-agent engineering swarm (Floor 42, Pixel Corps HQ).
Support \`/pixelcrew <command>\`, \`@pixelcrew\`, and direct slash commands:

## ⚡ Available Slash Commands:
${FLOOR42_COMMANDS.map(c => `- \`/${c.name}\` — ${c.description}`).join('\n')}

## 🛡️ Anti-AI Slop Directive:
- Never generate purple/cyan glowing mesh gradient blobs on flat black cards.
- Never generate repetitive 3-column identical card grids. Use asymmetric Bento layouts.
- Never use placeholder marketing buzzwords (*"Elevate your workflow"*, *"Seamlessly innovate"*).
- Enforce mathematical fluid \`clamp()\` typography and WCAG AA/AAA contrast ratios.
`;

    files.push({ path: path.join(targetDir, '.cursorrules'), content: cursorRulesContent });
  }

  return files;
}
