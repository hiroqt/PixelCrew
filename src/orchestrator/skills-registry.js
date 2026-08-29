/**
 * PIXEL CREW — Modular Skill Registry
 * 
 * Reusable capability definitions across Frontend, Design, Motion, Quality, Backend, and Content.
 */

export const SKILL_DEFINITIONS = {
  // Frontend Skills
  'frontend/nextjs': {
    id: 'frontend/nextjs',
    name: 'Next.js 14/15 App Router',
    category: 'frontend',
    description: 'Server Components, Streaming SSR, Layout hierarchy, and Metadata APIs',
    targetAgents: ['frontend']
  },
  'frontend/react': {
    id: 'frontend/react',
    name: 'React 18/19 Primitives',
    category: 'frontend',
    description: 'Custom React hooks, client-side state management, and component islands',
    targetAgents: ['frontend']
  },
  'frontend/tailwind': {
    id: 'frontend/tailwind',
    name: 'Tailwind CSS & Token System',
    category: 'frontend',
    description: 'Utility-first styling, design token mapping, fluid clamp scales, and dark mode',
    targetAgents: ['frontend', 'designSystem']
  },
  'frontend/accessibility': {
    id: 'frontend/accessibility',
    name: 'WCAG 2.1 AA/AAA Accessibility',
    category: 'frontend',
    description: 'ARIA landmarks, keyboard focus management, and color contrast compliance',
    targetAgents: ['frontend', 'qa']
  },

  // Design Skills
  'design/ui-design': {
    id: 'design/ui-design',
    name: 'Bespoke UI & Asymmetric Layouts',
    category: 'design',
    description: 'High-contrast visual hierarchy, intentional whitespace, and Bento grid topologies',
    targetAgents: ['creativeDirector', 'uxPlanner']
  },
  'design/typography': {
    id: 'design/typography',
    name: 'Expressive Typography Scales',
    category: 'design',
    description: 'Mathematical fluid clamp() type scales, display serif and geometric sans pairings',
    targetAgents: ['creativeDirector', 'designSystem']
  },
  'design/design-system': {
    id: 'design/design-system',
    name: 'Design System Architecture',
    category: 'design',
    description: 'CSS Custom Properties, HSL color tokens, surface elevation tiers, and borders',
    targetAgents: ['designSystem']
  },

  // Motion & Animation Skills
  'motion/framer-motion': {
    id: 'motion/framer-motion',
    name: 'Framer Motion & View Transitions',
    category: 'motion',
    description: 'Smooth scroll-driven reveals, staggered entrance choreography, and gesture physics',
    targetAgents: ['animationSpecialist', 'frontend']
  },
  'motion/micro-interactions': {
    id: 'motion/micro-interactions',
    name: 'Interactive Micro-Interactions',
    category: 'motion',
    description: 'Hover states, magnetic buttons, live filter transitions, and interactive terminal state',
    targetAgents: ['animationSpecialist', 'frontend']
  },

  // Quality & Review Skills
  'quality/responsive-design': {
    id: 'quality/responsive-design',
    name: 'Adaptive Responsive Design',
    category: 'quality',
    description: 'Fluid viewports from 360px mobile to 4K desktop with zero horizontal overflow',
    targetAgents: ['responsiveSpecialist', 'frontend']
  },
  'quality/visual-review': {
    id: 'quality/visual-review',
    name: '6-Dimension Anti-AI Rubric Review',
    category: 'quality',
    description: 'Originality, Typography, Layout, Hierarchy, Brand Consistency, and AI Slop Penalty audit',
    targetAgents: ['visualCritic', 'qa']
  },
  'quality/browser-testing': {
    id: 'quality/browser-testing',
    name: 'Build Verification & Smoke Testing',
    category: 'quality',
    description: 'Syntax validation, TypeScript type-checking, and layout integrity checks',
    targetAgents: ['qa']
  },

  // Backend & Data Skills
  'backend/route-handlers': {
    id: 'backend/route-handlers',
    name: 'TypeScript Route Handlers',
    category: 'backend',
    description: 'Next.js App Router API routes, JSON schema validation, and RFC 7807 error envelopes',
    targetAgents: ['backend']
  },
  'backend/data-models': {
    id: 'backend/data-models',
    name: 'Structured Data Modeling',
    category: 'backend',
    description: 'Domain entities, TypeScript interfaces, and static fixtures',
    targetAgents: ['backend', 'database']
  },

  // Content & Anti-AI Skills
  'content/copywriting': {
    id: 'content/copywriting',
    name: 'Grounded Technical Copywriting',
    category: 'content',
    description: 'Zero AI cliché copy, authentic product propositions, and real technical metrics',
    targetAgents: ['contentStrategist', 'uxPlanner']
  },
  'anti-ai/slop-guardian': {
    id: 'anti-ai/slop-guardian',
    name: 'Anti-AI Pattern Detection Guardian',
    category: 'quality',
    description: 'Bans purple/blue mesh gradient blobs, repeating 3-card grids, and fake AI sparkles',
    targetAgents: ['creativeDirector', 'visualCritic']
  }
};

export class SkillRegistry {
  constructor() {
    this.skills = new Map(Object.entries(SKILL_DEFINITIONS));
  }

  getSkill(skillId) {
    return this.skills.get(skillId) || null;
  }

  getAllSkills() {
    return Array.from(this.skills.values());
  }

  getSkillsByCategory(category) {
    return Array.from(this.skills.values()).filter(s => s.category === category);
  }

  /**
   * Matches task requirements to skill IDs
   */
  matchSkills(taskRequirement) {
    const text = (taskRequirement || '').toLowerCase();
    const matched = new Set();

    if (text.includes('next') || text.includes('component') || text.includes('page')) {
      matched.add('frontend/nextjs');
      matched.add('frontend/react');
      matched.add('frontend/tailwind');
    }
    if (text.includes('design') || text.includes('visual') || text.includes('artistic')) {
      matched.add('design/ui-design');
      matched.add('design/typography');
      matched.add('design/design-system');
      matched.add('anti-ai/slop-guardian');
    }
    if (text.includes('animation') || text.includes('motion') || text.includes('interaction')) {
      matched.add('motion/framer-motion');
      matched.add('motion/micro-interactions');
    }
    if (text.includes('responsive') || text.includes('mobile') || text.includes('tablet')) {
      matched.add('quality/responsive-design');
    }
    if (text.includes('api') || text.includes('backend') || text.includes('route')) {
      matched.add('backend/route-handlers');
      matched.add('backend/data-models');
    }
    if (text.includes('qa') || text.includes('test') || text.includes('review') || text.includes('rubric')) {
      matched.add('quality/visual-review');
      matched.add('quality/browser-testing');
    }
    if (text.includes('copy') || text.includes('content') || text.includes('text')) {
      matched.add('content/copywriting');
    }

    if (matched.size === 0) {
      matched.add('frontend/nextjs');
      matched.add('frontend/tailwind');
    }

    return Array.from(matched);
  }
}
