# Modern QA Testing Strategy & Test Maintainability Guide

## 1. The Practical Testing Pyramid

```
        ▲
       / \      E2E User Journeys (Playwright / Cypress)
      /───\     - Critical business flows: Auth, Checkout, Billing
     /     \    Component / Integration Tests (React Testing Library / MSW)
    /───────\   - Form validation, state mutations, accessibility checks
   /         \  Unit Tests (Vitest / Jest / Node.js Test Runner)
  /───────────\ - Pure utility functions, state reducers, domain business rules
```

---

## 2. Writing Resilient, Non-Flaky Tests

1. **Query by Accessibility Role First**:
   - `screen.getByRole('button', { name: /save changes/i })`
   - Never query by brittle CSS classes (`.btn-primary-2`) or dynamic test IDs unless strictly necessary.
2. **Mock at the Network Boundary with MSW**:
   - Mock HTTP requests using **Mock Service Worker (MSW)** rather than mocking internal fetch libraries, ensuring network contracts are tested faithfully.
3. **Automated Accessibility Testing with axe-core**:
   - Run `@axe-core/playwright` on all critical pages to ensure zero WCAG AA violations.
