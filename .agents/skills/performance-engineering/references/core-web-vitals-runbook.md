# Core Web Vitals (CWV) & Frontend Performance Runbook

## 1. The Core Metrics & Targets

| Metric | Full Name | Good (Green) Target | Pixel Crew Target | Optimization Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **LCP** | Largest Contentful Paint | $\le 2.5\text{s}$ | **$\le 0.8\text{s}$** | Preload hero image with `fetchpriority="high"`, stream HTML with React 19 / RSC, eliminate render-blocking CSS/JS. |
| **INP** | Interaction to Next Paint | $\le 200\text{ms}$ | **$\le 50\text{ms}$** | Break long tasks (>50ms) using `scheduler.yield()`, debounce high-frequency state updates, avoid synchronous layout thrashing. |
| **CLS** | Cumulative Layout Shift | $\le 0.1$ | **$0.00$** | Set explicit `width`/`height` or CSS `aspect-ratio` on all media/ads, avoid inserting dynamic DOM above existing viewport content. |
| **TTFB** | Time to First Byte | $\le 800\text{ms}$ | **$\le 150\text{ms}$** | Edge CDN caching (Cloudflare, Vercel Edge), localized SSR regions, Redis query cache. |

---

## 2. Code Optimization Patterns

### LCP Hero Preloading
```html
<link rel="preload" fetchpriority="high" as="image" href="/assets/hero.webp" type="image/webp">
```

### INP Main Thread Yielding
```typescript
async function processLargeDataset(items: DataItem[]) {
  for (let i = 0; i < items.length; i++) {
    processItem(items[i]);
    if (i % 100 === 0 && 'scheduler' in window && 'yield' in (window as any).scheduler) {
      await (window as any).scheduler.yield();
    }
  }
}
```
