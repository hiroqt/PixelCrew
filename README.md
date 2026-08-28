# PixelCrew (`@hiroqt/pixelcrew`)

<p align="center">
  <strong>Local Multi-Agent Orchestration Engine & Retro Pixel-Art Tech Startup Office</strong><br>
  <em>Transform any codebase into an observable, autonomous, and choreographed AI engineering workspace with a single command.</em>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-Apache_2.0-blue.svg" alt="Apache 2.0 License"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg" alt="Node.js 18+"></a>
  <a href="package.json"><img src="https://img.shields.io/badge/Runtime_Dependencies-Zero-orange.svg" alt="Zero Runtime Dependencies"></a>
  <a href="https://github.com/hiroqt/PixelCrew"><img src="https://img.shields.io/badge/Release-v0.1.0-blueviolet.svg" alt="Release v0.1.0"></a>
  <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg" alt="PRs Welcome"></a>
</p>

```text
┌────────────────────────────────────────────────────────────────────────┐
│  PIXELCREW HQ  ::  FLOOR 42                              ● SWARM LIVE  │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                    ┌──────────────────────┐                            │
│                    │   LEAD ORCHESTRATOR  │                            │
│                    │        [ ◉ _ ◉ ]     │                            │
│                    │      DAG Dispatch    │                            │
│                    └──────────┬───────────┘                            │
│                               │                                        │
│          ┌────────────────────┼────────────────────┐                   │
│          │                    │                    │                   │
│          ▼                    ▼                    ▼                   │
│    ┌───────────┐        ┌───────────┐        ┌───────────┐             │
│    │ FRONTEND  │        │  BACKEND  │        │ DATABASE  │             │
│    │  [ ◉ ▂ ◉ ]│        │  [ ◉ ▂ ◉ ]│        │  [ ◉ ⊙ ]  │             │
│    │  working  │        │  working  │        │ analyzing │             │
│    └───────────┘        └───────────┘        └───────────┘             │
│          │                    │                    │                   │
│          ▼                    ▼                    ▼                   │
│    ┌───────────┐        ┌───────────┐        ┌───────────┐             │
│    │ SECURITY  │        │PERFORMANCE│        │    QA     │             │
│    │  [ ░ ░ ]  │        │  [ ░ ░ ]  │        │  [ ░ ░ ]  │             │
│    │  waiting  │        │  waiting  │        │  waiting  │             │
│    └───────────┘        └───────────┘        └───────────┘             │
│                                                                        │
│  LIVE TELEMETRY STREAM                                                 │
│  ────────────────────────────────────────────────────────────────────  │
│  03:41:02  orchestrator  → decomposed objective into 4 parallel tasks  │
│  03:41:03  frontend      → auditing component client boundaries (Next) │
│  03:41:04  backend       → profiling REST endpoints & idempotency keys │
│  03:41:05  database      → inspecting missing B-Tree & composite index │
│                                                                        │
│  ACTIVE SKILL ENGINES                                                  │
│  ────────────────────────────────────────────────────────────────────  │
│  ✓ Codebase Intelligence   ✓ Next.js 15 App Router   ✓ PostgreSQL / RLS│
│  ◉ REST / OpenAPI 3.1      ◌ Web Vitals Profiling    ◌ Playwright E2E  │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ 10-Second Ignition

No global installations or complex configuration required. Run directly in your repository:

```bash
# 1. Initialize and adapt PixelCrew to your project stack
npx github:hiroqt/PixelCrew init

# 2. Launch the orchestrator daemon and real-time visual office
npx github:hiroqt/PixelCrew start

# 3. (Optional) Run an instant multi-agent simulated sprint demo
npx github:hiroqt/PixelCrew demo
```

The interactive dashboard opens automatically at:  
👉 **`http://localhost:4747`** *(auto-recovers to `4748`+ if port 4747 is occupied)*

---

## 💡 The Paradigm: Why PixelCrew?

Traditional AI agent tooling runs inside black-box terminal loops: you type a prompt, wait minutes in silence, and hope the agent doesn't hallucinate or clobber your codebase.

**PixelCrew turns the invisible execution loop into an observable, choreographed engineering office.**

