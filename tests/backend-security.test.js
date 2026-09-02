import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SecurityEngine } from '../src/backend/security/security-engine.js';
import { AuthorizationEngine } from '../src/backend/security/authorization-engine.js';
import { PolicyEngine } from '../src/backend/security/policy-engine.js';
import { SecretAnalyzer } from '../src/backend/security/secret-analyzer.js';
import { ErrorContract } from '../src/backend/api/error-contract.js';

describe('Universal Backend Security & Policy Engine', () => {
  it('generates security suite files for multi-tenant applications', () => {
    const arch = {
      security: { tenantIsolation: true, rateLimiting: true },
      authentication: { required: true }
    };

    const files = SecurityEngine.generateSecuritySuite(arch);
    assert.ok(files['src/middleware/auth.ts']);
    assert.ok(files['src/middleware/rate-limit.ts']);
    assert.ok(files['src/config/env.ts']);

    assert.ok(files['src/middleware/auth.ts'].includes('requireTenant'));
    assert.ok(files['src/middleware/rate-limit.ts'].includes('checkRateLimit'));
  });

  it('generates deny-by-default authorization policy files', () => {
    const entity = {
      name: 'Document',
      fields: [{ name: 'id', type: 'string' }, { name: 'title', type: 'string' }]
    };
    const arch = { database: { tenantIsolation: true } };

    const policyCode = AuthorizationEngine.generateEntityPolicy(entity, arch);
    assert.ok(policyCode.includes('export class DocumentPolicy'));
    assert.ok(policyCode.includes('canRead'));
    assert.ok(policyCode.includes('canDelete'));
    assert.ok(policyCode.includes('organizationId !== session.organizationId'));
  });

  it('detects policy violations and hardcoded secrets', () => {
    const badCode = `
      const query = "SELECT * FROM users WHERE email = '" + req.body.email + "'";
      const password = "admin_secret_password_12345";
    `;

    const violations = PolicyEngine.evaluateModule(badCode, 'src/user.service.ts');
    assert.ok(violations.some(v => v.rule === 'SEC-002-NO-HARDCODED-SECRETS'));

    const secretFindings = SecretAnalyzer.scanSecrets({
      'src/config.ts': 'const API_KEY = "sk_live_9876543210abcdef";'
    });
    assert.equal(secretFindings.length, 1);
  });

  it('synthesizes RFC 7807 Problem Details error classes', () => {
    const errorClasses = ErrorContract.generateErrorClasses();
    assert.ok(errorClasses.includes('export interface ProblemDetails'));
    assert.ok(errorClasses.includes('export class ValidationError extends AppError'));
    assert.ok(errorClasses.includes('export class NotFoundError extends AppError'));
    assert.ok(errorClasses.includes('export class ForbiddenError extends AppError'));
    assert.ok(errorClasses.includes('export function formatErrorResponse'));
  });
});
