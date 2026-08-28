# Multi-Tier Caching & Database Performance Guide

## Overview
Efficient caching and query tuning protect databases from overload and ensure consistent sub-millisecond response times.

---

## 1. Multi-Tier Caching Architecture

```text
Request ---> [ L3: CDN Edge (Cloudflare/Fastly) ]  (~5-20ms)
                     | (Cache Miss)
                     v
             [ L1: In-Memory LRU (App Process) ]  (< 0.1ms)
                     | (Cache Miss)
                     v
             [ L2: Distributed Redis Cluster ]     (~1-3ms)
                     | (Cache Miss)
                     v
             [ Database (Postgres / Read Replica)] (~5-50ms)
```

---

## 2. Cache Stampede (Thundering Herd) Prevention: The XFetch Algorithm

$$\text{Should Recompute} = -\beta \cdot \delta \cdot \ln(\text{random}()) > \text{TTL}_{\text{remaining}}$$

```typescript
import Redis from 'ioredis';

export class ResilientCache {
  constructor(private readonly redis: Redis) {}

  async getOrSet<T>(
    key: string,
    ttlSeconds: number,
    computeFn: () => Promise<T>,
    beta = 1.0
  ): Promise<T> {
    const raw = await this.redis.get(key);

    if (raw) {
      const envelope = JSON.parse(raw);
      const remainingSeconds = (envelope.expiry - Date.now()) / 1000;
      const xfetchThreshold = -beta * envelope.delta * Math.log(Math.random());

      if (xfetchThreshold <= remainingSeconds) {
        return envelope.value;
      }
    }

    const startTime = performance.now();
    const computedValue = await computeFn();
    const deltaSeconds = (performance.now() - startTime) / 1000;

    await this.redis.set(
      key,
      JSON.stringify({
        value: computedValue,
        delta: deltaSeconds,
        expiry: Date.now() + ttlSeconds * 1000,
      }),
      'EX',
      ttlSeconds
    );
    return computedValue;
  }
}
```
