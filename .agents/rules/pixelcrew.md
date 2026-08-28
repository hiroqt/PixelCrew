# PixelCrew Agent Execution Rules

When the user asks you to:
- "use pixel agents"
- "analyze ... with pixel agents / pixelcrew"
- Or uses `/pixel` / `/pixelcrew` / `/pixel-agents` commands

## MANDATORY REAL-TIME EXECUTION DIRECTIVES:
You MUST execute the `run_command` tool to emit live events to the PixelCrew daemon as you perform the work. Do NOT just output text without emitting events.

### Step 1: Emit Initial Thinking / Spawn Event
Execute `run_command` with:
```bash
npx github:hiroqt/PixelCrew emit --agent <role> --type thinking --message "Analyzing <target>"
```
*(Where `<role>` is `frontend`, `backend`, `database`, `security`, `performance`, or `qa`)*

### Step 2: Emit Tool / Inspection Events While Analyzing Files
When reading files or running checks:
```bash
npx github:hiroqt/PixelCrew emit --agent <role> --type tool --skill <skill_name> --message "Inspecting <filename>"
```

### Step 3: Emit Completion Event When Finished
When the analysis or code change is ready:
```bash
npx github:hiroqt/PixelCrew emit --agent <role> --type complete --skill <skill_name> --message "Completed <task_summary>"
```
