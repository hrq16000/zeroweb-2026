import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Layers3,
  MousePointerClick,
  Search,
} from "lucide-react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import "./HomeExperienceV2.css";

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
      className="relative isolate overflow-hidden border-b border-border bg-background pb-16 pt-28 lg:pb-24 lg:pt-36"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/10 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-12 lg:items-center lg:gap-14 lg:px-8">
        <div className="min-w-0 lg:col-span-7">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-px w-7 bg-primary" aria-hidden="true" />
            Estratégia digital sem ruído
          </div>

          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.35rem,5vw,4.6rem)] font-bold leading-[1.04] tracking-[-0.045em] [text-wrap:balance]">
            Sua presença digital precisa levar o cliente ao
            <span className="text-primary"> próximo passo.</span>
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
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-opacity duration-[160ms] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
            <Link
              to="/portfolio"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-3.5 font-semibold text-foreground transition-colors duration-[160ms] hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Ver projetos publicados
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Sites e landing pages · presença digital · tráfego e conversão · automações
          </p>
        </div>

        <div className="min-w-0 lg:col-span-5">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-foreground text-background">
            <div className="flex items-start justify-between gap-4 border-b border-background/15 px-6 py-6 sm:px-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Jornada digital</p>
                <h2 className="mt-2 text-xl font-display font-semibold leading-snug">Uma sequência, não uma pilha de recursos.</h2>
              </div>
              <Compass className="mt-1 size-6 shrink-0 text-accent" aria-hidden="true" />
            </div>

            <ol className="home-journey-rail relative px-6 py-2 sm:px-8">
              {journey.map(({ step, title, description, icon: Icon }) => (
                <li key={step} className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-4 py-5">
                  <span className="grid size-10 place-items-center rounded-full border border-accent/40 bg-foreground text-accent">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-background/70">Etapa {step}</p>
                    <h3 className="mt-1 text-lg font-semibold">{title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-background/75">{description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="border-t border-background/15 px-6 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-accent sm:px-8">
              Da descoberta à conversa comercial
            </div>
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
            Loja de Serviços reúne produtos digitais com escopo e contratação próprios; o Portfólio
            funciona como galeria de projetos independentes publicados.
          </p>

          <div className="mt-10 border-y border-border">
            <Link
              to="/servicos"
              className="group grid gap-2 border-b border-border py-6 transition-colors duration-[160ms] hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[160px_minmax(0,1fr)_auto] sm:items-center"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Loja de Serviços</span>
              <span className="text-lg font-semibold text-foreground">Escolha um produto digital com escopo e contratação claros.</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-colors duration-[160ms] motion-safe:transition-transform motion-safe:group-hover:translate-x-1 group-hover:text-primary" aria-hidden="true" />
            </Link>
            <Link
              to="/portfolio"
              className="group grid gap-2 py-6 transition-colors duration-[160ms] hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[160px_minmax(0,1fr)_auto] sm:items-center"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Portfólio</span>
              <span className="text-lg font-semibold text-foreground">Explore projetos independentes, cada um com identidade e jornada próprias.</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-colors duration-[160ms] motion-safe:transition-transform motion-safe:group-hover:translate-x-1 group-hover:text-primary" aria-hidden="true" />
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
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1 bg-accent" aria-hidden="true" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Próximo passo</p>
              <h2 id="home-final-cta-title" className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Conte o que você quer colocar no ar. A estrutura vem depois do objetivo.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-background/70">
                Explique sua necessidade e siga pelo funil comercial da 0WEB sem precisar escolher uma solução técnica antes da hora.
              </p>
              <div className="mt-6 max-w-2xl rounded-2xl border border-background/15 bg-background/5 p-5">
                <h3 className="text-base font-semibold text-background">Como falar com a 0WEB pelo WhatsApp?</h3>
                <p className="mt-2 text-sm leading-6 text-background/70">
                  O atendimento comercial começa pelo botão “Falar sobre meu projeto”. O funil registra o contexto da solicitação e,
                  quando o atendimento pede continuidade no WhatsApp, direciona para o destino correto sem abrir uma conversa genérica.
                </p>
              </div>
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
