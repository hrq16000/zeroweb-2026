#!/usr/bin/env node
/**
 * Q2 — imagem social coerente com a marca autoral.
 *
 * Só atua em projetos marcados como `authored` em
 * src/config/portfolio-brand-review.json cujo logo é um SVG do próprio slug.
 * A arte usa exclusivamente a marca e a paleta declaradas na direção de marca
 * e os dados já existentes no catálogo (nome, segmento, cidade/UF).
 * Nada é inventado: nenhum telefone, endereço, número ou alegação entra aqui.
 */
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

const catalog = JSON.parse(await readFile(resolve("src/config/portfolio-catalog.json"), "utf8"));
const assetsPath = resolve("src/config/portfolio-assets.json");
const assets = JSON.parse(await readFile(assetsPath, "utf8"));
const review = JSON.parse(await readFile(resolve("src/config/portfolio-brand-review.json"), "utf8"));

const esc = (v) =>
  String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);

const bySlug = new Map(catalog.map((item) => [item.slug, item]));
let done = 0;

for (const [slug, entry] of Object.entries(review.projects ?? {})) {
  if (!entry?.authored || !entry.direction) continue;
  const item = bySlug.get(slug);
  const logoPath = resolve("public", `images/${slug}/logo.svg`);
  if (!item || !existsSync(logoPath)) continue;

  const [base, accent, soft] = entry.direction.colors;
  const dark = isDark(base);
  const ink = dark ? "#ffffff" : "#1a1a1a";
  const inkSoft = dark ? "#ffffff" : "#3a3a3a";

  const logo = await sharp(logoPath).resize({ width: 620 }).png().toBuffer();

  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${esc(base)}"/>
  <rect x="0" y="0" width="1200" height="14" fill="${esc(accent)}"/>
  <circle cx="1120" cy="96" r="220" fill="${esc(accent)}" opacity="${dark ? ".16" : ".22"}"/>
  <circle cx="1040" cy="600" r="150" fill="${esc(soft ?? accent)}" opacity="${dark ? ".12" : ".18"}"/>
  <text x="80" y="392" font-family="Arial,Helvetica,sans-serif" font-size="52" font-weight="800" fill="${ink}">${esc(item.title)}</text>
  <text x="80" y="450" font-family="Arial,Helvetica,sans-serif" font-size="27" fill="${inkSoft}" opacity=".92">${esc(item.segment.replace(/-/g, " "))}</text>
  <text x="80" y="530" font-family="Arial,Helvetica,sans-serif" font-size="24" font-weight="700" letter-spacing="3" fill="${esc(accent)}">${esc(`${item.city} — ${item.state}`)}</text>
</svg>`);

  const out = resolve("public", `images/${slug}/hero-og.jpg`);
  const jpg = await sharp(bg)
    .composite([{ input: logo, top: 120, left: 80 }])
    .jpeg({ quality: 86, progressive: true })
    .toBuffer();
  await writeFile(out, jpg);
  await writeFile(
    resolve("public", `images/${slug}/social-source.svg`),
    `<!-- gerado por scripts/build-portfolio-brand-social.mjs a partir da marca autoral -->\n${bg.toString("utf8")}\n`,
  );

  const client = assets.clients?.[slug];
  if (client) {
    client.socialImage = `/images/${slug}/hero-og.jpg`;
    client.socialVersion = createHash("sha1").update(jpg).digest("hex").slice(0, 8);
  }
  done += 1;
  console.log(`  ✓ ${slug}`);
}

await writeFile(assetsPath, `${JSON.stringify(assets, null, 2)}\n`);
console.log(`[brand-social] ${done} imagem(ns) social(is) regenerada(s) a partir da marca autoral.`);

function isDark(hex) {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  return (r * 299 + g * 587 + b * 114) / 1000 < 140;
}
