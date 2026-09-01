<p align="center">
  <img src="assets/banner.png" alt="Pixel Agents — Autonomous Agents. Real Impact." width="100%" />
</p>

<h1 align="center">PixelCrew</h1>

<p align="center">
  <strong>Autonomous Multi-Agent Engineering Swarm & Software Synthesis Framework</strong>
</p>

<p align="center">
  <a href="https://github.com/hiroqt/PixelCrew"><img src="https://img.shields.io/badge/version-0.2.4-7c3aed?style=flat-square" alt="Version" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-22c55e?style=flat-square" alt="License" /></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18.0.0-0ea5e9?style=flat-square" alt="Node.js" /></a>
  <a href="#zero-dependencies"><img src="https://img.shields.io/badge/dependencies-0-f59e0b?style=flat-square" alt="Zero Dependencies" /></a>
</p>

<p align="center">
  <a href="#quickstart">Quickstart</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#agent-roster">Agent Roster</a> •
  <a href="#cli-reference">CLI Reference</a> •
  <a href="#ide-integration">IDE Integration</a> •
  <a href="#visual-dashboard">Dashboard</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

---

## Why PixelCrew?

Modern AI coding tools either hide all agent activity behind a vague "Thinking..." spinner or flood your terminal with thousands of raw JSON log lines. Neither approach lets you understand *what* your agents are doing, *when* they're blocked, or *why* something broke.

**PixelCrew** solves this by turning any repository into an interactive, observable AI workspace—modeled as a retro pixel-art tech startup office on Floor 42 of *Pixel Corps HQ*.

### Key Differentiators

| | PixelCrew | Typical AI Tools |
|:---|:---|:---|
| **Observability** | Live 2D office canvas with per-agent state machines, activity streams, and audio feedback | Opaque spinners or raw log dumps |
| **Installation** | `npx pixelcrew init` — zero npm dependencies, no Docker | Heavy `node_modules`, Docker compose files |
| **Codebase Awareness** | Auto-scans your stack (Next.js, Prisma, Django, Go, Vitest) and configures agent permissions | Generic, context-blind prompts |
| **Design Quality** | Anti-AI-slop scoring rubric with automated refinement (≥ 8.5/10 threshold) | Template-based output with no quality gates |
| **IDE Coverage** | Syncs skills to 6+ AI coding environments simultaneously | Single-provider lock-in |

---

<a id="quickstart"></a>

## Quickstart

> **Prerequisites**: Node.js ≥ 18.0.0 and npm ≥ 9.0.0.

### 1. Initialize a Project Workspace

```bash
# Preview what will be created (no files written)
npx pixelcrew init --dry-run

# Initialize with default settings
npx pixelcrew init --yes
```

This scans your codebase, creates the `.pixel-crew/` configuration directory, generates `context.json` with detected frameworks and dependencies, and sets up default agent profiles.

### 2. Install Skills for AI IDE Integration

```bash
# Distribute skills across all detected AI IDE directories
npx pixelcrew install --global

# Add a specific skill to a single provider
npx pixelcrew add design/ui-design --provider cursor
```

### 3. Launch the Visual Dashboard

```bash
# Start the orchestration server + open the Pixel Corps HQ dashboard
npx pixelcrew start

# Or specify a custom port
npx pixelcrew start --port 8080 --no-open
```

### 4. Synthesize a Website (OneShot Mode)

```bash
# Generate a complete Next.js application from a natural language prompt
npx pixelcrew assemble "Build a modern portfolio for an AI engineer with dark theme"

# Or plan without generating code
npx pixelcrew blueprint "SaaS dashboard with analytics and user management"
```

---

<a id="architecture"></a>

## Architecture

PixelCrew follows a strictly modular, zero-dependency architecture built entirely on Node.js built-in modules (`node:http`, `node:events`, `node:fs/promises`, `node:path`, `node:url`, `node:test`).

