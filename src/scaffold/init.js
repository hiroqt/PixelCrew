import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';
import { DEFAULT_CONFIG, INITIAL_STATE, AGENT_MARKDOWNS, SKILL_MARKDOWNS } from './templates.js';
import { analyzeCodebase, buildAdaptedConfig } from './analyzer.js';
import { detectActiveIDE, GLOBAL_PROVIDER_PATHS, PROVIDER_PATHS } from './installer.js';
import { getSkillBundle, getAllCanonicalSkillIds } from './skills-bundle.js';
import { generateKiroFiles } from './kiro-generator.js';
import { safeWriteFile, safeMkdir, DryRunReporter } from '../utils/fs-safe.js';

/**
 * Initializes a new .pixel-agents / .pixel-crew workspace adapted to the target directory
 */
export async function initializeProject(targetDir = process.cwd(), options = {}) {
  const isInteractive = !options.yes && !options.dryRun && process.stdin.isTTY;
  let projectName = options.name || path.basename(targetDir);
  let enableDashboard = true;
  const activeIDE = detectActiveIDE();
  let installScope = options.scope || (options.global ? 'global' : 'project');
  const dryRun = Boolean(options.dryRun);
  const reporter = options.reporter || new DryRunReporter(targetDir);

  if (isInteractive) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('\n\x1b[36m' + `
 ╔═══════════════════════════════════════════════════════════╗
 ║   PIXEL CREW  -  Multi-Agent Orchestration Framework     ║
 ║                      [ ◉ _ ◉ ]                            ║
 ╚═══════════════════════════════════════════════════════════╝
` + '\x1b[0m');

    const nameAns = await rl.question(`? Project name (${projectName}): `);
    if (nameAns.trim()) {
      projectName = nameAns.trim();
    }

    const dashAns = await rl.question(`? Enable visual pixel dashboard? (Y/n): `);
    if (dashAns.trim().toLowerCase() === 'n') {
      enableDashboard = false;
    }

    if (!options.scope && !options.global) {
      console.log(`\n\x1b[36mActive IDE Environment:\x1b[0m \x1b[1m${activeIDE.name}\x1b[0m (${activeIDE.id})`);
      console.log('Select skill installation scope:');
      console.log(`  1) Project-level (Current workspace: .${activeIDE.id === 'pixel-crew' ? 'pixel-crew' : activeIDE.id}/skills/ + .pixel-crew/) [Default]`);
      console.log(`  2) Global (${activeIDE.name}: ${activeIDE.globalPath} — available in ANY folder)`);
      console.log(`  3) Both (Project workspace + Global ${activeIDE.name} config)`);
      console.log(`  4) Multi-IDE Project (Sync across .cursor, .claude, .kiro, .agents)`);

      const scopeAns = await rl.question(`Choice [1-4] (1): `);
      const trimmed = scopeAns.trim();
      if (trimmed === '2' || trimmed.toLowerCase() === 'global') installScope = 'global';
      else if (trimmed === '3' || trimmed.toLowerCase() === 'both') installScope = 'both';
      else if (trimmed === '4' || trimmed.toLowerCase() === 'multi') installScope = 'all';
      else installScope = 'project';
    }

    rl.close();
  }

  console.log('\n\x1b[33mInitializing Pixel Crew in:\x1b[0m', targetDir);

  // 1. Deep Codebase Analysis & Context Extraction
  console.log('\x1b[36mScanning and analyzing codebase architecture...\x1b[0m');
  const profile = await analyzeCodebase(targetDir);
  if (options.name) {
    profile.projectName = options.name;
    projectName = options.name;
  } else if (profile.projectName) {
    projectName = profile.projectName;
  }

  const isEmptyDir = profile.files.length === 0 && profile.directories.length === 0;

  if (isEmptyDir) {
    console.log(`  \x1b[90m• Workspace:\x1b[0m      Greenfield (Empty Directory)`);
    console.log(`  \x1b[90m• Default Stack:\x1b[0m  Next.js 14/15 (TypeScript) + Tailwind CSS`);
    console.log(`  \x1b[90m• Backend:\x1b[0m        TypeScript Route Handlers`);
  } else {
    console.log(`  \x1b[90m• Languages:\x1b[0m      ${profile.languages.join(', ') || 'JavaScript'}`);
    console.log(`  \x1b[90m• Frameworks:\x1b[0m     ${profile.frameworks.join(', ') || 'Standard Web'}`);
    console.log(`  \x1b[90m• Backend:\x1b[0m        ${profile.backend.join(', ') || 'Node.js'}`);
    console.log(`  \x1b[90m• Database:\x1b[0m       ${profile.database.join(', ') || 'SQL / Relational'}`);
  }
  const pixelCrewDir = path.join(targetDir, '.pixel-crew');
  const targets = [pixelCrewDir];

  // 2. Build Context-Adapted Config
  const adaptedConfig = buildAdaptedConfig(profile, options);
  adaptedConfig.project = projectName;
  adaptedConfig.dashboard.enabled = enableDashboard;
  if (!adaptedConfig.orchestrator) adaptedConfig.orchestrator = {};
  adaptedConfig.orchestrator.runtimeStrategy = options.provider || 'auto';

  // 4. State & Initial Event
  const state = JSON.parse(JSON.stringify(INITIAL_STATE));
  state.startedAt = new Date().toISOString();

  const initialEvent = {
    id: 'evt-0',
    timestamp: Date.now(),
    agent: 'orchestrator',
    type: 'spawn',
    message: `Pixel Crew swarm initialized & adapted to ${profile.frameworks.join(', ') || 'codebase'}`,
    metadata: { version: '0.2.4', profile }
  };

  const manifest = {
    name: projectName,
    version: '0.2.4',
    frameworks: profile.frameworks,
    languages: profile.languages,
    installedAt: new Date().toISOString(),
    skills: Object.keys(SKILL_MARKDOWNS).reduce((acc, k) => {
      const sId = k.replace('.md', '');
      acc[sId] = {
        name: sId,
        category: 'core',
        providers: ['pixel-crew'],
        installedAt: new Date().toISOString()
      };
      return acc;
    }, {})
  };

  const srcDashboardDir = fileURLToPath(new URL('../dashboard', import.meta.url));

  for (const baseDir of targets) {
    const agentsDir = path.join(baseDir, 'agents');
    const skillsDir = path.join(baseDir, 'skills');
    const reportsDir = path.join(baseDir, 'reports');
    const tasksDir = path.join(baseDir, 'tasks');
    const dashboardDir = path.join(baseDir, 'dashboard');

    await safeMkdir(baseDir, { dryRun, reporter });
    await safeMkdir(agentsDir, { dryRun, reporter });
    await safeMkdir(skillsDir, { dryRun, reporter });
    await safeMkdir(reportsDir, { dryRun, reporter });
    await safeMkdir(tasksDir, { dryRun, reporter });
    if (enableDashboard) {
      await safeMkdir(dashboardDir, { dryRun, reporter });
    }

    await safeWriteFile(path.join(baseDir, 'config.json'), JSON.stringify(adaptedConfig, null, 2), { dryRun, reporter, targetDir });
    await safeWriteFile(path.join(baseDir, 'context.json'), JSON.stringify(profile, null, 2), { dryRun, reporter, targetDir });
    await safeWriteFile(path.join(baseDir, 'state.json'), JSON.stringify(state, null, 2), { dryRun, reporter, targetDir });
    await safeWriteFile(path.join(baseDir, 'events.jsonl'), JSON.stringify(initialEvent) + '\n', { dryRun, reporter, targetDir });
    await safeWriteFile(path.join(baseDir, 'pixel.json'), JSON.stringify(manifest, null, 2) + '\n', { dryRun, reporter, targetDir });

    for (const [filename, content] of Object.entries(AGENT_MARKDOWNS)) {
      await safeWriteFile(path.join(agentsDir, filename), content.trim() + '\n', { dryRun, reporter, targetDir });
    }

    for (const [filename, content] of Object.entries(SKILL_MARKDOWNS)) {
      await safeWriteFile(path.join(skillsDir, filename), content.trim() + '\n', { dryRun, reporter, targetDir });
    }

    if (enableDashboard) {
      try {
        const html = await fs.readFile(path.join(srcDashboardDir, 'index.html'), 'utf-8');
        const css = await fs.readFile(path.join(srcDashboardDir, 'styles.css'), 'utf-8');
        const js = await fs.readFile(path.join(srcDashboardDir, 'app.js'), 'utf-8');

        await safeWriteFile(path.join(dashboardDir, 'index.html'), html, { dryRun, reporter, targetDir });
        await safeWriteFile(path.join(dashboardDir, 'styles.css'), css, { dryRun, reporter, targetDir });
        await safeWriteFile(path.join(dashboardDir, 'app.js'), js, { dryRun, reporter, targetDir });
      } catch {}
    }
  }

  // 1. Install skills to IDE project directories (.agents for Antigravity, .kiro, .cursor, etc.)
  if (installScope !== 'global') {
    const targetIdes = new Set(['antigravity']);
    if (activeIDE.id !== 'pixel-crew') {
      targetIdes.add(activeIDE.id);
    }

    const canonicalSkills = getAllCanonicalSkillIds();
    for (const ideId of targetIdes) {
      const idePathFn = PROVIDER_PATHS[ideId];
      if (!idePathFn) continue;

      for (const sName of canonicalSkills) {
        const bundle = await getSkillBundle(sName);
        if (!bundle) continue;
        const ideSkillFile = idePathFn(targetDir, sName);
        await safeWriteFile(ideSkillFile, bundle.content.trim() + '\n', { dryRun, reporter, targetDir });

        if (bundle.references && Object.keys(bundle.references).length > 0) {
          const skillDir = path.dirname(ideSkillFile);
          for (const [refName, refContent] of Object.entries(bundle.references)) {
            const refFullPath = path.join(skillDir, 'references', refName);
            await safeWriteFile(refFullPath, refContent, { dryRun, reporter, targetDir });
          }
        }
      }
    }

    if (activeIDE.id === 'kiro' || targetIdes.has('kiro')) {
      const kiroFiles = generateKiroFiles(targetDir, false);
      for (const kf of kiroFiles) {
        await safeWriteFile(kf.path, kf.content, { dryRun, reporter, targetDir });
      }
    }

    if (activeIDE.id === 'cursor' || targetIdes.has('cursor')) {
      const cursorRulesContent = `# PixelCrew Swarm Rules for Cursor

You are integrated with PixelCrew, an autonomous multi-agent engineering swarm.
Support \`/pixelcrew <command>\` and \`@pixelcrew\` workflows:
- \`/pixelcrew init\` (or \`init\`) — Initialize workspace
- \`/pixelcrew recap\` — Session recap and git changelog
- \`/pixelcrew assemble [prompt]\` — Full-stack multi-agent sprint
- \`/pixelcrew blueprint [prompt]\` — Dynamic DAG planning & wireframes
- \`/pixelcrew boss-fight <issue>\` — Bug blitz
- \`/pixelcrew render\` — Anti-AI visual review
`;
      await safeWriteFile(path.join(targetDir, '.cursorrules'), cursorRulesContent, { dryRun, reporter, targetDir });
    }
  }

  // 2. Install skills to Global IDE directory if scope is global or both
  if (installScope === 'global' || installScope === 'both') {
    const globalPathFn = GLOBAL_PROVIDER_PATHS[activeIDE.id] || GLOBAL_PROVIDER_PATHS['pixel-crew'];
    if (globalPathFn) {
      const canonicalSkills = getAllCanonicalSkillIds();
      for (const sName of canonicalSkills) {
        const bundle = await getSkillBundle(sName);
        const fullGlobalPath = globalPathFn(sName);
        await safeWriteFile(fullGlobalPath, bundle.content.trim() + '\n', { dryRun, reporter, targetDir: os.homedir() });

        if (bundle.references && Object.keys(bundle.references).length > 0) {
          const skillDir = path.dirname(fullGlobalPath);
          for (const [refName, refContent] of Object.entries(bundle.references)) {
            const refFullPath = path.join(skillDir, 'references', refName);
            await safeWriteFile(refFullPath, refContent, { dryRun, reporter, targetDir: os.homedir() });
          }
        }
      }
    }

    if (activeIDE.id === 'kiro') {
      const kiroGlobalFiles = generateKiroFiles(os.homedir(), true);
      for (const kf of kiroGlobalFiles) {
        await safeWriteFile(kf.path, kf.content, { dryRun, reporter, targetDir: os.homedir() });
      }
    }
  }

  // Ensure workspace has clean .gitignore rules (ignoring .vite, .next, .turbo, logs, temp)
  const gitignoreResult = await ensureGitignore(targetDir, { dryRun, reporter });

  if (dryRun) {
    reporter.print();
    return {
      dryRun: true,
      reporter,
      profile,
      pixelCrewDir,
      dashboardDir: path.join(pixelCrewDir, 'dashboard'),
      activeIDE,
      installScope,
      gitignore: gitignoreResult
    };
  }

  console.log('  \x1b[32m✓\x1b[0m Created .pixel-crew/ config.json (tailored agent roles & permissions)');
  console.log('  \x1b[32m✓\x1b[0m Created .pixel-crew/context.json (grounded codebase context)');
  console.log('  \x1b[32m✓\x1b[0m Created .pixel-crew/state.json & pixel.json');
  console.log('  \x1b[32m✓\x1b[0m Created .pixel-crew/events.jsonl');
  console.log(`  \x1b[32m✓\x1b[0m Created ${Object.keys(AGENT_MARKDOWNS).length} agent definitions in .pixel-crew/agents/`);
  console.log(`  \x1b[32m✓\x1b[0m Created ${Object.keys(SKILL_MARKDOWNS).length} skill definitions in .pixel-crew/skills/`);
  if (activeIDE.id !== 'pixel-crew' && installScope !== 'global') {
    console.log(`  \x1b[32m✓\x1b[0m Synced ${Object.keys(SKILL_MARKDOWNS).length} skills into active IDE (.\x1b[36m${activeIDE.id}\x1b[0m/skills/)`);
  }
  if (installScope === 'global' || installScope === 'both') {
    console.log(`  \x1b[32m✓\x1b[0m Installed skills globally for \x1b[36m${activeIDE.name}\x1b[0m (\x1b[90m${activeIDE.globalPath}\x1b[0m)`);
  }
  if (enableDashboard) {
    console.log('  \x1b[32m✓\x1b[0m Created .pixel-crew/dashboard/ (index.html, styles.css, app.js)');
  }
  if (gitignoreResult.created || gitignoreResult.updated) {
    console.log('  \x1b[32m✓\x1b[0m Clean workspace configured in .gitignore (ignoring .vite/, .next/, build/ & cache directories)');
  }

  console.log('\n\x1b[32m\x1b[1mPixel Crew initialized & adapted successfully!\x1b[0m\n');
  console.log('Ready in IDE Chatbox:');
  console.log('  • Type \x1b[36minit\x1b[0m or \x1b[36m/pixelcrew init\x1b[0m in chat to adapt current workspace');
  console.log('  • Type \x1b[36m/recap\x1b[0m in chat to get a token-optimized session changelog');
  console.log('  • Type \x1b[36m/pixelcrew assemble "..."\x1b[0m to run full-stack multi-agent sprint');
  console.log('\nCLI Commands:');
  console.log('  \x1b[36mnpx pixelcrew start\x1b[0m           Launch orchestration server & visual dashboard');
  console.log('  \x1b[36mnpx pixelcrew task "..."\x1b[0m    Dispatch goal or full-stack task to agents');
  console.log('  \x1b[36mnpx pixelcrew recap\x1b[0m          Generate git activity and session recap');
  console.log('  \x1b[36mnpx pixelcrew doctor\x1b[0m          Check available coding agent providers');
  console.log('  \x1b[36mnpx pixelcrew demo\x1b[0m            Run interactive multi-agent visual demo\n');

  return { pixelCrewDir, dashboardDir: path.join(pixelCrewDir, 'dashboard'), profile, gitignore: gitignoreResult };
}

