import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { CheckCircle2, MapPin, Sparkles, Zap } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { FloatingFunnelCTA } from "@/components/funnel/FloatingFunnelCTA";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { InternalLinkCluster } from "@/components/site/InternalLinkCluster";
import {
  findPortfolioPlace,
  findPortfolioSegment,
  portfolioClusterLinks,
  portfolioComboPath,
} from "@/lib/portfolio-clusters";
import {
  SITE_URL,
  breadcrumbNode,
  graph,
  itemListNode,
  localBusinessNode,
  organizationNode,
  serviceNode,
} from "@/lib/portfolio-seo";

export const Route = createFileRoute("/portfolio/$segmento/$bairro")({
  loader: ({ params }) => {
    const segment = findPortfolioSegment(params.segmento);
    const place = findPortfolioPlace(params.bairro);
    if (!segment || !place) throw notFound();
    return { segment, place };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Página indisponível · 0WEB" }, { name: "robots", content: "noindex" }] };
    }
    const { segment, place } = loaderData;
    const path = portfolioComboPath(segment.slug, place.slug);
    const url = `${SITE_URL}${path}`;
    const title = `${segment.name} em ${place.name}, ${place.city} · Criação de Sites 0WEB`;
    const description = `Criação de site profissional para ${segment.name.toLowerCase()} em ${place.name} (${place.city}/${place.state}): ${segment.intent}. Veja projetos reais, entregáveis e condições com até 90 dias para começar a pagar.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index,follow,max-image-preview:large" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "geo.placename", content: `${place.name}, ${place.city}` },
        { name: "geo.position", content: `${place.geo[0]};${place.geo[1]}` },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: graph([
            organizationNode(),
            localBusinessNode(place),
            serviceNode(segment, place),
            itemListNode(
              `${url}#entregaveis`,
              `Entregáveis — ${segment.name} em ${place.name}`,
              segment.deliverables.map((d) => ({ url: `${url}#entregaveis`, name: d })),
            ),
            breadcrumbNode([
              { name: "Início", path: "/" },
              { name: "Portfólio", path: "/portfolio" },
              { name: segment.name, path: `/portfolio/${segment.slug}/${place.slug}` },
            ]),
          ]),
        },
      ],
    };
  },
  component: ProgrammaticPortfolioPage,
});

function ProgrammaticPortfolioPage() {
  const { segment, place } = Route.useLoaderData();
  const links = portfolioClusterLinks({ segmentSlug: segment.slug, placeSlug: place.slug, limit: 12 });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="border-b border-border/40 bg-muted/20">
          <div className="container max-w-5xl mx-auto px-4 py-3">
            <Breadcrumbs
              items={[
                { name: "Início", path: "/" },
                { name: "Portfólio", path: "/portfolio" },
                { name: `${segment.name} em ${place.name}`, path: portfolioComboPath(segment.slug, place.slug) },
              ]}
            />
          </div>
        </div>

        <section className="py-14 px-4 bg-gradient-to-b from-muted/30 to-background">
          <div className="container max-w-5xl mx-auto space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" /> {place.name} · {place.city}/{place.state}
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              {segment.name} em {place.name}:{" "}
              <span className="text-primary">sites que trazem clientes do bairro</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-3xl">
              {place.name} é {place.vibe}. Criamos sites e landing pages para{" "}
              {segment.name.toLowerCase()} da região com foco em {segment.intent} — do domínio .com.br
              ao Google Meu Negócio otimizado.
            </p>
            <FunnelCTAButton
              label={`Quero um site em ${place.name}`}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-semibold px-6 py-3.5 shadow-lg hover:opacity-95 transition-opacity"
            />
          </div>
        </section>

        <section id="entregaveis" className="py-12 px-4">
          <div className="container max-w-5xl mx-auto grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold">
                O que entregamos para {segment.name.toLowerCase()} em {place.name}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {segment.deliverables.map((d) => (
                  <li key={d} className="flex gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Negócios que atendemos na região</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {place.typicalBusinesses.map((b) => (
                  <li key={b} className="rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {b}
                  </li>
                ))}
              </ul>
              <h3 className="mt-6 text-lg font-semibold">Projetos reais deste segmento</h3>
              <ul className="mt-2 space-y-1.5 text-sm">
                {segment.showcases.map((s) => (
                  <li key={s.path}>
                    <Link to={s.path} className="text-primary font-medium hover:underline">
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container max-w-5xl mx-auto space-y-8">
            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 text-center space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                <Zap className="w-3.5 h-3.5" /> Até 90 dias para começar a pagar
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold">
                Seu negócio em {place.name} merece aparecer no Google
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                Responda 4 perguntas rápidas e receba um plano com prazo e valor na hora.
              </p>
              <FunnelCTAButton
                label="Ver condições para o meu negócio"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-semibold px-6 py-3.5 shadow-lg hover:opacity-95 transition-opacity"
              />
            </div>

            <InternalLinkCluster
              links={links}
              title="Explore o cluster de conteúdo"
              description={`Páginas relacionadas a ${segment.name.toLowerCase()} e à região de ${place.city}.`}
            />

            <p className="text-center text-xs text-muted-foreground inline-flex items-center gap-1.5 justify-center w-full">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Página criada e mantida pela 0WEB
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
      <FloatingFunnelCTA />
      <PortfolioUpsellPopup pageName={`portfolio-${segment.slug}-${place.slug}`} />
    </div>
  );
}
