/**
 * Default templates for pixel-agents initialization (.pixel-agents/ and .pixel-dashboard/)
 */

export const DEFAULT_CONFIG = {
  version: "0.1.0",
  project: "my-orchestrated-app",
  orchestrator: {
    enabled: true,
    maxConcurrentAgents: 4,
    autoDecompose: true,
    logEvents: true
  },
  agents: {
    frontend: {
      name: "Frontend Agent",
      role: "UI/UX & Component Engineering",
      sprite: "frontend",
      color: "#00f0ff",
      enabled: true,
      maxTasks: 2,
      skills: ["react", "nextjs", "tailwind", "ui-optimization", "frontend-engineering"],
      permissions: {
        read: ["src/**", "components/**", "pages/**", "app/**", "public/**", "styles/**"],
        write: ["src/components/**", "src/pages/**", "src/app/**", "src/styles/**"]
      }
    },
    creativeDirector: {
      name: "Creative Director",
      role: "Aesthetic Direction & Art Strategy",
      sprite: "creative",
      color: "#ff8800",
      enabled: true,
      maxTasks: 1,
      skills: ["design-director", "anti-ai-patterns", "typography-strategy"],
      permissions: {
        read: ["**/*"],
        write: ["design/**", "specs/**", ".pixel-crew/design/**"]
      }
    },
    uxPlanner: {
      name: "UX Planner",
      role: "Information Architecture & Section Flow",
      sprite: "ux",
      color: "#ffaa00",
      enabled: true,
      maxTasks: 1,
      skills: ["ux-topology", "asymmetric-layout", "flow-architecture"],
      permissions: {
        read: ["**/*"],
        write: ["design/**", "specs/**"]
      }
    },
    designSystem: {
      name: "Design System Architect",
      role: "Tokens, Fluid Typography & Theme Engine",
      sprite: "tokens",
      color: "#00e676",
      enabled: true,
      maxTasks: 1,
      skills: ["design-tokens", "fluid-type-scales", "tailwind-theme"],
      permissions: {
        read: ["styles/**", "tailwind.config.*", "src/styles/**"],
        write: ["styles/**", "tailwind.config.*", "src/styles/**"]
      }
    },
    visualCritic: {
      name: "Visual Critic",
      role: "Anti-AI Rubric Scorer & Refinement Loop",
      sprite: "critic",
      color: "#e040fb",
      enabled: true,
      maxTasks: 1,
      skills: ["anti-ai-patterns", "visual-rubric-scoring", "design-review"],
      permissions: {
        read: ["**/*"],
        write: ["reports/**", ".pixel-crew/reports/**"]
      }
    },
    backend: {
      name: "Backend Agent",
      role: "API Architecture & Server Logic",
      sprite: "backend",
      color: "#ff007f",
      enabled: true,
      maxTasks: 2,
      skills: ["api-architecture", "node", "express", "auth"],
      permissions: {
        read: ["src/api/**", "server/**", "routes/**", "controllers/**", "lib/**"],
        write: ["src/api/**", "server/**", "routes/**", "controllers/**"]
      }
    },
    database: {
      name: "Database Agent",
      role: "Data Modeling & Query Optimization",
      sprite: "database",
      color: "#ffd700",
      enabled: true,
      maxTasks: 1,
      skills: ["postgresql", "prisma", "query-optimization", "indexing"],
      permissions: {
        read: ["prisma/**", "db/**", "migrations/**", "models/**"],
        write: ["prisma/**", "db/**", "migrations/**"]
      }
    },
    security: {
      name: "Security Agent",
      role: "Vulnerability Scanning & Hardening",
      sprite: "security",
      color: "#ff3344",
      enabled: true,
      maxTasks: 1,
      skills: ["security-audit", "owasp", "auth-validation"],
      permissions: {
        read: ["**/*"],
        write: ["security/**", ".env.example"]
      }
    },
    performance: {
      name: "Performance Agent",
      role: "Speed Profiling & Core Web Vitals",
      sprite: "performance",
      color: "#39ff14",
      enabled: true,
      maxTasks: 1,
      skills: ["performance-profiling", "lcp-optimization", "memory-profiling"],
      permissions: {
        read: ["**/*"],
        write: ["src/**"]
      }
    },
    qa: {
      name: "QA Agent",
      role: "End-to-End & Integration Testing",
      sprite: "qa",
      color: "#b026ff",
      enabled: true,
      maxTasks: 1,
      dependsOn: ["frontend", "backend", "database"],
      skills: ["testing", "e2e-testing", "regression-suite"],
      permissions: {
        read: ["**/*"],
        write: ["tests/**", "__tests__/**", "cypress/**", "playwright/**"]
      }
    }
  },
  dashboard: {
    enabled: true,
    port: 4747,
    theme: "pixel",
    crtEffect: true,
    soundEffects: true
  }
};

