import {
  ArrowDownRight,
  ArrowRight,
  Box,
  Building2,
  CheckCircle2,
  DoorOpen,
  Hammer,
  Layers3,
  MapPin,
  PackageOpen,
  Ruler,
  Store,
  Trees,
  Warehouse,
} from "lucide-react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import {
  MotionImageReveal,
  MotionReveal,
  MotionStagger,
  MotionTextReveal,
} from "@/components/motion";
import { PortfolioCompositionRoot } from "@/components/portfolio/composition/PortfolioCompositionRoot";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import type { CtaRenderOptions } from "@/lib/portfolio-blueprint";
import type { PortfolioComposition } from "@/lib/portfolio-composition";
import "./arildo-madeiras.css";

const LOGO = "/images/arildo-madeiras/logo.svg";

const MEDIA = [
  "https://arildomadeiras.guiapinhais.com.br/medias/article/big/177/468999658-563203459664004-5563351431374802730-n.jpg",
  "https://arildomadeiras.guiapinhais.com.br/medias/article/big/178/448622032-454670737183944-3449960752074939008-n.jpg",
  "https://arildomadeiras.guiapinhais.com.br/medias/article/big/186/whatsapp-image-2024-11-08-at-09-33-55-copia.jpeg",
  "https://arildomadeiras.guiapinhais.com.br/medias/article/big/187/whatsapp-image-2024-11-08-at-09-33-52-1-copia.jpeg",
  "https://arildomadeiras.guiapinhais.com.br/medias/article/big/188/whatsapp-image-2024-11-08-at-09-33-51-1.jpeg",
  "https://arildomadeiras.guiapinhais.com.br/medias/article/big/189/whatsapp-image-2024-11-08-at-09-33-51-2.jpeg",
  "https://arildomadeiras.guiapinhais.com.br/medias/article/big/190/whatsapp-image-2024-11-08-at-09-33-54.jpeg",
  "https://arildomadeiras.guiapinhais.com.br/medias/article/big/191/whatsapp-image-2024-11-08-at-09-33-52.jpeg",
] as const;

