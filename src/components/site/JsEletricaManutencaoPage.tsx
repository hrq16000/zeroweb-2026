import {
  ArrowRight,
  CheckCircle2,
  CircuitBoard,
  Fan,
  Gauge,
  MapPin,
  Sun,
  Wrench,
  Zap,
} from "lucide-react";
import { MotionReveal, MotionScope } from "@/components/motion";
import { ManagedText } from "@/components/portfolio/ManagedText";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const quiz = {
  services: [
    "Instalação e manutenção residencial",
    "Instalação comercial ou predial",
    "Manutenção industrial",
    "Padrão Copel e quadros",
    "Sistema solar / fotovoltaico",
    "Ar-condicionado",
    "Motores, bombas e iluminação",
    "Reparo elétrico em geral",
  ],
  experienceOptions: ["Residencial", "Comercial", "Predial / condomínio", "Industrial"],
  periodOptions: ["Curitiba", "Região Metropolitana", "Vou confirmar o endereço"],
  timingOptions: ["Preciso avaliar com urgência", "Nos próximos dias", "Estou planejando"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "Qual solução você precisa?",
    experience: "Em qual tipo de ambiente?",
    period: "Onde será o serviço?",
    timing: "Quando você precisa?",
    note: "Conte os detalhes do atendimento",
  },
  notePlaceholder: "Ex.: equipamento, defeito, quantidade de pontos, foto do quadro ou prazo.",
};

const serviceChannels = [
  {
    id: "C01",
    icon: Zap,
    title: "Instalações e manutenção",
    scope: "Residencial · comercial · predial · industrial",
    text: "Instalação, reparo e manutenção preventiva ou corretiva para diferentes tipos de ambiente.",
  },
  {
    id: "C02",
    icon: CircuitBoard,
    title: "Infraestrutura elétrica",
    scope: "Quadros · circuitos · padrão Copel",
    text: "Organização da infraestrutura e dos pontos críticos que mantêm a instalação funcionando.",
  },
  {
    id: "C03",
    icon: Sun,
    title: "Solar e eficiência",
    scope: "Sistema solar · fotovoltaico",
    text: "Frente técnica para soluções de geração e uso de energia com escopo confirmado no atendimento.",
  },
  {
    id: "C04",
    icon: Fan,
    title: "Climatização e equipamentos",
    scope: "Ar-condicionado · motores · bombas",
    text: "Instalação e manutenção de equipamentos ligados à operação elétrica do ambiente.",
  },
] as const;

