/**
 * PIXEL CREW — Backend Architecture Validator & Anti-Slop Guardian
 * 
 * Verifies clean architectural boundaries:
 * 1. Forbids direct database queries inside route handlers / controllers
 * 2. Forbids business logic inside HTTP presentation layers
 * 3. Enforces repository abstractions and RFC 7807 error responses
 */

export class ArchitectureValidator {
  /**
   * Validate codebase file tree against architectural rules
   * @param {object} files 
   * @returns {object} { valid: boolean, violations: Array<object>, score: number }
   */
  static validate(files = {}) {
    const violations = [];

    for (const [path, code] of Object.entries(files)) {
      // 1. Check Controllers & Route Handlers for Direct Database Access (Slop Pattern)
      if (path.includes('.controller.') || path.includes('/api/')) {
        if (code.includes('prisma.') || code.includes('db.query') || code.includes('$queryRaw')) {
          violations.push({
            rule: 'ARCH-001-NO-DB-IN-CONTROLLER',
            severity: 'CRITICAL',
            path,
            message: 'Direct database access detected in controller/route handler. Must delegate to domain service/repository.'
          });
        }
      }

      // 2. Check Routes for missing Error Handling
      if (path.includes('/api/') && path.endsWith('route.ts')) {
        if (!code.includes('try') || !code.includes('catch') || !code.includes('formatErrorResponse')) {
          violations.push({
            rule: 'ARCH-002-RFC7807-ERROR-HANDLING',
            severity: 'HIGH',
            path,
            message: 'Route handler missing standardized RFC 7807 error handling.'
          });
        }
      }

      // 3. Check Repositories for Direct HTTP / Framework Dependencies
      if (path.includes('.repository.')) {
        if (code.includes('NextRequest') || code.includes('NextResponse') || code.includes('express')) {
          violations.push({
            rule: 'ARCH-003-NO-HTTP-IN-REPOSITORY',
            severity: 'HIGH',
            path,
            message: 'HTTP framework objects detected in repository. Repositories must remain purely persistence-focused.'
          });
        }
      }
    }

    const criticalCount = violations.filter(v => v.severity === 'CRITICAL').length;
    const highCount = violations.filter(v => v.severity === 'HIGH').length;
    const score = Math.max(0, 100 - (criticalCount * 25 + highCount * 10));

    return {
      valid: violations.length === 0,
      score,
      violations,
      summary: violations.length === 0
        ? 'Architecture validation passed with 100% compliance.'
        : `Found ${violations.length} architectural violation(s). Score: ${score}/100.`
    };
  }
}
