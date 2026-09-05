#!/usr/bin/env node
/**
 * Gera o inventário canônico de capas em src/config/portfolio-cover-status.json.
 *
 * Deriva tudo das fontes já existentes (catálogo + revisão visual + assets + arquivos),
 * sem inventário manual e sem banco novo.
 *
 * Uso: node scripts/build-portfolio-cover-status.mjs [--check]
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolveCoverStatus, summarizeCoverStatus } from "../src/lib/portfolio-cover-status.mjs";

const OUT = "src/config/portfolio-cover-status.json";
const read = (p) => JSON.parse(readFileSync(p, "utf8"));

const catalogRaw = read("src/config/portfolio-catalog.json");
const catalog = Array.isArray(catalogRaw) ? catalogRaw : (catalogRaw.projects ?? catalogRaw.items ?? []);
const review = read("src/config/portfolio-visual-review.json");
const assets = read("src/config/portfolio-assets.json").clients ?? {};

const fileExists = (p) => existsSync(p.startsWith("public/") ? p : `public${p.startsWith("/") ? "" : "/"}${p}`);
const listProjectFiles = (slug) => {
  const dir = `public/images/${slug}`;
  return existsSync(dir) ? readdirSync(dir) : [];
};

const projects = catalog
  .filter((item) => item?.slug)
  .map((item) => ({
    item,
    row: resolveCoverStatus({
      slug: item.slug,
      review: review[item.slug] ?? null,
      catalogImage: item.image ?? null,
      assets: assets[item.clientKey ?? item.slug] ?? null,
      projectFiles: listProjectFiles(item.slug),
      fileExists,
    }),
  }))
  .map(({ item, row }) => ({ ...row, businessName: item.title ?? row.slug, segment: item.segment ?? null }))
  .sort((a, b) => a.slug.localeCompare(b.slug));

const summary = summarizeCoverStatus(projects);
const payload = {
  generator: "scripts/build-portfolio-cover-status.mjs",
  contract: "src/lib/portfolio-cover-status.mjs",
  doc: "docs/PORTFOLIO_COVER_STATUS_CONTRACT.md",
  generatedAt: new Date().toISOString().slice(0, 10),
  summary,
  projects,
};

const serialize = (data) => `${JSON.stringify({ ...data, generatedAt: undefined }, null, 2)}\n`;

if (process.argv.includes("--check")) {
  const current = existsSync(OUT) ? read(OUT) : null;
  if (!current || serialize(current) !== serialize(payload)) {
    console.error("[cover-status] desatualizado — rode `bun run build:portfolio-cover-status`.");
    process.exit(1);
  }
} else {
  const previous = existsSync(OUT) ? read(OUT) : null;
  payload.generatedAt = previous && serialize(previous) === serialize(payload) ? previous.generatedAt : payload.generatedAt;
  writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`);
}

if (!summary.balanced) {
  console.error("[cover-status] FAIL — pendências não fecham com a soma dos reason codes.");
  process.exit(1);
}
console.log(
  `[cover-status] ${summary.total} projeto(s) · VALID=${summary.valid} · PENDING=${summary.pending} · ` +
    Object.entries(summary.byStatus)
      .filter(([k]) => k !== "VALID")
      .map(([k, v]) => `${k}=${v}`)
      .join(" · "),
);