```text
┌──────────────────────────────────────────────────────────────────┐
│                         DEVELOPER                                │
│              npx pixelcrew init / start / assemble               │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                     ORCHESTRATION DAEMON                          │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐ │
│  │ Codebase        │  │ DAG Task        │  │ Concurrency      │ │
│  │ Analyzer        │  │ Planner         │  │ Limiter          │ │
│  │                 │  │                 │  │                  │ │
│  │ Scans stacks,   │  │ Resolves deps,  │  │ Manages parallel │ │
│  │ ORMs, tests,    │  │ detects cycles, │  │ agent execution  │ │
│  │ frameworks      │  │ orders tasks    │  │ and scheduling   │ │
│  └────────┬────────┘  └────────┬────────┘  └────────┬─────────┘ │
│           └────────────────────┼────────────────────┘           │
└──────────────────────────────┬───────────────────────────────────┘
                               │
             ┌─────────────────┴─────────────────┐
             │                                   │
             ▼                                   ▼
┌──────────────────────────┐       ┌──────────────────────────┐
│     EVENT PIPELINE       │       │    AGENT SWARM ROSTER    │
│                          │       │                          │
│  • events.jsonl log      │       │  7 specialized agents    │
│  • SSE broadcast server  │ ◄──── │  with filesystem perms,  │
│  • REST API (/api/emit)  │       │  skill matrices, and     │
│  • Protocol schemas      │       │  state machines          │
└────────────┬─────────────┘       └──────────────────────────┘
             │
             ▼
┌──────────────────────────┐
│  PIXEL STARTUP OFFICE    │
│                          │
│  • 960×420 2D Canvas     │
│  • Workstation sprites   │
│  • #engineering-feed     │
│  • 8-bit Audio Synth     │
│  • CRT scanline overlay  │
└──────────────────────────┘
```

### Project Structure

```text
pixelcrew/
├── bin/
│   └── pixel-agents.js          # CLI entry point (pixelcrew / pixel-crew / pixel-agents)
├── src/
│   ├── index.js                 # Package exports
│   ├── commands/                # 56 CLI command handlers
│   │   ├── registry.js          # Central command registry
│   │   ├── parser.js            # Argument parser
│   │   ├── assemble.js          # Full synthesis pipeline
│   │   ├── blueprint.js         # Structural planning (no code gen)
│   │   ├── boss-fight.js        # Targeted repair workflows
│   │   ├── oneshot.js           # One-shot website synthesis
│   │   ├── doctor.js            # System diagnostics
│   │   └── ...                  # adapt, audit, deploy, review, etc.
│   ├── core/                    # Orchestration engine
│   │   ├── orchestrator.js      # Lead orchestrator controller
│   │   ├── task-graph.js        # DAG dependency resolver
│   │   ├── scheduler.js         # Concurrent task scheduler
│   │   ├── agent-runtime.js     # Agent lifecycle manager
│   │   └── event-bus.js         # Internal pub/sub event system
│   ├── protocol/                # Data schemas & contracts
│   │   ├── agent.js             # Agent definition schema
│   │   ├── task.js              # Task definition schema
│   │   ├── event.js             # Event envelope schema
│   │   └── skill.js             # Skill manifest schema
│   ├── adapters/                # IDE provider adapters
│   │   ├── registry.js          # Provider discovery & registration
│   │   ├── antigravity.js       # Google Antigravity adapter
│   │   ├── claude-code.js       # Anthropic Claude Code adapter
│   │   ├── cursor.js            # Cursor AI adapter
│   │   ├── kiro.js              # Kiro AI adapter
│   │   ├── codex.js             # OpenAI Codex adapter
│   │   └── generic.js           # Fallback generic adapter
│   ├── scaffold/                # Project scaffolding & analysis
│   │   ├── analyzer.js          # Codebase architecture profiler
│   │   ├── init.js              # Workspace initializer
│   │   ├── installer.js         # Skill installer & distributor
│   │   ├── skills-bundle.js     # Bundled skill definitions
│   │   ├── templates.js         # Code generation templates
│   │   └── workstations.js      # Agent workstation configs
│   ├── server/
│   │   └── server.js            # HTTP/SSE server (zero deps)
│   ├── dashboard/               # Pixel Corps HQ frontend
│   └── utils/                   # Shared utilities
├── skill/
│   ├── SKILL.md                 # Master skill definition
│   └── references/              # Extended reference docs
├── tests/                       # Automated test suite (node:test)
├── scripts/                     # Build & sync scripts
├── plugins/                     # Plugin extensions
├── DESIGN.md                    # Visual design system spec
├── PRODUCT.md                   # Product vision & roadmap
├── TESTING.md                   # Testing & verification guide
├── CONTRIBUTING.md              # Contributor guidelines
├── LICENSE                      # Apache License 2.0
└── package.json
```

---

<a id="agent-roster"></a>

## Agent Roster

