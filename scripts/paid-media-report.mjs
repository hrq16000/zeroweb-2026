// Offline, aggregate-only audit. No advertisements, credentials, network or DB writes.
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const platforms = new Set(["google", "meta", "linkedin", "tiktok", "reddit", "snap", "microsoft", "other"]);
function requireThat(condition, message) {
  if (!condition) throw new Error(message);
}
function object(value, keys, label) {
  requireThat(value !== null && typeof value === "object" && !Array.isArray(value), label + ": objeto inválido");
  requireThat(Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key)), label + ": campos inválidos");
}
function alias(value) { return typeof value === "string" && /^[a-z0-9_\-]{1,64}$/.test(value); }
function count(value) { return value === null || (Number.isSafeInteger(value) && value >= 0); }
function conversion(value) { return value === null || (typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER); }
function day(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
  const date = new Date(value + "T00:00:00Z");
  return Number.isFinite(+date) && date.toISOString().slice(0, 10) === value ? +date / 86400000 : NaN;
}
function period(value, label) {
  object(value, ["start", "end", "complete", "rows"], label);
  const start = day(value.start), end = day(value.end);
  requireThat(Number.isFinite(start) && Number.isFinite(end) && start <= end, label + ": datas inválidas");
  requireThat(typeof value.complete === "boolean" && Array.isArray(value.rows) && value.rows.length <= 10000, label + ": cobertura inválida");
  const seen = new Set();
  for (const row of value.rows) {
    object(row, ["platform", "campaign", "spendMinor", "impressions", "clicks", "conversions", "revenueMinor"], label + ": linha");
    requireThat(platforms.has(row.platform) && alias(row.campaign), label + ": plataforma ou alias inválido");
    requireThat([row.spendMinor, row.impressions, row.clicks, row.revenueMinor].every(count) && conversion(row.conversions), label + ": métrica inválida");
    const key = row.platform + ":" + row.campaign;
    requireThat(!seen.has(key), label + ": campanha duplicada (use um total por campanha)");
    seen.add(key);
  }
  return { start, end, days: end - start + 1 };
}
function sum(rows, field) {
  if (!rows.length || rows.some((row) => row[field] === null)) return null;
  const total = rows.reduce((acc, row) => acc + row[field], 0);
  requireThat(Number.isFinite(total) && total <= Number.MAX_SAFE_INTEGER, "total excede precisão segura");
  return total;
}
function ratio(n, d) {
  return n === null || d === null || d === 0 ? null : Math.round((n / d) * 10000) / 10000;
}
function summarize(rows, complete) {
  const totals = Object.fromEntries(["spendMinor", "impressions", "clicks", "conversions", "revenueMinor"].map((field) => [field, complete ? sum(rows, field) : null]));
  return { ...totals, ctr: ratio(totals.clicks, totals.impressions),
    cpcMinor: ratio(totals.spendMinor, totals.clicks),
    costPerConversionMinor: ratio(totals.spendMinor, totals.conversions),
    roas: ratio(totals.revenueMinor, totals.spendMinor),
    status: complete && rows.length && Object.values(totals).every((v) => v !== null) ? "complete" : "unknown" };
}
function compare(current, previous) {
  const result = {};
  for (const key of ["spendMinor", "impressions", "clicks", "conversions", "revenueMinor", "ctr", "cpcMinor", "costPerConversionMinor", "roas"]) {
    result[key] = current[key] === null || previous[key] === null ? null : current[key] - previous[key];
  }
  return result;
}
export function buildPaidMediaReport(input) {
  object(input, ["schemaVersion", "clientAlias", "currency", "timezone", "conversionDefinition", "attributionWindow", "previous", "current"], "entrada");
  requireThat(input.schemaVersion === 1 && alias(input.clientAlias) && typeof input.currency === "string" && /^[A-Z]{3}$/.test(input.currency), "versão, cliente ou moeda inválida");
  requireThat(alias(input.conversionDefinition) && alias(input.attributionWindow), "definição de conversão ou atribuição ausente");
  requireThat(typeof input.timezone === "string", "fuso inválido");
  try { new Intl.DateTimeFormat("en", { timeZone: input.timezone }); } catch { throw new Error("fuso inválido"); }
  const previous = period(input.previous, "anterior"), current = period(input.current, "atual");
  requireThat(previous.end < current.start && previous.days === current.days, "janelas precisam ter a mesma duração e não se sobrepor");
  const available = [...new Set([...input.previous.rows, ...input.current.rows].map((r) => r.platform))].sort();
  const groups = available.map((platform) => {
    const byPlatform = (value) => value.rows.filter((row) => row.platform === platform);
    const previousRows = byPlatform(input.previous), currentRows = byPlatform(input.current);
    const before = summarize(previousRows, input.previous.complete), after = summarize(currentRows, input.current.complete);
    const campaigns = [...new Set([...previousRows, ...currentRows].map((r) => r.campaign))].sort().map((campaign) => {
      const a = summarize(previousRows.filter((r) => r.campaign === campaign), input.previous.complete);
      const b = summarize(currentRows.filter((r) => r.campaign === campaign), input.current.complete);
      return { campaign, previous: a, current: b, delta: compare(b, a) };
    });
    return { platform, previous: before, current: after, delta: compare(after, before), campaigns };
  });
  return { schemaVersion: 1, clientAlias: input.clientAlias, currency: input.currency, timezone: input.timezone,
    conversionDefinition: input.conversionDefinition, attributionWindow: input.attributionWindow,
    previous: { start: input.previous.start, end: input.previous.end, complete: input.previous.complete },
    current: { start: input.current.start, end: input.current.end, complete: input.current.complete },
    groups, warnings: ["Não some conversões ou receita atribuída de plataformas distintas.",
      "null indica ausência de evidência ou denominador zero; não equivale a zero.",
      "Conversões de plataformas são atribuídas e não comprovam vendas reconciliadas.",
      "Valide definições, timezone, cobertura e fechamento antes de comparar. Nenhuma alteração de anúncios autorizada."] };
}

export function demoInput() {
  const row = (platform, campaign, spendMinor, clicks, conversions, revenueMinor) => ({ platform, campaign, spendMinor, impressions: 1000, clicks, conversions, revenueMinor });
  return { schemaVersion: 1, clientAlias: "demo-sintetico", currency: "BRL", timezone: "America/Sao_Paulo", conversionDefinition: "lead-enviado", attributionWindow: "clique-7d",
    previous: { start: "2026-11-01", end: "2026-11-07", complete: true, rows: [row("google", "pesquisa-local", 12000, 80, 4, null)] },
    current: { start: "2026-11-08", end: "2026-11-14", complete: true, rows: [row("google", "pesquisa-local", 14000, 100, 7, null), row("meta", "social-local", 9000, 70, null, null)] } };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    requireThat(process.argv.length === 3, "uso: node scripts/paid-media-report.mjs --demo | arquivo.json");
    const input = process.argv[2] === "--demo" ? demoInput() : JSON.parse(readFileSync(process.argv[2], "utf8"));
    console.log(JSON.stringify(buildPaidMediaReport(input), null, 2));
  } catch {
    console.error("Relatório recusado: verifique o contrato do JSON, métricas agregadas e janelas de igual duração.");
    process.exitCode = 1;
  }
}
