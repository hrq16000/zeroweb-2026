import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Bolt,
  Check,
  Droplets,
  Hammer,
  House,
  Layers3,
  Lightbulb,
  PaintRoller,
  Ruler,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { MotionImageReveal, MotionReveal, MotionScope, MotionStagger } from "@/components/motion";

const quiz = {
  services: [
    "Pintura",
    "Elétrica",
    "Hidráulica",
    "Pisos e revestimentos",
    "Drywall e forro",
    "Acabamentos",
    "Iluminação em LED",
  ],
  experienceOptions: [
    "Casa ou apartamento ocupado",
    "Imóvel vazio",
    "Ambiente comercial",
    "Construção nova",
  ],
  periodOptions: ["Curitiba", "Região Metropolitana", "Vou confirmar o endereço"],
  timingOptions: ["Preciso começar em breve", "Nos próximos meses", "Ainda estou planejando"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "Qual frente da obra você precisa?",
    experience: "Qual é o contexto do imóvel?",
    period: "Onde será o serviço?",
    timing: "Quando pretende começar?",
  },
  notePlaceholder: "Conte os ambientes, metragem aproximada e o resultado que você quer alcançar.",
};

function CTA({
  children,
  service,
  className,
}: {
  children: React.ReactNode;
  service?: string;
  className?: string;
}) {
  return (
    <PortfolioCTAQuiz
      clientKey="btb-construcao"
      studioName="BTB Construção"
      recipientName="a equipe da BTB"
      theme="gold"
      mode="proposal"
      quizConfig={quiz}
      service={service}
      skipServiceWhenPrefilled={Boolean(service)}
      className={className}
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </PortfolioCTAQuiz>
  );
}

const scopes = [
  {
    id: "Pintura",
    Icon: PaintRoller,
    eyebrow: "Superfícies",
    description: "Preparação, cor e acabamento para renovar o ambiente.",
  },
  {
    id: "Elétrica",
    Icon: Bolt,
    eyebrow: "Infraestrutura",
    description: "Pontos, adequações e instalações elétricas para a nova configuração.",
  },
  {
    id: "Hidráulica",
    Icon: Droplets,
    eyebrow: "Infraestrutura",
    description: "Reparos e ajustes de água para cozinha, banheiro e áreas de apoio.",
  },
  {
    id: "Pisos e revestimentos",
    Icon: House,
    eyebrow: "Acabamento",
    description: "Assentamento e renovação de pisos e revestimentos.",
  },
  {
    id: "Drywall e forro",
    Icon: Hammer,
    eyebrow: "Estrutura",
    description: "Divisórias, forros e soluções internas para reorganizar espaços.",
  },
  {
    id: "Acabamentos e iluminação em LED",
    Icon: Lightbulb,
    eyebrow: "Finalização",
    description: "Detalhes de acabamento e iluminação para concluir a transformação.",
  },
] as const;

const steps = [
  ["01", "Entender", "Ambiente, objetivo, prioridades e frentes envolvidas."],
  ["02", "Organizar", "A equipe transforma o escopo em uma proposta para avaliação."],
  ["03", "Executar", "A reforma avança por etapas, com o serviço alinhado ao combinado."],
  ["04", "Conferir", "A entrega é revisada e a garantia informada pelo cliente é de 90 dias."],
] as const;

