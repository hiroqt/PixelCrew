/**
 * PIXEL CREW — Floor 42 Workstation Scanner & Interactive Installer
 * 
 * Detects workspace harnesses and global AI coding environments across Kiro, Cursor,
 * Antigravity, Claude Code, Codex, and Gemini, providing a personalized interactive deployment flow.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import readline from 'node:readline/promises';
import { PROVIDER_PATHS, GLOBAL_PROVIDER_PATHS, detectActiveIDE } from './installer.js';
import { getSkillBundle, getAllCanonicalSkillIds } from './skills-bundle.js';
import { generateKiroFiles } from './kiro-generator.js';
import { safeWriteFile, safeMkdir, DryRunReporter } from '../utils/fs-safe.js';

/**
 * Discovers all active workspace and global user AI coding workstations
 */
export async function scanAllWorkstations(targetDir = process.cwd()) {
  const home = os.homedir();

  const candidates = [
    // Local Workspace Workstations
    {
      id: 'kiro',
      name: 'Kiro AI',
      scope: 'workspace',
      path: path.join(targetDir, '.kiro'),
      displayPath: './.kiro',
      configFiles: [path.join(targetDir, '.kirorules'), path.join(targetDir, 'kiro.json'), path.join(targetDir, '.kiro.json')]
    },
    {
      id: 'cursor',
      name: 'Cursor IDE',
      scope: 'workspace',
      path: path.join(targetDir, '.cursor'),
      displayPath: './.cursor',
      configFiles: [path.join(targetDir, '.cursorrules')]
    },
    {
      id: 'antigravity',
      name: 'Google Antigravity',
      scope: 'workspace',
      path: path.join(targetDir, '.agents'),
      displayPath: './.agents',
      configFiles: [path.join(targetDir, 'AGENTS.md'), path.join(targetDir, '.agent')]
    },
    {
      id: 'claude-code',
      name: 'Claude Code',
      scope: 'workspace',
      path: path.join(targetDir, '.claude'),
      displayPath: './.claude',
      configFiles: [path.join(targetDir, 'CLAUDE.md')]
    },
    {
      id: 'pixel-crew',
      name: 'Pixel Crew HQ',
      scope: 'workspace',
      path: path.join(targetDir, '.pixel-crew'),
      displayPath: './.pixel-crew',
      configFiles: [path.join(targetDir, '.pixel-crew', 'pixel.json')]
    },

    // Global User-Level AI Environments
    {
      id: 'kiro',
      name: 'Kiro AI (Global)',
      scope: 'global',
      path: path.join(home, '.kiro'),
      displayPath: '~/.kiro',
      configFiles: [path.join(home, '.config', 'kiro')]
    },
    {
      id: 'antigravity',
      name: 'Google Antigravity (Global)',
      scope: 'global',
      path: path.join(home, '.gemini', 'config'),
      displayPath: '~/.gemini/config',
      configFiles: [path.join(home, '.gemini', 'antigravity-ide'), path.join(home, '.agents')]
    },
    {
      id: 'claude-code',
      name: 'Claude Code (Global)',
      scope: 'global',
      path: path.join(home, '.claude'),
      displayPath: '~/.claude',
      configFiles: []
    },
    {
      id: 'cursor',
      name: 'Cursor IDE (Global)',
      scope: 'global',
      path: path.join(home, '.cursor'),
      displayPath: '~/.cursor',
      configFiles: []
    },
    {
      id: 'codex',
      name: 'OpenAI Codex (Global)',
      scope: 'global',
      path: path.join(home, '.codex'),
      displayPath: '~/.codex',
      configFiles: []
    }
  ];

  const detected = [];
  const activeIDE = detectActiveIDE();

  for (const c of candidates) {
    let isPresent = false;

    try {
      await fs.access(c.path);
      isPresent = true;
    } catch {
      for (const cf of c.configFiles) {
        try {
          await fs.access(cf);
          isPresent = true;
          break;
        } catch {}
      }
    }

    // Always include active IDE workspace or default
    if (!isPresent && c.scope === 'workspace' && c.id === activeIDE.id) {
      isPresent = true;
    }

    if (isPresent) {
      detected.push({
        ...c,
        isActive: c.id === activeIDE.id
      });
    }
  }

  // Ensure pixel-crew workspace is always present
  if (!detected.some(d => d.id === 'pixel-crew' && d.scope === 'workspace')) {
    detected.push({
      id: 'pixel-crew',
      name: 'Pixel Crew HQ',
      scope: 'workspace',
      path: path.join(targetDir, '.pixel-crew'),
      displayPath: './.pixel-crew',
      isActive: true
    });
  }

  return detected;
}

