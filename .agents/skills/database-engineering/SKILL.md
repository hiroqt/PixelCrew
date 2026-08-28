---
name: database-engineering
description: >-
  Comprehensive guide for database engineering, advanced indexing strategies (B-Tree, GIN, GiST, BRIN,
  composite indexing column order, covering indexes, partial indexes, EXPLAIN ANALYZE tuning),
  primary key architecture (UUIDv7 vs UUIDv4 vs ULID vs BIGINT IDENTITY), Row-Level Security (RLS)
  policy optimization for multi-tenant isolation, database scaling & connection pooling (PgBouncer,
  Supavisor, RDS Proxy, Neon, read replicas, partitioning, CDC), and modern SQL & NoSQL hosting
  (Supabase, Neon, CockroachDB, Turso, DynamoDB, MongoDB, Redis, ClickHouse, pgvector).
---

# Database Engineering & Storage Architecture

This skill provides comprehensive instructions, query optimization runbooks, primary key selection models, RLS security policies, and scaling architectures across modern SQL and NoSQL storage engines.

---

## 1. Core Engineering Directives

1. **Strategic Index Design**:
   - **Composite Index Column Order Rule**: Place columns tested for **Equality first**, followed by columns used for **Range / Ordering** (`(tenant_id, status, created_at)` for `WHERE tenant_id = ? AND status = ? ORDER BY created_at DESC`).
   - **Covering Indexes (`INCLUDE`)**: Add non-search payload columns to the index leaf level to achieve 100% **Index-Only Scans** without heap lookups.
   - **Partial / Filtered Indexes**: Index only active or non-null subsets (`WHERE is_deleted = false` or `WHERE status = 'pending'`), saving 80–95% disk space and write overhead.
   - **Specialized Indexes**: GIN for JSONB and full-text search, GiST for PostGIS spatial queries, BRIN for massive append-only timeseries logs.
2. **Modern Primary Key Strategy**: Default to **UUIDv7 (RFC 9562)** for distributed and high-scale relational databases. UUIDv7 provides 128-bit time-ordered keys that eliminate B-Tree fragmentation and page splits while remaining globally unique without coordination.
3. **High-Performance Row-Level Security (RLS)**:
   - Always wrap auth function calls in subqueries: `(SELECT auth.uid())` instead of `auth.uid()` so the query planner evaluates the authentication context **once per query** rather than **once per row**.
   - Ensure every column referenced in RLS policies (e.g. `tenant_id`, `user_id`, `organization_id`) is backed by a B-Tree index.
   - Separate `SELECT`, `INSERT`, `UPDATE`, and `DELETE` policies for precise least-privilege access.
4. **Connection Pooling & Scaling**: Deploy transaction-level connection pooling (PgBouncer, Supabase Supavisor, AWS RDS Proxy) to prevent connection starvation. Size pool sizes using Little's Law: $N = \text{TPS} \times \text{Latency}$.
5. **Polyglot Persistence & Modern Hosting**:
   - **Relational / Distributed SQL**: PostgreSQL, Supabase, Neon (serverless branching), CockroachDB, Turso (Edge SQLite).
   - **Document & Key-Value NoSQL**: MongoDB Atlas, AWS DynamoDB (Single-Table Design), Redis / Dragonfly / Upstash.
   - **AI Vector & Analytical OLAP**: pgvector / Pinecone / Qdrant for RAG embeddings; ClickHouse / Tinybird for columnar telemetry.
6. **Zero-Downtime Migrations**: Enforce the Expand-Contract migration pattern and use non-blocking DDL (`CREATE INDEX CONCURRENTLY`, `ALTER TABLE ... ADD COLUMN ... DEFAULT`).

---

## 2. Quick Navigation & Reference Modules

- [Indexing & Query Optimization with EXPLAIN ANALYZE](./references/indexing-and-explain-guide.md)
- [Primary Key Strategies & Row-Level Security (RLS) Guide](./references/primary-key-and-rls-guide.md)
- [Database Scaling, Connection Pooling & Partitioning](./references/scaling-and-polyglot-persistence.md)
- [Modern SQL & NoSQL Hosting Architecture](./references/sql-and-nosql-hosting-guide.md)
