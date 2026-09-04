/**
 * PIXEL CREW — Canonical Production Skills & Reference Bundler
 * 
 * Provides full-fidelity, production-grade skill definitions with complete YAML frontmatter,
 * architectural rubrics, anti-AI pattern criteria, fluid typography curves, and reference guides
 * for replication across all AI IDE providers (.kiro, .cursor, .claude, .agents, .codex, etc.).
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../..');
const AGENTS_SKILLS_DIR = path.join(ROOT_DIR, '.agents', 'skills');
const SKILL_DIR = path.join(ROOT_DIR, 'skill');

/**
 * Normalizes and sanitizes YAML frontmatter to prevent IDE parser errors
 */
export function sanitizeFrontmatter(rawContent) {
  if (!rawContent || !rawContent.startsWith('---')) return rawContent;
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return rawContent;

  const rawFrontmatter = match[1];
  const body = match[2];

  const lines = rawFrontmatter.split('\n');
  const sanitizedLines = [];
  let currentKey = null;
  let currentValueParts = [];

  for (const line of lines) {
    const keyMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (keyMatch) {
      if (currentKey) {
        const fullVal = currentValueParts.join(' ').replace(/^['"]|['"]$/g, '').trim();
        sanitizedLines.push(`${currentKey}: ${fullVal}`);
      }
      currentKey = keyMatch[1];
      const initialVal = keyMatch[2].trim();
      currentValueParts = (initialVal === '>-' || initialVal === '>' || initialVal === '|' || initialVal === '|-') ? [] : [initialVal];
    } else if (currentKey && line.trim().length > 0) {
      currentValueParts.push(line.trim());
    }
  }

  if (currentKey) {
    const fullVal = currentValueParts.join(' ').replace(/^['"]|['"]$/g, '').trim();
    sanitizedLines.push(`${currentKey}: ${fullVal}`);
  }

  return `---\n${sanitizedLines.join('\n')}\n---\n\n${body.trim()}\n`;
}

/**
 * Embedded fallback skill definitions for zero-dependency standalone execution
 */
export const EMBEDDED_SKILLS = {
  'pixelcrew': {
    name: 'pixelcrew',
    content: `---
name: pixelcrew
description: Autonomous Multi-Agent Engineering Swarm & Retro Pixel-Art Startup Office. Orchestrates 23 specialized commands across Creative Director, UX Planner, Design System Architect, Frontend Engineer, Backend Engineer, Performance SRE, Security Sentinel, and QA Automation personas.
version: 0.2.5
author: Arnel (@hiroqt)
---

# 🏢 PixelCrew — Autonomous Multi-Agent Engineering Swarm

> **Floor 42, Pixel Corps HQ**: Transform any codebase into an observable, choreographed engineering workspace with anti-AI design synthesis, mathematical fluid typography, and automated E2E testing.

---

## ⚡ Floor 42 Swarm Command Suite

All commands can be invoked via \`/pixelcrew <command>\`, direct slash commands (e.g. \`/<command>\`), or in chat:

### 1. 🚀 Creation & Architecture
- \`/pixelcrew init\` (or \`init\` in chat): Scans codebase architecture, configures .pixel-crew/, and adapts agent squad.
- \`/pixelcrew assemble [prompt]\` (aliases: \`/assemble\`, \`/craft\`, \`/sprint\`): Full shape-then-build multi-agent sprint pipeline from brief to production code.
- \`/pixelcrew blueprint [prompt]\` (aliases: \`/blueprint\`, \`/shape\`, \`/spec\`): Plans UX section topologies, wireframes, and compiles dynamic DAG task graphs *before* writing code.
- \`/pixelcrew boss-fight <issue>\` (aliases: \`/boss-fight\`, \`/fix\`, \`/debug\`): Targeted swarm bug blitz to isolate, repair, and verify breaking issues.
- \`/pixelcrew manifest\`: Reverse-engineers active project code into comprehensive \`DESIGN.md\` and \`PRODUCT.md\` architectural specifications.
- \`/pixelcrew retrofit\`: Extracts reusable UI primitives, Tailwind tokens, and CSS variables into the centralized design system.

### 2. 🎨 Pixel Aesthetic & Anti-AI Direction
- \`/pixelcrew render\`: 6-dimension Anti-AI design & UX review (Originality, Hierarchy, Typography, Layout, Brand, Slop Penalty >= 8.5/10).
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
`,
    references: {
      'commands-reference.md': `# PixelCrew Command Reference\n\nDetailed breakdown of all 23 Floor 42 commands.`,
      'anti-ai-rubric.md': `# Anti-AI Rubric\n\nQuantitative 6-dimension evaluation matrix.`,
      'testing-and-qa-strategy.md': `# Modern QA Testing Strategy & Test Maintainability Guide\n\nPractical testing pyramid, MSW network mocking, and non-flaky Playwright E2E tests.`
    }
  },

  'anti-ai-patterns': {
    name: 'anti-ai-patterns',
    content: `---
name: anti-ai-patterns
description: Strict Anti-AI-Generated Design Critic and Quality Guardian for Pixel Crew. Automatically detects monotonous card grids, purple gradient blobs, fake AI sparkles, and cliché copywriting. Enforces intentional asymmetry, expressive typography, dynamic section rhythm, and bespoke brand language.
---

# Anti-AI-Generated Design Skill

The **Anti-AI-Patterns Skill** acts as an uncompromising aesthetic critic and quality guardian within the Pixel Crew framework. It does **not** write raw UI code—its sole objective is to inspect, score, and reject synthetic tropes before they reach the user.

---

## 1. Automated Detection Matrix

The skill executes static and visual pattern recognition to flag forbidden design markers:

\`\`\`
❌ FORBIDDEN PATTERNS
├── ❌ Purple/blue radiant gradient blobs behind hero headline
├── ❌ Every feature enclosed in identical rounded cards with 16px radius
├── ❌ Overused glassmorphism, muddy backdrop-filter blurs on all surfaces
├── ❌ Generic hype copy ("Revolutionize your workflow", "Supercharge your business")
├── ❌ Floating AI sparkles (✨, 🪄) and generic emoji badges
├── ❌ Perfectly symmetrical 3-column or 4-column identical cards
├── ❌ Generic fake SaaS dashboard screenshots with pastel bar charts
├── ❌ Random meaningless icons at top of every single card
├── ❌ Identical cards repeated 6 times across the homepage
└── ❌ Generic "Get Started" / "Start Free Trial" CTA on every button
\`\`\`

---

## 2. Enforced Design Principles

When a forbidden pattern is identified, the skill mandates immediate compliance with these principles:

\`\`\`
✓ ENFORCED PRINCIPLES
├── ✓ Intentional asymmetry (offset columns, varied row spans, staggered layout)
├── ✓ Expressive typography hierarchy (dramatic scale contrast, fluid clamp scales)
├── ✓ Distinct section compositions (never stack two similar grid layouts)
├── ✓ Brand-specific visual language (bespoke color schemes, tailored borders)
├── ✓ Purposeful whitespace (generous breathing room, clear spatial gravity)
├── ✓ Custom micro-interactions (magnetic hover, subtle reveal transitions)
├── ✓ Realistic, authentic copy (concrete technical specifics, real narratives)
├── ✓ Visual rhythm (alternating dense technical specs and airy display breaks)
└── ✓ Restrained decoration (decorations <= 10% surface area)
\`\`\`

---

## 3. Rubric Evaluation & Actionable Critique

The skill computes the quantitative visual score and generates structured critique:

\`\`\`json
{
  "visualScore": 9.1,
  "threshold": 8.5,
  "passed": true,
  "rubric": {
    "originality": 9.1,
    "typography": 9.4,
    "layout": 8.8,
    "visual_hierarchy": 9.2,
    "brand_consistency": 9.0,
    "generic_ai_penalty": 0.8
  },
  "critique": [
    {
      "issue": "Testimonial section uses a repetitive 3-card layout.",
      "reason": "Three equal width cards with centered avatars look like a standard SaaS template.",
      "fix": "Replace cards with an editorial horizontal quote layout, large typography, and asymmetric metadata placement."
    }
  ]
}
\`\`\`

---

## 4. Execution Workflow

1. **Inspect Layout Blueprint**: Review UX wireframe and component topology before code generation.
2. **Audit Rendered Output / DOM**: Scan generated JSX/HTML for repeated card patterns, generic color classes, and cliché phrasing.
3. **Trigger Refinement Task**: If \`visualScore < 8.5\` or critical anti-patterns exist, formulate a targeted refinement task for the Frontend Builder squad.
`,
    references: {
      'anti-ai-rubric.md': `# Anti-AI Rubric\n\nQuantitative 6-dimension evaluation matrix for human-grade web design.`,
      'anti-ai-slop-guidelines.md': `# Anti-AI Slop & Aesthetic Quality Guidelines\n\nStrict negative constraints eliminating synthetic textures and generic templates.`
    }
  },

  'design-director': {
    name: 'design-director',
    content: `---
name: design-director
description: Lead Creative Direction and Aesthetic Strategy skill for Pixel Crew. Defines the authentic visual personality, architectural concept, typography strategy, asymmetric layout rules, and strict anti-AI constraints before any code is generated. Answers "What should this website actually feel like?"
---

# Design Director Skill

The **Design Director** is the creative soul of Pixel Crew. Its primary directive is to **strictly decouple visual and architectural strategy from code generation**.

AI website generators frequently produce bland, generic "AI slop" when prompts jump directly into coding. The Design Director enforces a deliberate creative phase where artistic intent, mood, typography, layout rhythm, and negative constraints are codified into an executable design specification.

---

## 1. Creative Direction Blueprint

When presented with any user prompt or client brief, the Design Director outputs a structured creative direction manifest:

\`\`\`json
{
  "design_direction": "editorial technology studio",
  "concept": "Precise, quiet, architectural, spatial",
  "visual_personality": [
    "confident",
    "minimal",
    "technical",
    "asymmetric"
  ],
  "layout_strategy": "asymmetric grid with intentional whitespace & varying density",
  "typography_strategy": "expressive display serif paired with crisp mono/sans micro-labels",
  "color_strategy": "deep obsidian base with warm architectural stone accents and high-contrast ink",
  "animation_strategy": "subtle purposeful motion, smooth reveals, zero bouncy gimmicks",
  "avoid": [
    "generic SaaS cards with uniform border-radius",
    "purple and blue glowing mesh gradients",
    "excessive glassmorphism and frosted blur overlays",
    "uniform 3-column feature grids",
    "hero with floating fake dashboard screenshot",
    "floating AI sparkles and generic rocket/sparkle icons",
    "cliché copy like 'Revolutionize your workflow'"
  ]
}
\`\`\`

---

## 2. Core Creative Responsibilities

1. **Define the Soul and Feeling**:
   - What atmosphere does this brand inhabit? (e.g., Swiss brutalism, luxury editorial, utilitarian engineering lab, warm organic artisan).
2. **Establish Asymmetric & Dynamic Rhythms**:
   - Avoid monotonous block-after-block repetition. Alternating rhythm between expansive airy sections, dense data grids, kinetic split-screens, and typography focal points.
3. **Select Character-Rich Typography**:
   - Ban default generic fonts (\`Inter\`, browser system fonts used without intent).
   - Require purposeful pairings (e.g., *Instrument Serif* + *Plus Jakarta Sans*, *Syne* + *JetBrains Mono*, *Playfair Display* + *Space Grotesk*).
4. **Curate Harmonious Chromatic Palettes**:
   - Ban generic saturated primaries and purple/cyan AI gradients.
   - Formulate tailored HSL/Hex palettes with authentic tonal depth, high-contrast text ratios (WCAG AAA), and restrained accent usage (<= 10% surface area).
`,
    references: {
      'bento-and-asymmetry-guide.md': `# Bento Grid Topology & Asymmetric Layout Guide\n\nModular compartments, spatial rhythm, and broken symmetry.`,
      'typography-and-palette-system.md': `# Typography Matrix & HSL Chromatic Palette System\n\nMathematical fluid clamp scales and 60-30-10 color rules.`,
      'anti-ai-rubric.md': `# Anti-AI Rubric\n\nQuantitative 6-dimension evaluation matrix.`
    }
  },

  'frontend-engineering': {
    name: 'frontend-engineering',
    content: `---
name: frontend-engineering
description: Comprehensive guide for modern front-end engineering across all major modern tech stacks (React 19/Next.js App Router, Vue 3/Nuxt 3, Svelte 5 Runes, SolidJS, Astro, Modern Vanilla CSS, TypeScript). Enforces strict UI/UX standards, anti-AI-slop design rules, dynamic typography systems, and WCAG 2.1/2.2 AA/AAA accessibility compliance.
---

# Frontend Engineering & UI/UX Standards

This skill provides comprehensive instructions, architectural patterns, and strict quality guidelines for building modern, accessible, high-performance web applications across all major front-end tech stacks.

---

## 1. Core Engineering Directives

1. **Zero AI Slop**: Reject generic AI-generated aesthetic tropes (purple/cyan neon glow mesh gradients on black cards, floating pill eyebrow badges on every header, nested card-in-a-card syndrome, fake neon input glow rings). Design with intentional typography, crisp borders, purposeful hierarchy, authentic whitespace, and structured design tokens.
2. **Dynamic User/Brand-Driven Typography**: Select font pairings and modular scales tailored directly to the application domain and user aesthetic preference (Geometric, Humanist, Editorial Serif, Neo-Grotesque, or Developer Mono). Utilize mathematical fluid type scales with CSS \`clamp()\`, optimal line measures (\`45–75ch\`), and tabular numerals for data dashboards.
3. **WCAG 2.1 / 2.2 AA & AAA Compliance**: Semantic HTML first, rigorous contrast ratios (4.5:1 text, 3:1 graphical elements/focus rings, 7:1 AAA where applicable), robust keyboard navigation (\`:focus-visible\`, focus trapping in modals/drawers, roving tabindex), full screen reader accessibility (\`aria-expanded\`, \`aria-controls\`, \`aria-live\`, \`aria-hidden\`), and \`@media (prefers-reduced-motion: reduce)\`.
4. **Modern Framework & Styling Mastery**:
   - **React 19 / Next.js**: App Router, Server Components (RSC) vs Client Components boundary, Server Actions, Suspense & Streaming SSR.
   - **Vue 3 / Nuxt 3**: Composition API (\`<script setup>\`), Pinia state management, Nitro server engine.
   - **Svelte 5 / SvelteKit**: Runes (\`$state\`, \`$derived\`, \`$effect\`, \`$props\`), Universal load, Form actions.
   - **SolidJS / SolidStart**: Fine-grained signals, Resource, Suspense.
   - **Astro 4+**: Islands Architecture, Content Collections, View Transitions.
   - **Styling**: Modern Vanilla CSS (\`@layer\`, Container Queries \`@container\`, \`:has()\`, Subgrid, CSS variables design token architecture, Nesting).
`,
    references: {
      'clean-component-architecture.md': `# Clean Frontend Architecture & Anti-Spaghetti Code Guide\n\nFeature-based modules, custom hooks separation, and 150-line component rules.`,
      'anti-ai-slop-guidelines.md': `# Anti-AI Slop & UI/UX Aesthetic Rules\n\nDetailed guidance for eliminating generic templates, awkward spacing, and synthetic textures.`,
      'typography-system-matrix.md': `# Dynamic Typography System & Font Matrix\n\nFluid clamp() mathematical formulas and font pairing recommendations.`,
      'wcag-a11y-audit-checklist.md': `# WCAG 2.1/2.2 AA/AAA Accessibility Audit Checklist\n\nChecklist for focus states, color contrast, ARIA landmarks, and keyboard navigation.`
    }
  },

  'backend-engineering': {
    name: 'backend-engineering',
    content: `---
name: backend-engineering
description: Comprehensive guide for modern backend engineering across enterprise architectures (Clean Architecture, Hexagonal/Ports & Adapters, Modular Monoliths, Event-Driven Microservices). Covers API standards (REST with OpenAPI 3.1 & RFC 7807, GraphQL with DataLoader, gRPC, tRPC, WebSockets, SSE, Webhooks), enterprise rate limiting, resilience, OAuth 2.1 / OIDC / PASETO security, and OpenTelemetry observability.
---

# Modern Backend Engineering Standards

This skill provides comprehensive instructions, architectural blueprints, enterprise security rules, and resilience patterns for building scalable, fault-tolerant backend systems.

---

## 1. Core Engineering Directives

1. **Architectural Discipline & Decoupling**: Isolate core business domain logic from transport protocols, external services, and databases.
2. **Modern API Standards**:
   - **REST**: OpenAPI 3.1 specifications, JSON Schema validation, RFC 7807 Problem Details error envelopes.
   - **GraphQL**: Strict depth & complexity limits, batching with DataLoader to eliminate N+1 resolution.
   - **Real-Time**: WebSockets with heartbeats and reconnection backoff; Server-Sent Events (SSE) for streaming AI/agent outputs.
3. **Enterprise Rate Limiting & Abuse Prevention**: Implement Redis sliding window rate limiters with Lua atomic scripts.
4. **Resilience & Distributed Safety**: Enforce idempotency keys on mutating endpoints, circuit breakers on third-party dependencies, and exponential backoff with jitter.
`,
    references: {
      'clean-backend-architecture.md': `# Clean Backend Architecture & Anti-Spaghetti Code Guide\n\nDomain-driven use cases, Hexagonal port/adapters, and standard RFC 7807 error envelopes.`,
      'api-protocols-and-standards.md': `# API Protocols & Standards\n\nREST OpenAPI 3.1, GraphQL DataLoader, and WebSockets/SSE streaming.`,
      'rate-limiting-and-resilience.md': `# Rate Limiting & Resilience\n\nRedis sliding window rate limiters, idempotency keys, and circuit breakers.`,
      'security-and-observability.md': `# Security & Observability\n\nOAuth 2.1, OIDC, PASETO, and OpenTelemetry tracing.`
    }
  },

  'database-engineering': {
    name: 'database-engineering',
    content: `---
name: database-engineering
description: Comprehensive guide for database engineering, advanced indexing strategies (B-Tree, GIN, GiST, BRIN, composite indexing column order, covering indexes, partial indexes, EXPLAIN ANALYZE tuning), primary key architecture (UUIDv7 vs UUIDv4 vs ULID vs BIGINT IDENTITY), Row-Level Security (RLS) policy optimization for multi-tenant isolation, database scaling & connection pooling, and modern SQL & NoSQL hosting.
---

# Database Engineering & Storage Architecture

This skill provides comprehensive instructions, query optimization runbooks, primary key selection models, RLS security policies, and scaling architectures across modern SQL and NoSQL storage engines.

---

## 1. Core Engineering Directives

1. **Strategic Index Design**:
   - **Composite Index Column Order Rule**: Place columns tested for **Equality first**, followed by columns used for **Range / Ordering** (\`(tenant_id, status, created_at)\`).
   - **Covering Indexes (\`INCLUDE\`)**: Add non-search payload columns to the index leaf level to achieve 100% **Index-Only Scans** without heap lookups.
   - **Partial / Filtered Indexes**: Index only active or non-null subsets (\`WHERE is_deleted = false\`), saving 80–95% disk space.
2. **Modern Primary Key Strategy**: Default to **UUIDv7 (RFC 9562)** for distributed and high-scale relational databases. UUIDv7 provides 128-bit time-ordered keys that eliminate B-Tree fragmentation and page splits.
3. **High-Performance Row-Level Security (RLS)**:
   - Always wrap auth function calls in subqueries: \`(SELECT auth.uid())\` instead of \`auth.uid()\` so the query planner evaluates the authentication context **once per query** rather than **once per row**.
   - Ensure every column referenced in RLS policies (e.g. \`tenant_id\`, \`user_id\`) is backed by a B-Tree index.
`,
    references: {
      'indexing-and-explain-guide.md': `# Indexing & Query Optimization Guide\n\nB-Tree equality-first rules, covering indexes, and EXPLAIN ANALYZE tuning.`,
      'primary-key-and-rls-guide.md': `# Primary Key Strategy & Row-Level Security (RLS)\n\nUUIDv7 RFC 9562 vs ULID and subquery cached RLS policies.`,
      'database-migrations-and-pooling.md': `# Database Migrations, Connection Pooling & Scaling Guide\n\nZero-downtime Expand-Contract pattern and Little's Law connection sizing.`,
      'sql-and-nosql-hosting-guide.md': `# Modern SQL & NoSQL Hosting Architecture\n\nPostgreSQL, Supabase, Neon, DynamoDB, MongoDB, Redis, ClickHouse, and pgvector.`
    }
  },

  'performance-engineering': {
    name: 'performance-engineering',
    content: `---
name: performance-engineering
description: Comprehensive guide for full-stack performance engineering across frontend Core Web Vitals (LCP, INP, CLS, TTFB, streaming SSR, priority hints, main thread yielding), backend runtime profiling, multi-tier caching (L1 in-memory, L2 Redis, L3 CDN Edge, XFetch stampede prevention), database query tuning, network transport, automated k6 load & stress testing, and SLA/SLO/SLI error budgets.
---

# Full-Stack Performance Engineering & Optimization

This skill provides comprehensive instructions, diagnostic runbooks, caching architectures, and load testing patterns for delivering sub-second user experiences and high-throughput systems.

---

## 1. Core Engineering Directives

1. **Core Web Vitals Mastery**:
   - **LCP < 2.5s (Target: < 0.8s)**: Preload LCP hero images with \`fetchpriority="high"\`, eliminate render-blocking CSS/JS, and utilize streaming SSR.
   - **INP < 200ms (Target: < 50ms)**: Yield main thread execution during long tasks via \`scheduler.yield()\` or \`setTimeout()\`.
   - **CLS < 0.1 (Target: 0)**: Set explicit width/height or \`aspect-ratio\` on all image, video, and iframe containers.
2. **Multi-Tier Caching Architecture**: Implement L1 in-memory LRU cache + L2 distributed Redis cache with probabilistic early recomputation (XFetch algorithm) to prevent cache stampedes.
`,
    references: {
      'core-web-vitals-runbook.md': `# Core Web Vitals (CWV) & Performance Runbook\n\nLCP hero preloading, INP scheduler.yield(), and CLS prevention.`,
      'production-readiness-checklist.md': `# Pre-Production Readiness Checklist\n\nFull-stack verification before shipping to production.`
    }
  },

  'codebase-intelligence': {
    name: 'codebase-intelligence',
    content: `---
name: codebase-intelligence
description: Static codebase analysis and context adaptation engine for multi-agent swarms. Automatically inspects repository dependencies, directory structures, ORMs (Prisma, Drizzle), API routes (Next.js, Express, FastAPI), UI frameworks (React, Vue, Tailwind), and testing runners (Vitest, Playwright) to tailor agent skills and file permissions.
---

# Codebase Intelligence & Context Adaptation

## Directives
1. **Analyze First**: Inspect \`.pixel-crew/context.json\` and repository AST to understand existing dependencies, directory structure, and coding patterns.
2. **Context-Aware Code Generation**: Adhere to existing naming conventions, TypeScript configs, ESLint rules, and import paths (e.g. \`@/components\` vs \`../components\`).
3. **Cross-Agent Knowledge Sharing**: Share API schemas, database models, and route contracts across Frontend, Backend, and QA subagents.
`,
    references: {
      'codebase-analysis-and-context.md': `# Codebase Intelligence & AST Context Adaptation\n\nAutomated architecture profiling, dependency inspection, and cross-agent context sharing.`
    }
  },

  'token-efficiency': {
    name: 'token-efficiency',
    content: `---
name: token-efficiency
description: Universal token optimization and context conservation engine across AI coding agents and IDEs (Claude, Google Antigravity, Cursor, Kiro, Windsurf, GitHub Copilot). Slashes token usage by 50% to 75% through AST symbol-graph extraction, multi-turn context pruning, prompt caching, compact diffs, and structured JSON schemas.
---

# Universal Token Efficiency & Context Conservation

## Directives
1. **Symbol-Graph AST Extraction**: Extract only needed type signatures, interface definitions, and function headers rather than dumping full 1000-line source files into prompt context.
2. **Prompt Caching Discipline**: Structure instructions with static system prefixes first and dynamic user inputs last to achieve ~90% prompt cache hit rates.
3. **Diff-Only Code Delivery**: Emit surgical unified diffs rather than re-transmitting entire unchanged files.
`,
    references: {
      'universal-token-efficiency-guide.md': `# Universal Token Efficiency Guide\n\nAST symbol-graph extraction, prompt caching maximization, and surgical diff delivery.`
    }
  }
};

/**
 * Loads a full skill bundle (SKILL.md + references) from disk or embedded fallback
 */
export async function getSkillBundle(rawSkillId) {
  if (!rawSkillId) return null;
  const normId = String(rawSkillId).toLowerCase().replace(/^@pixel-crew\//, '').replace(/\.md$/, '');
  const parts = normId.split('/');
  const skillKey = parts.length > 1 ? parts[1] : parts[0];

  // 1. Direct match in EMBEDDED_SKILLS
  if (EMBEDDED_SKILLS[normId]) {
    const embedded = EMBEDDED_SKILLS[normId];
    return {
      id: normId,
      name: embedded.name || normId,
      content: sanitizeFrontmatter(embedded.content),
      references: embedded.references || {}
    };
  }

  if (EMBEDDED_SKILLS[skillKey]) {
    const embedded = EMBEDDED_SKILLS[skillKey];
    return {
      id: skillKey,
      name: embedded.name || skillKey,
      content: sanitizeFrontmatter(embedded.content),
      references: embedded.references || {}
    };
  }

  // 2. Try reading from disk (.agents/skills/ or skill/)
  const diskCandidates = [
    path.join(AGENTS_SKILLS_DIR, normId),
    path.join(AGENTS_SKILLS_DIR, skillKey)
  ];

  if (skillKey === 'pixelcrew' || normId === 'pixelcrew') {
    diskCandidates.push(path.join(ROOT_DIR, 'skill'));
  }

  for (const dir of diskCandidates) {
    try {
      const skillMdPath = path.join(dir, 'SKILL.md');
      const rawContent = await fs.readFile(skillMdPath, 'utf-8');
      const content = sanitizeFrontmatter(rawContent);

      const references = {};
      const refDir = path.join(dir, 'references');
      try {
        const refFiles = await fs.readdir(refDir);
        for (const rf of refFiles) {
          if (rf.endsWith('.md')) {
            references[rf] = await fs.readFile(path.join(refDir, rf), 'utf-8');
          }
        }
      } catch {}

      return {
        id: skillKey,
        name: skillKey,
        content,
        references
      };
    } catch {}
  }

  // 3. Return null so installer/scaffold uses generateSkillMarkdown
  return null;
}

/**
 * Returns all canonical skill identifiers
 */
export function getAllCanonicalSkillIds() {
  return Object.keys(EMBEDDED_SKILLS);
}
