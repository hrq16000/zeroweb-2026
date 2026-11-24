#!/usr/bin/env node
import { readdirSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createHmac } from 'node:crypto';
import { buildLighthouseReceipt } from './lib/lhci-receipt-payload.mjs';

const dir = resolve(process.env['LHCI_REPORT_DIR'] || '.lighthouseci');
let files = [];
try { files = readdirSync(dir).filter(name => name.startsWith('lhr-') && name.endsWith('.json')); }
catch { /* Report collection may fail before producing any measurements. */ }
if (!files.length) {
  console.error('LHCI_RECEIPTS_EMPTY: no collected measurements to deliver.');
  process.exit(1);
}
const secret = process.env['LHCI_HMAC_SECRET'];
const endpoint = process.env['LHCI_INGEST_URL'] || 'https://0web.com.br/api/public/hooks/lhci-ingest';
if (!secret) {
  console.error('LHCI_RECEIPTS_BLOCKED: shared receiving key is not configured in GitHub Actions.');
  process.exit(1);
}
const target = new URL(endpoint);
if (target.protocol !== 'https:') throw new Error('Receiving endpoint must use HTTPS');
let received = 0;
let failures = 0;
for (const file of files) {
  try {
    const payload = buildLighthouseReceipt(JSON.parse(readFileSync(join(dir, file), 'utf8')), {
      targetUrl: process.env['LHCI_TARGET_URL'] || 'https://0web.com.br',
      isPullRequest: process.env['LHCI_IS_PULL_REQUEST'] === '1',
      commitSha: process.env['GITHUB_SHA'], branch: process.env['GITHUB_REF_NAME'],
      runId: process.env['GITHUB_RUN_ID'], shard: process.env['LHCI_SHARD_INDEX'],
      workflowUrl: process.env['GITHUB_REPOSITORY'] && process.env['GITHUB_RUN_ID']
        ? `https://github.com/${process.env['GITHUB_REPOSITORY']}/actions/runs/${process.env['GITHUB_RUN_ID']}` : undefined,
    });
    const body = JSON.stringify(payload);
    const signature = `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`;
    let delivered = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      const response = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Signature': signature },
        body, signal: AbortSignal.timeout(20000), redirect: 'error',
      });
      if (response.ok) { delivered = true; break; }
      if (response.status < 500 && response.status !== 429) {
        throw new Error(`Receipt rejected with HTTP ${response.status}`);
      }
    }
    if (!delivered) throw new Error('Receipt could not be delivered after three attempts');
    received++;
    console.log(`LHCI_RECEIPT_DELIVERED: ${payload.url} at ${payload.measured_at}`);
  } catch (error) {
    failures++;
    // Never echo request headers, signatures, response bodies, or secret values.
    console.error(`LHCI_RECEIPT_FAILED: ${file}; ${error instanceof Error ? error.message : 'delivery error'}`);
  }
}
console.log(`LHCI_RECEIPTS: ${received} delivered; ${failures} failed.`);
if (failures) process.exit(1);