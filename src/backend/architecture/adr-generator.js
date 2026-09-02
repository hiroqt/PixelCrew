/**
 * PIXEL CREW — Architecture Decision Record (ADR) Generator
 * 
 * Generates standard Markdown Architecture Decision Records (docs/architecture/ADR-*.md)
 * making generated systems explainable, transparent, and maintainable by humans.
 */

import { TradeoffAnalyzer } from './tradeoff-analyzer.js';

export class ADRGenerator {
  /**
   * Generate complete set of ADR Markdown files
   * @param {object} spec - ArchitectureSpecification
   * @returns {object} Map of filename -> Markdown content
   */
  static generateADRs(spec = {}) {
    const tradeoffs = TradeoffAnalyzer.analyzeTradeoffs(spec);
    const files = {};
    const dateStr = new Date().toISOString().split('T')[0];

    tradeoffs.forEach((t, index) => {
      const num = String(index + 1).padStart(3, '0');
      const slug = t.decision.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 40);
      const filename = `docs/architecture/ADR-${num}-${slug}.md`;

      const md = `# ADR-${num}: ${t.decision}

**Status:** Accepted  
**Date:** ${dateStr}  
**Context / Reason:** ${t.reason}  

---

## 1. Decision

We will adopt:
> **${t.decision}**

## 2. Benefits & Positives

${t.benefits.map(b => `- **Positive**: ${b}`).join('\n')}

## 3. Costs & Overhead

${t.costs.map(c => `- **Tradeoff**: ${c}`).join('\n')}

## 4. Alternatives Considered

${t.alternatives.map(a => `- ${a}`).join('\n')}

## 5. Risk & Mitigation Strategy

- **Identified Risk:** ${t.risk}
- **Mitigation:** ${t.mitigation}
`;

      files[filename] = md;
    });

    return files;
  }
}
