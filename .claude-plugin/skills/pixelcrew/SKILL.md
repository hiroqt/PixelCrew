---
name: pixelcrew
description: Autonomous Multi-Agent Engineering Swarm & Retro Pixel-Art Startup Office. Orchestrates 23 specialized commands across Creative Director, UX Planner, Design System Architect, Frontend Engineer, Backend Engineer, Performance SRE, Security Sentinel, and QA Automation personas.
version: 0.2.4
author: Arnel (@hiroqt)
---

# 🏢 PixelCrew — Autonomous Multi-Agent Engineering Swarm

> **Floor 42, Pixel Corps HQ**: Transform any codebase into an observable, choreographed engineering workspace with anti-AI design synthesis, mathematical fluid typography, and automated E2E testing.

---

## ⚡ Floor 42 Swarm Command Suite

All commands can be invoked via `/pixelcrew <command>`, direct slash commands (e.g. `/<command>`), or the CLI (`npx pixelcrew <command>`):

### 1. 🚀 Floor 42 Creation & Architecture
- **`/assemble [prompt]`** *(aliases: `/craft`, `/sprint`)*: Full shape-then-build multi-agent sprint pipeline from brief to production code.
- **`/blueprint [prompt]`** *(aliases: `/shape`, `/spec`)*: Plans UX section topologies, wireframes, and compiles dynamic DAG task graphs *before* writing code.
- **`/boss-fight <issue>`** *(aliases: `/fix`, `/debug`)*: Targeted swarm bug blitz to isolate, repair, and verify breaking issues.
- **`/manifest [--dry-run]`** *(aliases: `/document`, `/doc`)*: Reverse-engineers active project code into comprehensive `DESIGN.md` and `PRODUCT.md` architectural specifications.
- **`/retrofit [--dry-run]`** *(aliases: `/extract`, `/tokens`)*: Extracts reusable UI primitives, Tailwind tokens, and CSS variables into the centralized design system.
- **`/init [--dry-run]`**: One-time setup: scans codebase architecture, configures `.pixel-crew/`, and writes `PRODUCT.md` & `DESIGN.md`.

### 2. 🎨 Pixel Aesthetic & Anti-AI Direction
- **`/render`** *(aliases: `/critique`, `/review-ui`)*: 6-dimension Anti-AI design & UX review (Originality, Hierarchy, Typography, Layout, Brand, Slop Penalty $\ge 8.5/10$).
- **`/8bit`** *(aliases: `/delight`, `/retro`, `/joy`)*: Adds retro arcade delight: procedural 8-bit Web Audio chimes, CRT phosphor scanlines, and tactile feedback.
- **`/overdrive`** *(aliases: `/fx`, `/extreme`)*: Injects high-end technical effects: WebGL/Canvas shaders, interactive terminal console, reactive backgrounds.
- **`/chromatic [palette]`** *(aliases: `/colorize`, `/palette`)*: Injects curated HSL color tokens, dark mode elevation surfaces, and atmospheric accent tiers.
- **`/typeset [preset]`** *(aliases: `/typography`, `/fonts`)*: Fixes font pairings, applies mathematical fluid `clamp()` type scales, and establishes expressive typography.
- **`/bento [section]`** *(aliases: `/layout`, `/grid`)*: Reorganizes sections into asymmetric Bento grids, dynamic viewport flow, and zero horizontal overflow.
- **`/de-slop [section]`** *(aliases: `/clarify`, `/clean-copy`)*: Strips AI cliché copywriting (*"Elevate your workflow", "Seamlessly innovate"*) with grounded technical value propositions.
- **`/bolder` / `/quieter`**: Amplifies visual energy with editorial contrast or restores clean minimalist balance.

