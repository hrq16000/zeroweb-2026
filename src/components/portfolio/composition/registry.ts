/**
 * Registry das composições autorais (docs/PORTFOLIO_UNIQUE_COMPOSITION_STANDARD.md).
 *
 * Projetos novos entram AQUI, não no registry do Blueprint. Cada entrada é uma
 * página escrita à mão sobre `PortfolioCompositionRoot`: a plataforma só
 * resolve o slug, nunca a composição.
 */
import { lazy, type ComponentType, type LazyExoticComponent } from "react";

export const compositionPages: Record<string, LazyExoticComponent<ComponentType>> = {
  // "<slug>": lazy(() => import("@/components/site/<Componente>").then((m) => ({ default: m.<Componente> }))),
};

export const compositionSlugs = Object.keys(compositionPages);

export function getCompositionPage(slug: string): LazyExoticComponent<ComponentType> | undefined {
  return compositionPages[slug];
}

// `lazy` fica importado mesmo com o mapa vazio: o scaffold insere entradas aqui.
void lazy;
