/**
 * Midias responsivas para novos /portfolio/:slug (contrato v4+).
 *
 * Apenas caminhos locais aprovados pelo plano de midia entram neste pipeline.
 * Os 90 legados e os seis gerenciados pre-v4 continuam no gerador historico.
 * Planejamento puro, sem I/O: usado pelo build e pelos testes.
 */
import { basename, extname } from "node:path";

const RASTER = /\.(?:png|jpe?g)$/i;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ROLES = new Set(["hero", "logo", "content"]);
const WIDTHS = Object.freeze({
  hero: [480, 960, 1440],
  logo: [128, 256],
  content: [480, 960],
});

function localSource(slug, value) {
  if (typeof value !== "string") throw new Error(`[${slug}] midia precisa de caminho local`);
  const source = value.startsWith("/images/") ? `public${value}` : value;
  const prefix = `public/images/${slug}/`;
  if (!source.startsWith(prefix) || !RASTER.test(source)) {
    throw new Error(`[${slug}] midia fora do diretorio do projeto ou nao raster: ${value}`);
  }
  const remainder = source.slice(prefix.length);
  if (!remainder || !/^[a-zA-Z0-9_./ -]+$/.test(remainder)
    || remainder.split("/").some((part) => part === "." || part === ".." || !part)) {
    throw new Error(`[${slug}] caminho de midia inseguro: ${value}`);
  }
  return source;
}

export function planNewPortfolioResponsiveMedia(slug, manifest, mediaPlan) {
  if (Number(manifest?.contractVersion ?? 0) < 4) return [];
  if (!SLUG.test(slug)) throw new Error(`slug invalido: ${slug}`);
  if (!mediaPlan || mediaPlan.slug !== slug) {
    throw new Error(`[${slug}] media plan ausente ou de outro portfolio`);
  }
  const entries = [];
  const hero = mediaPlan.heroMedia;
  const heroSource = typeof hero?.asset === "string" ? hero.asset : null;
  // Fotos remotas, SVGs e heros editoriais nao devem ser baixados nem
  // convertidos cegamente; a composicao visual permanece autoral.
  if (heroSource && !/^https?:\/\//i.test(heroSource) && RASTER.test(heroSource)
    && hero.status !== "unsuitable" && hero.approved === true) {
    entries.push({ source: heroSource, role: "hero" });
  }

  if (mediaPlan.performanceImages !== undefined && !Array.isArray(mediaPlan.performanceImages)) {
    throw new Error(`[${slug}] performanceImages precisa ser lista`);
  }
  for (const entry of mediaPlan.performanceImages ?? []) {
    if (!entry || !ROLES.has(entry.role)) {
      throw new Error(`[${slug}] performanceImages.role invalido (hero|logo|content)`);
    }
    if (entry.approved !== true) {
      throw new Error(`[${slug}] performanceImages exige aprovacao editorial explicita`);
    }
    entries.push(entry);
  }
  const targets = [];
  const outputs = new Map();
  for (const entry of entries) {
    const source = localSource(slug, entry.source);
    const stem = basename(source, extname(source));
    const output = `public/images/_generated/${slug}/${stem}.webp`;
    const widths = entry.widths ?? WIDTHS[entry.role];
    if (!Array.isArray(widths) || !widths.length
      || widths.length > 6 || widths.some((w) => !Number.isSafeInteger(w) || w < 64 || w > 2400)
      || widths.some((w, i) => i && w <= widths[i - 1])) {
      throw new Error(`[${slug}] widths invalidas para ${source}: inteiros crescentes entre 64 e 2400`);
    }
    if (outputs.has(output)) {
      if (outputs.get(output) === source) continue; // hero tambem declarado
      throw new Error(`[${slug}] duas imagens produziriam o mesmo WebP: ${output}`);
    }
    outputs.set(output, source);
    targets.push({
      slug, source, output, role: entry.role,
      widths, lossless: entry.role === "logo",
    });
  }
  return targets;
}
