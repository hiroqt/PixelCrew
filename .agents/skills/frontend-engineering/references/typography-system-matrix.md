# Dynamic Typography System & Font Matrix

## Overview
Typography defines over 80% of any user interface. Instead of defaulting to browser defaults or arbitrary fonts, font selection must be intentional and driven by the product domain and user/brand archetype.

---

## 1. Typography Archetype & Font Pairing Matrix

Select font pairings based on product identity:

| Product Archetype / Tone | Primary Body Font | Display / Heading Font | Monospace / Data Font | Best Use Cases |
| :--- | :--- | :--- | :--- | :--- |
| **Tech Modern / SaaS** | **Inter** or **Plus Jakarta Sans** | **Outfit** or **Plus Jakarta Sans** | **Geist Mono** / **JetBrains Mono** | Cloud platforms, B2B SaaS, Developer tools, Dashboards |
| **Neutral Enterprise / Swiss** | **Geist Sans** or **Satoshi** | **General Sans** or **Geist Sans** | **Geist Mono** | Fintech, Enterprise operations, Analytics, CRM |
| **Humanist & Approachable** | **Work Sans** or **Source Sans 3** | **Fira Sans** or **Nunito** | **Fira Code** | Education, Health & Wellness, Community, Non-profit |
| **High-End Prestige & Editorial** | **Newsreader** or **Lora** | **Fraunces** or **Playfair Display** | **IBM Plex Mono** | Publishing, Luxury commerce, Legal, Long-form essays |
| **Technical / Systems Engineering** | **JetBrains Mono** / **Geist Mono** | **Space Grotesk** / **Geist Mono** | **Berkeley Mono** / **Fira Code** | Terminal UIs, Observability, Telemetry, Cyber Security |

---

## 2. Mathematical Modular Scales & Fluid Typography

### Modular Scale Ratios
- **Minor Third (1.200)**: Ideal for dense, data-heavy dashboards and mobile applications.
- **Major Third (1.250)**: Universal standard for web applications and blogs.
- **Perfect Fourth (1.333)**: High-impact marketing pages and editorial layouts.

### Fluid Font Size Formula (`clamp()`)
To ensure smooth scaling between mobile viewport ($375\text{px}$) and desktop viewport ($1280\text{px}$) without abrupt media query jumps:

$$\text{fluid}(min, max) = \text{clamp}(min, \text{slope} \cdot 100vw + \text{y-intercept}, max)$$

```css
:root {
  /* Fluid Typographic Scale Tokens */
  --font-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.8125rem);      /* 12px -> 13px */
  --font-sm: clamp(0.875rem, 0.825rem + 0.25vw, 0.9375rem);   /* 14px -> 15px */
  --font-base: clamp(1rem, 0.95rem + 0.25vw, 1.0625rem);       /* 16px -> 17px */
  --font-lg: clamp(1.125rem, 1.05rem + 0.38vw, 1.25rem);      /* 18px -> 20px */
  --font-xl: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);         /* 20px -> 24px */
  --font-2xl: clamp(1.5rem, 1.35rem + 0.75vw, 1.875rem);      /* 24px -> 30px */
  --font-3xl: clamp(1.875rem, 1.65rem + 1.13vw, 2.375rem);    /* 30px -> 38px */
  --font-4xl: clamp(2.25rem, 1.95rem + 1.5vw, 3rem);          /* 36px -> 48px */
  --font-5xl: clamp(2.75rem, 2.3rem + 2.25vw, 4rem);          /* 44px -> 64px */

  /* Line Height Tokens */
  --lh-tight: 1.12;   /* Headings 4xl - 5xl */
  --lh-snug: 1.25;    /* Headings 2xl - 3xl */
  --lh-normal: 1.5;   /* UI elements, inputs, buttons */
  --lh-relaxed: 1.65; /* Long-form body paragraphs */

  /* Letter Spacing Tokens */
  --tracking-tighter: -0.035em; /* Large display titles */
  --tracking-tight: -0.015em;   /* Section headings */
  --tracking-normal: 0em;       /* Body copy */
  --tracking-wide: 0.05em;      /* Uppercase labels, badges */
}
```

---

## 3. Typographic Best Practices & Engineering Rules

### Rule 1: Measure (Line Length)
- Keep body paragraph widths constrained between **45 and 75 characters** (`max-width: 65ch;`).
- Exceeding 80 characters creates reader fatigue; under 40 characters causes excessive eye jumping.

### Rule 2: Tabular Numbers in Tables and Metrics
Always enable `font-variant-numeric: tabular-nums` (or `font-feature-settings: "tnum"`) for numbers, prices, counters, clocks, and data grid cells so that numbers align in columns without jittering when values update.

### Rule 3: Optical Sizing & Variable Font Tuning
When using modern variable fonts (e.g. Inter Variable, Fraunces, Geist), enable optical sizing and configure weight axes properly:
```css
html {
  font-optical-sizing: auto;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}
```
