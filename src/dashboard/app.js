/**
 * PIXEL CORPS HQ — Interactive Startup Office Engine & Pixel Art Canvas Renderer
 */

// Global State
const appState = {
  config: null,
  state: null,
  events: [],
  activeFilter: 'all',
  audioEnabled: true,
  crtEnabled: true,
  nightMode: false,
  missionStartTime: null,
  missionTimerInterval: null,
  hoveredDesk: null
};

// Workstations Layout on the Office Floor Canvas (960 x 420)
const WORKSTATIONS = {
  orchestrator: {
    id: 'orchestrator',
    name: 'Tech Lead / Master CPU',
    role: 'Staff Swarm Architect',
    x: 60,
    y: 60,
    w: 180,
    h: 130,
    color: '#ffd700',
    icon: '👔',
    deskType: 'lead'
  },
  frontend: {
    id: 'frontend',
    name: 'Frontend Engineer',
    role: 'Senior UI/UX & React Lead',
    x: 280,
    y: 60,
    w: 170,
    h: 130,
    color: '#00f0ff',
    icon: '🎨',
    deskType: 'frontend'
  },
  backend: {
    id: 'backend',
    name: 'Backend Engineer',
    role: 'Principal API & Distributed Systems',
    x: 480,
    y: 60,
    w: 170,
    h: 130,
    color: '#ff007f',
    icon: '⚡',
    deskType: 'backend'
  },
  database: {
    id: 'database',
    name: 'Database Architect',
    role: 'Principal DBA & Query Tuning',
    x: 680,
    y: 60,
    w: 220,
    h: 130,
    color: '#ffd700',
    icon: '🗄️',
    deskType: 'database'
  },
  security: {
    id: 'security',
    name: 'Security Sentinel',
    role: 'InfoSec Lead & OWASP Auditor',
    x: 60,
    y: 230,
    w: 180,
    h: 130,
    color: '#ff3344',
    icon: '🛡️',
    deskType: 'security'
  },
  performance: {
    id: 'performance',
    name: 'Performance SRE',
    role: 'DevOps & CWV Optimization',
    x: 280,
    y: 230,
    w: 170,
    h: 130,
    color: '#39ff14',
    icon: '🚀',
    deskType: 'performance'
  },
  qa: {
    id: 'qa',
    name: 'QA Automation Lead',
    role: 'End-to-End & Playwright Master',
    x: 480,
    y: 230,
    w: 170,
    h: 130,
    color: '#b026ff',
    icon: '🧪',
    deskType: 'qa'
  }
};

// Retro Web Audio Synthesizer
class RetroAudioSynth {
  constructor() {
    this.ctx = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'square', duration = 0.08, gainVal = 0.05) {
    if (!appState.audioEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy
    }
  }

  playSpawn() {
    if (!appState.audioEnabled) return;
    this.playTone(330, 'triangle', 0.06);
    setTimeout(() => this.playTone(440, 'triangle', 0.06), 60);
    setTimeout(() => this.playTone(660, 'square', 0.1), 120);
  }

  playSkill() {
    if (!appState.audioEnabled) return;
    this.playTone(659.25, 'square', 0.05, 0.04);
    setTimeout(() => this.playTone(987.77, 'square', 0.1, 0.04), 50);
  }

  playComplete() {
    if (!appState.audioEnabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 'square', 0.12, 0.05), i * 80);
    });
  }

  playError() {
    if (!appState.audioEnabled) return;
    this.playTone(180, 'sawtooth', 0.15, 0.08);
    setTimeout(() => this.playTone(140, 'sawtooth', 0.25, 0.08), 100);
  }

  playClick() {
    this.playTone(800, 'triangle', 0.02, 0.02);
  }
}

const synth = new RetroAudioSynth();

// Pixel Office Canvas Renderer
let officeCanvas, officeCtx;
let animFrame = 0;

