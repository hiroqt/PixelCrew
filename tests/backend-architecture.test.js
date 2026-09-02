import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ArchitectureReasoner } from '../src/backend/architecture/architecture-reasoner.js';
import { ArchitectureSelector } from '../src/backend/architecture/architecture-selector.js';
import { TradeoffAnalyzer } from '../src/backend/architecture/tradeoff-analyzer.js';
import { ADRGenerator } from '../src/backend/architecture/adr-generator.js';

describe('Universal Backend Architecture Reasoner & Decisions', () => {
  it('reasons appropriate architecture specification for modular applications', () => {
    const prompt = 'Build a clinic appointment booking system with doctors and patient medical histories';
    const ast = {
      appName: 'CarePulse',
      domain: 'healthcare',
      entities: [{ name: 'Doctor' }, { name: 'Appointment' }, { name: 'Patient' }]
    };

    const arch = ArchitectureReasoner.reason(prompt, ast);
    assert.ok(arch.style.includes('modular-monolith'));
    assert.equal(arch.database.orm, 'prisma');
    assert.equal(arch.database.transactions, true);
    assert.equal(arch.api.errorHandling, 'rfc-7807');
    assert.ok(arch.security.controls.length > 0);
  });

  it('selects coherent technology stack and documents trade-offs', () => {
    const arch = {
      style: 'modular-monolith-with-workers',
      tier: 'medium',
      complexityScore: 48,
      authentication: { required: true, strategy: 'session-cookie' },
      cache: { required: true, technology: 'redis' },
      database: { type: 'postgresql', orm: 'prisma' }
    };

    const stack = ArchitectureSelector.selectStack(arch);
    assert.equal(stack.runtime.framework, 'Next.js 14/15 App Router + Route Handlers');
    assert.equal(stack.database.orm, 'Prisma ORM');
    assert.equal(stack.validation.library, 'Zod');

    const tradeoffs = TradeoffAnalyzer.analyzeTradeoffs(arch);
    assert.ok(tradeoffs.length >= 3);
    assert.ok(tradeoffs.some(t => t.decision.includes('modular-monolith')));
    assert.ok(tradeoffs.some(t => t.decision.includes('PostgreSQL')));
  });

  it('generates standard Architecture Decision Records (ADRs)', () => {
    const arch = {
      style: 'modular-monolith',
      tier: 'low',
      complexityScore: 25,
      authentication: { required: true, strategy: 'session-cookie' },
      database: { type: 'postgresql', orm: 'prisma' }
    };

    const adrs = ADRGenerator.generateADRs(arch);
    const filenames = Object.keys(adrs);
    assert.ok(filenames.length >= 2);
    assert.ok(filenames[0].startsWith('docs/architecture/ADR-001-'));

    const adrContent = adrs[filenames[0]];
    assert.ok(adrContent.includes('# ADR-001:'));
    assert.ok(adrContent.includes('## 1. Decision'));
    assert.ok(adrContent.includes('## 2. Benefits & Positives'));
    assert.ok(adrContent.includes('## 5. Risk & Mitigation Strategy'));
  });
});
