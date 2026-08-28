#!/usr/bin/env node
/** Gera variantes WebP dos assets de portfolio acima do budget, sem apagar originais. */
import { readdir, stat, mkdir } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

const root = join(process.cwd(), "public", "images");
const threshold = 300_000;
const extensions = new Set([".png", ".jpg", ".jpeg"]);
const generated = [];

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (extensions.has(extname(entry.name).toLowerCase())) {
      const info = await stat(path);
      if (info.size < threshold) continue;
      const out = join(dir, `${basename(entry.name, extname(entry.name))}.webp`);
      await sharp(path).webp({ quality: 78, effort: 5 }).toFile(out);
      const outSize = (await stat(out)).size;
      generated.push({ source: path, output: out, before: info.size, after: outSize });
    }
  }
}

await mkdir(root, { recursive: true });
await walk(root);
for (const item of generated) {
  console.log(`[portfolio-images] ${item.source} → ${item.output} (${item.before} → ${item.after} bytes)`);
}
console.log(`[portfolio-images] ${generated.length} variante(s) WebP gerada(s)`);
