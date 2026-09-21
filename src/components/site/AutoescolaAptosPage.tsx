import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CarFront,
  Check,
  ChevronRight,
  Gauge,
  MapPin,
  Route,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Zap,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { MotionReveal, MotionStagger } from "@/components/motion";
import { PortfolioCompositionRoot } from "@/components/portfolio/composition/PortfolioCompositionRoot";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioCTAQuiz, type PortfolioQuizConfig } from "@/components/site/BeautyBookingQuiz";
import type { PortfolioComposition } from "@/lib/portfolio-composition";

const clientKey = "autoescola-aptos";
const officialAddress = "Rua Passos de Oliveira, 810 · Centro · São José dos Pinhais";

const quizConfig: PortfolioQuizConfig = {
  proposalKind: "service",
  services: [
    "Primeira habilitação",
    "Categoria B · carro automático",
    "Categoria A · moto automática",
    "Categoria AB · carro + moto",
    "Reteste prático",
    "Renovação de CNH",
    "Reciclagem de CNH",
    "Quero orientação para escolher",
  ],
  experienceOptions: [
    "Ainda não comecei meu processo",
    "Já tenho processo aberto",
    "Já fiz aulas e quero continuar",
    "Fui reprovado e quero me preparar para o reteste",
  ],
  periodOptions: ["Manhã", "Tarde", "Noite", "Tenho flexibilidade"],
  timingOptions: [
    "Quero começar agora",
    "Ainda nesta semana",
    "Nas próximas semanas",
    "Estou pesquisando e quero entender as opções",
  ],
  stepTitles: {
    service: "Qual é o seu próximo passo na CNH?",
    experience: "Em que momento do processo você está?",
    period: "Qual período funciona melhor para você?",
    timing: "Quando você pretende começar?",
    note: "Tem algo importante para a equipe saber?",
  },
  stepSubtitles: {
    service: "Carro e moto automáticos entram como opções atuais da APTOS; a disponibilidade é confirmada no atendimento.",
    experience: "Assim a equipe já entende de onde continuar.",
    period: "A agenda é confirmada diretamente com a APTOS.",
    timing: "Isso ajuda a organizar o atendimento sem criar urgência artificial.",
    note: "Você pode contar se prefere veículo automático, se já fez aulas ou se tem alguma dúvida específica.",
  },
  notePlaceholder: "Ex.: quero categoria B com carro automático e ainda não abri meu processo.",
};

