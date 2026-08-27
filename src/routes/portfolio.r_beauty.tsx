import { createFileRoute } from "@tanstack/react-router";
import { PortfolioStandardShell } from "@/components/portfolio/PortfolioStandardShell";
import { RBeautyEditorialView } from "@/components/site/RBeautyEditorialView";

const TITLE = "R_Beauty Haute Studio · Cílios, unhas e sobrancelhas";
const DESC = "Conheça os procedimentos de cílios, unhas, sobrancelhas e autocuidado do R_Beauty Haute Studio no Boneca do Iguaçu.";
const URL = "https://0web.com.br/portfolio/r_beauty";
const SOCIAL_IMAGE = "https://0web.com.br/images/r-beauty-cilios.jpg";
const ICON = "https://0web.com.br/images/r-beauty-icon.png";

export const Route = createFileRoute("/portfolio/r_beauty")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { property: "og:site_name", content: "R_Beauty Haute Studio" },
      { property: "og:image", content: "https://0web.com.br/images/r-beauty-cilios.jpg" },
      { property: "og:image:alt", content: "R_Beauty Studio com destaque para cílios" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: SOCIAL_IMAGE },
    ],
    links: [{ rel: "canonical", href: URL }, { rel: "icon", type: "image/png", href: ICON }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", "@id": URL, url: URL, name: TITLE, description: DESC, image: SOCIAL_IMAGE, inLanguage: "pt-BR", about: { "@type": "BeautySalon", name: "R_Beauty Studio" } }),
    }],
  }),
  component: RBeautyEditorialViewRoute,
});

function RBeautyEditorialViewRoute() {
  return (
    <PortfolioStandardShell slug="r_beauty">
      <RBeautyEditorialView />
    </PortfolioStandardShell>
  );
}
