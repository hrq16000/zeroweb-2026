import { ManagedText } from "@/components/portfolio/ManagedText";
import type { CSSProperties } from "react";
import { ArrowRight, BrickWall, Building2, Droplets, PlugZap, ShieldCheck } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

/**
 * Raphael Construções — direção PROCESSUAL / CANTEIRO DE OBRA.
 *
 * A narrativa é a sequência da obra: hero empilhado com barra de fases,
 * trilho vertical numerado como assinatura, frentes de serviço em lista de
 * duas colunas densa e CTA como bloco de "abrir chamado". Sem hero split,
 * sem grid de cards, sem faixa cromática.
 */

const quizConfig = {
  proposalKind: "service" as const,
  services: [
    "Construção",
    "Reforma",
    "Impermeabilização",
    "Hidráulica",
    "Elétrica",
    "Demolição",
    "Pintura e acabamentos",
    "Engenharia e acompanhamento",
  ],
  experienceOptions: ["Casa", "Apartamento", "Comércio", "Condomínio", "Outro imóvel"],
  periodOptions: ["Tenho projeto ou medidas", "Tenho fotos do local", "Preciso de uma avaliação"],
  timingOptions: ["O quanto antes", "Nos próximos meses", "Ainda neste ano", "Estou planejando"],
  stepTitles: {
    service: "Qual etapa da obra você precisa?",
    experience: "Onde será o serviço?",
    period: "O que já está disponível?",
    timing: "Quando pretende começar?",
  },
  notePlaceholder: "Conte o tipo de obra, a região e os principais detalhes.",
};

/** Assinatura: fases da obra em trilho vertical. */
function PhaseStep({ index, fase, text }: { index: number; fase: string; text: string }) {
  return (
    <li className="relative pb-10 last:pb-0">
      <span className="absolute -left-[2.65rem] grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
        {index + 1}
      </span>
      <h3 className="text-lg font-bold">{fase}</h3>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p>
    </li>
  );
}

const fases = [
  {
    fase: "Avaliação",
    text: "Entendimento do imóvel, das medidas disponíveis e do que precisa ser feito.",
  },
  {
    fase: "Planejamento",
    text: "Definição das etapas, das frentes envolvidas e da sequência de execução.",
  },
  {
    fase: "Execução",
    text: "Obra conduzida por etapa, com acompanhamento das frentes contratadas.",
  },
  {
    fase: "Acabamento",
    text: "Instalações, pintura e ajustes finais até a entrega do ambiente.",
  },
];

const frentes = [
  {
    icon: Building2,
    title: "Construção e engenharia",
    text: "Planejamento, acompanhamento e execução do alicerce ao acabamento.",
  },
  {
    icon: Droplets,
    title: "Impermeabilização",
    text: "Soluções voltadas à proteção e à durabilidade da construção.",
  },
  {
    icon: BrickWall,
    title: "Reformas e demolição",
    text: "Transformação de ambientes, remoções e preparação para novas etapas.",
  },
  {
    icon: PlugZap,
    title: "Instalações e acabamentos",
    text: "Hidráulica, elétrica, pintura e acabamentos integrados à obra.",
  },
];

const theme = {
  "--background": "oklch(0.967 0.006 258.3)",
  "--foreground": "oklch(0.256 0.043 256.9)",
  "--card": "oklch(1.000 0.000 89.9)",
  "--card-foreground": "oklch(0.256 0.043 256.9)",
  "--muted": "oklch(0.910 0.012 258.3)",
  "--muted-foreground": "oklch(0.495 0.039 256.8)",
  "--primary": "oklch(0.374 0.098 257.4)",
  "--primary-foreground": "oklch(0.975 0.004 258.3)",
  "--border": "oklch(0.838 0.017 256.7)",
  "--ring": "oklch(0.374 0.098 257.4)",
} as CSSProperties;

