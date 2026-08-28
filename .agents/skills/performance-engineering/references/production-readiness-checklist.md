# Pre-Production Go-Live Verification Checklist

## Overview
Comprehensive 50+ point verification audit required before promoting any service, database change, or API to production.

---

## 1. Frontend & User Experience Standards

- [ ] **Core Web Vitals**: Verified LCP $\le 2.5\text{s}$, INP $\le 200\text{ms}$, CLS $\le 0.1$ on simulated 4G mobile.
- [ ] **Anti-AI Slop Audit**: Verified zero generic mesh gradient blobs, zero unnecessary floating eyebrow badges, and zero triple-nested frosted cards.
- [ ] **Typography & Legibility**: Body measure constrained to $45–75\text{ch}$, fluid typography scales implemented, tabular numbers enabled for data/metrics.
- [ ] **WCAG 2.1/2.2 AA Compliance**: Text contrast meets $4.5:1$ (normal) and $3:1$ (large/UI elements); verified with screen reader.
- [ ] **Keyboard Navigation**: Complete tab order validated; modal focus traps and escape key handlers functional.
- [ ] **Reduced Motion**: All animations disable or simplify under `@media (prefers-reduced-motion: reduce)`.
- [ ] **Touch Target Sizing**: Mobile interactive targets meet minimum $44 \times 44\text{px}$.
- [ ] **Zero Layout Shift**: All images, videos, ads, and embeds have explicit `aspect-ratio` or `width`/`height`.

---

## 2. Backend & API Reliability Standards

- [ ] **Contract Specifications**: OpenAPI 3.1 / GraphQL / Protobuf contracts validated and versioned.
- [ ] **Standardized Error Handling**: RFC 7807 Problem Details implemented across all non-2xx responses.
- [ ] **Idempotency Safeguards**: `Idempotency-Key` headers enforced on mutating endpoints (`POST`, `PATCH`).
- [ ] **Distributed Rate Limiting**: Sliding Window / Token Bucket limiters active with Redis cluster backend.
- [ ] **Standard Rate Limit Headers**: `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`, `Retry-After` present.
- [ ] **Timeouts & Deadlines**: Strict upstream request timeouts and context cancellation propagation configured.
- [ ] **Circuit Breakers**: Tri-state circuit breakers wrapped around external third-party APIs.
- [ ] **Graceful Shutdown**: `SIGTERM` / `SIGINT` handlers drain active HTTP connections and finish in-flight jobs within 30s.

---

## 3. Database & Storage Architecture Standards

- [ ] **Primary Key Strategy**: Verified time-ordered keys (UUIDv7 / ULID / BIGINT) to eliminate B-Tree fragmentation.
- [ ] **Indexing Strategy**: Composite index column order verified (Equality first, Range second).
- [ ] **Covering Indexes**: `INCLUDE` clause utilized on high-frequency read queries for Index-Only Scans.
- [ ] **Partial Indexes**: Partial indexes configured for soft-deleted (`deleted_at IS NULL`) or state-machine filtered records.
- [ ] **Query Plan Verification**: `EXPLAIN (ANALYZE, BUFFERS)` audited on all primary queries; zero unexpected sequential scans.
- [ ] **Row-Level Security (RLS)**: Subquery-cached policies `(SELECT auth.uid())` implemented and tested with multi-tenant roles.
- [ ] **Connection Pooling**: Transaction-mode connection pooling (PgBouncer/Supavisor/RDS Proxy) enabled; pool sized via Little's Law.
- [ ] **Zero-Downtime Migrations**: Expand-Contract pattern followed; non-blocking `CREATE INDEX CONCURRENTLY` enforced.

---

## 4. Observability & Chaos Resilience

- [ ] **Load & Stress Testing**: Sustained peak load and spike testing completed via k6; P99 latency within SLO budget.
- [ ] **Cache Stampede Protection**: XFetch probabilistic early expiration or Singleflight locking active on hot cache keys.
- [ ] **Distributed Tracing**: OpenTelemetry instrumentation emitting spans with unified correlation IDs.
- [ ] **Four Golden Signals Monitored**: Latency, Traffic, Errors, Saturation dashboards active in Grafana / Datadog.
- [ ] **Automated Rollback Plan**: Canary / Blue-Green deployments with automated rollback on error rate spikes $> 1\%$.
