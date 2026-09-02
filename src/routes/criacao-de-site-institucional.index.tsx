import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Compass, Gauge, LineChart, Layers, Rocket, Search } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import {
  InstitutionalDiagnosticQuiz,
  InstitutionalDiagnosticQuizModal,
} from "@/components/site/InstitutionalDiagnosticQuiz";
import { trackEvent } from "@/lib/analytics";
import { capitaisPorRegiao } from "@/lib/capitais";

const CANONICAL = "https://0web.com.br/criacao-de-site-institucional";
const TITLE = "Criação de Site Institucional que Gera Contatos | 0WEB";
const DESCRIPTION =
  "Criação de site institucional com estrutura de conversão, funil de captura e base de SEO. Faça o diagnóstico gratuito e receba o formato certo para o seu negócio.";

const FAQ: { q: string; a: string }[] = [
  {
    q: "Quanto custa criar um site institucional?",
    a: "O investimento varia conforme número de páginas, integrações e produção de conteúdo. Projetos de escopo enxuto começam em faixas menores; sites com funil, SEO e integrações exigem escopo maior. No diagnóstico gratuito indicamos a faixa compatível com o seu caso antes de qualquer proposta.",
  },
  {
    q: "Em quanto tempo o site fica pronto?",
    a: "Depende do escopo e da velocidade de aprovação de conteúdo. Estruturas simples costumam ficar prontas em poucas semanas; projetos com integrações e produção de textos e imagens levam mais tempo. O prazo é sempre condicionado à entrega de material pelo cliente.",
  },
  {
    q: "Site institucional serve para gerar clientes ou é só apresentação?",
    a: "Serve para os dois, desde que a estrutura seja pensada para conversão: proposta clara, prova real, páginas de serviço específicas e caminhos de contato rastreados. Sem isso, o site vira apenas um cartão de visitas online.",
  },
  {
    q: "O site já vem otimizado para o Google?",
    a: "Entregamos a base técnica de SEO: títulos e descrições por página, estrutura semântica, dados estruturados, sitemap, performance e URLs estáveis. Posicionamento é resultado de conteúdo e tempo — não prometemos posição garantida.",
  },
  {
    q: "Preciso refazer meu site atual ou dá para melhorar?",
    a: "Nem sempre é preciso refazer. Quando a base técnica é sólida, evoluir estrutura, conteúdo e funil costuma custar menos. O diagnóstico aponta qual dos dois caminhos faz sentido.",
  },
  {
    q: "Vocês cuidam do conteúdo e das imagens?",
    a: "Sim, com participação do cliente. Trabalhamos com informação real do negócio — não publicamos números, depoimentos ou selos sem comprovação.",
  },
];

const STEPS = [
  { icon: Compass, title: "Diagnóstico", text: "Entendemos o negócio, o público e o objetivo do site. Você recebe o formato recomendado e a faixa de investimento." },
  { icon: Layers, title: "Proposta e escopo", text: "Definimos páginas, funil, integrações e prazo — tudo por escrito, sem escopo aberto." },
  { icon: Rocket, title: "Implementação", text: "Design, conteúdo e desenvolvimento com revisões por etapa e ambiente de aprovação." },
  { icon: LineChart, title: "Publicação e medição", text: "Publicamos com rastreamento de conversões, Search Console e monitoramento de performance." },
  { icon: Gauge, title: "Suporte e evolução", text: "Acompanhamos os dados e priorizamos ajustes por impacto: páginas com tráfego e baixa conversão primeiro." },
];

const BENEFITS = [
  { icon: Search, title: "Encontrável", text: "Estrutura por serviço e por região, com metadados e dados estruturados desde o primeiro dia." },
  { icon: LineChart, title: "Mensurável", text: "Cada contato entra no painel com origem, página e campanha — dá para saber o que gera lead." },
  { icon: Rocket, title: "Rápido de publicar", text: "Escopo fatiado: o essencial entra no ar antes, o restante evolui sem travar o lançamento." },
  { icon: Gauge, title: "Leve e estável", text: "Performance e acessibilidade tratadas como requisito, não como ajuste posterior." },
];

const PROOF: { slug: string; label: string; segment: string }[] = [
  { slug: "premium-envelopamentos", label: "Premium Envelopamentos", segment: "Comunicação visual" },
  { slug: "emporio-lelecute", label: "Empório Lelecute", segment: "Alimentação" },
  { slug: "rm-fretes", label: "RM Fretes", segment: "Logística" },
  { slug: "marido-de-aluguel", label: "Marido de Aluguel", segment: "Serviços residenciais" },
];

export const Route = createFileRoute("/criacao-de-site-institucional/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Criação de site institucional",
          serviceType: "Criação de site institucional",
          description: DESCRIPTION,
          url: CANONICAL,
          areaServed: { "@type": "Country", name: "Brasil" },
          provider: { "@type": "Organization", name: "0WEB", url: "https://0web.com.br" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
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
            { "@type": "ListItem", position: 2, name: "Serviços", item: "https://0web.com.br/servicos" },
            { "@type": "ListItem", position: 3, name: "Criação de site institucional", item: CANONICAL },
          ],
        }),
      },
    ],
  }),
  component: InstitutionalSitePage,
});