/**
 * Runs the interactive Floor 42 Workstation Dispatcher
 */
export async function promptWorkstationSetup(targetDir = process.cwd(), options = {}) {
  const activeIDE = detectActiveIDE();
  const detected = await scanAllWorkstations(targetDir);

  const isInteractive = !options.yes && !options.dryRun && process.stdin.isTTY;
  let selectedPlan = options.scope || 'detected';
  let targetWorkstations = [];

  if (isInteractive) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('\n\x1b[36m' + `
 ╔══════════════════════════════════════════════════════════════════════╗
 ║   PIXEL CREW — AGENT WORKSTATION DISPATCHER                          ║
 ║                      [ ◉ _ ◉ ]                                      ║
 ╚══════════════════════════════════════════════════════════════════════╝
` + '\x1b[0m');

    console.log('\x1b[33mScanning AI coding environments and workstations:\x1b[0m\n');
    console.log(' \x1b[90m┌── DETECTED AGENT WORKSTATIONS ──────────────────────────────────────┐\x1b[0m');
    for (const w of detected) {
      const activeTag = w.isActive ? ' \x1b[32m(Active Terminal)\x1b[0m' : '';
      const padName = (w.name + activeTag).padEnd(38, ' ');
      console.log(` \x1b[90m│\x1b[0m  \x1b[36m•\x1b[0m ${padName} \x1b[90m->\x1b[0m  \x1b[33m${w.displayPath}\x1b[0m`);
    }
    console.log(' \x1b[90m└─────────────────────────────────────────────────────────────────────┘\x1b[0m\n');

    console.log('\x1b[1mChoose deployment strategy:\x1b[0m');
    console.log(`  \x1b[36m1)\x1b[0m \x1b[1mDetected Workstations Only\x1b[0m (${activeIDE.name} Workspace) \x1b[32m[Recommended]\x1b[0m`);
    console.log(`  \x1b[36m2)\x1b[0m \x1b[1mGlobal Deployment\x1b[0m (Install to all detected user AI IDEs: ~/.kiro, ~/.gemini, etc.)`);
    console.log(`  \x1b[36m3)\x1b[0m \x1b[1mCustomize Selection\x1b[0m (Pick specific IDE workstations from list)`);
    console.log(`  \x1b[36m4)\x1b[0m \x1b[1mUniversal Sync\x1b[0m (Sync all 17 skills + Kiro workflows + steering rules across all folders)`);

    const choice = await rl.question('\n\x1b[33mChoice [1-4] (1):\x1b[0m ');
    const trimmed = choice.trim();

    if (trimmed === '2' || trimmed.toLowerCase() === 'global') {
      selectedPlan = 'global';
      targetWorkstations = detected.filter(d => d.scope === 'global');
    } else if (trimmed === '3' || trimmed.toLowerCase() === 'custom') {
      selectedPlan = 'custom';
      console.log('\n\x1b[36mSelect target workstations by number (comma-separated, e.g. 1, 3):\x1b[0m');
      detected.forEach((w, idx) => {
        console.log(`  ${idx + 1}) [${w.scope.toUpperCase()}] ${w.name} (${w.displayPath})`);
      });
      const customAns = await rl.question('\nEnter selections: ');
      const indices = customAns.split(',').map(s => parseInt(s.trim(), 10) - 1).filter(i => !isNaN(i) && detected[i]);
      targetWorkstations = indices.length > 0 ? indices.map(i => detected[i]) : detected;
    } else if (trimmed === '4' || trimmed.toLowerCase() === 'all' || trimmed.toLowerCase() === 'sync') {
      selectedPlan = 'all';
      targetWorkstations = detected;
    } else {
      selectedPlan = 'detected';
      targetWorkstations = detected.filter(d => d.scope === 'workspace' || d.isActive);
    }

    rl.close();
  } else {
    // Non-interactive / CI
    if (options.scope === 'global' || options.global) {
      selectedPlan = 'global';
      targetWorkstations = detected.filter(d => d.scope === 'global');
    } else if (options.scope === 'all') {
      selectedPlan = 'all';
      targetWorkstations = detected;
    } else {
      selectedPlan = 'detected';
      targetWorkstations = detected.filter(d => d.scope === 'workspace' || d.isActive);
    }
  }

  return {
    plan: selectedPlan,
    workstations: targetWorkstations,
    allDetected: detected,
    activeIDE
  };
}

