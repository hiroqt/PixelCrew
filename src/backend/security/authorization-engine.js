/**
 * PIXEL CREW — Authorization Engine
 * 
 * Generates domain-level policy files (RBAC/ABAC and resource ownership guards)
 * ensuring deny-by-default access control.
 */

export class AuthorizationEngine {
  /**
   * Generate policy file for an entity
   * @param {object} entity 
   * @param {object} architecture 
   * @returns {string} TypeScript policy source
   */
  static generateEntityPolicy(entity, architecture = {}) {
    const name = entity.name;
    const isMultiTenant = Boolean(architecture.database?.tenantIsolation);

    return `import { UserSession } from "@/middleware/auth";
import { ForbiddenError } from "@/shared/errors";
import { ${name}DTO } from "./${name.toLowerCase()}.schema";

/**
 * Access Control Policy for ${name}
 * Enforces deny-by-default role and tenant ownership validation.
 */
export class ${name}Policy {
  /**
   * Can user view this ${name} record?
   */
  static canRead(session: UserSession, record: ${name}DTO): boolean {
    ${isMultiTenant ? `
    // Cross-tenant protection: verify record belongs to user's organization
    if (record.organizationId && record.organizationId !== session.organizationId) {
      return false;
    }
    ` : ''}
    return true;
  }

  /**
   * Can user create a new ${name}?
   */
  static canCreate(session: UserSession): boolean {
    return Boolean(session.userId);
  }

  /**
   * Can user update this ${name}?
   */
  static canUpdate(session: UserSession, record: ${name}DTO): boolean {
    ${isMultiTenant ? `
    if (record.organizationId && record.organizationId !== session.organizationId) {
      return false;
    }
    ` : ''}
    // Only admin or owner can modify
    return session.role === "admin" || session.userId === (record as any).userId;
  }

  /**
   * Can user delete this ${name}?
   */
  static canDelete(session: UserSession, record: ${name}DTO): boolean {
    ${isMultiTenant ? `
    if (record.organizationId && record.organizationId !== session.organizationId) {
      return false;
    }
    ` : ''}
    return session.role === "admin";
  }

  /**
   * Assert permission or throw 403 Forbidden
   */
  static authorize(action: "read" | "create" | "update" | "delete", session: UserSession, record?: ${name}DTO): void {
    let allowed = false;
    if (action === "read" && record) allowed = this.canRead(session, record);
    else if (action === "create") allowed = this.canCreate(session);
    else if (action === "update" && record) allowed = this.canUpdate(session, record);
    else if (action === "delete" && record) allowed = this.canDelete(session, record);

    if (!allowed) {
      throw new ForbiddenError(\`You are not authorized to \${action} this ${name}\`);
    }
  }
}
`;
  }
}
