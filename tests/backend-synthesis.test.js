import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BackendSynthesizer } from '../src/backend/synthesis/backend-synthesizer.js';
import { ArchitectureValidator } from '../src/backend/validation/architecture-validator.js';
import { SecurityValidator } from '../src/backend/validation/security-validator.js';
import { BackendQualityValidator } from '../src/backend/validation/backend-quality-validator.js';
import { CommandRegistry } from '../src/commands/registry.js';
import { SemanticEngine } from '../src/orchestrator/semantic-engine.js';

describe('Universal Backend Synthesizer & Quality Validator Suite', () => {
  it('synthesizes complete production-grade backend codebase from prompt', () => {
    const prompt = 'Build a multi-tenant logistics dispatch platform with Fleet, Route, and Delivery entities';
    const ast = SemanticEngine.parsePromptToAST(prompt);

    const result = BackendSynthesizer.synthesize(prompt, ast);
    assert.ok(result.fileCount >= 15);
    assert.ok(result.files['prisma/schema.prisma']);
    assert.ok(result.files['src/shared/errors.ts']);
    assert.ok(result.files['src/infrastructure/logger.ts']);
    assert.ok(result.files['src/infrastructure/database.ts']);
    assert.ok(result.files['docs/security/threat-model.md']);

    // Check synthesized domain modules
    assert.ok(result.files['src/modules/fleet/fleet.controller.ts']);
    assert.ok(result.files['src/modules/fleet/fleet.service.ts']);
    assert.ok(result.files['src/modules/fleet/fleet.repository.ts']);
    assert.ok(result.files['src/modules/fleet/fleet.schema.ts']);
    assert.ok(result.files['src/modules/fleet/fleet.policy.ts']);
    assert.ok(result.files['src/modules/fleet/fleet.test.ts']);

    // Check API route handlers
    assert.ok(result.files['src/app/api/v1/fleets/route.ts']);
    assert.ok(result.files['src/app/api/v1/fleets/[id]/route.ts']);
  });

  it('validates architectural layer boundaries and anti-slop compliance', () => {
    const prompt = 'Create an e-commerce backend with Products and Orders';
    const ast = SemanticEngine.parsePromptToAST(prompt);
    const result = BackendSynthesizer.synthesize(prompt, ast);

    const archResult = ArchitectureValidator.validate(result.files);
    assert.equal(archResult.valid, true);
    assert.equal(archResult.violations.length, 0);
    assert.equal(archResult.score, 100);

    const secResult = SecurityValidator.validate(result.files, result.architecture);
    assert.equal(secResult.valid, true);
    assert.equal(secResult.violations.length, 0);
  });

  it('calculates multi-dimensional Backend Quality Score exceeding 90/100', () => {
    const prompt = 'Build an enterprise recruitment ATS system with Candidate, JobPost, and Interview entities';
    const ast = SemanticEngine.parsePromptToAST(prompt);
    const result = BackendSynthesizer.synthesize(prompt, ast);

    const qualityReport = BackendQualityValidator.evaluate(result.files, result.architecture);
    assert.ok(qualityReport.totalScore >= 90, `Quality score ${qualityReport.totalScore} should be >= 90`);
    assert.equal(qualityReport.passed, true);
    assert.ok(qualityReport.breakdown.security >= 90);
    assert.ok(qualityReport.breakdown.architecture >= 90);
  });

  it('executes /backend command via CommandRegistry and returns structured report', async () => {
    const registry = new CommandRegistry();
    const command = registry.getCommand('backend');
    assert.ok(command);
    assert.equal(command.name, 'backend');

    const result = await command.execute({}, ['Create a real-time multiplayer chess tournament platform']);
    assert.equal(result.success, true);
    assert.ok(result.data.qualityReport.totalScore >= 85);
    assert.ok(result.output.includes('PIXEL CREW — UNIVERSAL BACKEND ENGINEERING ENGINE'));
    assert.ok(result.output.includes('Quality Score'));
  });
});