```mermaid
flowchart TD
    UserPrompt["Developer Prompt / Objective"] --> Analyzer["Codebase Static Analyzer\n(Scans Frameworks, ORMs, Testing)"]
    Analyzer --> ContextCache[".pixel-agents/context.json\n(Project DNA & Architecture Profile)"]
    ContextCache --> Orchestrator["Orchestrator Engine (DAG Task Planner)"]
    
    subgraph Swarm ["Autonomous Agent Swarm"]
        Orchestrator --> FE["Frontend Engineer (React 19 / Next.js)"]
        Orchestrator --> BE["Backend Architect (REST / gRPC / Auth)"]
        Orchestrator --> DB["Database DBA (Postgres / Prisma / Drizzle)"]
        Orchestrator --> SEC["Security Sentinel (OWASP / RLS)"]
        Orchestrator --> PERF["Performance SRE (CWV / Profiling)"]
        Orchestrator --> QA["QA Automation (Vitest / Playwright)"]
    end

    Swarm --> Telemetry["Event Pipeline (SSE & Append-only JSONL)"]
    Telemetry --> Canvas["Floor 42 2D Canvas Dashboard\n(Procedural Sprites, CRT Shader, Web Audio SFX)"]
    Telemetry --> IDESync["IDE Telemetry Feedback (Antigravity, Cursor, Claude)"]
```

### Core Innovations
- **Zero Runtime Dependencies**: Pure Node.js ESM orchestrator with lightweight HTML5/CSS/Canvas. No bloated node_modules. Instant launch.
- **Codebase Context Adaptation**: Auto-discovers frameworks (Next.js, Vite, React, Vue), ORMs (Prisma, Drizzle), and test runners (Vitest, Playwright) to tailor agent permissions and skill injection.
- **Bi-Directional Telemetry**: Accepts event streams over CLI flags, HTTP REST endpoints (`/api/emit`), and append-only `.pixel-agents/events.jsonl` files.
- **Floor 42 Office Engine**: Procedural 2D canvas with CRT scanline simulation, daytime/night-mode cyberpunk lighting, and retro 8-bit Web Audio chimes.

---

## 👥 The Swarm Roster & State Machine

PixelCrew organizes work across 6 specialized personas, each bound to specific filesystem boundaries and skills:

| Persona | Role & Focus | Primary Skills | Default Boundaries |
| :--- | :--- | :--- | :--- |
| **Lead Orchestrator** | Task decomposition, DAG dependency resolution, status sync | `codebase-intelligence` | Read: `**/*` / Write: `.pixel-agents/*` |
| **Frontend Engineer** | App Router, component trees, state boundaries, Tailwind | `frontend-engineering` | Read/Write: `src/components/**`, `src/app/**`, `src/styles/**` |
| **Backend Architect** | API contracts, OpenAPI 3.1, rate limiting, OAuth 2.1 | `backend-engineering` | Read/Write: `src/api/**`, `src/server/**`, `src/routes/**` |
| **Database DBA** | Index tuning, EXPLAIN ANALYZE, RLS policies, migrations | `database-engineering` | Read/Write: `prisma/**`, `drizzle/**`, `db/**`, `migrations/**` |
| **Security Sentinel** | OWASP Top 10 mitigation, auth guards, secret scrubbing | `backend-engineering` | Read: `**/*` / Write: `src/middleware/**`, `src/auth/**` |
| **Performance SRE** | Core Web Vitals (LCP, INP, CLS), heap profiling, caching | `performance-engineering` | Read/Write: `src/**`, `next.config.*` |
| **QA Automation** | Unit assertions, end-to-end user journeys, regression runs | `codebase-intelligence` | Read: `**/*` / Write: `tests/**`, `e2e/**` |

### Agent Lifecycle States

```
[ IDLE ]       ●_●    Agent standing by for task allocation
   │
   ▼
[ SPAWNING ]   ░_░    Injecting tailored markdown skills & file permissions
   │
   ▼
[ ANALYZING ]  ◉_⊙    Reading repository AST, context profile, and references
   │
   ▼
[ WORKING ]    ◉▂◉    Executing edits, refactoring, or generating code
   │
   ▼
[ VERIFYING ]  🔍_🔍  Executing test suites, lint checks, and type validations
   │
   ├─► [ COMPLETED ]  ^_^   Task verified, tests green, event emitted
   ├─► [ BLOCKED ]    ?_?   Waiting on upstream dependency or developer input
   └─► [ ERROR ]      x_x   Diagnostic failure captured, recovery initiated
```

---

## 🧠 The 6 Engineering Skill Pillars

PixelCrew equips agents with production-grade engineering skill modules located under `.pixel-agents/skills/`:

### 1. `codebase-intelligence`
Static analysis and project adaptation. Automatically inspects repository dependencies, directory structures, ORMs, API routes, and testing runners to ground every subagent in current architectural patterns.

