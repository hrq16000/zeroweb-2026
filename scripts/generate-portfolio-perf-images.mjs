#!/usr/bin/env node
/**
 * Gera variantes WebP lossless para assets críticos de performance.
 *
 * As variantes ficam fora do Git e são reconstruídas antes do dev/build.
 * O modo lossless preserva os pixels para não mascarar o gate visual.
 */
import { mkdir, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const targets = [
  {
    source: "public/images/refrigeracao-maresia/logo.png",
    output: "public/images/_generated/refrigeracao-maresia/logo.webp",
  },
  {
    source: "public/images/refrigeracao-maresia/hero.png",
    output: "public/images/_generated/refrigeracao-maresia/hero.webp",
  },
  {
    source: "public/images/auto-socorro-dentinho/hero-v2.png",
    output: "public/images/_generated/auto-socorro-dentinho/hero.webp",
  },
  {
    source: "public/images/auto-socorro-dentinho/diagnostic-v2.png",
    output: "public/images/_generated/auto-socorro-dentinho/diagnostic.webp",
  },
];

for (const target of targets) {
  const source = resolve(target.source);
  const output = resolve(target.output);
  await mkdir(dirname(output), { recursive: true });

  const before = (await stat(source)).size;
  await sharp(source).webp({ lossless: true, effort: 6 }).toFile(output);
  const after = (await stat(output)).size;

  const sourceMeta = await sharp(source).metadata();
  const outputMeta = await sharp(output).metadata();
  if (sourceMeta.width !== outputMeta.width || sourceMeta.height !== outputMeta.height) {
    throw new Error(`[portfolio-perf-images] dimensões divergentes: ${target.source}`);
  }

  // PNGs transparentes podem carregar RGB invisível sob alpha=0. O que
  // precisa ser idêntico é o resultado realmente composto na página.
  const background = { r: 248, g: 251, b: 252 };
  const sourcePixels = await sharp(source).flatten({ background }).raw().toBuffer();
  const outputPixels = await sharp(output).flatten({ background }).raw().toBuffer();
  if (!sourcePixels.equals(outputPixels)) {
    throw new Error(
      `[portfolio-perf-images] variante alterou pixels visíveis: ${target.output}`,
    );
  }

  if (after >= before) {
    throw new Error(
      `[portfolio-perf-images] variante não reduziu bytes: ${target.source} (${before} → ${after})`,
    );
  }

  const saved = Math.round(((before - after) / before) * 100);
  console.log(
    `[portfolio-perf-images] ${target.source} → ${target.output} (${before} → ${after} bytes, -${saved}%)`,
  );
}

const responsiveTargets = [
  {
    source: "public/images/refrigeracao-maresia/logo.png",
    width: 130,
    output: "public/images/_generated/refrigeracao-maresia/logo-130.webp",
  },
  {
    source: "public/images/refrigeracao-maresia/logo.png",
    width: 260,
    output: "public/images/_generated/refrigeracao-maresia/logo-260.webp",
  },
  {
    source: "public/images/auto-socorro-dentinho/diagnostic-v2.png",
    width: 640,
    output: "public/images/_generated/auto-socorro-dentinho/diagnostic-640.webp",
  },
  {
    source: "public/images/auto-socorro-dentinho/diagnostic-v2.png",
    width: 960,
    output: "public/images/_generated/auto-socorro-dentinho/diagnostic-960.webp",
  },
  {
    source: "public/images/auto-socorro-dentinho/diagnostic-v2.png",
    width: 1672,
    output: "public/images/_generated/auto-socorro-dentinho/diagnostic-1672.webp",
  },
];

for (const target of responsiveTargets) {
  const source = resolve(target.source);
  const output = resolve(target.output);
  await mkdir(dirname(output), { recursive: true });

  const before = (await stat(source)).size;
  await sharp(source)
    .resize({ width: target.width, withoutEnlargement: true })
    .webp({ lossless: true, effort: 6 })
    .toFile(output);

  const meta = await sharp(output).metadata();
  if (meta.width !== target.width) {
    throw new Error(
      `[portfolio-perf-images] largura responsiva divergente: ${target.output} (${meta.width})`,
    );
  }

  const after = (await stat(output)).size;
  if (after >= before) {
    throw new Error(
      `[portfolio-perf-images] variante responsiva não reduziu bytes: ${target.output}`,
    );
  }

  const saved = Math.round(((before - after) / before) * 100);
  console.log(
    `[portfolio-perf-images] ${target.source} → ${target.output} (${before} → ${after} bytes, -${saved}%)`,
  );
}

console.log(
  `[portfolio-perf-images] OK — ${targets.length} lossless + ${responsiveTargets.length} responsiva(s) gerada(s)`,
);
