/**
 * Registry dos projetos que já rodam pelo Portfolio Blueprint.
 *
 * Opt-in: um slug só entra aqui quando tem Blueprint próprio. Todos os demais
 * `/portfolio/:slug` continuam resolvendo pela cadeia legada, sem alteração.
 */
import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { PortfolioBlueprint } from "@/lib/portfolio-blueprint";

/** Módulos com o Blueprint estático — usados pelo gate de validação. */
export const blueprintModules: Record<string, () => Promise<{ blueprint: PortfolioBlueprint }>> = {
  "zz-pipeline-test": () => import("@/components/site/ZzPipelineTestPage"),
  "carecas-infotec": () => import("@/components/site/CarecasInfotecPage"),
};

/** Páginas renderizadas pelo motor de Blueprint (carregamento sob demanda). */
export const blueprintPages: Record<string, LazyExoticComponent<ComponentType>> = {
  "zz-pipeline-test": lazy(() =>
    import("@/components/site/ZzPipelineTestPage").then((m) => ({ default: m.ZzPipelineTestPage })),
  ),
  "carecas-infotec": lazy(() =>
    import("@/components/site/CarecasInfotecPage").then((m) => ({ default: m.CarecasInfotecPage })),
  ),
};

export const blueprintSlugs = Object.keys(blueprintModules);

export function getBlueprintPage(slug: string): LazyExoticComponent<ComponentType> | undefined {
  return blueprintPages[slug];
}
