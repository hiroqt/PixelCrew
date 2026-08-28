# PixelCrew

<p align="center">
  <strong>Local Multi-Agent Orchestration Framework & Retro Pixel-Art Visual Dashboard</strong><br>
  <em>Turn any project into an observable, orchestrated AI engineering workspace with a single command.</em>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-Apache_2.0-blue.svg" alt="Apache 2.0 License"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg" alt="Node.js 18+"></a>
  <a href="package.json"><img src="https://img.shields.io/badge/Dependencies-Zero-orange.svg" alt="Zero Runtime Dependencies"></a>
  <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg" alt="PRs Welcome"></a>
  <a href="https://github.com/hiroqt/PixelCrew"><img src="https://img.shields.io/badge/Status-Active_v0.1.0-blueviolet.svg" alt="Release v0.1.0"></a>
</p>

```text
┌──────────────────────────────────────────────────────────────┐
│  PIXELCREW HQ                                    ● RUNNING   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                  ┌─────────────────┐                         │
│                  │   ORCHESTRATOR  │                         │
│                  │      ◉_◉        │                         │
│                  │   coordinating  │                         │
│                  └────────┬────────┘                         │
│                           │                                  │
│             ┌─────────────┼─────────────┐                    │
│             │             │             │                    │
│             ▼             ▼             ▼                    │
│        ┌─────────┐   ┌─────────┐   ┌─────────┐              │
│        │ FRONTEND│   │ BACKEND │   │DATABASE │              │
│        │  ▓▓▓▓   │   │  ▓▓▓▓   │   │  ▓▓▓▓   │              │
│        │ working │   │ working │   │ waiting │              │
│        └─────────┘   └─────────┘   └─────────┘              │
│                                                              │
│  ACTIVITY                                                    │
│  ──────────────────────────────────────────────────────────  │
│  03:15  orchestrator  → spawned frontend & backend           │
│  03:15  frontend      → auditing component client boundaries │
│  03:16  backend       → profiling API routes & latency       │
│  03:16  database      → analyzing Prisma queries & indexes   │
│  03:17  qa            → preparing automated regression suite │
│                                                              │
│  SKILLS                                                      │
│  ──────────────────────────────────────────────────────────  │
│  ✓ Codebase Intelligence                                     │
│  ✓ Next.js App Router                                        │
│  ✓ PostgreSQL Optimization                                   │
│  ✓ Prisma ORM                                                │
│  ◉ API Architecture                                          │
│  ◌ Playwright E2E                                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Table of Contents

- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [Key Features](#key-features)
- [Codebase Context Adaptation](#codebase-context-adaptation)
- [Skills Matrix & Capabilities](#skills-matrix--capabilities)
- [Installation Guide](#installation-guide)
  - [Workspace Installation](#1-workspace-installation)
  - [Global Antigravity Plugin](#2-global-antigravity-plugin)
- [CLI Command Reference](#cli-command-reference)
- [Configuration Reference](#configuration-reference)
- [Real-Time Event Streaming API](#real-time-event-streaming-api)
- [Antigravity & IDE Integration](#antigravity--ide-integration)
- [Dashboard Controls & Shortcuts](#dashboard-controls--shortcuts)
- [Development & Testing](#development--testing)
- [Documentation Index](#documentation-index)
- [Contributing & Community](#contributing--community)
- [License](#license)
- [Created By](#created-by)

---

## Quick Start

Run inside any project directory to initialize and launch:

```bash
# 1. Initialize PixelCrew in your repository (adapts automatically to your tech stack)
npx github:hiroqt/PixelCrew init

# 2. Start the orchestrator daemon & live visual dashboard
npx github:hiroqt/PixelCrew start

# 3. (Optional) Run an interactive multi-agent demo sprint immediately
npx github:hiroqt/PixelCrew demo
```

*(If published to npm, you can also use `npx pixelcrew init` & `npx pixelcrew start`)*

The visual dashboard will automatically open in your browser at:  
**`http://localhost:4747`** *(or the next available port if 4747 is in use)*

