import { ArrowRight } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

// Conceito: prancha de projeto cotada. Ambientes em faixas verticais, medidas como marcação.
const ambientes = [
  { medida: "A-01", nome: "Cozinhas planejadas", texto: "MDF 100% sob medida para aproveitar cada centímetro com beleza e funcionalidade." },
  { medida: "A-02", nome: "Dormitórios e closets", texto: "Guarda-roupas, painéis e soluções inteligentes para uma rotina mais organizada." },
  { medida: "A-03", nome: "Nichos e detalhes", texto: "Porta-tempero, nichos decorativos e móveis infantis feitos para o seu ambiente." },
  { medida: "A-04", nome: "Banheiros e ambientes", texto: "Projetos completos para banheiro, home office, lavanderia e outros espaços." },
];

const condicoes = [
  ["12x sem juros", "Facilidade para realizar seu projeto."],
  ["Desconto à vista", "Condição especial para pagamento à vista."],
  ["Entrega em até 20 dias", "Prazo combinado e acompanhamento."],
  ["100% MDF + garantia", "Materiais de qualidade e acabamento durável."],
];

const quiz = { stepTitles: { service: "Qual ambiente você quer transformar?", experience: "Conte sobre o projeto", period: "Onde será a instalação?", timing: "Quando deseja receber?", note: "Mais detalhes" }, services: ["Cozinha planejada em MDF", "Guarda-roupa e dormitório", "Nichos e porta-tempero", "Banheiro e ambientes em geral"], experienceOptions: ["Projeto completo", "Móvel sob medida", "Cozinha infantil", "Quero renovar um ambiente"], periodOptions: ["Curitiba e região", "Vou confirmar o endereço"], timingOptions: ["Quero aproveitar a entrega em até 20 dias", "Estou planejando", "Quero uma avaliação"] };

function CTA({ children }: { children: React.ReactNode }) {
  return (
    <PortfolioCTAQuiz
      clientKey="jkl-marcenaria"
      studioName="JKL Marcenaria"
      recipientName="JKL"
      theme="gold"
      mode="proposal"
      quizConfig={quiz}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-[#24170e] bg-[#24170e] px-6 py-3.5 text-sm font-semibold uppercase tracking-[.12em] text-[#fbf7f0] transition hover:bg-transparent hover:text-[#24170e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b56b29]"
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function JklMarcenariaPage() {
  return (
    <div className="min-h-dvh bg-[#fbf7f0] text-[#24170e]">
      <header className="border-b border-[#24170e]/15 px-5 py-4 lg:px-10">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4">
          <a href="#inicio" className="font-display text-lg font-semibold tracking-[.14em]">
            JKL <span className="text-[#b56b29]">MARCENARIA</span>
          </a>
          <nav className="hidden gap-7 text-xs font-semibold uppercase tracking-[.16em] text-[#76553a] md:flex">
            <a href="#ambientes">Ambientes</a>
            <a href="#condicoes">Condições</a>
            <a href="#contato">Orçamento</a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero como prancha cotada: réguas laterais e título alinhado à base */}
        <section id="inicio" className="px-5 lg:px-10">
          <div className="mx-auto max-w-[1100px] border-x border-dashed border-[#c8a37a] px-4 py-14 sm:px-10">
            <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[.24em] text-[#b56b29]">
              <span>Projeto sob medida</span>
              <span>Curitiba e região</span>
            </div>
            <h1 className="mt-8 font-display text-[2.5rem] font-semibold leading-[1.02] sm:text-[4.2rem]">
              Cada centímetro
              <br />
              desenhado para <span className="italic text-[#b56b29]">o seu ambiente.</span>
            </h1>
            <div className="mt-8 max-w-xl border-t border-[#24170e]/20 pt-5">
              <p className="text-base leading-7 text-[#76553a]">
                Seu espaço, seu estilo e um projeto pensado nos detalhes. Móveis 100% MDF, acabamento caprichado e
                entrega em até 20 dias.
              </p>
              <div className="mt-6">
                <CTA>
                  Fazer orçamento gratuito <ArrowRight className="h-4 w-4" />
                </CTA>
              </div>
            </div>
          </div>
        </section>

        {/* Ambientes em faixas verticais lado a lado, com imagem apenas no primeiro painel */}
        <section id="ambientes" className="px-5 py-12 lg:px-10">
          <div className="mx-auto max-w-[1100px]">
            <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
              <PortfolioImage
                src="/images/jkl-marcenaria/cozinha.webp"
                alt="Cozinha planejada em MDF produzida pela JKL Marcenaria"
                priority
                width={1200}
                height={1600}
                className="h-[300px] w-full rounded-sm object-cover md:h-auto md:w-[38%]"
                managedField="heroImageUrl"
              />
              <ul className="flex flex-1 flex-col justify-between">
                {ambientes.map((item) => (
                  <li key={item.medida} className="border-b border-[#24170e]/15 py-5 last:border-b-0">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-[11px] tracking-[.2em] text-[#b56b29]">{item.medida}</span>
                      <h2 className="font-display text-xl font-semibold">{item.nome}</h2>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#76553a]">{item.texto}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Condições em faixa escura de largura total, texto corrido em colunas */}
        <section id="condicoes" className="bg-[#24170e] px-5 py-14 text-[#fbf7f0] lg:px-10">
          <div className="mx-auto max-w-[1100px]">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Um projeto bonito começa com confiança.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
              Da primeira medida à instalação, você acompanha um processo claro e recebe um móvel pensado para o seu
              espaço.
            </p>
            <dl className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {condicoes.map(([t, d]) => (
                <div key={t} className="border-l-2 border-[#e8ad68] pl-4">
                  <dt className="font-display text-lg font-semibold text-[#e8ad68]">{t}</dt>
                  <dd className="mt-1 text-sm leading-6 text-white/60">{d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="contato" className="px-5 py-14 lg:px-10">
          <div className="mx-auto flex max-w-[1100px] flex-col gap-6 border border-[#c8a37a] p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.24em] text-[#b56b29]">Seu ambiente começa aqui</p>
              <h2 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">Vamos desenhar algo especial?</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#76553a]">
                Conte o ambiente, as medidas aproximadas e o estilo que você imagina. A JKL prepara o próximo passo.
              </p>
            </div>
            <CTA>
              Solicitar orçamento <ArrowRight className="h-4 w-4" />
            </CTA>
          </div>
        </section>
      </main>

      <footer className="bg-[#1b1009] px-5 py-8 text-sm text-white/60 lg:px-10">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-white">
              JKL <span className="text-[#e8ad68]">Marcenaria</span>
            </p>
            <p className="mt-1">Móveis sob medida em Curitiba e região.</p>
          </div>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4 hover:text-[#e8ad68]" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="jkl-marcenaria"
        eyebrow="JKL Marcenaria · Curitiba"
        title="Seu ambiente pode ficar ainda mais funcional."
        description="Conte seu projeto e receba um próximo passo personalizado."
        ctaLabel="Ver ambientes"
        ctaHref="#ambientes"
        delayMs={9000}
        className="border-[#d9913c]/40 bg-[#24170e]/95 text-[#fbf7f0]"
        accentClassName="text-[#e8ad68]"
      />
      <PortfolioUpsellPopup pageName="portfolio-jkl-marcenaria" />
    </div>
  );
}
