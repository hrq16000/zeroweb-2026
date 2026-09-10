#!/usr/bin/env node
/**
 * Onda de otimização de imagens do /portfolio.
 * Preserva aparência: mesmas dimensões (ou downscale só acima de MAX_W),
 * mesmo caminho e mesmo formato. Recomprime PNG/JPEG pesados.
 * Uso: node scripts/optimize-images-wave.mjs --limit 40 [--dry] [--min 300]
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const args = process.argv.slice(2);
const getArg = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i === -1 ? d : args[i + 1];
};
const DRY = args.includes("--dry");
const LIMIT = Number(getArg("limit", 40));
const MIN_KB = Number(getArg("min", 300));
const MAX_W = Number(getArg("maxw", 1800));
const ROOT = "public/images";

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(png|jpe?g)$/i.test(e.name)) out.push(p);
  }
  return out;
}

const candidates = walk(ROOT)
  .map((p) => ({ p, size: fs.statSync(p).size }))
  .filter((f) => f.size >= MIN_KB * 1024)
  .sort((a, b) => b.size - a.size)
  .slice(0, LIMIT);

const results = [];
let before = 0;
let after = 0;

for (const file of candidates) {
  const isPng = /\.png$/i.test(file.p);
  const img = sharp(file.p, { failOn: "none" });
  const meta = await img.metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  const targetW = w > MAX_W ? MAX_W : w;
  const targetH = w > MAX_W ? Math.round((h * MAX_W) / w) : h;
  const pipeline = sharp(file.p, { failOn: "none" }).resize(
    targetW,
    targetH,
    { fit: "fill", kernel: "lanczos3" },
  );
  const buf = isPng
    ? await pipeline.png({ compressionLevel: 9, effort: 10, palette: true, quality: 90 }).toBuffer()
    : await pipeline.jpeg({ quality: 84, mozjpeg: true }).toBuffer();

  // Equivalência visual: MAE em miniatura 256px (grayscale).
  const thumb = async (input) =>
    sharp(input, { failOn: "none" }).resize(256, 256, { fit: "fill" }).greyscale().raw().toBuffer();
  const [a, b] = await Promise.all([thumb(file.p), thumb(buf)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff += Math.abs(a[i] - b[i]);
  const mae = diff / a.length;
  const visuallyEqual = mae <= 2;

  before += file.size;
  const gain = file.size - buf.length;
  const accept = visuallyEqual && gain > file.size * 0.05;
  if (accept && !DRY) fs.writeFileSync(file.p, buf);
  after += accept ? buf.length : file.size;
  results.push({
    file: file.p,
    from: file.size,
    to: gain > file.size * 0.05 ? buf.length : file.size,
    dimensions: `${w}x${h}`,
    outDimensions: `${targetW}x${targetH}`,
    mae: Number(mae.toFixed(3)),
    visuallyEqual,
    applied: accept && !DRY,
  });
}

fs.mkdirSync("reports", { recursive: true });
fs.writeFileSync(
  "reports/image-optimization-wave.json",
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      dryRun: DRY,
      minKb: MIN_KB,
      maxWidth: MAX_W,
      files: results.length,
      bytesBefore: before,
      bytesAfter: after,
      savedBytes: before - after,
      savedPercent: before ? Number((((before - after) / before) * 100).toFixed(1)) : 0,
      results,
    },
    null,
    2,
  )}\n`,
);
console.log(
  `imagens: ${results.length} · antes ${(before / 1048576).toFixed(1)}MB · depois ${(after / 1048576).toFixed(1)}MB · economia ${(((before - after) / before) * 100).toFixed(1)}%`,
);
