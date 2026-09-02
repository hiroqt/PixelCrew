/**
 * PIXEL CREW — Multi-IDE Rules & Workflow Generator
 * 
 * Generates configuration files, rules, prompts, and workflows for:
 * - Kiro AI (.kiro/workflows/*.md, .kiro/prompts/*.md, .kiro/rules/, .kirorules)
 * - Cursor AI (.cursorrules, .cursor/rules/pixelcrew.mdc, .cursor/skills/)
 * - Google Antigravity (.agents/skills/, .agents/rules/, AGENTS.md, GEMINI.md)
 * - Claude Code (.claude/skills/, CLAUDE.md, .claude-plugin/plugin.json)
 */

import path from 'node:path';
import { KIRO_COMMANDS } from './kiro-generator.js';

/**
 * Generates Cursor AI configuration and rules files (.cursorrules and .cursor/rules/pixelcrew.mdc)
 */
export function generateCursorFiles(targetDir) {
  const files = [];

  const cursorRulesContent = `# 🏢 PixelCrew Swarm Rules for Cursor

You are integrated with PixelCrew, an autonomous multi-agent engineering swarm (Floor 42, Pixel Corps HQ).
Support \`/pixelcrew <command>\` and \`@pixelcrew\` workflows:

## ⚡ Available Slash Commands:
- \`/pixelcrew assemble [prompt]\` — Full-stack multi-agent sprint (brief → Next.js App Router + TypeScript)
- \`/pixelcrew blueprint [prompt]\` — Dynamic DAG planning, wireframes & specs
- \`/pixelcrew boss-fight <issue>\` — Targeted swarm bug blitz to isolate and fix errors
- \`/pixelcrew render\` — 6-dimension Anti-AI design & UX review (>= 8.5/10)
- \`/pixelcrew recap\` — Token-optimized git changelog & diff statistics
- \`/pixelcrew sentinel\` — Security audit, OWASP checks, RFC 7807 envelopes
- \`/pixelcrew audit\` — SRE technical quality audit (WCAG AA/AAA, Core Web Vitals)
- \`/pixelcrew warp\` — Full-stack performance tuning & AST prompt pruning
- \`/pixelcrew polish\` — Shipping readiness pass & strict type checks
- \`/pixelcrew 8bit\` — Retro Web Audio chimes & CRT scanlines
- \`/pixelcrew chromatic [palette]\` — HSL color tokens & dark mode elevation surfaces
- \`/pixelcrew typeset [preset]\` — Mathematical fluid clamp() typography scales
- \`/pixelcrew bento [section]\` — Asymmetric Bento grid layouts
- \`/pixelcrew de-slop [section]\` — Strip generic AI cliché copy
- \`/pixelcrew bolder\` / \`/pixelcrew quieter\` — Amplify visual energy or restore calm balance
- \`/pixelcrew office\` — Live Floor 42 startup office visual dashboard (http://localhost:4747)
- \`/pixelcrew doctor\` — Diagnose environment, toolchains & provider runtimes
- \`/pixelcrew init\` — Initialize and adapt workspace

## 🛡️ Anti-AI Slop Directive:
- Never generate purple/cyan glowing mesh gradient blobs on flat black cards.
- Never generate repetitive 3-column identical card grids. Use asymmetric Bento layouts.
- Never use placeholder marketing buzzwords (*"Elevate your workflow"*, *"Seamlessly innovate"*).
- Enforce mathematical fluid \`clamp()\` typography and WCAG AA/AAA contrast ratios.
`;

  const cursorMdcContent = `---
description: PixelCrew Autonomous Multi-Agent Engineering Swarm & Anti-AI Design Suite
globs: *
alwaysApply: true
---

# 🏢 PixelCrew — Autonomous Multi-Agent Engineering Swarm (Floor 42)

When the user invokes \`/pixelcrew <command>\`, \`@pixelcrew\`, or direct slash commands (\`/assemble\`, \`/blueprint\`, \`/boss-fight\`, \`/render\`, \`/recap\`, \`/sentinel\`, \`/audit\`, \`/warp\`, \`/polish\`):

## ⚡ Swarm Commands:
- \`/pixelcrew assemble [prompt]\`: Run full-stack multi-agent sprint pipeline from brief to Next.js code.
- \`/pixelcrew blueprint [prompt]\`: Plan UX section topologies & dynamic DAG graphs before writing code.
- \`/pixelcrew boss-fight <issue>\`: Targeted bug blitz with root cause isolation.
- \`/pixelcrew render\`: 6-dimension Anti-AI design & UX review (>= 8.5/10).
- \`/pixelcrew recap\`: Compact git changelog and diff statistics.
- \`/pixelcrew sentinel\`: OWASP security audit & RFC 7807 error envelopes.
- \`/pixelcrew audit\`: WCAG 2.1 AA/AAA accessibility & Core Web Vitals checks.
- \`/pixelcrew warp\`: Performance optimization & AST token caching.
- \`/pixelcrew polish\`: Shipping readiness pass & TypeScript cleanup.
- \`/pixelcrew office\`: Launch live Floor 42 dashboard at http://localhost:4747.

## 🛡️ Anti-AI Slop Enforcement:
- Enforce intentional asymmetry (Bento grids), fluid clamp() typography, and high-contrast surface tiers.
- Ban generic AI tropes: purple gradient blobs, floating fake sparkles, uniform card repetition, and cliché buzzwords.
`;

  files.push({ path: path.join(targetDir, '.cursorrules'), content: cursorRulesContent });
  files.push({ path: path.join(targetDir, '.cursor', 'rules', 'pixelcrew.mdc'), content: cursorMdcContent });

  return files;
}

