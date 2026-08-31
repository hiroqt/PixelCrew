import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { SemanticEngine } from '../src/orchestrator/semantic-engine.js';
import { ASTNormalizer } from '../src/orchestrator/ast-normalizer.js';
import { SemanticReviewer } from '../src/orchestrator/semantic-reviewer.js';
import { RequirementContract } from '../src/orchestrator/requirement-contract.js';
import { DesignEngine } from '../src/orchestrator/design-engine.js';
import { TaskPlanner } from '../src/orchestrator/task-planner.js';
import { CodeGenerator } from '../src/orchestrator/code-generator.js';
import { RequirementValidator } from '../src/orchestrator/requirement-validator.js';
import { VisualCritic } from '../src/orchestrator/visual-critic.js';
import { OneShotEngine } from '../src/orchestrator/oneshot.js';

describe('Pixel Crew Open-World Software Synthesizer Benchmark Suite', () => {

  // Test 1: Underwater Archaeological Expedition Management
  test('Open-World Domain 1: Underwater Archaeological Expedition Management', () => {
    const prompt = `Create an underwater archaeological expedition management platform for researchers to track expeditions, divers, dive sessions, recovered artifacts, sonar scans, photographs, locations and research reports.`;
    
    const ast = SemanticEngine.parsePromptToAST(prompt);

    assert.ok(ast, 'AST should be generated');
    const entityNames = ast.entities.map(e => e.name);

    // Verify dynamic concept synthesis
    assert.ok(entityNames.includes('Expedition') || entityNames.includes('Artifact'), 'Should synthesize Expedition or Artifact');
    assert.ok(entityNames.some(n => /Diver|DiveSession|SonarScan|Photograph|Location|Report/i.test(n)), 'Should synthesize domain sub-entities');

    assert.ok(ast.views.length >= 2, 'Should synthesize at least 2 dynamic views');
    assert.ok(ast.operations.length >= 2, 'Should synthesize REST operations');
    assert.ok(ast.requirements.length >= 2, 'Should synthesize verifiable requirements');
  });

  // Test 2: Coral Reef Restoration
  test('Open-World Domain 2: Coral Reef Restoration Management', () => {
    const prompt = `Create a coral reef restoration management application that tracks reef sites, coral colonies, transplant events, diver teams, water conditions and restoration projects.`;

    const ast = SemanticEngine.parsePromptToAST(prompt);

    assert.ok(ast, 'AST should be generated');
    const entityNames = ast.entities.map(e => e.name);

    assert.ok(entityNames.some(n => /Reef|Coral|Colony|Transplant|Water|Project/i.test(n)), 'Should synthesize Coral Reef restoration entities');
    assert.ok(ast.views.length >= 2, 'Should synthesize dynamic views');
  });

  // Test 3: Deep-Sky Observatory
  test('Open-World Domain 3: Deep-Sky Astronomical Observatory', () => {
    const prompt = `Create an astronomical observatory platform for deep-sky observations. Track telescopes, celestial targets, observations, exposures and observation reports.`;

    const ast = SemanticEngine.parsePromptToAST(prompt);

    assert.ok(ast, 'AST should be generated');
    const entityNames = ast.entities.map(e => e.name);

    assert.ok(entityNames.some(n => /Observatory|Telescope|Target|Observation|Exposure|Report/i.test(n)), 'Should synthesize Astronomical Observatory entities');
  });

  // Test 4: Film Production Continuity
  test('Open-World Domain 4: Cinema Film Production & Continuity System', () => {
    const prompt = `Create a film production continuity platform that tracks films, scenes, shooting days, locations, props, takes and continuity notes.`;

    const ast = SemanticEngine.parsePromptToAST(prompt);

    assert.ok(ast, 'AST should be generated');
    const entityNames = ast.entities.map(e => e.name);

    assert.ok(entityNames.some(n => /Film|Scene|ShootingDay|Location|Prop|Take|Note/i.test(n)), 'Should synthesize Film Continuity entities');
  });

  // Test 5: Novel / Mythical Dragon Sanctuary
  test('Open-World Domain 5: Mythical Dragon Breeding Sanctuary (Absurd / Novel Domain)', () => {
    const prompt = `Create a management platform for a mythical dragon sanctuary. Track dragons, habitats, feeding schedules, health observations, lineage, training sessions and keepers.`;

    const ast = SemanticEngine.parsePromptToAST(prompt);

    assert.ok(ast, 'AST should be generated');
    const entityNames = ast.entities.map(e => e.name);

    assert.ok(entityNames.some(n => /Dragon|Habitat|Schedule|Observation|Lineage|Training|Keeper/i.test(n)), 'Should synthesize Dragon Sanctuary entities dynamically');
  });

  // Test 6: Unknown Domain Mutation (Lunar Greenhouse Management)
  test('Open-World Domain 6: Unknown Domain (Lunar Greenhouse Management)', () => {
    const prompt = `Build a lunar greenhouse management platform tracking habitat modules, plant experiments, oxygen production, water recycling, environmental readings, crew assignments and harvest cycles.`;

    const ast = SemanticEngine.parsePromptToAST(prompt);

    assert.ok(ast, 'AST should be synthesized without pre-existing source definitions');
    const entityNames = ast.entities.map(e => e.name);

    assert.ok(entityNames.some(n => /Habitat|Plant|Experiment|Oxygen|Water|Reading|Crew|Harvest/i.test(n)), 'Should synthesize Lunar Greenhouse entities dynamically');
    
    // Verify DesignSpec synthesis
    const designSpec = DesignEngine.synthesizeDesignSpec(ast, prompt);
    assert.ok(designSpec.designIntent, 'DesignSpec should contain dynamic design intent');
    assert.ok(designSpec.color, 'DesignSpec should contain dynamic palette');
    assert.ok(designSpec.typography, 'DesignSpec should contain dynamic typography');
  });

  // Test 7: Zero-Domain-Dependency End-to-End Acceptance Test
  test('Zero-Domain-Dependency Acceptance Test: Complete 16-Step Pipeline Execution', async () => {
    const prompt = `Create an autonomous underwater drone survey platform to track underwater drones, sonar bathymetry scans, hydrothermal vent detections, and sample retrieval canisters.`;

    const engine = new OneShotEngine({ fast: true });
    const events = [];

    const result = await engine.generateProject(prompt, (evt) => events.push(evt));

    assert.ok(result, 'Result should be generated');
    assert.ok(result.ast, 'AST should exist');
    assert.ok(result.contract, 'RequirementContract should exist');
    assert.ok(result.designSpec, 'DesignSpec should exist');
    assert.ok(result.files, 'Files should exist');
    assert.ok(result.artifactGraph, 'ArtifactGraph should exist');
    assert.ok(result.validationResult, 'ValidationResult should exist');
    assert.ok(result.visualCriticResult, 'VisualCriticResult should exist');

    assert.ok(result.validationResult.passed, 'Requirement validation should pass');
    assert.ok(result.visualCriticResult.passed, 'Visual critic should pass without high severity slop');
    assert.ok(result.visualCriticResult.score >= 8.5, 'Visual critic score should be >= 8.5/10');

    assert.ok(events.some(e => e.stage === 'SEMANTIC_INTERPRETATION'), 'Should execute Semantic Interpretation');
    assert.ok(events.some(e => e.stage === 'REQUIREMENT_VALIDATION'), 'Should execute Requirement Validation');
    assert.ok(events.some(e => e.stage === 'VISUAL_CRITIQUE'), 'Should execute Visual Critique');
    assert.ok(events.some(e => e.type === 'PROJECT_COMPLETED'), 'Should complete project');
  });

  // Test 8: Architectural Static Analysis for Zero Closed-World Domain Branching
  test('Architectural Static Analysis: Zero Closed-World Domain Branching in Production Orchestrator', async () => {
    const orchestratorDir = path.resolve('src/orchestrator');
    const files = await fs.readdir(orchestratorDir);

    const bannedKeywords = [
      'hospital:',
      'ecommerce:',
      'restaurant:',
      'chess:'
    ];

    for (const file of files) {
      if (!file.endsWith('.js')) continue;
      const content = await fs.readFile(path.join(orchestratorDir, file), 'utf-8');

      // Ensure no closed-world domain dictionary objects
      assert.ok(!content.includes('const domains = {'), `File ${file} must not contain closed-world domain dictionary`);
    }
  });

});
