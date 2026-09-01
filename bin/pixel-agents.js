#!/usr/bin/env node

import path from 'node:path';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import { spawn } from 'node:child_process';
import { initializeProject } from '../src/scaffold/init.js';
import { OrchestratorEngine } from '../src/orchestrator/engine.js';
import { createServer } from '../src/server/server.js';
import { defaultCommandRegistry } from '../src/commands/index.js';

const BANNER = `\x1b[36m
 ╔═══════════════════════════════════════════════════════════╗
 ║   PIXEL AGENTS  -  Multi-Agent Orchestration Framework   ║
 ║                      [ ◉ _ ◉ ]                            ║
 ╚═══════════════════════════════════════════════════════════╝\x1b[0m`;

function printHelp() {
  console.log(BANNER);
  console.log(`
\x1b[1mUSAGE:\x1b[0m
  npx pixel-crew <command> [options]
  npx pixel-crew /<slash-command> [args]
  npx pixel-crew /pixelcrew <subcommand> [args]

\x1b[1m🚀 FLOOR 42 CREATION & ARCHITECTURE:\x1b[0m
  \x1b[32massemble\x1b[0m "<prompt>"    Full shape-then-build multi-agent sprint pipeline
  \x1b[32mblueprint\x1b[0m "<prompt>"   Plan UX section topologies & dynamic DAG graph
  \x1b[32mboss-fight\x1b[0m "<issue>"   Targeted swarm bug blitz to isolate and conquer errors
  \x1b[32mmanifest\x1b[0m               Generate root DESIGN.md & PRODUCT.md blueprints
  \x1b[32mretrofit\x1b[0m               Harvest UI components & tokens into design system
  \x1b[32minit\x1b[0m                   Initialize .pixel-crew/ workspace in current project

\x1b[1m🎨 RETRO AESTHETIC & ANTI-AI DIRECTION:\x1b[0m
  \x1b[32mrender\x1b[0m                 6-dimension Anti-AI design & UX review (>= 8.5/10)
  \x1b[32m8bit\x1b[0m                   Inject 8-bit Web Audio chimes, CRT scanlines & tactile joy
  \x1b[32moverdrive\x1b[0m              Engage GPU WebGL shaders & interactive terminal shell
  \x1b[32mchromatic\x1b[0m [palette]    Strategic HSL color token calibration & dark mode
  \x1b[32mtypeset\x1b[0m [preset]       Apply mathematical fluid clamp() typography scales
  \x1b[32mbento\x1b[0m [section]        Reorganize sections into asymmetric Bento grids
  \x1b[32mde-slop\x1b[0m [section]      Strip AI cliché copy with grounded technical specs
  \x1b[32mbolder\x1b[0m / \x1b[32mquieter\x1b[0m        Amplify visual punch or restore calm minimalist balance

\x1b[1m🛡️ PRODUCTION HARDENING & SRE:\x1b[0m
  \x1b[32msentinel\x1b[0m               Defensive security: OWASP audit, RFC 7807 envelopes
  \x1b[32maudit\x1b[0m                  Run technical quality checks (a11y, CWV, Playwright)
  \x1b[32mwarp\x1b[0m                   Full-stack performance tuning & AST token caching (72% savings)
  \x1b[32mpolish\x1b[0m                 Final shipping readiness pass & strict type check
  \x1b[32mcalibrate\x1b[0m [viewport]   Optimize viewports from 360px mobile to 4K desktop
  \x1b[32monboard\x1b[0m                Synthesize first-run onboarding & empty states

\x1b[1m🏢 FLOOR 42 OPERATIONS:\x1b[0m
  \x1b[32moffice\x1b[0m [--port 4747]    Launch Floor 42 live startup office dashboard & preview
  \x1b[32mroster\x1b[0m [list|spawn]    Inspect active agent workstations and task telemetry
  \x1b[32mstart\x1b[0m                  Start multi-agent orchestrator & live pixel dashboard
  \x1b[32msync\x1b[0m                   Synchronize workspace skills across detected agent IDEs
  \x1b[32mdoctor\x1b[0m                 Diagnose environment, LLM keys & provider runtimes
  \x1b[32mhelp\x1b[0m                   Show this help reference


\x1b[1mOPTIONS:\x1b[0m
  --dry-run              Preview file creations and updates without modifying disk
  --provider <name>      Select agent provider (auto, claude-code, cursor, kiro, antigravity, generic, all)
  --target <nextjs|vanilla> Set output target framework (default: nextjs)
  --out <dir>            Set custom output directory
  --port <number>        Set dashboard port (default: 4747)
  --no-open              Do not automatically open the browser
  --yes, -y              Skip prompts and use defaults during init
  --name <name>          Set project name during init

\x1b[1mEXAMPLES:\x1b[0m
  npx pixel-crew craft "Build a modern SaaS analytics platform"
  npx pixel-crew /pixelcrew bolder
  npx pixel-crew /pixelcrew critique
  npx pixel-crew sync --dry-run
  npx pixel-crew start
`);
}