---

## Architecture Overview

```text
┌──────────────────────────────────────────────────────────────┐
│                       DEVELOPER / IDE                        │
│         npx github:hiroqt/PixelCrew init / start / task      │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                    ORCHESTRATION DAEMON                      │
│                                                              │
│  1. Codebase Analyzer     ──> Scans frameworks, ORMs, tests  │
│  2. Context Engine        ──> Grounds agents in codebase     │
│  3. DAG Task Planner      ──> Resolves agent dependencies    │
│  4. Concurrency Limiter   ──> Manages parallel execution     │
└──────────────────────────────┬───────────────────────────────┘
                               │
             ┌─────────────────┴─────────────────┐
             │                                   │
             ▼                                   ▼
┌─────────────────────────┐         ┌─────────────────────────┐
│     EVENT PIPELINE      │         │   AGENT SWARM ROSTER    │
│  • events.jsonl         │         │  • Orchestrator (Lead)  │
│  • SSE Broadcast Server │ <────── │  • Frontend Engineer    │
│  • REST API (/api/emit) │         │  • Backend Engineer     │
└────────────┬────────────┘         │  • Database Architect   │
             │                      │  • Security Sentinel    │
             ▼                      │  • Performance SRE      │
┌─────────────────────────┐         │  • QA Automation Lead   │
│  PIXEL STARTUP OFFICE   │         └─────────────────────────┘
│  • Floor 42 2D Canvas   │
│  • Workstation Drawers  │
│  • Slack Stream Feed    │
│  • Web Audio SFX Synth  │
└─────────────────────────┘
```

---

## Key Features

- **Automatic Codebase Context Adaptation**: Scans `package.json`, frameworks, database/ORMs (Prisma, Drizzle, PostgreSQL, MongoDB), API architecture, and test runners to automatically tailor agent roles, skills, and filesystem permissions.
- **Zero-Dependency Core & Dashboard**: Pure Node.js ESM orchestrator with lightweight vanilla HTML5, Canvas, and CSS. No heavy external runtime dependencies, instant startup.
- **Pixel-Art Aesthetic & CRT Shader**: 8-bit retro arcade styling, procedural canvas sprite animations, live scanlines toggle, and retro 8-bit synth sound effects (Web Audio API).
- **Multi-Agent State Machine**: Visual state tracking for every agent:
  - `IDLE` (`●_●`) -> `SPAWNING` (`░_░`) -> `ANALYZING` (`◉_⊙`) -> `WORKING` (`◉▂◉`) -> `VERIFYING` (`🔍_🔍`) -> `COMPLETED` (`^_^`) / `BLOCKED` (`?_?`) / `ERROR` (`x_x`)
- **Real-Time Event Streaming**: Low-latency Server-Sent Events (SSE) pipe `AgentEvent` payloads from CLI, local scripts, or external AI agents directly into the dashboard.
- **Skills Matrix & Capabilities**: Decoupled skill definitions (`.pixel-agents/skills/*.md`) mapped to agent roles with real-time status indicators (`✓`, `◉`, `◌`).
- **Dependency Graph & Task Decomposition**: Resolves directed acyclic graph (DAG) tasks (e.g. Database schema & Backend APIs before Frontend integration, followed by QA test suites).
- **Graceful Port Collision Handling**: Automatically catches `EADDRINUSE` conflicts and binds to the next available port (`4748`, `4749`...) without crashing.

---

## Codebase Context Adaptation

When initialized in an existing codebase, PixelCrew runs a static analysis sweep and extracts a comprehensive architecture profile:

```bash
npx github:hiroqt/PixelCrew analyze
```

