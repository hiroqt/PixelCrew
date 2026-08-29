import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { OneShotEngine, CREATIVE_ARCHETYPES } from '../src/orchestrator/oneshot.js';
import { OrchestratorEngine } from '../src/orchestrator/engine.js';
import { createServer } from '../src/server/server.js';
import { initializeProject } from '../src/scaffold/init.js';

test('OneShotEngine brief analyzer detects domain, framework, and interactive features', () => {
  const oneshot = new OneShotEngine();

  // 1. Developer Portfolio prompt
  const portBrief = oneshot.runBriefAnalyzer("create me a modern website that showcase my projects basically its a developer portfolio");
  assert.equal(portBrief.domain, 'portfolio');
  assert.equal(portBrief.targetFramework, 'nextjs'); // default modern stack
  assert.ok(portBrief.features.includes('interactive-filter'));

  // 2. Explicit Vue SaaS prompt
  const vueBrief = oneshot.runBriefAnalyzer("Build a Vue 3 SaaS pricing calculator and metrics dashboard");
  assert.equal(vueBrief.domain, 'saas');
  assert.equal(vueBrief.targetFramework, 'vue');
  assert.ok(vueBrief.features.includes('pricing-calculator'));

  // 3. DevTool technical infrastructure prompt
  const devBrief = oneshot.runBriefAnalyzer("High performance developer infrastructure and database query tool");
  assert.equal(devBrief.domain, 'devtool');
});

test('OneShotEngine resolves creative direction and dynamic UX topology', async () => {
  const oneshot = new OneShotEngine();
  const prompt = "create me a modern website that showcase my projects basically its a developer portfolio";
  const brief = oneshot.runBriefAnalyzer(prompt);

  const direction = await oneshot.runCreativeDirector(prompt, brief);
  assert.ok(direction.design_direction);
  assert.ok(Array.isArray(direction.visual_personality));
  assert.ok(direction.avoid.some(item => item.includes('purple')));

  const uxPlan = await oneshot.runUXPlanner(prompt, direction);
  assert.ok(uxPlan.title);
  assert.equal(uxPlan.domain, 'portfolio');
  assert.ok(uxPlan.sections.find(s => s.id === 'hero'));
  assert.ok(uxPlan.sections.find(s => s.id === 'projects'));
  assert.ok(uxPlan.sections.find(s => s.id === 'terminal'));

  const designSystem = await oneshot.runDesignSystem(direction, uxPlan);
  assert.ok(designSystem.cssTokens.includes('--bg-primary'));
  assert.ok(designSystem.fonts.googleFontsUrl);
});

test('OneShotEngine generates idiomatic Next.js App Router multi-file project tree on disk', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'oneshot-multi-test-'));
  const oneshot = new OneShotEngine();

  const prompt = "create me a modern website that showcase my projects basically its a developer portfolio";
  const result = await oneshot.generateWebsite(prompt, {
    targetFramework: 'nextjs',
    outputDir: tmpDir
  });

  // Verify multi-file project structure
  const files = result.buildResult.files;
  assert.ok(files['package.json']);
  assert.ok(files['tsconfig.json']);
  assert.ok(files['tailwind.config.ts']);
  assert.ok(files['src/app/layout.tsx']);
  assert.ok(files['src/app/page.tsx']);
  assert.ok(files['src/app/globals.css']);
  assert.ok(files['src/components/sections/Hero.tsx']);
  assert.ok(files['src/components/sections/ProjectsGrid.tsx']);
  assert.ok(files['src/components/sections/TerminalBio.tsx']);
  assert.ok(files['src/lib/data.ts']);

  // Verify standalone preview HTML
  assert.ok(result.buildResult.html.includes('<!DOCTYPE html>'));
  assert.ok(result.buildResult.html.includes('filter-btn'));
  assert.ok(result.buildResult.html.includes('termLogs'));

  // Verify Visual Critic Score
  const ev = result.evaluation;
  assert.ok(ev.finalScore >= 8.5, `Final score should meet threshold (got ${ev.finalScore})`);
  assert.equal(ev.passed, true);

  // Verify Token Conservation Metrics
  assert.ok(result.tokenStats.efficiencyRatio >= 60);

  // Verify files written to disk
  const diskFiles = await fs.readdir(tmpDir);
  assert.ok(diskFiles.includes('package.json'));
  assert.ok(diskFiles.includes('tsconfig.json'));
  assert.ok(diskFiles.includes('index.html'));
  assert.ok(diskFiles.includes('src'));

  const srcAppFiles = await fs.readdir(path.join(tmpDir, 'src', 'app'));
  assert.ok(srcAppFiles.includes('page.tsx'));
  assert.ok(srcAppFiles.includes('layout.tsx'));

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
  const result = await engine.submitOneShotTask("Developer portfolio showcasing high performance systems", {
    targetFramework: 'nextjs',
    outputDir: outDir,
    fast: true
  });

  assert.ok(result.evaluation);
  assert.ok(result.evaluation.finalScore >= 8.5);
  assert.ok(result.buildResult.fileCount > 5);

  // Verify events emitted across creative crew
  const agentNames = events.map(e => e.agent);
  assert.ok(agentNames.includes('creativeDirector'));
  assert.ok(agentNames.includes('uxPlanner'));
  assert.ok(agentNames.includes('designSystem'));
  assert.ok(agentNames.includes('frontend'));
  assert.ok(agentNames.includes('visualCritic'));
  assert.ok(agentNames.includes('orchestrator'));

  // Verify files generated on disk
  const files = await fs.readdir(outDir);
  assert.ok(files.includes('package.json'));
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
    }, JSON.stringify({ prompt: 'Developer portfolio' }));
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
