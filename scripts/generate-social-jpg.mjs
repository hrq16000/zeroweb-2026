#!/usr/bin/env node
/** Gera versões JPEG 1200x630 das imagens sociais dos portfolios.
 *  WhatsApp/Facebook não renderizam WebP em link preview. */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const file = resolve("src/config/portfolio-assets.json");
const cfg = JSON.parse(readFileSync(file, "utf8"));
let changed = 0;
for (const [key, entry] of Object.entries(cfg.clients)) {
  const src = entry.socialImage;
  if (typeof src !== "string" || !src.startsWith("/images/") || src.endsWith(".jpg")) continue;
  const jpgRel = src.replace(/\.[a-z0-9]+$/i, "-og.jpg");
  const srcPath = resolve("public", src.slice(1));
  const outPath = resolve("public", jpgRel.slice(1));
  if (!existsSync(srcPath)) { console.warn(`[social-jpg] fonte ausente: ${key} ${src}`); continue; }
  if (!existsSync(outPath)) {
    execFileSync("magick", [srcPath, "-resize", "1200x630^", "-gravity", "center", "-extent", "1200x630", "-background", "white", "-flatten", "-quality", "82", outPath]);
  }
  entry.socialImage = jpgRel;
  changed++;
}
writeFileSync(file, `${JSON.stringify(cfg, null, 2)}\n`);
console.log(`[social-jpg] OK — ${changed} imagem(ns) social(is) em JPEG`);