### Example Profile Output:
```text
🔍 Analyzing Codebase Architecture & Context...

PROJECT:            kaffa-tea
LANGUAGES:          TypeScript, JavaScript
FRAMEWORKS:         Next.js (App Router), React, Tailwind CSS
BACKEND / API:      Node.js Route Handlers
DATABASE / ORM:     PostgreSQL, Prisma ORM
TESTING SUITE:      Vitest, Playwright
AUTH / SECURITY:    NextAuth / Auth.js
RECOMMENDED SKILLS: codebase-intelligence, nextjs, react, tailwind, prisma, postgresql, vitest, playwright-e2e, security-audit
```

This profile is cached in `.pixel-agents/context.json` so all subagents share grounded awareness of project conventions, directory paths, and dependencies.

---

## Skills Matrix & Capabilities

In PixelCrew, **agents are capability executors powered by modular skills**. Skills are structured as markdown instruction guides located in `.pixel-agents/skills/`:

| Skill | Target Agent(s) | Focus & Directives |
| :--- | :--- | :--- |
| **`codebase-intelligence`** | All Agents | Inspects `.pixel-agents/context.json`, extracts repository architecture, and grounds code generation in existing patterns. |
| **`nextjs`** | Frontend | App Router vs Pages Router patterns, Server Components, Route Handlers, metadata generation, and caching. |
| **`react`** | Frontend | Modern React 19 hooks, component modularization, state boundaries, and concurrent rendering optimizations. |
| **`tailwind`** | Frontend | Design tokens, responsive utility composition, dark mode, and anti-AI-slop layout rules. |
| **`api-architecture`** | Backend | RESTful OpenAPI 3.1 standards, error envelopes, rate limiting, and idempotency key middleware. |
| **`prisma`** | Database | Relational schema modeling, batched queries, migration lifecycle, and index optimization. |
| **`postgresql`** | Database | EXPLAIN ANALYZE interpretation, B-Tree & GIN indexing, connection pooling (PgBouncer), and transaction isolation. |
| **`drizzle`** | Database | Type-safe SQL schema design, relational queries, and zero-overhead migrations. |
| **`security-audit`** | Security | OWASP Top 10 mitigation, SQL injection prevention, XSS sanitization, and JWT/RBAC authorization audits. |
| **`performance-profiling`** | Performance | Core Web Vitals (LCP, INP, CLS), heap memory profiling, bundle reduction, and caching hierarchies. |
| **`vitest` / `jest`** | QA | Unit test suites, mock boundaries, snapshot assertions, and coverage thresholds. |
| **`playwright-e2e`** | QA | Resilient user journey tests, trace recording, and visual regression testing. |

---

## Installation Guide

### 1. Workspace Installation

Run in the root of any existing project:

```bash
# Initialize PixelCrew in current repository
npx github:hiroqt/PixelCrew init

# Start the dashboard and orchestrator
npx github:hiroqt/PixelCrew start
```

This scaffolds:
- `.pixel-agents/config.json`: Swarm concurrency, agent permissions, and dashboard settings.
- `.pixel-agents/context.json`: Detected tech stack and directory architecture.
- `.pixel-agents/state.json`: Active agent states and sprint progress.
- `.pixel-agents/events.jsonl`: Append-only event history log.
- `.pixel-agents/agents/`: Agent persona definitions.
- `.pixel-agents/skills/`: Tailored skill instruction files.
- `.pixel-dashboard/`: Standalone HTML5 canvas office dashboard.

### 2. Global Antigravity Plugin

To register PixelCrew across all projects in the Antigravity IDE:

```bash
# Create global plugin folder
mkdir -p ~/.gemini/config/plugins/pixel-agents/skills/pixel-agents

# Copy plugin manifest and skill instructions
cp /path/to/PixelCrew/plugins/plugin.json ~/.gemini/config/plugins/pixel-agents/plugin.json
cp /path/to/PixelCrew/.agents/skills/pixel-agents/SKILL.md ~/.gemini/config/plugins/pixel-agents/skills/pixel-agents/SKILL.md
```

---

## CLI Command Reference

