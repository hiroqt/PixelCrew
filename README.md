# PixelCrew (`@hiroqt/pixelcrew`)

Autonomous Multi-Agent Engineering Swarm and Software Synthesis Framework.

---

## Technical Overview

PixelCrew is an autonomous software synthesis framework designed to compile natural language instructions into Next.js App Router applications. The system leverages a Directed Acyclic Graph (DAG) task engine to orchestrate specialized agent personas, compiling structural specifications, design systems, API route handlers, and automated test coverage.

The framework enforces strict design principles, preventing common automated template structures (such as repeating card grids and placeholder copy) by utilizing mathematical fluid clamp typography scales, asymmetric grid layouts, and formal API error specifications.

---

## App Setup and Installation

PixelCrew requires Node.js version 18.0.0 or higher. The framework can be initialized locally in any project directory or installed workstation-wide to support IDE integration.

### 1. Initialize a Project Workspace

To initialize a new project workspace or adapt an existing directory, run the initialization command. This scans the codebase, configures the `.pixel-crew/` controls, and creates the default local profiles.

```bash
# Verify the configuration plan without modifying the filesystem
npx pixelcrew init --dry-run

# Initialize the workspace using default settings
npx pixelcrew init --yes
```

### 2. Install Skills for AI IDE Integration

PixelCrew synchronizes modular agent capabilities directly into local or global AI agent directories. Running the installation adds instruction manuals (`SKILL.md` files) containing YAML frontmatter and operational rules to target IDE profiles.

```bash
# Replicate skills across all detected AI agent directories on the workstation
npx pixelcrew install --global

# Add a specific skill to a targeted agent provider
npx pixelcrew add design/ui-design --provider cursor
```

#### Supported IDE Targets and Paths:
- **Google Antigravity & Universal Agents**: `.agents/skills/`
- **Anthropic Claude Code**: `.claude/skills/`
- **Cursor AI**: `.cursor/skills/`
- **Google Gemini CLI**: `.gemini/skills/`
- **Kiro AI**: `.kiro/skills/`
- **OpenAI Codex CLI**: `.codex/skills/`

---

## CLI Reference and Command Suite

The CLI tool executes commands using the following syntax:

```bash
npx pixelcrew <command> [options]
```

### Core Architecture Commands

- **`init`**
  Initializes the `.pixel-crew/` project folder, configuration schemas, and context manifests.
  - Options: `--name <name>`, `--yes` / `-y`.

- **`assemble`**
  Executes the full 16-step synthesis pipeline, translating a project description into Next.js code, seeding database data, and running visual critics.
  - Usage: `npx pixelcrew assemble "<prompt>"`

- **`blueprint`**
  Compiles section topologies, JSON schema models, and the dependency DAG without generating code.
  - Usage: `npx pixelcrew blueprint "<prompt>"`

- **`boss-fight`**
  Executes targeted repair workflows on specific files or validation errors.
  - Usage: `npx pixelcrew boss-fight "<error-description>"`

- **`retrofit`**
  Scans existing UI layouts and design tokens to export them into the project configuration.

### Operational and Server Commands

- **`start`** (also `dev`, `dashboard`)
  Launches the orchestration server and opens the local monitoring dashboard.
  - Default URL: `http://localhost:4747`
  - Options: `--port <number>`, `--no-open`.

- **`sync`**
  Synchronizes skill repositories across all detected IDE locations.
  - Options: `--dry-run` to preview synchronizations.

- **`doctor`**
  Diagnoses local system compatibility, provider paths, environment variables, and API keys.

---

## Command Options Reference

| Flag | Type | Description | Default |
| :--- | :--- | :--- | :--- |
| `--dry-run` | Boolean | Previews modifications without writing changes to the disk. | `false` |
| `--provider <name>` | String | Directs skill synchronization to a specific IDE provider (e.g., `cursor`, `claude-code`, `antigravity`, `kiro`, `all`). | `all` |
| `--target <framework>` | String | Configures the output target framework (e.g., `nextjs`, `vanilla`). | `nextjs` |
| `--out <dir>` | String | Configures the destination directory for synthesized codebases. | Current Directory |
| `--port <number>` | Number | Specifies the port for the dashboard server. | `4747` |
| `--no-open` | Boolean | Prevents the dashboard server from opening the browser automatically. | `false` |
| `--yes` / `-y` | Boolean | Skips confirmation prompts during workspace initialization. | `false` |

---

## Verification and Testing

To execute the automated regression and unit test suite:

```bash
npm test
```

For custom validation workflows, refer to the local guide in [TESTING.md](TESTING.md).

---

## License

This software is licensed under the Apache License, Version 2.0. Detailed terms can be found in the [LICENSE](LICENSE) file.
