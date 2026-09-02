/**
 * PIXEL CREW — Pattern Selector
 * 
 * Selects applicable architectural patterns from the registry based on application requirements.
 */

import { BACKEND_PATTERNS } from './pattern-registry.js';

export class PatternSelector {
  /**
   * Select patterns for a given requirement model
   * @param {object} requirements 
   * @returns {Array<object>} Selected Patterns
   */
  static selectPatterns(requirements = {}) {
    const selected = [];

    // Always select modular monolith
    selected.push(BACKEND_PATTERNS.find(p => p.id === 'pat-modular-monolith'));

    if (requirements.performance?.paginationStrategy === 'cursor') {
      selected.push(BACKEND_PATTERNS.find(p => p.id === 'pat-cursor-pagination'));
    }

    if (requirements.performance?.caching) {
      selected.push(BACKEND_PATTERNS.find(p => p.id === 'pat-cache-aside'));
    }

    if (requirements.data?.transactions) {
      selected.push(BACKEND_PATTERNS.find(p => p.id === 'pat-idempotent-receiver'));
    }

    if (requirements.backgroundJobs?.required) {
      selected.push(BACKEND_PATTERNS.find(p => p.id === 'pat-transactional-outbox'));
    }

    return selected.filter(Boolean);
  }
}
