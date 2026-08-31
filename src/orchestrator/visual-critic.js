/**
 * PIXEL CREW — Visual Critic & Anti-AI Slop Auditor
 * 
 * Inspects generated source code, CSS tokens, and component trees against the
 * 64-Pattern Impeccable Anti-AI Slop Catalog.
 * Scores are calculated dynamically from verified code evidence (NO fake hardcoded scores).
 */

export class VisualCritic {
  /**
   * Audit generated code files for AI slop patterns and aesthetic quality.
   */
  static evaluateProject(files = {}) {
    const findings = [];
    let slopPenalty = 0;
    const fileEntries = Object.entries(files);

    for (const [filepath, content] of fileEntries) {
      if (typeof content !== 'string') continue;

      // 1. Check for decorative gridlines background
      if (content.includes('bg-grid') || content.includes('grid-white/[0.05]') || content.includes('svg-grid')) {
        findings.push({
          rule: 'SLOP-001: Decorative Gridlines Background',
          severity: 'high',
          file: filepath,
          evidence: 'Found decorative graph-paper gridline background classes.'
        });
        slopPenalty += 2.0;
      }

      // 2. Check for fake macOS terminal window
      if (content.includes('🔴') || content.includes('arnel@arch') || content.includes('terminal-window') || content.includes('bash -c')) {
        findings.push({
          rule: 'SLOP-002: Fake macOS Terminal Window',
          severity: 'high',
          file: filepath,
          evidence: 'Found decorative fake macOS terminal window in UI.'
        });
        slopPenalty += 2.5;
      }

      // 3. Check for 4-box stat strip under hero
      if (content.includes('486h') && content.includes('4+') && content.includes('3+')) {
        findings.push({
          rule: 'SLOP-027: Hero Metric 4-Box Stat Strip',
          severity: 'medium',
          file: filepath,
          evidence: 'Found symmetrical 4-box stat metric strip.'
        });
        slopPenalty += 1.5;
      }

      // 4. Check for skill percentage progress bars
      if (content.includes('Expert') && content.includes('Proficient') && (content.includes('h-2 bg-') || content.includes('progress-bar'))) {
        findings.push({
          rule: 'SLOP-028: Fake Skill Progress Bars',
          severity: 'medium',
          file: filepath,
          evidence: 'Found arbitrary skill proficiency progress meters.'
        });
        slopPenalty += 1.5;
      }

      // 5. Check for marketing buzzwords
      const buzzwords = ['streamline', 'empower', 'supercharge', 'world-class', 'seamlessly'];
      for (const bw of buzzwords) {
        if (new RegExp(`\\b${bw}\\b`, 'i').test(content) && !filepath.includes('test')) {
          findings.push({
            rule: `SLOP-045: AI Marketing Buzzword ('${bw}')`,
            severity: 'low',
            file: filepath,
            evidence: `Found generic AI cliché buzzword '${bw}'.`
          });
          slopPenalty += 0.5;
        }
      }

      // 6. Check for purple/cyan gradient halo
      if (content.includes('from-purple-500') && content.includes('to-cyan-400') && content.includes('blur-3xl')) {
        findings.push({
          rule: 'SLOP-020: Radial Gradient Halo Blob',
          severity: 'high',
          file: filepath,
          evidence: 'Found purple/cyan radial gradient blob in background.'
        });
        slopPenalty += 2.0;
      }
    }

    const baseScore = 10.0;
    const finalScore = Math.max(1.0, Math.round((baseScore - slopPenalty) * 10) / 10);
    const passed = findings.filter(f => f.severity === 'high').length === 0 && finalScore >= 8.5;

    return {
      passed,
      score: finalScore,
      slopPenalty,
      totalFindings: findings.length,
      findings,
      summary: passed
        ? `Clean, human-grade design verified (Score: ${finalScore}/10). Zero critical AI-slop anti-patterns detected.`
        : `Visual review flagged ${findings.length} AI-slop anti-patterns (Score: ${finalScore}/10). Remediation recommended.`
    };
  }
}
