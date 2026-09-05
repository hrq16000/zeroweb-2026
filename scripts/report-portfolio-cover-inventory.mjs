#!/usr/bin/env node
/**
 * Inventário reconciliado das capas do portfólio.
 *
 * Fonte única: src/config/portfolio-visual-review.json (julgamento humano).
 * Regra matemática: TOTAL_CANDIDATES = APPROVED + BLOCKED, sem projeto fora da conta.
 * Candidata = projeto com coverMaterial === "HAS_SAFE_REAL_MATERIAL".
 *
 * Uso: node scripts/report-portfolio-cover-inventory.mjs [--markdown]
 */
import { readFileSync, existsSync } from "node:fs";

const review = JSON.parse(readFileSync("src/config/portfolio-visual-review.json", "utf8"));
const plan = JSON.parse(readFileSync("src/config/portfolio-cover-plan.json", "utf8"));
const catalog = JSON.parse(readFileSync("src/config/portfolio-catalog.json", "utf8"));

const nameBySlug = new Map();
const catalogItems = Array.isArray(catalog) ? catalog : (catalog.projects ?? catalog.items ?? []);
for (const item of catalogItems) {
  if (item?.slug) nameBySlug.set(item.slug, item.businessName ?? item.name ?? item.title ?? item.slug);
}

const rows = [];
for (const [slug, entry] of Object.entries(review)) {
  if (slug === "_readme" || !entry?.coverMaterial) continue;
  if (entry.coverMaterial !== "HAS_SAFE_REAL_MATERIAL") continue;
  const approved = entry.coverReview === "APPROVED";
  const asset = entry.coverSource ?? plan.projects?.[slug]?.source ?? "—";
  const focal = entry.coverFocal ?? plan.projects?.[slug]?.focal ?? null;
  rows.push({
    slug,
    businessName: nameBySlug.get(slug) ?? slug,
    materialType: entry.coverDecision ?? "—",
    decision: approved ? "APPROVED" : (entry.coverBlockReason ?? "BLOCKED_OTHER"),
    reason: (entry.notes ?? "").replace(/\s+/g, " ").slice(0, 140),
    asset,
    focalPoint: focal ? `${focal.x}/${focal.y}` : "—",
    published: approved && asset !== "—" && existsSync(asset.replace(/^public\//, "public/")) ? "YES" : "NO",
  });
}

rows.sort((a, b) => (a.decision === b.decision ? a.slug.localeCompare(b.slug) : a.decision.localeCompare(b.decision)));
const approved = rows.filter((r) => r.decision === "APPROVED");
const blocked = rows.filter((r) => r.decision !== "APPROVED");
const balanced = rows.length === approved.length + blocked.length;

if (process.argv.includes("--markdown")) {
  console.log("| slug | businessName | materialType | decision | asset | focalPoint | published |");
  console.log("|---|---|---|---|---|---|---|");
  for (const r of rows) {
    console.log(`| ${r.slug} | ${r.businessName} | ${r.materialType} | ${r.decision} | ${r.asset} | ${r.focalPoint} | ${r.published} |`);
  }
  console.log("");
}
console.log(
  `[cover-inventory] TOTAL_CANDIDATES=${rows.length} · APPROVED=${approved.length} · BLOCKED=${blocked.length} · BALANCED=${balanced ? "YES" : "NO"}`,
);
const byReason = {};
for (const r of blocked) byReason[r.decision] = (byReason[r.decision] ?? 0) + 1;
console.log(`[cover-inventory] motivos: ${Object.entries(byReason).map(([k, v]) => `${k}=${v}`).join(" · ") || "—"}`);
if (!balanced) process.exit(1);
