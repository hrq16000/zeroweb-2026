#!/usr/bin/env node
/**
 * Gera as capas dedicadas do catálogo /portfolio a partir de assets próprios
 * de cada cliente (nunca de outro cliente, nunca de stock genérico).
 *
 * Entrada: src/config/portfolio-cover-plan.json
 *   { projects: { <slug>: { source, focal: {x,y}, issues[] } } }
 *
 * Saída: public/images/<slug>/capa-card.jpg  (1600x1000, proporção real do card)
 *
 * O recorte usa o focal point curado: a região de interesse é preservada em vez
 * do corte central cego que gerava rosto/objeto cortado.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PLAN_PATH = "src/config/portfolio-cover-plan.json";
const OUT_W = 1600;
const OUT_H = 1000; // 16:10 — proporção do card em /portfolio
const TARGET = OUT_W / OUT_H;

const plan = JSON.parse(fs.readFileSync(PLAN_PATH, "utf8"));
const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

const results = [];

for (const [slug, entry] of Object.entries(plan.projects)) {
  if (only.length && !only.includes(slug)) continue;
  const source = entry.source;
  if (!fs.existsSync(source)) {
    results.push({ slug, status: "SOURCE_MISSING", source });
    continue;
  }
  if (!source.startsWith(`public/images/${slug}/`)) {
    results.push({ slug, status: "SOURCE_FOREIGN", source });
    continue;
  }
  const mode = entry.mode === "frame" ? "frame" : "crop";
  const image = sharp(source, { failOn: "none" });
  const meta = await image.metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (!w || !h) {
    results.push({ slug, status: "SOURCE_UNREADABLE", source });
    continue;
  }

  const ratio = w / h;
  let cropW = w;
  let cropH = h;
  if (ratio > TARGET) cropW = Math.round(h * TARGET);
  else cropH = Math.round(w / TARGET);

  const fx = clamp(entry.focal?.x ?? 0.5, 0, 1);
  const fy = clamp(entry.focal?.y ?? 0.5, 0, 1);
  const left = Math.round(clamp(fx * w - cropW / 2, 0, w - cropW));
  const top = Math.round(clamp(fy * h - cropH / 2, 0, h - cropH));

  if (mode === "frame") {
    // Peças com texto (flyer, tabela de preços, marca) não podem ser recortadas:
    // a arte inteira é preservada sobre um fundo derivado dela mesma.
    const frameH = Math.min(OUT_H, Math.max(h, Math.round(w / TARGET)));
    const frameW = Math.round(frameH * TARGET);
    const outPathFrame = path.join("public/images", slug, "capa-card.jpg");
    const backdrop = await sharp(source, { failOn: "none" })
      .resize(frameW, frameH, { fit: "cover", position: "centre" })
      .blur(28)
      .modulate({ brightness: 0.72, saturation: 0.85 })
      .toBuffer();
    const inset = Math.round(frameH * 0.06);
    const art = await sharp(source, { failOn: "none" })
      .resize(frameW - inset * 2, frameH - inset * 2, { fit: "inside", withoutEnlargement: false, kernel: "lanczos3" })
      .toBuffer();
    await sharp(backdrop)
      .composite([{ input: art, gravity: "centre" }])
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(outPathFrame);
    results.push({
      slug,
      status: "OK",
      mode,
      source,
      out: `/images/${slug}/capa-card.jpg`,
      bytes: fs.statSync(outPathFrame).size,
      dimensions: `${frameW}x${frameH}`,
      lowRes: frameW < 900,
    });
    continue;
  }

  // Nunca faz upscale artificial: a saída é limitada pela resolução real do
  // recorte disponível no asset do cliente.
  const finalW = Math.min(OUT_W, cropW);
  const finalH = Math.round(finalW / TARGET);
  const outPath = path.join("public/images", slug, "capa-card.jpg");
  await sharp(source, { failOn: "none" })
    .extract({ left, top, width: cropW, height: cropH })
    .resize(finalW, finalH, { fit: "cover", kernel: "lanczos3" })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(outPath);

  const outMeta = await sharp(outPath).metadata();
  results.push({
    slug,
    status: "OK",
    mode,
    source,
    crop: { left, top, width: cropW, height: cropH },
    focal: { x: fx, y: fy },
    out: `/images/${slug}/capa-card.jpg`,
    bytes: fs.statSync(outPath).size,
    dimensions: `${outMeta.width}x${outMeta.height}`,
    lowRes: cropW < 900,
  });
}

const ok = results.filter((r) => r.status === "OK");
const failed = results.filter((r) => r.status !== "OK");
fs.mkdirSync("reports", { recursive: true });
fs.writeFileSync(
  "reports/portfolio-covers-build.json",
  `${JSON.stringify({ generatedAt: new Date().toISOString(), ok: ok.length, failed, results }, null, 2)}\n`,
);
console.log(`capas geradas: ${ok.length}/${results.length}`);
for (const f of failed) console.log(`  FALHA ${f.slug}: ${f.status} (${f.source})`);
const lowRes = ok.filter((r) => r.lowRes);
if (lowRes.length) {
  console.log("  resolução real insuficiente (asset do cliente precisa ser substituído):");
  for (const u of lowRes) console.log(`   - ${u.slug} · recorte ${u.crop.width}x${u.crop.height}`);
}
