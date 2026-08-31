---
name: anti-ai-patterns
description: Strict Anti-AI-Generated Design Critic and Quality Guardian for Pixel Crew. Automatically detects monotonous card grids, purple gradient blobs, fake AI sparkles, and cliché copywriting. Enforces intentional asymmetry, expressive typography, dynamic section rhythm, and bespoke brand language.
---

# 🛡️ Anti-AI-Generated Design & Slop Guardian Skill

The **Anti-AI-Patterns Skill** acts as an uncompromising aesthetic critic and quality guardian within the Pixel Crew framework. It does **not** write raw UI code—its sole objective is to inspect, score, and reject synthetic tropes before they reach the user.

---

## 1. Automated Detection Matrix: The 10 Banned AI Slop Patterns

The skill executes static and visual pattern recognition to strictly ban and reject these 10 synthetic AI tropes:

```
❌ THE 10 BANNED AI SLOP PATTERNS
├── 1. ❌ Monotonous 3-Column / 4-Column Stat Box Rows
│      Example: [ 486+ Hours ] [ 4+ Platforms ] [ 3+ Credentials ] [ 100% Delivery ]
│      Fix: Integrate metrics inline within case narratives, timeline ribbons, or asymmetrical callouts.
│
├── 2. ❌ Hashtag & Pill Badge Spam
│      Example: Row of 8 pill tags (#React #Nextjs #Groq #Tailwind #Vue #Laravel #Supabase #MySQL)
│      Fix: Replace with structured architectural specs, interactive code/tab matrices, or real stack diagrams.
│
├── 3. ❌ Fake macOS Windows with 🔴 🟡 🟢 Dots in Hero
│      Example: A decorative dark box with red/yellow/green macOS dots pretending to be a "terminal".
│      Fix: True high-impact typography lead, interactive system node diagram, or live code tabs.
│
├── 4. ❌ Checkmark Bullet Lists (✓) on Project Cards
│      Example: Every project card has 3–4 bullet points starting with green checkmarks.
│      Fix: Real engineering case narratives with problems, architecture decisions, and measured outcomes.
│
├── 5. ❌ Card-in-a-Card Syndrome (Nested Dark Box in Dark Box)
│      Example: A large dark rounded box containing 3 smaller identical rounded dark boxes with glowing borders.
│      Fix: Use clean divider lines, whitespace grouping, single cohesive containers, or tabular layouts.
│
├── 6. ❌ Predictable Split Hero (Left text, Right dark box, Bottom 4 stats)
│      Example: "Hello, I'm [Name]" + pills + right dark card + bottom 4 metric cards.
│      Fix: Asymmetric Bento Grid (col-span-8 deep dive + col-span-4 live telemetry), full-width editorial hero.
│
├── 7. ❌ Cyan/Emerald Neon on Flat Black Monoculture
│      Example: Defaulting to #10B981 / #00F0FF glowing text and green buttons on flat #0a0a0c.
│      Fix: Choose an authentic palette (e.g. Architectural Obsidian & Amber, Swiss High-Contrast Monochrome, Warm Editorial Stone & Ink).
│
├── 8. ❌ Cliché AI Copywriting & Fake Status Badges
│      Example: "✨ Elevate your workflow", "Seamlessly innovate", "Available for work" pill everywhere.
│      Fix: Concrete, grounded value propositions, real system metrics, and architectural outcomes.
│
├── 9. ❌ Monotonous 16px Rounded Cards Repeated Everywhere
│      Example: Every single section is just another grid of identical rounded rectangles.
│      Fix: Dynamic section rhythm (alternating airy typographic hero, dense technical table, interactive demo, asymmetric split).
│
└── 10. ❌ Meaningless Floating Icons at the Top of Every Card
       Example: Random Lucide icons placed above every sentence just to fill space.
       Fix: Purposeful visuals, interactive architecture graphs, or clean icon-free typography.
```

---

## 2. Concrete Component Refactoring Blueprints: "DO THIS, NOT THAT"

### ❌ Pattern 1: Banned Stat Box Rows vs. ✅ Asymmetric Metric Storytelling