function CTA({
  children,
  service,
  className = "",
}: {
  children: ReactNode;
  service?: string;
  className?: string;
}) {
  return (
    <PortfolioCTAQuiz
      clientKey={clientKey}
      studioName="Autoescola APTOS"
      recipientName="Autoescola APTOS"
      theme="steel"
      mode="proposal"
      funnelIntent="orcamento"
      service={service}
      quizConfig={quizConfig}
      ariaLabel="Consultar opções para habilitação na Autoescola APTOS"
      className={
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#ef3340] px-6 py-3.5 text-sm font-black text-white shadow-[0_18px_50px_rgba(239,51,64,.22)] transition hover:-translate-y-0.5 hover:bg-[#ff4d59] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcc00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0d10] " +
        className
      }
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

const composition: PortfolioComposition = {
  slug: clientKey,
  motionIntensity: "BALANCED",
  theme: {
    "--background": "#0b0d10",
    "--foreground": "#f7f8fa",
    "--primary": "#ef3340",
  } as CSSProperties,
  renderCta: () => null,
  brief: {
    businessPersonality: "urbana, direta, confiável e atual; formação de condutores sem linguagem burocrática",
    creativeConcept: "No automático, sem perder o controle — a página usa a linguagem visual de pista e painel para transformar etapas da CNH em um percurso legível.",
    visualMetaphor: "duas faixas de uma mesma pista: carro automático e moto automática convergem para a habilitação",
    spatialLanguage: "faixas diagonais, blocos longitudinais e painéis de decisão; nenhuma grade SaaS repetitiva",
    heroConcept: "painel noturno de direção com grande chamada editorial, faixa amarela de orientação e composição vetorial exclusiva de carro + moto",
    navigationConcept: "header compacto como sinalização de rota e navegação por âncoras curtas",
    contentRhythm: "impacto → escolha automático em 4/2 rodas → caminhos de CNH → processo → confiança → local → dúvidas → ação",
    mediaNarrative: "arte de marca vetorial e sinalização visual; nenhuma foto genérica fingindo ser frota, aluno ou sede",
    proofNarrative: "somente fatos públicos da APTOS: mais de 15 anos, credenciamento DETRAN-PR, proximidade do DETRAN e curso online; sem depoimentos fabricados",
    conversionNarrative: "a pessoa escolhe o objetivo primeiro e abre o mesmo funil isolado da APTOS com contexto pré-selecionado",
    motionNarrative: "elementos entram como sinalização encontrada no percurso; reveals curtos e stagger só onde explica sequência",
    signatureMoments: [
      "hero com faixa viária diagonal atravessando a composição sem ocupar o conteúdo",
      "dupla decisão carro/moto em painéis opostos que convergem para o mesmo funil",
      "linha de sete etapas tratada como percurso, não como cards iguais",
    ],
    compositionFingerprint: {
      heroGeometry: "dashboard-asymmetric 7/5 com faixa diagonal de pista e veículo vetorial em plano inferior",
      headerTreatment: "barra curta de sinalização, wordmark à esquerda e CTA cápsula à direita",
      sectionGraph: "dashboardHero→automaticDualLane→licenseChooser→roadmapSeven→trustStrip→locationPlate→faqLane→finishLine",
      contentOrder: [
        "promessa carro e moto automáticos",
        "diferença entre as duas opções",
        "serviços e momentos da CNH",
        "sete passos do processo",
        "confiança operacional",
        "endereço e proximidade",
        "dúvidas de decisão",
        "consulta pelo funil",
      ],
      gridTopology: "hero 7/5; painel automático 5/7 invertido; seletor em trilho horizontal; roadmap vertical numerado",
      mediaDistribution: "hero vetorial dominante + ícones lineares + zero galeria decorativa",
      backgroundRhythm: "asfalto preto→branco gelo→asfalto→cinza claro→vermelho profundo→asfalto",
      proofPlacement: "faixa factual após o processo, antes do endereço",
      ctaDistribution: "hero, dois painéis de veículo, seletor de jornada e linha final",
      navigationPattern: "âncoras de rota curtas no header; leitura principal contínua",
      motionSignature: "reveals direcionais curtos + stagger de percurso; sem parallax ou loop",
      closingStructure: "finish-line vermelho com pergunta única e CTA claro para consultar a melhor opção",
    },
  },
};

const journeys = [
  {
    title: "Primeira habilitação",
    text: "Para quem vai começar o processo e quer orientação desde a primeira etapa.",
    service: "Primeira habilitação",
  },
  {
    title: "Categoria B",
    text: "Formação para carro, agora com opção de carro automático informada pela APTOS.",
    service: "Categoria B · carro automático",
  },
  {
    title: "Categoria A",
    text: "Formação para moto, agora com opção de moto automática informada pela APTOS.",
    service: "Categoria A · moto automática",
  },
  {
    title: "Categoria AB",
    text: "Para quem quer organizar carro e moto dentro da mesma jornada de habilitação.",
    service: "Categoria AB · carro + moto",
  },
  {
    title: "Reteste prático",
    text: "Treino direcionado para quem já passou pela prova e precisa se preparar novamente.",
    service: "Reteste prático",
  },
  {
    title: "Reciclagem e renovação",
    text: "Orientação para regularização da CNH; a APTOS também divulga reciclagem em modalidade online.",
    service: "Reciclagem de CNH",
  },
];

const steps = [
  ["01", "Matrícula", "Entenda documentos, categoria e formato que fazem sentido para o seu momento."],
  ["02", "Foto e biometria", "Etapa cadastral vinculada ao processo de habilitação."],
  ["03", "Exames", "Avaliações médico e psicotécnica conforme as regras vigentes."],
  ["04", "Teoria", "A APTOS divulga opção de curso teórico online."],
  ["05", "Prática", "Aulas para desenvolver domínio, leitura de trânsito e adaptação ao veículo."],
  ["06", "Prova", "Preparação para a etapa prática conforme seu processo e regras atuais."],
  ["07", "CNH", "Conclusão da jornada depois das etapas e aprovações exigidas."],
];

const faqs = [
  {
    q: "A APTOS agora tem carro automático?",
    a: "Sim. Esta página foi atualizada a pedido do responsável para destacar a disponibilidade de carro automático. Horários, veículo e condições são confirmados diretamente no atendimento.",
  },
  {
    q: "Também há moto automática?",
    a: "Sim. A atualização informada pelo responsável inclui moto automática. Consulte disponibilidade e como essa opção se aplica ao seu processo de categoria A.",
  },
  {
    q: "Fazer aulas em veículo automático muda minha CNH ou a prova?",
    a: "As regras de habilitação podem ser atualizadas pelo CONTRAN e pelo DETRAN-PR. A página não presume uma regra para todos os processos: a equipe da APTOS orienta seu caso conforme a regulamentação vigente.",
  },
  {
    q: "A APTOS faz primeira habilitação e categoria AB?",
    a: "Sim. O site oficial divulga primeira habilitação e serviços para categorias A, B e AB, além de outros atendimentos ligados à CNH.",
  },
  {
    q: "Tem reciclagem online?",
    a: "A APTOS divulga curso de reciclagem em modalidade online. A elegibilidade e as etapas do seu caso são confirmadas no atendimento.",
  },
  {
    q: "Onde fica a Autoescola APTOS?",
    a: "Na Rua Passos de Oliveira, 810, no Centro de São José dos Pinhais, em localização divulgada pela empresa como próxima ao DETRAN.",
  },
];

export function AutoescolaAptosPage() {
  return (
    <PortfolioCompositionRoot composition={composition}>
      <div className="min-h-dvh overflow-hidden bg-[#0b0d10] text-[#f7f8fa]">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0d10]/92 px-5 py-3 backdrop-blur-xl lg:px-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <a href="#inicio" className="flex min-w-0 items-center gap-3" aria-label="Autoescola APTOS">
              <PortfolioImage
                src="/images/autoescola-aptos/logo.svg"
                alt="Autoescola APTOS"
                width={220}
                height={72}
                className="h-10 w-auto max-w-[145px]"
              />
              <span className="hidden text-xs font-bold uppercase tracking-[.18em] text-white/45 sm:block">
                São José dos Pinhais
              </span>
            </a>
            <nav className="hidden items-center gap-6 text-sm font-bold text-white/65 lg:flex">
              <a href="#automaticos" className="transition hover:text-white">Automáticos</a>
              <a href="#caminhos" className="transition hover:text-white">Sua CNH</a>
              <a href="#processo" className="transition hover:text-white">Como funciona</a>
              <a href="#local" className="transition hover:text-white">Local</a>
            </nav>
            <CTA className="px-4 sm:px-6">
              <span className="hidden sm:inline">Consultar minha opção</span>
              <span className="sm:hidden">Começar</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </CTA>
          </div>
        </header>

        <main>
          <section id="inicio" className="relative isolate px-5 pb-14 pt-12 lg:px-10 lg:pb-24 lg:pt-20">
            <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_82%_20%,rgba(239,51,64,.18),transparent_30%),radial-gradient(circle_at_18%_90%,rgba(255,204,0,.09),transparent_26%)]" />
            <div className="pointer-events-none absolute -right-20 top-44 -z-10 h-8 w-[60%] -rotate-12 bg-[#ffcc00]/80 shadow-[0_0_60px_rgba(255,204,0,.16)] lg:top-56" />
            <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-black uppercase tracking-[.2em] text-[#ffcc00]">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Centro · São José dos Pinhais
                </div>
                <MotionReveal as="h1" variant="up" className="mt-6 max-w-4xl text-5xl font-black leading-[.9] tracking-[-.055em] sm:text-7xl lg:text-[5.8rem]">
                  Sua CNH pode começar <span className="text-[#ef3340]">no automático.</span>
                </MotionReveal>
                <p className="mt-6 max-w-2xl text-xl font-semibold leading-8 text-white/82 sm:text-2xl">
                  A Autoescola APTOS agora destaca opções de <strong className="text-white">carro automático</strong> e <strong className="text-white">moto automática</strong> para quem busca praticidade na aprendizagem.
                </p>
                <p className="mt-4 max-w-xl leading-7 text-white/58">
                  Primeira habilitação, categorias A, B e AB, reteste, renovação e reciclagem — com orientação para você entender o próximo passo sem adivinhar o processo.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <CTA>
                    Ver opções para minha CNH <ArrowRight className="h-4 w-4" />
                  </CTA>
                  <a href="#automaticos" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">
                    Carro + moto automáticos <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
                <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-white/62">
                  <span><BadgeCheck className="mr-1.5 inline h-4 w-4 text-[#ffcc00]" />Credenciada DETRAN-PR</span>
                  <span><Route className="mr-1.5 inline h-4 w-4 text-[#ffcc00]" />Próxima ao DETRAN</span>
                  <span><BookOpen className="mr-1.5 inline h-4 w-4 text-[#ffcc00]" />Curso online divulgado</span>
                </div>
              </div>
              <MotionReveal variant="scale" className="relative mx-auto w-full max-w-2xl">
                <div className="absolute -inset-5 rounded-[3rem] bg-[#ef3340]/15 blur-3xl" />
                <PortfolioImage
                  src="/images/autoescola-aptos/hero.svg"
                  alt="Composição editorial da Autoescola APTOS com carro e moto automáticos em uma pista estilizada"
                  width={1600}
                  height={1200}
                  priority
                  className="relative w-full rounded-[2.2rem] border border-white/10 bg-[#11151b] shadow-2xl shadow-black/40"
                />
                <div className="absolute -bottom-5 left-5 right-5 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-[#11151b]/95 p-3 shadow-2xl backdrop-blur sm:left-10 sm:right-10">
                  <div className="rounded-xl bg-white/5 px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[.18em] text-white/40">4 rodas</p>
                    <p className="mt-1 font-black">Carro automático</p>
                  </div>
                  <div className="rounded-xl bg-[#ef3340] px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[.18em] text-white/70">2 rodas</p>
                    <p className="mt-1 font-black">Moto automática</p>
                  </div>
                </div>
              </MotionReveal>
            </div>
          </section>

          <section id="automaticos" className="bg-[#f2f3f5] px-5 py-20 text-[#101318] lg:px-10 lg:py-28">
            <div className="mx-auto max-w-7xl">
              <div className="max-w-3xl">
                <p className="text-xs font-black uppercase tracking-[.25em] text-[#ef3340]">Novo destaque APTOS</p>
                <h2 className="mt-4 text-4xl font-black leading-[.95] tracking-[-.04em] sm:text-6xl">
                  Duas formas de reduzir a complexidade de operar o veículo enquanto você aprende.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-[#50545c]">
                  Veículo automático não elimina a responsabilidade de observar, decidir e conduzir com segurança. Ele muda a operação do veículo — e pode ser a opção que combina melhor com o seu momento.
                </p>
              </div>

              <div className="mt-12 grid gap-5 lg:grid-cols-[.92fr_1.08fr]">
                <MotionReveal variant="up" className="group relative overflow-hidden rounded-[2rem] bg-[#11151b] p-7 text-white sm:p-9">
                  <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full border-[38px] border-white/5" />
                  <CarFront className="h-12 w-12 text-[#ffcc00]" aria-hidden="true" />
                  <p className="mt-10 text-xs font-black uppercase tracking-[.24em] text-[#ffcc00]">Categoria B</p>
                  <h3 className="mt-3 text-4xl font-black tracking-[-.04em]">Carro automático</h3>
                  <p className="mt-4 max-w-md leading-7 text-white/65">
                    Opção atual informada pela APTOS para quem quer consultar uma experiência de aprendizagem com transmissão automática.
                  </p>
                  <div className="mt-8">
                    <CTA service="Categoria B · carro automático" className="bg-white text-[#11151b] shadow-none hover:bg-[#ffcc00]">
                      Quero carro automático <ArrowRight className="h-4 w-4" />
                    </CTA>
                  </div>
                </MotionReveal>

                <MotionReveal variant="up" className="group relative overflow-hidden rounded-[2rem] bg-[#ef3340] p-7 text-white sm:p-9">
                  <div className="absolute right-0 top-0 h-full w-2/5 skew-x-[-12deg] bg-black/10" />
                  <Gauge className="relative h-12 w-12 text-white" aria-hidden="true" />
                  <p className="relative mt-10 text-xs font-black uppercase tracking-[.24em] text-white/70">Categoria A</p>
                  <h3 className="relative mt-3 text-4xl font-black tracking-[-.04em]">Moto automática</h3>
                  <p className="relative mt-4 max-w-lg leading-7 text-white/78">
                    APTOS também informa a nova opção de moto automática. A equipe confirma disponibilidade, agenda e como ela se encaixa no seu processo.
                  </p>
                  <div className="relative mt-8">
                    <CTA service="Categoria A · moto automática" className="bg-[#11151b] shadow-none hover:bg-[#242b34]">
                      Quero moto automática <ArrowRight className="h-4 w-4" />
                    </CTA>
                  </div>
                </MotionReveal>
              </div>
              <p className="mt-5 text-sm leading-6 text-[#727780]">
                Informação de carro e moto automáticos fornecida pelo responsável em 21/09/2026. Regras, disponibilidade e aplicação ao exame são confirmadas conforme o processo e a regulamentação vigente.
              </p>
            </div>
          </section>

          <section id="caminhos" className="px-5 py-20 lg:px-10 lg:py-28">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.24em] text-[#ffcc00]">Escolha seu caminho</p>
                  <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-.04em] sm:text-6xl">Você não precisa chegar sabendo qual pacote pedir.</h2>
                </div>
                <p className="max-w-md text-lg leading-8 text-white/55">Escolha o momento em que você está. O funil leva essa informação para a equipe e organiza o próximo passo.</p>
              </div>
              <MotionStagger variant="up" step={70} className="mt-12 grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
                {journeys.map((item, index) => (
                  <article key={item.title} className="group bg-[#0f1217] p-6 transition hover:bg-[#161b22] sm:p-7">
                    <span className="text-xs font-black tracking-[.2em] text-[#ef3340]">0{index + 1}</span>
                    <h3 className="mt-7 text-2xl font-black">{item.title}</h3>
                    <p className="mt-3 min-h-20 leading-7 text-white/55">{item.text}</p>
                    <CTA service={item.service} className="mt-5 min-h-10 bg-transparent px-0 py-2 text-[#ffcc00] shadow-none hover:translate-x-1 hover:bg-transparent">
                      Selecionar <ArrowRight className="h-4 w-4" />
                    </CTA>
                  </article>
                ))}
              </MotionStagger>
            </div>
          </section>

          <section id="processo" className="bg-white px-5 py-20 text-[#11151b] lg:px-10 lg:py-28">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.38fr_.62fr]">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <p className="text-xs font-black uppercase tracking-[.24em] text-[#ef3340]">Como funciona</p>
                <h2 className="mt-4 text-4xl font-black leading-[.95] tracking-[-.04em] sm:text-5xl">A jornada fica mais simples quando você enxerga a rota.</h2>
                <p className="mt-5 leading-7 text-[#60656e]">A APTOS apresenta o processo em etapas. A ordem e exigências finais dependem das regras vigentes e do seu caso.</p>
              </div>
              <div className="relative">
                <div className="absolute bottom-0 left-[1.45rem] top-0 w-px bg-[#d8dbe0]" aria-hidden="true" />
                <MotionStagger variant="up" step={70} className="space-y-4">
                  {steps.map(([num, title, text]) => (
                    <article key={num} className="relative grid grid-cols-[3rem_1fr] gap-5 rounded-2xl border border-[#e3e5e8] bg-[#f7f8f9] p-5 sm:p-6">
                      <div className="relative z-10 grid h-12 w-12 place-items-center rounded-full bg-[#11151b] text-sm font-black text-[#ffcc00]">{num}</div>
                      <div>
                        <h3 className="text-xl font-black">{title}</h3>
                        <p className="mt-2 leading-7 text-[#626770]">{text}</p>
                      </div>
                    </article>
                  ))}
                </MotionStagger>
              </div>
            </div>
          </section>

          <section className="bg-[#ef3340] px-5 py-10 text-white lg:px-10">
            <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["+15 anos", "experiência informada no site oficial"],
                ["DETRAN-PR", "credenciamento divulgado pela APTOS"],
                ["Centro", "endereço próximo ao DETRAN"],
                ["Online", "curso teórico/reciclagem divulgados"],
              ].map(([value, label]) => (
                <div key={value} className="border-l border-white/30 pl-5">
                  <p className="text-3xl font-black tracking-[-.04em]">{value}</p>
                  <p className="mt-1 text-sm leading-5 text-white/72">{label}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="local" className="bg-[#eef0f2] px-5 py-20 text-[#11151b] lg:px-10 lg:py-24">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_.85fr]">
              <div className="relative overflow-hidden rounded-[2rem] bg-[#11151b] p-8 text-white sm:p-10">
                <div className="absolute bottom-0 right-0 h-2/3 w-1/2 -skew-x-12 bg-[#ffcc00]/10" />
                <MapPin className="relative h-10 w-10 text-[#ffcc00]" />
                <p className="relative mt-8 text-xs font-black uppercase tracking-[.22em] text-[#ffcc00]">Autoescola APTOS · Centro</p>
                <h2 className="relative mt-3 max-w-2xl text-4xl font-black tracking-[-.04em] sm:text-5xl">{officialAddress}</h2>
                <p className="relative mt-5 max-w-xl leading-7 text-white/62">Endereço publicado pela própria APTOS. A empresa destaca a proximidade do DETRAN como parte da experiência local.</p>
              </div>
              <div className="rounded-[2rem] border border-[#d9dce0] bg-white p-7 sm:p-9">
                <ShieldCheck className="h-10 w-10 text-[#ef3340]" />
                <h3 className="mt-7 text-3xl font-black tracking-[-.03em]">Converse já com contexto.</h3>
                <p className="mt-4 leading-7 text-[#626770]">Em vez de mandar uma mensagem solta, escolha categoria, etapa e período. O pedido chega organizado para a APTOS.</p>
                <div className="mt-7">
                  <CTA>Organizar meu atendimento <ArrowRight className="h-4 w-4" /></CTA>
                </div>
              </div>
            </div>
          </section>

          <section className="px-5 py-20 lg:px-10 lg:py-24">
            <div className="mx-auto max-w-5xl">
              <div className="text-center">
                <p className="text-xs font-black uppercase tracking-[.24em] text-[#ffcc00]">Antes de começar</p>
                <h2 className="mt-4 text-4xl font-black tracking-[-.04em] sm:text-5xl">Dúvidas que mudam a decisão.</h2>
              </div>
              <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
                {faqs.map((faq) => (
                  <details key={faq.q} className="group py-2">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-left text-lg font-black marker:hidden">
                      {faq.q}
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/15 text-[#ffcc00] transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="max-w-3xl pb-6 pr-12 leading-7 text-white/58">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section id="comecar" className="px-5 pb-20 pt-5 lg:px-10 lg:pb-28">
            <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#ef3340] px-7 py-14 text-white sm:px-12 lg:px-16 lg:py-20">
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[45px] border-white/8" />
              <Zap className="relative h-10 w-10 text-[#ffcc00]" />
              <h2 className="relative mt-6 max-w-4xl text-5xl font-black leading-[.92] tracking-[-.05em] sm:text-6xl">Carro ou moto? Manual ou automático? Comece pela decisão que é sua.</h2>
              <p className="relative mt-5 max-w-2xl text-lg leading-8 text-white/75">Conte o que você procura e receba a orientação da APTOS para o seu processo, sem expor telefone na página e sem cair em um atendimento genérico.</p>
              <div className="relative mt-8">
                <CTA className="bg-[#11151b] shadow-none hover:bg-[#242b34]">
                  Quero consultar minha opção <ArrowRight className="h-4 w-4" />
                </CTA>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 bg-[#080a0d] px-5 py-8 text-sm text-white/50 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <p>
              <strong className="text-white">Autoescola APTOS</strong><br />
              São José dos Pinhais · Paraná
            </p>
            <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4" />
          </div>
        </footer>

        <PortfolioSocialProofPopup
          clientKey={clientKey}
          eyebrow="Novidade APTOS"
          title="Carro ou moto automática?"
          description="Escolha o que você procura e deixe a equipe orientar o próximo passo da sua CNH."
          ctaLabel="Consultar opções"
          ctaHref="#comecar"
          delayMs={9000}
          className="border-[#ef3340]/35 bg-[#11151b]/96 text-white"
          accentClassName="text-[#ffcc00]"
        />
      </div>
    </PortfolioCompositionRoot>
  );
}
