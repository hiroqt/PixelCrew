# Modern SQL & NoSQL Hosting Architecture Guide

## Overview
Modern application backends rely on polyglot persistence. Choosing the right database engine and managed cloud provider guarantees scalability, reliability, and cost-efficiency.

---

## 1. Modern SQL Hosting Providers Comparison

| Provider | Core Engine | Key Superpower | Best Use Case | Scaling Model |
| :--- | :--- | :--- | :--- | :--- |
| **Supabase** | PostgreSQL 16+ | Integrated Auth, Realtime, Storage, pgvector, and native RLS | Full-stack web apps, multi-tenant SaaS, Mobile apps | Managed instances with Supavisor pooler |
| **Neon** | Serverless PostgreSQL | Instant branching (copy-on-write) & scale-to-zero compute | Preview environments, CI/CD pipelines, variable traffic apps | Separated compute and storage; scales compute in 500ms |
| **CockroachDB** | Distributed SQL (Postgres wire) | Multi-region active-active ACID transactions, Raft consensus | Global financial applications, high-resilience systems | Multi-region distributed node clusters |
| **Turso (LibSQL)** | Edge SQLite | Ultra low-latency edge replicas (< 10ms worldwide) | Microservices, embedded edge storage, CLI tools | Embedded SQLite replicas synced to primary |
| **AWS Aurora Serverless v2** | PostgreSQL / MySQL | In-place scaling in fractions of an ACU without downtime | Enterprise workloads requiring AWS VPC native integration | Auto-scaling Aurora Capacity Units (ACUs) |

---

## 2. Modern NoSQL & Multi-Model Providers Comparison

| Provider | Data Model | Key Strengths | Query Capabilities | Best Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **AWS DynamoDB** | Key-Value / Wide Column | Single-digit millisecond latency at any scale; zero server management | Single-Table Design with Partition Key (PK) & Sort Key (SK); GSI/LSI | High-scale ecommerce, gaming leaderboards, shopping carts |
| **MongoDB Atlas** | Document (BSON) | Dynamic schema, rich nested object queries, Atlas Search (Lucene) | Aggregation pipelines, Geospatial, Full-text search | Catalogs, Content Management, Event logs, User profiles |
| **Redis / Upstash / Dragonfly** | In-Memory Key-Value / Data Structures | Microsecond read/write latency; REST-based edge API (Upstash) | Hashes, Sets, Sorted Sets, Bitmaps, HyperLogLog, Streams | Caching, Rate limiting, Session stores, Pub/Sub, Queues |
| **Pinecone / Qdrant / pgvector** | Vector Embeddings | Approximate Nearest Neighbor (ANN) HNSW vector indexing | Cosine similarity, Euclidean distance, Dot product (`<=>`, `<->`) | AI / LLM RAG pipelines, semantic search, recommendation engines |
| **ClickHouse / Tinybird** | Columnar OLAP | Scans 100M+ rows per second; massive real-time analytics | Standard SQL with vectorized columnar execution | Web analytics, product telemetry, IoT timeseries |

---

## 3. Zero-Downtime Schema Migrations (Expand-Contract Pattern)

1. **Phase 1 (Expand)**: Add new column; write to both old and new.
2. **Phase 2 (Backfill)**: Asynchronously backfill historic rows.
3. **Phase 3 (Switch Read)**: Point all queries to read from new column.
4. **Phase 4 (Contract)**: Drop old column safely.
