import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  BadgeCheck,
  Bolt,
  Building2,
  Check,
  ClipboardList,
  Droplets,
  Hammer,
  House,
  Lightbulb,
  MapPinned,
  PaintRoller,
  Ruler,
  ShieldCheck,
} from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { MotionImageReveal, MotionReveal, MotionScope, MotionStagger } from "@/components/motion";

const SERVICE_OPTIONS = [
  {
    key: "Pintura",
    Icon: PaintRoller,
    title: "Pintura",
    text: "Preparação, renovação de superfícies e acabamento para ambientes internos.",
  },
  {
    key: "Elétrica",
    Icon: Bolt,
    title: "Elétrica",
    text: "Pontos, adequações e instalações que entram no escopo da reforma.",
  },
  {
    key: "Hidráulica",
    Icon: Droplets,
    title: "Hidráulica",
    text: "Reparos e intervenções para cozinha, banheiro e demais ambientes.",
  },
  {
    key: "Pisos e revestimentos",
    Icon: House,
    title: "Pisos e revestimentos",
    text: "Assentamento e acabamento para reorganizar a leitura do espaço.",
  },
  {
    key: "Drywall e forro",
    Icon: Hammer,
    title: "Drywall e forro",
    text: "Divisórias, forros e soluções internas conforme o ambiente.",
  },
  {
    key: "Acabamentos e LED",
    Icon: Lightbulb,
    title: "Acabamentos e LED",
    text: "Detalhes finais e iluminação para fechar o conjunto da reforma.",
  },
] as const;

const SPACE_OPTIONS = [
  { value: "Casa ou apartamento", label: "Casa / apartamento", Icon: House },
  { value: "Comércio ou escritório", label: "Comércio / escritório", Icon: Building2 },
  { value: "Condomínio ou área comum", label: "Condomínio / área comum", Icon: Ruler },
  { value: "Outro ambiente", label: "Outro ambiente", Icon: ClipboardList },
] as const;

const PROCESS = [
  {
    step: "01",
    title: "Escopo",
    text: "Você sinaliza ambientes, frentes de serviço e o que precisa mudar.",
  },
  {
    step: "02",
    title: "Avaliação",
    text: "A equipe recebe o contexto organizado para entender o próximo passo.",
  },
  {
    step: "03",
    title: "Orçamento",
    text: "A proposta é preparada conforme o serviço e as condições aplicáveis ao caso.",
  },
  {
    step: "04",
    title: "Execução",
    text: "Com o escopo alinhado, a reforma segue para a etapa combinada com a BTB.",
  },
] as const;

const quiz = {
  services: SERVICE_OPTIONS.map((item) => item.key),
  experienceOptions: SPACE_OPTIONS.map((item) => item.value),
  periodOptions: ["Curitiba", "Região Metropolitana", "Vou confirmar o endereço"],
  timingOptions: ["Preciso começar em breve", "Nos próximos meses", "Ainda estou planejando"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "Quais frentes entram na sua reforma?",
    experience: "Que tipo de espaço é?",
    period: "Onde será o serviço?",
    timing: "Quando você pretende começar?",
  },
  stepSubtitles: {
    service: "Escolha a frente principal. Se houver mais de uma, use o Mapa da Reforma antes de abrir o orçamento.",
    experience: "Esse contexto ajuda a organizar a conversa inicial.",
    period: "A localização participa da avaliação do atendimento.",
    timing: "Não é uma promessa de agenda; serve para indicar a urgência do seu pedido.",
  },
  notePlaceholder: "Conte os ambientes, metragem aproximada e qualquer detalhe que ajude a entender a reforma.",
};

const primaryCtaClass =
  "inline-flex min-h-12 items-center justify-center gap-2 border-2 border-[#171717] bg-[#ffdb19] px-6 py-3.5 text-sm font-black uppercase tracking-[0.08em] text-[#171717] shadow-[6px_6px_0_#ee1977] transition hover:-translate-y-0.5 hover:shadow-[8px_8px_0_#ee1977] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffdb19] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]";

