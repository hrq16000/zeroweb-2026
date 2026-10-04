import { ManagedText } from "@/components/portfolio/ManagedText";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Heart,
  Instagram,
  MapPin,
  Sparkles,
  Star,
} from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { MotionReveal, MotionScope } from "@/components/motion";

const quiz = {
  services: [
    "Festa na Mesa · a partir de R$ 160",
    "Decoração Clássica · a partir de R$ 250",
    "Decoração Premium · a partir de R$ 350",
    "Casamento ou evento especial",
    "Ainda não sei — quero uma sugestão",
  ],
  experienceOptions: [
    "Aniversário infantil",
    "Aniversário adulto",
    "Casamento ou noivado",
    "Evento corporativo / especial",
  ],
  periodOptions: ["Araucária", "Curitiba e região", "Ainda vou confirmar o local"],
  timingOptions: ["Nos próximos 30 dias", "Neste semestre", "Estou planejando"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "Qual decoração combina com sua festa?",
    experience: "Que momento vamos celebrar?",
    period: "Onde será o evento?",
    timing: "Quando é a sua data?",
    note: "Conte um pouco mais",
  },
  notePlaceholder:
    "Ex.: tema, número de convidados, cores, endereço e referências que você imagina.",
};

const packages = [
  {
    code: "P01",
    name: "Festa na Mesa",
    price: "R$ 160",
    detail: "Uma composição charmosa e prática para comemorar com economia.",
  },
  {
    code: "P02",
    name: "Decoração Clássica",
    price: "R$ 250",
    detail: "Painel, arco orgânico e detalhes coordenados para uma mesa completa.",
  },
  {
    code: "P03",
    name: "Decoração Premium",
    price: "R$ 350",
    detail: "Mais impacto, volume e personalidade para uma festa inesquecível.",
  },
] as const;

