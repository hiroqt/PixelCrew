/**
 * PIXEL CREW — Domain Module Synthesizer
 * 
 * Synthesizes decoupled domain modules:
 * - [name].controller.ts (HTTP input validation, status codes, RFC 7807 responses)
 * - [name].service.ts (Pure business logic, policy checks, transactional consistency)
 * - [name].repository.ts (Prisma database access, index-optimized queries, caching)
 * - [name].schema.ts (Zod input/output schemas)
 * - [name].policy.ts (RBAC & tenant ownership policy)
 * - [name].test.ts (Automated unit tests)
 */

import { SchemaGenerator } from '../api/schema-generator.js';
import { AuthorizationEngine } from '../security/authorization-engine.js';

export class ModuleSynthesizer {
  /**
   * Synthesize a complete domain module for an entity
   * @param {object} entity 
   * @param {object} architecture 
   * @returns {object} Map of filename -> content
   */
  static synthesizeModule(entity, architecture = {}) {
    const name = entity.name;
    const lower = name.toLowerCase();
    const isMultiTenant = Boolean(architecture.database?.tenantIsolation);
    const hasCache = Boolean(architecture.cache?.required);
    const files = {};

    // 1. Zod Schema
    files[`src/modules/${lower}/${lower}.schema.ts`] = SchemaGenerator.generateZodSchema(entity);

    // 2. Authorization Policy
    files[`src/modules/${lower}/${lower}.policy.ts`] = AuthorizationEngine.generateEntityPolicy(entity, architecture);

    // 3. Domain Repository
    files[`src/modules/${lower}/${lower}.repository.ts`] = `import { prisma } from "@/infrastructure/database";
import { Create${name}DTO, Update${name}DTO, ${name}QueryDTO } from "./${lower}.schema";
${hasCache ? 'import { cache } from "@/infrastructure/cache";' : ''}

export class ${name}Repository {
  async findMany(query: ${name}QueryDTO, organizationId?: string) {
    const { page, limit, cursor, search, sortBy, sortOrder } = query;
    const where: any = {};

    ${isMultiTenant ? `if (organizationId) where.organizationId = organizationId;` : ''}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } }
      ];
    }

    const take = limit;
    const skip = cursor ? 1 : (page - 1) * limit;
    const cursorObj = cursor ? { id: cursor } : undefined;

    return await prisma.${lower}.findMany({
      where,
      take,
      skip,
      cursor: cursorObj,
      orderBy: { [sortBy]: sortOrder }
    });
  }

  async findById(id: string, organizationId?: string) {
    const where: any = { id };
    ${isMultiTenant ? `if (organizationId) where.organizationId = organizationId;` : ''}

    ${hasCache ? `
    const cacheKey = \`${lower}:item:\${id}\`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;
    ` : ''}

    const item = await prisma.${lower}.findFirst({ where });
    
    ${hasCache ? `
    if (item) {
      await cache.set(cacheKey, item, 300);
    }
    ` : ''}

    return item;
  }

  async create(data: Create${name}DTO, organizationId?: string) {
    const payload: any = { ...data };
    ${isMultiTenant ? `if (organizationId) payload.organizationId = organizationId;` : ''}

    const created = await prisma.${lower}.create({ data: payload });
    ${hasCache ? `await cache.invalidatePrefix(\`${lower}:\`);` : ''}
    return created;
  }

  async update(id: string, data: Update${name}DTO, organizationId?: string) {
    const where: any = { id };
    ${isMultiTenant ? `if (organizationId) where.organizationId = organizationId;` : ''}

    const updated = await prisma.${lower}.update({
      where,
      data
    });

    ${hasCache ? `
    await cache.delete(\`${lower}:item:\${id}\`);
    await cache.invalidatePrefix(\`${lower}:\`);
    ` : ''}

    return updated;
  }

  async delete(id: string, organizationId?: string) {
    const where: any = { id };
    ${isMultiTenant ? `if (organizationId) where.organizationId = organizationId;` : ''}

    const deleted = await prisma.${lower}.delete({ where });
    ${hasCache ? `
    await cache.delete(\`${lower}:item:\${id}\`);
    await cache.invalidatePrefix(\`${lower}:\`);
    ` : ''}
    return deleted;
  }
}
`;

    // 4. Domain Service
    files[`src/modules/${lower}/${lower}.service.ts`] = `import { ${name}Repository } from "./${lower}.repository";
