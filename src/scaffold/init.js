import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';
import { DEFAULT_CONFIG, INITIAL_STATE, AGENT_MARKDOWNS, SKILL_MARKDOWNS } from './templates.js';
import { analyzeCodebase, buildAdaptedConfig } from './analyzer.js';

/**
 * Initializes a new .pixel-agents workspace adapted to the target directory
 */
export async function initializeProject(targetDir = process.cwd(), options = {}) {
  const isInteractive = !options.yes && process.stdin.isTTY;
  let projectName = options.name || path.basename(targetDir);
  let enableDashboard = true;

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
  const pixelAgentsDir = path.join(targetDir, '.pixel-agents');
  const agentsDir = path.join(pixelAgentsDir, 'agents');
  const skillsDir = path.join(pixelAgentsDir, 'skills');
  const reportsDir = path.join(pixelAgentsDir, 'reports');
  const dashboardDir = path.join(pixelAgentsDir, 'dashboard');

  // Create directories inside .pixel-agents
  await fs.mkdir(pixelAgentsDir, { recursive: true });
  await fs.mkdir(agentsDir, { recursive: true });
  await fs.mkdir(skillsDir, { recursive: true });
  await fs.mkdir(reportsDir, { recursive: true });
  if (enableDashboard) {
    await fs.mkdir(dashboardDir, { recursive: true });
  }

  // 2. Build Context-Adapted Config
  const adaptedConfig = buildAdaptedConfig(profile, options);
  adaptedConfig.project = projectName;
  adaptedConfig.dashboard.enabled = enableDashboard;

  await fs.writeFile(
    path.join(pixelAgentsDir, 'config.json'),
    JSON.stringify(adaptedConfig, null, 2),
    'utf-8'
  );
  console.log('  \x1b[32m✓\x1b[0m Created .pixel-agents/config.json (tailored agent roles & permissions)');

  // 3. Write Codebase Context Cache
  await fs.writeFile(
    path.join(pixelAgentsDir, 'context.json'),
    JSON.stringify(profile, null, 2),
    'utf-8'
  );
  console.log('  \x1b[32m✓\x1b[0m Created .pixel-agents/context.json (grounded codebase context)');

  // 4. Write state.json
  const state = JSON.parse(JSON.stringify(INITIAL_STATE));
  state.startedAt = new Date().toISOString();
  await fs.writeFile(
    path.join(pixelAgentsDir, 'state.json'),
    JSON.stringify(state, null, 2),
    'utf-8'
  );
  console.log('  \x1b[32m✓\x1b[0m Created .pixel-agents/state.json');

  // 5. Write initial events.jsonl
  const initialEvent = {
    id: 'evt-0',
    timestamp: Date.now(),
    agent: 'orchestrator',
    type: 'spawn',
    message: `Pixel Agents swarm initialized & adapted to ${profile.frameworks.join(', ') || 'codebase'}`,
    metadata: { version: '0.1.0', profile }
  };
  await fs.writeFile(
    path.join(pixelAgentsDir, 'events.jsonl'),
    JSON.stringify(initialEvent) + '\n',
    'utf-8'
  );
  console.log('  \x1b[32m✓\x1b[0m Created .pixel-agents/events.jsonl');

  // 6. Write agents/*.md
  for (const [filename, content] of Object.entries(AGENT_MARKDOWNS)) {
    await fs.writeFile(path.join(agentsDir, filename), content.trim() + '\n', 'utf-8');
  }
  console.log(`  \x1b[32m✓\x1b[0m Created ${Object.keys(AGENT_MARKDOWNS).length} agent definitions in .pixel-agents/agents/`);

  // 7. Write skills/*.md
  for (const [filename, content] of Object.entries(SKILL_MARKDOWNS)) {
    await fs.writeFile(path.join(skillsDir, filename), content.trim() + '\n', 'utf-8');
  }
  console.log(`  \x1b[32m✓\x1b[0m Created ${Object.keys(SKILL_MARKDOWNS).length} skill definitions in .pixel-agents/skills/`);

  // 8. Copy dashboard static files if enabled
  if (enableDashboard) {
    const srcDashboardDir = fileURLToPath(new URL('../dashboard', import.meta.url));
    try {
      const html = await fs.readFile(path.join(srcDashboardDir, 'index.html'), 'utf-8');
      const css = await fs.readFile(path.join(srcDashboardDir, 'styles.css'), 'utf-8');
      const js = await fs.readFile(path.join(srcDashboardDir, 'app.js'), 'utf-8');

      await fs.writeFile(path.join(dashboardDir, 'index.html'), html, 'utf-8');
      await fs.writeFile(path.join(dashboardDir, 'styles.css'), css, 'utf-8');
      await fs.writeFile(path.join(dashboardDir, 'app.js'), js, 'utf-8');
      console.log('  \x1b[32m✓\x1b[0m Created .pixel-agents/dashboard/ (index.html, styles.css, app.js)');
    } catch (err) {
      // ignore
    }
  }

  console.log('\n\x1b[32m\x1b[1mPixel Crew initialized & adapted successfully!\x1b[0m\n');
  console.log('Next steps:');
  console.log('  \x1b[36mnpx pixelcrew start\x1b[0m           Launch orchestration server & visual dashboard');
  console.log('  \x1b[36mnpx pixelcrew oneshot "..."\x1b[0m   Synthesize custom Next.js project with agents');
  console.log('  \x1b[36mnpx pixelcrew demo\x1b[0m            Run interactive multi-agent visual demo\n');

  return { pixelAgentsDir, dashboardDir, profile };
}
