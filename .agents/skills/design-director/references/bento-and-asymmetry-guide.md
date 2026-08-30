# Bento Grid Topology & Asymmetric Layout Guide

## 1. Bento Grid Architectural Blueprint
Bento grids organize complex product capabilities into harmonious, modular compartments with varying visual weight.

```
┌──────────────────────────────────────────────┬───────────────────────────┐
│ Feature Alpha (Primary Focal Component)      │ Secondary Metric Widget   │
│ - col-span-8 / row-span-2                    │ - col-span-4 / row-span-1 │
│ - Interactive live preview or large metric   ├───────────────────────────┤
│                                              │ Micro-Status Badge / Tag  │
│                                              │ - col-span-4 / row-span-1 │
├───────────────────────────┬──────────────────┴───────────────────────────┤
│ Technical Spec Card       │ Interactive Terminal Console                 │
│ - col-span-4 / row-span-1 │ - col-span-8 / row-span-1                    │
└───────────────────────────┴──────────────────────────────────────────────┘
```

---

## 2. Dynamic Section Rhythm Rules

1. **Never Stack Identical Grids**: If Section 1 uses a 2-column split (Hero + Visual), Section 2 must alternate to an asymmetric Bento layout or full-width technical specification ledger.
2. **Visual Gravity & Breathing Room**: Maintain generous vertical gutters (`gap-6` or `gap-8`) and section padding (`py-24` or `py-32` / `clamp(4rem, 8vw, 8rem)`).
3. **Zero Horizontal Scroll Truncation**: All grid items must gracefully collapse to single-column or 2-column layouts on mobile viewports (`grid-cols-1 md:grid-cols-12`).
