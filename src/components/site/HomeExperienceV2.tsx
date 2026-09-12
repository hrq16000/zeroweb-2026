import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Layers3,
  MousePointerClick,
  Search,
  Sparkles,
} from "lucide-react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";

const journey = [
  {
    step: "01",
    title: "Ser encontrado",
    description: "Presença digital, conteúdo e campanhas criam a entrada certa para cada público.",
    icon: Search,
  },
  {
    step: "02",
    title: "Ser entendido",
    description: "Site, landing page e oferta deixam claro o que você faz, para quem e por quê.",
    icon: Layers3,
  },
  {
    step: "03",
    title: "Gerar ação",
    description: "Funil e contato reduzem atrito para transformar interesse em conversa comercial.",
    icon: MousePointerClick,
  },
] as const;

const process = [
  {
    title: "Contexto antes da ferramenta",
    description:
      "Entendemos objetivo, oferta, público e origem do tráfego antes de decidir página, conteúdo ou automação.",
  },
  {
    title: "Estrutura com função clara",
    description:
      "Cada página recebe uma responsabilidade: atrair, explicar, provar, captar ou fechar o próximo passo.",
  },
  {
    title: "Publicação com base técnica",
    description:
      "Responsividade, SEO técnico, acessibilidade, performance, mensuração e integração entram no mesmo fluxo de entrega.",
  },
  {
    title: "Evolução a partir do uso real",
    description:
      "A estrutura pode ser refinada com dados de navegação, campanhas e conversão — sem transformar a Home em depósito de recursos.",
  },
] as const;

export function HomeHeroV2() {
  return (
    <section
      id="inicio"
      className="relative isolate overflow-hidden border-b border-border bg-background pb-20 pt-28 lg:pb-28 lg:pt-36"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/10 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-12 lg:items-center lg:px-8">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Estratégia digital sem ruído
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-7xl">
            Sua presença digital precisa levar o cliente ao
            <span className="text-gradient"> próximo passo.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            A 0WEB conecta sites, presença digital, aquisição e automação em uma jornada simples:
            ser encontrado, ser entendido e facilitar a ação certa.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <FunnelCTAButton
              intent={{
                purpose: "commercial",
                source: "home_v2_hero",
                pagePath: typeof window === "undefined" ? "/" : window.location.pathname,
                placement: "hero",
              }}
              label="Quero organizar meu projeto"
              location="home_v2_hero"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-glow-primary transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
            <Link
              to="/portfolio"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-3.5 font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Ver projetos publicados
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Sites e landing pages · presença digital · tráfego e conversão · automações
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-elegant">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Jornada</p>
                <p className="mt-1 font-semibold text-foreground">Uma sequência, não uma pilha de recursos.</p>
              </div>
              <Compass className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>

            <ol className="divide-y divide-border">
              {journey.map(({ step, title, description, icon: Icon }) => (
                <li key={step} className="grid grid-cols-[auto_1fr] gap-4 px-6 py-6">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-bold tabular-nums text-primary">{step}</span>
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomePositioningV2() {
  return (
    <section className="py-20 lg:py-28" aria-labelledby="home-positioning-title">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Clareza primeiro</p>
          <h2
            id="home-positioning-title"
            className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
          >
            Cada etapa da jornada merece uma função — não mais uma distração.
          </h2>
        </div>

        <div className="lg:col-span-7 lg:pl-8">
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Em vez de concentrar tudo na mesma tela, a 0WEB organiza a experiência para que cada
            parte do ecossistema trabalhe com um objetivo claro. A Home posiciona e direciona; a
            área de Serviços detalha as soluções; o Portfólio mostra projetos publicados.
          </p>

          <div className="mt-10 border-y border-border">
            <Link
              to="/servicos"
              className="group grid gap-2 border-b border-border py-6 sm:grid-cols-[160px_1fr_auto] sm:items-center"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Soluções</span>
              <span className="text-lg font-semibold text-foreground">Escolha a frente certa para o seu objetivo.</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" aria-hidden="true" />
            </Link>
            <Link
              to="/portfolio"
              className="group grid gap-2 py-6 sm:grid-cols-[160px_1fr_auto] sm:items-center"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Projetos</span>
              <span className="text-lg font-semibold text-foreground">Veja páginas reais publicadas para negócios diferentes.</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeProcessV2() {
  return (
    <section className="border-y border-border bg-muted/20 py-20 lg:py-28" aria-labelledby="home-process-title">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Como trabalhamos</p>
            <h2 id="home-process-title" className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Menos etapas decorativas. Mais decisões úteis.
            </h2>
          </div>

          <ol className="lg:col-span-8">
            {process.map((item, index) => (
              <li
                key={item.title}
                className="grid gap-4 border-t border-border py-6 first:border-t-0 first:pt-0 sm:grid-cols-[72px_1fr]"
              >
                <span className="text-sm font-semibold tabular-nums text-primary">0{index + 1}</span>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function HomeFinalCTAV2() {
  return (
    <section className="py-20 lg:py-28" id="contato" aria-labelledby="home-final-cta-title">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-foreground px-7 py-10 text-background sm:px-10 lg:px-14 lg:py-14">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/40 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Próximo passo</p>
              <h2 id="home-final-cta-title" className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Conte o que você quer colocar no ar. A estrutura vem depois do objetivo.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-background/70">
                Explique sua necessidade e siga pelo funil comercial da 0WEB sem precisar escolher uma solução técnica antes da hora.
              </p>
            </div>

            <FunnelCTAButton
              intent={{
                purpose: "commercial",
                source: "home_v2_final",
                pagePath: typeof window === "undefined" ? "/" : window.location.pathname,
                placement: "section",
              }}
              label="Falar sobre meu projeto"
              location="home_v2_final"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-background px-6 py-3.5 font-semibold text-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
