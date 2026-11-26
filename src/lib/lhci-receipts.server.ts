import { createHmac, createHash, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';

// Stop reading at the byte limit even when the caller omits Content-Length.
export async function readLighthouseBody(request: Request, maxBytes = 65536): Promise<string | null> {
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const result = await reader.read();
      if (result.done) break;
      length += result.value.byteLength;
      if (length > maxBytes) { await reader.cancel(); return null; }
      chunks.push(result.value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export const lighthouseReceiptSchema = z.object({
  environment: z.enum(['dev', 'staging', 'prod']).default('prod'),
  url: z.string().url().max(2048),
  measured_at: z.string().datetime({ offset: true }),
  commit_sha: z.string().max(80).nullable().optional(),
  branch: z.string().max(120).nullable().optional(),
  performance: z.number().min(0).max(1).nullable().optional(),
  seo: z.number().min(0).max(1).nullable().optional(),
  accessibility: z.number().min(0).max(1).nullable().optional(),
  best_practices: z.number().min(0).max(1).nullable().optional(),
  lcp_ms: z.number().finite().nonnegative().nullable().optional(),
  cls: z.number().finite().nonnegative().nullable().optional(),
  tbt_ms: z.number().finite().nonnegative().nullable().optional(),
  fcp_ms: z.number().finite().nonnegative().nullable().optional(),
  logs: z.object({
    source: z.enum(['github-actions', 'lighthouse-cli']).optional(),
    workflow_run_id: z.string().max(80).optional(),
    workflow_url: z.string().url().max(2048).optional(),
    shard: z.string().max(10).optional(),
    measured_at: z.string().datetime({ offset: true }).optional(),
    measured_url: z.string().url().max(2048).optional(),
    tested_commit_sha: z.string().max(80).nullable().optional(),
    transport: z.literal('signed-webhook').optional(),
  }).optional(),
});

export function validLighthouseSignature(body: string, header: string, secret: string): boolean {
  if (!/^sha256=[a-f0-9]{64}$/i.test(header)) return false;
  const expected = createHmac('sha256', secret).update(body).digest();
  const actual = Buffer.from(header.slice(7), 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function lighthouseReceiptKey(receipt: {environment: string; url: string; measured_at: string}): string {
  return createHash('sha256').update(JSON.stringify([receipt.environment, receipt.url, new Date(receipt.measured_at).toISOString()])).digest('hex');
}