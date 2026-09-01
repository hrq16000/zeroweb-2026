#!/usr/bin/env node
/**
 * Exportação diária do Google Search Console (0WEB).
 *
 * Resolve a propriedade verificada em tempo de execução (list → select → pass),
 * consulta os últimos 28 dias completos e grava um snapshot JSON + um relatório
 * markdown em `seo-reports/`.
 *
 * Uso:
 *   node scripts/gsc-daily-export.mjs [--site https://0web.com.br/] [--days 28]
 *
 * Requer no ambiente:
 *   LOVABLE_API_KEY                  auth no gateway
 *   GOOGLE_SEARCH_CONSOLE_API_KEY    chave da conexão (o gateway repassa o OAuth)
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";
const TARGET = argValue("--site") ?? "https://0web.com.br/";
const DAYS = Number(argValue("--days") ?? 28);
const OUT_DIR = path.resolve("seo-reports");

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function headers() {
  const lovable = process.env.LOVABLE_API_KEY;
  const connection = process.env.GOOGLE_SEARCH_CONSOLE_API_KEY;
  if (!lovable || !connection) {
    throw new Error(
      "Credenciais ausentes: defina LOVABLE_API_KEY e GOOGLE_SEARCH_CONSOLE_API_KEY.",
    );
  }
  return { Authorization: `Bearer ${lovable}`, "X-Connection-Api-Key": connection };
}

function coversTarget(siteUrl, target) {
  if (siteUrl.startsWith("sc-domain:")) {
    const domain = siteUrl.slice("sc-domain:".length).toLowerCase();
    const host = target.hostname.toLowerCase();
    return host === domain || host.endsWith(`.${domain}`);
  }
  try {
    return target.href.startsWith(new URL(siteUrl).href);
  } catch {
    return false;
  }
}

async function resolveSiteUrl(targetUrl) {
  const res = await fetch(`${GATEWAY}/webmasters/v3/sites`, { headers: headers() });
  if (!res.ok) throw new Error(`Falha ao listar propriedades [${res.status}]: ${await res.text()}`);
  const { siteEntry = [] } = await res.json();
  const target = new URL(targetUrl);
  const matches = siteEntry.filter(
    (e) => e.permissionLevel !== "siteUnverifiedUser" && coversTarget(e.siteUrl, target),
  );
  if (matches.length === 0) throw new Error("Nenhuma propriedade verificada cobre este site.");
  if (matches.length > 1) {
    const exact = matches.find((e) => e.siteUrl === target.origin + "/");
    if (exact) return exact.siteUrl;
    throw new Error(
      `Múltiplas propriedades cobrem o site; escolha uma com --site: ${matches
        .map((m) => m.siteUrl)
        .join(", ")}`,
    );
  }
  return matches[0].siteUrl;
}

function isoDaysAgo(n) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

async function query(siteUrl, body) {
  const res = await fetch(
    `${GATEWAY}/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    { method: "POST", headers: { ...headers(), "Content-Type": "application/json" }, body: JSON.stringify(body) },
  );
  if (res.status === 403) throw new Error("Sem acesso à propriedade selecionada (403).");
  if (!res.ok) throw new Error(`Consulta falhou [${res.status}]: ${await res.text()}`);
  return res.json();
}

function table(rows, label) {
  if (!rows.length) return `_Sem dados para ${label}._\n`;
  const head = `| ${label} | Cliques | Impressões | CTR | Posição |\n|---|---:|---:|---:|---:|\n`;
  return (
    head +
    rows
      .map(
        (r) =>
          `| ${r.keys[0]} | ${r.clicks} | ${r.impressions} | ${(r.ctr * 100).toFixed(1)}% | ${r.position.toFixed(1)} |`,
      )
      .join("\n") +
    "\n"
  );
}

async function main() {
  const siteUrl = await resolveSiteUrl(TARGET);
  const startDate = isoDaysAgo(DAYS + 2);
  const endDate = isoDaysAgo(2);
  const range = { startDate, endDate };

  const [totals, queries, pages, days] = await Promise.all([
    query(siteUrl, { ...range, dimensions: [] }),
    query(siteUrl, { ...range, dimensions: ["query"], rowLimit: 50 }),
    query(siteUrl, { ...range, dimensions: ["page"], rowLimit: 50 }),
    query(siteUrl, { ...range, dimensions: ["date"], rowLimit: 100 }),
  ]);

  const snapshot = {
    siteUrl,
    range,
    refreshedAt: new Date().toISOString(),
    totals: totals.rows?.[0] ?? null,
    queries: queries.rows ?? [],
    pages: pages.rows ?? [],
    days: days.rows ?? [],
  };

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(path.join(OUT_DIR, "gsc-latest.json"), JSON.stringify(snapshot, null, 2));

  const t = snapshot.totals;
  const md = `# Search Console — ${siteUrl}

Período: **${startDate} → ${endDate}** · Atualizado em ${snapshot.refreshedAt}

## Totais

${
  t
    ? `- Cliques: **${t.clicks}**\n- Impressões: **${t.impressions}**\n- CTR: **${(t.ctr * 100).toFixed(2)}%**\n- Posição média: **${t.position.toFixed(1)}**`
    : "_Sem dados agregados no período._"
}

## Top 50 consultas

${table(snapshot.queries, "Consulta")}

## Top 50 páginas

${table(snapshot.pages, "Página")}
`;
  await writeFile(path.join(OUT_DIR, "gsc-latest.md"), md);
  console.log(`[gsc] OK — ${siteUrl} (${startDate} → ${endDate}); relatórios em seo-reports/`);
}

main().catch((err) => {
  console.error(`[gsc] FALHA — ${err.message}`);
  process.exitCode = 1;
});
