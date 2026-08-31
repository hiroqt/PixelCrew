---
name: design-director
description: Lead Creative Direction and Aesthetic Strategy skill for Pixel Crew. Defines the authentic visual personality, architectural concept, typography strategy, asymmetric layout rules, and strict anti-AI constraints before any code is generated. Answers "What should this website actually feel like?"
---

# 🎨 Design Director & Aesthetic Strategy Skill

The **Design Director** is the creative soul of Pixel Crew. Its primary directive is to **strictly decouple visual and architectural strategy from code generation** and eliminate generic "AI Slop".

---

## 1. The 4 Authentic Visual Archetypes (Choose 1 for Every Project)

Every project synthesized by Pixel Crew must commit to one explicit visual archetype rather than defaulting to generic "cyberpunk cyan on black":

### 🏛️ Archetype 1: Swiss International Technical (Precision & System Architecture)
- **Vibe**: Clean, authoritative, dense, engineered, highly readable.
- **Typography**: Neo-Grotesque Display (*Space Grotesk* or *Plus Jakarta Sans*) + *JetBrains Mono* for tabular specs.
- **Color Palette**: Deep Zinc Base (`#090A0D`), Subtle Border Grid (`rgba(255,255,255,0.08)`), High-Contrast White, Signal Cobalt or Amber accents ($\le 8\%$).
- **Hero Topology**: Large asymmetric editorial typography with live interactive system pipeline diagram or interactive terminal.

### 📰 Archetype 2: Editorial High-Contrast (Executive & Thought Leadership)
- **Vibe**: Sophisticated, bespoke, editorial, timeless, premium.
- **Typography**: High-Contrast Display Serif (*Instrument Serif*, *Playfair Display*, or *Fraunces*) + Crisp Geometric Sans (*Inter* / *DM Sans*).
- **Color Palette**: Warm Obsidian (`#0A0A0B`) or Warm Alabaster (`#FBFBFA`), Stone/Oatmeal elevated surfaces, crisp ink borders.
- **Hero Topology**: Massive headline with inline typography shifts (e.g. italicized key phrases), structured milestone timeline ribbon, and full-bleed case study showcase.

### ⚡ Archetype 3: Kinetic Command Center (Developer Platform & High-Throughput SaaS)
- **Vibe**: High-octane, observable, data-dense, dark mode telemetry.
- **Typography**: Monospace Primary (*JetBrains Mono* or *Fira Code*) + Technical Sans.
- **Color Palette**: Pitch Black (`#050507`), Muted Slate Surfaces (`#101216`), Emerald (`#10B981`) and Amber (`#F59E0B`) telemetry LEDs.
- **Hero Topology**: Live interactive ASCII / Canvas architecture visualizer on left, live telemetry event stream on right.

### 🌿 Archetype 4: Warm Organic Studio (Design Studio & Consumer Product)
- **Vibe**: Tactile, human, warm, crafted, approachable.
- **Typography**: Humanist Sans (*Outfit* or *Cabinet Grotesk*) + Editorial Accents.
- **Color Palette**: Charcoal & Terracotta / Ochre, soft paper backgrounds, warm gradient illumination.
- **Hero Topology**: Asymmetric Bento grid with organic radius variations, tactile interactive previews, and rich narrative copy.

---

## 2. Strict Layout & Composition Rules

1. **🚫 Absolute Ban on 4-Box Metric Strips**:
   - Never place a row of 3 or 4 identical metric cards across the bottom of a hero or section.
   - Embed metrics directly into case study cards, sticky sidebar telemetry rails, or interactive timeline milestones.

2. **🚫 Absolute Ban on Hashtag Pill Clouds**:
   - Never dump a list of tech tags as rounded pills (`#React #Nextjs #Tailwind #Groq`).
   - Group tech stacks into clear architectural layers: *01. GenAI & Triage*, *02. Full-Stack Systems*, *03. Cloud & Security*.

3. **🚫 Absolute Ban on Nested "Card-in-Card" Containers**:
   - Never put a rounded dark card inside another rounded dark card with glowing borders.
   - Use clean 1px divider lines, subtle surface tier shifts (`#0D0F12` $\to$ `#14171E`), or tabular layouts.

4. **✅ Mandatory Asymmetric Bento Grid Flow**:
   - Use dynamic column spans (e.g. `col-span-8` + `col-span-4`, or `col-span-7` + `col-span-5`).
   - Alternate visual density: High-density technical specs next to an airy typographic case study.

---

## 3. Creative Direction Blueprint (Output Before Writing Code)

Before writing any frontend code, the AI agent must formulate the creative strategy:

```json
{
  "selected_archetype": "Swiss International Technical",
  "mood_and_tone": "Authoritative, engineered, high-throughput, architectural",
  "typography": {
    "display": "Space Grotesk (clamp(2.5rem, 5vw, 4.5rem))",
    "body": "Inter (text-sm, text-zinc-400)",
    "metadata": "JetBrains Mono (text-xs tracking-wider uppercase)"
  },
  "palette": {
    "background": "#090A0D",
    "surface": "#101218",
    "border": "rgba(255, 255, 255, 0.08)",
    "accent_primary": "#F59E0B",
    "accent_secondary": "#10B981"
  },
  "layout_rhythm": "Asymmetric Bento hero (8-col flagship case study + 4-col live capabilities matrix)",
  "banned_tropes_checked": [
    "No 4-card metric strip",
    "No hashtag pill clouds",
    "No card-in-card syndrome",
    "No cyan-on-black monoculture",
    "No generic 'Available for work' cliché pills"
  ]
}
```
