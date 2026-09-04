# Changelog

All notable changes to the **PixelCrew** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.5] - 2026-09-04

### 🌟 Release Highlights

PixelCrew **v0.2.5** is a major milestone release introducing **Universal Multi-IDE Scaffolding**, an enterprise-grade **Universal Backend Engineering Engine**, **Autonomous DAG-based Task Scheduling**, **Real-Time Token Telemetry** with a retro Lo-Fi procedural synthesizer, and the complete **2026 64-Pattern Anti-AI Slop Encyclopedia**.

- **12+ AI Provider Environments**: Seamless cross-IDE skill synchronizer and scaffold engine for Google Antigravity, Claude Code, Cursor, Kiro, Grok, Hermes, Codex, OpenCode, Pi, Gemini, and PixelCrew Workspace.
- **Enterprise Backend Architecture**: Hexagonal / Clean Architecture, RFC 7807 problem details, OpenAPI 3.1, gRPC, tRPC, GraphQL DataLoader, and Redis token bucket rate limiters.
- **Real-Time Visual Dashboard**: Live token tracking (~72% token savings), per-agent cost telemetry, realtime sidechat streaming, and an in-browser procedural 8-bit lofi synthesizer.
- **Zero-Prompt Anti-AI Slop Guardian**: 64 banned patterns enforced across all generated code (eliminating purple gradient blobs, generic cards, and AI cliché prose).

---

### 🚀 Added

