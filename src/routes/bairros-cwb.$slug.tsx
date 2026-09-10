// Landing local /bairros-cwb/$slug — agência em Curitiba + RMC por bairro.
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, MapPin, MessageCircle, Sparkles, TrendingUp } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ORIGIN, breadcrumbLd } from "@/lib/seo";
import { findCWBNeighborhood, CWB_NEIGHBORHOODS, type CWBNeighborhood } from "@/lib/curitiba-neighborhoods";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { localDeliverables, localFaq, localPortfolioProjects, localProcessSteps } from "@/lib/local-page-enrichment";

const SERVICES = [
  { name: "Criação de Sites Profissionais", desc: "Sites rápidos, otimizados e prontos para converter visitantes em clientes." },
  { name: "SEO Local", desc: "Apareça no topo do Google quando alguém busca seu serviço no bairro." },
  { name: "Google Ads & Meta Ads", desc: "Campanhas segmentadas por raio geográfico para atrair vizinhos qualificados." },
  { name: "Gestão de Redes Sociais", desc: "Conteúdo estratégico que constrói autoridade local e gera engajamento real." },
  { name: "Google Meu Negócio", desc: "Perfil otimizado para receber ligações, rotas e avaliações 5★." },
  { name: "Landing Pages de Alta Conversão", desc: "Páginas focadas em uma única ação: virar lead." },
];

function nearbyCWB(n: CWBNeighborhood) {
  return CWB_NEIGHBORHOODS.filter((o) => o.slug !== n.slug)
    .sort((a, b) => {
      const score = (x: CWBNeighborhood) => (x.city === n.city ? 0 : 1) + (x.region === n.region ? 0 : 2);
      return score(a) - score(b);
    })
    .slice(0, 6);
}

export const Route = createFileRoute("/bairros-cwb/$slug")({
  loader: ({ params }) => {
    const bairro = findCWBNeighborhood(params.slug);
    if (!bairro) throw notFound();
    return { bairro };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Bairros Curitiba | 0WEB" }] };
    const n = loaderData.bairro;
    const url = `${ORIGIN}/bairros-cwb/${params.slug}`;
    const title = `Agência de Marketing Digital em ${n.name} | 0web`;
    const description = `Agência de marketing digital em ${n.name}, ${n.city}. Sites, SEO local, Google Ads e gestão de redes sociais para empresas do bairro. Solicite orçamento.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "pt_BR" },
        { name: "geo.region", content: "BR-PR" },
        { name: "geo.placename", content: `${n.name}, ${n.city}` },
        { name: "geo.position", content: `${n.geo[0]};${n.geo[1]}` },
        { name: "ICBM", content: `${n.geo[0]}, ${n.geo[1]}` },
        { name: "robots", content: "index, follow, max-image-preview:large" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "LocalBusiness",
                "@id": `${url}#localbusiness`,
                name: `0web — Agência de Marketing Digital em ${n.name}`,
                description,
                url,
                image: `${ORIGIN}/favicon.ico`,
                priceRange: "$$",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: n.city,
                  addressRegion: "PR",
                  addressCountry: "BR",
                  streetAddress: `Bairro ${n.name}`,
                },
                geo: { "@type": "GeoCoordinates", latitude: n.geo[0], longitude: n.geo[1] },
                areaServed: { "@type": "Place", name: `${n.name}, ${n.city}, PR` },
                openingHoursSpecification: [{
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "09:00",
                  closes: "18:00",
                }],
              },
              breadcrumbLd([
                { name: "Início", path: "/" },
                { name: "Bairros Curitiba/RMC", path: "/bairros-cwb" },
                { name: n.name, path: `/bairros-cwb/${params.slug}` },
              ]),
            ],
          }),
        },
      ],
    };
  },
  component: BairroPage,
});

