---
name: performance-engineering
description: Comprehensive guide for full-stack performance engineering across frontend Core Web Vitals (LCP, INP, CLS, TTFB, streaming SSR, priority hints, main thread yielding), backend runtime profiling, multi-tier caching (L1 in-memory, L2 Redis, L3 CDN Edge, XFetch stampede prevention), database query tuning, network transport, automated k6 load & stress testing, and SLA/SLO/SLI error budgets.
---

# Performance Engineering & Production Readiness

This skill provides comprehensive instructions, diagnostic runbooks, optimization formulas, load testing scripts, and production verification checklists to guarantee high system performance, reliability, and smooth operations at scale.

---

## 1. Core Engineering Directives

1. **Frontend Core Web Vitals (CWV) Targets**:
   - **LCP (Largest Contentful Paint) < 2.5s**: Apply `fetchpriority="high"` on hero images, preload critical web fonts with `font-display: swap`, and eliminate render-blocking stylesheets.
   - **INP (Interaction to Next Paint) < 200ms**: Yield long tasks to the browser main thread using `scheduler.yield()` or `requestIdleCallback()`; offload heavy parsing to Web Workers.
   - **CLS (Cumulative Layout Shift) < 0.1**: Set explicit `aspect-ratio` / width & height on all media; use `@font-face` `size-adjust` to match fallback font metrics.
   - **TTFB (Time to First Byte) < 800ms**: Deploy edge computing (V8 isolates), streaming SSR, and HTTP 103 Early Hints.
2. **Backend & Runtime Optimization**:
   - Monitor and profile Event Loop Utilization (ELU) in Node.js, CPU/memory profiles via `pprof` in Go/Rust, and tune JVM garbage collection (ZGC/Shenandoah).
   - Detect and eradicate memory leaks using automated heap snapshot comparisons.
3. **Multi-Tier Caching & Stampede Prevention**:
   - Implement hierarchical caching: **L1** (Process memory LRU) $\to$ **L2** (Distributed Redis cluster) $\to$ **L3** (CDN Edge).
   - Eliminate Thundering Herd / Cache Stampedes using the **XFetch Probabilistic Early Expiration algorithm** or Singleflight / Mutex locks.
   - Configure precise HTTP `Cache-Control` headers (`public, max-age=31536000, immutable`, `stale-while-revalidate`, `stale-if-error`).
4. **Data Layer & Transport Performance**:
   - Eliminate N+1 queries with batched DataLoaders and SQL lateral joins.
   - Size connection pools using Little's Law to prevent connection starvation under high concurrency.
   - Profile slow queries using `pg_stat_statements`.
5. **Production Readiness & Stress Testing**:
   - Run automated **k6 load test pipelines** (Smoke tests, Load tests, Stress tests, Spike tests, and 24-hour Soak tests).
   - Establish formal **SLIs, SLOs, and Error Budgets** tied to the Four Golden Signals (Latency, Traffic, Errors, Saturation).
   - Execute the 50+ item Pre-Production Go-Live Verification Checklist before deploying to production.

---

## 2. Quick Navigation & Reference Modules

- [Core Web Vitals & Frontend Performance Guide](./references/full-stack-optimization-guide.md)
- [Backend Runtime Profiling & Memory Leak Hunting](./references/backend-and-runtime-optimization.md)
- [Multi-Tier Caching & Database Performance Guide](./references/caching-and-database-perf.md)
- [k6 Load & Stress Testing Script Templates](./references/load-testing-k6-templates.md)
- [Pre-Production Go-Live Verification Checklist](./references/production-readiness-checklist.md)
