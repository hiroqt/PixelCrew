# Codebase Intelligence & AST Context Adaptation

## 1. Automated Architecture Profiling

Pixel Crew agents inspect the repository before writing code to adapt to existing conventions:

1. **Dependency Analysis (`package.json`, `go.mod`, `Cargo.toml`, `requirements.txt`)**:
   - Detect UI Framework: React 18/19, Vue 3, Svelte 5, Astro, SolidJS, or Vanilla.
   - Detect Backend Engine: Express, Fastify, NestJS, FastAPI, Gin, Axum, or Django.
   - Detect Database / ORM: Prisma, Drizzle, Kysely, TypeORM, SQLAlchemy, or raw SQL.
   - Detect Styling: Tailwind CSS, CSS Modules, Vanilla CSS, Styled Components.
   - Detect Testing: Vitest, Jest, Playwright, Cypress, Pytest, Go testing.
2. **Directory Topology Extraction**:
   - Identify whether project follows `src/app/`, `src/features/`, `pages/`, `internal/`, or flat monolith.
   - Adapt import alias conventions (e.g. `@/components` vs `~/components` vs relative `../../`).

---

## 2. Cross-Agent Knowledge Sharing

Agents persist and share architectural metadata in `.pixel-agents/context.json` and `.pixel-crew/state.json`, ensuring Frontend, Backend, and QA subagents work with identical API contracts, type definitions, and schema migrations.
