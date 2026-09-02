/**
 * PIXEL CREW — Concurrency & Race Condition Analyzer
 * 
 * Detects race conditions in stateful entities (inventory, balance, slots)
 * and enforces optimistic locking or atomic database operations.
 */

export class ConcurrencyAnalyzer {
  /**
   * Analyze entities for race condition vulnerabilities
   * @param {Array<object>} entities 
   * @returns {Array<object>} Concurrency Controls
   */
  static analyze(entities = []) {
    const controls = [];

    entities.forEach(ent => {
      const fieldNames = (ent.fields || []).map(f => f.name.toLowerCase());
      const isSensitiveToRace = fieldNames.some(f => 
        f.includes('stock') || f.includes('inventory') || f.includes('balance') || f.includes('capacity') || f.includes('slot') || f.includes('status')
      );

      if (isSensitiveToRace) {
        controls.push({
          entity: ent.name,
          mechanism: 'Optimistic Locking with version field or Atomic Increment/Decrement',
          rationale: `Concurrent updates to ${ent.name} state must prevent lost updates or double-spend.`
        });
      }
    });

    return controls;
  }
}