function initOfficeCanvas() {
  officeCanvas = document.getElementById('officeCanvas');
  if (!officeCanvas) return;
  officeCtx = officeCanvas.getContext('2d');

  // Mouse interaction for tooltips and clicking workstations
  officeCanvas.addEventListener('mousemove', (e) => {
    const rect = officeCanvas.getBoundingClientRect();
    const scaleX = officeCanvas.width / rect.width;
    const scaleY = officeCanvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    let hit = null;
    for (const [key, ws] of Object.entries(WORKSTATIONS)) {
      if (mouseX >= ws.x && mouseX <= ws.x + ws.w && mouseY >= ws.y && mouseY <= ws.y + ws.h) {
        hit = ws;
        break;
      }
    }

    const tooltip = document.getElementById('deskTooltip');
    if (hit) {
      appState.hoveredDesk = hit.id;
      tooltip.style.display = 'flex';
      tooltip.style.left = `${e.clientX}px`;
      tooltip.style.top = `${e.clientY}px`;
      document.getElementById('tooltipName').textContent = `${hit.name}`;
      document.getElementById('tooltipName').style.color = hit.color;

      const aState = (appState.state && appState.state.agents) ? appState.state.agents[hit.id] : {};
      const stateStr = hit.id === 'orchestrator' ? (appState.state?.orchestrator?.state || 'IDLE') : (aState.state || 'IDLE');
      const taskStr = hit.id === 'orchestrator' ? (appState.state?.activeTask || 'Standing by') : (aState.currentTask || 'Idle');

      document.getElementById('tooltipStatus').textContent = `STATUS: ${stateStr}`;
      document.getElementById('tooltipTask').textContent = `${taskStr}`;
    } else {
      appState.hoveredDesk = null;
      tooltip.style.display = 'none';
    }
  });

  officeCanvas.addEventListener('mouseleave', () => {
    appState.hoveredDesk = null;
    document.getElementById('deskTooltip').style.display = 'none';
  });

  officeCanvas.addEventListener('click', (e) => {
    if (appState.hoveredDesk) {
      synth.playClick();
      openAgentModal(appState.hoveredDesk);
    }
  });
}

// Draw Pixel Startup Office Floor
function renderOfficeFloor() {
  if (!officeCtx) return;
  const ctx = officeCtx;
  const w = officeCanvas.width;
  const h = officeCanvas.height;

  // 1. Office Floor Tiles (Checkered / Modern Startup Floor)
  const isNight = appState.nightMode;
  const tileA = isNight ? '#0b0d18' : '#141829';
  const tileB = isNight ? '#080a13' : '#101424';
  const tileSize = 24;

  for (let y = 0; y < h; y += tileSize) {
    for (let x = 0; x < w; x += tileSize) {
      ctx.fillStyle = ((x / tileSize + y / tileSize) % 2 === 0) ? tileA : tileB;
      ctx.fillRect(x, y, tileSize, tileSize);
    }
  }

  // 2. Wall Partitions & Glass Meeting Rooms
  ctx.strokeStyle = isNight ? '#1f274a' : '#2b3558';
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, w - 8, h - 8);

  // Executive Glass Partition
  ctx.fillStyle = 'rgba(0, 240, 255, 0.04)';
  ctx.fillRect(50, 40, 200, 160);
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
  ctx.strokeRect(50, 40, 200, 160);

  // Server Room Glass Partition
  ctx.fillStyle = 'rgba(255, 215, 0, 0.04)';
  ctx.fillRect(670, 40, 240, 160);
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.25)';
  ctx.strokeRect(670, 40, 240, 160);

  // Break Lounge Area (Bottom Right)
  renderBreakLounge(ctx, 680, 230, 230, 150);

  // 3. Render Workstations
  for (const [key, ws] of Object.entries(WORKSTATIONS)) {
    renderWorkstationDesk(ctx, ws);
  }

  // 4. Whiteboard in hallway
  renderWhiteboard(ctx, 420, 15, 120, 28);
}

