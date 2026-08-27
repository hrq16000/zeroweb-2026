import { createFileRoute, notFound } from "@tanstack/react-router";
import { PrototypeSite, VERTICALS } from "./sites.$vertical";
import { absUrl } from "@/lib/seo";
import { findPortfolioPrototype } from "@/lib/portfolio-site-registry";
import { breadcrumbNode, graph, organizationNode, serviceNode } from "@/lib/portfolio-seo";
import { MaridoDeAluguelPage, MARIDO_ALUGUEL_FAQ } from "@/components/site/MaridoDeAluguelPage";
import { EmporioLelecutePage } from "@/components/site/EmporioLelecutePage";

export const Route = createFileRoute("/portfolio/$slug")({
  loader: ({ params }) => {
    const site = findPortfolioPrototype(params.slug);
    const verticalSlug = site?.vertical;
    const vertical = verticalSlug ? VERTICALS[verticalSlug] : undefined;
    if (!vertical) throw notFound();
    return { vertical, slug: params.slug };
  },
  head: ({ loaderData }) => {
    const prototype = loaderData?.slug ? findPortfolioPrototype(loaderData.slug) : undefined;
    const title = prototype?.siteName ?? loaderData?.vertical?.name ?? "Demonstração de site";
    const description = loaderData?.slug === "emporio-lelecute"
      ? "Lembrancinhas artesanais personalizadas, sabonetes, velas e presentes do Empório LeleCute em São José dos Pinhais."
      : loaderData?.vertical?.subheadline ?? "Demonstração de site criado pela 0WEB.";
    const url = absUrl(`/portfolio/${loaderData?.slug ?? ""}`);
    const vertical = loaderData?.vertical;
    const isMarido = loaderData?.slug === "marido-de-aluguel";
    return {
      meta: [
        { title: `${title} · Portfólio 0WEB` },
        { name: "description", content: description },
        { name: "robots", content: "index,follow,max-image-preview:large" },
        { name: "keywords", content: isMarido ? "marido de aluguel, marido de aluguel Curitiba, reparos residenciais, manutenção residencial" : (vertical?.keywords ?? "site profissional, criação de sites, SEO local") },
        { property: "og:title", content: `${title} · Portfólio 0WEB` },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "0WEB · Portfólio" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: vertical
        ? [{
            type: "application/ld+json",
            children: graph([
              organizationNode(),
              {
                "@type": "WebPage",
                "@id": url,
                url,
                name: `${title} · Portfólio 0WEB`,
                description,
                inLanguage: "pt-BR",
                isPartOf: { "@id": "https://0web.com.br/portfolio" },
              },
              {
                ...serviceNode({
                  slug: vertical.slug,
                  name: vertical.name,
                  keyword: vertical.keywords,
                  intent: vertical.hero,
                  services: vertical.services.map((service) => service.to),
                  hubs: [],
                  showcases: [],
                  deliverables: vertical.services.map((service) => service.title),
                }),
                "@id": `${url}#service`,
                url,
              },
              ...(isMarido ? [{
                "@type": "FAQPage",
                "@id": `${url}#faq`,
                mainEntity: MARIDO_ALUGUEL_FAQ.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })),
              }] : []),
              breadcrumbNode([
                { name: "Início", path: "/" },
                { name: "Portfólio", path: "/portfolio" },
                { name: title, path: `/portfolio/${loaderData?.slug ?? ""}` },
              ]),
            ]),
          }]
        : undefined,
    };
  },
  component: PortfolioPrototypePage,
});

function PortfolioPrototypePage() {
  const { vertical, slug } = Route.useLoaderData();
  if (slug === "marido-de-aluguel") return <MaridoDeAluguelPage />;
  if (slug === "emporio-lelecute") return <EmporioLelecutePage />;
  return <PrototypeSite vertical={vertical} />;
}
