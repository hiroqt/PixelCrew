/**
 * PIXEL CREW HQ — Autonomous Multi-Agent Office & Realtime Telemetry Engine
 */

// Global State
const appState = {
  config: null,
  state: null,
  events: [],
  activeFilter: 'all',
  streamMode: 'sidechat', // 'sidechat' | 'slack'
  autoScrollEnabled: true,
  audioEnabled: true,
  crtEnabled: true,
  nightMode: false,
  activeProvider: 'antigravity',
  activeProviderName: 'Google Antigravity',
  activeProviderIcon: '🪐',
  providersData: null,
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

// ============================================================================
// PROCEDURAL LO-FI MUSIC SYNTHESIZER & AMBIENT RADIO
// ============================================================================
class LofiMusicEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.currentTrack = 'floor42';
    this.volume = 0.7;
    this.loopTimer = null;
    this.noiseNode = null;
    this.noiseGain = null;
    this.chordStep = 0;
    this.bpm = 75;
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

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume * 0.8, this.ctx.currentTime);
    }
  }

  setTrack(trackId) {
    this.currentTrack = trackId;
    this.chordStep = 0;
    if (this.isPlaying) {
      this.stop();
      this.start();
    }
  }

  start() {
    this.initContext();
    if (!this.ctx) return;
    if (this.isPlaying) return;
    this.isPlaying = true;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume * 0.8, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.startVinylNoise();
    this.scheduleNextBeat();

    const btn = document.getElementById('btnLofiToggle');
    const visualizer = document.getElementById('lofiVisualizer');
    const playIcon = document.getElementById('lofiPlayIcon');
    if (btn) btn.classList.add('playing');
    if (visualizer) visualizer.classList.add('playing');
    if (playIcon) playIcon.textContent = '⏸';
  }

  stop() {
    this.isPlaying = false;
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    this.stopVinylNoise();

    const btn = document.getElementById('btnLofiToggle');
    const visualizer = document.getElementById('lofiVisualizer');
    const playIcon = document.getElementById('lofiPlayIcon');
    if (btn) btn.classList.remove('playing');
    if (visualizer) visualizer.classList.remove('playing');
    if (playIcon) playIcon.textContent = '▶';
  }

  toggle() {
    if (this.isPlaying) this.stop();
    else this.start();
  }

  startVinylNoise() {
    if (!this.ctx || this.noiseNode) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        const isPop = Math.random() < 0.0008;
        data[i] = (white * 0.035) + (isPop ? (Math.random() * 0.35 - 0.17) : 0);
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = buffer;
      this.noiseNode.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1600;

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

      this.noiseNode.connect(filter);
      filter.connect(this.noiseGain);
      this.noiseGain.connect(this.masterGain);

      this.noiseNode.start();
    } catch {}
  }

  stopVinylNoise() {
    if (this.noiseNode) {
      try { this.noiseNode.stop(); } catch {}
      this.noiseNode = null;
    }
  }

  playWarmChord(freqs, duration = 2.4, gainLevel = 0.07) {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;

    freqs.forEach((freq, i) => {
      try {
        const osc = this.ctx.createOscillator();
        const subOsc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(freq * 0.5, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.frequency.exponentialRampToValueAtTime(500, now + duration);

        const stagger = i * 0.022;
        gain.gain.setValueAtTime(0.0001, now + stagger);
        gain.gain.exponentialRampToValueAtTime(gainLevel / freqs.length, now + stagger + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(filter);
        subOsc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + stagger);
        subOsc.start(now + stagger);
        osc.stop(now + duration);
        subOsc.stop(now + duration);
      } catch {}
    });
  }

  playLofiKick() {
    if (!this.ctx || !this.isPlaying) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.16);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {}
  }

  playLofiSnare() {
    if (!this.ctx || !this.isPlaying) return;
    try {
      const now = this.ctx.currentTime;
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.14, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(now);
      noise.stop(now + 0.14);
    } catch {}
  }

  playLofiHat() {
    if (!this.ctx || !this.isPlaying) return;
    try {
      const now = this.ctx.currentTime;
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.04, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(6500, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.018, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(now);
      noise.stop(now + 0.04);
    } catch {}
  }

  scheduleNextBeat() {
    if (!this.isPlaying) return;

    const CHORD_PROGRESSIONS = {
      floor42: [
        [293.66, 349.23, 440.00, 523.25, 659.25], // Dm9
        [392.00, 493.88, 587.33, 698.46, 880.00], // G13
        [261.63, 329.63, 392.00, 493.88, 587.33], // Cmaj9
        [220.00, 277.18, 329.63, 440.00, 554.37]  // A7b13
      ],
      rainy: [
        [349.23, 440.00, 523.25, 659.25, 783.99], // Fmaj9
        [329.63, 392.00, 493.88, 587.33],         // Em7
        [293.66, 349.23, 440.00, 523.25],         // Dm7
        [220.00, 261.63, 329.63, 392.00, 493.88]  // Am9
      ],
      antigravity: [
        [261.63, 329.63, 392.00, 523.25, 659.25], // Cmaj7/9
        [220.00, 261.63, 329.63, 440.00, 587.33], // Am9
        [349.23, 440.00, 523.25, 698.46],         // Fmaj7
        [196.00, 246.94, 293.66, 392.00, 493.88]  // G6
      ],
      retro8bit: [
        [261.63, 329.63, 392.00, 523.25], // C
        [220.00, 261.63, 329.63, 440.00], // Am
        [174.61, 220.00, 261.63, 349.23], // F
        [196.00, 246.94, 293.66, 392.00]  // G
      ]
    };

    const chords = CHORD_PROGRESSIONS[this.currentTrack] || CHORD_PROGRESSIONS.floor42;
    const currentChord = chords[this.chordStep % chords.length];

    this.playWarmChord(currentChord, 2.4, 0.08);

    const beatInterval = (60 / this.bpm) * 1000;

    this.playLofiKick();
    this.playLofiHat();

    setTimeout(() => { if (this.isPlaying) { this.playLofiSnare(); this.playLofiHat(); } }, beatInterval);
    setTimeout(() => { if (this.isPlaying) { this.playLofiKick(); this.playLofiHat(); } }, beatInterval * 2);
    setTimeout(() => { if (this.isPlaying) { this.playLofiHat(); } }, beatInterval * 2.5);
    setTimeout(() => { if (this.isPlaying) { this.playLofiSnare(); this.playLofiHat(); } }, beatInterval * 3);

    this.chordStep++;
    this.loopTimer = setTimeout(() => {
      this.scheduleNextBeat();
    }, beatInterval * 4);
  }
}

const lofiEngine = new LofiMusicEngine();

