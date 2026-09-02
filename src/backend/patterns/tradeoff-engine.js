/**
 * PIXEL CREW — Pattern Tradeoff Engine
 * 
 * Formulates structured decision matrices for all selected patterns.
 */

export class TradeoffEngine {
  static formatTradeoffMatrix(patterns = []) {
    return patterns.map(p => ({
      pattern: p.name,
      category: p.category,
      benefit: p.benefits[0] || 'Optimized performance',
      cost: p.tradeoffs[0] || 'Additional abstraction',
      mitigation: p.mitigation || 'Automated policy validation'
    }));
  }
}
