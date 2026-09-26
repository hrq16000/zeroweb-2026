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

const diagnosticRows = [
  {
    signal: "SEM ENERGIA",
    title: "Falha, queda ou circuito sem funcionamento",
    scope: "Diagnóstico, reparo e manutenção",
    icon: Zap,
  },
  {
    signal: "QUADRO / COPEL",
    title: "Infraestrutura, padrão, disjuntores e circuitos",
    scope: "Residencial · comercial · predial",
    icon: CircuitBoard,
  },
  {
    signal: "SOLAR",
    title: "Sistema solar e fotovoltaico",
    scope: "Avaliação conforme o escopo informado",
    icon: Sun,
  },
  {
    signal: "EQUIPAMENTOS",
    title: "Ar-condicionado, motores, bombas e iluminação",
    scope: "Instalação e manutenção",
    icon: Fan,
  },
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
    <div className="min-h-dvh overflow-hidden bg-[#061018] text-[#eef8fb]">
      <header className="border-b border-white/10 bg-[#061018] px-5 py-4 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
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

          <CTA className="inline-flex min-h-10 items-center gap-2 border border-[#ffd21d] bg-[#ffd21d] px-4 py-2.5 text-xs font-black uppercase tracking-[.1em] text-[#061018] transition hover:-translate-y-0.5 hover:bg-[#ffe75c]">
            Abrir chamado
            <ArrowRight className="h-4 w-4" />
          </CTA>
        </div>
      </header>

      <main>
        <section id="inicio" className="px-5 py-8 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-4 lg:grid-cols-[1.22fr_.78fr]">
              <figure className="relative m-0 min-h-[650px] overflow-hidden border border-white/10 bg-[#0c2431]">
                <PortfolioImage
                  src="/images/js-eletrica-manutencao/hero.png"
                  alt="Imagem editorial de inspeção de um quadro elétrico"
                  priority
                  width={1680}
                  height={945}
                  managedField="heroImageUrl"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061018]/95 via-[#061018]/35 to-[#061018]/10" />
                <figcaption className="absolute inset-x-0 bottom-0 p-7 sm:p-10 lg:p-12">
                  <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#55d6ef]">
                    atendimento técnico · Curitiba e região
                  </p>
                  <h1 className="mt-4 max-w-[10ch] font-display text-6xl font-black uppercase leading-[.84] tracking-[-.045em] sm:text-7xl lg:text-[7rem]">
                    <ManagedText field="heroHeadline" fallback="Energia funcionando. Serviço bem feito." />
                  </h1>
                </figcaption>
              </figure>

              <aside className="flex min-h-[650px] flex-col justify-between border border-white/10 bg-[#ffd21d] p-7 text-[#07131d] sm:p-10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#5f5313]">
                    triagem do chamado
                  </p>
                  <p className="mt-5 text-lg leading-8 text-[#37434a]">
                    <ManagedText
                      field="heroSubheadline"
                      fallback="Atendimento técnico para residências, comércios, condomínios e indústrias: instalação, manutenção, padrão Copel, energia solar, motores, bombas e iluminação."
                    />
                  </p>
                </div>

                <dl className="my-10 divide-y divide-[#07131d]/20 border-y border-[#07131d]/20">
                  {[
                    ["1", "Sintoma", "o que parou ou precisa instalar"],
                    ["2", "Ambiente", "residencial, comercial, predial ou industrial"],
                    ["3", "Local", "Curitiba ou Região Metropolitana"],
                    ["4", "Prazo", "urgente, próximos dias ou planejamento"],
                  ].map(([n, term, value]) => (
                    <div key={n} className="grid grid-cols-[2rem_5.2rem_1fr] gap-3 py-4 text-sm">
                      <dt className="font-mono text-xs font-black">{n}</dt>
                      <dd className="font-black uppercase tracking-[.08em]">{term}</dd>
                      <dd className="text-[#5f5313]">{value}</dd>
                    </div>
                  ))}
                </dl>

                <CTA className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#07131d] px-6 py-3.5 text-sm font-black uppercase tracking-[.08em] text-white transition hover:-translate-y-0.5 hover:bg-[#123246]">
                  Iniciar diagnóstico
                  <ArrowRight className="h-4 w-4" />
                </CTA>
              </aside>
            </div>
          </div>
        </section>

        <section id="diagnostico" className="bg-[#edf6f8] px-5 py-20 text-[#07131d] lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 border-b-2 border-[#07131d] pb-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#0781c8]">
                  matriz de diagnóstico
                </p>
                <h2 className="mt-4 max-w-[11ch] font-display text-4xl font-black uppercase leading-[.92] sm:text-5xl">
                  Comece pelo sinal que o sistema está dando.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-[#5f747e]">
                O atendimento é organizado pela necessidade real. O escopo final só é definido
                depois da descrição do ambiente e do problema.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#07131d] text-left text-[10px] font-black uppercase tracking-[.15em]">
                    <th className="px-3 py-4">Sinal</th>
                    <th className="px-3 py-4">Leitura inicial</th>
                    <th className="px-3 py-4">Escopo</th>
                    <th className="px-3 py-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnosticRows.map(({ signal, title, scope, icon: Icon }) => (
                    <tr key={signal} className="border-b border-[#07131d]/15">
                      <td className="px-3 py-6">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 place-items-center bg-[#07131d] text-[#ffd21d]">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="font-mono text-xs font-black text-[#0781c8]">{signal}</span>
                        </div>
                      </td>
                      <td className="px-3 py-6 font-display text-xl font-black">{title}</td>
                      <td className="px-3 py-6 text-sm text-[#5f747e]">{scope}</td>
                      <td className="px-3 py-6 text-right">
                        <a href="#chamado" className="font-black underline underline-offset-4">
                          incluir
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="campo" className="px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[.72fr_.28fr]">
            <figure className="relative m-0 overflow-hidden border border-white/10">
              <PortfolioImage
                src="/images/js-eletrica-manutencao/medicao-energia-01.jpeg"
                alt="Atendimento técnico em medição elétrica"
                width={960}
                height={1280}
                className="h-[620px] w-full object-cover lg:h-[760px]"
              />
              <figcaption className="absolute bottom-0 left-0 max-w-sm bg-[#061018]/95 p-5 text-sm leading-6 text-[#dbeaf0]">
                Foto oficial de atendimento técnico da JS Elétrica.
              </figcaption>
            </figure>

            <aside className="flex flex-col justify-between border border-[#55d6ef]/25 bg-[#0a2536] p-7 sm:p-9">
              <div>
                <Gauge className="h-7 w-7 text-[#ffd21d]" />
                <p className="mt-8 text-[10px] font-black uppercase tracking-[.2em] text-[#55d6ef]">
                  prioridade do atendimento
                </p>
                <h2 className="mt-4 font-display text-4xl font-black uppercase leading-[.93]">
                  Informação certa reduz ida no escuro.
                </h2>
                <p className="mt-5 leading-8 text-[#a9c4cf]">
                  Foto do quadro, equipamento, ponto com defeito e contexto do ambiente ajudam a
                  organizar o próximo passo.
                </p>
              </div>

              <div className="mt-10 space-y-4 border-t border-white/10 pt-6 text-sm font-bold text-[#d6e6ec]">
                <p><CheckCircle2 className="mr-2 inline h-4 w-4 text-[#ffd21d]" />Sintoma ou serviço</p>
                <p><CheckCircle2 className="mr-2 inline h-4 w-4 text-[#ffd21d]" />Tipo de ambiente</p>
                <p><CheckCircle2 className="mr-2 inline h-4 w-4 text-[#ffd21d]" />Prazo pretendido</p>
              </div>
            </aside>
          </div>
        </section>

        <section id="ambientes" className="bg-white px-5 py-20 text-[#07131d] lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[.38fr_.62fr]">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#0781c8]">
                  onde a JS atende
                </p>
                <h2 className="mt-4 max-w-[10ch] font-display text-4xl font-black uppercase leading-[.92] sm:text-5xl">
                  A instalação muda conforme o ambiente.
                </h2>
                <p className="mt-5 max-w-sm text-sm leading-7 text-[#5f747e]">
                  Residências, comércios, condomínios e indústrias entram por fluxos diferentes de
                  diagnóstico e execução.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-px bg-[#07131d]/15 border border-[#07131d]/15">
                {[
                  ["R", "Residencial", "Casa e apartamento"],
                  ["C", "Comercial", "Loja e escritório"],
                  ["P", "Predial", "Condomínio e áreas comuns"],
                  ["I", "Industrial", "Motores, bombas e operação"],
                ].map(([code, title, detail]) => (
                  <article key={code} className="bg-[#edf6f8] p-6 sm:p-8">
                    <span className="font-mono text-sm font-black text-[#0781c8]">{code}</span>
                    <h3 className="mt-8 font-display text-2xl font-black">{title}</h3>
                    <p className="mt-2 text-sm text-[#5f747e]">{detail}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 border-t border-[#07131d]/15 pt-6 text-sm font-bold text-[#5f747e]">
              <MapPin className="h-5 w-5 text-[#0781c8]" />
              Curitiba e Região Metropolitana
            </div>
          </div>
        </section>

        <section id="chamado" className="bg-[#ffd21d] px-5 py-14 text-[#07131d] lg:px-8 lg:py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#5f5313]">
                abrir chamado
              </p>
              <h2 className="mt-4 max-w-[14ch] font-display text-4xl font-black uppercase leading-[.94] sm:text-5xl">
                Descreva o problema. A avaliação começa pela informação certa.
              </h2>
              <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold">
                <span><Wrench className="mr-1 inline h-4 w-4" />Serviço ou defeito</span>
                <span><Zap className="mr-1 inline h-4 w-4" />Ambiente</span>
                <span><Gauge className="mr-1 inline h-4 w-4" />Prazo</span>
              </div>
            </div>

            <CTA className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#07131d] px-6 py-3.5 text-sm font-black uppercase tracking-[.08em] text-white transition hover:-translate-y-0.5 hover:bg-[#123246]">
              Solicitar avaliação
              <ArrowRight className="h-4 w-4" />
            </CTA>
          </div>
        </section>
      </main>

      <footer className="bg-[#040a0f] px-5 py-8 text-sm text-[#8eaab7] lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display font-black uppercase text-white">
              JS <span className="text-[#55d6ef]">Elétrica e Manutenção</span>
            </p>
            <p className="mt-1 text-xs">Residencial · Comercial · Predial · Industrial</p>
          </div>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4 hover:text-[#ffd21d]" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="js-eletrica-manutencao"
        eyebrow="JS Elétrica e Manutenção"
        title="Sua instalação merece uma avaliação clara."
        description="Conte o que precisa instalar, reparar ou modernizar e receba um próximo passo organizado."
        ctaLabel="Abrir chamado"
        ctaHref="#chamado"
        delayMs={9000}
        className="border-[#ffd21d]/40 bg-[#07131d]/95 text-white"
        accentClassName="text-[#ffd21d]"
      />
      <PortfolioUpsellPopup pageName="portfolio-js-eletrica-manutencao" />
    </div>
  );
}
