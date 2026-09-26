import { useManagedValue } from "@/components/portfolio/PortfolioRuntimeContext";
import {
  ArrowRight,
  Check,
  HardHat,
  ParkingSquare,
  ShieldCheck,
  SprayCan,
  Waypoints,
} from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { MotionReveal, MotionScope } from "@/components/motion";

const scopeLines = [
  {
    code: "A01",
    title: "Estacionamentos",
    text: "Pintura de vagas comuns, PCD e idosos, além de áreas de circulação e organização do fluxo.",
    icon: ParkingSquare,
  },
  {
    code: "A02",
    title: "Sinalização horizontal",
    text: "Faixas de pedestres, setas, carga e descarga e demais demarcações de solo.",
    icon: Waypoints,
  },
  {
    code: "A03",
    title: "Pintura imobiliária",
    text: "Paredes internas e externas para condomínios, comércios, empresas e imóveis.",
    icon: SprayCan,
  },
  {
    code: "A04",
    title: "Estruturas industriais",
    text: "Pintura de barracões, galpões e áreas operacionais conforme o escopo do local.",
    icon: HardHat,
  },
] as const;

const quiz = {
  stepTitles: {
    service: "Qual sinalização você precisa?",
    experience: "Conte sobre o espaço",
    period: "Onde será o serviço?",
    timing: "Quando deseja realizar?",
    note: "Mais detalhes",
  },
  services: [
    "Pintura de estacionamento",
    "Demarcação de vagas PCD e idosos",
    "Faixas e setas de direcionamento",
    "Áreas de carga e descarga",
    "Pintura de paredes",
    "Galpões e estruturas industriais",
  ],
  experienceOptions: [
    "Condomínio",
    "Comércio ou estacionamento",
    "Indústria ou galpão",
    "Empresa ou imóvel",
  ],
  periodOptions: ["Curitiba e região", "Região metropolitana", "Vou confirmar o endereço"],
  timingOptions: ["Preciso de orçamento em breve", "Estou planejando", "Quero uma visita técnica"],
};

