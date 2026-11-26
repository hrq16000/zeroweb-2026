import { test } from "node:test";
import assert from "node:assert/strict";
import { summarizeLhr } from "../../scripts/lib/lhci-diagnostics.mjs";

const report = () => ({
  finalUrl: "http://127.0.0.1:8080/portfolio/angel-mix-brecho?private=omit",
  categories: { performance: { score: 0.83 } },
  audits: {
    "largest-contentful-paint": { numericValue: 2671.8413 },
    "largest-contentful-paint-element": { details: { type: "list", items: [
      { type: "table", items: [{ node: { selector: "div.absolute > div.overflow-hidden > div > h1.mt-4" } }] },
      { type: "table", items: [{ phase: "TTFB", timing: 134.85985 }, { phase: "Render Delay", timing: 2536.98145 }] },
    ] } },
    "unused-javascript": { score: 0, details: { overallSavingsBytes: 228044, items: [{ url: "http://localhost/assets/index.js?token=omit", wastedBytes: 228044 }] } },
  },
});

test("extracts the nested measured LCP node, not a guessed node", () => {
  assert.equal(summarizeLhr(report()).lcp.selector, "div.absolute > div.overflow-hidden > div > h1.mt-4");
});
test("preserves measured render timings and identifies the dominant phase", () => {
  const result = summarizeLhr(report());
  assert.equal(result.metrics["largest-contentful-paint"], 2671.84);
  assert.equal(result.lcp.phases["Render Delay"], 2536.98);
  assert.equal(result.lcp.renderShare, 0.95);
  assert.equal(result.triage, "RENDER_DELAY_DOMINANT");
});
test("does not invent missing metrics or success", () => {
  const result = summarizeLhr({ categories: {}, audits: {} });
  assert.equal(result.scores.performance, null);
  assert.equal(result.lcp.selector, null);
  assert.equal(result.triage, "INSUFFICIENT_LCP_DETAILS");
});
test("strips origin/query values from exported opportunity URLs", () => {
  const result = summarizeLhr(report());
  assert.equal(result.path, "/portfolio/angel-mix-brecho");
  assert.equal(result.opportunities[0].items[0].path, "/assets/index.js");
  assert.equal(JSON.stringify(result).includes("token="), false);
});
test("rejects manifests and non-report JSON", () => {
  assert.throws(() => summarizeLhr([]), /Not a Lighthouse report/);
});
test("does not label loading-dominated LCP as a reveal problem", () => {
  const input = report();
  input.audits["largest-contentful-paint-element"].details.items[1].items[1].timing = 250;
  assert.equal(summarizeLhr(input).triage, "REVIEW_LOADING_AND_RENDERING");
});