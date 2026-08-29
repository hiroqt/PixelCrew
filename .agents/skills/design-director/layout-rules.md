# Layout Strategy & Asymmetry Rules

A world-class website feels alive because of **visual rhythm, spatial tension, and intentional composition**. AI generators fail by stacking identical full-width containers with centered text.

---

## 1. Core Layout Archetypes

### Archetype A: The Editorial Asymmetric Grid
- **Hero**: Massive headline anchored left with offset subtitle (`col-span-8` / `col-span-4`), floating metric pill or live terminal component in the remaining negative space.
- **Showcase**: 60/40 split with an oversized interactive preview on one side and a detailed architectural narrative with numbered milestones on the other.
- **Cadence**: Full-width break band followed by an asymmetric 2-column deep dive.

### Archetype B: The Kinetic Studio / Portfolio
- **Hero**: Heavy typography declaration across 2 lines, minimal top navigation, live status ticker at bottom edge.
- **Project Index**: Staggered cards with variable heights (masonry or editorial alternating alignment: left-aligned 70% width, followed by right-aligned 50% width).
- **About/Manifesto**: Oversized quote text (`clamp(2rem, 5vw, 4rem)`) with subtle highlight hover states.

### Archetype C: The Technical Lab / Developer Tool
- **Hero**: Clean split with prominent command prompt / interactive code sandbox next to value proposition.
- **Specifications Table**: Dense, high-information-density monospace data grid with clean 1px hairline borders (`border-neutral-800`).
- **Feature Matrix**: Asymmetric Bento grid featuring 1 large anchor feature card (`col-span-2 row-span-2`) and 3 contextual mini-cards.

---

## 2. Visual Rhythm & Section Variation

Never allow two consecutive sections to share the same structural layout:

```
[ Section 1: Asymmetric Hero with Large Typographic Anchor ]
                           ↓
[ Section 2: Full-Bleed High-Contrast Ticker / Manifesto Strip ]
                           ↓
[ Section 3: Asymmetric Bento Grid (1 Primary + 3 Sub-features) ]
                           ↓
[ Section 4: Deep-Dive Split Showcase (Sticky Specs + Scrolling Preview) ]
                           ↓
[ Section 5: Minimalist Editorial Quote / Testimonial ]
                           ↓
[ Section 6: Action-Oriented Minimalist CTA & Multi-Column Footer ]
```

---

## 3. Spacing & Whitespace Rules

1. **Section Padding**: Minimum `py-24 md:py-32` on major sections to create breathing room.
2. **Container Constraints**: Maximum `max-w-7xl` or `max-w-6xl` with `px-6 md:px-12` padding.
3. **Element Proximity**: Group related elements tightly (`gap-2` to `gap-4`) and isolate disparate groups with generous margins (`mb-12` to `mb-20`).
