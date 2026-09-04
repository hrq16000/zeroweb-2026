import type { CSSProperties, ReactNode } from "react";
import {
  ArrowRight,
  Brain,
  CalendarDays,
  Check,
  HeartHandshake,
  Instagram,
  Leaf,
  MapPin,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const quiz = {
  services: [
    "Avaliação psicológica",
    "Ansiedade",
    "Burnout e esgotamento",
    "Relacionamentos",
    "Quero conversar sobre outra questão",
  ],
  experienceOptions: [
    "É meu primeiro contato com psicologia",
    "Já fiz acompanhamento antes",
    "Estou buscando uma avaliação",
    "Ainda quero entender como funciona",
  ],
  periodOptions: ["Manhã", "Tarde", "Noite", "Tenho flexibilidade"],
  timingOptions: ["O quanto antes", "Nesta semana", "Na próxima semana", "Estou me organizando"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "O que motivou sua busca neste momento?",
    experience: "Como você chega para esta conversa?",
    period: "Qual período facilita seu atendimento?",
    timing: "Quando gostaria de começar?",
    note: "Se desejar, conte um pouco mais",
  },
  stepSubtitles: {
    service: "Escolha a opção que mais se aproxima da sua necessidade.",
    experience: "Essa informação ajuda a organizar o primeiro contato.",
    period: "A disponibilidade é confirmada diretamente no atendimento.",
    timing: "Sem compromisso: este passo serve para iniciar a conversa.",
    note: "Compartilhe somente o que se sentir confortável em registrar.",
  },
  notePlaceholder: "Ex.: o que tem sido mais difícil ou qual dúvida gostaria de esclarecer.",
};

function CTA({ children, location }: { children: ReactNode; location: string }) {
  return (
    <PortfolioCTAQuiz
      clientKey="denise-gomes-psicologa"
      studioName="Denise Gomes · Psicóloga"
      recipientName="Denise Gomes"
      theme="pink"
      mode="booking"
      quizConfig={quiz}
      ariaLabel="Agendar avaliação psicológica com Denise Gomes"
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--denise-primary)] px-6 py-3.5 font-bold text-[var(--denise-cream)] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[var(--denise-primary-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--denise-sage)] focus-visible:ring-offset-2"
      onOpen={() => {
        void location;
      }}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

const themes = [
  {
    title: "Ansiedade",
    text: "Um espaço para compreender pensamentos recorrentes, preocupações e o impacto deles na rotina.",
    Icon: Brain,
  },
  {
    title: "Burnout",
    text: "Escuta e avaliação para quem percebe exaustão, sobrecarga ou dificuldade de se desligar do trabalho.",
    Icon: Leaf,
  },
  {
    title: "Relacionamentos",
    text: "Acolhimento para observar padrões de comunicação, conflitos e necessidades nos vínculos.",
    Icon: HeartHandshake,
  },
] as const;

export function DeniseGomesPsicologaPage() {
  const theme = {
    "--denise-bg": "#fff8ec",
    "--denise-surface": "#f4edf7",
    "--denise-primary": "#4a1d6b",
    "--denise-primary-strong": "#32134f",
    "--denise-lavender": "#d9c8e7",
    "--denise-sage": "#788360",
    "--denise-ink": "#2c2331",
    "--denise-muted": "#695f6e",
    "--denise-cream": "#fffaf2",
  } as CSSProperties;

  return (
    <div style={theme} className="min-h-dvh bg-[var(--denise-bg)] text-[var(--denise-ink)]">
      <header className="sticky top-0 z-20 border-b border-[var(--denise-primary)]/10 bg-[var(--denise-bg)]/95 px-5 py-3 backdrop-blur lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a href="#inicio" aria-label="Denise Gomes · Psicóloga" className="shrink-0">
            <PortfolioImage managedField="logoUrl"
              src="/images/denise-gomes-psicologa/logo.png"
              alt="Denise Gomes · Psicóloga"
              width={1672}
              height={941}
             
              decoding="async"
             
              className="h-14 w-auto max-w-[190px] object-contain object-left sm:max-w-[245px]"
            />
          </a>
          <nav
            aria-label="Navegação da página"
            className="hidden items-center gap-6 text-sm font-semibold text-[var(--denise-muted)] md:flex"
          >
            <a href="#acolhimento" className="transition hover:text-[var(--denise-primary)]">
              Atendimento
            </a>
            <a href="#como-funciona" className="transition hover:text-[var(--denise-primary)]">
              Como funciona
            </a>
            <a href="#instagram" className="transition hover:text-[var(--denise-primary)]">
              Instagram
            </a>
          </nav>
          <CTA location="denise_header">
            Agendar avaliação <ArrowRight className="h-4 w-4" />
          </CTA>
        </div>
      </header>

      <main>
        <section id="inicio" className="relative overflow-hidden px-5 py-14 lg:px-8 lg:py-24">
          <div className="pointer-events-none absolute -left-28 top-20 h-80 w-80 rounded-full bg-[var(--denise-lavender)]/50 blur-3xl" />
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[.95fr_1.05fr]">
            <div className="relative">
              <p className="text-sm font-bold uppercase tracking-[.2em] text-[var(--denise-sage)]">
                Psicologia para adultos · CRP 08/22352
              </p>
              <h1 className="mt-5 max-w-2xl font-display text-5xl font-bold leading-[.98] text-[var(--denise-primary-strong)] sm:text-7xl">
                Cuidar da mente é abrir espaço para viver com mais{" "}
                <span className="text-[var(--denise-sage)]">leveza.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--denise-muted)]">
                Atendimento e avaliação psicológica para adultos em São José dos Pinhais, com escuta
                acolhedora e um primeiro passo organizado para compreender o seu momento.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CTA location="denise_hero">
                  Agendar minha avaliação <ArrowRight className="h-4 w-4" />
                </CTA>
                <a
                  href="#como-funciona"
                  className="inline-flex min-h-12 items-center rounded-full border border-[var(--denise-primary)]/30 px-6 py-3.5 font-semibold text-[var(--denise-primary)] transition hover:border-[var(--denise-primary)] hover:bg-[var(--denise-surface)]"
                >
                  Entender como funciona
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold text-[var(--denise-muted)]">
                <span>
                  <Check className="mr-1 inline h-4 w-4 text-[var(--denise-sage)]" />
                  Atendimento para adultos
                </span>
                <span>
                  <ShieldCheck className="mr-1 inline h-4 w-4 text-[var(--denise-sage)]" />
                  Conversa inicial com privacidade
                </span>
              </div>
            </div>
            <figure className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-3 rounded-[2rem] bg-[var(--denise-lavender)]/55 blur-xl" />
              <PortfolioImage
                src="/images/denise-gomes-psicologa/hero.png"
                alt="Material de atendimento e avaliação psicológica de Denise Gomes"
                priority
                width={1024}
                height={1120}
                className="relative aspect-[.91/1] w-full rounded-[2rem] object-cover object-top shadow-2xl shadow-[var(--denise-primary)]/15"
            managedField="heroImageUrl"
          />
              <figcaption className="relative mt-3 text-sm text-[var(--denise-muted)]">
                Atendimento psicológico para adultos em São José dos Pinhais.
              </figcaption>
            </figure>
          </div>
        </section>

        <section
          id="acolhimento"
          className="bg-[var(--denise-primary-strong)] px-5 py-20 text-[var(--denise-cream)] lg:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-bold uppercase tracking-[.2em] text-[var(--denise-lavender)]">
              Questões que podem encontrar espaço
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold sm:text-5xl">
              Você não precisa organizar tudo sozinho antes de pedir ajuda.
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {themes.map(({ title, text, Icon }) => (
                <article
                  key={title}
                  className="rounded-3xl border border-white/15 bg-white/[.06] p-7 transition hover:-translate-y-1 hover:bg-white/[.09]"
                >
                  <Icon className="h-9 w-9 text-[var(--denise-lavender)]" />
                  <h3 className="mt-8 text-2xl font-bold">{title}</h3>
                  <p className="mt-3 leading-7 text-white/75">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.2em] text-[var(--denise-sage)]">
                Como começar
              </p>
              <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold text-[var(--denise-primary-strong)]">
                O primeiro contato pode ser simples e respeitar o seu tempo.
              </h2>
              <div className="mt-8 space-y-5">
                {[
                  [
                    "01",
                    "Conte o que motivou sua busca",
                    "Escolha uma opção no formulário e compartilhe apenas o que desejar.",
                  ],
                  [
                    "02",
                    "Combine a avaliação",
                    "Denise confirma disponibilidade e orienta os próximos passos do atendimento.",
                  ],
                  [
                    "03",
                    "Inicie com clareza",
                    "A avaliação ajuda a compreender sua necessidade e organizar o cuidado adequado.",
                  ],
                ].map(([number, title, text]) => (
                  <div
                    key={number}
                    className="grid grid-cols-[3.25rem_1fr] gap-4 rounded-2xl border border-[var(--denise-lavender)] bg-white/70 p-5"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--denise-surface)] font-bold text-[var(--denise-primary)]">
                      {number}
                    </span>
                    <div>
                      <h3 className="font-bold text-[var(--denise-primary-strong)]">{title}</h3>
                      <p className="mt-1 leading-7 text-[var(--denise-muted)]">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <aside className="rounded-[2rem] bg-[var(--denise-surface)] p-8 shadow-xl shadow-[var(--denise-primary)]/10 sm:p-10">
              <MessageCircleHeart className="h-10 w-10 text-[var(--denise-primary)]" />
              <h2 className="mt-7 font-display text-3xl font-bold text-[var(--denise-primary-strong)]">
                Uma avaliação começa com escuta.
              </h2>
              <p className="mt-4 leading-7 text-[var(--denise-muted)]">
                Responda perguntas breves para iniciar o contato. Valores e disponibilidade são
                confirmados diretamente no atendimento.
              </p>
              <div className="mt-7">
                <CTA location="denise_process">
                  Quero iniciar a conversa <ArrowRight className="h-4 w-4" />
                </CTA>
              </div>
              <p className="mt-5 text-sm font-semibold text-[var(--denise-sage)]">
                <Sparkles className="mr-1 inline h-4 w-4" />
                Valores acessíveis, conforme informação da profissional.
              </p>
            </aside>
          </div>
        </section>

        <section id="instagram" className="bg-[var(--denise-surface)] px-5 py-16 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[.2em] text-[var(--denise-sage)]">
                Conteúdo e presença profissional
              </p>
              <h2 className="mt-3 font-display text-4xl font-bold text-[var(--denise-primary-strong)]">
                Conheça o trabalho de Denise Gomes no Instagram.
              </h2>
              <p className="mt-4 leading-7 text-[var(--denise-muted)]">
                Acompanhe conteúdos e informações compartilhados pela profissional em seu perfil
                oficial.
              </p>
            </div>
            <a
              href="https://www.instagram.com/psicodenisegomes"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--denise-primary)] px-6 py-3.5 font-bold text-[var(--denise-primary)] transition hover:bg-[var(--denise-primary)] hover:text-[var(--denise-cream)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--denise-sage)]"
            >
              <Instagram className="h-5 w-5" /> @psicodenisegomes
            </a>
          </div>
        </section>

        <section className="bg-[var(--denise-sage)] px-5 py-16 text-[var(--denise-cream)] lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[.2em] text-white/75">
                São José dos Pinhais — PR
              </p>
              <h2 className="mt-3 font-display text-4xl font-bold">
                Cuidar da saúde mental também é um ato de coragem.
              </h2>
              <p className="mt-4 flex items-center gap-2 text-white/85">
                <MapPin className="h-5 w-5" />
                Atendimento em São José dos Pinhais.
              </p>
            </div>
            <CTA location="denise_final">
              Agendar avaliação <CalendarDays className="h-4 w-4" />
            </CTA>
          </div>
        </section>
      </main>

      <footer className="bg-[var(--denise-primary-strong)] px-5 py-8 text-sm text-white/70 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-white">Denise Gomes · Psicóloga</p>
            <p className="mt-1">Atendimento e avaliação psicológica para adultos · CRP 08/22352</p>
          </div>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4 hover:text-[var(--denise-lavender)]" />
        </div>
      </footer>
      <PortfolioSocialProofPopup
        clientKey="denise-gomes-psicologa"
        eyebrow="Denise Gomes · Psicóloga"
        title="Cuidar da sua saúde mental é um ato de coragem e autocuidado."
        description="Conheça o atendimento psicológico para adultos e dê o primeiro passo no seu tempo."
        ctaLabel="Entender o atendimento"
        ctaHref="#como-funciona"
        delayMs={9000}
        className="border-[var(--denise-lavender)] bg-[var(--denise-bg)]/95 text-[var(--denise-ink)]"
        accentClassName="text-[var(--denise-primary)]"
      />
      <PortfolioUpsellPopup pageName="portfolio-denise-gomes-psicologa" />
    </div>
  );
}
