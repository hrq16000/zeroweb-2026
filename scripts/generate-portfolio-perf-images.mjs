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

// Derivados da Moreira: o original continua versionado e intocado.
// A validação visual/Lighthouse do PR decide se a compressão da mídia de
// abertura preserva a composição sem perda perceptível.
const moreiraTargets = [
  {
    source: "public/images/moreira-auto-mecanica/logo.png",
    output: "public/images/_generated/moreira-auto-mecanica/logo-320.webp",
    width: 320,
    lossless: true,
  },
  {
    source: "public/images/moreira-auto-mecanica/google-oficina-coberta.jpg",
    output: "public/images/_generated/moreira-auto-mecanica/hero-1200.webp",
    width: 1200,
    lossless: false,
  },
];

for (const target of moreiraTargets) {
  const input = resolve(target.source);
  const output = resolve(target.output);
  await mkdir(dirname(output), { recursive: true });
  const before = (await stat(input)).size;
  const pipeline = sharp(input).resize({ width: target.width, withoutEnlargement: true });
  await (target.lossless
    ? pipeline.webp({ lossless: true, effort: 6 })
    : pipeline.webp({ quality: 92, effort: 6 })
  ).toFile(output);
  const metadata = await sharp(output).metadata();
  if (metadata.width !== target.width) {
    throw new Error(`[portfolio-perf-images] largura da Moreira divergente: ${target.output}`);
  }
  const after = (await stat(output)).size;
  if (after >= before) {
    throw new Error(`[portfolio-perf-images] asset Moreira não reduziu bytes: ${target.output}`);
  }
  console.log(`[portfolio-perf-images] ${target.source} -> ${target.output}: ${before} -> ${after} bytes`);
}

console.log(
  `[portfolio-perf-images] OK — ${targets.length} lossless + ${responsiveTargets.length} responsiva(s) gerada(s)`,
);
