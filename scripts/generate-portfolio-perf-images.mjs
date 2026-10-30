#!/usr/bin/env node
/**
 * Gera variantes WebP lossless para assets críticos de performance.
 *
 * As variantes ficam fora do Git e são reconstruídas antes do dev/build.
 * O modo lossless preserva os pixels para não mascarar o gate visual.
 */
import { copyFile, mkdir, stat, realpath } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve, sep } from "node:path";
import sharp from "sharp";
import { planNewPortfolioResponsiveMedia } from "./lib/portfolio-responsive-media.mjs";

const targets = [
  // SOS Presentes LCP: pixels originais preservados para evitar regressão visual.
  {
    source: "public/images/sos-presentes-cosmeticos/cesta-lilas.png",
    output: "public/images/_generated/sos-presentes-cosmeticos/cesta-lilas.webp",
  },
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
  // Foto LCP real da Lolipa: WebP lossless, pixels e dimensões verificados abaixo.
  // O PNG original permanece disponível para o administrador.
  {
    source: "public/images/lolipa-arte-em-festas/galeria-temas.png",
    output: "public/images/_generated/lolipa-arte-em-festas/galeria-temas.webp",
  },
  // Três imagens adicionais do mural: mantém pixels idênticos e rejeita saída maior.
  {
    source: "public/images/lolipa-arte-em-festas/decoracao-branca.png",
    output: "public/images/_generated/lolipa-arte-em-festas/decoracao-branca.webp",
  },
  {
    source: "public/images/lolipa-arte-em-festas/decoracao-colorida.png",
    output: "public/images/_generated/lolipa-arte-em-festas/decoracao-colorida.webp",
  },
  {
    source: "public/images/lolipa-arte-em-festas/decoracao-infantil.png",
    output: "public/images/_generated/lolipa-arte-em-festas/decoracao-infantil.webp",
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

// Fotos secundárias da SOS Presentes: alta qualidade, sem ampliar dimensões.
// O PNG de origem permanece intacto, e o build rejeita conversões sem ganho real.
for (const name of ["cestas-feliz-aniversario", "canecas-combo"]) {
  const source = resolve(`public/images/sos-presentes-cosmeticos/${name}.png`);
  const output = resolve(`public/images/_generated/sos-presentes-cosmeticos/${name}.webp`);
  await mkdir(dirname(output), { recursive: true });
  await sharp(source).webp({ quality: 92, effort: 6 }).toFile(output);
  const [before, after] = await Promise.all([stat(source), stat(output)]);
  const [original, optimized] = await Promise.all([
    sharp(source).metadata(),
    sharp(output).metadata(),
  ]);
  if (
    optimized.width !== original.width ||
    optimized.height !== original.height ||
    after.size >= before.size
  ) {
    throw new Error(`[portfolio-perf-images] SOS foto não otimizada: ${name}`);
  }
  console.log(`[portfolio-perf-images] SOS ${name}: ${before.size} -> ${after.size} bytes`);
}

// Alias byte a byte do logo D.Y.Z na pasta de derivados: evita alterar o inventário administrativo.
const dyzLogoAlias = resolve("public/images/_generated/dyzpromo/logo.webp");
await mkdir(dirname(dyzLogoAlias), { recursive: true });
await copyFile(resolve("public/images/dyzpromo/logo-dyz-promo.webp"), dyzLogoAlias);

const responsiveTargets = [
  // SOS Presentes: formatos 480/960px permitem downloads proporcionais ao viewport.
  {
    source: "public/images/sos-presentes-cosmeticos/cesta-lilas.png",
    width: 480,
    quality: 96, // Smaller responsive photo; the original full-size hero remains pixel-identical.
    output: "public/images/_generated/sos-presentes-cosmeticos/cesta-lilas-480.webp",
  },
  {
    source: "public/images/sos-presentes-cosmeticos/cesta-lilas.png",
    width: 960,
    quality: 96, // 960px lossless exceeded source bytes; preserve 1200px lossless fallback and enforce visual gate.
    output: "public/images/_generated/sos-presentes-cosmeticos/cesta-lilas-960.webp",
  },
  {
    source: "public/images/sos-presentes-cosmeticos/cestas-feliz-aniversario.png",
    width: 480,
    quality: 92,
    output: "public/images/_generated/sos-presentes-cosmeticos/cestas-feliz-aniversario-480.webp",
  },
  {
    source: "public/images/sos-presentes-cosmeticos/cestas-feliz-aniversario.png",
    width: 960,
    quality: 92,
    output: "public/images/_generated/sos-presentes-cosmeticos/cestas-feliz-aniversario-960.webp",
  },
  {
    source: "public/images/sos-presentes-cosmeticos/canecas-combo.png",
    width: 480,
    quality: 92,
    output: "public/images/_generated/sos-presentes-cosmeticos/canecas-combo-480.webp",
  },
  {
    source: "public/images/sos-presentes-cosmeticos/canecas-combo.png",
    width: 960,
    quality: 92,
    output: "public/images/_generated/sos-presentes-cosmeticos/canecas-combo-960.webp",
  },
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
  // O logo original do D.Y.Z permanece preservado; srcSet escolhe só o tamanho necessário.
  {
    source: "public/images/dyzpromo/logo-dyz-promo.webp",
    width: 260,
    output: "public/images/_generated/dyzpromo/logo-260.webp",
  },
  {
    source: "public/images/dyzpromo/logo-dyz-promo.webp",
    width: 390,
    output: "public/images/_generated/dyzpromo/logo-390.webp",
  },
  // Responsive sources from authentic images: never upscale or overwrite the originals.
  {
    source: "public/images/lolipa-arte-em-festas/galeria-temas.png",
    width: 480,
    quality: 92, // responsive photo: smaller download than the 960px variant
    output: "public/images/_generated/lolipa-arte-em-festas/galeria-temas-480.webp",
  },
  {
    source: "public/images/lolipa-arte-em-festas/galeria-temas.png",
    width: 960,
    quality: 92, // larger responsive photo: avoid lossless re-encoding larger than original
    output: "public/images/_generated/lolipa-arte-em-festas/galeria-temas-960.webp",
  },
  {
    source: "public/images/lolipa-arte-em-festas/decoracao-branca.png",
    width: 480,
    quality: 92, // responsive photo: smaller download than the 960px variant
    output: "public/images/_generated/lolipa-arte-em-festas/decoracao-branca-480.webp",
  },
  {
    source: "public/images/lolipa-arte-em-festas/decoracao-branca.png",
    width: 960,
    quality: 92, // larger responsive photo: avoid lossless re-encoding larger than original
    output: "public/images/_generated/lolipa-arte-em-festas/decoracao-branca-960.webp",
  },
  {
    source: "public/images/lolipa-arte-em-festas/decoracao-colorida.png",
    width: 480,
    quality: 92, // responsive photo: smaller download than the 960px variant
    output: "public/images/_generated/lolipa-arte-em-festas/decoracao-colorida-480.webp",
  },
  {
    source: "public/images/lolipa-arte-em-festas/decoracao-colorida.png",
    width: 960,
    quality: 92, // larger responsive photo: avoid lossless re-encoding larger than original
    output: "public/images/_generated/lolipa-arte-em-festas/decoracao-colorida-960.webp",
  },
  {
    source: "public/images/lolipa-arte-em-festas/decoracao-infantil.png",
    width: 480,
    quality: 92, // responsive photo: smaller download than the 960px variant
    output: "public/images/_generated/lolipa-arte-em-festas/decoracao-infantil-480.webp",
  },
  {
    source: "public/images/lolipa-arte-em-festas/decoracao-infantil.png",
    width: 960,
    quality: 92, // larger responsive photo: avoid lossless re-encoding larger than original
    output: "public/images/_generated/lolipa-arte-em-festas/decoracao-infantil-960.webp",
  },
];

for (const target of responsiveTargets) {
  const source = resolve(target.source);
  const output = resolve(target.output);
  await mkdir(dirname(output), { recursive: true });

  const before = (await stat(source)).size;
  const pipeline = sharp(source).resize({ width: target.width, withoutEnlargement: true });
  // At 960px, photo WebP lossless could be bigger than the source PNG.
  // Preserve the strict byte-saving gate; use existing quality-92 policy for large
  // responsive variants, and lossless for small variants and original-size images.
  await (target.quality
    ? pipeline.webp({ quality: target.quality, effort: 6 })
    : pipeline.webp({ lossless: true, effort: 6 })
  ).toFile(output);

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

// SOS Presentes: a variante móvel deve pesar menos que a desktop.
// Imagens reais e originais intocados; falhar se a conversão aumentar bytes.
for (const name of ["cesta-lilas", "cestas-feliz-aniversario", "canecas-combo"]) {
  const dir = "public/images/_generated/sos-presentes-cosmeticos";
  const mobile = (await stat(resolve(`${dir}/${name}-480.webp`))).size;
  const desktop = (await stat(resolve(`${dir}/${name}-960.webp`))).size;
  if (mobile >= desktop) {
    throw new Error(`[portfolio-perf-images] SOS mobile >= desktop: ${name} (${mobile} >= ${desktop})`);
  }
}

// Lolipa responsive variants must be ordered by size, not just by pixel width.
// A 480px lossless WebP previously outweighed its own quality-92 960px
// variant; that made srcSet serve MORE bytes on smaller screens.
// Keep the existing strict smaller-than-original guard and enforce 480 < 960.
for (const filename of ["galeria-temas", "decoracao-branca", "decoracao-colorida", "decoracao-infantil"]) {
  const dir = "public/images/_generated/lolipa-arte-em-festas";
  const smaller = (await stat(resolve(`${dir}/${filename}-480.webp`))).size;
  const larger = (await stat(resolve(`${dir}/${filename}-960.webp`))).size;
  if (smaller >= larger) {
    throw new Error(`[portfolio-perf-images] Lolipa responsive sizes out of order: ${filename} (${smaller} >= ${larger})`);
  }
}

// D.Y.Z: fotografias autênticas nos cards. Os JPEGs originais permanecem intactos
// para fallback e lightbox; versões WebP dimensionadas são usadas apenas no display.
// Limites de bytes, dimensões e ordenação mobile < desktop são obrigatórios.
const dyzGalleryImages = [
  "faixa-equipe",
  "cancela-mall",
  "cancela-shopping",
  "acao-semaforo",
  "entrega-residencial",
  "panfletagem-praca",
  "bandeira-centro"
];
for (const imageName of dyzGalleryImages) {
  const input = resolve(`public/images/dyzpromo/${imageName}.jpeg`);
  const base = resolve("public/images/_generated/dyzpromo");
  const originalSize = (await stat(input)).size;
  await mkdir(base, { recursive: true });
  // A foto vertical de 896px geraria mais bytes em WebP de 800px q92;
  // 640px preserva detalhe sem tornar a variante mais pesada que o JPEG.
  const upperWidth = ["acao-semaforo", "entrega-residencial", "bandeira-centro"].includes(imageName) ? 640 : 800;
  const converted = [];
  for (const width of [480, upperWidth]) {
    const output = resolve(`public/images/_generated/dyzpromo/${imageName}-${width}.webp`);
    await sharp(input).resize({ width, withoutEnlargement: true })
      .webp({ quality: 92, effort: 6 }).toFile(output);
    const meta = await sharp(output).metadata();
    const size = (await stat(output)).size;
    if (meta.width !== width || size >= originalSize) {
      throw new Error(`[portfolio-perf-images] D.Y.Z responsive invalid: ${imageName}-${width} (${originalSize} -> ${size})`);
    }
    converted.push(size);
    console.log(`[portfolio-perf-images] D.Y.Z ${imageName}-${width}.webp: ${originalSize} -> ${size} bytes`);
  }
  if (converted[0] >= converted[1]) {
    throw new Error(`[portfolio-perf-images] D.Y.Z mobile image is heavier: ${imageName} (${converted[0]} >= ${converted[1]})`);
  }
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
    // Nao seguir symlinks para fora da pasta do proprio cliente.
    const allowedRoot = await realpath(resolve(`public/images/${slug}`));
    const resolvedInput = await realpath(input);
    if (!resolvedInput.startsWith(allowedRoot + sep)) {
      throw new Error(`[portfolio-perf-images] asset fora da pasta do cliente: ${target.source}`);
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