export const composition: PortfolioComposition = {
  slug: "arildo-madeiras",
  motionIntensity: "BALANCED",
  renderCta: ({ children, className, placement }: CtaRenderOptions) => (
    <FunnelCTAButton
      clientKey="arildo-madeiras"
      companySlug="arildo-madeiras"
      formSlug="funnel-arildo-madeiras"
      location={`arildo-madeiras_${placement}`}
      className={className}
    >
      {children}
    </FunnelCTAButton>
  ),
  brief: {
    businessPersonality:
      "Sólida, prática, material e próxima: uma madeireira local que fala por variedade, matéria-prima e aplicação.",
    creativeConcept:
      "Camadas de madeira: cada decisão da obra aparece como uma lâmina sobre a outra até formar uma solução completa.",
    visualMetaphor:
      "Pilhas, veios, cortes e réguas de madeira organizando a leitura como um estoque editorial.",
    spatialLanguage:
      "Blocos longos, faixas escalonadas, cortes diagonais discretos e imagens em encaixes de proporções diferentes.",
    heroConcept:
      "Título monumental apoiado por uma pilha gráfica de lâminas e uma fotografia real vertical de estoque.",
    navigationConcept:
      "Régua compacta de materiais que ancora produtos, aplicações, Cambará, estoque e localização.",
    contentRhythm:
      "Impacto material → catálogo por lâminas → aplicações → espécie em foco → galeria documental → presença local → orçamento.",
    mediaNarrative:
      "Fotos reais do estoque e das madeiras do site oficial ocupam os momentos de prova; arte 0WEB só aparece em capa e textura editorial.",
    proofNarrative:
      "A página prova o negócio por endereço, catálogo publicado, produto Cambará e fotografias reais do próprio site, sem avaliações ou métricas inventadas.",
    conversionNarrative:
      "O visitante organiza material, aplicação, momento da obra e observações; todos os CTAs entram no mesmo funil da Arildo.",
    motionNarrative:
      "Lâminas entram em pequenos deslocamentos e imagens são reveladas como cortes de material; reduced-motion mantém tudo visível.",
    signatureMoments: [
      "Hero com três lâminas tipográficas sobrepostas que funcionam como amostras de material.",
      "Catálogo vira uma régua vertical escalonada, não uma grade de cards.",
      "Cambará ganha um corte editorial próprio entre aplicações e estoque.",
      "Galeria usa oito fotos reais em mosaico de pilhas, sem repetição de crop.",
    ],
    compositionFingerprint: {
      heroGeometry:
        "oversized left material ledger with stacked horizontal timber labels and one tall documentary stock cut",
      headerTreatment:
        "thin floating material ruler with official logo, anchor notches and compact quote action",
      sectionGraph:
        "material-stage→staggered-material-ledger→application-spine→cambara-cut→stock-masonry→local-yard→quote-dock→native-faq",
      contentOrder: [
        "matéria-prima",
        "linhas de produto",
        "aplicações",
        "cambará",
        "estoque real",
        "localidade",
        "orçamento",
        "dúvidas",
      ],
      gridTopology:
        "asymmetric 8/4 hero, offset horizontal ledgers, vertical application spine and 12-cell irregular stock mosaic",
      mediaDistribution:
        "one hero stock image, two application cuts, one cambara evidence block, eight official stock images across masonry",
      backgroundRhythm:
        "charcoal grain→warm timber paper→oxide accent cut→deep brown gallery→warm local ledger→charcoal closing dock",
      proofPlacement:
        "official-media proof embedded beside product/application claims and address strip, never isolated as rating cards",
      ctaDistribution:
        "hero quote, product-ledger checkpoint, cambara request, local quote and final quote dock",
      navigationPattern:
        "material-ruler anchors: materiais, aplicações, estoque, localização",
      motionSignature:
        "short plank shifts, clipped image reveals and grain-line progression",
      closingStructure:
        "full-width quote dock with material/application brief before factual accordion",
      roleGraph: [
        "orientation:material-stage",
        "offer-discovery:staggered-ledger",
        "decision-support:application-spine",
        "product-proof:cambara-cut",
        "evidence:stock-masonry",
        "locality:local-yard",
        "conversion:quote-dock",
      ],
      mediaCadence: [
        "real-stock-hero",
        "text-led-product-ledger",
        "real-application-cut",
        "real-cambara-proof",
        "dense-real-stock-mosaic",
        "text-map-locality",
      ],
      interactionLoci: [
        "material-anchor-ruler",
        "contextual-funnel-cta",
        "native-faq",
      ],
      decisionAidPlacement: [
        "product families immediately after hero",
        "applications before Cambará highlight",
        "measure/quantity prompt inside quote dock",
      ],
      densityRhythm: [
        "dense-hero",
        "medium-ledger",
        "dense-application-spine",
        "high-media-masonry",
        "compact-local",
        "dense-closing",
      ],
      mobileCompositionStrategy:
        "lâminas viram pilha vertical legível; mosaico preserva alternância 2/1 colunas; CTA final e navegação mantêm toque mínimo sem criar vazios.",
    },
  },
};

const productRows = [
  {
    icon: Trees,
    index: "01",
    title: "Madeiras em geral",
    copy: "Matéria-prima para diferentes etapas de construção, reforma e projetos.",
  },
  {
    icon: DoorOpen,
    index: "02",
    title: "Portas e janelas",
    copy: "Itens publicados pela Arildo para compor obra, fechamento e acabamento.",
  },
  {
    icon: Layers3,
    index: "03",
    title: "Forros",
    copy: "Uma linha que leva a madeira também para o acabamento dos ambientes.",
  },
  {
    icon: Hammer,
    index: "04",
    title: "Móveis rústicos",
    copy: "Peças de presença natural, incluindo banquetas e soluções com linguagem rústica.",
  },
] as const;

const applications = [
  ["Assoalhos", "Madeira aplicada ao piso e à leitura natural do ambiente."],
  ["Caixilhos", "Uso publicado pela empresa para composições de construção e acabamento."],
  ["Colunas", "Aplicação estrutural citada pela Arildo em seu material institucional."],
  ["Casa, comércio e obra", "Três contextos explicitamente atendidos no conteúdo oficial."],
] as const;

const faqs = [
  [
    "A Arildo Madeiras atende atacado e varejo?",
    "Sim. O site oficial apresenta a empresa como atacado e varejo de madeiras brutas e beneficiadas.",
  ],
  [
    "Quais linhas aparecem no catálogo da empresa?",
    "Madeiras em geral, portas, janelas, forros, móveis rústicos e banquetas. O site também mantém uma página específica para Madeira de Cambará.",
  ],
  [
    "As madeiras são usadas apenas em construção?",
    "Não. O material oficial cita aplicações como assoalho, caixilhos e colunas, além de atendimento para casa, comércio e obra.",
  ],
  [
    "Onde fica a Arildo Madeiras?",
    "Na Avenida Iraí, 1752, Weissópolis, Pinhais — PR, CEP 83321-000.",
  ],
  [
    "Como pedir orçamento?",
    "Use o formulário desta página. Ele organiza o tipo de material, o contexto do projeto e o momento da compra antes de encaminhar ao WhatsApp oficial da Arildo.",
  ],
] as const;

