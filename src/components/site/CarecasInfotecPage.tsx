import type { CSSProperties } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Gamepad2,
  Laptop,
  MapPin,
  Monitor,
  Printer,
  ShieldCheck,
  Smartphone,
  Tablet,
  ThumbsUp,
  Wrench,
} from "lucide-react";
import { MotionReveal, MotionScope } from "@/components/motion";
import { ManagedText } from "@/components/portfolio/ManagedText";
import { useManagedValue } from "@/components/portfolio/PortfolioRuntimeContext";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const quizConfig = {
  proposalKind: "service" as const,
  services: [
    "Celular",
    "Computador",
    "Notebook",
    "Impressora",
    "Monitor",
    "Tablet",
    "Videogame",
    "Recarga de cartucho ou toner",
  ],
  experienceOptions: [
    "Não liga",
    "Tela quebrada",
    "Lentidão ou travamento",
    "Bateria / carregamento",
    "Não imprime",
    "Ainda não sei o defeito",
  ],
  periodOptions: ["Levo na loja", "Prefiro combinar antes", "Quero só um orçamento"],
  timingOptions: ["Hoje", "Esta semana", "Sem pressa"],
  stepTitles: {
    service: "Qual aparelho precisa de atendimento?",
    experience: "O que está acontecendo com ele?",
    period: "Como prefere resolver?",
    timing: "Para quando você precisa?",
  },
  notePlaceholder: "Conte a marca, o modelo e o que aconteceu com o aparelho.",
};

const aparelhos = [
  { icon: Smartphone, title: "Celular", text: "Troca de tela, bateria, conector de carga e limpeza interna." },
  { icon: Monitor, title: "Computador", text: "Formatação, limpeza, upgrade de memória e troca de peças." },
  { icon: Laptop, title: "Notebook", text: "Teclado, dobradiça, tela, refrigeração e manutenção geral." },
  { icon: Printer, title: "Impressora", text: "Revisão, limpeza de cabeçote e configuração de rede." },
  { icon: Monitor, title: "Monitor", text: "Diagnóstico de imagem, fonte e conectores." },
  { icon: Tablet, title: "Tablet", text: "Tela, bateria, botões e restauração do sistema." },
  { icon: Gamepad2, title: "Videogame", text: "Console e controles: leitura de disco, HDMI e analógicos." },
  { icon: Printer, title: "Recargas", text: "Recarga de cartucho e toner com teste de impressão." },
];

const compromissos = [
  {
    icon: ShieldCheck,
    title: "Serviço de qualidade",
    text: "Diagnóstico antes do reparo e explicação do que precisa ser feito no seu aparelho.",
  },
  {
    icon: BadgeCheck,
    title: "Profissionais qualificados",
    text: "Assistência técnica especializada, com atendimento direto de quem executa o serviço.",
  },
  {
    icon: ThumbsUp,
    title: "Preço justo",
    text: "Orçamento apresentado antes da execução, sem surpresa no momento da retirada.",
  },
];

const etapas = [
  "Você conta qual é o aparelho e o que está acontecendo.",
  "A equipe faz o diagnóstico e apresenta o orçamento.",
  "Aprovado o orçamento, o reparo é executado e o aparelho testado.",
];

const theme = {
  "--background": "oklch(0.17 0.012 315)",
  "--foreground": "oklch(0.97 0.005 90)",
  "--card": "oklch(0.22 0.014 315)",
  "--card-foreground": "oklch(0.97 0.005 90)",
  "--muted": "oklch(0.25 0.014 315)",
  "--muted-foreground": "oklch(0.79 0.012 90)",
  "--primary": "oklch(0.85 0.16 92)",
  "--primary-foreground": "oklch(0.19 0.012 315)",
  "--border": "oklch(0.32 0.015 315)",
  "--ring": "oklch(0.85 0.16 92)",
} as CSSProperties;

