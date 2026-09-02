/**
 * PIXEL CREW — Indexing & Performance Policy
 */

export const IndexingPolicy = {
  id: 'POL-PERF-INDEXING',
  name: 'Database Indexing & Query Performance Policy',
  rules: [
    { id: 'INDEX-01', description: 'Foreign keys must be indexed to avoid table scans on JOINs.' },
    { id: 'INDEX-02', description: 'Tenant-scoped collections must have compound indexes: (organizationId, createdAt DESC).' },
    { id: 'INDEX-03', description: 'Unique identifiers (email, slug) must have unique database constraints.' }
  ]
};
