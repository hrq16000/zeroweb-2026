import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Compass, Gauge, LineChart, MapPin, Rocket, Search } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import {
  InstitutionalDiagnosticQuiz,
  InstitutionalDiagnosticQuizModal,
} from "@/components/site/InstitutionalDiagnosticQuiz";
import { trackEvent } from "@/lib/analytics";
import { getCapital, relatedCapitais, type Capital } from "@/lib/capitais";

const BASE = "https://0web.com.br/criacao-de-site-institucional";

function faqFor(c: Capital) {
  return [
    {
      q: `Vocês atendem empresas de ${c.name} presencialmente?`,
      a: `O atendimento é remoto, com reuniões por vídeo e WhatsApp — o mesmo processo usado com clientes de ${c.state} e do restante do Brasil. Isso mantém prazos previsíveis sem custo de deslocamento.`,
    },
    {
      q: `Quanto custa criar um site institucional em ${c.name}?`,
      a: "O investimento depende do número de páginas, integrações e produção de conteúdo. No diagnóstico gratuito indicamos a faixa compatível com o seu caso antes de qualquer proposta.",
    },
    {
      q: `O site vai aparecer nas buscas de ${c.name}?`,
      a: `Entregamos a base técnica de SEO local: páginas por serviço, dados estruturados, sitemap, títulos e descrições com referência a ${c.name}/${c.uf} e integração com o Google Meu Negócio. Posicionamento depende de conteúdo e tempo — não prometemos posição garantida.`,
    },
    {
      q: "O que preciso enviar para começar?",
      a: "Informações reais do negócio: serviços, diferenciais, fotos e canais de contato. Publicamos apenas o que pode ser comprovado — sem números, depoimentos ou selos inventados.",
    },
    {
      q: "O site é responsivo e rápido no celular?",
      a: "Sim. Performance e acessibilidade entram como requisito do projeto, com medição de Core Web Vitals após a publicação.",
    },
  ];
}

