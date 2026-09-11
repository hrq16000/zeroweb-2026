/**
 * Contrato mínimo do Portfolio Blueprint (FASE 1).
 *
 * Objetivo: permitir que um `/portfolio/:slug` descreva **composição**
 * (quais seções existem, em que ordem, com qual variante e conteúdo) em vez de
 * ter a arquitetura da página escrita à mão em JSX.
 *
 * Regras:
 * - aditivo: projetos legados continuam pela cadeia atual de resolução;
 * - sem abstração excessiva: só o vocabulário necessário para provar o motor;
 * - identidade, textos, imagens e funil continuam 100% do cliente.
 */
import type { ComponentType, CSSProperties, ReactNode } from "react";

export type BlueprintMotionIntensity = "SUBTLE" | "BALANCED" | "EXPRESSIVE" | "IMMERSIVE";
export type BlueprintRevealVariant =
  | "fade"
  | "up"
  | "down"
  | "left"
  | "right"
  | "scale"
  | "mask";

export type BlueprintSectionMotion = {
  intensity?: BlueprintMotionIntensity;
  reveal?: BlueprintRevealVariant;
  /** Atraso incremental entre itens da seção, em ms. */
  stagger?: number;
  /**
   * Adendo de motion (docs/PORTFOLIO_LANDING_MOTION_ADDENDUM.md):
   * capacidades opt-in por seção. Ausente = seção estática, sem efeito.
   */
  /** Amplitude do parallax da mídia da seção, em px (desktop, sem reduced motion). */
  parallax?: number;
  /** Microinteração de card/linha ao hover. */
  hover?: "none" | "lift" | "glow";
  /** Progresso visual ligado ao scroll (ex.: linha do tempo preenchendo). */
  scrollProgress?: boolean;
};

/**
 * Motion profile do projeto — declaração consciente de movimento
 * (docs/PORTFOLIO_LANDING_MOTION_ADDENDUM.md §4). Cada projeto define o seu;
 * copiar o de outro cliente é reprovação de originalidade.
 */
export type BlueprintMotionProfile = {
  intensity: BlueprintMotionIntensity;
  /** Personalidade do movimento, em uma expressão própria do negócio. */
  personality: string;
  entrance: string[];
  scroll: string[];
  hover: string[];
  typography: string[];
  media: string[];
  transitions: string[];
  /** 1–3 movimentos assinatura, ligados ao negócio. */
  signatureEffects: string[];
  reducedMotionStrategy: string;
  /** Como o motion é simplificado no mobile (§12). */
  mobileStrategy?: string;
};

export type BlueprintIcon = ComponentType<{ className?: string }>;

export type BlueprintImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  managedField?: "logoUrl" | "heroImageUrl" | "socialImage";
};

export type BlueprintLink = { label: string; href: string };

/** Onde o CTA foi solicitado — o projeto decide o que renderizar. */
export type CtaPlacement =
  | "header"
  | "hero"
  | "offers"
  | "authority"
  | "proof"
  | "location"
  | "cta"
  | "faq"
  | "inline"
  /** Acesso persistente ao funil (adendo de autonomia §10). */
  | "floating";

export type CtaRenderOptions = {
  children: ReactNode;
  className?: string;
  placement: CtaPlacement;
};

/** O funil individual do projeto continua sendo do projeto. */
export type BlueprintCtaRenderer = (options: CtaRenderOptions) => ReactNode;

type SectionBase = {
  id?: string;
  order: number;
  enabled?: boolean;
  theme?: CSSProperties;
  motion?: BlueprintSectionMotion;
};

export type HeroSection = SectionBase & {
  type: "hero";
  variant: "split" | "fullBleed" | "editorial" | "asymmetric";
  content: {
    eyebrow?: string;
    headline: string;
    headlineField?: "heroHeadline" | "title";
    subheadline?: string;
    subheadlineField?: "heroSubheadline" | "description";
    image?: BlueprintImage;
    ctaLabel?: string;
    secondary?: BlueprintLink;
    highlights?: string[];
    stats?: { value: string; label: string }[];
  };
};

export type TrustSection = SectionBase & {
  type: "trust";
  variant: "bar" | "cards";
  content: {
    items: { title: string; text?: string; icon?: BlueprintIcon }[];
    note?: string;
  };
};

export type OfferItem = {
  title: string;
  text: string;
  icon?: BlueprintIcon;
  image?: BlueprintImage;
  meta?: string;
};

