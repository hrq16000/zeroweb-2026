import assets from "@/config/portfolio-assets.json";

export type PortfolioAssetConfig = (typeof assets.clients)[keyof typeof assets.clients];

export function resolvePortfolioAssets(slug: string): PortfolioAssetConfig | undefined {
  return assets.clients[slug as keyof typeof assets.clients];
}

/**
 * Acrescenta a versão do arquivo à URL da imagem social.
 * Garante que WhatsApp/Facebook/X busquem a prévia nova quando a imagem muda,
 * em vez de servir o cache antigo do crawler.
 */
export function withSocialVersion(url: string, slug?: string): string {
  const version = slug
    ? (resolvePortfolioAssets(slug) as { socialVersion?: string } | undefined)?.socialVersion
    : undefined;
  if (!version) return url;
  return url.includes("?") ? `${url}&v=${version}` : `${url}?v=${version}`;
}

/**
 * Lista ordenada de candidatos a capa de um projeto do portfólio.
 * Usada pelo componente PortfolioCover para nunca renderizar card sem imagem.
 */
export function resolvePortfolioCoverCandidates(input: {
  clientKey: string;
  image?: string;
  fallbackImage?: string;
}): string[] {
  const entry = resolvePortfolioAssets(input.clientKey) as
    | { icon?: string; socialImage?: string }
    | undefined;
  const list = [input.image, entry?.socialImage, entry?.icon, input.fallbackImage];
  return Array.from(new Set(list.filter((v): v is string => typeof v === "string" && v.length > 0)));
}

export function portfolioAssetsIndex() {
  return assets.clients as Record<string, PortfolioAssetConfig>;
}
