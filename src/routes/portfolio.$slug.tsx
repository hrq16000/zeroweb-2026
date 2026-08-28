import { lazy, Suspense } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { PrototypeSite, VERTICALS } from "./sites.$vertical";
import { absUrl } from "@/lib/seo";
import { findPortfolioPrototype } from "@/lib/portfolio-site-registry";
import { breadcrumbNode, graph, organizationNode, serviceNode } from "@/lib/portfolio-seo";
import { MARIDO_ALUGUEL_FAQ } from "@/components/site/marido-de-aluguel-faq";
import { PortfolioStandardShell } from "@/components/portfolio/PortfolioStandardShell";

// Code splitting por cliente: cada site de `/portfolio/:slug` vira um chunk
// próprio, então o visitante baixa apenas o projeto que abriu. O SSR continua
// renderizando o conteúdo (React resolve o lazy no stream), preservando SEO.
const MaridoDeAluguelPage = lazy(() =>
  import("@/components/site/MaridoDeAluguelPage").then((m) => ({ default: m.MaridoDeAluguelPage })),
);
const EmporioLelecutePage = lazy(() =>
  import("@/components/site/EmporioLelecutePage").then((m) => ({ default: m.EmporioLelecutePage })),
);
const ParaisoHotDogPage = lazy(() =>
  import("@/components/site/ParaisoHotDogPage").then((m) => ({ default: m.ParaisoHotDogPage })),
);
const RMFretesPage = lazy(() =>
  import("@/components/site/RMFretesPage").then((m) => ({ default: m.RMFretesPage })),
);
const RjServicosDrywallPage = lazy(() =>
  import("@/components/site/RjServicosDrywallPage").then((m) => ({ default: m.RjServicosDrywallPage })),
);


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
    const isRjDrywall = loaderData?.slug === "rj-servicos-drywall";
    const description = isRjDrywall
      ? "Instalação, manutenção e reparos em drywall em Curitiba e Região Metropolitana. Paredes, forros, sancas, nichos e acabamento fino."
      : loaderData?.slug === "emporio-lelecute"
        ? "Lembrancinhas artesanais personalizadas, sabonetes, velas e presentes do Empório LeleCute em São José dos Pinhais."
        : (loaderData?.vertical?.subheadline ?? "Demonstração de site criado pela 0WEB.");
    const url = absUrl(`/portfolio/${loaderData?.slug ?? ""}`);
    const socialImage = absUrl(
      loaderData?.slug === "rm-fretes"
        ? "/images/rm-fretes/anuncio-oficial.png"
        : isRjDrywall
          ? "/images/rj-servicos-drywall/acabamento-sala.webp"
        : loaderData?.slug === "emporio-lelecute"
          ? "/images/emporio-lelecute-og.webp"
          : loaderData?.slug === "paraiso-do-hot-dog"
          ? "/images/paraiso-hot-dog-cover.webp"
            : "/images/mestre-dos-servicos-logo.jpg",
    );
    const icon =
      loaderData?.slug === "rm-fretes" ? "/images/rm-fretes/anuncio-oficial.png" : socialImage;
    const vertical = loaderData?.vertical;
    const isMarido = loaderData?.slug === "marido-de-aluguel";
    return {
      meta: [
        { title: `${title} · Portfólio 0WEB` },
        { name: "description", content: description },
        { name: "robots", content: "index,follow,max-image-preview:large" },
        {
          name: "keywords",
          content: isRjDrywall
            ? "drywall Curitiba, instalação de drywall, parede de drywall, forro de gesso, sanca, reparo drywall, gesso acartonado"
            : isMarido
            ? "marido de aluguel, marido de aluguel Curitiba, reparos residenciais, manutenção residencial"
            : (vertical?.keywords ?? "site profissional, criação de sites, SEO local"),
        },
        { property: "og:title", content: `${title} · Portfólio 0WEB` },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: title },
        { property: "og:image", content: socialImage },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "icon", href: icon },
      ],
      scripts: vertical
        ? [
            {
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
                ...(isMarido
                  ? [
                      {
                        "@type": "FAQPage",
                        "@id": `${url}#faq`,
                        mainEntity: MARIDO_ALUGUEL_FAQ.map((faq) => ({
                          "@type": "Question",
                          name: faq.q,
                          acceptedAnswer: { "@type": "Answer", text: faq.a },
                        })),
                      },
                    ]
                  : []),
                breadcrumbNode([
                  { name: "Início", path: "/" },
                  { name: "Portfólio", path: "/portfolio" },
                  { name: title, path: `/portfolio/${loaderData?.slug ?? ""}` },
                ]),
              ]),
            },
          ]
        : undefined,
    };
  },
  component: PortfolioPrototypePage,
});

function PortfolioPrototypePage() {
  const { vertical, slug } = Route.useLoaderData();
  return (
    <PortfolioStandardShell slug={slug} includePlatformFooter={false}>
      <Suspense fallback={<div className="min-h-dvh" aria-busy="true" />}>
        {slug === "marido-de-aluguel" ? (
          <MaridoDeAluguelPage />
        ) : slug === "emporio-lelecute" ? (
          <EmporioLelecutePage />
        ) : slug === "paraiso-do-hot-dog" ? (
          <ParaisoHotDogPage />
        ) : slug === "rm-fretes" ? (
          <RMFretesPage />
        ) : slug === "rj-servicos-drywall" ? (
          <RjServicosDrywallPage />
        ) : (
          <PrototypeSite vertical={vertical} />
        )}
      </Suspense>
    </PortfolioStandardShell>
  );
}
