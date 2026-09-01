/**
 * PIXEL CREW — Automated Installer, Multi-Provider Sync & Dry-Run Test Suite
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { initializeProject } from '../src/scaffold/init.js';
import { installSkill, syncSkills, normalizeSkillId, generateSkillMarkdown } from '../src/scaffold/installer.js';
import { AddCommand } from '../src/commands/add.js';
import { SyncCommand } from '../src/commands/sync.js';
import { createTestWorkspace, cleanupTestWorkspace, listAllFiles } from './helpers/fixture-runner.js';

test('normalizeSkillId resolves standard and namespaced skill identifiers', () => {
  const s1 = normalizeSkillId('@pixel-crew/oneshot');
  assert.equal(s1.name, 'oneshot');

  const s2 = normalizeSkillId('design/ui-design');
  assert.equal(s2.id, 'design/ui-design');
  assert.equal(s2.name, 'ui-design');

  const s3 = normalizeSkillId('react');
  assert.equal(s3.name, 'react');
});

test('generateSkillMarkdown formats valid YAML frontmatter and instructions', () => {
  const meta = normalizeSkillId('design/ui-design');
  const markdown = generateSkillMarkdown(meta);

  assert.ok(markdown.startsWith('---'));
  assert.ok(markdown.includes('name: ui-design'));
  assert.ok(markdown.includes('category: design'));
});

test('initializeProject with --dry-run produces preview and writes ZERO files to disk', async () => {
  const tmpDir = await createTestWorkspace('empty-project');

  try {
    const initialFiles = await listAllFiles(tmpDir);

    const result = await initializeProject(tmpDir, {
      name: 'dry-run-workspace',
      yes: true,
      dryRun: true
    });

    assert.equal(result.dryRun, true);
    assert.ok(result.reporter.creates.size > 0);

    // Verify zero new files on disk
    const afterFiles = await listAllFiles(tmpDir);
    assert.deepEqual(initialFiles, afterFiles);

    // Ensure .pixel-crew does NOT exist on disk
    let exists = true;
    try {
      await fs.access(path.join(tmpDir, '.pixel-crew'));
    } catch {
      exists = false;
    }
    assert.equal(exists, false);
  } finally {
    await cleanupTestWorkspace(tmpDir);
  }
});

test('initializeProject creates complete .pixel-crew/ and pixel.json manifest', async () => {
  const tmpDir = await createTestWorkspace('empty-project');

  try {
    const result = await initializeProject(tmpDir, {
      name: 'real-test-app',
      yes: true,
      dryRun: false
    });

    assert.ok(result.pixelCrewDir);

    // Verify manifest
    const manifestRaw = await fs.readFile(path.join(tmpDir, '.pixel-crew', 'pixel.json'), 'utf-8');
    const manifest = JSON.parse(manifestRaw);
    assert.equal(manifest.name, 'real-test-app');
    assert.equal(manifest.version, '0.2.4');
    assert.ok(manifest.skills);

    // Verify core directories
    const hasConfig = await fs.readFile(path.join(tmpDir, '.pixel-crew', 'config.json'), 'utf-8');
    assert.ok(hasConfig.includes('real-test-app'));

    const agents = await fs.readdir(path.join(tmpDir, '.pixel-crew', 'agents'));
    assert.ok(agents.includes('frontend.md'));
    assert.ok(agents.includes('orchestrator.md'));
  } finally {
    await cleanupTestWorkspace(tmpDir);
  }
});

test('installSkill with --dry-run previews multi-provider installation without writing', async () => {
  const tmpDir = await createTestWorkspace('empty-project');

  try {
    const result = await installSkill(tmpDir, 'design/ui-design', {
      dryRun: true,
      provider: 'all'
    });

    assert.equal(result.success, true);
    assert.equal(result.dryRun, true);
    assert.ok(result.reporter.creates.size >= 5);

    // Check that target file does not exist
    let claudeSkillExists = true;
    try {
      await fs.access(path.join(tmpDir, '.claude', 'skills', 'ui-design', 'SKILL.md'));
    } catch {
      claudeSkillExists = false;
    }
    assert.equal(claudeSkillExists, false);
  } finally {
    await cleanupTestWorkspace(tmpDir);
  }
});

test('installSkill writes SKILL.md across .claude, .cursor, .kiro, .agents, and .pixel-crew', async () => {
  const tmpDir = await createTestWorkspace('empty-project');

  try {
    const result = await installSkill(tmpDir, 'design/ui-design', {
      dryRun: false,
      provider: 'all'
    });

    assert.equal(result.success, true);
    assert.equal(result.dryRun, false);

    // 1. Anthropic Claude Code
    const claudePath = path.join(tmpDir, '.claude', 'skills', 'ui-design', 'SKILL.md');
    const claudeContent = await fs.readFile(claudePath, 'utf-8');
    assert.ok(claudeContent.includes('name: ui-design'));
    assert.ok(claudeContent.includes('Bespoke UI & Asymmetric Layouts'));

    // 2. Cursor AI
    const cursorPath = path.join(tmpDir, '.cursor', 'skills', 'ui-design', 'SKILL.md');
    const cursorContent = await fs.readFile(cursorPath, 'utf-8');
    assert.ok(cursorContent.includes('name: ui-design'));

    // 3. Kiro AI
    const kiroPath = path.join(tmpDir, '.kiro', 'skills', 'ui-design', 'SKILL.md');
    const kiroContent = await fs.readFile(kiroPath, 'utf-8');
    assert.ok(kiroContent.includes('name: ui-design'));

    // 4. Google Antigravity / Agents
    const agentsPath = path.join(tmpDir, '.agents', 'skills', 'ui-design', 'SKILL.md');
    const agentsContent = await fs.readFile(agentsPath, 'utf-8');
    assert.ok(agentsContent.includes('name: ui-design'));

    // 5. Pixel Crew Manifest
    const manifestRaw = await fs.readFile(path.join(tmpDir, '.pixel-crew', 'pixel.json'), 'utf-8');
    const manifest = JSON.parse(manifestRaw);
    assert.ok(manifest.skills['design/ui-design']);
  } finally {
    await cleanupTestWorkspace(tmpDir);
  }
});

test('installSkill auto-detects existing multi-provider project environment', async () => {
  const tmpDir = await createTestWorkspace('multi-provider-project');

  try {
    const result = await installSkill(tmpDir, 'frontend/nextjs', {
      dryRun: false
    });

    assert.equal(result.success, true);
    assert.ok(result.providers.includes('claude-code'));
    assert.ok(result.providers.includes('cursor'));
    assert.ok(result.providers.includes('antigravity'));
    assert.ok(result.providers.includes('pixel-crew'));

    // Verify Claude and Cursor received SKILL.md
    const claudeExists = await fs.stat(path.join(tmpDir, '.claude', 'skills', 'nextjs', 'SKILL.md'));
    assert.ok(claudeExists.isFile());

    const cursorExists = await fs.stat(path.join(tmpDir, '.cursor', 'skills', 'nextjs', 'SKILL.md'));
    assert.ok(cursorExists.isFile());
  } finally {
    await cleanupTestWorkspace(tmpDir);
  }
});

test('syncSkills synchronizes installed skills across detected providers', async () => {
  const tmpDir = await createTestWorkspace('multi-provider-project');

  try {
    const result = await syncSkills(tmpDir, {
      dryRun: false
    });

    assert.equal(result.success, true);
    assert.ok(result.skillsSynced.length > 0);

    // Verify typography skill was synced to .agents
    const agentsTypography = await fs.stat(path.join(tmpDir, '.agents', 'skills', 'typography', 'SKILL.md'));
    assert.ok(agentsTypography.isFile());
  } finally {
    await cleanupTestWorkspace(tmpDir);
  }
});

test('AddCommand and SyncCommand CLI interfaces execute with dry-run and live modes', async () => {
  const tmpDir = await createTestWorkspace('empty-project');

  try {
    const addCmd = new AddCommand();
    const dryRes = await addCmd.execute({ targetDir: tmpDir }, ['design/ui-design', '--dry-run']);
    assert.equal(dryRes.success, true);
    assert.ok(dryRes.output.includes('DRY RUN PREVIEW'));

    const syncCmd = new SyncCommand();
    const drySyncRes = await syncCmd.execute({ targetDir: tmpDir }, ['--dry-run']);
    assert.equal(drySyncRes.success, true);
    assert.ok(drySyncRes.output.includes('DRY RUN PREVIEW'));
  } finally {
    await cleanupTestWorkspace(tmpDir);
  }
});

test('detectActiveIDE detects active terminal environment and maps global paths', async () => {
  const { detectActiveIDE } = await import('../src/scaffold/installer.js');
  const originalEnv = { ...process.env };

  try {
    const ambientVars = [
      'KIRO', 'KIRO_AGENT', 'KIRO_SESSION', 'KIRO_APP_DIR',
      'CURSOR', 'CURSOR_AGENT', 'CURSOR_SESSION', 'CURSOR_APP_DIR',
      'ANTIGRAVITY_APP_DIR', 'AGY_SESSION', 'ANTIGRAVITY', 'ANTIGRAVITY_IDE', 'AGY', 'CORPUS_NAME', 'CONVERSATION_ID',
      'CLAUDE_CODE', 'CLAUDE_SESSION', 'CLAUDE_AGENT'
    ];
    for (const v of ambientVars) delete process.env[v];

    // 1. Kiro
    process.env.KIRO_SESSION = 'kiro_sess_1';
    const kiro = detectActiveIDE();
    assert.equal(kiro.id, 'kiro');
    assert.ok(kiro.globalPath.includes('.kiro'));
    delete process.env.KIRO_SESSION;

    // 2. Cursor
    process.env.CURSOR_SESSION = 'cursor_sess_1';
    const cursor = detectActiveIDE();
    assert.equal(cursor.id, 'cursor');
    assert.ok(cursor.globalPath.includes('.cursor'));
    delete process.env.CURSOR_SESSION;

    // 3. Antigravity
    process.env.ANTIGRAVITY_APP_DIR = '/Applications/Antigravity.app';
    const agy = detectActiveIDE();
    assert.equal(agy.id, 'antigravity');
    delete process.env.ANTIGRAVITY_APP_DIR;

    // 4. Claude Code
    process.env.CLAUDE_CODE = '1';
    const claude = detectActiveIDE();
    assert.equal(claude.id, 'claude-code');
    delete process.env.CLAUDE_CODE;
  } finally {
    process.env = originalEnv;
  }
});

test('installSkill with scope: "global" and AddCommand with --global target global user IDE directory', async () => {
  const tmpDir = await createTestWorkspace('global-skill-test');
  const originalEnv = { ...process.env };
  process.env.KIRO_SESSION = 'active_kiro_test';

  try {
    const res = await installSkill(tmpDir, 'design/ui-design', {
      dryRun: true,
      scope: 'global'
    });

    assert.equal(res.success, true);
    assert.equal(res.scope, 'global');
    assert.equal(res.activeIDE.id, 'kiro');
    assert.ok(res.writtenPaths.some(w => w.scope === 'global' && w.path.includes('.kiro')));

    // Test AddCommand with --global
    const addCmd = new AddCommand();
    const addRes = await addCmd.execute({ targetDir: tmpDir }, ['design/ui-design', '--global', '--dry-run']);
    assert.equal(addRes.success, true);
    assert.equal(addRes.data.scope, 'global');
  } finally {
    process.env = originalEnv;
    await cleanupTestWorkspace(tmpDir);
  }
});

test('scanAllWorkstations and InstallCommand interactive dispatcher deploy across workstations', async () => {
  const tmpDir = await createTestWorkspace('workstation-test');
  const { scanAllWorkstations, deployToWorkstations } = await import('../src/scaffold/workstations.js');
  const { InstallCommand } = await import('../src/commands/install.js');

  try {
    // Create local .kiro directory
    await fs.mkdir(path.join(tmpDir, '.kiro'), { recursive: true });

    const workstations = await scanAllWorkstations(tmpDir);
    assert.ok(workstations.some(w => w.id === 'kiro' && w.scope === 'workspace'));
    assert.ok(workstations.some(w => w.id === 'pixel-crew'));

    // Test deployToWorkstations dry run
    const plan = {
      plan: 'detected',
      workstations: workstations.filter(w => w.scope === 'workspace'),
      activeIDE: { id: 'kiro', name: 'Kiro AI' }
    };
    const deployRes = await deployToWorkstations(tmpDir, plan, { dryRun: true });
    assert.equal(deployRes.success, true);
    assert.ok(deployRes.deployedCount > 0);

    // Test InstallCommand with --dry-run
    const installCmd = new InstallCommand();
    const cmdRes = await installCmd.execute({ targetDir: tmpDir, options: { yes: true } }, ['--dry-run']);
    assert.equal(cmdRes.success, true);
    assert.ok(cmdRes.output.includes('DRY RUN PREVIEW'));
  } finally {
    await cleanupTestWorkspace(tmpDir);
  }
});

test('getSkillBundle and installSkill replicate full-fidelity skills and reference guides across all IDEs', async () => {
  const tmpDir = await createTestWorkspace('full-skills-test');
  const { getSkillBundle } = await import('../src/scaffold/skills-bundle.js');

  try {
    // Verify anti-ai-patterns bundle
    const bundle = await getSkillBundle('anti-ai-patterns');
    assert.ok(bundle.content.includes('name: anti-ai-patterns'));
    assert.ok(bundle.content.includes('FORBIDDEN PATTERNS'));
    assert.ok(bundle.content.includes('ENFORCED PRINCIPLES'));
    assert.ok(bundle.content.includes('Rubric Evaluation'));

    // Install to all providers
    const res = await installSkill(tmpDir, 'anti-ai-patterns', {
      allProviders: true
    });
    assert.equal(res.success, true);

    // Verify .kiro/skills/anti-ai-patterns/SKILL.md
    const kiroSkill = await fs.readFile(path.join(tmpDir, '.kiro', 'skills', 'anti-ai-patterns', 'SKILL.md'), 'utf-8');
    assert.ok(kiroSkill.includes('FORBIDDEN PATTERNS'));
    assert.ok(kiroSkill.includes('ENFORCED PRINCIPLES'));

    // Verify .cursor/skills/anti-ai-patterns/SKILL.md
    const cursorSkill = await fs.readFile(path.join(tmpDir, '.cursor', 'skills', 'anti-ai-patterns', 'SKILL.md'), 'utf-8');
    assert.ok(cursorSkill.includes('FORBIDDEN PATTERNS'));

    // Verify .claude/skills/anti-ai-patterns/SKILL.md
    const claudeSkill = await fs.readFile(path.join(tmpDir, '.claude', 'skills', 'anti-ai-patterns', 'SKILL.md'), 'utf-8');
    assert.ok(claudeSkill.includes('FORBIDDEN PATTERNS'));

    // Verify .agents/skills/anti-ai-patterns/SKILL.md
    const agentsSkill = await fs.readFile(path.join(tmpDir, '.agents', 'skills', 'anti-ai-patterns', 'SKILL.md'), 'utf-8');
    assert.ok(agentsSkill.includes('FORBIDDEN PATTERNS'));
  } finally {
    await cleanupTestWorkspace(tmpDir);
  }
});

test('syncSkills and init generate all Kiro workflows including /recap and full command palette', async () => {
  const tmpDir = await createTestWorkspace('kiro-workflows-test');
  const { initializeProject } = await import('../src/scaffold/init.js');

  try {
    process.env.KIRO_SESSION = 'kiro_test_session';
    await initializeProject(tmpDir, { name: 'kiro-app', yes: true });

    // Verify .kiro/workflows/
    const workflows = await fs.readdir(path.join(tmpDir, '.kiro', 'workflows'));
    assert.ok(workflows.includes('recap.md'), 'Kiro workflows should include recap.md');
    assert.ok(workflows.includes('assemble.md'), 'Kiro workflows should include assemble.md');
    assert.ok(workflows.includes('blueprint.md'), 'Kiro workflows should include blueprint.md');
    assert.ok(workflows.includes('render.md'), 'Kiro workflows should include render.md');
    assert.ok(workflows.includes('pixelcrew.md'), 'Kiro workflows should include pixelcrew.md');

    // Verify content of recap workflow
    const recapWf = await fs.readFile(path.join(tmpDir, '.kiro', 'workflows', 'recap.md'), 'utf-8');
    assert.ok(recapWf.includes('name: recap'));
    assert.ok(recapWf.includes('Execute a token-optimized session recap'));

    // Verify .kiro/prompts/
    const prompts = await fs.readdir(path.join(tmpDir, '.kiro', 'prompts'));
    assert.ok(prompts.includes('recap.md'), 'Kiro prompts should include recap.md');
    assert.ok(prompts.includes('assemble.md'), 'Kiro prompts should include assemble.md');

    // Verify .kirorules
    const rules = await fs.readFile(path.join(tmpDir, '.kirorules'), 'utf-8');
    assert.ok(rules.includes('Slash Commands in Kiro Chat:'));
    assert.ok(rules.includes('`/recap`'));
  } finally {
    delete process.env.KIRO_SESSION;
    await cleanupTestWorkspace(tmpDir);
  }
});

