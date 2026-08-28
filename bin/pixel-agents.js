#!/usr/bin/env node

import path from 'node:path';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import { spawn } from 'node:child_process';
import { initializeProject } from '../src/scaffold/init.js';
import { OrchestratorEngine } from '../src/orchestrator/engine.js';
import { createServer } from '../src/server/server.js';

const BANNER = `\x1b[36m
 ╔═══════════════════════════════════════════════════════════╗
 ║   PIXEL AGENTS  -  Multi-Agent Orchestration Framework   ║
 ║                      [ ◉ _ ◉ ]                            ║
 ╚═══════════════════════════════════════════════════════════╝\x1b[0m`;

function printHelp() {
  console.log(BANNER);
  console.log(`
\x1b[1mUSAGE:\x1b[0m
  npx pixel-agents <command> [options]

\x1b[1mCOMMANDS:\x1b[0m
  \x1b[32minit\x1b[0m                     Initialize .pixel-agents/ workspace in current project
  \x1b[32manalyze\x1b[0m                  Inspect and display detected frameworks, ORMs, and architecture
  \x1b[32mstart\x1b[0m                    Start multi-agent orchestrator & live pixel dashboard
  \x1b[32mdashboard\x1b[0m                Launch the visual pixel dashboard UI
  \x1b[32mdemo\x1b[0m                     Launch server and run an interactive multi-agent demo
  \x1b[32mtask\x1b[0m "<description>"     Dispatch an objective to the agent swarm
  \x1b[32memit\x1b[0m [options]           Emit an event to the stream (e.g. from external hooks)
  \x1b[32mstatus\x1b[0m                   Display active swarm state and agent roster
  \x1b[32mhelp\x1b[0m                     Show this help reference

\x1b[1mOPTIONS:\x1b[0m
  --port <number>          Set dashboard port (default: 4747)
  --no-open                Do not automatically open the browser
  --yes, -y                Skip prompts and use defaults during init
  --name <name>            Set project name during init
  --agent <name>           Specify agent for emit (e.g. frontend, backend, qa)
  --type <type>            Event type for emit (spawn, thinking, tool, skill, complete, error)
  --message <msg>          Event message for emit
  --skill <skill>          Associated skill for emit

\x1b[1mEXAMPLES:\x1b[0m
  npx pixel-agents init
  npx pixel-agents start
  npx pixel-agents demo
  npx pixel-agents task "Find slow Prisma queries and optimize indexes"
  npx pixel-agents emit --agent database --type tool --skill prisma --message "Analyzing queries"
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
  // 1. Check .pixel-agents/daemon.json
  const daemonPath = path.join(rootDir, '.pixel-agents', 'daemon.json');
  try {
    const raw = await fs.readFile(daemonPath, 'utf-8');
    const info = JSON.parse(raw);
    if (info?.url) {
      const res = await fetch(`${info.url}/api/state`, { signal: AbortSignal.timeout(600) });
      if (res.ok) return info.url;
    }
  } catch {}

  // 2. Scan fallback ports 4747..4755
  for (let port = 4747; port <= 4755; port++) {
    try {
      const res = await fetch(`http://localhost:${port}/api/state`, { signal: AbortSignal.timeout(300) });
      if (res.ok) {
        return `http://localhost:${port}`;
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
      server.removeAllListeners('error');
      server.removeAllListeners('listening');

      server.once('error', (err) => {
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
      });

      server.once('listening', () => {
        resolve(currentPort);
      });

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
    else if (args[i] === '--no-open') options.noOpen = true;
    else if (args[i] === '--port' && args[i + 1]) options.port = parseInt(args[++i], 10);
    else if (args[i] === '--name' && args[i + 1]) options.name = args[++i];
    else if (args[i] === '--agent' && args[i + 1]) options.agent = args[++i];
    else if (args[i] === '--type' && args[i + 1]) options.type = args[++i];
    else if (args[i] === '--message' && args[i + 1]) options.message = args[++i];
    else if (args[i] === '--skill' && args[i + 1]) options.skill = args[++i];
    else if (!args[i].startsWith('-') && !options.taskPrompt) {
      options.taskPrompt = args[i];
    }
  }

  const rootDir = process.cwd();

  switch (command) {
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
      // Check if project is initialized
      const configPath = path.join(rootDir, '.pixel-agents', 'config.json');
      try {
        await fs.access(configPath);
      } catch {
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

        // Persist daemon discovery file
        const daemonPath = path.join(rootDir, '.pixel-agents', 'daemon.json');
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

    case 'task': {
      const taskPrompt = options.taskPrompt || args[1];
      if (!taskPrompt) {
        console.error('\x1b[31mError: Please provide a task description.\x1b[0m');
        console.log('Example: npx pixel-agents task "Optimize Postgres queries"');
        process.exit(1);
      }

      // Check if daemon server is running
      const daemonUrl = await resolveDaemonUrl(rootDir);
      if (daemonUrl) {
        try {
          const res = await fetch(`${daemonUrl}/api/task`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: taskPrompt })
          });
          if (res.ok) {
            console.log(`\x1b[32m✓ Task dispatched to running swarm daemon (${daemonUrl}):\x1b[0m "${taskPrompt}"`);
            console.log(`Check live status at ${daemonUrl}`);
            return;
          }
        } catch {}
      }

      console.log(BANNER);
      console.log(`\x1b[33m[SWARM RUNNER]\x1b[0m Dispatching task: "${taskPrompt}"\n`);
      const engine = new OrchestratorEngine(rootDir);
      await engine.initialize();

      engine.on('agent_event', (event) => {
        const time = new Date(event.timestamp).toTimeString().split(' ')[0];
        const agentPadded = (event.agent || 'orchestrator').padEnd(12);
        console.log(`\x1b[90m${time}\x1b[0m  \x1b[36m${agentPadded}\x1b[0m → ${event.message}`);
      });

      const report = await engine.submitTask(taskPrompt);
      if (report) {
        console.log('\n\x1b[36m' + report + '\x1b[0m\n');
      }
      console.log('\x1b[32m✓ Sprint audit completed successfully.\x1b[0m\n');
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
      console.log(`\x1b[32m✓ Event recorded to .pixel-agents/events.jsonl:\x1b[0m ${eventData.agent} → ${eventData.message}`);
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
    default: {
      printHelp();
      break;
    }
  }
}

main().catch((err) => {
  console.error('\x1b[31mFatal error:\x1b[0m', err);
  process.exit(1);
});
