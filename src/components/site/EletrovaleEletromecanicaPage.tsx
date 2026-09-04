import { ArrowRight, Cog, Gauge, ShieldCheck, Wrench } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

// Conceito: ordem de serviço de bancada. Ficha fixa à esquerda, laudo rolando à direita.
const ordens = [
  { titulo: "Motores elétricos", texto: "Manutenção, diagnóstico e rebobinamento para mais eficiência e durabilidade.", Icon: Cog },
  { titulo: "Bombas e motobombas", texto: "Reparo especializado para manter seu sistema trabalhando com confiança.", Icon: Gauge },
  { titulo: "Motoredutores e motofreios", texto: "Revisão técnica e recuperação de conjuntos eletromecânicos.", Icon: Wrench },
  { titulo: "Avaliação e melhorias", texto: "Sugestões práticas para otimizar desempenho e reduzir paradas.", Icon: ShieldCheck },
];

const quiz = { stepTitles: { service: "Qual equipamento precisa de atenção?", experience: "Conte sobre o problema", period: "Onde está o equipamento?", timing: "Quando deseja realizar?", note: "Mais detalhes" }, services: ["Rebobinamento de motor", "Manutenção de bomba", "Motoredutor ou motofreio", "Diagnóstico eletromecânico", "Outro equipamento"], experienceOptions: ["Parou de funcionar", "Está aquecendo ou fazendo ruído", "Precisa de revisão preventiva", "Quero melhorar o desempenho"], periodOptions: ["Curitiba e região", "Paraná", "Vou confirmar o endereço"], timingOptions: ["Preciso de atendimento em breve", "Estou planejando", "Quero uma avaliação técnica"] };