// Draw Workstation Desk & Animated Agent
function renderWorkstationDesk(ctx, ws) {
  const isHovered = appState.hoveredDesk === ws.id;
  const isNight = appState.nightMode;

  const aState = ws.id === 'orchestrator' 
    ? (appState.state?.orchestrator || { state: 'IDLE', expression: '◉_◉' })
    : (appState.state?.agents?.[ws.id] || { state: 'IDLE', expression: '●_●' });

  const state = aState.state || 'IDLE';

  // Desk boundary glow if hovered or working
  if (isHovered || state === 'WORKING') {
    ctx.strokeStyle = ws.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(ws.x - 4, ws.y - 4, ws.w + 8, ws.h + 8);
  }

  // Desk Mat & Wooden Table
  ctx.fillStyle = isNight ? '#161a2e' : '#222842';
  ctx.fillRect(ws.x + 10, ws.y + 30, ws.w - 20, 50);
  ctx.fillStyle = '#0a0d18';
  ctx.fillRect(ws.x + 14, ws.y + 34, ws.w - 28, 42); // desk mat

  // Workstation Label
  ctx.font = '8px "Press Start 2P", monospace';
  ctx.fillStyle = ws.color;
  ctx.fillText(ws.id.toUpperCase(), ws.x + 14, ws.y + 20);

  // State Badge
  ctx.font = '7px "Silkscreen", monospace';
  ctx.fillStyle = state === 'WORKING' ? '#ff007f' : (state === 'COMPLETED' ? '#39ff14' : '#8a96b0');
  ctx.fillText(`[${state}]`, ws.x + ws.w - 65, ws.y + 20);

  // Multi-Monitor Setup with Glowing Code / UI
  const monitorGlow = state === 'WORKING' || state === 'ANALYZING';
  
  // Left/Main Monitor
  ctx.fillStyle = '#1c223a';
  ctx.fillRect(ws.x + 20, ws.y + 38, 36, 24);
  ctx.fillStyle = monitorGlow ? ws.color : '#0f1424';
  ctx.fillRect(ws.x + 22, ws.y + 40, 32, 20);
  
  // Animated Code Lines on Screen
  if (monitorGlow) {
    ctx.fillStyle = '#ffffff';
    const lineOffset = (animFrame % 6);
    ctx.fillRect(ws.x + 24, ws.y + 43 + (lineOffset % 3) * 4, 18, 2);
    ctx.fillRect(ws.x + 24, ws.y + 49, 24, 2);
  }

  // Right Secondary Monitor
  ctx.fillStyle = '#1c223a';
  ctx.fillRect(ws.x + 60, ws.y + 40, 28, 20);
  ctx.fillStyle = monitorGlow ? '#39ff14' : '#0f1424';
  ctx.fillRect(ws.x + 62, ws.y + 42, 24, 16);

  // Mechanical Keyboard
  ctx.fillStyle = '#2c3558';
  ctx.fillRect(ws.x + 30, ws.y + 66, 32, 10);
  ctx.fillStyle = '#445182';
  for (let k = 0; k < 4; k++) {
    ctx.fillRect(ws.x + 33 + k * 7, ws.y + 68, 5, 3);
  }

  // Coffee Mug (with rising steam when active)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(ws.x + ws.w - 36, ws.y + 46, 8, 10);
  ctx.fillStyle = '#b08968';
  ctx.fillRect(ws.x + ws.w - 34, ws.y + 48, 4, 4); // coffee
  if (state === 'WORKING' || state === 'ANALYZING') {
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    const steamY = (animFrame % 10) * 1.2;
    ctx.fillRect(ws.x + ws.w - 33, ws.y + 42 - steamY, 2, 3);
  }

  // Server Racks in Database Room
  if (ws.id === 'database') {
    ctx.fillStyle = '#060810';
    ctx.fillRect(ws.x + ws.w - 75, ws.y + 35, 45, 80);
    ctx.fillStyle = '#1a2238';
    for (let r = 0; r < 5; r++) {
      ctx.fillRect(ws.x + ws.w - 71, ws.y + 40 + r * 14, 37, 10);
      // Blinking LEDs
      ctx.fillStyle = ((animFrame + r) % 4 === 0) ? '#39ff14' : '#00f0ff';
      ctx.fillRect(ws.x + ws.w - 68, ws.y + 43 + r * 14, 3, 3);
      ctx.fillStyle = ((animFrame + r) % 3 === 0) ? '#ffd700' : '#ff007f';
      ctx.fillRect(ws.x + ws.w - 62, ws.y + 43 + r * 14, 3, 3);
      ctx.fillStyle = '#1a2238';
    }
  }

  // Security Radar / CCTV in Security Room
  if (ws.id === 'security') {
    ctx.fillStyle = '#081a10';
    ctx.fillRect(ws.x + ws.w - 50, ws.y + 38, 28, 22);
    ctx.strokeStyle = '#39ff14';
    ctx.beginPath();
    ctx.arc(ws.x + ws.w - 36, ws.y + 49, 8, 0, Math.PI * 2);
    ctx.stroke();
    // Radar sweep
    const sweepAngle = (animFrame * 0.1) % (Math.PI * 2);
    ctx.beginPath();
    ctx.moveTo(ws.x + ws.w - 36, ws.y + 49);
    ctx.lineTo(
      ws.x + ws.w - 36 + Math.cos(sweepAngle) * 8,
      ws.y + 49 + Math.sin(sweepAngle) * 8
    );
    ctx.stroke();
  }

  // Animated Pixel Character sitting in Ergonomic Chair
  const charX = ws.x + 36;
  const charY = ws.y + 82;
  renderOfficeWorker(ctx, ws.id, state, charX, charY, animFrame);
}

