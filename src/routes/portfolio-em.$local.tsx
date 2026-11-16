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
import {
  portfolioPlaceDirectoryDescription,
  portfolioPlaceDirectoryGroups,
  portfolioPlaceDirectoryIntro,
  portfolioPlaceDirectoryTitle,
} from "@/lib/portfolio-place-directory";
import { SITE_URL, breadcrumbNode, graph, itemListNode, organizationNode } from "@/lib/portfolio-seo";
import {
  getPortfolioPlacePublicationStates,
  getPortfolioPlaceSeo,
  portfolioPlaceIsPublished,
} from "@/lib/portfolio-place-seo.functions";

export const Route = createFileRoute("/portfolio-em/$local")({
  loader: async ({ params }) => {
    const hub = findPortfolioPlaceHub(params.local);
    if (!hub) throw notFound();
    const [seo, states] = await Promise.all([
      getPortfolioPlaceSeo({ data: { slug: hub.slug } }).catch(() => null),
      getPortfolioPlacePublicationStates().catch(() => []),
    ]);
    return { hub, seo, states };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Local indisponível · 0WEB" }, { name: "robots", content: "noindex" }] };
    }
    const { hub, seo, states } = loaderData;
    const published =
      portfolioPlaceIsPublished(hub.slug, states) && seo?.published !== false;
    const url = `${SITE_URL}${portfolioPlacePath(hub.slug)}`;
    const title = seo?.metaTitle || portfolioPlaceDirectoryTitle(hub);
    const description = seo?.metaDescription || portfolioPlaceDirectoryDescription(hub);
    const candidates = hub.projects
      .map((p) => p.image)
      .filter((src): src is string => typeof src === "string" && src.startsWith("/"));
    const rawImage = candidates.find((src) => !/logo/i.test(src)) ?? candidates[0];
    const socialImage = rawImage ? `${SITE_URL}${rawImage}` : undefined;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: published ? "index,follow,max-image-preview:large" : "noindex,follow" },
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
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: graph([
            organizationNode(),
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
  const { hub, seo, states } = Route.useLoaderData();
  const groups = portfolioPlaceDirectoryGroups(hub);
  const generatedIntro = portfolioPlaceDirectoryIntro(hub);
  const relatedCandidates =
    hub.kind === "city"
      ? portfolioNeighborhoodHubs(hub.city)
      : portfolioNeighborhoodHubs(hub.city).filter((h) => h.slug !== hub.slug);
  const related = relatedCandidates.filter((item) =>
    portfolioPlaceIsPublished(item.slug, states),
  );

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
          <div className="mt-3 max-w-3xl space-y-3 text-muted-foreground">
            {seo.intro
              .split(/\n{2,}/)
              .map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            <p>{generatedIntro}</p>
          </div>
        ) : (
          <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{generatedIntro}</p>
        )}

        <section className="mt-10 rounded-3xl border border-border bg-muted/20 p-5 sm:p-7" aria-labelledby="categorias-locais">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Guia comercial local</p>
          <h2 id="categorias-locais" className="mt-2 text-2xl font-bold">
            O que você encontra em {hub.kind === "neighborhood" ? hub.name : hub.city}
          </h2>
          <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
            As categorias abaixo são derivadas dos próprios negócios publicados neste local. Use-as para descobrir
            pequenos comércios e prestadores sem sair do contexto da região.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <article key={group.key} className="rounded-2xl border border-border bg-background p-5">
                <h3 className="font-semibold">{group.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {group.projects.length} {group.projects.length === 1 ? "negócio publicado" : "negócios publicados"}
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  {group.projects.slice(0, 5).map((project) => (
                    <li key={project.slug}>
                      <Link
                        to="/portfolio/$slug"
                        params={{ slug: project.slug }}
                        className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-primary"
                      >
                        {project.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3" aria-labelledby="como-usar-guia">
          <h2 id="como-usar-guia" className="sr-only">Como usar este guia comercial</h2>
          <article className="rounded-2xl border border-border p-5">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">1 · Descubra</p>
            <h3 className="mt-2 font-semibold">Comece pelo local</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              O diretório prioriza negócios do bairro e da cidade quando essa localização já está registrada no catálogo.
            </p>
          </article>
          <article className="rounded-2xl border border-border p-5">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">2 · Compare</p>
            <h3 className="mt-2 font-semibold">Abra a presença de cada negócio</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Cada página preserva conteúdo, identidade, catálogo, serviços e referências próprias do estabelecimento ou prestador.
            </p>
          </article>
          <article className="rounded-2xl border border-border p-5">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">3 · Avance</p>
            <h3 className="mt-2 font-semibold">Use o atendimento da própria página</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Quando houver funil ativo, o contato parte do contexto daquela página e segue para o fluxo configurado do cliente.
            </p>
          </article>
        </section>

        {hub.kind === "neighborhood" && hub.parentSlug ? (
          <p className="mt-8 text-sm text-muted-foreground">
            Quer ampliar a busca?{" "}
            <Link
              to="/portfolio-em/$local"
              params={{ local: hub.parentSlug }}
              className="font-semibold text-primary underline underline-offset-4"
            >
              Ver negócios e serviços em toda {hub.city}
            </Link>
            .
          </p>
        ) : null}

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
