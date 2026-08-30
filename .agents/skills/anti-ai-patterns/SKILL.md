---
name: anti-ai-patterns
description: Strict Anti-AI-Generated Design Critic and Quality Guardian for Pixel Crew. Automatically detects monotonous card grids, purple gradient blobs, fake AI sparkles, and cliché copywriting. Enforces intentional asymmetry, expressive typography, dynamic section rhythm, and bespoke brand language.
---

# Anti-AI-Generated Design Skill

The **Anti-AI-Patterns Skill** acts as an uncompromising aesthetic critic and quality guardian within the Pixel Crew framework. It does **not** write raw UI code—its sole objective is to inspect, score, and reject synthetic tropes before they reach the user.

---

## 1. Automated Detection Matrix

The skill executes static and visual pattern recognition to flag forbidden design markers:

```
❌ FORBIDDEN PATTERNS
├── ❌ Purple/blue radiant gradient blobs behind hero headline
├── ❌ Every feature enclosed in identical rounded cards with 16px radius
├── ❌ Overused glassmorphism, muddy backdrop-filter blurs on all surfaces
├── ❌ Generic hype copy ("Revolutionize your workflow", "Supercharge your business")
├── ❌ Floating AI sparkles (✨, 🪄) and generic emoji badges
├── ❌ Perfectly symmetrical 3-column or 4-column identical cards
├── ❌ Generic fake SaaS dashboard screenshots with pastel bar charts
├── ❌ Random meaningless icons at top of every single card
├── ❌ Identical cards repeated 6 times across the homepage
└── ❌ Generic "Get Started" / "Start Free Trial" CTA on every button
```

---

## 2. Enforced Design Principles

When a forbidden pattern is identified, the skill mandates immediate compliance with these principles:

```
✓ ENFORCED PRINCIPLES
├── ✓ Intentional asymmetry (offset columns, varied row spans, staggered layout)
├── ✓ Expressive typography hierarchy (dramatic scale contrast, fluid clamp scales)
├── ✓ Distinct section compositions (never stack two similar grid layouts)
├── ✓ Brand-specific visual language (bespoke color schemes, tailored borders)
├── ✓ Purposeful whitespace (generous breathing room, clear spatial gravity)
├── ✓ Custom micro-interactions (magnetic hover, subtle reveal transitions)
├── ✓ Realistic, authentic copy (concrete technical specifics, real narratives)
├── ✓ Visual rhythm (alternating dense technical specs and airy display breaks)
└── ✓ Restrained decoration (decorations <= 10% surface area)
```

---

## 3. Rubric Evaluation & Actionable Critique

The skill computes the quantitative visual score and generates structured critique:

```json
{
  "visualScore": 9.1,
  "threshold": 8.5,
  "passed": true,
  "rubric": {
    "originality": 9.1,
    "typography": 9.4,
    "layout": 8.8,
    "visual_hierarchy": 9.2,
    "brand_consistency": 9.0,
    "generic_ai_penalty": 0.8
  },
  "critique": [
    {
      "issue": "Testimonial section uses a repetitive 3-card layout.",
      "reason": "Three equal width cards with centered avatars look like a standard SaaS template.",
      "fix": "Replace cards with an editorial horizontal quote layout, large typography, and asymmetric metadata placement."
    }
  ]
}
```

---

## 4. Execution Workflow

1. **Inspect Layout Blueprint**: Review UX wireframe and component topology before code generation.
2. **Audit Rendered Output / DOM**: Scan generated JSX/HTML for repeated card patterns, generic color classes, and cliché phrasing.
3. **Trigger Refinement Task**: If `visualScore < 8.5` or critical anti-patterns exist, formulate a targeted refinement task for the Frontend Builder squad.