### 2. `frontend-engineering`
Modern frontend architecture across React 19, Next.js App Router, Vue 3, Svelte 5, and vanilla CSS. Enforces strict anti-slop design rules, fluid `clamp()` typography, semantic HTML, and WCAG AA accessibility compliance.

### 3. `backend-engineering`
Enterprise backend standards: Clean Architecture, Hexagonal / Ports & Adapters, OpenAPI 3.1, RFC 7807 error envelopes, sliding-window rate limiting, idempotency key middleware, and OAuth 2.1 / PASETO security.

### 4. `database-engineering`
Advanced query tuning and indexing: B-Tree, GIN, GiST, BRIN, composite indexing column order, EXPLAIN ANALYZE interpretation, UUIDv7 vs ULID primary keys, Row-Level Security (RLS) isolation, and connection pooling.

### 5. `performance-engineering`
Full-stack profiling: Core Web Vitals (LCP, INP, CLS), main-thread yielding, streaming SSR, multi-tier caching (L1 in-memory, L2 Redis, L3 CDN), database connection pool sizing, and automated k6 stress testing.

### 6. `pixel-agents`
Autonomous multi-agent orchestration instructions, event emission protocols, task decomposition strategies, and live telemetry streaming to the Floor 42 dashboard.

---

## 🛠️ Cross-Harness Installation & IDE Setup

PixelCrew integrates seamlessly with all leading AI coding assistants and agent environments:

### Google Antigravity IDE (Recommended)
Register PixelCrew globally so Antigravity agents automatically stream to your visual office:

```bash
# Register global plugin
mkdir -p ~/.gemini/config/plugins/pixel-agents/skills/pixel-agents
cp plugins/plugin.json ~/.gemini/config/plugins/pixel-agents/
cp .agents/skills/pixel-agents/SKILL.md ~/.gemini/config/plugins/pixel-agents/skills/pixel-agents/
```

Whenever you prompt inside Antigravity:
> *"Analyze the database queries in this repo using PixelCrew"*

The agent automatically loads the skill, executes the task, and streams live sprite animations and status logs to your browser.

---

### Claude Code
Install project-locally or link globally:

```bash
# Project-local install
mkdir -p .claude/skills/pixel-agents
cp .agents/skills/pixel-agents/SKILL.md .claude/skills/pixel-agents/
```

---

### Cursor IDE
Add to your project's agent rules or skills:

```bash
mkdir -p .cursor/skills/pixel-agents
cp .agents/skills/pixel-agents/SKILL.md .cursor/skills/pixel-agents/
```

*Ensure Agent Skills are enabled under Cursor Settings → Beta.*

---

### OpenAI Codex CLI
Install project-locally with native hook support:

```bash
mkdir -p .agents/skills
cp -r .agents/skills/* .agents/skills/
```

---

### GitHub Copilot / Grok Build / Gemini CLI / Trae / OpenCode
Copy the `.agents/skills/` directory into your tool's native skills folder:
- **GitHub Copilot**: `.github/skills/pixel-agents/`
- **Gemini CLI**: `~/.gemini/config/skills/pixel-agents/`
- **Grok Build**: `.grok/skills/pixel-agents/`
- **Trae**: `~/.trae/skills/` or `~/.trae-cn/skills/`

---

## 💻 CLI Terminal Reference

| Command | Action | Example |
| :--- | :--- | :--- |
| `npx github:hiroqt/PixelCrew init` | Scaffolds `.pixel-agents/` and adapts to repository | `npx github:hiroqt/PixelCrew init --yes` |
| `npx github:hiroqt/PixelCrew start` | Launches orchestrator, SSE stream, and web dashboard | `npx github:hiroqt/PixelCrew start --port 4747` |
| `npx github:hiroqt/PixelCrew analyze` | Prints detected frameworks, database, ORM, and test stack | `npx github:hiroqt/PixelCrew analyze` |
| `npx github:hiroqt/PixelCrew demo` | Launches an interactive 6-agent simulated sprint | `npx github:hiroqt/PixelCrew demo` |
| `npx github:hiroqt/PixelCrew task "<text>"` | Dispatches a direct objective to the running agent swarm | `npx github:hiroqt/PixelCrew task "Optimize SQL queries"` |
| `npx github:hiroqt/PixelCrew emit [flags]` | Emits a custom telemetry event into the stream | `npx github:hiroqt/PixelCrew emit --agent db --message "Done"` |
| `npx github:hiroqt/PixelCrew dashboard` | Opens or serves the standalone Floor 42 dashboard UI | `npx github:hiroqt/PixelCrew dashboard` |
| `npx github:hiroqt/PixelCrew status` | Prints ASCII summary of swarm states and active sprints | `npx github:hiroqt/PixelCrew status` |
| `npx github:hiroqt/PixelCrew help` | Displays full CLI manual and flag details | `npx github:hiroqt/PixelCrew help` |

