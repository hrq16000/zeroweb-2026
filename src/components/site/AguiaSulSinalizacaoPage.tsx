import { useManagedValue } from "@/components/portfolio/PortfolioRuntimeContext";
import { motion } from "motion/react";
import {
  ArrowRight,
  HardHat,
  ParkingSquare,
  SprayCan,
  Waypoints,
} from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const services = [
  {
    code: "P01",
    icon: ParkingSquare,
    title: "Estacionamentos",
    text: "Pintura e organização visual de vagas comuns, PCD e idosos conforme a necessidade do espaço.",
    use: "vagas · circulação",
  },
  {
    code: "P02",
    icon: Waypoints,
    title: "Sinalização horizontal",
    text: "Faixas de pedestres, setas, áreas de carga e descarga e outras demarcações de solo.",
    use: "fluxo · orientação",
  },
  {
    code: "P03",
    icon: SprayCan,
    title: "Pintura imobiliária",
    text: "Pintura de paredes internas e externas para condomínios, comércios e empresas.",
    use: "paredes · áreas comuns",
  },
  {
    code: "P04",
    icon: HardHat,
    title: "Áreas industriais",
    text: "Pintura de barracões, galpões e áreas operacionais conforme o escopo do projeto.",
    use: "galpões · operação",
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
    <div className="min-h-dvh overflow-hidden bg-[#0c0d0f] text-[#f7f4ec]">
      <header className="border-b border-[#f5b51b]/25 bg-[#0c0d0f] px-5 py-3 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-5 md:grid-cols-[1fr_auto_1fr]">
          <a href="#inicio" className="flex items-center gap-3" aria-label="Águia Sul Sinalização">
            <PortfolioImage
              src={logo}
              alt="Águia Sul Sinalização"
              width={44}
              height={44}
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="font-display text-sm font-black uppercase tracking-[.12em]">
              Águia <span className="text-[#f5b51b]">Sul</span>
            </span>
          </a>

          <nav
            aria-label="Navegação da página"
            className="hidden gap-7 text-[10px] font-black uppercase tracking-[.18em] text-white/55 md:flex"
          >
            <a href="#aplicacoes" className="hover:text-[#f5b51b]">Aplicações</a>
            <a href="#leitura" className="hover:text-[#f5b51b]">Leitura do espaço</a>
            <a href="#orcamento" className="hover:text-[#f5b51b]">Orçamento</a>
          </nav>

          <div className="justify-self-end">
            <CTA className="inline-flex min-h-10 items-center gap-2 border border-[#f5b51b] px-4 py-2.5 text-xs font-black uppercase tracking-[.12em] text-[#f5b51b] hover:bg-[#f5b51b] hover:text-[#101010]">
              Solicitar proposta
              <ArrowRight className="h-4 w-4" />
            </CTA>
          </div>
        </div>
      </header>

      <main>
        <section id="inicio" className="relative px-5 py-10 lg:px-8 lg:py-14">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden border border-white/10">
              <div className="pointer-events-none absolute inset-0 opacity-55">
                <div className="absolute left-[8%] top-0 h-full w-px bg-[#f5b51b]/35" />
                <div className="absolute left-[32%] top-0 h-full w-px bg-white/10" />
                <div className="absolute left-[68%] top-0 h-full w-px bg-white/10" />
                <div className="absolute right-[8%] top-0 h-full w-px bg-[#f5b51b]/35" />
                <div className="absolute left-1/2 top-0 h-full -translate-x-1/2 border-l-2 border-dashed border-[#f5b51b]/45" />
              </div>

              <div className="relative grid min-h-[630px] lg:grid-cols-[1fr_17rem]">
                <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-14">
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-[.2em] text-white/45">
                    <span className="text-[#f5b51b]">Sinalização horizontal</span>
                    <span>Curitiba e região</span>
                    <span>condomínios · empresas · indústrias</span>
                  </div>

                  <div>
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-[10ch] font-display text-6xl font-black uppercase leading-[.86] tracking-[-.05em] sm:text-7xl lg:text-[7rem]"
                    >
                      Organizar o chão muda a leitura do espaço.
                    </motion.h1>
                    <div className="mt-9 grid gap-7 border-t border-white/15 pt-7 lg:grid-cols-[1fr_auto] lg:items-end">
                      <p className="max-w-2xl text-base leading-8 text-white/65">
                        Pintura e demarcação para estacionamentos, áreas de circulação, empresas,
                        condomínios, galpões e estruturas operacionais.
                      </p>
                      <CTA className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#f5b51b] px-6 py-3.5 text-sm font-black uppercase tracking-[.08em] text-[#101010]">
                        Descrever o espaço
                        <ArrowRight className="h-4 w-4" />
                      </CTA>
                    </div>
                  </div>
                </div>

                <aside className="border-t border-white/10 bg-[#15171a]/95 p-6 lg:border-l lg:border-t-0">
                  <p className="text-[10px] font-black uppercase tracking-[.18em] text-white/35">
                    legenda
                  </p>
                  <div className="mt-7 space-y-6">
                    {[
                      ["01", "Vagas"],
                      ["02", "Faixas e setas"],
                      ["03", "Paredes"],
                      ["04", "Galpões"],
                    ].map(([n, label]) => (
                      <div key={n} className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-white/10 pb-5">
                        <span className="font-mono text-xs font-black text-[#f5b51b]">{n}</span>
                        <span className="text-sm font-bold text-white/70">{label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 border-t border-white/10 pt-6">
                    <PortfolioImage
                      src={logo}
                      alt="Marca Águia Sul Sinalização"
                      priority
                      width={1024}
                      height={1024}
                      managedField="heroImageUrl"
                      className="aspect-square w-full object-cover"
                    />
                    <p className="mt-3 text-[9px] font-black uppercase tracking-[.14em] text-white/30">
                      identidade Águia Sul
                    </p>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </section>

        <section id="aplicacoes" className="bg-[#f2efe6] px-5 py-20 text-[#151515] lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[.3fr_.7fr]">
              <div className="lg:sticky lg:top-6 lg:self-start">
                <p className="font-mono text-[10px] font-black uppercase tracking-[.2em] text-[#9b7200]">
                  Aplicações
                </p>
                <h2 className="mt-4 max-w-[8ch] font-display text-4xl font-black uppercase leading-[.92] sm:text-5xl">
                  Cada marca tem uma função.
                </h2>
                <p className="mt-5 max-w-sm text-sm leading-7 text-[#66645f]">
                  O orçamento parte do tipo de área e do que precisa ser demarcado ou pintado.
                </p>
              </div>

              <div className="border-t-2 border-[#151515]">
                {services.map(({ code, icon: Icon, title, text, use }) => (
                  <article
                    key={code}
                    className="grid gap-5 border-b border-[#151515]/15 py-7 md:grid-cols-[4rem_1fr_.7fr] md:items-start"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-black text-[#9b7200]">{code}</span>
                      <Icon className="h-5 w-5 text-[#9b7200] md:hidden" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <Icon className="hidden h-5 w-5 text-[#9b7200] md:block" />
                        <h3 className="font-display text-2xl font-black">{title}</h3>
                      </div>
                      <p className="mt-3 max-w-xl leading-7 text-[#66645f]">{text}</p>
                    </div>
                    <p className="font-mono text-[10px] font-black uppercase leading-5 tracking-[.14em] text-[#8f8773]">
                      {use}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="leitura" className="px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-5 lg:grid-cols-[.58fr_.42fr]">
              <div className="border border-[#f5b51b]/25 p-7 sm:p-10 lg:p-12">
                <p className="font-mono text-[10px] font-black uppercase tracking-[.2em] text-[#f5b51b]">
                  Leitura do espaço
                </p>
                <h2 className="mt-5 max-w-[11ch] font-display text-4xl font-black uppercase leading-[.92] sm:text-5xl">
                  Fluxo, uso e área antes da proposta.
                </h2>
                <p className="mt-6 max-w-2xl leading-8 text-white/60">
                  Para organizar um orçamento, a Águia Sul precisa entender o tipo de local,
                  a demarcação desejada, a região e o prazo pretendido.
                </p>

                <ol className="mt-10 divide-y divide-white/10 border-y border-white/10">
                  {[
                    ["01", "Tipo de área", "estacionamento, condomínio, empresa ou galpão"],
                    ["02", "Demarcação", "vagas, faixas, setas, paredes ou outra necessidade"],
                    ["03", "Local e prazo", "região e momento pretendido para o serviço"],
                  ].map(([n, title, text]) => (
                    <li key={n} className="grid gap-4 py-5 sm:grid-cols-[3rem_9rem_1fr]">
                      <span className="font-mono text-xs font-black text-[#f5b51b]">{n}</span>
                      <span className="font-bold text-white">{title}</span>
                      <span className="text-sm text-white/50">{text}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="relative min-h-[460px] overflow-hidden border border-white/10 bg-[#15171a]">
                <div className="absolute inset-x-[18%] top-0 h-full border-x border-white/10" />
                <div className="absolute left-1/2 top-0 h-full -translate-x-1/2 border-l-2 border-dashed border-[#f5b51b]/55" />
                <div className="absolute inset-x-0 top-[38%] h-px bg-[#f5b51b]/30" />
                <div className="absolute inset-x-0 top-[68%] h-px bg-white/10" />
                <div className="relative flex h-full min-h-[460px] flex-col justify-between p-7 sm:p-9">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[.18em] text-white/35">
                      mapa de uso
                    </p>
                    <p className="mt-4 max-w-[13ch] font-display text-3xl font-black uppercase leading-tight">
                      Sinalizar é tornar o caminho legível.
                    </p>
                  </div>
                  <CTA className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#f5b51b] bg-[#0c0d0f] px-5 py-3.5 text-sm font-black text-[#f5b51b]">
                    Montar orçamento
                    <ArrowRight className="h-4 w-4" />
                  </CTA>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="orcamento" className="bg-[#f5b51b] px-5 py-14 text-[#101010] lg:px-8 lg:py-16">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[.2em]">
                Solicitação
              </p>
              <h2 className="mt-4 max-w-[15ch] font-display text-4xl font-black uppercase leading-[.94] sm:text-5xl">
                Conte o espaço e a demarcação. O orçamento começa daí.
              </h2>
            </div>
            <CTA className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#101010] px-6 py-3.5 text-sm font-black uppercase tracking-[.08em] text-white">
              Solicitar proposta
              <ArrowRight className="h-4 w-4" />
            </CTA>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#060708] px-5 py-8 text-sm text-white/50 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display font-black uppercase text-white">
              Águia <span className="text-[#f5b51b]">Sul Sinalização</span>
            </p>
            <p className="mt-1 text-xs">Pintura e sinalização horizontal · Curitiba e região.</p>
          </div>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4 hover:text-[#f5b51b]" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="aguia-sul-sinalizacao"
        eyebrow="Águia Sul · Sinalização"
        title="Organização visual começa pela leitura do espaço."
        description="Conte o que precisa demarcar e organize o próximo passo."
        ctaLabel="Ver aplicações"
        ctaHref="#aplicacoes"
        delayMs={9000}
        className="border-[#f5b51b]/40 bg-[#121416]/95 text-white"
        accentClassName="text-[#f5b51b]"
      />
      <PortfolioUpsellPopup pageName="portfolio-aguia-sul-sinalizacao" />
    </div>
  );
}
