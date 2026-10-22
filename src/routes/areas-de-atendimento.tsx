// Hub-mãe /areas-de-atendimento — topo do silo geográfico.
// Liga BH (30 bairros), Curitiba/RMC, cidades e estados atendidos.
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, MapPin, Sparkles, Globe2 } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ORIGIN, breadcrumbLd } from "@/lib/seo";
import { BH_NEIGHBORHOODS } from "@/lib/bh-neighborhoods";
import { CWB_NEIGHBORHOODS } from "@/lib/curitiba-neighborhoods";
import { localPlaceHasEvidence } from "@/lib/local-page-enrichment";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { SATELLITES as SITES_ROBUSTOS } from "@/lib/sites-robustos";

const TITLE = "Áreas de Atendimento Remoto | 0WEB";
const DESC =
  "Atendimento remoto da 0WEB em todo o Brasil. Páginas locais são destacadas apenas onde já existem projetos publicados que comprovam aquela localidade.";
const URL = `${ORIGIN}/areas-de-atendimento`;

const FAQ = [
  {
    q: "A 0WEB atende empresas fora de Curitiba e Belo Horizonte?",
    a: "Sim. O atendimento descrito neste portal é remoto e pode alcançar empresas de qualquer região do Brasil. Páginas locais indexáveis são destacadas somente onde já existe evidência publicada.",
  },
  {
    q: "Por que algumas localidades têm página própria e outras não?",
    a: "Uma página local só deve ser promovida quando há projeto publicado ou outra evidência suficiente para sustentar aquele contexto. Sem essa prova, o atendimento remoto continua disponível, mas a página local não é tratada como ativo de indexação.",
  },
  {
    q: "Preciso ter endereço físico no bairro para aparecer em buscas locais?",
    a: "Endereço e área de serviço devem representar a operação real do negócio. Regras de mapas e busca local variam por plataforma e categoria; não criamos localização fictícia para tentar melhorar posicionamento.",
  },
  {
    q: "Como escolho a página da minha região?",
    a: "Use as localidades destacadas abaixo quando houver uma página comprovada. Se a sua cidade ou bairro não estiver listado, o funil continua disponível para atendimento remoto.",
  },
  {
    q: "O escopo é igual em todas as regiões?",
    a: "Não necessariamente. O escopo depende do negócio, objetivo, conteúdo disponível, integrações e canais contratados. A localização só entra quando ela é relevante para o projeto.",
  },
];

export const Route = createFileRoute("/areas-de-atendimento")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              ...breadcrumbLd([
                { name: "Início", path: "/" },
                { name: "Áreas de Atendimento", path: "/areas-de-atendimento" },
              ]),
            },
            {
              "@type": "FAQPage",
              "@id": `${URL}#faq`,
              mainEntity: FAQ.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }),
      },
    ],
  }),
  component: AreasPage,
});

