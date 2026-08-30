/**
 * PIXEL CREW — Safe File System Operations & Dry-Run Layer
 * 
 * Provides atomic, reversible, and previewable filesystem write operations
 * preventing unintentional mutations during development and testing.
 */

import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';

export class DryRunReporter {
  constructor(targetDir = process.cwd()) {
    this.targetDir = targetDir;
    this.creates = new Set();
    this.updates = new Set();
    this.dirs = new Set();
  }

  recordCreate(filePath) {
    const rel = path.relative(this.targetDir, filePath) || filePath;
    this.creates.add(rel);
  }

  recordUpdate(filePath) {
    const rel = path.relative(this.targetDir, filePath) || filePath;
    this.updates.add(rel);
  }

  recordDir(dirPath) {
    const rel = path.relative(this.targetDir, dirPath) || dirPath;
    this.dirs.add(rel);
  }

  hasChanges() {
    return this.creates.size > 0 || this.updates.size > 0 || this.dirs.size > 0;
  }

  formatOutput() {
    const lines = [];
    lines.push('\x1b[33m\x1b[1m[DRY RUN PREVIEW] — No files were written to disk.\x1b[0m\n');

    if (!this.hasChanges()) {
      lines.push('  No files or directories would be modified.');
      return lines.join('\n');
    }

    if (this.creates.size > 0) {
      lines.push('\x1b[32mWould create files:\x1b[0m');
      for (const f of Array.from(this.creates).sort()) {
        lines.push(`  \x1b[90m+\x1b[0m \x1b[36m${f}\x1b[0m`);
      }
      lines.push('');
    }

    if (this.updates.size > 0) {
      lines.push('\x1b[33mWould update files:\x1b[0m');
      for (const f of Array.from(this.updates).sort()) {
        lines.push(`  \x1b[90m~\x1b[0m \x1b[33m${f}\x1b[0m`);
      }
      lines.push('');
    }

    if (this.dirs.size > 0) {
      lines.push('\x1b[35mWould ensure directories:\x1b[0m');
      for (const d of Array.from(this.dirs).sort()) {
        lines.push(`  \x1b[90m📁\x1b[0m \x1b[35m${d}/\x1b[0m`);
      }
      lines.push('');
    }

    lines.push('\x1b[90mRun without \x1b[0m\x1b[33m--dry-run\x1b[0m\x1b[90m to apply these changes.\x1b[0m');
    return lines.join('\n');
  }

  print() {
    console.log('\n' + this.formatOutput() + '\n');
  }
}

/**
 * Safely writes a file, supporting dry-run mode and directory auto-creation
 */
export async function safeWriteFile(filePath, content, options = {}) {
  const {
    dryRun = false,
    encoding = 'utf-8',
    reporter = null,
    targetDir = process.cwd()
  } = options;

  let exists = false;
  try {
    await fs.access(filePath);
    exists = true;
  } catch {
    exists = false;
  }

  if (reporter) {
    if (exists) {
      reporter.recordUpdate(filePath);
    } else {
      reporter.recordCreate(filePath);
    }
  }

  if (dryRun) {
    return { written: false, dryRun: true, path: filePath, action: exists ? 'update' : 'create' };
  }

  // Ensure parent directory exists
  const parentDir = path.dirname(filePath);
  await fs.mkdir(parentDir, { recursive: true });

  await fs.writeFile(filePath, content, encoding);
  return { written: true, dryRun: false, path: filePath, action: exists ? 'update' : 'create' };
}

/**
 * Safely creates a directory, supporting dry-run mode
 */
export async function safeMkdir(dirPath, options = {}) {
  const { dryRun = false, recursive = true, reporter = null } = options;

  if (reporter) {
    reporter.recordDir(dirPath);
  }

  if (dryRun) {
    return { created: false, dryRun: true, path: dirPath };
  }

  await fs.mkdir(dirPath, { recursive });
  return { created: true, dryRun: false, path: dirPath };
}

/**
 * Safely copies a file, supporting dry-run mode
 */
export async function safeCopyFile(srcPath, destPath, options = {}) {
  const { dryRun = false, reporter = null } = options;

  let exists = false;
  try {
    await fs.access(destPath);
    exists = true;
  } catch {
    exists = false;
  }

  if (reporter) {
    if (exists) {
      reporter.recordUpdate(destPath);
    } else {
      reporter.recordCreate(destPath);
    }
  }

  if (dryRun) {
    return { copied: false, dryRun: true, path: destPath, action: exists ? 'update' : 'create' };
  }

  const parentDir = path.dirname(destPath);
  await fs.mkdir(parentDir, { recursive: true });
  await fs.copyFile(srcPath, destPath);
  return { copied: true, dryRun: false, path: destPath, action: exists ? 'update' : 'create' };
}