export const Route = createFileRoute("/criacao-de-site-institucional/$cidade")({
  loader: ({ params }) => {
    const capital = getCapital(params.cidade);
    if (!capital) throw notFound();
    return { capital, related: relatedCapitais(capital.slug) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Cidade não encontrada | 0WEB" }, { name: "robots", content: "noindex" }] };
    }
    const c = loaderData.capital;
    const url = `${BASE}/${c.slug}`;
    const title = `Criação de Site Institucional em ${c.name} (${c.uf}) | 0WEB`;
    const description = `Criação de site institucional em ${c.name} com estrutura de conversão, SEO local e funil de captura. Diagnóstico gratuito para empresas de ${c.name} e região.`;
    const faq = faqFor(c);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: `Criação de site institucional em ${c.name}`,
            serviceType: "Criação de site institucional",
            description,
            url,
            areaServed: {
              "@type": "City",
              name: c.name,
              containedInPlace: { "@type": "State", name: c.state },
            },
            provider: {
              "@type": "Organization",
              name: "0WEB",
              url: "https://0web.com.br",
              areaServed: { "@type": "Country", name: "Brasil" },
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "@id": `${url}#localbusiness`,
            name: `0WEB — Criação de Sites em ${c.name}`,
            url,
            description,
            priceRange: "$$",
            areaServed: { "@type": "City", name: c.name },
            address: {
              "@type": "PostalAddress",
              addressLocality: c.name,
              addressRegion: c.uf,
              addressCountry: "BR",
            },
            parentOrganization: { "@type": "Organization", name: "0WEB", url: "https://0web.com.br" },
            availableLanguage: ["pt-BR"],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Início", item: "https://0web.com.br/" },
              { "@type": "ListItem", position: 2, name: "Criação de site institucional", item: BASE },
              { "@type": "ListItem", position: 3, name: c.name, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: CapitalPage,
});

function CapitalPage() {
  const { capital: c, related } = Route.useLoaderData();
  const [modal, setModal] = useState(false);
  const faq = faqFor(c);

  const openModal = () => {
    trackEvent("contact_cta_click", { location: `institucional_${c.slug}`, label: "diagnostico" });
    setModal(true);
  };

  const benefits = [
    { icon: Search, title: `Busca local em ${c.name}`, text: `Títulos, descrições e dados estruturados com referência a ${c.name}/${c.uf}, integrados ao perfil do Google Meu Negócio.` },
    { icon: LineChart, title: "Contato rastreado", text: "Cada lead entra no painel com origem, página e campanha — dá para saber o que traz cliente." },
    { icon: Rocket, title: "Publicação em etapas", text: "O essencial entra no ar primeiro; o restante evolui sem travar o lançamento." },
    { icon: Gauge, title: "Leve no 4G", text: "Performance e acessibilidade como requisito, com medição de Core Web Vitals depois da publicação." },
  ];

  const steps = [
    { icon: Compass, title: "Diagnóstico gratuito", text: `Entendemos o negócio, o público em ${c.name} e o objetivo do site.` },
    { icon: CheckCircle2, title: "Proposta e escopo", text: "Páginas, funil, integrações e prazo por escrito — sem escopo aberto." },
    { icon: Rocket, title: "Implementação", text: "Design, conteúdo e desenvolvimento com aprovação por etapa." },
    { icon: LineChart, title: "Publicação e medição", text: "Rastreamento de conversões, Search Console e monitoramento contínuo." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Breadcrumbs
        items={[
          { name: "Criação de site institucional", path: "/criacao-de-site-institucional" },
          { name: c.name, path: `/criacao-de-site-institucional/${c.slug}` },
        ]}
      />

      <main className="pb-24">
        <section className="mx-auto max-w-6xl px-5 lg:px-8 pt-8 lg:pt-12">
          <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-10 items-start">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" /> {c.name} · {c.uf} · DDD {c.ddd}
              </p>
              <h1 className="mt-3 text-4xl sm:text-5xl font-bold font-display leading-tight">
                Criação de site institucional em{" "}
                <span className="text-gradient">{c.name}</span>
              </h1>
              <p className="mt-5 text-lg text-muted-foreground max-w-[60ch]">
                Sites institucionais para empresas de {c.name} e região metropolitana, com estrutura de conversão,
                SEO local e funil de captura ligado ao painel de leads. Atendimento remoto, escopo e prazo por
                escrito.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={openModal}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-semibold px-6 py-3.5 shadow-glow-primary"
                >
                  Diagnóstico gratuito <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#diagnostico-local"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 font-semibold"
                >
                  Responder na página
                </a>
              </div>
            </div>

            <div id="diagnostico-local" className="rounded-3xl border border-border bg-card shadow-elegant overflow-hidden scroll-mt-24">
              <InstitutionalDiagnosticQuiz
                source={`institucional-${c.slug}`}
                quizKey={`institucional-${c.slug}`}
                city={`${c.name}/${c.uf}`}
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 lg:px-8 mt-24">
          <h2 className="text-3xl sm:text-4xl font-bold font-display">
            O que a empresa de {c.name} recebe
          </h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((b) => (
              <article key={b.title} className="rounded-2xl border border-border bg-card p-5">
                <b.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                <h3 className="mt-3 font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 lg:px-8 mt-24">
          <h2 className="text-3xl sm:text-4xl font-bold font-display">Como funciona</h2>
          <ol className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs font-mono text-muted-foreground">0{i + 1}</span>
                <s.icon className="mt-2 w-5 h-5 text-primary" aria-hidden="true" />
                <h3 className="mt-3 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-4xl px-5 lg:px-8 mt-24">
          <h2 className="text-3xl sm:text-4xl font-bold font-display">
            Perguntas frequentes — {c.name}
          </h2>
          <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card">
            {faq.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="cursor-pointer font-semibold list-none flex items-center justify-between gap-4">
                  {f.q}
                  <ArrowRight className="w-4 h-4 shrink-0 transition group-open:rotate-90" aria-hidden="true" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 lg:px-8 mt-24">
          <h2 className="text-2xl font-bold font-display">Outras capitais atendidas</h2>
          <ul className="mt-4 flex flex-wrap gap-2 text-sm">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  to="/criacao-de-site-institucional/$cidade"
                  params={{ cidade: r.slug }}
                  className="inline-flex rounded-full border border-border px-4 py-2 hover:border-primary/50 transition"
                >
                  {r.name} · {r.uf}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/criacao-de-site-institucional"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            Ver a página nacional do serviço <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        <section className="mx-auto max-w-6xl px-5 lg:px-8 mt-24">
          <div className="rounded-3xl border border-border bg-card p-8 lg:p-12 text-center">
            <h2 className="text-3xl font-bold font-display">Comece pelo diagnóstico</h2>
            <p className="mt-3 text-muted-foreground max-w-[55ch] mx-auto">
              Gratuito e sem compromisso. Você recebe o formato recomendado para o seu negócio em {c.name}, a faixa de
              investimento estimada e os próximos passos.
            </p>
            <button
              type="button"
              onClick={openModal}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-semibold px-6 py-3.5 shadow-glow-primary"
            >
              Fazer diagnóstico gratuito <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      {/* CTA fixo da cidade — visitante local nunca fica sem caminho de contato. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Atendemos {c.name} · {c.uf}
          </p>
          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold px-5 py-2.5"
          >
            Falar com a 0WEB <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <InstitutionalDiagnosticQuizModal
        open={modal}
        onClose={() => setModal(false)}
        source={`institucional-${c.slug}-modal`}
        quizKey={`institucional-${c.slug}`}
        city={`${c.name}/${c.uf}`}
      />
      <Footer />
    </div>
  );
}