export function CarecasInfotecPage() {
  const logo = useManagedValue("logoUrl", "/images/carecas-infotec/logo.png");
  const hero = useManagedValue("heroImageUrl", "/images/carecas-infotec/banner.webp");

  return (
    <MotionScope intensity="BALANCED">
      <div className="min-h-dvh bg-background text-foreground" style={theme}>
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 px-5 backdrop-blur">
          <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-4">
            <a href="#inicio" aria-label="Careca's Infotec — início">
              <PortfolioImage
                src={logo}
                alt="Careca's Infotec — assistência especializada"
                width={535}
                height={170}
                className="h-11 w-auto object-contain"
              />
            </a>
            <nav aria-label="Navegação principal" className="hidden items-center gap-7 text-sm font-semibold md:flex">
              <a href="#aparelhos" className="hover:text-primary">
                Aparelhos
              </a>
              <a href="#como-funciona" className="hover:text-primary">
                Como funciona
              </a>
              <a href="#loja" className="hover:text-primary">
                A loja
              </a>
            </nav>
            <PortfolioCTAQuiz
              clientKey="carecas-infotec"
              studioName="Careca's Infotec"
              recipientName="Careca's Infotec"
              theme="gold"
              mode="proposal"
              quizConfig={quizConfig}
              className="inline-flex min-h-11 items-center rounded-md bg-primary px-5 text-sm font-bold uppercase tracking-wide text-primary-foreground hover:opacity-90"
            >
              Agendar serviço
            </PortfolioCTAQuiz>
          </div>
        </header>

        <main id="inicio">
          <section className="px-5 py-14 md:py-20">
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
              <div>
                <p className="inline-flex items-center gap-2 rounded-sm bg-primary px-3 py-1 text-xs font-black uppercase tracking-[.18em] text-primary-foreground">
                  <Wrench className="h-4 w-4" /> Assistência especializada
                </p>
                <MotionReveal
                  as="h1"
                  variant="up"
                  intensity="EXPRESSIVE"
                  className="mt-6 text-4xl font-black uppercase leading-[1.02] tracking-tight md:text-6xl"
                >
                  <ManagedText
                    field="heroHeadline"
                    fallback={"Solu\u00e7\u00e3o com qualidade, confian\u00e7a e pre\u00e7o justo."}
                  />
                </MotionReveal>
                <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
                  <ManagedText
                    field="heroSubheadline"
                    fallback={
                      "Assist\u00eancia t\u00e9cnica em celular, computador, notebook, impressora, monitor, tablet e videogame em S\u00e3o Jos\u00e9 dos Pinhais \u2014 PR. Tecnologia em boas m\u00e3os, sempre."
                    }
                  />
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <PortfolioCTAQuiz
                    clientKey="carecas-infotec"
                    studioName="Careca's Infotec"
                    recipientName="Careca's Infotec"
                    theme="gold"
                    mode="proposal"
                    quizConfig={quizConfig}
                    className="inline-flex min-h-12 items-center gap-2 rounded-md bg-primary px-6 font-bold uppercase tracking-wide text-primary-foreground hover:opacity-90"
                  >
                    Agende já seu serviço <ArrowRight className="h-4 w-4" />
                  </PortfolioCTAQuiz>
                  <a
                    href="#aparelhos"
                    className="inline-flex min-h-12 items-center rounded-md border border-border px-6 font-semibold hover:border-primary hover:text-primary"
                  >
                    Ver aparelhos atendidos
                  </a>
                </div>
              </div>
              <PortfolioImage
                src={hero}
                alt="Comunicação da Careca's Infotec com os aparelhos atendidos pela assistência técnica"
                priority
                width={1240}
                height={550}
                className="w-full rounded-lg border border-border object-cover shadow-2xl"
                managedField="heroImageUrl"
              />
            </div>
          </section>

          <section id="aparelhos" className="border-y border-border bg-card px-5 py-16 md:py-24">
            <div className="mx-auto max-w-6xl">
              <h2 className="text-2xl font-black uppercase tracking-tight md:text-4xl">
                Assistência técnica especializada em:
              </h2>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {aparelhos.map(({ icon: Icon, title, text }, i) => (
                  <MotionReveal
                    as="article"
                    variant="up"
                    delay={i * 60}
                    key={title}
                    className="rounded-lg border border-border bg-background p-6 transition duration-200 hover:border-primary"
                  >
                    <Icon className="h-8 w-8 text-primary" />
                    <h3 className="mt-5 text-base font-bold uppercase tracking-wide">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                  </MotionReveal>
                ))}
              </div>
            </div>
          </section>

          <section id="como-funciona" className="px-5 py-16 md:py-24">
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[.2em] text-primary">Como funciona</p>
                <h2 className="mt-3 text-3xl font-black uppercase tracking-tight md:text-4xl">
                  Diagnóstico, orçamento e reparo.
                </h2>
                <ol className="mt-8 space-y-5">
                  {etapas.map((item, index) => (
                    <MotionReveal as="li" variant="right" delay={index * 100} key={item} className="flex gap-4">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary font-black text-primary-foreground">
                        {index + 1}
                      </span>
                      <span className="pt-1.5 font-semibold leading-6">{item}</span>
                    </MotionReveal>
                  ))}
                </ol>
                <PortfolioCTAQuiz
                  clientKey="carecas-infotec"
                  studioName="Careca's Infotec"
                  recipientName="Careca's Infotec"
                  theme="gold"
                  mode="proposal"
                  quizConfig={quizConfig}
                  className="mt-8 inline-flex min-h-12 items-center rounded-md border border-primary px-6 font-bold uppercase tracking-wide text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Descrever o problema
                </PortfolioCTAQuiz>
              </div>
              <PortfolioImage
                src="/images/carecas-infotec/servicos.webp"
                alt="Lista de aparelhos atendidos pela assistência técnica da Careca's Infotec"
                width={670}
                height={350}
                className="w-full rounded-lg border border-border object-cover"
              />
            </div>
          </section>

          <section className="border-y border-border bg-card px-5 py-16 md:py-20">
            <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
              {compromissos.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-lg border border-border bg-background p-6">
                  <Icon className="h-8 w-8 text-primary" />
                  <h3 className="mt-5 text-lg font-bold uppercase tracking-wide">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="loja" className="px-5 py-16 md:py-24">
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_.9fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[.2em] text-primary">A loja</p>
                <h2 className="mt-3 text-3xl font-black uppercase tracking-tight md:text-4xl">
                  Careca's Infotec — assistência que resolve.
                </h2>
                <p className="mt-5 flex items-start gap-3 text-base leading-7 text-muted-foreground">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  Rua Margarida Petrelli Fogiatto, 118 — São José dos Pinhais/PR
                </p>
                <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                  Atendimento rápido e eficiente: descreva o aparelho e o defeito pelo formulário e a
                  equipe responde para combinar o atendimento.
                </p>
              </div>
              <div className="rounded-lg border border-primary/40 bg-card p-8">
                <h3 className="text-xl font-black uppercase tracking-tight">Agende já seu serviço</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Em poucos toques você informa o aparelho, o problema e o melhor momento para o
                  atendimento.
                </p>
                <PortfolioCTAQuiz
                  clientKey="carecas-infotec"
                  studioName="Careca's Infotec"
                  recipientName="Careca's Infotec"
                  theme="gold"
                  mode="proposal"
                  quizConfig={quizConfig}
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-6 font-bold uppercase tracking-wide text-primary-foreground hover:opacity-90"
                >
                  Solicitar atendimento <ArrowRight className="h-4 w-4" />
                </PortfolioCTAQuiz>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-border px-5 py-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <strong className="uppercase tracking-wide">Careca's Infotec</strong>
              <p className="mt-1 text-sm text-muted-foreground">
                Assistência técnica especializada em São José dos Pinhais — PR.
              </p>
            </div>
            <PortfolioHostCredit
              className="text-sm text-muted-foreground"
              linkClassName="font-semibold text-primary"
            />
          </div>
        </footer>

        <PortfolioUpsellPopup pageName="portfolio-carecas-infotec" />
      </div>
    </MotionScope>
  );
}
