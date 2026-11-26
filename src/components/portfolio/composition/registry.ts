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
  "infinito-spa": lazy(() =>
    import("@/components/site/InfinitoSpaPage").then((m) => ({ default: m.InfinitoSpaPage })),
  ),
  "cantinho-da-tia-mari": lazy(() => import("@/components/site/CantinhoTiaMariPage").then((m) => ({default:m.CantinhoTiaMariPage}))),
  "agropet-filt": lazy(() => import("@/components/site/AgropetFiltPreviewPage").then((m) => ({ default: m.AgropetFiltPage }))),
  "arildo-madeiras": lazy(() =>
    import("@/components/site/ArildoMadeirasPage").then((m) => ({ default: m.ArildoMadeirasPage })),
  ),
  // Autorada e preparada, mas inacessível via /portfolio/:slug enquanto
  // não houver prototype publicado ou Managed PUBLISHED no loader.
  "dona-garimpeira-brecho": lazy(() =>
    import("@/components/site/DonaGarimpeiraBrechoPage").then((m) => ({ default: m.DonaGarimpeiraBrechoPage })),
  ),
  "autoescola-aptos": lazy(() =>
    import("@/components/site/AutoescolaAptosPage").then((m) => ({ default: ���q�^