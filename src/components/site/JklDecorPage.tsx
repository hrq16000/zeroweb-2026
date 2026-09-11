import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioBlueprintRenderer } from "@/components/portfolio/blueprint/PortfolioBlueprintRenderer";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import type { CtaRenderOptions, PortfolioBlueprint } from "@/lib/portfolio-blueprint";

/**
 * WORKBENCH de JKL Decor (/portfolio/jkl-decor) — Portfolio Blueprint.
 *
 * NÃO PUBLICAR enquanto o marcador CREATIVE_BRIEF_REQUIRED existir.
 *
 * Regras do pipeline (docs/PORTFOLIO_PROJECT_LIFECYCLE.md):
 *  - hero, ordem, variants, densidade, mídia e motion são ESCOLHA consciente;
 *    "hero split + offers grid + authority split + cta banner" é fallback
 *    técnico, não direção criativa;
 *  - nada de conteúdo inventado: sem avaliação, endereço, telefone, garantia,
 *    número de anos, equipe, certificação ou métrica sem fonte auditável;
 *  - todo contato comercial passa pelo funil `funnel-jkl-decor` (contactMode=funnelOnly).
 */
const SCAFFOLD_STATE = "CREATIVE_BRIEF_REQUIRED";

export const blueprint: PortfolioBlueprint = {
  slug: "jkl-decor",
  identity: { name: "JKL Decor" },
  theme: {},
  layout: {
    headerCtaLabel: "Solicitar orçamento",
    // TODO(autonomia §10): decidir explicitamente — { mode: "enabled", label: "<contextual>" }
    // ou { mode: "disabled", reason: "<razão editorial>" }. O destino é sempre o funil.
    floatingConversion: { mode: "disabled", reason: "SCAFFOLD: decisão pendente" },
  },
  sections: [
    {
      // TODO(direção criativa): escolher variant a partir do brief.
      type: "hero",
      variant: "editorial",
      order: 10,
      // TODO(direção criativa): definir gramática de motion própria do cliente.
      motion: { intensity: "SUBTLE", reveal: "up" },
      content: {
        eyebrow: SCAFFOLD_STATE,
        headline: "JKL Decor",
        subheadline:
          "Composição pendente: substituir por narrativa real do cliente depois de entity resolution, enrichment e media discovery.",
        ctaLabel: "Solicitar orçamento",
      },
    },
    {
      type: "cta",
      variant: "banner",
      order: 90,
      content: {
        title: "Pendente de direção criativa",
        text: "Preencher docs/portfolio/briefs/jkl-decor.md e o media plan antes de compor esta seção.",
        ctaLabel: "Solicitar orçamento",
      },
    },
  ],
  renderCta: ({ children, className, placement }: CtaRenderOptions) => (
    <FunnelCTAButton
      clientKey="jkl-decor"
      companySlug="jkl-decor"
      formSlug="funnel-jkl-decor"
      location={`jkl-decor_${placement}`}
      className={className}
    >
      {children}
    </FunnelCTAButton>
  ),
  afterContent: (
    <>
      <PortfolioHostCredit />
      <PortfolioUpsellPopup />
    </>
  ),
};

export function JklDecorPage() {
  return <PortfolioBlueprintRenderer blueprint={blueprint} />;
}
