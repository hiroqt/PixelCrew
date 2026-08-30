/**
 * PIXEL CREW — Multi-Provider Cross-IDE Skill Sync Test Suite
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROVIDER_TARGETS, syncAllProviders } from '../scripts/sync-providers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

test('syncAllProviders populates all primary provider directories with valid SKILL.md', async () => {
  await syncAllProviders();

  // Verify all provider targets contain SKILL.md
  for (const target of PROVIDER_TARGETS) {
    const skillMdPath = path.join(target, 'SKILL.md');


    const stat = await fs.stat(skillMdPath);
    assert.ok(stat.isFile(), `Expected SKILL.md to exist at ${skillMdPath}`);

    const content = await fs.readFile(skillMdPath, 'utf-8');
    assert.ok(content.includes('name: pixelcrew'));
    assert.ok(content.includes('Floor 42 Swarm Command Suite'));
    assert.ok(content.includes('Floor 42, Pixel Corps HQ'));
  }


  // Verify .claude-plugin
  const pluginJson = await fs.readFile(path.join(ROOT_DIR, '.claude-plugin', 'plugin.json'), 'utf-8');
  const manifest = JSON.parse(pluginJson);
  assert.equal(manifest.name, 'pixelcrew');
  assert.equal(manifest.version, '0.2.4');
});
