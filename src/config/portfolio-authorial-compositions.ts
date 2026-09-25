/**
 * Slugs que já possuem composição autoral própria em
 * src/components/portfolio/composition/registry.ts.
 *
 * Este arquivo é deliberadamente puro (sem React) para que os gates server-side
 * do Managed possam impedir READY/PUBLISH de um projeto novo enquanto ele ainda
 * depender do renderer genérico/preset.
 *
 * Ao promover um novo projeto Managed para composição autoral, adicione o slug
 * aqui NO MESMO PR que registra a página no registry de composições.
 */
export const PORTFOLIO_AUTHORIAL_COMPOSITION_SLUGS = [
  "arildo-madeiras",
  "autoescola-aptos",
  "adhonep-curitiba",
] as const;

const AUTHORIAL_SET = new Set<string>(PORTFOLIO_AUTHORIAL_COMPOSITION_SLUGS);

export function hasAuthorialPortfolioComposition(slug: string): boolean {
  return AUTHORIAL_SET.has(slug);
}
