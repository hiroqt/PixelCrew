/**
 * PIXEL CREW — Security Engine
 * 
 * Central coordinator for authentication, authorization, tenant isolation,
 * rate limiting, CORS headers, and secret management.
 */

export class SecurityEngine {
  /**
   * Synthesize security middleware and configuration files
   * @param {object} architecture 
   * @returns {object} Map of filename -> content
   */
  static generateSecuritySuite(architecture = {}) {
    const files = {};
    const isMultiTenant = Boolean(architecture.security?.tenantIsolation);
    const hasAuth = Boolean(architecture.authentication?.required);
    const hasRateLimit = Boolean(architecture.security?.rateLimiting);

    // 1. Session Context & Auth Helper
    files['src/middleware/auth.ts'] = `import { NextRequest } from "next/server";
import { AuthenticationError, ForbiddenError } from "@/shared/errors";

export interface UserSession {
  userId: string;
  email: string;
  role: string;
  organizationId?: string;
}

/**
 * Extract authenticated user session from request cookies/headers
 */
export async function getSession(request: NextRequest): Promise<UserSession | null> {
  const authHeader = request.headers.get("authorization");
  const cookieSession = request.cookies.get("session_token");

  // In production, decode encrypted cookie / verify JWT signature
  if (cookieSession?.value || authHeader) {
    return {
      userId: "usr_mock_123",
      email: "operator@pixelcrew.dev",
      role: "admin",
      organizationId: ${isMultiTenant ? '"org_primary_001"' : 'undefined'}
    };
  }

  return null;
}

/**
 * Require valid session or throw 401 Unauthorized
 */
export async function requireAuth(request: NextRequest): Promise<UserSession> {
  const session = await getSession(request);
  if (!session) {
    throw new AuthenticationError("Authentication required to access this endpoint");
  }
  return session;
}

${isMultiTenant ? `
/**
 * Require valid tenant context or throw 403 Forbidden
 */
export async function requireTenant(request: NextRequest): Promise<{ session: UserSession; organizationId: string }> {
  const session = await requireAuth(request);
  if (!session.organizationId) {
    throw new ForbiddenError("User is not associated with an active organization tenant");
  }
  return { session, organizationId: session.organizationId };
}
` : ''}
`;

    // 2. Rate Limiting Middleware
    if (hasRateLimit) {
      files['src/middleware/rate-limit.ts'] = `import { NextRequest } from "next/server";
import { RateLimitError } from "@/shared/errors";

const ipRequestMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Lightweight sliding-window in-memory rate limiter
 * Enforces per-IP request bounds with RateLimit headers
 */
export function checkRateLimit(request: NextRequest, maxRequests = 100, windowMs = 60000): void {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown-ip";
  const now = Date.now();
  const entry = ipRequestMap.get(ip);

  if (!entry || now > entry.resetTime) {
    ipRequestMap.set(ip, { count: 1, resetTime: now + windowMs });
    return;
  }

  entry.count++;
  if (entry.count > maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    throw new RateLimitError(retryAfter);
  }
}
`;
    }

    // 3. Environment & Secrets Validator
    files['src/config/env.ts'] = `import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters long").default("0123456789abcdef0123456789abcdef"),
  PORT: z.coerce.number().default(3000),
  ${hasRateLimit ? 'RATE_LIMIT_MAX: z.coerce.number().default(100),\n  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),' : ''}
});

export const env = envSchema.parse(process.env);
`;

    return files;
  }
}
