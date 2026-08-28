# Pixel Agents

> **Local Multi-Agent Orchestration Framework & Retro Pixel-Art Visual Dashboard**  
> Turn any project into an orchestrated AI workspace with a single `npx` command.

```text
┌──────────────────────────────────────────────────────────────┐
│  PIXEL AGENTS                                    ● RUNNING   │
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
│  02:41  orchestrator  → spawned backend                     │
│  02:41  backend       → analyzing API routes                │
│  02:42  frontend      → inspecting dashboard                │
│  02:42  database      → analyzing Prisma queries            │
│  02:43  backend       → found 3 slow endpoints              │
│                                                              │
│  SKILLS                                                      │
│  ──────────────────────────────────────────────────────────  │
│  ✓ PostgreSQL optimization                                   │
│  ✓ Prisma                                                    │
│  ◉ API architecture                                          │
│  ◌ React performance                                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Quick Start

Run inside any project directory to initialize and launch:

```bash
# 1. Initialize Pixel Agents in your repository (adapts automatically to your stack)
npx pixel-agents init

# 2. Start the orchestrator & visual dashboard
npx pixel-agents start

# 3. (Optional) Run an interactive multi-agent demo immediately
npx pixel-agents demo
```

The visual dashboard will automatically open at:  
**`http://localhost:4747`**

---

## Key Features

- **Automatic Codebase Context Adaptation**: When initialized in an existing repository, Pixel Agents scans your `package.json`, frameworks, database/ORMs (Prisma, Drizzle, PostgreSQL, MongoDB), API architecture, and test runners to automatically tailor agent roles, skills, and filesystem permissions.
- **Zero-Dependency Core & Dashboard**: Pure Node.js ESM orchestrator with lightweight vanilla HTML5, Canvas, and CSS. No heavy external runtime dependencies, instant startup.
- **Pixel-Art Aesthetic & CRT Shader**: 8-bit retro arcade styling, procedural canvas sprite animations, live scanlines toggle, and retro 8-bit synth sound effects (Web Audio API).
- **Multi-Agent State Machine**: Visual state tracking for every agent:
  - `IDLE` (`●_●`) -> `SPAWNING` (`░_░`) -> `ANALYZING` (`◉_⊙`) -> `WORKING` (`◉▂◉`) -> `VERIFYING` (`🔍_🔍`) -> `COMPLETED` (`^_^`) / `BLOCKED` (`?_?`) / `ERROR` (`x_x`)
- **Real-Time Event Streaming**: Low-latency Server-Sent Events (SSE) pipe `AgentEvent` payloads from CLI, local scripts, or external AI agents directly into the dashboard.
- **Skills Matrix & Capabilities**: Decoupled skill definitions (`.pixel-agents/skills/*.md`) mapped to agent roles with real-time status indicators (`✓`, `◉`, `◌`).
- **Dependency Graph & Task Decomposition**: Resolves directed acyclic graph (DAG) tasks (e.g. Database schema & Backend APIs before Frontend integration, followed by QA test suites).
- **CLI Event Emitter (`emit`)**: Stream events into the dashboard from shell scripts, Git hooks, Antigravity agents, or custom LLMs.

---

## About the Skills System

In Pixel Agents, **Agents are not hardcoded personas—they are capability executors powered by modular skills**.

Instead of coupling logic directly inside agent prompts, capabilities are structured as standalone markdown instruction files located in `.pixel-agents/skills/` (and `.agents/skills/`). Each skill teaches an agent specific engineering patterns, verification checklists, and tool constraints.

### Core Bundled Skills

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

## How to Install the Skills

### Method 1: Local Workspace Installation (Inside Any Project)

To equip any repository with the skills engine:

```bash
# 1. Navigate to your project repository
cd /path/to/my-project

# 2. Run the initialization command (automatically detects stack & generates tailored skills)
npx pixel-agents init

# 3. Add custom skills anytime by placing new markdown files in .pixel-agents/skills/
# Example: .pixel-agents/skills/stripe-payments.md
```

### Method 2: Global Antigravity / Gemini Plugin Installation

To install Pixel Agents as a **global skill** available across every repository in your Antigravity IDE:

```bash
# 1. Create the global plugin directory
mkdir -p ~/.gemini/config/plugins/pixel-agents/skills/pixel-agents

# 2. Copy the plugin manifest and skill instructions
cp /path/to/pixel-agents/plugins/plugin.json ~/.gemini/config/plugins/pixel-agents/plugin.json
cp /path/to/pixel-agents/.agents/skills/pixel-agents/SKILL.md ~/.gemini/config/plugins/pixel-agents/skills/pixel-agents/SKILL.md
```

Once installed globally, you can invoke Pixel Agents in any project simply by prompting:
> *"Use pixel-agents to scan this codebase and orchestrate the feature sprint."*

