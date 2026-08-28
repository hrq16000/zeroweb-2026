import { createFileRoute } from "@tanstack/react-router";
import { PortfolioStandardShell } from "@/components/portfolio/PortfolioStandardShell";
import { DyzPromoPage } from "@/components/site/DyzPromoPage";

const TITLE = "D.Y.Z Promo · Divulgação e panfletagem em Curitiba";
const DESC =
  "Divulgação, panfletagem, promotores e ações promocionais da D.Y.Z Promo em Curitiba e região metropolitana.";
const URL = "https://0web.com.br/portfolio/dyzpromo";
const SOCIAL_IMAGE = "https://0web.com.br/images/dyzpromo/logo-dyz-promo-og.jpg?v=1bb5971a";
const ICON = "https://0web.com.br/images/dyzpromo/logo-dyz-promo.webp";
const TOUCH_ICON = "https://0web.com.br/images/dyzpromo/logo-dyz-promo-touch.png";

export const Route = createFileRoute("/portfolio/dyzpromo")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { property: "og:site_name", content: "D.Y.Z Promo" },
      { property: "og:image", content: SOCIAL_IMAGE },
      { property: "og:image:alt", content: "Equipe D.Y.Z Promo realizando divulgação em Curitiba" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: SOCIAL_IMAGE },
    ],
    links: [{ rel: "canonical", href: URL }, { rel: "icon", type: "image/webp", href: ICON }, { rel: "apple-touch-icon", type: "image/png", sizes: "180x180", href: TOUCH_ICON }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": URL,
          url: URL,
          name: TITLE,
          description: DESC,
          image: SOCIAL_IMAGE,
          inLanguage: "pt-BR",
          about: { "@type": "LocalBusiness", name: "D.Y.Z Promo", taxID: "68.500.745/0001-53" },
        }),
      },
    ],
  }),
  component: DyzPromoPageRoute,
});

function DyzPromoPageRoute() {
  return (
    <PortfolioStandardShell slug="dyzpromo">
      <DyzPromoPage />
    </PortfolioStandardShell>
  );
}