#### ❌ BANNED (Generic AI Slop):
```tsx
{/* DO NOT GENERATE: Monotonous 4-card metric rectangle row */}
<div className="grid grid-cols-4 gap-4 mt-8">
  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
    <div className="text-3xl font-bold text-cyan-400">486+</div>
    <div className="text-sm text-zinc-400">Hospital IT Hours</div>
  </div>
  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
    <div className="text-3xl font-bold text-cyan-400">4+</div>
    <div className="text-sm text-zinc-400">Platforms Built</div>
  </div>
  {/* ... repeated 4 times */}
</div>
```

#### ✅ REQUIRED (Authentic Asymmetric Bento Narrative):
```tsx
{/* DO GENERATE: Metrics embedded directly inside flagship project case study */}
<div className="grid grid-cols-12 gap-6 mt-8">
  <div className="col-span-12 lg:col-span-8 p-8 bg-[#0D0F12] border border-white/10 rounded-2xl">
    <div className="flex items-center gap-3 text-xs font-mono text-amber-400 tracking-wider uppercase">
      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
      Production Flagship / Hospital Queue AI
    </div>
    <h3 className="text-2xl font-semibold text-white mt-3 font-display">
      Sub-Second LPU Triage Dispatcher for 480+ Clinical Beds
    </h3>
    <p className="text-zinc-400 text-sm mt-2 leading-relaxed max-w-xl">
      Engineered end-to-end patient queueing using Groq LPU inference, handling 486+ hours of live hospital operation with zero downtime.
    </p>
    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
      <div>
        <div className="text-2xl font-bold font-mono text-white">486h</div>
        <div className="text-xs text-zinc-500 font-mono">Live IT Operation</div>
      </div>
      <div>
        <div className="text-2xl font-bold font-mono text-emerald-400">99.98%</div>
        <div className="text-xs text-zinc-500 font-mono">Uptime SLA</div>
      </div>
      <div>
        <div className="text-2xl font-bold font-mono text-amber-400">&lt;450ms</div>
        <div className="text-xs text-zinc-500 font-mono">Inference Latency</div>
      </div>
    </div>
  </div>
  
  <div className="col-span-12 lg:col-span-4 p-8 bg-[#0D0F12] border border-white/10 rounded-2xl flex flex-col justify-between">
    <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">System Capabilities</div>
    <ul className="space-y-3 my-4 text-sm text-zinc-300">
      <li className="flex items-center justify-between border-b border-white/5 pb-2">
        <span>RAG Pipeline</span>
        <span className="font-mono text-xs text-zinc-500">Groq / Llama-3</span>
      </li>
      <li className="flex items-center justify-between border-b border-white/5 pb-2">
        <span>HRIS Security</span>
        <span className="font-mono text-xs text-zinc-500">QR-Tokenized</span>
      </li>
      <li className="flex items-center justify-between">
        <span>Full Ownership</span>
        <span className="font-mono text-xs text-emerald-400">Schema to UI</span>
      </li>
    </ul>
    <div className="text-xs font-mono text-zinc-500">4 Platforms Deployed & Client-Owned</div>
  </div>
</div>
```

---

### ❌ Pattern 2: Banned Fake macOS Window vs. ✅ Editorial Masthead & Live Architecture Graph

#### ❌ BANNED (Generic AI Slop):
```tsx
{/* DO NOT GENERATE: Fake macOS terminal box with 🔴 🟡 🟢 dots */}
<div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
  <div className="flex gap-2 mb-4">
    <span className="w-3 h-3 rounded-full bg-red-500" />
    <span className="w-3 h-3 rounded-full bg-yellow-500" />
    <span className="w-3 h-3 rounded-full bg-green-500" />
    <span className="text-xs text-zinc-400 font-mono">live-telemetry.sys</span>
  </div>
  <div className="text-cyan-400 font-mono text-sm">GROQ LATENCY: 114ms</div>
</div>
```

#### ✅ REQUIRED (High-Impact Editorial Masthead):
```tsx
{/* DO GENERATE: Pure typographic authority with direct contact and live stack summary */}
<section className="py-20 lg:py-28 border-b border-white/10">
  <div className="max-w-6xl mx-auto px-6">
    <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-4">
      Software Engineer & Systems Architect
    </div>
    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white font-display leading-[1.08] max-w-4xl">
      Building sub-second <span className="text-amber-400 italic font-serif font-normal">LPU inference systems</span> & high-throughput web platforms.
    </h1>
    <p className="text-zinc-400 text-lg sm:text-xl mt-6 max-w-2xl leading-relaxed">
      Specialized in clinical queue triage with Groq, tamper-proof QR HRIS engines, and full-stack React/Next.js/Laravel platforms.
    </p>
    <div className="flex items-center gap-6 mt-8 text-sm font-mono">
      <a href="#projects" className="text-white hover:text-amber-400 transition-colors underline underline-offset-4">
        Flagship Deployments ↓
      </a>
      <a href="mailto:contact@domain.com" className="text-zinc-400 hover:text-white transition-colors">
        Email Directly →
      </a>
      <span className="text-zinc-600">|</span>
      <span className="text-zinc-500">486h Clinical IT Experience</span>
    </div>
  </div>
</section>
```