export const INITIAL_STATE = {
  status: "READY",
  activeTask: "System initialized and waiting for commands",
  startedAt: null,
  completedAt: null,
  orchestrator: {
    state: "IDLE",
    expression: "◉_◉",
    activeSubtasks: 0,
    totalSubtasks: 0,
    progress: 0
  },
  agents: {
    frontend: {
      state: "IDLE",
      expression: "●_●",
      currentTask: "Awaiting tasks...",
      progress: 0,
      skillsStatus: {
        "react": "idle",
        "nextjs": "idle",
        "tailwind": "idle",
        "ui-optimization": "idle"
      }
    },
    backend: {
      state: "IDLE",
      expression: "●_●",
      currentTask: "Awaiting tasks...",
      progress: 0,
      skillsStatus: {
        "api-architecture": "idle",
        "node": "idle",
        "express": "idle",
        "auth": "idle"
      }
    },
    database: {
      state: "IDLE",
      expression: "●_●",
      currentTask: "Awaiting tasks...",
      progress: 0,
      skillsStatus: {
        "postgresql": "idle",
        "prisma": "idle",
        "query-optimization": "idle",
        "indexing": "idle"
      }
    },
    security: {
      state: "IDLE",
      expression: "●_●",
      currentTask: "Awaiting tasks...",
      progress: 0,
      skillsStatus: {
        "security-audit": "idle",
        "owasp": "idle",
        "auth-validation": "idle"
      }
    },
    performance: {
      state: "IDLE",
      expression: "●_●",
      currentTask: "Awaiting tasks...",
      progress: 0,
      skillsStatus: {
        "performance-profiling": "idle",
        "lcp-optimization": "idle",
        "memory-profiling": "idle"
      }
    },
    qa: {
      state: "IDLE",
      expression: "●_●",
      currentTask: "Awaiting tasks...",
      progress: 0,
      skillsStatus: {
        "testing": "idle",
        "e2e-testing": "idle",
        "regression-suite": "idle"
      }
    }
  }
};

export const AGENT_MARKDOWNS = {
  "orchestrator.md": `---
name: orchestrator
role: Master Swarm Coordinator
expression: ◉_◉
description: Decomposes top-level goals into parallel subagent execution graphs, schedules tasks, and monitors state transitions.
---

# Orchestrator Agent

## Core Directives
1. Analyze top-level developer intent and decompose into directed acyclic graph (DAG) tasks.
2. Delegate specialized subtasks to Frontend, Backend, Database, Security, Performance, and QA agents.
3. Coordinate dependency resolution (e.g. Database schema before API controllers; API endpoints before UI binding; QA validation after UI/API completion).
4. Stream structured \`AgentEvent\` logs in real-time to the pixel dashboard.
`,

  "frontend.md": `---
name: frontend-agent
role: Frontend Engineer
sprite: frontend
color: "#00f0ff"
skills:
  - react
  - nextjs
  - tailwind
  - ui-optimization
permissions:
  read: ["src/**", "components/**", "pages/**", "app/**", "public/**", "styles/**"]
  write: ["src/components/**", "src/pages/**", "src/app/**", "src/styles/**"]
---

# Frontend Agent

Specialized in client-side architecture, modern UI design systems, responsive rendering, component refactoring, and state management.
`,

  "backend.md": `---
name: backend-agent
role: Backend & API Engineer
sprite: backend
color: "#ff007f"
skills:
  - api-architecture
  - node
  - express
  - auth
permissions:
  read: ["src/api/**", "server/**", "routes/**", "controllers/**", "lib/**"]
  write: ["src/api/**", "server/**", "routes/**", "controllers/**"]
---

# Backend Agent

Specialized in REST/GraphQL/tRPC endpoints, middleware pipelines, authentication/authorization flows, and server-side business logic.
`,

  "database.md": `---
name: database-agent
role: Database & Data Architect
sprite: database
color: "#ffd700"
skills:
  - postgresql
  - prisma
  - query-optimization
  - indexing
permissions:
  read: ["prisma/**", "db/**", "migrations/**", "models/**"]
  write: ["prisma/**", "db/**", "migrations/**"]
---

# Database Agent

Specialized in schema migrations, relational modeling, Prisma/SQL optimization, index creation, and transaction safety.
`,

  "security.md": `---
name: security-agent
role: Security & Hardening Sentinel
sprite: security
color: "#ff3344"
skills:
  - security-audit
  - owasp
  - auth-validation
permissions:
  read: ["**/*"]
  write: ["security/**", ".env.example"]
---

# Security Agent

Specialized in static vulnerability scanning, OWASP Top 10 mitigation, secret leakage checks, and cryptographic token verification.
`,

  "performance.md": `---
name: performance-agent
role: Performance & Profiling Engineer
sprite: performance
color: "#39ff14"
skills:
  - performance-profiling
  - lcp-optimization
  - memory-profiling
permissions:
  read: ["**/*"]
  write: ["src/**"]
---

# Performance Agent

Specialized in Core Web Vitals (LCP, INP, CLS), heap memory profiling, bundle size reduction, and asset caching strategies.
`,

  "qa.md": `---
name: qa-agent
role: QA & Testing Automation
sprite: qa
color: "#b026ff"
dependsOn:
  - frontend
  - backend
  - database
skills:
  - testing
  - e22-testing
  - regression-suite
permissions:
  read: ["**/*"]
  write: ["tests/**", "__tests__/**", "cypress/**", "playwright/**"]
---

# QA Agent

Specialized in integration testing, unit test coverage, end-to-end user journeys, and regression verification across all components.
`
};

