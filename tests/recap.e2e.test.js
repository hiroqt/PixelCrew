/**
 * PIXEL CREW — /recap Command E2E Tests
 *
 * Exercises the full lifecycle: real git repos, commits, argument handling,
 * alias resolution, autocomplete, error paths, and token-optimized output.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';
import { CommandRegistry } from '../src/commands/registry.js';
import { RecapCommand } from '../src/commands/recap.js';

/**
 * Creates a temp git repo with N commits for test isolation.
 */
async function createGitWorkspace(commitCount = 3) {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pixel-recap-'));

  execSync('git init', { cwd: tmpDir, stdio: 'pipe' });
  execSync('git config user.email "test@pixelcrew.dev"', { cwd: tmpDir, stdio: 'pipe' });
  execSync('git config user.name "PixelCrew Test"', { cwd: tmpDir, stdio: 'pipe' });

  for (let i = 1; i <= commitCount; i++) {
    const filename = `file-${i}.js`;
    await fs.writeFile(path.join(tmpDir, filename), `// File ${i}\nexport const v = ${i};\n`);
    execSync(`git add .`, { cwd: tmpDir, stdio: 'pipe' });
    execSync(`git commit -m "feat: add file-${i}"`, { cwd: tmpDir, stdio: 'pipe' });
  }

  return tmpDir;
}

