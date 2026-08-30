# Anti-AI Design Rubric & Quantitative Scoring

## 1. The 6-Dimension Visual Scoring Matrix

Every generated interface or layout must achieve a minimum composite score of **8.5 / 10.0**.

| Dimension | Weight | Target Standard | Slop Penalty Deductions |
| :--- | :--- | :--- | :--- |
| **1. Originality & Authenticity** | 25% | Bespoke layout, unique focal point, brand narrative | -2.0 for standard SaaS template layout |
| **2. Typography & Hierarchy** | 20% | Mathematical fluid clamp scales, distinct pairings | -1.5 for unstyled browser defaults / plain Inter |
| **3. Layout & Spatial Composition** | 20% | Intentional asymmetry, varied grid spans, Bento rhythm | -2.5 for identical 3-column or 4-column card rows |
| **4. Color & Chromatic Depth** | 15% | Tailored HSL tokens, 60-30-10 rule, dark elevation | -2.0 for purple/blue glow mesh blobs behind hero |
| **5. Copywriting Grounding** | 10% | Concrete metrics, technical precision, authentic tone | -2.0 for generic hype ("Revolutionize your workflow") |
| **6. Restrained Decoration** | 10% | Purposeful micro-interactions, decorative surface $\le 10\%$ | -1.5 for AI sparkles (✨, 🪄) and fake SaaS charts |

---

## 2. Quantitative Evaluation Output Schema

```json
{
  "visualScore": 9.2,
  "threshold": 8.5,
  "passed": true,
  "rubric": {
    "originality": 9.0,
    "typography": 9.5,
    "layout": 9.0,
    "color_harmony": 9.4,
    "copywriting": 9.0,
    "decoration_restraint": 9.5,
    "slop_penalty": 0.0
  },
  "critique": [
    {
      "dimension": "layout",
      "issue": "Zero forbidden repetitive card patterns detected.",
      "action": "Proceed with implementation."
    }
  ]
}
```