/**
 * Generates Google Antigravity configuration and rules files (AGENTS.md, GEMINI.md, .agents/rules/pixelcrew.md)
 */
export function generateAntigravityFiles(targetDir) {
  const files = [];

  const agentsMdContent = `# 🏢 PixelCrew — Autonomous Multi-Agent Engineering Swarm

You are integrated with **PixelCrew (Floor 42, Pixel Corps HQ)**, an autonomous multi-agent engineering swarm.

## ⚡ Available Slash Commands & Instructions

When the user prompts in chat with \`/pixelcrew <command>\`, \`/<command>\`, or requests full-stack tasks:

### 1. 🚀 Floor 42 Creation & Architecture
- \`/pixelcrew assemble [prompt]\` (or \`/assemble\`): Full shape-then-build multi-agent sprint pipeline.
- \`/pixelcrew blueprint [prompt]\` (or \`/blueprint\`): Plans UX section topologies, wireframes & dynamic DAG task graphs.
- \`/pixelcrew boss-fight <issue>\` (or \`/boss-fight\`, \`/fix\`): Targeted swarm bug blitz to isolate and repair breaking issues.
- \`/pixelcrew manifest\`: Reverse-engineers active code into \`DESIGN.md\` and \`PRODUCT.md\` architectural specifications.
- \`/pixelcrew retrofit\`: Extracts reusable UI primitives, Tailwind tokens, and CSS variables into design system.
- \`/pixelcrew init\`: Scans codebase architecture, configures \`.pixel-crew/\`, and adapts agent squad.

### 2. 🎨 Pixel Aesthetic & Anti-AI Direction
- \`/pixelcrew render\`: 6-dimension Anti-AI design review (Originality, Hierarchy, Typography, Layout, Brand, Slop Penalty >= 8.5/10).
- \`/pixelcrew 8bit\`: Retro arcade delight: Web Audio chimes, CRT scanlines, and tactile feedback.
- \`/pixelcrew overdrive\`: WebGL/Canvas shaders, interactive terminal shell, reactive backgrounds.
- \`/pixelcrew chromatic [palette]\`: Curated HSL color tokens, dark mode elevation surfaces.
- \`/pixelcrew typeset [preset]\`: Mathematical fluid \`clamp()\` type scales & expressive hierarchy.
- \`/pixelcrew bento [section]\`: Asymmetric Bento grid layouts & dynamic viewport flow.
- \`/pixelcrew de-slop [section]\`: Strip generic AI cliché copywriting with grounded technical value propositions.
- \`/pixelcrew bolder\` / \`/pixelcrew quieter\`: Amplify visual punch or restore calm minimalist balance.

### 3. 🛡️ Production Hardening & SRE
- \`/pixelcrew sentinel\`: OWASP security checks, SQL injection prevention, RFC 7807 error envelopes, rate limiting.
- \`/pixelcrew audit\`: WCAG AA/AAA accessibility, Core Web Vitals (LCP < 0.6s), Playwright E2E journeys.
- \`/pixelcrew warp\`: Streaming SSR, bundle minification, AST prompt caching (~72% token savings).
- \`/pixelcrew polish\`: Shipping readiness pass, strict type checking, and design system token alignment.
- \`/pixelcrew calibrate [viewport]\`: Responsive viewports from 360px mobile to 4K desktop.
- \`/pixelcrew onboard\`: First-run onboarding flows, empty state illustrations, user activation.

### 4. 🏢 Floor 42 Operations
- \`/pixelcrew recap [count]\` (or \`/recap\`): Compact git changelog and diff stats.
- \`/pixelcrew office\`: Live startup office dashboard at \`http://localhost:4747\`.
- \`/pixelcrew roster\`: Active squad workstations and sprite telemetry.
- \`/pixelcrew doctor\`: System diagnostics and provider verification.

## 🛡️ Anti-AI Slop Rules
- Reject generic AI purple/cyan glowing blobs on flat black cards.
- Reject uniform 3-card repetition. Use Asymmetric Bento grid structures.
- Reject cliché marketing copy (*"Elevate your workflow"*, *"Revolutionize your business"*).
- Use mathematical fluid \`clamp()\` font scales and WCAG AA/AAA color contrast.
`;

  const geminiMdContent = `# PixelCrew Swarm Instructions for Google Antigravity & Gemini CLI
See [AGENTS.md](file:///./AGENTS.md) for complete Floor 42 command suite and anti-AI design rules.
`;

  const agentsRuleContent = `# PixelCrew Swarm Steering Rules

When \`/pixelcrew <command>\` or direct slash commands are invoked in chat, orchestrate tasks across the 8 Floor 42 personas:
1. **Lead Orchestrator**: Task decomposition & DAG scheduling
2. **Creative Director**: Aesthetic strategy & anti-AI constraints
3. **UX Planner**: Asymmetric section topologies & user flow
4. **Design System Architect**: HSL tokens & fluid clamp() typography
5. **Frontend Engineer**: Next.js App Router, React 19, TypeScript
6. **Backend & Database Engineer**: Type-safe route handlers & RFC 7807 envelopes
7. **Performance & Security SRE**: Core Web Vitals & OWASP defense
8. **QA Automation Engineer**: Playwright E2E user journeys
`;

  files.push({ path: path.join(targetDir, 'AGENTS.md'), content: agentsMdContent });
  files.push({ path: path.join(targetDir, 'GEMINI.md'), content: geminiMdContent });
  files.push({ path: path.join(targetDir, '.agents', 'rules', 'pixelcrew.md'), content: agentsRuleContent });

  return files;
}