PixelCrew orchestrates 7 specialized agent personas, each with dedicated filesystem permissions, skill matrices, and visual workstations on the office floor.

| Agent | Color | Role | Responsibilities |
|:---|:---|:---|:---|
| 🟣 **Orchestrator** | Purple | Lead Architect | Decomposes prompts into DAG tasks, resolves dependencies, coordinates sprints, enforces architectural compliance |
| 🔵 **Frontend Engineer** | Cyan | UI/UX Builder | React/Next.js components, design systems, responsive layouts, CSS architecture, client-side interactivity |
| 🔴 **Backend Engineer** | Magenta | API & Logic | API route handlers, server actions, middleware, authentication flows, business logic |
| 🟡 **Database Architect** | Gold | Data Layer | Schema design, ORM models (Prisma/Drizzle), migrations, seed data, query optimization |
| 🔴 **Security Sentinel** | Red | Security Guard | Input validation, auth hardening, CSRF/XSS protection, dependency audits, security headers |
| 🟢 **Performance SRE** | Green | Optimization | Core Web Vitals, bundle analysis, caching strategies, lazy loading, runtime profiling |
| 🟣 **QA Automation** | Purple | Quality Gate | Test suite generation (unit/integration/e2e), visual regression, accessibility audits, coverage enforcement |

### Agent State Machine

Each agent progresses through a deterministic state machine, visualized in real-time on the office canvas:

```text
IDLE (●_●)          Gentle breathing animation, waiting for task assignment
    │
    ▼
ANALYZING (◉_⊙)    Scanning codebase context, reading files, planning approach
    │
    ▼
WORKING (◉▂◉)      Actively generating code, typing animation on monitors
    │
    ▼
VERIFYING (🔍_🔍)   Running tests, checking lint, validating output
    │
    ▼
COMPLETED (^_^)     Victory animation, gold star sparkle, task marked done
```

---

<a id="cli-reference"></a>

## CLI Reference

```bash
npx pixelcrew <command> [options]
```

### Core Synthesis Commands

| Command | Description | Example |
|:---|:---|:---|
| `init` | Initialize `.pixel-crew/` workspace configuration | `npx pixelcrew init --yes` |
| `assemble` | Full 16-step synthesis pipeline → Next.js app | `npx pixelcrew assemble "portfolio site"` |
| `blueprint` | Plan section topology + dependency DAG (no code gen) | `npx pixelcrew blueprint "SaaS dashboard"` |
| `oneshot` | One-shot website synthesis with creative direction | `npx pixelcrew oneshot "AI startup landing page"` |
| `boss-fight` | Targeted repair workflow for specific errors | `npx pixelcrew boss-fight "hydration mismatch"` |
| `retrofit` | Scan existing layouts and export design tokens | `npx pixelcrew retrofit` |

### Operational Commands

| Command | Description | Example |
|:---|:---|:---|
| `start` / `dev` / `dashboard` | Launch orchestration server + visual dashboard | `npx pixelcrew start --port 8080` |
| `install` | Distribute skills to IDE agent directories | `npx pixelcrew install --global` |
| `add` | Install a specific skill to target provider(s) | `npx pixelcrew add design/ui-design --provider cursor` |
| `sync` | Synchronize skill repos across all IDE locations | `npx pixelcrew sync --dry-run` |
| `doctor` | Diagnose system compatibility and API keys | `npx pixelcrew doctor` |
| `status` | Show current agent states and task progress | `npx pixelcrew status` |
| `stop` | Gracefully shut down the orchestration server | `npx pixelcrew stop` |

### Creative & Design Commands

| Command | Description |
|:---|:---|
| `craft` | Generate component-level code with design constraints |
| `polish` | Refine and improve existing generated output |
| `typeset` | Apply fluid clamp typography scales |
| `colorize` | Generate and apply color palette strategies |
| `layout` | Create asymmetric grid layout specifications |
| `shape` | Define section topology and visual rhythm |
| `critique` | Run the 6-dimension Anti-AI visual scoring rubric |
| `de-slop` | Strip generic AI patterns from generated output |

### Analysis & Review Commands

| Command | Description |
|:---|:---|
| `review` | Structured code review with actionable feedback |
| `audit` | Security and quality audit across the codebase |
| `extract` | Extract patterns, tokens, or structures from code |
| `clarify` | Explain complex code sections in plain language |
| `document` | Auto-generate documentation from source code |
| `plan` | Create detailed implementation plans |
| `optimize` | Identify and apply performance optimizations |
| `harden` | Apply security hardening recommendations |