### CLI Options & Flags:
- `--port <number>`: Dashboard port (default: `4747`)
- `--no-open`: Prevents auto-launching browser on startup
- `--yes`, `-y`: Bypasses interactive prompts during initialization
- `--agent <name>`: Target agent for event emission (`frontend`, `backend`, `database`, `security`, `performance`, `qa`)
- `--type <type>`: Event category (`spawn`, `thinking`, `tool`, `skill`, `complete`, `error`)
- `--message <text>`: Description payload for the event log
- `--skill <name>`: Skill tag associated with the action

---

## 📂 Workspace Manifest & Architecture

Initializing PixelCrew creates a self-contained `.pixel-agents/` control directory in your repository:

```
your-project/
├── .pixel-agents/
│   ├── config.json              # Swarm concurrency, agent permissions, and dashboard settings
│   ├── context.json             # Cached static analysis of frameworks, ORMs, and paths
│   ├── state.json               # Real-time state of every agent persona
│   ├── events.jsonl             # Append-only persistent telemetry event log
│   ├── agents/                  # Specialized agent persona definitions
│   └── skills/                  # Grounded engineering skill markdown manuals
├── .pixel-dashboard/            # Zero-dependency HTML5 canvas visual office bundle
├── DESIGN.md                    # Visual tokens, canvas coordinate engine & audio specs
├── PRODUCT.md                   # Product vision, technical roadmap, and architectural goals
└── README.md
```

---

## 🎮 Dashboard Controls & Keybindings

| Key / Control | Function | Description |
| :--- | :--- | :--- |
| `[SPACE]` | **Launch Demo** | Boots the swarm and runs a simulated multi-agent sprint |
| `[1] - [6]` | **Agent Inspector** | Opens the dedicated status drawer and permissions for agents 1 through 6 |
| `[ESC]` | **Close Modals** | Closes any active agent inspector or overlay drawer |
| `CRT Button` | **Scanline Shader** | Toggles retro arcade phosphor scanlines and vignette effect |
| `NIGHT Button` | **Cyberpunk Shift** | Switches between warm day office and neon cyberpunk night lighting |
| `SFX Button` | **Web Audio Synth** | Toggles procedural 8-bit chip-tune feedback sounds |

---

## 🧪 Development & Testing

Run unit tests across the orchestrator engine, scaffolders, and server endpoints:

```bash
# Clone the repository
git clone https://github.com/hiroqt/PixelCrew.git
cd PixelCrew

# Run the zero-dependency test suite
npm test
```

---

## 📚 Documentation & Specifications

- [📐 DESIGN.md](DESIGN.md) — 2D Canvas coordinate matrix, sprite frame animations, color tokens, and Web Audio oscillator formulas.
- [🎯 PRODUCT.md](PRODUCT.md) — Product vision, target personas, problem analysis, and development roadmap (v0.1 to v0.5).
- [🤝 CONTRIBUTING.md](CONTRIBUTING.md) — How to author new skills, add custom agent sprites, and submit pull requests.
- [⚖️ LICENSE](LICENSE) — Apache 2.0 open-source license.

---

## 🌟 Community & Contributing

Contributions of all types are warmly welcomed!

- **Create New Skills**: Add new technology guides to `.pixel-agents/skills/` (e.g. GraphQL, Supabase, Redis, Rust, Astro).
- **Design Office Packs**: Add custom pixel-art furniture, workstations, and seasonal office themes.
- **Improve Orchestration**: Enhance DAG task scheduling, automated error recovery, and concurrency management.
- **Report Bugs**: Submit issues and feature proposals at [github.com/hiroqt/PixelCrew/issues](https://github.com/hiroqt/PixelCrew/issues).

---

## 📄 License

PixelCrew is open-source software licensed under the **[Apache License, Version 2.0](LICENSE)**.

---

<p align="center">
  Crafted with precision by <strong>Arnel</strong> (<a href="https://github.com/hiroqt">@hiroqt</a>).
</p>
