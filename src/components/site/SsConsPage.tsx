/**
 * S&S Construções — site independente do cliente em /portfolio/sscons.
 *
 * MIGRAÇÃO AUTÊNTICA (issue #60): origem Lovable a6148619-92b1-4e27-afdc-bd7864392fe5
 * (referência publicada sscons.lovable.app). Identidade preservada: carvão/grafite +
 * dourado, Playfair Display para títulos, Inter para texto, hero em tela cheia,
 * seis serviços (✦ nos destaques), galeria com lightbox, bloco institucional e
 * conversão. Os 8 assets originais vivem em /images/sscons/.
 *
 * O que NÃO foi transportado, por norma editorial da hospedagem:
 * - telefone/WhatsApp público (contato é resolvido no servidor por clientKey);
 * - depoimentos sem fonte auditável;
 * - atribuição das imagens da galeria como obras comprovadamente executadas
 *   (apresentadas como referências por tipo de serviço).
 */
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BrickWall,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Grid2x2,
  Hammer,
  HardHat,
  Layers,
  MapPin,
  Maximize2,
  Menu,
  MessageSquare,
  PaintRoller,
  Ruler,
  ShieldCheck,
  Wrench,
  X,
} from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { ManagedRich, ManagedText } from "@/components/portfolio/ManagedText";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import {
  MotionImageReveal,
  MotionReveal,
  MotionScope,
  MotionStagger,
  MotionTextReveal,
  usePrefersReducedMotion,
} from "@/components/motion";

/* ------------------------------------------------------------------ */
/* Identidade (tokens do cliente — nunca herdados da 0WEB)             */
/* ------------------------------------------------------------------ */

const BRAND_VARS = {
  "--ss-gold": "#e8b430",
  "--ss-gold-glow": "#f6c955",
  "--ss-gold-deep": "#b8891c",
  "--ss-charcoal": "hsl(220 15% 12%)",
  "--ss-charcoal-deep": "hsl(220 20% 8%)",
  "--ss-charcoal-soft": "hsl(220 14% 16%)",
  "--ss-ink": "hsl(220 15% 14%)",
  "--ss-ink-muted": "hsl(220 10% 40%)",
  "--ss-paper": "hsl(40 25% 97%)",
  "--ss-paper-deep": "hsl(40 18% 93%)",
  "--ss-line": "hsl(220 12% 88%)",
  "--ss-display": "'Playfair Display', Georgia, 'Times New Roman', serif",
} as CSSProperties;

const SITE_NAME = "S&S Construções";
const RECIPIENT = "a equipe S&S";

/* ------------------------------------------------------------------ */
/* Conteúdo (copy original do cliente, sem contatos públicos)          */
/* ------------------------------------------------------------------ */

const NAV = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Projetos", href: "#projetos" },
  { label: "Quem Somos", href: "#quem-somos" },
  { label: "Contato", href: "#contato" },
] as const;

const SERVICES = [
  {
    icon: Hammer,
    title: "Carpintaria",
    desc: "Soluções em madeira que unem beleza e funcionalidade ao seu espaço.",
    featured: false,
  },
  {
    icon: Building2,
    title: "Obras",
    desc: "Realizamos sua obra do planejamento à entrega, com eficiência e qualidade.",
    featured: true,
  },
  {
    icon: BrickWall,
    title: "Alvenaria",
    desc: "Estruturas sólidas e acabamentos impecáveis para sua construção.",
    featured: false,
  },
  {
    icon: PaintRoller,
    title: "Pintura",
    desc: "Cores e texturas que renovam ambientes e valorizam seu imóvel.",
    featured: false,
  },
  {
    icon: Wrench,
    title: "Reforma",
    desc: "Transformamos seu ambiente com soluções inteligentes e personalizadas.",
    featured: true,
  },
  {
    icon: Grid2x2,
    title: "Azulejo",
    desc: "Instalação e assentamento de azulejos com precisão e excelente acabamento.",
    featured: false,
  },
] as const;

