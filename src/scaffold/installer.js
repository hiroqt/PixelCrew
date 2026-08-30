/**
 * PIXEL CREW — Multi-Provider Skill Installer & Sync Engine
 * 
 * Installs, configures, and synchronizes agent skills across:
 * - .pixel-crew/ (Pixel Crew Swarm Manifest & Local Skills)
 * - .claude/ (Anthropic Claude Code)
 * - .cursor/ (Cursor AI IDE)
 * - .kiro/ (Kiro AI IDE)
 * - .agents/ (Google Antigravity & Agentic IDEs)
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { SKILL_DEFINITIONS } from '../orchestrator/skills-registry.js';
import { SKILL_MARKDOWNS } from './templates.js';
import { safeWriteFile, safeMkdir, DryRunReporter } from '../utils/fs-safe.js';

export const PROVIDER_PATHS = {
  'claude-code': (targetDir, skillName) => path.join(targetDir, '.claude', 'skills', skillName, 'SKILL.md'),
  'cursor': (targetDir, skillName) => path.join(targetDir, '.cursor', 'skills', skillName, 'SKILL.md'),
  'kiro': (targetDir, skillName) => path.join(targetDir, '.kiro', 'skills', skillName, 'SKILL.md'),
  'antigravity': (targetDir, skillName) => path.join(targetDir, '.agents', 'skills', skillName, 'SKILL.md'),
  'pixel-crew': (targetDir, skillName) => path.join(targetDir, '.pixel-crew', 'skills', `${skillName}.md`)
};

/**
 * Detects which agent environments exist in the target directory
 */
export async function detectInstalledProviders(targetDir = process.cwd()) {
  const detected = new Set(['pixel-crew']);

  const checks = [
    { provider: 'claude-code', paths: [path.join(targetDir, '.claude')] },
    { provider: 'cursor', paths: [path.join(targetDir, '.cursor'), path.join(targetDir, '.cursorrules')] },
    { provider: 'kiro', paths: [path.join(targetDir, '.kiro'), path.join(targetDir, '.kirorules'), path.join(targetDir, 'kiro.json'), path.join(targetDir, '.kiro.json')] },
    { provider: 'antigravity', paths: [path.join(targetDir, '.agents'), path.join(targetDir, '.gemini')] },
    { provider: 'pixel-crew', paths: [path.join(targetDir, '.pixel-crew'), path.join(targetDir, '.pixel-agents')] }
  ];

  for (const check of checks) {
    for (const p of check.paths) {
      try {
        await fs.access(p);
        detected.add(check.provider);
        break;
      } catch {}
    }
  }

  return Array.from(detected);
}

/**
 * Normalizes skill identifier into standard ID and kebab-case name
 */
