# Design Specifications: Pixel Agents

This document defines the visual design system, aesthetic philosophy, pixel-art rendering engine, and audio architecture for **Pixel Agents** and the **Pixel Corps HQ** visual dashboard.

---

## 1. Design Philosophy

### Anti-AI-Slop & Authentic Retro Aesthetics
Pixel Agents rejects generic modern AI dashboard clichés (e.g., washed-out purple/blue mesh gradient blobs, low-contrast translucent cards, and standard boilerplate emoji lists). Instead, it adopts:
- **Authentic 8-Bit & 16-Bit Pixel Art**: Pixel-perfect grid alignment using `image-rendering: pixelated` and chunky stepped borders (`box-shadow: 4px 4px 0 #000`).
- **Corporate Tech Startup Metaphor**: Visualizes agents not as abstract compute threads, but as specialized engineers working at dedicated workstations on Floor 42 of *Pixel Corps HQ*.
- **Tactile Feedback**: Interactive keyboard navigation, audio feedback via synthesized 8-bit chiptune frequencies, and optional CRT scanlines.

---

## 2. Color Palette & Design Tokens

### Core Theme Tokens

| Token | Hex | Role / Associated Agent |
| :--- | :--- | :--- |
| `--bg-dark` | `#0a0c14` | Main viewport canvas background |
| `--bg-panel` | `#111422` | Panel card surface |
| `--bg-panel-dark` | `#0d0f1a` | Inset terminal and canvas frames |
| `--bg-card` | `#181c2f` | Workstation card surface |
| `--border-color` | `#2b3252` | Secondary panel borders |
| `--border-light` | `#444f7c` | Highlighted borders |
| `--color-cyan` | `#00f0ff` | Frontend Agent / Primary UI Accent |
| `--color-magenta` | `#ff007f` | Backend Agent / Running State Accent |
| `--color-gold` | `#ffd700` | Orchestrator & Database Agent / Warning Accent |
| `--color-green` | `#39ff14` | Performance Agent / Completed State Accent |
| `--color-red` | `#ff3344` | Security Agent / Error State Accent |
| `--color-purple` | `#b026ff` | QA Agent / Secondary Accent |
| `--color-coffee` | `#b08968` | Coffee meter / Break lounge accents |

---

## 3. Typography System

All typefaces are loaded from Google Fonts with crisp monospace system fallbacks:

```css
--font-pixel: 'Press Start 2P', monospace;      /* Badges, headers, and agent roles */
--font-display: 'Silkscreen', monospace;        /* UI labels, buttons, and metrics */
--font-terminal: 'VT323', monospace;           /* Terminal activity logs & input fields */
```

### Hierarchy Rules
1. **Logo & Stage Titles**: `'Press Start 2P'`, 14px–16px, `text-shadow: 2px 2px 0 #000`.
2. **Subtitles & Badges**: `'Silkscreen'`, 9px–11px, uppercase with 0.5px letter-spacing.
3. **Stream Logs & Ticket Tasks**: `'VT323'`, 16px–18px, high contrast `#cbd5e1`.

---

## 4. Canvas Sprite & Office Floor Engine

### Canvas Coordinate Grid (960 x 420 px)
The open-plan office floor is rendered at 60 FPS using an HTML5 `<canvas>` with crisp double-buffering:

```text
┌────────────────────────────────────────────────────────────────────────┐
│  [EXECUTIVE SUITE]       [FRONTEND POD]      [BACKEND POD]   [DB VAULT]│
│  Orchestrator Desk       Figma Screens       API Terminals   Server    │
│  (60, 60)               (280, 60)           (480, 60)       Racks     │
├────────────────────────────────────────────────────────────────────────┤
│  [SECURITY SOC]          [PERF LAB]          [QA BAY]        [LOUNGE]  │
│  Radar Scanner           Speedometer         Test Rigs       Espresso  │
│  (60, 230)              (280, 230)          (480, 230)      Bar       │
└────────────────────────────────────────────────────────────────────────┘
```

### State Machine Animation States

Each workstation renders procedural pixel animations corresponding to the agent's active state:

```text
IDLE (●_●)
  │  Gentle breathing bounce (sine wave offset on Y axis).
  ▼
ANALYZING (◉_⊙)
  │  Wandering eye scan; thought bubble with animated dots.
  ▼
WORKING (◉▂◉)
  │  Rapid typing arms, mechanical keyboard clack effect,
  │  scrolling code lines on glowing monitors, steaming coffee.
  ▼
VERIFYING (🔍_🔍)
  │  Pulsing magnifying radar sweep / test probe beam.
  ▼
COMPLETED (^_^)
  │  Victory hands raised, gold star sparkle aura, smiling green eyes.
```

---

## 5. Visual Shaders & Lighting

### 1. CRT Scanlines Overlay (`.crt-scanlines`)
A CSS-generated 4px repeating linear gradient mimicking cathode-ray tube phosphor scanlines:
```css
background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
background-size: 100% 4px;
```

### 2. Night Shift Mode (`.night-mode`)
Darkens ambient floor illumination while amplifying monitor glow, server rack LEDs, and security radar sweeps.

---

## 6. 8-Bit Audio Synthesis (Web Audio API)

Sound effects are synthesized entirely in client-side JavaScript using the native `AudioContext` and `OscillatorNode`, requiring zero external MP3/WAV assets.

| Event | Waveform | Frequency Progression | Purpose |
| :--- | :--- | :--- | :--- |
| `spawn` | Triangle / Square | 330 Hz -> 440 Hz -> 660 Hz | Agent startup chime |
| `skill` | Square | 659.25 Hz -> 987.77 Hz | Power-up / skill completion |
| `complete` | Square | 523 Hz -> 659 Hz -> 783 Hz -> 1046 Hz | Sprint victory fanfare |
| `error` | Sawtooth | 180 Hz -> 140 Hz (low buzz) | Task error alarm |
| `click` | Triangle | 800 Hz (20ms burst) | UI button & desk click |

---

## 7. Accessibility & Keyboard Navigation

- **Keyboard First**: Press `[1..6]` to open employee workstation profiles, `[SPACE]` to trigger a sprint demo, `[ESC]` to close modals.
- **Contrast Ratios**: All text tokens exceed WCAG 2.1 AA contrast requirements (minimum 4.5:1 ratio against dark background).
- **Reduced Motion & Sound**: Audio and CRT shaders can be toggled on/off with persistent preferences saved to `localStorage`.
