import {
  ArrowRight,
  CalendarDays,
  Check,
  ChefHat,
  Instagram,
  PartyPopper,
} from "lucide-react";
import type { ReactNode } from "react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const quiz = {
  services: [
    "Salgados assados e fritos",
    "Mini lanches",
    "Doces e bolos caseiros",
    "Porções para eventos",
    "Coffee break e kits",
  ],
  experienceOptions: [
    "Aniversário ou comemoração",
    "Casamento ou confraternização",
    "Coffee break empresarial",
    "Receber família e amigos",
  ],
  periodOptions: [
    "Ainda vou definir a data",
    "Nos próximos 7 dias",
    "Nas próximas semanas",
    "Quero consultar disponibilidade",
  ],
  timingOptions: ["Quero um orçamento", "Estou montando o cardápio", "Preciso de uma orientação"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "O que vai compor sua mesa?",
    experience: "Qual é a ocasião?",
    period: "Quando será?",
    timing: "Qual próximo passo?",
    note: "Conte um pouco mais",
  },
  notePlaceholder: "Ex.: data, número de pessoas, sabores desejados ou tipo de evento.",
};

const menuRows = [
  ["M01", "Salgados", "Assados e fritos para dividir em festas, encontros e confraternizações.", "quente / porções"],
  ["M02", "Mini lanches", "Combinações práticas para coffee breaks, reuniões e comemorações.", "prático / evento"],
  ["M03", "Doces", "Opções doces para completar a mesa e equilibrar o cardápio.", "doce / finalização"],
  ["M04", "Bolos caseiros", "Bolos com clima de casa para acompanhar encontros e celebrações.", "bolo / mesa"],
  ["M05", "Coffee break e kits", "Composição combinada conforme ocasião, quantidade e preferência.", "kit / empresa"],
] as const;

const occasions = [
  ["01", "Festa em família", "Aniversários, encontros e datas que pedem uma mesa planejada com antecedência."],
  ["02", "Celebração", "Casamentos, confraternizações e eventos em que o cardápio precisa acompanhar a ocasião."],
  ["03", "Coffee break", "Mini lanches e porções organizados para equipes, reuniões e convidados."],
] as const;

