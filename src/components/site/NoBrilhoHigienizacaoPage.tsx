import { ArrowRight, Home } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

/**
 * Direção autoral — "amostras de tecido".
 * Bandas horizontais empilhadas, título centralizado e uma cartela de amostras
 * (chips) para cada superfície higienizada. Verde eucalipto + cobre + areia:
 * fora do repertório de salão/beleza (CIH & LUH, Salão da Márcia, Renata
 * Beauty) e sem dourado, glitter ou gradiente brilhante.
 */

const quiz = {
  services: ["Sofá", "Colchão", "Cadeiras e poltronas", "Banco automotivo", "Tapete ou carpete", "Higienização completa"],
  experienceOptions: ["Residência", "Escritório ou comércio", "Veículo", "Outro ambiente"],
  periodOptions: ["São José dos Pinhais", "Curitiba e região", "Vou confirmar o endereço"],
  timingOptions: ["Quero agendar em breve", "Estou planejando", "Quero uma avaliação primeiro"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "O que você quer higienizar?",
    experience: "Onde será o atendimento?",
    period: "Qual região?",
    timing: "Quando prefere agendar?",
    note: "Conte os detalhes",
  },
  notePlaceholder: "Ex.: tamanho, manchas, odores ou ácaros que deseja remover.",
};