export type OffersSection = SectionBase & {
  type: "offers";
  variant: "grid" | "featured" | "alternating" | "list";
  content: {
    eyebrow?: string;
    title: string;
    intro?: string;
    items: OfferItem[];
    ctaLabel?: string;
  };
};

export type UseCasesSection = SectionBase & {
  type: "useCases";
  variant: "imageGrid" | "editorial";
  content: {
    eyebrow?: string;
    title: string;
    intro?: string;
    items: { title: string; text: string; image?: BlueprintImage }[];
    aside?: BlueprintImage;
  };
};

export type AuthoritySection = SectionBase & {
  type: "authority";
  variant: "split" | "media";
  content: {
    eyebrow?: string;
    title: string;
    paragraphs: string[];
    points?: { title: string; text: string; icon?: BlueprintIcon }[];
    image?: BlueprintImage;
    footnote?: string;
    ctaLabel?: string;
  };
};

export type CtaSection = SectionBase & {
  type: "cta";
  variant: "banner" | "immersive" | "panel";
  content: {
    eyebrow?: string;
    title: string;
    text?: string;
    ctaLabel: string;
    image?: BlueprintImage;
  };
};

export type FaqSection = SectionBase & {
  type: "faq";
  variant: "accordion";
  content: {
    eyebrow?: string;
    title: string;
    items: { q: string; a: string }[];
    ctaLabel?: string;
  };
};

/**
 * Prova social verificada.
 *
 * Aditiva: só existe quando o projeto tem avaliação pública com origem,
 * autoria e link auditáveis (ver PORTFOLIO_ENTITY_ENRICHMENT_STANDARD).
 * O renderer não inventa nota, contagem nem atribuição: tudo vem do conteúdo.
 */
export type ProofSection = SectionBase & {
  type: "proof";
  variant: "reviews";
  content: {
    eyebrow?: string;
    title: string;
    intro?: string;
    summary?: {
      value: string;
      count: string;
      label?: string;
      sourceLabel: string;
      sourceHref?: string;
    };
    items: {
      author: string;
      rating: number;
      text: string;
      date?: string;
      sourceLabel?: string;
      sourceHref?: string;
    }[];
    /** Atribuição obrigatória da origem (ex.: "Avaliações públicas no Google"). */
    attribution: string;
    ctaLabel?: string;
  };
};

/** Localização, horários e contato público do próprio cliente. */
export type LocationSection = SectionBase & {
  type: "location";
  variant: "panel";
  content: {
    eyebrow?: string;
    title: string;
    intro?: string;
    address: string[];
    hours: { days: string; hours: string }[];
    contact?: { label: string; value: string; href?: string }[];
    mapsLink?: BlueprintLink;
    image?: BlueprintImage;
    note?: string;
    ctaLabel?: string;
  };
};

/**
 * Faixa curta de sinais verificados logo no início da página
 * (docs/PORTFOLIO_LANDING_EXPERIENCE_ADDENDUM.md §4). Só existe quando cada
 * item tem evidência auditável — o renderer não calcula nem infere nada.
 */
export type SignalsSection = SectionBase & {
  type: "signals";
  variant: "strip";
  content: {
    items: {
      value: string;
      label: string;
      icon?: BlueprintIcon;
      /**
       * Número real e comprovado para contagem animada (adendo de motion §2).
       * `value` continua sendo o texto completo exibido sem JS.
       */
      countTo?: number;
      countPrefix?: string;
      countSuffix?: string;
    }[];
    attribution?: string;
  };
};

/**
 * Autoridade operacional antes da oferta (adendo §5): estrutura, marcas,
 * equipamentos, meios de pagamento, especialidades — sempre factual.
 */
export type CapabilitiesSection = SectionBase & {
  type: "capabilities";
  variant: "band";
  content: {
    eyebrow?: string;
    title: string;
    intro?: string;
    groups: { title: string; items: string[]; icon?: BlueprintIcon }[];
    image?: BlueprintImage;
    note?: string;
  };
};

/** Processo como narrativa (adendo §9), não como quatro cards iguais. */
export type ProcessSection = SectionBase & {
  type: "process";
  variant: "timeline";
  content: {
    eyebrow?: string;
    title: string;
    intro?: string;
    steps: { title: string; text: string; meta?: string }[];
    ctaLabel?: string;
    note?: string;
  };
};