function CTA({ children, className = primaryCtaClass }: { children: ReactNode; className?: string }) {
  return (
    <PortfolioCTAQuiz
      clientKey="btb-construcao"
      studioName="BTB Construção"
      recipientName="a equipe da BTB"
      theme="gold"
      mode="proposal"
      quizConfig={quiz}
      className={className}
      ariaLabel={typeof children === "string" ? children : "Solicitar orçamento para a BTB Construção"}
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </PortfolioCTAQuiz>
  );
}

export function BtbConstrucaoPage() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [spaceType, setSpaceType] = useState("");

  const initialAnswers = useMemo(
    () => ({
      service: selectedServices.join(" + "),
      experience: spaceType,
    }),
    [selectedServices, spaceType],
  );

  const toggleService = (value: string) => {
    setSelectedServices((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  const selectionSummary =
    selectedServices.length === 0
      ? "Nenhuma frente selecionada ainda."
      : `${selectedServices.length} ${selectedServices.length === 1 ? "frente selecionada" : "frentes selecionadas"}.`;

  return (
    <MotionScope>
      <div className="min-h-dvh overflow-hidden bg-[#f1eee6] text-[#171717] selection:bg-[#ffdb19] selection:text-black">
        <header className="absolute inset-x-0 top-0 z-30 px-5 py-5 text-white lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 border-b border-white/20 pb-4">
            <a href="#inicio" className="group inline-flex items-center gap-3" aria-label="BTB Construção — voltar ao início">
              <span className="grid h-11 w-11 place-items-center border-2 border-[#ffdb19] bg-black/35 font-display text-sm font-black tracking-[0.15em] text-[#ffdb19] backdrop-blur">
                BTB
              </span>
              <span className="font-display text-lg font-black uppercase tracking-[0.08em]">
                Construção
              </span>
            </a>
            <CTA className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#ffdb19] bg-black/35 px-4 py-2.5 text-xs font-black uppercase tracking-[0.12em] text-white backdrop-blur transition hover:bg-[#ffdb19] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffdb19]">
              Organizar orçamento
            </CTA>
          </div>
        </header>

        <main>
          <section id="inicio" className="relative isolate min-h-[88svh] overflow-hidden bg-[#111] text-white">
            <PortfolioImage
              managedField="heroImageUrl"
              src="/images/btb-construcao/hero.png"
              alt="Composição editorial de um ambiente em reforma usada como apoio visual"
              priority
              width={1536}
              height={1024}
              className="absolute inset-0 -z-30 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(9,9,9,.96)_0%,rgba(9,9,9,.78)_43%,rgba(9,9,9,.34)_72%,rgba(9,9,9,.58)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-t from-black/80 to-transparent" />

            <div className="mx-auto flex min-h-[88svh] max-w-7xl flex-col justify-end px-5 pb-10 pt-36 lg:px-8 lg:pb-14">
              <div className="grid gap-8 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-[#ffdb19]">
                    Reformas internas · Curitiba e região
                  </p>
                  <MotionReveal variant="up">
                    <h1 className="mt-5 max-w-5xl font-display text-[clamp(3.6rem,9vw,8.6rem)] font-black uppercase leading-[0.78] tracking-[-0.06em]">
                      Tire a reforma
                      <span className="block text-[#ffdb19]">do “um dia”.</span>
                    </h1>
                  </MotionReveal>
                  <p className="mt-7 max-w-2xl text-base leading-7 text-white/78 sm:text-lg sm:leading-8">
                    Pintura, elétrica, hidráulica, pisos, drywall e acabamentos podem fazer parte do mesmo escopo.
                    Comece organizando o que precisa mudar antes de pedir o orçamento.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <a
                      href="#mapa-da-reforma"
                      className={primaryCtaClass}
                    >
                      Montar mapa da reforma
                      <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <a
                      href="#frentes"
                      className="inline-flex min-h-12 items-center gap-2 border-b-2 border-white/55 px-1 py-3 text-sm font-black uppercase tracking-[0.09em] text-white transition hover:border-[#ffdb19] hover:text-[#ffdb19]"
                    >
                      Ver frentes de serviço
                    </a>
                  </div>
                </div>

                <MotionImageReveal direction="left">
                  <aside className="border-l-4 border-[#ee1977] bg-black/55 p-5 backdrop-blur sm:p-6">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ffdb19]">Ponto de partida</p>
                    <p className="mt-3 font-display text-2xl font-black uppercase leading-tight sm:text-3xl">
                      Um pedido melhor explicado acelera a avaliação.
                    </p>
                    <div className="mt-6 grid gap-3 text-sm text-white/75">
                      <span className="flex items-center gap-3">
                        <MapPinned className="h-5 w-5 shrink-0 text-[#ffdb19]" aria-hidden="true" />
                        Curitiba e Região Metropolitana
                      </span>
                      <span className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 shrink-0 text-[#ffdb19]" aria-hidden="true" />
                        Garantia informada pela BTB: 90 dias
                      </span>
                    </div>
                    <p className="mt-5 text-[11px] uppercase tracking-[0.13em] text-white/45">
                      Imagem principal: composição editorial de apoio, não fotografia documental de obra executada.
                    </p>
                  </aside>
                </MotionImageReveal>
              </div>
            </div>
          </section>

          <section id="mapa-da-reforma" className="border-y-2 border-[#171717] bg-[#f1eee6] px-5 py-20 lg:px-8 lg:py-24">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.68fr_1.32fr]">
              <div className="lg:sticky lg:top-8 lg:self-start">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#df136e]">Decision aid · BTB</p>
                <h2 className="mt-4 font-display text-5xl font-black uppercase leading-[0.86] sm:text-7xl">
                  Mapa da
                  <span className="block text-[#df136e]">reforma.</span>
                </h2>
                <p className="mt-6 max-w-md text-base leading-7 text-[#4b4b4b]">
                  Marque as frentes que entram no seu projeto e, se quiser, o tipo de espaço.
                  Essas escolhas seguem para o funil — você não precisa começar a explicação do zero.
                </p>
                <div className="mt-8 border-l-4 border-[#ffdb19] pl-4">
                  <p className="text-sm font-black uppercase tracking-[0.12em]">{selectionSummary}</p>
                  <p className="mt-1 text-sm leading-6 text-[#666]">
                    Você pode combinar mais de uma frente. O orçamento continua dependendo da avaliação do caso.
                  </p>
                </div>
              </div>

              <div className="border-2 border-[#171717] bg-[#fffdf7]">
                <div className="grid border-b-2 border-[#171717] sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="p-5 sm:p-6">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#666]">Etapa A</p>
                    <h3 className="mt-2 font-display text-2xl font-black uppercase">Quais frentes entram?</h3>
                  </div>
                  <div className="border-t-2 border-[#171717] bg-[#ffdb19] px-5 py-4 text-sm font-black uppercase tracking-[0.08em] sm:border-l-2 sm:border-t-0">
                    Selecione uma ou mais
                  </div>
                </div>

                <MotionStagger className="grid sm:grid-cols-2">
                  {SERVICE_OPTIONS.map(({ key, Icon, title, text }, index) => {
                    const active = selectedServices.includes(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleService(key)}
                        className={
                          "group relative min-h-44 border-b-2 border-[#171717] p-5 text-left transition last:border-b-0 sm:p-6 " +
                          (index % 2 === 0 ? "sm:border-r-2 " : "") +
                          (active ? "bg-[#171717] text-white" : "bg-[#fffdf7] hover:bg-[#ffdb19]/35")
                        }
                      >
                        <span className="flex items-start justify-between gap-4">
                          <Icon className={"h-7 w-7 " + (active ? "text-[#ffdb19]" : "text-[#df136e]")} aria-hidden="true" />
                          <span
                            className={
                              "grid h-7 w-7 place-items-center border-2 " +
                              (active ? "border-[#ffdb19] bg-[#ffdb19] text-black" : "border-[#171717] text-transparent")
                            }
                            aria-hidden="true"
                          >
                            <Check className="h-4 w-4" />
                          </span>
                        </span>
                        <span className="mt-8 block font-display text-xl font-black uppercase">{title}</span>
                        <span className={"mt-2 block text-sm leading-6 " + (active ? "text-white/65" : "text-[#555]")}>{text}</span>
                      </button>
                    );
                  })}
                </MotionStagger>

                <div className="border-b-2 border-[#171717] p-5 sm:p-6">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#666]">Etapa B · opcional</p>
                  <h3 className="mt-2 font-display text-2xl font-black uppercase">Que tipo de espaço é?</h3>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {SPACE_OPTIONS.map(({ value, label, Icon }) => {
                      const active = spaceType === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setSpaceType((current) => (current === value ? "" : value))}
                          className={
                            "inline-flex min-h-11 items-center gap-2 border-2 px-4 py-2.5 text-sm font-bold transition " +
                            (active
                              ? "border-[#171717] bg-[#ee1977] text-white"
                              : "border-[#171717] bg-white hover:bg-[#ffdb19]")
                          }
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-5 bg-[#171717] p-5 text-white sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
                  <div aria-live="polite">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffdb19]">Seu contexto segue junto</p>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                      O funil começa na primeira informação que ainda falta. Região, prazo e detalhes continuam sendo confirmados antes do envio.
                    </p>
                  </div>
                  <PortfolioCTAQuiz
                    clientKey="btb-construcao"
                    studioName="BTB Construção"
                    recipientName="a equipe da BTB"
                    theme="gold"
                    mode="proposal"
                    quizConfig={quiz}
                    initialAnswers={initialAnswers}
                    skipPrefilledSteps
                    className={primaryCtaClass}
                    ariaLabel="Continuar orçamento com as escolhas do Mapa da Reforma"
                  >
                    Continuar meu escopo
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </PortfolioCTAQuiz>
                </div>
              </div>
            </div>
          </section>

          <section id="frentes" className="bg-[#111] px-5 py-20 text-white lg:px-8 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-8 border-b border-white/15 pb-10 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ffdb19]">Do bruto ao acabamento</p>
                  <h2 className="mt-4 font-display text-5xl font-black uppercase leading-[0.88] sm:text-7xl">
                    Frentes que podem
                    <span className="block text-[#ee1977]">se encontrar na mesma obra.</span>
                  </h2>
                </div>
                <p className="max-w-xl text-base leading-7 text-white/62 lg:justify-self-end">
                  Em vez de tratar cada serviço como um pedido solto, o primeiro passo é registrar o conjunto do que você precisa.
                  A avaliação define como esse escopo pode ser atendido.
                </p>
              </div>

              <MotionStagger className="divide-y divide-white/15">
                {SERVICE_OPTIONS.map(({ Icon, title, text }, index) => (
                  <article key={title} className="grid gap-4 py-6 sm:grid-cols-[70px_1fr_1.25fr] sm:items-center sm:py-8">
                    <span className="font-mono text-sm font-black text-[#ffdb19]">0{index + 1}</span>
                    <div className="flex items-center gap-3">
                      <Icon className="h-6 w-6 text-[#ee1977]" aria-hidden="true" />
                      <h3 className="font-display text-2xl font-black uppercase sm:text-3xl">{title}</h3>
                    </div>
                    <p className="max-w-2xl text-sm leading-6 text-white/58 sm:text-base sm:leading-7">{text}</p>
                  </article>
                ))}
              </MotionStagger>
            </div>
          </section>

          <section id="processo" className="bg-[#ffdb19] px-5 py-20 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[#df136e]">Linha de obra</p>
                  <h2 className="mt-4 font-display text-5xl font-black uppercase leading-[0.86] sm:text-7xl">
                    Primeiro
                    <span className="block">organiza.</span>
                    <span className="block text-[#df136e]">Depois executa.</span>
                  </h2>
                </div>
                <div className="border-l-2 border-[#171717]">
                  {PROCESS.map((item) => (
                    <MotionReveal key={item.step} variant="up">
                      <article className="relative grid gap-3 border-b-2 border-[#171717] px-6 py-7 sm:grid-cols-[90px_1fr_1.25fr] sm:items-start">
                        <span className="absolute -left-[7px] top-9 h-3 w-3 bg-[#171717]" aria-hidden="true" />
                        <span className="font-display text-4xl font-black text-[#df136e]">{item.step}</span>
                        <h3 className="font-display text-2xl font-black uppercase">{item.title}</h3>
                        <p className="max-w-xl leading-7 text-[#3c3524]">{item.text}</p>
                      </article>
                    </MotionReveal>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#f1eee6] px-5 py-18 lg:px-8 lg:py-20">
            <div className="mx-auto grid max-w-7xl gap-0 border-2 border-[#171717] lg:grid-cols-3">
              <div className="border-b-2 border-[#171717] p-6 lg:border-b-0 lg:border-r-2">
                <MapPinned className="h-6 w-6 text-[#df136e]" aria-hidden="true" />
                <p className="mt-7 text-xs font-black uppercase tracking-[0.18em] text-[#666]">Área informada</p>
                <p className="mt-2 font-display text-2xl font-black uppercase">Curitiba e região</p>
              </div>
              <div className="border-b-2 border-[#171717] p-6 lg:border-b-0 lg:border-r-2">
                <ShieldCheck className="h-6 w-6 text-[#df136e]" aria-hidden="true" />
                <p className="mt-7 text-xs font-black uppercase tracking-[0.18em] text-[#666]">Condição fornecida</p>
                <p className="mt-2 font-display text-2xl font-black uppercase">Garantia de 90 dias</p>
              </div>
              <div className="p-6">
                <BadgeCheck className="h-6 w-6 text-[#df136e]" aria-hidden="true" />
                <p className="mt-7 text-xs font-black uppercase tracking-[0.18em] text-[#666]">Próximo passo</p>
                <p className="mt-2 font-display text-2xl font-black uppercase">Escopo antes do orçamento</p>
              </div>
            </div>
          </section>

          <section id="contato" className="relative isolate overflow-hidden bg-[#111] px-5 py-20 text-white lg:px-8 lg:py-24">
            <div className="absolute inset-y-0 right-0 -z-10 w-1/2 bg-[linear-gradient(135deg,transparent_0_35%,rgba(238,25,119,.18)_35%_55%,transparent_55%_100%)]" />
            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ffdb19]">Pronto para explicar sua reforma?</p>
                <h2 className="mt-4 max-w-5xl font-display text-5xl font-black uppercase leading-[0.86] sm:text-7xl lg:text-8xl">
                  Leve um escopo
                  <span className="block text-[#ee1977]">mais claro para a conversa.</span>
                </h2>
              </div>
              <div className="lg:justify-self-end">
                <p className="mb-6 max-w-md text-base leading-7 text-white/62">
                  Informe frentes, tipo de espaço, região e prazo. O pedido fica organizado antes de seguir para o canal da própria BTB.
                </p>
                <CTA>Solicitar orçamento</CTA>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-[#080808] px-5 py-8 text-sm text-white/55 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-lg font-black uppercase tracking-[0.08em] text-white">BTB Construção</p>
              <p className="mt-1">Reformas internas e acabamentos · Curitiba e região.</p>
            </div>
            <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4" />
          </div>
        </footer>

        <PortfolioSocialProofPopup
          clientKey="btb-construcao"
          eyebrow="BTB Construção"
          title="Antes do orçamento, organize o escopo."
          description="Marque as frentes da obra no Mapa da Reforma e leve esse contexto para o funil."
          ctaLabel="Montar mapa da reforma"
          ctaHref="#mapa-da-reforma"
          delayMs={10000}
          className="border-[#ffdb19]/40 bg-[#171717]/95 text-white"
          accentClassName="text-[#ffdb19]"
        />
        <PortfolioUpsellPopup pageName="portfolio-btb-construcao" />
      </div>
    </MotionScope>
  );
}
