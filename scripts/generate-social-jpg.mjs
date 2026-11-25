#!/usr/bin/env node
/** Gera versões JPEG 1200x630 das imagens sociais dos portfolios.
 *  WhatsApp/Facebook não renderizam WebP em link preview. */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const file = resolve("src/config/portfolio-assets.json");
const cfg = JSON.parse(readFileSync(file, "utf8"));
let changed = 0;
for (const [key, entry] of Object.entries(cfg.clients)) {
  const src = entry.socialImage;
  if (typeof src !== "string" || !src.startsWith("/images/")) continue;
  const jpgRel = src.endsWith(".jpg") ? src : src.replace(/\.[a-z0-9]+$/i, "-og.jpg");
  const srcPath = resolve("public", src.slice(1));
  const outPath = resolve("public", jpgRel.slice(1));
  if (!existsSync(outPath)) {
    if (!existsSync(srcPath)) { console.warn(`[social-jpg] fonte ausente: ${key} ${src}`); continue; }
    await sharp(srcPath)
      .resize(1200, 630, { fit: "cover", position: "centre" })
      .flatten({ background: "white" })
      .jpeg({ quality: 82, progressive: true })
      .toFile(outPath);
  }
  entry.socialImage = jpgRel;
  // Versão para cache-busting das prévias sociais (WhatsApp/Facebook/X).
  entry.socialVersion = createHash("sha1")
    .update(readFileSync(outPath))
    .digest("hex")
    .slice(0, 8);

  if (key === "maximos-cabeleireiros") {
    for (const width of [480, 768, 960]) {
      const variantPath = resolve("public", jpgRel.slice(1).replace(/\.jpg$/i, `-${width}.jpg`));
      await sharp(outPath)
        .resize({ width, withoutEnlargement: true })
        .jpeg({ quality: 82, progressive: true })
        .toFile(variantPath);
      const [sourceStat, variantStat] = await Promise.all([stat(outPath), stat(variantPath)]);
      if (variantStat.size >= sourceStat.size) {
        throw new Error(`[social-jpg] variante Maximos não reduziu bytes: ${width}px`);
      }
      console.log(`[social-jpg] Maximos ${width}px: ${sourceStat.size} -> ${variantStat.size} bytes`);
    }
  }

  changed++;
}
writeFileSync(file, `${JSON.stringify(cfg, null, 2)}\n`);
console.log(`[social-jpg] OK — ${changed} imagem(ns) social(is) em JPEG`);