---

### ❌ Pattern 3: Banned Checkmark Bullet Lists vs. ✅ Engineering Case Studies

#### ❌ BANNED (Generic AI Slop):
```tsx
{/* DO NOT GENERATE: Identical card with 3 green checkmarks */}
<div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
  <h3>Hospital AI Triage</h3>
  <ul className="mt-4 space-y-2">
    <li>✓ Engineered ultra-fast symptom categorization</li>
    <li>✓ Developed responsive Vue.js frontend</li>
    <li>✓ Architected secure PHP database layer</li>
  </ul>
</div>
```

#### ✅ REQUIRED (Structured Architectural Narrative):
```tsx
{/* DO GENERATE: Deep architectural breakdown with problem, solution, and specs */}
<div className="p-8 bg-zinc-950 border border-white/10 rounded-2xl hover:border-white/20 transition-all">
  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-4 border-b border-white/5">
    <span>CLINICAL AI & HEALTHCARE</span>
    <span>2026 / PRODUCTION</span>
  </div>
  <h3 className="text-2xl font-bold text-white mt-4 font-display">Hospital Triage & Queuing Dispatcher</h3>
  <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
    Engineered to solve patient congestion across 480+ beds by routing incoming clinical symptoms through Groq LPU inference pipelines in under 120ms.
  </p>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 p-4 bg-white/[0.02] border border-white/5 rounded-xl text-xs font-mono">
    <div>
      <span className="text-zinc-500 uppercase block mb-1">Architecture</span>
      <span className="text-zinc-200">Groq LLM + Vue 3 + Laravel REST</span>
    </div>
    <div>
      <span className="text-zinc-500 uppercase block mb-1">Benchmark Result</span>
      <span className="text-emerald-400">&lt;120ms Latency (99.98% SLA)</span>
    </div>
  </div>
</div>
```

---

## 3. Rubric Evaluation & Strict Score Gate

Every generated UI must be verified against the **Anti-AI 6-Dimension Rubric** ($\ge 8.5/10.0$ threshold to pass):

| Dimension | Weight | Slop Penalty Triggers (< 7.0) | Exemplary Standards ($\ge 9.0$) |
| :--- | :--- | :--- | :--- |
| **1. Layout Asymmetry & Bento Flow** | 20% | Monotonous 3/4-card grids, split-hero box clones | Staggered column spans (`8+4`, `7+5`), alternating rhythm |
| **2. Typography & Hierarchy** | 20% | Default Inter, low contrast, no fluid clamp | Expressive Display (Grotesk/Serif) + JetBrains Mono labels |
| **3. Content Grounding & Metrics** | 20% | Hashtag pills, cliché copy ("Unlock next-gen") | Concrete architectural specs, integrated metric story |
| **4. Surface Depth & Color Authenticity**| 15% | Cyan-on-black monoculture, purple mesh blobs | Curated obsidian/amber, stone/ink, or slate/cobalt tiers |
| **5. Container Hygiene (No Card-in-Card)**| 15% | Triple-nested rounded cards, identical borders | Clean divider lines, unified containers, whitespace gravity |
| **6. Micro-Interactions & Living UI** | 10% | Static decorative boxes, fake pastel charts | Interactive code tabs, live terminal shell, real filters |

---

## 4. Mandatory Execution Protocol for AI Coding Agents

When invoked in any coding agent (Antigravity, Kiro, Claude, Cursor):
1. **Never jump directly to writing raw template cards.**
2. **Review the user brief and select an authentic visual archetype.**
3. **Embed metrics inside real project narratives, never in isolated 4-card stat strips.**
4. **Group technical capabilities by architecture layer, never as a raw cloud of hashtag pills.**
5. **No fake macOS red/yellow/green terminal widgets.**
6. **Run a self-audit against the 10 Banned Patterns before outputting code.**
