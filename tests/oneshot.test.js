import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { OneShotEngine, CREATIVE_ARCHETYPES } from '../src/orchestrator/oneshot.js';
import { OrchestratorEngine } from '../src/orchestrator/engine.js';
import { createServer } from '../src/server/server.js';
import { initializeProject } from '../src/scaffold/init.js';

test('OneShotEngine resolves creative archetypes and creates structured direction', async () => {
  const oneshot = new OneShotEngine();

  // 1. Technical prompt
  const techArchetype = oneshot.resolveArchetype("Build a high performance developer infrastructure and database query tool");
  assert.equal(techArchetype.direction, CREATIVE_ARCHETYPES.technical.direction);
  assert.ok(techArchetype.fonts.display.includes('Space Grotesk'));

  // 2. Kinetic prompt
  const kineticArchetype = oneshot.resolveArchetype("Bold kinetic design studio and creative agency");
  assert.equal(kineticArchetype.direction, CREATIVE_ARCHETYPES.kinetic.direction);

  // 3. Editorial prompt
  const editorialArchetype = oneshot.resolveArchetype("Bespoke architectural firm and modern editorial portfolio");
  assert.equal(editorialArchetype.direction, CREATIVE_ARCHETYPES.editorial.direction);
  assert.ok(editorialArchetype.fonts.display.includes('Instrument Serif'));

  // 4. Creative Director output
  const direction = await oneshot.runCreativeDirector("Modern editorial AI product lab");
  assert.ok(direction.design_direction);
  assert.ok(Array.isArray(direction.visual_personality));
  assert.ok(direction.layout_strategy);
  assert.ok(direction.typography_strategy);
  assert.ok(Array.isArray(direction.avoid));
  assert.ok(direction.avoid.some(item => item.includes('purple')));
});

test('OneShotEngine UX Planner and Design System produce asymmetric layouts and tokens', async () => {
  const oneshot = new OneShotEngine();
  const direction = await oneshot.runCreativeDirector("AI engineering platform");
  const uxPlan = await oneshot.runUXPlanner("AI engineering platform", direction);

  assert.ok(uxPlan.title);
  assert.ok(Array.isArray(uxPlan.sections));
  assert.ok(uxPlan.sections.find(s => s.id === 'hero'));
  assert.ok(uxPlan.sections.find(s => s.id === 'showcase'));
  assert.ok(uxPlan.sections.find(s => s.id === 'manifesto'));
  assert.ok(uxPlan.sections.find(s => s.id === 'specs'));

  const designSystem = await oneshot.runDesignSystem(direction, uxPlan);
  assert.ok(designSystem.cssTokens.includes('--bg-primary'));
  assert.ok(designSystem.cssTokens.includes('--font-display'));
  assert.ok(designSystem.fonts.googleFontsUrl);
});

test('OneShotEngine Frontend Builder and Visual Critic evaluate rubric score and token metrics', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'oneshot-test-'));
  const oneshot = new OneShotEngine();

  const result = await oneshot.generateWebsite("Build a modern website for a design agency specializing in AI products. Dark, editorial, premium.", {
    targetFramework: 'vanilla',
    outputDir: tmpDir
  });

  // Verify result structure
  assert.ok(result.buildResult.html);
  assert.ok(result.buildResult.html.includes('<!DOCTYPE html>'));
  assert.ok(result.buildResult.html.includes('tailored') || result.buildResult.html.includes('Bespoke') || result.buildResult.html.includes('Architecture'));
  
  // Verify Visual Critic Score
  const ev = result.evaluation;
  assert.ok(ev.finalScore >= 8.5, `Final score should meet threshold (got ${ev.finalScore})`);
  assert.equal(ev.passed, true);
  assert.ok(ev.rubric.originality >= 8.0);
  assert.ok(ev.rubric.typography >= 8.0);
  assert.ok(ev.rubric.layout >= 8.0);
  assert.ok(ev.rubric.generic_ai_penalty <= 1.5);

  // Verify Token Conservation Metrics
  assert.ok(result.tokenStats.rawTokensEstimated > 0);
  assert.ok(result.tokenStats.actualTokensUsed > 0);
  assert.ok(result.tokenStats.tokensSaved > 0);
  assert.ok(result.tokenStats.efficiencyRatio >= 60);

  // Verify generated files on disk
  const files = await fs.readdir(tmpDir);
  assert.ok(files.includes('index.html'));
  assert.ok(files.includes('creative-direction.json'));

  // Clean up
  await fs.rm(tmpDir, { recursive: true, force: true });
});

