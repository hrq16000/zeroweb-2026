export type LhciMetric = 'performance' | 'seo' | 'accessibility' | 'lcp_ms' | 'cls' | 'tbt_ms';
export type LhciMetrics = Partial<Record<LhciMetric, number | null | undefined>>;
export type LhciEvaluation = { status: 'passed' | 'failed'; failed: string[]; missing: LhciMetric[] };
export type LighthouseMetrics = {
  performance: number | null; seo: number | null; accessibility: number | null;
  bestPractices: number | null; lcp: number | null; cls: number | null; tbt?: number | null;
};
export type LighthouseAggregate = LighthouseMetrics & {
  runs: Array<LighthouseMetrics & { evaluation: LhciEvaluation }>;
  problems: string[];
};
export const LHCI_LIMITS: Readonly<Record<LhciMetric, number>>;
export function evaluateLhci(metrics: LhciMetrics, overrides?: Partial<Record<LhciMetric, number>>): LhciEvaluation;
export function lighthouseMetrics(run: LighthouseMetrics): LhciMetrics;
export function aggregateLighthouse(runs: LighthouseMetrics[]): LighthouseAggregate;
export function normalizeAuditSnapshot<T extends {
  rows: Array<{ lighthouse?: LighthouseMetrics & { runs?: LighthouseMetrics[] }; problems: string[] }>;
  totals: { routesWithProblems: number; problems: number };
}>(snapshot: T): T;