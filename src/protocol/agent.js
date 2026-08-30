/**
 * PIXEL CREW — Universal Agent Protocol & Roles
 * 
 * Standardized agent roles, states, expressions, and capability contracts.
 */

export const AGENT_STATES = {
  IDLE: 'IDLE',
  SPAWNING: 'SPAWNING',
  ANALYZING: 'ANALYZING',
  WORKING: 'WORKING',
  BLOCKED: 'BLOCKED',
  VERIFYING: 'VERIFYING',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR'
};

export const AGENT_EXPRESSIONS = {
  IDLE: '●_●',
  SPAWNING: '░_░',
  ANALYZING: '◉_⊙',
  WORKING: '◉▂◉',
  BLOCKED: '?_?',
  VERIFYING: '🔍_🔍',
  COMPLETED: '^_^',
  ERROR: 'x_x'
};

export const ORCHESTRATOR_EXPRESSIONS = {
  IDLE: '◉_◉',
  COORDINATING: '◉_◉ ⚡',
  ANALYZING: '◉_⊙',
  COMPLETED: '★_★',
  ERROR: 'x_x'
};

export const AGENT_ROLES = {
  orchestrator: {
    id: 'orchestrator',
    name: 'Tech Lead / Master CPU',
    title: 'Staff Swarm Architect & Project Lead',
    color: '#ffd700',
    icon: '👔',
    defaultSkills: ['anti-ai/slop-guardian']
  },
  creativeDirector: {
    id: 'creativeDirector',
    name: 'Creative Director',
    title: 'Lead Aesthetic Strategist & Brand Architect',
    color: '#ff9900',
    icon: '✨',
    defaultSkills: ['design/ui-design', 'design/typography', 'anti-ai/slop-guardian']
  },
  frontend: {
    id: 'frontend',
    name: 'Frontend Builder',
    title: 'Senior UI/UX & Component Engineer',
    color: '#00f0ff',
    icon: '🎨',
    defaultSkills: ['frontend/nextjs', 'frontend/react', 'frontend/tailwind', 'frontend/accessibility']
  },
  backend: {
    id: 'backend',
    name: 'Backend Engineer',
    title: 'Principal API & Distributed Systems Engineer',
    color: '#ff007f',
    icon: '⚡',
    defaultSkills: ['backend/route-handlers', 'backend/data-models']
  },
  database: {
    id: 'database',
    name: 'Database Architect',
    title: 'Principal DBA & Query Performance Engineer',
    color: '#ffd700',
    icon: '🗄️',
    defaultSkills: ['backend/data-models']
  },
  security: {
    id: 'security',
    name: 'Security Sentinel',
    title: 'InfoSec Lead & OWASP Auditor',
    color: '#ff3344',
    icon: '🛡️',
    defaultSkills: ['frontend/accessibility']
  },
  performance: {
    id: 'performance',
    name: 'Performance Profiler',
    title: 'Core Web Vitals & Runtime Optimizer',
    color: '#00ff88',
    icon: '🚀',
    defaultSkills: ['quality/responsive-design']
  },
  qa: {
    id: 'qa',
    name: 'QA & Visual Critic',
    title: 'Lead Verification & Anti-AI Rubric Guardian',
    color: '#bd00ff',
    icon: '🧪',
    defaultSkills: ['quality/visual-review', 'quality/browser-testing', 'anti-ai/slop-guardian']
  },
  animationSpecialist: {
    id: 'animationSpecialist',
    name: 'Motion Specialist',
    title: 'Senior Kinetic Choreographer & Micro-Interactions',
    color: '#38bdf8',
    icon: '🎬',
    defaultSkills: ['motion/framer-motion', 'motion/micro-interactions']
  }
};

/**
 * Creates and normalizes an Agent Capabilities record
 */
export function normalizeCapabilities(capabilities = {}) {
  return {
    fileAccess: Boolean(capabilities.fileAccess ?? true),
    terminalAccess: Boolean(capabilities.terminalAccess ?? true),
    subagents: Boolean(capabilities.subagents ?? false),
    backgroundTasks: Boolean(capabilities.backgroundTasks ?? true),
    streaming: Boolean(capabilities.streaming ?? true),
    toolCalls: Boolean(capabilities.toolCalls ?? true)
  };
}