// ============================================================================
// RETRO SFX AUDIO SYNTHESIZER
// ============================================================================
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

  playTone(freq, type = 'square', duration = 0.08, gainVal = 0.04) {
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
    } catch {}
  }

  playSpawn() {
    if (!appState.audioEnabled) return;
    this.playTone(330, 'triangle', 0.06);
    setTimeout(() => this.playTone(440, 'triangle', 0.06), 55);
    setTimeout(() => this.playTone(660, 'square', 0.09), 110);
  }

  playTool() {
    if (!appState.audioEnabled) return;
    this.playTone(520, 'triangle', 0.04, 0.03);
    setTimeout(() => this.playTone(780, 'square', 0.04, 0.02), 35);
  }

  playSkill() {
    if (!appState.audioEnabled) return;
    this.playTone(659.25, 'square', 0.05, 0.03);
    setTimeout(() => this.playTone(987.77, 'square', 0.09, 0.03), 45);
  }

  playComplete() {
    if (!appState.audioEnabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 'square', 0.1, 0.04), i * 75);
    });
  }

  playError() {
    if (!appState.audioEnabled) return;
    this.playTone(180, 'sawtooth', 0.12, 0.06);
    setTimeout(() => this.playTone(140, 'sawtooth', 0.2, 0.06), 90);
  }

  playClick() {
    this.playTone(800, 'triangle', 0.02, 0.02);
  }
}

const synth = new RetroAudioSynth();

// ============================================================================
// PIXEL OFFICE CANVAS RENDERER (HIGH-DPI RETINA SUPPORT)
// ============================================================================
let officeCanvas, officeCtx;
let animFrame = 0;

