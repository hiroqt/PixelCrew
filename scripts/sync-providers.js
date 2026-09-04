#!/usr/bin/env node

/**
 * PIXEL CREW — Multi-Provider Cross-IDE Skill Synchronizer
 * 
 * Replicates the canonical `skill/` directory across supported AI IDE provider folders:
 * - .agents/skills/pixelcrew/ (Google Antigravity & Universal Agents)
 * - .agent/skills/pixelcrew/ (Gemini Code Assist)
 * - .claude/skills/pixelcrew/ (Anthropic Claude Code)
 * - .claude-plugin/ (Claude Plugin Manifest)
 * - .cursor/skills/pixelcrew/ (Cursor AI)
 * - .gemini/skills/pixelcrew/ (Google Gemini CLI)
 * - .kiro/skills/pixelcrew/ (Kiro AI)
 * - .codex/skills/pixelcrew/ (OpenAI Codex)
 * - .grok/skills/pixelcrew/ (xAI Grok)
 * - .hermes/skills/pixelcrew/ (Hermes Agentic CLI)
 * - .opencode/skills/pixelcrew/ (OpenCode IDE)
 * - .pi/skills/pixelcrew/ (Inflection Pi Agent)
 * - .pixel-crew/skills/ (Pixel Crew Workspace)
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const SOURCE_SKILL_DIR = path.join(ROOT_DIR, 'skill');

export const PROVIDER_TARGETS = [
  path.join(ROOT_DIR, '.agents', 'skills', 'pixelcrew'),
  path.join(ROOT_DIR, '.agent', 'skills', 'pixelcrew'),
  path.join(ROOT_DIR, '.claude', 'skills', 'pixelcrew'),
  path.join(ROOT_DIR, '.cursor', 'skills', 'pixelcrew'),
  path.join(ROOT_DIR, '.gemini', 'skills', 'pixelcrew'),
  path.join(ROOT_DIR, '.kiro', 'skills', 'pixelcrew'),
  path.join(ROOT_DIR, '.codex', 'skills', 'pixelcrew'),
  path.join(ROOT_DIR, '.grok', 'skills', 'pixelcrew'),
  path.join(ROOT_DIR, '.hermes', 'skills', 'pixelcrew'),
  path.join(ROOT_DIR, '.opencode', 'skills', 'pixelcrew'),
  path.join(ROOT_DIR, '.pi', 'skills', 'pixelcrew'),
  path.join(ROOT_DIR, '.pixel-crew', 'skills')
];



/**
 * Recursively copies directory contents
 */
async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

/**
 * Synchronizes skill/ across all provider targets
 */
