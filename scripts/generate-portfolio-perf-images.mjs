#!/usr/bin/env node
/**
 * Gera variantes WebP lossless para assets críticos de performance.
 *
 * As variantes ficam fora do Git e são reconstruídas antes do dev/build.
 * O modo lossless preserva os pixels para não mascarar o gate visual.
 */
import { mkdir, stat } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import sharp from "sharp";
import { planNewPortfolioResponsiveMedia } from "./lib/portfolio-responsive-media.mjs";

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
    source: "public/images/moreira-auto-mecanica/google-mecanico-atendimento.jpg",
    output: "public/images/_generated/moreira-auto-mecanica/google-mecanico-atendimento-800.webp",
    width: 800,
    lossless: false,
  },
  {
    source: "public/images/moreira-auto-mecanica/google-motor-aberto.jpg",
    output: "public/images/_generated/moreira-auto-mecanica/google-motor-aberto-1200.webp",
    width: 1200,
    lossless: false,
  },
  {
    source: "public/images/moreira-auto-mecanica/google-fachada.jpg",
    output: "public/images/_generated/moreira-auto-mecanica/google-fachada-960.webp",
    width: 960,
    lossless: false,
  },
  {
    source: "public/images/moreira-auto-mecanica/logo.png",
    output: "public/images/_generated/moreira-auto-mecanica/logo-264.webp",
    width: 264,
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


// NOVOS PORTFOLIOS (contrato v4+): descobre as imagens exclusivamente pelo
// media plan de cada projeto, sem adicionar manualmente novos slugs a esta lista.
// Os antigos targets acima seguem intactos para preservar visual e LCP legados.
const managedProjects = JSON.parse(
  readFileSync(resolve("src/config/portfolio-project-manifests.json"), "utf8"),
).projects ?? {};
let automaticCount = 0;
for (const [slug, manifest] of Object.entries(managedProjects)) {
  if (Number(manifest?.contractVersion ?? 0) < 4) continue;
  const planFile = resolve(`docs/portfolio/media-plans/${slug}.json`);
  if (!existsSync(planFile)) {
    throw new Error(`[portfolio-perf-images] media plan ausente para novo portfolio: ${slug}`);
  }
  const plan = JSON.parse(readFileSync(planFile, "utf8"));
  for (const target of planNewPortfolioResponsiveMedia(slug, manifest, plan)) {
    const input = resolve(target.source);
    if (!existsSync(input)) {
      throw new Error(`[portfolio-perf-images] imagem declarada nao existe: ${target.source}`);
    }
    const { width: originalWidth, height: originalHeight } = await sharp(input).metadata();
    if (!originalWidth || !originalHeight) {
      throw new Error(`[portfolio-perf-images] dimensoes ausentes: ${target.source}`);
    }
    const before = (await stat(input)).size;
    const convert = (source) =>
      target.lossless
        ? source.webp({ lossless: true, effort: 6 })
        : source.webp({ quality: 92, effort: 6 });
    await mkdir(dirname(resolve(target.output)), { recursive: true });
    await convert(sharp(input)).toFile(resolve(target.output));
    const baseMeta = await sharp(resolve(target.output)).metadata();
    const baseSize = (await stat(resolve(target.output))).size;
    if (baseMeta.width !== originalWidth || baseMeta.height !== originalHeight || baseSize >= before) {
      throw new Error(
        `[portfolio-perf-images] variante base nao melhorou mantendo dimensoes: ${target.source} (${before} -> ${baseSize})`,
      );
    }
    if (target.lossless) {
      // Mesma comprovacao de pixels visiveis ja exigida dos logos legados.
      const background = { r: 248, g: 251, b: 252 };
      const beforePixels = await sharp(input).flatten({ background }).raw().toBuffer();
      const afterPixels = await sharp(resolve(target.output)).flatten({ background }).raw().toBuffer();
      if (!beforePixels.equals(afterPixels)) {
        throw new Error(`[portfolio-perf-images] logo lossless mudou pixels: ${target.source}`);
      }
    }
    const builtWidths = [];
    for (const width of target.widths) {
      // Nunca aumentar uma imagem pequena: a lista resultante orienta o srcSet.
      if (width > originalWidth) continue;
      const output = target.output.replace(/\.webp$/, `-${width}.webp`);
      await convert(sharp(input).resize({ width, withoutEnlargement: true })).toFile(resolve(output));
      const meta = await sharp(resolve(output)).metadata();
      const size = (await stat(resolve(output))).size;
      if (meta.width !== width || size >= before) {
        throw new Error(`[portfolio-perf-images] variante responsiva invalida: ${output}`);
      }
      builtWidths.push(width);
    }
    // Os originais permanecem inalterados; a pagina pode usar PortfolioImage
    // com src=base .webp e widths exatamente iguais aos gerados no log.
    console.log(
      `[portfolio-perf-images] auto ${slug}: ${target.source} -> ${target.output} ` +
      `(${before} -> ${baseSize} bytes; widths=${builtWidths.join(",") || "none"})`,
    );
    automaticCount += 1;
  }
}
console.log(`[portfolio-perf-images] novos portfolios: ${automaticCount} imagem(ns) aprovada(s) convertida(s)`);
