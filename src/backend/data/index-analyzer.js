/**
 * PIXEL CREW — Dynamic Database Index Analyzer
 * 
 * Inspects entity relationships, expected query filters, sorting, and tenant boundaries
 * to synthesize optimal single, compound, and covering database indexes.
 */

export class IndexAnalyzer {
  /**
   * Derive index definitions for entities
   * @param {Array<object>} entities 
   * @param {object} architecture 
   * @returns {object} Map of entityName -> Array<IndexDefinition>
   */
  static deriveIndexes(entities = [], architecture = {}) {
    const isMultiTenant = Boolean(architecture.database?.tenantIsolation);
    const indexMap = {};

    entities.forEach(ent => {
      const indexes = [];
      const fields = ent.fields || [];
      const fieldNames = new Set(fields.map(f => f.name));

      // 1. Foreign Keys MUST be indexed to prevent table scans on JOINs
      fields.forEach(f => {
        if (f.name.endsWith('Id') && f.name !== 'id') {
          indexes.push({
            name: `idx_${ent.name.toLowerCase()}_${f.name.toLowerCase()}`,
            fields: [f.name],
            type: 'btree',
            rationale: `Foreign key index for ${f.name} lookups and joins`
          });
        }
      });

      // 2. Multi-Tenant Compound Indexes: (organizationId, createdAt DESC) or (organizationId, status)
      if (isMultiTenant && fieldNames.has('organizationId')) {
        if (fieldNames.has('createdAt')) {
          indexes.push({
            name: `idx_${ent.name.toLowerCase()}_org_created`,
            fields: ['organizationId', 'createdAt'],
            type: 'btree',
            rationale: 'Optimizes tenant-scoped temporal ordering and cursor pagination'
          });
        }
        if (fieldNames.has('status')) {
          indexes.push({
            name: `idx_${ent.name.toLowerCase()}_org_status`,
            fields: ['organizationId', 'status'],
            type: 'btree',
            rationale: 'Optimizes tenant-scoped status filtering'
          });
        }
      } else {
        // Single-tenant temporal index
        if (fieldNames.has('status') && fieldNames.has('createdAt')) {
          indexes.push({
            name: `idx_${ent.name.toLowerCase()}_status_created`,
            fields: ['status', 'createdAt'],
            type: 'btree',
            rationale: 'Optimizes filtering by status with created_at sorting'
          });
        }
      }

      // 3. Search / Slug Indexes
      if (fieldNames.has('slug') && !indexes.some(i => i.fields.includes('slug'))) {
        indexes.push({
          name: `idx_${ent.name.toLowerCase()}_slug`,
          fields: ['slug'],
          type: 'btree',
          unique: true,
          rationale: 'Fast unique lookup by URL slug'
        });
      }

      // Deduplicate indexes by field sequence
      const seen = new Set();
      const uniqueIndexes = [];
      indexes.forEach(idx => {
        const key = idx.fields.join(',');
        if (!seen.has(key)) {
          seen.add(key);
          uniqueIndexes.push(idx);
        }
      });

      indexMap[ent.name] = uniqueIndexes;
    });

    return indexMap;
  }
}