### Global Flags

| Flag | Type | Description | Default |
|:---|:---|:---|:---|
| `--dry-run` | Boolean | Preview changes without writing to disk | `false` |
| `--provider <name>` | String | Target specific IDE (`cursor`, `claude-code`, `antigravity`, `kiro`, `all`) | `all` |
| `--target <framework>` | String | Output framework (`nextjs`, `vanilla`) | `nextjs` |
| `--out <dir>` | String | Destination directory for generated code | `.` |
| `--port <number>` | Number | Dashboard server port | `4747` |
| `--no-open` | Boolean | Don't auto-open browser for dashboard | `false` |
| `--yes` / `-y` | Boolean | Skip confirmation prompts | `false` |

---

<a id="ide-integration"></a>

## IDE Integration

PixelCrew distributes modular agent skills (as `SKILL.md` files with YAML frontmatter) across all major AI coding environments simultaneously.

| IDE / Agent Platform | Target Directory | Adapter |
|:---|:---|:---|
| Google Antigravity & Universal Agents | `.agents/skills/` | `antigravity.js` |
| Anthropic Claude Code | `.claude/skills/` | `claude-code.js` |
| Cursor AI | `.cursor/skills/` | `cursor.js` |
| Google Gemini CLI | `.gemini/skills/` | `generic.js` |
| Kiro AI | `.kiro/skills/` | `kiro.js` |
| OpenAI Codex CLI | `.codex/skills/` | `codex.js` |

```bash
# Sync to all detected providers at once
npx pixelcrew sync

# Preview what will be synced
npx pixelcrew sync --dry-run

# Target a single provider
npx pixelcrew add design/ui-design --provider claude-code
```

---

<a id="zero-dependencies"></a>

## Zero Runtime Dependencies

PixelCrew is built entirely on Node.js built-in modules. The full CLI, orchestration engine, HTTP/SSE server, and visual dashboard ship with **zero `npm` runtime dependencies**.

| Capability | Node.js Built-in |
|:---|:---|
| HTTP Server & SSE | `node:http` |
| File System | `node:fs/promises`, `node:fs` |
| Event System | `node:events` |
| Path Resolution | `node:path`, `node:url` |
| Test Runner | `node:test`, `node:assert` |
| Child Processes | `node:child_process` |
| Crypto | `node:crypto` |
| OS Detection | `node:os` |

---

<a id="visual-dashboard"></a>

## Visual Dashboard — Pixel Corps HQ

The dashboard renders an interactive 2D pixel-art startup office at 60 FPS using an HTML5 Canvas with double-buffering.

### Features

- **960×420 Office Floor**: 8 workstation pods arranged in an open-plan layout (Executive Suite, Frontend Pod, Backend Pod, DB Vault, Security SOC, Perf Lab, QA Bay, Break Lounge)
- **Live Agent Sprites**: Procedural pixel characters with state-driven animations (idle breathing, typing, scanning, victory poses)
- **`#engineering-feed`**: Real-time Slack-style activity stream showing agent events, file changes, and task completions
- **8-Bit Audio Synthesis**: Web Audio API chiptune sound effects — no external audio files required
- **CRT Scanline Overlay**: Optional retro cathode-ray tube visual effect
- **Keyboard Navigation**: `[O]` OneShot Studio, `[R]` Audit Reports, `[1-6]` Agent profiles, `[SPACE]` Sprint demo, `[ESC]` Close modals

### Design Tokens

| Token | Hex | Usage |
|:---|:---|:---|
| `--bg-dark` | `#0a0c14` | Main canvas background |
| `--color-cyan` | `#00f0ff` | Frontend Agent / Primary accent |
| `--color-magenta` | `#ff007f` | Backend Agent / Running state |
| `--color-gold` | `#ffd700` | Orchestrator & DB Agent |
| `--color-green` | `#39ff14` | Performance Agent / Completed |
| `--color-red` | `#ff3344` | Security Agent / Error state |
| `--color-purple` | `#b026ff` | QA Agent / Secondary accent |

---

## Anti-AI Design Guardian

PixelCrew enforces strict design quality gates to prevent generic AI-generated output. Every synthesized page is scored against a 6-dimension rubric:

$$\text{Final Score} = \frac{\text{Originality} + \text{Typography} + \text{Layout} + \text{Visual Hierarchy} + \text{Brand Consistency} + (10 - \text{Generic AI Penalty})}{6}$$

