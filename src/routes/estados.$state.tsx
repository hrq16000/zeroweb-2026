import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { absUrl, ORIGIN, breadcrumbLd, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { CITIES, STATES, type StateInfo } from "@/lib/geo-data";
import { isGeoCityIndexable, isGeoStateIndexable } from "@/lib/geo-hub-indexability";
import { GEO_SERVICE_SLUGS, SERVICES } from "@/lib/services-data";

export const Route = createFileRoute("/estados/$state")({
  beforeLoad: ({ params }) => {
    if (!STATES[params.state]) throw notFound();
  },
  loader: ({ params }) => {
    const state = STATES[params.state] as StateInfo;
    const citySlugs = state.cities.filter((slug) => isGeoCityIndexable(slug));
    return { state, citySlugs, hasEvidence: isGeoStateIndexable(state.slug) };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Estado · 0WEB" }] };
    const { state, hasEvidence } = loaderData;
    const url = absUrl(`/estados/${params.state}`);
    const title = `${state.name} (${state.code}) — Atendimento digital · 0WEB`;
    const desc = `Atendimento remoto da 0WEB para empresas em ${state.name}. Páginas locais são destacadas apenas onde há evidência publicada.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:image", content: DEFAULT_OG_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "robots",
          content: hasEvidence ? "index,follow,max-image-preview:large" : "noindex,follow",
        },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "CollectionPage",
                "@id": url,
                url,
                name: title,
                description: desc,
                inLanguage: "pt-BR",
                isPartOf: { "@type": "WebSite", url: ORIGIN, name: "0WEB" },
              },
              breadcrumbLd([
                { name: "Estados", path: "/estados" },
                { name: state.name, path: `/estados/${params.state}` },
              ]),
            ],
          }),
        },
      ],
    };
  },
  component: EstadoPage,
});

function EstadoPage() {
  const { state, citySlugs } = Route.useLoaderData();
  const cities = citySlugs.map((slug: string) => CITIES[slug]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Breadcrumbs
        items={[
          { name: "Estados", path: "/estados" },
          { name: state.name, path: `/estados/${state.slug}` },
        ]}
      />
      <main className="pt-6">
        <section className="py-16 bg-hero">
          <div className="mx-auto max-w-5xl px-5 lg:px-8 text-center">
            <p className="text-xs uppercase tracking-wider text-primary font-semibold inline-flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" /> {state.region}
            </p>
            <h1 className="mt-3 text-4xl lg:text-6xl font-bold tracking-tight">
              {state.name} <span className="text-gradient">({state.code})</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
              Atendimento remoto para empresas em {state.name}. As páginas locais abaixo aparecem apenas quando há projeto publicado que sustenta a cobertura.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Cidades atendidas em {state.name}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cities.map((c: typeof cities[number]) => (
                <Link
                  key={c.slug}
                  to="/$city/$service"
                  params={{ city: c.slug, service: GEO_SERVICE_SLUGS[0] }}
                  className="block p-5 rounded-2xl border border-border bg-card hover:border-primary transition-colors"
                >
                  <p className="font-semibold text-lg">{c.name}</p>
                  <p className="text-sm text-muted-foreground">DDD {c.ddd} · {c.population.toLocaleString("pt-BR")} hab.</p>
                  <p className="mt-2 text-xs text-muted-foreground">{c.flavor}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary font-semibold">
                    Ver serviços <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Serviços digitais com atendimento remoto para {state.name}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {GEO_SERVICE_SLUGS.map((slug) => {
                const s = SERVICES[slug];
                return (
                  <Link
                    key={slug}
                    to="/servicos/$slug"
                    params={{ slug }}
                    className="block p-4 rounded-2xl border border-border bg-card hover:border-primary transition-colors"
                  >
                    <p className="text-xs uppercase tracking-wider text-primary font-semibold">{s.category}</p>
                    <h3 className="mt-1 font-semibold">{s.name}</h3>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