| Command | Description | Example |
| :--- | :--- | :--- |
| `npx github:hiroqt/PixelCrew init` | Scaffolds & adapts `.pixel-agents/` to current codebase | `npx github:hiroqt/PixelCrew init --yes` |
| `npx github:hiroqt/PixelCrew analyze` | Scans repository and prints detected architecture profile | `npx github:hiroqt/PixelCrew analyze` |
| `npx github:hiroqt/PixelCrew start` | Launches orchestrator daemon, SSE stream & dashboard | `npx github:hiroqt/PixelCrew start --port 4747` |
| `npx github:hiroqt/PixelCrew dashboard` | Opens or serves the web dashboard UI | `npx github:hiroqt/PixelCrew dashboard` |
| `npx github:hiroqt/PixelCrew demo` | Boots swarm and dispatches a full simulated multi-agent mission | `npx github:hiroqt/PixelCrew demo` |
| `npx github:hiroqt/PixelCrew task "<msg>"` | Dispatches a new task to the running swarm or runs locally | `npx github:hiroqt/PixelCrew task "Fix slow queries"` |
| `npx github:hiroqt/PixelCrew emit` | Emits an event to the live dashboard stream | `npx github:hiroqt/PixelCrew emit --agent db --message "Done"` |
| `npx github:hiroqt/PixelCrew status` | Prints ASCII summary of current swarm state | `npx github:hiroqt/PixelCrew status` |
| `npx github:hiroqt/PixelCrew help` | Displays full CLI manual and available flags | `npx github:hiroqt/PixelCrew help` |

---

## Configuration Reference

Customize agent roles, permissions, concurrency, and theme in `.pixel-agents/config.json`:

```json
{
  "version": "0.1.0",
  "project": "my-saas-app",
  "orchestrator": {
    "enabled": true,
    "maxConcurrentAgents": 4,
    "autoDecompose": true,
    "logEvents": true
  },
  "agents": {
    "frontend": {
      "name": "Frontend Agent",
      "role": "UI/UX & Component Engineering",
      "sprite": "frontend",
      "color": "#00f0ff",
      "enabled": true,
      "maxTasks": 2,
      "skills": ["react", "nextjs", "tailwind", "codebase-intelligence"],
      "permissions": {
        "read": ["src/components/**", "src/pages/**", "src/styles/**"],
        "write": ["src/components/**", "src/styles/**"]
      }
    },
    "database": {
      "name": "Database Agent",
      "role": "Data Modeling & Query Optimization",
      "sprite": "database",
      "color": "#ffd700",
      "enabled": true,
      "maxTasks": 1,
      "skills": ["postgresql", "prisma", "query-optimization", "indexing"],
      "permissions": {
        "read": ["prisma/**", "db/**"],
        "write": ["prisma/**"]
      }
    },
    "qa": {
      "name": "QA Agent",
      "role": "End-to-End & Integration Testing",
      "sprite": "qa",
      "color": "#b026ff",
      "enabled": true,
      "dependsOn": ["frontend", "backend", "database"],
      "skills": ["testing", "vitest", "playwright-e2e"],
      "permissions": {
        "read": ["**/*"],
        "write": ["tests/**"]
      }
    }
  },
  "dashboard": {
    "enabled": true,
    "port": 4747,
    "theme": "pixel",
    "crtEffect": true,
    "soundEffects": true
  }
}
```

---

## Real-Time Event Streaming API

The dashboard listens to structured `AgentEvent` payloads over Server-Sent Events (SSE). You can stream events from **shell scripts**, **Git hooks**, or **Antigravity / Gemini subagents**:

### Via CLI:
```bash
npx github:hiroqt/PixelCrew emit \
  --agent database \
  --type tool \
  --skill prisma \
  --message "Inspecting schema for missing indexes"
```

### Via HTTP REST API:
```bash
curl -X POST http://localhost:4747/api/emit \
  -H "Content-Type: application/json" \
  -d '{
    "agent": "backend",
    "type": "skill",
    "skill": "api-architecture",
    "message": "Optimized /api/customers with cursor pagination"
  }'
```

