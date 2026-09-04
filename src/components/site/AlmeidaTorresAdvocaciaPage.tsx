import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { ManagedRich } from "@/components/portfolio/ManagedText";

const AREAS = [
  ["I", "Direito de família", "Divórcio consensual, guarda, pensão e inventário conduzidos com discrição."],
  ["II", "Direito do trabalho", "Verbas rescisórias, acordos e defesa de empregados e pequenos empregadores."],
  ["III", "Direito do consumidor", "Cobranças indevidas, contratos abusivos e negativação irregular."],
  ["IV", "Direito civil e contratos", "Revisão contratual, responsabilidade civil e cobrança."],
  ["V", "Consultoria preventiva", "Análise de documentos antes de assinar, para evitar litígio."],
] as const;

const PERGUNTAS = [
  ["A orientação inicial é uma consulta jurídica?", "É uma conversa de triagem para entender o caso, os documentos disponíveis e o caminho processual mais provável."],
  ["Quais documentos devo separar?", "Contratos, comprovantes, mensagens e qualquer documento oficial relacionado ao fato. A lista definitiva é combinada após a triagem."],
  ["O escritório atende fora de São Paulo?", "Sim, com acompanhamento remoto e correspondentes quando o processo exige presença em outra comarca."],
] as const;

const quiz = {
  stepTitles: {
    service: "Qual é a natureza do caso?",
    experience: "Em que estágio ele está?",
    period: "Onde tramita ou tramitaria?",
    timing: "Qual a urgência?",
    note: "Resumo do caso",
  },
  services: ["Família e sucessões", "Trabalhista", "Consumidor", "Civil e contratos", "Consultoria preventiva"],
  experienceOptions: ["Ainda não há processo", "Fui notificado", "Processo em andamento", "Preciso revisar um contrato"],
  periodOptions: ["São Paulo — capital", "Grande São Paulo", "Outra comarca"],
  timingOptions: ["Há prazo correndo", "Nas próximas semanas", "Sem urgência definida"],
};

function Consulta({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <PortfolioCTAQuiz
      clientKey="almeida-torres"
      studioName="Almeida Torres Advocacia"
      recipientName="o escritório"
      theme="gold"
      mode="proposal"
      quizConfig={quiz}
      className={
        dark
          ? "inline-flex min-h-12 items-center justify-center rounded-none border border-[#c8b98f] px-7 py-3 text-sm font-semibold uppercase tracking-[.18em] text-[#f3ece0] transition hover:bg-[#f3ece0] hover:text-[#1d2a24] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8b98f]"
          : "inline-flex min-h-12 items-center justify-center rounded-none bg-[#1d2a24] px-7 py-3 text-sm font-semibold uppercase tracking-[.18em] text-[#f3ece0] transition hover:bg-[#2d4239] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d2a24] focus-visible:ring-offset-2"
      }
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function AlmeidaTorresAdvocaciaPage() {
  return (
    <div className="min-h-dvh bg-[#f3efe6] font-serif text-[#22201c]">
      <header className="border-b border-[#22201c]/25">
        <div className="mx-auto flex max-w-4xl flex-col gap-1 px-5 py-6 text-center lg:px-8">
          <span className="text-[0.68rem] uppercase tracking-[.42em] text-[#5c6b60]">Advocacia · São Paulo — SP</span>
          <a href="#inicio" className="text-2xl font-semibold tracking-[.08em]">
            ALMEIDA TORRES
          </a>
        </div>
      </header>

      <main>
        <section id="inicio" className="mx-auto max-w-3xl px-5 pb-14 pt-16 text-center lg:px-8 lg:pt-24">
          <h1 className="text-balance text-4xl font-semibold leading-[1.12] sm:text-6xl">
            <ManagedRich field="heroHeadline">
            Orientação jurídica <span className="italic text-[#3a5a49]">antes</span> da decisão difícil.</ManagedRich>
          </h1>
          <hr className="mx-auto my-8 w-28 border-t border-[#22201c]/40" />
          <p className="mx-auto max-w-xl text-[1.02rem] leading-8 text-[#4a463f]"><ManagedRich field="heroSubheadline">
            Um escritório de atuação contida: analisamos documentos, explicamos os caminhos possíveis e só então
            propomos a estratégia. Sem promessa de resultado, com clareza sobre riscos e prazos.</ManagedRich></p>
          <div className="mt-10">
            <Consulta>Solicitar orientação inicial</Consulta>
          </div>
        </section>

        <section id="atuacao" className="border-y border-[#22201c]/20 bg-[#ece7db]">
          <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
            <p className="text-[0.68rem] uppercase tracking-[.34em] text-[#5c6b60]">Índice de atuação</p>
            <ol className="mt-8">
              {AREAS.map(([num, titulo, texto]) => (
                <li
                  key={num}
                  className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-[#22201c]/20 py-6 first:border-t-0 sm:grid-cols-[3rem_14rem_1fr] sm:items-baseline"
                >
                  <span className="text-sm tracking-[.2em] text-[#3a5a49]">{num}</span>
                  <h2 className="text-xl font-semibold">{titulo}</h2>
                  <p className="col-span-2 text-[0.95rem] leading-7 text-[#4a463f] sm:col-span-1">{texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
          <blockquote className="border-l-2 border-[#3a5a49] pl-6 text-lg italic leading-8 text-[#3b3830]">
            “A primeira conversa serve para saber se existe caso — e, quando não existe, dizer isso com a mesma
            franqueza com que se aceita a causa.”
          </blockquote>
        </section>

        <section id="duvidas" className="border-t border-[#22201c]/20">
          <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
            <p className="text-[0.68rem] uppercase tracking-[.34em] text-[#5c6b60]">Perguntas frequentes</p>
            <div className="mt-6">
              {PERGUNTAS.map(([q, a]) => (
                <details key={q} className="border-b border-[#22201c]/20 py-5">
                  <summary className="cursor-pointer list-none text-lg font-semibold marker:content-none">
                    {q}
                  </summary>
                  <p className="mt-3 text-[0.95rem] leading-7 text-[#4a463f]">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="contato" className="bg-[#1d2a24] text-[#f3ece0]">
          <div className="mx-auto max-w-3xl px-5 py-16 text-center lg:px-8">
            <h2 className="text-3xl font-semibold sm:text-4xl">Descreva o caso em poucas linhas.</h2>
            <p className="mx-auto mt-4 max-w-xl text-[0.98rem] leading-7 text-[#cfd8d0]">
              A triagem indica o próximo passo — documentos necessários, prazo e se o caminho é judicial ou não.
            </p>
            <div className="mt-8">
              <Consulta dark>Enviar resumo do caso</Consulta>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#141b17] px-5 py-8 text-sm text-[#9fb0a4] lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="tracking-[.14em] text-[#f3ece0]">ALMEIDA TORRES ADVOCACIA</p>
          <PortfolioHostCredit linkClassName="underline underline-offset-4 hover:text-white" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="almeida-torres"
        eyebrow="Almeida Torres Advocacia"
        title="Antes de assinar, vale uma leitura jurídica."
        description="Descreva o caso e receba o próximo passo com prazos e documentos."
        ctaLabel="Ver áreas de atuação"
        ctaHref="#atuacao"
        delayMs={11000}
        className="border-[#c8b98f]/50 bg-[#1d2a24]/95 text-[#f3ece0]"
        accentClassName="text-[#c8b98f]"
      />
      <PortfolioUpsellPopup pageName="portfolio-almeida-torres" />
    </div>
  );
}
