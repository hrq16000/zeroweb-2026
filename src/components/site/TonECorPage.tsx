import { ManagedText } from "@/components/portfolio/ManagedText";
import type { CSSProperties } from "react";
import { ArrowRight, Brush, Droplets, House, PaintRoller, ShieldCheck } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const quizConfig = {
  proposalKind: "service" as const,
  services: [
    "Pintura em geral",
    "Pequenos serviços de alvenaria",
    "Pequenos serviços hidráulicos",
    "Limpeza de telhado",
    "Reparos em geral",
  ],
  experienceOptions: ["Casa", "Apartamento", "Comércio", "Outro espaço"],
  periodOptions: ["Tenho fotos do local", "Posso explicar o reparo", "Preciso de uma avaliação"],
  timingOptions: ["O quanto antes", "Nos próximos dias", "Ainda neste mês", "Estou planejando"],
  stepTitles: {
    service: "Qual serviço você precisa?",
    experience: "Onde será o trabalho?",
    period: "Como podemos avaliar?",
    timing: "Quando pretende começar?",
  },
  notePlaceholder: "Conte quais ambientes ou reparos precisam de atenção.",
};

const services = [
  {
    icon: PaintRoller,
    title: "Pintura em geral",
    text: "Renovação de paredes e ambientes com atenção ao acabamento.",
  },
  {
    icon: House,
    title: "Alvenaria",
    text: "Pequenas reformas e correções para organizar o espaço.",
  },
  {
    icon: Droplets,
    title: "Hidráulica",
    text: "Pequenos serviços hidráulicos integrados aos reparos necessários.",
  },
  {
    icon: Brush,
    title: "Telhados e reparos",
    text: "Limpeza de telhado e soluções para reparos em geral.",
  },
];

const theme = {
  "--background": "42 38% 97%",
  "--foreground": "213 73% 13%",
  "--card": "0 0% 100%",
  "--muted": "42 24% 91%",
  "--muted-foreground": "213 18% 38%",
  "--primary": "42 100% 48%",
  "--primary-foreground": "213 73% 13%",
  "--border": "213 18% 82%",
  "--ring": "42 100% 48%",
} as CSSProperties;

export function TonECorPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground" style={theme}>
      <header className="border-b border-border bg-card/95 px-5 backdrop-blur">
        <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-4">
          <a href="#inicio" aria-label="Ton & Cor — início">
            <PortfolioImage
              src="/images/ton-e-cor/logo.png"
              alt="Ton & Cor"
              width={420}
              height={190}
              className="h-14 w-auto object-contain"
            /
            managedField="logoUrl"
          >
          </a>
          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-6 text-sm font-semibold md:flex"
          >
            <a href="#servicos" className="hover:text-primary">
              Serviços
            </a>
            <a href="#como-funciona" className="hover:text-primary">
              Como funciona
            </a>
          </nav>
          <PortfolioCTAQuiz
            clientKey="ton-e-cor"
            studioName="Ton & Cor"
            recipientName="Gelton"
            theme="navy"
            mode="proposal"
            quizConfig={quizConfig}
            className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground hover:opacity-90"
          >
            Pedir orçamento
          </PortfolioCTAQuiz>
        </div>
      </header>

      <main id="inicio">
        <section className="overflow-hidden bg-foreground px-5 py-16 text-background md:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">
                Pintura e pequenas reformas
              </p>
              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] md:text-6xl">
            <ManagedText field="heroHeadline" fallback={"Sua casa renovada, com os reparos organizados em um s\u00f3 atendimento."} />
          </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-background/75">
            <ManagedText field="heroSubheadline" fallback={"Pintura em geral, pequenos servi\u00e7os de alvenaria e hidr\u00e1ulica, limpeza de telhado e reparos para cuidar do seu espa\u00e7o."} />
          </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <PortfolioCTAQuiz
                  clientKey="ton-e-cor"
                  studioName="Ton & Cor"
                  recipientName="Gelton"
                  theme="navy"
                  mode="proposal"
                  quizConfig={quizConfig}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 font-bold text-primary-foreground hover:opacity-90"
                >
                  Solicitar orçamento <ArrowRight className="h-4 w-4" />
                </PortfolioCTAQuiz>
                <a
                  href="#servicos"
                  className="inline-flex min-h-12 items-center rounded-full border border-background/30 px-6 font-semibold text-background hover:border-primary hover:text-primary"
                >
                  Ver serviços
                </a>
              </div>
              <div className="mt-8 flex items-center gap-3 text-sm text-background/75">
                <ShieldCheck className="h-5 w-5 text-primary" /> Orçamento sem compromisso, conforme
                informado pelo profissional.
              </div>
            </div>
            <PortfolioImage
              src="/images/ton-e-cor/servicos.webp"
              alt="Materiais de pintura e pequenas reformas organizados em ambiente residencial"
              priority
              width={1440}
              height={900}
              className="aspect-[8/5] w-full rounded-3xl border border-background/15 object-cover shadow-2xl"
            managedField="heroImageUrl"
          />
          </div>
        </section>

        <section id="servicos" className="px-5 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Serviços</p>
            <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <h2 className="max-w-2xl font-display text-3xl font-bold md:text-5xl">
                Da pintura ao pequeno reparo que faltava.
              </h2>
              <p className="max-w-md text-sm leading-6 text-muted-foreground">
                Serviços apresentados com clareza para facilitar a avaliação do trabalho necessário.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {services.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-2xl border border-border bg-card p-6">
                  <Icon className="h-7 w-7 text-primary" />
                  <h3 className="mt-5 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="bg-muted px-5 py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
            <PortfolioImage
              src="/images/ton-e-cor/hero.webp"
              alt="Apresentação dos serviços reais da Ton & Cor"
              width={1440}
              height={900}
              className="aspect-[8/5] w-full rounded-3xl object-cover"
            />
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">
                Como começar
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                Explique o que precisa e organize a avaliação.
              </h2>
              <ol className="mt-8 space-y-5">
                {[
                  "Escolha o serviço principal.",
                  "Informe o tipo de imóvel e os detalhes do local.",
                  "Combine a avaliação e receba o orçamento.",
                ].map((item, index) => (
                  <li key={item} className="flex gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                    <span className="pt-2 font-semibold">{item}</span>
                  </li>
                ))}
              </ol>
              <PortfolioCTAQuiz
                clientKey="ton-e-cor"
                studioName="Ton & Cor"
                recipientName="Gelton"
                theme="navy"
                mode="proposal"
                quizConfig={quizConfig}
                className="mt-8 inline-flex min-h-12 items-center rounded-full bg-foreground px-6 font-bold text-background hover:opacity-90"
              >
                Começar meu orçamento
              </PortfolioCTAQuiz>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-foreground px-5 py-8 text-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <strong>Ton & Cor</strong>
            <p className="mt-1 text-sm text-background/70">Pintura e pequenas reformas.</p>
          </div>
          <PortfolioHostCredit
            className="text-sm text-background/70"
            linkClassName="font-semibold text-primary"
          />
        </div>
      </footer>
      <PortfolioSocialProofPopup
        clientKey="ton-e-cor"
        eyebrow="Ton & Cor"
        title="Pintura e pequenos reparos em uma presença clara."
        description="Conheça os serviços e organize os detalhes para solicitar um orçamento."
        ctaLabel="Ver serviços"
        ctaHref="#servicos"
      />
      <PortfolioUpsellPopup pageName="portfolio-ton-e-cor" />
    </div>
  );
}
