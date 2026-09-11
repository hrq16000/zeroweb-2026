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
  | "inline";

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
  variant: "split" | "fullBleed" | "editorial";
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
  variant: "grid" | "featured" | "alternating";
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
  variant: "banner" | "immersive";
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

export type BlueprintSection =
  | HeroSection
  | TrustSection
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
  hero: ["split", "fullBleed", "editorial"],
  trust: ["bar", "cards"],
  offers: ["grid", "featured", "alternating"],
  useCases: ["imageGrid", "editorial"],
  authority: ["split", "media"],
  proof: ["reviews"],
  location: ["panel"],
  cta: ["banner", "immersive"],
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
  layout: {
    motionIntensity?: BlueprintMotionIntensity;
    /** Largura de leitura padrão das seções que não são full bleed. */
    maxWidth?: string;
    headerCtaLabel?: string;
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