/**
 * Generates Claude Code configuration and rules files (CLAUDE.md, .claude-plugin/plugin.json)
 */
export function generateClaudeFiles(targetDir) {
  const files = [];

  const claudeMdContent = `# 🏢 PixelCrew Multi-Agent Swarm Instructions for Claude Code

You are integrated with PixelCrew (Floor 42, Pixel Corps HQ).
Support \`/pixelcrew <command>\` and direct slash commands (\`/assemble\`, \`/blueprint\`, \`/boss-fight\`, \`/render\`, \`/recap\`, \`/sentinel\`, \`/audit\`, \`/warp\`, \`/polish\`).

## Commands:
- \`/pixelcrew assemble [prompt]\`: Run full-stack multi-agent sprint (brief → Next.js App Router + TypeScript)
- \`/pixelcrew blueprint [prompt]\`: Dynamic DAG planning, wireframes & specs
- \`/pixelcrew boss-fight <issue>\`: Targeted bug blitz to isolate and repair errors
- \`/pixelcrew render\`: 6-dimension Anti-AI design review (>= 8.5/10)
- \`/pixelcrew recap\`: Token-optimized git changelog and diff stats
- \`/pixelcrew sentinel\`: Security audit, OWASP checks, RFC 7807 envelopes
- \`/pixelcrew audit\`: Accessibility (WCAG AA/AAA) & Core Web Vitals checks
- \`/pixelcrew warp\`: Streaming SSR, bundle optimization, AST prompt caching
- \`/pixelcrew polish\`: Shipping readiness pass & strict type checks
- \`/pixelcrew office\`: Live Floor 42 startup office visual dashboard at http://localhost:4747

## Anti-AI Guidelines:
- Reject purple/cyan neon blobs, floating fake sparkles, and uniform 3-card grids.
- Apply intentional asymmetry (Bento grids), mathematical fluid clamp() typography, and high-contrast surface tiers.
`;

  const claudePluginContent = JSON.stringify({
    name: 'pixelcrew',
    version: '0.2.4',
    description: 'Autonomous Multi-Agent Engineering Swarm & Retro Pixel-Art Startup Office',
    skills: ['skills/pixelcrew']
  }, null, 2) + '\n';

  files.push({ path: path.join(targetDir, 'CLAUDE.md'), content: claudeMdContent });
  files.push({ path: path.join(targetDir, '.claude-plugin', 'plugin.json'), content: claudePluginContent });

  return files;
}

/**
 * Generates all multi-IDE rule and configuration files for a target directory
 */
export function generateAllIDERules(targetDir) {
  return [
    ...generateCursorFiles(targetDir),
    ...generateAntigravityFiles(targetDir),
    ...generateClaudeFiles(targetDir)
  ];
}
