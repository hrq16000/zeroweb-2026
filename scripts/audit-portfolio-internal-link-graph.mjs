#!/usr/bin/env node
/**
 * Gate estático da malha interna universal de /portfolio.
 *
 * Objetivo: impedir que um portfolio publicado fique semanticamente órfão.
 * A fonte de verdade é a mesma usada pelo runtime: portfolio-catalog.json.
 * O ranking replica apenas os critérios estruturais do resolvedor universal,
 * sem criar conteúdo, localidade ou afinidade que não estejam no catálogo.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";

const catalog = JSON.parse(await readFile("src/config/portfolio-catalog.json", "utf8"));
const PUBLIC_STATUSES = new Set(["published", "approved"]);
const GENERIC_PLACES = new Set(["", "brasil", "região a confirmar", "regiao a confirmar"]);
const LIMIT = 6;

const clean = (value) => typeof value === "string" ? value.trim() : "";
const normalize = (value = "") => clean(value)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();
const tags = (value) => Array.isArray(value)
  ? [...new Set(value.map((item) => normalize(String(item ?? ""))).filter(Boolean))]
  : [];
const usefulPlace = (value) => !GENERIC_PLACES.has(normalize(value));

const items = catalog
  .filter((item) => PUBLIC_STATUSES.has(item.status ?? "") && item.live !== false)
  .map((item) => ({
    slug: clean(item.slug),
    title: clean(item.title),
    segment: clean(item.segment),
    city: clean(item.city),
    state: clean(item.state),
    projectType: clean(item.projectType),
    tags: tags(item.tags),
  }));

function score(current, candidate) {
  let value = 0;
  if (current.segment && normalize(current.segment) === normalize(candidate.segment)) value += 8;
  if (usefulPlace(current.city) && usefulPlace(candidate.city) && normalize(current.city) === normalize(candidate.city)) value += 7;
  if (current.state && normalize(current.state) === normalize(candidate.state)) value += 2;
  const currentTags = new Set(current.tags);
  value += Math.min(8, candidate.tags.filter((tag) => currentTags.has(tag)).length * 2);
  if (current.projectType && normalize(current.projectType) === normalize(candidate.projectType)) value += 1;
  return value;
}

function related(current) {
  const ranked = items
    .filter((candidate) => candidate.slug !== current.slug)
    .map((candidate) => ({ slug: candidate.slug, score: score(current, candidate) }))
    .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug, "pt-BR"));
  const strong = ranked.filter((candidate) => candidate.score >= 3);
  if (strong.length >= LIMIT) return strong.slice(0, LIMIT);
  const selected = new Map(strong.map((item) => [item.slug, item]));
  for (const item of ranked) {
    if (selected.size >= LIMIT) break;
    if (!selected.has(item.slug)) selected.set(item.slug, item);
  }
  return [...selected.values()].slice(0, LIMIT);
}

const outgoing = new Map(items.map((item) => [item.slug, related(item)]));
const incoming = new Map(items.map((item) => [item.slug, []]));
for (const [source, links] of outgoing) {
  for (const link of links) incoming.get(link.slug)?.push(source);
}

const rows = items.map((item) => {
  const out = outgoing.get(item.slug) ?? [];
  const inbound = incoming.get(item.slug) ?? [];
  return {
    slug: item.slug,
    outgoing: out.length,
    strongOutgoing: out.filter((link) => link.score >= 3).length,
    incoming: inbound.length,
    incomingFrom: inbound,
  };
});

const failures = [];
const slugSet = new Set(items.map((item) => item.slug));
if (slugSet.size !== items.length) failures.push("slugs publicados duplicados no catálogo");
for (const item of items) {
  if (!item.slug || !item.title) failures.push(`${item.slug || "<sem-slug>"}: slug/title ausente`);
}
for (const row of rows) {
  if (row.outgoing !== Math.min(LIMIT, Math.max(0, items.length - 1))) failures.push(`${row.slug}: possui ${row.outgoing} links de saída`);
  if (row.incoming === 0) failures.push(`${row.slug}: portfolio órfão, sem backlink interno de outro portfolio`);
}

const report = {
  generatedAt: new Date().toISOString(),
  totalPublished: items.length,
  orphanCount: rows.filter((row) => row.incoming === 0).length,
  minIncoming: rows.length ? Math.min(...rows.map((row) => row.incoming)) : 0,
  maxIncoming: rows.length ? Math.max(...rows.map((row) => row.incoming)) : 0,
  rows,
};
await mkdir("seo-reports", { recursive: true });
await writeFile("seo-reports/portfolio-internal-link-graph-latest.json", `${JSON.stringify(report, null, 2)}\n`);

console.log(`[portfolio-link-graph] ${items.length} publicados · ${report.orphanCount} órfão(s) · inbound min/max ${report.minIncoming}/${report.maxIncoming}`);
if (failures.length) {
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}
