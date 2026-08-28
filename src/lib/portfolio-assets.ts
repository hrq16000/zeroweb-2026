import assets from "@/config/portfolio-assets.json";

export type PortfolioAssetConfig = (typeof assets.clients)[keyof typeof assets.clients];

export function resolvePortfolioAssets(slug: string): PortfolioAssetConfig | undefined {
  return assets.clients[slug as keyof typeof assets.clients];
}
