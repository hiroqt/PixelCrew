# Modern API Protocols & Standards Guide

## Overview
Comprehensive reference for implementing modern API protocols (REST, GraphQL, gRPC, tRPC, SSE, WebSockets, Webhooks) and standardizing error handling with RFC 7807.

---

## 1. Protocol Comparison & Selection Matrix

| Protocol | Transport | Serialization | Multiplexing | Streaming Support | Best For |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **REST (OpenAPI 3.1)** | HTTP/1.1, HTTP/2 | JSON | No (H1) / Yes (H2) | Chunked transfer | Public developer APIs, webhooks, CRUD resources |
| **GraphQL** | HTTP/POST | JSON | Yes (over H2) | Subscriptions (WS/SSE) | Complex frontends with variable client data requirements |
| **gRPC** | HTTP/2 | Protobuf (Binary) | Native H2 multiplexing | Unary, Client/Server/Bi-di | Internal microservices, high-throughput RPC, polyglot backends |
| **tRPC** | HTTP/RPC | JSON / SuperJSON | Batching | Subscriptions | End-to-end type-safe TypeScript full-stack monorepos |
| **Server-Sent Events (SSE)**| HTTP/1.1, HTTP/2 | Text (`text/event-stream`)| Yes (over H2) | Unidirectional server $\to$ client | LLM token streaming, live sports scores, progress bars |
| **WebSockets** | TCP / WS | Binary / Text | Single socket connection | Full duplex bidirectional | Real-time chat, collaborative whiteboards, multiplayer gaming |

---

## 2. API Standard Specifications

### A. RFC 7807 / RFC 9457 Problem Details Error Standard
Never return arbitrary `{ error: "something failed" }`. Use the standard problem details JSON format:

```json
{
  "type": "https://api.example.com/errors/invalid-payment-method",
  "title": "Invalid Payment Method",
  "status": 422,
  "detail": "The provided credit card expiration year 2021 is in the past.",
  "instance": "/v1/checkouts/chk_984129/pay",
  "invalid_params": [
    {
      "name": "exp_year",
      "reason": "Must be greater than or equal to current calendar year"
    }
  ],
  "trace_id": "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01"
}
```

---

### B. GraphQL N+1 Query Elimination with DataLoader

```typescript
import DataLoader from 'dataloader';
import { db } from '@/database';

export const createUserLoader = () =>
  new DataLoader<string, User>(async (userIds) => {
    const users = await db.query(
      'SELECT * FROM users WHERE id = ANY($1)',
      [userIds]
    );

    const userMap = new Map(users.rows.map((u) => [u.id, u]));
    return userIds.map((id) => userMap.get(id) || null);
  });
```

---

### C. Server-Sent Events (SSE) for LLM Token Streaming

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';

export async function streamCompletionHandler(req: FastifyRequest, reply: FastifyReply) {
  reply.raw.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  const stream = await llmClient.chat.completions.create({
    model: 'gpt-4o',
    messages: req.body.messages,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      reply.raw.write(`event: token\ndata: ${JSON.stringify({ text: content })}\n\n`);
    }
  }

  reply.raw.write(`event: done\ndata: [DONE]\n\n`);
  reply.raw.end();
}
```
