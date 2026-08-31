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
│      Example: [ 486+ Hours ] [ 4+ Platforms ] [ 3+ Credentials ] [ 100% Ownership ]
│      Fix: Integrate metrics inline within case narratives, timeline ribbons, or asymmetrical callouts.
│
├── 2. ❌ Hashtag & Pill Badge Spam
│      Example: Row of 8 pill tags (#React #Nextjs #Groq #Tailwind #Vue #Laravel #Supabase #MySQL)
│      Fix: Replace with structured architectural specs, interactive code/tab matrices, or real stack diagrams.
│
├── 3. ❌ Card-in-a-Card Syndrome (Nested Dark Box in Dark Box)
│      Example: A large dark rounded box containing 3 smaller identical rounded dark boxes with glowing cyan borders.
│      Fix: Use clean divider lines, whitespace grouping, single cohesive containers, or tabular layouts.
│
├── 4. ❌ Predictable Split Hero (Left text, Right dark box, Bottom 4 stats)
│      Example: "Hello, I'm [Name]" + pills + right dark card + bottom 4 metric cards.
│      Fix: Asymmetric Bento Grid (col-span-8 deep dive + col-span-4 live telemetry), full-width editorial hero.
│
├── 5. ❌ Cyan/Teal Neon on Flat Black Monoculture
│      Example: Defaulting to #00f0ff / #00ffcc glowing text and cyan buttons on flat #0a0a0c.
│      Fix: Choose an authentic palette (e.g. Architectural Obsidian & Amber, Swiss High-Contrast Monochrome, Warm Editorial Stone & Ink).
│
├── 6. ❌ Cliché AI Copywriting & Fake Status Badges
│      Example: "✨ Elevate your workflow", "Seamlessly innovate", "Available for work" pill everywhere.
│      Fix: Concrete, grounded value propositions, real system metrics, and architectural outcomes.
│
├── 7. ❌ Fake AI Sparkles (✨, 🪄) and Generic Rocket Emojis
│      Example: Eyebrow badge with sparkles above every section heading.
│      Fix: Clear semantic <h1> / <h2> typography hierarchy with zero decorative emoji noise.
│
├── 8. ❌ Uniform 16px Rounded Cards Repeated Across the Entire Page
│      Example: Every single section is just another grid of 3 identical rounded rectangles.
│      Fix: Dynamic section rhythm (alternating airy typographic hero, dense technical table, interactive demo, asymmetric split).
│
├── 9. ❌ Floating Fake SaaS Dashboard Screenshots with Pastel Bar Charts
│      Example: Generic fake bar graph mockup pasted into hero.
│      Fix: Real interactive UI state, live terminal shell, or functional filter matrix.
│
└── 10. ❌ Meaningless Floating Icons at the Top of Every Card
       Example: Random Lucide icons placed above every sentence just to fill space.
       Fix: Purposeful visuals, interactive architecture graphs, or clean icon-free typography.
```

---

## 2. Concrete Refactoring Blueprints: "DO THIS, NOT THAT"

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
    {/* Clean architectural specs, not hashtag spam */}
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

### ❌ Pattern 2: Banned Hashtag Pill Cloud vs. ✅ Interactive Architecture Spec

#### ❌ BANNED (Generic AI Slop):
```tsx
{/* DO NOT GENERATE: Random hashtag pill cloud */}
<div className="flex flex-wrap gap-2 mt-4">
  <span className="px-3 py-1 bg-zinc-800 text-cyan-400 text-xs rounded-full">#Groq LLM</span>
  <span className="px-3 py-1 bg-zinc-800 text-cyan-400 text-xs rounded-full">#React / Next.js</span>
  <span className="px-3 py-1 bg-zinc-800 text-cyan-400 text-xs rounded-full">#Vue.js</span>
  <span className="px-3 py-1 bg-zinc-800 text-cyan-400 text-xs rounded-full">#Laravel PHP</span>
  <span className="px-3 py-1 bg-zinc-800 text-cyan-400 text-xs rounded-full">#Flutter</span>
  <span className="px-3 py-1 bg-zinc-800 text-cyan-400 text-xs rounded-full">#Tailwind CSS</span>
</div>
```

#### ✅ REQUIRED (Structured Domain Architecture Matrix):
```tsx
{/* DO GENERATE: Grouped, structured architectural capabilities */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
  <div className="p-5 bg-white/[0.02] border border-white/10 rounded-xl">
    <div className="text-xs font-mono text-amber-400 tracking-wider uppercase mb-2">01. GenAI & Triage</div>
    <div className="text-sm font-semibold text-white">Groq LPU + RAG Pipelines</div>
    <p className="text-xs text-zinc-400 mt-1">Sub-second inference triage, LLM hospital queuing & token-efficient embeddings.</p>
  </div>
  <div className="p-5 bg-white/[0.02] border border-white/10 rounded-xl">
    <div className="text-xs font-mono text-cyan-400 tracking-wider uppercase mb-2">02. Full-Stack Systems</div>
    <div className="text-sm font-semibold text-white">Next.js 15, React 19, Laravel</div>
    <p className="text-xs text-zinc-400 mt-1">Type-safe route handlers, SSR streaming, and relational PostgreSQL / Supabase schemas.</p>
  </div>
  <div className="p-5 bg-white/[0.02] border border-white/10 rounded-xl">
    <div className="text-xs font-mono text-emerald-400 tracking-wider uppercase mb-2">03. Mobile & Platforms</div>
    <div className="text-sm font-semibold text-white">Flutter & QR-Auth HRIS</div>
    <p className="text-xs text-zinc-400 mt-1">Cross-platform client applications, offline-first sync, and tamper-proof security.</p>
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
5. **Run a self-audit against the 10 Banned Patterns before outputting code.**