function CTA({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <PortfolioCTAQuiz
      clientKey="mp-festas-eventos"
      studioName="MP Festas e Eventos"
      recipientName="MP Festas e Eventos"
      theme="navy"
      mode="proposal"
      quizConfig={quiz}
      className={className}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function MpFestasEventosPage() {
  return (
    <MotionScope intensity="EXPRESSIVE">
      <div className="min-h-dvh overflow-hidden bg-[#f8f0df] text-[#0c2850]">
        <header className="border-b border-[#0c2850]/15 bg-[#f8f0df] px-5 py-4 lg:px-8">
          <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-5 md:grid-cols-[1fr_auto_1fr]">
            <a href="#inicio" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center bg-[#0c2850] text-[#f4c24c]">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-base font-black uppercase tracking-[.08em]">MP Festas</p>
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#a2711a]">& Eventos</p>
              </div>
            </a>

            <nav
              aria-label="Navegação MP Festas"
              className="hidden items-center gap-5 text-[10px] font-black uppercase tracking-[.15em] md:flex"
            >
              <a href="#roteiro" className="hover:text-[#a2711a]">Roteiro</a>
              <a href="#pacotes" className="hover:text-[#a2711a]">Pacotes</a>
              <a href="#inspiracoes" className="hover:text-[#a2711a]">Inspirações</a>
            </nav>

            <div className="justify-self-end">
              <CTA className="inline-flex min-h-10 items-center gap-2 bg-[#0c2850] px-4 py-2.5 text-xs font-black uppercase tracking-[.08em] text-white">
                Ver disponibilidade
                <ArrowRight className="h-4 w-4" />
              </CTA>
            </div>
          </div>
        </header>

        <main>
          <section id="inicio" className="px-5 py-7 lg:px-8 lg:py-10">
            <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1.18fr_.82fr]">
              <figure className="relative m-0 min-h-[660px] overflow-hidden bg-[#0c2850]">
                <PortfolioImage
                  src="/images/mp-festas-eventos/capa.webp"
                  alt="Três opções de decoração da MP Festas e Eventos"
                  priority
                  width={1024}
                  height={1536}
                  managedField="heroImageUrl"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071d43]/90 via-[#071d43]/25 to-transparent" />
                <div className="relative flex min-h-[660px] flex-col justify-between p-7 text-white sm:p-10 lg:p-12">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <span className="bg-[#f4c24c] px-3 py-1 text-[10px] font-black uppercase tracking-[.18em] text-[#0c2850]">
                      Araucária e região
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[.16em] text-white/65">
                      decoração afetiva
                    </span>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#f4c24c]">
                      uma festa começa por uma cena
                    </p>
                    <MotionReveal
                      as="h1"
                      variant="up"
                      className="mt-4 max-w-[9ch] font-display text-6xl font-black leading-[.87] tracking-[-.045em] sm:text-7xl lg:text-[6.6rem]"
                    >
                      <ManagedText
                        field="heroHeadline"
                        fallback="Sua festa linda, do jeitinho que você sonhou."
                      />
                    </MotionReveal>
                  </div>
                </div>
              </figure>

              <aside className="flex flex-col justify-between bg-[#f4c24c] p-7 sm:p-9 lg:p-10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#62470f]">
                    briefing da comemoração
                  </p>
                  <p className="mt-5 text-lg leading-8 text-[#183c6e]">
                    <ManagedText
                      field="heroSubheadline"
                      fallback="Festas infantis, celebrações e eventos especiais com cenários cheios de cor, carinho e personalidade — sem precisar gastar uma fortuna."
                    />
                  </p>
                </div>

                <dl className="my-10 divide-y divide-[#0c2850]/20 border-y border-[#0c2850]/20">
                  {[
                    ["01", "Tema", "o universo da festa"],
                    ["02", "Data", "quando vamos celebrar"],
                    ["03", "Local", "Araucária ou região"],
                    ["04", "Pacote", "mesa, clássica ou premium"],
                  ].map(([n, term, value]) => (
                    <div key={n} className="grid grid-cols-[2.5rem_4.5rem_1fr] gap-3 py-4 text-sm">
                      <dt className="font-mono text-xs font-black">{n}</dt>
                      <dd className="font-black uppercase tracking-[.08em]">{term}</dd>
                      <dd className="text-[#62470f]">{value}</dd>
                    </div>
                  ))}
                </dl>

                <CTA className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#0c2850] px-6 py-3.5 text-sm font-black text-white">
                  Montar meu briefing
                  <ArrowRight className="h-4 w-4" />
                </CTA>
              </aside>
            </div>
          </section>

          <section id="roteiro" className="px-5 py-20 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-9 lg:grid-cols-[.35fr_.65fr]">
                <div className="lg:sticky lg:top-6 lg:self-start">
                  <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#a2711a]">
                    roteiro da festa
                  </p>
                  <h2 className="mt-4 max-w-[8ch] font-display text-4xl font-black leading-[.94] sm:text-5xl">
                    Escolha a intensidade do cenário.
                  </h2>
                  <p className="mt-5 max-w-sm text-sm leading-7 text-[#61708a]">
                    Os pacotes ajudam a definir volume, presença e orçamento antes de escolher tema,
                    cores e referências.
                  </p>
                </div>

                <div id="pacotes" className="border-t-2 border-[#0c2850]">
                  {packages.map((item) => (
                    <article
                      key={item.code}
                      className="grid gap-5 border-b border-[#0c2850]/15 py-7 sm:grid-cols-[4rem_1fr_auto] sm:items-start"
                    >
                      <span className="font-mono text-xs font-black text-[#a2711a]">{item.code}</span>
                      <div>
                        <h3 className="font-display text-2xl font-black">{item.name}</h3>
                        <p className="mt-3 max-w-xl leading-7 text-[#61708a]">{item.detail}</p>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-[10px] font-black uppercase tracking-[.16em] text-[#a2711a]">a partir de</p>
                        <p className="mt-1 text-3xl font-black">{item.price}</p>
                      </div>
                    </article>
                  ))}

                  <div className="grid gap-5 bg-[#0c2850] p-6 text-white sm:grid-cols-[1fr_auto] sm:items-center">
                    <p className="text-sm leading-6 text-white/70">
                      Também há atendimento para casamento ou evento especial. O escopo é definido
                      no briefing.
                    </p>
                    <CTA className="inline-flex min-h-11 items-center gap-2 bg-[#f4c24c] px-5 py-3 text-sm font-black text-[#0c2850]">
                      Consultar uma data
                      <ArrowRight className="h-4 w-4" />
                    </CTA>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="inspiracoes" className="bg-[#0c2850] px-5 py-20 text-white lg:px-8 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-4 lg:grid-cols-[.64fr_.36fr]">
                <figure className="relative m-0 overflow-hidden">
                  <PortfolioImage
                    src="/images/mp-festas-eventos/galeria.webp"
                    alt="Bolos e decorações personalizadas em diferentes temas"
                    width={900}
                    height={1600}
                    className="h-[620px] w-full object-cover lg:h-[760px]"
                  />
                  <figcaption className="absolute bottom-0 left-0 max-w-sm bg-[#f4c24c] p-5 font-bold leading-6 text-[#0c2850]">
                    Cada tema ganha uma composição pensada para a história da comemoração.
                  </figcaption>
                </figure>

                <div className="grid gap-4">
                  <div className="flex flex-col justify-between bg-[#e86f8c] p-7 text-white">
                    <Heart className="h-8 w-8" />
                    <div className="mt-14">
                      <h3 className="font-display text-3xl font-black">Carinho em cada detalhe</h3>
                      <p className="mt-3 leading-7 text-white/85">
                        Do briefing à montagem, a composição parte da ocasião e do que você quer
                        celebrar.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between bg-[#7352a8] p-7 text-white">
                    <Star className="h-8 w-8" />
                    <div className="mt-14">
                      <h3 className="font-display text-3xl font-black">Mais de um tipo de festa</h3>
                      <p className="mt-3 leading-7 text-white/85">
                        Aniversários, casamentos, noivados e eventos especiais entram no briefing.
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://www.instagram.com/mp_festa_na_mesa"
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-20 items-center justify-between border border-white/20 px-6 text-sm font-black uppercase tracking-[.1em] hover:bg-white/10"
                  >
                    <span className="inline-flex items-center gap-3">
                      <Instagram className="h-5 w-5 text-[#f4c24c]" />
                      @mp_festa_na_mesa
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#ece3d0] px-5 py-20 lg:px-8 lg:py-24">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.55fr_.45fr]">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#a2711a]">
                  atendimento local
                </p>
                <h2 className="mt-4 max-w-[12ch] font-display text-4xl font-black leading-[.94] sm:text-5xl">
                  Araucária e região, com montagem inclusa.
                </h2>
                <p className="mt-5 max-w-xl leading-8 text-[#61708a]">
                  A MP Festas e Eventos leva a decoração até você e cobra apenas a taxa de
                  deslocamento. Reserve com antecedência para garantir sua data.
                </p>

                <div className="mt-8 grid border-y border-[#0c2850]/15 sm:grid-cols-2">
                  <div className="border-b border-[#0c2850]/15 py-5 sm:border-b-0 sm:border-r sm:pr-6">
                    <CalendarDays className="h-5 w-5 text-[#a2711a]" />
                    <p className="mt-3 font-black">Agenda limitada por data</p>
                  </div>
                  <div className="py-5 sm:pl-6">
                    <MapPin className="h-5 w-5 text-[#a2711a]" />
                    <p className="mt-3 font-black">Araucária e região</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#f4c24c] p-7 sm:p-9">
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#62470f]">
                  fechar o roteiro
                </p>
                <h3 className="mt-4 font-display text-3xl font-black">Conte a sua ideia para a MP.</h3>
                <p className="mt-4 leading-7 text-[#183c6e]">
                  Tema, data, local e pacote entram no mesmo atendimento para organizar o próximo
                  passo.
                </p>
                <div className="mt-7">
                  <CTA className="inline-flex min-h-12 items-center gap-2 bg-[#0c2850] px-6 py-3.5 text-sm font-black text-white">
                    Pedir orçamento
                    <ArrowRight className="h-4 w-4" />
                  </CTA>
                </div>
                <div className="mt-7 flex flex-wrap gap-3 text-xs font-bold text-[#62470f]">
                  <span><Check className="mr-1 inline h-4 w-4" />Tema</span>
                  <span><Check className="mr-1 inline h-4 w-4" />Data</span>
                  <span><Check className="mr-1 inline h-4 w-4" />Local</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-[#071d43] px-5 py-8 text-sm text-[#c9d6ea] lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-black text-white">
                MP Festas <span className="text-[#f4c24c]">& Eventos</span>
              </p>
              <p className="mt-1">Decoração de festas em Araucária e região.</p>
            </div>
            <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4 hover:text-[#f4c24c]" />
          </div>
        </footer>

        <PortfolioSocialProofPopup
          clientKey="mp-festas-eventos"
          eyebrow="MP Festas e Eventos"
          title="Uma decoração especial transforma a memória da sua festa."
          description="Escolha o pacote, conte o tema e receba uma orientação para a sua data."
          ctaLabel="Ver pacotes"
          ctaHref="#pacotes"
          delayMs={9000}
          className="border-[#f4c24c]/30 bg-[#0b2b62]/95 text-white"
          accentClassName="text-[#f4c24c]"
        />
        <PortfolioUpsellPopup pageName="portfolio-mp-festas-eventos" />
      </div>
    </MotionScope>
  );
}