### Event Payload Schema:
```typescript
type AgentEvent = {
  id?: string;
  timestamp: number;
  agent: "orchestrator" | "frontend" | "backend" | "database" | "security" | "performance" | "qa";
  type: "spawn" | "thinking" | "tool" | "skill" | "progress" | "complete" | "error";
  message: string;
  skill?: string;
  metadata?: Record<string, any>;
};
```

---

## Antigravity & IDE Integration

Whenever you prompt inside Antigravity IDE:
> *"Analyze the frontend of this project using Pixel Agents"*

The AI agent activates the `pixel-agents` skill and streams telemetry live to your dashboard:

```text
  You (in Antigravity IDE): "Analyze frontend using pixel agents"
                             │
                             ▼
  1. Agent emits: emit --agent frontend --type thinking --message "Analyzing Next.js routes"
  2. Agent emits: emit --agent frontend --type tool --skill nextjs --message "Inspecting page.tsx"
  3. Agent emits: emit --agent frontend --type complete --message "Identified 3 UI optimizations"
                             │
                             ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                      PIXELCREW LIVE DASHBOARD                          │
 │                                                                        │
 │  1. Frontend Sprite Animates: Starts typing fast with glowing screens  │
 │  2. Slack Live Feed: Logs [#FRONTEND → Inspecting page.tsx]            │
 │  3. 8-Bit Audio: Plays retro chime on skill completion                 │
 │  4. Skills Matrix: Next.js skill icon turns green (✓)                  │
 └────────────────────────────────────────────────────────────────────────┘
```

---

## Dashboard Controls & Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `[SPACE]` | Launch live multi-agent swarm demo |
| `[1]` | Inspect **Frontend Agent** details & permissions |
| `[2]` | Inspect **Backend Agent** details & permissions |
| `[3]` | Inspect **Database Agent** details & permissions |
| `[4]` | Inspect **Security Agent** details & permissions |
| `[5]` | Inspect **Performance Agent** details & permissions |
| `[6]` | Inspect **QA Agent** details & permissions |
| `[ESC]` | Close inspector modal |
| `CRT Toggle` | Toggle retro scanline shader effect |
| `NIGHT Toggle` | Toggle night shift / cyberpunk neon lighting |
| `SFX Toggle` | Toggle 8-bit Web Audio synth sounds |

---

## Development & Testing

Clone the repository and run the test suite:

```bash
# Clone repository
git clone https://github.com/hiroqt/PixelCrew.git
cd PixelCrew

# Run automated tests
npm test
```

---

## Documentation Index

- [Design Specifications](DESIGN.md) — Visual tokens, canvas coordinate engine, typography, and audio synthesis.
- [Product Vision & Roadmap](PRODUCT.md) — Problem statement, user personas, architecture, and roadmap (v0.1 to v0.5).
- [Contribution Guidelines & PR Standards](CONTRIBUTING.md) — Branch naming, conventional commits, and review checklist.
- [Apache 2.0 License](LICENSE) — Full legal terms and third-party font notices.

---

## Contributing & Community

We warmly welcome contributions from the open-source community!

- **Contribute Skills**: Add new domain markdown guides to `.pixel-agents/skills/` (e.g. GraphQL, Supabase, Redis, Rust).
- **Add Agent Personas**: Create new specialized agent profiles for the startup office (e.g. Data Scientist, Cloud Architect).
- **Enhance the Dashboard**: Improve procedural canvas animations, sound synthesizers, or add custom office packs.
- **Report Issues**: Open an issue at [github.com/hiroqt/PixelCrew/issues](https://github.com/hiroqt/PixelCrew/issues).

Please review [CONTRIBUTING.md](CONTRIBUTING.md) for full branch naming and commit guidelines.

---

## License

Licensed under the **Apache License, Version 2.0** (the "License"). You may obtain a copy of the License at:

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the [LICENSE](LICENSE) for details.

---

## Created by

Created with care by:
- **Arnel** ([GitHub @hiroqt](https://github.com/hiroqt))
- In collaboration with the **Antigravity Swarm** community.
