/**
 * PIXEL CREW — Universal Skill Protocol
 * 
 * Standard skill interfaces, capability tags, and resolution schemas.
 */

export const SKILL_CATEGORIES = {
  FRONTEND: 'frontend',
  DESIGN: 'design',
  MOTION: 'motion',
  QUALITY: 'quality',
  BACKEND: 'backend',
  CONTENT: 'content',
  ANTI_AI: 'anti-ai'
};

/**
 * Creates a standardized Skill object
 */
export function createSkill(options = {}) {
  const skill = {
    id: String(options.id || ''),
    name: String(options.name || options.id || 'Untitled Skill'),
    category: String(options.category || SKILL_CATEGORIES.FRONTEND),
    description: String(options.description || ''),
    targetAgents: Array.isArray(options.targetAgents) ? [...options.targetAgents] : ['frontend'],
    metadata: typeof options.metadata === 'object' && options.metadata !== null ? { ...options.metadata } : {}
  };

  validateSkill(skill);
  return skill;
}

/**
 * Validates a Skill object
 */
export function validateSkill(skill) {
  if (!skill || typeof skill !== 'object') {
    throw new Error('Skill must be a non-null object');
  }
  if (!skill.id || typeof skill.id !== 'string') {
    throw new Error('Skill must have a valid string id');
  }
  if (!skill.name || typeof skill.name !== 'string') {
    throw new Error('Skill must have a valid string name');
  }
  if (!skill.category || typeof skill.category !== 'string') {
    throw new Error('Skill must have a valid category');
  }
  if (!Array.isArray(skill.targetAgents) || skill.targetAgents.length === 0) {
    throw new Error('Skill must target at least one agent');
  }
  return true;
}
