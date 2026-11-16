/**
 * Substitui apenas as URLs Lovable comprovadamente indisponíveis na galeria
 * legada do Google Ads. Os assets editoriais versionados não representam
 * os antigos banners horizontais/stories; são alternativas com alt correto.
 */
export type ServiceGalleryImage = { path: string; url: string | null; alt: string | null };

const BROKEN = {
  cover: "/__l5e/assets-v1/bdb41320-73ca-45ee-bbef-8bdc4eed77e5/google-ads-299-capa.png",
  horizontal: "/__l5e/assets-v1/52dfe9c7-f306-4a1c-befc-23f196b0c1c0/google-ads-299-horizontal.png",
  vertical: "/__l5e/assets-v1/c72d8859-f2ab-4ae1-b156-2033d42fd469/google-ads-299-vertical.png",
} as const;

export function recoverGoogleAdsGallery<T extends ServiceGalleryImage>(
  slug: string,
  gallery: T[],
  editorial: { campaigns: string; results: string },
): T[] {
  if (slug !== "google-ads-299") return gallery;
  return gallery.flatMap((image) => {
    if (image.path === BROKEN.cover) return []; // já exibida pela capa principal
    if (image.path === BROKEN.horizontal) {
      return [{
        ...image,
        url: editorial.campaigns,
        alt: "Ilustração editorial sobre a gestão de campanhas Google Ads",
      }];
    }
    if (image.path === BROKEN.vertical) {
      return [{
        ...image,
        url: editorial.results,
        alt: "Ilustração editorial de resultados e retorno em tráfego pago",
      }];
    }
    return [image]; // imagens novas do CMS não são substituídas
  }) as T[];
}