function openBrowser(url) {
  const platform = process.platform;
  let cmd = 'open';
  if (platform === 'win32') cmd = 'start';
  else if (platform === 'linux') cmd = 'xdg-open';

  try {
    spawn(cmd, [url], { detached: true, stdio: 'ignore' }).unref();
  } catch (err) {
    // Ignore browser open errors
  }
}

async function resolveDaemonUrl(rootDir) {
  // 1. Check .pixel-crew/daemon.json or .pixel-agents/daemon.json
  const daemonPaths = [
    path.join(rootDir, '.pixel-crew', 'daemon.json'),
    path.join(rootDir, '.pixel-agents', 'daemon.json')
  ];
  for (const daemonPath of daemonPaths) {
    try {
      const raw = await fs.readFile(daemonPath, 'utf-8');
      const info = JSON.parse(raw);
      if (info?.url) {
        const res = await fetch(`${info.url}/api/info`, { signal: AbortSignal.timeout(600) });
        if (res.ok) {
          const serverInfo = await res.json();
          if (!serverInfo.rootDir || serverInfo.rootDir === rootDir) {
            return info.url;
          }
        }
      }
    } catch {}
  }

  // 2. Scan fallback ports 4747..4755 and verify rootDir
  for (let port = 4747; port <= 4755; port++) {
    try {
      const res = await fetch(`http://localhost:${port}/api/info`, { signal: AbortSignal.timeout(300) });
      if (res.ok) {
        const serverInfo = await res.json();
        if (serverInfo.rootDir && serverInfo.rootDir === rootDir) {
          return `http://localhost:${port}`;
        }
      }
    } catch {}
  }

  return null;
}

