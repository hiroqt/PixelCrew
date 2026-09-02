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
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { SKILL_DEFINITIONS } from '../orchestrator/skills-registry.js';
import { SKILL_MARKDOWNS } from './templates.js';
import { getSkillBundle, sanitizeFrontmatter } from './skills-bundle.js';
import { generateKiroFiles } from './kiro-generator.js';
import { generateCursorFiles, generateAntigravityFiles, generateClaudeFiles } from './ide-rules.js';
import { safeWriteFile, safeMkdir, DryRunReporter } from '../utils/fs-safe.js';

export const PROVIDER_PATHS = {
  'claude-code': (targetDir, skillName) => path.join(targetDir, '.claude', 'skills', skillName, 'SKILL.md'),
  'cursor': (targetDir, skillName) => path.join(targetDir, '.cursor', 'skills', skillName, 'SKILL.md'),
  'kiro': (targetDir, skillName) => path.join(targetDir, '.kiro', 'skills', skillName, 'SKILL.md'),
  'antigravity': (targetDir, skillName) => path.join(targetDir, '.agents', 'skills', skillName, 'SKILL.md'),
  'codex': (targetDir, skillName) => path.join(targetDir, '.codex', 'skills', skillName, 'SKILL.md'),
  'pixel-crew': (targetDir, skillName) => path.join(targetDir, '.pixel-crew', 'skills', `${skillName}.md`)
};

export const GLOBAL_PROVIDER_PATHS = {
  'claude-code': (skillName) => path.join(os.homedir(), '.claude', 'skills', skillName, 'SKILL.md'),
  'cursor': (skillName) => path.join(os.homedir(), '.cursor', 'skills', skillName, 'SKILL.md'),
  'kiro': (skillName) => path.join(os.homedir(), '.kiro', 'skills', skillName, 'SKILL.md'),
  'antigravity': (skillName) => path.join(os.homedir(), '.gemini', 'config', 'skills', skillName, 'SKILL.md'),
  'codex': (skillName) => path.join(os.homedir(), '.codex', 'skills', skillName, 'SKILL.md'),
  'pixel-crew': (skillName) => path.join(os.homedir(), '.pixel-crew', 'skills', `${skillName}.md`)
};

/**
 * Detects which IDE / Coding Agent environment the current terminal shell is executing inside
 */
export function detectActiveIDE() {
  const env = process.env;

  // 1. Kiro AI
  if (
    env.KIRO === '1' ||
    env.KIRO_AGENT ||
    env.KIRO_SESSION ||
    env.KIRO_APP_DIR ||
    env.TERM_PROGRAM === 'kiro' ||
    env.VSCODE_GIT_ASKPASS_NODE?.toLowerCase().includes('kiro')
  ) {
    return {
      id: 'kiro',
      name: 'Kiro AI',
      globalPath: path.join(os.homedir(), '.kiro', 'skills'),
      detectedVia: 'env'
    };
  }

  // 2. Cursor AI
  if (
    env.CURSOR === '1' ||
    env.CURSOR_AGENT ||
    env.CURSOR_SESSION ||
    env.CURSOR_APP_DIR ||
    env.TERM_PROGRAM === 'cursor' ||
    env.VSCODE_GIT_ASKPASS_NODE?.toLowerCase().includes('cursor')
  ) {
    return {
      id: 'cursor',
      name: 'Cursor IDE',
      globalPath: path.join(os.homedir(), '.cursor', 'skills'),
      detectedVia: 'env'
    };
  }

  // 3. Google Antigravity
  if (
    env.ANTIGRAVITY_APP_DIR ||
    env.AGY_SESSION ||
    env.ANTIGRAVITY ||
    env.ANTIGRAVITY_IDE ||
    env.AGY ||
    env.TERM_PROGRAM === 'antigravity' ||
    env.VSCODE_GIT_ASKPASS_NODE?.toLowerCase().includes('antigravity') ||
    (env.CORPUS_NAME && env.CONVERSATION_ID)
  ) {
    return {
      id: 'antigravity',
      name: 'Google Antigravity',
      globalPath: path.join(os.homedir(), '.gemini', 'config', 'skills'),
      detectedVia: 'env'
    };
  }

  // 4. Claude Code
  if (env.CLAUDE_CODE || env.CLAUDE_SESSION || env.CLAUDE_AGENT) {
    return {
      id: 'claude-code',
      name: 'Claude Code',
      globalPath: path.join(os.homedir(), '.claude', 'skills'),
      detectedVia: 'env'
    };
  }

  // 5. Codex
  if (env.CODEX_SESSION || env.CODEX_AGENT || env.CODEX) {
    return {
      id: 'codex',
      name: 'OpenAI Codex',
      globalPath: path.join(os.homedir(), '.codex', 'skills'),
      detectedVia: 'env'
    };
  }

  return {
    id: 'pixel-crew',
    name: 'Pixel Crew',
    globalPath: path.join(os.homedir(), '.pixel-crew', 'skills'),
    detectedVia: 'default'
  };
}

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
      return sanitizeFrontmatter(raw + '\n');
    }
    return sanitizeFrontmatter(`---
name: ${name}
description: ${definition.description || 'Pixel Crew Agent Skill'}
category: ${definition.category || 'general'}
---

${raw}
`);
  }

  return sanitizeFrontmatter(`---
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
`);
}