function InstitutionalSitePage() {
  const [modal, setModal] = useState(false);

  const openModal = () => {
    trackEvent("contact_cta_click", { location: "institucional_hero_modal", label: "diagnostico" });
    setModal(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Breadcrumbs
        items={[
          { name: "Serviços", path: "/servicos" },
          { name: "Criação de site institucional", path: "/criacao-de-site-institucional" },
        ]}
      />

      <main className="pb-24">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-5 lg:px-8 pt-8 lg:pt-12">
          <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-10 items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Criação de site institucional
              </p>
              <h1 className="mt-3 text-4xl sm:text-5xl font-bold font-display leading-tight">
                Um site institucional que <span className="text-gradient">apresenta a empresa e gera contato</span>
              </h1>
              <p className="mt-5 text-lg text-muted-foreground max-w-[60ch]">
                Estrutura de páginas pensada para busca e conversão, funil de captura integrado ao painel de leads e
                base técnica de SEO. Comece pelo diagnóstico gratuito: em 6 perguntas indicamos o formato certo e a
                faixa de investimento — sem compromisso.
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
                  href="#diagnostico-institucional"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 font-semibold"
                >
                  Agende diagnóstico na página
                </a>
              </div>
              <ul className="mt-8 grid sm:grid-cols-2 gap-2 text-sm">
                {[
                  "Escopo e prazo definidos por escrito",
                  "Cada lead rastreado por origem e página",
                  "Base de SEO técnica inclusa",
                  "Evolução por dados após a publicação",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div id="diagnostico-institucional" className="rounded-3xl border border-border bg-card shadow-elegant overflow-hidden scroll-mt-24">
              <InstitutionalDiagnosticQuiz source="criacao-site-institucional" />
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section className="mx-auto max-w-6xl px-5 lg:px-8 mt-24">
          <h2 className="text-3xl sm:text-4xl font-bold font-display">
            O que muda em relação a um site “só bonito”
          </h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BENEFITS.map((b) => (
              <article key={b.title} className="rounded-2xl border border-border bg-card p-5">
                <b.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                <h3 className="mt-3 font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Como funciona */}
        <section className="mx-auto max-w-6xl px-5 lg:px-8 mt-24">
          <h2 className="text-3xl sm:text-4xl font-bold font-display">Como funciona</h2>
          <ol className="mt-8 grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs font-mono text-muted-foreground">0{i + 1}</span>
                <s.icon className="mt-2 w-5 h-5 text-primary" aria-hidden="true" />
                <h3 className="mt-3 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Provas reais */}
        <section className="mx-auto max-w-6xl px-5 lg:px-8 mt-24">
          <h2 className="text-3xl sm:text-4xl font-bold font-display">Projetos publicados</h2>
          <p className="mt-3 text-muted-foreground max-w-[65ch]">
            Sites de clientes que estão no ar, hospedados e mantidos pela 0WEB. Você pode navegar por cada um antes de
            decidir.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROOF.map((p) => (
              <Link
                key={p.slug}
                to="/portfolio/$slug"
                params={{ slug: p.slug }}
                className="rounded-2xl border border-border bg-card p-5 hover:border-primary/50 transition"
              >
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{p.segment}</p>
                <p className="mt-2 font-semibold">{p.label}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary">
                  Ver projeto <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
          <Link to="/portfolio" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            Ver todos os projetos <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-4xl px-5 lg:px-8 mt-24">
          <h2 className="text-3xl sm:text-4xl font-bold font-display">Perguntas frequentes</h2>
          <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card">
            {FAQ.map((f) => (
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

        {/* Conteúdo relacionado */}
        <section className="mx-auto max-w-6xl px-5 lg:px-8 mt-24">
          <h2 className="text-2xl font-bold font-display">Leituras que ajudam na decisão</h2>
          <ul className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
            <li>
              <Link to="/blog/sites" className="text-primary font-medium hover:underline">
                Conteúdos sobre criação de sites
              </Link>
            </li>
            <li>
              <Link to="/blog/conversao" className="text-primary font-medium hover:underline">
                Conteúdos sobre conversão
              </Link>
            </li>
            <li>
              <Link to="/servicos/$slug" params={{ slug: "criacao-de-sites" }} className="text-primary font-medium hover:underline">
                Serviço de criação de sites
              </Link>
            </li>
            <li>
              <Link to="/servicos/google-meu-negocio" className="text-primary font-medium hover:underline">
                Google Meu Negócio
              </Link>
            </li>
          </ul>
        </section>

        {/* CTA final */}
        <section className="mx-auto max-w-6xl px-5 lg:px-8 mt-24">
          <div className="rounded-3xl border border-border bg-card p-8 lg:p-12 text-center">
            <h2 className="text-3xl font-bold font-display">Comece pelo diagnóstico</h2>
            <p className="mt-3 text-muted-foreground max-w-[55ch] mx-auto">
              Sem custo e sem compromisso. Você recebe o formato recomendado, a faixa de investimento estimada e os
              próximos passos.
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

      <InstitutionalDiagnosticQuizModal open={modal} onClose={() => setModal(false)} source="criacao-site-institucional-modal" />
      <Footer />
    </div>
  );
}
