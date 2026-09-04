#!/usr/bin/env node
/**
 * Gate de conformidade dos projetos /portfolio/:slug.
 *
 * As regras vivem em scripts/portfolio-conformance.mjs (contrato único,
 * também consumido pelo seed do admin). Este arquivo só formata e decide
 * o exit code.
 *
 * Uso:
 *   node scripts/check-portfolio-projects.mjs            # relatório + exit 1 se houver falha bloqueante
 *   node scripts/check-portfolio-projects.mjs --json     # saída JSON para governança
 *   node scripts/check-portfolio-projects.mjs --slug=x   # audita apenas um projeto
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildRecords } from "./portfolio-conformance.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const asJson = args.includes("--json");
const onlySlug = args.find((a) => a.startsWith("--slug="))?.split("=")[1];

const all = buildRecords(root);
const results = (onlySlug ? all.filter((r) => r.slug === onlySlug) : all).map((r) => ({
  slug: r.slug,
  title: r.title,
  published: r.published,
  status: r.status,
  issues: r.issues,
  blocking: r.blocking,
}));

const failures = results.filter((r) => r.published && r.blocking.length > 0);
const partial = results.filter((r) => r.status === "PARTIAL");
const complete = results.filter((r) => r.status === "COMPLETE");

if (asJson) {
  console.log(
    JSON.stringify(
      {
        results,
        summary: {
          total: results.length,
          complete: complete.length,
          partial: partial.length,
          blocking: failures.length,
        },
      },
      null,
      2,
    ),
  );
} else {
  for (const r of results) {
    if (r.issues.length === 0) continue;
    const tag = r.blocking.length > 0 ? "ERRO" : "aviso";
    console.log(`[${tag}] ${r.slug} (${r.status}) → ${r.issues.join(", ")}`);
  }
  console.log(
    `\n[portfolio-projects] ${results.length} projeto(s) · ${complete.length} COMPLETE · ${partial.length} PARTIAL · ${failures.length} bloqueante(s)`,
  );
}

process.exit(failures.length > 0 ? 1 : 0);