/**
 * Installs a skill across detected or specified agent providers (project or global scope)
 */
export async function installSkill(targetDir = process.cwd(), rawSkillInput, options = {}) {
  const {
    dryRun = false,
    provider = null,
    scope = (options.global ? 'global' : (options.scope || 'project')),
    reporter = new DryRunReporter(targetDir)
  } = options;

  const skillMeta = normalizeSkillId(rawSkillInput);
  const bundle = await getSkillBundle(rawSkillInput);
  const content = (bundle && bundle.content) ? bundle.content : generateSkillMarkdown(skillMeta);
  const activeIDE = detectActiveIDE();

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
    if (scope === 'global') {
      targetProviders = [activeIDE.id];
    } else {
      // Auto-detect environments
      targetProviders = await detectInstalledProviders(targetDir);
      if (activeIDE.id !== 'pixel-crew' && !targetProviders.includes(activeIDE.id)) {
        targetProviders.push(activeIDE.id);
      }
      // Always ensure Antigravity workspace skills (.agents/skills) are provisioned
      if (!targetProviders.includes('antigravity')) {
        targetProviders.push('antigravity');
      }
      if (options.allProviders || scope === 'all') {
        targetProviders = Object.keys(PROVIDER_PATHS);
      }
    }
  }

  // Ensure pixel-crew is included for project-level manifests
  if (scope !== 'global' && !targetProviders.includes('pixel-crew')) {
    targetProviders.push('pixel-crew');
  }

  const writtenPaths = [];

  // 1. Write Project-Level skills if scope is 'project', 'both', or 'all'
  if (scope !== 'global') {
    for (const p of targetProviders) {
      const pathFn = PROVIDER_PATHS[p];
      if (!pathFn) continue;

      const fullPath = pathFn(targetDir, skillMeta.name);
      const res = await safeWriteFile(fullPath, content, {
        dryRun,
        reporter,
        targetDir
      });
      writtenPaths.push({ provider: p, scope: 'project', path: fullPath, ...res });

      // Write attached reference documents for directory-based providers
      if (p !== 'pixel-crew' && bundle?.references && Object.keys(bundle.references).length > 0) {
        const skillDir = path.dirname(fullPath);
        for (const [refName, refContent] of Object.entries(bundle.references)) {
          const refFullPath = path.join(skillDir, 'references', refName);
          await safeWriteFile(refFullPath, refContent, { dryRun, reporter, targetDir });
        }
      }
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
  }

  // 2. Write Global skills if scope is 'global' or 'both'
  if (scope === 'global' || scope === 'both') {
    const globalProviders = provider && provider !== 'auto'
      ? (provider === 'all' ? Object.keys(GLOBAL_PROVIDER_PATHS) : [provider.toLowerCase() === 'claude' ? 'claude-code' : (provider.toLowerCase() === 'agents' ? 'antigravity' : provider.toLowerCase())])
      : [activeIDE.id];

    for (const gp of globalProviders) {
      const globalPathFn = GLOBAL_PROVIDER_PATHS[gp];
      if (!globalPathFn) continue;

      const fullGlobalPath = globalPathFn(skillMeta.name);
      const res = await safeWriteFile(fullGlobalPath, content, {
        dryRun,
        reporter,
        targetDir: os.homedir()
      });
      writtenPaths.push({ provider: gp, scope: 'global', path: fullGlobalPath, ...res });

      // Write attached reference documents globally
      if (gp !== 'pixel-crew' && bundle?.references && Object.keys(bundle.references).length > 0) {
        const skillDir = path.dirname(fullGlobalPath);
        for (const [refName, refContent] of Object.entries(bundle.references)) {
          const refFullPath = path.join(skillDir, 'references', refName);
          await safeWriteFile(refFullPath, refContent, { dryRun, reporter, targetDir: os.homedir() });
        }
      }
    }
  }

  return {
    success: true,
    skillId: skillMeta.id,
    skillName: skillMeta.name,
    providers: targetProviders,
    scope,
    activeIDE,
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
    scope = (options.global ? 'global' : (options.scope || 'project')),
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

  // Always ensure all canonical core production skills and domain aliases are synced
  const canonicalSkills = [
    'pixelcrew',
    'anti-ai-patterns',
    'design-director',
    'frontend-engineering',
    'backend-engineering',
    'database-engineering',
    'performance-engineering',
    'codebase-intelligence',
    'token-efficiency',
    'design/ui-design',
    'design/typography',
    'frontend/nextjs',
    'anti-ai/slop-guardian'
  ];
  for (const s of canonicalSkills) {
    skillsToSync.add(s);
  }

  const results = [];
  for (const sId of skillsToSync) {
    const res = await installSkill(targetDir, sId, {
      dryRun,
      provider,
      scope,
      reporter
    });
    results.push(res);
  }

  // Generate IDE-specific workflow definitions and steering rules
  const detected = await detectInstalledProviders(targetDir);
  const activeIDE = detectActiveIDE();

  // 1. Kiro Workflows & Rules
  if (detected.includes('kiro') || activeIDE.id === 'kiro' || provider === 'kiro' || provider === 'all') {
    if (scope !== 'global') {
      const kiroFiles = generateKiroFiles(targetDir, false);
      for (const kf of kiroFiles) {
        await safeWriteFile(kf.path, kf.content, { dryRun, reporter, targetDir });
      }
    }
    if (scope === 'global' || scope === 'both') {
      const kiroGlobalFiles = generateKiroFiles(os.homedir(), true);
      for (const kf of kiroGlobalFiles) {
        await safeWriteFile(kf.path, kf.content, { dryRun, reporter, targetDir: os.homedir() });
      }
    }
  }

  // 2. Cursor Rules & MDC
  if (detected.includes('cursor') || activeIDE.id === 'cursor' || provider === 'cursor' || provider === 'all') {
    if (scope !== 'global') {
      const cursorFiles = generateCursorFiles(targetDir);
      for (const cf of cursorFiles) {
        await safeWriteFile(cf.path, cf.content, { dryRun, reporter, targetDir });
      }
    }
  }

  // 3. Antigravity Agent Instructions (AGENTS.md, GEMINI.md, .agents/rules/)
  if (detected.includes('antigravity') || activeIDE.id === 'antigravity' || provider === 'antigravity' || provider === 'all') {
    if (scope !== 'global') {
      const antigravityFiles = generateAntigravityFiles(targetDir);
      for (const af of antigravityFiles) {
        await safeWriteFile(af.path, af.content, { dryRun, reporter, targetDir });
      }
    }
  }

  // 4. Claude Code Instructions (CLAUDE.md, .claude-plugin/)
  if (detected.includes('claude-code') || activeIDE.id === 'claude-code' || provider === 'claude-code' || provider === 'all') {
    if (scope !== 'global') {
      const claudeFiles = generateClaudeFiles(targetDir);
      for (const clf of claudeFiles) {
        await safeWriteFile(clf.path, clf.content, { dryRun, reporter, targetDir });
      }
    }
  }

  // 3. Synchronize Dashboard Assets if workspace dashboard directory exists
  const srcDashboardDir = fileURLToPath(new URL('../dashboard', import.meta.url));
  const dashboardTargets = [
    path.join(targetDir, '.pixel-crew', 'dashboard')
  ];

  for (const dashDir of dashboardTargets) {
    try {
      const parentDir = path.dirname(dashDir);
      const parentExists = await fs.access(parentDir).then(() => true).catch(() => false);
      if (parentExists) {
        await safeMkdir(dashDir, { dryRun, reporter });
        const html = await fs.readFile(path.join(srcDashboardDir, 'index.html'), 'utf-8');
        const css = await fs.readFile(path.join(srcDashboardDir, 'styles.css'), 'utf-8');
        const js = await fs.readFile(path.join(srcDashboardDir, 'app.js'), 'utf-8');
        await safeWriteFile(path.join(dashDir, 'index.html'), html, { dryRun, reporter, targetDir });
        await safeWriteFile(path.join(dashDir, 'styles.css'), css, { dryRun, reporter, targetDir });
        await safeWriteFile(path.join(dashDir, 'app.js'), js, { dryRun, reporter, targetDir });
      }
    } catch {}
  }

  return {
    success: true,
    skillsSynced: Array.from(skillsToSync),
    scope,
    results,
    dryRun,
    reporter
  };
}

