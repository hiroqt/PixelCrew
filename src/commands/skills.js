/**
 * PIXEL CREW — /skills Command
 * 
 * Lists all available skills in the registry, their categories, and targeted agents.
 */

import { PixelCommand } from './command.interface.js';
import { SKILL_DEFINITIONS } from '../orchestrator/skills-registry.js';

export class SkillsCommand extends PixelCommand {
  constructor() {
    super({
      name: 'skills',
      aliases: ['skillset'],
      description: 'Show available skills, categories, and targeted agent capabilities',
      usage: '/skills [category]',
      category: 'inspection'
    });
  }

  async execute(context, args) {
    const filterCategory = args[0]?.toLowerCase();

    const outputLines = [
      '╔══════════════════════════════════════════════════════════════════╗',
      '║   PIXEL CREW — MODULAR SKILL REGISTRY                           ║',
      '╚══════════════════════════════════════════════════════════════════╝',
      ''
    ];

    const filtered = Object.values(SKILL_DEFINITIONS).filter(s => {
      if (!filterCategory) return true;
      return s.category === filterCategory;
    });

    const categories = {};
    for (const skill of filtered) {
      if (!categories[skill.category]) categories[skill.category] = [];
      categories[skill.category].push(skill);
    }

    for (const [cat, list] of Object.entries(categories)) {
      outputLines.push(`[${cat.toUpperCase()} SKILLS]`);
      for (const s of list) {
        outputLines.push(`  • ${s.id.padEnd(28)} → ${s.name} (${s.description})`);
      }
      outputLines.push('');
    }

    return {
      success: true,
      message: `Found ${filtered.length} registered skills`,
      data: { skills: filtered },
      output: outputLines.join('\n')
    };
  }
}
