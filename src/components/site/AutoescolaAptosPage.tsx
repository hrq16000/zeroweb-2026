import { ArrowDown, ArrowRight, BookOpen, CarFront, Check, Clock3, MapPin, ShieldCheck } from "lucide-react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { MotionImageReveal, MotionReveal, MotionStagger, MotionTextReveal } from "@/components/motion";
import { PortfolioCompositionRoot } from "@/components/portfolio/composition/PortfolioCompositionRoot";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import type { CtaRenderOptions } from "@/lib/portfolio-blueprint";
import type { PortfolioComposition } from "@/lib/portfolio-composition";
import "./autoescola-aptos.css";

/**
 * Composição autoral da Autoescola APTOS.
 * Fotos, identidade e fatos vêm do site oficial; contato segue exclusivamente
 * pelo funil isolado `funnel-autoescola-aptos`.
 */
export const composition: PortfolioComposition = {
  slug: "autoescola-aptos",
  motionIntensity: "BALANCED",
  renderCta: ({ children, className, placement }: CtaRenderOptions) => (
    <FunnelCTAButton
      clientKey="autoescola-aptos"
      companySlug="autoescola-aptos"
      formSlug="funnel-autoescola-aptos"
      location={`autoescola-aptos_${placement}`}
      className={className}
    >
      {children}
    </FunnelCTAButton>
  ),
  brief: {
    businessPersonality: "Confiante, direta, acolhedora e atual, com linguagem de decisão sem pressão.",
    creativeConcept: "Escolha sua faixa: a jornada até a CNH se adapta ao objetivo e à forma de dirigir de cada aluno.",
    visualMetaphor: "Duas faixas de pista que partem de escolhas diferentes e convergem no próximo passo.",
    spatialLanguage: "Faixas largas, cortes angulares e marcos de rota em uma composição editorial assimétrica.",
    heroConcept: "Título monumental e faixa de novidade atravessam uma fotografia documental do carro APTOS.",
    navigationConcept: "Barra compacta de decisões que leva a opções, processo, estrutura e dúvidas.",
    contentRhythm: "Impacto visual, escolha rápida, prova oficial, percurso, contexto local e fechamento decisório.",
    mediaNarrative: "Frota e fachada oficiais estabelecem realidade; imagens contextuais apoiam curso e conquista sem fingir prova.",
    proofNarrative: "Números aparecem como dados divulgados pela própria APTOS, próximos à evidência física da marca.",
    conversionNarrative: "CTAs recorrentes abrem o mesmo funil e preservam objetivo, estágio, período e prazo desejado.",
    motionNarrative: "A rota avança por máscaras e progressão lateral curta; sem movimento, todo conteúdo permanece visível.",
    signatureMoments: [
      "Faixa amarela de novidade atravessa o hero como sinalização de pista.",
      "Escolhas de habilitação formam um painel de rotas, não uma grade comercial genérica.",
      "Duas faixas visuais convergem no painel final de agendamento.",
    ],
    compositionFingerprint: {
      heroGeometry: "offset road-stage with diagonal documentary vehicle frame and crossing novelty band",
      headerTreatment: "compact floating decision bar over paper field",
      sectionGraph: "road-stage→choice-board→proof-crossing→route-sequence→local-document→converging-decision→faq",
      contentOrder: ["promessa", "modalidade", "credibilidade", "percurso", "local", "decisão", "dúvidas"],
      gridTopology: "asymmetric 7/5 stage, route board with one dominant automatic lane, alternating numbered spine",
      mediaDistribution: "official vehicle hero, official facade proof, contextual online-course inset, no generic gallery",
      backgroundRhythm: "warm paper interrupted by one red proof crossing and one asphalt decision field",
      proofPlacement: "published facts embedded into red crossing beside official facade evidence",
      ctaDistribution: "hero decision, route checkpoint, persistent shell action and converging final panel",
      navigationPattern: "four-stop local route navigation",
      motionSignature: "moving route line, masked vehicle reveal and alternating route checkpoints",
      closingStructure: "two-lane decision panel converging into one funnel followed by factual native FAQ",
    },
  },
};

