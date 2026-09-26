import {
  ArrowRight,
  Building2,
  Check,
  Clock3,
  Droplets,
  MapPin,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { MotionImageReveal, MotionReveal, MotionScope } from "@/components/motion";

const quiz = {
  proposalKind: "service" as const,
  services: [
    "Limpeza e conservação",
    "Escritório ou ambiente comercial",
    "Limpeza pós-obra",
    "Vidros, pisos e fachadas",
    "Serviço periódico personalizado",
  ],
  experienceOptions: [
    "Empresa ou escritório",
    "Condomínio",
    "Obra em andamento",
    "Casa ou apartamento",
  ],
  periodOptions: ["Curitiba", "Região Metropolitana", "Ainda preciso confirmar o local"],
  timingOptions: [
    "Preciso avaliar com urgência",
    "Nos próximos dias",
    "Serviço periódico",
    "Estou planejando",
  ],
  stepTitles: {
    service: "Qual limpeza você precisa?",
    experience: "Que tipo de ambiente?",
    period: "Onde será o serviço?",
    timing: "Quando pretende começar?",
  },
  notePlaceholder: "Conte a metragem, frequência e detalhes do ambiente.",
};

const serviceMatrix = [
  {
    icon: Building2,
    environment: "Empresas e escritórios",
    scope: "Limpeza e conservação",
    mode: "Pontual ou periódica",
  },
  {
    icon: ShieldCheck,
    environment: "Obras e entregas",
    scope: "Limpeza pós-obra",
    mode: "Escopo sob medida",
  },
  {
    icon: Droplets,
    environment: "Superfícies de destaque",
    scope: "Vidros, pisos e fachadas",
    mode: "Planejamento por superfície",
  },
  {
    icon: Sparkles,
    environment: "Ambientes diversos",
    scope: "Conservação personalizada",
    mode: "Rotina combinada",
  },
] as const;

const operatingSteps = [
  {
    step: "01",
    title: "Entender o ambiente",
    text: "O atendimento começa pelo tipo de espaço, metragem, frequência e necessidade.",
  },
  {
    step: "02",
    title: "Definir o escopo",
    text: "A rotina é organizada conforme o serviço necessário e a realidade do local.",
  },
  {
    step: "03",
    title: "Combinar a execução",
    text: "O próximo passo é alinhado antes do início, seja um serviço pontual ou periódico.",
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
      clientKey="popys-conservacao-limpeza"
      studioName="POPYS Conservação e Limpeza"
      recipientName="a equipe POPYS"
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

export function PopysConservacaoLimpezaPage() {
  return (
    <MotionScope>
      <div className="min-h-dvh overflow-hidden bg-[#f4f0ec] text-[#211c20]">
        <header className="border-b border-[#211c20]/12 bg-[#f4f0ec] px-5 py-4 lg:px-8">
          <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-5 md:grid-cols-[1fr_auto_1fr]">
            <a href="#inicio" className="font-display text-lg font-black tracking-tight">
              POPYS <span className="text-[#a84964]">Conservação</span>
            </a>
            <nav
              aria-label="Navegação POPYS"
              className="hidden items-center gap-6 text-xs font-black uppercase tracking-[.15em] md:flex"
            >
              <a href="#operacao" className="hover:text-[#a84964]">Operação</a>
              <a href="#processo" className="hover:text-[#a84964]">Processo</a>
              <a href="#contato" className="hover:text-[#a84964]">Orçamento</a>
            </nav>
            <div className="justify-self-end">
              <CTA className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#211c20] px-4 py-2.5 text-xs font-black uppercase tracking-[.12em] text-white">
                Solicitar orçamento
              </CTA>
            </div>
          </div>
        </header>

        <main>
          <section id="inicio" className="px-5 py-10 lg:px-8 lg:py-14">
            <div className="mx-auto max-w-7xl border-y border-[#211c20]/15">
              <div className="grid lg:grid-cols-[.62fr_.38fr]">
                <div className="border-b border-[#211c20]/15 py-12 pr-0 lg:border-b-0 lg:border-r lg:pr-14 lg:py-20">
                  <p className="text-xs font-black uppercase tracking-[.2em] text-[#a84964]">
                    Conservação profissional · Curitiba e Região
                  </p>
                  <MotionReveal variant="up">
                    <h1 className="mt-5 max-w-[11ch] font-display text-5xl font-black leading-[.94] tracking-[-.04em] sm:text-7xl">
                      Limpeza que acompanha a operação do seu espaço.
                    </h1>
                  </MotionReveal>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-[#64545b]">
                    Soluções para empresas, escritórios, obras e ambientes que precisam de cuidado
                    recorrente ou atendimento sob medida.
                  </p>

                  <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-bold text-[#5d4a52]">
                    <span>
                      <MapPin className="mr-1.5 inline h-4 w-4 text-[#a84964]" />
                      Curitiba e Região
                    </span>
                    <span>
                      <Clock3 className="mr-1.5 inline h-4 w-4 text-[#a84964]" />
                      Pontual ou periódico
                    </span>
                  </div>
                </div>

                <aside className="flex flex-col justify-between py-10 lg:py-20 lg:pl-12">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[.18em] text-[#8f7b82]">
                      Leitura rápida
                    </p>
                    <dl className="mt-7 divide-y divide-[#211c20]/12 border-y border-[#211c20]/12">
                      <div className="grid grid-cols-[7.5rem_1fr] gap-4 py-5">
                        <dt className="text-xs font-black uppercase tracking-[.12em] text-[#8f7b82]">
                          Ambientes
                        </dt>
                        <dd className="font-bold">Empresas, escritórios e obras</dd>
                      </div>
                      <div className="grid grid-cols-[7.5rem_1fr] gap-4 py-5">
                        <dt className="text-xs font-black uppercase tracking-[.12em] text-[#8f7b82]">
                          Serviços
                        </dt>
                        <dd className="font-bold">Conservação, pós-obra, vidros, pisos e fachadas</dd>
                      </div>
                      <div className="grid grid-cols-[7.5rem_1fr] gap-4 py-5">
                        <dt className="text-xs font-black uppercase tracking-[.12em] text-[#8f7b82]">
                          Formato
                        </dt>
                        <dd className="font-bold">Atendimento personalizado</dd>
                      </div>
                    </dl>
                  </div>

                  <CTA className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#a84964] px-5 py-3.5 text-sm font-black text-white">
                    Descrever meu ambiente
                  </CTA>
                </aside>
              </div>
            </div>
          </section>

          <section className="px-5 pb-8 lg:px-8 lg:pb-12">
            <div className="mx-auto max-w-7xl overflow-hidden">
              <MotionImageReveal direction="up">
                <PortfolioImage
                  managedField="heroImageUrl"
                  src="/images/popys-conservacao-limpeza/hero-cleaning.png"
                  alt="Profissionais realizando limpeza em um escritório moderno"
                  priority
                  width={1536}
                  height={1024}
                  className="h-[360px] w-full object-cover grayscale-[15%] sm:h-[460px] lg:h-[560px]"
                />
              </MotionImageReveal>
            </div>
          </section>

          <section id="operacao" className="bg-[#211c20] px-5 py-20 text-white lg:px-8 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-10 lg:grid-cols-[.33fr_.67fr]">
                <div className="lg:sticky lg:top-6 lg:self-start">
                  <p className="text-xs font-black uppercase tracking-[.2em] text-[#eab8c6]">
                    Matriz de atendimento
                  </p>
                  <h2 className="mt-4 max-w-[9ch] font-display text-4xl font-black leading-[.96] sm:text-5xl">
                    Cada ambiente pede uma operação diferente.
                  </h2>
                  <p className="mt-5 max-w-sm leading-7 text-white/60">
                    O serviço é organizado pelo espaço, pela superfície e pela frequência necessária.
                  </p>
                </div>

                <div className="border-t border-white/20">
                  <div className="hidden grid-cols-[3.2rem_1fr_1fr_.8fr] gap-5 border-b border-white/20 py-4 text-[11px] font-black uppercase tracking-[.14em] text-white/45 sm:grid">
                    <span />
                    <span>Ambiente</span>
                    <span>Escopo</span>
                    <span>Modalidade</span>
                  </div>
                  {serviceMatrix.map(({ icon: Icon, environment, scope, mode }, index) => (
                    <article
                      key={environment}
                      className="grid gap-4 border-b border-white/20 py-7 sm:grid-cols-[3.2rem_1fr_1fr_.8fr] sm:items-center sm:gap-5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-[#eab8c6]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <Icon className="h-5 w-5 text-[#eab8c6] sm:hidden" />
                      </div>
                      <div className="flex items-center gap-3">
                        <Icon className="hidden h-5 w-5 shrink-0 text-[#eab8c6] sm:block" />
                        <h3 className="font-black">{environment}</h3>
                      </div>
                      <p className="text-white/75">{scope}</p>
                      <p className="text-sm font-semibold text-white/55">{mode}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="processo" className="px-5 py-20 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-10 lg:grid-cols-[.42fr_.58fr]">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.2em] text-[#a84964]">
                    Método de atendimento
                  </p>
                  <h2 className="mt-4 max-w-[10ch] font-display text-4xl font-black leading-tight sm:text-5xl">
                    Primeiro o espaço. Depois a rotina.
                  </h2>
                  <p className="mt-5 max-w-md leading-7 text-[#64545b]">
                    A POPYS entende o local e organiza o escopo adequado antes de começar.
                  </p>
                </div>

                <ol className="border-l border-[#211c20]/20">
                  {operatingSteps.map(({ step, title, text }) => (
                    <li
                      key={step}
                      className="relative grid gap-4 border-b border-[#211c20]/15 py-7 pl-8 sm:grid-cols-[4rem_1fr]"
                    >
                      <span className="absolute -left-[5px] top-9 h-2.5 w-2.5 rounded-full bg-[#a84964]" />
                      <span className="text-sm font-black text-[#a84964]">{step}</span>
                      <div>
                        <h3 className="text-2xl font-black">{title}</h3>
                        <p className="mt-2 max-w-xl leading-7 text-[#6b5a61]">{text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-14 grid gap-6 border-t border-[#211c20]/15 pt-8 md:grid-cols-[1fr_auto] md:items-center">
                <div className="flex flex-wrap gap-x-7 gap-y-3 text-sm font-bold text-[#5d4a52]">
                  <span><Check className="mr-1.5 inline h-4 w-4 text-[#a84964]" />Atendimento personalizado</span>
                  <span><Check className="mr-1.5 inline h-4 w-4 text-[#a84964]" />Serviço pontual ou periódico</span>
                  <span><Waves className="mr-1.5 inline h-4 w-4 text-[#a84964]" />Escopo conforme o ambiente</span>
                </div>
                <CTA className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#211c20] px-5 py-3.5 text-sm font-black text-[#211c20]">
                  Organizar avaliação
                </CTA>
              </div>
            </div>
          </section>

          <section id="contato" className="bg-[#c86d86] px-5 py-16 text-white lg:px-8 lg:py-20">
            <div className="mx-auto max-w-7xl">
              <p className="text-xs font-black uppercase tracking-[.2em] text-white/70">
                Curitiba e Região
              </p>
              <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <h2 className="max-w-[13ch] font-display text-5xl font-black leading-[.95] tracking-[-.03em] sm:text-6xl">
                    Um ambiente cuidado começa com um escopo claro.
                  </h2>
                  <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
                    Conte o tipo de espaço, a frequência e o que precisa. A POPYS organiza o próximo passo.
                  </p>
                </div>
                <CTA className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-white px-6 py-3.5 text-sm font-black text-[#8f3f58]">
                  Solicitar orçamento
                </CTA>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-[#171215] px-5 py-8 text-sm text-white/55 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-black text-white">POPYS Conservação e Limpeza</p>
              <p className="mt-1">Limpeza, conservação e cuidado profissional em Curitiba e Região.</p>
            </div>
            <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4" />
          </div>
        </footer>

        <PortfolioSocialProofPopup
          clientKey="popys-conservacao-limpeza"
          eyebrow="POPYS Conservação e Limpeza"
          title="Seu ambiente merece cuidado constante."
          description="Conte o tipo de espaço e receba um próximo passo personalizado."
          ctaLabel="Ver operação"
          ctaHref="#operacao"
          delayMs={10000}
          className="border-[#c86d86]/40 bg-[#211c20]/95 text-white"
          accentClassName="text-[#eab8c6]"
        />
        <PortfolioUpsellPopup pageName="portfolio-popys-conservacao-limpeza" />
      </div>
    </MotionScope>
  );
}