test('OrchestratorEngine.submitOneShotTask executes multi-agent pipeline and streams events', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'engine-oneshot-'));
  await initializeProject(tmpDir, { name: 'oneshot-engine-test', yes: true });

  const engine = new OrchestratorEngine(tmpDir);
  await engine.initialize();

  const events = [];
  engine.on('agent_event', (evt) => events.push(evt));

  const outDir = path.join(tmpDir, 'generated-site');
  const result = await engine.submitOneShotTask("Bespoke AI product studio", {
    targetFramework: 'vanilla',
    outputDir: outDir,
    fast: true
  });

  assert.ok(result.evaluation);
  assert.ok(result.evaluation.finalScore >= 8.5);
  assert.ok(result.tokenStats.efficiencyRatio >= 60);

  // Verify events emitted across creative crew
  const agentNames = events.map(e => e.agent);
  assert.ok(agentNames.includes('creativeDirector'));
  assert.ok(agentNames.includes('uxPlanner'));
  assert.ok(agentNames.includes('designSystem'));
  assert.ok(agentNames.includes('frontend'));
  assert.ok(agentNames.includes('visualCritic'));
  assert.ok(agentNames.includes('orchestrator'));

  // Verify site generated on disk
  const files = await fs.readdir(outDir);
  assert.ok(files.includes('index.html'));

  // Clean up
  await fs.rm(tmpDir, { recursive: true, force: true });
});

test('Server OneShot API routes (/api/oneshot, /api/token-stats, /api/site-preview) function properly', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'server-oneshot-'));
  await initializeProject(tmpDir, { name: 'server-oneshot-test', yes: true });

  const engine = new OrchestratorEngine(tmpDir);
  await engine.initialize();

  // Create a dummy site preview
  const siteDir = path.join(tmpDir, 'generated-site');
  await fs.mkdir(siteDir, { recursive: true });
  await fs.writeFile(path.join(siteDir, 'index.html'), '<html><body><h1>Preview Test</h1></body></html>');

  const server = createServer(engine);

  const dispatch = (req, body = null) => new Promise((resolve) => {
    const res = {
      statusCode: 200,
      headers: {},
      body: '',
      setHeader(k, v) { this.headers[k] = v; },
      writeHead(code, headers) { this.statusCode = code; if (headers) Object.assign(this.headers, headers); },
      end(chunk) {
        if (chunk) this.body += chunk;
        resolve(this);
      }
    };
    req.on = (evt, cb) => {
      if (evt === 'data' && body) cb(body);
      if (evt === 'end') cb();
      return req;
    };
    server.emit('request', req, res);
  });

  try {
    // 1. GET /api/token-stats
    const tokenRes = await dispatch({
      method: 'GET',
      url: '/api/token-stats',
      headers: { host: 'localhost' }
    });
    assert.equal(tokenRes.statusCode, 200);
    const tokenData = JSON.parse(tokenRes.body);
    assert.equal(tokenData.efficiencyRatio, 72);
    assert.ok(tokenData.strategiesActive.length > 0);

    // 2. GET /api/site-preview
    const previewRes = await dispatch({
      method: 'GET',
      url: '/api/site-preview',
      headers: { host: 'localhost' }
    });
    assert.equal(previewRes.statusCode, 200);
    assert.ok(previewRes.body.includes('Preview Test'));

    // 3. POST /api/oneshot
    const oneshotRes = await dispatch({
      method: 'POST',
      url: '/api/oneshot',
      headers: { host: 'localhost' }
    }, JSON.stringify({ prompt: 'Test website brief' }));
    assert.equal(oneshotRes.statusCode, 200);
    const oneshotJson = JSON.parse(oneshotRes.body);
    assert.equal(oneshotJson.status, 'oneshot_started');

  } finally {
    if (server && server.listening) server.close();
    if (engine.activeTaskAbortController) {
      engine.activeTaskAbortController.abort();
    }
    await new Promise(r => setTimeout(r, 50));
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});
