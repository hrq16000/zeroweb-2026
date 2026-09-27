// Landing local /bairros-bh/$slug — agência de marketing digital por bairro de BH.
// Estratégia: copy comercial agressiva + LocalBusiness com coordenadas + BreadcrumbList + FAQPage
// + interlinking do silo (bairros vizinhos ↔ hub ↔ áreas de atendimento).
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, MapPin, Sparkles, TrendingUp } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ORIGIN, breadcrumbLd } from "@/lib/seo";
import { findBHNeighborhood, nearbyBHNeighborhoods, type BHNeighborhood } from "@/lib/bh-neighborhoods";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { localDeliverables, localFaq, localPlaceHasEvidence, localPublishedProjectsAtPlace, localProcessSteps } from "@/lib/local-page-enrichment";

const SERVICES = [
  { name: "Criação de Sites Profissionais", desc: "Sites institucionais e páginas estruturadas para apresentar oferta, conteúdo e caminhos de contato." },
  { name: "SEO Local", desc: "Otimização técnica e editorial para melhorar a compreensão e a descoberta orgânica do site." },
  { name: "Google Ads & Meta Ads", desc: "Campanhas que podem usar segmentação geográfica quando ela fizer sentido para a operação real do cliente." },
  { name: "Gestão de Redes Sociais", desc: "Planejamento e produção de conteúdo conforme canais, público e objetivos definidos." },
  { name: "Google Meu Negócio", desc: "Organização do perfil empresarial com dados reais, categorias, horários, fotos e área atendida." },
  { name: "Landing Pages de Alta Conversão", desc: "Páginas focadas em uma ação principal, com mensagem e fluxo de contato claros." },
];

function placeOf(n: BHNeighborhood) {
  return {
    slug: n.slug,
    name: n.name,
    city: "Belo Horizonte",
    region: n.region,
    vibe: n.vibe,
    typicalBusinesses: n.typicalBusinesses,
  };
}

function faqFor(n: BHNeighborhood) {
  const main = n.typicalBusinesses[0];
  return [
    {
      q: `Quanto custa contratar uma agência de marketing digital em ${n.name}?`,
      a: `O investimento depende do escopo. Projetos de site institucional e landing page são orçados por entrega, enquanto SEO local, Google Ads e gestão de redes sociais funcionam em mensalidade. Para empresas de ${n.name} montamos o orçamento a partir do diagnóstico gratuito, sem pacote fechado imposto.`,
    },
    {
      q: `Em quanto tempo minha empresa em ${n.name} aparece no Google?`,
      a: `Campanhas pagas com segmentação por raio no bairro começam a gerar contatos nos primeiros dias após a aprovação. SEO local e Google Meu Negócio dão os primeiros sinais entre 30 e 60 dias, com consolidação de posições a partir do terceiro mês.`,
    },
    {
      q: `Vocês atendem ${main} em ${n.name}?`,
      a: `Sim. ${n.name} é um ${n.vibe}, e trabalhamos exatamente com esse perfil: ${n.typicalBusinesses.join(", ")}. A pesquisa de palavras-chave é refeita para o seu segmento e para a concorrência real do bairro.`,
    },
    {
      q: `Preciso ter endereço em ${n.name} para ranquear no bairro?`,
      a: `Para SEO orgânico e anúncios com raio geográfico, não. Para disputar o pacote de mapas do Google, ter endereço ou declarar ${n.name} como área de serviço no Google Meu Negócio aumenta bastante a força do resultado.`,
    },
    {
      q: `O atendimento é presencial em ${n.name}?`,
      a: `Reuniões presenciais são possíveis em Belo Horizonte mediante agendamento. A operação do dia a dia é remota, com relatórios e acompanhamento periódico — o que mantém o custo previsível sem perder proximidade.`,
    },
  ];
}


