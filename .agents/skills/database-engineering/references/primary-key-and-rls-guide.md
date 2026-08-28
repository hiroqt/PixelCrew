# Primary Key Architecture & Row-Level Security (RLS) Guide

## Overview
Selecting the proper Primary Key (PK) strategy and architecting high-performance Row-Level Security (RLS) policies are essential requirements for modern, secure, multi-tenant databases.

---

## 1. Primary Key Strategy & Tradeoff Analysis

| Identifier Type | Size | Monotonic / Sortable | Distributed Safe | Index Fragmentation Risk | Recommended Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **UUIDv7 (RFC 9562)** | 16 bytes (128-bit) | **Yes** (Timestamp prefix) | **Yes** (No coordination) | **Zero / Minimal** (Appends to right edge of B-Tree) | **Default choice** for modern distributed, multi-tenant databases. |
| **UUIDv4** | 16 bytes (128-bit) | **No** (Completely random) | **Yes** | **Severe** (Page splits & cache eviction) | High-entropy secrets only. |
| **ULID** | 16 bytes (128-bit) | **Yes** | **Yes** | **Zero / Minimal** | JavaScript/Web string IDs. |
| **BIGINT IDENTITY** | 8 bytes (64-bit) | **Yes** | **No** | **Zero** | Small single-node internal tables. |

---

## 2. Row-Level Security (RLS) Deep Dive

### The Subquery Performance Optimization Rule
```sql
-- ❌ BAD RLS POLICY (Re-evaluates function per row):
CREATE POLICY "Users can read own documents"
ON documents FOR SELECT
USING (created_by = auth.uid());

-- ✅ OPTIMIZED RLS POLICY (Subquery evaluates auth.uid() ONCE per query):
CREATE POLICY "Users can read own documents"
ON documents FOR SELECT
USING (created_by = (SELECT auth.uid()));
```

---

## 3. Multi-Tenant Organization RLS Policy Suite

```sql
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents FORCE ROW LEVEL SECURITY;

CREATE POLICY "org_member_read_documents"
ON documents FOR SELECT
USING (
  organization_id IN (
    SELECT org_id
    FROM organization_memberships
    WHERE user_id = (SELECT auth.uid())
  )
);
```
