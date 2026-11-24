// Shared, side-effect-free gate for received metrics and CI/panel summaries.
// Best practices and FCP remain warnings in .lighthouserc.cjs, not hard gates.
export const LHCI_LIMITS = Object.freeze({
  performance: 0.9, seo: 0.95, accessibility: 0.95,
  lcp_ms: 2500, cls: 0.1, tbt_ms: 200,
});

export function evaluateLhci(metrics, overrides = {}) {
  const failed = [];
  const missing = [];
  for (const [metric, baseline] of Object.entries(LHCI_LIMITS)) {
    const score = ['performance', 'seo', 'accessibility'].includes(metric);
    const value = metrics[metric];
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || (score && value > 1)) {
      missing.push(metric);
      continue;
    }
    const configured = overrides[metric];
    // Invalid settings cannot silently disable a check; never lower the baseline.
    const validLimit = typeof configured === 'number' && Number.isFinite(configured) && configured >= 0 && (!score || configured <= 1);
    const limit = validLimit ? (score ? Math.max(baseline, configured) : Math.min(baseline, configured)) : baseline;
    if (score ? value < limit : value > limit) failed.push(`${metric}${score ? '<' : '>'}${limit}`);
  }
  return { status: failed.length || missing.length ? 'failed' : 'passed', failed, missing };
}

export function lighthouseMetrics(run) {
  return {
    performance: run.performance, seo: run.seo, accessibility: run.accessibility,
    lcp_ms: run.lcp, cls: run.cls, tbt_ms: run.tbt,
  };
}

export function aggregateLighthouse(runs) {
  const evaluated = runs.map((run) => ({ ...run, evaluation: evaluateLhci(lighthouseMetrics(run)) }));
  const validValues = (key) => evaluated.map((run) => run[key]).filter((n) => typeof n === 'number' && Number.isFinite(n) && n >= 0);
  const worst = (key, score) => {
    const values = validValues(key);
    return values.length ? (score ? Math.min(...values) : Math.max(...values)) : null;
  };
  return {
    performance: worst('performance', true), seo: worst('seo', true),
    accessibility: worst('accessibility', true), bestPractices: worst('bestPractices', true),
    lcp: worst('lcp', false), cls: worst('cls', false), tbt: worst('tbt', false),
    runs: evaluated,
    problems: [...new Set(evaluated.flatMap((run) => [
      ...run.evaluation.failed.map((reason) => `Lighthouse: ${reason}`),
      ...run.evaluation.missing.map((metric) => `Lighthouse: missing:${metric}`),
    ]))],
  };
}

// Re-evaluate old snapshots in memory; never rewrite historical artifacts.
export function normalizeAuditSnapshot(snapshot) {
  const rows = snapshot.rows.map((row) => {
    if (!row.lighthouse) return row;
    const aggregate = aggregateLighthouse(row.lighthouse.runs?.length ? row.lighthouse.runs : [row.lighthouse]);
    return { ...row, lighthouse: aggregate, problems: [...new Set([...row.problems, ...aggregate.problems])] };
  });
  return { ...snapshot, rows, totals: {
    ...snapshot.totals,
    routesWithProblems: rows.filter((row) => row.problems.length > 0).length,
    problems: rows.reduce((total, row) => total + row.problems.length, 0),
  } };
}