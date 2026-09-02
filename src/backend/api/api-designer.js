/**
 * PIXEL CREW — API Designer Engine
 * 
 * Designs capability-driven REST/RPC API contracts with pagination (cursor vs offset),
 * filtering, sorting, authentication, and HTTP status codes.
 */

export class APIDesigner {
  /**
   * Design API endpoints for entities and workflows
   * @param {Array<object>} entities 
   * @param {Array<object>} workflows 
   * @param {object} architecture 
   * @returns {Array<object>} API Endpoints Specification
   */
  static designEndpoints(entities = [], workflows = [], architecture = {}) {
    const endpoints = [];
    const isMultiTenant = Boolean(architecture.database?.tenantIsolation);
    const pagination = architecture.performance?.paginationStrategy || 'cursor';

    entities.forEach(ent => {
      const slug = ent.plural ? ent.plural.toLowerCase() : `${ent.name.toLowerCase()}s`;
      const basePath = `/api/v1/${slug}`;

      // 1. List / Search Collection
      endpoints.push({
        id: `api-list-${slug}`,
        name: `List ${ent.title || ent.name}`,
        method: 'GET',
        path: basePath,
        entity: ent.name,
        type: 'collection',
        pagination,
        authRequired: architecture.authentication?.required ?? false,
        summary: `Retrieve paginated list of ${ent.plural || ent.name} with filtering and sorting`
      });

      // 2. Get by ID
      endpoints.push({
        id: `api-get-${slug}-id`,
        name: `Get ${ent.name} by ID`,
        method: 'GET',
        path: `${basePath}/:id`,
        entity: ent.name,
        type: 'item',
        authRequired: architecture.authentication?.required ?? false,
        summary: `Retrieve a single ${ent.name} record by unique identifier`
      });

      // 3. Create Entity
      endpoints.push({
        id: `api-create-${slug}`,
        name: `Create ${ent.name}`,
        method: 'POST',
        path: basePath,
        entity: ent.name,
        type: 'mutation',
        authRequired: architecture.authentication?.required ?? false,
        requiresIdempotency: architecture.database?.transactions ?? false,
        summary: `Create a new ${ent.name} record`
      });

      // 4. Update Entity
      endpoints.push({
        id: `api-update-${slug}-id`,
        name: `Update ${ent.name}`,
        method: 'PATCH',
        path: `${basePath}/:id`,
        entity: ent.name,
        type: 'mutation',
        authRequired: architecture.authentication?.required ?? false,
        summary: `Update existing ${ent.name} fields`
      });

      // 5. Delete Entity
      endpoints.push({
        id: `api-delete-${slug}-id`,
        name: `Delete ${ent.name}`,
        method: 'DELETE',
        path: `${basePath}/:id`,
        entity: ent.name,
        type: 'mutation',
        authRequired: architecture.authentication?.required ?? false,
        summary: `Delete ${ent.name} record`
      });
    });

    return endpoints;
  }
}
