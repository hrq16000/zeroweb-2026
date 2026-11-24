import { expect, test } from 'bun:test';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

function runSender(mode: 'retry' | 'deny' | 'missing') {
  const dir = mkdtempSync(join(tmpdir(), 'lhci-uploader-test-'));
  const mock = `
    import { createHmac } from 'node:crypto';
    let attempts = 0;
    globalThis.fetch = async (_url, options) => {
      const expected = 'sha256=' + createHmac('sha256', process.env.LHCI_HMAC_SECRET).update(options.body).digest('hex');
      if (options.headers['X-Signature'] !== expected) throw new Error('Incorrect signature');
      const receipt = JSON.parse(options.body);
      if (receipt.logs.source !== 'github-actions' || receipt.logs.workflow_run_id !== 'synthetic-run') throw new Error('Missing workflow provenance');
      if (receipt.commit_sha !== null) throw new Error('Unverified public SHA');
      attempts++;
      console.log('SYNTHETIC_TRANSPORT:' + receipt.performance);
      return new Response('', { status: ${mode === 'deny' ? '401' : 'attempts === 1 ? 500 : 200'} });
    };
  `;
  try {
    for (const [index, score] of [0.77, 0.92].entries()) {
      writeFileSync(join(dir, `lhr-${index}.json`), JSON.stringify({
        fetchTime: `2026-11-24T07:3${index}:00Z`, finalUrl: 'https://example.invalid/portfolio/synthetic',
        categories: { performance: { score } }, audits: {},
      }));
    }
    return spawnSync('node', ['--import', `data:text/javascript,${encodeURIComponent(mock)}`, resolve('scripts/send-lhci-receipts.mjs')], {
      encoding: 'utf8', timeout: 10000,
      env: {
        PATH: process.env['PATH'] ?? '', LHCI_REPORT_DIR: dir,
        LHCI_INGEST_URL: 'https://example.invalid/api/public/hooks/lhci-ingest',
        LHCI_TARGET_URL: 'https://example.invalid', GITHUB_RUN_ID: 'synthetic-run', GITHUB_SHA: 'synthetic-sha',
        ...(mode === 'missing' ? {} : { LHCI_HMAC_SECRET: 'synthetic-test-only-not-a-project-credential' }),
      },
    });
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

test('envio entrega notas reprovadas e aprovadas, assinadas; retry não omite relatório', () => {
  const result = runSender('retry');
  expect(result.status).toBe(0);
  expect(result.stdout.match(/SYNTHETIC_TRANSPORT:0\.77/g)).toHaveLength(2);
  expect(result.stdout.match(/SYNTHETIC_TRANSPORT:0\.92/g)).toHaveLength(1);
  expect(result.stdout).toContain('LHCI_RECEIPTS: 2 delivered; 0 failed.');
});

test('envio não considera recusa de assinatura como medição entregue', () => {
  const result = runSender('deny');
  expect(result.status).toBe(1);
  expect(result.stdout).toContain('LHCI_RECEIPTS: 0 delivered; 2 failed.');
  expect(result.stderr).toContain('HTTP 401');
});

test('sem chave compartilhada nenhum relatório é enviado', () => {
  const result = runSender('missing');
  expect(result.status).toBe(1);
  expect(result.stderr).toContain('LHCI_RECEIPTS_BLOCKED');
  expect(result.stdout).not.toContain('SYNTHETIC_TRANSPORT');
});