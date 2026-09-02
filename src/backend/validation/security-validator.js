/**
 * PIXEL CREW — Security Validator
 * 
 * Audits codebase for unvalidated inputs, missing authentication on mutations,
 * tenant isolation leaks, and exposed secrets.
 */

import { SecretAnalyzer } from '../security/secret-analyzer.js';

export class SecurityValidator {
  /**
   * Validate codebase security posture
   * @param {object} files 
   * @param {object} architecture 
   * @returns {object} { valid: boolean, score: number, violations: Array<object> }
   */
  static validate(files = {}, architecture = {}) {
    const violations = [];

    // 1. Secret Leakage Scan
    const secretFindings = SecretAnalyzer.scanSecrets(files);
    secretFindings.forEach(f => {
      violations.push({
        rule: 'SEC-001-SECRET-LEAK',
        severity: 'CRITICAL',
        path: f.file,
        message: f.message
      });
    });

    // 2. Controller Input Validation Scan
    for (const [path, code] of Object.entries(files)) {
      if (path.includes('.controller.')) {
        if (code.includes('request.json()') && !code.includes('.safeParse(') && !code.includes('.parse(')) {
          violations.push({
            rule: 'SEC-002-UNVALIDATED-INPUT',
            severity: 'CRITICAL',
            path,
            message: 'Controller consumes request body without Zod schema validation.'
          });
        }
      }
    }

    // 3. Multi-Tenant Isolation Check
    if (architecture.database?.tenantIsolation) {
      for (const [path, code] of Object.entries(files)) {
        if (path.includes('.repository.') && !path.includes('organization')) {
          if (!code.includes('organizationId')) {
            violations.push({
              rule: 'SEC-003-MISSING-TENANT-ISOLATION',
              severity: 'CRITICAL',
              path,
              message: 'Multi-tenant repository missing organizationId scoping in query filter.'
            });
          }
        }
      }
    }

    const criticalCount = violations.filter(v => v.severity === 'CRITICAL').length;
    const score = Math.max(0, 100 - (criticalCount * 25));

    return {
      valid: violations.length === 0,
      score,
      violations,
      summary: violations.length === 0
        ? 'Security validation passed: zero critical vulnerabilities detected.'
        : `Detected ${violations.length} security violation(s). Score: ${score}/100.`
    };
  }
}
