# Rate Limiting, Resilience & Fault Tolerance

## Overview
High-throughput backend systems require defensive traffic shaping and fault-tolerant communication patterns to protect upstream resources and gracefully withstand transient failures.

---

## 1. Enterprise Rate Limiting Algorithms

### Rate Limiting Comparison Matrix

| Algorithm | Accuracy | Memory Overhead | Burst Handling | Best Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Token Bucket** | High | Low ($O(1)$ per key) | Excellent (Allows configurable burst up to capacity) | General API rate limiting, AI token quotas |
| **Leaky Bucket** | High | Low ($O(1)$ per key) | Smooths bursts into a constant egress rate | Background queue consumers, SMS/Email dispatch |
| **Sliding Window Log**| Perfect | High ($O(N)$ requests in window) | Accurate | Low-volume, critical security endpoints (login attempts) |
| **Sliding Window Counter** | Very High ($\approx 99.5\%$) | Very Low (2 integers per key) | Good | High-throughput distributed API gateways (Cloudflare/Upstash style) |

---

## 2. Distributed Sliding Window Rate Limiter (Redis + Lua Script)

```lua
-- rate_limit.lua
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local cost = tonumber(ARGV[4])

local clear_before = now - window

-- 1. Remove timestamps outside current sliding window
redis.call('ZREMRANGEBYSCORE', key, 0, clear_before)

-- 2. Count requests currently in window
local current_requests = redis.call('ZCARD', key)

-- 3. Check if adding cost exceeds limit
if current_requests + cost <= limit then
  for i = 1, cost do
    redis.call('ZADD', key, now, now .. ':' .. i .. ':' .. math.random(1000, 9999))
  end
  redis.call('PEXPIRE', key, window)
  return { 1, limit - (current_requests + cost), math.ceil(window / 1000) }
else
  local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
  local retry_after = 1
  if #oldest > 0 then
    retry_after = math.ceil((tonumber(oldest[2]) + window - now) / 1000)
    if retry_after < 1 then retry_after = 1 end
  end
  return { 0, 0, retry_after }
end
```

---

## 3. Resilience Patterns

### A. Exponential Backoff with Full Jitter (AWS Formula)

$$\text{sleep} = \text{random\_between}\left(0, \min(\text{cap}, \text{base} \cdot 2^{\text{attempt}})\right)$$

```typescript
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 5,
  baseMs = 100,
  capMs = 5000
): Promise<T> {
  let attempt = 0;

  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      attempt++;
      if (attempt > maxRetries || !isRetryableError(error)) {
        throw error;
      }
      const maxBackoff = Math.min(capMs, baseMs * Math.pow(2, attempt));
      const jitteredDelay = Math.random() * maxBackoff;

      await new Promise((resolve) => setTimeout(resolve, jitteredDelay));
    }
  }
}
```
