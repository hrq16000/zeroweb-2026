import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioBlueprintRenderer } from "@/components/portfolio/blueprint/PortfolioBlueprintRenderer";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import type { CtaRenderOptions, PortfolioBlueprint } from "@/lib/portfolio-blueprint";

/**
 * WORKBENCH de Moreira Auto Mecânica (/portfolio/moreira-auto-mecanica) — Portfolio Blueprint.
 *
 * NÃO PUBLICAR enquanto o marcador CREATIVE_BRIEF_REQUIRED existir.
 *
 * Regras do pipeline (docs/PORTFOLIO_PROJECT_LIFECYCLE.md):
 *  - hero, ordem, variants, densidade, mídia e motion são ESCOLHA consciente;
 *    "hero split + offers grid + authority split + cta banner" é fallback
 *    técnico, não direção criativa;
 *  - nada de conteúdo inventado: sem avaliação, endereço, telefone, garantia,
 *    número de anos, equipe, certificação ou métrica sem fonte auditável;
 *  - todo contato comercial passa pelo funil `funnel-moreira-auto-mecanica` (contactMode=funnelOnly).
 */
const SCAFFOLD_STATE = "CREATIVE_BRIEF_REQUIRED";

export const blueprint: PortfolioBlueprint = {
  slug: "moreira-auto-mecanica",
  identity: { name: "Moreira Auto Mecânica" },
  theme: {},
  layout: { headerCtaLabel: "Agendar atendimento" },
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
        headline: "Moreira Auto Mecânica",
        subheadline:
          "Composição pendente: substituir por narrativa real do cliente depois de entity resolution, enrichment e media discovery.",
        ctaLabel: "Agendar atendimento",
      },
    },
    {
      type: "cta",
      variant: "banner",
      order: 90,
      content: {
        title: "Pendente de direção criativa",
        text: "Preencher docs/portfolio/briefs/moreira-auto-mecanica.md e o media plan antes de compor esta seção.",
        ctaLabel: "Agendar atendimento",
      },
    },
  ],
  renderCta: ({ children, className, placement }: CtaRenderOptions) => (
    <FunnelCTAButton
      clientKey="moreira-auto-mecanica"
      companySlug="moreira-auto-mecanica"
      formSlug="funnel-moreira-auto-mecanica"
      location={`moreira-auto-mecanica_${placement}`}
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

export function MoreiraAutoMecanicaPage() {
  return <PortfolioBlueprintRenderer blueprint={blueprint} />;
}
