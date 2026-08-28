# Modern Frontend Frameworks & Styling Guide

## Overview
Comprehensive reference for building web applications across modern frameworks (React 19/Next.js, Vue 3/Nuxt 3, Svelte 5, SolidJS, Astro) and modern Vanilla CSS architectures.

---

## 1. Modern Frameworks Architecture Comparison

| Framework | Reactivity Model | Server Rendering (SSR/RSC) | State Management | Recommended Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **React 19 / Next.js** | Virtual DOM / React Server Components (RSC) | App Router with streaming SSR, Server Actions, Suspense | Zustand, TanStack Query | Enterprise platforms, large developer ecosystems, complex data graphs |
| **Vue 3 / Nuxt 3** | Proxy-based Fine-grained Reactivity | Nitro Engine, Server routes, Universal SSR | Pinia | Fast productivity, progressive enhancement, elegant template syntax |
| **Svelte 5 / SvelteKit** | Runes (`$state`, `$derived`, `$effect`) | SvelteKit Universal & Server load, Form Actions | Svelte Stores / Runes | Maximum runtime performance, zero boilerplate, lightweight bundles |
| **SolidJS / SolidStart** | Fine-grained reactive signals (No Virtual DOM) | SolidStart streaming SSR | Solid Store, Signals | Real-time dashboards, WebGL/Canvas heavy apps, high-frequency updates |
| **Astro 4+** | Islands Architecture (Multi-framework client hydration) | Static site generation (SSG) + Server-Side Islands | Nanostores | Content-driven sites, marketing, docs, portals with isolated interactive islands |

---

## 2. Modern Vanilla CSS Architecture

### CSS `@layer` & Cascade Control
Prevent specificity wars using standard `@layer`:

```css
@layer theme, reset, base, layout, components, utilities;

@layer reset {
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }
}

@layer components {
  /* Container Queries for responsive components without viewport coupling */
  .card-container {
    container-type: inline-size;
    container-name: card-wrapper;
  }

  .responsive-card {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1.5rem;
    background: var(--surface-raised);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
  }

  @container card-wrapper (min-width: 480px) {
    .responsive-card {
      grid-template-columns: 180px 1fr;
      align-items: center;
    }
  }

  /* Modern :has() relational selector */
  .form-group:has(:invalid:not(:placeholder-shown)) {
    --border-default: var(--accent-danger);
  }
}
```
