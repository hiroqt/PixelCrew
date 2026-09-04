/**
 * PIXEL CREW — Kiro Workflows & Prompts Generator
 * 
 * Generates individual .kiro/workflows/*.md, .kiro/prompts/*.md, and .kirorules
 * files so that every PixelCrew slash command (/recap, /assemble, /blueprint, /render, etc.)
 * is natively recognized in the Kiro chat box autocomplete and prompt menu.
 */

import path from 'node:path';
import { FLOOR42_COMMANDS } from './commands-catalog.js';

export const KIRO_COMMANDS = FLOOR42_COMMANDS;

/**
 * Generates all Kiro workflow, prompt, and rule files
 */
export function generateKiroFiles(targetDir, isGlobal = false) {
  const baseDir = isGlobal ? targetDir : path.join(targetDir, '.kiro');
  const files = [];

  // 1. Workflows (.kiro/workflows/*.md)
  for (const cmd of KIRO_COMMANDS) {
    const workflowPath = path.join(baseDir, 'workflows', `${cmd.name}.md`);
    const workflowContent = `---
name: ${cmd.name}
description: ${cmd.description}
---

# /${cmd.name} — PixelCrew Command

${cmd.prompt}
`;
    files.push({ path: workflowPath, content: workflowContent });
  }

  // 2. Prompts (.kiro/prompts/*.md)
  for (const cmd of KIRO_COMMANDS) {
    const promptPath = path.join(baseDir, 'prompts', `${cmd.name}.md`);
    const promptContent = `---
name: ${cmd.name}
description: ${cmd.description}
---

${cmd.prompt}
`;
    files.push({ path: promptPath, content: promptContent });
  }

  // 3. Rules (.kirorules and .kiro/rules/pixelcrew.md)
  const rulesContent = `# 🏢 PixelCrew Swarm Rules for Kiro

You are integrated with PixelCrew, an autonomous multi-agent engineering swarm (Floor 42, Pixel Corps HQ).

## ⚡ Slash Commands in Kiro Chat:
${KIRO_COMMANDS.map(c => `- **\`/${c.name}\`**: ${c.description}`).join('\n')}

## 🛡️ Anti-AI Slop Directive:
- Enforce intentional asymmetry, mathematical fluid \`clamp()\` typography, and high-contrast surface tiers.
- Reject generic AI purple/cyan glowing blobs on flat black.
- Reject cliché copy (*"Elevate your workflow"*, *"Seamlessly innovate"*) and uniform 3-card grids.
`;

  if (!isGlobal) {
    files.push({ path: path.join(targetDir, '.kirorules'), content: rulesContent });
    files.push({ path: path.join(baseDir, 'rules', 'pixelcrew.md'), content: rulesContent });
  }

  return files;
}
