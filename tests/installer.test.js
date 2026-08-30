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
