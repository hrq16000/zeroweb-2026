import { ManagedText } from "@/components/portfolio/ManagedText";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { MotionReveal, MotionScope } from "@/components/motion";

const VITRINE = [
  ["Bolo de festa", "2 a 4 andares", "#e5477a"],
  ["Bolo caseiro", "Fatia ou inteiro", "#d98b3f"],
  ["Salgados fritos", "Cento a partir de 100", "#8d5b3c"],
  ["Salgados assados", "Cento a partir de 100", "#b8763f"],
  ["Docinhos finos", "Cento sortido", "#c8407a"],
  ["Torta gelada", "Aro 20 ou 24", "#9a5ea1"],
] as const;

const CALENDARIO = [
  ["Encomenda simples", "48 horas de antecedência"],
  ["Bolo decorado", "5 dias de antecedência"],
  ["Festa completa", "10 dias, com prova de sabor"],
  ["Datas comemorativas", "Agenda fecha 15 dias antes"],
] as const;

const KITS = [
  ["Kit chá da tarde", "1 bolo caseiro + 50 salgados assados"],
  ["Kit aniversário", "Bolo decorado + 100 salgados + 50 docinhos"],
  ["Kit escritório", "2 bolos em fatias + 100 mini salgados"],
] as const;

const quiz = {
  stepTitles: {
    service: "O que você quer encomendar?",
    experience: "Para qual ocasião?",
    period: "Quantas pessoas?",
    timing: "Para qual data?",
    note: "Sabores e observações",
  },
  services: ["Bolo de festa", "Bolo caseiro", "Salgados", "Docinhos", "Torta gelada", "Kit completo"],
  experienceOptions: ["Aniversário", "Chá ou confraternização", "Casamento", "Evento de empresa", "Só pra casa mesmo"],
  periodOptions: ["Até 20 pessoas", "20 a 50 pessoas", "Mais de 50 pessoas"],
  timingOptions: ["Nos próximos dias", "Neste mês", "Data comemorativa"],
};

