# Core Web Vitals & Frontend Performance Guide

## Overview
Front-end performance directly impacts user conversion, search rankings, and engagement. This guide provides actionable engineering patterns for achieving **all green Core Web Vitals (CWV)**.

---

## 1. Core Web Vitals Thresholds & Targets

| Metric | Full Name | Good Target | Needs Improvement | Poor | Primary Causes & Fixes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **LCP** | Largest Contentful Paint | **$\le 2.5\text{s}$** | $2.5\text{s} - 4.0\text{s}$ | $> 4.0\text{s}$ | Slow server TTFB, render-blocking CSS/JS, slow hero image loading. |
| **INP** | Interaction to Next Paint | **$\le 200\text{ms}$** | $200\text{ms} - 500\text{ms}$ | $> 500\text{ms}$ | Long tasks blocking main thread, expensive event handlers, heavy DOM reflows. |
| **CLS** | Cumulative Layout Shift | **$\le 0.1$** | $0.1 - 0.25$ | $> 0.25$ | Images/ads without dimensions, late font swapping (FOUT), injected banners. |
| **TTFB**| Time to First Byte | **$\le 800\text{ms}$** | $800\text{ms} - 1800\text{ms}$| $> 1800\text{ms}$ | Slow backend DB queries, cold serverless lambdas, missing edge cache. |

---

## 2. Largest Contentful Paint (LCP) Optimization

```html
<head>
  <link
    rel="preload"
    as="image"
    href="/images/hero-dashboard.webp"
    type="image/webp"
    fetchpriority="high"
  />
  <link rel="preconnect" href="https://assets.companycdn.com" crossorigin />
</head>

<body>
  <img
    src="/images/hero-dashboard.webp"
    alt="Platform Architecture Overview"
    width="1200"
    height="675"
    fetchpriority="high"
    loading="eager"
    decoding="async"
    class="hero-img"
  />
</body>
```

---

## 3. Interaction to Next Paint (INP) Optimization

```typescript
async function processLargeDataset(items: Array<DataItem>) {
  for (let i = 0; i < items.length; i++) {
    performHeavyCalculation(items[i]);

    if (i % 20 === 0) {
      if ('scheduler' in window && 'yield' in (window as any).scheduler) {
        await (window as any).scheduler.yield();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
  }
}
```
