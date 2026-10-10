#!/usr/bin/env node
/**
 * Diagnóstico não bloqueante de Lighthouse para o CI.
 * Lê relatórios já gerados pelo LHCI; não altera assertions nem budgets.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const directory = ".lighthouseci";
if (!existsSync(directory)) {
  console.log("[lhci-diagnostic] Nenhum relatório local disponível");
  process.exit(0);
}
const files = readdirSync(directory).filter((file) => /^lhr-.*\.json$/.test(file)).sort();
if (!files.length) {
  console.log("[lhci-diagnostic] Relatórios LHR não encontrados");
  process.exit(0);
}
const metrics = [
  "first-contentful-paint",
  "largest-contentful-paint",
  "speed-index",
  "total-blocking-time",
  "cumulative-layout-shift",
  "server-response-time",
];
const round = (value) => typeof value === "number" ? Math.round(value * 100) / 100 : "?";
for (const file of files) {
  try {
    const lhr = JSON.parse(readFileSync(join(directory, file), "utf8"));
    const scores = Object.fromEntries(
      ["performance", "accessibility", "best-practices", "seo"].map((key) => [
        key,
        round((lhr.categories?.[key]?.score ?? 0) * 100),
      ]),
    );
    console.log(`[lhci-diagnostic] ${file} ${lhr.finalUrl || lhr.requestedUrl || ""}`);
    console.log(`[lhci-diagnostic] scores ${JSON.stringify(scores)}`);
    for (const id of metrics) {
      const audit = lhr.audits?.[id];
      if (audit) console.log(`[lhci-diagnostic] ${id}: ${audit.displayValue || round(audit.numericValue)}`);
    }
    const lcpNode = lhr.audits?.["largest-contentful-paint-element"]?.details?.items?.[0]?.node;
    if (lcpNode?.snippet) console.log(`[lhci-diagnostic] LCP element: ${lcpNode.snippet.slice(0, 240)}`);
    for (const id of [
      "lcp-breakdown-insight", "lcp-discovery-insight",
      "render-blocking-resources", "unused-javascript",
      "modern-image-formats", "uses-responsive-images",
    ]) {
      const audit = lhr.audits?.[id];
      if (!audit || audit.score === 1) continue;
      const items = audit.details?.items;
      console.log(`[lhci-diagnostic] ${id}: ${audit.displayValue || audit.title || "attention"}; items=${Array.isArray(items) ? items.length : 0}`);
      if (Array.isArray(items)) {
        for (const item of items.slice(0, 3)) {
          const url = typeof item.url === "string" ? item.url.replace(/^https?:\/\/[^/]+/, "") : "";
          console.log(`[lhci-diagnostic]   ${JSON.stringify({url, wastedMs:item.wastedMs, wastedBytes:item.wastedBytes, totalBytes:item.totalBytes})}`);
        }
      }
    }
  } catch (error) {
    // Não mascarar o status real do Lighthouse devido a diagnóstico.
    console.warn(`[lhci-diagnostic] Falha ao ler ${file}: ${error.message}`);
  }
}
