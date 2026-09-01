/**
 * PIXEL CREW — Kiro Workflows & Prompts Generator
 * 
 * Generates individual .kiro/workflows/*.md, .kiro/prompts/*.md, and .kirorules
 * files so that every PixelCrew slash command (/recap, /assemble, /blueprint, /render, etc.)
 * is natively recognized in the Kiro chat box autocomplete and prompt menu.
 */

import path from 'node:path';

export const KIRO_COMMANDS = [
  {
    name: 'recap',
    description: 'Generate a token-optimized recap of recent git changes, commits, diff stats, and file operations',
    prompt: `Execute a token-optimized session recap:
1. Analyze recent git commits, authors, and dates (default: last 10 commits, or user-specified count).
2. Calculate diff statistics (insertions, deletions, files modified).
3. Group and display files categorized by added (+), modified (~), deleted (-), and renamed (→).
4. Output a compact, high-density overview without redundant prose.`
  },
  {
    name: 'assemble',
    description: 'Full shape-then-build multi-agent sprint pipeline from brief to production code',
    prompt: `Execute the PixelCrew /assemble pipeline:
1. UX Planner shapes the information architecture and section layout.
2. Design System Architect establishes typography scale, HSL color tokens, and surface tiers.
3. Frontend & Backend Engineers synthesize production-grade code with 0 AI slop.
4. QA Engineer verifies against the 6-dimension Anti-AI rubric.`
  },
  {
    name: 'blueprint',
    description: 'Dynamic DAG planning, wireframes & specifications before writing code',
    prompt: `Generate a comprehensive architectural blueprint:
1. Define section topologies, component breakdown, and state management.
2. Compile a dynamic DAG task graph with explicit dependencies.
3. Specify typography, color surfaces, and accessibility requirements.`
  },
  {
    name: 'boss-fight',
    description: 'Targeted swarm bug blitz to isolate, repair, and verify breaking issues',
    prompt: `Engage PixelCrew Boss Fight bug blitz:
1. Reproduce and isolate the root cause with stack trace inspection.
2. Apply targeted fix with minimal blast radius.
3. Verify resolution and ensure zero regressions.`
  },
  {
    name: 'render',
    description: '6-dimension Anti-AI design & UX review (Originality, Hierarchy, Typography, Layout, Brand, Slop Penalty >= 8.5/10)',
    prompt: `Run a 6-dimension Anti-AI design review:
1. Score Originality, Visual Hierarchy, Typography, Layout Density, Brand Consistency, and AI Slop Penalty.
2. Audit against the 64-pattern Anti-AI Slop Checklist (no purple gradients, no uniform 3-card grids, no fake sparkles).
3. Output concrete recommendations if score is below 8.5/10.`
  },
  {
    name: 'sentinel',
    description: 'Security & resilience hardening pass: OWASP checks, SQL injection prevention, rate limiting',
    prompt: `Execute PixelCrew Sentinel security audit:
1. Audit input validation, sanitize queries, and check authentication middleware.
2. Ensure RFC 7807 error envelopes and rate limiting on API endpoints.
3. Verify CSP headers, CORS policies, and secret handling.`
  },
  {
    name: 'audit',
    description: 'SRE and technical quality checks: a11y WCAG AA/AAA, Core Web Vitals, test suites',
    prompt: `Run PixelCrew technical quality audit:
1. Verify WCAG 2.1/2.2 AA/AAA accessibility (semantic HTML, focus rings, contrast).
2. Measure Core Web Vitals (LCP, CLS, INP) and layout shift risks.
3. Check test coverage and runtime error boundaries.`
  },
  {
    name: 'warp',
    description: 'Full-stack performance tuning, streaming SSR, bundle minification, prompt caching',
    prompt: `Apply PixelCrew Warp performance optimizations:
1. Optimize bundle size, lazy-load heavy dependencies, and configure streaming SSR.
2. Tune database queries, eliminate N+1 bottlenecks, and configure multi-tier caching.
3. Implement AST prompt pruning for ~72% token savings.`
  },
  {
    name: 'polish',
    description: 'Final shipping readiness pass: design system token alignment, type checks, visual cleanup',
    prompt: `Perform PixelCrew shipping polish pass:
1. Verify strict adherence to design system tokens and fluid typography clamp() scales.
2. Resolve all TypeScript errors, lint warnings, and unhandled edge cases.
3. Ensure micro-interactions, hover states, and smooth transitions are pixel-perfect.`
  },
  {
    name: '8bit',
    description: 'Retro arcade delight: procedural 8-bit Web Audio chimes, CRT phosphor scanlines',
    prompt: `Inject retro 8-bit arcade delight into the interface:
1. Add Web Audio API synthesis for subtle interactive audio feedback on clicks/actions.
2. Apply optional CRT phosphor scanline overlays and retro pixel accents.
3. Ensure all effects are lightweight and respect prefers-reduced-motion.`
  },
  {
    name: 'overdrive',
    description: 'High-end technical effects: WebGL/Canvas shaders, interactive terminal console',
    prompt: `Enable PixelCrew Overdrive technical effects:
1. Injects canvas/WebGL reactive backgrounds and high-contrast technical data visualizations.
2. Embeds interactive keyboard-driven CLI drawer or terminal console.
3. Maintains 60fps performance with requestAnimationFrame throttling.`
  },
  {
    name: 'chromatic',
    description: 'Injects curated HSL color tokens, dark mode elevation surfaces, atmospheric accent tiers',
    prompt: `Apply PixelCrew Chromatic color strategy:
1. Define coherent HSL color tokens for primary, accent, surface-0 through surface-3.
2. Eliminate generic purple/blue neon glows on flat black.
3. Ensure WCAG AA contrast compliance across all light and dark mode surfaces.`
  },
  {
    name: 'typeset',
    description: 'Mathematical fluid clamp() type scales, distinct font pairings, expressive hierarchy',
    prompt: `Apply PixelCrew Typeset typography strategy:
1. Implement fluid clamp() font scales for headings, subheadings, and body copy.
2. Pair a distinctive display typeface with a readable monospace or sans-serif body font.
3. Enforce line lengths (max 65ch) and generous leading (1.5–1.7x).`
  },
  {
    name: 'bento',
    description: 'Reorganizes sections into asymmetric Bento grids and dynamic viewport flow',
    prompt: `Restructure layout using Asymmetric Bento grid patterns:
1. Break monotonous multi-card grids into varying column spans (e.g. 8-col + 4-col).
2. Create intentional visual anchors with varying card weights and heights.
3. Guarantee zero horizontal overflow and responsive mobile stacking.`
  },
  {
    name: 'de-slop',
    description: 'Strips AI cliché copywriting and generic templates with grounded value propositions',
    prompt: `Run PixelCrew De-Slop copy and design sanitization:
1. Remove generic AI buzzwords ("Streamline your workflow", "Elevate innovation", "Seamless integration").
2. Replace vague claims with concrete, domain-grounded engineering metrics and features.
3. Remove decorative gridlines, floating pill kickers, and template crutches.`
  },
  {
    name: 'bolder',
    description: 'Amplifies visual energy with dramatic editorial contrast and bold typography',
    prompt: `Amplify visual energy:
1. Increase contrast ratio between surfaces and text.
2. Scale up display headlines and introduce bold geometric framing.
3. Tighten section groupings for high-impact visual presence.`
  },
  {
    name: 'quieter',
    description: 'Restores clean minimalist balance, generous whitespace, and calm hierarchy',
    prompt: `Apply minimalist calm to the layout:
1. Increase section padding and whitespace.
2. Subdue secondary text and remove non-essential decorative elements.
3. Focus attention on core readable content and primary call to actions.`
  },
  {
    name: 'calibrate',
    description: 'Optimizes responsive layouts from 360px mobile to 4K ultra-wide viewports',
    prompt: `Calibrate layout responsiveness:
1. Verify breakpoints: 360px (mobile), 768px (tablet), 1024px (desktop), 1440px+ (ultrawide).
2. Ensure touch targets >= 44px on mobile devices.
3. Prevent layout breaking, text clipping, and unwanted scrollbars.`
  },
  {
    name: 'onboard',
    description: 'Implements first-run onboarding flows, empty state illustrations, user activation',
    prompt: `Design and implement onboarding user experience:
1. Add guided first-run experience with interactive step progression.
2. Create informative empty states with clear calls to action.
3. Store onboarding state in local storage or session.`
  },
  {
    name: 'office',
    description: 'Launches Floor 42 live startup office dashboard at http://localhost:4747',
    prompt: `Launch PixelCrew Floor 42 live startup office visual dashboard at http://localhost:4747 with real-time agent sprite animations and sidechat feed.`
  },
  {
    name: 'roster',
    description: 'Inspects active agent squad roster, workstations, and telemetry state',
    prompt: `Display PixelCrew active squad roster: Creative Director, UX Planner, Design System Architect, Frontend Engineer, Backend Engineer, Performance SRE, Security Sentinel, QA Automation.`
  },
  {
    name: 'status',
    description: 'Displays orchestration progress, active sprint metrics, and swarm state',
    prompt: `Inspect and report current PixelCrew swarm status, active task progress, and sprint metrics.`
  },
  {
    name: 'doctor',
    description: 'Diagnoses local environment, toolchain verification, and coding agent provider availability',
    prompt: `Run comprehensive environment diagnostics: check Node.js, Git, local CLI runtimes, and detected AI IDE providers.`
  },
  {
    name: 'manifest',
    description: 'Reverse-engineers active project code into DESIGN.md and PRODUCT.md architectural specifications',
    prompt: `Inspect codebase AST and generate comprehensive DESIGN.md and PRODUCT.md architectural documentation.`
  },
  {
    name: 'retrofit',
    description: 'Extracts reusable UI primitives, Tailwind tokens, and CSS variables into the design system',
    prompt: `Analyze active UI components and extract reusable color tokens, spacing variables, and component primitives into centralized design system.`
  },
  {
    name: 'pixelcrew',
    description: 'Floor 42 Master Multi-Agent Command Suite Dispatcher',
    prompt: `Floor 42 Master Command Dispatcher. Type /pixelcrew <command> or direct slash commands (e.g. /recap, /assemble, /blueprint, /render, /boss-fight, /sentinel, /audit, /warp, /polish) to orchestrate the 8-agent swarm.`
  }
];