import { ${name}Policy } from "./${lower}.policy";
import { Create${name}DTO, Update${name}DTO, ${name}QueryDTO } from "./${lower}.schema";
import { NotFoundError } from "@/shared/errors";
import { UserSession } from "@/middleware/auth";

export class ${name}Service {
  constructor(private readonly repository = new ${name}Repository()) {}

  async list(query: ${name}QueryDTO, session?: UserSession | null) {
    const orgId = session?.organizationId;
    return await this.repository.findMany(query, orgId);
  }

  async getById(id: string, session?: UserSession | null) {
    const orgId = session?.organizationId;
    const item = await this.repository.findById(id, orgId);
    if (!item) {
      throw new NotFoundError("${name}", id);
    }
    if (session) {
      ${name}Policy.authorize("read", session, item as any);
    }
    return item;
  }

  async create(data: Create${name}DTO, session?: UserSession | null) {
    if (session) {
      ${name}Policy.authorize("create", session);
    }
    return await this.repository.create(data, session?.organizationId);
  }

  async update(id: string, data: Update${name}DTO, session?: UserSession | null) {
    const item = await this.getById(id, session);
    if (session) {
      ${name}Policy.authorize("update", session, item as any);
    }
    return await this.repository.update(id, data, session?.organizationId);
  }

  async delete(id: string, session?: UserSession | null) {
    const item = await this.getById(id, session);
    if (session) {
      ${name}Policy.authorize("delete", session, item as any);
    }
    return await this.repository.delete(id, session?.organizationId);
  }
}
`;

    // 5. Domain Controller
    files[`src/modules/${lower}/${lower}.controller.ts`] = `import { NextRequest } from "next/server";
import { ${name}Service } from "./${lower}.service";
import { Create${name}Schema, Update${name}Schema, ${name}QuerySchema } from "./${lower}.schema";
import { getSession } from "@/middleware/auth";
import { ValidationError } from "@/shared/errors";

export class ${name}Controller {
  constructor(private readonly service = new ${name}Service()) {}

  async list(request: NextRequest) {
    const session = await getSession(request);
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());

    const parsedQuery = ${name}QuerySchema.safeParse(queryParams);
    if (!parsedQuery.success) {
      throw new ValidationError("Invalid query parameters", parsedQuery.error.issues.map(i => ({ name: i.path.join("."), reason: i.message })));
    }

    return await this.service.list(parsedQuery.data, session);
  }

  async getById(id: string, request: NextRequest) {
    const session = await getSession(request);
    return await this.service.getById(id, session);
  }

  async create(request: NextRequest) {
    const session = await getSession(request);
    const body = await request.json().catch(() => ({}));

    const parsedBody = Create${name}Schema.safeParse(body);
    if (!parsedBody.success) {
      throw new ValidationError("Invalid request body payload", parsedBody.error.issues.map(i => ({ name: i.path.join("."), reason: i.message })));
    }

    return await this.service.create(parsedBody.data, session);
  }

  async update(id: string, request: NextRequest) {
    const session = await getSession(request);
    const body = await request.json().catch(() => ({}));

    const parsedBody = Update${name}Schema.safeParse(body);
    if (!parsedBody.success) {
      throw new ValidationError("Invalid request body payload", parsedBody.error.issues.map(i => ({ name: i.path.join("."), reason: i.message })));
    }

    return await this.service.update(id, parsedBody.data, session);
  }

  async delete(id: string, request: NextRequest) {
    const session = await getSession(request);
    return await this.service.delete(id, session);
  }
}
`;

    // 6. Automated Domain Unit Test
    files[`src/modules/${lower}/${lower}.test.ts`] = `import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ${name}Service } from "./${lower}.service";
import { ${name}Policy } from "./${lower}.policy";
import { Create${name}Schema } from "./${lower}.schema";

describe("${name} Domain Module", () => {
  it("validates valid ${name} creation payload", () => {
    const sample = { name: "Test ${name}" };
    const result = Create${name}Schema.safeParse(sample);
    assert.equal(result.success, true);
  });

  it("enforces policy permission checks for ${name}", () => {
    const adminSession = { userId: "usr_1", email: "admin@pixel.dev", role: "admin" };
    const canDelete = ${name}Policy.canDelete(adminSession, { id: "1", name: "Sample" } as any);
    assert.equal(canDelete, true);
  });
});
`;

    return files;
  }
}
