import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { DynamicPlanner } from '../src/orchestrator/planner.js';
import { CodeGenerator } from '../src/orchestrator/code-generator.js';
import { OneShotEngine } from '../src/orchestrator/oneshot.js';

test('Dynamic Prompt Synthesis: 1. Aerospace Orbital Mission Planner', async () => {
  const planner = new DynamicPlanner();
  const generator = new CodeGenerator();
  const prompt = "create me an orbital mission trajectory planner with fuel telemetry and launch calculation";

  const analysis = planner.analyzeRequirements(prompt);
  assert.equal(analysis.domain, 'aerospace');
  assert.ok(analysis.projectName.toLowerCase().includes('orbital mission') || analysis.projectName.toLowerCase().includes('trajectory'));
  assert.ok(analysis.entities.length >= 2);
  assert.ok(analysis.metrics.some(m => m.label.includes('Delta-V') || m.label.includes('Altitude')));

  const spec = planner.createProjectSpecification(analysis);
  const project = generator.generateProject(spec);

  assert.ok(project.fileCount >= 10);
  assert.ok(project.files['src/app/page.tsx']);
  assert.ok(project.files['src/lib/data.ts'].includes('Delta-V'));
  assert.ok(project.files['src/components/sections/Hero.tsx'].includes(spec.projectName.toUpperCase()));
});

test('Dynamic Prompt Synthesis: 2. LegalTech Contract Risk Analyzer', async () => {
  const planner = new DynamicPlanner();
  const generator = new CodeGenerator();
  const prompt = "create me a legal contract risk analyzer with clause extraction and compliance score";

  const analysis = planner.analyzeRequirements(prompt);
  assert.equal(analysis.domain, 'legaltech');
  assert.ok(analysis.entities.some(e => e.title.includes('Agreement') || e.title.includes('Contract') || e.title.includes('GDPR')));
  assert.ok(analysis.metrics.some(m => m.label.includes('Risk') || m.label.includes('Compliance')));

  const spec = planner.createProjectSpecification(analysis);
  const project = generator.generateProject(spec);

  assert.ok(project.files['src/lib/data.ts'].includes('Risk Index') || project.files['src/lib/data.ts'].includes('Compliance'));
});

test('Dynamic Prompt Synthesis: 3. Creative Audio Synthesizer & MIDI Sequencer', async () => {
  const planner = new DynamicPlanner();
  const generator = new CodeGenerator();
  const prompt = "create me an interactive audio synthesizer with wavetable oscillator and MIDI sequencer";

  const analysis = planner.analyzeRequirements(prompt);
  assert.equal(analysis.domain, 'audiotech');
  assert.ok(analysis.entities.some(e => e.title.includes('Wavetable') || e.title.includes('Oscillator') || e.title.includes('Filter')));
  assert.ok(analysis.metrics.some(m => m.label.includes('DSP') || m.label.includes('Sample') || m.label.includes('Polyphony')));

  const spec = planner.createProjectSpecification(analysis);
  const project = generator.generateProject(spec);

  assert.ok(project.files['src/lib/data.ts'].includes('Oscillator') || project.files['src/lib/data.ts'].includes('Sample Processing'));
});

test('Dynamic Prompt Synthesis: 4. PropTech Real Estate Valuation & Mortgage Estimator', async () => {
  const oneshot = new OneShotEngine({ fast: true });
  const prompt = "create me a real estate property valuation estimator with neighborhood comp tables and mortgage calculator";
  const tempDir = './tmp-proptech-test';

  try {
    const result = await oneshot.generateWebsite(prompt, { outputDir: tempDir });
    assert.equal(result.targetFramework, 'nextjs');
    assert.ok(result.buildResult.fileCount >= 10);
    assert.ok(result.evaluation.finalScore >= 8.5);

    const files = result.buildResult.files;
    assert.ok(files['src/lib/data.ts'].includes('Valuation') || files['src/lib/data.ts'].includes('Residential Assets'));
    assert.ok(files['src/components/sections/DashboardMetrics.tsx']);
    assert.ok(files['src/app/api/contact/route.ts']);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
});