### 3. 🛡️ Production Hardening & SRE
- **`/sentinel`** *(aliases: `/harden`, `/secure`)*: Security & resilience pass: OWASP checks, SQL injection prevention, RFC 7807 error envelopes, and rate limiting.
- **`/audit`** *(aliases: `/sre-audit`)*: Runs technical quality checks: a11y WCAG AA/AAA, Core Web Vitals (LCP < 0.6s), and Playwright E2E journeys.
- **`/warp`** *(aliases: `/optimize`, `/perf`)*: Full-stack performance tuning: streaming SSR, bundle minification, and AST prompt caching (~72% token savings).
- **`/polish`** *(aliases: `/ship-ready`)*: Final shipping readiness pass: design system token alignment, type checks, and aesthetic cleanup.
- **`/calibrate [viewport]`** *(aliases: `/adapt`, `/responsive`)*: Optimizes responsive layouts from 360px mobile to 4K ultra-wide with fluid viewports.
- **`/onboard`** *(aliases: `/first-run`)*: Implements first-run onboarding flows, empty state illustrations, and user activation pathways.

### 4. 🏢 Floor 42 Operations
- **`/office`** *(aliases: `/live`, `/dashboard`)*: Launches Floor 42 live startup office dashboard (`http://localhost:4747`) and real-time site preview iframe.
- **`/roster [spawn|list]`** *(aliases: `/crew`, `/agents`)*: Inspects active agent roster, workstations, and sprite telemetry.
- **`/sync [--dry-run]`**: Synchronizes modular skills across all detected IDEs (`.claude`, `.cursor`, `.agents`, `.kiro`, etc.).
- **`/doctor`**: Diagnoses local environment, LLM keys, and available coding agent runtimes.


---

## 👥 Floor 42 Personas & Squad Roles

PixelCrew delegates tasks across 8 specialized agent personas:

1. **Lead Orchestrator (`orchestrator`)**: DAG task decomposition, context extraction, and subagent synthesis.
2. **Creative Director (`creativeDirector`)**: Aesthetic strategy, brand soul, and strict anti-AI constraints.
3. **UX Planner (`uxPlanner`)**: Asymmetric section layouts, user flow, and interaction specs.
4. **Design System Architect (`designSystem`)**: HSL tokens, mathematical `clamp()` typography, and surface tiers.
5. **Frontend Engineer (`frontend`)**: Next.js 14/15 App Router, React 19, TypeScript, and Tailwind CSS.
6. **Backend & Database Engineer (`backend`, `database`)**: Type-safe route handlers, RFC 7807 envelopes, Prisma/Postgres schemas.
7. **Performance & Security SRE (`performance`, `security`)**: Core Web Vitals, CSP headers, OWASP audit, and token pruning.
8. **QA Automation Engineer (`qa`)**: Playwright E2E user journeys, visual regression, and audit reports.

---

## 🛡️ Anti-AI Design Philosophy

PixelCrew enforces strict visual standards to guarantee human-grade aesthetics:
- ❌ **Banned**: Purple/blue mesh gradient blobs, repeating uniform 3-card grids, fake AI sparkles, nested cards-in-cards.
- ❌ **Banned**: Cliché marketing copy (*"Unlock the power of next-gen AI", "Elevate your productivity"*).
- ✅ **Required**: Intentional asymmetry, Bento topologies, mathematical typography pairings, and grounded technical metrics.

---

## 🕹️ Live Floor 42 Dashboard Telemetry

Whenever you execute ANY `/pixelcrew` command in chat (e.g. `/assemble`, `/blueprint`, `/render`, `/bolder`, `/quieter`, `/8bit`, `/warp`, `/sentinel`, `/audit`, `/polish`):
1. **Emit Telemetry Events**:
   - Write directly to `.pixel-crew/events.jsonl` or run:
     `npx pixelcrew emit --agent <role> --type <type> --message "<action description>"`
   - Examples:
     - `npx pixelcrew emit --agent creativeDirector --type tool --message "Reviewing design against 6-dimension Anti-AI rubric"`
     - `npx pixelcrew emit --agent frontend --type tool --message "Refactoring components with fluid clamp typography"`
     - `npx pixelcrew emit --agent qa --type tool --message "Running Playwright E2E verification"`
2. **Real-Time Live Mirroring**:
   - The Floor 42 visual dashboard at `http://localhost:4747` automatically mirrors every tool execution, file edit, and reasoning step to the `#AI-SIDECHAT` feed and animates the corresponding squad workstation sprite.

