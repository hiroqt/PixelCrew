/**
 * PIXEL CREW — Multi-IDE Rules & Workflow Generator
 * 
 * Generates configuration files, rules, prompts, and workflows for:
 * - Kiro AI (.kiro/workflows/*.md, .kiro/prompts/*.md, .kiro/rules/, .kirorules)
 * - Cursor AI (.cursor/commands/*.md, .cursorrules, .cursor/rules/pixelcrew.mdc)
 * - Google Antigravity (.agents/skills/, .agents/rules/, AGENTS.md, GEMINI.md)
 * - Claude Code (.claude/commands/*.md, .claude/skills/, CLAUDE.md, .claude-plugin/plugin.json)
 */

import path from 'node:path';
import { FLOOR42_COMMANDS } from './commands-catalog.js';
import { generateCursorFiles } from './cursor-generator.js';
import { generateClaudeFiles } from './claude-generator.js';

export { generateCursorFiles, generateClaudeFiles };

/**
 * Generates Google Antigravity configuration and rules files (AGENTS.md, GEMINI.md, .agents/rules/pixelcrew.md)
 */
export function generateAntigravityFiles(targetDir, isGlobal = false) {
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

  if (isGlobal) {
    // Global Antigravity configuration in ~/.gemini/config/
    files.push({ path: path.join(targetDir, 'GEMINI.md'), content: geminiMdContent });
    files.push({ path: path.join(targetDir, 'rules', 'pixelcrew.md'), content: agentsRuleContent });
  } else {
    // Workspace Antigravity configuration in .agents/
    files.push({ path: path.join(targetDir, 'AGENTS.md'), content: agentsMdContent });
    files.push({ path: path.join(targetDir, 'GEMINI.md'), content: geminiMdContent });
    files.push({ path: path.join(targetDir, '.agents', 'rules', 'pixelcrew.md'), content: agentsRuleContent });
  }

  // Generate individual skill directories for each Floor 42 command so Antigravity AI chat
  // automatically indexes and exposes them in the "/" slash command autocomplete menu
  const skillsBase = isGlobal
    ? path.join(targetDir, 'skills')
    : path.join(targetDir, '.agents', 'skills');

  for (const cmd of FLOOR42_COMMANDS) {
    if (cmd.name === 'pixelcrew') continue;
    const skillPath = path.join(skillsBase, cmd.name, 'SKILL.md');
    const skillContent = `---
name: ${cmd.name}
description: >-
  ${cmd.description}. Triggers Floor 42 command /${cmd.name}.
---

# /${cmd.name} — PixelCrew Command

${cmd.prompt}
`;
    files.push({ path: skillPath, content: skillContent });
  }

  return files;
}

/**
 * Generates all multi-IDE rule and configuration files for a target directory
 */
export function generateAllIDERules(targetDir, isGlobal = false) {
  return [
    ...generateCursorFiles(targetDir, isGlobal),
    ...generateAntigravityFiles(targetDir, isGlobal),
    ...generateClaudeFiles(targetDir, isGlobal)
  ];
}