/**
 * Ensures target workspace has clean ignore rules for .vite, .next, and build/cache folders
 */
export async function ensureGitignore(targetDir, { dryRun = false, reporter } = {}) {
  const gitignorePath = path.join(targetDir, '.gitignore');
  const requiredPatterns = [
    'node_modules/',
    '.vite/',
    '.next/',
    '.turbo/',
    'dist/',
    'build/',
    '*.log',
    '.DS_Store',
    '.pixel-temp/',
    'scratch/',
    'tmp/'
  ];

  let existingContent = '';
  let exists = false;
  try {
    existingContent = await fs.readFile(gitignorePath, 'utf-8');
    exists = true;
  } catch {}

  const lines = existingContent.split('\n').map(l => l.trim());
  const missing = requiredPatterns.filter(p => !lines.includes(p));

  if (!exists) {
    const newContent = [
      '# Dependencies',
      'node_modules/',
      'package-lock.json',
      '',
      '# Build and Cache Artifacts',
      '.vite/',
      '.next/',
      '.turbo/',
      'dist/',
      'build/',
      '',
      '# Runtime & Workspace Temp',
      '.pixel-temp/',
      'scratch/',
      'tmp/',
      '',
      '# Logs & OS',
      '*.log',
      '.DS_Store',
      ''
    ].join('\n');

    await safeWriteFile(gitignorePath, newContent, { dryRun, reporter, targetDir });
    return { created: true, updated: false, missing: requiredPatterns };
  } else if (missing.length > 0) {
    const addition = `\n# Build Caches & Workspace Temp\n${missing.join('\n')}\n`;
    const updatedContent = existingContent.endsWith('\n') ? existingContent + addition : existingContent + '\n' + addition;
    await safeWriteFile(gitignorePath, updatedContent, { dryRun, reporter, targetDir });
    return { created: false, updated: true, missing };
  }

  return { created: false, updated: false, missing: [] };
}

