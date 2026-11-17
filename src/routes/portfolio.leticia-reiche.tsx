import { createFileRoute } from "@tanstack/react-router";
import { PortfolioStandardShell } from "@/components/portfolio/PortfolioStandardShell";
import { LeticiaReichePreviewPage } from "@/components/site/LeticiaReichePreviewPage";
import { graph, organizationNode, breadcrumbNode } from "@/lib/portfolio-seo";

/** Candidate for production; PR Draft until public-page readiness is approved. */
const slug = "leticia-reiche";
const url = "https://0web.com.br/portfolio/leticia-reiche";
const title = "Letícia Reiche | Manicure e Pedicure em Belford Roxo — Demonstração 0WEB";
const description = "Projeto demonstrativo 0WEB para Letícia Reiche, manicure e pedicure em Belford Roxo/RJ. Consulte cuidados e solicite informações, sem reserva automática. Não é o site oficial.";
const socialImage = "https://0web.com.br/images/leticia-reiche/social-og.svg";

export const Route = createFileRoute("/portfolio/leticia-reiche")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: "Letícia Reiche · Demonstração 0WEB" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:image", content: socialImage },
      { property: "og:image:alt", content: "Arte editorial ilustrativa em vinho e rosa para proposta 0WEB; não é fotografia de serviços" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: socialImage },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "icon", type: "image/svg+xml", href: "/images/leticia-reiche/logo.svg" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: graph([
        organizationNode(),
        {
          "@type": "WebPage",
          "@id": url + "#webpage",
          url,
          name: title,
          description,
          inLanguage: "pt-BR",
          genre: "Portfólio demonstrativo; não é o site oficial da profissional",
          publisher: { "@type": "Organization", name: "0WEB", url: "https://0web.com.br" },
          about: { "@type": "Thing", name: "Letícia Reiche — Manicure e Pedicure" },
        },
        breadcrumbNode([
          { name: "0WEB", path: "/" },
          { name: "Portfólio", path: "/portfolio" },
          { name: "Letícia Reiche — Demonstração", path: "/portfolio/leticia-reiche" },
        ]),
      ]),
    }],
  }),
  component: LeticiaReichePublic,
});

function LeticiaReichePublic() {
  return <PortfolioStandardShell slug={slug} funnelIntentOverride="agendamento">
    <LeticiaReichePreviewPage mode="live" />
  </PortfolioStandardShell>;
}
