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

export const MEASUREMENT_STATES = ['aprovado', 'reprovado', 'em_execucao', 'pendente', 'falha_coleta'] as const;
export type MeasurementState = (typeof MEASUREMENT_STATES)[number];
export const MEASUREMENT_STATE_LABEL: Record<MeasurementState, string> = {
  aprovado: 'Aprovado', reprovado: 'Reprovado', em_execucao: 'Em execução',
  pendente: 'Pendente', falha_coleta: 'Falha na coleta',
};

type StateRow = Pick<ReceiptRow, 'status' | 'performance' | 'seo' | 'accessibility' | 'best_practices'>;

/**
 * Estado exibido no painel. Uma medição sem nenhuma nota nunca conta como
 * reprovada nem aprovada: é falha de coleta. Nada aqui inventa valores.
 */
export function measurementState(row: StateRow): MeasurementState {
  if (row.status === 'running') return 'em_execucao';
  if (row.status === 'pending' || row.status === 'queued') return 'pendente';
  const noScores = [row.performance, row.seo, row.accessibility, row.best_practices].every(value => value == null);
  if (row.status === 'error' || noScores) return 'falha_coleta';
  return row.status === 'passed' ? 'aprovado' : 'reprovado';
}

/** Origem declarada pelo próprio recebimento; desconhecida permanece desconhecida. */
export function receiptOrigin(row: Pick<ReceiptRow, 'logs'>): string {
  const logs = row.logs && typeof row.logs === 'object' && !Array.isArray(row.logs) ? row.logs as Record<string, unknown> : {};
  const source = typeof logs['source'] === 'string' ? logs['source'] : '';
  if (source === 'github-actions') return 'GitHub Actions (automática)';
  if (source === 'lighthouse-cli') return 'Lighthouse local (envio assinado)';
  if (source.startsWith('authorized_public_lighthouse_import')) return 'Importação manual autorizada';
  if (logs['transport'] === 'signed-webhook') return 'Envio assinado';
  return source || 'Origem não informada';
}

/** Projeto e domínio derivados somente da URL medida. */
export function receiptProject(url: string): { project: string; domain: string; path: string } {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/').filter(Boolean);
    const slug = parts[0] === 'portfolio' && parts[1] ? parts[1] : parts[0];
    const project = slug
      ? slug.split('-').map(word => (word[0]?.toUpperCase() ?? '') + word.slice(1)).join(' ')
      : 'Página inicial';
    return { project, domain: parsed.host, path: parsed.pathname };
  } catch {
    return { project: url, domain: '—', path: url };
  }
}
