#!/usr/bin/env node
/** Gera versões JPEG 1200x630 das imagens sociais dos portfolios.
 *  WhatsApp/Facebook não renderizam WebP em link preview. */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
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
  // JPEG pode ser um derivado de SVG próprio versionado, com origem explícita.
  // Assim o arquivo binário não precisa ser editado a cada build.
  const sourceSvg = typeof entry.sourceSvg === "string" && entry.sourceSvg.startsWith("/images/")
    ? resolve("public", entry.sourceSvg.slice(1))
    : null;
  if (!existsSync(srcPath) && sourceSvg && existsSync(sourceSvg) && src.endsWith(".jpg")) {
    await sharp(sourceSvg)
      .resize(1200, 630, { fit: "cover", position: "centre" })
      .flatten({ background: "white" })
      .jpeg({ quality: 82, progressive: true })
      .toFile(srcPath);
  }
  if (!existsSync(outPath)) {
    if (!existsSync(srcPath)) { console.warn(`[social-jpg] fonte ausente: ${key} ${src}`); continue; }
    await sharp(srcPath)
      .resize(1200, 630, { fit: "cover", position: "centre" })
      .flatten({ background: "white" })
      .jpeg({ quality: 82, progressive: true })
      .toFile(outPath);
  }
  entry.socialImage = jpgRel;
  // Imagens derivadas de SVG são versionadas pela origem canônica, não
  // pelos bytes gerados por Sharp (que podem variar entre ambientes).
  entry.socialVersion = createHash("sha1")
    .update(readFileSync(sourceSvg && existsSync(sourceSvg) ? sourceSvg : outPath))
    .digest("hex")
    .slice(0, 8);
  changed++;
}
writeFileSync(file, `${JSON.stringify(cfg, null, 2)}\n`);
console.log(`[social-jpg] OK — ${changed} imagem(ns) social(is) em JPEG`);