export function normalizeSkillId(rawInput) {
  let cleaned = (rawInput || '').trim();
  // Strip @pixel-crew/ or pixel-crew/
  cleaned = cleaned.replace(/^@?pixel-crew\//, '');
  cleaned = cleaned.replace(/^skills?\//, '');

  // Check direct match in SKILL_DEFINITIONS
  if (SKILL_DEFINITIONS[cleaned]) {
    const s = SKILL_DEFINITIONS[cleaned];
    const skillName = s.id.includes('/') ? s.id.split('/')[1] : s.id;
    return { id: s.id, name: skillName, definition: s };
  }

  // Check by suffix or name match
  for (const [id, def] of Object.entries(SKILL_DEFINITIONS)) {
    const subName = id.includes('/') ? id.split('/')[1] : id;
    if (subName.toLowerCase() === cleaned.toLowerCase() || id.toLowerCase() === cleaned.toLowerCase()) {
      return { id, name: subName, definition: def };
    }
  }

  // Fallback for custom skills or oneshot
  const safeName = cleaned.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
  return {
    id: cleaned,
    name: safeName,
    definition: {
      id: cleaned,
      name: safeName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      category: 'general',
      description: `Skill capability definition for ${cleaned}`,
      targetAgents: ['frontend', 'backend', 'orchestrator']
    }
  };
}

/**
 * Generates formatted SKILL.md markdown with standard YAML frontmatter
 */
export function generateSkillMarkdown(skillMeta) {
  const { id, name, definition } = skillMeta;

  // Check if we have pre-existing detailed markdown in templates
  const markdownKey = `${name}.md`;
  if (SKILL_MARKDOWNS[markdownKey]) {
    const raw = SKILL_MARKDOWNS[markdownKey].trim();
    if (raw.startsWith('---')) {
      return raw + '\n';
    }
    return `---
name: ${name}
description: ${definition.description || 'Pixel Crew Agent Skill'}
category: ${definition.category || 'general'}
---

${raw}
`;
  }

  return `---
name: ${name}
description: ${definition.description || 'Pixel Crew Agent Skill'}
category: ${definition.category || 'general'}
---

# ${definition.name || name}

${definition.description || 'Custom capability skill.'}

## Targeted Agents
${(definition.targetAgents || ['all']).map(a => `- ${a}`).join('\n')}

## Usage & Guidelines
- Follow domain-specific best practices and avoid generic anti-patterns.
- Enforce strict typing, comprehensive testing, and modular architecture.
`;
}

/**
 * Installs a skill across detected or specified agent providers
 */
export async function installSkill(targetDir = process.cwd(), rawSkillInput, options = {}) {
  const {
    dryRun = false,
    provider = null,
    reporter = new DryRunReporter(targetDir)
  } = options;

  const skillMeta = normalizeSkillId(rawSkillInput);
  const content = generateSkillMarkdown(skillMeta);

  // Determine target providers
  let targetProviders = [];
  if (provider && provider !== 'auto') {
    if (provider === 'all') {
      targetProviders = Object.keys(PROVIDER_PATHS);
    } else {
      const p = provider.toLowerCase();
      if (PROVIDER_PATHS[p]) targetProviders.push(p);
      else if (p === 'claude') targetProviders.push('claude-code');
      else if (p === 'agents') targetProviders.push('antigravity');
    }
  } else {
    // Auto-detect environments
    targetProviders = await detectInstalledProviders(targetDir);
    // If only pixel-crew is detected, also install to claude and cursor by default if requested
    if (options.allProviders) {
      targetProviders = Object.keys(PROVIDER_PATHS);
    }
  }

  // Ensure pixel-crew is always included
  if (!targetProviders.includes('pixel-crew')) {
    targetProviders.push('pixel-crew');
  }

  const writtenPaths = [];

  for (const p of targetProviders) {
    const pathFn = PROVIDER_PATHS[p];
    if (!pathFn) continue;

    const fullPath = pathFn(targetDir, skillMeta.name);
    const res = await safeWriteFile(fullPath, content, {
      dryRun,
      reporter,
      targetDir
    });
    writtenPaths.push({ provider: p, path: fullPath, ...res });
  }

  // Update .pixel-crew/pixel.json manifest
  const manifestPath = path.join(targetDir, '.pixel-crew', 'pixel.json');
  let manifest = {
    name: path.basename(targetDir),
    version: '0.2.4',
    skills: {},
    installedAt: new Date().toISOString()
  };

  try {
    const raw = await fs.readFile(manifestPath, 'utf-8');
    manifest = JSON.parse(raw);
  } catch {}

  if (!manifest.skills) manifest.skills = {};
  manifest.skills[skillMeta.id] = {
    name: skillMeta.name,
    category: skillMeta.definition.category || 'general',
    providers: targetProviders,
    installedAt: new Date().toISOString()
  };

  await safeWriteFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', {
    dryRun,
    reporter,
    targetDir
  });

  return {
    success: true,
    skillId: skillMeta.id,
    skillName: skillMeta.name,
    providers: targetProviders,
    writtenPaths,
    dryRun,
    reporter
  };
}

/**
 * Synchronizes all installed skills across all detected or specified IDE agent directories
 */
export async function syncSkills(targetDir = process.cwd(), options = {}) {
  const {
    dryRun = false,
    provider = null,
    reporter = new DryRunReporter(targetDir)
  } = options;

  const manifestPath = path.join(targetDir, '.pixel-crew', 'pixel.json');
  let manifest = null;

  try {
    const raw = await fs.readFile(manifestPath, 'utf-8');
    manifest = JSON.parse(raw);
  } catch {}

  // Discover skills from manifest or .pixel-crew/skills directory
  const skillsToSync = new Set();

  if (manifest?.skills) {
    for (const sId of Object.keys(manifest.skills)) {
      skillsToSync.add(sId);
    }
  }

  // Check .pixel-crew/skills directory
  const pixelCrewSkillsDir = path.join(targetDir, '.pixel-crew', 'skills');
  try {
    const files = await fs.readdir(pixelCrewSkillsDir);
    for (const f of files) {
      if (f.endsWith('.md')) {
        skillsToSync.add(f.replace(/\.md$/, ''));
      }
    }
  } catch {}

  // If no skills found, fallback to core default skills
  if (skillsToSync.size === 0) {
    skillsToSync.add('frontend/nextjs');
    skillsToSync.add('design/ui-design');
    skillsToSync.add('design/typography');
    skillsToSync.add('anti-ai/slop-guardian');
  }

  const results = [];
  for (const sId of skillsToSync) {
    const res = await installSkill(targetDir, sId, {
      dryRun,
      provider,
      reporter
    });
    results.push(res);
  }

  return {
    success: true,
    skillsSynced: Array.from(skillsToSync),
    results,
    dryRun,
    reporter
  };
}
