/**
 * /home2 — landing page de agência digital integrada.
 *
 * Mantém a direção visual aprovada da Home2, agora com intenção própria:
 * apresentar a 0WEB como operação integrada de marca, sites, SEO, tráfego,
 * automação e presença digital.
 */
import { createFileRoute } from "@tanstack/react-router";
import { Home2PersonalityExperience } from "@/components/site/Home2PersonalityExperience";

const TITLE = "Agência Digital Integrada: Sites, SEO, Marca e IA | 0WEB";
const DESC =
  "Conheça a operação integrada da 0WEB: estratégia, marca, sites autorais, SEO, tráfego, automação e projetos publicados conectados em uma presença digital coerente.";

export const Route = createFileRoute("/home2")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://0web.com.br/home2" },
      { property: "og:image", content: "https://0web.com.br/og-default.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "https://0web.com.br/home2" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": "https://0web.com.br/home2#webpage",
              url: "https://0web.com.br/home2",
              name: TITLE,
              description: DESC,
              inLanguage: "pt-BR",
              isPartOf: { "@id": "https://0web.com.br/#website" },
              about: [
                { "@type": "Thing", name: "Agência digital integrada" },
                { "@type": "Thing", name: "Criação de sites" },
                { "@type": "Thing", name: "SEO" },
                { "@type": "Thing", name: "Automação e IA" }
              ]
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Início", item: "https://0web.com.br/" },
                { "@type": "ListItem", position: 2, name: "Agência digital integrada", item: "https://0web.com.br/home2" }
              ]
            }
          ]
        })
      }
    ],
  }),
  component: Home2PersonalityExperience,
});
