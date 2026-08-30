# Clean Backend Architecture & Anti-Spaghetti Code Guide

## 1. Core Architectural Philosophy
A maintainable backend isolates business logic from transport protocols (HTTP/GraphQL/gRPC) and database infrastructure.

Spaghetti backend code results from:
1. Fat route handlers executing raw SQL queries, hashing passwords, sending emails, and formatting JSON all in a single callback.
2. Anemic domain models with leaky database abstractions.
3. Hardcoded environment variables and tight coupling to external SDKs.
4. Unhandled error paths and arbitrary non-standard error JSON responses.

---

## 2. Directory Structures Across Modern Backend Stacks

### A. TypeScript / Node.js (Clean Architecture / Hexagonal — NestJS, Fastify, Express)
```
src/
├── domain/                     # Core Business Entities & Value Objects (Zero External Dependencies)
│   ├── entities/
│   │   ├── user.entity.ts
│   │   └── order.entity.ts
│   └── errors/
│       └── domain-errors.ts
├── application/                # Use Cases & Orchestration Services
│   ├── use-cases/
│   │   ├── create-order.use-case.ts
│   │   └── authenticate-user.use-case.ts
│   └── interfaces/             # Port Interfaces (Repository & Gateway contracts)
│       ├── order-repository.interface.ts
│       └── payment-gateway.interface.ts
├── infrastructure/             # Adapters (Databases, External APIs, Message Brokers)
│   ├── database/
│   │   ├── prisma/             # Prisma or Drizzle ORM schemas & repositories
│   │   │   └── prisma-order.repository.ts
│   │   └── redis/              # Redis caching & rate limiter adapters
│   └── integrations/
│       └── stripe-payment.gateway.ts
├── interfaces/                 # Inbound Controllers & API Transport
│   ├── http/
│   │   ├── routes/             # REST Route Handlers & Zod Schemas
│   │   │   └── orders.route.ts
│   │   ├── middlewares/        # Auth, Rate Limiting, Logging, RFC 7807 Error Handler
│   │   └── error-envelope.ts
│   └── websockets/
└── config/                     # Type-safe environment configuration (Zod-validated)
    └── env.ts
```

### B. Python (FastAPI / Django Modern Clean Architecture)
```
app/
├── core/                       # App configuration, security, database session
│   ├── config.py
│   ├── database.py
│   └── security.py
├── api/                        # HTTP Routers & Endpoints
│   ├── v1/
│   │   ├── endpoints/
│   │   │   ├── auth.py
│   │   │   └── projects.py
│   │   └── router.py
│   └── dependencies.py         # FastAPI Dependency Injections (Auth, DB session)
├── services/                   # Business Logic & Use Cases
│   ├── auth_service.py
│   └── project_service.py
├── repositories/               # SQLAlchemy / Tortoise ORM Data Access
│   └── project_repository.py
├── models/                     # Database Models (SQLAlchemy / Beanie)
│   └── project.py
└── schemas/                    # Pydantic Request/Response DTOs
    └── project.py
```

### C. Go (Standard Clean Package Layout)
```
cmd/
└── server/
    └── main.go
internal/
├── domain/                     # Pure business domain entities & interfaces
│   └── project.go
├── service/                    # Business use cases
│   └── project_service.go
├── repository/                 # PostgreSQL / pgx data access
│   └── postgres_project.go
└── handler/                    # HTTP Handlers (Chi / Gin / Fiber)
    ├── project_handler.go
    └── middleware/
pkg/                            # Shared reusable libraries
└── logger/
```

---

## 3. Anti-Spaghetti Rules for Backend Systems

### Rule 1: Controllers Do Only 3 Things
1. Parse & validate incoming DTOs (`req.body`, `req.params`, `req.query`).
2. Call the domain service / use case.
3. Return the standard HTTP response or delegate to the global RFC 7807 error handler.

### Rule 2: Uniform RFC 7807 Error Envelopes
Never return inconsistent error formats like `{ error: "bad" }` on one route and `{ message: "failed", code: 400 }` on another. Enforce standard RFC 7807 Problem Details:

```json
{
  "type": "https://api.example.com/errors/insufficient-permissions",
  "title": "Forbidden",
  "status": 403,
  "detail": "User lacks admin privileges for workspace org_992.",
  "instance": "/v1/organizations/org_992/billing",
  "invalidParams": []
}
```

### Rule 3: Idempotency Keys on All Mutating Endpoints
All mutating POST/PUT endpoints (payments, orders, resource creation) must accept an `Idempotency-Key` header stored in Redis with atomic `SET key val NX EX 86400` to prevent duplicate operations during network retries.
