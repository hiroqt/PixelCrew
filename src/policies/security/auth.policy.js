/**
 * PIXEL CREW — Declarative Security Policies
 */

export const AuthPolicy = {
  id: 'POL-SEC-AUTH',
  name: 'Authentication Guard Policy',
  rules: [
    { id: 'AUTH-01', description: 'Mutating endpoints (POST, PATCH, DELETE) require authenticated session context by default.' },
    { id: 'AUTH-02', description: 'Session tokens must be transmitted in HttpOnly SameSite secure cookies.' },
    { id: 'AUTH-03', description: 'Password hashes must use Argon2id or bcrypt.' }
  ]
};

export const RBACPolicy = {
  id: 'POL-SEC-RBAC',
  name: 'Role-Based Access Control Policy',
  rules: [
    { id: 'RBAC-01', description: 'Deny by default: missing explicit allow rule returns 403 Forbidden.' },
    { id: 'RBAC-02', description: 'Resource deletion restricted strictly to admin or verified owner.' }
  ]
};

export const TenantPolicy = {
  id: 'POL-SEC-TENANT',
  name: 'Multi-Tenant Isolation Policy',
  rules: [
    { id: 'TENANT-01', description: 'Tenant context must be derived from validated session token, never trusted from request body.' },
    { id: 'TENANT-02', description: 'All tenant-scoped database queries must include WHERE organization_id = session.orgId.' }
  ]
};