function CTA({ children }: { children: React.ReactNode }) {
  return (
    <PortfolioCTAQuiz
      clientKey="eletrovale-eletromecanica"
      studioName="Eletrovale Eletromecânica"
      recipientName="Eletrovale"
      theme="gold"
      mode="proposal"
      quizConfig={quiz}
      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-none bg-[#e6ad2d] px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-[#1b1e22] transition hover:bg-[#ffd66d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e6ad2d] sm:w-auto"
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function EletrovaleEletromecanicaPage() {
  return (
    <div className="min-h-dvh bg-[#1b1e22] text-[#eceff2]">
      <header className="border-b border-[#3a4048] bg-[#15181b] px-5 py-3 lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a href="#inicio" className="flex items-center gap-3 font-display text-base font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-sm bg-[#e6ad2d] font-black text-[#1b1e22]">EV</span>
            ELETRO<span className="-ml-3 text-[#e6ad2d]">VALE</span>
          </a>
          <nav className="hidden gap-6 text-xs font-bold uppercase tracking-[.16em] text-white/55 md:flex">
            <a href="#ordens">Serviços</a>
            <a href="#bancada">Bancada</a>
            <a href="#contato">Contato</a>
          </nav>
        </div>
      </header>

      <main
        id="inicio"
        className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-12 lg:flex-row lg:items-start lg:gap-14 lg:px-8"
      >
        {/* Ficha fixa: identidade + CTA sempre visível no desktop */}
        <aside className="w-full border-l-4 border-[#e6ad2d] bg-[#22262b] p-6 lg:sticky lg:top-8 lg:w-[340px] lg:shrink-0">
          <p className="font-mono text-[11px] uppercase tracking-[.22em] text-[#e6ad2d]">Ordem de serviço</p>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight">
            Seu equipamento merece <span className="text-[#e6ad2d]">confiabilidade.</span>
          </h1>
          <p className="mt-4 text-sm leading-6 text-white/60">
            Manutenção e rebobinamento de bombas, motores, motoredutores, motofreios e outros equipamentos com seriedade
            e excelência.
          </p>
          <dl className="mt-6 space-y-2 border-t border-[#3a4048] pt-4 font-mono text-xs text-white/55">
            <div className="flex justify-between gap-3">
              <dt>Atuação</dt>
              <dd className="text-white/85">Curitiba e região</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Diagnóstico</dt>
              <dd className="text-white/85">Preciso e documentado</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Atendimento</dt>
              <dd className="text-white/85">Responsável</dd>
            </div>
          </dl>
          <div className="mt-6">
            <CTA>
              Solicitar avaliação <ArrowRight className="h-4 w-4" />
            </CTA>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <PortfolioImage
            src="/images/eletrovale-eletromecanica/equipamentos.webp"
            alt="Motores elétricos e bombas da Eletrovale Eletromecânica"
            priority
            width={1280}
            height={960}
            className="h-[220px] w-full border border-[#3a4048] object-cover sm:h-[320px]"
            managedField="heroImageUrl"
          />

          <section id="ordens" className="mt-10">
            <h2 className="font-display text-2xl font-bold">Menos paradas. Mais desempenho.</h2>
            <div className="mt-6 space-y-3">
              {ordens.map(({ titulo, texto, Icon }, i) => (
                <article
                  key={titulo}
                  className="flex gap-4 border border-[#3a4048] bg-[#22262b] p-5 transition hover:border-[#e6ad2d]"
                >
                  <Icon className="mt-1 h-6 w-6 shrink-0 text-[#e6ad2d]" aria-hidden />
                  <div>
                    <h3 className="font-display text-lg font-bold">
                      <span className="mr-2 font-mono text-xs text-white/40">OS-{String(i + 1).padStart(2, "0")}</span>
                      {titulo}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-white/60">{texto}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="bancada" className="mt-12 border-t border-[#3a4048] pt-8">
            <h2 className="font-display text-2xl font-bold">Tranquilidade e clareza em cada etapa.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
              Entendemos a demanda específica, avaliamos o equipamento e apresentamos a solução mais eficiente para sua
              operação.
            </p>
            <div className="mt-6 flex flex-col divide-y divide-[#3a4048] border border-[#3a4048] sm:flex-row sm:divide-x sm:divide-y-0">
              {[
                ["Avaliação", "Identificamos a causa e o melhor caminho."],
                ["Execução", "Serviço técnico com materiais adequados."],
                ["Entrega", "Equipamento pronto para voltar à operação."],
              ].map(([t, d]) => (
                <div key={t} className="flex-1 bg-[#22262b] p-5">
                  <p className="font-display text-base font-bold text-[#e6ad2d]">{t}</p>
                  <p className="mt-2 text-sm leading-6 text-white/60">{d}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="contato" className="mt-12 bg-[#e6ad2d] p-7 text-[#1b1e22]">
            <p className="font-mono text-[11px] uppercase tracking-[.22em]">Atendimento personalizado</p>
            <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">Vamos cuidar do seu equipamento?</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#1b1e22]/80">
              Solicite uma avaliação sem compromisso e conte com a Eletrovale Eletromecânica.
            </p>
            <div className="mt-6">
              <PortfolioCTAQuiz
                clientKey="eletrovale-eletromecanica"
                studioName="Eletrovale Eletromecânica"
                recipientName="Eletrovale"
                theme="gold"
                mode="proposal"
                quizConfig={quiz}
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#1b1e22] px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-[#e6ad2d] transition hover:bg-[#2c3138] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b1e22]"
              >
                Falar com especialista <ArrowRight className="h-4 w-4" />
              </PortfolioCTAQuiz>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-[#15181b] px-5 py-8 text-sm text-white/55 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-white">
              Eletrovale <span className="text-[#e6ad2d]">Eletromecânica</span>
            </p>
            <p className="mt-1">Manutenção, rebobinamento e eficiência industrial.</p>
            <a
              href="https://eletrovalemotores.com.br/"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-[#e6ad2d] underline"
            >
              eletrovalemotores.com.br
            </a>
          </div>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4 hover:text-[#e6ad2d]" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="eletrovale-eletromecanica"
        eyebrow="Eletrovale · Eletromecânica"
        title="Confiança para manter sua operação em movimento."
        description="Conte o equipamento e receba um próximo passo técnico."
        ctaLabel="Conhecer soluções"
        ctaHref="#ordens"
        delayMs={9000}
        className="border-[#e6ad2d]/40 bg-[#22262b]/95 text-white"
        accentClassName="text-[#e6ad2d]"
      />
      <PortfolioUpsellPopup pageName="portfolio-eletrovale-eletromecanica" />
    </div>
  );
}
