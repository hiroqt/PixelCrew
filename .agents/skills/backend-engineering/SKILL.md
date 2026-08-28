---
name: backend-engineering
description: >-
  Comprehensive guide for modern backend engineering across enterprise architectures (Clean
  Architecture, Hexagonal/Ports & Adapters, Modular Monoliths, Event-Driven Microservices).
  Covers API standards (REST with OpenAPI 3.1 & RFC 7807, GraphQL with DataLoader, gRPC,
  tRPC, WebSockets, SSE, Webhooks), enterprise rate limiting (Token Bucket, Sliding Window,
  Redis Lua scripts, tier-based limits), resilience (Idempotency keys, Circuit Breakers,
  Exponential Backoff with Jitter), OAuth 2.1 / OIDC / PASETO security, and OpenTelemetry observability.
---

# Backend Engineering & Modern API Architecture

This skill provides comprehensive instructions, architectural patterns, and implementation blueprints for constructing resilient, scalable, secure backend systems and APIs across modern runtimes (Node.js/TypeScript, Go, Rust, Python, C# .NET).

---

## 1. Core Engineering Directives

1. **Architectural Purity & Decoupling**: Enforce Clean / Hexagonal (Ports & Adapters) boundaries. Core business logic/domain entities must never import database drivers, web frameworks, or third-party SDKs. Adapters implement interfaces declared by the domain.
2. **Standardized API Integration**:
   - **REST**: OpenAPI 3.1 contract-first specifications, standardized pagination (cursor-based), and **RFC 7807 Problem Details** for all error payloads (`type`, `title`, `status`, `detail`, `instance`, `invalid_params`).
   - **GraphQL**: Strict depth/complexity limits, persisted queries, and mandatory `DataLoader` to eliminate N+1 database queries.
   - **gRPC / Protobuf**: HTTP/2 multiplexing, type-safe RPC contracts for internal service-to-service communication.
   - **Streaming & Real-Time**: Server-Sent Events (SSE) for unidirectional streams (e.g. LLM tokens, progress bars), WebSockets for bidirectional low-latency interactions with Redis Pub/Sub cluster backplanes, and Webhooks secured with HMAC-SHA256 signatures.
3. **Enterprise Rate Limiting & Traffic Shaping**: Deploy distributed Sliding Window Counter / Token Bucket rate limiting via Redis Lua scripts with IETF standard headers (`RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`, `Retry-After`). Implement tier-based allowances and per-route cost weighting.
4. **Resilience & Fault Tolerance**:
   - **Idempotency**: Require `Idempotency-Key` headers for all mutating operations (`POST`, `PATCH`), backed by atomic database or Redis locks.
   - **Circuit Breakers**: Tri-state circuit breakers (Closed $\to$ Open $\to$ Half-Open) around all external dependencies.
   - **Retries**: Exponential backoff with full jitter to avoid thundering herd / retry storms.
   - **Context Deadlines**: Propagate cancellation tokens/deadlines across all asynchronous calls.
5. **Zero-Trust Security & Modern Auth**: OAuth 2.1 with PKCE, OpenID Connect (OIDC), asymmetric JWTs (RS256/EdDSA) validated via cached JWKS, PASETO v4 tokens, and fine-grained authorization (RBAC/ABAC).
6. **Unified Observability**: OpenTelemetry instrumentation with trace/span propagation (`traceparent`, `x-correlation-id`), structured JSON logging, and Prometheus metrics.

---

## 2. Quick Navigation & Reference Modules

- [Modern Architecture & Domain Design Guide](./references/modern-architecture-guide.md)
- [Rate Limiting, Resilience & Fault Tolerance](./references/rate-limiting-and-resilience.md)
- [API Protocols, Standards & Error Handling](./references/api-protocols-and-standards.md)
- [Security, Authentication & Observability](./references/security-and-observability.md)