/** Galeria original (6 imagens). Categoria = tipo de serviço de referência. */
const PROJECTS = [
  { src: "/images/sscons/projeto-01.webp", title: "Residência Moderna", category: "Obra completa" },
  { src: "/images/sscons/projeto-02.webp", title: "Cozinha Gourmet", category: "Reforma" },
  { src: "/images/sscons/projeto-03.webp", title: "Edifício Comercial", category: "Obra completa" },
  { src: "/images/sscons/projeto-04.webp", title: "Banheiro de Luxo", category: "Reforma" },
  { src: "/images/sscons/projeto-05.webp", title: "Sala de Estar", category: "Pintura" },
  { src: "/images/sscons/projeto-06.webp", title: "Área Externa", category: "Alvenaria" },
] as const;

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Compromisso com a entrega",
    desc: "Planejamento, execução e acabamento acompanhados de perto, do início ao fim da obra.",
  },
  {
    icon: Ruler,
    title: "Precisão em cada etapa",
    desc: "Medidas, prumo e alinhamento conferidos antes de avançar para o próximo serviço.",
  },
  {
    icon: Layers,
    title: "Do bruto ao acabamento",
    desc: "Carpintaria, alvenaria, pintura e azulejo em um só time, sem retrabalho entre equipes.",
  },
] as const;

const PROCESS = [
  { step: "01", title: "Conversa inicial", desc: "Você descreve o serviço, o tipo de obra e o prazo desejado." },
  { step: "02", title: "Visita e medição", desc: "Avaliamos o local em Curitiba e região para dimensionar o trabalho." },
  { step: "03", title: "Proposta clara", desc: "Escopo, etapas e materiais definidos antes de começar." },
  { step: "04", title: "Execução e entrega", desc: "Obra conduzida com acompanhamento até o acabamento final." },
] as const;

/** Funil próprio da S&S (perguntas de construção civil, sem PII no bundle). */
const quiz = {
  services: ["Carpintaria", "Obras", "Alvenaria", "Pintura", "Reforma", "Azulejo"],
  experienceOptions: [
    "Construção nova",
    "Reforma residencial",
    "Obra comercial",
    "Manutenção ou reparo",
  ],
  periodOptions: ["Curitiba", "Região Metropolitana", "Vou confirmar o endereço"],
  timingOptions: ["Preciso começar em breve", "Nos próximos meses", "Ainda estou planejando"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "Qual serviço você precisa?",
    experience: "Que tipo de obra é?",
    period: "Onde será a obra?",
    timing: "Quando pretende começar?",
    note: "Conte um pouco sobre o projeto",
  },
  stepSubtitles: {
    service: "Escolha a frente principal — podemos combinar mais de uma.",
    note: "Metragem aproximada, ambientes e o que já está definido ajudam no orçamento.",
  },
  notePlaceholder: "Ex.: reforma de cozinha com troca de piso e pintura, cerca de 12 m².",
};

/* ------------------------------------------------------------------ */
/* Botões (dourado sólido / contorno)                                  */
/* ------------------------------------------------------------------ */

const BTN_GOLD =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[var(--ss-gold)] px-7 py-3.5 text-base font-semibold text-[var(--ss-charcoal-deep)] shadow-[0_10px_30px_-10px_rgba(232,180,48,0.6)] transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[var(--ss-gold-glow)] hover:shadow-[0_16px_36px_-12px_rgba(232,180,48,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ss-gold-glow)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ss-charcoal)] active:translate-y-0";

const BTN_OUTLINE_DARK =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/25 px-7 py-3.5 text-base font-medium text-white transition-[transform,border-color,color] duration-200 hover:-translate-y-0.5 hover:border-[var(--ss-gold)] hover:text-[var(--ss-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ss-gold-glow)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ss-charcoal)]";

function GoldWord({ children }: { children: string }) {
  return (
    <em className="bg-gradient-to-r from-[var(--ss-gold)] via-[var(--ss-gold-glow)] to-[var(--ss-gold-deep)] bg-clip-text not-italic text-transparent">
      {children}
    </em>
  );
}

/* ------------------------------------------------------------------ */
/* Lightbox acessível (foco, ESC, setas, restauração de foco)          */
/* ------------------------------------------------------------------ */

