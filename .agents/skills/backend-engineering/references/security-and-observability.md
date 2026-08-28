# Security, Authentication & Observability Guide

## Overview
Modern backend applications require zero-trust security architecture, cryptographic authentication, and end-to-end distributed tracing.

---

## 1. Authentication: Modern JWT & PASETO Architecture

### JWT Verification with Cached JWKS (Asymmetric RS256/EdDSA)

```typescript
import { createRemoteJWKSet, jwtVerify } from 'jose';

const JWKS = createRemoteJWKSet(new URL('https://auth.company.com/.well-known/jwks.json'), {
  cacheMaxAge: 600000,
  cooldownDuration: 30000,
});

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: 'https://auth.company.com',
    audience: 'https://api.company.com',
    algorithms: ['RS256', 'EdDSA'],
  });

  return {
    userId: payload.sub as string,
    tenantId: payload.tenant_id as string,
    roles: (payload.roles as string[]) || [],
    permissions: (payload.permissions as string[]) || [],
  };
}
```

---

## 2. Observability: OpenTelemetry & Structured Logging

```typescript
import { Request, Response, NextFunction } from 'express';
import pino from 'pino';
import { trace, context } from '@opentelemetry/api';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
});

export function correlationIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const correlationId = (req.headers['x-correlation-id'] as string) || crypto.randomUUID();
  const activeSpan = trace.getSpan(context.active());
  const traceId = activeSpan?.spanContext().traceId || 'unknown-trace';

  res.setHeader('x-correlation-id', correlationId);

  req.log = logger.child({
    correlation_id: correlationId,
    trace_id: traceId,
    http_method: req.method,
    http_path: req.path,
  });

  next();
}
```
