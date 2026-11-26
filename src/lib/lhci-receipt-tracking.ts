import { evaluateLhci } from './lhci-evaluation.mjs';

// Exactly the saved ten candidatures plus the two subsequently measured pilots.
export const LIGHTHOUSE_MONITORED_SLUGS = [
  'angel-mix-brecho', 'auto-socorro-dentinho', 'carecas-infotec', 'centro-mega',
  'dlara-pizzaria', 'embalar-embalagens', 'jkl-decor', 'mania-de-limpeza',
  'marmitaria-dom-diego', 'paulo-mestre-de-obras', 'refrigeracao-maresia', 'your-brutus-burguer',
] as const;

export type ReceiptRow = {
  id: string; environment: string; url: string; created_at: string;
  measured_at: string | null; logs: unknown; status: string; decision: string | null;
  decision_reason: string | null; performance: number | null; seo: number | null;
  accessibility: number | null; best_practices: number | null;
  lcp_ms: number | null; cls: number | null; tbt_ms: number | null; fcp_ms: number | null;
};

export function receiptMetadata(row: Pick<ReceiptRow, 'logs' | 'measured_at' | 'created_at'>) {
  const logs = row.logs && typeof row.logs === 'object' && !Array.isArray(row.logs) ? row.logs as Record<string, unknown> : {};
  const historical = typeof logs['measured_at'] === 'string' ? logs['measured_at'] : null;
  return {
    measuredAt: row.measured_at ?? historical,
    receivedAt: row.created_at,
    automatic: logs['transport'] === 'signed-webhook' && logs['source'] === 'github-actions',
    signed: logs['transport'] === 'signed-webhook',
  };
}

export function receiptEvaluation(row: ReceiptRow) {
  return evaluateLhci(row);
}

export function buildReceiptCoverage(rows: ReceiptRow[], slugs: readonly string[] = LIGHTHOUSE_MONITORED_SLUGS) {
  return slugs.map(slug => {
    const matches = rows.filter(row => {
      try { return new URL(row.url).pathname.replace(/\/$/, '') === `/portfolio/${slug}`; }
      catch { return false; }
    });
    const latest = matches.sort((a, b) => {
      const aTime = receiptMetadata(a).measuredAt ?? a.created_at;
      const bTime = receiptMetadata(b).measuredAt ?? b.created_at;
      return Date.parse(bTime) - Date.parse(aTime);
    })[0];
    return { slug, count: matches.length, latest: latest ?? null };
  });
}