import { ManagedText } from "@/components/portfolio/ManagedText";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { MotionReveal, MotionScope } from "@/components/motion";

const CARDAPIO = [
  [
    "Da maré",
    [
      ["Camarão na moranga", "R$ 118", "Serve duas pessoas"],
      ["Peixe do dia grelhado", "R$ 62", "Com arroz de brócolis"],
      ["Barreado da casa", "R$ 74", "Sábados e domingos"],
    ],
  ],
  [
    "Do dia a dia",
    [
      ["Prato executivo", "R$ 34", "Segunda a sexta, 11h30 às 14h"],
      ["Filé de tilápia", "R$ 46", "Acompanha purê e salada"],
      ["Porção de isca de peixe", "R$ 52", "Para dividir"],
    ],
  ],
] as const;

const TEMPORADA = [
  ["Alta temporada", "Dezembro a março · aberto todos os dias, 11h às 23h"],
  ["Baixa temporada", "Quarta a domingo, 11h30 às 21h"],
  ["Delivery", "Raio de 6 km do Centro, pedido até 30 min antes do fechamento"],
] as const;

const quiz = {
  stepTitles: {
    service: "O que você quer pedir?",
    experience: "Como prefere comer?",
    period: "Para quantas pessoas?",
    timing: "Para quando?",
    note: "Observações do pedido",
  },
  services: ["Prato da maré", "Executivo do dia", "Porção para dividir", "Barreado", "Reserva de mesa"],
  experienceOptions: ["Comer no salão", "Retirar no balcão", "Delivery", "Encomenda para grupo"],
  periodOptions: ["1 a 2 pessoas", "3 a 4 pessoas", "Grupo maior"],
  timingOptions: ["Hoje", "Fim de semana", "Na temporada"],
};

function Pedir({ children, outline = false }: { children: React.ReactNode; outline?: boolean }) {
  return (
    <PortfolioCTAQuiz
      clientKey="guaratuba-sabores-da-baia"
      studioName="Sabores da Baía"
      recipientName="o restaurante"
      theme="gold"
      mode="proposal"
      quizConfig={quiz}
      className={
        outline
          ? "inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[#0b6b74] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#0b6b74] transition hover:bg-[#0b6b74] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b6b74]"
          : "inline-flex min-h-12 items-center justify-center rounded-full bg-[#ef5f4c] px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#ff7563] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef5f4c] focus-visible:ring-offset-2"
      }
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

function Onda({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d="M0 40 C150 5 300 65 450 35 C600 5 750 60 900 32 C1020 10 1120 40 1200 22 V60 H0 Z" fill="currentColor" />
    </svg>
  );
}

export function SaboresDaBaiaPage() {
  return (
    <div className="min-h-dvh bg-[#fdf4e6] text-[#173a3d]">
      <MotionScope intensity="BALANCED">
      <main>
        <section id="inicio" className="relative bg-[#0b6b74] pb-16 pt-10 text-[#eafaf9]">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <a href="#inicio" className="text-lg font-bold tracking-wide">
                Sabores da Baía
              </a>
              <span className="text-xs font-semibold uppercase tracking-[.24em] text-[#9fd8d5]">Centro · Guaratuba — PR</span>
            </div>
            <div className="mt-14 max-w-3xl">
              <MotionReveal variant="left">
              <p className="text-sm font-bold uppercase tracking-[.28em] text-[#f6c76a]">Cozinha caiçara</p>
              </MotionReveal>
              <MotionReveal variant="up" delay={120}>
              <h1 className="mt-4 text-4xl font-bold leading-[1.06] sm:text-6xl">
            <ManagedText field="heroHeadline" fallback={"Peixe fresco no almo\u00e7o de semana e na mesa cheia de domingo."} />
          </h1>
              </MotionReveal>
              <MotionReveal variant="up" delay={240}>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#c9eae8]">
            <ManagedText field="heroSubheadline" fallback={"Um restaurante de esquina que serve executivo r\u00e1pido durante a semana e recebe fam\u00edlias inteiras na temporada \u2014 com o mesmo peixe comprado de manh\u00e3."} />
          </p>
              </MotionReveal>
              <div className="mt-9 flex flex-wrap gap-4">
                <Pedir>Fazer meu pedido</Pedir>
                <a href="#cardapio" className="inline-flex min-h-12 items-center text-sm font-bold uppercase tracking-wide underline underline-offset-8">
                  Ver cardápio
                </a>
              </div>
            </div>
          </div>
          <Onda className="absolute inset-x-0 -bottom-px h-12 w-full text-[#fdf4e6]" />
        </section>

        <section id="cardapio" className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
          {CARDAPIO.map(([secao, itens]) => (
            <div key={secao} className="mb-12 last:mb-0">
              <h2 className="text-2xl font-bold text-[#0b6b74]">{secao}</h2>
              <ul className="mt-6">
                {itens.map(([nome, preco, obs], i) => (
                  <MotionReveal as="li" key={nome} variant="left" delay={i * 110} className="group flex flex-wrap items-baseline gap-x-3 border-b border-dashed border-[#173a3d]/25 py-4">
                    <span className="text-lg font-semibold">{nome}</span>
                    <span className="order-3 w-full text-sm text-[#5a7a7c] sm:order-2 sm:w-auto sm:flex-1">{obs}</span>
                    <span className="order-2 ml-auto text-lg font-bold text-[#ef5f4c] transition-transform duration-200 group-hover:-translate-y-0.5 sm:order-3">{preco}</span>
                  </MotionReveal>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="relative bg-[#f6c76a] py-14">
          <Onda className="absolute inset-x-0 -top-px h-10 w-full rotate-180 text-[#fdf4e6]" />
          <MotionReveal variant="scale" className="mx-auto max-w-4xl px-5 text-center lg:px-8">
            <h2 className="text-2xl font-bold sm:text-3xl">Da maré para a mesa no mesmo dia</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#4a4223]">
              O peixe chega de manhã, o cardápio se ajusta ao que veio bom e o que não vendeu não volta amanhã. É por
              isso que alguns pratos saem da lista sem aviso.
            </p>
          </MotionReveal>
        </section>

        <section id="horarios" className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
          <h2 className="text-2xl font-bold">Horários</h2>
          <dl className="mt-6 space-y-4">
            {TEMPORADA.map(([k, v], i) => (
              <MotionReveal key={k} variant="right" delay={i * 120} className="rounded-2xl bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5">
                <dt className="text-sm font-bold uppercase tracking-wide text-[#0b6b74]">{k}</dt>
                <dd className="mt-1 text-base leading-7 text-[#3e5a5c]">{v}</dd>
              </MotionReveal>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Pedir outline>Reservar mesa</Pedir>
            <Pedir>Pedir delivery</Pedir>
          </div>
        </section>
      </main>
      </MotionScope>

      <footer className="bg-[#0b6b74] px-5 py-8 text-sm text-[#9fd8d5] lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-bold text-white">Sabores da Baía · Guaratuba</p>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="guaratuba-sabores-da-baia"
        eyebrow="Sabores da Baía"
        title="O peixe do dia muda conforme a maré."
        description="Confira o cardápio de hoje e garanta sua mesa."
        ctaLabel="Ver cardápio"
        ctaHref="#cardapio"
        delayMs={9000}
        className="border-[#ef5f4c]/50 bg-[#0b6b74]/95 text-[#eafaf9]"
        accentClassName="text-[#f6c76a]"
      />
      <PortfolioUpsellPopup pageName="portfolio-guaratuba-sabores-da-baia" />
    </div>
  );
}
