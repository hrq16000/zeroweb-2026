import { createFileRoute } from "@tanstack/react-router";
import { PortfolioStandardShell } from "@/components/portfolio/PortfolioStandardShell";
import { LeticiaReichePreviewPage } from "@/components/site/LeticiaReichePreviewPage";

/** Public review route; noindex until explicit client approval and current visual/SEO readiness. */
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
      { name: "robots", content: "noindex,nofollow,noarchive,noimageindex" },
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
      { rel: "icon", type: "image/svg+xml", href: "/images/leticia-reiche/logo.svg" },
    ],

  }),
  component: LeticiaReichePublic,
});

function LeticiaReichePublic() {
  return <PortfolioStandardShell slug={slug} funnelIntentOverride="agendamento" seoNetworkEnabled={false}>
    <LeticiaReichePreviewPage mode="live" />
  </PortfolioStandardShell>;
}
