#!/usr/bin/env node
/**
 * Auditoria dos padrões universais de `/portfolio/:slug`.
 *
 * Verifica, para todo cliente registrado, que a rota pública renderiza a casca
 * padrão (`PortfolioStandardShell`) — que garante compartilhar, contato
 * flutuante, rodapé padrão e pop-up de captação da hospedagem.
 *
 * Gera `seo-reports/portfolio-standards-report.json` para revisão/PR.
 * Uso: node scripts/audit-portfolio-standards.mjs [--json]
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const clients = JSON.parse(readFileSync("src/config/portfolio-clients.json", "utf8"));
const globalConfig = JSON.parse(readFileSync("src/config/portfolio-global-config.json", "utf8"));

const SHARED_ROUTE = "src/routes/portfolio.$slug.tsx";
const rows = [];
const failures = [];

for (const client of clients) {
  const routeFile = client.routeFile ?? SHARED_ROUTE;
  const source = existsSync(routeFile) ? readFileSync(routeFile, "utf8") : "";
  const hasShell = /PortfolioStandardShell/.test(source);
  const override = globalConfig.overrides?.[client.clientKey] ?? {};
  const disabled = Object.entries(override)
    .filter(([, value]) => value && typeof value === "object" && value.enabled === false)
    .map(([section]) => section);

  const problems = [];
  if (!hasShell) problems.push(`${routeFile} não renderiza PortfolioStandardShell`);
  for (const section of disabled) {
    if (["footer", "hostCapturePopup"].includes(section)) {
      problems.push(`${client.clientKey}: '${section}' não pode ser desativado`);
    }
  }

  rows.push({ clientKey: client.clientKey, slug: client.slug, routeFile, standardShell: hasShell, overrides: Object.keys(override), problems });
  failures.push(...problems);
}

const report = {
  generatedAt: new Date().toISOString(),
  configVersion: globalConfig.version,
  total: rows.length,
  conformes: rows.filter((row) => row.problems.length === 0).length,
  projetos: rows,
};

mkdirSync("seo-reports", { recursive: true });
writeFileSync("seo-reports/portfolio-standards-report.json", `${JSON.stringify(report, null, 2)}\n`);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  for (const row of rows) {
    console.log(`${row.problems.length ? "[FAIL]" : "[ok]  "} /portfolio/${row.slug} · shell=${row.standardShell} · overrides=${row.overrides.join(",") || "—"}`);
  }
}

console.log("[portfolio-standards] report → seo-reports/portfolio-standards-report.json");

if (failures.length) {
  console.error(`[portfolio-standards] FAIL — ${failures.length} problema(s)`);
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}
console.log(`[portfolio-standards] OK — ${rows.length} projeto(s) no padrão global`);
