/**
 * PIXEL CREW — Layering & Architectural Purity Policy
 */

export const LayeringPolicy = {
  id: 'POL-ARCH-LAYERING',
  name: 'Clean Architecture Boundary Policy',
  rules: [
    { id: 'LAYER-01', description: 'Controllers must never access the database directly; they must delegate to services.' },
    { id: 'LAYER-02', description: 'Services contain business logic and policy enforcement; they delegate persistence to repositories.' },
    { id: 'LAYER-03', description: 'Repositories encapsulate database queries and caching.' },
    { id: 'LAYER-04', description: 'All errors must conform to RFC 7807 Problem Details format.' }
  ]
};
