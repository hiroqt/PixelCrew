import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ProviderRegistry } from '../src/adapters/registry.js';
import { GenericAdapter } from '../src/adapters/generic.js';
import { ClaudeCodeAdapter } from '../src/adapters/claude-code.js';
import { CodexAdapter } from '../src/adapters/codex.js';
import { CursorAdapter } from '../src/adapters/cursor.js';
import { KiroAdapter } from '../src/adapters/kiro.js';
import { AntigravityAdapter } from '../src/adapters/antigravity.js';
import { createTask } from '../src/protocol/task.js';
import { createTestWorkspace, cleanupTestWorkspace } from './helpers/fixture-runner.js';

test('ProviderRegistry registers all core adapters and handles discovery', async () => {
  const registry = new ProviderRegistry();
  const all = registry.getAllAdapters();

  assert.ok(all.length >= 6);
  assert.ok(registry.getAdapter('generic'));
  assert.ok(registry.getAdapter('claude-code'));
  assert.ok(registry.getAdapter('codex'));
  assert.ok(registry.getAdapter('cursor'));
  assert.ok(registry.getAdapter('kiro'));
  assert.ok(registry.getAdapter('antigravity'));

  const { available, missing } = await registry.scanEnvironment();
  // Generic is always available
  assert.ok(available.some(a => a.id === 'generic'));
});

test('GenericAdapter executes tasks safely without dependencies', async () => {
  const adapter = new GenericAdapter();
  assert.equal(await adapter.detect(), true);

  const caps = await adapter.getCapabilities();
  assert.equal(caps.fileAccess, true);
  assert.equal(caps.terminalAccess, true);

  const task = createTask({ id: 'task-test', title: 'Local Test Task', agent: 'frontend' });
  const result = await adapter.execute(task);

  assert.equal(result.success, true);
  assert.equal(result.provider, 'generic');
});

test('ProviderRegistry resolves best agent by strategy', async () => {
  const registry = new ProviderRegistry();
  const taskFE = createTask({ id: 't-fe', title: 'Design Landing Page', agent: 'creativeDirector' });
  const taskBE = createTask({ id: 't-be', title: 'Optimize Postgres Query', agent: 'backend' });

  const bestAuto = await registry.getBestAgent(taskFE, 'auto');
  assert.ok(bestAuto);
  assert.ok(typeof bestAuto.execute === 'function');

  // Explicit provider selection
  const explicitGeneric = await registry.getBestAgent(taskFE, 'generic');
  assert.equal(explicitGeneric.id, 'generic');

  const explicitClaude = await registry.getBestAgent(taskFE, 'claude-code');
  assert.equal(explicitClaude.id, 'claude-code');
});

test('All coding agent adapters detect via environment variables and workspace markers', async () => {
  const tmpDir = await createTestWorkspace('multi-adapter-detect');
  const originalEnv = { ...process.env };

  try {
    // 1. Cursor Adapter
    const cursor = new CursorAdapter();
    process.env.CURSOR_SESSION = 'crs_test_1';
    assert.equal(await cursor.detect(), true);
    delete process.env.CURSOR_SESSION;

    await fs.writeFile(path.join(tmpDir, '.cursorrules'), '# cursor\n');
    assert.equal(await cursor.detect(tmpDir), true);
    await fs.unlink(path.join(tmpDir, '.cursorrules'));

    // 2. Claude Code Adapter
    const claude = new ClaudeCodeAdapter();
    process.env.CLAUDE_SESSION = 'cld_test_1';
    assert.equal(await claude.detect(), true);
    delete process.env.CLAUDE_SESSION;

    await fs.writeFile(path.join(tmpDir, 'CLAUDE.md'), '# Claude\n');
    assert.equal(await claude.detect(tmpDir), true);
    await fs.unlink(path.join(tmpDir, 'CLAUDE.md'));

    // 3. Codex Adapter
    const codex = new CodexAdapter();
    process.env.CODEX_SESSION = 'cdx_test_1';
    assert.equal(await codex.detect(), true);
    delete process.env.CODEX_SESSION;

    await fs.writeFile(path.join(tmpDir, 'codex.json'), '{"provider": "codex"}\n');
    assert.equal(await codex.detect(tmpDir), true);
    await fs.unlink(path.join(tmpDir, 'codex.json'));

    // 4. Kiro Adapter
    const kiro = new KiroAdapter();
    process.env.KIRO_SESSION = 'kr_test_1';
    assert.equal(await kiro.detect(), true);
    delete process.env.KIRO_SESSION;

    await fs.writeFile(path.join(tmpDir, '.kirorules'), '# Kiro\n');
    assert.equal(await kiro.detect(tmpDir), true);
    await fs.unlink(path.join(tmpDir, '.kirorules'));

    // 5. Antigravity Adapter
    const agy = new AntigravityAdapter();
    process.env.AGY_SESSION = 'agy_test_1';
    assert.equal(await agy.detect(), true);
    delete process.env.AGY_SESSION;

    await fs.writeFile(path.join(tmpDir, 'AGENTS.md'), '# Agents\n');
    assert.equal(await agy.detect(tmpDir), true);
    await fs.unlink(path.join(tmpDir, 'AGENTS.md'));

    // 6. ProviderRegistry scanEnvironment with workspace directory
    await fs.mkdir(path.join(tmpDir, '.cursor'), { recursive: true });
    await fs.mkdir(path.join(tmpDir, '.kiro'), { recursive: true });
    const registry = new ProviderRegistry();
    const { available } = await registry.scanEnvironment(true, tmpDir);
    const availableIds = available.map(a => a.id);
    assert.ok(availableIds.includes('cursor'));
    assert.ok(availableIds.includes('kiro'));
  } finally {
    process.env = originalEnv;
    await cleanupTestWorkspace(tmpDir);
  }
});