const environments = [
  ["R", "Residencial", "Tomadas, iluminação, quadros, circuitos e reparos para a casa."],
  ["C", "Comercial", "Continuidade para lojas, escritórios e pequenos negócios."],
  ["P", "Predial", "Manutenção e organização de sistemas e áreas comuns."],
  ["I", "Industrial", "Motores, bombas, infraestrutura e manutenção da operação."],
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
      clientKey="js-eletrica-manutencao"
      studioName="JS Elétrica e Manutenção"
      recipientName="Joelton"
      theme="navy"
      mode="proposal"
      quizConfig={quiz}
      className={className}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function JsEletricaManutencaoPage() {
  return (
    <MotionScope intensity="BALANCED">
      <div className="min-h-dvh overflow-hidden bg-[#06111a] font-sans text-[#eaf4f8]">
        <header className="border-b border-[#55d6ef]/20 bg-[#06111a] px-5 py-3 lg:px-10">
          <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-5 md:grid-cols-[1fr_auto_1fr]">
            <a href="#inicio" className="flex items-center" aria-label="JS Elétrica e Manutenção">
              <PortfolioImage
                src="/images/js-eletrica-manutencao/js-eletrica-marca.jpeg"
                alt="JS Elétrica e Manutenção"
                width={360}
                height={150}
                className="h-11 w-32 object-contain"
                priority
              />
            </a>

            <nav
              aria-label="Navegação técnica"
              className="hidden items-center gap-1 border border-white/10 bg-[#0a1d2a] p-1 text-[10px] font-black uppercase tracking-[.17em] text-[#9fc0cd] md:flex"
            >
              <a href="#circuitos" className="px-3 py-2 hover:bg-[#11344a] hover:text-white">Circuitos</a>
              <a href="#campo" className="px-3 py-2 hover:bg-[#11344a] hover:text-white">Campo</a>
              <a href="#ambientes" className="px-3 py-2 hover:bg-[#11344a] hover:text-white">Ambientes</a>
            </nav>

            <div className="justify-self-end">
              <CTA className="inline-flex min-h-10 items-center gap-2 border border-[#ffd21d] px-4 py-2.5 text-xs font-black uppercase tracking-[.12em] text-[#ffd21d] transition hover:bg-[#ffd21d] hover:text-[#07131d]">
                Abrir diagnóstico
                <ArrowRight className="h-4 w-4" />
              </CTA>
            </div>
          </div>
        </header>

        <main>
          <section id="inicio" className="relative px-5 py-8 lg:px-10 lg:py-12">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#55d6ef]/50 to-transparent" />
            <div className="mx-auto max-w-7xl">
              <div className="grid border border-white/10 lg:grid-cols-[1fr_18rem]">
                <div className="p-7 sm:p-10 lg:p-14">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-[.18em] text-[#8fb9c9]">
                    <span className="inline-flex items-center gap-2 text-[#55d6ef]">
                      <span className="h-2 w-2 bg-[#55d6ef]" />
                      sistema técnico ativo
                    </span>
                    <span>Curitiba e região</span>
                    <span>residencial → industrial</span>
                  </div>

                  <MotionReveal as="h1" variant="mask" intensity="EXPRESSIVE" className="mt-9 max-w-[11ch] font-display text-5xl font-black uppercase leading-[.88] tracking-[-.05em] sm:text-7xl lg:text-[6.6rem]">
                    <ManagedText field="heroHeadline" fallback="Energia funcionando. Serviço bem feito." />
                  </MotionReveal>

                  <div className="mt-10 grid gap-8 border-t border-white/12 pt-7 lg:grid-cols-[1fr_auto] lg:items-end">
                    <p className="max-w-2xl text-base leading-8 text-[#b9d0da]">
                      <ManagedText
                        field="heroSubheadline"
                        fallback="Atendimento técnico para residências, comércios, condomínios e indústrias: instalação, manutenção, padrão Copel, energia solar, motores, bombas e iluminação."
                      />
                    </p>
                    <CTA className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#ffd21d] px-6 py-3.5 text-sm font-black uppercase tracking-[.08em] text-[#07131d]">
                      Solicitar avaliação
                      <ArrowRight className="h-4 w-4" />
                    </CTA>
                  </div>
                </div>

                <aside className="border-t border-white/10 bg-[#0a1d2a] lg:border-l lg:border-t-0">
                  <div className="border-b border-white/10 p-5">
                    <p className="text-[10px] font-black uppercase tracking-[.16em] text-[#6f96a7]">painel de escopo</p>
                  </div>
                  {[
                    ["01", "Instalação / reparo"],
                    ["02", "Quadros / Copel"],
                    ["03", "Solar / fotovoltaico"],
                    ["04", "Ar / motores / bombas"],
                  ].map(([code, label]) => (
                    <div key={code} className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-white/10 p-5">
                      <span className="font-mono text-xs font-black text-[#ffd21d]">{code}</span>
                      <span className="text-sm font-bold text-[#c9dce4]">{label}</span>
                    </div>
                  ))}
                  <div className="p-5 text-xs leading-6 text-[#789dad]">
                    O escopo final é confirmado depois que você descreve o ambiente e a necessidade.
                  </div>
                </aside>
              </div>

              <MotionReveal variant="up" className="relative mt-4 overflow-hidden border border-white/10">
                <PortfolioImage
                  src="/images/js-eletrica-manutencao/hero.png"
                  alt="Imagem editorial de inspeção de um quadro elétrico"
                  priority
                  width={1680}
                  height={945}
                  managedField="heroImageUrl"
                  className="h-[300px] w-full object-cover sm:h-[410px] lg:h-[520px]"
                />
                <div className="absolute bottom-0 left-0 border-r border-t border-white/15 bg-[#06111a]/95 px-4 py-3 text-[10px] font-black uppercase tracking-[.14em] text-[#8eb6c7]">
                  imagem editorial · identidade técnica JS
                </div>
              </MotionReveal>
            </div>
          </section>

          <section id="circuitos" className="bg-[#edf4f7] px-5 py-20 text-[#07131d] lg:px-10 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-10 lg:grid-cols-[.31fr_.69fr]">
                <div className="lg:sticky lg:top-6 lg:self-start">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[.2em] text-[#0781c8]">Mapa de circuitos</p>
                  <h2 className="mt-4 max-w-[8ch] font-display text-4xl font-black uppercase leading-[.92] sm:text-5xl">
                    Quatro frentes. Um diagnóstico por vez.
                  </h2>
                  <p className="mt-5 max-w-sm text-sm leading-7 text-[#5f747e]">
                    A solicitação é organizada pela frente técnica, pelo ambiente e pelo prazo antes do encaminhamento.
                  </p>
                </div>

                <div className="border-t-2 border-[#07131d]">
                  {serviceChannels.map(({ id, icon: Icon, title, scope, text }) => (
                    <article
                      key={id}
                      className="grid gap-5 border-b border-[#07131d]/15 py-7 md:grid-cols-[4rem_1fr_.72fr] md:items-start"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-black text-[#0781c8]">{id}</span>
                        <Icon className="h-5 w-5 text-[#0781c8] md:hidden" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <Icon className="hidden h-5 w-5 text-[#0781c8] md:block" />
                          <h3 className="font-display text-2xl font-black">{title}</h3>
                        </div>
                        <p className="mt-3 max-w-xl leading-7 text-[#5f747e]">{text}</p>
                      </div>
                      <p className="font-mono text-[10px] font-black uppercase leading-5 tracking-[.12em] text-[#607b88]">
                        {scope}
                      </p>
                    </article>
                  ))}

                  <div className="grid gap-5 bg-[#07131d] p-6 text-white sm:grid-cols-[1fr_auto] sm:items-center">
                    <p className="text-sm leading-6 text-[#b9d0da]">
                      Tem foto do quadro, equipamento ou ponto com defeito? Informe no diagnóstico.
                    </p>
                    <CTA className="inline-flex min-h-11 items-center gap-2 bg-[#ffd21d] px-5 py-3 text-sm font-black text-[#07131d]">
                      Descrever serviço
                      <ArrowRight className="h-4 w-4" />
                    </CTA>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="campo" className="bg-[#0a2536] px-5 py-20 lg:px-10 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-4 lg:grid-cols-[.66fr_.34fr]">
                <figure className="relative m-0 overflow-hidden border border-white/10">
                  <PortfolioImage
                    src="/images/js-eletrica-manutencao/medicao-energia-01.jpeg"
                    alt="Atendimento técnico em medição elétrica"
                    width={960}
                    height={1280}
                    className="h-[520px] w-full object-cover lg:h-[680px]"
                  />
                  <figcaption className="absolute bottom-0 left-0 border-r border-t border-white/10 bg-[#07131d]/95 px-5 py-4 text-xs leading-5 text-[#dbeaf0]">
                    Foto oficial de atendimento técnico da JS Elétrica.
                  </figcaption>
                </figure>

                <div className="flex flex-col justify-between border border-[#55d6ef]/20 bg-[#06111a] p-7 sm:p-9">
                  <div>
                    <p className="font-mono text-[10px] font-black uppercase tracking-[.2em] text-[#55d6ef]">Campo / operação</p>
                    <h2 className="mt-5 font-display text-4xl font-black uppercase leading-[.95]">
                      A conversa técnica vem antes da execução.
                    </h2>
                    <p className="mt-6 leading-8 text-[#a9c4cf]">
                      O atendimento começa entendendo a necessidade para organizar o próximo passo, do orçamento ao pós-serviço.
                    </p>
                  </div>

                  <dl className="mt-10 divide-y divide-white/10 border-y border-white/10">
                    {[
                      ["Entrada", "Ambiente + necessidade"],
                      ["Leitura", "Escopo técnico"],
                      ["Saída", "Próximo passo combinado"],
                    ].map(([term, value]) => (
                      <div key={term} className="grid grid-cols-[5rem_1fr] gap-4 py-5">
                        <dt className="font-mono text-[10px] font-black uppercase tracking-[.12em] text-[#6f96a7]">{term}</dt>
                        <dd className="text-sm font-bold text-[#d6e6ec]">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </section>

          <section id="ambientes" className="bg-white px-5 py-20 text-[#07131d] lg:px-10 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-9 border-b border-[#07131d]/15 pb-9 lg:grid-cols-[1fr_.45fr] lg:items-end">
                <div>
                  <p className="font-mono text-[10px] font-black uppercase tracking-[.2em] text-[#0781c8]">Área de atuação</p>
                  <h2 className="mt-4 max-w-[13ch] font-display text-4xl font-black uppercase leading-[.94] sm:text-5xl">
                    O ambiente muda. A leitura técnica também.
                  </h2>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-[#5f747e]">
                  <MapPin className="h-5 w-5 text-[#0781c8]" />
                  Curitiba e Região Metropolitana
                </div>
              </div>

              <div className="grid border-b border-[#07131d]/15 sm:grid-cols-2 lg:grid-cols-4">
                {environments.map(([code, title, text], index) => (
                  <MotionReveal
                    as="article"
                    variant="up"
                    delay={index * 70}
                    key={code}
                    className="border-r border-t border-[#07131d]/15 p-6 last:border-r-0"
                  >
                    <span className="grid h-10 w-10 place-items-center border border-[#0781c8] font-mono text-sm font-black text-[#0781c8]">
                      {code}
                    </span>
                    <h3 className="mt-8 font-display text-2xl font-black">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#61737d]">{text}</p>
                  </MotionReveal>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[#ffd21d] px-5 py-14 text-[#07131d] lg:px-10 lg:py-16">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="flex items-center gap-3">
                  <Gauge className="h-6 w-6" />
                  <p className="font-mono text-[10px] font-black uppercase tracking-[.2em]">Próximo passo</p>
                </div>
                <h2 className="mt-4 max-w-[14ch] font-display text-4xl font-black uppercase leading-[.94] sm:text-5xl">
                  Descreva o problema. A avaliação começa pela informação certa.
                </h2>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold">
                  <span><CheckCircle2 className="mr-1 inline h-4 w-4" />Tipo de ambiente</span>
                  <span><Wrench className="mr-1 inline h-4 w-4" />Serviço ou defeito</span>
                  <span><Zap className="mr-1 inline h-4 w-4" />Prazo pretendido</span>
                </div>
              </div>
              <CTA className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#07131d] px-6 py-3.5 text-sm font-black uppercase tracking-[.08em] text-white">
                Solicitar orçamento
                <ArrowRight className="h-4 w-4" />
              </CTA>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 bg-[#040a0f] px-5 py-8 text-sm text-[#8eaab7] lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display font-black uppercase text-white">
                JS <span className="text-[#55d6ef]">Elétrica e Manutenção</span>
              </p>
              <p className="mt-1 text-xs">Residencial · Comercial · Predial · Industrial</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs">Guaíra · Curitiba/PR</p>
              <PortfolioHostCredit linkClassName="mt-2 inline-block font-semibold text-white underline underline-offset-4 hover:text-[#ffd21d]" />
            </div>
          </div>
        </footer>

        <PortfolioSocialProofPopup
          clientKey="js-eletrica-manutencao"
          eyebrow="JS Elétrica e Manutenção"
          title="Sua instalação merece uma avaliação clara."
          description="Conte o que precisa instalar, reparar ou modernizar e receba um próximo passo organizado."
          ctaLabel="Abrir diagnóstico"
          ctaHref="#circuitos"
          delayMs={9000}
          className="border-[#ffd21d]/40 bg-[#07131d]/95 text-white"
          accentClassName="text-[#ffd21d]"
        />
        <PortfolioUpsellPopup pageName="portfolio-js-eletrica-manutencao" />
      </div>
    </MotionScope>
  );
}
