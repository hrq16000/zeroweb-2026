import { createFileRoute } from "@tanstack/react-router";
import { PortfolioStandardShell } from "@/components/portfolio/PortfolioStandardShell";
import { RenataBeautyView } from "@/components/site/RenataBeautyView";

const TITLE = "Renata Beauty Studio · Cílios, unhas e sobrancelhas";
const DESC = "Conheça os procedimentos, o espaço e as condições especiais do Renata Beauty Studio no Boneca do Iguaçu.";
const URL = "https://0web.com.br/portfolio/renata-beauty";
const SOCIAL_IMAGE = "https://0web.com.br/images/renata-beauty-promo.webp";
const ICON = "https://0web.com.br/images/renata-beauty-icon.png";

export const Route = createFileRoute("/portfolio/renata-beauty")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { property: "og:site_name", content: "Renata Beauty Studio" },
      { property: "og:image", content: SOCIAL_IMAGE },
      { property: "og:image:alt", content: "Cílios Volume Egípcio do Renata Beauty Studio" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: SOCIAL_IMAGE },
    ],
    links: [{ rel: "canonical", href: URL }, { rel: "icon", type: "image/png", href: ICON }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", "@id": URL, url: URL, name: TITLE, description: DESC, image: SOCIAL_IMAGE, inLanguage: "pt-BR", about: { "@type": "BeautySalon", name: "Renata Beauty Studio" } }),
    }],
  }),
  component: RenataBeautyViewRoute,
});

function RenataBeautyViewRoute() {
  return (
    <PortfolioStandardShell slug="renata-beauty">
      <RenataBeautyView />
    </PortfolioStandardShell>
  );
}
