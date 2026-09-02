/**
 * PIXEL CREW — Query Analyzer Engine
 * 
 * Inspects access patterns across entity relations to detect N+1 queries,
 * unnecessary full table scans, and advises on eager loading / select projections.
 */

export class QueryAnalyzer {
  /**
   * Analyze entity relations and generate query optimization strategies
   * @param {Array<object>} entities 
   * @returns {object} Query Optimization Strategies
   */
  static analyzeQueries(entities = []) {
    const strategies = {};

    entities.forEach(ent => {
      const relations = ent.relationships || [];
      const includeClauses = {};
      const warnings = [];

      relations.forEach(rel => {
        const target = rel.targetEntity;
        if (rel.type === 'belongsTo') {
          includeClauses[target.toLowerCase()] = true;
        } else if (rel.type === 'hasMany') {
          warnings.push(`Potential N+1 query when listing ${ent.name} and traversing ${target}. Use explicit 'include' or DataLoader.`);
        }
      });

      strategies[ent.name] = {
        defaultSelect: ent.fields.map(f => f.name),
        safeInclude: includeClauses,
        warnings,
        batchingRecommended: relations.some(r => r.type === 'hasMany')
      };
    });

    return strategies;
  }
}
