import test from 'node:test';
import assert from 'node:assert/strict';
import { InputParser } from '../src/commands/parser.js';
import { CommandRegistry } from '../src/commands/registry.js';
import { DoctorCommand } from '../src/commands/doctor.js';
import { PlanCommand } from '../src/commands/plan.js';
import { SkillsCommand } from '../src/commands/skills.js';
import { CrewCommand } from '../src/commands/crew.js';
import { ReviewCommand } from '../src/commands/review.js';

test('InputParser tokenizes shell arguments and quotes correctly', () => {
  const tokens = InputParser.tokenize('/oneshot "Build modern website for an AI studio" --target nextjs');
  assert.equal(tokens.length, 4);
  assert.equal(tokens[0], '/oneshot');
  assert.equal(tokens[1], 'Build modern website for an AI studio');
  assert.equal(tokens[2], '--target');
  assert.equal(tokens[3], 'nextjs');
});

test('InputParser differentiates slash commands from chat intents', () => {
  const parsedCmd = InputParser.parse('/plan Create CRM dashboard with charts');
  assert.equal(parsedCmd.type, 'command');
  assert.equal(parsedCmd.command, 'plan');
  assert.equal(parsedCmd.args[0], 'Create');

  const parsedChatOneshot = InputParser.parse('Build a modern portfolio for an AI developer');
  assert.equal(parsedChatOneshot.type, 'chat');
  assert.equal(parsedChatOneshot.intent, 'oneshot');

  const parsedChatRefine = InputParser.parse('Make the hero section more editorial and clean');
  assert.equal(parsedChatRefine.type, 'chat');
  assert.equal(parsedChatRefine.intent, 'refine');
});

test('CommandRegistry provides autocomplete suggestions', () => {
  const registry = new CommandRegistry();

  const allSuggestions = registry.getAutocompleteSuggestions('/');
  assert.ok(allSuggestions.length >= 10);
  assert.ok(allSuggestions.some(s => s.name === '/assemble'));
  assert.ok(allSuggestions.some(s => s.name === '/blueprint'));
  assert.ok(allSuggestions.some(s => s.name === '/doctor'));

  const assMatch = registry.getAutocompleteSuggestions('/ass');
  assert.equal(assMatch.length, 1);
  assert.equal(assMatch[0].name, '/assemble');

  const onMatch = registry.getAutocompleteSuggestions('/on');
  assert.equal(onMatch.length, 1);
  assert.equal(onMatch[0].name, '/onboard');

  const planMatch = registry.getAutocompleteSuggestions('/p');
  assert.ok(planMatch.some(s => s.name === '/plan'));
});


test('CommandRegistry executes /doctor and /plan commands', async () => {
  const registry = new CommandRegistry();

  // Test /doctor
  const doctorRes = await registry.execute('/doctor');
  assert.equal(doctorRes.success, true);
  assert.ok(doctorRes.output.includes('PIXEL CREW — ENVIRONMENT & PROVIDER DIAGNOSTICS'));
  assert.ok(doctorRes.output.includes('Generic CLI Runner'));

  // Test /plan
  const planRes = await registry.execute('/plan Build modern portfolio for an AI engineer');
  assert.equal(planRes.success, true);
  assert.ok(planRes.data.spec);
  assert.ok(planRes.data.taskGraph.length > 0);
  assert.ok(planRes.output.includes('TASK GRAPH (DAG'));

  // Test /skills
  const skillsRes = await registry.execute('/skills frontend');
  assert.equal(skillsRes.success, true);
  assert.ok(skillsRes.output.includes('FRONTEND SKILLS'));

  // Test /review
  const reviewRes = await registry.execute('/review');
  assert.equal(reviewRes.success, true);
  assert.equal(reviewRes.data.evaluation.verdict, 'APPROVED_EXEMPLARY');
});

