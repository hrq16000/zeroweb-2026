import { ArrowRight, ShieldCheck } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

/**
 * Direção autoral — "seletor de programas".
 * A página é lida como o painel de uma lavadora: uma coluna de programas à
 * esquerda, marcadores de ciclo e uma faixa de etapas numerada. Sem estética
 * industrial pesada (preto+amarelo, engrenagem, blueprint) para não repetir
 * Eisenfer, Eletrovale, Eletro Soluções ou JKL.
 */

const quiz = {
  services: [
    "Não liga",
    "Não lava ou não centrifuga",
    "Não drena a água",
    "Vazamento ou ruído",
    "Manutenção preventiva",
    "Ainda preciso de diagnóstico",
  ],
  experienceOptions: ["Máquina de lavar", "Lava e seca", "Tanquinho", "Vou confirmar o equipamento"],
  periodOptions: ["Curitiba e região", "Vou confirmar o endereço", "Ainda estou definindo o local"],
  timingOptions: ["Preciso de atendimento em breve", "Estou planejando", "Quero uma avaliação primeiro"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "O que aconteceu com sua máquina?",
    experience: "Qual equipamento precisa de ajuda?",
    period: "Onde será o atendimento?",
    timing: "Quando você precisa?",
    note: "Conte mais sobre o problema",
  },
  notePlaceholder: "Ex.: marca, modelo, código de erro e quando o problema começou.",
};

