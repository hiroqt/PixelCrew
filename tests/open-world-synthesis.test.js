import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { DynamicPlanner } from '../src/orchestrator/planner.js';
import { CodeGenerator } from '../src/orchestrator/code-generator.js';
import { OneShotEngine } from '../src/orchestrator/oneshot.js';
import { RequirementContract } from '../src/orchestrator/requirement-contract.js';

test('Open-World Domain 1: Underwater Archaeological Expedition Management', async () => {
  const prompt = "Build an underwater archaeological expedition management platform with sonar mapping, specimen cataloging, dive logs, environmental telemetry and expedition reports.";
  const oneshot = new OneShotEngine({ fast: true });
  const tempDir = path.join(os.tmpdir(), `underwater-archaeology-${Date.now()}`);

  try {
    const result = await oneshot.generateWebsite(prompt, { outputDir: tempDir });
    const ast = result.plannerAnalysis.ast;

    // 1. Verify Domain Agnosticity & Open-World Discovery
    assert.ok(ast.domain.includes('underwater') || ast.domainMeta.label.toLowerCase().includes('underwater'));
    assert.ok(ast.actors.some(a => a.name.toLowerCase().includes('diver') || a.name.toLowerCase().includes('researcher') || a.name.toLowerCase().includes('specialist')));
    
    // 2. Verify Dynamic Entity Extraction
    const entityNames = ast.entities.map(e => e.name.toLowerCase());
    assert.ok(entityNames.some(n => n.includes('expedition') || n.includes('specimen') || n.includes('dive') || n.includes('sonar') || n.includes('report')));

    // 3. Verify Synthesized File Tree & Types
    const files = result.buildResult.files;
    assert.ok(files['package.json']);
    assert.ok(files['src/types/index.ts']);
    assert.ok(files['src/lib/data.ts']);
    assert.ok(files['src/app/page.tsx']);

    // 4. Verify Requirement Contract Compliance (100% pass)
    assert.ok(result.contractAudit.overallScore >= 9.0);
    assert.equal(result.contractAudit.unmetRequirements.length, 0);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
});

test('Open-World Domain 2: Coral Reef Restoration Management', async () => {
  const prompt = "Build a coral reef restoration management system that tracks reef sites, coral colonies, transplant events, diver teams, water conditions and restoration progress.";
  const planner = new DynamicPlanner();
  const generator = new CodeGenerator();

  const analysis = planner.analyzeRequirements(prompt);
  const ast = analysis.ast;

  // 1. Verify Entity Discovery
  const entityNames = ast.entities.map(e => e.name.toLowerCase());
  assert.ok(entityNames.some(n => n.includes('reef') || n.includes('site')));
  assert.ok(entityNames.some(n => n.includes('coral') || n.includes('colony')));
  assert.ok(entityNames.some(n => n.includes('transplant') || n.includes('event')));
  assert.ok(entityNames.some(n => n.includes('water') || n.includes('condition')));

  // 2. Verify Synthesized Views
  assert.ok(ast.views.length >= 3);
  
  // 3. Generate Codebase
  const spec = planner.createProjectSpecification(analysis);
  const project = generator.generateProject(spec);

  assert.ok(project.fileCount >= 10);
  assert.ok(project.files['src/types/index.ts']);
  assert.ok(project.files['src/lib/data.ts']);

  // 4. Validate Contract
  const contract = new RequirementContract(ast);
  const audit = contract.validateProject(project.files);
  assert.equal(audit.unmetCount, 0);
  assert.ok(audit.passRate === 100 || audit.passRateFormatted === '100.0%');
});

test('Open-World Domain 3: Deep-Sky Astronomical Observatory', async () => {
  const prompt = "Build an observatory platform for scheduling telescope observations, tracking celestial targets, recording exposures and generating observation reports.";
  const planner = new DynamicPlanner();
  const generator = new CodeGenerator();

  const analysis = planner.analyzeRequirements(prompt);
  const ast = analysis.ast;

  // 1. Verify Open-World Discovery
  const entityNames = ast.entities.map(e => e.name.toLowerCase());
  assert.ok(entityNames.some(n => n.includes('observatory') || n.includes('telescope')));
  assert.ok(entityNames.some(n => n.includes('observation') || n.includes('target')));
  assert.ok(entityNames.some(n => n.includes('exposure') || n.includes('report')));

  // 2. Synthesize and Verify Codebase
  const spec = planner.createProjectSpecification(analysis);
  const project = generator.generateProject(spec);

  assert.ok(project.files['src/app/page.tsx']);
  assert.ok(Object.keys(project.files).some(p => p.startsWith('src/app/api/')));

  const contract = new RequirementContract(ast);
  const audit = contract.validateProject(project.files);
  assert.equal(audit.unmetCount, 0);
});

test('Open-World Domain 4: Cinema Film Production & Continuity System', async () => {
  const prompt = "Build a film production management platform for scenes, shooting schedules, locations, props, takes and continuity notes.";
  const planner = new DynamicPlanner();
  const generator = new CodeGenerator();

  const analysis = planner.analyzeRequirements(prompt);
  const ast = analysis.ast;

  // 1. Verify Entity Discovery
  const entityNames = ast.entities.map(e => e.name.toLowerCase());
  assert.ok(entityNames.some(n => n.includes('scene') || n.includes('film')));
  assert.ok(entityNames.some(n => n.includes('schedule') || n.includes('location')));
  assert.ok(entityNames.some(n => n.includes('prop') || n.includes('take') || n.includes('continuity')));

  // 2. Synthesize and Verify Codebase
  const spec = planner.createProjectSpecification(analysis);
  const project = generator.generateProject(spec);

  assert.ok(project.fileCount >= 10);
  const contract = new RequirementContract(ast);
  const audit = contract.validateProject(project.files);
  assert.equal(audit.unmetCount, 0);
});

test('Open-World Domain 5: Mythical Dragon Breeding Sanctuary (Absurd / Novel Domain)', async () => {
  const prompt = "Build software for managing a dragon breeding sanctuary where keepers track dragons, habitats, feeding schedules, health observations, lineage and flight training.";
  const oneshot = new OneShotEngine({ fast: true });
  const tempDir = path.join(os.tmpdir(), `dragon-sanctuary-${Date.now()}`);

  try {
    const result = await oneshot.generateWebsite(prompt, { outputDir: tempDir });
    const ast = result.plannerAnalysis.ast;

    // 1. Verify Novel / Absurd Entity Discovery with Zero Predefined Dragon Logic
    const entityNames = ast.entities.map(e => e.name.toLowerCase());
    assert.ok(entityNames.some(n => n.includes('dragon')));
    assert.ok(entityNames.some(n => n.includes('habitat')));
    assert.ok(entityNames.some(n => n.includes('feed') || n.includes('schedule')));
    assert.ok(entityNames.some(n => n.includes('lineage') || n.includes('training') || n.includes('health')));

    // 2. Verify Actors
    assert.ok(ast.actors.some(a => a.name.toLowerCase().includes('keeper') || a.name.toLowerCase().includes('specialist')));

    // 3. Verify Synthesized Next.js Codebase on Disk
    const files = result.buildResult.files;
    assert.ok(files['src/app/page.tsx']);
    assert.ok(files['src/types/index.ts']);
    assert.ok(files['src/lib/data.ts']);

    // 4. Verify 100% Requirement Contract Compliance
    assert.equal(result.contractAudit.unmetRequirements.length, 0);
    assert.ok(result.contractAudit.passRate === 100 || result.contractAudit.passRateFormatted === '100.0%');
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
});
