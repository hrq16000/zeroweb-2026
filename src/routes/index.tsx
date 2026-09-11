import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  HomeFinalCTAV2,
  HomeHeroV2,
  HomePositioningV2,
  HomeProcessV2,
} from "@/components/site/HomeExperienceV2";
import { getPageSections } from "@/lib/site-sections.functions";
import { servicesNavQuery } from "@/lib/services-nav-query";

// V2 keeps only the two dynamic catalog surfaces below the fold.
const FeaturedServices = lazy(() =>
  import("@/components/site/FeaturedServices").then((m) => ({ default: m.FeaturedServices })),
);
const ProjetosNoAr = lazy(() =>
  import("@/components/site/ProjetosNoAr").then((m) => ({ default: m.ProjetosNoAr })),
);

// Operational layers kept because they do not compete with the page narrative.
const WhatsAppFloat = lazy(() =>
  import("@/components/site/WhatsAppFloat").then((m) => ({ default: m.WhatsAppFloat })),
);
const ConsentBanner = lazy(() =>
  import("@/components/site/ConsentBanner").then((m) => ({ default: m.ConsentBanner })),
);
const ScrollTracker = lazy(() =>
  import("@/components/site/ScrollTracker").then((m) => ({ default: m.ScrollTracker })),
);

const Skel = ({ h = "h-64" }: { h?: string }) => (
  <div className={`${h} w-full animate-pulse bg-muted/30`} aria-hidden="true" />
);

const homeSectionsQuery = queryOptions({
  queryKey: ["site-sections", "home"],
  queryFn: () => getPageSections({ data: { page: "home" } }),
  staleTime: 60_000,
});

const TITLE = "0WEB · Criação de Sites, IA e Marketing Digital";
const DESC =
  "Criamos sites, automações, sistemas e estratégias digitais que atraem clientes, aumentam vendas e transformam empresas em máquinas de crescimento.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      {
        name: "keywords",
        content:
          "criação de sites, desenvolvimento web, landing pages, lojas virtuais, SEO, marketing digital, automação, IA, chatbot, SaaS, hospedagem, tráfego pago",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://0web.com.br/" },
      { property: "og:site_name", content: "0WEB" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:image", content: "https://0web.com.br/og-default.jpg" },
      {
        property: "og:image:alt",
        content: "0WEB — Sites otimizados para anúncios, IA e marketing digital",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: "https://0web.com.br/og-default.jpg" },
      {
        name: "twitter:image:alt",
        content: "0WEB — Sites otimizados para anúncios, IA e marketing digital",
      },
    ],
    links: [{ rel: "canonical", href: "https://0web.com.br/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://0web.com.br/#org",
              name: "0WEB",
              url: "https://0web.com.br",
              logo: "https://0web.com.br/favicon.ico",
              slogan: "Tecnologia que gera crescimento",
              taxID: "41.723.708/0001-58",
              foundingDate: "2006",
              sameAs: [],
            },
            {
              "@type": "WebSite",
              "@id": "https://0web.com.br/#website",
              name: "0WEB",
              url: "https://0web.com.br",
              inLanguage: "pt-BR",
              publisher: { "@id": "https://0web.com.br/#org" },
              potentialAction: [
                {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://0web.com.br/portfolio?q={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
                {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://0web.com.br/servicos?q={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
              ],
            },
            {
              "@type": "ItemList",
              "@id": "https://0web.com.br/#home-paths",
              name: "Principais caminhos da 0WEB",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Serviços",
                  url: "https://0web.com.br/servicos",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Portfólio",
                  url: "https://0web.com.br/portfolio",
                },
              ],
            },
            {
              "@type": "WebPage",
              "@id": "https://0web.com.br/#webpage",
              url: "https://0web.com.br/",
              name: TITLE,
              description: DESC,
              isPartOf: { "@id": "https://0web.com.br/#website" },
              inLanguage: "pt-BR",
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Início", item: "https://0web.com.br/" },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: Index,
  loader: async ({ context }) => {
    // FeaturedServices needs services-nav in the SSR cache. Section flags are
    // still read so the approved V2 chapters can be disabled without code.
    await Promise.allSettled([
      context.queryClient.ensureQueryData(homeSectionsQuery),
      context.queryClient.ensureQueryData(servicesNavQuery),
    ]);
  },
});

function Index() {
  const { data } = useSuspenseQuery(homeSectionsQuery);
  const on = (key: string) => data.map[key] !== false;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Suspense fallback={null}>
        <ScrollTracker />
      </Suspense>

      <Header />

      <main>
        {on("hero") && <HomeHeroV2 />}
        {on("solutions") && <HomePositioningV2 />}

        {on("featured_services") && (
          <Suspense key="featured_services" fallback={<Skel />}>
            <FeaturedServices
              title="Soluções para avançar sem complicar"
              subtitle="Uma amostra das frentes disponíveis. O catálogo completo fica em Serviços."
              limit={4}
            />
          </Suspense>
        )}

        <Suspense key="projetos_no_ar" fallback={<Skel />}>
          <ProjetosNoAr />
        </Suspense>

        {on("process") && <HomeProcessV2 />}
        {on("cta") && <HomeFinalCTAV2 />}
      </main>

      <Footer />

      <Suspense fallback={null}>
        <WhatsAppFloat />
        <ConsentBanner />
      </Suspense>
    </div>
  );
}
