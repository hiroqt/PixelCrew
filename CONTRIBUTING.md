# Contributing to Pixel Agents

Thank you for your interest in contributing to **Pixel Agents**! We welcome contributions from developers, designers, and AI enthusiasts to help make multi-agent orchestration more observable, powerful, and delightful.

---

## 1. Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free experience for everyone. Please be respectful, constructive, and collaborative in all issues, pull requests, and discussions.

---

## 2. Development Setup

### Prerequisites
- **Node.js**: Version `>= 18.0.0` (Node 20+ recommended).
- **npm**: Version `>= 9.0.0`.
- **Git**: Installed and configured.

### Local Installation
```bash
# 1. Fork and clone the repository
git clone https://github.com/hiroqt/PixelCrew.git
cd PixelCrew

# 2. Run the test suite to verify the environment
npm test

# 3. Test the CLI locally
node bin/pixel-agents.js --help
node bin/pixel-agents.js analyze
node bin/pixel-agents.js demo
```

---

## 3. Branching & Git Workflow

1. Always branch off the latest `main` branch.
2. Use descriptive branch names adhering to our naming conventions:
   - `feat/<feature-name>` (e.g. `feat/drizzle-analyzer`, `feat/sound-synth-controls`)
   - `fix/<bug-description>` (e.g. `fix/sse-reconnect-delay`)
   - `docs/<doc-update>` (e.g. `docs/roadmap-update`)
   - `perf/<optimization>` (e.g. `perf/canvas-dirty-rect-render`)
   - `refactor/<scope>` (e.g. `refactor/scaffold-templates`)

---

## 4. Conventional Commit Standards

We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard. Commit messages must be structured as follows:

```text
<type>(<optional scope>): <short summary in imperative mood>

[optional body explaining rationale]

[optional footer(s), e.g. Closes #12]
```

### Allowed Types:
- `feat`: A new feature or capability.
- `fix`: A bug fix.
- `docs`: Documentation changes only.
- `style`: Formatting, CSS tweaks, white-space fixes (no logic change).
- `refactor`: Code changes that neither fix a bug nor add a feature.
- `perf`: Performance improvements.
- `test`: Adding or correcting tests.
- `chore`: Maintenance tasks, dependency updates, or build configs.

### Examples:
- `feat(analyzer): add detection for Drizzle ORM and SQLite`
- `fix(dashboard): resolve canvas hover tooltip positioning on scaled viewports`
- `docs(readme): add troubleshooting section for SSE firewalls`

---

## 5. Architectural & Code Guidelines

### Core Principles
1. **Zero Runtime Dependencies**: The core CLI, orchestrator server, and visual dashboard must maintain zero external npm runtime dependencies. Use Node.js built-in modules (`node:http`, `node:events`, `node:fs/promises`, `node:path`, `node:url`).
2. **Vanilla Web Standards**: The `.pixel-dashboard/` must remain pure HTML5, CSS, and vanilla JavaScript for maximum speed, portability, and instant `npx` execution.
3. **Pixel Art Integrity**: Maintain crisp scaling using `image-rendering: pixelated` and chunky stepped borders (`box-shadow: 4px 4px 0 #000`). Never use fuzzy blur filters or generic mesh gradients.
4. **Decoupled Architecture**: Keep the Orchestrator Engine (`src/orchestrator/engine.js`), the HTTP/SSE Server (`src/server/server.js`), and the Codebase Analyzer (`src/scaffold/analyzer.js`) strictly modular.

---

## 6. Pull Request Checklist

Before submitting a Pull Request, please ensure:

- [ ] All automated tests pass: `npm test`
- [ ] Code is formatted and clean of debugging `console.log` statements.
- [ ] The change has been tested manually with `node bin/pixel-agents.js init` and `node bin/pixel-agents.js start`.
- [ ] Documentation has been updated (e.g., `README.md`, `DESIGN.md`, or `PRODUCT.md` if applicable).
- [ ] Commit history is clean and follows conventional commit standards.
- [ ] PR description clearly explains the **Problem**, **Solution**, and **Verification Steps**.

---

## 7. Review Process

- PRs will be reviewed by maintainers within 1–2 business days.
- Maintainers may request adjustments to tests, documentation, or code structure.
- Once approved and CI tests pass, your PR will be merged to `main`!
