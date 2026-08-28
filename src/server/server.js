import http from 'node:http';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function createServer(engine, options = {}) {
  const rootDir = engine.rootDir;
  const dashboardDir = path.join(rootDir, '.pixel-dashboard');
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

  // Watch events.jsonl for direct external CLI writes (e.g. from Antigravity IDE)
  let lastKnownEventCount = 0;
  if (engine.eventsPath) {
    try {
      const initialContent = fsSync.readFileSync(engine.eventsPath, 'utf-8');
      lastKnownEventCount = initialContent.trim().split('\n').filter(Boolean).length;
    } catch {
      lastKnownEventCount = 0;
    }

    fsSync.watchFile(engine.eventsPath, { interval: 300 }, async () => {
      try {
        const content = await fs.readFile(engine.eventsPath, 'utf-8');
        const lines = content.trim().split('\n').filter(Boolean);
        if (lines.length > lastKnownEventCount) {
          const newLines = lines.slice(lastKnownEventCount);
          lastKnownEventCount = lines.length;
          for (const line of newLines) {
            try {
              const event = JSON.parse(line);
              // Broadcast over SSE
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
      return sendJson(200, {
        rootDir: engine.rootDir,
        project: engine.getConfig()?.project || path.basename(engine.rootDir),
        version: '0.1.0'
      });
    }

    if (pathname === '/api/state' && req.method === 'GET') {
      return sendJson(200, engine.getState());
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

      // Send initial history
      const initialPayload = `event: init\ndata: ${JSON.stringify({
        state: engine.getState(),
        config: engine.getConfig(),
        history: engine.getEvents()
      })}\n\n`;
      res.write(initialPayload);

      sseClients.add(res);

      req.on('close', () => {
        sseClients.delete(res);
      });
      return;
    }

    if (pathname === '/api/task' && req.method === 'POST') {
      const body = await readBody();
      const prompt = body.prompt || body.task || 'Optimize application workflow';
      // Asynchronously start task execution
      engine.submitTask(prompt).catch(console.error);
      return sendJson(200, { status: 'accepted', prompt });
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
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
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

  server.on('close', () => {
    clearInterval(heartbeat);
  });

  return server;
}
