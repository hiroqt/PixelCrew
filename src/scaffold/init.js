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
import { generateCursorFiles, generateAntigravityFiles, generateClaudeFiles, generateAllIDERules } from './ide-rules.js';
import { safeWriteFile, safeMkdir, DryRunReporter } from '../utils/fs-safe.js';

/**
 * Initializes a new .pixel-crew workspace adapted to the target directory
 */
export async function initializeProject(targetDir = process.cwd(), options = {}) {
  const isInteractive = !options.yes && !options.dryRun && process.stdin.isTTY;
  let projectName = options.name || path.basename(targetDir);
  let enableDashboard = true;
  const activeIDE = detectActiveIDE(targetDir);
  let installScope = options.scope || (options.global ? 'global' : 'project');
  let chosenProvider = options.provider || null;
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

    if (!chosenProvider) {
      const isDetected = activeIDE.id !== 'pixel-crew';
      console.log(`\n\x1b[36mTarget AI IDE Selection:\x1b[0m`);
      console.log(`  1) ${isDetected ? `${activeIDE.name} (Auto-detected)` : 'Kiro AI (.kiro/ & .kirorules)'} [Default]`);
      console.log(`  2) Cursor IDE (.cursor/ & .cursorrules)`);
      console.log(`  3) Google Antigravity (.agents/ & AGENTS.md)`);
      console.log(`  4) Claude Code (.claude/ & CLAUDE.md)`);
      console.log(`  5) Clean CLI only (.pixel-crew/ only — zero extra folders)`);
      console.log(`  6) Multi-IDE (Configure all IDEs)`);

      const ideAns = await rl.question(`Choice [1-6] (1): `);
      const trimmedIde = ideAns.trim();
      if (trimmedIde === '1' || trimmedIde === '') {
        chosenProvider = isDetected ? activeIDE.id : 'kiro';
      } else if (trimmedIde === '2' || trimmedIde.toLowerCase() === 'cursor') {
        chosenProvider = 'cursor';
      } else if (trimmedIde === '3' || trimmedIde.toLowerCase() === 'antigravity' || trimmedIde.toLowerCase() === 'agents') {
        chosenProvider = 'antigravity';
      } else if (trimmedIde === '4' || trimmedIde.toLowerCase() === 'claude') {
        chosenProvider = 'claude-code';
      } else if (trimmedIde === '5' || trimmedIde.toLowerCase() === 'none' || trimmedIde.toLowerCase() === 'cli') {
        chosenProvider = 'none';
      } else if (trimmedIde === '6' || trimmedIde.toLowerCase() === 'all' || trimmedIde.toLowerCase() === 'multi') {
        chosenProvider = 'all';
      }
    }

    if (!options.scope && !options.global) {
      console.log(`\nSelect skill installation scope:`);
      console.log(`  1) Project Workspace (.pixel-crew/ and active IDE) [Default]`);
      console.log(`  2) Global (${activeIDE.name}: ${activeIDE.globalPath} — available in ANY folder)`);
      console.log(`  3) Both (Project Workspace + Global config)`);

      const scopeAns = await rl.question(`Choice [1-3] (1): `);
      const trimmed = scopeAns.trim();
      if (trimmed === '2' || trimmed.toLowerCase() === 'global') installScope = 'global';
      else if (trimmed === '3' || trimmed.toLowerCase() === 'both') installScope = 'both';
      else installScope = 'project';
    }

    rl.close();
  }

  if (!chosenProvider) {
    chosenProvider = activeIDE.id !== 'pixel-crew' ? activeIDE.id : 'none';
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

  // 1. Install skills to IDE project directories (.kiro, .cursor, .agents, .claude)
  let targetIdes = [];
  if (installScope !== 'global') {
    if (chosenProvider === 'all' || chosenProvider === 'multi') {
      targetIdes = ['kiro', 'cursor', 'antigravity', 'claude-code'];
    } else if (chosenProvider && chosenProvider !== 'none' && chosenProvider !== 'pixel-crew' && chosenProvider !== 'cli') {
      const p = chosenProvider.toLowerCase();
      if (p === 'claude') targetIdes = ['claude-code'];
      else if (p === 'agents') targetIdes = ['antigravity'];
      else if (PROVIDER_PATHS[p]) targetIdes = [p];
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

    // Generate Kiro workflows, prompts, and rules
    if (targetIdes.includes('kiro')) {
      const kiroFiles = generateKiroFiles(targetDir, false);
      for (const kf of kiroFiles) {
        await safeWriteFile(kf.path, kf.content, { dryRun, reporter, targetDir });
      }
    }

    // Generate Cursor rules & Cursor 2.0 rules
    if (targetIdes.includes('cursor')) {
      const cursorFiles = generateCursorFiles(targetDir);
      for (const cf of cursorFiles) {
        await safeWriteFile(cf.path, cf.content, { dryRun, reporter, targetDir });
      }
    }

    // Generate Antigravity agent instructions & workspace rules
    if (targetIdes.includes('antigravity')) {
      const antigravityFiles = generateAntigravityFiles(targetDir);
      for (const af of antigravityFiles) {
        await safeWriteFile(af.path, af.content, { dryRun, reporter, targetDir });
      }
    }

    // Generate Claude Code instructions & plugin manifest
    if (targetIdes.includes('claude-code')) {
      const claudeFiles = generateClaudeFiles(targetDir);
      for (const clf of claudeFiles) {
        await safeWriteFile(clf.path, clf.content, { dryRun, reporter, targetDir });
      }
    }
  }

  // 2. Install skills to Global IDE directory if scope is global, both, or all
  if (installScope === 'global' || installScope === 'both' || installScope === 'all') {
    const globalProviders = installScope === 'all'
      ? Object.keys(GLOBAL_PROVIDER_PATHS)
      : (options.provider && options.provider !== 'auto'
          ? (options.provider === 'all' ? Object.keys(GLOBAL_PROVIDER_PATHS) : [options.provider.toLowerCase() === 'claude' ? 'claude-code' : (options.provider.toLowerCase() === 'agents' ? 'antigravity' : options.provider.toLowerCase())])
          : [activeIDE.id]);

    for (const gp of globalProviders) {
      const globalPathFn = GLOBAL_PROVIDER_PATHS[gp];
      if (!globalPathFn) continue;

      const canonicalSkills = getAllCanonicalSkillIds();
      for (const sName of canonicalSkills) {
        const bundle = await getSkillBundle(sName);
        if (!bundle) continue;
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

    if (globalProviders.includes('kiro')) {
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

  console.log('  \x1b[32m✓\x1b[0m Created .pixel-crew/ (config.json, context.json, state.json, events.jsonl, pixel.json)');
  console.log(`  \x1b[32m✓\x1b[0m Created ${Object.keys(AGENT_MARKDOWNS).length} agent definitions in .pixel-crew/agents/`);
  console.log(`  \x1b[32m✓\x1b[0m Created ${Object.keys(SKILL_MARKDOWNS).length} skill definitions in .pixel-crew/skills/`);
  if (installScope !== 'global' && targetIdes.length > 0) {
    if (targetIdes.includes('kiro')) {
      console.log(`  \x1b[32m✓\x1b[0m Generated Kiro workflows & prompts (.kiro/workflows/, .kiro/prompts/, .kirorules)`);
    }
    if (targetIdes.includes('cursor')) {
      console.log(`  \x1b[32m✓\x1b[0m Generated Cursor rules (.cursorrules, .cursor/rules/pixelcrew.mdc)`);
    }
    if (targetIdes.includes('antigravity')) {
      console.log(`  \x1b[32m✓\x1b[0m Generated Antigravity agent instructions (AGENTS.md, GEMINI.md, .agents/rules/)`);
    }
    if (targetIdes.includes('claude-code')) {
      console.log(`  \x1b[32m✓\x1b[0m Generated Claude Code instructions (CLAUDE.md, .claude-plugin/)`);
    }
  }
  if (installScope === 'global' || installScope === 'both' || installScope === 'all') {
    console.log(`  \x1b[32m✓\x1b[0m Installed skills globally for \x1b[36m${activeIDE.name}\x1b[0m (\x1b[90m${activeIDE.globalPath}\x1b[0m)`);
  }
  if (enableDashboard) {
    console.log('  \x1b[32m✓\x1b[0m Created .pixel-crew/dashboard/ (index.html, styles.css, app.js)');
  }
  if (gitignoreResult.created || gitignoreResult.updated) {
    console.log('  \x1b[32m✓\x1b[0m Clean workspace configured in .gitignore (ignoring .vite/, .next/, build/ & cache directories)');
  }

  const ideLabel = targetIdes.length === 1
    ? (targetIdes[0] === 'kiro' ? 'Kiro AI' : targetIdes[0] === 'cursor' ? 'Cursor IDE' : targetIdes[0] === 'antigravity' ? 'Antigravity' : 'Claude Code')
    : (targetIdes.length > 1 ? 'AI IDE' : 'Pixel Crew');

  console.log('\n\x1b[32m\x1b[1mPixel Crew initialized & adapted successfully!\x1b[0m\n');
  console.log(`Ready in ${ideLabel} Chatbox:`);
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

