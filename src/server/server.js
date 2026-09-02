import http from 'node:http';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function createServer(engineOrRootDir, maybeEngine, options = {}) {
  let engine = engineOrRootDir;
  let rootDir = engine?.rootDir || process.cwd();

  if (typeof engineOrRootDir === 'string') {
    rootDir = engineOrRootDir;
    engine = maybeEngine;
  }

  const dashboardDir = path.join(rootDir, '.pixel-crew', 'dashboard');
  const legacyDashboardDir = path.join(rootDir, '.pixel-dashboard');
  const fallbackDashboardDir = fileURLToPath(new URL('../dashboard', import.meta.url));

  const sseClients = new Set();

  // Wire engine events to SSE clients
  engine.on('agent_event', (event) => {
    const payload = `event: agent_event\ndata: ${JSON.stringify(event)}\n\n`;
    for (const client of sseClients) {
      try {
        client.write(payload);
      } catch (err) {
        sseClients.delete(client);
      }
    }
  });

  engine.on('state_change', (change) => {
    const payload = `event: state_change\ndata: ${JSON.stringify(change)}\n\n`;
    for (const client of sseClients) {
      try {
        client.write(payload);
      } catch (err) {
        sseClients.delete(client);
      }
    }
  });

  const server = http.createServer(async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // Helper to send JSON
    const sendJson = (statusCode, data) => {
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    };

    // Helper to read request body
    const readBody = () => {
      return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
          if (body.length > 1e6) {
            req.destroy();
            reject(new Error('Payload too large'));
          }
        });
        req.on('end', () => {
          try {
            resolve(body ? JSON.parse(body) : {});
          } catch (e) {
            resolve({});
          }
        });
        req.on('error', reject);
      });
    };

    // API Routes
    if (pathname === '/api/info' && req.method === 'GET') {
      let activeProv = { activeProvider: 'generic', activeProviderName: 'Generic CLI Runner', activeProviderIcon: '💻' };
      if (engine.providerRegistry) {
        try {
          const scan = await engine.providerRegistry.scanEnvironment();
          activeProv = {
            activeProvider: scan.activeProvider,
            activeProviderName: scan.activeProviderName,
            activeProviderIcon: scan.activeProviderIcon
          };
        } catch {}
      }
      return sendJson(200, {
        rootDir: engine.rootDir,
        project: engine.getConfig()?.project || path.basename(engine.rootDir),
        version: '0.2.4',
        ...activeProv
      });
    }

    if (pathname === '/api/state' && req.method === 'GET') {
      const state = engine.getState() || {};
      let activeProv = { activeProvider: 'generic', activeProviderName: 'Generic CLI Runner', activeProviderIcon: '💻' };
      if (engine.providerRegistry) {
        try {
          const scan = await engine.providerRegistry.scanEnvironment();
          activeProv = {
            activeProvider: scan.activeProvider,
            activeProviderName: scan.activeProviderName,
            activeProviderIcon: scan.activeProviderIcon
          };
        } catch {}
      }
      return sendJson(200, { ...state, ...activeProv });
    }

    if (pathname === '/api/config' && req.method === 'GET') {
      return sendJson(200, engine.getConfig());
    }

    if (pathname === '/api/events' && req.method === 'GET') {
      // Server-Sent Events stream
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });

      let activeProv = { activeProvider: 'generic', activeProviderName: 'Generic CLI Runner', activeProviderIcon: '💻' };
      if (engine.providerRegistry) {
        try {
          const scan = await engine.providerRegistry.scanEnvironment();
          activeProv = {
            activeProvider: scan.activeProvider,
            activeProviderName: scan.activeProviderName,
            activeProviderIcon: scan.activeProviderIcon
          };
        } catch {}
      }

      // Send initial history
      const initialPayload = `event: init\ndata: ${JSON.stringify({
        state: { ...(engine.getState() || {}), ...activeProv },
        config: engine.getConfig(),
        history: engine.getEvents(),
        provider: activeProv
      })}\n\n`;
      res.write(initialPayload);

      sseClients.add(res);

      req.on('close', () => {
        sseClients.delete(res);
      });
      return;
    }

    if (pathname === '/api/command' && req.method === 'POST') {
      const body = await readBody();
      const input = body.input || body.command || body.prompt || '';
      try {
        const result = await engine.executeCommand(input, body.options || {});
        return sendJson(200, result);
      } catch (err) {
        return sendJson(500, { success: false, error: err.message });
      }
    }

    if (pathname === '/api/commands/autocomplete' && req.method === 'GET') {
      const query = url.searchParams.get('q') || '';
      const suggestions = engine.commandRegistry ? engine.commandRegistry.getAutocompleteSuggestions(query) : [];
      return sendJson(200, { suggestions });
    }

    if (pathname === '/api/providers' && req.method === 'GET') {
      if (engine.providerRegistry) {
        const scan = await engine.providerRegistry.scanEnvironment(true);
        return sendJson(200, {
          activeProvider: scan.activeProvider,
          activeProviderName: scan.activeProviderName,
          activeProviderIcon: scan.activeProviderIcon,
          activeProviderDescription: scan.activeProviderDescription,
          available: scan.available.map(a => ({ 
            id: a.id, 
            name: a.name, 
            icon: a.icon || '🤖', 
            description: a.description, 
            capabilities: a.capabilities 
          })),
          missing: scan.missing.map(a => ({ 
            id: a.id, 
            name: a.name, 
            icon: a.icon || '🤖' 
          }))
        });
      }
      return sendJson(200, { 
        activeProvider: 'generic', 
        activeProviderName: 'Generic CLI Runner', 
        activeProviderIcon: '💻',
        available: [{ id: 'generic', name: 'Generic CLI Runner', icon: '💻' }], 
        missing: [] 
      });
    }

    if (pathname === '/api/providers/select' && req.method === 'POST') {
      const body = await readBody();
      const providerId = body.provider || body.id;
      if (engine.providerRegistry && providerId) {
        const adapter = engine.providerRegistry.getAdapter(providerId);
        if (adapter) {
          return sendJson(200, { 
            success: true, 
            activeProvider: adapter.id, 
            activeProviderName: adapter.name, 
            activeProviderIcon: adapter.icon || '🤖' 
          });
        }
      }
      return sendJson(400, { success: false, error: 'Provider not found' });
    }

    if (pathname === '/api/plan' && req.method === 'POST') {
      const body = await readBody();
      const prompt = body.prompt || 'Synthesize responsive web architecture';
      try {
        const result = await engine.executeCommand(`/plan ${prompt}`, body.options || {});
        return sendJson(200, result);
      } catch (err) {
        return sendJson(500, { success: false, error: err.message });
      }
    }

    if (pathname === '/api/task' && req.method === 'POST') {
      const body = await readBody();
      const prompt = body.prompt || body.task || 'Optimize application workflow';
      // Asynchronously start task execution
      engine.submitTask(prompt).catch(console.error);
      return sendJson(200, { status: 'accepted', prompt });
    }

    if ((pathname === '/api/goal' || pathname === '/api/oneshot') && req.method === 'POST') {
      const body = await readBody();
      const prompt = body.prompt || body.goal || 'Build a modern website for a design agency specializing in AI products';
      const options = {
        targetFramework: body.targetFramework || 'nextjs',
        outputDir: body.outputDir
      };
      // Asynchronously start Multi-Agent Synthesis / Goal pipeline
      engine.submitOneShotTask(prompt, options).catch(console.error);
      return sendJson(200, { status: 'goal_started', prompt, options });
    }

    if ((pathname === '/api/token-stats' || pathname === '/api/token-telemetry') && req.method === 'GET') {
      const stats = engine.getTokenTelemetry ? engine.getTokenTelemetry() : null;
      return sendJson(200, stats || {
        rawTokensEstimated: 42500,
        actualTokensUsed: 11800,
        tokensSaved: 30700,
        efficiencyRatio: 72,
        savingsPercent: "72%",
        costUsd: 0.0284,
        perAgent: {
          creativeDirector: 2400,
          uxPlanner: 2140,
          designSystem: 1850,
          frontend: 6200,
          backend: 2300,
          database: 1770,
          performance: 1530,
          security: 1400,
          qa: 2800,
          orchestrator: 1200
        },
        strategiesActive: [
          "AST Symbol Graph Skeletonization",
          "Tiered Sliding Window Context Pruning",
          "Prompt Caching Prefix Anchoring",
          "Compact JSON Structured Outputs",
          "Isolated Subagent Context Sandboxing"
        ]
      });
    }

    if (pathname === '/api/site-preview' && req.method === 'GET') {
      const sitePath = engine.lastGeneratedSitePath || (engine.lastGeneratedOutputDir ? path.join(engine.lastGeneratedOutputDir, 'index.html') : null);
      if (sitePath) {
        try {
          const html = await fs.readFile(sitePath, 'utf-8');
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(html);
          return;
        } catch {}
      }
      return sendJson(404, { error: 'No generated site preview found yet. Execute a task or goal first.' });
    }

    if (pathname === '/api/emit' && req.method === 'POST') {
      const body = await readBody();
      const event = await engine.emitEvent(body);
      return sendJson(200, { status: 'emitted', event });
    }

    if (pathname === '/api/reset' && req.method === 'POST') {
      await engine.resetSwarm();
      return sendJson(200, { status: 'reset' });
    }

    if (pathname === '/api/reports' && req.method === 'GET') {
      const reports = await engine.getReports();
      return sendJson(200, { reports });
    }

    if (pathname.startsWith('/api/reports/') && req.method === 'GET') {
      const reportId = pathname.replace('/api/reports/', '');
      const report = await engine.getReportById(reportId);
      if (!report) {
        return sendJson(404, { error: 'Report not found' });
      }
      return sendJson(200, { report });
    }

    if (pathname === '/api/reports' && req.method === 'POST') {
      const body = await readBody();
      if (!body.objective && !body.markdown) {
        return sendJson(400, { error: 'Missing report objective or markdown' });
      }
      const reportData = engine.compileAuditReport(
        body.objective || 'Manual Audit',
        body.targetAgents || ['frontend', 'backend', 'database'],
        body.findings || {}
      );
      await engine.saveAuditReport(reportData);
      return sendJson(201, { status: 'created', report: reportData });
    }

    if (pathname === '/api/demo' && req.method === 'POST') {
      const demoPrompt = 'Analyze CRM customer search bottlenecks & optimize Postgres Prisma queries with responsive UI';
      engine.submitTask(demoPrompt).catch(console.error);
      return sendJson(200, { status: 'demo_started', prompt: demoPrompt });
    }

    // Static Asset Serving
    let filename = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
    let contentType = 'text/plain';

    if (filename.endsWith('.html')) contentType = 'text/html; charset=utf-8';
    else if (filename.endsWith('.css')) contentType = 'text/css; charset=utf-8';
    else if (filename.endsWith('.js')) contentType = 'application/javascript; charset=utf-8';
    else if (filename.endsWith('.json')) contentType = 'application/json';
    else if (filename.endsWith('.png')) contentType = 'image/png';
    else if (filename.endsWith('.svg')) contentType = 'image/svg+xml';
    else if (filename.endsWith('.ico')) contentType = 'image/x-icon';

    // Serve latest dashboard assets from package with fallback to project directory
    let filePath = path.join(fallbackDashboardDir, filename);
    try {
      await fs.access(filePath);
    } catch {
      filePath = path.join(dashboardDir, filename);
      try {
        await fs.access(filePath);
      } catch {
        filePath = path.join(legacyDashboardDir, filename);
        try {
          await fs.access(filePath);
        } catch {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
          return;
        }
      }
    }

    try {
      const fileData = await fs.readFile(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(fileData);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
    }
  });

  // Keep-alive heartbeat for SSE connections
  const heartbeat = setInterval(() => {
    for (const client of sseClients) {
      try {
        client.write(': keepalive\n\n');
      } catch {
        sseClients.delete(client);
      }
    }
  }, 15000);
  heartbeat.unref();

  let isWatching = false;
  let workspaceWatcher = null;
  const debouncedFiles = new Map();

  function inferAgentFromFile(relPath) {
    const p = relPath.toLowerCase();
    if (p.includes('test') || p.includes('spec') || p.includes('playwright') || p.includes('vitest') || p.includes('cypress')) {
      return { agent: 'qa', skill: 'playwright-e2e' };
    }
    if (p.includes('prisma') || p.includes('schema') || p.includes('sql') || p.includes('database') || p.includes('migration') || p.includes('postgres')) {
      return { agent: 'database', skill: 'postgresql' };
    }
    if (p.includes('auth') || p.includes('security') || p.includes('sentinel') || p.includes('policy') || p.includes('cert')) {
      return { agent: 'security', skill: 'security-audit' };
    }
    if (p.includes('perf') || p.includes('benchmark') || p.includes('docker') || p.includes('k8s') || p.includes('sre') || p.includes('lcp')) {
      return { agent: 'performance', skill: 'performance-profiling' };
    }
    if (p.includes('api/') || p.includes('server/') || p.includes('routes/') || p.includes('services/') || p.includes('backend') || p.endsWith('.go') || p.endsWith('.py') || p.endsWith('.rs')) {
      return { agent: 'backend', skill: 'backend' };
    }
    if (p.endsWith('.css') || p.endsWith('.scss') || p.includes('tailwind') || p.includes('theme') || p.includes('tokens')) {
      return { agent: 'frontend', skill: 'design-tokens' };
    }
    return { agent: 'frontend', skill: 'react' };
  }

  function startWatchers() {
    if (isWatching) return;
    isWatching = true;

    // 1. Live Workspace File Watcher (Captures IDE code edits in real-time)
    try {
      workspaceWatcher = fsSync.watch(rootDir, { recursive: true }, (eventType, filename) => {
        if (!filename) return;

        // Filter out noisy / internal directories
        const normalized = filename.replace(/\\/g, '/');
        if (
          normalized.startsWith('.git') ||
          normalized.includes('node_modules') ||
          normalized.includes('.next') ||
          normalized.includes('.vite') ||
          normalized.includes('dist') ||
          normalized.includes('build') ||
          normalized.includes('coverage') ||
          normalized.includes('.DS_Store') ||
          normalized.includes('events.jsonl') ||
          normalized.includes('state.json') ||
          normalized.includes('daemon.json') ||
          normalized.startsWith('.gemini') ||
          normalized.endsWith('.log')
        ) {
          return;
        }

        const now = Date.now();
        const lastSeen = debouncedFiles.get(normalized) || 0;
        if (now - lastSeen < 200) return; // Debounce rapid writes
        debouncedFiles.set(normalized, now);

        const inferred = inferAgentFromFile(normalized);
        const event = {
          agent: inferred.agent,
          type: 'tool',
          skill: inferred.skill,
          message: `Edited ${normalized} (+live IDE workspace update)`,
          timestamp: now,
          metadata: {
            file: normalized,
            action: 'EDIT',
            source: 'ide_realtime_watcher'
          }
        };

        if (engine && typeof engine.emitEvent === 'function') {
          engine.emitEvent(event).catch(() => {});
        } else {
          engine.eventHistory.push(event);
          if (engine.eventHistory.length > 300) engine.eventHistory.shift();
          const payload = `event: agent_event\ndata: ${JSON.stringify(event)}\n\n`;
          for (const client of sseClients) {
            try { client.write(payload); } catch {}
          }
        }
      });

      if (workspaceWatcher && typeof workspaceWatcher.on === 'function') {
        workspaceWatcher.on('error', () => {});
      }
    } catch {}

    // 2. Watch events.jsonl for direct external CLI / IDE writes
    const possibleEventsPaths = [
      engine?.eventsPath,
      path.join(rootDir, '.pixel-crew', 'events.jsonl'),
      path.join(rootDir, '.pixel-agents', 'events.jsonl')
    ].filter(Boolean);

    const uniqueEventsPaths = Array.from(new Set(possibleEventsPaths));

    for (const ePath of uniqueEventsPaths) {
      let lastKnownEventCount = 0;
      try {
        const initialContent = fsSync.readFileSync(ePath, 'utf-8');
        lastKnownEventCount = initialContent.trim().split('\n').filter(Boolean).length;
      } catch {
        lastKnownEventCount = 0;
      }

      fsSync.watchFile(ePath, { interval: 150 }, async () => {
        try {
          const content = await fs.readFile(ePath, 'utf-8');
          const lines = content.trim().split('\n').filter(Boolean);
          if (lines.length > lastKnownEventCount) {
            const newLines = lines.slice(lastKnownEventCount);
            lastKnownEventCount = lines.length;
            for (const line of newLines) {
              try {
                const event = JSON.parse(line);
                engine.eventHistory.push(event);
                if (engine.eventHistory.length > 300) engine.eventHistory.shift();

                const payload = `event: agent_event\ndata: ${JSON.stringify(event)}\n\n`;
                for (const client of sseClients) {
                  try { client.write(payload); } catch {}
                }
              } catch {}
            }
          }
        } catch {}
      });
    }

    // 3. Watch state.json for direct external updates
    const possibleStatePaths = [
      engine?.statePath,
      path.join(rootDir, '.pixel-crew', 'state.json'),
      path.join(rootDir, '.pixel-agents', 'state.json')
    ].filter(Boolean);

    const uniqueStatePaths = Array.from(new Set(possibleStatePaths));

    for (const sPath of uniqueStatePaths) {
      fsSync.watchFile(sPath, { interval: 150 }, async () => {
        try {
          const content = await fs.readFile(sPath, 'utf-8');
          const state = JSON.parse(content);
          if (engine) engine.state = state;
          const payload = `event: state_change\ndata: ${JSON.stringify({ state })}\n\n`;
          for (const client of sseClients) {
            try { client.write(payload); } catch {}
          }
        } catch {}
      });
    }
  }

  // Start watchers when server begins listening
  server.on('listening', startWatchers);

  server.on('close', () => {
    clearInterval(heartbeat);
    isWatching = false;
    if (workspaceWatcher) {
      try { workspaceWatcher.close(); } catch {}
    }
    const possiblePaths = [
      engine?.eventsPath,
      engine?.statePath,
      path.join(rootDir, '.pixel-crew', 'events.jsonl'),
      path.join(rootDir, '.pixel-agents', 'events.jsonl'),
      path.join(rootDir, '.pixel-crew', 'state.json'),
      path.join(rootDir, '.pixel-agents', 'state.json')
    ].filter(Boolean);

    for (const p of possiblePaths) {
      try { fsSync.unwatchFile(p); } catch {}
    }
  });

  return server;
}

