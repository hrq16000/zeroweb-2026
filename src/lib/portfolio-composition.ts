/**
 * PROJECT COMPOSITION — docs/PORTFOLIO_UNIQUE_COMPOSITION_STANDARD.md
 *
 * Camada autoral de cada `/portfolio/:slug`. Aqui NÃO existe vocabulário de
 * seções, ordem canônica, header padrão nem grid compartilhado: o JSX da
 * página é escrito pelo projeto. Este módulo define apenas o contrato de
 * infraestrutura (motion, tema, funil, camada institucional) e os tipos do
 * Creative Composition Brief e do Composition Fingerprint usados pelo
 * PROJECT_UNIQUENESS_GATE.
 */
import type { CSSProperties, ReactNode } from "react";
import type { BlueprintMotionIntensity, CtaRenderOptions } from "./portfolio-blueprint";

/** Brief obrigatório antes de escrever qualquer JSX do projeto (§6 da norma). */
export type CreativeCompositionBrief = {
  businessPersonality: string;
  creativeConcept: string;
  visualMetaphor: string;
  spatialLanguage: string;
  heroConcept: string;
  navigationConcept: string;
  contentRhythm: string;
  mediaNarrative: string;
  proofNarrative: string;
  conversionNarrative: string;
  motionNarrative: string;
  /** 1..n momentos assinatura derivados do negócio — não de uma lista fechada. */
  signatureMoments: string[];
  compositionFingerprint: CompositionFingerprint;
};

/**
 * Fingerprint de composição (§10). Strings livres e descritivas: não são um
 * enum de layouts, e sim a descrição da composição real daquele projeto,
 * comparada contra os projetos recentes pelo gate.
 */
export type CompositionFingerprint = {
  heroGeometry: string;
  headerTreatment: string;
  /** Grafo de regiões da página, ex.: "overlap(stage→index)→split-sticky→band". */
  sectionGraph: string;
  contentOrder: string[];
  gridTopology: string;
  mediaDistribution: string;
  backgroundRhythm: string;
  proofPlacement: string;
  ctaDistribution: string;
  navigationPattern: string;
  motionSignature: string;
  closingStructure: string;
};

/** Contrato de infraestrutura entregue à composição autoral. */
export type PortfolioComposition = {
  slug: string;
  /** Tokens do cliente (CSS custom properties) aplicados na raiz. */
  theme?: CSSProperties;
  motionIntensity?: BlueprintMotionIntensity;
  /** Único caminho de contato: sempre o funil do projeto. */
  renderCta: (options: CtaRenderOptions) => ReactNode;
  /** Camada institucional 0WEB (host credit); popup vem do shell compartilhado. */
  afterContent?: ReactNode;
  brief: CreativeCompositionBrief;
};

export const COMPOSITION_CONTRACT_VERSION = 1;

/** Marcador de projeto sem direção criativa — bloqueia READY e publicação. */
export const COMPOSITION_BRIEF_REQUIRED = "COMPOSITION_BRIEF_REQUIRED";

export function isCompositionBriefComplete(brief: CreativeCompositionBrief): boolean {
  const values: unknown[] = [
    brief.businessPersonality,
    brief.creativeConcept,
    brief.visualMetaphor,
    brief.spatialLanguage,
    brief.heroConcept,
    brief.navigationConcept,
    brief.contentRhythm,
    brief.mediaNarrative,
    brief.proofNarrative,
    brief.conversionNarrative,
    brief.motionNarrative,
    ...brief.signatureMoments,
    ...Object.values(brief.compositionFingerprint).flat(),
  ];
  return values.every(
    (value) =>
      typeof value === "string" &&
      value.trim().length > 0 &&
      !value.includes("[PREENCHER]") &&
      !value.includes(COMPOSITION_BRIEF_REQUIRED),
  );
}