export async function syncAllProviders() {
  console.log('\x1b[36m🔄 Synchronizing PixelCrew Skill across AI IDE Providers...\x1b[0m\n');

  // Verify source skill directory exists
  try {
    await fs.access(SOURCE_SKILL_DIR);
  } catch {
    console.error(`\x1b[31mError: Source skill directory not found at ${SOURCE_SKILL_DIR}\x1b[0m`);
    process.exit(1);
  }

  // 1. Sync standard skill targets
  for (const target of PROVIDER_TARGETS) {
    await copyDir(SOURCE_SKILL_DIR, target);
    const rel = path.relative(ROOT_DIR, target);
    console.log(`  \x1b[32m✓\x1b[0m Synced -> \x1b[36m${rel}/\x1b[0m`);
  }

  // 2. Setup .claude-plugin manifest
  const claudePluginDir = path.join(ROOT_DIR, '.claude-plugin');
  await fs.mkdir(claudePluginDir, { recursive: true });
  const pluginManifest = {
    name: "pixelcrew",
    version: "0.2.5",
    description: "Autonomous Multi-Agent Engineering Swarm & Retro Pixel-Art Startup Office",
    skills: ["skills/pixelcrew"]
  };
  await fs.writeFile(
    path.join(claudePluginDir, 'plugin.json'),
    JSON.stringify(pluginManifest, null, 2) + '\n',
    'utf-8'
  );
  await copyDir(SOURCE_SKILL_DIR, path.join(claudePluginDir, 'skills', 'pixelcrew'));
  console.log(`  \x1b[32m✓\x1b[0m Synced -> \x1b[36m.claude-plugin/\x1b[0m`);

  // 3. Global Antigravity & User IDE Skills Sync
  const globalGeminiSkills = path.join(os.homedir(), '.gemini', 'config', 'skills');
  const workspaceSkillsDir = path.join(ROOT_DIR, '.agents', 'skills');

  // 4. Generate all Floor 42 command skills in .agents/skills/ for Antigravity AI chat discovery
  const { FLOOR42_COMMANDS } = await import('../src/scaffold/commands-catalog.js');
  for (const cmd of FLOOR42_COMMANDS) {
    if (cmd.name === 'pixelcrew') continue; // Canonical skill synced in step 1
    const skillDir = path.join(workspaceSkillsDir, cmd.name);
    await fs.mkdir(skillDir, { recursive: true });
    const skillContent = `---
name: ${cmd.name}
description: >-
  ${cmd.description}. Triggers Floor 42 command /${cmd.name}.
---

# /${cmd.name} — PixelCrew Command

${cmd.prompt}
`;
    await fs.writeFile(path.join(skillDir, 'SKILL.md'), skillContent, 'utf-8');
  }
  console.log(`  \x1b[32m✓\x1b[0m Generated ${FLOOR42_COMMANDS.length - 1} command skills -> \x1b[36m.agents/skills/\x1b[0m`);

  // 5. Generate Kiro workflows, prompts, and skills in .kiro/ for Kiro AI chat discovery
  const kiroDir = path.join(ROOT_DIR, '.kiro');
  await fs.mkdir(path.join(kiroDir, 'prompts'), { recursive: true });
  await fs.mkdir(path.join(kiroDir, 'workflows'), { recursive: true });
  await fs.mkdir(path.join(kiroDir, 'skills'), { recursive: true });
  for (const cmd of FLOOR42_COMMANDS) {
    await fs.writeFile(
      path.join(kiroDir, 'prompts', `${cmd.name}.md`),
      `---\nname: ${cmd.name}\ndescription: ${cmd.description}\n---\n\n${cmd.prompt}\n`,
      'utf-8'
    );
    await fs.writeFile(
      path.join(kiroDir, 'workflows', `${cmd.name}.md`),
      `---\nname: ${cmd.name}\ndescription: ${cmd.description}\n---\n\n# /${cmd.name} — PixelCrew Command\n\n${cmd.prompt}\n`,
      'utf-8'
    );
    if (cmd.name === 'pixelcrew') continue; // Canonical skill synced in step 1
    const kiroSkillDir = path.join(kiroDir, 'skills', cmd.name);
    await fs.mkdir(kiroSkillDir, { recursive: true });
    await fs.writeFile(
      path.join(kiroSkillDir, 'SKILL.md'),
      `---\nname: ${cmd.name}\ndescription: >-\n  ${cmd.description}. Triggers Floor 42 command /${cmd.name}.\n---\n\n# /${cmd.name} — PixelCrew Command\n\n${cmd.prompt}\n`,
      'utf-8'
    );
  }
  console.log(`  \x1b[32m✓\x1b[0m Generated Kiro prompts, workflows & skills -> \x1b[36m.kiro/\x1b[0m`);

  // 6. Generate Claude Code commands in .claude/commands/
  const claudeCommandsDir = path.join(ROOT_DIR, '.claude', 'commands');
  await fs.mkdir(claudeCommandsDir, { recursive: true });
  for (const cmd of FLOOR42_COMMANDS) {
    await fs.writeFile(
      path.join(claudeCommandsDir, `${cmd.name}.md`),
      `---\ndescription: ${cmd.description}\n---\n\n# /${cmd.name}\n\n${cmd.prompt}\n`,
      'utf-8'
    );
  }
  console.log(`  \x1b[32m✓\x1b[0m Generated Claude Code commands -> \x1b[36m.claude/commands/\x1b[0m`);

  // 7. Generate Cursor commands in .cursor/commands/
  const cursorCommandsDir = path.join(ROOT_DIR, '.cursor', 'commands');
  await fs.mkdir(cursorCommandsDir, { recursive: true });
  for (const cmd of FLOOR42_COMMANDS) {
    await fs.writeFile(
      path.join(cursorCommandsDir, `${cmd.name}.md`),
      `---\ndescription: ${cmd.description}\n---\n\n# /${cmd.name}\n\n${cmd.prompt}\n`,
      'utf-8'
    );
  }
  console.log(`  \x1b[32m✓\x1b[0m Generated Cursor commands -> \x1b[36m.cursor/commands/\x1b[0m`);

  // 8. Generate PixelCrew commands in .pixel-crew/commands/
  const pcCommandsDir = path.join(ROOT_DIR, '.pixel-crew', 'commands');
  await fs.mkdir(pcCommandsDir, { recursive: true });
  for (const cmd of FLOOR42_COMMANDS) {
    await fs.writeFile(
      path.join(pcCommandsDir, `${cmd.name}.md`),
      `---\ndescription: ${cmd.description}\n---\n\n# /${cmd.name}\n\n${cmd.prompt}\n`,
      'utf-8'
    );
  }
  console.log(`  \x1b[32m✓\x1b[0m Generated PixelCrew commands -> \x1b[36m.pixel-crew/commands/\x1b[0m`);

  // 9. Sync Global Antigravity & User IDE Skills
  try {
    const globalExists = await fs.access(globalGeminiSkills).then(() => true).catch(() => false);
    if (globalExists) {
      await copyDir(SOURCE_SKILL_DIR, path.join(globalGeminiSkills, 'pixelcrew'));
      
      const skills = await fs.readdir(workspaceSkillsDir, { withFileTypes: true });
      for (const s of skills) {
        if (s.isDirectory()) {
          const srcSkill = path.join(workspaceSkillsDir, s.name);
          const destSkill = path.join(globalGeminiSkills, s.name);
          await copyDir(srcSkill, destSkill);
        }
      }
      console.log(`  \x1b[32m✓\x1b[0m Synced all Floor 42 command skills -> \x1b[36m~/.gemini/config/skills/\x1b[0m`);
    }
  } catch {}

  console.log('\n\x1b[32m\x1b[1m✨ All provider directories synchronized successfully!\x1b[0m\n');
}


if (process.argv[1] === fileURLToPath(import.meta.url)) {
  syncAllProviders().catch(err => {
    console.error('\x1b[31mSync failed:\x1b[0m', err);
    process.exit(1);
  });
}
