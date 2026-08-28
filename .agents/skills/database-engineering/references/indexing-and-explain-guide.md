# Database Indexing & Query Optimization Guide

## Overview
Proper indexing is the single most effective lever for database performance. This guide covers index types, multi-column ordering, covering indexes, partial indexes, and reading PostgreSQL `EXPLAIN (ANALYZE, BUFFERS)` execution plans.

---

## 1. Index Types & Use Case Matrix

| Index Type | Internal Data Structure | Best Operations / Data Types | Limitations |
| :--- | :--- | :--- | :--- |
| **B-Tree** (Default) | Balanced multi-way search tree | `=`, `<`, `<=`, `>`, `>=`, `BETWEEN`, `IN`, `IS NULL`, `ORDER BY` | Not suited for unstructured JSON search or array membership. |
| **GIN** (Generalized Inverted) | Inverted index mapping elements to row IDs | `JSONB` path operators (`@>`, `?`, `?&`), `TEXT` Full-Text Search (`tsvector`), Array containment (`&&`, `@>`) | Slower write speeds; larger index size than B-Tree. |
| **GiST** (Generalized Search) | Balanced tree for arbitrary data geometries | PostGIS spatial queries (`ST_DWithin`, `ST_Intersects`), Range types (`tstzrange` overlaps `&&`), Nearest Neighbor (`<->`) | Higher CPU overhead during tree traversal than B-Tree. |
| **BRIN** (Block Range Index) | Min/Max summary per physical disk block (pages) | Massive append-only tables (Logs, Timeseries, IoT metrics) with natural physical ordering | Only effective when data is physically sorted on disk; ineffective on random inserts. |

---

## 2. Multi-Column (Composite) Indexing: The Column Order Rule

### The Golden Formula:
1. **Equality Columns First**: Place all columns matched with exact equality (`WHERE col = 'val'`) first.
2. **Range / Inequality Columns Second**: Place columns filtered by inequality (`WHERE col > 100`) second.
3. **Sort Columns Last**: Place columns used in `ORDER BY` last.

```sql
-- Optimal Composite Index:
CREATE INDEX idx_optimal ON articles (tenant_id, status, published_at DESC);
```

---

## 3. Covering Indexes (`INCLUDE` Clause)

```sql
-- Index-Only Scan optimization:
CREATE INDEX idx_users_lookup
ON users (tenant_id, status)
INCLUDE (first_name, last_name);
```

---

## 4. Partial / Filtered Indexes

```sql
-- Partial Index (Stores only active / non-deleted rows):
CREATE INDEX idx_jobs_pending
ON background_jobs (scheduled_at ASC)
WHERE status = 'pending';
```
