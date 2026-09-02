/**
 * PIXEL CREW — Threat Model Document Generator
 * 
 * Generates docs/security/threat-model.md detailing trust boundaries,
 * assets, threats, and architectural controls.
 */

export class ThreatModelDocumenter {
  /**
   * Generate Markdown Threat Model
   * @param {object} architecture 
   * @returns {string} Markdown document
   */
  static generateMarkdown(architecture = {}) {
    const tm = architecture.threatModel || {};
    const threats = tm.threats || [];
    const boundaries = tm.boundaries || [];
    const controls = tm.controls || [];

    return `# Application Security Architecture & Threat Model

**Standard:** ${tm.complianceStandard || 'Standard Web Security (OWASP Top 10 + ASVS)'}  
**Generated On:** ${new Date().toISOString().split('T')[0]}  
**Threat Risk Score:** ${tm.threatScore || 0}/100  

---

## 1. Trust Boundaries

${boundaries.map(b => `### Boundary: ${b.name}
- **Trust Level:** \`${b.trustLevel}\`
- **Enforced Controls:** ${b.controls.join(', ')}
`).join('\n')}

---

## 2. Identified Threats & Mitigations

| Threat ID | Asset | STRIDE Category | Severity | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- |
${threats.map(t => `| **${t.id}** | ${t.asset} | ${t.category} | \`${t.severity}\` | ${t.mitigation} |`).join('\n')}

---

## 3. Active Security Controls

${controls.map(c => `- \`[ACTIVE]\` **${c}**`).join('\n')}

---

## 4. Policy Directives

1. **Deny by Default**: Any endpoint or database query missing explicit session/ownership checks must fail closed.
2. **Untrusted Input**: All body payloads, query parameters, and headers are validated against runtime Zod schemas.
3. **Tenant Isolation**: In multi-tenant environments, every query enforces \`WHERE organization_id = session.orgId\`.
4. **Secret Protection**: Secrets are never hardcoded in source files and must resolve through \`src/config/env.ts\`.
`;
  }
}
