/**
 * PIXEL CREW — Isolated Fixture Test Runner & Sandbox Helper
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = path.resolve(__dirname, '../fixtures');

/**
 * Creates an isolated test workspace by copying a fixture into a temporary sandbox
 */
export async function createTestWorkspace(fixtureName = 'empty-project') {
  const prefix = path.join(os.tmpdir(), `pixel-test-${fixtureName}-`);
  const tmpDir = await fs.mkdtemp(prefix);

  const fixtureSrc = path.join(FIXTURES_DIR, fixtureName);
  try {
    await fs.access(fixtureSrc);
    await copyDirRecursive(fixtureSrc, tmpDir);
  } catch (err) {
    // If fixture doesn't exist, tmpDir remains empty
  }

  return tmpDir;
}

/**
 * Recursively copies directory contents
 */
async function copyDirRecursive(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirRecursive(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

/**
 * Safely cleans up the temporary test workspace
 */
export async function cleanupTestWorkspace(tmpDir) {
  if (tmpDir && tmpDir.includes(os.tmpdir())) {
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch {}
  }
}

/**
 * Lists all relative file paths within a directory
 */
export async function listAllFiles(dir, base = dir) {
  let results = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const sub = await listAllFiles(full, base);
        results = results.concat(sub);
      } else {
        results.push(path.relative(base, full));
      }
    }
  } catch {}
  return results;
}