function MaterialCta({
  children,
  placement,
  compact = false,
}: {
  children: ReactNode;
  placement: string;
  compact?: boolean;
}) {
  return composition.renderCta({
    children,
    placement,
    className: compact
      ? "arildo-cta inline-flex min-h-11 items-center gap-2 px-4 py-2 text-sm font-extrabold"
      : "arildo-cta inline-flex min-h-12 items-center gap-2 px-6 py-3 font-extrabold",
  });
}

export function ArildoMadeirasPage() {
  return (
    <PortfolioCompositionRoot composition={composition}>
      <main className="arildo-site pb-24 md:pb-0">
        <header className="arildo-ruler fixed inset-x-3 top-3 z-40 mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:inset-x-6 md:px-5">
          <a href="#inicio" className="shrink-0" aria-label="Arildo Madeiras — início">
            <img
              src={LOGO}
              alt="Arildo Madeiras"
              width="220"
              height="78"
              className="h-9 w-auto object-contain md:h-11"
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
            />
          </a>
          <nav
            className="ml-auto hidden items-center gap-1 text-xs font-black uppercase tracking-[0.12em] lg:flex"
            aria-label="Navegação da Arildo Madeiras"
          >
            <a href="#materiais">Materiais</a>
            <a href="#aplicacoes">Aplicações</a>
            <a href="#estoque">Estoque</a>
            <a href="#local">Pinhais</a>
          </nav>
          <MaterialCta placement="header" compact>
            Orçar <ArrowRight className="h-4 w-4" />
          </MaterialCta>
        </header>

        <section id="inicio" className="arildo-hero relative overflow-hidden pt-24 md:pt-28">
          <div className="arildo-grain" aria-hidden="true" />
          <div className="mx-auto grid min-h-[760px] max-w-7xl items-stretch gap-0 px-4 py-6 md:px-7 lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
            <MotionReveal className="relative z-10 flex flex-col justify-center py-10 pr-0 lg:pr-12">
              <p className="arildo-kicker flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em]">
                <MapPin className="h-4 w-4" /> Weissópolis · Pinhais — PR
              </p>
              <h1 className="arildo-display mt-6 max-w-[10ch] text-[clamp(3.9rem,9vw,8.6rem)] leading-[0.82]">
                <MotionTextReveal text="Madeira que dá corpo ao projeto." />
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[var(--arildo-muted)] md:text-xl">
                Atacado e varejo de madeiras brutas e beneficiadas, com portas,
                janelas, forros, móveis rústicos e soluções para construção,
                reforma e acabamento.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <MaterialCta placement="hero">
                  Montar meu orçamento <ArrowDownRight className="h-5 w-5" />
                </MaterialCta>
                <a href="#materiais" className="arildo-secondary inline-flex min-h-12 items-center gap-2 px-6 py-3 font-bold">
                  Ver materiais <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <div className="arildo-plank-stack mt-12 max-w-3xl" aria-label="Linhas principais">
                <span>MADEIRAS BRUTAS</span>
                <span>MADEIRAS BENEFICIADAS</span>
                <span>PORTAS · JANELAS · FORROS</span>
              </div>
            </MotionReveal>

            <MotionImageReveal className="arildo-hero-cut relative min-h-[460px] overflow-hidden lg:min-h-full" direction="left">
              <img
                src={MEDIA[0]}
                alt="Estoque real de madeira publicado pela Arildo Madeiras"
                className="h-full w-full object-cover"
                width="900"
                height="1200"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                referrerPolicy="no-referrer"
              />
              <div className="arildo-image-tag absolute bottom-5 left-5 right-5 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em]">Mídia oficial</p>
                <p className="mt-1 text-sm">Estoque e madeiras publicados pela própria Arildo.</p>
              </div>
            </MotionImageReveal>
          </div>
        </section>

        <section id="materiais" className="arildo-paper">
          <div className="mx-auto max-w-7xl px-4 py-20 md:px-7 md:py-28">
            <div className="grid gap-10 lg:grid-cols-[0.38fr_0.62fr] lg:gap-20">
              <MotionReveal className="lg:sticky lg:top-28 lg:self-start">
                <p className="arildo-label">Índice de materiais</p>
                <h2 className="arildo-display mt-4 text-5xl leading-[0.94] md:text-6xl">
                  Escolha pela necessidade da obra.
                </h2>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--arildo-paper-muted)]">
                  O catálogo é organizado pelo que você precisa resolver — não por uma
                  grade genérica de produtos.
                </p>
                <div className="mt-8">
                  <MaterialCta placement="materials">Pedir orientação <ArrowRight className="h-4 w-4" /></MaterialCta>
                </div>
              </MotionReveal>

              <MotionStagger className="arildo-material-ledger" variant="up">
                {productRows.map(({ icon: Icon, index, title, copy }, i) => (
                  <article key={title} className="arildo-material-row" style={{ "--row-shift": `${i * 24}px` } as CSSProperties}>
                    <div className="flex items-start gap-5">
                      <span className="arildo-row-index">{index}</span>
                      <Icon className="mt-1 h-7 w-7 shrink-0" />
                    </div>
                    <div>
                      <h3 className="arildo-display text-3xl md:text-4xl">{title}</h3>
                      <p className="mt-2 max-w-xl leading-relaxed">{copy}</p>
                    </div>
                  </article>
                ))}
              </MotionStagger>
            </div>
          </div>
        </section>

        <section id="aplicacoes" className="arildo-applications">
          <div className="mx-auto max-w-7xl px-4 py-20 md:px-7 md:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
              <MotionImageReveal className="arildo-application-image min-h-[500px] overflow-hidden">
                <img
                  src={MEDIA[1]}
                  alt="Madeiras reais publicadas pela Arildo Madeiras"
                  className="h-full w-full object-cover"
                  width="900"
                  height="900"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </MotionImageReveal>
              <div>
                <MotionReveal>
                  <p className="arildo-label arildo-label-light">Da matéria à aplicação</p>
                  <h2 className="arildo-display mt-4 max-w-[13ch] text-5xl leading-[0.94] md:text-6xl">
                    A madeira entra onde o projeto pede estrutura, acabamento ou presença.
                  </h2>
                </MotionReveal>
                <MotionStagger className="arildo-application-spine mt-10" variant="left">
                  {applications.map(([title, copy], i) => (
                    <article key={title} className="arildo-application-step">
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <h3 className="text-xl font-black">{title}</h3>
                        <p className="mt-1 text-[var(--arildo-dark-muted)]">{copy}</p>
                      </div>
                    </article>
                  ))}
                </MotionStagger>
              </div>
            </div>
          </div>
        </section>

        <section className="arildo-cambara">
          <div className="mx-auto grid max-w-7xl items-stretch md:grid-cols-[0.9fr_1.1fr]">
            <MotionReveal className="flex flex-col justify-center px-5 py-16 md:px-10 lg:px-16">
              <p className="arildo-label">Espécie em destaque</p>
              <h2 className="arildo-display mt-4 text-6xl leading-[0.88] md:text-7xl">Cambará.</h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed">
                A Arildo mantém uma página própria para Madeira de Cambará em seu
                catálogo oficial. Se essa é a linha que você procura, informe medidas,
                quantidade aproximada e aplicação no orçamento.
              </p>
              <div className="mt-8">
                <MaterialCta placement="cambara">
                  Orçar Cambará <Ruler className="h-4 w-4" />
                </MaterialCta>
              </div>
            </MotionReveal>
            <MotionImageReveal className="min-h-[460px]">
              <img
                src={MEDIA[2]}
                alt="Madeira de Cambará e estoque publicados pela Arildo Madeiras"
                className="h-full w-full object-cover"
                width="1000"
                height="800"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </MotionImageReveal>
          </div>
        </section>

        <section id="estoque" className="arildo-stock">
          <div className="mx-auto max-w-7xl px-4 py-20 md:px-7 md:py-28">
            <MotionReveal className="flex flex-col gap-5 border-b border-white/20 pb-9 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="arildo-label arildo-label-light">Estoque real · mídia oficial</p>
                <h2 className="arildo-display mt-3 text-5xl md:text-6xl">Madeira de verdade, em escala de obra.</h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-white/65">
                As imagens abaixo vêm do próprio site da Arildo e são usadas como
                evidência do negócio — sem banco genérico disfarçado de foto real.
              </p>
            </MotionReveal>

            <div className="arildo-masonry mt-10">
              {MEDIA.slice(3).map((src, index) => (
                <MotionImageReveal key={src} className={`arildo-masonry-item arildo-masonry-item-${index + 1}`}>
                  <img
                    src={src}
                    alt={`Estoque e madeiras da Arildo Madeiras — registro ${index + 1}`}
                    className="h-full w-full object-cover"
                    width="900"
                    height="900"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                </MotionImageReveal>
              ))}
            </div>
          </div>
        </section>

        <section id="local" className="arildo-local">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:px-7 md:py-24 lg:grid-cols-[0.72fr_1.28fr]">
            <MotionReveal>
              <p className="arildo-label">Pinhais · PR</p>
              <h2 className="arildo-display mt-4 text-5xl leading-[0.95] md:text-6xl">
                Um endereço real para uma decisão concreta.
              </h2>
            </MotionReveal>
            <div className="arildo-address-board">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <MapPin className="h-7 w-7" />
                  <p className="mt-5 text-sm font-black uppercase tracking-[0.14em]">Endereço publicado</p>
                  <address className="mt-2 text-2xl font-bold not-italic leading-tight">
                    Av. Iraí, 1752<br />
                    Weissópolis · Pinhais — PR<br />
                    83321-000
                  </address>
                </div>
                <div>
                  <Store className="h-7 w-7" />
                  <p className="mt-5 text-sm font-black uppercase tracking-[0.14em]">Atendimento</p>
                  <p className="mt-2 text-xl font-bold">Atacado e varejo</p>
                  <p className="mt-2 text-sm leading-relaxed opacity-75">
                    Telefones públicos do site: (41) 3668-7014 e (41) 99167-1593.
                    O pedido desta página segue pelo funil antes do WhatsApp oficial.
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <MaterialCta placement="local">Organizar meu pedido <ArrowRight className="h-4 w-4" /></MaterialCta>
              </div>
            </div>
          </div>
        </section>

        <section className="arildo-quote-dock">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:px-7 md:py-28 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
            <MotionReveal>
              <p className="arildo-label arildo-label-light">Do projeto para o orçamento</p>
              <h2 className="arildo-display mt-4 max-w-[11ch] text-6xl leading-[0.88] md:text-7xl">
                Diga o material. Aplique contexto. Evite retrabalho.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
                O funil registra o que você procura, a aplicação, quando pretende
                avançar e observações como medidas ou quantidade. Depois disso, o
                atendimento continua no canal oficial da Arildo.
              </p>
            </MotionReveal>
            <MotionReveal variant="right" className="arildo-quote-panel">
              <div className="space-y-5">
                {[
                  ["01", "Material ou linha"],
                  ["02", "Construção, reforma ou acabamento"],
                  ["03", "Momento da compra"],
                  ["04", "Medidas, quantidade e detalhes"],
                ].map(([n, label]) => (
                  <div key={n} className="flex items-center gap-4 border-b border-black/15 pb-4">
                    <span className="arildo-row-index">{n}</span>
                    <p className="font-black">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <MaterialCta placement="closing">
                  Começar orçamento <ArrowRight className="h-5 w-5" />
                </MaterialCta>
              </div>
              <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed opacity-70">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                Nenhum preço, estoque ou prazo é inventado nesta página; a equipe confirma no atendimento.
              </p>
            </MotionReveal>
          </div>
        </section>

        <section className="arildo-paper">
          <div className="mx-auto max-w-4xl px-4 py-20 md:px-7 md:py-24">
            <p className="arildo-label">Dúvidas antes do orçamento</p>
            <h2 className="arildo-display mt-4 text-5xl md:text-6xl">Perguntas de obra, respostas sem enrolação.</h2>
            <div className="mt-10 border-y border-black/20">
              {faqs.map(([q, a]) => (
                <details key={q} className="arildo-faq border-b border-black/15 py-5 last:border-b-0">
                  <summary className="cursor-pointer pr-8 text-lg font-black">{q}</summary>
                  <p className="max-w-3xl pt-4 leading-relaxed text-[var(--arildo-paper-muted)]">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <footer className="arildo-footer px-4 py-8 md:px-7">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Warehouse className="h-5 w-5" />
              <p><strong>Arildo Madeiras</strong> · Pinhais — PR</p>
            </div>
            <PortfolioHostCredit linkClassName="font-bold underline underline-offset-4 hover:opacity-70" />
          </div>
        </footer>

        <div className="arildo-mobile-cta fixed inset-x-3 bottom-3 z-30 flex items-center justify-between gap-3 p-3 md:hidden">
          <div className="min-w-0">
            <p className="truncate text-xs opacity-70">Arildo Madeiras · Pinhais</p>
            <p className="truncate text-sm font-black">Orçamento de materiais</p>
          </div>
          <MaterialCta placement="floating" compact>
            Orçar <ArrowRight className="h-4 w-4" />
          </MaterialCta>
        </div>
      </main>
    </PortfolioCompositionRoot>
  );
}