function CTA({ children, tone = "copper" }: { children: React.ReactNode; tone?: "copper" | "sand" }) {
  return (
    <PortfolioCTAQuiz
      clientKey="no-brilho-higienizacao"
      studioName="No Brilho Higienização"
      recipientName="No Brilho"
      theme="navy"
      mode="proposal"
      quizConfig={quiz}
      className={
        tone === "copper"
          ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#b4703f] px-7 py-3.5 text-sm font-bold text-[#fdf9f3] transition hover:bg-[#9a5c31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24443a]"
          : "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#efe9df] px-7 py-3.5 text-sm font-bold text-[#24443a] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b4703f]"
      }
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

const amostras: Array<[string, string, string]> = [
  ["Sofás e poltronas", "Remoção de sujeira, manchas, odores e ácaros com cuidado para cada tecido.", "bg-[#2f5a4b]"],
  ["Colchões e cadeiras", "Higienização profunda para renovar o conforto e a aparência do ambiente.", "bg-[#b4703f]"],
  ["Bancos automotivos", "Limpeza profissional para deixar o interior do carro mais agradável.", "bg-[#3d6a58]"],
  ["Tapetes e carpetes", "Atendimento sob medida para recuperar a sensação de limpeza.", "bg-[#8d6a4c]"],
];

const etapas: Array<[string, string]> = [
  ["Avaliamos", "Entendemos o tecido, o tamanho da peça e a necessidade real."],
  ["Vamos até você", "Atendimento domiciliar agendado em São José dos Pinhais e região."],
  ["Renovamos", "Higienização com cuidado profissional e acabamento cuidadoso."],
];

export function NoBrilhoHigienizacaoPage() {
  return (
    <div className="min-h-dvh bg-[#efe9df] font-sans text-[#24443a]">
      <header className="bg-[#24443a] text-[#efe9df]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <a href="#inicio" className="flex items-center gap-3">
            <PortfolioImage
              src="/images/no-brilho-higienizacao/logo.svg"
              alt="Marca No Brilho Higienização"
              width={44}
              height={44}
              className="h-11 w-11 rounded-xl"
            managedField="logoUrl"
              />
            <span className="font-display text-base font-bold leading-tight">
              No Brilho
              <span className="block text-xs font-medium uppercase tracking-[.18em] text-[#c9a888]">Higienização</span>
            </span>
          </a>
          <nav className="hidden gap-7 text-sm font-semibold md:flex">
            <a href="#amostras" className="hover:text-[#c9a888]">Serviços</a>
            <a href="#etapas" className="hover:text-[#c9a888]">Como funciona</a>
            <a href="#regiao" className="hover:text-[#c9a888]">Região</a>
          </nav>
          <CTA tone="sand">Agendar</CTA>
        </div>
      </header>

      <main>
        {/* Banda 1 — declaração centralizada, sem hero dividido. */}
        <section id="inicio" className="bg-[#24443a] pb-16 text-[#efe9df]">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[.24em] text-[#c9a888]">
              Higienização profissional a domicílio
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-6xl">
              Mais limpeza. <span className="text-[#c9a888]">Mais brilho.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#cfded6]">
              Sofás, colchões, cadeiras, poltronas e bancos automotivos renovados com atendimento profissional e
              agendamento prévio.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <CTA>
                Solicitar orçamento <ArrowRight className="h-4 w-4" />
              </CTA>
              <a
                href="#amostras"
                className="inline-flex min-h-12 items-center rounded-full border border-[#efe9df]/40 px-7 py-3.5 text-sm font-semibold hover:bg-white/10"
              >
                Conhecer serviços
              </a>
            </div>
          </div>
        </section>

        {/* Banda 2 — arte real do cliente contida, encaixada entre as duas bandas. */}
        <section className="bg-gradient-to-b from-[#24443a] via-[#24443a] to-[#efe9df]">
          <div className="mx-auto max-w-3xl px-5">
            <div className="rounded-3xl bg-[#efe9df] p-3 shadow-xl">
              <PortfolioImage
                src="/images/no-brilho-higienizacao/vitrine.png"
                alt="Identidade visual da No Brilho Higienização"
                priority
                width={1200}
                height={1200}
                className="mx-auto max-h-[30rem] w-full rounded-2xl object-contain"
                managedField="heroImageUrl"
              />
            </div>
          </div>
        </section>

        {/* Banda 3 — cartela de amostras. */}
        <section id="amostras" className="bg-[#efe9df]">
          <div className="mx-auto max-w-5xl px-5 py-16">
            <h2 className="mx-auto max-w-xl text-center font-display text-3xl font-bold leading-tight sm:text-4xl">
              Um cuidado profundo para o que faz parte da sua rotina.
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {amostras.map(([title, text, chip]) => (
                <article key={title} className="flex gap-5 rounded-2xl bg-white/70 p-5">
                  <span className={`h-20 w-14 shrink-0 rounded-xl ${chip}`} aria-hidden="true" />
                  <div>
                    <h3 className="font-display text-lg font-bold">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#4c6459]">{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Banda 4 — etapas em faixa contínua. */}
        <section id="etapas" className="bg-[#dfd6c7]">
          <div className="mx-auto max-w-5xl px-5 py-16">
            <p className="text-xs font-semibold uppercase tracking-[.24em] text-[#8d6a4c]">Como funciona</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl">
              Você escolhe o estofado. A gente cuida do resto.
            </h2>
            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-[#24443a]/15 sm:grid-cols-3">
              {etapas.map(([title, text], i) => (
                <div key={title} className="bg-[#dfd6c7] p-6">
                  <span className="font-display text-3xl font-bold text-[#b4703f]">{i + 1}</span>
                  <h3 className="mt-3 font-display text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#4c6459]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Banda 5 — região e chamada final. */}
        <section id="regiao" className="bg-[#efe9df]">
          <div className="mx-auto max-w-5xl px-5 py-16">
            <div className="flex flex-col gap-6 rounded-3xl border border-[#24443a]/20 p-8 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.24em] text-[#8d6a4c]">
                  <Home className="h-4 w-4" /> São José dos Pinhais e região
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Seu estofado pode voltar a brilhar.</h2>
                <p className="mt-3 max-w-xl leading-7 text-[#4c6459]">
                  Agende uma avaliação e receba um orçamento sem compromisso.
                </p>
              </div>
              <CTA>
                Agendar agora <ArrowRight className="h-4 w-4" />
              </CTA>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#24443a] text-[#cfded6]">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display font-bold text-[#efe9df]">No Brilho Higienização</p>
            <p className="mt-1">Higienização profissional de estofados a domicílio.</p>
          </div>
          <PortfolioHostCredit linkClassName="font-semibold text-[#efe9df] underline underline-offset-4 hover:text-[#c9a888]" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="no-brilho-higienizacao"
        eyebrow="No Brilho · São José dos Pinhais"
        title="Seu estofado merece cuidado profissional e aparência renovada."
        description="Conte o que deseja higienizar e receba um próximo passo claro."
        ctaLabel="Agendar higienização"
        ctaHref="#amostras"
        delayMs={9000}
        className="border-[#b4703f]/40 bg-[#24443a]/95 text-[#efe9df]"
        accentClassName="text-[#c9a888]"
      />
      <PortfolioUpsellPopup pageName="portfolio-no-brilho-higienizacao" />
    </div>
  );
}
