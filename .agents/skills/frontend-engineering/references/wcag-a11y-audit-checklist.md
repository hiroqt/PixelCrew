# WCAG 2.1 & 2.2 Accessibility (a11y) Audit Checklist

## Overview
Web accessibility is a fundamental engineering requirement. This checklist details criteria for achieving **WCAG 2.1 & 2.2 Level AA compliance** (with selective AAA enhancements).

---

## 1. Core WCAG Criteria Quick Reference

| WCAG Guideline | Requirement Level | Minimum Standard | Code Implementation |
| :--- | :--- | :--- | :--- |
| **1.4.3 Contrast (Minimum)** | AA | **4.5:1** for regular text (< 18pt/24px or < 14pt/19px bold); **3:1** for large text. | Test against background using APCA or WCAG formula. |
| **1.4.11 Non-text Contrast** | AA | **3:1** for UI components, focus rings, and graphical objects. | Ensure button borders, radio buttons, and `:focus-visible` outlines meet 3:1. |
| **1.4.6 Contrast (Enhanced)** | AAA | **7:1** for regular text; **4.5:1** for large text. | Enforce in high-contrast mode or enterprise documentation. |
| **2.1.1 Keyboard Accessible** | AA | All functionality operable via keyboard without exception. | Never trap focus unintentionally; support `Tab`, `Shift+Tab`, `Enter`, `Space`, and Arrow keys. |
| **2.4.7 Focus Visible** | AA | Any keyboard-operable interface has a visible focus indicator. | Custom `:focus-visible` ring with `outline: 2px solid var(--accent); outline-offset: 2px;`. |
| **2.5.8 Target Size (Minimum)** | AA (WCAG 2.2) | Minimum **24x24 CSS pixels**; recommended **44x44 CSS pixels**. | Set `min-height: 44px; min-width: 44px;` on all mobile interactive elements. |
| **2.2.2 Pause, Stop, Hide** | A | Any moving, blinking, or auto-updating content must have pause/stop controls. | Provide pause toggle on carousels, ticker streams, and background animations. |
| **2.3.3 Animation from Interactions**| AAA | Motion triggered by interaction can be disabled. | Wrap all CSS transitions in `@media (prefers-reduced-motion: reduce)`. |

---

## 2. Accessible Component Patterns

### A. Semantic Modal Dialog with Focus Trap & ESC Listener
Using native HTML5 `<dialog>` element automatically handles `aria-modal="true"`, focus trapping, and ESC dismissal natively:

```html
<!-- Native HTML5 Accessible Modal Dialog -->
<button id="open-modal-btn" type="button" class="btn btn-primary" aria-haspopup="dialog">
  Manage API Keys
</button>

<dialog id="api-key-dialog" class="modal-dialog" aria-labelledby="dialog-title" aria-describedby="dialog-desc">
  <div class="dialog-content">
    <header class="dialog-header">
      <h2 id="dialog-title">Generate New API Key</h2>
      <button id="close-modal-btn" type="button" class="btn-close" aria-label="Close dialog">
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="2"/></svg>
      </button>
    </header>

    <p id="dialog-desc" class="dialog-description">
      This key will grant read and write access to your cluster resources.
    </p>

    <form method="dialog" class="dialog-form">
      <label for="key-name" class="form-label">Key Name</label>
      <input id="key-name" name="keyName" type="text" class="form-input" required aria-required="true" />

      <footer class="dialog-footer">
        <button type="button" class="btn btn-secondary" onclick="document.getElementById('api-key-dialog').close()">Cancel</button>
        <button type="submit" class="btn btn-primary">Create Key</button>
      </footer>
    </form>
  </div>
</dialog>
```

---

### B. High-Contrast Focus Visible Ring System

```css
/* Universal Focus Visible Standard */
:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Remove default focus for mouse clicks while retaining keyboard accessibility */
:focus:not(:focus-visible) {
  outline: none;
}
```

---

### C. Motion Reduction Standard (`prefers-reduced-motion`)

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
