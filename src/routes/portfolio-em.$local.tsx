import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import {
  findPortfolioPlaceHub,
  portfolioNeighborhoodHubs,
  portfolioPlacePath,
} from "@/lib/portfolio-places";
import { SITE_URL, breadcrumbNode, graph, itemListNode, organizationNode } from "@/lib/portfolio-seo";
import { getPortfolioPlaceSeo } from "@/lib/portfolio-place-seo.functions";

export const Route = createFileRoute("/portfolio-em/$local")({
  loader: async ({ params }) => {
    const hub = findPortfolioPlaceHub(params.local);
    if (!hub) throw notFound();
    const seo = await getPortfolioPlaceSeo({ data: { slug: hub.slug } }).catch(() => null);
    return { hub, seo };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Local indisponível · 0WEB" }, { name: "robots", content: "noindex" }] };
    }
    const { hub, seo } = loaderData;
    const url = `${SITE_URL}${portfolioPlacePath(hub.slug)}`;
    const count = hub.projects.length;
    const plural = count === 1 ? "site no ar" : "sites no ar";
    const segments = Array.from(
      new Set(
        hub.projects
          .map((p) => (p.segment || "").replace(/-/g, " ").trim())
          .filter((s) => s.length > 0),
      ),
    ).slice(0, 3);
    const title = seo?.metaTitle || `${count} ${plural} em ${hub.label} · Portfólio 0WEB`;
    const description =
      seo?.metaDescription ||
      `${count} ${plural} criados pela 0WEB em ${hub.label}${
        segments.length ? ` (${segments.join(", ")})` : ""
      }: ${hub.projects
        .slice(0, 4)
        .map((p) => p.title)
        .join(", ")}. Veja cada página publicada e fale direto com a empresa.`;
    const candidates = hub.projects
      .map((p) => p.image)
      .filter((src): src is string => typeof src === "string" && src.startsWith("/"));
    const rawImage = candidates.find((src) => !/logo/i.test(src)) ?? candidates[0];
    const socialImage = rawImage ? `${SITE_URL}${rawImage}` : undefined;
    const lb = seo?.localBusiness;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index,follow,max-image-preview:large" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:locale", content: "pt_BR" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        ...(socialImage
          ? [
              { property: "og:image", content: socialImage },
              { name: "twitter:image", content: socialImage },
            ]
          : []),
        { name: "geo.placename", content: hub.label },
        { name: "geo.region", content: `BR-${hub.state}` },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: graph([
            organizationNode(),
            {
              "@type": "ProfessionalService",
              "@id": `${url}#localbusiness`,
              name: lb?.name || `0WEB — Sites publicados em ${hub.label}`,
              url,
              ...(lb?.description ? { description: lb.description } : {}),
              ...(lb?.telephone ? { telephone: lb.telephone } : {}),
              priceRange: lb?.priceRange || "$$",
              parentOrganization: { "@id": `${SITE_URL}/#organization` },
              address: {
                "@type": "PostalAddress",
                addressLocality: hub.city,
                addressRegion: hub.state,
                addressCountry: "BR",
              },
              areaServed: { "@type": "Place", name: lb?.areaServed || hub.label },
            },
            itemListNode(
              `${url}#projetos`,
              `Projetos da 0WEB em ${hub.label}`,
              hub.projects.map((p) => ({ url: `${SITE_URL}/portfolio/${p.slug}`, name: p.title })),
            ),
            breadcrumbNode([
              { name: "Início", path: "/" },
              { name: "Portfólio", path: "/portfolio" },
              { name: "Por cidade e bairro", path: "/portfolio-em" },
              { name: hub.label, path: portfolioPlacePath(hub.slug) },
            ]),
          ]),
        },
      ],
    };
  },
  component: PlacePage,
});

function PlacePage() {
  const { hub, seo } = Route.useLoaderData();
  const related =
    hub.kind === "city"
      ? portfolioNeighborhoodHubs(hub.city)
      : portfolioNeighborhoodHubs(hub.city).filter((h) => h.slug !== hub.slug);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 pb-20">
        <Breadcrumbs
          items={[
            { name: "Início", path: "/" },
            { name: "Portfólio", path: "/portfolio" },
            { name: "Por cidade e bairro", path: "/portfolio-em" },
            { name: hub.label, path: portfolioPlacePath(hub.slug) },
          ]}
        />
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" aria-hidden />
          {hub.kind === "city" ? "Cidade" : "Bairro"}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Sites publicados em {hub.label}
        </h1>
        {seo?.intro ? (
          <div className="mt-3 max-w-2xl space-y-3 text-muted-foreground">
            {seo.intro
              .split(/\n{2,}/)
              .map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
          </div>
        ) : (
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {hub.projects.length === 1
              ? "1 projeto publicado"
              : `${hub.projects.length} projetos publicados`}{" "}
            pela 0WEB neste local. Cada página é o site do próprio cliente, com catálogo, contato e
            funil próprios.
          </p>
        )}

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {hub.projects.map((project) => (
            <li key={project.slug}>
              <Link
                to="/portfolio/$slug"
                params={{ slug: project.slug }}
                className="block h-full overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/50"
              >
                {project.image ? (
                  <img
                    src={project.image}
                    alt={`Capa do site ${project.title}`}
                    loading="lazy"
                    decoding="async"
                    width={640}
                    height={360}
                    className="aspect-video w-full object-cover"
                  />
                ) : null}
                <div className="p-4">
                  <h2 className="font-semibold">{project.title}</h2>
                  {project.subtitle ? (
                    <p className="mt-1 text-sm text-muted-foreground">{project.subtitle}</p>
                  ) : null}
                  {project.location ? (
                    <p className="mt-2 text-xs text-muted-foreground">{project.location}</p>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {related.length > 0 ? (
          <section className="mt-12" aria-labelledby="proximos">
            <h2 id="proximos" className="text-xl font-semibold">
              Bairros de {hub.city}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {related.map((h) => (
                <li key={h.slug}>
                  <Link
                    to="/portfolio-em/$local"
                    params={{ local: h.slug }}
                    className="inline-flex rounded-full border border-border px-3 py-1.5 text-sm transition-colors hover:border-primary/50"
                  >
                    {h.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="mt-12">
          <Link to="/portfolio-em" className="text-primary underline underline-offset-4">
            Ver todas as cidades e bairros do portfólio
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