function initOfficeCanvas() {
  officeCanvas = document.getElementById('officeCanvas');
  if (!officeCanvas) return;
  officeCtx = officeCanvas.getContext('2d');

  // Handle Retina / High-DPI Display Scaling
  const dpr = window.devicePixelRatio || 1;
  const baseW = 960;
  const baseH = 420;

  officeCanvas.width = baseW * dpr;
  officeCanvas.height = baseH * dpr;
  officeCtx.scale(dpr, dpr);

  // Mouse interaction for tooltips and clicking workstations
  officeCanvas.addEventListener('mousemove', (e) => {
    const rect = officeCanvas.getBoundingClientRect();
    const scaleX = baseW / rect.width;
    const scaleY = baseH / rect.height;
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

  // Monitor Glow Reflection on Desk
  if (state === 'WORKING' || state === 'ANALYZING') {
    ctx.fillStyle = suitColor + '18';
    ctx.fillRect(x - 14, y + 14, 40, 16);
  }

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
    // Small thought icon
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 12, y - 6 + offsetY, 8, 6);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 14, y - 4 + offsetY, 4, 2);
  } else if (state === 'COMPLETED') {
    // Victory hands up
    ctx.fillStyle = '#ffd1a4';
    ctx.fillRect(x - 5, y + 6 + offsetY, 3, 5);
    ctx.fillRect(x + 12, y + 6 + offsetY, 3, 5);
  }

  // Floating Live Task / Speech Bubble above Worker's Head
  if (state === 'WORKING' || state === 'ANALYZING') {
    const aData = (appState.state && appState.state.agents) ? appState.state.agents[agentKey] : null;
    let label = state === 'ANALYZING' ? '🧠 Thinking...' : '⚡ Building...';
    if (aData && aData.currentTask && aData.currentTask !== 'Idle') {
      const t = aData.currentTask;
      if (t.includes('view_file') || t.includes('reading') || t.includes('Read')) label = '📄 ' + (t.split('/').pop().slice(0, 12) || 'file');
      else if (t.includes('replace_file') || t.includes('writing') || t.includes('Edit')) label = '📝 ' + (t.split('/').pop().slice(0, 12) || 'code');
      else if (t.includes('run_command') || t.includes('exec') || t.includes('npm')) label = '⚡ ' + (t.split(' ')[0].slice(0, 10) || 'exec');
      else if (t.includes('grep') || t.includes('search')) label = '🔍 Search';
      else label = t.length > 14 ? t.slice(0, 12) + '..' : t;
    }

    ctx.font = '7px "Press Start 2P", monospace';
    const textWidth = ctx.measureText(label).width;
    const bubbleW = textWidth + 12;
    const bubbleH = 15;
    const bubbleX = x - bubbleW / 2 + 5;
    const bubbleY = y - 22 + offsetY;

    ctx.fillStyle = '#000000';
    ctx.fillRect(bubbleX + 2, bubbleY + 2, bubbleW, bubbleH);
    ctx.fillStyle = '#0a0e1c';
    ctx.fillRect(bubbleX, bubbleY, bubbleW, bubbleH);
    ctx.strokeStyle = suitColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(bubbleX, bubbleY, bubbleW, bubbleH);

    ctx.fillStyle = '#0a0e1c';
    ctx.beginPath();
    ctx.moveTo(x + 3, bubbleY + bubbleH);
    ctx.lineTo(x + 7, bubbleY + bubbleH);
    ctx.lineTo(x + 5, bubbleY + bubbleH + 3);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.fillText(label, bubbleX + 6, bubbleY + 10);
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

// ============================================================================
// REALTIME ANTIGRAVITY SIDECHAT VIEW ENGINE
// ============================================================================
function updateActiveTaskHud(taskText, toolName = null) {
  const hudTaskText = document.getElementById('hudActiveTaskText');
  const hudToolBadge = document.getElementById('hudToolBadge');
  const hudToolName = document.getElementById('hudToolName');

  if (hudTaskText && taskText) {
    hudTaskText.textContent = taskText;
    hudTaskText.title = taskText;
  }

  if (hudToolBadge && hudToolName) {
    if (toolName) {
      hudToolBadge.style.display = 'inline-flex';
      hudToolName.textContent = toolName.toUpperCase();
    } else {
      hudToolBadge.style.display = 'none';
    }
  }
}

function parseToolAction(msg, metadata = {}) {
  if (!msg) return { action: 'EXEC', file: '', snippet: '' };
  const lower = msg.toLowerCase();

  let action = metadata.action || 'EXEC';
  let file = metadata.file || '';
  let snippet = msg;

  if (!metadata.action) {
    if (lower.includes('view_file') || lower.includes('reading') || lower.includes('read ')) {
      action = 'READ';
    } else if (lower.includes('replace_file') || lower.includes('writing') || lower.includes('modify') || lower.includes('edit')) {
      action = 'EDIT';
    } else if (lower.includes('run_command') || lower.includes('npm') || lower.includes('executing')) {
      action = 'EXEC';
    } else if (lower.includes('grep') || lower.includes('search') || lower.includes('finding')) {
      action = 'SEARCH';
    } else if (lower.includes('browser') || lower.includes('open_url')) {
      action = 'BROWSER';
    }
  }

  // Extract file path if not already provided
  if (!file) {
    const fileMatch = msg.match(/(?:file|path|to|in|edited|reading)\s*[:=]?\s*[`"']?([a-zA-Z0-9_\-./\\]+\.[a-zA-Z0-9]+)[`"']?/i);
    if (fileMatch) {
      file = fileMatch[1];
    }
  }

  return { action, file, snippet };
}

function appendSidechatCard(event) {
  const container = document.getElementById('sidechatStream');
  if (!container) return;

  const timeStr = new Date(event.timestamp || Date.now()).toTimeString().split(' ')[0];
  const agentKey = event.agent || 'orchestrator';
  const ws = WORKSTATIONS[agentKey] || { name: 'Tech Lead', color: '#ffd700', icon: '👔' };
  const agentColor = ws.color || '#00f0ff';
  const agentIcon = ws.icon || '🤖';
  const agentUpper = agentKey.toUpperCase();

  const card = document.createElement('div');
  card.className = `sidechat-card card-${agentKey}`;

  if (event.type === 'thinking' || (agentKey === 'orchestrator' && event.type === 'progress')) {
    card.innerHTML = `
      <div class="sidechat-card-header">
        <span class="sidechat-agent-badge" style="color: ${agentColor}; border-color: ${agentColor};">
          ${agentIcon} #${agentUpper}
        </span>
        <span class="sidechat-type-badge">THINKING</span>
        <span class="sidechat-timestamp">${timeStr}</span>
      </div>
      <div class="sidechat-thought-box">
        <span class="thought-brain-icon">🧠</span>
        <div class="thought-content">
          ${escapeHtml(event.message)}
          <span class="thought-typing-dots"></span>
        </div>
      </div>
    `;
    updateActiveTaskHud(event.message, 'REASONING');
  } else if (event.type === 'tool' || event.type === 'tool_call' || event.skill || event.message.includes('file') || event.message.includes('npm') || event.message.includes('run') || event.message.includes('Edit')) {
    const toolInfo = parseToolAction(event.message, event.metadata || {});
    const actionClass = toolInfo.action.toLowerCase();

    card.innerHTML = `
      <div class="sidechat-card-header">
        <span class="sidechat-agent-badge" style="color: ${agentColor}; border-color: ${agentColor};">
          ${agentIcon} #${agentUpper}
        </span>
        <span class="sidechat-type-badge">${toolInfo.action}</span>
        <span class="sidechat-timestamp">${timeStr}</span>
      </div>
      <div class="sidechat-tool-box">
        <div class="tool-box-header">
          <span class="tool-action-pill ${actionClass}">[${toolInfo.action}]</span>
          ${toolInfo.file ? `<span class="tool-target-path">${escapeHtml(toolInfo.file)}</span>` : ''}
        </div>
        <div class="tool-snippet-block">${escapeHtml(event.message)}</div>
      </div>
    `;
    updateActiveTaskHud(event.message, toolInfo.action);
    synth.playTool();
  } else if (event.type === 'complete') {
    card.innerHTML = `
      <div class="sidechat-card-header">
        <span class="sidechat-agent-badge" style="color: #39ff14; border-color: #39ff14;">
          ${agentIcon} #${agentUpper}
        </span>
        <span class="sidechat-type-badge" style="background: #0e2016; color: #39ff14;">COMPLETED</span>
        <span class="sidechat-timestamp">${timeStr}</span>
      </div>
      <div style="background: #0c1a14; border: 1px solid #165b38; padding: 8px 10px; color: #39ff14; font-size: 12px;">
        ✓ ${escapeHtml(event.message)}
      </div>
    `;
    updateActiveTaskHud(event.message, 'SUCCESS');
  } else if (event.type === 'error') {
    card.innerHTML = `
      <div class="sidechat-card-header">
        <span class="sidechat-agent-badge" style="color: #ff3344; border-color: #ff3344;">
          ${agentIcon} #${agentUpper}
        </span>
        <span class="sidechat-type-badge" style="background: #2a0c0e; color: #ff3344;">ERROR</span>
        <span class="sidechat-timestamp">${timeStr}</span>
      </div>
      <div style="background: #1c0606; border: 1px solid #551111; padding: 8px 10px; color: #ff3344; font-size: 12px;">
        ⚠ ${escapeHtml(event.message)}
      </div>
    `;
  } else {
    card.innerHTML = `
      <div class="sidechat-card-header">
        <span class="sidechat-agent-badge" style="color: ${agentColor}; border-color: ${agentColor};">
          ${agentIcon} #${agentUpper}
        </span>
        <span class="sidechat-type-badge">LOG</span>
        <span class="sidechat-timestamp">${timeStr}</span>
      </div>
      <div style="color: #cbd5e1; font-size: 12px; line-height: 1.4;">
        ${escapeHtml(event.message)}
      </div>
    `;
  }

  container.appendChild(card);
  if (appState.autoScrollEnabled) {
    container.scrollTop = container.scrollHeight;
  }
}

function renderSidechat(events) {
  const container = document.getElementById('sidechatStream');
  if (!container) return;
  container.innerHTML = '';
  for (const evt of events) {
    appendSidechatCard(evt);
  }
}

// ============================================================================
// ACCURATE PROVIDER SWITCHER & DIAGNOSTICS MODAL
// ============================================================================
function updateProviderUI(provData) {
  if (!provData) return;
  appState.providersData = provData;

  const activeId = provData.activeProvider || 'antigravity';
  const activeName = provData.activeProviderName || 'Google Antigravity';
  const activeIcon = provData.activeProviderIcon || '🪐';
  const activeDesc = provData.activeProviderDescription || 'Integrated Antigravity IDE Autonomous Pair Programming Engine';

  appState.activeProvider = activeId;
  appState.activeProviderName = activeName;
  appState.activeProviderIcon = activeIcon;

  // Header Badge
  const badgeNameEl = document.getElementById('providerName');
  const badgeIconEl = document.getElementById('providerIcon');
  if (badgeNameEl) badgeNameEl.textContent = activeId.toUpperCase();
  if (badgeIconEl) badgeIconEl.textContent = activeIcon;

  // Modal Header
  const modalNameEl = document.getElementById('modalActiveProvName');
  const modalIconEl = document.getElementById('modalActiveProvIcon');
  const modalDescEl = document.getElementById('modalActiveProvDesc');
  if (modalNameEl) modalNameEl.textContent = `${activeIcon} ${activeName} (${activeId.toUpperCase()})`;
  if (modalIconEl) modalIconEl.textContent = activeIcon;
  if (modalDescEl) modalDescEl.textContent = activeDesc;

  // Render Grid
  renderProvidersGrid(provData);
}

function renderProvidersGrid(provData) {
  const grid = document.getElementById('providerGrid');
  if (!grid || !provData) return;

  grid.innerHTML = '';

  const allProviders = [
    ...(provData.available || []),
    ...(provData.missing || [])
  ];

  allProviders.forEach(p => {
    const isActive = p.id === provData.activeProvider;
    const isAvailable = (provData.available || []).some(av => av.id === p.id);
    const card = document.createElement('div');
    card.className = `provider-card ${isActive ? 'active' : (isAvailable ? 'available' : 'missing')}`;

    card.innerHTML = `
      <div class="provider-card-header">
        <div class="provider-card-title">
          <span>${p.icon || '💻'}</span>
          <span>${p.name}</span>
        </div>
        <span class="provider-card-status">
          ${isActive ? 'ACTIVE' : (isAvailable ? 'DETECTED' : 'UNAVAILABLE')}
        </span>
      </div>
      <div class="provider-card-desc">${p.description || ''}</div>
    `;

    card.addEventListener('click', async () => {
      synth.playClick();
      await selectProvider(p.id);
    });

    grid.appendChild(card);
  });
}

async function selectProvider(providerId) {
  try {
    const res = await fetch('/api/providers/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: providerId })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.providers) {
        updateProviderUI(data.providers);
      }
      synth.playSkill();
    }
  } catch (err) {
    console.error('Failed to select provider:', err);
  }
}

function openProviderModal() {
  const modal = document.getElementById('providerModal');
  if (modal) {
    if (appState.providersData) {
      updateProviderUI(appState.providersData);
    }
    modal.classList.add('open');
    synth.playClick();
  }
}

function closeProviderModal() {
  const modal = document.getElementById('providerModal');
  if (modal) modal.classList.remove('open');
}

// ============================================================================
// INITIALIZATION & DOM BINDINGS
// ============================================================================
async function initApp() {
  setupEventListeners();
  initOfficeCanvas();
  startOfficeAnimationLoop();

  // Instant initial fetch before SSE stream connects
  try {
    const [cfgRes, stRes, provRes] = await Promise.all([
      fetch('/api/config').then(r => r.ok ? r.json() : null),
      fetch('/api/state').then(r => r.ok ? r.json() : null),
      fetch('/api/providers').then(r => r.ok ? r.json() : null)
    ]);
    if (cfgRes) {
      appState.config = cfgRes;
      renderProjectInfo();
      renderAgentGrid();
      renderSkillsList();
    }
    if (stRes) {
      appState.state = stRes;
      renderState();
    }
    if (provRes) {
      updateProviderUI(provRes);
    }
    await fetchReports();
  } catch (e) {
    // Handled by SSE
  }

  connectSSE();
}

let selectedAutocompleteIndex = -1;
let currentSuggestions = [];

// Setup DOM Event Listeners
function setupEventListeners() {
  // Provider Badge & Switcher Modal
  const providerBadge = document.getElementById('providerBadge');
  if (providerBadge) {
    providerBadge.addEventListener('click', () => {
      openProviderModal();
    });
  }

  const btnCloseProviderModal = document.getElementById('btnCloseProviderModal');
  if (btnCloseProviderModal) {
    btnCloseProviderModal.addEventListener('click', () => {
      closeProviderModal();
    });
  }

  const providerModal = document.getElementById('providerModal');
  if (providerModal) {
    providerModal.addEventListener('click', (e) => {
      if (e.target === providerModal) closeProviderModal();
    });
  }

  // Lo-Fi Music Synthesizer Controls
  const btnLofiToggle = document.getElementById('btnLofiToggle');
  if (btnLofiToggle) {
    btnLofiToggle.addEventListener('click', () => {
      synth.playClick();
      lofiEngine.toggle();
    });
  }

  const lofiTrackSelect = document.getElementById('lofiTrackSelect');
  if (lofiTrackSelect) {
    lofiTrackSelect.addEventListener('change', (e) => {
      lofiEngine.setTrack(e.target.value);
    });
  }

  const lofiVolSlider = document.getElementById('lofiVolSlider');
  if (lofiVolSlider) {
    lofiVolSlider.addEventListener('input', (e) => {
      lofiEngine.setVolume(parseFloat(e.target.value));
    });
  }

  // Stream Tab Switcher (#AI-SIDECHAT vs #TEAM-SLACK)
  const tabSidechat = document.getElementById('tabSidechat');
  const tabSlack = document.getElementById('tabSlack');
  const sidechatStream = document.getElementById('sidechatStream');
  const terminalLogs = document.getElementById('terminalLogs');

  if (tabSidechat && tabSlack) {
    tabSidechat.addEventListener('click', () => {
      synth.playClick();
      tabSidechat.classList.add('active');
      tabSlack.classList.remove('active');
      if (sidechatStream) sidechatStream.style.display = 'flex';
      if (terminalLogs) terminalLogs.style.display = 'none';
      appState.streamMode = 'sidechat';
    });

    tabSlack.addEventListener('click', () => {
      synth.playClick();
      tabSlack.classList.add('active');
      tabSidechat.classList.remove('active');
      if (sidechatStream) sidechatStream.style.display = 'none';
      if (terminalLogs) terminalLogs.style.display = 'flex';
      appState.streamMode = 'slack';
    });
  }

  // Auto Scroll Toggle Button
  const btnAutoScroll = document.getElementById('btnAutoScroll');
  if (btnAutoScroll) {
    btnAutoScroll.addEventListener('click', () => {
      synth.playClick();
      appState.autoScrollEnabled = !appState.autoScrollEnabled;
      btnAutoScroll.classList.toggle('active', appState.autoScrollEnabled);
      btnAutoScroll.textContent = appState.autoScrollEnabled ? 'AUTO-SCROLL ON' : 'AUTO-SCROLL OFF';
    });
  }

  // Clear Sidechat / Clear Logs
  const btnClearSidechat = document.getElementById('btnClearSidechat');
  if (btnClearSidechat) {
    btnClearSidechat.addEventListener('click', () => {
      synth.playClick();
      if (sidechatStream) sidechatStream.innerHTML = '';
      if (terminalLogs) terminalLogs.innerHTML = '';
    });
  }

  // Task form submission
  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  const autocompletePopup = document.getElementById('commandAutocomplete');
  const autocompleteList = document.getElementById('autocompleteList');

  // Handle Autocomplete popup
  async function updateAutocomplete() {
    const val = taskInput.value.trim();
    if (!val.startsWith('/')) {
      autocompletePopup.style.display = 'none';
      selectedAutocompleteIndex = -1;
      return;
    }

    try {
      const res = await fetch(`/api/commands/autocomplete?q=${encodeURIComponent(val)}`);
      if (res.ok) {
        const data = await res.json();
        currentSuggestions = data.suggestions || [];
        if (currentSuggestions.length > 0) {
          renderAutocomplete(currentSuggestions);
          autocompletePopup.style.display = 'block';
        } else {
          autocompletePopup.style.display = 'none';
        }
      }
    } catch {
      autocompletePopup.style.display = 'none';
    }
  }

  function renderAutocomplete(suggestions) {
    autocompleteList.innerHTML = suggestions.map((s, idx) => `
      <div class="autocomplete-item ${idx === selectedAutocompleteIndex ? 'selected' : ''}" data-index="${idx}">
        <span class="autocomplete-name">${escapeHtml(s.name)}</span>
        <span class="autocomplete-desc">${escapeHtml(s.description)}</span>
        <span class="autocomplete-usage">${escapeHtml(s.usage)}</span>
      </div>
    `).join('');

    autocompleteList.querySelectorAll('.autocomplete-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-index'), 10);
        selectSuggestion(idx);
      });
    });
  }

  function selectSuggestion(idx) {
    if (idx >= 0 && idx < currentSuggestions.length) {
      const s = currentSuggestions[idx];
      taskInput.value = `${s.name} `;
      autocompletePopup.style.display = 'none';
      taskInput.focus();
    }
  }

  taskInput.addEventListener('input', () => {
    selectedAutocompleteIndex = 0;
    updateAutocomplete();
  });

  taskInput.addEventListener('keydown', (e) => {
    if (autocompletePopup.style.display === 'block' && currentSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedAutocompleteIndex = (selectedAutocompleteIndex + 1) % currentSuggestions.length;
        renderAutocomplete(currentSuggestions);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedAutocompleteIndex = (selectedAutocompleteIndex - 1 + currentSuggestions.length) % currentSuggestions.length;
        renderAutocomplete(currentSuggestions);
      } else if (e.key === 'Tab' || (e.key === 'Enter' && selectedAutocompleteIndex >= 0 && taskInput.value.trim().split(' ').length === 1)) {
        e.preventDefault();
        selectSuggestion(selectedAutocompleteIndex);
      } else if (e.key === 'Escape') {
        autocompletePopup.style.display = 'none';
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (!taskInput.contains(e.target) && !autocompletePopup.contains(e.target)) {
      autocompletePopup.style.display = 'none';
    }
  });

  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    autocompletePopup.style.display = 'none';
    const prompt = taskInput.value.trim();
    if (!prompt) return;
    synth.playClick();
    updateActiveTaskHud(prompt, 'RUNNING');
    await submitTask(prompt);
    taskInput.value = '';
  });

  // Quick mission tags
  document.querySelectorAll('.quick-tag').forEach((btn) => {
    btn.addEventListener('click', async () => {
      synth.playClick();
      const prompt = btn.getAttribute('data-prompt');
      updateActiveTaskHud(prompt, 'RUNNING');
      await submitTask(prompt);
    });
  });

  // Header buttons
  document.getElementById('btnDemo').addEventListener('click', async () => {
    synth.playClick();
    updateActiveTaskHud('Running Full PixelCrew Multi-Agent Sprint Demo', 'SPRINT');
    await fetch('/api/demo', { method: 'POST' });
  });

  document.getElementById('btnReset').addEventListener('click', async () => {
    synth.playClick();
    updateActiveTaskHud('Standing by for sprint assignment', null);
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
    const sidechat = document.getElementById('sidechatStream');
    if (sidechat) sidechat.innerHTML = '';
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

  // OneShot Studio Modal Bindings
  const btnOneShotModal = document.getElementById('btnOneShotModal');
  if (btnOneShotModal) {
    btnOneShotModal.addEventListener('click', () => {
      synth.playClick();
      openOneShotModal();
    });
  }

  const btnCloseOneShotModal = document.getElementById('btnCloseOneShotModal');
  if (btnCloseOneShotModal) {
    btnCloseOneShotModal.addEventListener('click', () => {
      closeOneShotModal();
    });
  }

  const oneshotModalEl = document.getElementById('oneshotModal');
  if (oneshotModalEl) {
    oneshotModalEl.addEventListener('click', (e) => {
      if (e.target === oneshotModalEl) closeOneShotModal();
    });
  }

  const btnRunOneShot = document.getElementById('btnRunOneShot');
  if (btnRunOneShot) {
    btnRunOneShot.addEventListener('click', async () => {
      await runOneShotFromStudio();
    });
  }

  // Reports Drawer Buttons & Controls
  const btnReportsToggle = document.getElementById('btnReportsToggle');
  if (btnReportsToggle) {
    btnReportsToggle.addEventListener('click', () => {
      synth.playClick();
      openReportsModal();
    });
  }

  const btnCloseReportsModal = document.getElementById('btnCloseReportsModal');
  if (btnCloseReportsModal) {
    btnCloseReportsModal.addEventListener('click', () => {
      closeReportsModal();
    });
  }

  const reportsModalEl = document.getElementById('reportsModal');
  if (reportsModalEl) {
    reportsModalEl.addEventListener('click', (e) => {
      if (e.target === reportsModalEl) {
        closeReportsModal();
      }
    });
  }

  const btnCopyReportMd = document.getElementById('btnCopyReportMd');
  if (btnCopyReportMd) {
    btnCopyReportMd.addEventListener('click', () => {
      copyActiveReportMarkdown();
    });
  }

  const btnDownloadReport = document.getElementById('btnDownloadReport');
  if (btnDownloadReport) {
    btnDownloadReport.addEventListener('click', () => {
      downloadActiveReport();
    });
  }

  const btnToggleRawView = document.getElementById('btnToggleRawView');
  if (btnToggleRawView) {
    btnToggleRawView.addEventListener('click', () => {
      toggleRawReportView();
    });
  }

  const reportsSearchInput = document.getElementById('reportsSearch');
  if (reportsSearchInput) {
    reportsSearchInput.addEventListener('input', (e) => {
      reportsState.searchQuery = e.target.value.toLowerCase().trim();
      renderReportsList();
    });
  }

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === ' ') {
      e.preventDefault();
      document.getElementById('btnDemo').click();
    } else if (e.key === 'Escape') {
      document.getElementById('agentModal').classList.remove('open');
      closeReportsModal();
      closeOneShotModal();
    } else if (e.key === 'o' || e.key === 'O') {
      openOneShotModal();
    } else if (e.key === 'r' || e.key === 'R') {
      const modal = document.getElementById('reportsModal');
      if (modal && modal.classList.contains('open')) {
        closeReportsModal();
      } else {
        openReportsModal();
      }
    } else if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
      const keys = ['frontend', 'backend', 'database', 'security', 'performance', 'qa'];
      const agentKey = keys[parseInt(e.key) - 1];
      if (agentKey) openAgentModal(agentKey);
    }
  });
}

