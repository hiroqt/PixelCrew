import test from 'node:test';
import assert from 'node:assert/strict';
import { ProviderRegistry } from '../src/adapters/registry.js';
import { GenericAdapter } from '../src/adapters/generic.js';
import { ClaudeCodeAdapter } from '../src/adapters/claude-code.js';
import { CodexAdapter } from '../src/adapters/codex.js';
import { CursorAdapter } from '../src/adapters/cursor.js';
import { KiroAdapter } from '../src/adapters/kiro.js';
import { AntigravityAdapter } from '../src/adapters/antigravity.js';
import { createTask } from '../src/protocol/task.js';

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
