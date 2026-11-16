/**
 * Portão estático para impedir que um novo site v4 entre no sitemap antes
 * de ter evidência editorial real de publicação e indexabilidade.
 *
 * A rota sitemap-portfolio.xml agrega APPROVED_STATUSES do catálogo e o
 * site registry: um status "approved" já expõe uma URL ao rastreamento.
 * A publicação não pode ser sinalizada só por um dos arquivos.
 *
 * Não altera os 90 legados, os seis gerenciados anteriores ao v4, o sitemap
 * dinâmico ou overrides publicados pelo painel.
 */
const PUBLIC_SITEMAP_STATES = new Set(["approved", "published"]);

export function prototypeEntries(registrySource) {
  const anchor = "export const PORTFOLIO_PROTOTYPES";
  const block = typeof registrySource === "string" ? registrySource.split(anchor)[1]?.split("];")[0] : "";
  if (!block) return null;
  const entries = new Map();
  for (const [, fields] of block.matchAll(/\{([^{}]*)\}/gs)) {
    const slug = fields.match(/\bslug\s*:\s*(["'])([^"']+)\1/)?.[2];
    if (!slug) continue;
    const published = fields.match(/\bindexable\s*:\s*(true|false)\b/)?.[1];
    if (entries.has(slug)) {
      entries.set(slug, { ambiguous: true });
    } else {
      entries.set(slug, { indexable: published === "true", declared: Boolean(published) });
    }
  }
  return entries;
}

export function checkNewPortfolioPublication(slug, manifest, catalogItem, registrySource, sharedRoute = true) {
  if (Number(manifest?.contractVersion ?? 0) < 4) return [];

  const errors = [];
  const label = `[${slug}] PORTFOLIO_INDEXABILITY_GATE`;
  const stagePublished = manifest?.stage === "published";
  const catalogExposes = PUBLIC_SITEMAP_STATES.has(catalogItem?.status) && catalogItem?.live !== false;
  const catalogApproved = PUBLIC_SITEMAP_STATES.has(catalogItem?.status);

  // O catálogo usa status=approved/published como sinal para o sitemap,
  // mesmo quando a entrada no registry declara indexable=false.
  if (catalogExposes && !stagePublished) {
    errors.push(`${label}: catálogo permite sitemap mas manifesto ainda nao esta published`);
  }
  if (!stagePublished) return errors;

  if (!catalogApproved || catalogItem?.live === false) {
    errors.push(`${label}: manifesto published sem catalogo publicado e live=true`);
  }
  if (manifest?.individualSiteContract?.gates?.PORTFOLIO_INDEXABILITY_GATE !== "complete") {
    errors.push(`${label}: indexabilidade nao comprovada no contrato individual`);
  }
  const evidence = manifest?.individualSiteContract?.evidence?.PORTFOLIO_INDEXABILITY_GATE;
  if (!Array.isArray(evidence) || !evidence.length || evidence.some((item) => typeof item !== "string" || !item.trim())) {
    errors.push(`${label}: falta evidencia rastreavel para indexabilidade`);
  }

  if (sharedRoute) {
    const entries = prototypeEntries(registrySource);
    const entry = entries?.get(slug);
    if (!entries || !entry) {
      errors.push(`${label}: rota compartilhada nao registrada em PORTFOLIO_PROTOTYPES`);
    } else if (entry.ambiguous || !entry.declared || !entry.indexable) {
      errors.push(`${label}: registro ausente/ambiguo ou indexable=false; publicado exige indexable=true`);
    }
  }
  return errors;
}
