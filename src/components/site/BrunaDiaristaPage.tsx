import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Home,
  Sparkles,
  UserRound,
} from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const quiz = {
  services: [
    "Diária de 4 horas · R$ 130 + deslocamento",
    "Diária de 6 horas · R$ 160 + deslocamento",
    "Diária de 8 horas · R$ 200 + deslocamento",
    "Pós-obra ou personal organizer",
    "Duas profissionais",
  ],
  experienceOptions: ["Casa ou apartamento", "Escritório", "Pós-obra", "Organização de ambientes"],
  periodOptions: ["Curitiba", "Região Metropolitana", "Vou confirmar o endereço"],
  timingOptions: ["Para esta semana", "Atendimento periódico", "Estou planejando"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "Qual diária você precisa?",
    experience: "Que ambiente vamos cuidar?",
    period: "Onde será o atendimento?",
    timing: "Quando pretende começar?",
  },
  notePlaceholder: "Conte a metragem, frequência e detalhes do ambiente.",
};

const plans = [
  ["Uma profissional", "4 horas", "R$ 130 + deslocamento"],
  ["Uma profissional", "6 horas", "R$ 160 + deslocamento"],
  ["Uma profissional", "8 horas", "R$ 200 + deslocamento"],
  ["Duas profissionais", "4 horas", "R$ 220 + deslocamento"],
  ["Duas profissionais", "6 horas", "R$ 280 + deslocamento"],
  ["Duas profissionais", "8 horas", "R$ 420 + deslocamento"],
] as const;

const routines = [
  {
    icon: Home,
    title: "Rotina da casa",
    text: "Casas e apartamentos com cuidado distribuído conforme o tempo contratado.",
  },
  {
    icon: Sparkles,
    title: "Pós-obra e pós-mudança",
    text: "Atendimento mais intenso para recuperar o ambiente depois de uma fase pesada.",
  },
  {
    icon: UserRound,
    title: "Organização",
    text: "Personal organizer para colocar ambientes e rotinas de volta no lugar.",
  },
] as const;

function CTA({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <PortfolioCTAQuiz
      clientKey="bruna-diarista"
      studioName="Bruna Diarista"
      recipientName="a equipe da Bruna"
      theme="pink"
      mode="proposal"
      quizConfig={quiz}
      className={className}
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </PortfolioCTAQuiz>
  );
}

