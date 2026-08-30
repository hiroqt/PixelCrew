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
    version: "0.2.4",
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

  console.log('\n\x1b[32m\x1b[1m✨ All provider directories synchronized successfully!\x1b[0m\n');
}


if (process.argv[1] === fileURLToPath(import.meta.url)) {
  syncAllProviders().catch(err => {
    console.error('\x1b[31mSync failed:\x1b[0m', err);
    process.exit(1);
  });
}