export const SKILL_MARKDOWNS = {
  "codebase-intelligence.md": `# Codebase Intelligence & Context Adaptation Skill

## Directives
1. **Analyze First**: Inspect \`.pixel-crew/context.json\` and repository AST to understand existing dependencies, directory structure, and coding patterns.
2. **Context-Aware Code Generation**: Adhere to existing naming conventions, TypeScript configs, ESLint rules, and import paths (e.g. \`@/components\` vs \`../components\`).
3. **Cross-Agent Knowledge Sharing**: Share API schemas, database models, and route contracts across Frontend, Backend, and QA subagents.
`,

  "react.md": `# React Skill
Techniques for component modularization, custom hooks, React Server Components (RSC), and concurrent rendering optimizations.
`,

  "nextjs.md": `# Next.js Skill
App Router patterns, server actions, route handlers, metadata generation, and dynamic caching configurations.
`,

  "prisma.md": `# Prisma Skill
Schema modeling, relation mappings, batch transaction queries, and efficient Prisma client lifecycle handling.
`,

  "postgresql.md": `# PostgreSQL Skill
Index types (B-Tree, GIN, BRIN), EXPLAIN ANALYZE interpretation, connection pooling, and ACID constraint enforcement.
`,

  "drizzle.md": `# Drizzle ORM Skill
Type-safe SQL schemas, relational queries, prepared statements, and zero-overhead database migrations.
`,

  "api-architecture.md": `# API Architecture Skill
Standardized RESTful responses, idempotency keys, OpenAPI documentation, and rate-limiting middleware.
`,

  "query-optimization.md": `# Query Optimization Skill
Elimination of N+1 query patterns, selective field projection, pagination with cursor indices, and subquery optimization.
`,

  "security-audit.md": `# Security Audit Skill
Detection of SQL injection, XSS vectors, CSRF tokens, secure cookie headers, and RBAC permission checks.
`,

  "testing.md": `# Testing Skill
Unit testing with Vitest/Jest, snapshot testing, mock boundaries, and deterministic assertion patterns.
`,

  "vitest.md": `# Vitest Skill
High-performance unit and integration testing with ESM support, concurrent test suites, and in-source testing.
`,

  "playwright-e2e.md": `# Playwright E2E Skill
End-to-end browser automation, trace recording, visual regression testing, and resilient locator strategies.
`,

  "performance-profiling.md": `# Performance Profiling Skill
Flamegraph inspection, DOM layout thrashing identification, memory leak detection, and network payload minification.
`,

  "design-director.md": `# Design Director Skill
Artistic direction and aesthetic strategy. Decouples visual soul and layout rhythm from code generation.
`,

  "anti-ai-patterns.md": `# Anti-AI Patterns Skill
Strict aesthetic critic rejecting generic templates, purple mesh blobs, and repetitive card grids.
`,

  "token-efficiency.md": `# Token Efficiency Skill
Context conservation across Claude, Antigravity, Cursor, Kiro, Windsurf, and Copilot through AST symbol extraction.
`,

  "pixelcrew.md": `---
name: pixelcrew
description: Autonomous Multi-Agent Engineering Swarm & Retro Pixel-Art Startup Office. Orchestrates 23 specialized commands across Creative Director, UX Planner, Design System Architect, Frontend Engineer, Backend Engineer, Performance SRE, Security Sentinel, and QA Automation personas.
version: 0.2.4
author: Arnel (@hiroqt)
---

# 🏢 PixelCrew — Autonomous Multi-Agent Engineering Swarm

> **Floor 42, Pixel Corps HQ**: Transform any codebase into an observable, choreographed engineering workspace with anti-AI design synthesis, mathematical fluid typography, and automated E2E testing.

---

## ⚡ Floor 42 Swarm Command Suite

All commands can be invoked via \`/pixelcrew <command>\`, direct slash commands (e.g. \`/<command>\`), or the CLI (\`npx pixelcrew <command>\`):

### 1. 🚀 Creation & Architecture
- \`/pixelcrew assemble [prompt]\` (aliases: \`/assemble\`, \`/craft\`, \`/sprint\`): Full shape-then-build multi-agent sprint pipeline from brief to production code.
- \`/pixelcrew blueprint [prompt]\` (aliases: \`/blueprint\`, \`/shape\`, \`/spec\`): Plans UX section topologies, wireframes, and compiles dynamic DAG task graphs *before* writing code.
- \`/pixelcrew boss-fight <issue>\` (aliases: \`/boss-fight\`, \`/fix\`, \`/debug\`): Targeted swarm bug blitz to isolate, repair, and verify breaking issues.
- \`/pixelcrew manifest\`: Reverse-engineers active project code into comprehensive \`DESIGN.md\` and \`PRODUCT.md\` architectural specifications.
- \`/pixelcrew retrofit\`: Extracts reusable UI primitives, Tailwind tokens, and CSS variables into the centralized design system.

### 2. 🎨 Pixel Aesthetic & Anti-AI Direction
- \`/pixelcrew render\`: 6-dimension Anti-AI design & UX review (Originality, Hierarchy, Typography, Layout, Brand, Slop Penalty).
- \`/pixelcrew 8bit\`: Adds retro arcade delight: procedural Web Audio chimes, CRT phosphor scanlines, and tactile feedback.
- \`/pixelcrew overdrive\`: Injects high-end technical effects: WebGL/Canvas shaders, interactive terminal console, reactive backgrounds.
- \`/pixelcrew chromatic [palette]\`: Injects curated HSL color tokens, dark mode elevation surfaces, and atmospheric accent tiers.
- \`/pixelcrew typeset [preset]\`: Fixes font pairings, applies mathematical fluid \`clamp()\` type scales, and establishes expressive typography.
- \`/pixelcrew bento [section]\`: Reorganizes sections into asymmetric Bento grids, dynamic viewport flow, and zero horizontal overflow.
- \`/pixelcrew de-slop [section]\`: Strips AI cliché copywriting with grounded technical value propositions.

### 3. 🛡️ Production Hardening & SRE
- \`/pixelcrew sentinel\`: Security & resilience pass: OWASP checks, SQL injection prevention, RFC 7807 error envelopes, and rate limiting.
- \`/pixelcrew audit\`: Runs technical quality checks: a11y WCAG AA/AAA, Core Web Vitals (LCP < 0.6s), and Playwright E2E journeys.
- \`/pixelcrew warp\`: Full-stack performance tuning: streaming SSR, bundle minification, and AST prompt caching.
- \`/pixelcrew polish\`: Final shipping readiness pass: design system token alignment, type checks, and aesthetic cleanup.

---

## 👥 Floor 42 Personas & Squad Roles
1. **Lead Orchestrator (\`orchestrator\`)**: DAG task decomposition, context extraction, and subagent synthesis.
2. **Creative Director (\`creativeDirector\`)**: Aesthetic strategy, brand soul, and strict anti-AI constraints.
3. **UX Planner (\`uxPlanner\`)**: Asymmetric section layouts, user flow, and interaction specs.
4. **Design System Architect (\`designSystem\`)**: HSL tokens, mathematical \`clamp()\` typography, and surface tiers.
5. **Frontend Engineer (\`frontend\`)**: Next.js 14/15 App Router, React 19, TypeScript, and Tailwind CSS.
6. **Backend & Database Engineer (\`backend\`, \`database\`)**: Type-safe route handlers, RFC 7807 envelopes, Prisma/Postgres schemas.
7. **Performance & Security SRE (\`performance\`, \`security\`)**: Core Web Vitals, CSP headers, OWASP audit, and token pruning.
8. **QA Automation Engineer (\`qa\`)**: Playwright E2E user journeys, visual regression, and audit reports.
`
};

