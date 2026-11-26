import { expect, test } from 'bun:test';
import { createHmac } from 'node:crypto';
import { validLighthouseSignature, lighthouseReceiptKey, lighthouseReceiptSchema, readLighthouseBody } from '../../src/lib/lhci-receipts.server';
import { buildLighthouseReceipt } from '../../scripts/lib/lhci-receipt-payload.mjs';
import { buildReceiptCoverage, receiptMetadata, type ReceiptRow } from '../../src/lib/lhci-receipt-tracking';

const syntheticSecret = 'synthetic-test-only-not-a-project-credential';
const receipt = { environment: 'prod' as const, url: 'https://example.invalid/portfolio/centro-mega', measured_at: '2026-11-24T07:31:53.796Z' };

test('recebimento automático exige assinatura do conteúdo exato, sem bypass de token', () => {
  const body = JSON.stringify(receipt);
  const signature = `sha256=${createHmac('sha256', syntheticSecret).update(body).digest('hex')}`;
  expect(validLighthouseSignature(body, signature, syntheticSecret)).toBe(true);
  expect(validLighthouseSignature(body + ' ', signature, syntheticSecret)).toBe(false);
  expect(validLighthouseSignature(body, '', syntheticSecret)).toBe(false);
  expect(validLighthouseSignature(body, signature.replace('sha256=', 'other='), syntheticSecret)).toBe(false);
});

test('retry da mesma medição tem uma identidade, próxima medição tem outra', () => {
  expect(lighthouseReceiptKey(receipt)).toBe(lighthouseReceiptKey({ ...receipt }));
  expect(lighthouseReceiptKey(receipt)).not.toBe(lighthouseReceiptKey({ ...receipt, measured_at: '2026-11-24T07:33:19.366Z' }));
});

test('data da medição original é obrigatória e não aceita pontuação fora do limite', () => {
  expect(lighthouseReceiptSchema.safeParse(receipt).success).toBe(true);
  expect(lighthouseReceiptSchema.safeParse({ ...receipt, measured_at: undefined }).success).toBe(false);
  expect(lighthouseReceiptSchema.safeParse({ ...receipt, performance: 1.1 }).success).toBe(false);
});

test('nota pública não recebe SHA de código local como se fosse produção', () => {
  const payload = buildLighthouseReceipt({ fetchTime: receipt.measured_at, finalUrl: receipt.url, categories: { performance: { score: 0.77 } }, audits: {} }, { commitSha: 'synthetic-sha' });
  expect(payload.commit_sha).toBeNull();
  expect(payload.performance).toBe(0.77);
  expect(payload.measured_at).toBe('2026-11-24T07:31:53.796Z');
  expect(payload.logs.tested_commit_sha).toBe('synthetic-sha');
  expect(payload.logs.source).toBe('lighthouse-cli');
});

test('relatório de workflow conserva origem automática sem inventar SHA público', () => {
  const payload = buildLighthouseReceipt({ fetchTime: receipt.measured_at, finalUrl: receipt.url, categories: {}, audits: {} }, { runId: '1234', commitSha: 'synthetic-sha' });
  expect(payload.logs.source).toBe('github-actions');
  expect(payload.logs.workflow_run_id).toBe('1234');
  expect(payload.commit_sha).toBeNull();
});

test('corpo sem Content-Length é limitado a 64 KiB durante a leitura', async () => {
  const allowed = new Request('https://example.invalid', { method: 'POST', body: 'x'.repeat(65536) });
  expect(await readLighthouseBody(allowed)).toHaveLength(65536);
  let cancelled = false;
  const body = new ReadableStream<Uint8Array>({
    start(controller) { controller.enqueue(new Uint8Array(65537)); },
    cancel() { cancelled = true; },
  });
  const oversized = new Request('https://example.invalid', { method: 'POST', body });
  expect(await readLighthouseBody(oversized)).toBeNull();
  expect(cancelled).toBe(true);
});

test('medição local permanece dev e preserva URL original na proveniência', () => {
  const payload = buildLighthouseReceipt({ fetchTime: receipt.measured_at, finalUrl: 'http://localhost:8080/portfolio/centro-mega', categories: {}, audits: {} }, { targetUrl: 'https://0web.com.br', commitSha: 'synthetic-sha' });
  expect(payload.environment).toBe('dev');
  expect(payload.url).toBe('https://0web.com.br/portfolio/centro-mega');
  expect(payload.logs.measured_url).toBe('http://localhost:8080/portfolio/centro-mega');
  expect(payload.commit_sha).toBe('synthetic-sha');
});

test('cobertura não confunde importação manual com recebimento automático nem clientes parecidos', () => {
  const rows = [{ ...receipt, id: 'synthetic', url: 'https://0web.com.br/portfolio/centro-mega', created_at: '2026-11-24T08:00:00Z', logs: { measured_at: receipt.measured_at, transport: 'manual-import' } }] as ReceiptRow[];
  const coverage = buildReceiptCoverage(rows, ['centro-mega', 'centro-mega-outro']);
  expect(coverage[0]?.count).toBe(1);
  expect(coverage[1]?.count).toBe(0);
  const row = rows[0];
  if (!row) throw new Error('Fixture missing');
  expect(receiptMetadata(row).automatic).toBe(false);
  expect(receiptMetadata(row).measuredAt).toBe(receipt.measured_at);
});