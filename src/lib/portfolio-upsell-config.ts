/**
 * Configuração central do pop-up de captação da 0WEB nas páginas /portfolio/*.
 *
 * Título, CTA, textos e regras de exibição vivem em
 * `src/config/portfolio-upsell.json` — nenhum projeto novo precisa alterar
 * código do componente para personalizar ou desativar o pop-up.
 */
import raw from "@/config/portfolio-upsell.json";

export type PortfolioUpsellDisplay = {
  timerMs: number;
  fallbackMs: number;
  scrollPct: number;
  oncePerSession: boolean;
};

export type PortfolioUpsellConfig = {
  enabled: boolean;
  kicker: string;
  title: string;
  highlight?: string;
  description: string;
  bullets: string[];
  ctaLabel: string;
  dismissLabel: string;
  funnelSlug: string;
  display: PortfolioUpsellDisplay;
};

type RawConfig = {
  default: PortfolioUpsellConfig;
  bySlug?: Record<string, Partial<PortfolioUpsellConfig> & { display?: Partial<PortfolioUpsellDisplay> }>;
};

const config = raw as RawConfig;

/** Extrai o slug do cliente a partir do pathname (`/portfolio/<slug>`). */
export function portfolioSlugFromPath(pathname: string): string {
  const match = /^\/portfolio\/([^/?#]+)/.exec(pathname);
  return match?.[1] ?? "portfolio";
}

export function resolvePortfolioUpsellConfig(slug: string): PortfolioUpsellConfig {
  const base = config.default;
  const override = config.bySlug?.[slug];
  if (!override) return base;
  return {
    ...base,
    ...override,
    bullets: override.bullets ?? base.bullets,
    display: { ...base.display, ...(override.display ?? {}) },
  };
}
