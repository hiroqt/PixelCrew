/**
 * PIXEL CREW — Clean Scaffolding & Targeted IDE Integration Tests
 * 
 * Verifies that running `initializeProject()` (equivalent to `npx pixelcrew init`)
 * creates clean, non-polluting folder structures:
 * 1. Single core unified directory (.pixel-crew/) for all shared agent assets.
 * 2. Targeted IDE files strictly matching the active or specified provider.
 * 3. Zero unwanted folders from unselected IDEs.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { initializeProject } from '../src/scaffold/init.js';
import { createTestWorkspace, cleanupTestWorkspace } from './helpers/fixture-runner.js';

async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

test('initializeProject with --provider kiro creates ONLY .pixel-crew and .kiro (zero pollution)', async () => {
  const tmpDir = await createTestWorkspace('kiro-clean-init');

  try {
    const result = await initializeProject(tmpDir, {
      name: 'kiro-app',
      yes: true,
      provider: 'kiro',
      dryRun: false
    });

    assert.ok(result.pixelCrewDir);

    // 1. Pixel Crew Core Files
    assert.equal(await pathExists(path.join(tmpDir, '.pixel-crew', 'config.json')), true);
    assert.equal(await pathExists(path.join(tmpDir, '.pixel-crew', 'pixel.json')), true);
    assert.equal(await pathExists(path.join(tmpDir, '.pixel-crew', 'skills', 'pixelcrew.md')), true);

    // 2. Kiro Files
    assert.equal(await pathExists(path.join(tmpDir, '.kiro', 'workflows', 'assemble.md')), true);
    assert.equal(await pathExists(path.join(tmpDir, '.kiro', 'prompts', 'recap.md')), true);
    assert.equal(await pathExists(path.join(tmpDir, '.kiro', 'rules', 'pixelcrew.md')), true);
    assert.equal(await pathExists(path.join(tmpDir, '.kirorules')), true);
    assert.equal(await pathExists(path.join(tmpDir, '.kiro', 'skills', 'pixelcrew', 'SKILL.md')), true);

    // 3. ZERO unwanted IDE files/folders
    assert.equal(await pathExists(path.join(tmpDir, '.cursor')), false);
    assert.equal(await pathExists(path.join(tmpDir, '.cursorrules')), false);
    assert.equal(await pathExists(path.join(tmpDir, '.agents')), false);
    assert.equal(await pathExists(path.join(tmpDir, 'AGENTS.md')), false);
    assert.equal(await pathExists(path.join(tmpDir, 'GEMINI.md')), false);
    assert.equal(await pathExists(path.join(tmpDir, '.claude')), false);
    assert.equal(await pathExists(path.join(tmpDir, '.claude-plugin')), false);
    assert.equal(await pathExists(path.join(tmpDir, 'CLAUDE.md')), false);
  } finally {
    await cleanupTestWorkspace(tmpDir);
  }
});

test('initializeProject with --provider cursor creates ONLY .pixel-crew and .cursor', async () => {
  const tmpDir = await createTestWorkspace('cursor-clean-init');

  try {
    await initializeProject(tmpDir, {
      name: 'cursor-app',
      yes: true,
      provider: 'cursor',
      dryRun: false
    });

    // 1. Core + Cursor
    assert.equal(await pathExists(path.join(tmpDir, '.pixel-crew', 'config.json')), true);
    assert.equal(await pathExists(path.join(tmpDir, '.cursorrules')), true);
    assert.equal(await pathExists(path.join(tmpDir, '.cursor', 'rules', 'pixelcrew.mdc')), true);
    assert.equal(await pathExists(path.join(tmpDir, '.cursor', 'skills', 'pixelcrew', 'SKILL.md')), true);

    // 2. ZERO unwanted IDE files
    assert.equal(await pathExists(path.join(tmpDir, '.kiro')), false);
    assert.equal(await pathExists(path.join(tmpDir, '.kirorules')), false);
    assert.equal(await pathExists(path.join(tmpDir, '.agents')), false);
    assert.equal(await pathExists(path.join(tmpDir, 'AGENTS.md')), false);
    assert.equal(await pathExists(path.join(tmpDir, '.claude')), false);
    assert.equal(await pathExists(path.join(tmpDir, 'CLAUDE.md')), false);
  } finally {
    await cleanupTestWorkspace(tmpDir);
  }
});

test('initializeProject with --provider antigravity creates ONLY .pixel-crew and .agents', async () => {
  const tmpDir = await createTestWorkspace('antigravity-clean-init');

  try {
    await initializeProject(tmpDir, {
      name: 'antigravity-app',
      yes: true,
      provider: 'antigravity',
      dryRun: false
    });

    // 1. Core + Antigravity
    assert.equal(await pathExists(path.join(tmpDir, '.pixel-crew', 'config.json')), true);
    assert.equal(await pathExists(path.join(tmpDir, 'AGENTS.md')), true);
    assert.equal(await pathExists(path.join(tmpDir, 'GEMINI.md')), true);
    assert.equal(await pathExists(path.join(tmpDir, '.agents', 'rules', 'pixelcrew.md')), true);
    assert.equal(await pathExists(path.join(tmpDir, '.agents', 'skills', 'pixelcrew', 'SKILL.md')), true);

    // 2. ZERO unwanted IDE files
    assert.equal(await pathExists(path.join(tmpDir, '.kiro')), false);
    assert.equal(await pathExists(path.join(tmpDir, '.kirorules')), false);
    assert.equal(await pathExists(path.join(tmpDir, '.cursor')), false);
    assert.equal(await pathExists(path.join(tmpDir, '.cursorrules')), false);
    assert.equal(await pathExists(path.join(tmpDir, '.claude')), false);
    assert.equal(await pathExists(path.join(tmpDir, 'CLAUDE.md')), false);
  } finally {
    await cleanupTestWorkspace(tmpDir);
  }
});

test('initializeProject with --provider none creates ONLY .pixel-crew (clean CLI mode)', async () => {
  const tmpDir = await createTestWorkspace('cli-clean-init');

  try {
    await initializeProject(tmpDir, {
      name: 'cli-app',
      yes: true,
      provider: 'none',
      dryRun: false
    });

    // 1. Core ONLY
    assert.equal(await pathExists(path.join(tmpDir, '.pixel-crew', 'config.json')), true);
    assert.equal(await pathExists(path.join(tmpDir, '.pixel-crew', 'skills', 'pixelcrew.md')), true);

    // 2. ZERO external IDE folders
    assert.equal(await pathExists(path.join(tmpDir, '.kiro')), false);
    assert.equal(await pathExists(path.join(tmpDir, '.cursor')), false);
    assert.equal(await pathExists(path.join(tmpDir, '.agents')), false);
    assert.equal(await pathExists(path.join(tmpDir, '.claude')), false);
    assert.equal(await pathExists(path.join(tmpDir, 'AGENTS.md')), false);
    assert.equal(await pathExists(path.join(tmpDir, 'CLAUDE.md')), false);
  } finally {
    await cleanupTestWorkspace(tmpDir);
  }
});

test('initializeProject with --provider all generates multi-IDE files when requested', async () => {
  const tmpDir = await createTestWorkspace('all-providers-init');

  try {
    await initializeProject(tmpDir, {
      name: 'all-app',
      yes: true,
      provider: 'all',
      dryRun: false
    });

    assert.equal(await pathExists(path.join(tmpDir, '.pixel-crew')), true);
    assert.equal(await pathExists(path.join(tmpDir, '.kiro')), true);
    assert.equal(await pathExists(path.join(tmpDir, '.cursor')), true);
    assert.equal(await pathExists(path.join(tmpDir, '.agents')), true);
    assert.equal(await pathExists(path.join(tmpDir, '.claude')), true);
  } finally {
    await cleanupTestWorkspace(tmpDir);
  }
});