const choices = [
  ["1ª habilitação", "Comece sua jornada nas categorias A, B ou AB."],
  ["B automático", "Aprenda no carro automático divulgado pela APTOS."],
  ["A automática", "A novidade para quem busca praticidade também na moto."],
  ["B manual", "Formação prática tradicional na categoria B."],
  ["Reteste", "Retome o processo com preparação para a nova tentativa."],
  ["Renovação e reciclagem", "Organize a regularização conforme o seu momento."],
] as const;

const routeSteps = [
  ["01", "Escolha seu objetivo", "Conte se busca primeira habilitação, categoria, reteste, renovação ou reciclagem."],
  ["02", "Mostre seu momento", "Informe em que estágio está e qual período funciona melhor para sua rotina."],
  ["03", "Receba o próximo passo", "A equipe APTOS continua o atendimento pelo canal oficial do próprio negócio."],
] as const;

const faqs = [
  ["A APTOS oferece aulas em carro automático?", "Sim. A opção de carro automático é divulgada oficialmente pela APTOS e também é o destaque desta página."],
  ["Também existe opção de moto automática?", "Sim. A disponibilidade de moto automática foi informada pelo responsável como novidade principal desta presença."],
  ["Quais processos posso solicitar?", "Primeira habilitação nas categorias A, B e AB, reteste, renovação e reciclagem."],
  ["O curso teórico pode ser feito online?", "A APTOS divulga curso online. A equipe confirma no atendimento como ele se aplica ao seu processo."],
  ["Onde fica a Autoescola APTOS?", "Na Rua Passos de Oliveira, 810, Centro, em São José dos Pinhais, próximo ao DETRAN."],
] as const;