function CTA({ children, tone = "solid" }: { children: React.ReactNode; tone?: "solid" | "light" }) {
  return (
    <PortfolioCTAQuiz
      clientKey="lucas-arruma-maquina-lavar"
      studioName="Lucas Arruma Máquina de Lavar"
      recipientName="Lucas"
      theme="navy"
      mode="proposal"
      quizConfig={quiz}
      className={
        tone === "solid"
          ? "inline-flex min-h-12 items-center justify-center gap-2 bg-[#c2452d] px-7 py-3.5 text-sm font-bold uppercase tracking-[.12em] text-[#f7f3ec] transition hover:bg-[#a63a25] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#23282e]"
          : "inline-flex min-h-12 items-center justify-center gap-2 border-2 border-[#23282e] bg-transparent px-7 py-3.5 text-sm font-bold uppercase tracking-[.12em] text-[#23282e] transition hover:bg-[#23282e] hover:text-[#f2efe9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c2452d]"
      }
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

const programas: Array<[string, string, string]> = [
  ["P1", "Diagnóstico claro", "Identificação do sintoma e orientação objetiva para o próximo passo."],
  ["P2", "Conserto de lavadoras", "Atendimento para falhas de funcionamento, drenagem e centrifugação."],
  ["P3", "Manutenção preventiva", "Cuidados para preservar o desempenho e evitar novas paradas."],
  ["P4", "Atendimento com garantia", "Serviço acompanhado de compromisso e garantia do atendimento."],
];

const ciclo: Array<[string, string]> = [
  ["Conte o sintoma", "Descreva o que a máquina está fazendo, o modelo e quando começou."],
  ["Combine o horário", "Escolha o melhor momento para o atendimento em Curitiba e região."],
  ["Volte à rotina", "Receba o serviço com orientação e garantia do atendimento."],
];

export function LucasArrumaMaquinaLavarPage() {
  return (
    <div className="min-h-dvh bg-[#f2efe9] font-sans text-[#23282e]">
      <header className="border-b-2 border-[#23282e] bg-[#f2efe9]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <a href="#inicio" className="flex items-center gap-3">
            <PortfolioImage
              src="/images/lucas-arruma-maquina-lavar/logo.svg"
              alt="Marca Lucas Arruma Máquina de Lavar"
              width={44}
              height={44}
              className="h-11 w-11"
            managedField="logoUrl"
              />
            <span className="font-display text-base font-bold leading-tight">
              Lucas Arruma
              <span className="block text-xs font-semibold uppercase tracking-[.18em] text-[#c2452d]">
                Máquina de Lavar
              </span>
            </span>
          </a>
          <nav className="hidden gap-7 text-xs font-bold uppercase tracking-[.14em] md:flex">
            <a href="#programas" className="hover:text-[#c2452d]">Programas</a>
            <a href="#ciclo" className="hover:text-[#c2452d]">Como funciona</a>
            <a href="#garantia" className="hover:text-[#c2452d]">Garantia</a>
          </nav>
          <CTA>Pedir diagnóstico</CTA>
        </div>
      </header>

      <main>
        {/* Abertura: painel com mostrador de programa à esquerda e chamada à direita. */}
        <section id="inicio" className="border-b-2 border-[#23282e]">
          <div className="mx-auto grid max-w-6xl gap-0 px-5 py-12 lg:grid-cols-[minmax(0,13rem)_1fr] lg:gap-12 lg:px-8 lg:py-20">
            <aside className="mb-10 flex gap-4 lg:mb-0 lg:block lg:border-r-2 lg:border-dashed lg:border-[#23282e]/30 lg:pr-8">
              <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full border-[6px] border-[#23282e] bg-[#23282e] lg:h-40 lg:w-40">
                <div className="grid h-14 w-14 place-items-center rounded-full border-4 border-[#c2452d] lg:h-24 lg:w-24">
                  <span className="h-1.5 w-8 rounded-full bg-[#7fa8bd] lg:w-14" />
                </div>
              </div>
              <ul className="space-y-2 text-xs font-bold uppercase tracking-[.14em] text-[#4a545e] lg:mt-8">
                <li className="text-[#c2452d]">● Diagnóstico</li>
                <li>○ Conserto</li>
                <li>○ Preventiva</li>
                <li>○ Garantia</li>
              </ul>
            </aside>

            <div>
              <p className="text-xs font-bold uppercase tracking-[.22em] text-[#c2452d]">
                Assistência técnica de lavadoras · Curitiba
              </p>
              <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.03] sm:text-6xl">
                Sua máquina parou? <span className="text-[#c2452d]">Lucas resolve.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#4a545e]">
                Diagnóstico, manutenção e conserto com atendimento claro, agilidade e garantia para você voltar à
                rotina.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CTA>
                  Falar com Lucas <ArrowRight className="h-4 w-4" />
                </CTA>
                <a
                  href="#programas"
                  className="inline-flex min-h-12 items-center border-2 border-[#23282e] px-7 py-3.5 text-sm font-bold uppercase tracking-[.12em] hover:bg-[#23282e] hover:text-[#f2efe9]"
                >
                  Ver programas
                </a>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-t-2 border-[#23282e] pt-4 text-sm">
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[.14em] text-[#7f8b95]">Atendimento</dt>
                    <dd className="font-bold">Curitiba e região, agendado</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[.14em] text-[#7f8b95]">Equipamentos</dt>
                    <dd className="font-bold">Lavadora, lava e seca, tanquinho</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* Programas: linhas de painel, não cards flutuantes. */}
        <section id="programas" className="border-b-2 border-[#23282e] bg-[#e8e3d9]">
          <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
            <h2 className="max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl">
              Um atendimento pensado para resolver sem complicação.
            </h2>
            <ul className="mt-10 border-t-2 border-[#23282e]">
              {programas.map(([code, title, text]) => (
                <li
                  key={code}
                  className="grid gap-2 border-b border-[#23282e]/25 py-6 sm:grid-cols-[5rem_minmax(0,16rem)_1fr] sm:items-baseline sm:gap-6"
                >
                  <span className="font-display text-2xl font-bold text-[#c2452d]">{code}</span>
                  <h3 className="font-display text-xl font-bold">{title}</h3>
                  <p className="text-sm leading-7 text-[#4a545e]">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Ciclo: régua horizontal numerada com a arte real do cliente contida. */}
        <section id="ciclo" className="border-b-2 border-[#23282e]">
          <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.22em] text-[#7fa8bd]">Ciclo de atendimento</p>
                <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
                  Você explica o sintoma. Lucas orienta o próximo passo.
                </h2>
                <ol className="mt-8 space-y-6">
                  {ciclo.map(([title, text], i) => (
                    <li key={title} className="flex gap-5">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-[#23282e] font-display text-base font-bold">
                        {i + 1}
                      </span>
                      <div className="border-b border-dashed border-[#23282e]/30 pb-5">
                        <h3 className="font-display text-lg font-bold">{title}</h3>
                        <p className="mt-1 text-sm leading-7 text-[#4a545e]">{text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="border-2 border-[#23282e] bg-[#e8e3d9] p-3">
                <PortfolioImage
                  src="/images/lucas-arruma-maquina-lavar/vitrine.png"
                  alt="Identidade visual da assistência técnica de máquinas de lavar do Lucas"
                  priority
                  width={1200}
                  height={1600}
                  className="mx-auto max-h-[32rem] w-full object-contain"
                  managedField="heroImageUrl"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="garantia" className="bg-[#23282e] text-[#f2efe9]">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-14 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-16">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-[#7fa8bd]">
                <ShieldCheck className="h-4 w-4" /> Atendimento com garantia
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Não deixe a roupa acumular.</h2>
              <p className="mt-3 max-w-xl leading-7 text-[#c6ccd2]">
                Envie os detalhes da sua máquina e solicite um diagnóstico inicial.
              </p>
            </div>
            <CTA>
              Solicitar atendimento <ArrowRight className="h-4 w-4" />
            </CTA>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-[#23282e] bg-[#f2efe9]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-[#4a545e] sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p className="font-display font-bold text-[#23282e]">Lucas Arruma Máquina de Lavar</p>
            <p className="mt-1">Conserto, manutenção e atendimento com garantia.</p>
          </div>
          <PortfolioHostCredit linkClassName="font-semibold text-[#23282e] underline underline-offset-4 hover:text-[#c2452d]" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="lucas-arruma-maquina-lavar"
        eyebrow="Lucas · Assistência"
        title="Sua máquina merece um diagnóstico claro e um atendimento de confiança."
        description="Conte o sintoma e receba orientação para o próximo passo."
        ctaLabel="Solicitar diagnóstico"
        ctaHref="#programas"
        delayMs={9000}
        className="border-[#c2452d]/40 bg-[#23282e]/95 text-[#f2efe9]"
        accentClassName="text-[#c2452d]"
      />
      <PortfolioUpsellPopup pageName="portfolio-lucas-arruma-maquina-lavar" />
    </div>
  );
}
