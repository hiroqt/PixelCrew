# Product Vision & Roadmap: Pixel Agents

> **Making Autonomous Multi-Agent Engineering Observable, Intuitive, and Delightful.**

---

## 1. Product Vision

As software development shifts toward multi-agent AI swarms—where specialized agents simultaneously refactor frontends, write database migrations, patch APIs, and run regression test suites—developers face a major problem: **Observability**.

Traditional AI coding tools provide either:
1. **Opaque Spinners**: Hiding all subagent activity behind a single "Thinking..." indicator.
2. **Terminal Log Flood**: Dumping unformatted JSON and thousands of raw console lines that make it impossible to track dependencies, bottlenecks, or errors.

**Pixel Agents** solves this by turning any repository into an interactive, visual AI workspace modeled as a retro corporate tech startup office (Floor 42 of *Pixel Corps HQ*).

---

## 2. Target User Personas

| Persona | Needs & Goals | How Pixel Agents Solves It |
| :--- | :--- | :--- |
| **Software Engineers & Founders** | Ship features fast across full-stack repositories without losing track of agent changes. | Visual state machine and live `#engineering-feed` stream shows exactly who is doing what in real-time. |
| **Tech Leads & Architects** | Enforce permissions, verify architectural compliance, and avoid breaking changes. | Agent filesystem permissions (`read`/`write` globs), skill matrices, and DAG dependency enforcement. |
| **AI Agents & Autonomous Swarms** | Require structured coordination, codebase grounding, and telemetry emission. | Static codebase analyzer (`.pixel-agents/context.json`) and lightweight CLI/REST event emission (`pixel-agents emit`). |

---

## 3. Product Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                       DEVELOPER                              │
│             npx pixel-agents init / start / task             │
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

## 4. Key Differentiators

1. **Zero-Installation Friction**: Runs with `npx pixel-agents init` anywhere. No 500MB `node_modules` overhead, no external Docker requirement.
2. **Context-Aware Adaptation**: Automatically scans existing codebases (Next.js, Prisma, Django, Go, Vitest) and configures permissions and skills to match the repo.
3. **Decoupled Skills Architecture**: Agents are not hardcoded personas; their capabilities are dynamically composed from modular markdown skill guides.
4. **Gamified Engineering Ergonomics**: Procedural pixel characters, interactive office floor plan, audio chimes, and CRT aesthetics make pairing with AI agents fun and engaging.

---

## 5. Release Roadmap

### v0.1 — Foundations (Current Release)
- Pure Node.js ESM CLI (`pixel-agents init`, `start`, `demo`, `task`, `emit`, `analyze`, `status`).
- Static codebase analyzer and context generator (`.pixel-agents/context.json`).
- Interactive Pixel Startup Office 2D canvas with workstation hover tooltips and inspector modal.
- Real-time Server-Sent Events (SSE) stream and Web Audio 8-bit chiptune synthesizer.
- Global Antigravity plugin and skill integration.

### v0.2 — Git Worktree Isolation
- Isolated Git worktrees for each subagent to enable non-conflicting parallel code generation.
- Automated 3-way merge conflict resolution guided by the Orchestrator.

### v0.3 — Model API Runtime Adapters
- Direct API connector for Gemini, Claude, OpenAI, and local Ollama models.
- Interactive terminal chat mode for conversational steering during active sprints.

### v0.4 — Multi-Floor Office Expansions
- Modular office expansion packs:
  - Floor 41: Data Science & ML Research Floor (PyTorch, Jupyter, Pandas).
  - Floor 43: Mobile & Native Engineering Floor (Flutter, iOS, Android, Rust).
- Custom pixel sprite avatar customizer for developers.

### v0.5 — Distributed Swarm Orchestration
- Multi-machine coordination via WebSockets / WebRTC.
- Collaborative multi-user view of shared development sprints.
