const metricIds = ["first-contentful-paint", "largest-contentful-paint", "speed-index", "total-blocking-time", "cumulative-layout-shift", "server-response-time"];
const round = (value) => typeof value === "number" && Number.isFinite(value) ? Math.round(value * 100) / 100 : null;
const pathOnly = (url) => {
  try { return new URL(url).pathname; } catch { return ""; }
};

/** Read both legacy table/list and modern Lighthouse detail structures. */
function detailRows(details) {
  if (!details || typeof details !== "object") return [];
  const items = Array.isArray(details.items) ? details.items : [];
  return items.flatMap((item) => item?.type === "table" || item?.type === "list" ? detailRows(item) : [item]);
}

export function summarizeLhr(lhr) {
  if (!lhr || typeof lhr !== "object" || Array.isArray(lhr) || !lhr.audits || !lhr.categories) throw new Error("Not a Lighthouse report");
  const audits = lhr.audits;
  const lcpRows = detailRows(audits["largest-contentful-paint-element"]?.details);
  const node = lcpRows.find((row) => row?.node)?.node;
  const phases = Object.fromEntries(lcpRows.filter((row) => typeof row?.phase === "string").map((row) => [row.phase, round(row.timing)]));
  const metrics = Object.fromEntries(metricIds.map((id) => [id, round(audits[id]?.numericValue)]));
  const renderDelay = phases["Render Delay"];
  const lcp = metrics["largest-contentful-paint"];
  const renderShare = renderDelay !== null && renderDelay !== undefined && lcp !== null && lcp > 0 ? round(renderDelay / lcp) : null;
  const opportunities = ["unused-javascript", "render-blocking-resources", "uses-responsive-images", "modern-image-formats", "offscreen-images"].flatMap((id) => {
    const audit = audits[id];
    if (!audit || audit.score === 1) return [];
    return [{ id, savingsBytes: round(audit.details?.overallSavingsBytes), items: detailRows(audit.details).map((row) => ({
      path: pathOnly(row?.url), wastedBytes: round(row?.wastedBytes), wastedMs: round(row?.wastedMs),
    })) }];
  });
  return {
    path: pathOnly(lhr.finalUrl || lhr.requestedUrl),
    scores: Object.fromEntries(["performance", "accessibility", "best-practices", "seo"].map((id) => [id, round(lhr.categories[id]?.score)])),
    metrics, lcp: { selector: typeof node?.selector === "string" ? node.selector : null, phases, renderShare },
    triage: renderShare !== null && renderShare >= 0.7 ? "RENDER_DELAY_DOMINANT" : renderShare === null ? "INSUFFICIENT_LCP_DETAILS" : "REVIEW_LOADING_AND_RENDERING",
    opportunities,
  };
}