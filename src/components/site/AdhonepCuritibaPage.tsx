import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioCompositionRoot } from "@/components/portfolio/composition/PortfolioCompositionRoot";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import {
  COMPOSITION_BRIEF_REQUIRED,
  type CtaRenderOptions,
  type PortfolioComposition,
} from "@/lib/portfolio-composition";

/**
 * WORKBENCH de ADHONEP Curitiba (/portfolio/adhonep-curitiba) — PROJECT COMPOSITION.
 *
 * NÃO PUBLICAR enquanto o marcador COMPOSITION_BRIEF_REQUIRED existir.
 *
 * Regras (docs/PORTFOLIO_UNIQUE_COMPOSITION_STANDARD.md):
 *  - não existe esqueleto de portfólio: header, hero, grid, ordem e
 *    encerramento são decisões autorais deste cliente;
 *  - Careca's, Moreira e JKL são pilotos funcionais, NÃO referência visual;
 *  - preencher docs/portfolio/briefs/adhonep-curitiba.md (13 campos) ANTES de escrever qualquer JSX;
 *  - nada inventado: sem avaliação, endereço, telefone, garantia, métrica ou
 *    certificação sem fonte auditável;
 *  - todo contato passa pelo funil `funnel-adhonep-curitiba` (contactMode=funnelOnly).
 */
export const SCAFFOLD_STATE = COMPOSITION_BRIEF_REQUIRED;

export const composition: PortfolioComposition = {
  slug: "adhonep-curitiba",
  theme: {}, // tokens do cliente, definidos pela identidade real
  // TODO(brief): motionIntensity é consequência da narrativa, não default.
  renderCta: ({ children, className, placement }: CtaRenderOptions) => (
    <FunnelCTAButton
      clientKey="adhonep-curitiba"
      companySlug="adhonep-curitiba"
      formSlug="funnel-adhonep-curitiba"
      location={`adhonep-curitiba_${placement}`}
      className={className}
    >
      {children}
    </FunnelCTAButton>
  ),
  // Camada institucional 0WEB: host credit aqui, popup pelo shell compartilhado.
  afterContent: <PortfolioHostCredit />,
  brief: {
    businessPersonality: "[PREENCHER]",
    creativeConcept: "[PREENCHER]",
    visualMetaphor: "[PREENCHER]",
    spatialLanguage: "[PREENCHER]",
    heroConcept: "[PREENCHER]",
    navigationConcept: "[PREENCHER]",
    contentRhythm: "[PREENCHER]",
    mediaNarrative: "[PREENCHER]",
    proofNarrative: "[PREENCHER]",
    conversionNarrative: "[PREENCHER]",
    motionNarrative: "[PREENCHER]",
    signatureMoments: ["[PREENCHER]"],
    compositionFingerprint: {
      heroGeometry: "[PREENCHER]",
      headerTreatment: "[PREENCHER]",
      sectionGraph: "[PREENCHER]",
      contentOrder: ["[PREENCHER]"],
      gridTopology: "[PREENCHER]",
      mediaDistribution: "[PREENCHER]",
      backgroundRhythm: "[PREENCHER]",
      proofPlacement: "[PREENCHER]",
      ctaDistribution: "[PREENCHER]",
      navigationPattern: "[PREENCHER]",
      motionSignature: "[PREENCHER]",
      closingStructure: "[PREENCHER]",
    },
  },
};

export function AdhonepCuritibaPage() {
  // A composição abaixo é INTENCIONALMENTE vazia: escrever o JSX autoral do
  // cliente aqui, derivado do brief. Copiar a estrutura de outro projeto
  // reprova no PROJECT_UNIQUENESS_GATE.
  return (
    <PortfolioCompositionRoot composition={composition}>
      <main data-scaffold-state={SCAFFOLD_STATE} className="px-6 py-24">
        <h1 className="text-3xl font-black">ADHONEP Curitiba</h1>
        <p className="mt-4 max-w-prose text-muted-foreground">
          Composição pendente. Preencher o Creative Composition Brief
          (docs/portfolio/briefs/adhonep-curitiba.md) e então compor a página. Segmento declarado:
          associacao.
        </p>
      </main>
    </PortfolioCompositionRoot>
  );
}
