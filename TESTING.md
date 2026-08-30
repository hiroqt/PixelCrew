# PixelCrew — Testing & Verification Guide (`TESTING.md`)

This guide explains how to test, verify, and validate **PixelCrew** locally and in CI/CD without polluting or corrupting your active workspace.

---

## 🎯 Testing Architecture Overview

Because PixelCrew installs, configures, and synchronizes agent definitions, skill directories, and configuration manifests across multiple IDE environments (`.claude`, `.cursor`, `.kiro`, `.agents`, `.pixel-crew`), it follows a **strict isolation-first testing philosophy**:

```
Isolated Sandbox (os.tmpdir())
       │
       ▼
Fixture Clone (empty-project / nextjs-project / multi-provider)
       │
       ▼
Execute CLI / Installer (with or without --dry-run)
       │
       ▼
Assert File Trees & Manifests (node:test + node:assert)
       │
       ▼
Automatic Teardown (Clean temp directory)
```

---

## 1. Automated Fixture Test Suite (`npm test`)

PixelCrew includes a zero-dependency automated test runner built on native Node.js (`node:test` + `node:assert`).

### Running the Suite:
```bash
npm test
```

### What is Tested:
1. **Zero-Mutation `--dry-run` Safety**:
   - Ensures `initializeProject`, `installSkill`, and `syncSkills` in `--dry-run` mode record planned modifications and write **0 files** to disk.
2. **Multi-Provider Skill Distribution**:
   - Validates that installing skills formats valid YAML frontmatter and writes `SKILL.md` across `.claude`, `.cursor`, `.kiro`, `.agents`, and `.pixel-crew`.
3. **Environment Auto-Detection**:
   - Tests detection of existing IDE configuration folders (`.claude`, `.cursor`, `.agents`) and syncs skills automatically.
4. **Codebase Architecture Profiling**:
   - Tests detection of Next.js, React, Tailwind, Prisma, Drizzle, and TypeScript stacks.
5. **DAG Task Graph & Orchestrator**:
   - Tests dependency resolution, circular dependency detection, parallel task execution, and event broadcasting.

### Fixtures Directory Structure ([`tests/fixtures/`](tests/fixtures)):
- `tests/fixtures/empty-project/`: Clean greenfield workspace.
- `tests/fixtures/nextjs-project/`: Next.js 14 + React 18 + Prisma project.
- `tests/fixtures/multi-provider-project/`: Mock workspace containing `.claude/`, `.cursor/`, and `.agents/` directories.

---

## 2. Local Manual Testing with `npm link`

During active development, test the CLI in a disposable local sandbox without publishing to npm or GitHub:

### Step-by-Step Workflow:

```bash
# 1. Inside your PixelCrew repository, register the CLI globally
cd /path/to/pixel-crew
npm link

# 2. Create a disposable test project (e.g. on your Desktop)
mkdir -p ~/Desktop/pixel-crew-test
cd ~/Desktop/pixel-crew-test

# 3. Test safely with --dry-run (no disk writes)
pixel-crew init --dry-run
pixel-crew add design/ui-design --dry-run
pixel-crew sync --dry-run

# 4. Test real installation
pixel-crew init --yes
pixel-crew add design/ui-design

# 5. Inspect generated files
find . -maxdepth 4 -type f

# 6. Test one-shot website synthesis
pixel-crew oneshot "Build modern portfolio for an AI engineer" --out ./portfolio

# 7. Clean up when finished
cd ~
rm -rf ~/Desktop/pixel-crew-test
```

---

## 3. Pre-Publish Tarball Testing with `npm pack`

Before publishing a new release to npm, test the exact distribution bundle that users will download:

```bash
# 1. Inside PixelCrew, pack the distribution bundle
cd /path/to/pixel-crew
npm pack
# Creates pixelcrew-x.x.x.tgz

# 2. Create a fresh test folder
mkdir -p ~/Desktop/pixel-pack-test
cd ~/Desktop/pixel-pack-test
npm init -y

# 3. Install from local tarball
npm install /path/to/pixel-crew/pixelcrew-*.tgz

# 4. Execute the packaged CLI
npx pixelcrew init --dry-run
npx pixelcrew add design/ui-design --dry-run

# 5. Clean up
cd ~
rm -rf ~/Desktop/pixel-pack-test /path/to/pixel-crew/pixelcrew-*.tgz
```

---

## 4. `--dry-run` Mode Reference

Every potentially mutating command supports `--dry-run`:

```bash
# Preview workspace initialization
pixel-crew init --dry-run

# Preview skill installation across all providers
pixel-crew add @pixel-crew/oneshot --dry-run
pixel-crew add design/ui-design --dry-run

# Preview cross-IDE skill sync
pixel-crew sync --dry-run
```

### Dry-Run Output Example:
```text
[DRY RUN PREVIEW] — No files were written to disk.

Would create files:
  + .agents/skills/ui-design/SKILL.md
  + .claude/skills/ui-design/SKILL.md
  + .cursor/skills/ui-design/SKILL.md
  + .pixel-crew/pixel.json
  + .pixel-crew/skills/ui-design.md

Would update files:
  ~ .pixel-crew/config.json

Would ensure directories:
  📁 .pixel-crew/
  📁 .claude/skills/ui-design/
  📁 .cursor/skills/ui-design/

Run without --dry-run to apply these changes.
```

---

## 5. CI/CD Integration (GitHub Actions)

PixelCrew's test suite requires **zero external dependencies** and runs on any standard Node.js runner:

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x, 22.x]
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: setup/node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm test
```

---

## 🔗 Related Documentation
- [README.md](README.md) — Main product overview & quickstart.
- [PRODUCT.md](PRODUCT.md) — Product vision & technical roadmap.
- [DESIGN.md](DESIGN.md) — Visual tokens, canvas coordinate engine & audio specs.
- [CONTRIBUTING.md](CONTRIBUTING.md) — Contributor guidelines & standards.
