# Typography Matrix & HSL Chromatic Palette System

## 1. Mathematical Fluid Typography Scales
Use CSS `clamp()` formulas to seamlessly scale typography between mobile (320px) and desktop (1440px) without jagged media query jumps:

```css
:root {
  /* Fluid Typography Scale */
  --font-display-hero: clamp(2.5rem, 1.8rem + 3.5vw, 5.5rem); /* 40px -> 88px */
  --font-h1:           clamp(2.0rem, 1.5rem + 2.5vw, 3.75rem); /* 32px -> 60px */
  --font-h2:           clamp(1.5rem, 1.2rem + 1.5vw, 2.5rem);  /* 24px -> 40px */
  --font-h3:           clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem);/* 20px -> 28px */
  --font-body:         clamp(0.9375rem, 0.9rem + 0.2vw, 1.0625rem); /* 15px -> 17px */
  --font-caption:      clamp(0.75rem, 0.72rem + 0.15vw, 0.8125rem); /* 12px -> 13px */
  
  --line-height-display: 1.05;
  --line-height-heading: 1.15;
  --line-height-body:    1.65;
}
```

---

## 2. Character-Rich Font Pairings by Domain

1. **Editorial & High-Craft Studio**: *Instrument Serif* (Display) + *Plus Jakarta Sans* (Body) + *JetBrains Mono* (Code/Metrics)
2. **Modern Brutalist / Technical Lab**: *Syne* or *Space Grotesk* (Display) + *Geist* / *Inter* (Body) + *Fira Code* (Mono)
3. **Luxury / Contemporary Fashion**: *Playfair Display* / *Bodoni Moda* (Display) + *Satoshi* / *General Sans* (Body)
4. **Developer Infrastructure & SaaS**: *Cabinet Grotesk* (Headings) + *Plus Jakarta Sans* (Body) + *JetBrains Mono* (Telemetry)

---

## 3. The 60-30-10 HSL Chromatic Rule
- **60% Dominant Base**: Deep Obsidian/Slate (`hsl(220, 15%, 7%)` or `#090a0c`).
- **30% Structural Elevation Surfaces**: Architectural Stone / Midnight Glass (`hsl(220, 12%, 14%)`, borders `hsl(220, 10%, 22%)`).
- **10% High-Contrast Brand Accent**: Electric Emerald (`hsl(154, 80%, 45%)`), Solar Amber (`hsl(38, 92%, 50%)`), or Cobalt Indigo (`hsl(228, 85%, 60%)`). Never exceed 10% surface area with saturated accents.
