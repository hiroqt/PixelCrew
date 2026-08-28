# Modern Backend Architecture Guide

## Overview
High-performance backend systems require strict separation of concerns, testability, and resilient data flows. This guide details Clean/Hexagonal Architecture, Modular Monoliths, and Event-Driven Microservices patterns.

---

## 1. Clean / Hexagonal (Ports & Adapters) Architecture

### Layered Dependency Rule
Dependencies must point **inward** toward the core Domain Entities. The domain must never depend on database drivers, ORMs, HTTP frameworks, or cloud SDKs.

```text
+-------------------------------------------------------------+
| Frameworks & Drivers (Express/Fastify/Gin, Postgres, Kafka) |
|   +-------------------------------------------------------+ |
|   | Interface Adapters (Controllers, Presenters, Repos)   | |
|   |   +-------------------------------------------------+ | |
|   |   | Application Business Rules (Use Cases/Services) | | |
|   |   |   +-------------------------------------------+ | | |
|   |   |   | Enterprise Domain Entities & Rules        | | | |
|   |   |   +-------------------------------------------+ | | |
|   |   +-------------------------------------------------+ | |
|   +-------------------------------------------------------+ |
+-------------------------------------------------------------+
```

### TypeScript Clean Architecture Implementation

```typescript
// 1. DOMAIN LAYER (Zero external dependencies)
export interface UserProps {
  id: string;
  email: string;
  hashedPassword: string;
  organizationId: string;
  role: 'admin' | 'member' | 'viewer';
  createdAt: Date;
}

export class User {
  private constructor(private readonly props: UserProps) {}

  public static create(props: Omit<UserProps, 'id' | 'createdAt'> & { id?: string }): User {
    if (!props.email.includes('@')) {
      throw new Error('Invalid email format');
    }
    return new User({
      ...props,
      id: props.id ?? crypto.randomUUID(),
      createdAt: new Date(),
    });
  }

  public get id(): string { return this.props.id; }
  public get email(): string { return this.props.email; }
  public get organizationId(): string { return this.props.organizationId; }
  public get role(): string { return this.props.role; }
}

// 2. DOMAIN PORTS (Interfaces declared by domain)
export interface UserRepositoryPort {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

// 3. APPLICATION USE CASE LAYER
export interface CreateUserDTO {
  email: string;
  passwordRaw: string;
  organizationId: string;
  role: 'admin' | 'member' | 'viewer';
}

export class CreateUserUseCase {
  constructor(
    private readonly userRepo: UserRepositoryPort,
    private readonly passwordHasher: { hash(pw: string): Promise<string> },
    private readonly eventPublisher: { publish(topic: string, event: unknown): Promise<void> }
  ) {}

  async execute(dto: CreateUserDTO): Promise<{ id: string; email: string }> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await this.passwordHasher.hash(dto.passwordRaw);
    const user = User.create({
      email: dto.email,
      hashedPassword,
      organizationId: dto.organizationId,
      role: dto.role,
    });

    await this.userRepo.save(user);

    await this.eventPublisher.publish('user.created', {
      userId: user.id,
      email: user.email,
      organizationId: user.organizationId,
      timestamp: new Date().toISOString(),
    });

    return { id: user.id, email: user.email };
  }
}
```

---

## 2. Distributed Data Patterns

### A. The Transactional Outbox Pattern
Ensures dual-write safety when updating a database and publishing an event to a message broker (Kafka, RabbitMQ, SQS). Eliminates distributed transaction failures.

```sql
CREATE TABLE outbox_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aggregate_type VARCHAR(64) NOT NULL,
  aggregate_id VARCHAR(64) NOT NULL,
  event_type VARCHAR(128) NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ NULL
);

CREATE INDEX idx_outbox_unprocessed ON outbox_events (created_at) WHERE processed_at IS NULL;
```