// Draw Pixel Office Worker in Chair
function renderOfficeWorker(ctx, agentKey, state, x, y, frame) {
  // Ergonomic Chair Back
  ctx.fillStyle = '#111422';
  ctx.fillRect(x - 8, y - 2, 24, 26);
  ctx.fillStyle = '#1d233a';
  ctx.fillRect(x - 6, y, 20, 22);

  // Bobbing animation offset
  let offsetY = 0;
  if (state === 'WORKING') {
    offsetY = (frame % 2 === 0) ? -1 : 1;
  } else if (state === 'IDLE' || state === 'COMPLETED') {
    offsetY = Math.sin(frame * 0.15) * 1.5;
  }

  // Worker Head & Torso
  const colors = {
    orchestrator: '#ffd700',
    frontend: '#00f0ff',
    backend: '#ff007f',
    database: '#ffd700',
    security: '#ff3344',
    performance: '#39ff14',
    qa: '#b026ff'
  };

  const suitColor = colors[agentKey] || '#00f0ff';

  // Hair / Head
  ctx.fillStyle = '#ffd1a4'; // skin
  ctx.fillRect(x, y + offsetY, 10, 10);
  ctx.fillStyle = suitColor;
  ctx.fillRect(x - 1, y - 2 + offsetY, 12, 4); // hair/cap

  // Eyes & Expression
  let eyeColor = '#000000';
  if (state === 'ERROR') eyeColor = '#ff0000';
  else if (state === 'COMPLETED') eyeColor = '#39ff14';
  else if (state === 'ANALYZING') eyeColor = (frame % 4 < 2) ? '#ffd700' : '#00f0ff';

  ctx.fillStyle = eyeColor;
  ctx.fillRect(x + 2, y + 3 + offsetY, 2, 2);
  ctx.fillRect(x + 6, y + 3 + offsetY, 2, 2);

  // Torso / Startup Hoodie
  ctx.fillStyle = suitColor;
  ctx.fillRect(x - 2, y + 10 + offsetY, 14, 12);

  // Typing Arms / Actions
  if (state === 'WORKING') {
    ctx.fillStyle = '#ffd1a4';
    const armW = (frame % 2 === 0) ? 6 : 4;
    ctx.fillRect(x - 5, y + 12 + offsetY, armW, 3);
    ctx.fillRect(x + 9, y + 12 + offsetY, armW, 3);

    // Typing Sparkles
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + ((frame * 3) % 12) - 2, y + 8, 2, 2);
  } else if (state === 'ANALYZING') {
    // Thinking bubble
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 12, y - 6, 8, 6);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 14, y - 4, 4, 2);
  } else if (state === 'COMPLETED') {
    // Victory hands up
    ctx.fillStyle = '#ffd1a4';
    ctx.fillRect(x - 5, y + 6 + offsetY, 3, 5);
    ctx.fillRect(x + 12, y + 6 + offsetY, 3, 5);
  }
}