/**
 * Generates all Kiro workflow, prompt, and rule files
 */
export function generateKiroFiles(targetDir, isGlobal = false) {
  const baseDir = isGlobal ? targetDir : path.join(targetDir, '.kiro');
  const files = [];

  // 1. Workflows (.kiro/workflows/*.md)
  for (const cmd of KIRO_COMMANDS) {
    const workflowPath = path.join(baseDir, 'workflows', `${cmd.name}.md`);
    const workflowContent = `---
name: ${cmd.name}
description: ${cmd.description}
---

# /${cmd.name} — PixelCrew Command

${cmd.prompt}
`;
    files.push({ path: workflowPath, content: workflowContent });
  }

  // 2. Prompts (.kiro/prompts/*.md)
  for (const cmd of KIRO_COMMANDS) {
    const promptPath = path.join(baseDir, 'prompts', `${cmd.name}.md`);
    const promptContent = `---
name: ${cmd.name}
description: ${cmd.description}
---

${cmd.prompt}
`;
    files.push({ path: promptPath, content: promptContent });
  }

  // 3. Rules (.kirorules and .kiro/rules/pixelcrew.md)
  const rulesContent = `# 🏢 PixelCrew Swarm Rules for Kiro

You are integrated with PixelCrew, an autonomous multi-agent engineering swarm (Floor 42, Pixel Corps HQ).

## ⚡ Slash Commands in Kiro Chat:
${KIRO_COMMANDS.map(c => `- **\`/${c.name}\`**: ${c.description}`).join('\n')}

## 🛡️ Anti-AI Slop Directive:
- Enforce intentional asymmetry, mathematical fluid \`clamp()\` typography, and high-contrast surface tiers.
- Reject generic AI purple/cyan glowing blobs on flat black.
- Reject cliché copy (*"Elevate your workflow"*, *"Seamlessly innovate"*) and uniform 3-card grids.
`;

  if (!isGlobal) {
    files.push({ path: path.join(targetDir, '.kirorules'), content: rulesContent });
    files.push({ path: path.join(baseDir, 'rules', 'pixelcrew.md'), content: rulesContent });
  }

  return files;
}
