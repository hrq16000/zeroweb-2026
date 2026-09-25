/**
 * Registry das composições autorais (docs/PORTFOLIO_UNIQUE_COMPOSITION_STANDARD.md).
 *
 * Projetos novos entram AQUI, não no registry do Blueprint. Cada entrada é uma
 * página escrita à mão sobre `PortfolioCompositionRoot`: a plataforma só
 * resolve o slug, nunca a composição.
 */
import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import { PORTFOLIO_AUTHORIAL_COMPOSITION_SLUGS } from "@/config/portfolio-authorial-compositions";

export const compositionPages: Record<string, LazyExoticComponent<ComponentType>> = {
  "arildo-madeiras": lazy(() =>
    import("@/components/site/ArildoMadeirasPage").then((m) => ({ default: m.ArildoMadeirasPage })),
  ),
  "autoescola-aptos": lazy(() =>
    import("@/components/site/AutoescolaAptosPage").then((m) => ({ default: m.AutoescolaAptosPage })),
  ),
  "adhonep-curitiba": lazy(() =>
    import("@/components/site/AdhonepCuritibaPage").then((m) => ({ default: m.AdhonepCuritibaPage })),
  ),
  // "<slug>": lazy(() => import("@/components/site/<Componente>").then((m) => ({ default: m.<Componente> }))),
};

export const compositionSlugs = Object.keys(compositionPages);

const declaredAuthorial = [...PORTFOLIO_AUTHORIAL_COMPOSITION_SLUGS].sort();
const registeredAuthorial = [...compositionSlugs].sort();
if (declaredAuthorial.join("|") !== registeredAuthorial.join("|")) {
  throw new Error(
    "[portfolio-composition] registry visual e contrato server-side divergiram. " +
      "Atualize portfolio-authorial-compositions.ts e composition/registry.ts no mesmo PR.",
  );
}

export function getCompositionPage(slug: string): LazyExoticComponent<ComponentType> | undefined {
  return compositionPages[slug];
}

// `lazy` fica importado mesmo com o mapa vazio: o scaffold insere entradas aqui.
void lazy;