// Break Lounge Area (Espresso machine, water cooler, beanbag)
function renderBreakLounge(ctx, x, y, w, h) {
  // Carpet
  ctx.fillStyle = '#1c162b';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#3d285c';
  ctx.strokeRect(x, y, w, h);

  // Label
  ctx.font = '8px "Press Start 2P", monospace';
  ctx.fillStyle = '#b08968';
  ctx.fillText('☕ BREAK LOUNGE', x + 10, y + 16);

  // Espresso Bar
  ctx.fillStyle = '#2c223b';
  ctx.fillRect(x + 14, y + 30, 65, 45);
  ctx.fillStyle = '#silver';
  ctx.fillStyle = '#a0aab8';
  ctx.fillRect(x + 20, y + 34, 24, 20); // coffee maker
  ctx.fillStyle = '#00f0ff';
  ctx.fillRect(x + 24, y + 38, 8, 4); // screen

  // Water Cooler
  ctx.fillStyle = '#00f0ff';
  ctx.fillRect(x + 95, y + 30, 18, 20); // water bottle
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 93, y + 50, 22, 25); // cooler base

  // Potted Startup Plant / Ficus
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(x + 150, y + 55, 18, 18); // pot
  ctx.fillStyle = '#39ff14';
  ctx.fillRect(x + 146, y + 35, 26, 20); // leaves
  ctx.fillRect(x + 152, y + 25, 14, 12);

  // Comfy Beanbag
  ctx.fillStyle = '#ff007f';
  ctx.fillRect(x + 20, y + 90, 40, 25);
  ctx.fillStyle = '#d6006b';
  ctx.fillRect(x + 25, y + 95, 30, 16);
}

// Whiteboard
function renderWhiteboard(ctx, x, y, w, h) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#a0aab8';
  ctx.strokeRect(x, y, w, h);

  // Flowchart boxes on whiteboard
  ctx.fillStyle = '#ff007f';
  ctx.fillRect(x + 10, y + 6, 20, 8);
  ctx.fillStyle = '#00f0ff';
  ctx.fillRect(x + 45, y + 6, 20, 8);
  ctx.fillStyle = '#39ff14';
  ctx.fillRect(x + 80, y + 6, 20, 8);

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 30, y + 10); ctx.lineTo(x + 45, y + 10);
  ctx.moveTo(x + 65, y + 10); ctx.lineTo(x + 80, y + 10);
  ctx.stroke();
}

