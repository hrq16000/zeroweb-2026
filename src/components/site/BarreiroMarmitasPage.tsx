import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { ManagedRich } from "@/components/portfolio/ManagedText";
import { MotionReveal, MotionScope, MotionStagger } from "@/components/motion";

const SEMANA = [
  ["SEG", "Frango grelhado", "Arroz, feijão, purê e salada de repolho"],
  ["TER", "Carne moída com legumes", "Arroz, feijão, farofa e vinagrete"],
  ["QUA", "Bife acebolado", "Arroz, feijão, macarrão e couve"],
  ["QUI", "Frango à parmegiana", "Arroz, feijão, batata sauté e salada"],
  ["SEX", "Feijoada leve", "Arroz, couve, farofa e laranja"],
  ["SÁB", "Costelinha assada", "Arroz, feijão, mandioca e vinagrete"],
] as const;

const TAMANHOS = [
  ["P", "Porção individual", "Para quem come pouco no almoço"],
  ["M", "A mais pedida", "Porção padrão do dia a dia"],
  ["G", "Reforçada", "Para quem trabalha pesado"],
] as const;

const quiz = {
  stepTitles: {
    service: "Qual marmita você quer?",
    experience: "Para quantas pessoas?",
    period: "Como prefere receber?",
    timing: "Qual frequência?",
    note: "Alguma restrição alimentar?",
  },
  services: ["Marmita P", "Marmita M", "Marmita G", "Combo semanal", "Marmita fitness sem fritura"],
  experienceOptions: ["Só para mim", "Duas pessoas", "Família", "Equipe de trabalho"],
  periodOptions: ["Retirada no Barreiro", "Entrega no bairro", "Entrega na empresa"],
  timingOptions: ["Só hoje", "De segunda a sexta", "Semana inteira"],
};

