#!/usr/bin/env node
/**
 * Consolida os relatórios de auditoria em:
 *   - seo-reports/ci-audit-summary.md  (resumo comparativo para o CI)
 *   - public/audit/*.json              (dados lidos pelo painel /painel-auditorias)
 *   - public/audit/history.json        (histórico por deploy, últimos 30)
 *
 * Só agrega o que existe: nenhum número é estimado ou inventado.
 * Uso: node scripts/ci-audit-report.mjs
 */
import fs from "node:fs";
import path from "node:path";

const R = "seo-reports";
const PUB = path.join("public", "audit");
fs.mkdirSync(PUB, { recursive: true });

const readJson = (p) => {
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; }
};

const linkPreviews = readJson(path.join(R, "link-preview-report.json"));
const headIcons = readJson(path.join(R, "head-icons-report.json"));
const before = readJson(path.join(R, "indexability-before.json"));
const after = readJson(path.join(R, "indexability-after.json"));
const a11y = readJson(path.join(R, "a11y-report.json"));
const perf = readJson(path.join("src", "config", "portfolio-performance.json"));

/** Lighthouse: lê os resultados brutos do LHCI, quando presentes. */
function lighthouseRuns() {
  const dir = ".lighthouseci";
  if (!fs.existsSync(dir)) return [];
  const runs = [];
  for (const file of fs.readdirSync(dir)) {
    if (!file.startsWith("lhr-") || !file.endsWith(".json")) continue;
    const lhr = readJson(path.join(dir, file));
    if (!lhr?.categories) continue;
    runs.push({
      url: lhr.finalDisplayedUrl ?? lhr.requestedUrl ?? file,
      route: (() => { try { return new URL(lhr.finalDisplayedUrl ?? lhr.requestedUrl).pathname; } catch { return null; } })(),
      performance: lhr.categories.performance?.score ?? null,
      seo: lhr.categories.seo?.score ?? null,
      accessibility: lhr.categories.accessibility?.score ?? null,
      bestPractices: lhr.categories["best-practices"]?.score ?? null,
      lcp: lhr.audits?.["largest-contentful-paint"]?.numericValue ?? null,
      cls: lhr.audits?.["cumulative-layout-shift"]?.numericValue ?? null,
      tbt: lhr.audits?.["total-blocking-time"]?.numericValue ?? null,
    });
  }
  return runs;
}

const lighthouse = lighthouseRuns();
const generatedAt = new Date().toISOString();
const commit = process.env.GITHUB_SHA ?? null;
const runUrl = process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
  ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  : null;

/** Consolidação por rota — base do painel e do resumo. */
const routes = new Map();
const touch = (route) => {
  if (!routes.has(route)) {
    routes.set(route, { route, slug: route.startsWith("/portfolio/") ? route.split("/")[2] : null, problems: [] });
  }
  return routes.get(route);
};

for (const r of linkPreviews?.routes ?? []) {
  const row = touch(r.route);
  row.ogImage = r.ogImage ?? r.og?.image ?? null;
  row.twitterImage = r.twitterImage ?? r.twitter?.image ?? null;
  row.problems.push(...(r.problems ?? []).map((p) => `preview: ${p}`));
}
for (const r of headIcons?.routes ?? []) {
  const row = touch(r.route);
  row.icons = r.icons?.length ?? 0;
  row.problems.push(...(r.problems ?? []).map((p) => `ícone: ${p}`));
}
for (const r of after?.routes ?? []) {
  const row = touch(r.route);
  row.status = r.status;
  row.canonical = r.canonical;
  row.robots = r.robots;
  row.schemas = r.schemas;
  row.problems.push(...(r.problems ?? []).map((p) => `seo: ${p}`));
}
for (const run of lighthouse) {
  if (!run.route) continue;
  const row = touch(run.route);
  row.lighthouse = run;
}
for (const finding of a11y?.violations ?? a11y?.results ?? []) {
  const route = finding.route ?? finding.url;
  if (!route) continue;
  const row = touch(route.startsWith("http") ? new URL(route).pathname : route);
  row.problems.push(`a11y: ${finding.id ?? finding.rule ?? "violação"}`);
}

const rows = [...routes.values()].sort((a, b) => a.route.localeCompare(b.route));
const failing = rows.filter((r) => r.problems.length);