/**
 * Deploys PixelCrew skills, workflows, and rules to the selected workstations
 */
export async function deployToWorkstations(targetDir = process.cwd(), deploymentPlan, options = {}) {
  const { dryRun = false, reporter = new DryRunReporter(targetDir) } = options;
  const { workstations, activeIDE } = deploymentPlan;

  const deployedSummary = [];

  for (const w of workstations) {
    const isGlobal = w.scope === 'global';
    const baseDir = isGlobal ? os.homedir() : targetDir;

    // 1. Install all canonical production skills & references
    const canonicalSkills = getAllCanonicalSkillIds();
    for (const sName of canonicalSkills) {
      const bundle = await getSkillBundle(sName);
      let skillFile = null;

      if (isGlobal) {
        const globalPathFn = GLOBAL_PROVIDER_PATHS[w.id] || GLOBAL_PROVIDER_PATHS['pixel-crew'];
        if (globalPathFn) skillFile = globalPathFn(sName);
      } else {
        const pathFn = PROVIDER_PATHS[w.id] || PROVIDER_PATHS['pixel-crew'];
        if (pathFn) skillFile = pathFn(targetDir, sName);
      }

      if (skillFile) {
        await safeWriteFile(skillFile, bundle.content.trim() + '\n', { dryRun, reporter, targetDir: baseDir });

        // Write attached reference documents for directory-based providers
        if (w.id !== 'pixel-crew' && bundle.references && Object.keys(bundle.references).length > 0) {
          const skillDir = path.dirname(skillFile);
          for (const [refName, refContent] of Object.entries(bundle.references)) {
            const refFullPath = path.join(skillDir, 'references', refName);
            await safeWriteFile(refFullPath, refContent, { dryRun, reporter, targetDir: baseDir });
          }
        }
      }
    }

    // 2. Install Kiro Workflows, Prompts & Rules if targeting Kiro
    if (w.id === 'kiro') {
      const kiroFiles = generateKiroFiles(isGlobal ? os.homedir() : targetDir, isGlobal);
      for (const kf of kiroFiles) {
        await safeWriteFile(kf.path, kf.content, { dryRun, reporter, targetDir: baseDir });
      }
    }

    // 3. Install Cursor Rules if targeting Cursor
    if (w.id === 'cursor') {
      const cursorRulesContent = `# PixelCrew Swarm Rules for Cursor

You are integrated with PixelCrew, an autonomous multi-agent engineering swarm.
Support \`/pixelcrew <command>\` and \`@pixelcrew\` workflows:
- \`/pixelcrew assemble [prompt]\` — Full-stack multi-agent sprint
- \`/pixelcrew blueprint [prompt]\` — Dynamic DAG planning & wireframes
- \`/pixelcrew boss-fight <issue>\` — Bug blitz
- \`/pixelcrew render\` — Anti-AI visual review
`;
      if (!isGlobal) {
        await safeWriteFile(path.join(targetDir, '.cursorrules'), cursorRulesContent, { dryRun, reporter, targetDir });
      }
    }

    deployedSummary.push({
      id: w.id,
      name: w.name,
      scope: w.scope,
      displayPath: w.displayPath
    });
  }

  return {
    success: true,
    deployedCount: deployedSummary.length,
    workstations: deployedSummary,
    dryRun,
    reporter
  };
}
