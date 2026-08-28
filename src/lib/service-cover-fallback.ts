import coverSiteExpress from "@/assets/cover-site-express.jpg";
import coverTrafego from "@/assets/cover-trafego-pago.jpg";
import coverSeo from "@/assets/cover-seo.jpg";
import coverLocal from "@/assets/cover-local.jpg";
import coverGoogleAds from "@/assets/cover-google-ads.jpg";

/**
 * Capas de apoio para os cards de serviço da home.
 *
 * Regra: se o serviço tiver imagem própria cadastrada no painel, ela sempre
 * vence. Estas capas são ilustrações abstratas da 0WEB (sem texto, sem
 * fotografia de cliente e sem promessa comercial) usadas apenas para evitar
 * o placeholder "capa pendente".
 */
const BY_SLUG: Record<string, string> = {
  "site-express": coverSiteExpress,
  "criacao-de-sites": coverSiteExpress,
  "landing-page": coverSiteExpress,
  "trafego-pago": coverTrafego,
  "google-ads-299": coverGoogleAds,
  seo: coverSeo,
  "google-meu-negocio": coverLocal,
  "presenca-digital": coverLocal,
};

const BY_CATEGORY: Record<string, string> = {
  Web: coverSiteExpress,
  Tráfego: coverTrafego,
  SEO: coverSeo,
  Local: coverLocal,
};

export function serviceCoverFallback(slug: string, category?: string | null): string {
  return BY_SLUG[slug] ?? (category ? BY_CATEGORY[category] : undefined) ?? coverSiteExpress;
}