export function BtbConstrucaoPage() {
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);

  const selectedService = useMemo(
    () => (selectedScopes.length ? selectedScopes.join(" + ") : undefined),
    [selectedScopes],
  );

  const toggleScope = (scope: string) => {
    setSelectedScopes((current) =>
      current.includes(scope) ? current.filter((item) => item !== scope) : [...current, scope],
    );
  };

  return (
    <MotionScope>
      <div className="min-h-dvh overflow-hidden bg-[#f3f0e8] text-[#171717] selection:bg-[#ffdf35] selection:text-black">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#111]/95 px-5 py-3 text-white backdrop-blur lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <a href="#inicio" className="flex items-center gap-3 font-display text-lg font-black uppercase tracking-tight">
              <span className="grid h-10 w-10 place-items-center bg-[#ffdb19] text-xs text-[#111] [clip-path:polygon(0_18%,50%_0,100%_18%,100%_82%,50%_100%,0_82%)]">
                BTB
              </span>
              <span>
                BTB <span className="text-[#ffdb19]">Construção</span>
              </span>
            </a>
            <nav className="hidden items-center gap-7 text-xs font-black uppercase tracking-[.16em] md:flex">
              <a href="#mapa" className="transition hover:text-[#ffdb19]">Mapa da reforma</a>
              <a href="#camadas" className="transition hover:text-[#ffdb19]">Frentes</a>
              <a href="#processo" className="transition hover:text-[#ffdb19]">Etapas</a>
            </nav>
            <CTA className="inline-flex min-h-11 items-center gap-2 bg-[#ffdb19] px-4 py-2.5 text-sm font-black text-[#111] transition hover:-translate-y-0.5 hover:bg-[#ffe45e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              Solicitar orçamento
            </CTA>
          </div>
        </header>

        <main>
          <section id="inicio" className="relative isolate overflow-hidden bg-[#111] px-5 py-12 text-white lg:px-8 lg:py-20">
            <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(255,219,25,.06)_1px,transparent_1px),linear-gradient(rgba(255,219,25,.05)_1px,transparent_1px)] bg-[size:72px_72px]" />
            <div className="absolute -right-32 top-10 -z-10 h-[34rem] w-[34rem] rounded-full bg-[#ee1977]/15 blur-3xl" />
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-5 text-xs font-black uppercase tracking-[.18em] text-white/65">
                <span>Reformas internas · Curitiba e região</span>
                <span className="inline-flex items-center gap-2 text-[#ffdb19]">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  Garantia informada: 90 dias
                </span>
              </div>

              <div className="relative pt-10 lg:min-h-[42rem]">
                <MotionReveal variant="up">
                  <h1 className="relative z-10 max-w-6xl font-display text-[clamp(3.6rem,10vw,9.4rem)] font-black uppercase leading-[.78] tracking-[-.055em]">
                    Sua reforma
                    <span className="block text-[#ffdb19]">começa pelo</span>
                    <span className="block">escopo.</span>
                  </h1>
                </MotionReveal>

                <div className="relative z-20 mt-9 grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
                  <div className="max-w-xl">
                    <p className="text-lg leading-8 text-white/72">
                      Pintura, elétrica, hidráulica, revestimentos, drywall e iluminação podem fazer parte da mesma transformação.
                      A BTB organiza o primeiro passo para você explicar a obra com clareza.
                    </p>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <a
                        href="#mapa"
                        className="inline-flex min-h-12 items-center gap-2 bg-[#ffdb19] px-6 py-3.5 font-black text-[#111] transition hover:-translate-y-0.5 hover:bg-[#ffe45e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        Montar meu escopo
                        <ArrowDown className="h-4 w-4" aria-hidden="true" />
                      </a>
                      <CTA className="inline-flex min-h-12 items-center gap-2 border border-white/30 px-6 py-3.5 font-black text-white transition hover:border-[#ffdb19] hover:text-[#ffdb19] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffdb19]">
                        Ir direto ao orçamento
                      </CTA>
                    </div>
                  </div>

                  <MotionImageReveal direction="left">
                    <div className="relative lg:-mt-28 lg:ml-auto lg:max-w-3xl">
                      <div className="absolute -inset-3 -z-10 translate-x-3 translate-y-3 bg-[#ffdb19]" />
                      <PortfolioImage
                        managedField="heroImageUrl"
                        src="/images/btb-construcao/hero.png"
                        alt="Composição conceitual de um ambiente interno em reforma"
                        priority
                        width={1536}
                        height={1024}
                        className="aspect-[16/10] w-full object-cover shadow-2xl"
                      />
                      <div className="absolute -bottom-5 left-0 max-w-xs bg-[#ee1977] px-5 py-4 font-display text-lg font-black uppercase leading-tight text-white shadow-xl sm:text-xl">
                        Do que precisa mudar
                        <br />
                        para o que precisa acontecer.
                      </div>
                    </div>
                  </MotionImageReveal>
                </div>
              </div>
            </div>
          </section>

          <section id="mapa" className="px-5 py-20 lg:px-8 lg:py-28">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
                <div className="lg:sticky lg:top-28 lg:self-start">
                  <p className="text-xs font-black uppercase tracking-[.24em] text-[#df136e]">Mapa da reforma</p>
                  <h2 className="mt-4 font-display text-5xl font-black uppercase leading-[.9] sm:text-7xl">
                    Marque o que entra na obra.
                  </h2>
                  <p className="mt-6 max-w-lg text-lg leading-8 text-[#56524a]">
                    Você pode combinar mais de uma frente. Essa seleção segue para o orçamento e evita repetir o que já foi escolhido.
                  </p>

                  <div className="mt-8 border-l-4 border-[#171717] bg-white p-6 shadow-[8px_8px_0_#ffdb19]">
                    <p className="text-xs font-black uppercase tracking-[.18em] text-[#6d685e]">Seu escopo inicial</p>
                    {selectedScopes.length ? (
                      <ul className="mt-4 space-y-2">
                        {selectedScopes.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm font-bold">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#df136e]" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-4 text-sm leading-6 text-[#6d685e]">
                        Nenhuma frente marcada ainda. Você também pode começar pelo funil e escolher uma por vez.
                      </p>
                    )}

                    <CTA
                      service={selectedService}
                      className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#171717] px-5 py-3.5 font-black text-white transition hover:bg-[#2a2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#df136e]"
                    >
                      {selectedScopes.length ? "Continuar com este escopo" : "Começar meu orçamento"}
                    </CTA>
                  </div>
                </div>

                <MotionStagger className="grid gap-px bg-[#171717] sm:grid-cols-2">
                  {scopes.map(({ id, Icon, eyebrow, description }, index) => {
                    const active = selectedScopes.includes(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleScope(id)}
                        aria-pressed={active}
                        className={[
                          "group min-h-64 p-7 text-left transition focus-visible:z-10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#df136e]",
                          active ? "bg-[#ffdb19] text-[#171717]" : "bg-[#f3f0e8] hover:bg-white",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <span className="font-display text-sm font-black text-[#df136e]">0{index + 1}</span>
                          <span
                            className={[
                              "grid h-11 w-11 place-items-center border-2",
                              active ? "border-[#171717] bg-[#171717] text-[#ffdb19]" : "border-[#171717] text-[#171717]",
                            ].join(" ")}
                          >
                            {active ? <Check className="h-5 w-5" aria-hidden="true" /> : <Icon className="h-5 w-5" aria-hidden="true" />}
                          </span>
                        </div>
                        <p className="mt-12 text-xs font-black uppercase tracking-[.2em] text-[#6d685e]">{eyebrow}</p>
                        <h3 className="mt-2 font-display text-3xl font-black uppercase leading-none">{id}</h3>
                        <p className="mt-4 max-w-sm leading-7 text-[#56524a]">{description}</p>
                      </button>
                    );
                  })}
                </MotionStagger>
              </div>
            </div>
          </section>

          <section id="camadas" className="bg-[#171717] px-5 py-20 text-white lg:px-8 lg:py-28">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.24em] text-[#ffdb19]">Uma obra, várias camadas</p>
                  <h2 className="mt-4 max-w-2xl font-display text-5xl font-black uppercase leading-[.9] sm:text-7xl">
                    O acabamento depende do que vem antes.
                  </h2>
                  <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
                    Em vez de tratar cada serviço como uma ilha, o orçamento começa entendendo quais frentes precisam coexistir no mesmo ambiente.
                  </p>
                </div>

                <div className="space-y-0 border-y border-white/15">
                  {[
                    ["01", "Base e infraestrutura", "Elétrica, hidráulica e ajustes que precisam acontecer antes do fechamento."],
                    ["02", "Estrutura interna", "Drywall, forros e reorganização física dos espaços."],
                    ["03", "Superfícies", "Pisos, revestimentos, preparação e pintura."],
                    ["04", "Finalização", "Acabamentos e iluminação que concluem a leitura do ambiente."],
                  ].map(([number, title, text]) => (
                    <div key={number} className="grid gap-3 border-b border-white/15 py-7 last:border-b-0 sm:grid-cols-[5rem_1fr]">
                      <span className="font-display text-4xl font-black text-[#ee1977]">{number}</span>
                      <div>
                        <h3 className="font-display text-2xl font-black uppercase">{title}</h3>
                        <p className="mt-2 max-w-xl leading-7 text-white/60">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-white/15 pt-8">
                <div className="flex items-center gap-3 text-sm font-bold text-white/70">
                  <Layers3 className="h-5 w-5 text-[#ffdb19]" aria-hidden="true" />
                  O escopo selecionado acompanha o próximo passo do funil.
                </div>
                <CTA
                  service={selectedService}
                  className="inline-flex min-h-12 items-center gap-2 bg-[#ffdb19] px-6 py-3.5 font-black text-[#171717] transition hover:-translate-y-0.5 hover:bg-[#ffe45e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Organizar meu orçamento
                </CTA>
              </div>
            </div>
          </section>

          <section id="processo" className="px-5 py-20 lg:px-8 lg:py-28">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.24em] text-[#df136e]">Do pedido à proposta</p>
                  <h2 className="mt-4 font-display text-5xl font-black uppercase leading-[.9] sm:text-7xl">
                    Menos “me passa um preço”. Mais contexto para orçar.
                  </h2>
                  <div className="mt-7 flex items-start gap-3 border-l-4 border-[#ffdb19] pl-5 text-[#56524a]">
                    <Ruler className="mt-1 h-5 w-5 shrink-0 text-[#df136e]" aria-hidden="true" />
                    <p className="leading-7">
                      Metragem e detalhes adicionais podem ser informados no campo livre do funil. A página não calcula preço sem dados reais de orçamento.
                    </p>
                  </div>
                </div>

                <MotionStagger className="border-t-2 border-[#171717]">
                  {steps.map(([number, title, text]) => (
                    <article key={number} className="grid gap-5 border-b-2 border-[#171717] py-7 sm:grid-cols-[5rem_11rem_1fr] sm:items-start">
                      <span className="font-display text-4xl font-black text-[#df136e]">{number}</span>
                      <h3 className="font-display text-2xl font-black uppercase">{title}</h3>
                      <p className="leading-7 text-[#56524a]">{text}</p>
                    </article>
                  ))}
                </MotionStagger>
              </div>
            </div>
          </section>

          <section className="bg-[#ffdb19] px-5 py-16 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[.24em] text-[#df136e]">Próximo passo</p>
                <h2 className="mt-3 max-w-4xl font-display text-5xl font-black uppercase leading-[.88] sm:text-7xl">
                  Transforme a ideia em um escopo que a equipe consegue avaliar.
                </h2>
                <p className="mt-5 max-w-2xl leading-7 text-[#4b463e]">
                  Condições comerciais, disponibilidade e detalhes da execução são confirmados no orçamento. A página não inventa preço nem prazo.
                </p>
              </div>
              <CTA
                service={selectedService}
                className="inline-flex min-h-14 items-center justify-center gap-2 bg-[#171717] px-7 py-4 font-black text-white transition hover:bg-[#2a2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#df136e]"
              >
                Enviar meu escopo
              </CTA>
            </div>
          </section>
        </main>

        <footer className="bg-[#0a0a0a] px-5 py-8 text-sm text-white/60 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-xl font-black uppercase text-white">
                BTB <span className="text-[#ffdb19]">Construção</span>
              </p>
              <p className="mt-1">Reformas internas e acabamentos em Curitiba e região.</p>
            </div>
            <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4" />
          </div>
        </footer>

        <PortfolioSocialProofPopup
          clientKey="btb-construcao"
          eyebrow="BTB Construção"
          title="Uma reforma fica mais clara quando o escopo vem primeiro."
          description="Marque as frentes envolvidas e continue com o pedido organizado."
          ctaLabel="Montar escopo"
          ctaHref="#mapa"
          delayMs={12000}
          className="border-[#ffdb19]/40 bg-[#171717]/95 text-white"
          accentClassName="text-[#ffdb19]"
        />
        <PortfolioUpsellPopup pageName="portfolio-btb-construcao" />
      </div>
    </MotionScope>
  );
}
