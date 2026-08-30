---
name: codebase-intelligence
description: Static codebase analysis and context adaptation engine for multi-agent swarms. Automatically inspects repository dependencies, directory structures, ORMs (Prisma, Drizzle), API routes (Next.js, Express, FastAPI), UI frameworks (React, Vue, Tailwind), and testing runners (Vitest, Playwright) to tailor agent skills and file permissions.
---

# Codebase Intelligence & Context Adaptation Skill

## Directives
1. **Analyze First**: Inspect `.pixel-agents/context.json` and directory layout before modifying source files.
2. **Context-Aware Code Generation**: Adhere to existing project conventions (TypeScript strictness, path aliases `@/`, ESLint rules, component structures).
3. **Cross-Agent Knowledge Sharing**: Share API schemas, database migrations, and type definitions across Frontend, Backend, and QA subagents.
