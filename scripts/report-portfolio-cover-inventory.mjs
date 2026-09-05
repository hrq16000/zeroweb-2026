#!/usr/bin/env node
/**
 * Inventário integral das capas do /portfolio (todos os projetos do catálogo).
 *
 * Fonte de verdade: src/config/portfolio-cover-status.json, gerado pelo contrato
 * canônico src/lib/portfolio-cover-status.mjs. Este script NÃO reclassifica nada;
 * apenas apresenta o inventário e falha se o arquivo estiver desatualizado.
 *
 * Uso: node scripts/report-portfolio-cover-inventory.mjs [--markdown]
 */
import { readFileSync } from "node:fs";
import { PENDING_STATUSES, summarizeCoverStatus } from "../src/lib/portfolio-cover-status.mjs";

const data = JSON.parse(readFileSync("src/config/portfolio-cover-status.json", "utf8"));
const rows = data.projects;
const summary = summarizeCoverStatus(rows);

if (!summary.balanced || summary.total !== rows.length) {
  console.error("[cover-inventory] inventário inconsistente.");
  process.exit(1);
}

if (process.argv.includes("--markdown")) {
  const lines = [
    "# Inventário de capas do portfólio",
    "",
    `Gerado por \`node scripts/report-portfolio-cover-inventory.mjs --markdown\` a partir de \`${data.contract}\`.`,
    "",
    `Total ${summary.total} · válidas ${summary.valid} · pendentes ${summary.pending}.`,
    "",
    "| Status | Quantidade |",
    "|---|---|",
    `| VALID | ${summary.valid} |`,
    ...PENDING_STATUSES.map((s) => `| ${s} | ${summary.byStatus[s]} |`),
    "",
    "| Slug | Cliente | Status | Asset | Motivo |",
    "|---|---|---|---|---|",
    ...rows.map(
      (r) =>
        `| \`${r.slug}\` | ${r.businessName} | ${r.status} | ${r.asset ? `\`${r.asset}\`` : "—"} | ${r.reason ?? "—"} |`,
    ),
    "",
  ];
  console.log(lines.join("\n"));
} else {
  for (const r of rows.filter((x) => x.status !== "VALID")) {
    console.log(`[${r.status}] ${r.slug} · ${r.reason}`);
  }
  console.log(
    `\n[cover-inventory] ${summary.total} projeto(s) · VALID=${summary.valid} · PENDING=${summary.pending} · ` +
      PENDING_STATUSES.map((s) => `${s}=${summary.byStatus[s]}`).join(" · "),
  );
}