function AreasPage() {
  const bhEvidenced = BH_NEIGHBORHOODS
    .map((place) => ({ ...place, city: "Belo Horizonte" }))
    .filter((place) => localPlaceHasEvidence(place));
  const bhByRegion = bhEvidenced.reduce<Record<string, typeof BH_NEIGHBORHOODS>>((acc, n) => {
    (acc[n.region] ||= []).push(n);
    return acc;
  }, {});

  const cwbEvidenced = CWB_NEIGHBORHOODS.filter((place) => localPlaceHasEvidence(place));
  const cwbByCity = cwbEvidenced.reduce<Record<string, typeof CWB_NEIGHBORHOODS>>((acc, n) => {
    (acc[n.city] ||= []).push(n);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Breadcrumbs
        items={[
          { name: "Início", path: "/" },
          { name: "Áreas de Atendimento", path: "/areas-de-atendimento" },
        ]}
      />

      <main>
        {/* HERO */}
        <section className="relative pt-12 lg:pt-20 pb-14 bg-hero overflow-hidden">
          <div className="absolute inset-0 bg-mesh opacity-50 pointer-events-none" />
          <div className="relative mx-auto max-w-5xl px-5 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold">
              <Globe2 className="w-3.5 h-3.5 text-accent" /> Cobertura nacional · Atendimento remoto
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Áreas de <span className="text-gradient">Atendimento</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
              A 0WEB atende remotamente em todo o Brasil. As localidades destacadas nesta página aparecem porque já possuem projetos publicados que sustentam o contexto local.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <FunnelCTAButton
                intent={{ purpose: "proposal", source: "areas_atendimento", pagePath: "/areas-de-atendimento", placement: "hero" }}
                label="Solicitar Orçamento"
                location="areas_atendimento_hero"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-semibold px-6 py-3.5 shadow-glow-primary hover:opacity-95 transition"
              />
              <Link
                to="/servicos"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 font-semibold hover:bg-muted transition"
              >
                Ver Serviços
              </Link>
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section className="py-14">
          <div className="mx-auto max-w-4xl px-5 lg:px-8 space-y-4 text-lg leading-relaxed text-muted-foreground">
            <h2 className="text-3xl font-bold font-display text-foreground">
              Contexto local só deve ser usado quando é real
            </h2>
            <p>
              A localização pode influenciar conteúdo, campanhas e páginas de serviço, mas isso depende da operação real do negócio. Não tratamos bairro ou cidade como prova automática de experiência.
            </p>
            <p>
              Por isso as páginas locais do portal são governadas por evidência. Quando existe projeto publicado que sustenta uma localidade, ela pode ganhar uma página indexável e interligada ao restante da malha.
            </p>
            <p>
              Se a sua região ainda não tem página própria, o atendimento remoto continua disponível pelo funil.
            </p>
          </div>
        </section>

        {/* BELO HORIZONTE */}
        <section className="py-14 bg-muted/30">
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-3xl font-bold font-display">Belo Horizonte · localidades comprovadas</h2>
                <p className="mt-2 text-muted-foreground">
                  Somente localidades com projeto publicado são destacadas.
                </p>
              </div>
              <Link
                to="/bairros-bh"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                Ver hub de bairros de BH <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-8 space-y-7">
              {Object.entries(bhByRegion).map(([region, items]) => (
                <div key={region}>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {region}
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {items.map((n) => (
                      <li key={n.slug}>
                        <Link
                          to="/bairros-bh/$slug"
                          params={{ slug: n.slug }}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm hover:border-primary hover:text-primary transition"
                        >
                          <MapPin className="w-3.5 h-3.5" /> {n.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CURITIBA */}
        <section className="py-14">
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-3xl font-bold font-display">Curitiba e Região Metropolitana</h2>
                <p className="mt-2 text-muted-foreground">
                  Somente bairros e localidades com projeto publicado são destacados.
                </p>
              </div>
              <Link
                to="/bairros-cwb"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                Ver hub de Curitiba <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-8 space-y-7">
              {Object.entries(cwbByCity).map(([city, items]) => (
                <div key={city}>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {city}
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {items.map((n) => (
                      <li key={n.slug}>
                        <Link
                          to="/bairros-cwb/$slug"
                          params={{ slug: n.slug }}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm hover:border-primary hover:text-primary transition"
                        >
                          <MapPin className="w-3.5 h-3.5" /> {n.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CIDADES E ESTADOS */}
        <section className="py-14 bg-muted/30">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <h2 className="text-3xl font-bold font-display">Outras regiões do Brasil</h2>
            <p className="mt-2 text-muted-foreground">
              Atendimento remoto disponível; páginas locais só são promovidas quando há evidência publicada.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-5">
              <Link
                to="/cidades"
                className="group rounded-2xl border border-border bg-card p-6 hover:border-primary hover:shadow-elegant transition"
              >
                <Building2 className="w-6 h-6 text-primary" />
                <h3 className="mt-3 text-lg font-semibold">Cidades atendidas</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Cidades com páginas locais qualificadas por evidência publicada.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Ver cidades <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </span>
              </Link>
              <Link
                to="/estados"
                className="group rounded-2xl border border-border bg-card p-6 hover:border-primary hover:shadow-elegant transition"
              >
                <Globe2 className="w-6 h-6 text-primary" />
                <h3 className="mt-3 text-lg font-semibold">Estados atendidos</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Estados que já possuem ao menos uma cidade com página local qualificada.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Ver estados <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* LEIA TAMBÉM — cluster Sites Robustos */}
        <section className="py-14 border-t border-border">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <h2 className="text-3xl font-bold font-display">Leia também</h2>
            <p className="mt-3 text-muted-foreground">
              Antes de escolher a região, entenda o que sustenta um projeto que realmente performa.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              <li>
                <Link
                  to="/sites-robustos"
                  className="block h-full rounded-2xl border border-border bg-card p-5 hover:bg-muted transition"
                >
                  <span className="font-semibold">Guia de criação de sites robustos</span>
                  <span className="mt-2 block text-sm text-muted-foreground">
                    As cinco camadas de um site que carrega rápido, ranqueia e converte.
                  </span>
                </Link>
              </li>
              {SITES_ROBUSTOS.map((s) => (
                <li key={s.slug}>
                  <Link
                    to="/sites-robustos/$slug"
                    params={{ slug: s.slug }}
                    className="block h-full rounded-2xl border border-border bg-card p-5 hover:bg-muted transition"
                  >
                    <span className="font-semibold">{s.h1}</span>
                    <span className="mt-2 block text-sm text-muted-foreground">Ler sobre {s.anchor}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14">
          <div className="mx-auto max-w-3xl px-5 lg:px-8">
            <h2 className="text-3xl font-bold font-display">Perguntas frequentes</h2>
            <div className="mt-8 space-y-4">
              {FAQ.map((f) => (
                <details key={f.q} className="group rounded-2xl border border-border bg-card p-5">
                  <summary className="cursor-pointer list-none font-semibold flex items-start justify-between gap-4">
                    {f.q}
                    <ArrowRight className="w-4 h-4 mt-1 shrink-0 text-primary group-open:rotate-90 transition" />
                  </summary>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20 bg-foreground text-background">
          <div className="mx-auto max-w-3xl px-5 lg:px-8 text-center">
            <Sparkles className="w-8 h-8 text-accent mx-auto" />
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold font-display">
              Não achou a sua região na lista?
            </h2>
            <p className="mt-4 text-background/70 text-lg">
              Use o funil para descrever sua região, objetivo e escopo. A proposta de atendimento é definida a partir das informações reais do seu negócio.
            </p>
            <FunnelCTAButton
              intent={{ purpose: "proposal", source: "areas_atendimento_final", pagePath: "/areas-de-atendimento", placement: "section" }}
              label="Descrever minha necessidade"
              location="areas_atendimento_final"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-semibold px-7 py-4 shadow-glow-primary"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
