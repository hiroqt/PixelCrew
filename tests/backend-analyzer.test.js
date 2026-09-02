import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { RequirementAnalyzer } from '../src/backend/analyzer/requirement-analyzer.js';
import { ComplexityAnalyzer } from '../src/backend/analyzer/complexity-analyzer.js';
import { ThreatAnalyzer } from '../src/backend/analyzer/threat-analyzer.js';

describe('Universal Backend Requirement & Complexity Analyzers', () => {
  it('analyzes small application requirements without over-engineering', () => {
    const prompt = 'Create a personal markdown note-taking app';
    const ast = { appName: 'QuickNotes', domain: 'productivity', entities: [{ name: 'Note' }] };

    const reqs = RequirementAnalyzer.analyze(prompt, ast);
    assert.equal(reqs.application.expectedScale, 'low');
    assert.equal(reqs.security.tenantIsolation, false);
    assert.equal(reqs.backgroundJobs.required, false);

    const complexity = ComplexityAnalyzer.analyze(reqs, ast);
    assert.equal(complexity.tier, 'low');
    assert.equal(complexity.recommendedStyle, 'modular-monolith');
    assert.ok(complexity.disallowedInfrastructure.includes('microservices'));
  });

  it('analyzes multi-tenant B2B SaaS requirements', () => {
    const prompt = 'Build a multi-tenant B2B customer support workspace with organizations, roles, and automated email notifications';
    const ast = {
      appName: 'HelpDeck',
      domain: 'saas',
      entities: [{ name: 'Organization' }, { name: 'Ticket' }, { name: 'User' }],
      actors: [{ name: 'Admin' }, { name: 'Agent' }, { name: 'Customer' }]
    };

    const reqs = RequirementAnalyzer.analyze(prompt, ast);
    assert.equal(reqs.security.tenantIsolation, true);
    assert.equal(reqs.users.authentication, true);
    assert.equal(reqs.users.roles, true);
    assert.equal(reqs.backgroundJobs.required, true);
    assert.ok(reqs.backgroundJobs.tasks.includes('send-notifications'));

    const complexity = ComplexityAnalyzer.analyze(reqs, ast);
    assert.ok(complexity.totalScore >= 35);
    assert.ok(['medium', 'high'].includes(complexity.tier));
    assert.ok(complexity.allowedInfrastructure.includes('bullmq') || complexity.allowedInfrastructure.includes('redis'));
  });

  it('conducts automated STRIDE threat analysis and derives security controls', () => {
    const reqs = {
      users: { authentication: true, roles: true },
      security: { tenantIsolation: true, sensitiveData: true, auditLogging: true },
      data: { transactions: true }
    };

    const threatModel = ThreatAnalyzer.analyze(reqs, {});
    assert.ok(threatModel.threats.length >= 4);
    assert.ok(threatModel.boundaries.some(b => b.name.includes('Tenant')));
    assert.ok(threatModel.controls.includes('tenant-context-extractor'));
    assert.ok(threatModel.controls.includes('idempotency-middleware'));
    assert.ok(threatModel.controls.includes('password-hashing'));
  });
});
