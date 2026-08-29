import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { OneShotEngine, CREATIVE_ARCHETYPES } from '../src/orchestrator/oneshot.js';
import { DynamicPlanner } from '../src/orchestrator/planner.js';
import { SkillRegistry } from '../src/orchestrator/skills-registry.js';
import { TaskQueue } from '../src/orchestrator/task-queue.js';
import { CodeGenerator } from '../src/orchestrator/code-generator.js';
import { OrchestratorEngine } from '../src/orchestrator/engine.js';
import { createServer } from '../src/server/server.js';
import { initializeProject } from '../src/scaffold/init.js';

test('DynamicPlanner analyzes requirements and produces bespoke project specifications', () => {
  const planner = new DynamicPlanner();

  // 1. Portfolio Analysis
  const portAnalysis = planner.analyzeRequirements("Create me a modern, responsive portfolio website with animations using Pixel Agents");
  assert.equal(portAnalysis.domain, 'portfolio');
  assert.equal(portAnalysis.framework, 'nextjs');
  assert.ok(portAnalysis.requestedFeatures.includes('project-filter-matrix'));
  assert.ok(portAnalysis.requestedFeatures.includes('interactive-terminal-shell'));

  const portSpec = planner.createProjectSpecification(portAnalysis);
  assert.equal(portSpec.domain, 'portfolio');
  assert.ok(portSpec.sections.find(s => s.component === 'Hero'));
  assert.ok(portSpec.sections.find(s => s.component === 'ProjectsGrid'));

  // 2. Restaurant Analysis (completely different topology)
  const restAnalysis = planner.analyzeRequirements("Bespoke botanical tasting menu & modern dining room reservation");
  assert.equal(restAnalysis.domain, 'restaurant');
  assert.ok(restAnalysis.requestedFeatures.includes('interactive-tasting-menu'));
  assert.ok(restAnalysis.requestedFeatures.includes('table-reservation-modal'));

  const restSpec = planner.createProjectSpecification(restAnalysis);
  assert.equal(restSpec.domain, 'restaurant');
  assert.ok(restSpec.sections.find(s => s.component === 'TastingMenu'));
  assert.ok(restSpec.sections.find(s => s.component === 'ReservationSection'));
});

test('DynamicPlanner compiles dynamic DAG task graph with explicit dependencies', () => {
  const planner = new DynamicPlanner();
  const analysis = planner.analyzeRequirements("Modern animated developer portfolio");
  const spec = planner.createProjectSpecification(analysis);
  const { tasks } = planner.createTaskGraph(spec);

  assert.ok(tasks.length >= 7);
  
  const planTask = tasks.find(t => t.id === 'task-plan');
  const designTask = tasks.find(t => t.id === 'task-design-director');
  const feScaffoldTask = tasks.find(t => t.id === 'task-frontend-scaffold');
  const feCompTask = tasks.find(t => t.id === 'task-frontend-components');
  const qaTask = tasks.find(t => t.id === 'task-qa-visual-critic');

  assert.equal(planTask.dependsOn.length, 0);
  assert.ok(designTask.dependsOn.includes('task-plan'));
  assert.ok(feScaffoldTask.dependsOn.includes('task-design-director'));
  assert.ok(feCompTask.dependsOn.includes('task-frontend-scaffold'));
  assert.ok(qaTask.dependsOn.includes('task-animation-motion'));
});

test('SkillRegistry matches capabilities and categories correctly', () => {
  const registry = new SkillRegistry();

  const feSkills = registry.matchSkills('Next.js component with Tailwind CSS styling');
  assert.ok(feSkills.includes('frontend/nextjs'));
  assert.ok(feSkills.includes('frontend/tailwind'));

  const motionSkills = registry.matchSkills('Framer motion entrance and scroll interactions');
  assert.ok(motionSkills.includes('motion/framer-motion'));

  const qaSkills = registry.matchSkills('Visual QA review and rubric scoring');
  assert.ok(qaSkills.includes('quality/visual-review'));
});

test('TaskQueue executes DAG with parallel dependency resolution and event emission', async () => {
  const planner = new DynamicPlanner();
  const spec = planner.createProjectSpecification(planner.analyzeRequirements("Modern agency flagship"));
  const { tasks } = planner.createTaskGraph(spec);

  const queue = new TaskQueue(tasks);
  const events = [];

  const result = await queue.execute({}, (evt) => {
    events.push(evt);
  });

  assert.equal(result.success, true);
  assert.equal(result.completedCount, tasks.length);
  assert.ok(events.some(e => e.type === 'agent.started'));
  assert.ok(events.some(e => e.type === 'skill.activated'));
  assert.ok(events.some(e => e.type === 'task.completed'));
});

