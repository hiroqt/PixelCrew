/**
 * PIXEL CREW — Cache Strategy Analyzer
 * 
 * Determines when caching is justified and generates key schemas and TTL policies.
 */

export class CacheAnalyzer {
  /**
   * Derive caching strategy and keys
   * @param {Array<object>} entities 
   * @param {object} architecture 
   * @returns {Array<object>} Cache Policies
   */
  static analyzeCachePolicies(entities = [], architecture = {}) {
    const policies = [];

    entities.forEach(ent => {
      const lower = ent.name.toLowerCase();
      policies.push({
        entity: ent.name,
        itemKeyPattern: `${lower}:item:\${id}`,
        listKeyPattern: `${lower}:list:\${tenantId || 'global'}:\${queryHash}`,
        ttlSeconds: 300,
        invalidationTriggers: ['create', 'update', 'delete'],
        strategy: 'Cache-Aside with Explicit Invalidation'
      });
    });

    return policies;
  }
}
