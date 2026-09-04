/**
 * PIXEL CREW — End-to-End Slash Commands Discovery & Cross-IDE Installation Test Suite
 * 
 * Verifies that slash commands (/assemble, /blueprint, /recap, /render, /sentinel, /warp, /polish, etc.)
 * are fully generated, discoverable, and executable across all modern AI IDE platforms:
 * 1. Claude Code (.claude/commands/*.md & ~/.claude/commands/*.md)
 * 2. Cursor IDE (.cursor/commands/*.md, .cursor/rules/pixelcrew.mdc, .cursorrules)
 * 3. Kiro AI (.kiro/workflows/*.md, .kiro/prompts/*.md, .kirorules)
 * 4. Google Antigravity (.agents/rules/pixelcrew.md, AGENTS.md, GEMINI.md)
 * 5. Pixel Crew Universal Workspace (.pixel-crew/commands/*.md)
 * 6. CLI Command Dispatcher (/commands, /help, /, /assemble, /blueprint)
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { initializeProject } from '../src/scaffold/init.js';
import { defaultCommandRegistry } from '../src/commands/index.js';
import { FLOOR42_COMMANDS } from '../src/scaffold/commands-catalog.js';
import { deployToWorkstations } from '../src/scaffold/workstations.js';
import { createTestWorkspace, cleanupTestWorkspace } from './helpers/fixture-runner.js';

test('E2E: Greenfield initialization on a new device generates slash commands for all major IDEs', async () => {
  const tmpDir = await createTestWorkspace('e2e-new-device-init');

  try {
    // Simulate user running `npx pixelcrew init --yes` on a fresh machine with no ambient IDE vars
    const result = await initializeProject(tmpDir, {
      name: 'new-device-app',
      yes: true,
      dryRun: false
    });

    assert.ok(result.pixelCrewDir);

    // 1. Verify Universal PixelCrew commands (.pixel-crew/commands/)
    for (const cmd of FLOOR42_COMMANDS) {
      const p = path.join(tmpDir, '.pixel-crew', 'commands', `${cmd.name}.md`);
      const exists = await fs.stat(p).then(s => s.isFile()).catch(() => false);
      assert.ok(exists, `Expected .pixel-crew/commands/${cmd.name}.md to exist`);
    }

    // 2. Verify Claude Code Slash Commands (.claude/commands/)
    for (const cmd of FLOOR42_COMMANDS) {
      const p = path.join(tmpDir, '.claude', 'commands', `${cmd.name}.md`);
      const exists = await fs.stat(p).then(s => s.isFile()).catch(() => false);
      assert.ok(exists, `Expected Claude Code command .claude/commands/${cmd.name}.md to exist`);

      const content = await fs.readFile(p, 'utf-8');
      assert.ok(content.startsWith('---'), `Expected YAML frontmatter in ${cmd.name}.md`);
      assert.ok(content.includes(`description: ${cmd.description}`), `Expected description in ${cmd.name}.md`);
    }

    // Verify CLAUDE.md and .claude-plugin
    const claudeMd = await fs.readFile(path.join(tmpDir, 'CLAUDE.md'), 'utf-8');
    assert.ok(claudeMd.includes('Available Slash Commands'));
    assert.ok(claudeMd.includes('/assemble'));
    assert.ok(claudeMd.includes('/blueprint'));

    // 3. Verify Cursor IDE Slash Commands & Rules (.cursor/commands/ & .cursor/rules/)
    for (const cmd of FLOOR42_COMMANDS) {
      const p = path.join(tmpDir, '.cursor', 'commands', `${cmd.name}.md`);
      const exists = await fs.stat(p).then(s => s.isFile()).catch(() => false);
      assert.ok(exists, `Expected Cursor command .cursor/commands/${cmd.name}.md to exist`);
    }

    const cursorMdc = await fs.readFile(path.join(tmpDir, '.cursor', 'rules', 'pixelcrew.mdc'), 'utf-8');
    assert.ok(cursorMdc.includes('alwaysApply: true'));
    assert.ok(cursorMdc.includes('/assemble'));

    const cursorrules = await fs.readFile(path.join(tmpDir, '.cursorrules'), 'utf-8');
    assert.ok(cursorrules.includes('PixelCrew Swarm Rules for Cursor'));

    // 4. Verify Kiro Workflows, Prompts & Skills (.kiro/workflows/, .kiro/prompts/, .kiro/skills/)
    for (const cmd of FLOOR42_COMMANDS) {
      const wf = path.join(tmpDir, '.kiro', 'workflows', `${cmd.name}.md`);
      const prompt = path.join(tmpDir, '.kiro', 'prompts', `${cmd.name}.md`);
      const kiroSkill = path.join(tmpDir, '.kiro', 'skills', cmd.name, 'SKILL.md');
      assert.ok(await fs.stat(wf).then(s => s.isFile()).catch(() => false), `Expected Kiro workflow ${cmd.name}.md`);
      assert.ok(await fs.stat(prompt).then(s => s.isFile()).catch(() => false), `Expected Kiro prompt ${cmd.name}.md`);
      assert.ok(await fs.stat(kiroSkill).then(s => s.isFile()).catch(() => false), `Expected Kiro skill ${cmd.name}/SKILL.md`);
    }

    // 5. Verify Antigravity Instructions, Rules & Individual Command Skills (.agents/skills/<cmd>/SKILL.md)
    for (const cmd of FLOOR42_COMMANDS) {
      const agySkill = path.join(tmpDir, '.agents', 'skills', cmd.name, 'SKILL.md');
      assert.ok(await fs.stat(agySkill).then(s => s.isFile()).catch(() => false), `Expected Antigravity skill .agents/skills/${cmd.name}/SKILL.md`);
      const content = await fs.readFile(agySkill, 'utf-8');
      assert.ok(content.includes(`name: ${cmd.name}`));
    }

    const agentsMd = await fs.readFile(path.join(tmpDir, 'AGENTS.md'), 'utf-8');
    assert.ok(agentsMd.includes('Available Slash Commands & Instructions'));
    assert.ok(agentsMd.includes('/assemble'));

    const geminiMd = await fs.readFile(path.join(tmpDir, 'GEMINI.md'), 'utf-8');
    assert.ok(geminiMd.includes('PixelCrew Swarm Instructions'));

    const agentsRule = await fs.readFile(path.join(tmpDir, '.agents', 'rules', 'pixelcrew.md'), 'utf-8');
    assert.ok(agentsRule.includes('PixelCrew Swarm Steering Rules'));

  } finally {
    await cleanupTestWorkspace(tmpDir);
  }
});

test('E2E: Claude Code command files contain valid arguments placeholder and instructions', async () => {
  const tmpDir = await createTestWorkspace('e2e-claude-check');

  try {
    await initializeProject(tmpDir, {
      yes: true,
      provider: 'claude-code',
      dryRun: false
    });

    // Check /assemble command
    const assembleContent = await fs.readFile(path.join(tmpDir, '.claude', 'commands', 'assemble.md'), 'utf-8');
    assert.ok(assembleContent.includes('description: Full shape-then-build'));
    assert.ok(assembleContent.includes('$ARGUMENTS'));
    assert.ok(assembleContent.includes('UX Planner'));
    assert.ok(assembleContent.includes('Design System Architect'));
    assert.ok(assembleContent.includes('Frontend & Backend Engineers'));
    assert.ok(assembleContent.includes('QA Engineer'));

    // Check /render command
    const renderContent = await fs.readFile(path.join(tmpDir, '.claude', 'commands', 'render.md'), 'utf-8');
    assert.ok(renderContent.includes('Anti-AI design & UX review'));
    assert.ok(renderContent.includes('64-pattern Anti-AI Slop Checklist'));

    // Check /recap command
    const recapContent = await fs.readFile(path.join(tmpDir, '.claude', 'commands', 'recap.md'), 'utf-8');
    assert.ok(recapContent.includes('token-optimized session recap'));

  } finally {
    await cleanupTestWorkspace(tmpDir);
  }
});

test('E2E: Clean CLI mode with --provider none produces zero external IDE pollution', async () => {
  const tmpDir = await createTestWorkspace('e2e-clean-cli');

  try {
    await initializeProject(tmpDir, {
      yes: true,
      provider: 'none',
      dryRun: false
    });

    // Core universal commands exist
    assert.ok(await fs.stat(path.join(tmpDir, '.pixel-crew', 'commands', 'assemble.md')).then(s => s.isFile()));

    // Zero IDE folders
    assert.equal(await fs.stat(path.join(tmpDir, '.claude')).catch(() => false), false);
    assert.equal(await fs.stat(path.join(tmpDir, '.cursor')).catch(() => false), false);
    assert.equal(await fs.stat(path.join(tmpDir, '.kiro')).catch(() => false), false);
    assert.equal(await fs.stat(path.join(tmpDir, '.agents')).catch(() => false), false);
    assert.equal(await fs.stat(path.join(tmpDir, 'CLAUDE.md')).catch(() => false), false);
    assert.equal(await fs.stat(path.join(tmpDir, 'AGENTS.md')).catch(() => false), false);
    assert.equal(await fs.stat(path.join(tmpDir, '.cursorrules')).catch(() => false), false);
    assert.equal(await fs.stat(path.join(tmpDir, '.kirorules')).catch(() => false), false);

  } finally {
    await cleanupTestWorkspace(tmpDir);
  }
});

test('E2E: Global workstation deployment generates command files across all targeted environments', async () => {
  const tmpDir = await createTestWorkspace('e2e-global-workstations');
  const mockHome = path.join(tmpDir, 'mock-home');
  await fs.mkdir(mockHome, { recursive: true });

  try {
    const deploymentPlan = {
      plan: 'all',
      workstations: [
        { id: 'claude-code', name: 'Claude Code', scope: 'global', displayPath: '~/.claude' },
        { id: 'cursor', name: 'Cursor IDE', scope: 'global', displayPath: '~/.cursor' },
        { id: 'kiro', name: 'Kiro AI', scope: 'global', displayPath: '~/.kiro' },
        { id: 'antigravity', name: 'Google Antigravity', scope: 'global', displayPath: '~/.gemini/config' },
        { id: 'pixel-crew', name: 'Pixel Crew HQ', scope: 'workspace', displayPath: './.pixel-crew' }
      ],
      activeIDE: { id: 'pixel-crew', name: 'Pixel Crew' }
    };

    const res = await deployToWorkstations(tmpDir, deploymentPlan, { dryRun: false, homeDir: mockHome });
    assert.equal(res.success, true);
    assert.equal(res.deployedCount, 5);

    // Verify workspace commands in pixel-crew
    const pcAssemble = await fs.stat(path.join(tmpDir, '.pixel-crew', 'commands', 'assemble.md'));
    assert.ok(pcAssemble.isFile());

    // Verify global commands in mockHome
    const claudeAssemble = await fs.stat(path.join(mockHome, '.claude', 'commands', 'assemble.md'));
    assert.ok(claudeAssemble.isFile());

    const cursorAssemble = await fs.stat(path.join(mockHome, '.cursor', 'commands', 'assemble.md'));
    assert.ok(cursorAssemble.isFile());

    const kiroAssemble = await fs.stat(path.join(mockHome, '.kiro', 'prompts', 'assemble.md'));
    assert.ok(kiroAssemble.isFile());

    const antigravityRule = await fs.stat(path.join(mockHome, '.gemini', 'config', 'rules', 'pixelcrew.md'));
    assert.ok(antigravityRule.isFile());

  } finally {
    await cleanupTestWorkspace(tmpDir);
  }
});

test('E2E: CLI command registry executes /, /commands, /help and commands without circular error loop', async () => {
  // 1. Bare '/'
  const slashRes = await defaultCommandRegistry.execute('/');
  assert.equal(slashRes.success, true);
  assert.ok(slashRes.output.includes('PIXEL CREW — FLOOR 42 MULTI-AGENT COMMAND SUITE'));
  assert.ok(slashRes.output.includes('/assemble'));
  assert.ok(slashRes.output.includes('/blueprint'));
  assert.ok(slashRes.output.includes('/recap'));

  // 2. '/commands'
  const cmdsRes = await defaultCommandRegistry.execute('/commands');
  assert.equal(cmdsRes.success, true);
  assert.ok(cmdsRes.output.includes('FLOOR 42 CREATION & ARCHITECTURE:'));
  assert.ok(cmdsRes.output.includes('RETRO AESTHETIC & ANTI-AI DIRECTION:'));
  assert.ok(cmdsRes.output.includes('PRODUCTION HARDENING & SRE:'));
  assert.ok(cmdsRes.output.includes('FLOOR 42 OPERATIONS:'));

  // 3. '/help'
  const helpRes = await defaultCommandRegistry.execute('/help');
  assert.equal(helpRes.success, true);
  assert.ok(helpRes.output.includes('FLOOR 42 MULTI-AGENT COMMAND SUITE'));

  // 4. Natural language 'commands'
  const textCmdsRes = await defaultCommandRegistry.execute('commands');
  assert.equal(textCmdsRes.success, true);
  assert.ok(textCmdsRes.output.includes('FLOOR 42 MULTI-AGENT COMMAND SUITE'));

  // 5. Unknown slash command gives helpful suggestions instead of circular loop
  const unknownRes = await defaultCommandRegistry.execute('/unknown-command');
  assert.equal(unknownRes.success, false);
  assert.ok(!unknownRes.message.includes('Type "/" to see available commands'));
  assert.ok(unknownRes.message.includes('Type "/commands" to view the Floor 42 command suite'));
});
