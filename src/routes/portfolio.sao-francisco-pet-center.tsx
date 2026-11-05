import { createFileRoute } from "@tanstack/react-router";
import { SaoFranciscoPetCenterPage } from "@/components/site/SaoFranciscoPetCenterPage";

const url = "https://0web.com.br/portfolio/sao-francisco-pet-center";
const title = "São Francisco Pet Center | Projeto de Site da 0WEB em São José dos Pinhais";
const description = "Projeto demonstrativo de site para o São Francisco Pet Center no Bom Jesus, São José dos Pinhais, criado pela 0WEB. Não é o site oficial do estabelecimento.";
const socialImage = "https://images.unsplash.com/photo-1657318216069-399acfda68d1?auto=format&fit=crop&w=1200&h=630&q=85";

export const Route = createFileRoute("/portfolio/sao-francisco-pet-center")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      // Página editorial pública da 0WEB: indexável como demonstração,
      // sem afirmar vínculo oficial com o estabelecimento citado.
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:site_name", content: "São Francisco Pet Center | Demonstração 0WEB" },
      { property: "og:url", content: url },
      { property: "og:image", content: socialImage },
      { property: "og:image:alt", content: "Fotografia editorial ilustrativa de um cão no gramado; não é foto do estabelecimento" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: socialImage },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": url + "#webpage",
            url,
            name: title,
            description,
            inLanguage: "pt-BR",
            about: { "@id": url + "#business" },
            isPartOf: { "@type": "WebSite", url: "https://0web.com.br", name: "0WEB" },
            creator: { "@type": "Organization", name: "0WEB", url: "https://0web.com.br" },
            publisher: { "@type": "Organization", name: "0WEB", url: "https://0web.com.br" },
            genre: "Portfólio demonstrativo de criação de sites; não é o site oficial da empresa",
          },
          {
            "@type": "PetStore",
            "@id": url + "#business",
            name: "São Francisco Pet Center",
            description: "Pet center com serviços de creche, hospedagem e banho e tosa de animais domésticos.",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Rua João Ângelo Cordeiro, 1616",
              addressLocality: "São José dos Pinhais",
              addressRegion: "PR",
              postalCode: "83025-120",
              addressCountry: "BR",
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Serviços apresentados",
              itemListElement: [
                { "@type": "OfferCatalog", name: "Hotel para pets" },
                { "@type": "OfferCatalog", name: "Creche pet" },
                { "@type": "OfferCatalog", name: "Banho e tosa" },
              ],
            },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "0WEB", item: "https://0web.com.br" },
              { "@type": "ListItem", position: 2, name: "Portfólio", item: "https://0web.com.br/portfolio" },
              { "@type": "ListItem", position: 3, name: "São Francisco Pet Center", item: url },
            ],
          },
        ],
      }),
    }],
  }),
  component: SaoFranciscoPetCenterPage,
});
