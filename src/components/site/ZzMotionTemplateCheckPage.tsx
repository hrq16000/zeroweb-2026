import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioBlueprintRenderer } from "@/components/portfolio/blueprint/PortfolioBlueprintRenderer";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import type { CtaRenderOptions, PortfolioBlueprint } from "@/lib/portfolio-blueprint";

/**
 * WORKBENCH de ZZ Template Check (/portfolio/zz-motion-template-check) — Portfolio Blueprint.
 *
 * NÃO PUBLICAR enquanto o marcador CREATIVE_BRIEF_REQUIRED existir.
 *
 * Regras do pipeline (docs/PORTFOLIO_PROJECT_LIFECYCLE.md):
 *  - hero, ordem, variants, densidade, mídia e motion são ESCOLHA consciente;
 *    "hero split + offers grid + authority split + cta banner" é fallback
 *    técnico, não direção criativa;
 *  - nada de conteúdo inventado: sem avaliação, endereço, telefone, garantia,
 *    número de anos, equipe, certificação ou métrica sem fonte auditável;
 *  - todo contato comercial passa pelo funil `funnel-zz-motion-template-check` (contactMode=funnelOnly).
 */
export const SCAFFOLD_STATE = "CREATIVE_BRIEF_REQUIRED";

export const blueprint: PortfolioBlueprint = {
  slug: "zz-motion-template-check",
  identity: { name: "ZZ Template Check" },
  theme: {},
  layout: {
    headerCtaLabel: "Solicitar orçamento",
    floatingConversion: { mode: "enabled", label: "Solicitar orçamento", hint: "TODO: contexto curto" },
  },
  sections: [
    {
      // Primeira dobra com mídia real e profundidade contida no desktop.
      // TODO(direção criativa): variant e ordem são ESCOLHA — revise a partir do brief.
      type: "hero",
      variant: "fullBleed",
      order: 10,
      motion: {reveal: "mask",parallax: 28},
      content: {
        eyebrow: "Marcenaria · Teste",
        headline: "ZZ Template Check",
        subheadline:
          "TODO: narrativa real do cliente, escrita após entity resolution e enrichment.",
        image: {
          src: "/images/zz-motion-template-check/hero.jpg",
          // TODO(media plan): alt descritivo do que a foto REALMENTE mostra.
          alt: "TODO: descrever a foto real de ZZ Template Check",
          width: 1600,
          height: 1200,
          priority: true,
        },
        ctaLabel: "Solicitar orçamento",
      },
    },
    {
      // Faixa curta de números VERIFICÁVEIS; a contagem animada só é permitida sobre fato auditável.
      // TODO(direção criativa): variant e ordem são ESCOLHA — revise a partir do brief.
      type: "signals",
      variant: "strip",
      order: 15,
      motion: {reveal: "up",stagger: 70},
      content: {
        // A contagem animada SÓ pode existir sobre fato auditável (ficha
        // pública, documento ou material oficial). Sem fonte, remova o countTo.
        items: [
          { value: "TODO", label: "TODO: sinal verificado", countTo: 0 },
        ],
        attribution: "TODO: fonte e data da coleta.",
      },
    },
    {
      // Banda de autoridade operacional com resposta ao ponteiro.
      // TODO(direção criativa): variant e ordem são ESCOLHA — revise a partir do brief.
      type: "capabilities",
      variant: "band",
      order: 30,
      motion: {reveal: "up",stagger: 70,hover: "glow"},
      content: {
        title: "TODO: título real desta seção",
        intro: "TODO: conteúdo real — sem prova, número ou prazo sem fonte.",
        groups: [
          { title: "TODO: eixo real", items: ["TODO: capacidade verificada"] },
        ],
      },
    },
    {
      // Grade de mídia real com lift e zoom contido.
      // TODO(direção criativa): variant e ordem são ESCOLHA — revise a partir do brief.
      type: "useCases",
      variant: "imageGrid",
      order: 40,
      motion: {reveal: "up",stagger: 90,hover: "lift"},
      content: {
        title: "TODO: título real desta seção",
        intro: "TODO: conteúdo real — sem prova, número ou prazo sem fonte.",
        items: [
          {
            title: "TODO: caso real",
            text: "TODO: descrever o que foi feito, sem inventar resultado.",
          },
        ],
      },
    },
    {
      // Roteiro do atendimento com progresso preenchido pelo scroll.
      // TODO(direção criativa): variant e ordem são ESCOLHA — revise a partir do brief.
      type: "process",
      variant: "timeline",
      order: 50,
      motion: {reveal: "up",stagger: 70,scrollProgress: true},
      content: {
        title: "TODO: título real desta seção",
        intro: "TODO: conteúdo real — sem prova, número ou prazo sem fonte.",
        steps: [
          { title: "TODO: etapa 1", text: "TODO: como o atendimento começa.", meta: "01" },
        ],
      },
    },
    {
      // Fechamento sempre pelo funil individual do cliente.
      // TODO(direção criativa): variant e ordem são ESCOLHA — revise a partir do brief.
      type: "cta",
      variant: "immersive",
      order: 60,
      motion: {reveal: "scale"},
      content: {
        title: "TODO: fechamento próprio do cliente",
        text: "Toda conversão passa pelo funil funnel-zz-motion-template-check.",
        ctaLabel: "Solicitar orçamento",
      },
    },
  ],
  renderCta: ({ children, className, placement }: CtaRenderOptions) => (
    <FunnelCTAButton
      clientKey="zz-motion-template-check"
      companySlug="zz-motion-template-check"
      formSlug="funnel-zz-motion-template-check"
      location={`zz-motion-template-check_${placement}`}
      className={className}
    >
      {children}
    </FunnelCTAButton>
  ),
  // A captação da 0WEB é camada da hospedagem (PortfolioStandardShell):
  // nenhuma landing monta o pop-up manualmente.
  afterContent: <PortfolioHostCredit />,
};

export function ZzMotionTemplateCheckPage() {
  return <PortfolioBlueprintRenderer blueprint={blueprint} />;
}
