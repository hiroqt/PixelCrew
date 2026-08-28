import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { initializeProject } from '../src/scaffold/init.js';
import { OrchestratorEngine, AGENT_STATES } from '../src/orchestrator/engine.js';
import { createServer } from '../src/server/server.js';

test('Project initialization scaffolds required structure', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pixel-agents-test-'));

  const result = await initializeProject(tmpDir, { name: 'test-crm', yes: true });
  assert.ok(result.pixelAgentsDir);

  // Verify config.json
  const configRaw = await fs.readFile(path.join(tmpDir, '.pixel-agents', 'config.json'), 'utf-8');
  const config = JSON.parse(configRaw);
  assert.equal(config.project, 'test-crm');
  assert.ok(config.agents.frontend);
  assert.ok(config.agents.backend);
  assert.ok(config.agents.database);

  // Verify agent markdowns
  const agents = await fs.readdir(path.join(tmpDir, '.pixel-agents', 'agents'));
  assert.ok(agents.includes('orchestrator.md'));
  assert.ok(agents.includes('frontend.md'));
  assert.ok(agents.includes('database.md'));

  // Verify skills markdowns
  const skills = await fs.readdir(path.join(tmpDir, '.pixel-agents', 'skills'));
  assert.ok(skills.includes('react.md'));
  assert.ok(skills.includes('prisma.md'));
  assert.ok(skills.includes('postgresql.md'));

  // Verify dashboard files
  const dashFiles = await fs.readdir(path.join(tmpDir, '.pixel-dashboard'));
  assert.ok(dashFiles.includes('index.html'));
  assert.ok(dashFiles.includes('styles.css'));
  assert.ok(dashFiles.includes('app.js'));

  // Clean up
  await fs.rm(tmpDir, { recursive: true, force: true });
});

test('OrchestratorEngine manages state, events, and task lifecycle', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pixel-agents-engine-'));
  await initializeProject(tmpDir, { name: 'engine-test', yes: true });

  const engine = new OrchestratorEngine(tmpDir);
  await engine.initialize();

  const state = engine.getState();
  assert.equal(state.status, 'READY');
  assert.equal(state.orchestrator.state, AGENT_STATES.IDLE);

  // Test custom event emission
  let receivedEvent = null;
  engine.on('agent_event', (evt) => {
    receivedEvent = evt;
  });

  await engine.emitEvent({
    agent: 'database',
    type: 'tool',
    skill: 'postgresql',
    message: 'Analyzing index scan'
  });

  assert.ok(receivedEvent);
  assert.equal(receivedEvent.agent, 'database');
  assert.equal(receivedEvent.skill, 'postgresql');

  // Test state updates
  await engine.updateAgentState('frontend', {
    state: AGENT_STATES.WORKING,
    currentTask: 'Rendering UI'
  });

  const updatedState = engine.getState();
  assert.equal(updatedState.agents.frontend.state, AGENT_STATES.WORKING);
  assert.equal(updatedState.agents.frontend.expression, '◉▂◉');

  // Clean up
  await fs.rm(tmpDir, { recursive: true, force: true });
});

test('Server handles routes and event broadcasting', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pixel-agents-server-'));
  try {
    await initializeProject(tmpDir, { name: 'server-test', yes: true });

    const engine = new OrchestratorEngine(tmpDir);
    await engine.initialize();

    const server = createServer(engine);

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

    // Test GET /api/state
    const resState = await dispatch({
      method: 'GET',
      url: '/api/state',
      headers: { host: 'localhost' },
      on() {}
    });
    assert.equal(resState.statusCode, 200);
    const parsedState = JSON.parse(resState.body);
    assert.equal(parsedState.status, 'READY');

    // Test GET /api/config
    const resConfig = await dispatch({
      method: 'GET',
      url: '/api/config',
      headers: { host: 'localhost' },
      on() {}
    });
    assert.equal(resConfig.statusCode, 200);
    const parsedConfig = JSON.parse(resConfig.body);
    assert.equal(parsedConfig.project, 'server-test');

    // Test Root HTML serving
    const resHtml = await dispatch({
      method: 'GET',
      url: '/',
      headers: { host: 'localhost' },
      on() {}
    });
    assert.equal(resHtml.statusCode, 200);
    assert.ok(resHtml.body.toString().includes('PIXELCREW'));
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});

test('analyzeCodebase detects tech stack and adapts permissions', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pixel-agents-analyzer-'));
  try {
    // Create a mock Next.js + Prisma + Vitest project
    await fs.writeFile(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({
        name: 'mock-next-crm',
        dependencies: {
          next: '^14.2.0',
          react: '^18.3.0',
          '@prisma/client': '^5.14.0',
          tailwindcss: '^3.4.0'
        },
        devDependencies: {
          typescript: '^5.4.0',
          vitest: '^1.6.0'
        }
      }, null, 2)
    );

    await fs.mkdir(path.join(tmpDir, 'src', 'app'), { recursive: true });
    await fs.mkdir(path.join(tmpDir, 'prisma'), { recursive: true });
    await fs.writeFile(
      path.join(tmpDir, 'prisma', 'schema.prisma'),
      'datasource db { provider = "postgresql" }\n'
    );

    const { analyzeCodebase, buildAdaptedConfig } = await import('../src/scaffold/analyzer.js');
    const profile = await analyzeCodebase(tmpDir);

    assert.equal(profile.projectName, 'mock-next-crm');
    assert.ok(profile.languages.includes('TypeScript'));
    assert.ok(profile.frameworks.some(f => f.includes('Next.js')));
    assert.ok(profile.database.includes('Prisma ORM'));
    assert.ok(profile.database.includes('PostgreSQL'));
    assert.ok(profile.styling.includes('TailwindCSS'));
    assert.ok(profile.testing.includes('Vitest'));

    const config = buildAdaptedConfig(profile);
    assert.ok(config.agents.frontend.skills.includes('nextjs'));
    assert.ok(config.agents.frontend.skills.includes('tailwind'));
    assert.ok(config.agents.database.skills.includes('prisma'));
    assert.ok(config.agents.database.skills.includes('postgresql'));
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});
