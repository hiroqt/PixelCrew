# Typography Architecture & Font Pairings

Typography constitutes over 80% of a modern web interface. Generic AI generators rely on unstyled sans-serif fonts or defaults that look indistinguishable from thousands of other landing pages.

---

## 1. Curated High-Character Font Pairings

| Aesthetic Style | Headline Font (Display) | Body Font (UI/Text) | Monospace / Metadata | Optimal Use Cases |
|---|---|---|---|---|
| **Editorial Studio** | *Instrument Serif* / *Cinzel* | *Plus Jakarta Sans* / *Inter* | *JetBrains Mono* | Architecture firms, design studios, luxury agencies |
| **Technical Lab** | *Space Grotesk* / *Syne* | *Inter* / *DM Sans* | *Fira Code* / *IBM Plex Mono* | Developer tools, AI infra, data platforms |
| **Modern Kinetic** | *Clash Display* / *Cabinet Grotesk* | *Satoshi* / *General Sans* | *Geist Mono* | Startups, creative technology, fintech |
| **Brutalist / Industrial** | *Bebas Neue* / *Oswald* | *Chivo* / *Archivo* | *Space Mono* | Streetwear, industrial hardware, experimental portfolios |
| **Warm Editorial** | *Playfair Display* / *Fraunces* | *Outfit* / *Lora* | *DM Mono* | Publishing, lifestyle, boutique agencies |

---

## 2. Fluid Modular Scale with CSS `clamp()`

Never hardcode static `px` values on major display titles. Always employ fluid typography:

```css
:root {
  /* Display / Hero */
  --font-display-hero: clamp(2.75rem, 6vw + 1rem, 6.5rem);
  --font-display-sub: clamp(1.75rem, 3.5vw + 0.5rem, 3.5rem);
  
  /* Section Headlines */
  --font-heading-lg: clamp(1.5rem, 2.5vw + 0.5rem, 2.5rem);
  --font-heading-md: clamp(1.25rem, 1.8vw + 0.25rem, 1.75rem);
  
  /* Body & Metadata */
  --font-body: clamp(0.95rem, 0.5vw + 0.8rem, 1.125rem);
  --font-meta: clamp(0.75rem, 0.2vw + 0.7rem, 0.875rem);
}
```

---

## 3. Typographic Hierarchy Guidelines

1. **Expressive Headline Weight**: Headlines must command visual attention with tight line-height (`leading-[0.95]` to `leading-[1.1]`) and negative tracking (`tracking-[-0.03em]` to `tracking-[-0.01em]`).
2. **Optimal Reading Measure**: Limit body text line length to `45ch` – `65ch` with comfortable line height (`leading-relaxed` or `1.65`).
3. **Tabular Numerals for Metrics**: Always apply `font-mono` or `font-feature-settings: 'tnum'` to data points, pricing, percentages, and counters.