function Lightbox({
  index,
  onClose,
  onStep,
  returnFocusTo,
}: {
  index: number;
  onClose: () => void;
  onStep: (delta: 1 | -1) => void;
  returnFocusTo: HTMLElement | null;
}) {
  const reduced = usePrefersReducedMotion();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const project = PROJECTS[index];

  useEffect(() => {
    setMounted(true);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      returnFocusTo?.focus();
    };
  }, [returnFocusTo]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onStep(1);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onStep(-1);
        return;
      }
      if (event.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, onStep]);

  const navBtn =
    "inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-[background-color,transform] duration-200 hover:bg-[var(--ss-gold)] hover:text-[var(--ss-charcoal-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ss-gold-glow)]";

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[var(--ss-charcoal-deep)]/95 p-4 backdrop-blur-sm"
      style={{
        opacity: mounted || reduced ? 1 : 0,
        transition: reduced ? "none" : "opacity 220ms ease-out",
      }}
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex w-full max-w-5xl flex-col gap-4"
        onClick={(event) => event.stopPropagation()}
        style={{
          transform: mounted || reduced ? "scale(1)" : "scale(0.96)",
          transition: reduced ? "none" : "transform 260ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div className="flex items-center justify-between gap-4 text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ss-gold)]">
              {project.category}
            </p>
            <h3 id={titleId} className="text-xl font-bold [font-family:var(--ss-display)]">
              {project.title}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/60" aria-live="polite">
              {index + 1} / {PROJECTS.length}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Fechar galeria"
              className={navBtn}
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--ss-charcoal)]">
          <img
            key={project.src}
            src={project.src}
            alt={`${project.title} — referência de ${project.category.toLowerCase()} da S&S Construções`}
            width={800}
            height={600}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="mx-auto max-h-[75vh] w-full object-contain"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onStep(-1)}
            aria-label="Imagem anterior"
            className={navBtn}
          >
            <ChevronLeft size={24} aria-hidden="true" />
          </button>
          <div className="hidden gap-2 sm:flex" aria-hidden="true">
            {PROJECTS.map((item, i) => (
              <span
                key={item.src}
                className={`h-1.5 w-6 rounded-full transition-[background-color] duration-200 ${
                  i === index ? "bg-[var(--ss-gold)]" : "bg-white/20"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => onStep(1)}
            aria-label="Próxima imagem"
            className={navBtn}
          >
            <ChevronRight size={24} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function SsConsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);
  const menuId = useId();

  const openLightbox = useCallback((index: number, element: HTMLElement) => {
    setTrigger(element);
    setLightbox(index);
  }, []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const stepLightbox = useCallback((delta: 1 | -1) => {
    setLightbox((current) =>
      current === null ? null : (current + delta + PROJECTS.length) % PROJECTS.length,
    );
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <MotionScope intensity="EXPRESSIVE">
      <div
        data-sscons
        style={BRAND_VARS}
        className="min-h-dvh bg-[var(--ss-charcoal)] font-sans text-[var(--ss-ink)] antialiased [scroll-behavior:smooth] motion-reduce:[scroll-behavior:auto]"
      >
        {/* ------------------------------------------------ Header */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--ss-charcoal)]/90 text-white backdrop-blur-md">
          <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <a
              href="#inicio"
              className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ss-gold-glow)]"
              aria-label="S&S Construções — voltar ao início"
            >
              <PortfolioImage
                src="/images/sscons/logo.png"
                alt=""
                width={40}
                height={40}
                managedField="logoUrl"
                className="h-10 w-10 rounded-md object-cover"
              />
              <span className="text-lg font-bold leading-none [font-family:var(--ss-display)]">
                S&amp;S <GoldWord>Construções</GoldWord>
              </span>
            </a>

            <nav aria-label="Seções do site" className="hidden items-center gap-1 md:flex">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-white/75 transition-colors duration-200 hover:text-[var(--ss-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ss-gold-glow)]"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="hidden md:block">
              <PortfolioCTAQuiz
                clientKey="sscons"
                studioName={SITE_NAME}
                theme="gold"
                mode="proposal"
                recipientName={RECIPIENT}
                quizConfig={quiz}
                ariaLabel="Solicitar orçamento com a S&S Construções"
                className={`${BTN_GOLD} min-h-11 px-5 py-2.5 text-sm`}
              >
                Solicitar orçamento
              </PortfolioCTAQuiz>
            </div>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-white transition-colors duration-200 hover:text-[var(--ss-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ss-gold-glow)] md:hidden"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>

          <div
            id={menuId}
            hidden={!menuOpen}
            className="border-t border-white/10 bg-[var(--ss-charcoal-deep)] px-4 pb-6 pt-2 md:hidden"
          >
            <nav aria-label="Seções do site (menu móvel)" className="flex flex-col">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-12 items-center justify-between border-b border-white/5 py-3 text-base font-medium text-white/85 transition-colors duration-200 hover:text-[var(--ss-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ss-gold-glow)]"
                >
                  {item.label}
                  <ArrowUpRight size={16} aria-hidden="true" className="text-[var(--ss-gold)]" />
                </a>
              ))}
            </nav>
            <div className="pt-4">
              <PortfolioCTAQuiz
                clientKey="sscons"
                studioName={SITE_NAME}
                theme="gold"
                mode="proposal"
                recipientName={RECIPIENT}
                quizConfig={quiz}
                ariaLabel="Solicitar orçamento com a S&S Construções"
                className={`${BTN_GOLD} w-full`}
              >
                Solicitar orçamento
              </PortfolioCTAQuiz>
            </div>
          </div>
        </header>

        <main>
          {/* ------------------------------------------------ Hero */}
          <section
            id="inicio"
            className="relative isolate flex min-h-[calc(100dvh-72px)] items-center overflow-hidden bg-[var(--ss-charcoal-deep)] text-white"
            aria-labelledby="ss-hero-title"
          >
            <PortfolioImage
              src="/images/sscons/hero.webp"
              alt="Equipe da S&S Construções analisando plantas em uma mesa de projeto, com canteiro de obras ao fundo"
              width={1920}
              height={1080}
              priority
              widths={[768, 1280, 1920]}
              sizes="100vw"
              managedField="heroImageUrl"
              className="absolute inset-0 -z-20 h-full w-full object-cover object-[60%_center]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-to-r from-[var(--ss-charcoal-deep)] via-[var(--ss-charcoal-deep)]/85 to-[var(--ss-charcoal-deep)]/30"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[var(--ss-charcoal)] to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-32 top-1/3 -z-10 h-[420px] w-[420px] rounded-full bg-[var(--ss-gold)]/15 blur-3xl"
            />

            <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
              <div className="max-w-3xl">
                <MotionReveal variant="fade" delay={60}>
                  <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--ss-gold)]/40 bg-[var(--ss-gold)]/10 px-4 py-1.5 text-sm font-medium text-[var(--ss-gold-glow)]">
                    <span aria-hidden="true">✦</span> Especialistas em Construção Civil
                  </p>
                </MotionReveal>

                <h1
                  id="ss-hero-title"
                  className="mb-6 text-4xl font-bold leading-[1.05] tracking-tight [font-family:var(--ss-display)] sm:text-5xl lg:text-7xl"
                >
                  <ManagedRich field="heroHeadline">
                    <MotionTextReveal text="Construindo sonhos com" as="span" className="block" />{" "}
                    <MotionReveal as="span" variant="up" delay={260} className="inline-block">
                      <GoldWord>excelência</GoldWord> em Curitiba.
                    </MotionReveal>
                  </ManagedRich>
                </h1>

                <MotionReveal variant="up" delay={380}>
                  <p className="mb-10 max-w-xl text-lg text-white/75 sm:text-xl">
                    <ManagedText
                      field="heroSubheadline"
                      fallback="Da fundação ao acabamento, seu projeto em boas mãos."
                    />
                  </p>
                </MotionReveal>

                <MotionReveal variant="up" delay={480}>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <PortfolioCTAQuiz
                      clientKey="sscons"
                      studioName={SITE_NAME}
                      theme="gold"
                      mode="proposal"
                      recipientName={RECIPIENT}
                      quizConfig={quiz}
                      ariaLabel="Pedir orçamento agora com a S&S Construções"
                      className={BTN_GOLD}
                    >
                      <ManagedText field="ctaLabel" fallback="Pedir orçamento agora" />
                      <ArrowRight size={18} aria-hidden="true" />
                    </PortfolioCTAQuiz>
                    <a href="#quem-somos" className={BTN_OUTLINE_DARK}>
                      Conheça a S&amp;S
                    </a>
                  </div>
                </MotionReveal>

                <MotionReveal variant="fade" delay={640}>
                  <ul className="mt-14 grid max-w-xl grid-cols-1 gap-3 text-sm text-white/70 sm:grid-cols-3">
                    {[
                      { icon: HardHat, label: "Obra do planejamento à entrega" },
                      { icon: MapPin, label: "Curitiba e Região Metropolitana" },
                      { icon: ShieldCheck, label: "Proposta com escopo definido" },
                    ].map(({ icon: Icon, label }) => (
                      <li key={label} className="flex items-center gap-2">
                        <Icon size={18} aria-hidden="true" className="shrink-0 text-[var(--ss-gold)]" />
                        {label}
                      </li>
                    ))}
                  </ul>
                </MotionReveal>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/40 md:flex"
            >
              <span>Role</span>
              <span className="h-10 w-px bg-gradient-to-b from-[var(--ss-gold)] to-transparent" />
            </div>
          </section>

          {/* ------------------------------------------------ Serviços */}
          <section
            id="servicos"
            className="scroll-mt-20 bg-[var(--ss-paper)] py-20 md:py-28"
            aria-labelledby="ss-servicos-title"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <MotionReveal variant="up" className="mx-auto mb-14 max-w-2xl text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--ss-ink-muted)]">
                  Nossos Serviços
                </p>
                <h2
                  id="ss-servicos-title"
                  className="mt-3 text-3xl font-bold leading-tight text-[var(--ss-ink)] [font-family:var(--ss-display)] sm:text-4xl lg:text-5xl"
                >
                  Qualidade que os seus clientes vão sentir.
                </h2>
              </MotionReveal>

              <MotionStagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" variant="up" step={80}>
                {SERVICES.map(({ icon: Icon, title, desc, featured }) => (
                  <article
                    key={title}
                    className={`group relative flex h-full flex-col rounded-2xl border p-8 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-2 focus-within:-translate-y-2 ${
                      featured
                        ? "border-[var(--ss-gold)]/50 bg-[var(--ss-charcoal)] text-white shadow-[0_24px_50px_-24px_rgba(232,180,48,0.45)] hover:shadow-[0_32px_60px_-24px_rgba(232,180,48,0.6)]"
                        : "border-[var(--ss-line)] bg-white text-[var(--ss-ink)] shadow-[0_10px_30px_-20px_rgba(20,25,35,0.35)] hover:border-[var(--ss-gold)]/60 hover:shadow-[0_24px_50px_-24px_rgba(232,180,48,0.35)]"
                    }`}
                  >
                    {featured ? (
                      <span
                        className="absolute right-6 top-6 text-lg text-[var(--ss-gold)]"
                        aria-label="Serviço em destaque"
                        role="img"
                      >
                        ✦
                      </span>
                    ) : null}
                    <span
                      className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${
                        featured
                          ? "bg-[var(--ss-gold)] text-[var(--ss-charcoal-deep)]"
                          : "bg-[var(--ss-gold)]/12 text-[var(--ss-gold-deep)]"
                      }`}
                    >
                      <Icon size={26} aria-hidden="true" />
                    </span>
                    <h3 className="mb-2 text-xl font-bold [font-family:var(--ss-display)]">{title}</h3>
                    <p className={`text-base leading-relaxed ${featured ? "text-white/70" : "text-[var(--ss-ink-muted)]"}`}>
                      {desc}
                    </p>
                    <div className="mt-auto pt-6">
                      <PortfolioCTAQuiz
                        clientKey="sscons"
                        studioName={SITE_NAME}
                        theme="gold"
                        mode="proposal"
                        service={title}
                        recipientName={RECIPIENT}
                        quizConfig={quiz}
                        ariaLabel={`Solicitar orçamento de ${title.toLowerCase()} com a S&S Construções`}
                        className={`inline-flex min-h-11 items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ss-gold-glow)] ${
                          featured
                            ? "text-[var(--ss-gold)] hover:text-[var(--ss-gold-glow)]"
                            : "text-[var(--ss-gold-deep)] hover:text-[var(--ss-ink)]"
                        }`}
                      >
                        Orçar {title.toLowerCase()}
                        <ArrowRight
                          size={16}
                          aria-hidden="true"
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </PortfolioCTAQuiz>
                    </div>
                  </article>
                ))}
              </MotionStagger>
            </div>
          </section>

          {/* ------------------------------------------------ Projetos / Galeria */}
          <section
            id="projetos"
            className="scroll-mt-20 bg-white py-20 md:py-28"
            aria-labelledby="ss-projetos-title"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <MotionReveal variant="up" className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--ss-ink-muted)]">
                    Portfólio
                  </p>
                  <h2
                    id="ss-projetos-title"
                    className="mt-3 text-3xl font-bold leading-tight text-[var(--ss-ink)] [font-family:var(--ss-display)] sm:text-4xl lg:text-5xl"
                  >
                    Projetos que nos orgulham.
                  </h2>
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-[var(--ss-ink-muted)]">
                  Referências visuais por tipo de serviço. Toque em uma imagem para ampliar e
                  navegar pela galeria.
                </p>
              </MotionReveal>

              <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3" aria-label="Galeria de referências">
                {PROJECTS.map((project, index) => (
                  <li key={project.src}>
                    <MotionImageReveal direction={index % 2 === 0 ? "up" : "left"} className="rounded-2xl">
                      <button
                        type="button"
                        onClick={(event) => openLightbox(index, event.currentTarget)}
                        aria-label={`Ampliar ${project.title} (${project.category})`}
                        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[var(--ss-paper-deep)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ss-gold)] focus-visible:ring-offset-2"
                      >
                        <PortfolioImage
                          src={project.src}
                          alt={`${project.title} — referência de ${project.category.toLowerCase()}`}
                          width={800}
                          height={600}
                          widths={[480, 800]}
                          sizes="(min-width: 1024px) 400px, 50vw"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-[var(--ss-charcoal-deep)]/85 via-[var(--ss-charcoal-deep)]/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                        />
                        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white sm:p-5">
                          <span>
                            <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ss-gold)] sm:text-xs">
                              {project.category}
                            </span>
                            <span className="block text-sm font-bold [font-family:var(--ss-display)] sm:text-lg">
                              {project.title}
                            </span>
                          </span>
                          <span
                            aria-hidden="true"
                            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur transition-[background-color,transform] duration-300 group-hover:scale-110 group-hover:bg-[var(--ss-gold)] group-hover:text-[var(--ss-charcoal-deep)] sm:inline-flex"
                          >
                            <Maximize2 size={18} />
                          </span>
                        </span>
                      </button>
                    </MotionImageReveal>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ------------------------------------------------ Quem somos */}
          <section
            id="quem-somos"
            className="relative scroll-mt-20 overflow-hidden bg-[var(--ss-charcoal)] py-20 text-white md:py-28"
            aria-labelledby="ss-sobre-title"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-40 top-0 h-[520px] w-[520px] rounded-full bg-[var(--ss-gold)]/10 blur-3xl"
            />
            <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
              <MotionReveal variant="right">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--ss-gold)]">
                  Quem Somos
                </p>
                <h2
                  id="ss-sobre-title"
                  className="mt-3 text-3xl font-bold leading-tight [font-family:var(--ss-display)] sm:text-4xl lg:text-5xl"
                >
                  Construindo o futuro com <GoldWord>base sólida</GoldWord>.
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-white/70">
                  <ManagedText
                    field="description"
                    fallback="Na S&S Construções, transformamos ideias em realidade com dedicação e profissionalismo. Nosso compromisso é entregar projetos de alta qualidade e durabilidade, superando suas expectativas."
                  />
                </p>

                <ul className="mt-10 space-y-6">
                  {PILLARS.map(({ icon: Icon, title, desc }) => (
                    <li key={title} className="flex gap-4">
                      <span className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[var(--ss-gold)]/40 bg-[var(--ss-gold)]/10 text-[var(--ss-gold)]">
                        <Icon size={20} aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="text-lg font-bold [font-family:var(--ss-display)]">{title}</h3>
                        <p className="mt-1 text-base leading-relaxed text-white/65">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  <PortfolioCTAQuiz
                    clientKey="sscons"
                    studioName={SITE_NAME}
                    theme="gold"
                    mode="proposal"
                    recipientName={RECIPIENT}
                    quizConfig={quiz}
                    ariaLabel="Fale com a equipe da S&S Construções"
                    className={BTN_GOLD}
                  >
                    Fale com a nossa equipe
                    <MessageSquare size={18} aria-hidden="true" />
                  </PortfolioCTAQuiz>
                </div>
              </MotionReveal>

              <MotionImageReveal direction="left" className="rounded-3xl">
                <figure className="relative">
                  <PortfolioImage
                    src="/images/sscons/sobre.webp"
                    alt="Profissional da construção civil conferindo o alinhamento de uma parede em obra"
                    width={800}
                    height={600}
                    sizes="(min-width: 1024px) 560px, 100vw"
                    className="aspect-[4/3] w-full rounded-3xl object-cover shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]"
                  />
                  <figcaption className="absolute -bottom-5 left-5 rounded-xl border border-[var(--ss-gold)]/40 bg-[var(--ss-charcoal-deep)]/95 px-5 py-3 text-sm text-white/80 shadow-lg backdrop-blur sm:left-8">
                    <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ss-gold)]">
                      Curitiba · PR
                    </span>
                    Obras, reformas e acabamentos
                  </figcaption>
                </figure>
              </MotionImageReveal>
            </div>
          </section>

          {/* ------------------------------------------------ Como trabalhamos */}
          <section
            className="bg-[var(--ss-paper-deep)] py-20 md:py-28"
            aria-labelledby="ss-processo-title"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <MotionReveal variant="up" className="mx-auto mb-14 max-w-2xl text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--ss-ink-muted)]">
                  Como trabalhamos
                </p>
                <h2
                  id="ss-processo-title"
                  className="mt-3 text-3xl font-bold leading-tight text-[var(--ss-ink)] [font-family:var(--ss-display)] sm:text-4xl"
                >
                  Do primeiro contato à entrega da obra.
                </h2>
              </MotionReveal>

              <ol className="relative grid gap-8 md:grid-cols-4">
                <span
                  aria-hidden="true"
                  className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-[var(--ss-gold)]/60 to-transparent md:block"
                />
                {PROCESS.map((item, index) => (
                  <MotionReveal as="li" key={item.step} variant="up" delay={index * 90} className="relative">
                    <span className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--ss-gold)] bg-[var(--ss-charcoal)] text-lg font-bold text-[var(--ss-gold)] [font-family:var(--ss-display)]">
                      {item.step}
                    </span>
                    <h3 className="mt-5 text-lg font-bold text-[var(--ss-ink)] [font-family:var(--ss-display)]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-[var(--ss-ink-muted)]">{item.desc}</p>
                  </MotionReveal>
                ))}
              </ol>
            </div>
          </section>

          {/* ------------------------------------------------ Contato */}
          <section
            id="contato"
            className="scroll-mt-20 bg-[var(--ss-paper)] py-20 md:py-28"
            aria-labelledby="ss-contato-title"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <MotionReveal variant="up" className="mx-auto mb-14 max-w-2xl text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--ss-ink-muted)]">
                  Contato
                </p>
                <h2
                  id="ss-contato-title"
                  className="mt-3 text-3xl font-bold leading-tight text-[var(--ss-ink)] [font-family:var(--ss-display)] sm:text-4xl lg:text-5xl"
                >
                  Fale com a gente agora.
                </h2>
              </MotionReveal>

              <MotionStagger className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3" variant="up" step={90}>
                {[
                  {
                    icon: MessageSquare,
                    title: "Atendimento",
                    body: "Pelo formulário desta página. Sua solicitação chega direto à equipe da S&S.",
                  },
                  { icon: Clock, title: "Horário", body: "Atendimento 24 horas para orçamentos." },
                  { icon: MapPin, title: "Endereço", body: "Curitiba, PR — atendemos a Região Metropolitana." },
                ].map(({ icon: Icon, title, body }) => (
                  <div
                    key={title}
                    className="h-full rounded-2xl border border-[var(--ss-line)] bg-white p-8 text-center shadow-[0_10px_30px_-20px_rgba(20,25,35,0.35)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(232,180,48,0.35)]"
                  >
                    <span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--ss-gold)]/12 text-[var(--ss-gold-deep)]">
                      <Icon size={24} aria-hidden="true" />
                    </span>
                    <h3 className="mb-1 text-lg font-bold text-[var(--ss-ink)] [font-family:var(--ss-display)]">
                      {title}
                    </h3>
                    <p className="text-base leading-relaxed text-[var(--ss-ink-muted)]">{body}</p>
                  </div>
                ))}
              </MotionStagger>

              <MotionReveal variant="scale" className="mt-14">
                <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-[var(--ss-charcoal)] px-6 py-12 text-center text-white sm:px-12">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[var(--ss-gold)]/20 blur-3xl"
                  />
                  <h3 className="text-2xl font-bold [font-family:var(--ss-display)] sm:text-3xl">
                    Pronto para começar o seu projeto?
                  </h3>
                  <p className="mx-auto mt-3 max-w-xl text-base text-white/70 sm:text-lg">
                    Responda a quatro perguntas rápidas e a equipe da S&amp;S retorna com os próximos
                    passos para o seu orçamento.
                  </p>
                  <div className="mt-8 flex justify-center">
                    <PortfolioCTAQuiz
                      clientKey="sscons"
                      studioName={SITE_NAME}
                      theme="gold"
                      mode="proposal"
                      recipientName={RECIPIENT}
                      quizConfig={quiz}
                      ariaLabel="Solicitar orçamento com a S&S Construções"
                      className={BTN_GOLD}
                    >
                      Solicitar orçamento
                      <ArrowRight size={18} aria-hidden="true" />
                    </PortfolioCTAQuiz>
                  </div>
                </div>
              </MotionReveal>
            </div>
          </section>
        </main>

        {/* ------------------------------------------------ Rodapé do cliente */}
        <footer className="border-t border-white/10 bg-[var(--ss-charcoal-deep)] px-4 py-10 text-center text-white sm:px-6">
          <p className="text-lg font-bold [font-family:var(--ss-display)]">
            S&amp;S <GoldWord>Construções</GoldWord>
          </p>
          <p className="mt-1 text-sm text-white/50">Construção civil em Curitiba e região.</p>
          <p className="mt-4 text-sm text-white/50">
            © {new Date().getFullYear()} S&amp;S Construções. Todos os direitos reservados.
          </p>
          <PortfolioHostCredit
            className="mt-2 text-xs text-white/45"
            linkClassName="font-semibold text-white/80 underline underline-offset-4 hover:text-[var(--ss-gold)]"
          />
        </footer>

        {lightbox !== null ? (
          <Lightbox
            index={lightbox}
            onClose={closeLightbox}
            onStep={stepLightbox}
            returnFocusTo={trigger}
          />
        ) : null}

        {/* Mecanismos compartilhados da hospedagem — conteúdo do cliente, sem prova social inventada. */}
        <PortfolioSocialProofPopup
          clientKey="sscons"
          eyebrow={SITE_NAME}
          title="Planejando uma obra ou reforma?"
          description="Conte o serviço e receba os próximos passos do orçamento com a equipe da S&S."
          ctaLabel="Ver serviços"
          ctaHref="#servicos"
          accentClassName="text-[var(--ss-gold-deep)]"
        />
        <PortfolioUpsellPopup pageName="portfolio-sscons" />
      </div>
    </MotionScope>
  );
}
