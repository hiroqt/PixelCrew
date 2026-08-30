import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';
import { DEFAULT_CONFIG, INITIAL_STATE, AGENT_MARKDOWNS, SKILL_MARKDOWNS } from './templates.js';
import { analyzeCodebase, buildAdaptedConfig } from './analyzer.js';
import { safeWriteFile, safeMkdir, DryRunReporter } from '../utils/fs-safe.js';

/**
 * Initializes a new .pixel-agents / .pixel-crew workspace adapted to the target directory
 */
export async function initializeProject(targetDir = process.cwd(), options = {}) {
  const isInteractive = !options.yes && !options.dryRun && process.stdin.isTTY;
  let projectName = options.name || path.basename(targetDir);
  let enableDashboard = true;
  const dryRun = Boolean(options.dryRun);
  const reporter = options.reporter || new DryRunReporter(targetDir);

  if (isInteractive) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('\n\x1b[36m' + `
 ╔═══════════════════════════════════════════════════════════╗
 ║   PIXEL AGENTS  -  Multi-Agent Orchestration Framework   ║
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

    rl.close();
  }

  console.log('\n\x1b[33mInitializing Pixel Agents in:\x1b[0m', targetDir);

  // 1. Deep Codebase Analysis & Context Extraction
  console.log('\x1b[36m🔍 Scanning and analyzing codebase architecture...\x1b[0m');
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
  const pixelAgentsDir = path.join(targetDir, '.pixel-agents');

  const targets = [pixelCrewDir, pixelAgentsDir];

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

  if (dryRun) {
    reporter.print();
    return {
      dryRun: true,
      reporter,
      profile,
      pixelCrewDir,
      pixelAgentsDir,
      dashboardDir: path.join(pixelCrewDir, 'dashboard')
    };
  }

  console.log('  \x1b[32m✓\x1b[0m Created .pixel-crew/ & .pixel-agents/ config.json (tailored agent roles & permissions)');
  console.log('  \x1b[32m✓\x1b[0m Created .pixel-crew/context.json (grounded codebase context)');
  console.log('  \x1b[32m✓\x1b[0m Created .pixel-crew/state.json & pixel.json');
  console.log('  \x1b[32m✓\x1b[0m Created .pixel-crew/events.jsonl');
  console.log(`  \x1b[32m✓\x1b[0m Created ${Object.keys(AGENT_MARKDOWNS).length} agent definitions in .pixel-crew/agents/`);
  console.log(`  \x1b[32m✓\x1b[0m Created ${Object.keys(SKILL_MARKDOWNS).length} skill definitions in .pixel-crew/skills/`);
  if (enableDashboard) {
    console.log('  \x1b[32m✓\x1b[0m Created .pixel-crew/dashboard/ (index.html, styles.css, app.js)');
  }

  console.log('\n\x1b[32m\x1b[1mPixel Crew initialized & adapted successfully!\x1b[0m\n');
  console.log('Next steps:');
  console.log('  \x1b[36mnpx pixelcrew start\x1b[0m           Launch orchestration server & visual dashboard');
  console.log('  \x1b[36mnpx pixelcrew task "..."\x1b[0m    Dispatch goal or full-stack task to agents');
  console.log('  \x1b[36mnpx pixelcrew doctor\x1b[0m          Check available coding agent providers');
  console.log('  \x1b[36mnpx pixelcrew demo\x1b[0m            Run interactive multi-agent visual demo\n');

  return { pixelCrewDir, pixelAgentsDir, dashboardDir: path.join(pixelCrewDir, 'dashboard'), profile };
}