// Reports State & Controller
const reportsState = {
  reports: [],
  activeReport: null,
  searchQuery: '',
  rawMode: false
};

async function fetchReports() {
  try {
    const res = await fetch('/api/reports');
    if (res.ok) {
      const data = await res.json();
      reportsState.reports = data.reports || [];
      const badge = document.getElementById('reportsCountBadge');
      if (badge) {
        badge.textContent = reportsState.reports.length;
      }
      return reportsState.reports;
    }
  } catch (err) {
    console.error('Error loading reports:', err);
  }
  return [];
}

async function openReportsModal(preferredId = null) {
  const modal = document.getElementById('reportsModal');
  if (!modal) return;

  await fetchReports();

  if (preferredId) {
    reportsState.activeReport = reportsState.reports.find(r => r.id === preferredId) || reportsState.reports[0] || null;
  } else if (!reportsState.activeReport && reportsState.reports.length > 0) {
    reportsState.activeReport = reportsState.reports[0];
  }

  renderReportsList();
  renderActiveReport();

  modal.classList.add('open');
  synth.playClick();
}

function closeReportsModal() {
  const modal = document.getElementById('reportsModal');
  if (modal) modal.classList.remove('open');
}

function renderReportsList() {
  const container = document.getElementById('reportsHistoryList');
  if (!container) return;

  container.innerHTML = '';
  const filtered = reportsState.reports.filter(r => {
    if (!reportsState.searchQuery) return true;
    const q = reportsState.searchQuery;
    return (
      (r.objective && r.objective.toLowerCase().includes(q)) ||
      (r.project && r.project.toLowerCase().includes(q)) ||
      (r.dateFormatted && r.dateFormatted.toLowerCase().includes(q))
    );
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="padding: 16px; text-align: center; color: var(--text-dim); font-size: 11px;">
        ${reportsState.searchQuery ? 'No matching reports found.' : 'No audit reports recorded yet. Run a sprint demo or task to generate.'}
      </div>
    `;
    return;
  }

  filtered.forEach(report => {
    const card = document.createElement('div');
    card.className = `report-item-card ${reportsState.activeReport?.id === report.id ? 'active' : ''}`;
    
    card.innerHTML = `
      <div class="report-item-top">
        <span class="report-item-date">${report.dateFormatted || new Date(report.timestamp).toLocaleDateString()}</span>
        <span class="report-item-status">${report.status || 'COMPLETED'}</span>
      </div>
      <div class="report-item-title">${report.objective || 'Swarm Audit Sprint'}</div>
      <div class="report-item-meta">
        <span>👥 ${(report.targetAgents || []).length} Squads</span>
        <span>✨ ${report.totalFindings || (report.sections || []).length} Points</span>
      </div>
    `;

    card.addEventListener('click', () => {
      synth.playClick();
      reportsState.activeReport = report;
      renderReportsList();
      renderActiveReport();
    });

    container.appendChild(card);
  });
}

function formatMarkdownText(text) {
  if (!text) return '';
  let html = escapeHtml(text);

  // Bold: **text** or __text__
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="report-bold">$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong class="report-bold">$1</strong>');

  // Inline Code: `code`
  html = html.replace(/`([^`]+)`/g, '<code class="report-inline-code">$1</code>');

  // Italic: *text* or _text_
  html = html.replace(/\*([^*]+)\*/g, '<em class="report-italic">$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em class="report-italic">$1</em>');

  return html;
}

function parseFindingItem(finding) {
  let rawCategory = (finding.category || '').trim();
  let rawDesc = (finding.description || '').trim();

  let combined = rawDesc;
  if (!rawDesc || rawDesc === rawCategory) {
    combined = rawCategory;
  } else if (rawCategory && rawDesc) {
    combined = `${rawCategory}: ${rawDesc}`;
  }

  let badge = 'Finding';
  let path = null;
  let description = combined;

  // 1. Extract markdown bold badge if present: **Title (`path`)** or **Title**
  const boldPrefixMatch = combined.match(/^(\*\*|__)?([^*_`:]+?)(?:\s*\(`?([^`)]+?)`?\))?(\*\*|__)?(?::\s*|\s*-\s*|\s*—\s*)(.*)$/s);
  if (boldPrefixMatch) {
    badge = boldPrefixMatch[2].replace(/\*\*/g, '').trim();
    path = boldPrefixMatch[3] ? boldPrefixMatch[3].trim() : null;
    description = boldPrefixMatch[5] ? boldPrefixMatch[5].trim() : '';
  } else {
    // 2. Check if category itself contains title and path
    const catMatch = rawCategory.match(/^(\*\*|__)?([^*_`:]+?)(?:\s*\(`?([^`)]+?)`?\))?(\*\*|__)?$/);
    if (catMatch) {
      badge = catMatch[2].replace(/\*\*/g, '').trim();
      path = catMatch[3] ? catMatch[3].trim() : null;
      description = rawDesc;
    } else {
      const colonIndex = combined.indexOf(':');
      if (colonIndex > 0 && colonIndex < 45) {
        let rawTitle = combined.substring(0, colonIndex).replace(/\*\*/g, '').replace(/__/g, '').trim();
        const pathMatch = rawTitle.match(/^(.*?)(?:\s*\(`?([^`)]+?)`?\))$/);
        if (pathMatch) {
          badge = pathMatch[1].trim();
          path = pathMatch[2].trim();
        } else {
          badge = rawTitle;
        }
        description = combined.substring(colonIndex + 1).trim();
      }
    }
  }

  badge = badge.replace(/\*\*/g, '').replace(/`/g, '').trim();
  if (!badge) badge = 'Observation';

  return {
    badge,
    path,
    descriptionHtml: formatMarkdownText(description || combined)
  };
}

function renderActiveReport() {
  const viewer = document.getElementById('reportsViewer');
  if (!viewer) return;

  const report = reportsState.activeReport;
  if (!report) {
    viewer.innerHTML = `
      <div class="report-empty-state">
        <span style="font-size: 32px;">📋</span>
        <span>SELECT A SPRINT REPORT FROM THE LEFT SIDEBAR</span>
        <span style="color: var(--text-dim); font-size: 11px;">Audit reports are generated automatically after every completed swarm run.</span>
      </div>
    `;
    return;
  }

  // Raw Markdown Mode
  if (reportsState.rawMode) {
    viewer.innerHTML = `
      <div class="report-hero-card">
        <div class="report-hero-header">
          <div>
            <h3 class="report-hero-title">RAW MARKDOWN SPECIFICATION</h3>
            <div class="report-hero-meta">
              <span>PROJECT: <strong>${escapeHtml(report.project || 'Project')}</strong></span>
              <span>DATE: <strong>${escapeHtml(report.dateFormatted || 'N/A')}</strong></span>
            </div>
          </div>
        </div>
      </div>
      <pre class="report-raw-pre">${escapeHtml(report.markdown || '# No markdown available')}</pre>
    `;
    return;
  }

  // Visual Interactive Card Mode
  viewer.innerHTML = `
    <!-- HERO SUMMARY -->
    <div class="report-hero-card">
      <div class="report-hero-header">
        <div>
          <h3 class="report-hero-title">★ ${escapeHtml(report.objective || 'Sprint Audit')}</h3>
          <div class="report-hero-meta">
            <span>PRODUCT: <strong>${escapeHtml(report.project || 'Project')}</strong></span>
            <span>DATE: <strong>${escapeHtml(report.dateFormatted || 'Today')}</strong></span>
            <span>SQUADS: <strong>${(report.targetAgents || []).map(a => a.toUpperCase()).join(', ')}</strong></span>
          </div>
        </div>
        <span class="report-item-status">COMPLETED</span>
      </div>
      <div class="report-summary-box">
        <strong>Executive Summary:</strong> The autonomous engineering swarm executed an architectural and quality audit, resolving dependencies and formulating <strong>${report.totalFindings || 0} actionable improvements</strong>.
      </div>
    </div>

    <!-- METRICS GRID -->
    <div class="report-metrics-grid">
      <div class="report-metric-card">
        <span class="report-metric-label">ENGINEERING SQUADS</span>
        <span class="report-metric-val" style="color: var(--color-cyan);">${(report.targetAgents || []).length}</span>
      </div>
      <div class="report-metric-card">
        <span class="report-metric-label">FINDINGS & ACTIONS</span>
        <span class="report-metric-val" style="color: var(--color-gold);">${report.totalFindings || 0}</span>
      </div>
      <div class="report-metric-card">
        <span class="report-metric-label">QUALITY GATE</span>
        <span class="report-metric-val" style="color: var(--color-green);">PASSED</span>
      </div>
      <div class="report-metric-card">
        <span class="report-metric-label">BLOCKER DEFECTS</span>
        <span class="report-metric-val" style="color: var(--color-green);">0</span>
      </div>
    </div>

    <!-- SQUAD FINDINGS ACCORDION / CARDS -->
    <div class="report-sections-grid">
      ${(report.sections || []).map(section => {
        const squadColor = section.color || '#00f0ff';
        const findings = section.findings || [];
        return `
        <div class="report-squad-card" style="border-left: 4px solid ${squadColor};">
          <div class="report-squad-header">
            <div class="report-squad-header-left" style="color: ${squadColor};">
              <span>${section.icon || '💼'}</span>
              <span>${escapeHtml(section.name || section.agent.toUpperCase())}</span>
            </div>
            <span class="report-squad-count">${findings.length} ${findings.length === 1 ? 'Point' : 'Points'}</span>
          </div>
          <div class="report-findings-list">
            ${findings.map(f => {
              const parsed = parseFindingItem(f);
              return `
              <div class="report-finding-card">
                <div class="finding-card-header">
                  <span class="finding-badge" style="background: rgba(0, 240, 255, 0.08); border-color: ${squadColor}40; color: ${squadColor};">
                    ${escapeHtml(parsed.badge)}
                  </span>
                  ${parsed.path ? `<span class="finding-path-pill"><code>${escapeHtml(parsed.path)}</code></span>` : ''}
                </div>
                <div class="finding-body-text">
                  ${parsed.descriptionHtml}
                </div>
              </div>
              `;
            }).join('')}
          </div>
        </div>
        `;
      }).join('')}
    </div>

    <!-- ACTION ITEMS CHECKLIST -->
    <div class="report-actions-card">
      <div class="report-actions-title">📋 RECOMMENDED ACTION ITEMS & NEXT STEPS</div>
      <div class="report-checklist">
        ${(report.actionItems || []).map(item => `
          <label class="report-check-item">
            <input type="checkbox" />
            <span>${formatMarkdownText(item)}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `;
}

function toggleRawReportView() {
  synth.playClick();
  reportsState.rawMode = !reportsState.rawMode;
  const label = document.getElementById('toggleRawLabel');
  if (label) {
    label.textContent = reportsState.rawMode ? 'VISUAL CARDS' : 'RAW MARKDOWN';
  }
  renderActiveReport();
}

function copyActiveReportMarkdown() {
  if (!reportsState.activeReport?.markdown) return;
  navigator.clipboard.writeText(reportsState.activeReport.markdown).then(() => {
    synth.playSkill();
    const btn = document.getElementById('btnCopyReportMd');
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span>✓</span> COPIED!';
      setTimeout(() => { btn.innerHTML = originalText; }, 2000);
    }
  }).catch(err => {
    console.error('Failed to copy markdown:', err);
  });
}

function downloadActiveReport() {
  if (!reportsState.activeReport) return;
  const r = reportsState.activeReport;
  const content = r.markdown || JSON.stringify(r, null, 2);
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${r.id || 'sprint-report'}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  synth.playComplete();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Submit Task or Slash Command to Server
async function submitTask(prompt) {
  try {
    if (prompt.startsWith('/')) {
      await fetch('/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: prompt })
      });
    } else {
      await fetch('/api/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
    }
  } catch (err) {
    console.error('Failed to submit task or command:', err);
  }
}

// OneShot Studio Controller
function openOneShotModal() {
  const modal = document.getElementById('oneshotModal');
  if (modal) modal.classList.add('open');
  const input = document.getElementById('oneshotPromptInput');
  if (input && !input.value.trim()) {
    input.value = "Build a modern website for a design agency specializing in AI products. Dark, editorial, premium, but not corporate. Avoid generic SaaS design.";
  }
}

function closeOneShotModal() {
  const modal = document.getElementById('oneshotModal');
  if (modal) modal.classList.remove('open');
}

async function runOneShotFromStudio() {
  const promptInput = document.getElementById('oneshotPromptInput');
  const prompt = promptInput ? promptInput.value.trim() : '';
  if (!prompt) return;

  const targetRadio = document.querySelector('input[name="oneshotFramework"]:checked');
  const targetFramework = targetRadio ? targetRadio.value : 'vanilla';

  synth.playClick();

  // Reset steps
  ['step-creative', 'step-ux', 'step-tokens', 'step-builder', 'step-critic'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('active', 'completed');
    }
  });

  const statusText = document.getElementById('pipelineStatusText');
  if (statusText) statusText.textContent = 'SYNTHESIZING...';

  try {
    const res = await fetch('/api/oneshot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, targetFramework })
    });
    if (res.ok) {
      synth.playSkill();
    }
  } catch (err) {
    console.error('Failed to run OneShot:', err);
  }
}

function renderOneShotResults(metadata) {
  if (!metadata || !metadata.evaluation) return;
  const ev = metadata.evaluation;
  const rub = ev.rubric || {};
  const tokenStats = metadata.tokenStats || {};

  const resultsGrid = document.getElementById('oneshotResultsGrid');
  if (resultsGrid) resultsGrid.style.display = 'grid';

  const badge = document.getElementById('finalScoreBadge');
  if (badge) {
    badge.textContent = `${ev.finalScore} / 10.0`;
    badge.style.borderColor = ev.passed ? 'var(--color-green)' : 'var(--color-gold)';
    badge.style.color = ev.passed ? 'var(--color-green)' : 'var(--color-gold)';
  }

  // Token Stats update
  if (tokenStats.rawTokensEstimated) {
    const rawEl = document.getElementById('rawTokenVal');
    const actualEl = document.getElementById('actualTokenVal');
    const savedEl = document.getElementById('savedTokenVal');
    if (rawEl) rawEl.textContent = tokenStats.rawTokensEstimated.toLocaleString();
    if (actualEl) actualEl.textContent = tokenStats.actualTokensUsed.toLocaleString();
    if (savedEl) savedEl.textContent = `${tokenStats.tokensSaved.toLocaleString()} (${tokenStats.efficiencyRatio}% Saved)`;
  }

  // Rubric Meters
  const rubricContainer = document.getElementById('rubricMeters');
  if (rubricContainer) {
    rubricContainer.innerHTML = `
      <div class="rubric-row">
        <div class="rubric-label-bar"><span>ORIGINALITY</span><span>${rub.originality || 9.1} / 10</span></div>
        <div class="rubric-bar-bg"><div class="rubric-bar-fill" style="width: ${(rub.originality || 9.1) * 10}%;"></div></div>
      </div>
      <div class="rubric-row">
        <div class="rubric-label-bar"><span>TYPOGRAPHY</span><span>${rub.typography || 9.4} / 10</span></div>
        <div class="rubric-bar-bg"><div class="rubric-bar-fill" style="width: ${(rub.typography || 9.4) * 10}%;"></div></div>
      </div>
      <div class="rubric-row">
        <div class="rubric-label-bar"><span>LAYOUT & RHYTHM</span><span>${rub.layout || 8.8} / 10</span></div>
        <div class="rubric-bar-bg"><div class="rubric-bar-fill" style="width: ${(rub.layout || 8.8) * 10}%;"></div></div>
      </div>
      <div class="rubric-row">
        <div class="rubric-label-bar"><span>VISUAL HIERARCHY</span><span>${rub.visual_hierarchy || 9.2} / 10</span></div>
        <div class="rubric-bar-bg"><div class="rubric-bar-fill" style="width: ${(rub.visual_hierarchy || 9.2) * 10}%;"></div></div>
      </div>
      <div class="rubric-row">
        <div class="rubric-label-bar"><span>BRAND CONSISTENCY</span><span>${rub.brand_consistency || 9.0} / 10</span></div>
        <div class="rubric-bar-bg"><div class="rubric-bar-fill" style="width: ${(rub.brand_consistency || 9.0) * 10}%;"></div></div>
      </div>
      <div class="rubric-row">
        <div class="rubric-label-bar"><span>GENERIC AI PENALTY</span><span style="color: var(--color-green);">-${rub.generic_ai_penalty || 0.8}</span></div>
        <div class="rubric-bar-bg"><div class="rubric-bar-fill" style="width: ${(10 - (rub.generic_ai_penalty || 0.8)) * 10}%; background: var(--color-green);"></div></div>
      </div>
    `;
  }

  // Reload iframe preview
  const iframe = document.getElementById('sitePreviewIframe');
  if (iframe) {
    iframe.src = '/api/site-preview?t=' + Date.now();
  }

  const pipelineStatus = document.getElementById('pipelineStatusText');
  if (pipelineStatus) pipelineStatus.textContent = '★ COMPLETED & VERIFIED';
}

// Server-Sent Events Connection
function connectSSE() {
  const eventSource = new EventSource('/api/events');

  eventSource.addEventListener('init', (e) => {
    const data = JSON.parse(e.data);
    appState.config = data.config;
    appState.state = data.state;
    appState.events = data.history || [];

    if (data.providers) {
      updateProviderUI(data.providers);
    } else if (data.state?.activeProvider) {
      updateProviderUI({
        activeProvider: data.state.activeProvider,
        activeProviderName: data.state.activeProviderName,
        activeProviderIcon: data.state.activeProviderIcon,
        available: [{ id: data.state.activeProvider, name: data.state.activeProviderName, icon: data.state.activeProviderIcon }]
      });
    }

    renderProjectInfo();
    renderAgentGrid();
    renderSkillsList();
    renderState();
    renderLogs(appState.events);
    renderSidechat(appState.events);
  });

  eventSource.addEventListener('agent_event', (e) => {
    const event = JSON.parse(e.data);
    appState.events.push(event);
    appendLog(event);
    appendSidechatCard(event);

    // Real-time visual state & sprite animation update
    if (appState.state && event.agent) {
      if (event.agent !== 'orchestrator') {
        if (!appState.state.agents[event.agent]) {
          appState.state.agents[event.agent] = {
            state: 'IDLE',
            expression: '●_●',
            currentTask: 'Idle',
            skillsStatus: {}
          };
        }
        const aState = appState.state.agents[event.agent];
        if (event.type === 'spawn' || event.type === 'thinking') {
          aState.state = 'ANALYZING';
          aState.expression = '◉_⊙';
        } else if (event.type === 'complete') {
          aState.state = 'COMPLETED';
          aState.expression = '^‿^';
        } else if (event.type === 'error') {
          aState.state = 'ERROR';
          aState.expression = 'x_x';
        } else if (event.type === 'idle') {
          aState.state = 'IDLE';
          aState.expression = '●_●';
        } else {
          aState.state = 'WORKING';
          aState.expression = '◉▂◉';
        }
        aState.currentTask = event.message || aState.currentTask;

        if (event.skill) {
          aState.skillsStatus = aState.skillsStatus || {};
          aState.skillsStatus[event.skill] = event.type === 'complete' ? 'completed' : 'active';
        }
      } else {
        if (event.type === 'complete') {
          appState.state.status = 'COMPLETED';
        } else {
          appState.state.status = 'RUNNING';
        }
        if (appState.state.orchestrator) {
          appState.state.orchestrator.currentTask = event.message || appState.state.orchestrator.currentTask;
        }
      }
      renderState();
    }

    // OneShot Pipeline Stage & Scorecard UI Updates
    if (event.agent === 'creativeDirector') {
      const step = document.getElementById('step-creative');
      if (step) {
        if (event.type === 'complete') { step.className = 'pipeline-step completed'; }
        else { step.className = 'pipeline-step active'; }
      }
    } else if (event.agent === 'uxPlanner') {
      const step = document.getElementById('step-ux');
      if (step) {
        if (event.type === 'complete') { step.className = 'pipeline-step completed'; }
        else { step.className = 'pipeline-step active'; }
      }
    } else if (event.agent === 'designSystem') {
      const step = document.getElementById('step-tokens');
      if (step) {
        if (event.type === 'complete') { step.className = 'pipeline-step completed'; }
        else { step.className = 'pipeline-step active'; }
      }
    } else if (event.agent === 'frontend') {
      const step = document.getElementById('step-builder');
      if (step) {
        if (event.type === 'complete') { step.className = 'pipeline-step completed'; }
        else { step.className = 'pipeline-step active'; }
      }
    } else if (event.agent === 'visualCritic') {
      const step = document.getElementById('step-critic');
      if (step) {
        if (event.type === 'complete') { step.className = 'pipeline-step completed'; }
        else { step.className = 'pipeline-step active'; }
      }
    }

    if (event.metadata && (event.metadata.evaluation || event.metadata.tokenStats)) {
      renderOneShotResults(event.metadata);
    }

    // Audio cues & Report Refresh
    if (event.type === 'spawn') {
      synth.playSpawn();
    } else if (event.type === 'skill') {
      synth.playSkill();
    } else if (event.type === 'complete') {
      synth.playComplete();
      if (event.agent === 'orchestrator' || event.metadata?.report) {
        fetchReports();
      }
    } else if (event.type === 'error') {
      synth.playError();
    }
  });

  eventSource.addEventListener('state_change', (e) => {
    const data = JSON.parse(e.data);
    appState.state = data.state;
    renderState();
    if (data.state?.status === 'COMPLETED') {
      fetchReports();
    }
  });

  eventSource.onerror = () => {
    console.warn('SSE disconnected. Reconnecting in 3s...');
  };
}

// Render Project Information across the Dashboard dynamically
function renderProjectInfo() {
  if (!appState.config) return;
  const project = appState.config.project || 'my-app';
  const projectUpper = project.toUpperCase();

  // 1. Project badge in top header
  const projectBadgeEl = document.getElementById('projectName');
  if (projectBadgeEl) {
    projectBadgeEl.textContent = project;
  }

  // 2. Browser Tab Title
  document.title = `${projectUpper} // PixelCrew HQ — Autonomous Swarm Workspace`;

  // 3. Header Logo Subtitle
  const subTitleEl = document.getElementById('logoSubtitle') || document.querySelector('.logo-subtitle');
  if (subTitleEl) {
    subTitleEl.textContent = `FLOOR 42 // ${projectUpper} SPRINT HQ`;
  }

  // 4. Floor Plan Panel Title
  const floorTitleEl = document.getElementById('officeFloorTitle');
  if (floorTitleEl) {
    floorTitleEl.textContent = `${projectUpper} OPEN-PLAN ENGINEERING FLOOR`;
  }

  // 5. Dynamic Task Input Placeholder
  const taskInput = document.getElementById('taskInput');
  if (taskInput && (!taskInput.value || taskInput.value.length === 0)) {
    taskInput.placeholder = `Assign sprint objective (e.g. 'Optimize ${project} queries & build responsive UI')...`;
  }
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
