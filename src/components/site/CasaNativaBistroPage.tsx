import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { ManagedRich } from "@/components/portfolio/ManagedText";
import { MotionReveal, MotionScope, MotionStagger } from "@/components/motion";

const TEMPOS = [
  ["01", "Entrada", "Pão de fermentação natural, manteiga de ervas do cerrado e conserva da casa."],
  ["02", "Meio", "Legumes assados na brasa, molho de castanha e queijo curado mineiro."],
  ["03", "Principal", "Corte do dia com purê de mandioquinha e redução de café."],
  ["04", "Doce", "Goiabada cascão, requeijão de corte e crocante de milho."],
] as const;

const SALA = [
  ["Jantar", "Terça a sábado, das 19h às 23h"],
  ["Almoço de domingo", "Das 12h às 16h, menu reduzido"],
  ["Mesas", "28 lugares no salão e 12 no terraço"],
  ["Reserva", "Recomendada para grupos a partir de 4 pessoas"],
] as const;

const quiz = {
  stepTitles: {
    service: "Que experiência procura?",
    experience: "Quantos lugares?",
    period: "Qual salão prefere?",
    timing: "Para quando?",
    note: "Restrições ou celebração",
  },
  services: ["Jantar à la carte", "Menu em quatro tempos", "Almoço de domingo", "Evento privado"],
  experienceOptions: ["Mesa para 2", "Mesa para 4", "Grupo de 6 a 10", "Mais de 10 pessoas"],
  periodOptions: ["Salão interno", "Terraço", "Tanto faz"],
  timingOptions: ["Esta semana", "Fim de semana", "Data comemorativa"],
};

function Reserva({ children, ghost = false }: { children: React.ReactNode; ghost?: boolean }) {
  return (
    <PortfolioCTAQuiz
      clientKey="casa-nativa"
      studioName="Casa Nativa Bistrô"
      recipientName="a casa"
      theme="gold"
      mode="booking"
      quizConfig={quiz}
      className={
        ghost
          ? "inline-flex min-h-12 items-center justify-center border-b border-[#c98a4b] pb-1 text-sm uppercase tracking-[.3em] text-[#e8dcc9] transition hover:text-[#c98a4b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c98a4b]"
          : "inline-flex min-h-12 items-center justify-center bg-[#c98a4b] px-8 py-3 text-sm uppercase tracking-[.3em] text-[#15130f] transition hover:bg-[#e0a967] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c98a4b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#15130f]"
      }
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function CasaNativaBistroPage() {
  return (
    <MotionScope intensity="SUBTLE">
    <div className="min-h-dvh bg-[#15130f] font-serif text-[#e8dcc9]">
      <main>
        <section id="inicio" className="relative flex min-h-[82vh] flex-col justify-between px-5 py-10 lg:px-12">
          <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[.4em] text-[#9c917f]">
            <a href="#inicio">Casa Nativa</a>
            <span className="hidden sm:inline">Bistrô · Belo Horizonte</span>
          </div>
          <MotionReveal variant="fade" className="mx-auto w-full max-w-4xl py-16 text-center">
            <h1 className="text-balance text-5xl leading-[1.02] sm:text-8xl">
            <ManagedRich field="heroHeadline">
              Cozinha de raiz,
              <span className="mt-2 block italic text-[#c98a4b]">servida devagar.</span></ManagedRich>
          </h1>
            <p className="mx-auto mt-8 max-w-lg text-base leading-8 text-[#b3a894]"><ManagedRich field="heroSubheadline">
              Um bistrô pequeno em Belo Horizonte, com menu curto que muda conforme a feira e um salão pensado para
              conversas longas.</ManagedRich></p>
          </MotionReveal>
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
            <span className="text-[0.7rem] uppercase tracking-[.4em] text-[#9c917f]">Menu em quatro tempos</span>
            <Reserva>Reservar mesa</Reserva>
          </div>
        </section>

        <section id="menu" className="border-t border-[#3a332a] bg-[#1b1814] px-5 py-20 lg:px-12">
          <div className="mx-auto max-w-3xl">
            <p className="text-center text-[0.7rem] uppercase tracking-[.4em] text-[#9c917f]">Carta da semana</p>
            <ul className="mt-12 space-y-10">
              {TEMPOS.map(([n, nome, descricao], i) => (
                <MotionReveal as="li" variant="fade" delay={i * 150} key={n}>
                  <div className="flex items-baseline gap-4">
                    <span className="text-[0.7rem] tracking-[.3em] text-[#c98a4b]">{n}</span>
                    <h2 className="text-2xl">{nome}</h2>
                    <span className="h-px flex-1 bg-[#3a332a]" aria-hidden="true" />
                  </div>
                  <p className="mt-3 pl-10 text-[0.98rem] italic leading-8 text-[#b3a894]">{descricao}</p>
                </MotionReveal>
              ))}
            </ul>
            <p className="mt-12 text-center text-sm leading-7 text-[#9c917f]">
              O menu completo acompanha harmonização opcional e é ajustado a restrições avisadas na reserva.
            </p>
          </div>
        </section>

        <section id="sala" className="px-5 py-20 lg:px-12">
          <MotionStagger className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-2" variant="up" step={120}>
            {SALA.map(([titulo, texto]) => (
              <div key={titulo} className="border-t border-[#3a332a] pt-5">
                <h2 className="text-[0.7rem] uppercase tracking-[.3em] text-[#c98a4b]">{titulo}</h2>
                <p className="mt-3 text-lg leading-8">{texto}</p>
              </div>
            ))}
          </MotionStagger>
        </section>

        <section id="reserva" className="border-t border-[#3a332a]">
        <MotionReveal variant="mask" className="px-5 py-20 text-center lg:px-12">
          <h2 className="mx-auto max-w-2xl text-4xl leading-tight sm:text-5xl">
            Guardamos uma mesa para a sua noite.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[0.98rem] leading-7 text-[#b3a894]">
            Informe a data, o número de pessoas e se há alguma celebração — a casa confirma a disponibilidade.
          </p>
          <div className="mt-10 flex flex-col items-center gap-6">
            <Reserva>Solicitar reserva</Reserva>
            <Reserva ghost>Consultar menu do dia</Reserva>
          </div>
        </MotionReveal>
        </section>
      </main>

      <footer className="border-t border-[#3a332a] px-5 py-8 text-[0.8rem] text-[#9c917f] lg:px-12">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="uppercase tracking-[.3em] text-[#e8dcc9]">Casa Nativa Bistrô</p>
          <PortfolioHostCredit linkClassName="underline underline-offset-4 hover:text-[#c98a4b]" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="casa-nativa"
        eyebrow="Casa Nativa Bistrô"
        title="O salão é pequeno — a reserva ajuda."
        description="Escolha data e número de lugares para garantir a mesa."
        ctaLabel="Ver a carta"
        ctaHref="#menu"
        delayMs={10000}
        className="border-[#c98a4b]/50 bg-[#1b1814]/95 text-[#e8dcc9]"
        accentClassName="text-[#c98a4b]"
      />
      <PortfolioUpsellPopup pageName="portfolio-casa-nativa" />
    </div>
    </MotionScope>
  );
}
