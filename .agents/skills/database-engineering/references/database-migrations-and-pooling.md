# Database Migrations, Connection Pooling & Scaling Guide

## 1. Zero-Downtime Expand-Contract Migration Pattern

Never perform breaking schema changes (e.g. renaming columns or dropping constraints) in a single deployment step.

```
Phase 1: Expand (Non-breaking)
  - Add new column `new_field` as NULLABLE.
  - Deploy code that writes to BOTH `old_field` and `new_field`, but reads from `old_field`.

Phase 2: Backfill
  - Run background asynchronous script to backfill data from `old_field` into `new_field`.

Phase 3: Switch Reads
  - Deploy code that reads and writes exclusively from `new_field`.

Phase 4: Contract (Cleanup)
  - Drop `old_field` via non-blocking DDL (`ALTER TABLE ... DROP COLUMN ...`).
```

---

## 2. Non-Blocking DDL in PostgreSQL

- Always create indexes concurrently: `CREATE INDEX CONCURRENTLY idx_users_email ON users (email);`
- Avoid full table locks on large tables: set `statement_timeout = '3s'` and `lock_timeout = '2s'` before running migrations.

---

## 3. Connection Pooling & Little's Law

Size database connection pools using **Little's Law**:
$$\text{Max Connections} = \text{Target TPS} \times \text{Average Query Latency (seconds)}$$

*Example*: 1,000 queries per second with 10ms (0.01s) average latency requires only **10 active connections**!
- Deploy transaction-level pooling with **PgBouncer** or **Supabase Supavisor**.
- Prevent connection starvation by using serverless connection proxies (AWS RDS Proxy, Neon Connection String with `-pooler`).
