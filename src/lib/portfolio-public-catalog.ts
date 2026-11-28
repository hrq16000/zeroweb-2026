export type PortfolioCatalogVisibility = {
  status?: string | null;
  live?: boolean | null;
  indexable?: boolean | null;
};

/** Public discovery is restricted to explicitly published catalog records. */
export function isPublicPortfolioCatalogItem(item: PortfolioCatalogVisibility): boolean {
  const status = String(item.status ?? "").trim().toLowerCase();
  return (status === "published" || status === "approved") &&
    item.live !== false &&
    item.indexable !== false;
}
