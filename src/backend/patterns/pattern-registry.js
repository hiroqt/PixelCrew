/**
 * PIXEL CREW — Backend Pattern Registry
 * 
 * Defines standard architectural patterns with explicit preconditions, triggers,
 * trade-offs, and implementation strategies.
 */

export const BACKEND_PATTERNS = [
  {
    id: 'pat-cursor-pagination',
    name: 'Cursor-Based Pagination',
    category: 'api',
    when: ['large dataset', 'high growth', 'frequent pagination', 'real-time feeds'],
    avoidWhen: ['small dataset', 'simple administrative table with page jumps'],
    benefits: ['Stable pagination under concurrent inserts', 'Constant O(1) database index seek time'],
    tradeoffs: ['Cannot jump directly to arbitrary page N'],
    risk: 'Cursor corruption on malformed input',
    mitigation: 'Base64URL encoding with signature or strict schema decode'
  },
  {
    id: 'pat-cache-aside',
    name: 'Cache-Aside with Mutation Invalidation',
    category: 'caching',
    when: ['read-heavy access', 'expensive relational joins', 'hot entity reads'],
    avoidWhen: ['write-heavy stream', 'highly volatile transactional state'],
    benefits: ['Sub-millisecond query response', 'Protects database from query spikes'],
    tradeoffs: ['Cache invalidation complexity', 'Potential stale read window'],
    risk: 'Serving stale data after updates',
    mitigation: 'Short TTL (300s) + immediate key invalidation on write mutations'
  },
  {
    id: 'pat-idempotent-receiver',
    name: 'Idempotent Consumer / Receiver',
    category: 'resilience',
    when: ['payment operations', 'webhook processing', 'mutating POST/PATCH retries'],
    avoidWhen: ['pure idempotent GET/DELETE operations'],
    benefits: ['Guarantees exactly-once execution semantics under network retries'],
    tradeoffs: ['Requires caching or storage of Idempotency-Key responses'],
    risk: 'Storage memory growth from unused keys',
    mitigation: '24-hour TTL on idempotency storage records'
  },
  {
    id: 'pat-modular-monolith',
    name: 'Modular Monolith Domain Separation',
    category: 'architecture',
    when: ['small to large business applications', 'teams needing fast velocity with clean domain boundaries'],
    avoidWhen: ['independent polyglot teams requiring distinct deployment cadences across hundreds of engineers'],
    benefits: ['Simple deployment', 'Compile-time type safety', 'Zero network hop overhead between modules'],
    tradeoffs: ['Shared runtime deployment container'],
    risk: 'Accidental coupling between domain services and internal repositories',
    mitigation: 'Automated architectural policy engine enforcing layer purity'
  },
  {
    id: 'pat-transactional-outbox',
    name: 'Transactional Outbox & Worker Queue',
    category: 'queues',
    when: ['long-running background jobs', 'reliable email dispatch', 'batch report generation'],
    avoidWhen: ['synchronous request/response endpoints with low compute'],
    benefits: ['Prevents blocking user HTTP requests', 'Automatic retry on background failure'],
    tradeoffs: ['Eventual consistency between request and job completion'],
    risk: 'Worker queue starvation or message loss on crash',
    mitigation: 'Dead-letter queues and atomic database enqueue step'
  }
];

export class PatternRegistry {
  static getPatterns() {
    return BACKEND_PATTERNS;
  }

  static findPattern(id) {
    return BACKEND_PATTERNS.find(p => p.id === id);
  }
}