// Animation Loop for Office Floor
function startOfficeAnimationLoop() {
  function loop() {
    animFrame++;
    renderOfficeFloor();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

// Initialize Application
async function initApp() {
  setupEventListeners();
  initOfficeCanvas();
  startOfficeAnimationLoop();
  connectSSE();
}

// Setup DOM Event Listeners
function setupEventListeners() {
  // Task form submission
  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const prompt = taskInput.value.trim();
    if (!prompt) return;
    synth.playClick();
    await submitTask(prompt);
    taskInput.value = '';
  });

  // Quick mission tags
  document.querySelectorAll('.quick-tag').forEach((btn) => {
    btn.addEventListener('click', async () => {
      synth.playClick();
      const prompt = btn.getAttribute('data-prompt');
      await submitTask(prompt);
    });
  });

  // Header buttons
  document.getElementById('btnDemo').addEventListener('click', async () => {
    synth.playClick();
    await fetch('/api/demo', { method: 'POST' });
  });

  document.getElementById('btnReset').addEventListener('click', async () => {
    synth.playClick();
    await fetch('/api/reset', { method: 'POST' });
  });

  document.getElementById('btnCrtToggle').addEventListener('click', () => {
    synth.playClick();
    appState.crtEnabled = !appState.crtEnabled;
    document.body.classList.toggle('crt-active', appState.crtEnabled);
  });

  document.getElementById('btnNightToggle').addEventListener('click', () => {
    synth.playClick();
    appState.nightMode = !appState.nightMode;
    document.body.classList.toggle('night-mode', appState.nightMode);
    document.getElementById('nightIcon').textContent = appState.nightMode ? '☀️' : '🌙';
  });

  document.getElementById('btnAudioToggle').addEventListener('click', () => {
    appState.audioEnabled = !appState.audioEnabled;
    document.getElementById('audioIcon').textContent = appState.audioEnabled ? '🔊' : '🔇';
    synth.playClick();
  });

  document.getElementById('btnClearLogs').addEventListener('click', () => {
    synth.playClick();
    document.getElementById('terminalLogs').innerHTML = '';
  });

  // Log filter chips
  document.querySelectorAll('.filter-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      synth.playClick();
      document.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      appState.activeFilter = chip.getAttribute('data-filter');
      applyLogFilters();
    });
  });

  // Modal close
  document.getElementById('btnCloseModal').addEventListener('click', () => {
    document.getElementById('agentModal').classList.remove('open');
  });

  document.getElementById('agentModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('agentModal')) {
      document.getElementById('agentModal').classList.remove('open');
    }
  });

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === ' ') {
      e.preventDefault();
      document.getElementById('btnDemo').click();
    } else if (e.key === 'Escape') {
      document.getElementById('agentModal').classList.remove('open');
    } else if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
      const keys = ['frontend', 'backend', 'database', 'security', 'performance', 'qa'];
      const agentKey = keys[parseInt(e.key) - 1];
      if (agentKey) openAgentModal(agentKey);
    }
  });
}

