/**
 * PIXEL CREW — Multi-IDE Default Scaffolding Integration Tests
 * 
 * Verifies that running `initializeProject()` (equivalent to `npx pixelcrew init`)
 * in a clean project directory generates full, first-class support for all major IDEs:
 * - Kiro AI (.kiro/workflows/*.md, .kiro/prompts/*.md, .kiro/rules/, .kirorules, .kiro/skills/)
 * - Cursor AI (.cursorrules, .cursor/rules/pixelcrew.mdc, .cursor/skills/)
 * - Google Antigravity (.agents/skills/, .agents/rules/, AGENTS.md, GEMINI.md)
 * - Claude Code (.claude/skills/, CLAUDE.md, .claude-plugin/plugin.json)
 * - Pixel Crew (.pixel-crew/config.json, context.json, state.json, events.jsonl, pixel.json)
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { initializeProject } from '../src/scaffold/init.js';
import { createTestWorkspace, cleanupTestWorkspace } from './helpers/fixture-runner.js';

test('initializeProject generates complete multi-IDE integration files by default', async () => {
  const tmpDir = await createTestWorkspace('multi-ide-init-test');

  try {
    const result = await initializeProject(tmpDir, {
      name: 'multi-ide-app',
      yes: true,
      dryRun: false
    });

    assert.ok(result.pixelCrewDir);

    // 1. Pixel Crew Primary Configuration
    const configRaw = await fs.readFile(path.join(tmpDir, '.pixel-crew', 'config.json'), 'utf-8');
    assert.ok(configRaw.includes('multi-ide-app'));
    const manifestRaw = await fs.readFile(path.join(tmpDir, '.pixel-crew', 'pixel.json'), 'utf-8');
    assert.ok(manifestRaw.includes('0.2.4'));

    // 2. Kiro AI Integration
    const kiroWorkflow = await fs.readFile(path.join(tmpDir, '.kiro', 'workflows', 'assemble.md'), 'utf-8');
    assert.ok(kiroWorkflow.includes('name: assemble'));
    assert.ok(kiroWorkflow.includes('/assemble — PixelCrew Command'));

    const kiroPrompt = await fs.readFile(path.join(tmpDir, '.kiro', 'prompts', 'recap.md'), 'utf-8');
    assert.ok(kiroPrompt.includes('name: recap'));

    const kiroRules = await fs.readFile(path.join(tmpDir, '.kirorules'), 'utf-8');
    assert.ok(kiroRules.includes('PixelCrew Swarm Rules for Kiro'));

    const kiroSkill = await fs.readFile(path.join(tmpDir, '.kiro', 'skills', 'pixelcrew', 'SKILL.md'), 'utf-8');
    assert.ok(kiroSkill.includes('name: pixelcrew'));

    // 3. Cursor AI Integration
    const cursorRules = await fs.readFile(path.join(tmpDir, '.cursorrules'), 'utf-8');
    assert.ok(cursorRules.includes('/pixelcrew assemble'));
    assert.ok(cursorRules.includes('Anti-AI Slop Directive'));

    const cursorMdc = await fs.readFile(path.join(tmpDir, '.cursor', 'rules', 'pixelcrew.mdc'), 'utf-8');
    assert.ok(cursorMdc.includes('description: PixelCrew Autonomous Multi-Agent Engineering Swarm'));
    assert.ok(cursorMdc.includes('alwaysApply: true'));

    const cursorSkill = await fs.readFile(path.join(tmpDir, '.cursor', 'skills', 'pixelcrew', 'SKILL.md'), 'utf-8');
    assert.ok(cursorSkill.includes('name: pixelcrew'));

    // 4. Google Antigravity & Universal Agents Integration
    const agentsMd = await fs.readFile(path.join(tmpDir, 'AGENTS.md'), 'utf-8');
    assert.ok(agentsMd.includes('PixelCrew — Autonomous Multi-Agent Engineering Swarm'));
    assert.ok(agentsMd.includes('/pixelcrew assemble'));

    const geminiMd = await fs.readFile(path.join(tmpDir, 'GEMINI.md'), 'utf-8');
    assert.ok(geminiMd.includes('AGENTS.md'));

    const agentsRule = await fs.readFile(path.join(tmpDir, '.agents', 'rules', 'pixelcrew.md'), 'utf-8');
    assert.ok(agentsRule.includes('PixelCrew Swarm Steering Rules'));

    const agentsSkill = await fs.readFile(path.join(tmpDir, '.agents', 'skills', 'pixelcrew', 'SKILL.md'), 'utf-8');
    assert.ok(agentsSkill.includes('name: pixelcrew'));

    // 5. Claude Code Integration
    const claudeMd = await fs.readFile(path.join(tmpDir, 'CLAUDE.md'), 'utf-8');
    assert.ok(claudeMd.includes('PixelCrew Multi-Agent Swarm Instructions for Claude Code'));

    const claudePlugin = await fs.readFile(path.join(tmpDir, '.claude-plugin', 'plugin.json'), 'utf-8');
    assert.ok(claudePlugin.includes('pixelcrew'));

    const claudeSkill = await fs.readFile(path.join(tmpDir, '.claude', 'skills', 'pixelcrew', 'SKILL.md'), 'utf-8');
    assert.ok(claudeSkill.includes('name: pixelcrew'));

  } finally {
    await cleanupTestWorkspace(tmpDir);
  }
});
