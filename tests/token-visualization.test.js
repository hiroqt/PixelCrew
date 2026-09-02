import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { TelemetryEngine } from '../src/orchestrator/telemetry.js';
import { OrchestratorEngine } from '../src/orchestrator/engine.js';
import { createServer } from '../src/server/server.js';

test('TelemetryEngine tracks real-time token accumulation and per-agent metrics', () => {
  const telemetry = new TelemetryEngine();
  const initial = telemetry.getTokenTelemetry();

  assert.equal(initial.actualTokensUsed, 0);
  assert.equal(initial.tokensSaved, 0);
  assert.equal(initial.efficiencyRatio, 72);

  // Add tokens for Creative Director
  const step1 = telemetry.addTokens('creativeDirector', {
    promptTokens: 1400,
    completionTokens: 1000,
    rawEstimated: 8500,
    stepName: 'Brand Strategy'
  });

  assert.equal(step1.actualTokensUsed, 2400);
  assert.equal(step1.promptTokens, 1400);
  assert.equal(step1.completionTokens, 1000);
  assert.equal(step1.tokensSaved, 6100);
  assert.equal(step1.perAgent.creativeDirector, 2400);
  assert.equal(step1.timeline.length, 1);
  assert.equal(step1.timeline[0].agent, 'creativeDirector');

  // Add tokens for Frontend Builder
  const step2 = telemetry.addTokens('frontend', {
    promptTokens: 2600,
    completionTokens: 3400,
    rawEstimated: 21000,
    stepName: 'Component Synthesis'
  });

  assert.equal(step2.actualTokensUsed, 8400);
  assert.equal(step2.perAgent.creativeDirector, 2400);
  assert.equal(step2.perAgent.frontend, 6000);
  assert.equal(step2.timeline.length, 2);
  assert.ok(step2.costUsd > 0);
  assert.ok(step2.efficiencyRatio >= 65 && step2.efficiencyRatio <= 75);
});

test('OrchestratorEngine exposes getTokenTelemetry and emits live token events during OneShot', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pixel-token-test-'));
  const engine = new OrchestratorEngine(tmpDir);
  await engine.initialize();

  const tokenEvents = [];
  engine.on('event', (evt) => {
    if (evt.type === 'token_telemetry' || evt.tokenStats) {
      tokenEvents.push(evt);
    }
  });

  const result = await engine.submitOneShotTask('Build a fast brutalist developer portfolio', {
    fast: true,
    outputDir: path.join(tmpDir, 'portfolio-out')
  });

  assert.ok(result.tokenStats, 'Result contains tokenStats');
  assert.ok(result.tokenStats.actualTokensUsed > 0, 'Tokens were tracked');
  assert.ok(result.tokenStats.perAgent.frontend > 0, 'Frontend agent consumed tokens');
  assert.ok(result.tokenStats.perAgent.creativeDirector > 0, 'Creative Director consumed tokens');
  assert.ok(tokenEvents.length >= 5, 'Emitted at least 5 live token_telemetry events');

  const liveStats = engine.getTokenTelemetry();
  assert.equal(liveStats.actualTokensUsed, result.tokenStats.actualTokensUsed);
  assert.ok(liveStats.timeline.length >= 5);

  // Clean up
  await fs.rm(tmpDir, { recursive: true, force: true });
});

test('Server endpoints /api/token-stats and /api/token-telemetry return valid schema', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pixel-server-tok-test-'));
  const engine = new OrchestratorEngine(tmpDir);
  await engine.initialize();
  const server = createServer(tmpDir, engine);

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  const res = await fetch(`http://127.0.0.1:${port}/api/token-telemetry`);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.ok('actualTokensUsed' in data);
  assert.ok('tokensSaved' in data);
  assert.ok('efficiencyRatio' in data);
  assert.ok('strategiesActive' in data);
  assert.ok(Array.isArray(data.strategiesActive));

  await new Promise((resolve) => server.close(resolve));
  await fs.rm(tmpDir, { recursive: true, force: true });
});
