import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const COLECAO = [
  ["Lembrancinhas de festa", "Kits de 20 a 200 peças com etiqueta personalizada.", "-rotate-2"],
  ["Caixas de presente", "Montagem com produtos escolhidos por você.", "rotate-1"],
  ["Peças de casa", "Panôs, capas e enfeites feitos em tecido e crochê.", "rotate-2"],
  ["Presente de última hora", "Peças prontas no ateliê para retirada no mesmo dia.", "-rotate-1"],
] as const;

const PASSOS = [
  ["Conta a ideia", "Ocasião, quantidade e cores que você tem em mente."],
  ["Ateliê monta a amostra", "Você aprova o modelo antes da produção começar."],
  ["Produção e entrega", "Prazo combinado, embalagem finalizada peça a peça."],
] as const;

const DATAS = ["Dia das Mães", "Festa junina", "Formaturas", "Natal", "Chá de bebê", "Casamentos"] as const;

const quiz = {
  stepTitles: {
    service: "O que você quer encomendar?",
    experience: "Para qual ocasião?",
    period: "Quantidade aproximada",
    timing: "Para quando precisa?",
    note: "Cores, tema e detalhes",
  },
  services: ["Lembrancinhas de festa", "Caixa de presente", "Peça para casa", "Presente pronto", "Ainda não sei"],
  experienceOptions: ["Aniversário", "Casamento ou chá", "Data comemorativa", "Presente pessoal", "Empresa"],
  periodOptions: ["Até 20 peças", "De 20 a 60 peças", "Mais de 60 peças", "Peça única"],
  timingOptions: ["Nesta semana", "Neste mês", "Ainda estou planejando"],
};

function Encomenda({ children, tone = "terracota" }: { children: React.ReactNode; tone?: "terracota" | "tinta" }) {
  return (
    <PortfolioCTAQuiz
      clientKey="guaratuba-atelie-presentes"
      studioName="Ateliê Encanto da Baía"
      recipientName="o ateliê"
      theme="pink"
      mode="proposal"
      quizConfig={quiz}
      className={
        tone === "terracota"
          ? "inline-flex min-h-12 -rotate-1 items-center justify-center rounded-2xl bg-[#c25a37] px-7 py-3 text-base font-bold text-[#fdf6ec] shadow-[6px_6px_0_#2f2418] transition hover:rotate-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c25a37] focus-visible:ring-offset-2"
          : "inline-flex min-h-12 rotate-1 items-center justify-center rounded-2xl bg-[#2f2418] px-7 py-3 text-base font-bold text-[#fdf6ec] shadow-[6px_6px_0_#c25a37] transition hover:rotate-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f2418] focus-visible:ring-offset-2"
      }
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function AtelieEncantoDaBaiaPage() {
  return (
    <div className="min-h-dvh bg-[#fdf6ec] text-[#2f2418]">
      <main>
        <section id="inicio" className="relative overflow-hidden px-5 pb-16 pt-10 lg:px-10">
          <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rotate-12 rounded-[3rem] bg-[#f0d9b5]" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 -rotate-6 rounded-full bg-[#e8c3b0]" aria-hidden="true" />
          <div className="relative mx-auto max-w-5xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <a href="#inicio" className="text-lg font-black uppercase tracking-tight">
                Ateliê Encanto da Baía
              </a>
              <span className="rounded-full border border-dashed border-[#2f2418]/40 px-3 py-1 text-xs font-bold uppercase">
                Cohapar · Guaratuba — PR
              </span>
            </div>
            <div className="mt-14 grid gap-8 md:grid-cols-[1.15fr_.85fr] md:items-end">
              <h1 className="text-5xl font-black leading-[.95] sm:text-7xl">
                Presente feito
                <span className="mx-2 inline-block -rotate-2 bg-[#c25a37] px-3 text-[#fdf6ec]">à mão</span>
                <br />
                para gente daqui.
              </h1>
              <div className="rotate-1 rounded-3xl border-2 border-[#2f2418] bg-white p-6 shadow-[8px_8px_0_#e8c3b0]">
                <p className="text-[0.95rem] leading-7">
                  Lembrancinhas, caixas montadas e peças de casa produzidas no ateliê, uma a uma — com amostra aprovada
                  antes de qualquer produção grande.
                </p>
                <div className="mt-5">
                  <Encomenda>Pedir orçamento</Encomenda>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="colecao" className="px-5 pb-20 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-black">O que sai do ateliê</h2>
            <div className="mt-8 columns-1 gap-5 sm:columns-2">
              {COLECAO.map(([titulo, texto, giro]) => (
                <figure
                  key={titulo}
                  className={`mb-5 break-inside-avoid rounded-3xl border-2 border-[#2f2418] bg-white p-6 ${giro}`}
                >
                  <span className="inline-block rounded-full bg-[#f0d9b5] px-3 py-1 text-xs font-bold uppercase">
                    Feito à mão
                  </span>
                  <figcaption className="mt-4 text-xl font-black">{titulo}</figcaption>
                  <p className="mt-2 text-sm leading-7 text-[#5b4a35]">{texto}</p>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="encomendas" className="bg-[#2f2418] px-5 py-16 text-[#fdf6ec] lg:px-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-black">Como encomendar</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {PASSOS.map(([titulo, texto], i) => (
                <div key={titulo} className="relative border-t-4 border-[#e8a37f] pt-5">
                  <span className="text-5xl font-black text-[#c25a37]">{i + 1}</span>
                  <h3 className="mt-2 text-xl font-black">{titulo}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#e3d5c1]">{texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-black">Datas que o ateliê já prepara com antecedência</h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {DATAS.map((d) => (
                <li key={d} className="rounded-full border-2 border-[#2f2418] px-4 py-2 text-sm font-bold">
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contato" className="px-5 pb-20 lg:px-10">
          <div className="mx-auto max-w-5xl -rotate-1 rounded-[2.5rem] border-2 border-[#2f2418] bg-[#e8c3b0] p-8 text-center shadow-[10px_10px_0_#2f2418]">
            <h2 className="text-3xl font-black sm:text-4xl">Tem uma data chegando?</h2>
            <p className="mx-auto mt-3 max-w-lg text-[0.95rem] leading-7">
              Manda a ideia, a quantidade e a cor. O ateliê responde com amostra e prazo.
            </p>
            <div className="mt-7">
              <Encomenda tone="tinta">Começar minha encomenda</Encomenda>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-dashed border-[#2f2418]/30 px-5 py-8 text-sm lg:px-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-black uppercase">Ateliê Encanto da Baía</p>
          <PortfolioHostCredit linkClassName="font-bold underline underline-offset-4" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="guaratuba-atelie-presentes"
        eyebrow="Ateliê Encanto da Baía"
        title="Encomenda com amostra aprovada antes de produzir."
        description="Conte a ocasião e a quantidade para receber prazo e valor."
        ctaLabel="Ver a coleção"
        ctaHref="#colecao"
        delayMs={9000}
        className="border-[#c25a37]/50 bg-[#fdf6ec]/95 text-[#2f2418]"
        accentClassName="text-[#c25a37]"
      />
      <PortfolioUpsellPopup pageName="portfolio-guaratuba-atelie-presentes" />
    </div>
  );
}
