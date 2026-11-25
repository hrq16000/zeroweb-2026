import type { PortfolioRuntimeRow } from "./portfolio-runtime";

/**
 * Dados inteiramente sintéticos para testar o contrato de overrides visuais.
 * Não contém nomes, contatos, mídia ou registros de clientes.
 * Os slugs abaixo são apenas as chaves técnicas das rotas já versionadas.
 */
const slugs = [
  "studio-de-cilios",
  "refrigeracao-maresia",
  "lk-alvenaria",
  "paulo-mestre-de-obras",
] as const;

const syntheticRow = (slug: string): PortfolioRuntimeRow => ({
  slug,
  client_key: `visual-fixture-${slug}`,
  display_name: "Projeto sintético de homologação",
  seo_title: "Fixture visual de homologação",
  seo_description: "Conteúdo fictício para validar o contrato visual de overrides.",
  canonical_url: `https://0web.com.br/portfolio/${slug}`,
  logo_url: "/images/visual-fixtures/logo.svg",
  hero_image_url: "/images/visual-fixtures/hero.svg",
  hero_headline: "Uma experiência de demonstração",
  hero_subheadline: "Conteúdo sintético para validar campos administrados sem dados reais.",
  social_image_url: "/images/visual-fixtures/social.svg",
  cta_label: "Ver demonstração",
  gallery: ["/images/visual-fixtures/gallery.svg"],
  brand_colors: { primary: "#334155", accent: "#e2e8f0" },
  lifecycle_status: "published",
  published: true,
  content_version: 1,
});

export const PORTFOLIO_RUNTIME_VISUAL_FIXTURES: Record<string, PortfolioRuntimeRow> =
  Object.fromEntries(slugs.map((slug) => [slug, syntheticRow(slug)]));

export const PORTFOLIO_RUNTIME_VISUAL_FIXTURE_SLUGS = slugs;