function BairroPage() {
  const { bairro: n } = Route.useLoaderData();
  const deliverables = localDeliverables(n);
  const process = localProcessSteps(n);
  const faq = localFaq(n);
  const projects = localPortfolioProjects(n.city);
  const nearby = nearbyCWB(n);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Breadcrumbs
        items={[
          { name: "Início", path: "/" },
          { name: "Bairros Curitiba/RMC", path: "/bairros-cwb" },
          { name: n.name, path: `/bairros-cwb/${n.slug}` },
        ]}
      />

      <main>
        <section className="relative pt-12 lg:pt-20 pb-16 bg-hero overflow-hidden">
          <div className="absolute inset-0 bg-mesh opacity-50 pointer-events-none" />
          <div className="relative mx-auto max-w-5xl px-5 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-accent" /> {n.name} · {n.city} · {n.region}
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Agência de Marketing Digital em{" "}
              <span className="text-gradient">{n.name}</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
              Mais clientes do seu bairro, todos os dias. A 0web posiciona empresas de {n.name} no topo do Google e transforma buscas locais em vendas reais.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <FunnelCTAButton
                intent={{ purpose: "proposal", source: `bairro_cwb_${n.slug}`, pagePath: `/bairros-cwb/${n.slug}`, placement: "hero", citySlug: n.slug }}
                label="Solicitar Orçamento"
                location={`bairro_cwb_${n.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-semibold px-6 py-3.5 shadow-glow-primary hover:opacity-95 transition"
              />
              <Link to="/servicos" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 font-semibold hover:bg-muted transition">
                Ver Todos os Serviços
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-5 lg:px-8">
            <h2 className="text-3xl font-bold font-display">Marketing digital pensado para empresas de {n.name}</h2>
            <div className="mt-6 space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                <strong className="text-foreground">{n.name}</strong> é {n.vibe}. Quem empreende aqui sabe: a concorrência é local, o cliente está perto, e quem aparece primeiro no Google ganha o telefonema.
              </p>
              <p>
                A 0web atende empresas de {n.name} ({n.city}) com estratégia de marketing local desenhada para captar quem mora, trabalha e consome no bairro — não tráfego inflado que não vira venda.
              </p>
              <p>
                Trabalhamos com {n.typicalBusinesses.slice(0, -1).join(", ")} e {n.typicalBusinesses.slice(-1)[0]}, entregando previsibilidade de leads, autoridade no Google e presença digital impecável.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <h2 className="text-3xl font-bold font-display">Serviços para empresas em {n.name}</h2>
            <p className="mt-3 text-muted-foreground">Tudo o que sua empresa precisa para dominar o mercado local.</p>
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SERVICES.map((s) => (
                <div key={s.name} className="rounded-2xl border border-border bg-card p-6 hover:border-primary transition">
                  <Check className="w-5 h-5 text-primary" />
                  <h3 className="mt-3 font-semibold text-lg">{s.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <h2 className="text-3xl font-bold font-display">O que entregamos para negócios de {n.name}</h2>
            <p className="mt-3 text-muted-foreground">Escopo montado a partir do comércio que existe no bairro.</p>
            <div className="mt-10 grid md:grid-cols-2 gap-5">
              {deliverables.map((d) => (
                <div key={d.title} className="rounded-2xl border border-border bg-card p-6">
                  <TrendingUp className="w-6 h-6 text-accent" />
                  <h3 className="mt-3 font-semibold text-lg">{d.title}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{d.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-4xl px-5 lg:px-8">
            <h2 className="text-3xl font-bold font-display">Como trabalhamos em {n.name}</h2>
            <ol className="mt-8 space-y-5">
              {process.map((p) => (
                <li key={p.step} className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-semibold text-lg">{p.step}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{p.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {projects.length > 0 && (
          <section className="py-16">
            <div className="mx-auto max-w-5xl px-5 lg:px-8">
              <h2 className="text-3xl font-bold font-display">Sites no ar em {n.city}</h2>
              <p className="mt-3 text-muted-foreground">Projetos publicados pela 0web na mesma cidade de {n.name}.</p>
              <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((p) => (
                  <Link
                    key={p.slug}
                    to="/portfolio/$slug"
                    params={{ slug: p.slug }}
                    className="rounded-2xl border border-border bg-card p-5 hover:border-primary transition"
                  >
                    <div className="font-semibold">{p.title}</div>
                    {p.summary && <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.summary}</p>}
                  </Link>
                ))}
              </div>
              <Link to="/portfolio" className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                Ver todo o portfólio <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-3xl px-5 lg:px-8">
            <h2 className="text-3xl font-bold font-display">Perguntas frequentes sobre marketing digital em {n.name}</h2>
            <div className="mt-8 space-y-4">
              {faq.map((f) => (
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

        <section className="py-16">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <h2 className="text-3xl font-bold font-display">Também atendemos perto de {n.name}</h2>
            <p className="mt-3 text-muted-foreground">Bairros e cidades vizinhas com página local dedicada.</p>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {nearby.map((v) => (
                <Link
                  key={v.slug}
                  to="/bairros-cwb/$slug"
                  params={{ slug: v.slug }}
                  className="group rounded-2xl border border-border bg-card p-5 hover:border-primary transition"
                >
                  <div className="flex items-center gap-2 text-primary">
                    <MapPin className="w-4 h-4" />
                    <span className="font-semibold">{v.name} · {v.city}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{v.vibe}</p>
                </Link>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
              <Link to="/bairros-cwb" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                Ver todos os bairros de Curitiba e RMC <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/areas-de-atendimento" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                Todas as áreas de atendimento <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>


        <section className="py-20 bg-foreground text-background">
          <div className="mx-auto max-w-3xl px-5 lg:px-8 text-center">
            <Sparkles className="w-8 h-8 text-accent mx-auto" />
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold font-display">
              Sua empresa em {n.name} merece ser a primeira escolha do bairro.
            </h2>
            <p className="mt-4 text-background/70 text-lg">
              Solicite agora um diagnóstico gratuito. Em 24h você recebe um plano com o que falta para sua empresa dominar o Google em {n.name}.
            </p>
            <FunnelCTAButton
              intent={{ purpose: "proposal", source: `bairro_cwb_${n.slug}_final`, pagePath: `/bairros-cwb/${n.slug}`, placement: "section", citySlug: n.slug }}
              label="Falar com um especialista agora"
              location={`bairro_cwb_${n.slug}_final`}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-semibold px-7 py-4 shadow-glow-primary"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