#### Universal Multi-IDE Scaffolding & Cross-IDE Architecture
- **Multi-Provider Registry & Scaffold Engine**: Added dedicated adapters and manifest generators for Kiro (`.kiro/`), Cursor (`.cursor/`, `.cursorrules`), Google Antigravity (`.agents/`, `AGENTS.md`, `GEMINI.md`), Anthropic Claude Code (`.claude/`, `CLAUDE.md`, `.claude-plugin/`), Grok (`.grok/`), Hermes (`.hermes/`), Codex (`.codex/`), OpenCode (`.opencode/`), and Pi (`.pi/`) ([`6250119`](https://github.com/hiroqt/PixelCrew/commit/6250119), [`884bfd1`](https://github.com/hiroqt/PixelCrew/commit/884bfd1)).
- **Cross-IDE Command & Workflow Generator**: Automatically emits 27 Floor 42 command definitions, native prompt workflows, and skill definitions across all detected provider folders ([`98a59d9`](https://github.com/hiroqt/PixelCrew/commit/98a59d9), [`7c9128f`](https://github.com/hiroqt/PixelCrew/commit/7c9128f)).
- **Interactive Provider Selector & Environment Auto-Detection**: Enhanced `npx pixelcrew init` to dynamically detect active IDEs, automatically generate `.gitignore` exclusions for runtime telemetry/cache directories, and allow manual provider toggling ([`6bc8da7`](https://github.com/hiroqt/PixelCrew/commit/6bc8da7), [`1dcf7ed`](https://github.com/hiroqt/PixelCrew/commit/1dcf7ed)).
- **Multi-Provider Skill Installer**: Implemented `npx pixelcrew install <skill>` with `--dry-run` previews and multi-provider directory synchronization ([`1b8e078`](https://github.com/hiroqt/PixelCrew/commit/1b8e078)).

#### Universal Backend Engineering Engine
- **Enterprise Architecture Standards**: Introduced the Universal Backend Engineering Engine covering Clean Architecture, Ports & Adapters (Hexagonal), Modular Monoliths, and Event-Driven Microservices ([`96ad96d`](https://github.com/hiroqt/PixelCrew/commit/96ad96d), PR [#4](https://github.com/hiroqt/PixelCrew/pull/4)).
- **RFC 7807 & OpenAPI 3.1 Protocols**: Standardized API response contracts, structured problem-details error envelopes, and comprehensive OpenAPI 3.1 specs across synthesized backends.
- **Resilience & Rate Limiting**: Built-in implementations for Token Bucket & Sliding Window rate limiters (Redis Lua), Idempotency-Key validation, Circuit Breakers, and Exponential Backoff with Jitter.
- **Relational & NoSQL Data Architecture**: Architectural specifications for UUIDv7 primary keys, composite indexing column orders, RLS policies, connection pooling (PgBouncer/Supavisor), and full-text search strategies.

#### Autonomous Task Scheduling & DAG Task Planning
- **Modular Task Graph & Scheduler**: Added DAG-based task dependency graph (`TaskGraph`), cycle detection, concurrency batching, and an autonomous `Scheduler` runtime ([`d568a68`](https://github.com/hiroqt/PixelCrew/commit/d568a68)).
- **Contract Validation & Repair Planning**: Implemented automated AST normalization and semantic requirement validation to ensure multi-agent synthesis builds zero-defect code ([`b159f1a`](https://github.com/hiroqt/PixelCrew/commit/b159f1a)).

#### Real-Time Token Telemetry & Office Visual Dashboard
- **Live Token Telemetry Engine**: Tracks token accumulation in real time with per-agent breakdowns (Creative Director, Frontend, Backend, SRE), calculating actual token usage, baseline comparison, and ~72% efficiency ratio ([`027e525`](https://github.com/hiroqt/PixelCrew/commit/027e525)).
- **Realtime Sidechat & Lo-Fi Synthesizer**: Added live agent communication sidechat streaming and a procedural Web Audio API 8-bit lofi synthesizer to the interactive office dashboard on port `4747` ([`25e2af9`](https://github.com/hiroqt/PixelCrew/commit/25e2af9), PR [#3](https://github.com/hiroqt/PixelCrew/pull/3)).
- **REST Telemetry Endpoints**: Exposed `/api/token-stats` and `/api/token-telemetry` on the local orchestrator server.

#### 2026 Anti-AI Slop & Impeccable Design Engine
- **Impeccable 64-Pattern Anti-AI Slop Catalog**: Integrated the comprehensive 64-pattern anti-AI slop encyclopedia into all skill definitions and code generators ([`3350f8a`](https://github.com/hiroqt/PixelCrew/commit/3350f8a), [`c99fdec`](https://github.com/hiroqt/PixelCrew/commit/c99fdec)).
- **Autonomous Zero-Prompt Anti-AI Directive**: Embedded non-negotiable aesthetic rules into global and local skills to ban purple/cyan neon blobs, floating fake sparkles, repetitive 3-card grids, and template copy ([`15ab4bb`](https://github.com/hiroqt/PixelCrew/commit/15ab4bb), [`62d138b`](https://github.com/hiroqt/PixelCrew/commit/62d138b)).
- **Mathematical Fluid Typography**: Enforced CSS `clamp()` fluid type systems, curated HSL color tokens, and intentional Bento grid asymmetry.

#### Unified Command Suite & Reporting Utilities
- **New `/recap` and `/status` Commands**: Added git activity recap, commit diff summaries, and real-time swarm orchestration status commands with full E2E test coverage ([`ace5334`](https://github.com/hiroqt/PixelCrew/commit/ace5334), [`3746a59`](https://github.com/hiroqt/PixelCrew/commit/3746a59)).
- **MarkdownReportBuilder Utility**: Added automated markdown reporting engine for consistent multi-agent sprint summaries ([`eb82025`](https://github.com/hiroqt/PixelCrew/commit/eb82025)).

---

### 🔧 Changed & Refactored

- **Workspace Structure**: Renamed legacy `.pixel-agents/` directory to `.pixel-crew/` for cleaner brand alignment ([`ace5334`](https://github.com/hiroqt/PixelCrew/commit/ace5334)).
- **Unified Command Catalog**: Centralized 27 Floor 42 command definitions in `src/scaffold/commands-catalog.js` for single-source-of-truth generation across all IDEs ([`7c9128f`](https://github.com/hiroqt/PixelCrew/commit/7c9128f)).
- **Refined Anti-Slop Directives**: Formalized banned pattern criteria across frontend engineering, creative direction, and design system modules ([`7b826bd`](https://github.com/hiroqt/PixelCrew/commit/7b826bd)).

---

### 📚 Documentation & Benchmarks

- **README Brand Overhaul**: Redesigned README with new banner assets, technical architecture diagrams, and detailed feature comparisons ([`3dd16b1`](https://github.com/hiroqt/PixelCrew/commit/3dd16b1), [`fd7b928`](https://github.com/hiroqt/PixelCrew/commit/fd7b928)).
- **Real-World Token Benchmarks**: Documented token usage benchmarks demonstrating 72% context reduction across large-scale software tasks ([`4cd99ca`](https://github.com/hiroqt/PixelCrew/commit/4cd99ca), PR [#2](https://github.com/hiroqt/PixelCrew/pull/2)).
- **Expanded Quickstart & E2E Testing**: Detailed step-by-step setup for every supported AI IDE and added comprehensive `TESTING.md` guide ([`4bfb568`](https://github.com/hiroqt/PixelCrew/commit/4bfb568), [`4ce3ab0`](https://github.com/hiroqt/PixelCrew/commit/4ce3ab0)).

---

## [0.2.4] - 2026-08-29

### Added
- External multi-file software generation pipeline with clean CLI interface.
- Real-time token reporting and task cost estimation.
- End-to-end testing suite for CLI and orchestrator engine.
- Clean scaffolding for greenfield web applications.

---

## [0.2.3] - 2026-08-29

### Added
- Dynamic DAG task planner and dependency resolution.
- Swarm skill registry and autonomous agent task queue.
- Multi-agent parallel task execution engine.

---

## [0.2.2] - 2026-08-28

### Added
- Unified `.pixel-agents` workspace configuration and state persistence.
- Autonomous multi-agent pipeline with role-based orchestration.
- Live event streaming and state synchronization.

---

## [0.2.1] - 2026-08-27

### Added
- Dynamic multi-file software synthesis engine.
- Global skill synchronization across user configurations.
- Initial support for creative direction and frontend builder personas.

---

## [0.2.0] - 2026-08-26

### Added
- Initial public release of PixelCrew.
- Interactive retro pixel-art tech startup office visual dashboard (`http://localhost:4747`).
- Zero-dependency Node.js CLI runtime (`npx pixelcrew`).
- Multi-agent orchestration framework for AI coding assistants.