function CTA({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <PortfolioCTAQuiz
      clientKey="aguia-sul-sinalizacao"
      studioName="Águia Sul Sinalização"
      recipientName="Águia Sul"
      theme="gold"
      mode="proposal"
      quizConfig={quiz}
      className={className}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function AguiaSulSinalizacaoPage() {
  const logo = useManagedValue("logoUrl", "/images/aguia-sul-sinalizacao/logo.webp");

  return (
    <MotionScope intensity="BALANCED">
      <div className="min-h-dvh overflow-hidden bg-[#f2efe6] text-[#121212]">
        <header className="border-b border-[#121212]/15 bg-[#f2efe6] px-5 py-4 lg:px-8">
          <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-5 md:grid-cols-[1fr_auto_1fr]">
            <a href="#inicio" className="flex items-center gap-3">
              <PortfolioImage
                src={logo}
                alt="Águia Sul Sinalização"
                width={42}
                height={42}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-black uppercase tracking-[.12em]">Águia Sul</p>
                <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#8a6a10]">
                  sinalização e pintura
                </p>
              </div>
            </a>

            <nav
              aria-label="Navegação Águia Sul"
              className="hidden items-center gap-1 border border-[#121212]/15 bg-white/60 p-1 text-[10px] font-black uppercase tracking-[.14em] md:flex"
            >
              <a href="#mapa" className="px-3 py-2 hover:bg-[#f5b51b]">Mapa</a>
              <a href="#setores" className="px-3 py-2 hover:bg-[#f5b51b]">Setores</a>
              <a href="#proposta" className="px-3 py-2 hover:bg-[#f5b51b]">Proposta</a>
            </nav>

            <div className="justify-self-end">
              <CTA className="inline-flex min-h-10 items-center gap-2 border border-[#121212] bg-[#121212] px-4 py-2.5 text-xs font-black uppercase tracking-[.08em] text-white transition hover:bg-[#f5b51b] hover:text-[#121212]">
                Solicitar orçamento
                <ArrowRight className="h-4 w-4" />
              </CTA>
            </div>
          </div>
        </header>

        <main>
          <section id="inicio" className="relative px-5 py-8 lg:px-8 lg:py-10">
            <div className="mx-auto max-w-7xl border border-[#121212]/15 bg-white">
              <div className="grid min-h-[640px] lg:grid-cols-[1fr_17rem]">
                <div className="relative overflow-hidden p-7 sm:p-10 lg:p-14">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-[.16]"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)",
                      backgroundSize: "42px 42px",
                    }}
                  />

                  <div className="relative flex min-h-[520px] flex-col justify-between">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-black uppercase tracking-[.18em]">
                      <span className="inline-flex items-center gap-2 bg-[#f5b51b] px-2 py-1">
                        <span className="h-2 w-2 bg-[#121212]" />
                        mapa de sinalização
                      </span>
                      <span>Curitiba e região</span>
                      <span>solo · pintura · estrutura</span>
                    </div>

                    <div>
                      <MotionReveal
                        as="h1"
                        variant="mask"
                        intensity="EXPRESSIVE"
                        className="max-w-[10ch] font-display text-6xl font-black uppercase leading-[.82] tracking-[-.055em] sm:text-7xl lg:text-[7.2rem]"
                      >
                        Cada linha organiza um espaço.
                      </MotionReveal>
                      <p className="mt-8 max-w-2xl text-base leading-8 text-[#565656] sm:text-lg">
                        Pintura e demarcação horizontal para estacionamentos, condomínios, empresas,
                        indústrias e áreas operacionais.
                      </p>
                      <div className="mt-8 flex flex-wrap gap-3">
                        <CTA className="inline-flex min-h-12 items-center gap-2 bg-[#f5b51b] px-6 py-3.5 text-sm font-black uppercase tracking-[.08em] text-[#121212]">
                          Abrir proposta
                          <ArrowRight className="h-4 w-4" />
                        </CTA>
                        <a
                          href="#mapa"
                          className="inline-flex min-h-12 items-center border border-[#121212]/30 px-6 py-3.5 text-sm font-black uppercase tracking-[.08em]"
                        >
                          Ver escopo
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <aside className="border-t border-[#121212]/15 bg-[#121212] text-white lg:border-l lg:border-t-0">
                  <div className="border-b border-white/15 p-5">
                    <p className="text-[10px] font-black uppercase tracking-[.16em] text-[#f5b51b]">
                      legenda
                    </p>
                  </div>
                  {[
                    ["01", "Estacionamentos"],
                    ["02", "Faixas e setas"],
                    ["03", "Paredes"],
                    ["04", "Galpões"],
                  ].map(([n, label]) => (
                    <div key={n} className="grid grid-cols-[2.4rem_1fr] gap-3 border-b border-white/15 p-5">
                      <span className="font-mono text-xs font-black text-[#f5b51b]">{n}</span>
                      <span className="text-sm font-bold text-white/85">{label}</span>
                    </div>
                  ))}
                  <div className="p-5 text-xs leading-6 text-white/55">
                    O escopo final é definido conforme o tipo de área e a necessidade informada.
                  </div>
                </aside>
              </div>
            </div>
          </section>

          <section id="mapa" className="px-5 py-20 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-10 lg:grid-cols-[.32fr_.68fr]">
                <div className="lg:sticky lg:top-6 lg:self-start">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[.2em] text-[#8a6a10]">
                    Mapa de escopo
                  </p>
                  <h2 className="mt-4 max-w-[8ch] font-display text-4xl font-black uppercase leading-[.92] sm:text-5xl">
                    Do chão à estrutura.
                  </h2>
                  <p className="mt-5 max-w-sm text-sm leading-7 text-[#666]">
                    A solicitação é organizada pela função da área, pelo tipo de pintura e pelo
                    resultado que o espaço precisa comunicar.
                  </p>
                </div>

                <div className="border-t-2 border-[#121212]">
                  {scopeLines.map(({ code, title, text, icon: Icon }) => (
                    <article
                      key={code}
                      className="grid gap-5 border-b border-[#121212]/15 py-7 md:grid-cols-[4rem_1fr_auto] md:items-start"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-black text-[#8a6a10]">{code}</span>
                        <Icon className="h-5 w-5 text-[#8a6a10] md:hidden" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <Icon className="hidden h-5 w-5 text-[#8a6a10] md:block" />
                          <h3 className="font-display text-2xl font-black">{title}</h3>
                        </div>
                        <p className="mt-3 max-w-xl leading-7 text-[#666]">{text}</p>
                      </div>
                      <span className="font-mono text-[10px] font-black uppercase tracking-[.13em] text-[#8a6a10]">
                        área de atuação
                      </span>
                    </article>
                  ))}

                  <div className="grid gap-5 bg-[#121212] p-6 text-white sm:grid-cols-[1fr_auto] sm:items-center">
                    <p className="text-sm leading-6 text-white/65">
                      Informe o tipo de espaço, o serviço desejado e o local para organizar a proposta.
                    </p>
                    <CTA className="inline-flex min-h-11 items-center gap-2 bg-[#f5b51b] px-5 py-3 text-sm font-black text-[#121212]">
                      Descrever área
                      <ArrowRight className="h-4 w-4" />
                    </CTA>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="setores" className="border-y border-[#121212]/15 bg-[#d9d4c8] px-5 py-20 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-8 lg:grid-cols-[.55fr_.45fr]">
                <div className="border border-[#121212]/20 bg-[#f2efe6] p-6 sm:p-8">
                  <div className="grid gap-2">
                    <div className="h-3 w-32 bg-[#f5b51b]" />
                    <div className="h-3 w-52 bg-[#121212]" />
                    <div className="h-3 w-40 bg-[#f5b51b]" />
                  </div>
                  <div className="mt-10 grid grid-cols-2 gap-px bg-[#121212]/20 border border-[#121212]/20">
                    {[
                      ["Vaga comum", "demarcação"],
                      ["PCD / idoso", "identificação"],
                      ["Fluxo", "setas / faixas"],
                      ["Carga", "área dedicada"],
                    ].map(([label, detail]) => (
                      <div key={label} className="bg-white p-5">
                        <p className="text-lg font-black">{label}</p>
                        <p className="mt-1 text-xs font-bold uppercase tracking-[.12em] text-[#8a6a10]">
                          {detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between border border-[#121212]/20 bg-[#121212] p-7 text-white sm:p-9">
                  <div>
                    <p className="font-mono text-[10px] font-black uppercase tracking-[.2em] text-[#f5b51b]">
                      leitura do local
                    </p>
                    <h2 className="mt-5 font-display text-4xl font-black uppercase leading-[.92]">
                      Primeiro vem a função. Depois, a marca no espaço.
                    </h2>
                    <p className="mt-6 leading-8 text-white/65">
                      O orçamento parte da necessidade do ambiente. Estacionamento, circulação,
                      pintura ou estrutura exigem escopos diferentes.
                    </p>
                  </div>

                  <dl className="mt-10 divide-y divide-white/15 border-y border-white/15">
                    {[
                      ["Entrada", "Tipo de espaço"],
                      ["Leitura", "Serviço necessário"],
                      ["Saída", "Próximo passo"],
                    ].map(([term, value]) => (
                      <div key={term} className="grid grid-cols-[5rem_1fr] gap-4 py-5">
                        <dt className="font-mono text-[10px] font-black uppercase tracking-[.12em] text-white/45">{term}</dt>
                        <dd className="text-sm font-bold">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </section>

          <section id="proposta" className="bg-[#f5b51b] px-5 py-14 lg:px-8 lg:py-16">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6" />
                  <p className="font-mono text-[10px] font-black uppercase tracking-[.2em]">
                    Próximo passo
                  </p>
                </div>
                <h2 className="mt-4 max-w-[14ch] font-display text-4xl font-black uppercase leading-[.94] sm:text-5xl">
                  Descreva o espaço. A proposta começa pela necessidade certa.
                </h2>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold">
                  <span><Check className="mr-1 inline h-4 w-4" />Tipo de área</span>
                  <span><Check className="mr-1 inline h-4 w-4" />Serviço desejado</span>
                  <span><Check className="mr-1 inline h-4 w-4" />Prazo pretendido</span>
                </div>
              </div>
              <CTA className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#121212] px-6 py-3.5 text-sm font-black uppercase tracking-[.08em] text-white">
                Solicitar proposta
                <ArrowRight className="h-4 w-4" />
              </CTA>
            </div>
          </section>
        </main>

        <footer className="border-t border-[#121212]/15 bg-[#f2efe6] px-5 py-8 text-sm text-[#666] lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-black uppercase text-[#121212]">
                Águia Sul Sinalização
              </p>
              <p className="mt-1">Pintura e demarcação horizontal em Curitiba e região.</p>
            </div>
            <PortfolioHostCredit linkClassName="font-semibold text-[#121212] underline underline-offset-4" />
          </div>
        </footer>

        <PortfolioSocialProofPopup
          clientKey="aguia-sul-sinalizacao"
          eyebrow="Águia Sul · Sinalização"
          title="Organização e leitura para cada área."
          description="Conte o tipo de espaço e o serviço necessário para organizar o próximo passo."
          ctaLabel="Ver mapa de escopo"
          ctaHref="#mapa"
          delayMs={9000}
          className="border-[#f5b51b]/40 bg-[#121212]/95 text-white"
          accentClassName="text-[#f5b51b]"
        />
        <PortfolioUpsellPopup pageName="portfolio-aguia-sul-sinalizacao" />
      </div>
    </MotionScope>
  );
}