export function AutoescolaAptosPage() {
  return (
    <PortfolioCompositionRoot composition={composition}>
      <main className="aptos-site pb-24 md:pb-0">
        <header className="aptos-nav fixed inset-x-3 top-3 z-40 mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-md border px-4 py-3 md:inset-x-6 md:px-6">
          <a href="#inicio" aria-label="Autoescola APTOS — início" className="shrink-0">
            <img src="/images/autoescola-aptos/logo.webp" width="150" height="50" alt="Autoescola APTOS" className="h-8 w-auto md:h-10" decoding="async" />
          </a>
          <nav aria-label="Navegação da Autoescola APTOS" className="hidden items-center gap-6 text-sm font-semibold md:flex">
            <a href="#escolhas">Escolhas</a><a href="#processo">Como começar</a><a href="#estrutura">Local</a><a href="#duvidas">Dúvidas</a>
          </nav>
          {composition.renderCta({ children: "Montar proposta", placement: "header", className: "aptos-cta inline-flex min-h-11 items-center gap-2 rounded-md px-4 py-2 text-sm font-bold" })}
        </header>

        <section id="inicio" className="aptos-hero relative flex items-center pt-28 md:pt-32">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 py-12 md:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] md:px-8 md:py-16 lg:gap-20">
            <MotionReveal variant="left" className="relative z-10">
              <p className="mb-5 inline-flex items-center gap-2 text-sm font-bold uppercase text-muted-foreground"><MapPin className="h-4 w-4" /> São José dos Pinhais</p>
              <h1 className="aptos-display max-w-[12ch] text-5xl leading-[0.96] sm:text-6xl md:text-7xl lg:text-8xl">
                <MotionTextReveal text="Sua CNH, do seu jeito." />
              </h1>
              <div className="aptos-yellow-band -ml-5 mt-7 w-[calc(100%+2.5rem)] rotate-[-1deg] px-5 py-4 sm:w-fit sm:pr-10">
                <p className="aptos-display text-xl leading-tight sm:text-2xl">agora com carro automático e moto automática</p>
              </div>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">Primeira habilitação, categorias A, B e AB, reteste, renovação e reciclagem — com curso online e atendimento próximo ao DETRAN.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                {composition.renderCta({ children: <>Escolher meu caminho <ArrowRight className="h-4 w-4" /></>, placement: "hero", className: "aptos-cta inline-flex min-h-12 items-center gap-2 rounded-md px-6 py-3 font-bold" })}
                <a href="#escolhas" className="aptos-ghost-cta inline-flex min-h-12 items-center gap-2 rounded-md border-2 px-6 py-3 font-bold">Ver opções <ArrowDown className="h-4 w-4" /></a>
              </div>
            </MotionReveal>
            <MotionImageReveal direction="left" className="aptos-photo-frame aspect-[4/3] md:aspect-[5/6] lg:aspect-[4/3]">
              <img src="/images/autoescola-aptos/carro-aptos.webp" alt="Carro oficial da Autoescola APTOS em São José dos Pinhais" className="h-full w-full object-cover" width="1600" height="900" loading="eager" decoding="async" fetchPriority="high" />
            </MotionImageReveal>
          </div>
        </section>

        <div className="aptos-route-line" aria-hidden="true" />

        <section id="escolhas" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
            <MotionReveal className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-sm font-bold uppercase text-primary">Escolha sem encaixar sua vida num molde</p>
              <h2 className="aptos-display mt-4 text-4xl leading-tight sm:text-5xl">Qual é o seu próximo movimento?</h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">O funil começa pelo seu objetivo. A equipe confirma a modalidade e organiza uma proposta para o seu estágio atual.</p>
            </MotionReveal>
            <MotionStagger className="grid gap-px border border-border bg-border sm:grid-cols-2" variant="up">
              {choices.map(([title, body], index) => (
                <article key={title} className={`aptos-choice min-h-48 bg-background p-6 ${index === 1 || index === 2 ? "sm:min-h-60" : ""}`}>
                  <span className="aptos-display text-sm text-primary">0{index + 1}</span>
                  <h3 className="aptos-display mt-8 text-2xl">{title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{body}</p>
                </article>
              ))}
            </MotionStagger>
          </div>
        </section>

        <section className="aptos-red-band">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-20">
            <MotionImageReveal className="aspect-[16/10] overflow-hidden rounded-md">
              <img src="/images/autoescola-aptos/fachada.webp" alt="Fachada oficial da Autoescola APTOS" className="h-full w-full object-cover" width="1600" height="900" loading="lazy" decoding="async" />
            </MotionImageReveal>
            <MotionReveal variant="right" className="flex flex-col justify-center">
              <p className="text-sm font-bold uppercase">Dados divulgados pela APTOS</p>
              <div className="mt-8 grid grid-cols-3 gap-3 border-y border-primary-foreground/30 py-7">
                <div><strong className="aptos-display block text-3xl md:text-4xl">+15</strong><span className="text-sm">anos</span></div>
                <div><strong className="aptos-display block text-3xl md:text-4xl">+5 mil</strong><span className="text-sm">alunos</span></div>
                <div><strong className="aptos-display block text-3xl md:text-4xl">4,9</strong><span className="text-sm">no Google</span></div>
              </div>
              <p className="mt-6 max-w-lg leading-relaxed text-primary-foreground/85">Esses números são apresentados no site oficial da Autoescola APTOS. Não representam auditoria independente da 0WEB.</p>
            </MotionReveal>
          </div>
        </section>

        <section id="processo" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <div className="flex flex-col gap-5 border-b border-border pb-10 md:flex-row md:items-end md:justify-between">
            <div><p className="text-sm font-bold uppercase text-primary">Do interesse ao atendimento</p><h2 className="aptos-display mt-3 max-w-2xl text-4xl sm:text-5xl">Uma rota curta para começar com clareza.</h2></div>
            <p className="max-w-md leading-relaxed text-muted-foreground">Sem preço inventado e sem promessa de prazo: você fornece contexto e a APTOS confirma o próximo passo.</p>
          </div>
          <MotionStagger className="mt-10 grid gap-8 md:grid-cols-3" variant="up">
            {routeSteps.map(([number, title, body]) => (
              <article key={number} className="relative border-t-2 border-foreground pt-8">
                <span className="aptos-step-marker aptos-display absolute -top-5 left-0 grid h-10 w-10 place-items-center rounded-full text-sm">{number}</span>
                <h3 className="aptos-display text-2xl">{title}</h3><p className="mt-4 leading-relaxed text-muted-foreground">{body}</p>
              </article>
            ))}
          </MotionStagger>
          <div className="mt-12">{composition.renderCta({ children: "Montar minha proposta", placement: "inline", className: "aptos-cta inline-flex min-h-12 items-center rounded-md px-6 py-3 font-bold" })}</div>
        </section>

        <section id="estrutura" className="aptos-dark-band">
          <div className="mx-auto grid max-w-7xl md:grid-cols-2">
            <MotionReveal className="flex flex-col justify-center px-5 py-16 md:px-10 lg:px-16">
              <p className="text-sm font-bold uppercase text-primary">Centro de São José dos Pinhais</p>
              <h2 className="aptos-display mt-4 text-4xl sm:text-5xl">Perto do DETRAN. Perto da sua decisão.</h2>
              <div className="mt-8 space-y-5 text-background/80">
                <p className="flex gap-3"><MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" /> Rua Passos de Oliveira, 810, Centro</p>
                <p className="flex gap-3"><BookOpen className="mt-1 h-5 w-5 shrink-0 text-primary" /> Curso online divulgado pela APTOS</p>
                <p className="flex gap-3"><ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-primary" /> Formação e serviços para diferentes fases da CNH</p>
              </div>
            </MotionReveal>
            <MotionImageReveal className="min-h-80 md:min-h-[34rem]">
              <img src="/images/autoescola-aptos/curso-online.webp" alt="Imagem contextual de estudo usada no site oficial da APTOS" className="h-full w-full object-cover" width="800" height="800" loading="lazy" decoding="async" />
            </MotionImageReveal>
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <div className="aptos-yellow-band grid overflow-hidden rounded-md md:grid-cols-[0.9fr_1.1fr]">
            <div className="p-7 md:p-12"><CarFront className="h-10 w-10" /><h2 className="aptos-display mt-8 text-4xl sm:text-5xl">Manual ou automático. A escolha começa com você.</h2></div>
            <div className="bg-card p-7 text-card-foreground md:p-12"><p className="text-lg leading-relaxed text-muted-foreground">Informe o objetivo, seu estágio, o melhor período e quando quer começar. A solicitação fica registrada antes de seguir ao atendimento oficial da APTOS.</p><div className="mt-8">{composition.renderCta({ children: <>Começar agora <ArrowRight className="h-4 w-4" /></>, placement: "cta", className: "aptos-cta inline-flex min-h-12 items-center gap-2 rounded-md px-6 py-3 font-bold" })}</div><p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><Clock3 className="h-4 w-4" /> Você responde em poucos passos.</p></div>
          </div>
        </section>

        <section id="duvidas" className="mx-auto max-w-4xl px-5 pb-24 md:px-8 md:pb-28">
          <p className="text-sm font-bold uppercase text-primary">Dúvidas frequentes</p><h2 className="aptos-display mt-3 text-4xl sm:text-5xl">Antes de escolher sua faixa.</h2>
          <div className="mt-10 divide-y divide-border border-y border-border">
            {faqs.map(([question, answer]) => <details key={question} className="aptos-faq py-5"><summary className="cursor-pointer text-lg font-bold">{question}</summary><p className="max-w-2xl pt-4 leading-relaxed text-muted-foreground">{answer}</p></details>)}
          </div>
        </section>

        <footer className="aptos-dark-band border-t border-background/15 px-5 py-8 md:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-background/70 sm:flex-row sm:items-center sm:justify-between">
            <p>Autoescola APTOS · São José dos Pinhais</p>
            <PortfolioHostCredit linkClassName="font-semibold text-background underline underline-offset-4 hover:text-primary" />
          </div>
        </footer>

        <div className="aptos-mobile-cta fixed inset-x-3 bottom-3 z-30 flex items-center justify-between gap-3 rounded-md border p-3 md:hidden">
          <div className="min-w-0"><p className="truncate text-xs text-background/70">Autoescola APTOS</p><p className="truncate text-sm font-bold">Automático ou manual</p></div>
          {composition.renderCta({ children: <><Check className="h-4 w-4" /> Começar</>, placement: "floating", className: "aptos-cta inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md px-4 py-2 text-sm font-bold" })}
        </div>
      </main>
    </PortfolioCompositionRoot>
  );
}