test('CommandRegistry executes master /pixelcrew dispatcher and Floor 42 command suite', async () => {
  const registry = new CommandRegistry();

  // 1. Master Help Overview
  const masterHelp = await registry.execute('/pixelcrew');
  assert.equal(masterHelp.success, true);
  assert.ok(masterHelp.output.includes('FLOOR 42 MULTI-AGENT COMMAND SUITE'));

  // 2. Swarm Creation commands
  const assembleRes = await registry.execute('/pixelcrew assemble Build an AI studio app');
  assert.equal(assembleRes.success, true);

  const blueprintRes = await registry.execute('/pixelcrew blueprint Real-time financial dashboard');
  assert.equal(blueprintRes.success, true);
  assert.ok(blueprintRes.output.includes('FLOOR 42 ARCHITECTURAL BLUEPRINT SPEC'));

  const bossFightRes = await registry.execute('/pixelcrew boss-fight Hydration mismatch in drawer');
  assert.equal(bossFightRes.success, true);
  assert.ok(bossFightRes.output.includes('BOSS FIGHT ENGAGED'));

  const manifestRes = await registry.execute('/pixelcrew manifest --dry-run');
  assert.equal(manifestRes.success, true);

  const retrofitRes = await registry.execute('/pixelcrew retrofit --dry-run');
  assert.equal(retrofitRes.success, true);
  assert.ok(retrofitRes.data.tokens);

  // 3. Design & Aesthetic commands
  const renderRes = await registry.execute('/pixelcrew render');
  assert.equal(renderRes.success, true);
  assert.equal(renderRes.data.evaluation.verdict, 'APPROVED_EXEMPLARY');

  const eightBitRes = await registry.execute('/pixelcrew 8bit');
  assert.equal(eightBitRes.success, true);
  assert.ok(eightBitRes.output.includes('RETRO DELIGHT'));

  const chromaticRes = await registry.execute('/pixelcrew chromatic cyber-cyan');
  assert.equal(chromaticRes.success, true);
  assert.ok(chromaticRes.data.tokens.accent);

  const bentoRes = await registry.execute('/pixelcrew bento hero');
  assert.equal(bentoRes.success, true);
  assert.ok(bentoRes.output.includes('ASYMMETRIC BENTO LAYOUT ARCHITECT'));

  const deSlopRes = await registry.execute('/pixelcrew de-slop hero');
  assert.equal(deSlopRes.success, true);
  assert.ok(deSlopRes.data.replacements.length > 0);

  const typesetRes = await registry.execute('/pixelcrew typeset editorial-tech');
  assert.equal(typesetRes.success, true);
  assert.ok(typesetRes.data.scales.hero);

  const overdriveRes = await registry.execute('/pixelcrew overdrive');
  assert.equal(overdriveRes.success, true);
  assert.ok(overdriveRes.output.includes('EXTRAORDINARY TECHNICAL EFFECTS'));

  // 4. Engineering & Quality commands
  const sentinelRes = await registry.execute('/pixelcrew sentinel');
  assert.equal(sentinelRes.success, true);
  assert.ok(sentinelRes.output.includes('DEFENSIVE RESILIENCE HARDENING'));

  const warpRes = await registry.execute('/pixelcrew warp');
  assert.equal(warpRes.success, true);

  const calibrateRes = await registry.execute('/pixelcrew calibrate mobile');
  assert.equal(calibrateRes.success, true);

  const auditRes = await registry.execute('/pixelcrew audit');
  assert.equal(auditRes.success, true);
  assert.ok(auditRes.data.checks.length >= 5);

  const polishRes = await registry.execute('/pixelcrew polish');
  assert.equal(polishRes.success, true);

  const onboardRes = await registry.execute('/pixelcrew onboard');
  assert.equal(onboardRes.success, true);

  const officeRes = await registry.execute('/pixelcrew office 4747');
  assert.equal(officeRes.success, true);
  assert.ok(officeRes.data.url.includes('4747'));

  const rosterRes = await registry.execute('/pixelcrew roster list');
  assert.equal(rosterRes.success, true);

  // 5. Direct slash alias invocations
  const directAssemble = await registry.execute('/assemble Test app');
  assert.equal(directAssemble.success, true);

  const directBossFight = await registry.execute('/boss-fight Fix navbar');
  assert.equal(directBossFight.success, true);

  const direct8bit = await registry.execute('/8bit');
  assert.equal(direct8bit.success, true);

  const directSentinel = await registry.execute('/sentinel');
  assert.equal(directSentinel.success, true);

  const directRender = await registry.execute('/render');
  assert.equal(directRender.success, true);
});