**Approval threshold**: ≥ 8.5 / 10.0

### What Gets Blocked

- ❌ Purple/blue blurred gradient blobs and floating glowing spheres
- ❌ Symmetrical 3-card repeating grids with uniform heights
- ❌ Generic copy ("Unlock the power of AI", "Get Started Today")
- ❌ Cards-in-cards nesting and meaningless pill badges
- ❌ Default browser fonts and unstyled form elements

### Creative Direction Archetypes

| Archetype | Display Font | Body Font | Palette | Layout |
|:---|:---|:---|:---|:---|
| **Editorial Asymmetric** | *Instrument Serif* | *Plus Jakarta Sans* | Charcoal / Cream / Amber | 7:5 split, overlapping bounds |
| **Technical Lab** | *Space Grotesk* | *JetBrains Mono* | Obsidian / Emerald | Monospace stats, terminal panels |
| **Kinetic Studio** | *Syne* | *DM Sans* | Void / Electric Cyan | Bold headlines, Bento matrices |

---

## Codebase Auto-Detection

The analyzer automatically profiles your repository to configure agent permissions and skills:

| Detected Stack | What It Configures |
|:---|:---|
| Next.js (App Router / Pages) | Route handlers, server components, ISR strategies |
| React 18/19 | Component architecture, hooks patterns, client boundaries |
| Tailwind CSS | Utility class generation, theme configuration |
| Prisma ORM | Schema models, migrations, seed scripts |
| Drizzle ORM | Schema definitions, query builders |
| TypeScript | Type definitions, strict mode enforcement |
| Vitest / Jest | Test runner selection, coverage thresholds |
| Playwright | E2E test generation targets |
| Django / FastAPI | Python backend patterns |
| Go | Go module structures |

---

## Testing

PixelCrew includes a comprehensive test suite using Node.js native `node:test` and `node:assert` — zero test framework dependencies.

```bash
# Run the full test suite
npm test
```

### What's Tested

- **`--dry-run` safety**: Verifies zero files written during dry-run operations
- **Multi-provider skill distribution**: YAML frontmatter and `SKILL.md` generation across all IDE directories
- **Environment auto-detection**: Discovery of existing `.claude/`, `.cursor/`, `.agents/` directories
- **Codebase architecture profiling**: Framework, ORM, and toolchain detection
- **DAG task graph**: Dependency resolution, cycle detection, parallel execution, event broadcasting

For detailed testing workflows (manual testing with `npm link`, tarball testing with `npm pack`, CI/CD with GitHub Actions), see [TESTING.md](TESTING.md).

---

<a id="roadmap"></a>

## Roadmap

| Version | Focus | Status |
|:---|:---|:---|
| **v0.1** | Core CLI, codebase analyzer, Pixel Office canvas, SSE events, 8-bit audio | ✅ Complete |
| **v0.2** | OneShot synthesis, Anti-AI design guardian, cross-IDE token optimization, audit reports | 🚧 Current |
| **v0.3** | Git worktree isolation, 3-way merge conflict resolution | 📋 Planned |
| **v0.4** | Model API runtime adapters (Gemini, Claude, OpenAI, Ollama) | 📋 Planned |
| **v0.5** | Multi-floor office expansions, distributed swarms via WebSockets/WebRTC | 📋 Planned |

---

## Documentation

| Document | Description |
|:---|:---|
| [PRODUCT.md](PRODUCT.md) | Product vision, user personas, and detailed release roadmap |
| [DESIGN.md](DESIGN.md) | Visual design system, color tokens, canvas engine, typography, and audio specs |
| [TESTING.md](TESTING.md) | Testing architecture, fixture strategy, CI/CD integration |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Development setup, branching conventions, commit standards, PR checklist |
| [LICENSE](LICENSE) | Apache License, Version 2.0 |

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, branching conventions, and code guidelines.

```bash
# Clone and verify
git clone https://github.com/hiroqt/PixelCrew.git
cd PixelCrew
npm test

# Test the CLI locally
node bin/pixel-agents.js --help
node bin/pixel-agents.js demo
```

---

## License

Licensed under the [Apache License, Version 2.0](LICENSE).

---

<p align="center">
  <sub>Built with ❤️ and zero dependencies by <a href="https://github.com/hiroqt">@hiroqt</a></sub>
</p>