---

## Project Structure Scaffolding

Running `npx pixel-agents init` creates the following directory structure in your repository:

```text
my-project/
│
├── .pixel-agents/
│   │
│   ├── agents/
│   │   ├── orchestrator.md      # Master Swarm Coordinator
│   │   ├── frontend.md          # UI/UX & React/Next.js Engineer
│   │   ├── backend.md           # API Architecture & Server Engineer
│   │   ├── database.md          # Data Architect & Prisma/Postgres
│   │   ├── security.md          # OWASP & Vulnerability Hardening
│   │   ├── performance.md       # Core Web Vitals & Profiling
│   │   └── qa.md                # E2E & Integration Testing
│   │
│   ├── skills/
│   │   ├── codebase-intelligence.md
│   │   ├── react.md
│   │   ├── nextjs.md
│   │   ├── prisma.md
│   │   ├── postgresql.md
│   │   ├── api-architecture.md
│   │   ├── query-optimization.md
│   │   ├── security-audit.md
│   │   └── testing.md
│   │
│   ├── config.json              # Swarm configuration & permissions
│   ├── context.json             # Static codebase analysis profile
│   ├── state.json               # Current swarm runtime state
│   └── events.jsonl             # Append-only event history stream
│
├── .pixel-dashboard/            # Self-contained visual UI
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
└── ...
```

---

## CLI Command Reference

| Command | Description | Example |
| :--- | :--- | :--- |
| `npx pixel-agents init` | Scaffolds & adapts `.pixel-agents/` to current codebase | `npx pixel-agents init --yes` |
| `npx pixel-agents analyze` | Scans repository and prints detected architecture profile | `npx pixel-agents analyze` |
| `npx pixel-agents start` | Launches orchestrator daemon, SSE stream & dashboard | `npx pixel-agents start --port 4747` |
| `npx pixel-agents dashboard` | Opens or serves the web dashboard UI | `npx pixel-agents dashboard` |
| `npx pixel-agents demo` | Boots swarm and dispatches a full simulated multi-agent mission | `npx pixel-agents demo` |
| `npx pixel-agents task "<msg>"` | Dispatches a new task to the running swarm or runs locally | `npx pixel-agents task "Fix slow queries"` |
| `npx pixel-agents emit` | Emits an event to the live dashboard stream | `npx pixel-agents emit --agent db --message "Done"` |
| `npx pixel-agents status` | Prints ASCII summary of current swarm state | `npx pixel-agents status` |
| `npx pixel-agents help` | Displays full CLI manual and available flags | `npx pixel-agents help` |

---

## Configuration (`.pixel-agents/config.json`)

You can customize concurrency, agent permissions, and dashboard settings in `.pixel-agents/config.json`:

```json
{
  "version": "0.1.0",
  "project": "my-crm-app",
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
      "skills": ["react", "nextjs", "tailwind", "ui-optimization"],
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
      "skills": ["testing", "e2e-testing"],
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

## Emitting Events from External Agents & Scripts

The dashboard listens to structured `AgentEvent` payloads. You can stream events from **shell scripts**, **Git hooks**, or **Antigravity / Gemini subagents**:

### Via CLI:
```bash
npx pixel-agents emit \
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

### `AgentEvent` Type Definition:
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

## Keyboard Shortcuts & Dashboard Controls

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

## Testing

To run the automated test suite:

```bash
npm test
```

---

## Contributing & Community

We warmly welcome contributions from the open-source community!

### How to Get Involved
- **Contribute New Skills**: Add new domain-specific markdown guides to `.pixel-agents/skills/` (e.g. GraphQL, Supabase, Redis, Rust).
- **Add Agent Personas**: Create new specialized agent profiles for the startup office (e.g. Data Scientist, Technical Writer, Cloud Architect).
- **Enhance the Dashboard**: Improve procedural canvas animations, sound synthesizers, or add custom office customization packs.
- **Report Bugs & Suggest Features**: Open an issue on GitHub with reproduction steps and logs.

For detailed branch naming rules, conventional commit formats, and PR review standards, please read [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Documentation Links

- [Design Specifications](DESIGN.md)
- [Product Vision & Roadmap](PRODUCT.md)
- [Contribution Guidelines & PR Standards](CONTRIBUTING.md)
- [Apache 2.0 License](LICENSE)

---

## License

Licensed under the **Apache License, Version 2.0** (the "License"). You may obtain a copy of the License at:

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the [LICENSE](LICENSE) for the specific language governing permissions and limitations under the License.

---

## Created by

Created with care by:
- **Arnel** ([GitHub @hiroqt](https://github.com/hiroqt))
- In collaboration with the **Antigravity Swarm** community.
