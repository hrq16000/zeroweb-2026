import {
  ArrowDownRight,
  ArrowRight,
  ChevronRight,
  Factory,
  Layers3,
  MapPin,
  Ruler,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { MotionImageReveal, MotionReveal, MotionScope } from "@/components/motion";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const funnel = "funnel-estrutura-nacional";
const services = [
  [
    "01",
    "Estruturas metálicas",
    "Fabricação e montagem para projetos que precisam de uma solução em aço organizada desde o escopo.",
    Factory,
    ["Galpões e coberturas", "Mezaninos", "Estruturas sob medida"],
  ],
  [
    "02",
    "Abrasivos e arames para solda",
    "Materiais para apoiar a rotina de soldagem e fabricação conforme a necessidade informada.",
    Wrench,
    ["Arames de solda", "Eletrodos", "Abrasivos de corte e desbaste"],
  ],
  [
    "03",
    "Perfis estruturais",
    "Perfis e alternativas em aço para diferentes frentes de construção e indústria.",
    Layers3,
    ["Perfis I, H, U e L", "Chapas", "Tubos estruturais"],
  ],
  [
    "04",
    "Soluções em aço",
    "Uma conversa técnica para entender o contexto e encaminhar o próximo passo do seu projeto.",
    Ruler,
    ["Leitura do escopo", "Alternativas em aço", "Encaminhamento do atendimento"],
  ],
] as const;

const challenges = [
  [
    "Escopo indefinido",
    "Quando a demanda chega solta, o orçamento demora e volta cheio de suposições.",
  ],
  [
    "Material errado",
    "Perfil, arame ou abrasivo incompatível com o processo gera retrabalho na fabricação.",
  ],
  [
    "Contato genérico",
    "Um “fale conosco” sem contexto obriga a repetir tudo de novo na primeira conversa.",
  ],
  [
    "Etapas desconectadas",
    "Fabricação, transporte e montagem tratadas separadamente atrasam o cronograma da obra.",
  ],
] as const;
const quizConfig = {
  proposalKind: "service" as const,
  services: [
    "Fabricação e montagem de estrutura metálica",
    "Abrasivos ou arames para solda",
    "Perfis estruturais",
    "Outra solução em aço",
  ],
  experienceOptions: ["Indústria", "Comércio", "Obra ou construção", "Outro contexto"],
  periodOptions: [
    "Tenho medidas ou projeto",
    "Posso explicar a necessidade",
    "Preciso de orientação inicial",
  ],
  timingOptions: [
    "Quero iniciar a conversa agora",
    "Estou comparando alternativas",
    "Ainda estou planejando",
  ],
  stepTitles: {
    service: "Qual solução em aço você procura?",
    experience: "Em qual contexto o projeto se encaixa?",
    period: "Como prefere apresentar a necessidade?",
    timing: "Em que etapa está seu projeto?",
  },
  notePlaceholder: "Conte o que precisa, medidas aproximadas ou o estágio atual do projeto.",
};

function EnCTA({
  children,
  location,
  variant = "solid",
}: {
  children: ReactNode;
  location: string;
  variant?: "solid" | "outline";
}) {
  const className =
    variant === "outline"
      ? "inline-flex min-h-12 items-center justify-center gap-2 border border-[#07172d]/45 px-5 py-3 text-sm font-bold text-[#07172d] transition hover:border-[#07172d] hover:bg-[#07172d] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#07172d]"
      : "inline-flex min-h-12 items-center justify-center gap-2 bg-[#efb44f] px-5 py-3 text-sm font-extrabold text-[#07172d] transition hover:bg-[#ffd17c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#efb44f]";
  return (
    <FunnelCTAButton
      clientKey="estrutura-nacional"
      companySlug="estrutura-nacional"
      formSlug={funnel}
      location={location}
      quizConfig={quizConfig}
      className={className}
    >
      {children}
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
    </FunnelCTAButton>
  );
}

export function EstruturaNacionalPage() {
  return (
    <div
      data-client-slug="estrutura-nacional"
      className="min-h-dvh overflow-hidden bg-[#edf1f3] font-sans text-[#07172d]"
    >
      <MotionScope intensity="IMMERSIVE">
        <header className="relative z-20 border-b border-white/10 bg-[#07172d] px-5 py-4 text-white lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
            <a href="#inicio" aria-label="EN Estrutura Nacional, início">
              <PortfolioImage
                priority
                managedField="logoUrl"
                src="/images/estrutura-nacional/logo.svg"
                alt="EN Estrutura Nacional"
                width={690}
                height={160}
                className="h-10 w-auto max-w-[225px] object-contain"
              />
            </a>
            <nav
              aria-label="Navegação do projeto"
              className="hidden items-center gap-7 text-xs font-bold uppercase tracking-[.14em] text-white/75 md:flex"
            >
              <a href="#solucoes" className="transition hover:text-[#efb44f]">
                Soluções
              </a>
              <a href="#estrutura" className="transition hover:text-[#efb44f]">
                A empresa
              </a>
              <a href="#processo" className="transition hover:text-[#efb44f]">
                Como começar
              </a>
            </nav>
            <EnCTA location="header">Solicitar contato</EnCTA>
          </div>
        </header>
        <main id="inicio">
          <section className="relative isolate overflow-hidden bg-[#07172d] px-5 pb-16 pt-12 text-white lg:px-8 lg:pb-24 lg:pt-20">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-80 [background-image:linear-gradient(rgba(239,180,79,.09)_1px,transparent_1px),linear-gradient(90deg,rgba(239,180,79,.09)_1px,transparent_1px)] [background-size:44px_44px]"
            />
            <div
              aria-hidden="true"
              className="absolute -right-16 top-4 hidden h-[460px] w-[620px] rotate-[-9deg] border border-[#efb44f]/25 [clip-path:polygon(0_100%,12%_44%,22%_72%,35%_22%,47%_78%,62%_0,75%_64%,88%_30%,100%_100%)] sm:block"
            />
            <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.08fr_.92fr] lg:items-end">
              <div className="max-w-3xl">
                <p className="flex items-center gap-3 text-xs font-black uppercase tracking-[.28em] text-[#efb44f]">
                  <span className="h-px w-10 bg-[#efb44f]" />
                  Soluções em aço · São José dos Pinhais
                </p>
                <MotionReveal
                  as="h1"
                  variant="mask"
                  intensity="IMMERSIVE"
                  className="mt-7 text-5xl font-black leading-[.88] tracking-[-.065em] sm:text-7xl lg:text-[5.8rem]"
                >
                  A estrutura certa começa por{" "}
                  <span className="text-[#efb44f]">uma boa conversa.</span>
                </MotionReveal>
                <p className="mt-8 max-w-2xl border-l-2 border-[#efb44f] pl-5 text-base leading-7 text-[#d9e2e8] sm:text-lg">
                  A EN — Estrutura Nacional reúne fabricação e montagem de estruturas metálicas,
                  abrasivos e arames para solda, perfis estruturais e soluções em aço.
                </p>
                <div className="mt-9 flex flex-wrap gap-4">
                  <EnCTA location="hero">Conversar sobre o projeto</EnCTA>
                  <a
                    href="#solucoes"
                    className="inline-flex min-h-12 items-center justify-center gap-2 px-3 py-3 text-sm font-bold text-white transition hover:text-[#efb44f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#efb44f]"
                  >
                    Ver frentes de atuação <ArrowDownRight aria-hidden="true" className="h-4 w-4" />
                  </a>
                </div>
                <div className="mt-12 grid max-w-xl grid-cols-3 gap-3 border-t border-white/15 pt-5 text-xs leading-5 text-white/65">
                  <p>
                    <strong className="block text-sm text-white">Aço</strong>soluções por escopo
                  </p>
                  <p>
                    <strong className="block text-sm text-white">EN</strong>estrutura nacional
                  </p>
                  <p>
                    <strong className="block text-sm text-white">PR</strong>região metropolitana
                  </p>
                </div>
              </div>
              <MotionImageReveal direction="left" className="relative lg:translate-y-8">
                <div className="relative border border-white/20 bg-[#0d2444] p-3 shadow-[20px_20px_0_rgba(239,180,79,.8)] sm:p-4">
                  <PortfolioImage
                    priority
                    managedField="heroImageUrl"
                    src="/images/estrutura-nacional/sede.webp"
                    alt="Fachada da EN Estrutura Nacional em São José dos Pinhais"
                    width={1400}
                    height={1439}
                    className="aspect-[5/4] w-full object-cover object-[center_30%] lg:aspect-[6/5]"
                  />
                  <div className="absolute bottom-6 left-6 max-w-[18rem] border-l-2 border-[#efb44f] bg-[#07172d]/90 px-4 py-3 text-xs leading-5 text-white/80 backdrop-blur-sm">
                    <strong className="block text-[#efb44f]">Base real da empresa</strong>Fotografia
                    fornecida para esta presença digital.
                  </div>
                </div>
              </MotionImageReveal>
            </div>
          </section>
          <section id="solucoes" className="bg-[#edf1f3] px-5 py-16 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-8 border-b border-[#a6b2bd] pb-9 md:grid-cols-[.7fr_1.3fr] md:items-end">
                <p className="text-xs font-black uppercase tracking-[.25em] text-[#345d8a]">
                  01 / Frentes de atuação
                </p>
                <h2 className="max-w-3xl text-4xl font-black leading-[.95] tracking-[-.055em] sm:text-6xl">
                  Aço que acompanha a escala e o contexto de cada demanda.
                </h2>
              </div>
              <div className="divide-y divide-[#a6b2bd]">
                {services.map(([number, title, description, Icon], index) => (
                  <MotionReveal
                    as="article"
                    key={title}
                    variant={index % 2 ? "left" : "right"}
                    delay={index * 70}
                    className="grid gap-4 py-8 md:grid-cols-[92px_1fr_1.18fr_auto] md:items-center"
                  >
                    <span className="font-mono text-sm font-bold text-[#345d8a]">{number}</span>
                    <h3 className="text-2xl font-black tracking-[-.04em]">{title}</h3>
                    <p className="max-w-xl leading-7 text-[#36485b]">{description}</p>
                    <Icon aria-hidden="true" className="h-8 w-8 text-[#b77919]" />
                  </MotionReveal>
                ))}
              </div>
            </div>
          </section>
          <section
            id="estrutura"
            className="relative overflow-hidden bg-[#d8e0e4] px-5 py-16 lg:px-8 lg:py-24"
          >
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 hidden w-[39%] bg-[#efb44f] [clip-path:polygon(33%_0,100%_0,100%_100%,0_100%)] lg:block"
            />
            <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.86fr_1.14fr] lg:items-center">
              <div className="relative border border-[#07172d]/25 bg-[#07172d] p-6 text-white shadow-[14px_14px_0_#efb44f] sm:p-9">
                <p className="text-xs font-black uppercase tracking-[.22em] text-[#efb44f]">
                  Leitura de projeto
                </p>
                <h2 className="mt-5 text-4xl font-black leading-[.94] tracking-[-.05em]">
                  Do material à conversa que organiza o próximo passo.
                </h2>
                <div className="mt-8 space-y-4 border-t border-white/15 pt-6 text-sm leading-6 text-white/75">
                  <p>
                    A marca EN identifica uma operação voltada a estruturas metálicas e soluções em
                    aço.
                  </p>
                  <p>
                    A apresentação reúne somente as áreas indicadas nos materiais e registros
                    públicos da empresa.
                  </p>
                </div>
              </div>
              <div className="max-w-2xl lg:pl-12">
                <p className="flex items-center gap-3 text-xs font-black uppercase tracking-[.25em] text-[#345d8a]">
                  <MapPin aria-hidden="true" className="h-4 w-4" />
                  São José dos Pinhais · PR
                </p>
                <h2 className="mt-5 text-4xl font-black leading-[.96] tracking-[-.05em] sm:text-5xl">
                  Uma página para explicar a necessidade antes de pedir orçamento.
                </h2>
                <p className="mt-6 max-w-xl leading-7 text-[#36485b]">
                  Em vez de um contato genérico, o funil organiza o tipo de solução, o contexto da
                  obra ou indústria e os detalhes que ajudam o atendimento a entender a demanda.
                </p>
                <a
                  href="#processo"
                  className="mt-8 inline-flex min-h-12 items-center gap-2 border-b-2 border-[#07172d] py-2 text-sm font-black transition hover:border-[#b77919] hover:text-[#b77919] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#07172d]"
                >
                  Como funciona <ChevronRight aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>
            </div>
          </section>
          <section id="processo" className="bg-[#f7f9fa] px-5 py-16 lg:px-8 lg:py-24">
            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.84fr_1.16fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[.25em] text-[#345d8a]">
                  02 / Comece com clareza
                </p>
                <h2 className="mt-5 text-4xl font-black leading-[.94] tracking-[-.05em] sm:text-5xl">
                  Uma sequência curta para colocar a demanda em movimento.
                </h2>
              </div>
              <ol className="grid gap-px bg-[#a6b2bd] sm:grid-cols-3">
                {[
                  [
                    "01",
                    "Selecione a solução",
                    "Indique se procura estrutura, material de solda, perfis ou outra frente em aço.",
                  ],
                  [
                    "02",
                    "Contextualize o projeto",
                    "Conte se a necessidade está ligada à indústria, comércio, obra ou outro contexto.",
                  ],
                  [
                    "03",
                    "Envie os detalhes",
                    "O canal seguro organiza a solicitação para o atendimento da EN.",
                  ],
                ].map(([number, title, body]) => (
                  <li key={number} className="bg-[#f7f9fa] p-6">
                    <span className="font-mono text-sm font-bold text-[#b77919]">{number}</span>
                    <h3 className="mt-10 text-xl font-black tracking-[-.035em]">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#4c5c6d]">{body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
          <section
            aria-label="Dúvidas frequentes"
            className="bg-[#edf1f3] px-5 py-16 lg:px-8 lg:py-20"
          >
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.76fr_1.24fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[.25em] text-[#345d8a]">
                  Dúvidas iniciais
                </p>
                <h2 className="mt-5 text-4xl font-black leading-[.95] tracking-[-.05em]">
                  O que ajuda a encaminhar a conversa.
                </h2>
              </div>
              <div className="divide-y divide-[#a6b2bd] border-y border-[#a6b2bd]">
                {[
                  [
                    "Que informações posso enviar?",
                    "O tipo de estrutura ou material, o contexto do projeto, medidas aproximadas quando disponíveis e qualquer detalhe que ajude a explicar a necessidade.",
                  ],
                  [
                    "A página informa preços ou prazos?",
                    "Não. Valores, disponibilidade e cronograma dependem do escopo e são tratados no atendimento.",
                  ],
                  [
                    "Como começo o contato?",
                    "Use o botão de solicitação. O formulário curto organiza as informações e encaminha o próximo passo pelo canal seguro do projeto.",
                  ],
                ].map(([question, answer]) => (
                  <details key={question} className="group py-5">
                    <summary className="cursor-pointer list-none pr-10 text-lg font-black tracking-[-.025em] marker:hidden">
                      <span className="flex items-center justify-between gap-5">
                        {question}
                        <ChevronRight
                          aria-hidden="true"
                          className="h-5 w-5 shrink-0 transition group-open:rotate-90"
                        />
                      </span>
                    </summary>
                    <p className="mt-3 max-w-2xl leading-7 text-[#4c5c6d]">{answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
          <section id="contato" className="bg-[#efb44f] px-5 py-16 text-[#07172d] lg:px-8 lg:py-20">
            <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_.8fr] md:items-end">
              <div>
                <p className="flex items-center gap-3 text-xs font-black uppercase tracking-[.25em]">
                  <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                  Solicitação organizada
                </p>
                <h2 className="mt-5 max-w-3xl text-5xl font-black leading-[.88] tracking-[-.065em] sm:text-7xl">
                  Seu projeto merece um ponto de partida claro.
                </h2>
                <p className="mt-7 max-w-xl text-base leading-7 text-[#273646]">
                  Explique a necessidade. A EN recebe o contexto e o atendimento segue pelo canal
                  privado do projeto.
                </p>
              </div>
              <div className="md:justify-self-end">
                <EnCTA variant="outline" location="final">
                  Iniciar solicitação
                </EnCTA>
              </div>
            </div>
          </section>
        </main>
        <footer className="bg-[#07172d] px-5 py-8 text-sm text-white/70 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <p>EN — Estrutura Nacional · soluções em aço</p>
            <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4 hover:text-[#efb44f]" />
          </div>
        </footer>
        <PortfolioUpsellPopup pageName="portfolio-estrutura-nacional" />
      </MotionScope>
    </div>
  );
}
