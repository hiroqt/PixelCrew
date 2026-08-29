---
name: pixel-agents
description: |
  Local multi-agent orchestration framework and interactive pixel-art tech startup office visual dashboard. Use when the user asks to analyze code, orchestrate subagents, run tasks with pixel-agents/PixelCrew, or stream live IDE activity to the visual office dashboard.
---

# PixelCrew / Pixel Agents Orchestration Skill

Use this skill whenever the user triggers `/goal <objective>`, asks you to perform tasks using `pixel-agents` or `PixelCrew` (e.g., *"create a modern website with pixel-agents"*, *"showcase my projects with pixel crew"*, or *"optimize queries using pixel agents"*), or mentions a goal in chat.

---

## 🎯 MANDATORY `/goal` & MULTI-AGENT EXECUTION WORKFLOW

Whenever the user triggers a goal via `/goal <objective>`, `goal: <objective>`, or prompts in chat to build, create, refactor, or audit with PixelCrew:

### 1. Execute the 10-Stage Multi-Agent Lifecycle (From Brief to E2E Testing)

The multi-agent swarm must execute every layer completely without skipping or cutting corners:

1. **Lead Orchestrator**:
   - Inspects codebase context (`.pixel-agents/context.json`).
   - Compiles a dynamic Directed Acyclic Graph (DAG) decomposing the goal into specialized squad subtasks.
   - Dispatches parallel and sequential dependencies.
2. **Creative Director & Anti-AI Guardian**:
   - Formulates authentic artistic concept and visual personality (Editorial, Technical Lab, Kinetic Studio).
   - Strictly bans generic AI markers: purple/blue mesh gradient blobs, monotonous 3-column card grids, fake floating sparkles, and cliché copy (*"Revolutionize your workflow"*).
3. **UX Planner & Section Topology Architect**:
   - Maps asymmetric layout topology (Hero, Interactive Filter Matrix, Live Terminal Shell, Proof/Specs, Inquiries).
   - Specifies interactive component states (filter categories, modals, live calculations).
4. **Design System Architect**:
   - Synthesizes fluid typography scales using CSS `clamp()`.
   - Compiles Tailwind CSS configuration with customized palettes and Google Fonts pairings.
   - Enforces WCAG 2.1/2.2 AA contrast ratios and dark-mode tokens.
5. **Frontend Engineer**:
   - Generates production-ready, idiomatic Next.js 14/15 App Router + TypeScript + Tailwind CSS code.
   - Builds clean, modular components in `src/components/sections/` with zero placeholder copy.
6. **Backend & Database Engineer**:
   - Synthesizes type-safe TypeScript Route Handlers (`src/app/api/contact/route.ts`, `src/app/api/data/route.ts`).
   - Grounded data models, RFC 7807 error envelopes, and input validation.
7. **Performance & Security SRE**:
   - Profiles Core Web Vitals: LCP < 0.6s, INP < 50ms, CLS = 0.
   - Enforces Content Security Policy (CSP), `rel="noreferrer"` anchor security, and XSS sanitization.
8. **Anti-AI Visual Critic**:
   - Audits code against the 6-dimension design rubric (Originality, Typography, Layout, Hierarchy, Brand Consistency, AI Slop Penalty).
   - Enforces strict threshold pass ($\ge 8.5/10.0$).
9. **QA Automation & Playwright / Vitest E2E Testing**:
   - Synthesizes automated End-to-End test suites (`tests/e2e/user-journey.spec.ts`, `playwright.config.ts`).
   - Verifies homepage landmarks, interactive category filtering, form submission flow, and mobile responsive viewports.
10. **Executive Token Usage & Audit Report**:
    - **Always produces and presents a comprehensive Executive Report** detailing token analytics, architecture, visual score, and test suite verification.

---

## ⚡ Universal Token Usage & Post-Execution Reporting

### Mandatory Post-Execution Report Standard
After completing any goal or task, **always provide a structured Executive & Token Report** formatted in markdown:

```markdown
# 🏆 PixelCrew Multi-Agent Mission Report

**Project:** <Project Name>  
**Objective:** "<Goal Description>"  
**Status:** 100% Completed  

## ⚡ Token Usage & Optimization Metrics
| Metric | Value |
| :--- | :--- |
| **Estimated Raw Tokens** | `42,500 tokens` |
| **Actual Tokens Consumed** | `11,800 tokens` |
| **Tokens Conserved** | `30,700 tokens (72% Efficiency Savings)` |
| **Active Optimization Strategies** | AST Skeletons, Prefix Prompt Caching, Context Boundary Pruning |

## 🧪 End-to-End (E2E) Test Suite Verification
| Test Suite | Scenario | Status |
| :--- | :--- | :--- |
| Playwright E2E | Viewport rendering & semantic landmarks | **✓ PASSED** |
| Playwright E2E | Interactive category filtering & live DOM updates | **✓ PASSED** |
| Playwright E2E | Contact inquiry submission & API validation | **✓ PASSED** |
| Playwright E2E | WCAG AA color contrast & mobile responsive layout | **✓ PASSED** |

## ★ Anti-AI Visual Critic Score: 9.4 / 10.0 (Passed >= 8.5)
- **Originality:** 9.2 / 10
- **Typography:** 9.6 / 10
- **Layout & Rhythm:** 9.1 / 10
- **Generic AI Slop Penalty:** -0.4 / 10

## 📦 Generated Architecture & Artifacts
- `src/app/layout.tsx` & `src/app/page.tsx`
- `src/components/sections/` (Hero, ShowcaseGrid, TerminalShell, ContactForm)
- `src/app/api/` (Route handlers with RFC 7807 contracts)
- `tests/e2e/user-journey.spec.ts` (Automated user journey test suite)
```

---

## 🕹️ Live IDE Telemetry & CLI Usage

### 1. Launching the Swarm Workspace & Visual Dashboard
```bash
# Start orchestrator server and open Floor 42 live office dashboard (http://localhost:4747)
npx pixelcrew start

# Dispatch a goal or full-stack task
npx pixelcrew task "Build a modern portfolio for an AI engineer with Next.js and E2E tests"
```

### 2. Live Telemetry Emission as Subagents Work
As you analyze files or perform operations, emit real-time events to update the dashboard sprites and audio feedback:
```bash
# Thinking / Analyzing:
npx pixelcrew emit --agent frontend --type thinking --message "Analyzing component tree and fluid clamp typography"

# Tool / Skill execution:
npx pixelcrew emit --agent database --type tool --skill postgresql --message "Auditing composite index selectivity"

# QA / E2E verification:
npx pixelcrew emit --agent qa --type skill --skill playwright-e2e --message "Executing automated Playwright user journey test suite"

# Completion:
npx pixelcrew emit --agent orchestrator --type complete --message "Goal accomplished: full E2E test suite passing with 72% token savings"
```

---

## 🏢 What Automatically Happens in the Floor 42 Visual Dashboard

1. **Sprite Animations**: The corresponding agent desk shifts state from `IDLE` (`●_●`) to `WORKING` (`◉▂◉`) with mechanical keyboard typing animations and glowing monitor telemetry.
2. **Terminal Feed**: Real-time `#engineering-feed` stream shows the exact subtask and timestamp.
3. **8-Bit Web Audio**: Triggers retro procedural chiptune sound chimes on state transitions and victory fanfares on goal completion.
4. **Token Saver Meter**: Live cross-IDE token optimization efficiency score.
