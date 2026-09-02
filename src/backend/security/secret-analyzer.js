/**
 * PIXEL CREW — Secret Analyzer
 * 
 * Audits files and environment templates to ensure secrets are strictly isolated
 * from source control and validated via schema.
 */

export class SecretAnalyzer {
  /**
   * Scan codebase files for credential leakage
   * @param {object} files 
   * @returns {Array<object>} Secret Findings
   */
  static scanSecrets(files = {}) {
    const findings = [];
    const sensitivePatterns = [
      /API_KEY\s*=\s*['"][a-zA-Z0-9_\-]{8,}['"]/i,
      /SECRET\s*=\s*['"][a-zA-Z0-9_\-]{8,}['"]/i,
      /PRIVATE_KEY\s*=\s*['"][a-zA-Z0-9_\-]{8,}['"]/i,
      /DATABASE_URL\s*=\s*['"]postgres:\/\/[^:]+:[^@]+@/i
    ];

    Object.entries(files).forEach(([path, content]) => {
      if (path === '.env.example' || path.includes('test')) return;

      sensitivePatterns.forEach(pattern => {
        if (pattern.test(content)) {
          findings.push({
            file: path,
            pattern: pattern.toString(),
            message: 'Hardcoded sensitive credential pattern detected.'
          });
        }
      });
    });

    return findings;
  }
}
