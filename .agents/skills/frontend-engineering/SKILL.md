---
name: frontend-engineering
description: Comprehensive guide for modern front-end engineering across all major modern tech stacks (React 19/Next.js App Router, Vue 3/Nuxt 3, Svelte 5 Runes, SolidJS, Astro, Modern Vanilla CSS, TypeScript). Enforces strict UI/UX standards, anti-AI-slop design rules, dynamic typography systems, and WCAG 2.1/2.2 AA/AAA accessibility compliance.
---

# Frontend Engineering & UI/UX Standards

This skill provides comprehensive instructions, architectural patterns, and strict quality guidelines for building modern, accessible, high-performance web applications across all major front-end tech stacks.

---

## 1. Core Engineering Directives

1. **Zero AI Slop**: Reject generic AI-generated aesthetic tropes (purple/cyan neon glow mesh gradients on black cards, floating pill eyebrow badges on every header, nested card-in-a-card syndrome, fake neon input glow rings). Design with intentional typography, crisp borders, purposeful hierarchy, authentic whitespace, and structured design tokens.
2. **Dynamic User/Brand-Driven Typography**: Select font pairings and modular scales tailored directly to the application domain and user aesthetic preference (Geometric, Humanist, Editorial Serif, Neo-Grotesque, or Developer Mono). Utilize mathematical fluid type scales with CSS `clamp()`, optimal line measures (`45–75ch`), and tabular numerals for data dashboards.
3. **WCAG 2.1 / 2.2 AA & AAA Compliance**: Semantic HTML first, rigorous contrast ratios (4.5:1 text, 3:1 graphical elements/focus rings, 7:1 AAA where applicable), robust keyboard navigation (`:focus-visible`, focus trapping in modals/drawers, roving tabindex), full screen reader accessibility (`aria-expanded`, `aria-controls`, `aria-live`, `aria-hidden`), and `@media (prefers-reduced-motion: reduce)`.
4. **Modern Framework & Styling Mastery**:
   - **React 19 / Next.js**: App Router, Server Components (RSC) vs Client Components boundary, Server Actions, Suspense & Streaming SSR.
   - **Vue 3 / Nuxt 3**: Composition API (`<script setup>`), Pinia state management, Nitro server engine.
   - **Svelte 5 / SvelteKit**: Runes (`$state`, `$derived`, `$effect`, `$props`), Universal load, Form actions.
   - **SolidJS / SolidStart**: Fine-grained signals, Resource, Suspense.
   - **Astro 4+**: Islands Architecture, Content Collections, View Transitions.
   - **Styling**: Modern Vanilla CSS (`@layer`, Container Queries `@container`, `:has()`, Subgrid, CSS variables design token architecture, Nesting).

---

## 2. Quick Navigation & Reference Modules

- [Anti-AI Slop & UI/UX Aesthetic Rules](./references/anti-ai-slop-guidelines.md)
- [Dynamic Typography System & Font Matrix](./references/typography-system-matrix.md)
- [WCAG 2.1 / 2.2 Accessibility Audit Checklist](./references/wcag-a11y-audit-checklist.md)
- [Frameworks, Styling & Component Architecture Guide](./references/frameworks-and-styling-guide.md)
