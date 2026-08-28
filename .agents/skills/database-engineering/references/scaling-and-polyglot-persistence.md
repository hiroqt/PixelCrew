# Database Scaling, Connection Pooling & Partitioning Guide

## Overview
Database scaling requires architectural discipline across connection pooling, read/write splitting, declarative table partitioning, and event-driven Change Data Capture (CDC).

---

## 1. Connection Pooling & Little's Law

$$\text{Active Connections Needed} = \text{Requests Per Second (TPS)} \times \text{Average Query Latency (Seconds)}$$

Use **Transaction Pooling** (PgBouncer, Supavisor, RDS Proxy) for web and serverless backends to keep active database connections minimal.

---

## 2. Declarative Table Partitioning

```sql
CREATE TABLE audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid_v7(),
  tenant_id UUID NOT NULL,
  action VARCHAR(64) NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
) PARTITION BY RANGE (created_at);

CREATE TABLE audit_logs_2026_01 PARTITION OF audit_logs
  FOR VALUES FROM ('2026-01-01 00:00:00+00') TO ('2026-02-01 00:00:00+00');
```
