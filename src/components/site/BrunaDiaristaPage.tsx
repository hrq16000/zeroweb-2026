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
import { MotionImageReveal, MotionReveal, MotionScope } from "@/components/motion";

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

const serviceNotes = [
  {
    icon: Home,
    title: "Limpeza de rotina",
    text: "Casas e apartamentos cuidados com atenção em cada ambiente.",
  },
  {
    icon: Sparkles,
    title: "Limpeza pesada",
    text: "Uma rotina mais profunda para recuperar a sensação de casa em ordem.",
  },
  {
    icon: UserRound,
    title: "Personal organizer",
    text: "Organização de ambientes para ganhar espaço, agilidade e bem-estar.",
  },
] as const;

function CTA({
  children,
  className,
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
    <MotionScope>
      <div className="min-h-dvh overflow-hidden bg-[#fbf7f1] text-[#18233d]">
        <header className="border-b border-[#18233d]/10 bg-[#fbf7f1] px-5 py-4 lg:px-8">
          <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
            <a href="#inicio" className="font-display text-lg font-black tracking-tight">
              Bruna <span className="text-[#c62069]">Diarista</span>
            </a>
            <nav
              aria-label="Navegação da página"
              className="hidden items-center gap-2 rounded-full border border-[#18233d]/10 bg-white/70 px-2 py-1 text-xs font-black uppercase tracking-[.14em] md:flex"
            >
              <a href="#agenda" className="rounded-full px-3 py-2 hover:bg-[#f4d8e3]">Agenda</a>
              <a href="#diarias" className="rounded-full px-3 py-2 hover:bg-[#f4d8e3]">Diárias</a>
              <a href="#cuidados" className="rounded-full px-3 py-2 hover:bg-[#f4d8e3]">Cuidados</a>
            </nav>
            <div className="justify-self-end text-xs font-bold text-[#725d67]">
              Curitiba e Região
            </div>
          </div>
        </header>

        <main>
          <section id="inicio" className="px-5 pb-12 pt-7 lg:px-8 lg:pb-20 lg:pt-10">
            <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.25fr_.75fr]">
              <div className="relative min-h-[620px] overflow-hidden rounded-[2.75rem] bg-[#18233d] text-white">
                <MotionImageReveal direction="up">
                  <PortfolioImage
                    managedField="heroImageUrl"
                    src="/images/bruna-diarista/hero.png"
                    alt="Profissional organizando e limpando uma sala de estar"
                    priority
                    width={1536}
                    height={1024}
                    className="absolute inset-0 h-full w-full object-cover opacity-55"
                  />
                </MotionImageReveal>
                <div className="absolute inset-0 bg-gradient-to-t from-[#18233d] via-[#18233d]/65 to-[#18233d]/10" />
                <div className="relative flex min-h-[620px] flex-col justify-between p-7 sm:p-10 lg:p-14">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-black uppercase tracking-[.22em] text-[#f8bfd7]">
                      Diárias · organização · Curitiba
                    </span>
                    <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-bold text-white/75">
                      Seg. a sáb.
                    </span>
                  </div>

                  <div>
                    <MotionReveal variant="up">
                      <h1 className="max-w-[9ch] font-display text-6xl font-black leading-[.86] tracking-[-.05em] sm:text-7xl lg:text-[6.8rem]">
                        Casa em ordem.
                        <span className="mt-2 block text-[#f6abc9]">Rotina mais leve.</span>
                      </h1>
                    </MotionReveal>
                    <div className="mt-8 grid gap-6 border-t border-white/20 pt-6 md:grid-cols-[1fr_auto] md:items-end">
                      <p className="max-w-xl text-base leading-7 text-white/75 sm:text-lg">
                        Limpeza cuidadosa, pós-obra e organização para quem valoriza tempo,
                        confiança e um ambiente bem cuidado.
                      </p>
                      <CTA className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#e52d83] px-6 py-3.5 text-sm font-black text-white shadow-lg">
                        Consultar agenda
                      </CTA>
                    </div>
                  </div>
                </div>
              </div>

              <aside
                id="agenda"
                className="flex flex-col justify-between rounded-[2.75rem] border border-[#18233d]/10 bg-[#f4d8e3] p-7 sm:p-9"
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-[.18em] text-[#9c315c]">
                    Antes de escolher
                  </p>
                  <h2 className="mt-4 font-display text-4xl font-black leading-tight">
                    Quanto tempo o seu ambiente pede?
                  </h2>
                  <p className="mt-4 leading-7 text-[#674d5a]">
                    A diária é organizada por duração e quantidade de profissionais. O deslocamento
                    é confirmado no atendimento.
                  </p>
                </div>

                <div className="mt-10 space-y-5 border-t border-[#18233d]/15 pt-7">
                  <div className="flex gap-4">
                    <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#c62069]" />
                    <div>
                      <p className="font-black">4h, 6h ou 8h</p>
                      <p className="mt-1 text-sm leading-6 text-[#725d67]">
                        Escolha a duração conforme a necessidade do espaço.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-[#c62069]" />
                    <div>
                      <p className="font-black">Atendimento com agendamento</p>
                      <p className="mt-1 text-sm leading-6 text-[#725d67]">
                        Disponibilidade confirmada pelo funil antes do fechamento.
                      </p>
                    </div>
                  </div>
                </div>

                <a
                  href="#diarias"
                  className="mt-10 inline-flex items-center gap-2 text-sm font-black text-[#8b2851]"
                >
                  Comparar diárias <ArrowRight className="h-4 w-4" />
                </a>
              </aside>
            </div>
          </section>

          <section id="diarias" className="bg-[#18233d] px-5 py-20 text-white lg:px-8 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-8 lg:grid-cols-[.36fr_.64fr]">
                <div className="lg:sticky lg:top-6 lg:self-start">
                  <p className="text-xs font-black uppercase tracking-[.2em] text-[#f6abc9]">
                    Tabela de diárias
                  </p>
                  <h2 className="mt-4 max-w-[9ch] font-display text-5xl font-black leading-[.95]">
                    Tempo, equipe e valor. Sem esconder a conta.
                  </h2>
                  <p className="mt-5 max-w-sm leading-7 text-white/65">
                    Pós-obra, pós-mudança e organização: R$ 35,00 por hora + deslocamento.
                  </p>
                </div>

                <div className="border-t border-white/20">
                  {plans.map(([people, hours, price], index) => (
                    <article
                      key={people + hours}
                      className="grid gap-4 border-b border-white/20 py-6 sm:grid-cols-[3.5rem_1.2fr_.6fr_1fr] sm:items-center"
                    >
                      <span className="text-xs font-black text-[#f6abc9]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="text-lg font-black">{people}</p>
                        <p className="mt-1 text-xs uppercase tracking-[.14em] text-white/45">
                          diária profissional
                        </p>
                      </div>
                      <p className="text-2xl font-black">{hours}</p>
                      <p className="font-bold text-white/75">{price}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-5 border-t border-white/20 pt-7 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-2xl text-sm leading-6 text-white/55">
                  Confirme disponibilidade e deslocamento antes de fechar. O atendimento registra o
                  tipo de ambiente e a frequência pretendida.
                </p>
                <CTA className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f6abc9] px-6 py-3.5 text-sm font-black text-[#18233d]">
                  Escolher minha diária
                </CTA>
              </div>
            </div>
          </section>

          <section id="cuidados" className="px-5 py-20 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-10 lg:grid-cols-[.42fr_.58fr]">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.18em] text-[#c62069]">
                    O que pode entrar na rotina
                  </p>
                  <h2 className="mt-4 font-display text-4xl font-black leading-tight sm:text-5xl">
                    O serviço muda conforme o ambiente.
                  </h2>
                  <p className="mt-5 max-w-md leading-7 text-[#6a5960]">
                    A proposta não parte de um pacote genérico: primeiro vem a necessidade real do
                    espaço, depois a combinação de tempo e frequência.
                  </p>
                </div>

                <div className="divide-y divide-[#18233d]/15 border-y border-[#18233d]/15">
                  {serviceNotes.map(({ icon: Icon, title, text }, index) => (
                    <article
                      key={title}
                      className="grid gap-5 py-7 sm:grid-cols-[3.5rem_1fr_auto] sm:items-start"
                    >
                      <div className="grid h-11 w-11 place-items-center rounded-full bg-[#f4d8e3]">
                        <Icon className="h-5 w-5 text-[#c62069]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black">{title}</h3>
                        <p className="mt-2 max-w-xl leading-7 text-[#6a5960]">{text}</p>
                      </div>
                      <span className="text-xs font-black text-[#b08a9a]">
                        0{index + 1}
                      </span>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="px-5 pb-20 lg:px-8 lg:pb-24">
            <div className="mx-auto max-w-7xl rounded-[2.75rem] bg-[#e52d83] p-8 text-white sm:p-10 lg:p-14">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.2em] text-white/70">
                    Próximo passo
                  </p>
                  <h2 className="mt-4 max-w-[13ch] font-display text-4xl font-black leading-tight sm:text-6xl">
                    Conte o tamanho da rotina. A agenda começa por aí.
                  </h2>
                  <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-white/80">
                    <span><Check className="mr-1 inline h-4 w-4" />Casa ou apartamento</span>
                    <span><Check className="mr-1 inline h-4 w-4" />Escritório</span>
                    <span><Check className="mr-1 inline h-4 w-4" />Pós-obra</span>
                  </div>
                </div>
                <CTA className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-black text-[#a51f58]">
                  Solicitar horário
                </CTA>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-[#18233d]/10 px-5 py-8 text-sm text-[#6a5960] lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-black text-[#18233d]">Bruna Diarista</p>
              <p className="mt-1">Limpeza, pós-obra e organização em Curitiba e Região.</p>
            </div>
            <PortfolioHostCredit linkClassName="font-semibold text-[#18233d] underline underline-offset-4" />
          </div>
        </footer>

        <PortfolioSocialProofPopup
          clientKey="bruna-diarista"
          eyebrow="Bruna Diarista"
          title="Uma casa em ordem deixa a rotina mais leve."
          description="Conte sua necessidade e receba um próximo passo cuidadoso."
          ctaLabel="Comparar diárias"
          ctaHref="#diarias"
          delayMs={10000}
          className="border-[#f4d8e3] bg-[#18233d]/95 text-white"
          accentClassName="text-[#f6abc9]"
        />
        <PortfolioUpsellPopup pageName="portfolio-bruna-diarista" />
      </div>
    </MotionScope>
  );
}
