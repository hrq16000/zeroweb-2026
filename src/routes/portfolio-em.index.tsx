import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import {
  portfolioCityHubs,
  portfolioNeighborhoodHubs,
  portfolioPlacePath,
} from "@/lib/portfolio-places";
import { SITE_URL, breadcrumbNode, graph, itemListNode, organizationNode } from "@/lib/portfolio-seo";

const URL = `${SITE_URL}/portfolio-em`;
const TITLE = "Projetos do portfólio por cidade e bairro · 0WEB";
const DESCRIPTION =
  "Veja os sites publicados pela 0WEB organizados por cidade e bairro: Curitiba, São José dos Pinhais, Araucária, Guaratuba, Belo Horizonte e mais. Cada página lista os projetos reais daquele local.";

export const Route = createFileRoute("/portfolio-em/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: graph([
          organizationNode(),
          itemListNode(
            `${URL}#cidades`,
            "Cidades com projetos da 0WEB",
            portfolioCityHubs().map((hub) => ({
              url: `${SITE_URL}${portfolioPlacePath(hub.slug)}`,
              name: hub.label,
            })),
          ),
          breadcrumbNode([
            { name: "Início", path: "/" },
            { name: "Portfólio", path: "/portfolio" },
            { name: "Por cidade e bairro", path: "/portfolio-em" },
          ]),
        ]),
      },
    ],
  }),
  component: PlacesIndex,
});

function PlacesIndex() {
  const cities = portfolioCityHubs();
  const hoods = portfolioNeighborhoodHubs();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 pb-20">
        <Breadcrumbs
          items={[
            { name: "Início", path: "/" },
            { name: "Portfólio", path: "/portfolio" },
            { name: "Por cidade e bairro", path: "/portfolio-em" },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Projetos do portfólio por cidade e bairro
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{DESCRIPTION}</p>

        <section className="mt-10" aria-labelledby="cidades">
          <h2 id="cidades" className="text-xl font-semibold">
            Cidades
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((hub) => (
              <li key={hub.slug}>
                <Link
                  to="/portfolio-em/$local"
                  params={{ local: hub.slug }}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-primary/50"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <MapPin className="h-4 w-4 text-primary" aria-hidden />
                    {hub.label}
                  </span>
                  <span className="text-sm text-muted-foreground">{hub.projects.length}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12" aria-labelledby="bairros">
          <h2 id="bairros" className="text-xl font-semibold">
            Bairros
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {hoods.map((hub) => (
              <li key={hub.slug}>
                <Link
                  to="/portfolio-em/$local"
                  params={{ local: hub.slug }}
                  className="inline-flex rounded-full border border-border px-3 py-1.5 text-sm transition-colors hover:border-primary/50"
                >
                  {hub.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
