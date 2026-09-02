/**
 * PIXEL CREW — Threat Model Analyzer
 * 
 * Conducts automated, lightweight STRIDE threat modeling on application requirements
 * to derive required security controls, boundaries, and validation guards.
 */

export class ThreatAnalyzer {
  /**
   * Derive threat vectors and security controls from requirements
   * @param {object} requirements - SystemRequirementsModel
   * @param {object} ast - Semantic Project AST
   * @returns {object} ThreatModel
   */
  static analyze(requirements = {}, ast = {}) {
    const threats = [];
    const controls = [];
    const boundaries = [];

    const users = requirements.users || {};
    const data = requirements.data || {};
    const security = requirements.security || {};
    const api = requirements.api || {};

    // 1. Boundary: External Client -> API Layer
    boundaries.push({
      name: 'Internet to API Gateway',
      trustLevel: 'untrusted-to-trusted',
      controls: ['HTTPS/TLS', 'Strict Rate Limiting', 'Zod Schema Validation', 'CORS Policy', 'Security Headers']
    });

    // 2. Authentication & Credential Theft Threats
    if (users.authentication) {
      threats.push({
        id: 'THR-AUTH-001',
        asset: 'User Credentials & Session',
        category: 'Spoofing',
        threat: 'Credential theft, brute-force login attacks, or session hijacking',
        severity: 'High',
        mitigation: 'Argon2id password hashing, HTTP-only secure SameSite cookies, progressive delay brute-force limiter'
      });
      controls.push('session-cookie-hardening', 'auth-rate-limiting', 'password-hashing');
    }

    // 3. Multi-Tenant Cross-Tenant Access Threats
    if (security.tenantIsolation) {
      boundaries.push({
        name: 'Tenant Isolation Boundary',
        trustLevel: 'tenant-scoped',
        controls: ['Organization Context Middleware', 'Database WHERE organization_id filter', 'Policy Guard']
      });

      threats.push({
        id: 'THR-TENANT-001',
        asset: 'Tenant Data Isolation',
        category: 'Elevation of Privilege / Information Disclosure',
        threat: 'Cross-tenant IDOR (Insecure Direct Object Reference) access',
        severity: 'Critical',
        mitigation: 'Mandatory tenant context derived strictly from authenticated session; query-level organizationId scoping'
      });
      controls.push('tenant-context-extractor', 'query-tenant-scoper', 'tenant-policy-guard');
    }

    // 4. Data Tampering & Injection Threats
    threats.push({
      id: 'THR-DATA-001',
      asset: 'Relational Database State',
      category: 'Tampering / Injection',
      threat: 'SQL Injection or unvalidated payload pollution',
      severity: 'Critical',
      mitigation: 'ORM parameterized queries (Prisma), strict Zod input schemas with unknown key stripping'
    });
    controls.push('parameterized-queries', 'strict-input-validation');

    // 5. Transaction Race Conditions / Financial Double-Spend
    if (data.transactions) {
      threats.push({
        id: 'THR-RACE-001',
        asset: 'Financial / Inventory State',
        category: 'Tampering',
        threat: 'Concurrent race conditions causing double-spend or duplicate execution',
        severity: 'High',
        mitigation: 'ACID database transactions ($transaction), Idempotency-Key header validation, optimistic locking'
      });
      controls.push('idempotency-middleware', 'atomic-transactions', 'optimistic-locking');
    }

    // 6. Denial of Service / Resource Exhaustion
    if (api.rateLimiting) {
      threats.push({
        id: 'THR-DOS-001',
        asset: 'API Availability',
        category: 'Denial of Service',
        threat: 'API endpoint flooding and resource exhaustion',
        severity: 'Medium',
        mitigation: 'Token Bucket / Sliding Window rate limiting per IP / User / Tenant'
      });
      controls.push('rate-limiter');
    }

    // 7. Audit Log Tampering
    if (security.auditLogging) {
      threats.push({
        id: 'THR-AUDIT-001',
        asset: 'Compliance & Audit Trail',
        category: 'Repudiation',
        threat: 'Undetected administrative modifications or unauthorized data access',
        severity: 'Medium',
        mitigation: 'Append-only structured audit logs with actorId, IP, timestamp, and target entity metadata'
      });
      controls.push('audit-logger');
    }

    return {
      boundaries,
      threats,
      controls: Array.from(new Set(controls)),
      threatScore: threats.filter(t => t.severity === 'Critical').length * 25 + threats.filter(t => t.severity === 'High').length * 15,
      complianceStandard: security.sensitiveData ? 'SOC2 / HIPAA aligned' : 'Standard Web Security'
    };
  }
}
