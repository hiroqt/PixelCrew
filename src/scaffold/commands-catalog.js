/**
 * PIXEL CREW — Canonical Floor 42 Swarm Command Catalog
 * 
 * Central registry of all 24 Floor 42 multi-agent slash commands, including
 * descriptions, argument signatures, aliases, execution prompts, and categories.
 * Used by Claude Code, Cursor, Kiro, Antigravity, and PixelCrew command generators.
 */

export const FLOOR42_COMMANDS = [
  // 1. 🚀 Floor 42 Creation & Architecture
  {
    name: 'assemble',
    aliases: ['craft', 'sprint'],
    category: 'architecture',
    description: 'Full shape-then-build multi-agent sprint pipeline from brief to production code',
    usage: '/assemble <prompt>',
    prompt: `Execute the PixelCrew /assemble sprint pipeline for: $ARGUMENTS.
1. UX Planner shapes the information architecture, asymmetric section topologies, and component breakdown.
2. Design System Architect establishes fluid clamp() typography scales, curated HSL color tokens, and elevation surfaces.
3. Frontend & Backend Engineers synthesize production-grade code (Next.js / TypeScript) with zero AI slop.
4. QA Engineer verifies against the 6-dimension Anti-AI rubric (score >= 8.5/10) and checks responsiveness.`
  },
  {
    name: 'blueprint',
    aliases: ['shape', 'spec'],
    category: 'architecture',
    description: 'Dynamic DAG planning, wireframes & specifications before writing code',
    usage: '/blueprint <prompt>',
    prompt: `Generate a comprehensive architectural blueprint for: $ARGUMENTS.
1. Define asymmetric section topologies, component breakdown, and state management hierarchy.
2. Compile a dynamic DAG task graph with explicit dependencies and agent assignments.
3. Specify fluid typography clamp() formulas, HSL surface tiers, and WCAG AA/AAA accessibility constraints.`
  },
  {
    name: 'boss-fight',
    aliases: ['fix', 'debug'],
    category: 'architecture',
    description: 'Targeted swarm bug blitz to isolate, repair, and verify breaking issues',
    usage: '/boss-fight <issue description>',
    prompt: `Engage PixelCrew Boss Fight bug blitz for: $ARGUMENTS.
1. Reproduce and isolate the root cause with stack trace inspection and AST analysis.
2. Apply targeted fix with minimal blast radius and zero regressions.
3. Verify resolution, run regression test suite, and document prevention measures.`
  },
  {
    name: 'manifest',
    aliases: ['document', 'doc'],
    category: 'architecture',
    description: 'Reverse-engineers active project code into DESIGN.md and PRODUCT.md architectural specifications',
    usage: '/manifest [--dry-run]',
    prompt: `Inspect codebase AST and generate comprehensive architectural documentation:
1. Reverse-engineer design system tokens, color palettes, and typography into DESIGN.md.
2. Compile product vision, user personas, architecture stack, and feature roadmap into PRODUCT.md.
3. Format output with clear markdown headings and executable specifications.`
  },
  {
    name: 'retrofit',
    aliases: ['extract', 'tokens'],
    category: 'architecture',
    description: 'Extracts reusable UI primitives, Tailwind tokens, and CSS variables into the design system',
    usage: '/retrofit [--dry-run]',
    prompt: `Analyze active UI components and extract design system tokens:
1. Identify recurring hardcoded hex colors, spacing values, and font sizes across components.
2. Consolidate them into standardized CSS custom properties / Tailwind tokens in globals.css.
3. Refactor components to consume centralized tokens, ensuring consistent visual surface tiers.`
  },
  {
    name: 'init',
    aliases: ['setup'],
    category: 'architecture',
    description: 'Scans codebase architecture, configures .pixel-crew/, and adapts agent squad',
    usage: '/init [--yes] [--provider <name>]',
    prompt: `Initialize and adapt PixelCrew workspace:
1. Analyze codebase frameworks, languages, ORM models, testing suites, and styling systems.
2. Generate context-aware configuration in .pixel-crew/ (config.json, context.json, state.json).
3. Synchronize agent skills and rules across detected IDE environments.`
  },

  // 2. 🎨 Pixel Aesthetic & Anti-AI Direction
  {
    name: 'render',
    aliases: ['critique', 'review-ui'],
    category: 'aesthetic',
    description: '6-dimension Anti-AI design & UX review (Originality, Hierarchy, Typography, Layout, Brand, Slop Penalty >= 8.5/10)',
    usage: '/render',
    prompt: `Run a rigorous 6-dimension Anti-AI design review:
1. Score Originality, Visual Hierarchy, Typography, Layout Density, Brand Consistency, and AI Slop Penalty.
2. Audit against the 64-pattern Anti-AI Slop Checklist (no purple gradients, no uniform 3-card grids, no fake sparkles).
3. If score < 8.5/10, output concrete, actionable code adjustments to reach human-grade excellence.`
  },
  {
    name: '8bit',
    aliases: ['delight', 'retro', 'joy'],
    category: 'aesthetic',
    description: 'Retro arcade delight: procedural 8-bit Web Audio chimes, CRT phosphor scanlines, tactile joy',
    usage: '/8bit',
    prompt: `Inject retro 8-bit arcade delight into the interface:
1. Add Web Audio API synthesis for subtle interactive audio feedback on clicks, submits, and tabs.
2. Apply optional CRT phosphor scanline overlays and retro pixel accents with CSS.
3. Ensure all effects are lightweight, zero-dependency, and respect prefers-reduced-motion.`
  },
  {
    name: 'overdrive',
    aliases: ['fx', 'extreme'],
    category: 'aesthetic',
    description: 'High-end technical effects: WebGL/Canvas shaders, interactive terminal console, reactive backgrounds',
    usage: '/overdrive',
    prompt: `Enable PixelCrew Overdrive technical effects:
1. Inject lightweight canvas/WebGL reactive backgrounds and high-contrast technical data visualizations.
2. Embed an interactive keyboard-driven CLI drawer or terminal console for developer exploration.
3. Maintain 60fps performance with requestAnimationFrame throttling and offscreen canvas rendering.`
  },
  {
    name: 'chromatic',
    aliases: ['colorize', 'palette'],
    category: 'aesthetic',
    description: 'Injects curated HSL color tokens, dark mode elevation surfaces, atmospheric accent tiers',
    usage: '/chromatic [palette-name]',
    prompt: `Apply PixelCrew Chromatic color strategy for: $ARGUMENTS.
1. Define coherent HSL color tokens for primary, accent, and surface-0 through surface-3.
2. Eliminate generic purple/cyan neon glow on flat black.
3. Guarantee WCAG AA/AAA contrast compliance across all light and dark mode surfaces.`
  },
  {
    name: 'typeset',
    aliases: ['typography', 'fonts'],
    category: 'aesthetic',
    description: 'Mathematical fluid clamp() type scales, distinct font pairings, expressive hierarchy',
    usage: '/typeset [preset]',
    prompt: `Apply PixelCrew Typeset typography strategy for: $ARGUMENTS.
1. Implement fluid clamp() font scales for display headlines, subheadings, and body copy.
2. Pair a distinctive display typeface with a readable monospace or sans-serif body font.
3. Enforce line lengths (max 65ch) and generous leading (1.5–1.7x) for optimal readability.`
  },
  {
    name: 'bento',
    aliases: ['layout', 'grid'],
    category: 'aesthetic',
    description: 'Reorganizes sections into asymmetric Bento grids and dynamic viewport flow',
    usage: '/bento [section]',
    prompt: `Restructure layout into Asymmetric Bento grid patterns for: $ARGUMENTS.
1. Break monotonous multi-card grids into varying column spans (e.g. 8-col hero card + 4-col stat stack).
2. Create intentional visual anchors with varying card weights, depths, and heights.
3. Guarantee zero horizontal overflow and seamless responsive mobile stacking.`
  },
  {
    name: 'de-slop',
    aliases: ['clarify', 'clean-copy'],
    category: 'aesthetic',
    description: 'Strips AI cliché copywriting and generic templates with grounded value propositions',
    usage: '/de-slop [section]',
    prompt: `Run PixelCrew De-Slop copy and design sanitization for: $ARGUMENTS.
1. Remove generic AI buzzwords ("Streamline your workflow", "Elevate innovation", "Seamless integration").
2. Replace vague claims with concrete, domain-grounded engineering metrics and authentic features.
3. Remove decorative gridlines, floating pill kickers, and synthetic template crutches.`
  },
  {
    name: 'bolder',
    aliases: ['punch', 'dramatic'],
    category: 'aesthetic',
    description: 'Amplifies visual energy with dramatic editorial contrast, bold typography, and punchy presence',
    usage: '/bolder',
    prompt: `Amplify visual energy:
1. Increase contrast ratio between surfaces and text.
2. Scale up display headlines and introduce bold geometric framing.
3. Tighten section groupings for high-impact visual presence and editorial confidence.`
  },
  {
    name: 'quieter',
    aliases: ['calm', 'minimal'],
    category: 'aesthetic',
    description: 'Restores clean minimalist balance, generous whitespace, and calm hierarchy',
    usage: '/quieter',
    prompt: `Apply minimalist calm to the layout:
1. Increase section padding and breathing whitespace.
2. Subdue secondary text and remove non-essential decorative elements.
3. Focus attention on core readable content and primary call to actions.`
  },

  // 3. 🛡️ Production Hardening & SRE
  {
    name: 'sentinel',
    aliases: ['harden', 'secure'],
    category: 'hardening',
    description: 'Security & resilience pass: OWASP checks, SQL injection prevention, RFC 7807 envelopes, rate limiting',
    usage: '/sentinel',
    prompt: `Execute PixelCrew Sentinel security audit:
1. Audit input validation, sanitize queries, and check authentication/authorization middleware.
2. Ensure RFC 7807 Problem Details error envelopes and rate limiting on API endpoints.
3. Verify CSP headers, CORS policies, secure cookies, and secret handling.`
  },
  {
    name: 'audit',
    aliases: ['sre-audit', 'verify'],
    category: 'hardening',
    description: 'SRE quality benchmark: a11y WCAG AA/AAA, Core Web Vitals, test suites',
    usage: '/audit',
    prompt: `Run PixelCrew technical quality audit:
1. Verify WCAG 2.1/2.2 AA/AAA accessibility (semantic HTML, focus rings, contrast).
2. Measure Core Web Vitals (LCP, CLS, INP) and layout shift risks.
3. Check test coverage, error boundaries, and production readiness.`
  },
  {
    name: 'warp',
    aliases: ['optimize', 'perf'],
    category: 'hardening',
    description: 'Full-stack performance tuning: streaming SSR, bundle minification, AST prompt caching (~72% savings)',
    usage: '/warp',
    prompt: `Apply PixelCrew Warp performance optimizations:
1. Optimize bundle size, lazy-load heavy dependencies, and configure streaming SSR.
2. Tune database queries, eliminate N+1 bottlenecks, and configure multi-tier caching.
3. Implement AST prompt pruning for ~72% token savings.`
  },
  {
    name: 'polish',
    aliases: ['ship-ready', 'finalize'],
    category: 'hardening',
    description: 'Final shipping readiness pass: design system token alignment, type checks, visual cleanup',
    usage: '/polish',
    prompt: `Perform PixelCrew shipping polish pass:
1. Verify strict adherence to design system tokens and fluid typography clamp() scales.
2. Resolve all TypeScript errors, lint warnings, and unhandled edge cases.
3. Ensure micro-interactions, hover states, and smooth transitions are pixel-perfect.`
  },
  {
    name: 'calibrate',
    aliases: ['adapt', 'responsive'],
    category: 'hardening',
    description: 'Optimizes responsive layouts from 360px mobile to 4K ultra-wide with fluid viewports',
    usage: '/calibrate [viewport]',
    prompt: `Calibrate layout responsiveness for: $ARGUMENTS.
1. Verify breakpoints: 360px (mobile), 768px (tablet), 1024px (desktop), 1440px+ (ultrawide).
2. Ensure touch targets >= 44px on mobile devices.
3. Prevent layout breaking, text clipping, and horizontal scrollbars.`
  },
  {
    name: 'onboard',
    aliases: ['first-run'],
    category: 'hardening',
    description: 'Synthesizes first-run onboarding flows, empty state illustrations, user activation pathways',
    usage: '/onboard',
    prompt: `Design and implement onboarding user experience:
1. Add guided first-run experience with interactive step progression.
2. Create informative empty states with clear calls to action.
3. Store onboarding state in local storage or session.`
  },

  // 4. 🏢 Floor 42 Operations
  {
    name: 'recap',
    aliases: ['summary', 'changelog', 'whatdone'],
    category: 'operations',
    description: 'Generates a token-optimized recap of recent git changes, commits, diff stats, and file operations',
    usage: '/recap [count]',
    prompt: `Execute a token-optimized session recap for the last $ARGUMENTS commits:
1. Analyze recent git commits, authors, and timestamps.
2. Calculate diff statistics (insertions, deletions, files modified).
3. Group and display files categorized by added (+), modified (~), deleted (-), and renamed (→).
4. Output a compact, high-density overview without redundant prose.`
  },
  {
    name: 'office',
    aliases: ['live', 'dashboard'],
    category: 'operations',
    description: 'Launches Floor 42 live startup office visual dashboard at http://localhost:4747',
    usage: '/office [--port 4747]',
    prompt: `Launch PixelCrew Floor 42 live startup office visual dashboard at http://localhost:4747 with real-time agent sprite animations, task streams, and live site preview.`
  },
  {
    name: 'roster',
    aliases: ['crew', 'agents'],
    category: 'operations',
    description: 'Inspects active agent squad roster, workstations, and telemetry state',
    usage: '/roster [list|spawn]',
    prompt: `Display PixelCrew active squad roster: Creative Director, UX Planner, Design System Architect, Frontend Engineer, Backend Engineer, Performance SRE, Security Sentinel, QA Automation.`
  },
  {
    name: 'status',
    aliases: ['progress', 'info'],
    category: 'operations',
    description: 'Displays orchestration progress, active sprint metrics, and swarm state',
    usage: '/status',
    prompt: `Inspect and report current PixelCrew swarm status, active task progress, and sprint metrics.`
  },
  {
    name: 'doctor',
    aliases: ['diagnose', 'check'],
    category: 'operations',
    description: 'Diagnoses local environment, toolchain verification, and coding agent provider runtimes',
    usage: '/doctor',
    prompt: `Run comprehensive environment diagnostics: check Node.js, Git, local CLI runtimes, and detected AI IDE providers.`
  },
  {
    name: 'sync',
    aliases: ['re-sync'],
    category: 'operations',
    description: 'Synchronizes workspace skills and slash commands across detected agent IDEs',
    usage: '/sync [--dry-run]',
    prompt: `Synchronize PixelCrew canonical skills, command palettes, and rules across all detected IDEs (.claude, .cursor, .kiro, .agents).`
  },
  {
    name: 'pixelcrew',
    aliases: ['commands', 'help'],
    category: 'operations',
    description: 'Floor 42 Master Multi-Agent Command Suite Dispatcher',
    usage: '/pixelcrew <command> [args]',
    prompt: `Floor 42 Master Command Dispatcher. Type /pixelcrew <command> or direct slash commands (e.g. /recap, /assemble, /blueprint, /render, /boss-fight, /sentinel, /audit, /warp, /polish) to orchestrate the 8-agent swarm.`
  }
];

/**
 * Finds command by exact name or alias
 */
export function findCommand(nameOrAlias = '') {
  const clean = nameOrAlias.replace(/^\//, '').toLowerCase();
  for (const cmd of FLOOR42_COMMANDS) {
    if (cmd.name === clean) return cmd;
    if (cmd.aliases && cmd.aliases.includes(clean)) return cmd;
  }
  return null;
}