const snapshot = {
  generatedAt,
  commit,
  runUrl,
  base: after?.base ?? linkPreviews?.base ?? headIcons?.base ?? null,
  totals: {
    routes: rows.length,
    routesWithProblems: failing.length,
    problems: rows.reduce((n, r) => n + r.problems.length, 0),
    lighthouseRuns: lighthouse.length,
    sitemapUrls: after?.sitemap?.urls?.length ?? null,
  },
  rows,
  robots: after?.robots ?? null,
  sitemap: after?.sitemap ? { ...after.sitemap, urls: after.sitemap.urls.slice(0, 500) } : null,
  performanceBudget: perf ?? null,
};

fs.writeFileSync(path.join(PUB, "latest.json"), `${JSON.stringify(snapshot, null, 2)}\n`);
if (linkPreviews) fs.writeFileSync(path.join(PUB, "link-previews.json"), `${JSON.stringify(linkPreviews, null, 2)}\n`);
if (headIcons) fs.writeFileSync(path.join(PUB, "head-icons.json"), `${JSON.stringify(headIcons, null, 2)}\n`);
if (after) fs.writeFileSync(path.join(PUB, "indexability.json"), `${JSON.stringify(after, null, 2)}\n`);
if (lighthouse.length) fs.writeFileSync(path.join(PUB, "lighthouse.json"), `${JSON.stringify(lighthouse, null, 2)}\n`);

const historyPath = path.join(PUB, "history.json");
const history = readJson(historyPath) ?? [];
history.unshift({
  generatedAt,
  commit,
  runUrl,
  totals: snapshot.totals,
  lighthouseAverage: lighthouse.length
    ? {
        performance: avg(lighthouse.map((l) => l.performance)),
        seo: avg(lighthouse.map((l) => l.seo)),
        accessibility: avg(lighthouse.map((l) => l.accessibility)),
        bestPractices: avg(lighthouse.map((l) => l.bestPractices)),
      }
    : null,
});
fs.writeFileSync(historyPath, `${JSON.stringify(history.slice(0, 30), null, 2)}\n`);

function avg(values) {
  const nums = values.filter((v) => typeof v === "number");
  return nums.length ? Number((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(3)) : null;
}

// ---------- resumo markdown ----------
const diffMd = fs.existsSync(path.join(R, "indexability-diff.md"))
  ? fs.readFileSync(path.join(R, "indexability-diff.md"), "utf8")
  : "_Sem snapshot `before` para comparar._";

const lines = [
  "# Relatório comparativo de auditoria — 0WEB",
  "",
  `Gerado em ${generatedAt}${commit ? ` · commit \`${commit.slice(0, 7)}\`` : ""}`,
  "",
  "## Visão geral",
  "",
  `- Rotas auditadas: **${snapshot.totals.routes}**`,
  `- Rotas com problemas: **${snapshot.totals.routesWithProblems}**`,
  `- URLs no sitemap: **${snapshot.totals.sitemapUrls ?? "—"}**`,
  `- Execuções Lighthouse: **${snapshot.totals.lighthouseRuns}**`,
  "",
  "## Por rota",
  "",
  "| Rota | HTTP | Perf | SEO | A11y | BP | Problemas |",
  "| --- | --- | --- | --- | --- | --- | --- |",
];
const pct = (v) => (typeof v === "number" ? Math.round(v * 100) : "—");
for (const row of rows) {
  lines.push(
    `| \`${row.route}\` | ${row.status ?? "—"} | ${pct(row.lighthouse?.performance)} | ${pct(row.lighthouse?.seo)} | ${pct(row.lighthouse?.accessibility)} | ${pct(row.lighthouse?.bestPractices)} | ${row.problems.length ? row.problems.join("; ") : "—"} |`,
  );
}
lines.push("", "## Indexabilidade (antes vs. depois)", "", diffMd, "", "## Artefatos", "");
for (const f of ["link-preview-report.json", "head-icons-report.json", "indexability-before.json", "indexability-after.json", "a11y-report.json"]) {
  lines.push(`- ${fs.existsSync(path.join(R, f)) ? "✅" : "—"} \`seo-reports/${f}\``);
}
lines.push("", "Painel interno: `/painel-auditorias`.");

const summaryPath = path.join(R, "ci-audit-summary.md");
fs.writeFileSync(summaryPath, `${lines.join("\n")}\n`);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join("\n")}\n`);

console.log(`[ci-audit] resumo → ${summaryPath}`);
console.log(`[ci-audit] painel → public/audit/latest.json (${rows.length} rota(s), ${failing.length} com problema)`);
if (before && !after) console.warn("[ci-audit] snapshot 'after' ausente — rode audit-seo-indexability.mjs --label=after");
