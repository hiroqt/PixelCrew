/**
 * PIXEL CREW — /recap Command
 * 
 * Generates a token-optimized recap of the user's recent git activity.
 * Designed for AI agent consumption: compact output, structured data,
 * no redundant prose. Reads git log, diff stats, and file change status.
 */

import { execSync } from 'node:child_process';
import { PixelCommand } from './command.interface.js';

export class RecapCommand extends PixelCommand {
  constructor() {
    super({
      name: 'recap',
      aliases: ['summary', 'changelog', 'whatdone'],
      description: 'Generate a token-optimized recap of recent git changes',
      usage: '/recap [count=10]',
      category: 'inspection'
    });
  }

  /**
   * Safely executes a git command in the target directory.
   * Returns empty string on failure (not a git repo, git not installed, etc.)
   */
  _git(cmd, cwd) {
    try {
      return execSync(`git ${cmd}`, { cwd, encoding: 'utf-8', timeout: 10000, stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    } catch {
      return '';
    }
  }

  async execute(context, args) {
    const cwd = context.targetDir || process.cwd();
    const count = Math.min(Math.max(parseInt(args[0], 10) || 10, 1), 50);

    // 1. Verify git repo
    const isGit = this._git('rev-parse --is-inside-work-tree', cwd);
    if (isGit !== 'true') {
      return {
        success: false,
        message: 'Not a git repository. Run /recap from a project with git history.',
        output: [
          '╔══════════════════════════════════════════════════════════════════╗',
          '║   PIXEL CREW — SESSION RECAP                                     ║',
          '╚══════════════════════════════════════════════════════════════════╝',
          '',
          '⚠ Not a git repository. No recap available.'
        ].join('\n')
      };
    }

    // 2. Get total commit count (cap diff range to available commits)
    const totalCommitCount = parseInt(this._git('rev-list --count HEAD', cwd), 10) || 0;
    const effectiveCount = Math.min(count, totalCommitCount);

    if (effectiveCount === 0) {
      return {
        success: true,
        message: 'No commits found.',
        data: { commits: [], stats: { filesChanged: 0, insertions: 0, deletions: 0 }, fileChanges: [] },
        output: [
          '╔══════════════════════════════════════════════════════════════════╗',
          '║   PIXEL CREW — SESSION RECAP                                     ║',
          '╚══════════════════════════════════════════════════════════════════╝',
          '',
          'No commits found in this repository.'
        ].join('\n')
      };
    }

    // 3. Fetch commits — compact one-line format (token-optimized)
    const logRaw = this._git(
      `log -${effectiveCount} --pretty=format:"%h|%aI|%an|%s"`,
      cwd
    );
    const commits = logRaw
      .split('\n')
      .filter(Boolean)
      .map(line => {
        const [hash, date, author, ...msgParts] = line.split('|');
        return { hash, date, author, message: msgParts.join('|') };
      });

    // 4. Diff stats (insertions / deletions / files changed)
    //    Use --shortstat for minimal token output
    let diffRange;
    if (effectiveCount >= totalCommitCount) {
      // Full repo history — diff from root commit's tree
      const rootHash = this._git('rev-list --max-parents=0 HEAD', cwd).split('\n')[0];
      diffRange = `${rootHash}..HEAD`;
      // If only 1 commit, diff against empty tree
      if (totalCommitCount === 1) {
        diffRange = '--root HEAD';
      }
    } else {
      diffRange = `HEAD~${effectiveCount}..HEAD`;
    }

    // For single-commit repos, use diff-tree which handles root commits
    let shortStat, nameStatus;
    if (totalCommitCount === 1) {
      shortStat = this._git('diff --stat HEAD', cwd).includes('file') 
        ? this._git('log --oneline --shortstat -1 HEAD', cwd) 
        : '';
      nameStatus = this._git('diff-tree --no-commit-id -r --name-status HEAD', cwd);
    } else {
      shortStat = this._git(`diff --shortstat ${diffRange}`, cwd);
      nameStatus = this._git(`diff --name-status ${diffRange}`, cwd);
    }
    const stats = this._parseShortStat(shortStat);
    const fileChanges = this._parseNameStatus(nameStatus);

    // 6. Token-optimized output — no redundant padding, max information density
    const timeRange = commits.length > 0
      ? `${this._shortDate(commits[commits.length - 1].date)} → ${this._shortDate(commits[0].date)}`
      : 'N/A';

    const lines = [
      '╔══════════════════════════════════════════════════════════════════╗',
      '║   PIXEL CREW — SESSION RECAP                                     ║',
      '╚══════════════════════════════════════════════════════════════════╝',
      '',
      `RANGE: ${timeRange}  |  ${effectiveCount} commit${effectiveCount !== 1 ? 's' : ''}  |  ${stats.filesChanged} file${stats.filesChanged !== 1 ? 's' : ''}  |  +${stats.insertions} −${stats.deletions}`,
      ''
    ];

    // Commits — one line each, no fluff
    lines.push('COMMITS:');
    for (const c of commits) {
      lines.push(`  ${c.hash} ${this._shortDate(c.date)} ${c.message}`);
    }

    // Files — grouped, compact
    if (fileChanges.length > 0) {
      lines.push('');
      lines.push('FILES:');
      const added = fileChanges.filter(f => f.status === 'A');
      const modified = fileChanges.filter(f => f.status === 'M');
      const deleted = fileChanges.filter(f => f.status === 'D');
      const renamed = fileChanges.filter(f => f.status === 'R');

      if (added.length) lines.push(`  + ${added.map(f => f.file).join(', ')}`);
      if (modified.length) lines.push(`  ~ ${modified.map(f => f.file).join(', ')}`);
      if (deleted.length) lines.push(`  - ${deleted.map(f => f.file).join(', ')}`);
      if (renamed.length) lines.push(`  → ${renamed.map(f => f.file).join(', ')}`);
    }

    return {
      success: true,
      message: `Recap: ${effectiveCount} commits, ${stats.filesChanged} files changed (+${stats.insertions} −${stats.deletions})`,
      data: { commits, stats, fileChanges, timeRange, count: effectiveCount },
      output: lines.join('\n')
    };
  }

  /**
   * Parses git diff --shortstat output into structured numbers.
   * Example: " 3 files changed, 45 insertions(+), 12 deletions(-)"
   */
  _parseShortStat(raw) {
    const result = { filesChanged: 0, insertions: 0, deletions: 0 };
    if (!raw) return result;
    const filesMatch = raw.match(/(\d+) file/);
    const insMatch = raw.match(/(\d+) insertion/);
    const delMatch = raw.match(/(\d+) deletion/);
    if (filesMatch) result.filesChanged = parseInt(filesMatch[1], 10);
    if (insMatch) result.insertions = parseInt(insMatch[1], 10);
    if (delMatch) result.deletions = parseInt(delMatch[1], 10);
    return result;
  }

  /**
   * Parses git diff --name-status into file change entries.
   * Example: "M\tsrc/index.js" → { status: 'M', file: 'src/index.js' }
   */
  _parseNameStatus(raw) {
    if (!raw) return [];
    return raw.split('\n').filter(Boolean).map(line => {
      const [status, ...fileParts] = line.split('\t');
      return { status: status.charAt(0), file: fileParts.join('\t') };
    });
  }

  /** Formats ISO date to compact "Sep 01 15:14" */
  _shortDate(isoStr) {
    try {
      const d = new Date(isoStr);
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    } catch {
      return isoStr || '';
    }
  }
}