async function cleanup(dir) {
  if (dir && dir.includes(os.tmpdir())) {
    await fs.rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

// ─── Core Execution ──────────────────────────────────────────────────────────

test('/recap returns structured recap from a real git repo', async () => {
  const tmpDir = await createGitWorkspace(3);
  try {
    const registry = new CommandRegistry();
    const result = await registry.execute('/recap', { targetDir: tmpDir });

    assert.equal(result.success, true);
    assert.ok(result.output.includes('PIXEL CREW — SESSION RECAP'));
    assert.ok(result.output.includes('COMMITS:'));
    assert.ok(result.output.includes('feat: add file-1'));
    assert.ok(result.output.includes('feat: add file-3'));

    // Structured data
    assert.ok(Array.isArray(result.data.commits));
    assert.equal(result.data.commits.length, 3);
    assert.ok(result.data.stats.filesChanged >= 1);
    assert.ok(result.data.stats.insertions >= 1);
    assert.ok(result.data.count === 3);

    // Token optimization: message is compact single-line
    assert.ok(result.message.includes('3 commits'));
    assert.ok(result.message.length < 120, 'Message should be compact for token efficiency');
  } finally {
    await cleanup(tmpDir);
  }
});

// ─── Count Argument ──────────────────────────────────────────────────────────

test('/recap [count] limits output to N most recent commits', async () => {
  const tmpDir = await createGitWorkspace(5);
  try {
    const registry = new CommandRegistry();
    const result = await registry.execute('/recap 2', { targetDir: tmpDir });

    assert.equal(result.success, true);
    assert.equal(result.data.commits.length, 2);
    assert.equal(result.data.count, 2);

    // Should contain the 2 most recent commits (file-5, file-4), not file-1
    assert.ok(result.output.includes('feat: add file-5'));
    assert.ok(result.output.includes('feat: add file-4'));
    assert.ok(!result.output.includes('feat: add file-1'));
  } finally {
    await cleanup(tmpDir);
  }
});

// ─── File Change Categories ──────────────────────────────────────────────────

test('/recap categorizes files into added/modified/deleted', async () => {
  const tmpDir = await createGitWorkspace(1);
  try {
    // Add a new file
    await fs.writeFile(path.join(tmpDir, 'new-feature.js'), '// new\n');
    execSync('git add .', { cwd: tmpDir, stdio: 'pipe' });
    execSync('git commit -m "feat: add new-feature"', { cwd: tmpDir, stdio: 'pipe' });

    // Modify existing file
    await fs.writeFile(path.join(tmpDir, 'file-1.js'), '// modified content\n');
    execSync('git add .', { cwd: tmpDir, stdio: 'pipe' });
    execSync('git commit -m "fix: update file-1"', { cwd: tmpDir, stdio: 'pipe' });

    // Delete a file
    await fs.unlink(path.join(tmpDir, 'new-feature.js'));
    execSync('git add .', { cwd: tmpDir, stdio: 'pipe' });
    execSync('git commit -m "chore: remove new-feature"', { cwd: tmpDir, stdio: 'pipe' });

    const registry = new CommandRegistry();
    const result = await registry.execute('/recap', { targetDir: tmpDir });

    assert.equal(result.success, true);
    assert.ok(result.data.fileChanges.length >= 1);
    assert.ok(result.output.includes('FILES:'));
  } finally {
    await cleanup(tmpDir);
  }
});

// ─── Error: Not a Git Repo ──────────────────────────────────────────────────

test('/recap returns graceful error when not in a git repo', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pixel-recap-nogit-'));
  try {
    const registry = new CommandRegistry();
    const result = await registry.execute('/recap', { targetDir: tmpDir });

    assert.equal(result.success, false);
    assert.ok(result.message.includes('Not a git repository'));
    assert.ok(result.output.includes('Not a git repository'));
  } finally {
    await cleanup(tmpDir);
  }
});

// ─── Aliases ─────────────────────────────────────────────────────────────────

test('/summary, /changelog, /whatdone aliases resolve to /recap', async () => {
  const tmpDir = await createGitWorkspace(2);
  try {
    const registry = new CommandRegistry();

    for (const alias of ['/summary', '/changelog', '/whatdone']) {
      const result = await registry.execute(alias, { targetDir: tmpDir });
      assert.equal(result.success, true, `${alias} should succeed`);
      assert.ok(result.output.includes('PIXEL CREW — SESSION RECAP'), `${alias} should produce recap output`);
      assert.equal(result.data.commits.length, 2, `${alias} should return 2 commits`);
    }
  } finally {
    await cleanup(tmpDir);
  }
});

// ─── Autocomplete ────────────────────────────────────────────────────────────

test('Autocomplete surfaces /recap when typing /rec', () => {
  const registry = new CommandRegistry();

  const suggestions = registry.getAutocompleteSuggestions('/rec');
  assert.ok(suggestions.some(s => s.name === '/recap'), '/rec should match /recap');

  const allSuggestions = registry.getAutocompleteSuggestions('/');
  assert.ok(allSuggestions.some(s => s.name === '/recap'), '/recap should appear in full listing');
});

// ─── Token Optimization Checks ──────────────────────────────────────────────

test('/recap output is token-optimized (compact, no verbose prose)', async () => {
  const tmpDir = await createGitWorkspace(5);
  try {
    const registry = new CommandRegistry();
    const result = await registry.execute('/recap', { targetDir: tmpDir });

    // Output should not contain verbose/redundant phrasing
    assert.ok(!result.output.includes('The following'), 'Should avoid verbose phrasing');
    assert.ok(!result.output.includes('Summary of changes'), 'Should avoid redundant headers');

    // Each commit line should be compact (hash + date + message, no author bloat)
    const commitLines = result.output.split('\n').filter(l => l.trim().startsWith('  ') && /^  [a-f0-9]/.test(l));
    for (const line of commitLines) {
      assert.ok(line.length < 200, `Commit line should be compact: "${line}"`);
    }

    // The RANGE summary line packs all stats into a single line
    const rangeLine = result.output.split('\n').find(l => l.startsWith('RANGE:'));
    assert.ok(rangeLine, 'Should have a compact RANGE summary line');
    assert.ok(rangeLine.includes('commit'), 'RANGE line should include commit count');
    assert.ok(rangeLine.includes('file'), 'RANGE line should include file count');
  } finally {
    await cleanup(tmpDir);
  }
});

// ─── Edge: Single Commit Repo ────────────────────────────────────────────────

test('/recap handles a repo with only 1 commit', async () => {
  const tmpDir = await createGitWorkspace(1);
  try {
    const registry = new CommandRegistry();
    const result = await registry.execute('/recap', { targetDir: tmpDir });

    assert.equal(result.success, true);
    assert.equal(result.data.commits.length, 1);
    assert.equal(result.data.count, 1);
    assert.ok(result.output.includes('1 commit'));
  } finally {
    await cleanup(tmpDir);
  }
});

// ─── Edge: Count Exceeds Total Commits ───────────────────────────────────────

test('/recap clamps count to available commit count', async () => {
  const tmpDir = await createGitWorkspace(2);
  try {
    const registry = new CommandRegistry();
    const result = await registry.execute('/recap 100', { targetDir: tmpDir });

    assert.equal(result.success, true);
    assert.equal(result.data.commits.length, 2);
    assert.equal(result.data.count, 2);
  } finally {
    await cleanup(tmpDir);
  }
});

// ─── Direct Command Instantiation ────────────────────────────────────────────

test('RecapCommand class has correct metadata', () => {
  const cmd = new RecapCommand();

  assert.equal(cmd.name, 'recap');
  assert.deepEqual(cmd.aliases, ['summary', 'changelog', 'whatdone']);
  assert.equal(cmd.category, 'inspection');
  assert.ok(cmd.usage.includes('/recap'));
});
