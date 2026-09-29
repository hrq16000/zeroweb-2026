import {
  ArrowRight,
  CakeSlice,
  CalendarDays,
  ChefHat,
  Check,
  Heart,
  Instagram,
  PartyPopper,
} from "lucide-react";
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
  timingOptions: [
    "Quero um orçamento",
    "Estou montando o cardápio",
    "Preciso de uma orientação",
  ],
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
  ["01", "Salgados", "Assados e fritos para servir quentinhos e dividir sem pressa.", ChefHat],
  ["02", "Mini lanches", "Combinações práticas para coffee breaks, reuniões e comemorações.", PartyPopper],
  ["03", "Doces", "Pequenos detalhes doces para completar a mesa e surpreender.", Heart],
  ["04", "Bolos caseiros", "Bolos com clima de casa para acompanhar cada encontro.", CakeSlice],
] as const;

const occasionRows = [
  ["Família", "Aniversários, encontros e datas que pedem uma mesa cheia de carinho."],
  ["Eventos", "Casamentos, confraternizações e celebrações que merecem planejamento."],
  ["Empresas", "Porções e mini lanches para coffee breaks, equipes e convidados."],
] as const;

function CTA({
  children,
  className = "",
}: {
  children: React.ReactNode;
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
      ariaLabel="Solicitar orçamento pelo WhatsApp"
      className={className}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function KitutesNaMesaPage() {
  return (
    <div className="min-h-dvh bg-[#fff7ef] text-[#4b2e28]">
      <header className="border-b-2 border-[#4b2e28] bg-[#fff7ef] px-5 py-4 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <a href="#inicio" className="flex items-center gap-3">
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
              <p className="font-serif text-lg font-black">Kitutes na Mesa</p>
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#b96555]">
                porções com carinho
              </p>
            </div>
          </a>

          <CTA className="inline-flex min-h-10 items-center gap-2 bg-[#4b2e28] px-4 py-2.5 text-xs font-black uppercase tracking-[.08em] text-white transition hover:-translate-y-0.5 hover:bg-[#b96555]">
            Montar encomenda
            <ArrowRight className="h-4 w-4" />
          </CTA>
        </div>
      </header>

      <main>
        <section id="inicio" className="px-5 py-8 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[.54fr_.46fr] lg:items-end">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#b96555]">
                  encomendas sob medida · Curitiba e região
                </p>
                <h1 className="mt-5 max-w-[10ch] font-serif text-6xl font-black leading-[.88] tracking-[-.045em] sm:text-7xl lg:text-[7.2rem]">
                  Monte a mesa antes de montar o pedido.
                </h1>
              </div>
              <div className="border-l-4 border-[#b96555] pl-6">
                <p className="text-lg leading-8 text-[#765d55]">
                  Salgados, mini lanches, doces e bolos caseiros para festas, encontros,
                  confraternizações e coffee breaks.
                </p>
                <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-[#765d55]">
                  <span><Check className="mr-1 inline h-4 w-4 text-[#b96555]" />Somente sob encomenda</span>
                  <span><CalendarDays className="mr-1 inline h-4 w-4 text-[#b96555]" />Data confirmada no atendimento</span>
                </div>
              </div>
            </div>

            <figure className="relative mt-10 overflow-hidden border-2 border-[#4b2e28] bg-white">
              <PortfolioImage
                src="/images/kitutes-na-mesa/hero.png"
                alt="Composição editorial de salgados, doces, mini lanches e bolo caseiro"
                priority
                managedField="heroImageUrl"
                width={1536}
                height={864}
                className="h-[420px] w-full object-cover sm:h-[560px]"
              />
              <figcaption className="flex flex-col gap-3 border-t-2 border-[#4b2e28] bg-[#f4c9b8] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-black">Uma mesa é montada pela ocasião, quantidade e preferência.</p>
                <span className="text-xs font-bold text-[#765d55]">Curitiba e região</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section id="menu" className="bg-[#4b2e28] px-5 py-20 text-white lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[.3fr_.7fr]">
              <aside>
                <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#f4c9b8]">
                  cardápio-base
                </p>
                <h2 className="mt-4 max-w-[8ch] font-serif text-4xl font-black leading-[.94] sm:text-5xl">
                  Escolha as famílias de itens.
                </h2>
                <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
                  O cardápio final é ajustado conforme ocasião, número de pessoas e preferências.
                </p>
              </aside>

              <div className="border-t border-white/25">
                {menuRows.map(([code, title, text, Icon]) => (
                  <article
                    key={code}
                    className="grid gap-4 border-b border-white/20 py-7 sm:grid-cols-[4rem_3rem_1fr_auto] sm:items-start"
                  >
                    <span className="font-mono text-xs font-black text-[#f4c9b8]">{code}</span>
                    <Icon className="h-5 w-5 text-[#f4c9b8]" />
                    <div>
                      <h3 className="font-serif text-2xl font-black">{title}</h3>
                      <p className="mt-3 max-w-xl leading-7 text-white/65">{text}</p>
                    </div>
                    <a href="#pedido" className="text-sm font-black underline underline-offset-4">
                      incluir
                    </a>
                  </article>
                ))}

                <div className="mt-6 flex flex-col gap-5 bg-[#b96555] p-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xl text-sm leading-6 text-white/85">
                    Também há porções para eventos, coffee breaks e kits.
                  </p>
                  <CTA className="inline-flex min-h-11 items-center gap-2 bg-[#fff7ef] px-5 py-3 text-sm font-black text-[#4b2e28] transition hover:-translate-y-0.5">
                    Montar combinação
                    <ArrowRight className="h-4 w-4" />
                  </CTA>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="ocasioes" className="px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#b96555]">
                  ocasião primeiro
                </p>
                <h2 className="mt-4 max-w-[11ch] font-serif text-4xl font-black leading-[.94] sm:text-5xl">
                  A mesma mesa muda conforme quem vai chegar.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-[#765d55]">
                A ocasião ajuda a dimensionar variedade, praticidade e formato de serviço.
              </p>
            </div>

            <div className="mt-10 border-y-2 border-[#4b2e28]">
              {occasionRows.map(([title, text], index) => (
                <article
                  key={title}
                  className="grid gap-4 border-b border-[#4b2e28]/20 py-7 last:border-b-0 sm:grid-cols-[4rem_12rem_1fr]"
                >
                  <span className="font-mono text-xs font-black text-[#b96555]">
                    O{String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-2xl font-black">{title}</h3>
                  <p className="leading-7 text-[#765d55]">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="roteiro" className="bg-[#f4c9b8] px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.42fr_.58fr]">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#8b4f45]">
                roteiro da encomenda
              </p>
              <h2 className="mt-4 max-w-[9ch] font-serif text-4xl font-black leading-[.94] sm:text-5xl">
                Quatro informações bastam para começar.
              </h2>
            </div>

            <ol className="border-y border-[#4b2e28]/20">
              {[
                ["01", "Ocasião", "Aniversário, evento, coffee break ou encontro."],
                ["02", "Data", "Quando a mesa precisa estar pronta."],
                ["03", "Pessoas", "Quantas pessoas vão compartilhar."],
                ["04", "Preferências", "Sabores, tipos de item e formato desejado."],
              ].map(([n, title, text]) => (
                <li
                  key={n}
                  className="grid gap-3 border-b border-[#4b2e28]/20 py-5 last:border-b-0 sm:grid-cols-[3rem_10rem_1fr]"
                >
                  <span className="font-mono text-xs font-black text-[#8b4f45]">{n}</span>
                  <h3 className="font-black">{title}</h3>
                  <p className="text-sm leading-6 text-[#765d55]">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="pedido" className="bg-[#fff7ef] px-5 py-14 lg:px-8 lg:py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 border-t-2 border-[#4b2e28] pt-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#b96555]">
                próximo pedido
              </p>
              <h2 className="mt-4 max-w-[14ch] font-serif text-4xl font-black leading-[.94] sm:text-5xl">
                Conte a ocasião. A mesa começa pelo briefing.
              </h2>
            </div>

            <CTA className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#b96555] px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#4b2e28]">
              Solicitar orçamento
              <ArrowRight className="h-4 w-4" />
            </CTA>
          </div>
        </section>
      </main>

      <footer className="bg-[#4b2e28] px-5 py-8 text-sm text-white/60 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-lg font-black text-white">Kitutes na Mesa</p>
            <p className="mt-1">Porções com carinho · encomendas sob medida.</p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <a
              href="https://www.instagram.com/invites/contact/?igsh=nor9e0ag8wrw&utm_content=t2w8v3"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-bold text-[#f4c9b8]"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
            <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4" />
          </div>
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="kitutes-na-mesa"
        eyebrow="Kitutes na Mesa"
        title="Sua comemoração pode começar pela mesa."
        description="Escolha a ocasião e conte o que gostaria de servir."
        ctaLabel="Montar orçamento"
        ctaHref="#pedido"
        delayMs={10000}
        className="border-[#b96555]/40 bg-[#4b2e28]/95 text-white"
        accentClassName="text-[#f4c9b8]"
      />
      <PortfolioUpsellPopup pageName="portfolio-kitutes-na-mesa" />
    </div>
  );
}