function CTA({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <PortfolioCTAQuiz
      clientKey="kitutes-na-mesa"
      studioName="Kitutes na Mesa"
      recipientName="a equipe Kitutes na Mesa"
      theme="pink"
      mode="proposal"
      quizConfig={quiz}
      ariaLabel="Solicitar orçamento para Kitutes na Mesa"
      className={className}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function KitutesNaMesaPage() {
  return (
    <div className="min-h-dvh overflow-hidden bg-[#fff8ee] text-[#4b2e28]">
      <header className="border-b-2 border-[#4b2e28] bg-[#fff8ee] px-5 py-4 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <a href="#pedido" className="flex items-center gap-3">
            <PortfolioImage
              src="/images/kitutes-na-mesa/logo.png"
              alt="Kitutes na Mesa"
              width={128}
              height={128}
              priority
              managedField="logoUrl"
              className="h-11 w-11 rounded-full object-cover"
            />
            <div>
              <p className="font-serif text-lg font-bold">Kitutes na Mesa</p>
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#ad5e50]">
                encomendas sob medida
              </p>
            </div>
          </a>

          <CTA className="inline-flex min-h-10 items-center gap-2 bg-[#4b2e28] px-4 py-2.5 text-xs font-black uppercase tracking-[.08em] text-white transition hover:-translate-y-0.5 hover:bg-[#6a4037]">
            Abrir encomenda
            <ArrowRight className="h-4 w-4" />
          </CTA>
        </div>
      </header>

      <main>
        <section id="pedido" className="px-5 pb-10 pt-8 lg:px-8 lg:pb-14 lg:pt-12">
          <div className="mx-auto max-w-7xl">
            <div className="border-y-2 border-[#4b2e28] py-4 text-[10px] font-black uppercase tracking-[.22em] text-[#ad5e50]">
              Pedido de evento · Curitiba e região · somente sob encomenda
            </div>

            <div className="grid gap-8 py-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="font-mono text-xs font-bold text-[#ad5e50]">FICHA 001</p>
                <h1 className="mt-4 max-w-[12ch] font-serif text-5xl font-bold leading-[.9] tracking-[-.045em] sm:text-7xl lg:text-[7.6rem]">
                  A mesa começa antes da primeira bandeja.
                </h1>
              </div>
              <p className="max-w-md border-l-2 border-[#d99c8d] pl-5 text-base leading-8 text-[#765d55]">
                Salgados, mini lanches, doces, bolos caseiros e kits combinados conforme a ocasião,
                a data e o tamanho do encontro.
              </p>
            </div>

            <figure className="m-0 overflow-hidden border-2 border-[#4b2e28] bg-[#4b2e28]">
              <PortfolioImage
                src="/images/kitutes-na-mesa/hero.png"
                alt="Composição editorial de salgados, doces, mini lanches e bolo caseiro"
                priority
                managedField="heroImageUrl"
                width={1536}
                height={864}
                className="h-[360px] w-full object-cover sm:h-[520px]"
              />
              <figcaption className="grid gap-3 border-t-2 border-[#4b2e28] bg-[#f4c9b8] px-5 py-4 text-sm sm:grid-cols-[1fr_auto] sm:items-center">
                <span className="font-bold">Uma referência visual para imaginar a composição da mesa.</span>
                <span className="font-mono text-xs font-bold uppercase tracking-[.14em]">porções com carinho</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section id="briefing" className="bg-[#4b2e28] px-5 py-16 text-white lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[.38fr_.62fr]">
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[.22em] text-[#f4c9b8]">
                  briefing da mesa
                </p>
                <h2 className="mt-4 max-w-[8ch] font-serif text-4xl font-bold leading-[.94] sm:text-5xl">
                  Quatro respostas organizam o pedido.
                </h2>
              </div>

              <ol className="border-t border-white/20">
                {[
                  ["01", "Ocasião", "Aniversário, celebração, coffee break ou encontro."],
                  ["02", "Data", "Quando a encomenda precisa estar pronta."],
                  ["03", "Pessoas", "Quantidade aproximada para dimensionar a mesa."],
                  ["04", "Preferências", "Itens, sabores e formato que você deseja combinar."],
                ].map(([n, title, text]) => (
                  <li
                    key={n}
                    className="grid gap-3 border-b border-white/15 py-5 sm:grid-cols-[4rem_10rem_1fr]"
                  >
                    <span className="font-mono text-xs font-black text-[#f4c9b8]">{n}</span>
                    <h3 className="font-bold">{title}</h3>
                    <p className="text-sm leading-6 text-white/65">{text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="cardapio" className="px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 border-b-2 border-[#4b2e28] pb-7 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[.22em] text-[#ad5e50]">
                  mapa de cardápio
                </p>
                <h2 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">
                  Escolha os blocos da mesa.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-[#765d55]">
                O cardápio final é combinado no atendimento; a página organiza as categorias sem
                inventar quantidade, preço ou disponibilidade.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#4b2e28] text-left text-[10px] font-black uppercase tracking-[.16em] text-[#ad5e50]">
                    <th className="px-3 py-4">Código</th>
                    <th className="px-3 py-4">Categoria</th>
                    <th className="px-3 py-4">Uso na mesa</th>
                    <th className="px-3 py-4">Leitura</th>
                  </tr>
                </thead>
                <tbody>
                  {menuRows.map(([code, title, description, tag]) => (
                    <tr key={code} className="border-b border-[#4b2e28]/20">
                      <td className="px-3 py-6 font-mono text-xs font-black text-[#ad5e50]">{code}</td>
                      <td className="px-3 py-6 font-serif text-2xl font-bold">{title}</td>
                      <td className="max-w-2xl px-3 py-6 leading-7 text-[#765d55]">{description}</td>
                      <td className="px-3 py-6 text-xs font-black uppercase tracking-[.12em] text-[#ad5e50]">
                        {tag}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-7 flex justify-end">
              <CTA className="inline-flex min-h-12 items-center gap-2 bg-[#b96555] px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#8e4b40]">
                Montar cardápio
                <ArrowRight className="h-4 w-4" />
              </CTA>
            </div>
          </div>
        </section>

        <section id="ocasioes" className="border-y-2 border-[#4b2e28] bg-[#f4c9b8] px-5 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-4 lg:grid-cols-3">
              {occasions.map(([n, title, text]) => (
                <article key={n} className="border-2 border-[#4b2e28] bg-[#fff8ee] p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-[#ad5e50]">{n}</span>
                    <CalendarDays className="h-5 w-5 text-[#ad5e50]" />
                  </div>
                  <h3 className="mt-12 font-serif text-3xl font-bold">{title}</h3>
                  <p className="mt-4 leading-7 text-[#765d55]">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="fechamento" className="px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[.68fr_.32fr]">
            <div className="border-2 border-[#4b2e28] bg-white p-7 sm:p-10">
              <ChefHat className="h-7 w-7 text-[#ad5e50]" />
              <p className="mt-8 font-mono text-[10px] font-black uppercase tracking-[.22em] text-[#ad5e50]">
                fechamento da encomenda
              </p>
              <h2 className="mt-4 max-w-[12ch] font-serif text-4xl font-bold leading-[.94] sm:text-5xl">
                Conte a ocasião. A mesa é combinada a partir daí.
              </h2>
              <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold text-[#765d55]">
                <span><Check className="mr-1 inline h-4 w-4" />Ocasião</span>
                <span><Check className="mr-1 inline h-4 w-4" />Data</span>
                <span><Check className="mr-1 inline h-4 w-4" />Quantidade</span>
              </div>
              <div className="mt-8">
                <CTA className="inline-flex min-h-12 items-center gap-2 bg-[#4b2e28] px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#6a4037]">
                  Solicitar orçamento
                  <ArrowRight className="h-4 w-4" />
                </CTA>
              </div>
            </div>

            <aside className="flex flex-col justify-between border-2 border-[#4b2e28] bg-[#d98978] p-7 text-[#4b2e28] sm:p-9">
              <div>
                <PartyPopper className="h-7 w-7" />
                <h3 className="mt-6 font-serif text-3xl font-bold">Acompanhe as novidades.</h3>
                <p className="mt-4 leading-7 text-[#633f36]">
                  A rede social serve como vitrine complementar. O orçamento continua pelo funil da página.
                </p>
              </div>
              <a
                href="https://www.instagram.com/invites/contact/?igsh=nor9e0ag8wrw&utm_content=t2w8v3"
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 font-black underline underline-offset-4"
              >
                <Instagram className="h-4 w-4" />
                Abrir Instagram
              </a>
            </aside>
          </div>
        </section>
      </main>

      <footer className="bg-[#4b2e28] px-5 py-8 text-sm text-white/65 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-xl font-bold text-white">Kitutes na Mesa</p>
            <p className="mt-1">Porções com carinho · encomendas sob medida.</p>
          </div>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4 hover:text-[#f4c9b8]" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="kitutes-na-mesa"
        eyebrow="Kitutes na Mesa"
        title="Sua comemoração pode começar pela mesa."
        description="Conte a ocasião, a data e o que gostaria de servir."
        ctaLabel="Montar orçamento"
        ctaHref="#fechamento"
        delayMs={10000}
        className="border-[#d98978]/40 bg-[#4b2e28]/95 text-white"
        accentClassName="text-[#f4c9b8]"
      />
      <PortfolioUpsellPopup pageName="portfolio-kitutes-na-mesa" />
    </div>
  );
}
