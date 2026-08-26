import { createFileRoute } from "@tanstack/react-router";
import { RenataBeautyView } from "@/components/site/RenataBeautyView";

const TITLE = "Renata Beauty Studio · Portfólio de Sites 0WEB";
const DESC = "Conheça o site desenvolvido pela 0WEB para o Espaço Renata Beauty Studio no Boneca do Iguaçu. Alta conversão para WhatsApp e design de luxo.";
const URL = "https://0web.com.br/portfolio/renata-beauty";
const SOCIAL_IMAGE = "https://0web.com.br/images/volume-egipcio-fios-w.jpg";
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
      { property: "og:image", content: "https://0web.com.br/images/volume-egipcio-fios-w.jpg" },
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
  component: RenataBeautyView,
});