export type BlueprintSection =
  | HeroSection
  | TrustSection
  | SignalsSection
  | CapabilitiesSection
  | ProcessSection
  | OffersSection
  | UseCasesSection
  | AuthoritySection
  | ProofSection
  | LocationSection
  | CtaSection
  | FaqSection;

export type BlueprintSectionType = BlueprintSection["type"];

/** Vocabulário implementado nesta fase — usado pelo renderer e pelo gate. */
export const BLUEPRINT_SECTION_VARIANTS = {
  hero: ["split", "fullBleed", "editorial", "asymmetric"],
  trust: ["bar", "cards"],
  signals: ["strip"],
  capabilities: ["band"],
  process: ["timeline"],
  offers: ["grid", "featured", "alternating", "list"],
  useCases: ["imageGrid", "editorial"],
  authority: ["split", "media"],
  proof: ["reviews"],
  location: ["panel"],
  cta: ["banner", "immersive", "panel"],
  faq: ["accordion"],
} as const satisfies Record<BlueprintSectionType, readonly string[]>;

export type PortfolioBlueprint = {
  slug: string;
  identity: {
    name: string;
    logo?: BlueprintImage;
    tagline?: string;
    nav?: BlueprintLink[];
    footerNote?: string;
  };
  /** Tokens locais do cliente (CSS custom properties). */
  theme: CSSProperties;
  /** Estratégia de movimento do projeto (adendo de motion §4). */
  motionProfile?: BlueprintMotionProfile;
  layout: {
    motionIntensity?: BlueprintMotionIntensity;
    /** Largura de leitura padrão das seções que não são full bleed. */
    maxWidth?: string;
    headerCtaLabel?: string;
    /**
     * Acesso persistente ao funil (adendo de autonomia §10–§13).
     * Decisão explícita: `enabled` com rótulo contextual ou desativado com
     * razão registrada. O destino é sempre o funil individual do projeto —
     * nunca telefone, WhatsApp ou link externo.
     */
    floatingConversion?:
      | { mode: "enabled"; label: string; hint?: string }
      | { mode: "disabled"; reason: string };
  };
  sections: BlueprintSection[];
  renderCta: BlueprintCtaRenderer;
  /** Slot livre no fim da página (crédito da hospedagem, pop-up, etc.). */
  afterContent?: ReactNode;
};

/** Gate mínimo: contrato renderizável e sem conflito de ordem. */
export function validatePortfolioBlueprint(blueprint: PortfolioBlueprint): string[] {
  const errors: string[] = [];
  const label = blueprint.slug || "(sem slug)";

  if (!blueprint.slug?.trim()) errors.push("blueprint sem slug");
  if (!blueprint.identity?.name?.trim()) errors.push(`${label}: identity.name ausente`);
  if (typeof blueprint.renderCta !== "function") errors.push(`${label}: renderCta ausente`);
  if (!Array.isArray(blueprint.sections) || blueprint.sections.length === 0) {
    errors.push(`${label}: nenhuma seção declarada`);
    return errors;
  }

  const active = blueprint.sections.filter((section) => section.enabled !== false);
  const orders = new Set<number>();

  for (const section of blueprint.sections) {
    const variants = BLUEPRINT_SECTION_VARIANTS[section.type as BlueprintSectionType] as
      | readonly string[]
      | undefined;
    if (!variants) {
      errors.push(`${label}: tipo de seção desconhecido (${String(section.type)})`);
      continue;
    }
    if (!variants.includes(section.variant)) {
      errors.push(`${label}: variante inválida ${section.type}.${section.variant}`);
    }
    if (typeof section.order !== "number" || Number.isNaN(section.order)) {
      errors.push(`${label}: seção ${section.type} sem order numérico`);
      continue;
    }
    if (orders.has(section.order)) {
      errors.push(`${label}: order duplicado (${section.order})`);
    }
    orders.add(section.order);
  }

  if (!active.some((section) => section.type === "hero")) {
    errors.push(`${label}: hero obrigatório ausente`);
  }
  const hasCta =
    active.some((section) => section.type === "cta") ||
    active.some(
      (section) =>
        (section.type === "hero" && Boolean(section.content.ctaLabel)) ||
        (section.type === "offers" && Boolean(section.content.ctaLabel)) ||
        (section.type === "authority" && Boolean(section.content.ctaLabel)),
    );
  if (!hasCta) errors.push(`${label}: nenhuma chamada de funil declarada`);

  return errors;
}
