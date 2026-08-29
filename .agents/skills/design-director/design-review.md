# Design Review & Critique Procedures

This document defines the review protocol used by the **Creative Director** and **Visual Critic** to evaluate generated page designs before final approval.

---

## 1. The 6-Dimension Visual Score Rubric

Every candidate website layout is scored across six distinct dimensions:

$$\text{Final Score} = \frac{\text{Originality} + \text{Typography} + \text{Layout} + \text{Visual Hierarchy} + \text{Brand Consistency} + (10 - \text{AI Slop Penalty})}{6}$$

| Dimension | Weight | Scoring Criteria | Target Score |
|---|---|---|---|
| **Originality** | 20% | Uniqueness of composition, absence of template clichés, memorable visual identity. | $\ge 8.5$ |
| **Typography** | 20% | Font pairing character, contrast, fluid clamp scales, line measure discipline. | $\ge 8.8$ |
| **Layout & Rhythm** | 20% | Intentional asymmetry, alternating section cadence, purposeful whitespace. | $\ge 8.5$ |
| **Visual Hierarchy** | 15% | Instant focal point clarity, scannability, clear primary actions. | $\ge 9.0$ |
| **Brand Consistency** | 15% | Unified palette, coherent border/surface language, authentic voice. | $\ge 9.0$ |
| **Generic AI Penalty** | 10% | Penalty deductions for purple gradients, repetitive cards, or fake badges. | $\le 1.0$ (low is good) |

**Approval Threshold**: $\text{Final Score} \ge 8.5 / 10.0$. Any score below triggers the automated **Refinement Loop**.

---

## 2. Actionable Critique Format (Issue - Reason - Fix)

When an issue is identified, the critic must NOT provide vague feedback (e.g. *"Make it look better"*). The critic must output structured, actionable triplets:

```markdown
### Visual Issue Identified

- **Issue:** The features section uses a monotonous 3-column card grid.
- **Reason:** Identical card heights, repeated center-aligned icons, and equal horizontal spacing look like a standard SaaS AI template.
- **Fix:** Convert to an asymmetric 4-cell Bento grid where the primary feature spans 2 columns and 2 rows with an interactive preview, while the remaining three features occupy compact horizontal metadata tiles.
```

---

## 3. Pre-Approval Inspection Checklist

- [ ] **Contrast Check**: Background-to-text contrast meets WCAG 2.1 AA (4.5:1 for body, 3:1 for headers).
- [ ] **Responsive Integrity**: Mobile view collapses gracefully with no horizontal overflow or clipped text.
- [ ] **Interactive States**: Buttons, links, and cards feature distinct hover/focus/active transitions.
- [ ] **Authentic Content**: Zero placeholder lorem ipsum, realistic domain-relevant copy and real data points.