export function BrunaDiaristaPage() {
  return (
    <div className="min-h-dvh overflow-hidden bg-[#fffaf7] text-[#253047]">
      <header className="border-b border-[#253047]/15 bg-[#fffaf7] px-5 py-4 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <a href="#inicio" className="font-display text-lg font-black tracking-tight">
            Bruna <span className="text-[#c62069]">Diarista</span>
          </a>
          <div className="hidden items-center gap-6 text-[10px] font-black uppercase tracking-[.14em] md:flex">
            <a href="#semana">Semana</a>
            <a href="#valores">Valores</a>
            <a href="#rotinas">Rotinas</a>
          </div>
          <CTA className="inline-flex min-h-10 items-center gap-2 bg-[#253047] px-4 py-2.5 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#c62069]">
            Consultar agenda
          </CTA>
        </div>
      </header>

      <main>
        <section id="inicio" className="px-5 py-8 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[.58fr_.42fr] lg:items-end">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#c62069]">
                  Curitiba e Região Metropolitana
                </p>
                <h1 className="mt-5 max-w-[10ch] font-display text-6xl font-black leading-[.88] tracking-[-.05em] sm:text-7xl lg:text-[7.4rem]">
                  Limpeza que cabe na sua semana.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6b6570]">
                  Diárias de 4h, 6h ou 8h, atendimento com uma ou duas profissionais e opções para
                  pós-obra e organização.
                </p>
              </div>

              <aside className="border-l-4 border-[#c62069] pl-6">
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#a04c70]">
                  agenda orientada pelo tempo
                </p>
                <div className="mt-5 space-y-5">
                  <div className="flex gap-4">
                    <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#c62069]" />
                    <p className="text-sm leading-7 text-[#6b6570]">
                      Escolha a duração primeiro. Depois informe ambiente, local e frequência.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-[#c62069]" />
                    <p className="text-sm leading-7 text-[#6b6570]">
                      Atendimento de segunda a sábado, sujeito à disponibilidade confirmada no funil.
                    </p>
                  </div>
                </div>
              </aside>
            </div>

            <figure className="relative mt-10 overflow-hidden border-y-2 border-[#253047] bg-[#253047]">
              <PortfolioImage
                managedField="heroImageUrl"
                src="/images/bruna-diarista/hero.png"
                alt="Profissional organizando e limpando uma sala de estar"
                priority
                width={1536}
                height={1024}
                className="h-[420px] w-full object-cover sm:h-[560px]"
              />
              <figcaption className="grid gap-4 border-t-2 border-[#253047] bg-[#f6dbe6] px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <p className="font-black text-[#253047]">
                  Casa em ordem, rotina mais leve.
                </p>
                <span className="text-xs font-bold text-[#8b5870]">
                  Limpeza · pós-obra · organização
                </span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section id="semana" className="bg-[#253047] px-5 py-20 text-white lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#f4b8d0]">
                  monte a sua semana
                </p>
                <h2 className="mt-4 max-w-[11ch] font-display text-4xl font-black leading-[.94] sm:text-5xl">
                  O tempo da diária define o ritmo do atendimento.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-white/60">
                O funil registra duração, tipo de ambiente, região e urgência. Assim o atendimento
                parte de uma necessidade concreta, não de um pacote genérico.
              </p>
            </div>

            <div className="mt-10 grid border-y border-white/20 md:grid-cols-3">
              {[
                ["4h", "Enxuta", "Para necessidades mais objetivas ou manutenção direcionada."],
                ["6h", "Intermediária", "Mais tempo para distribuir o cuidado por diferentes ambientes."],
                ["8h", "Completa", "Uma diária longa para rotinas maiores e demandas mais extensas."],
              ].map(([time, title, text], index) => (
                <article
                  key={time}
                  className="border-b border-white/20 py-7 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0"
                >
                  <span className="font-mono text-xs font-black text-[#f4b8d0]">0{index + 1}</span>
                  <p className="mt-5 font-display text-5xl font-black text-white">{time}</p>
                  <h3 className="mt-3 text-lg font-black">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/55">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="valores" className="px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[.28fr_.72fr]">
              <aside>
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#c62069]">
                  tabela transparente
                </p>
                <h2 className="mt-4 font-display text-4xl font-black leading-[.94]">
                  Equipe, tempo e valor.
                </h2>
                <p className="mt-5 text-sm leading-7 text-[#6b6570]">
                  Pós-obra, pós-mudança e organização: R$ 35,00 por hora + deslocamento.
                </p>
              </aside>

              <div className="overflow-x-auto border-2 border-[#253047]">
                <table className="w-full min-w-[660px] border-collapse bg-white">
                  <thead>
                    <tr className="bg-[#f6dbe6] text-left text-[10px] font-black uppercase tracking-[.16em]">
                      <th className="border-b-2 border-[#253047] px-5 py-4">Equipe</th>
                      <th className="border-b-2 border-[#253047] px-5 py-4">Duração</th>
                      <th className="border-b-2 border-[#253047] px-5 py-4">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map(([people, hours, price]) => (
                      <tr key={people + hours} className="border-b border-[#253047]/15 last:border-b-0">
                        <td className="px-5 py-5 font-black">{people}</td>
                        <td className="px-5 py-5 text-xl font-black text-[#c62069]">{hours}</td>
                        <td className="px-5 py-5 text-sm font-bold text-[#6b6570]">{price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-5 border-t border-[#253047]/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-sm leading-6 text-[#6b6570]">
                Deslocamento e disponibilidade são confirmados antes do fechamento.
              </p>
              <CTA className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#c62069] px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#a51f58]">
                Escolher diária
              </CTA>
            </div>
          </div>
        </section>

        <section id="rotinas" className="border-y border-[#253047]/15 bg-[#f4eee8] px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#c62069]">
              o que entra no cuidado
            </p>

            <div className="mt-8 divide-y divide-[#253047]/15 border-y border-[#253047]/15">
              {routines.map(({ icon: Icon, title, text }, index) => (
                <article
                  key={title}
                  className="grid gap-5 py-7 sm:grid-cols-[3rem_1.2fr_1fr] sm:items-start"
                >
                  <span className="font-mono text-xs font-black text-[#c62069]">0{index + 1}</span>
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-[#c62069]" />
                    <h3 className="font-display text-2xl font-black">{title}</h3>
                  </div>
                  <p className="leading-7 text-[#6b6570]">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="agenda" className="bg-[#f6dbe6] px-5 py-14 lg:px-8 lg:py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#8b5870]">
                fechar a agenda
              </p>
              <h2 className="mt-4 max-w-[14ch] font-display text-4xl font-black leading-[.94] sm:text-5xl">
                Diga o tempo, o ambiente e a região.
              </h2>
              <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold text-[#6b6570]">
                <span><Check className="mr-1 inline h-4 w-4" />4h, 6h ou 8h</span>
                <span><Check className="mr-1 inline h-4 w-4" />1 ou 2 profissionais</span>
                <span><Check className="mr-1 inline h-4 w-4" />Curitiba e Região</span>
              </div>
            </div>
            <CTA className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#253047] px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#c62069]">
              Consultar horário
            </CTA>
          </div>
        </section>
      </main>

      <footer className="bg-[#1d2639] px-5 py-8 text-sm text-white/60 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-black text-white">Bruna Diarista</p>
            <p className="mt-1">Limpeza, pós-obra e organização em Curitiba e Região.</p>
          </div>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="bruna-diarista"
        eyebrow="Bruna Diarista"
        title="Uma casa em ordem deixa a rotina mais leve."
        description="Conte sua necessidade e receba um próximo passo cuidadoso."
        ctaLabel="Consultar agenda"
        ctaHref="#agenda"
        delayMs={10000}
        className="border-[#f4d8e3] bg-[#253047]/95 text-white"
        accentClassName="text-[#f6abc9]"
      />
      <PortfolioUpsellPopup pageName="portfolio-bruna-diarista" />
    </div>
  );
}
