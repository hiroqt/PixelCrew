---
name: pixel-agents
description: |
  Local multi-agent orchestration framework and interactive pixel-art tech startup office visual dashboard. Use when the user asks to analyze code, orchestrate subagents, run tasks with pixel-agents/PixelCrew, or stream live IDE activity to the visual office dashboard.
---

# PixelCrew / Pixel Agents Orchestration Skill

Use this skill whenever the user asks you to perform tasks using `pixel-agents` or `PixelCrew` (e.g., *"analyze the frontend using pixel agents"* or *"orchestrate the database optimization in pixel crew"*).

---

## 🕹️ Live IDE-to-Dashboard Workflow

Whenever you perform work on behalf of the user with `pixel-agents`, emit structured events to the dashboard so your actions animate on the visual office floor in real-time.

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
