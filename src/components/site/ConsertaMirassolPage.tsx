import { ManagedText } from "@/components/portfolio/ManagedText";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const REPAROS = [
  ["Troca de tela", "1 a 2 dias", "90 dias", "Peça original ou compatível, você escolhe"],
  ["Troca de bateria", "No mesmo dia", "90 dias", "Teste de saúde da bateria antes e depois"],
  ["Conector de carga", "1 dia", "90 dias", "Limpeza inclusa quando o problema é sujeira"],
  ["Reparo de placa", "3 a 5 dias", "60 dias", "Diagnóstico com microscópio antes do orçamento"],
  ["Recuperação de dados", "Sob análise", "—", "Só cobra se conseguir recuperar"],
] as const;

const ETAPAS = [
  ["Diagnóstico", "Aparelho é testado na bancada e você recebe o laudo com foto."],
  ["Aprovação", "Valor, prazo e garantia por escrito antes de qualquer troca de peça."],
  ["Reparo", "Serviço executado na loja, sem envio para terceiros."],
  ["Entrega com teste", "Você testa o aparelho no balcão antes de pagar."],
] as const;

const MARCAS = ["Samsung", "Motorola", "Xiaomi", "iPhone", "LG", "Realme", "Asus", "Positivo"] as const;

const quiz = {
  stepTitles: {
    service: "Qual é o problema do aparelho?",
    experience: "Qual aparelho?",
    period: "Como prefere resolver?",
    timing: "Qual a urgência?",
    note: "Detalhe o que aconteceu",
  },
  services: ["Tela quebrada", "Bateria viciada", "Não carrega", "Molhou", "Não liga", "Outro problema"],
  experienceOptions: ["Celular Android", "iPhone", "Tablet", "Notebook"],
  periodOptions: ["Levo na loja", "Prefiro combinar retirada", "Só quero orçamento"],
  timingOptions: ["Hoje", "Esta semana", "Sem pressa"],
};

function Diagnostico({ children, tone = "lima" }: { children: React.ReactNode; tone?: "lima" | "linha" }) {
  return (
    <PortfolioCTAQuiz
      clientKey="mirassol-conserta-celular"
      studioName="Conserta Mirassol"
      recipientName="a assistência"
      theme="navy"
      mode="proposal"
      quizConfig={quiz}
      className={
        tone === "lima"
          ? "inline-flex min-h-12 items-center justify-center rounded-md bg-[#9ede3a] px-6 py-3 font-mono text-sm font-bold uppercase tracking-wide text-[#12161a] transition hover:bg-[#b4ea63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9ede3a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12161a]"
          : "inline-flex min-h-12 items-center justify-center rounded-md border border-[#3d4650] px-6 py-3 font-mono text-sm font-bold uppercase tracking-wide text-[#e6ebf0] transition hover:border-[#9ede3a] hover:text-[#9ede3a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9ede3a]"
      }
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function ConsertaMirassolPage() {
  return (
    <div className="min-h-dvh bg-[#12161a] text-[#e6ebf0]">
      <main>
        <section
          id="inicio"
          className="border-b border-[#252c33] bg-[linear-gradient(90deg,#1a2027_1px,transparent_1px),linear-gradient(#1a2027_1px,transparent_1px)] bg-[size:44px_44px] px-5 py-12 lg:px-8"
        >
          <div className="mx-auto max-w-5xl">
            <a href="#inicio" className="font-mono text-sm uppercase tracking-[.3em] text-[#9ede3a]">
              Conserta Mirassol
            </a>
            <h1 className="mt-8 max-w-3xl text-4xl font-bold leading-[1.06] sm:text-6xl">
            <ManagedText field="heroHeadline" fallback={"Or\u00e7amento com laudo. S\u00f3 depois a chave de fenda encosta no aparelho."} />
          </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#9aa6b2]">
            <ManagedText field="heroSubheadline" fallback={"Assist\u00eancia t\u00e9cnica de bairro no S\u00e3o Bernardo, em Mirassol \u2014 SP. Diagn\u00f3stico registrado, prazo declarado e garantia escrita em cada servi\u00e7o."} />
          </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Diagnostico>Pedir diagnóstico</Diagnostico>
              <Diagnostico tone="linha">Consultar prazo e garantia</Diagnostico>
            </div>
          </div>
        </section>

        <section id="tabela" className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-mono text-xs uppercase tracking-[.3em] text-[#9ede3a]">Tabela de reparos</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#2c343c] text-[#7d8a97]">
                    <th scope="col" className="py-3 pr-4 font-mono text-xs uppercase tracking-wider">Serviço</th>
                    <th scope="col" className="py-3 pr-4 font-mono text-xs uppercase tracking-wider">Prazo</th>
                    <th scope="col" className="py-3 pr-4 font-mono text-xs uppercase tracking-wider">Garantia</th>
                    <th scope="col" className="py-3 font-mono text-xs uppercase tracking-wider">Observação</th>
                  </tr>
                </thead>
                <tbody>
                  {REPAROS.map(([servico, prazo, garantia, obs]) => (
                    <tr key={servico} className="border-b border-[#1d242b]">
                      <th scope="row" className="py-4 pr-4 text-base font-semibold text-white">{servico}</th>
                      <td className="py-4 pr-4 font-mono text-[#9ede3a]">{prazo}</td>
                      <td className="py-4 pr-4 font-mono text-[#9aa6b2]">{garantia}</td>
                      <td className="py-4 leading-6 text-[#9aa6b2]">{obs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-[#7d8a97]">
              Prazos referem-se a peças em estoque. Valores dependem do modelo e são informados no laudo.
            </p>
          </div>
        </section>

        <section id="processo" className="border-y border-[#252c33] bg-[#171d23] px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold sm:text-3xl">Como o aparelho anda pela bancada</h2>
            <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {ETAPAS.map(([titulo, texto], i) => (
                <li key={titulo} className="border-t-2 border-[#9ede3a] pt-4">
                  <span className="font-mono text-xs text-[#7d8a97]">ETAPA {String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 text-lg font-semibold">{titulo}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#9aa6b2]">{texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="marcas" className="px-5 py-14 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-mono text-xs uppercase tracking-[.3em] text-[#7d8a97]">Marcas atendidas</h2>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-lg font-semibold text-[#c6d0da]">
              {MARCAS.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contato" className="px-5 pb-16 lg:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-6 rounded-lg border border-[#9ede3a]/40 bg-[#171d23] p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Descreva o defeito e receba o laudo.</h2>
              <p className="mt-2 max-w-xl text-sm leading-7 text-[#9aa6b2]">
                Quanto mais detalhe (caiu, molhou, esquenta, não carrega), mais preciso é o orçamento inicial.
              </p>
            </div>
            <Diagnostico>Abrir chamado</Diagnostico>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#252c33] px-5 py-8 font-mono text-xs uppercase tracking-[.18em] text-[#7d8a97] lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-white">Conserta Mirassol · São Bernardo</p>
          <PortfolioHostCredit linkClassName="text-white underline underline-offset-4" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="mirassol-conserta-celular"
        eyebrow="Conserta Mirassol"
        title="Sem laudo, sem orçamento no chute."
        description="Conte o defeito e receba prazo e garantia antes de deixar o aparelho."
        ctaLabel="Ver tabela de reparos"
        ctaHref="#tabela"
        delayMs={9500}
        className="border-[#9ede3a]/40 bg-[#171d23]/95 text-[#e6ebf0]"
        accentClassName="text-[#9ede3a]"
      />
      <PortfolioUpsellPopup pageName="portfolio-mirassol-conserta-celular" />
    </div>
  );
}
