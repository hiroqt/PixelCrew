/**
 * PIXEL CREW — Security Policy Engine
 * 
 * Enforces declarative security rules on generated backend modules.
 */

export class PolicyEngine {
  /**
   * Evaluate a synthesized code module against security policies
   * @param {string} code 
   * @param {string} path 
   * @returns {Array<object>} Policy Violations
   */
  static evaluateModule(code = '', path = '') {
    const violations = [];

    // Rule 1: No inline SQL injection risks
    if (code.includes('$queryRawUnsafe') || /SELECT\s+.*\s+FROM\s+.*\$\{/i.test(code)) {
      violations.push({
        rule: 'SEC-001-PARAM-QUERIES',
        severity: 'CRITICAL',
        message: 'Unsafe raw SQL interpolation detected. Must use parameterized queries or ORM methods.',
        path
      });
    }

    // Rule 2: No hardcoded secrets
    if (/password\s*=\s*['"][a-zA-Z0-9_-]{4,}['"]/i.test(code) && !path.includes('test')) {
      violations.push({
        rule: 'SEC-002-NO-HARDCODED-SECRETS',
        severity: 'CRITICAL',
        message: 'Potential hardcoded password/secret detected.',
        path
      });
    }

    // Rule 3: No console.log in production code (should use structured logger)
    if (code.includes('console.log(') && !path.includes('test') && !path.includes('script')) {
      violations.push({
        rule: 'SEC-003-STRUCTURED-LOGGING',
        severity: 'MEDIUM',
        message: 'Direct console.log usage detected. Use structured logger to prevent PII leakage.',
        path
      });
    }

    return violations;
  }
}