function Pedido({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <PortfolioCTAQuiz
      clientKey="bh-barreiro-marmitas"
      studioName="Marmitas do Barreiro"
      recipientName="a cozinha"
      theme="gold"
      mode="proposal"
      quizConfig={quiz}
      className={
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#e2621b] px-6 py-3 text-base font-extrabold uppercase tracking-wide text-white shadow-[0_4px_0_#a8410c] transition active:translate-y-[2px] active:shadow-[0_2px_0_#a8410c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2621b] focus-visible:ring-offset-2 " +
        className
      }
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function BarreiroMarmitasPage() {
  return (
    <MotionScope intensity="BALANCED">
    <div className="min-h-dvh bg-[#f7f2e7] text-[#241f16]">
      <header className="bg-[#1f3a26] px-5 py-4 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <a href="#inicio" className="text-lg font-extrabold uppercase tracking-wide text-[#f7f2e7]">
            Marmitas do Barreiro
          </a>
          <p className="text-sm font-semibold text-[#c6d8c8]">Segunda a sábado · almoço quentinho</p>
        </div>
      </header>

      <main>
        <section id="inicio" className="mx-auto grid max-w-5xl gap-8 px-5 py-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8">
          <div>
            <p className="inline-block bg-[#f2c744] px-3 py-1 text-sm font-extrabold uppercase">Barreiro · Belo Horizonte</p>
            <h1 className="mt-5 text-4xl font-extrabold uppercase leading-[1.02] sm:text-6xl">
            <ManagedRich field="heroHeadline">
              O almoço da semana
              <br />
              <span className="text-[#1f3a26]">já está no quadro.</span></ManagedRich>
          </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-[#4a4234]"><ManagedRich field="heroSubheadline">
              Comida caseira feita todo dia de manhã, marmita fechada na hora e cardápio fixo para você programar a
              semana sem pensar duas vezes.</ManagedRich></p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Pedido>Pedir marmita de hoje</Pedido>
              <a href="#cardapio" className="text-base font-bold underline underline-offset-4">
                Ver cardápio da semana
              </a>
            </div>
          </div>
          <MotionReveal variant="down" intensity="EXPRESSIVE" className="rounded-lg border-[10px] border-[#6b4a25] bg-[#1f3a26] p-5 shadow-xl">
            <p className="text-center font-mono text-sm uppercase tracking-[.3em] text-[#f2c744]">Quadro do dia</p>
            <p className="mt-4 text-center font-extrabold uppercase leading-tight text-[#f7f2e7]">
              <span className="block text-5xl">R$ 22</span>
              <span className="mt-2 block text-sm tracking-widest text-[#c6d8c8]">marmita M completa</span>
            </p>
            <p className="mt-5 border-t border-dashed border-[#c6d8c8]/40 pt-4 text-center text-sm leading-6 text-[#dbe6dc]">
              Combo 5 dias sai por R$ 100 — pago na entrega da primeira marmita.
            </p>
          </MotionReveal>
        </section>

        <section id="cardapio" className="bg-[#1f3a26] px-5 py-14 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-extrabold uppercase text-[#f7f2e7]">Cardápio fixo da semana</h2>
            <MotionReveal variant="mask" className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left text-[#f7f2e7]">
                <thead>
                  <tr className="border-b-2 border-[#f2c744]">
                    <th scope="col" className="py-3 pr-4 text-sm uppercase tracking-widest text-[#f2c744]">Dia</th>
                    <th scope="col" className="py-3 pr-4 text-sm uppercase tracking-widest text-[#f2c744]">Prato principal</th>
                    <th scope="col" className="py-3 text-sm uppercase tracking-widest text-[#f2c744]">Acompanha</th>
                  </tr>
                </thead>
                <tbody>
                  {SEMANA.map(([dia, prato, acomp]) => (
                    <tr key={dia} className="border-b border-white/15">
                      <th scope="row" className="py-4 pr-4 font-mono text-lg font-bold text-[#f2c744]">{dia}</th>
                      <td className="py-4 pr-4 text-lg font-bold">{prato}</td>
                      <td className="py-4 text-sm leading-6 text-[#c6d8c8]">{acomp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </MotionReveal>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-14 lg:px-8">
          <h2 className="text-2xl font-extrabold uppercase">Escolha o tamanho</h2>
          <MotionStagger as="dl" variant="scale" className="mt-6 grid gap-px overflow-hidden rounded-lg bg-[#241f16]/15 sm:grid-cols-3">
            {TAMANHOS.map(([letra, titulo, texto]) => (
              <div key={letra} className="bg-[#f7f2e7] p-6">
                <dt className="flex items-baseline gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#1f3a26] text-xl font-extrabold text-[#f2c744]">{letra}</span>
                  <span className="text-lg font-extrabold uppercase">{titulo}</span>
                </dt>
                <dd className="mt-3 text-sm leading-6 text-[#4a4234]">{texto}</dd>
              </div>
            ))}
          </MotionStagger>
        </section>

        <section id="pedir" className="bg-[#f2c744] px-5 py-12 lg:px-8">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-extrabold uppercase leading-tight">Fecha o combo da semana?</h2>
              <p className="mt-2 max-w-xl text-base font-semibold leading-7 text-[#3d3524]">
                Diga os dias, o tamanho e onde retirar. A cozinha confirma a reserva das marmitas.
              </p>
            </div>
            <Pedido>Montar meu combo</Pedido>
          </div>
        </section>
      </main>

      <footer className="bg-[#241f16] px-5 py-8 text-sm text-[#bdb4a2] lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-extrabold uppercase text-white">Marmitas do Barreiro</p>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="bh-barreiro-marmitas"
        eyebrow="Marmitas do Barreiro"
        title="Já pensou no almoço de amanhã?"
        description="Reserve a marmita do dia ou feche o combo da semana."
        ctaLabel="Ver cardápio"
        ctaHref="#cardapio"
        delayMs={8000}
        className="border-[#f2c744]/60 bg-[#1f3a26]/95 text-[#f7f2e7]"
        accentClassName="text-[#f2c744]"
      />
      <PortfolioUpsellPopup pageName="portfolio-bh-barreiro-marmitas" />
    </div>
    </MotionScope>
  );
}
