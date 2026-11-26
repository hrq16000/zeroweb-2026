import { createFileRoute } from "@tanstack/react-router";
import { PortfolioStandardShell } from "@/components/portfolio/PortfolioStandardShell";
import { PanificadoraDoceCoracaoSantoAntonioPage } from "@/components/site/PanificadoraDoceCoracaoSantoAntonioPage";
import { breadcrumbNode, graph, organizationNode } from "@/lib/portfolio-seo";

const slug = "panificadora-doce-coracao-santo-antonio";
const url = "https://0web.com.br/portfolio/panificadora-doce-coracao-santo-antonio";
const image = "https://0web.com.br/images/panificadora-doce-coracao-santo-antonio/social-og.png";
const mapUrl = "https://www.google.com/maps/search/?api=1&query=Panificadora%20Doce%20Cora%C3%A7%C3%A3o%20Santo%20Ant%C3%B4nio%20S%C3%A3o%20Jos%C3%A9%20dos%20Pinhais&query_place_id=ChIJK4CTr0b33JQRF5lemSGL8yA";
const title = "Panificadora Doce Coração | Padaria Santo Antônio, SJP · Portfólio 0WEB";
const description = "Conheça a Panificadora Doce Coração no Santo Antônio, São José dos Pinhais: endereço, pães, bolos, salgados e doces. Site demonstrativo criado pela 0WEB.";

export const Route = createFileRoute("/portfolio/panificadora-doce-coracao-santo-antonio")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex,nofollow,max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: "0WEB · Portfólios de criação de sites" },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Arte editorial original para o projeto demonstrativo da Panificadora Doce Coração na 0WEB" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hrefLang: "pt-BR", href: url },
      { rel: "icon", type: "image/svg+xml", href: "/images/panificadora-doce-coracao-santo-antonio/logo.svg" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: graph([
        organizationNode(),
        {
          "@type": "Bakery",
          "@id": url + "#business",
          name: "Panificadora Doce Coração",
          description: "Panificadora no Santo Antônio em São José dos Pinhais, com categorias de pães, bolos, salgados e doces mencionadas em referências públicas.",
          url,
          image,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Rua Desembargador James Portugal Macedo, 290",
            addressLocality: "São José dos Pinhais",
            addressRegion: "PR",
            postalCode: "83020-620",
            addressCountry: "BR",
          },
          hasMap: mapUrl,
          areaServed: { "@type": "Place", name: "Santo Antônio, São José dos Pinhais, Paraná" },
        },
        {
          "@type": "WebPage",
          "@id": url + "#webpage",
          name: title,
          description,
          url,
          inLanguage: "pt-BR",
          isPartOf: { "@id": "https://0web.com.br/#website" },
          publisher: { "@id": "https://0web.com.br/#organization" },
          mainEntity: { "@id": url + "#business" },
          primaryImageOfPage: { "@type": "ImageObject", url: image, caption: "Ilustração editorial original demonstrativa; não é fotografia da loja." },
          about: [
            { "@id": url + "#business" },
            { "@type": "Thing", name: "Criação de sites e portfólios pela 0WEB / WebRealce" },
          ],
        },
        breadcrumbNode([
          { name: "0WEB — Criação de sites", path: "/" },
          { name: "Portfólio 0WEB", path: "/portfolio" },
          { name: "Panificadora Doce Coração", path: "/portfolio/panificadora-doce-coracao-santo-antonio" },
        ]),
      ]),
    }],
  }),
  component: PanificadoraDoceCoracaoPortfolio,
});

function PanificadoraDoceCoracaoPortfolio() {
  return (
    <PortfolioStandardShell slug={slug} contactLabelOverride="Conhecer a 0WEB"
      siteNameOverride="Panificadora Doce Coração — apresentação demonstrativa"
      seoContextOverride={{ city: "São José dos Pinhais", state: "PR", neighborhood: "Santo Antônio" }}>
      <PanificadoraDoceCoracaoSantoAntonioPage />
    </PortfolioStandardShell>
  );
}
