import { expect, test } from 'bun:test';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

test('CI→panel: report preserves both measurements and every failing route', () => {
  const root = mkdtempSync(path.join(tmpdir(), '0web-audit-synthetic-'));
  try {
    mkdirSync(path.join(root, 'seo-reports'));
    mkdirSync(path.join(root, '.lighthouseci'));
    const lhr = (score) => ({
      finalDisplayedUrl: 'https://example.invalid/synthetic',
      categories: {
        performance: { score }, seo: { score: 0.95 }, accessibility: { score: 0.95 }, 'best-practices': { score: 0.9 },
      },
      audits: {
        'largest-contentful-paint': { numericValue: 2500 },
        'cumulative-layout-shift': { numericValue: 0.1 }, 'total-blocking-time': { numericValue: 200 },
      },
    });
    writeFileSync(path.join(root, '.lighthouseci/lhr-1.json'), JSON.stringify(lhr(0.82)));
    writeFileSync(path.join(root, '.lighthouseci/lhr-2.json'), JSON.stringify(lhr(0.95)));
    const result = spawnSync('node', [fileURLToPath(new URL('../../scripts/ci-audit-report.mjs', import.meta.url))], {
      cwd: root, encoding: 'utf8', env: { PATH: process.env['PATH'], GITHUB_SHA: 'synthetic' },
    });
    expect(result.status).toBe(0);
    const summary = JSON.parse(readFileSync(path.join(root, 'public/audit/latest.json'), 'utf8'));
    expect(summary.totals.routesWithProblems).toBe(1);
    expect(summary.totals.lighthouseRuns).toBe(2);
    expect(summary.rows[0]?.lighthouse.performance).toBe(0.82);
    expect(summary.rows[0]?.lighthouse.runs).toHaveLength(2);
    expect(summary.rows[0]?.problems).toEqual(['Lighthouse: performance<0.9']);
  } finally { rmSync(root, { recursive: true, force: true }); }
});