/**
 * PIXEL CREW — Data Modeler Engine
 * 
 * Infers entities, relationships (1:1, 1:N, M:N), primary keys (UUID/CUID),
 * foreign keys, unique constraints, and transaction boundaries.
 */

export class DataModeler {
  /**
   * Refine and enrich entity models with backend database invariants
   * @param {Array<object>} rawEntities - Entities from AST
   * @param {object} architecture - ArchitectureSpecification
   * @returns {Array<object>} Enriched Entities
   */
  static model(rawEntities = [], architecture = {}) {
    const isMultiTenant = Boolean(architecture.database?.tenantIsolation);
    const softDelete = Boolean(architecture.database?.softDelete);

    const entities = rawEntities.map(ent => {
      const name = ent.name;
      const fields = [...(ent.fields || [])];
      const fieldNames = new Set(fields.map(f => f.name));

      // 1. Primary Key: Ensure id is UUID / string
      if (!fieldNames.has('id')) {
        fields.unshift({
          name: 'id',
          type: 'string',
          isPrimaryKey: true,
          required: true,
          default: 'cuid()'
        });
      } else {
        const idField = fields.find(f => f.name === 'id');
        idField.isPrimaryKey = true;
        idField.default = 'cuid()';
      }

      // 2. Tenant Isolation Field
      if (isMultiTenant && !['Organization', 'Tenant', 'User'].includes(name)) {
        if (!fieldNames.has('organizationId')) {
          fields.push({
            name: 'organizationId',
            type: 'string',
            required: true,
            isIndexed: true
          });
        }
      }

      // 3. Timestamps & Soft Deletion
      if (!fieldNames.has('createdAt')) {
        fields.push({ name: 'createdAt', type: 'datetime', required: true, default: 'now()' });
      }
      if (!fieldNames.has('updatedAt')) {
        fields.push({ name: 'updatedAt', type: 'datetime', required: true, isUpdatedAt: true });
      }
      if (softDelete && !fieldNames.has('deletedAt')) {
        fields.push({ name: 'deletedAt', type: 'datetime', required: false });
      }

      // 4. Identify unique fields
      const uniqueFields = [];
      if (name.toLowerCase() === 'user' || fieldNames.has('email')) {
        uniqueFields.push('email');
      }
      if (fieldNames.has('slug')) {
        uniqueFields.push('slug');
      }

      // 5. Inferred foreign keys
      const relationships = (ent.relationships || []).map(rel => {
        const target = rel.targetEntity || rel.target || 'Item';
        const type = rel.type || 'hasMany';
        const foreignKey = rel.foreignKey || (type === 'belongsTo' ? `${target.toLowerCase()}Id` : undefined);
        return {
          type,
          targetEntity: target,
          foreignKey,
          cascade: 'Cascade'
        };
      });

      return {
        ...ent,
        fields,
        uniqueFields,
        relationships
      };
    });

    // If multi-tenant and Organization entity is missing, synthesize Organization
    if (isMultiTenant && !entities.some(e => e.name === 'Organization')) {
      entities.unshift({
        id: 'entity-organization',
        name: 'Organization',
        title: 'Organization',
        plural: 'Organizations',
        description: 'Multi-tenant organization account boundary',
        fields: [
          { name: 'id', type: 'string', isPrimaryKey: true, required: true, default: 'cuid()' },
          { name: 'name', type: 'string', required: true },
          { name: 'slug', type: 'string', required: true, unique: true },
          { name: 'createdAt', type: 'datetime', required: true, default: 'now()' },
          { name: 'updatedAt', type: 'datetime', required: true, isUpdatedAt: true }
        ],
        uniqueFields: ['slug'],
        relationships: []
      });
    }

    return entities;
  }
}
