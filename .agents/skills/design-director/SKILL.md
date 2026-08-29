---
name: design-director
description: >-
  Lead Creative Direction and Aesthetic Strategy skill for Pixel Crew. Defines the authentic
  visual personality, architectural concept, typography strategy, asymmetric layout rules,
  and strict anti-AI constraints before any code is generated. Answers: "What should this website actually feel like?"
---

# Design Director Skill

The **Design Director** is the creative soul of Pixel Crew. Its primary directive is to **strictly decouple visual and architectural strategy from code generation**.

AI website generators frequently produce bland, generic "AI slop" when prompts jump directly into coding. The Design Director enforces a deliberate creative phase where artistic intent, mood, typography, layout rhythm, and negative constraints are codified into an executable design specification.

---

## 1. Creative Direction Blueprint

When presented with any user prompt or client brief, the Design Director outputs a structured creative direction manifest:

```json
{
  "design_direction": "editorial technology studio",
  "concept": "Precise, quiet, architectural, spatial",
  "visual_personality": [
    "confident",
    "minimal",
    "technical",
    "asymmetric"
  ],
  "layout_strategy": "asymmetric grid with intentional whitespace & varying density",
  "typography_strategy": "expressive display serif paired with crisp mono/sans micro-labels",
  "color_strategy": "deep obsidian base with warm architectural stone accents and high-contrast ink",
  "animation_strategy": "subtle purposeful motion, smooth reveals, zero bouncy gimmicks",
  "avoid": [
    "generic SaaS cards with uniform border-radius",
    "purple and blue glowing mesh gradients",
    "excessive glassmorphism and frosted blur overlays",
    "uniform 3-column feature grids",
    "hero with floating fake dashboard screenshot",
    "floating AI sparkles and generic rocket/sparkle icons",
    "cliché copy like 'Revolutionize your workflow'"
  ]
}
```

---

## 2. Core Creative Responsibilities

1. **Define the Soul and Feeling**:
   - What atmosphere does this brand inhabit? (e.g., Swiss brutalism, luxury editorial, utilitarian engineering lab, warm organic artisan).
2. **Establish Asymmetric & Dynamic Rhythms**:
   - Avoid monotonous block-after-block repetition. Alternating rhythm between expansive airy sections, dense data grids, kinetic split-screens, and typography focal points.
3. **Select Character-Rich Typography**:
   - Ban default generic fonts (`Inter`, browser system fonts used without intent).
   - Require purposeful pairings (e.g., *Instrument Serif* + *Plus Jakarta Sans*, *Syne* + *JetBrains Mono*, *Playfair Display* + *Space Grotesk*).
4. **Curate Harmonious Chromatic Palettes**:
   - Ban generic saturated primaries and purple/cyan AI gradients.
   - Formulate tailored HSL/Hex palettes with authentic tonal depth, high-contrast text ratios (WCAG AAA), and restrained accent usage ($\le 10\%$ surface area).
5. **Enforce Negative Space & Restraint**:
   - Whitespace is not empty space; it is spatial gravity. Ensure generous margins and deliberate pauses between high-density content.

---

## 3. Skill Sub-Modules & References

- [Anti-AI Pattern Guide](./anti-ai-patterns.md) — Exhaustive catalog of forbidden AI tropes and intentional replacements.
- [Layout Strategy & Asymmetry Rules](./layout-rules.md) — Grid systems, split layouts, editorial compositions, and visual rhythm.
- [Typography Architecture & Font Pairings](./typography-rules.md) — Display fonts, body pairings, fluid type scales (`clamp`), and hierarchy.
- [Design Review & Critique Procedures](./design-review.md) — Visual tension checklist, contrast audit, and creative director scoring.