function Encomendar({ children, soft = false }: { children: React.ReactNode; soft?: boolean }) {
  return (
    <PortfolioCTAQuiz
      clientKey="mirassol-delicias-caseiras"
      studioName="Delícias Caseiras Mirassol"
      recipientName="a confeitaria"
      theme="pink"
      mode="proposal"
      quizConfig={quiz}
      className={
        soft
          ? "inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[#8d5b3c] px-6 py-3 text-sm font-bold text-[#8d5b3c] transition hover:bg-[#8d5b3c] hover:text-[#fff6ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8d5b3c]"
          : "inline-flex min-h-12 items-center justify-center rounded-full bg-[#e5477a] px-8 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-[#e5477a]/25 transition hover:bg-[#f2649a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5477a] focus-visible:ring-offset-2"
      }
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function DeliciasCaseirasMirassolPage() {
  return (
    <div className="min-h-dvh bg-[#fff6ee] text-[#4a3128]">
      <MotionScope intensity="SUBTLE">
      <main>
        <section id="inicio" className="px-5 py-14 text-center lg:px-8">
          <MotionReveal variant="scale" className="mx-auto max-w-3xl rounded-[3rem] border-4 border-double border-[#e5477a]/45 px-6 py-14 sm:px-12">
            <p className="text-xs font-bold uppercase tracking-[.36em] text-[#c8407a]">Centro · Mirassol — SP</p>
            <a href="#inicio" className="mt-4 block font-serif text-3xl font-bold sm:text-4xl">
              Delícias Caseiras
            </a>
            <h1 className="mt-8 font-serif text-4xl leading-[1.1] sm:text-6xl">
            <ManagedText field="heroHeadline" fallback={"Bolos e salgados para os dias que merecem mesa posta."} />
          </h1>
            <p className="mx-auto mt-6 max-w-lg text-base leading-8 text-[#6c5145]">
            <ManagedText field="heroSubheadline" fallback={"Encomendas feitas na hora certa, com prova de sabor para festa grande e entrega combinada no dia do evento."} />
          </p>
            <div className="mt-9">
              <Encomendar>Fazer encomenda</Encomendar>
            </div>
          </MotionReveal>
        </section>

        <section id="vitrine" className="px-5 py-12 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center font-serif text-3xl">A vitrine da semana</h2>
            <ul className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
              {VITRINE.map(([nome, detalhe, cor], i) => (
                <MotionReveal as="li" key={nome} variant="scale" delay={i * 90} className="group flex flex-col items-center text-center">
                  <span
                    className="grid aspect-square w-full max-w-[9.5rem] place-items-center rounded-full ring-4 ring-offset-4 ring-offset-[#fff6ee] transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundColor: `${cor}1f`, boxShadow: `inset 0 0 0 8px ${cor}33`, color: cor }}
                  >
                    <span className="px-4 font-serif text-lg font-bold leading-tight" style={{ color: cor }}>
                      {nome}
                    </span>
                  </span>
                  <p className="mt-4 text-sm font-semibold text-[#6c5145]">{detalhe}</p>
                </MotionReveal>
              ))}
            </ul>
          </div>
        </section>

        <section id="prazos" className="bg-[#f6e3d3] px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-3xl">Calendário de encomendas</h2>
            <p className="mt-3 text-sm leading-7 text-[#6c5145]">
              A cozinha é pequena e cada pedido é feito por ordem de reserva. Estes são os prazos mínimos:
            </p>
            <dl className="mt-8 space-y-px overflow-hidden rounded-2xl bg-[#4a3128]/10">
              {CALENDARIO.map(([k, v], i) => (
                <MotionReveal key={k} variant="left" delay={i * 100} className="flex flex-wrap items-baseline justify-between gap-2 bg-[#fff6ee] px-6 py-4">
                  <dt className="font-semibold">{k}</dt>
                  <dd className="text-sm font-bold text-[#c8407a]">{v}</dd>
                </MotionReveal>
              ))}
            </dl>
          </div>
        </section>

        <section id="kits" className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-3xl">Kits prontos para fechar rápido</h2>
            <div className="mt-8 flex snap-x gap-5 overflow-x-auto pb-2">
              {KITS.map(([nome, texto], i) => (
                <MotionReveal
                  as="article"
                  key={nome}
                  variant="right"
                  delay={i * 120}
                  className="min-w-[16rem] flex-1 snap-start rounded-3xl border border-[#e5477a]/25 bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1"
                >
                  <h3 className="font-serif text-xl font-bold">{nome}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#6c5145]">{texto}</p>
                </MotionReveal>
              ))}
            </div>
            <div className="mt-8">
              <Encomendar soft>Montar kit personalizado</Encomendar>
            </div>
          </div>
        </section>

        <section id="contato" className="bg-[#4a3128] px-5 py-14 text-center text-[#fff6ee] lg:px-8">
          <MotionReveal variant="mask">
            <h2 className="mx-auto max-w-2xl font-serif text-3xl leading-snug sm:text-4xl">
              Já tem data marcada? Reserve a agenda da cozinha.
            </h2>
          </MotionReveal>
          <div className="mt-8">
            <Encomendar>Reservar minha data</Encomendar>
          </div>
        </section>
      </main>
      </MotionScope>

      <footer className="px-5 py-8 text-sm text-[#6c5145] lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-base font-bold text-[#4a3128]">Delícias Caseiras Mirassol</p>
          <PortfolioHostCredit linkClassName="font-semibold text-[#4a3128] underline underline-offset-4" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="mirassol-delicias-caseiras"
        eyebrow="Delícias Caseiras Mirassol"
        title="A agenda de datas comemorativas fecha antes."
        description="Reserve bolo e salgados com o prazo mínimo de produção."
        ctaLabel="Ver a vitrine"
        ctaHref="#vitrine"
        delayMs={9000}
        className="border-[#e5477a]/40 bg-[#fff6ee]/95 text-[#4a3128]"
        accentClassName="text-[#c8407a]"
      />
      <PortfolioUpsellPopup pageName="portfolio-mirassol-delicias-caseiras" />
    </div>
  );
}