test('CodeGenerator synthesizes complete Next.js 14/15 App Router codebase with API routes', () => {
  const planner = new DynamicPlanner();
  const spec = planner.createProjectSpecification(planner.analyzeRequirements("Developer portfolio with terminal and project filters"));
  const codeGen = new CodeGenerator();

  const result = codeGen.generateProject(spec);
  const files = result.files;

  assert.ok(files['package.json']);
  assert.ok(files['tsconfig.json']);
  assert.ok(files['tailwind.config.ts']);
  assert.ok(files['src/app/layout.tsx']);
  assert.ok(files['src/app/page.tsx']);
  assert.ok(files['src/app/globals.css']);
  assert.ok(files['src/components/sections/Navbar.tsx']);
  assert.ok(files['src/components/sections/Hero.tsx']);
  assert.ok(files['src/components/sections/ShowcaseGrid.tsx']);
  assert.ok(files['src/components/sections/InteractiveSection.tsx']);
  assert.ok(files['src/components/sections/ContactSection.tsx']);
  assert.ok(files['src/app/api/contact/route.ts']);
  assert.ok(files['src/app/api/data/route.ts']);
  assert.ok(files['src/lib/data.ts']);
  assert.ok(files['src/types/index.ts']);

  assert.ok(result.previewHtml.includes('<!DOCTYPE html>'));
  assert.ok(result.previewHtml.includes('filter-btn'));
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
  assert.ok(files['src/components/sections/ShowcaseGrid.tsx']);
  assert.ok(files['src/components/sections/InteractiveSection.tsx']);
  assert.ok(files['src/lib/data.ts']);

  // Verify standalone preview HTML
  assert.ok(result.buildResult.html.includes('<!DOCTYPE html>'));
  assert.ok(result.buildResult.html.includes('filter-btn'));

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
  await initializeProject(tmpDir, { name: 'engine-oneshot', yes: true });

  const engine = new OrchestratorEngine(tmpDir);
  await engine.initialize();

  const events = [];
  engine.on('agent_event', (evt) => {
    events.push(evt);
  });

  const prompt = "create me a modern website that showcase my skills basically its a portfolio";
  const outputSiteDir = path.join(tmpDir, 'generated-site');

  const summary = await engine.submitOneShotTask(prompt, {
    outputDir: outputSiteDir,
    targetFramework: 'nextjs',
    fast: true
  });

  assert.ok(summary);
  assert.equal(summary.targetFramework, 'nextjs');
  assert.ok(summary.buildResult.fileCount > 5);
  assert.ok(summary.evaluation.finalScore >= 8.5);

  // Verify streamed events
  assert.ok(events.some(e => e.agent === 'orchestrator' && e.type === 'spawn'));
  assert.ok(events.some(e => e.agent === 'creativeDirector'));
  assert.ok(events.some(e => e.agent === 'frontend'));
  assert.ok(events.some(e => e.agent === 'backend'));
  assert.ok(events.some(e => e.agent === 'visualCritic'));
  assert.ok(events.some(e => e.type === 'file.created'));

  // Verify state
  const state = engine.getState();
  assert.equal(state.status, 'COMPLETED');
  assert.equal(state.orchestrator.state, 'COMPLETED');

  // Verify disk output
  const files = await fs.readdir(outputSiteDir);
  assert.ok(files.includes('package.json'));
  assert.ok(files.includes('index.html'));

  // Clean up
  await fs.rm(tmpDir, { recursive: true, force: true });
});

test('Server OneShot API routes (/api/oneshot, /api/token-stats, /api/site-preview) function properly', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'server-oneshot-'));
  await initializeProject(tmpDir, { name: 'server-oneshot', yes: true });

  const engine = new OrchestratorEngine(tmpDir);
  await engine.initialize();

  const server = createServer(tmpDir, engine);

  const dispatch = (req) => new Promise((resolve) => {
    const res = {
      statusCode: 200,
      headers: {},
      body: '',
      setHeader(k, v) { this.headers[k] = v; },
      writeHead(code, headers) { this.statusCode = code; if (headers) Object.assign(this.headers, headers); },
      end(chunk) {
        if (chunk) this.body = chunk;
        resolve(this);
      }
    };
    server.emit('request', req, res);
  });

  try {
    // 1. Test /api/token-stats
    const tokenRes = await dispatch({
      method: 'GET',
      url: '/api/token-stats',
      headers: {}
    });
    assert.equal(tokenRes.statusCode, 200);
    const tokenData = JSON.parse(tokenRes.body);
    assert.ok(tokenData.efficiencyRatio >= 0);

    // 2. Test /api/oneshot (Fast synthetic dispatch)
    const payload = JSON.stringify({
      prompt: "Modern developer portfolio with kinetic animations",
      targetFramework: "nextjs",
      fast: true
    });
    const req = {
      method: 'POST',
      url: '/api/oneshot',
      headers: { 'content-type': 'application/json' },
      on(event, cb) {
        if (event === 'data') cb(Buffer.from(payload));
        if (event === 'end') cb();
        return this;
      }
    };
    const oneshotRes = await dispatch(req);
    assert.equal(oneshotRes.statusCode, 200);
    const oneshotData = JSON.parse(oneshotRes.body);
    assert.equal(oneshotData.status, 'goal_started');
    assert.equal(oneshotData.options.targetFramework, 'nextjs');

    // 3. Test /api/site-preview
    const previewDir = path.join(tmpDir, 'mock-generated-site');
    await fs.mkdir(previewDir, { recursive: true });
    const previewFile = path.join(previewDir, 'index.html');
    await fs.writeFile(previewFile, '<!DOCTYPE html><html><body><h1>Preview</h1></body></html>');
    engine.lastGeneratedSitePath = previewFile;

    const previewRes = await dispatch({
      method: 'GET',
      url: '/api/site-preview',
      headers: {}
    });
    assert.equal(previewRes.statusCode, 200);
    assert.ok(previewRes.body.includes('<!DOCTYPE html>'));

  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});