// Submit Task to Server
async function submitTask(prompt) {
  try {
    await fetch('/api/task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
  } catch (err) {
    console.error('Failed to submit task:', err);
  }
}

// Server-Sent Events Connection
function connectSSE() {
  const eventSource = new EventSource('/api/events');

  eventSource.addEventListener('init', (e) => {
    const data = JSON.parse(e.data);
    appState.config = data.config;
    appState.state = data.state;
    appState.events = data.history || [];

    renderProjectInfo();
    renderAgentGrid();
    renderSkillsList();
    renderState();
    renderLogs(appState.events);
  });

  eventSource.addEventListener('agent_event', (e) => {
    const event = JSON.parse(e.data);
    appState.events.push(event);
    appendLog(event);

    // Audio cues
    if (event.type === 'spawn') synth.playSpawn();
    else if (event.type === 'skill') synth.playSkill();
    else if (event.type === 'complete') synth.playComplete();
    else if (event.type === 'error') synth.playError();
  });

  eventSource.addEventListener('state_change', (e) => {
    const data = JSON.parse(e.data);
    appState.state = data.state;
    renderState();
  });

  eventSource.onerror = () => {
    console.warn('SSE disconnected. Reconnecting in 3s...');
  };
}

// Render Project Information in Header
function renderProjectInfo() {
  if (!appState.config) return;
  document.getElementById('projectName').textContent = appState.config.project || 'pixel-agents';
}

// Render Agent Cards Grid
function renderAgentGrid() {
  const grid = document.getElementById('agentsGrid');
  if (!grid || !appState.config || !appState.config.agents) return;

  grid.innerHTML = '';
  const agents = appState.config.agents;

  for (const [key, agent] of Object.entries(agents)) {
    const card = document.createElement('div');
    card.className = 'agent-card';
    card.id = `agent-card-${key}`;
    card.style.setProperty('--agent-color', agent.color || '#00f0ff');

    const ws = WORKSTATIONS[key] || { icon: '💼' };

    card.innerHTML = `
      <div class="agent-card-header">
        <span class="agent-role-title">${ws.icon} ${agent.name.toUpperCase()}</span>
        <span class="agent-state-pill" id="pill-${key}">IDLE</span>
      </div>
      <div class="agent-card-body">
        <div class="agent-current-task" id="task-${key}">Standing by at workstation</div>
        <div class="agent-skills-mini" id="skills-mini-${key}">
          ${(agent.skills || []).slice(0, 3).map(skill => `
            <div class="mini-skill-row">
              <span>${skill}</span>
              <span class="mini-skill-icon" id="mini-skill-${key}-${skill}">◌</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    card.addEventListener('click', () => openAgentModal(key));
    grid.appendChild(card);
  }
}

// Render Overall Skills Matrix Panel
function renderSkillsList() {
  const container = document.getElementById('skillsList');
  if (!container || !appState.config) return;

  container.innerHTML = '';
  const agents = appState.config.agents || {};

  for (const [agentKey, agent] of Object.entries(agents)) {
    for (const skill of (agent.skills || [])) {
      const item = document.createElement('div');
      item.className = 'skill-item';
      item.id = `skill-row-${agentKey}-${skill}`;
      item.innerHTML = `
        <div class="skill-left">
          <span class="skill-icon status-idle" id="skill-status-${agentKey}-${skill}">◌</span>
          <span class="skill-name">${skill}</span>
        </div>
        <span class="skill-agent-tag" style="color: ${agent.color}">${agentKey.toUpperCase()}</span>
      `;
      container.appendChild(item);
    }
  }
}

// Render State Updates
function renderState() {
  if (!appState.state) return;
  const state = appState.state;

  // Swarm Status Pill
  const statusBadge = document.getElementById('swarmStatusBadge');
  const statusText = document.getElementById('swarmStatusText');
  if (state.status === 'RUNNING') {
    statusBadge.classList.add('running');
    statusText.textContent = '● SPRINT IN PROGRESS';
    document.getElementById('coffeeFill').style.width = '45%';
    document.getElementById('velocityFill').style.width = '100%';
  } else if (state.status === 'COMPLETED') {
    statusBadge.classList.remove('running');
    statusText.textContent = '★ SPRINT COMPLETED';
    document.getElementById('coffeeFill').style.width = '90%';
  } else {
    statusBadge.classList.remove('running');
    statusText.textContent = 'STANDBY';
  }

  // Orchestrator Progress Text
  const progress = state.orchestrator?.progress || 0;
  document.getElementById('orchProgressText').textContent = `${progress}%`;

  // Agent counts & UI cards
  let activeCount = 0;
  const agentStates = state.agents || {};
  for (const [key, aState] of Object.entries(agentStates)) {
    if (aState.state === 'WORKING' || aState.state === 'ANALYZING' || aState.state === 'SPAWNING') {
      activeCount++;
    }

    const pill = document.getElementById(`pill-${key}`);
    if (pill) {
      pill.textContent = aState.state || 'IDLE';
      pill.className = `agent-state-pill state-${(aState.state || 'idle').toLowerCase()}`;
    }

    const taskEl = document.getElementById(`task-${key}`);
    if (taskEl) taskEl.textContent = aState.currentTask || 'Idle';

    const skillsStatus = aState.skillsStatus || {};
    for (const [skillName, sStatus] of Object.entries(skillsStatus)) {
      const miniIcon = document.getElementById(`mini-skill-${key}-${skillName}`);
      if (miniIcon) {
        miniIcon.className = `mini-skill-icon ${sStatus}`;
        miniIcon.textContent = sStatus === 'completed' ? '✓' : (sStatus === 'active' ? '◉' : '◌');
      }

      const mainIcon = document.getElementById(`skill-status-${key}-${skillName}`);
      if (mainIcon) {
        mainIcon.className = `skill-icon status-${sStatus}`;
        mainIcon.textContent = sStatus === 'completed' ? '✓' : (sStatus === 'active' ? '◉' : '◌');
      }
    }
  }

  document.getElementById('activeAgentCount').textContent = `${activeCount}/6 WORKING`;

  // Mission Timer
  if (state.status === 'RUNNING' && !appState.missionTimerInterval) {
    appState.missionStartTime = Date.now();
    appState.missionTimerInterval = setInterval(() => {
      const elapsedSec = Math.floor((Date.now() - appState.missionStartTime) / 1000);
      const mins = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
      const secs = String(elapsedSec % 60).padStart(2, '0');
      document.getElementById('missionElapsed').textContent = `${mins}:${secs}`;
    }, 1000);
  } else if (state.status !== 'RUNNING' && appState.missionTimerInterval) {
    clearInterval(appState.missionTimerInterval);
    appState.missionTimerInterval = null;
  }
}

// Terminal / Slack Log System
function appendLog(event) {
  const terminal = document.getElementById('terminalLogs');
  if (!terminal) return;

  const timeStr = new Date(event.timestamp).toTimeString().split(' ')[0];
  const entry = document.createElement('div');
  entry.className = `log-entry log-${event.type || 'progress'}`;
  entry.setAttribute('data-agent', event.agent || 'orchestrator');

  if (appState.activeFilter !== 'all' && appState.activeFilter !== event.agent) {
    entry.style.display = 'none';
  }

  const agentUpper = (event.agent || 'LEAD').toUpperCase();
  entry.innerHTML = `
    <span class="log-time">[${timeStr}]</span>
    <span class="log-agent log-agent-${event.agent}">#${agentUpper}</span>
    <span class="log-msg">${event.message}</span>
  `;

  terminal.appendChild(entry);
  terminal.scrollTop = terminal.scrollHeight;
}

function renderLogs(events) {
  const terminal = document.getElementById('terminalLogs');
  if (!terminal) return;
  terminal.innerHTML = '';
  for (const evt of events) {
    appendLog(evt);
  }
}

function applyLogFilters() {
  const entries = document.querySelectorAll('.log-entry');
  entries.forEach((entry) => {
    const agent = entry.getAttribute('data-agent');
    if (appState.activeFilter === 'all' || appState.activeFilter === agent) {
      entry.style.display = 'flex';
    } else {
      entry.style.display = 'none';
    }
  });
}

// Modal Inspector
function openAgentModal(agentKey) {
  const modal = document.getElementById('agentModal');
  const agent = (appState.config && appState.config.agents) ? appState.config.agents[agentKey] : null;
  const ws = WORKSTATIONS[agentKey] || {};

  const modalTitle = agent ? `${agent.name}` : (ws.name || 'Workstation Profile');
  const modalColor = agent ? agent.color : (ws.color || '#00f0ff');

  document.getElementById('modalAgentName').textContent = `${modalTitle} [${agentKey.toUpperCase()}]`;
  document.getElementById('modalAgentName').style.color = modalColor;

  const aState = agentKey === 'orchestrator'
    ? (appState.state?.orchestrator || {})
    : (appState.state?.agents?.[agentKey] || {});

  const body = document.getElementById('modalAgentBody');
  body.innerHTML = `
    <div>
      <strong>OFFICE TITLE & ROLE:</strong> ${ws.role || agent?.role || 'Autonomous Engineer'}
    </div>
    <div>
      <strong>DESK STATUS:</strong> <span style="color: ${modalColor}">${aState.state || 'IDLE'}</span> (${aState.expression || '●_●'})
    </div>
    <div>
      <strong>CURRENT SPRINT TICKET:</strong> ${aState.currentTask || 'None'}
    </div>
    <div>
      <strong>ASSIGNED TECH STACK & SKILLS:</strong>
      <ul style="margin: 6px 0 0 20px;">
        ${(agent?.skills || ['task-decomposition', 'architecture', 'coordination']).map(s => `<li>${s}</li>`).join('')}
      </ul>
    </div>
    <div>
      <strong>SECURITY & FILESYSTEM PERMISSIONS:</strong>
      <div style="background: #000; padding: 8px; margin-top: 4px; border: 1px solid #333; font-size: 13px;">
        <div>Read Access: <code>${JSON.stringify(agent?.permissions?.read || ['**/*'])}</code></div>
        <div>Write Access: <code>${JSON.stringify(agent?.permissions?.write || ['src/**'])}</code></div>
      </div>
    </div>
  `;

  modal.classList.add('open');
  synth.playClick();
}

// Bootstrap
window.addEventListener('DOMContentLoaded', initApp);
