/**
 * PIXEL CREW — Claude Code Slash Commands & Instructions Generator
 * 
 * Generates .claude/commands/*.md files so that all 24 Floor 42 commands
 * (/assemble, /blueprint, /recap, /render, /sentinel, /warp, /polish, etc.)
 * natively appear in the Anthropic Claude Code CLI slash command picker.
 */

import path from 'node:path';
import { FLOOR42_COMMANDS } from './commands-catalog.js';

/**
 * Generates all Claude Code command and instruction files
 */
export function generateClaudeFiles(targetDir, isGlobal = false) {
  const baseDir = isGlobal ? targetDir : path.join(targetDir, '.claude');
  const files = [];

  // 1. Generate individual command markdown files in .claude/commands/
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

  // 2. Workspace instructions and plugin manifest (for workspace scope)
  if (!isGlobal) {
    const claudeMdContent = `# 🏢 PixelCrew Multi-Agent Swarm Instructions for Claude Code

You are integrated with PixelCrew (Floor 42, Pixel Corps HQ).
Support \`/pixelcrew <command>\` and direct slash commands (\`/assemble\`, \`/blueprint\`, \`/boss-fight\`, \`/render\`, \`/recap\`, \`/sentinel\`, \`/audit\`, \`/warp\`, \`/polish\`, etc.).

## ⚡ Available Slash Commands
${FLOOR42_COMMANDS.map(c => `- **\`/${c.name}\`**: ${c.description}`).join('\n')}

## 🛡️ Anti-AI Guidelines:
- Reject purple/cyan neon blobs, floating fake sparkles, and uniform 3-card grids.
- Apply intentional asymmetry (Bento grids), mathematical fluid clamp() typography, and high-contrast surface tiers.
`;

    const claudePluginContent = JSON.stringify({
      name: 'pixelcrew',
      version: '0.2.4',
      description: 'Autonomous Multi-Agent Engineering Swarm & Retro Pixel-Art Startup Office',
      skills: ['skills/pixelcrew']
    }, null, 2) + '\n';

    files.push({ path: path.join(targetDir, 'CLAUDE.md'), content: claudeMdContent });
    files.push({ path: path.join(targetDir, '.claude-plugin', 'plugin.json'), content: claudePluginContent });
  }

  return files;
}