function startServerWithPortFallback(server, initialPort, maxTries = 20) {
  return new Promise((resolve, reject) => {
    let currentPort = initialPort;
    let attempts = 0;

    function tryListen() {
      const onError = (err) => {
        server.removeListener('listening', onListening);
        if (err.code === 'EADDRINUSE') {
          attempts++;
          if (attempts >= maxTries) {
            reject(new Error(`Could not find an available port after ${maxTries} attempts (starting at port ${initialPort}).`));
            return;
          }
          currentPort++;
          console.log(`\x1b[33mPort ${currentPort - 1} is already in use. Trying next port ${currentPort}...\x1b[0m`);
          tryListen();
        } else {
          reject(err);
        }
      };

      const onListening = () => {
        server.removeListener('error', onError);
        resolve(currentPort);
      };

      server.once('error', onError);
      server.once('listening', onListening);

      server.listen(currentPort);
    }

    tryListen();
  });
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  // Parse arguments
  const options = {};
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--yes' || args[i] === '-y') options.yes = true;
    else if (args[i] === '--dry-run') options.dryRun = true;
    else if (args[i] === '--no-open') options.noOpen = true;
    else if (args[i] === '--port' && args[i + 1]) options.port = parseInt(args[++i], 10);
    else if (args[i] === '--provider' && args[i + 1]) options.provider = args[++i];
    else if (args[i] === '--target' && args[i + 1]) options.targetFramework = args[++i];
    else if (args[i] === '--out' && args[i + 1]) options.outputDir = args[++i];
    else if (args[i] === '--name' && args[i + 1]) options.name = args[++i];
    else if (args[i] === '--agent' && args[i + 1]) options.agent = args[++i];
    else if (args[i] === '--type' && args[i + 1]) options.type = args[++i];
    else if (args[i] === '--message' && args[i + 1]) options.message = args[++i];
    else if (args[i] === '--global' || args[i] === '-g') options.global = true;
    else if (args[i] === '--scope' && args[i + 1]) options.scope = args[++i];
    else if (args[i] === '--skill' && args[i + 1]) options.skill = args[++i];
    else if (!args[i].startsWith('-') && !options.taskPrompt) {
      options.taskPrompt = args[i];
    }
  }


  const rootDir = process.cwd();

  switch (command) {
    case 'install':
    case 'setup': {
      const { InstallCommand } = await import('../src/commands/install.js');
      const cmd = new InstallCommand();
      const res = await cmd.execute({ targetDir: rootDir, options }, args.slice(1));
      if (res.output) console.log(res.output);
      break;
    }

    case 'init': {
      await initializeProject(rootDir, options);
      break;
    }

    case 'analyze': {
      console.log(BANNER);
      console.log('\n\x1b[36m🔍 Analyzing Codebase Architecture & Context...\x1b[0m\n');
      const { analyzeCodebase } = await import('../src/scaffold/analyzer.js');
      const profile = await analyzeCodebase(rootDir);

      console.log(`\x1b[1mPROJECT:\x1b[0m            ${profile.projectName}`);
      console.log(`\x1b[1mLANGUAGES:\x1b[0m          ${profile.languages.join(', ') || 'None'}`);
      console.log(`\x1b[1mFRAMEWORKS:\x1b[0m         ${profile.frameworks.join(', ') || 'None'}`);
      console.log(`\x1b[1mBACKEND / API:\x1b[0m      ${profile.backend.join(', ') || 'None'}`);
      console.log(`\x1b[1mDATABASE / ORM:\x1b[0m     ${profile.database.join(', ') || 'None'}`);
      console.log(`\x1b[1mTESTING SUITE:\x1b[0m      ${profile.testing.join(', ') || 'None'}`);
      console.log(`\x1b[1mAUTH / SECURITY:\x1b[0m    ${profile.auth.join(', ') || 'None'}`);
      console.log(`\x1b[1mSTYLING SYSTEM:\x1b[0m     ${profile.styling.join(', ') || 'None'}`);
      console.log(`\x1b[1mRECOMMENDED SKILLS:\x1b[0m ${profile.recommendedSkills.join(', ')}\n`);
      break;
    }

    case 'start':
    case 'dev':
    case 'dashboard':
    case 'demo': {
      // Check if project is initialized (.pixel-crew or .pixel-agents)
      const configPaths = [
        path.join(rootDir, '.pixel-crew', 'config.json'),
        path.join(rootDir, '.pixel-agents', 'config.json')
      ];
      let initialized = false;
      for (const cp of configPaths) {
        try {
          await fs.access(cp);
          initialized = true;
          break;
        } catch {}
      }

      if (!initialized) {
        console.log('\x1b[33mProject not initialized yet. Running automatic init...\x1b[0m');
        await initializeProject(rootDir, { yes: true });
      }

      const engine = new OrchestratorEngine(rootDir);
      await engine.initialize();

      const requestedPort = options.port || engine.getConfig()?.dashboard?.port || 4747;
      const server = createServer(engine, options);

      try {
        const boundPort = await startServerWithPortFallback(server, requestedPort);
        const url = `http://localhost:${boundPort}`;

        // Persist daemon discovery file in active directory (.pixel-crew)
        const daemonPath = path.join(engine.activeDir || path.join(rootDir, '.pixel-crew'), 'daemon.json');
        try {
          await fs.writeFile(daemonPath, JSON.stringify({
            port: boundPort,
            pid: process.pid,
            url,
            startedAt: new Date().toISOString()
          }, null, 2), 'utf-8');
        } catch {}

        const cleanupDaemon = () => {
          try { fsSync.unlinkSync(daemonPath); } catch {}
        };
        process.on('exit', cleanupDaemon);
        process.on('SIGINT', () => { cleanupDaemon(); process.exit(0); });
        process.on('SIGTERM', () => { cleanupDaemon(); process.exit(0); });

        console.log(BANNER);
        console.log(`\n\x1b[32m\x1b[1m● PixelCrew Swarm Server Active\x1b[0m`);
        console.log(`  Visual Dashboard:  \x1b[36m\x1b[4m${url}\x1b[0m`);
        console.log(`  Event Stream:      \x1b[36m${url}/api/events\x1b[0m\n`);
        console.log('\x1b[90mPress Ctrl+C to stop.\x1b[0m\n');

        if (!options.noOpen) {
          openBrowser(url);
        }

        // Auto trigger demo if command was 'demo'
        if (command === 'demo') {
          setTimeout(() => {
            const prompt = `Optimize ${engine.getConfig()?.project || 'app'} APIs, database queries & deploy responsive dashboard`;
            console.log(`\x1b[33m[DEMO]\x1b[0m Dispatching swarm mission: "${prompt}"\n`);
            engine.submitTask(prompt).catch(console.error);
          }, 1200);
        }
      } catch (err) {
        console.error(`\x1b[31mFailed to start server:\x1b[0m`, err.message);
        process.exit(1);
      }

      // Stream terminal events as they happen
      engine.on('agent_event', (event) => {
        const time = new Date(event.timestamp).toTimeString().split(' ')[0];
        const agentPadded = (event.agent || 'orchestrator').padEnd(12);
        let color = '\x1b[37m';
        if (event.agent === 'orchestrator') color = '\x1b[33m';
        else if (event.agent === 'frontend') color = '\x1b[36m';
        else if (event.agent === 'backend') color = '\x1b[35m';
        else if (event.agent === 'database') color = '\x1b[33m';
        else if (event.agent === 'security') color = '\x1b[31m';
        else if (event.agent === 'performance') color = '\x1b[32m';
        else if (event.agent === 'qa') color = '\x1b[35m';

        console.log(`\x1b[90m${time}\x1b[0m  ${color}${agentPadded}\x1b[0m → ${event.message}`);
      });

      break;
    }

    case 'goal':
    case 'task': {
      const taskPrompt = options.taskPrompt || args[1];
      if (!taskPrompt) {
        console.error('\x1b[31mError: Please provide a goal or task description.\x1b[0m');
        console.log('Example: npx pixel-agents task "Build modern portfolio with Next.js and E2E tests"');
        process.exit(1);
      }

      // Check if daemon server is running
      const daemonUrl = await resolveDaemonUrl(rootDir);
      if (daemonUrl) {
        try {
          const res = await fetch(`${daemonUrl}/api/task`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: taskPrompt, ...options })
          });
          if (res.ok) {
            console.log(`\x1b[32m✓ Goal dispatched to running swarm daemon (${daemonUrl}):\x1b[0m "${taskPrompt}"`);
            console.log(`Check live status at ${daemonUrl}`);
            return;
          }
        } catch {}
      }

      console.log(BANNER);
      console.log(`\x1b[33m[SWARM RUNNER]\x1b[0m Dispatching objective: "${taskPrompt}"\n`);
      const engine = new OrchestratorEngine(rootDir);
      await engine.initialize();

      engine.on('agent_event', (event) => {
        const time = new Date(event.timestamp).toTimeString().split(' ')[0];
        const agentPadded = (event.agent || 'orchestrator').padEnd(16);
        let color = '\x1b[37m';
        if (event.agent === 'orchestrator') color = '\x1b[33m';
        else if (event.agent === 'frontend') color = '\x1b[36m';
        else if (event.agent === 'backend') color = '\x1b[35m';
        else if (event.agent === 'database') color = '\x1b[33m';
        else if (event.agent === 'security') color = '\x1b[31m';
        else if (event.agent === 'performance') color = '\x1b[32m';
        else if (event.agent === 'qa' || event.agent === 'visualCritic') color = '\x1b[35m';
        else if (event.agent === 'creativeDirector') color = '\x1b[38;5;208m';

        console.log(`\x1b[90m${time}\x1b[0m  ${color}${agentPadded}\x1b[0m → ${event.message}`);
      });

      const result = await engine.submitTask(taskPrompt, options);
      if (typeof result === 'string') {
        console.log('\n\x1b[36m' + result + '\x1b[0m\n');
      } else if (result?.buildResult) {
        console.log(`\n\x1b[32m\x1b[1m✓ Goal completed successfully (${result.buildResult.fileCount} files synthesized):\x1b[0m`);
        console.log(`  Target Directory: \x1b[36m${result.outputDir}\x1b[0m`);
        if (result.targetFramework !== 'vanilla') {
          console.log(`\n\x1b[90mTo start the local development server:\x1b[0m`);
          console.log(`  \x1b[37mcd ${path.relative(process.cwd(), result.outputDir) || result.outputDir}\x1b[0m`);
          console.log(`  \x1b[37mnpm install && npm run dev\x1b[0m\n`);
        }
      }
      console.log('\x1b[32m✓ Sprint mission completed successfully.\x1b[0m\n');
      break;
    }

    case 'emit': {
      const eventData = {
        agent: options.agent || 'orchestrator',
        type: options.type || 'progress',
        message: options.message || 'Manual event trigger',
        skill: options.skill
      };

      const daemonUrl = await resolveDaemonUrl(rootDir);
      if (daemonUrl) {
        try {
          const res = await fetch(`${daemonUrl}/api/emit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
          });
          if (res.ok) {
            console.log(`\x1b[32m✓ Event emitted to live dashboard (${daemonUrl}):\x1b[0m ${eventData.agent} → ${eventData.message}`);
            return;
          }
        } catch {}
      }

      // Local append & persist
      const engine = new OrchestratorEngine(rootDir);
      await engine.initialize();
      await engine.emitEvent(eventData);
      console.log(`\x1b[32m✓ Event recorded to .pixel-crew/events.jsonl:\x1b[0m ${eventData.agent} → ${eventData.message}`);
      break;
    }

    case 'doctor':
    case 'diagnose': {
      const { DoctorCommand } = await import('../src/commands/doctor.js');
      const { defaultProviderRegistry } = await import('../src/adapters/index.js');
      const cmd = new DoctorCommand();
      const res = await cmd.execute({ providerRegistry: defaultProviderRegistry }, args.slice(1));
      console.log(BANNER);
      console.log('\n' + res.output + '\n');
      break;
    }

    case 'assemble':
    case 'craft': {
      const prompt = options.taskPrompt || args.slice(1).join(' ');
      if (!prompt) {
        console.error('\x1b[31mError: Please provide a prompt for /assemble.\x1b[0m');
        console.log('Example: npx pixel-crew assemble "Build modern portfolio with Next.js"');
        process.exit(1);
      }
      const engine = new OrchestratorEngine(rootDir);
      await engine.initialize();
      console.log(BANNER);
      console.log(`\x1b[33m[SWARM SPRINT ASSEMBLY]\x1b[0m Generating project: "${prompt}"\n`);
      const { AssembleCommand } = await import('../src/commands/assemble.js');
      const cmd = new AssembleCommand();
      const result = await cmd.execute({ engine, options }, [prompt]);
      if (result.output) {
        console.log('\n' + result.output + '\n');
      }
      break;
    }

    case 'plan': {
      const prompt = options.taskPrompt || args.slice(1).join(' ');
      if (!prompt) {
        console.error('\x1b[31mError: Please provide a prompt for /plan.\x1b[0m');
        console.log('Example: npx pixel-crew plan "Saas pricing calculator"');
        process.exit(1);
      }
      const { PlanCommand } = await import('../src/commands/plan.js');
      const cmd = new PlanCommand();
      const res = await cmd.execute({ options }, [prompt]);
      console.log(BANNER);
      console.log('\n' + res.output + '\n');
      break;
    }

    case 'build': {
      const prompt = args.slice(1).join(' ');
      const engine = new OrchestratorEngine(rootDir);
      await engine.initialize();
      const res = await engine.executeCommand(`/build ${prompt}`, options);
      if (res.output) console.log(res.output);
      break;
    }

    case 'crew':
    case 'agents': {
      const engine = new OrchestratorEngine(rootDir);
      await engine.initialize();
      const res = await engine.executeCommand(`/crew ${args.slice(1).join(' ')}`, options);
      console.log(BANNER);
      console.log('\n' + res.output + '\n');
      break;
    }

    case 'skills': {
      const { SkillsCommand } = await import('../src/commands/skills.js');
      const cmd = new SkillsCommand();
      const res = await cmd.execute({}, args.slice(1));
      console.log(BANNER);
      console.log('\n' + res.output + '\n');
      break;
    }

    case 'add':
    case 'install': {
      const { AddCommand } = await import('../src/commands/add.js');
      const cmd = new AddCommand();
      const res = await cmd.execute({ targetDir: rootDir, options }, args.slice(1));
      console.log(BANNER);
      console.log('\n' + res.output + '\n');
      break;
    }

    case 'sync': {
      const { SyncCommand } = await import('../src/commands/sync.js');
      const cmd = new SyncCommand();
      const res = await cmd.execute({ targetDir: rootDir, options }, args.slice(1));
      console.log(BANNER);
      console.log('\n' + res.output + '\n');
      break;
    }


    case 'review': {
      const { ReviewCommand } = await import('../src/commands/review.js');
      const cmd = new ReviewCommand();
      const res = await cmd.execute({ engine: new OrchestratorEngine(rootDir) }, args.slice(1));
      console.log(BANNER);
      console.log('\n' + res.output + '\n');
      break;
    }

    case 'fix': {
      const issue = args.slice(1).join(' ');
      const engine = new OrchestratorEngine(rootDir);
      await engine.initialize();
      const res = await engine.executeCommand(`/fix ${issue}`, options);
      if (res.output) console.log(res.output);
      break;
    }

    case 'stop': {
      const engine = new OrchestratorEngine(rootDir);
      await engine.initialize();
      engine.cancelActiveExecution();
      console.log('\x1b[33m✓ Swarm stopped.\x1b[0m\n');
      break;
    }

    case 'status': {
      const engine = new OrchestratorEngine(rootDir);
      await engine.initialize();
      const state = engine.getState();
      const config = engine.getConfig();

      console.log(BANNER);
      console.log(`\n\x1b[1mPROJECT:\x1b[0m ${config?.project || 'my-app'}`);
      console.log(`\x1b[1mSTATUS:\x1b[0m  ${state.status === 'RUNNING' ? '\x1b[32m● RUNNING\x1b[0m' : '\x1b[33mSTANDBY\x1b[0m'}`);
      console.log(`\x1b[1mTASK:\x1b[0m    ${state.activeTask || 'None'}\n`);
      console.log('\x1b[1mAGENT SWARM ROSTER:\x1b[0m');
      console.log('─────────────────────────────────────────────────────────────');
      for (const [key, agent] of Object.entries(config?.agents || {})) {
        const aState = state.agents?.[key] || {};
        const stateColor = aState.state === 'WORKING' ? '\x1b[35m' : (aState.state === 'COMPLETED' ? '\x1b[32m' : '\x1b[90m');
        console.log(`  ${key.padEnd(14)} [${stateColor}${(aState.state || 'IDLE').padEnd(10)}\x1b[0m] ${aState.expression || '●_●'}  ${aState.currentTask || 'Idle'}`);
      }
      console.log('─────────────────────────────────────────────────────────────\n');
      break;
    }

    case 'help':
    case '--help':
    case '-h':
      printHelp();
      break;

    default: {
      const cleanCmd = command.replace(/^\//, '').toLowerCase();
      const matched = defaultCommandRegistry.getCommand(cleanCmd);

      if (matched) {
        const engine = new OrchestratorEngine(rootDir);
        await engine.initialize();
        const fullInput = command.startsWith('/') ? `${command} ${args.slice(1).join(' ')}`.trim() : `/${command} ${args.slice(1).join(' ')}`.trim();
        const res = await defaultCommandRegistry.execute(fullInput, { targetDir: rootDir, options, engine });
        if (res.output) {
          console.log('\n' + res.output + '\n');
        } else if (res.message) {
          console.log('\n\x1b[32m' + res.message + '\x1b[0m\n');
        }
        break;
      }

      if (command.startsWith('/')) {
        const engine = new OrchestratorEngine(rootDir);
        await engine.initialize();
        const fullInput = `${command} ${args.slice(1).join(' ')}`.trim();
        const res = await engine.executeCommand(fullInput, options);
        if (res.output) {
          console.log('\n' + res.output + '\n');
        } else if (res.message) {
          console.log('\n\x1b[32m' + res.message + '\x1b[0m\n');
        }
        break;
      }
      printHelp();
      break;
    }

  }
}

main().catch((err) => {
  console.error('\x1b[31mFatal error:\x1b[0m', err);
  process.exit(1);
});
