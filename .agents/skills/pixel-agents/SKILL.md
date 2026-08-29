---
name: pixel-agents
description: |
  Local multi-agent orchestration framework and interactive pixel-art tech startup office visual dashboard. Use when the user asks to analyze code, orchestrate subagents, run tasks with pixel-agents/PixelCrew, or stream live IDE activity to the visual office dashboard.
---

# PixelCrew / Pixel Agents Orchestration Skill

Use this skill whenever the user asks you to perform tasks using `pixel-agents` or `PixelCrew` (e.g., *"create a modern website with pixel-agents"*, *"showcase my projects with pixel crew"*, or *"optimize queries using pixel agents"*).

---

## ✦ MANDATORY FOR WEBSITE & APPLICATION CREATION

Whenever the user asks to **create, generate, or build a website, landing page, portfolio, or fullstack app** using PixelCrew or `[pixel-agents]` or `/pixel-agents`:

1. **Default Stack Standard**:
   - **Frontend**: Next.js 14/15 (App Router + TypeScript + Tailwind CSS)
   - **Backend**: TypeScript Route Handlers (`src/app/api/...`) & strict type safety
   - **Architecture**: Asymmetric layout, fluid clamp() typography scales, zero AI slop.

2. **Execute the OneShot Multi-Agent Synthesis Command**:
   ```bash
   npx pixelcrew oneshot "<User Prompt>" --target nextjs
   ```

3. **Autonomous Multi-Agent Collaboration & Dashboard Sync**:
   - Decomposes the brief and automatically assigns tasks across the specialized squad:
     - **Creative Director & Anti-AI Guardian**: Bans purple gradients, repeating cards, and fake AI sparkles.
     - **UX Planner**: Architects dynamic topologies (interactive filtering, live shell, pricing calculator).
     - **Frontend Engineer**: Builds the Next.js App Router project tree.
     - **Backend Engineer**: Generates TypeScript API route handlers.
     - **Database Engineer**: Compiles data models and category taxonomy.
     - **Performance Engineer**: Profiles Core Web Vitals (LCP < 0.6s).
     - **Security Engineer**: Enforces CSP and input sanitization.
     - **QA Engineer**: Validates against the 6-dimension Anti-AI Rubric ($\ge 8.5/10.0$).
   - **Streams continuous live sprite typing animations, state shifts, and sound chimes to the visual dashboard at `http://localhost:4747` until the entire task is complete**.
   - **Keeps all framework state inside `.pixel-agents/`** (no extra `.pixel-dashboard` or `reports` root folders).

---

## 🕹️ Live IDE Telemetry Emission (For General Coding Tasks)

When performing general refactoring, debugging, or database tasks:

Emit events as you work using `npx pixelcrew emit`:
```bash
# 1. When analyzing:
npx pixelcrew emit --agent frontend --type thinking --message "Analyzing component tree"

# 2. When inspecting files / tools:
npx pixelcrew emit --agent database --type tool --skill postgresql --message "Inspecting composite indexes"

# 3. When completing:
npx pixelcrew emit --agent performance --type complete --message "Optimized bundle size by 40%"
```

### Step 1: Ensure Swarm Workspace Exists
Check if `.pixel-agents/` exists in the workspace. If not, initialize it:
```bash
npx pixelcrew init --yes
```

### Step 2: Stream Activity as You Work

As you analyze files, run tools, or write code, emit events corresponding to the specialized role (`frontend`, `backend`, `database`, `security`, `performance`, `qa`). Use `pixelcrew emit` (or `npx --prefer-offline pixelcrew emit`):

#### 1. When Starting / Thinking:
```bash
pixelcrew emit --agent frontend --type thinking --message "Analyzing React components and routing structure"
```

#### 2. When Reading / Modifying Files or Using Tools:
```bash
pixelcrew emit --agent frontend --type tool --skill nextjs --message "Inspecting src/app/page.tsx for rendering bottlenecks"
```

#### 3. When Applying a Skill:
```bash
pixelcrew emit --agent frontend --type skill --skill tailwind --message "Refactoring CSS grid and responsive layout"
```

#### 4. When Completing the Task:
```bash
pixelcrew emit --agent frontend --type complete --message "Frontend analysis complete: identified 3 component optimizations"
```

> **💡 Real-Time Sync Note:** You can also append event JSON directly to `.pixel-agents/events.jsonl`. The dashboard's live file watcher automatically detects new lines and broadcasts them over SSE in real-time.

---

## 🏢 What Automatically Happens in the Dashboard

Every `emit` call updates the live dashboard at `http://localhost:4747` (or `4748`):

1. **Workstation Sprite Animation**: The corresponding agent (e.g. Frontend Engineer at desk `(280, 60)`) shifts state from `IDLE` (`●_●`) to `WORKING` (`◉▂◉`) with mechanical keyboard typing animations and glowing monitor lines.
2. **Live Feed Stream**: A new entry is appended to the `#engineering-feed` terminal log with the agent badge (e.g. `[03:08:15] #FRONTEND → Inspecting src/app/page.tsx`).
3. **8-Bit Chiptune Sound**: The Web Audio synthesizer triggers an 8-bit sound effect (spawn chime, skill chime, or victory fanfare).
4. **Skills Matrix**: Marks the active skill as in progress (`◉`) or completed (`✓`).
5. **Sprint Progress & Coffee Meter**: Updates team velocity and sprint completion percentages.

---

## ✦ OneShot Website Synthesis & Visual Feedback Workflow

When the user asks to generate a website, landing page, or UI with PixelCrew:

1. **Invoke the OneShot CLI**:
   ```bash
   npx pixelcrew oneshot "<User Prompt>" --target vanilla
   ```
2. **The 5 Specialized Roles Automatically Collaborate**:
   - `creativeDirector` determines archetype and strict anti-AI negative constraints.
   - `uxPlanner` maps asymmetric section topology and content structure.
   - `designSystem` compiles fluid typography `clamp()` scales and color tokens.
   - `frontend` generates production-ready, clean HTML/CSS/Tailwind code with zero placeholder copy.
   - `visualCritic` scores against the 6-dimension Anti-AI Rubric ($\ge 8.5/10.0$) and refines if needed.
3. **Generated Artifacts**:
   - Stored in `./generated-site/index.html` and `./generated-site/creative-direction.json`.

---

## ⚡ Universal Cross-IDE Token Conservation

To slash token usage by 50% to 75%:
- Use `.agents/skills/token-efficiency/` for prefix cache anchoring (Claude), line-range precision edits (Antigravity), and AST symbol skeletons (Cursor/Kiro/Windsurf).
- Keep context windows clean by pruning completed task logs and avoiding dumping entire 1,000+ line files when only a fraction is being edited.

