import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { ScrollTracker } from "@/components/site/ScrollTracker";
import { cases, getCase } from "@/lib/cases-data";
import { trackConversion, trackEvent } from "@/lib/analytics";
import { useWaFunnel } from "@/components/site/WaFunnelModal";

export const Route = createFileRoute("/cases/$slug")({
  loader: ({ params }) => {
    const c = getCase(params.slug);
    if (!c) throw notFound();
    return { case: c };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const c = loaderData.case;
    const url = `https://0web.com.br/cases/${c.slug}`;
    const image = c.cover?.startsWith("http") ? c.cover : `https://0web.com.br${c.cover ?? ""}`;
    return {
      meta: [
        { title: c.seo.title },
        { name: "description", content: c.seo.description },
        { name: "keywords", content: c.seo.keywords },
        { name: "robots", content: "noindex,follow,max-image-preview:large" },
        { property: "og:title", content: c.seo.title },
        { property: "og:description", content: c.seo.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: c.seo.title },
        { name: "twitter:description", content: c.seo.description },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebPage",
                "@id": `${url}#webpage`,
                url,
                name: c.brand,
                description: c.intro,
                image,
                inLanguage: "pt-BR",
                isPartOf: { "@id": "https://0web.com.br/#website" },
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Início", item: "https://0web.com.br/" },
                  { "@type": "ListItem", position: 2, name: "Cases", item: "https://0web.com.br/#cases" },
                  { "@type": "ListItem", position: 3, name: c.brand, item: url },
                ],
              },
              {
                "@type": "Organization",
                name: c.brand,
                url: c.url,
                areaServed: c.city,
              },
            ],
          }),
        },
      ],
    };
  },
  component: CasePage,
});

function CasePage() {
  const { case: c } = Route.useLoaderData() as { case: import("@/lib/cases-data").CaseStudy };
  const { open: openFunnel } = useWaFunnel();

  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      <ScrollTracker />
      <Header />
      <Breadcrumbs
        items={[
          { name: "Cases", path: "/cases" },
          { name: c.brand, path: `/cases/${c.slug}` },
        ]}
      />

      <main className="pt-6 pb-24">
        {/* Hero */}
        <section className={`relative overflow-hidden bg-gradient-to-br ${c.color} text-white`}>
          <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
          <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-20 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm"
                onClick={() => trackEvent("case_back", { slug: c.slug })}
              >
                <ArrowLeft className="w-4 h-4" /> Voltar para 0WEB
              </Link>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" /> {c.category} · {c.city}
              </div>
              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
                {c.brand}
              </h1>
              <p className="mt-3 text-lg sm:text-xl text-white/90 max-w-2xl">{c.tagline}</p>
              <p className="mt-5 text-white/80 max-w-2xl">{c.intro}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("case_visit_site", { slug: c.slug, domain: c.domain })}
                  className="inline-flex items-center gap-2 rounded-full bg-white text-foreground font-semibold px-6 py-3.5 hover:bg-white/95 transition"
                >
                  Visitar {c.domain}
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    trackConversion("contact_cta_click", { location: "case_hero", slug: c.slug });
                    openFunnel(`case_${c.slug}`);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground text-background font-semibold px-6 py-3.5 hover:bg-foreground/90 transition"
                >
                  <MessageCircle className="w-4 h-4 text-accent" />
                  Quero algo parecido
                </button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-5"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-white/10 blur-3xl rounded-full" />
                <img
                  src={c.cover}
                  alt={`Mockup do projeto ${c.brand}`}
                  width={1280}
                  height={800}
                  loading="eager"
                  className="relative rounded-3xl shadow-2xl ring-1 ring-white/30 w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Métricas, resultados e depoimentos ficam ocultos até existir
            evidência versionada para cada afirmação. */}
        <section className="mx-auto max-w-5xl px-5 lg:px-8 mt-16">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-2xl font-bold font-display">Estudo em revisão editorial</h2>
            <p className="mt-3 text-muted-foreground">
              A página permanece disponível para revisão do projeto, mas métricas de desempenho,
              resultados e depoimentos só serão publicados novamente após validação documental da fonte,
              do período medido e da autorização de uso.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 mt-20">
          <div className="rounded-3xl bg-foreground text-background p-8 sm:p-12 grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold font-display">
                Quer um resultado <span className="text-accent">como este</span>?
              </h2>
              <p className="mt-3 text-background/80">
                Solicite um diagnóstico gratuito e descubra o plano de crescimento ideal para o seu
                negócio.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                to="/"
                hash="diagnostico"
                onClick={() =>
                  trackEvent("cta_click", { label: "diagnostico", location: `case_${c.slug}` })
                }
                className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-semibold px-6 py-3.5 shadow-glow-primary"
              >
                Solicitar Diagnóstico <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  trackConversion("contact_cta_click", { location: `case_${c.slug}_cta` });
                  openFunnel(`case_${c.slug}_cta`);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-background text-foreground font-semibold px-6 py-3.5"
              >
                <MessageCircle className="w-4 h-4 text-primary" /> Iniciar diagnóstico
              </button>
            </div>
          </div>
        </section>

        {/* Outros cases */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 mt-20">
          <h2 className="text-2xl font-bold font-display">Outros cases</h2>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cases
              .filter((o) => o.slug !== c.slug)
              .slice(0, 3)
              .map((o) => (
                <Link
                  key={o.slug}
                  to="/cases/$slug"
                  params={{ slug: o.slug }}
                  className="group rounded-2xl border border-border overflow-hidden bg-card hover:shadow-elegant transition"
                >
                  <img
                    src={o.cover}
                    alt={o.brand}
                    width={1280}
                    height={800}
                    loading="lazy"
                    className="w-full aspect-[16/10] object-cover group-hover:scale-[1.02] transition"
                  />
                  <div className="p-4">
                    <div className="text-xs text-muted-foreground">{o.category}</div>
                    <div className="font-semibold mt-0.5">{o.brand}</div>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
