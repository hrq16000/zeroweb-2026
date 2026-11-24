export function buildLighthouseReceipt(lhr, context = {}) {
  if (!lhr || typeof lhr.fetchTime !== 'string' || !Number.isFinite(Date.parse(lhr.fetchTime))) {
    throw new Error('Report has no valid original measurement time');
  }
  const measuredUrl = lhr.finalUrl ?? lhr.requestedUrl;
  if (typeof measuredUrl !== 'string') throw new Error('Report has no URL');
  const original = new URL(measuredUrl);
  const local = ['localhost', '127.0.0.1', '0.0.0.0'].includes(original.hostname);
  const url = local && context.targetUrl ? new URL(original.pathname + original.search, context.targetUrl).href : original.href;
  const score = key => lhr.categories?.[key]?.score ?? null;
  const metric = key => lhr.audits?.[key]?.numericValue ?? null;
  const measured_at = new Date(lhr.fetchTime).toISOString();
  return {
    environment: local ? (context.isPullRequest ? 'staging' : 'dev') : 'prod', url, measured_at,
    // A build tested locally is known; a public site's served SHA is not.
    commit_sha: local ? context.commitSha ?? null : null,
    branch: context.branch ?? null,
    performance: score('performance'), seo: score('seo'), accessibility: score('accessibility'),
    best_practices: score('best-practices'), lcp_ms: metric('largest-contentful-paint'),
    cls: metric('cumulative-layout-shift'), tbt_ms: metric('total-blocking-time'), fcp_ms: metric('first-contentful-paint'),
    logs: {
      source: context.runId ? 'github-actions' : 'lighthouse-cli', transport: 'signed-webhook', measured_at, measured_url: measuredUrl,
      tested_commit_sha: context.commitSha ?? null,
      ...(context.runId ? { workflow_run_id: context.runId } : {}),
      ...(context.workflowUrl ? { workflow_url: context.workflowUrl } : {}),
      ...(context.shard ? { shard: context.shard } : {}),
    },
  };
}