import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { MarkdownReportBuilder } from '../src/utils/markdown-report.js';
import { AdaptCommand } from '../src/commands/adapt.js';
import { ReviewCommand } from '../src/commands/review.js';
import { AuditCommand } from '../src/commands/audit.js';
import { HardenCommand } from '../src/commands/harden.js';

test('MarkdownReportBuilder generates structured markdown document with frontmatter and tables', async () => {
  const builder = new MarkdownReportBuilder({
    title: 'Custom Engineering Audit',
    command: '/test-cmd',
    category: 'Testing',
    agent: 'QA Specialist',
    project: 'PixelProject',
    score: 9.8,
    status: 'PASSED',
    summary: 'Executive summary for automated test report.',
    metrics: [
      { name: 'Core Web Vitals LCP', target: '< 0.6s', value: '0.42s', status: 'PASS' },
      { name: 'Contrast Ratio', target: '>= 4.5:1', value: '7.1:1', status: 'PASS' }
    ],
    sections: [
      {
        title: 'Breakdown by Device',
        icon: '📱',
        table: {
          headers: ['Device', 'Width', 'Status'],
          rows: [
            ['Mobile', '360px', '✓ 44px Tap Targets'],
            ['Desktop', '1440px', '✓ 12-Col Grid']
          ]
        }
      }
    ],
    antiAiCompliance: true,
    checklist: [
      { text: 'Verified responsive layout', done: true },
      { text: 'Ran a11y tests', done: true }
    ],
    actionItems: [
      'Deploy to staging environment'
    ]
  });

  const md = builder.build();

  // Assert Frontmatter & Headers
  assert.ok(md.startsWith('---'));
  assert.ok(md.includes('title: "Custom Engineering Audit"'));
  assert.ok(md.includes('command: "/test-cmd"'));
  assert.ok(md.includes('# 🏢 Custom Engineering Audit'));
  assert.ok(md.includes('## 📋 Report Metadata'));
  assert.ok(md.includes('`9.8 / 10.0`'));

  // Assert Tables & Sections
  assert.ok(md.includes('## 📊 Key Metrics & Performance Scorecard'));
  assert.ok(md.includes('| **Core Web Vitals LCP** | `< 0.6s` | `0.42s` | **✓ PASS** |'));
  assert.ok(md.includes('## 📱 Breakdown by Device'));
  assert.ok(md.includes('| Mobile | 360px | ✓ 44px Tap Targets |'));
  assert.ok(md.includes('## 🛡️ Anti-AI 64-Pattern Compliance Matrix'));
  assert.ok(md.includes('## ✅ Verification & Hardening Checklist'));
  assert.ok(md.includes('- [x] Verified responsive layout'));
  assert.ok(md.includes('## 🚀 Action Items & Next Steps'));
  assert.ok(md.includes('- [ ] Deploy to staging environment'));
});

test('MarkdownReportBuilder saves markdown file to .pixel-crew/reports/', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pixel-crew-report-test-'));

  try {
    const builder = new MarkdownReportBuilder({
      title: 'Saved Report Test',
      command: '/audit',
      summary: 'Testing save functionality'
    });

    const result = await builder.save(tmpDir, 'test-audit-report');
    assert.equal(result.success, true);
    assert.ok(result.filePath.endsWith('.md'));

    const fileContent = await fs.readFile(result.filePath, 'utf-8');
    assert.ok(fileContent.includes('# 🏢 Saved Report Test'));
    assert.ok(fileContent.includes('Testing save functionality'));
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});

test('AdaptCommand generates and saves structured markdown report', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pixel-crew-adapt-test-'));

  try {
    const cmd = new AdaptCommand();
    const result = await cmd.execute({ targetDir: tmpDir }, ['mobile']);

    assert.equal(result.success, true);
    assert.ok(result.data.reportPath);
    assert.ok(result.data.markdown.includes('# 🏢 Multi-Viewport Responsive Adaptation Report'));
    assert.ok(result.data.markdown.includes('## 📱 Breakdown by Viewport Dimension'));

    const savedContent = await fs.readFile(result.data.reportPath, 'utf-8');
    assert.ok(savedContent.includes('Multi-Viewport Responsive Adaptation Report'));
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});

test('ReviewCommand, AuditCommand, and HardenCommand save structured markdown reports', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pixel-crew-cmds-test-'));

  try {
    const reviewCmd = new ReviewCommand();
    const reviewRes = await reviewCmd.execute({ targetDir: tmpDir }, []);
    assert.ok(reviewRes.data.reportPath);
    assert.ok(reviewRes.data.markdown.includes('Anti-AI 6-Dimension Visual & Code Quality Review'));

    const auditCmd = new AuditCommand();
    const auditRes = await auditCmd.execute({ targetDir: tmpDir }, []);
    assert.ok(auditRes.data.reportPath);
    assert.ok(auditRes.data.markdown.includes('Technical Quality & SRE Performance Audit Report'));

    const hardenCmd = new HardenCommand();
    const hardenRes = await hardenCmd.execute({ targetDir: tmpDir }, []);
    assert.ok(hardenRes.data.reportPath);
    assert.ok(hardenRes.data.markdown.includes('Security Defense & Resilience Hardening Report'));
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});
