import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Bot, Gauge, Search, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { ContactFormWhatsApp } from "@/components/site/ContactFormWhatsApp";
import { absUrl, breadcrumbLd, DEFAULT_OG_IMAGE, ORIGIN } from "@/lib/seo";
import dashboardImage from "@/assets/hero-dashboard.webp";

const TITLE = "Diagnóstico digital para empresas | 0WEB";
const DESCRIPTION = "Escolha o foco do diagnóstico e envie seu cenário para a 0WEB: presença digital, aquisição ou automação.";

export const Route = createFileRoute("/captacao")({
  head: () => {
    const url = absUrl("/captacao");
    return {
      meta: [
        { title: TITLE },
        { name: "description", content: DESCRIPTION },
        { property: "og:title", content: TITLE },
        { property: "og:description", content: DESCRIPTION },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:image", content: DEFAULT_OG_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: TITLE },
        { name: "twitter:description", content: DESCRIPTION },
        { name: "twitter:image", content: DEFAULT_OG_IMAGE },
        { name: "robots", content: "index,follow,max-image-preview:large" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebPage", "@id": url, url, name: TITLE, description: DESCRIPTION, inLanguage: "pt-BR", isPartOf: { "@id": `${ORIGIN}/#website` } },
            breadcrumbLd([{ name: "Diagnóstico", path: "/captacao" }]),
          ],
        }),
      }],
    };
  },
  component: CaptacaoPage,
});

const paths = [
  {
    id: "presenca",
    title: "Presença que representa",
    description: "Para organizar site, posicionamento e descoberta da empresa no ambiente digital.",
    prompt: "Quero avaliar a presença digital da minha empresa.",
    icon: Search,
  },
  {
    id: "aquisicao",
    title: "Aquisição com direção",
    description: "Para revisar como as oportunidades chegam, avançam e viram conversas comerciais.",
    prompt: "Quero avaliar a aquisição de oportunidades da minha empresa.",
    icon: Gauge,
  },
  {
    id: "automacao",
    title: "Operação mais fluida",
    description: "Para identificar tarefas repetitivas e pontos onde automação pode apoiar o time.",
    prompt: "Quero avaliar oportunidades de automação na minha empresa.",
    icon: Bot,
  },
] as const;

type PathId = (typeof paths)[number]["id"];

function CaptacaoPage() {
  const [selected, setSelected] = useState<PathId>("presenca");
  const active = paths.find((path) => path.id === selected) ?? paths[0];

  const choose = (id: PathId) => {
    setSelected(id);
    window.requestAnimationFrame(() => document.querySelector("#diagnostico")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section className="relative min-h-[78vh] overflow-hidden border-b border-border pt-28 sm:pt-32">
          <img src={dashboardImage} alt="Painel digital da 0WEB" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
          <div className="absolute inset-0 bg-background/80" />
          <div className="relative mx-auto flex min-h-[62vh] max-w-7xl items-end px-5 pb-16 lg:px-8 lg:pb-20">
            <div className="max-w-4xl">
              <p className="text-xs font-semibold uppercase text-primary">Diagnóstico 0WEB</p>
              <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold sm:text-6xl lg:text-7xl">
                Clareza antes de investir no próximo passo digital.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Escolha o ponto mais urgente do seu negócio. Seu contexto será registrado para orientar a primeira conversa.
              </p>
              <a href="#caminhos" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Escolher um caminho <ArrowDown className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section id="caminhos" className="scroll-mt-24 border-b border-border px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr]">
              <div>
                <p className="text-xs font-semibold uppercase text-primary">Três entradas</p>
                <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Por onde sua empresa precisa começar?</h2>
              </div>
              <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
                {paths.map((path) => (
                  <article key={path.id} className="flex min-h-64 flex-col bg-background p-6">
                    <path.icon className="h-6 w-6 text-primary" />
                    <h3 className="mt-8 text-xl font-bold">{path.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{path.description}</p>
                    <Button variant="ghost" className="mt-6 justify-start px-0 text-primary" onClick={() => choose(path.id)}>
                      Selecionar <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-xs font-semibold uppercase text-primary">Próximo passo</p>
              <h2 className="mt-3 font-display text-3xl font-bold">Um contexto claro produz uma conversa melhor.</h2>
              <div className="mt-8 space-y-5 text-sm text-muted-foreground">
                <p className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-primary" /> Seus dados são registrados com consentimento para retorno.</p>
                <p className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-primary" /> A escolha feita nesta página identifica a origem do contato.</p>
                <p className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-primary" /> Nenhuma estimativa de resultado é apresentada sem diagnóstico.</p>
              </div>
            </div>
            <div id="diagnostico" className="scroll-mt-24">
              <ContactFormWhatsApp
                key={active.id}
                source={`captacao_${active.id}`}
                ctx={`captacao:${active.id}`}
                title={active.title}
                defaultMessage={active.prompt}
                requireConsent
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}