export const Route = createFileRoute("/bairros-bh/$slug")({
  loader: ({ params }) => {
    const bairro = findBHNeighborhood(params.slug);
    if (!bairro) throw notFound();
    const place = placeOf(bairro);
    return { bairro, hasEvidence: localPlaceHasEvidence(place) };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Bairros BH | 0WEB" }] };
    const { bairro: n, hasEvidence } = loaderData;
    const url = `${ORIGIN}/bairros-bh/${params.slug}`;
    const title = `Marketing digital para empresas em ${n.name} | 0web`;
    const description = `Atendimento remoto de marketing digital para empresas em ${n.name}, Belo Horizonte. Conheça serviços, referências publicadas e o processo da 0WEB.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "pt_BR" },
        { name: "robots", content: hasEvidence ? "index,follow,max-image-preview:large" : "noindex,follow" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${ORIGIN}/#organization`,
                name: "0WEB",
                url: ORIGIN,
                areaServed: "BR",
              },
              {
                "@type": "Service",
                "@id": `${url}#service`,
                name: `Marketing digital para empresas em ${n.name}`,
                serviceType: "Marketing digital e criação de presença digital",
                provider: { "@id": `${ORIGIN}/#organization` },
                areaServed: { "@type": "Place", name: `${n.name}, Belo Horizonte, MG` },
              },
              breadcrumbLd([
                { name: "Início", path: "/" },
                { name: "Áreas de Atendimento", path: "/areas-de-atendimento" },
                { name: "Bairros BH", path: "/bairros-bh" },
                { name: n.name, path: `/bairros-bh/${params.slug}` },
              ]),
              {
                "@type": "FAQPage",
                "@id": `${url}#faq`,
                mainEntity: faqFor(n).map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
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
  const place = placeOf(n);
  const deliverables = localDeliverables(place);
  const steps = localProcessSteps(place);
  const projects = localPublishedProjectsAtPlace(place);
  const faq = localFaq(place);
  const nearby = nearbyBHNeighborhoods(n.slug, 6);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Breadcrumbs
        items={[
          { name: "Início", path: "/" },
          { name: "Áreas de Atendimento", path: "/areas-de-atendimento" },
          { name: "Bairros BH", path: "/bairros-bh" },
          { name: n.name, path: `/bairros-bh/${n.slug}` },
        ]}
      />


      <main>
        {/* HERO */}
        <section className="relative pt-12 lg:pt-20 pb-16 bg-hero overflow-hidden">
          <div className="absolute inset-0 bg-mesh opacity-50 pointer-events-none" />
          <div className="relative mx-auto max-w-5xl px-5 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-accent" /> {n.name} · Belo Horizonte · {n.region}
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Marketing digital para empresas em{" "}
              <span className="text-gradient">{n.name}</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
              A 0WEB atende remotamente empresas de {n.name} com criação de sites, presença digital e ações de marketing definidas conforme o escopo real do negócio.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <FunnelCTAButton
                intent={{ purpose: "proposal", source: `bairro_bh_${n.slug}`, pagePath: `/bairros-bh/${n.slug}`, placement: "hero", citySlug: n.slug }}
                label="Solicitar Orçamento"
                location={`bairro_bh_${n.slug}`}
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

        {/* SOBRE O BAIRRO */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-5 lg:px-8">
            <h2 className="text-3xl font-bold font-display">Marketing digital pensado para empresas de {n.name}</h2>
            <div className="mt-6 space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                <strong className="text-foreground">{n.name}</strong> é um {n.vibe}. O contexto local pode ser relevante para conteúdo, anúncios e páginas de serviço quando isso corresponde à operação real do negócio.
              </p>
              <p>
                A 0web atende remotamente empresas de {n.name}, usando informações reais do negócio e da área que ele efetivamente atende.</p>
              <p>
                Os perfis comuns na região incluem {n.typicalBusinesses.slice(0, -1).join(", ")} e {n.typicalBusinesses.slice(-1)[0]}; isso serve como contexto editorial, não como prova de clientes atendidos.
              </p>
            </div>
          </div>
        </section>

        {/* SERVIÇOS */}
        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <h2 className="text-3xl font-bold font-display">Serviços para empresas em {n.name}</h2>
            <p className="mt-3 text-muted-foreground">Serviços digitais que podem ser combinados conforme a necessidade do negócio.</p>
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

        {/* ENTREGAS */}
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

        {/* PROCESSO */}
        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-4xl px-5 lg:px-8">
            <h2 className="text-3xl font-bold font-display">Como trabalhamos em {n.name}</h2>
            <ol className="mt-8 space-y-5">
              {steps.map((p) => (
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
              <h2 className="text-3xl font-bold font-display">Sites no ar em Belo Horizonte</h2>
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

        {/* FAQ */}
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

        {/* BAIRROS VIZINHOS — interlinking do silo */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <h2 className="text-3xl font-bold font-display">Também atendemos perto de {n.name}</h2>
            <p className="mt-3 text-muted-foreground">
              Bairros vizinhos da região {n.region} e arredores com estratégia local dedicada.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {nearby.map((v) => (
                <Link
                  key={v.slug}
                  to="/bairros-bh/$slug"
                  params={{ slug: v.slug }}
                  className="group rounded-2xl border border-border bg-card p-5 hover:border-primary hover:shadow-elegant transition"
                >
                  <div className="flex items-center gap-2 text-primary">
                    <MapPin className="w-4 h-4" />
                    <span className="font-semibold">Marketing digital no {v.name}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{v.vibe}</p>
                </Link>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
              <Link to="/bairros-bh" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                Ver todos os 30 bairros de BH <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/areas-de-atendimento" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                Todas as áreas de atendimento <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>



        {/* CTA FINAL */}
        <section className="py-20 bg-foreground text-background">
          <div className="mx-auto max-w-3xl px-5 lg:px-8 text-center">
            <Sparkles className="w-8 h-8 text-accent mx-auto" />
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold font-display">
              Estruture a presença digital do seu negócio em {n.name}.
            </h2>
            <p className="mt-4 text-background/70 text-lg">
              Use o funil para registrar o contexto do projeto e avançar para uma proposta compatível com o escopo.
            </p>
            <FunnelCTAButton
              intent={{ purpose: "proposal", source: `bairro_bh_${n.slug}_final`, pagePath: `/bairros-bh/${n.slug}`, placement: "section", citySlug: n.slug }}
              label="Descrever meu projeto"
              location={`bairro_bh_${n.slug}_final`}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-semibold px-7 py-4 shadow-glow-primary"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