export function RaphaelConstrucoesPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground" style={theme}>
      <header className="bg-primary px-5 py-4 text-primary-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a href="#inicio" aria-label="Raphael Construções — início">
            <PortfolioImage
              src="/images/raphael-construcoes/logo.png"
              alt="Raphael Construções"
              width={420}
              height={190}
              className="h-11 w-auto object-contain"
              managedField="logoUrl"
            />
          </a>
          <span className="hidden text-xs font-bold uppercase tracking-[.24em] opacity-80 sm:block">
            Curitiba, região e litoral — PR
          </span>
        </div>
      </header>

      <main id="inicio">
        {/* HERO empilhado, centrado, com barra de fases logo abaixo. */}
        <section aria-label="Apresentação principal" className="px-5 pb-0 pt-14 text-center md:pt-20">
          <div className="mx-auto max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[.34em] text-primary">
              Construção · engenharia · reformas
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.06] md:text-6xl">
              <ManagedText
                field="heroHeadline"
                fallback={"Uma vis\u00e3o completa para sua obra."}
              />
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
              <ManagedText
                field="heroSubheadline"
                fallback={
                  "Do projeto ao acabamento: constru\u00e7\u00e3o, reforma, impermeabiliza\u00e7\u00e3o, instala\u00e7\u00f5es e demoli\u00e7\u00e3o conduzidas por etapa."
                }
              />
            </p>
            <PortfolioCTAQuiz
              clientKey="raphael-construcoes"
              studioName="Raphael Construções"
              recipientName="Raphael"
              theme="navy"
              mode="proposal"
              quizConfig={quizConfig}
              className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-md bg-primary px-7 font-bold text-primary-foreground hover:opacity-90"
            >
              Solicitar avaliação <ArrowRight aria-hidden className="h-4 w-4" />
            </PortfolioCTAQuiz>
          </div>

          <ul className="mx-auto mt-12 grid max-w-5xl grid-cols-2 overflow-hidden rounded-t-xl border border-b-0 border-border bg-card text-left md:grid-cols-4">
            {fases.map(({ fase }, index) => (
              <li key={fase} className="border-b border-r border-border px-4 py-4 last:border-r-0">
                <span className="font-display text-xs font-bold text-primary">
                  ETAPA {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-1 text-sm font-bold">{fase}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Imagem larga de obra logo após a barra de fases. */}
        <section aria-label="Imagem da obra" className="px-5">
          <PortfolioImage
            src="/images/raphael-construcoes/hero.webp"
            alt="Construção residencial mostrando estrutura e acabamento final"
            priority
            width={1920}
            height={860}
            className="mx-auto aspect-[21/9] w-full max-w-5xl rounded-b-xl border border-t-0 border-border object-cover"
            managedField="heroImageUrl"
          />
        </section>

        {/* Assinatura: trilho vertical numerado das fases. */}
        <section id="etapas" aria-label="Etapas da execução" className="px-5 py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Como a obra caminha</h2>
            <ol className="mt-10 border-l-2 border-primary/30 pl-8">
              {fases.map((item, index) => (
                <PhaseStep key={item.fase} index={index} fase={item.fase} text={item.text} />
              ))}
            </ol>
          </div>
        </section>

        {/* Frentes de serviço em lista de duas colunas, não cards isolados. */}
        <section id="servicos" className="bg-card px-5 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Frentes de serviço</h2>
            <dl className="mt-10 grid gap-x-12 md:grid-cols-2">
              {frentes.map(({ icon: Icon, title, text }) => (
                <div key={title} className="border-t border-border py-6">
                  <dt className="flex items-center gap-3 text-lg font-bold">
                    <Icon aria-hidden className="h-5 w-5 text-primary" />
                    {title}
                  </dt>
                  <dd className="mt-2 text-sm leading-7 text-muted-foreground">{text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* CTA como bloco escuro de "abrir chamado" com imagem de apoio. */}
        <section aria-label="Abrir avaliação" className="px-5 py-16">
          <div className="mx-auto grid max-w-6xl items-stretch gap-0 overflow-hidden rounded-xl md:grid-cols-2">
            <PortfolioImage
              src="/images/raphael-construcoes/servicos.webp"
              alt="Evolução visual de uma construção residencial"
              width={1200}
              height={900}
              className="h-full min-h-56 w-full object-cover"
            />
            <div className="bg-primary px-6 py-10 text-primary-foreground md:px-10">
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                Conte o tipo de obra e a região.
              </h2>
              <p className="mt-3 text-sm leading-7 opacity-85">
                Reunimos os detalhes necessários para organizar a avaliação da sua obra.
              </p>
              <PortfolioCTAQuiz
                clientKey="raphael-construcoes"
                studioName="Raphael Construções"
                recipientName="Raphael"
                theme="navy"
                mode="proposal"
                quizConfig={quizConfig}
                className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-md bg-background px-7 font-bold text-foreground hover:opacity-90"
              >
                Abrir minha avaliação
              </PortfolioCTAQuiz>
              <p className="mt-6 flex items-center gap-2 text-xs opacity-80">
                <ShieldCheck aria-hidden className="h-4 w-4" /> Orçamento sem compromisso, conforme
                informado pelo profissional.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-foreground px-5 py-8 text-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <strong>Raphael Construções</strong>
            <p className="mt-1 text-sm text-background/70">
              Construção, engenharia e reformas — Curitiba, região e litoral.
            </p>
          </div>
          <PortfolioHostCredit
            className="text-sm text-background/70"
            linkClassName="font-semibold text-background underline"
          />
        </div>
      </footer>
      <PortfolioSocialProofPopup
        clientKey="raphael-construcoes"
        eyebrow="Raphael Construções"
        title="Uma visão completa para sua obra."
        description="Conheça as frentes de serviço e organize os detalhes para solicitar uma avaliação."
        ctaLabel="Ver serviços"
        ctaHref="#servicos"
      />
      <PortfolioUpsellPopup pageName="portfolio-raphael-construcoes" />
    </div>
  );
}
