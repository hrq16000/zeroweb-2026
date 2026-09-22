import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Crown,
  ExternalLink,
  Facebook,
  Footprints,
  Headphones,
  Instagram,
  MapPin,
  PackageOpen,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Store,
  Tag,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import {
  MotionOverlay,
  MotionReveal,
  MotionScope,
  MotionStagger,
} from "@/components/motion";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import {
  CENTRO_MEGA_DEMO_PRODUCTS,
  CENTRO_MEGA_SOCIAL_FEED,
  CENTRO_MEGA_SOCIAL_SOURCES,
  CENTRO_MEGA_STORE_SOURCES,
  type CentroMegaDemoProduct,
} from "@/config/centro-mega-demo-products";

const quiz = {
  services: [
    "Celular / smartphone",
    "Tênis e calçados",
    "Bonés / outlet",
    "Acessórios",
    "Assistência técnica",
    "Quero consultar outro produto",
  ],
  experienceOptions: [
    "Vi um produto nesta loja virtual",
    "Vi uma oferta nas redes sociais",
    "Quero comparar algumas opções",
    "Preciso de orientação da loja",
  ],
  periodOptions: [
    "São José dos Pinhais",
    "Curitiba",
    "Quero combinar retirada / entrega",
    "Ainda vou decidir",
  ],
  timingOptions: [
    "Quero consultar agora",
    "Ainda nesta semana",
    "Estou pesquisando",
    "Sem pressa — quero conhecer as opções",
  ],
  proposalKind: "service" as const,
  stepTitles: {
    service: "O que você quer consultar?",
    experience: "Como você chegou nesta seleção?",
    period: "Qual região faz mais sentido para você?",
    timing: "Quando pretende avançar?",
    note: "Quer acrescentar algum detalhe?",
  },
  notePlaceholder: "Modelo, cor, tamanho, faixa de preço ou outra preferência.",
};

const categories = ["Todos", "Celulares", "Outlet", "Tênis", "Bonés", "Calçados", "Acessórios"] as const;
type CategoryFilter = (typeof categories)[number];

const accentStyles = {
  cyan: {
    border: "border-cyan-300/30",
    glow: "from-cyan-300/30 via-cyan-400/5 to-transparent",
    chip: "bg-cyan-300 text-[#06101f]",
    icon: "text-cyan-200",
  },
  violet: {
    border: "border-violet-300/30",
    glow: "from-violet-400/30 via-violet-400/5 to-transparent",
    chip: "bg-violet-300 text-[#090516]",
    icon: "text-violet-200",
  },
  gold: {
    border: "border-amber-300/35",
    glow: "from-amber-300/30 via-amber-300/5 to-transparent",
    chip: "bg-amber-300 text-[#171005]",
    icon: "text-amber-200",
  },
  amber: {
    border: "border-amber-300/35",
    glow: "from-amber-300/30 via-amber-300/5 to-transparent",
    chip: "bg-amber-300 text-[#171005]",
    icon: "text-amber-200",
  },
  blue: {
    border: "border-blue-300/30",
    glow: "from-blue-400/30 via-blue-400/5 to-transparent",
    chip: "bg-blue-300 text-[#06101f]",
    icon: "text-blue-200",
  },
  pink: {
    border: "border-fuchsia-300/30",
    glow: "from-fuchsia-400/30 via-fuchsia-400/5 to-transparent",
    chip: "bg-fuchsia-300 text-[#190516]",
    icon: "text-fuchsia-200",
  },
  lime: {
    border: "border-lime-300/30",
    glow: "from-lime-300/30 via-lime-300/5 to-transparent",
    chip: "bg-lime-300 text-[#0b1603]",
    icon: "text-lime-200",
  },
} as const;

function ProductVisual({ product, compact = false }: { product: CentroMegaDemoProduct; compact?: boolean }) {
  const style = accentStyles[product.accent];
  const iconClass = compact ? "h-9 w-9" : "h-20 w-20 sm:h-24 sm:w-24";
  const heightClass = compact ? "h-24" : "h-56 sm:h-64";

  if (product.imageUrl) {
    return (
      <div className={"relative overflow-hidden bg-white " + heightClass}>
        <PortfolioImage
          src={product.imageUrl}
          alt={product.imageAlt ?? product.name}
          width={720}
          height={720}
          loading={compact ? "lazy" : undefined}
          className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-[1.04]"
        />
        {!compact && product.imageSourceUrl && (
          <a
            href={product.imageSourceUrl}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-3 left-3 right-3 inline-flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-white/90 px-3 py-2 text-[10px] font-black uppercase tracking-[.12em] text-[#071022] shadow-lg backdrop-blur transition hover:bg-white"
          >
            <span className="truncate">{product.imageSourceLabel ?? "Mídia pública verificada"}</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </a>
        )}
      </div>
    );
  }

  if (product.visual === "phone") {
    return (
      <div className={"relative grid place-items-center " + heightClass}>
        <div className={"absolute inset-7 rounded-full bg-gradient-to-br blur-3xl " + style.glow} />
        <div className="mega-product-float relative h-[72%] aspect-[.5] rounded-[1.8rem] border border-white/20 bg-gradient-to-br from-white/15 to-white/[.03] p-2 shadow-[0_35px_80px_rgba(0,0,0,.45)]">
          <div className="h-full rounded-[1.35rem] border border-white/10 bg-[#05070d] p-3">
            <div className="mx-auto h-1.5 w-10 rounded-full bg-white/15" />
            <div className="mt-4 grid h-[72%] place-items-center rounded-2xl bg-[radial-gradient(circle_at_35%_30%,rgba(53,212,237,.55),transparent_34%),radial-gradient(circle_at_70%_70%,rgba(168,85,247,.5),transparent_38%),#071120]">
              <Smartphone className={iconClass + " text-white/90"} strokeWidth={1.2} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const Icon =
    product.visual === "sneaker" || product.visual === "shoe"
      ? Footprints
      : product.visual === "cap"
        ? Crown
        : product.visual === "accessory"
          ? Headphones
          : PackageOpen;

  return (
    <div className={"relative grid place-items-center overflow-hidden " + heightClass}>
      <div className={"absolute inset-7 rounded-full bg-gradient-to-br blur-3xl " + style.glow} />
      <div className="mega-product-float relative grid aspect-square h-[72%] place-items-center rounded-[2rem] border border-white/15 bg-white/[.055] shadow-[0_35px_80px_rgba(0,0,0,.35)]">
        <Icon className={iconClass + " " + style.icon} strokeWidth={1.25} />
        <span className="absolute bottom-4 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] font-black uppercase tracking-[.2em] text-white/60">
          {product.category}
        </span>
      </div>
    </div>
  );
}

function StoreCTA({
  children,
  selected,
  className,
}: {
  children: React.ReactNode;
  selected: CentroMegaDemoProduct[];
  className: string;
}) {
  const selectedNames = selected.map((item) => item.name);
  const seededService = selectedNames.length ? selectedNames.join(" + ") : undefined;

  return (
    <PortfolioCTAQuiz
      clientKey="centro-mega"
      studioName="Centro Mega Store"
      recipientName="a equipe Centro Mega"
      theme="navy"
      mode="proposal"
      funnelIntent="pedido"
      quizConfig={quiz}
      initialAnswers={seededService ? { service: seededService, experience: "Seleção feita na loja virtual" } : undefined}
      skipPrefilledSteps={Boolean(seededService)}
      orderContext={{
        order_items: selectedNames.length ? selectedNames.join(" | ") : "Consulta geral da loja virtual Centro Mega",
        fulfillment: "A combinar com a Centro Mega",
        customer_note:
          "Pedido iniciado pela loja virtual Centro Mega. Confirmar preço, estoque, tamanho, cor, condição comercial e disponibilidade atuais antes de concluir a compra.",
      }}
      className={className}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

function ProductCard({
  product,
  selected,
  onToggle,
  onOpen,
}: {
  product: CentroMegaDemoProduct;
  selected: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  const style = accentStyles[product.accent];
  return (
    <article
      className={
        "group relative overflow-hidden rounded-[2rem] border bg-white/[.045] transition duration-500 hover:-translate-y-2 hover:bg-white/[.075] hover:shadow-[0_35px_100px_rgba(0,0,0,.35)] " +
        style.border
      }
    >
      <div className={"absolute -right-16 -top-20 h-52 w-52 rounded-full bg-gradient-to-br blur-3xl transition group-hover:scale-125 " + style.glow} />
      <div className="relative">
        <ProductVisual product={product} />
        <div className="px-6 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className={"rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[.16em] " + style.chip}>
              {product.badge}
            </span>
            {product.sourceDate && (
              <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-white/55">
                {product.sourceDate}
              </span>
            )}
          </div>

          <h3 className="mt-5 text-2xl font-black tracking-[-.035em] text-white">{product.name}</h3>
          <p className="mt-3 min-h-14 text-sm leading-6 text-white/58">{product.description}</p>

          {product.historicalPrice ? (
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-white/40">Preço histórico da publicação</p>
              <div className="mt-1 flex items-end gap-3">
                <strong className="text-2xl font-black text-white">{product.historicalPrice.after}</strong>
                {product.historicalPrice.before && (
                  <span className="pb-0.5 text-sm text-white/35 line-through">{product.historicalPrice.before}</span>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-black/15 p-4">
              <p className="text-sm font-bold text-white/75">Preço e estoque: consultar agora</p>
            </div>
          )}

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={onToggle}
              aria-pressed={selected}
              className={
                "inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 " +
                (selected
                  ? "bg-white text-[#07111f]"
                  : "bg-cyan-300 text-[#06101f] hover:bg-white")
              }
            >
              {selected ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
              {selected ? "Na seleção" : "Adicionar"}
            </button>
            <button
              type="button"
              onClick={onOpen}
              className="grid min-h-12 min-w-12 place-items-center rounded-2xl border border-white/15 bg-white/5 text-white transition hover:border-white/35 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              aria-label={"Ver detalhes de " + product.name}
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function CentroMegaPage() {
  const [category, setCategory] = useState<CategoryFilter>("Todos");
  const [search, setSearch] = useState("");
  const [cartIds, setCartIds] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<CentroMegaDemoProduct | null>(null);

  const selectedProducts = useMemo(
    () => CENTRO_MEGA_DEMO_PRODUCTS.filter((product) => cartIds.includes(product.id)),
    [cartIds],
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    return CENTRO_MEGA_DEMO_PRODUCTS.filter((product) => {
      const categoryMatch = category === "Todos" || product.category === category;
      const searchMatch =
        !query ||
        [product.name, product.category, product.description, product.badge]
          .join(" ")
          .toLocaleLowerCase("pt-BR")
          .includes(query);
      return categoryMatch && searchMatch;
    });
  }, [category, search]);

  const toggleCart = (productId: string) => {
    setCartIds((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId],
    );
  };

  return (
    <MotionScope intensity="EXPRESSIVE">
      <div
        data-client-slug="centro-mega"
        className="min-h-dvh overflow-x-clip bg-[#05070c] text-white selection:bg-cyan-300 selection:text-[#06101f]"
      >
        <style>{`
          @keyframes megaMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          @keyframes megaFloat { 0%,100% { transform: translate3d(0,0,0) rotate(-1deg); } 50% { transform: translate3d(0,-10px,0) rotate(1deg); } }
          @keyframes megaScan { from { transform: translateY(-120%); } to { transform: translateY(620%); } }
          @keyframes megaHeroDrift { 0%,100% { transform: translate3d(0,0,0) rotate(.25deg); } 50% { transform: translate3d(0,-8px,0) rotate(-.25deg); } }
          .mega-marquee { animation: megaMarquee 28s linear infinite; width: max-content; }
          .mega-hero-drift { animation: megaHeroDrift 10s ease-in-out infinite; }
          .mega-product-float { animation: megaFloat 5.6s ease-in-out infinite; }
          .mega-scan { animation: megaScan 4.2s linear infinite; }
          @media (prefers-reduced-motion: reduce) {
            .mega-marquee,.mega-hero-drift,.mega-product-float,.mega-scan { animation: none !important; }
          }
        `}</style>

        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05070c]/94 px-4 py-3 backdrop-blur-md lg:px-8">
          <div className="mx-auto flex max-w-[92rem] items-center justify-between gap-4">
            <a href="#inicio" className="flex min-w-0 items-center gap-3" aria-label="Centro Mega Store — início">
              <span
                aria-hidden="true"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyan-300/25 bg-[linear-gradient(135deg,rgba(34,211,238,.22),rgba(168,85,247,.18))] text-[11px] font-black tracking-[-.08em] text-white shadow-[0_0_28px_rgba(34,211,238,.12)]"
              >
                CM
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-black uppercase tracking-[.16em]">Centro Mega</p>
                <p className="truncate text-[10px] font-bold uppercase tracking-[.22em] text-cyan-300">Loja Online · Tech + Outlet</p>
              </div>
            </a>

            <nav className="hidden items-center gap-6 text-xs font-black uppercase tracking-[.14em] text-white/60 lg:flex">
              <a href="#vitrine" className="transition hover:text-cyan-200">Vitrine</a>
              <a href="#social" className="transition hover:text-cyan-200">Redes</a>
              <a href="#lojas" className="transition hover:text-cyan-200">Canais</a>
            </nav>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-sm font-black transition hover:border-cyan-300/60 hover:bg-cyan-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Minha seleção</span>
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-cyan-300 px-1 text-xs text-[#06101f]">
                {selectedProducts.length}
              </span>
            </button>
          </div>
        </header>

        <main>
          <section id="inicio" className="relative isolate overflow-hidden px-4 pb-18 pt-14 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28">
            <div className="absolute inset-0 -z-30 opacity-25 bg-[linear-gradient(rgba(34,211,238,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.16)_1px,transparent_1px)] bg-[size:54px_54px]" />
            <div className="absolute left-[-12rem] top-[-10rem] -z-20 h-[34rem] w-[34rem] rounded-full bg-cyan-400/20 blur-[110px]" />
            <div className="absolute right-[-8rem] top-[8rem] -z-20 h-[32rem] w-[32rem] rounded-full bg-violet-500/20 blur-[120px]" />
            <div className="absolute bottom-[-12rem] left-[35%] -z-20 h-[30rem] w-[30rem] rounded-full bg-fuchsia-500/10 blur-[120px]" />

            <div className="mx-auto max-w-[92rem]">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
                <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[.22em] text-cyan-200">
                  <Sparkles className="h-4 w-4" />
                  Loja virtual Centro Mega
                </span>
                <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[.18em] text-white/45">
                  <ShieldCheck className="h-4 w-4 text-lime-300" />
                  Produtos sociais + categorias confirmadas
                </span>
              </div>

              <div className="grid gap-12 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
                <div>
                  <MotionReveal as="p" variant="left" className="text-xs font-black uppercase tracking-[.28em] text-cyan-300">
                    Centro Mega // loja viva
                  </MotionReveal>
                  <MotionReveal as="h1" variant="mask" className="mt-5 max-w-5xl text-[clamp(4rem,9vw,9rem)] font-black uppercase leading-[.78] tracking-[-.07em]">
                    Tech.
                    <span className="block bg-gradient-to-r from-cyan-200 via-white to-violet-300 bg-clip-text text-transparent">
                      Outlet.
                    </span>
                    <span className="block text-white/92">Mega.</span>
                  </MotionReveal>
                  <MotionReveal variant="up" delay={140}>
                    <p className="mt-7 max-w-2xl text-lg leading-8 text-white/65 sm:text-xl">
                      Uma loja virtual que transforma posts, ofertas e categorias da Centro Mega em uma experiência de compra visual, pesquisável e pronta para gerar pedidos.
                    </p>
                  </MotionReveal>

                  <MotionReveal variant="up" delay={220} className="mt-8 flex flex-wrap gap-3">
                    <a
                      href="#vitrine"
                      className="inline-flex min-h-13 items-center gap-2 rounded-full bg-cyan-300 px-6 py-3.5 text-sm font-black text-[#06101f] shadow-[0_0_45px_rgba(34,211,238,.22)] transition hover:-translate-y-1 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      Explorar a vitrine <ArrowRight className="h-4 w-4" />
                    </a>
                    <StoreCTA
                      selected={selectedProducts}
                      className="inline-flex min-h-13 items-center gap-2 rounded-full border border-white/20 bg-white/[.04] px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-1 hover:border-violet-300/60 hover:bg-violet-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                    >
                      Consultar ofertas <ShoppingBag className="h-4 w-4" />
                    </StoreCTA>
                  </MotionReveal>

                  <div className="mt-10 flex flex-wrap gap-2">
                    {["CELULARES", "TÊNIS", "BONÉS", "CALÇADOS", "OUTLET", "ACESSÓRIOS"].map((item, index) => (
                      <span
                        key={item}
                        className={
                          "rounded-full border px-3 py-1.5 text-[10px] font-black tracking-[.16em] " +
                          (index % 3 === 0
                            ? "border-cyan-300/25 bg-cyan-300/10 text-cyan-200"
                            : index % 3 === 1
                              ? "border-violet-300/25 bg-violet-300/10 text-violet-200"
                              : "border-fuchsia-300/25 bg-fuchsia-300/10 text-fuchsia-200")
                        }
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mega-hero-drift relative mx-auto w-full min-w-0 max-w-2xl overflow-hidden rounded-[3rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 via-white/[.025] to-violet-400/10 p-4 shadow-[0_50px_140px_rgba(0,0,0,.55)] sm:p-7">
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[3rem]">
                    <div className="mega-scan absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-cyan-200/10 to-transparent" />
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
                    <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />
                  </div>

                  <div className="relative grid min-w-0 gap-4 sm:grid-cols-2">
                    {CENTRO_MEGA_DEMO_PRODUCTS.slice(0, 2).map((product, index) => (
                      <article
                        key={product.id}
                        className={
                          "group min-w-0 overflow-hidden rounded-[2rem] border bg-[#080d18]/92 p-4 shadow-2xl " +
                          (index === 0 ? "border-cyan-300/25 sm:translate-y-4" : "border-violet-300/25 sm:-translate-y-2")
                        }
                      >
                        <div className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-white">
                          <ProductVisual product={product} compact />
                        </div>
                        <p className={"mt-4 text-[10px] font-black uppercase tracking-[.18em] " + (index === 0 ? "text-cyan-300" : "text-violet-300")}>
                          {index === 0 ? "Social drop" : "Outlet drop"}
                        </p>
                        <p className="mt-1 line-clamp-2 text-lg font-black leading-tight text-white sm:text-xl">
                          {product.name}
                        </p>
                        <p className="mt-2 text-xs leading-5 text-white/50">
                          Foto pública versionada · consulte preço e estoque atuais
                        </p>
                      </article>
                    ))}
                  </div>

                  <div className="relative mt-4 flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-[1.6rem] border border-white/10 bg-black/25 px-4 py-3 backdrop-blur">
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[.18em] text-cyan-200">Loja online</p>
                      <p className="truncate text-sm font-bold text-white/70">Produtos reais + últimas publicações sociais</p>
                    </div>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-white/10 shadow-[0_0_50px_rgba(34,211,238,.2)]">
                      <Zap className="h-5 w-5 text-cyan-200" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="overflow-hidden border-y border-white/10 bg-white/[.035] py-3">
            <div className="mega-marquee flex gap-10 whitespace-nowrap text-[11px] font-black uppercase tracking-[.22em] text-white/55">
              {[0, 1].flatMap(() => [
                "OFERTAS VISTAS NAS REDES",
                "SMARTPHONES",
                "OUTLET SÃO JOSÉ DOS PINHAIS",
                "TÊNIS",
                "BONÉS",
                "CALÇADOS",
                "ACESSÓRIOS",
                "CONSULTE PREÇO E ESTOQUE ATUAIS",
              ]).map((item, index) => (
                <span key={index} className="inline-flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <section id="vitrine" className="px-4 py-20 sm:py-28 lg:px-8">
            <div className="mx-auto max-w-[92rem]">
              <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.24em] text-cyan-300">Vitrine online</p>
                  <h2 className="mt-4 text-5xl font-black tracking-[-.055em] sm:text-7xl">
                    Posts viram produtos.
                    <span className="block text-white/35">Categorias viram prateleiras.</span>
                  </h2>
                </div>
                <div className="lg:justify-self-end">
                  <div className="flex max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-white/[.045] px-4 py-3 focus-within:border-cyan-300/45">
                    <Search className="h-5 w-5 text-white/35" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Buscar celular, tênis, outlet..."
                      aria-label="Buscar produtos da loja"
                      className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                    />
                    {search && (
                      <button type="button" onClick={() => setSearch("")} className="rounded-full p-1 text-white/40 hover:text-white" aria-label="Limpar busca">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-2 overflow-x-auto pb-2" aria-label="Categorias de produtos">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    aria-pressed={category === item}
                    className={
                      "min-h-11 shrink-0 rounded-full border px-4 text-xs font-black uppercase tracking-[.14em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 " +
                      (category === item
                        ? "border-cyan-300 bg-cyan-300 text-[#06101f]"
                        : "border-white/10 bg-white/[.035] text-white/55 hover:border-white/25 hover:text-white")
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-10">
                {filteredProducts.length ? (
                  <MotionStagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" variant="up" step={85}>
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        selected={cartIds.includes(product.id)}
                        onToggle={() => toggleCart(product.id)}
                        onOpen={() => setActiveProduct(product)}
                      />
                    ))}
                  </MotionStagger>
                ) : (
                  <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/[.025] px-6 py-16 text-center">
                    <Search className="mx-auto h-9 w-9 text-white/25" />
                    <h3 className="mt-5 text-2xl font-black">Nenhum item nesta busca.</h3>
                    <p className="mt-2 text-white/45">Tente outra categoria ou limpe o termo pesquisado.</p>
                  </div>
                )}
              </div>

              <div className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/[.06] px-5 py-4 text-sm leading-6 text-amber-50/70">
                <strong className="text-amber-200">Compra assistida:</strong> preços históricos aparecem apenas quando a própria publicação indexada trouxe o valor. Estoque, preço atual, cor, grade, garantia e condição comercial devem ser confirmados antes da compra.
              </div>
            </div>
          </section>

          <section id="social" className="relative overflow-hidden border-y border-white/10 bg-[#080b14] px-4 py-20 sm:py-28 lg:px-8">
            <div className="absolute -left-48 top-20 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-[120px]" />
            <div className="absolute -right-48 bottom-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
            <div className="relative mx-auto max-w-[92rem]">
              <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.24em] text-fuchsia-300">Social commerce</p>
                  <h2 className="mt-4 text-5xl font-black tracking-[-.055em] sm:text-7xl">A rede social vira prateleira.</h2>
                  <p className="mt-6 max-w-xl text-lg leading-8 text-white/55">
                    A loja transforma evidências públicas, catálogo do seller e categorias reais em uma vitrine organizada. O Instagram continua como fonte viva de novidades; o catálogo só promove fatos que conseguimos resolver com segurança.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href={CENTRO_MEGA_STORE_SOURCES.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-12 items-center gap-2 rounded-full border border-fuchsia-300/30 bg-fuchsia-300/10 px-5 text-sm font-black text-fuchsia-100 transition hover:bg-fuchsia-300/20"
                    >
                      <Instagram className="h-4 w-4" /> Instagram oficial
                    </a>
                    <a
                      href={CENTRO_MEGA_STORE_SOURCES.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-12 items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/20"
                    >
                      <Facebook className="h-4 w-4" /> Facebook
                    </a>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/[.035] p-5 sm:p-6">
                  <p className="text-[10px] font-black uppercase tracking-[.2em] text-white/35">Atividade pública confirmada</p>
                  <div className="mt-4 divide-y divide-white/10">
                    {CENTRO_MEGA_SOCIAL_FEED.slice(0, 3).map((post) => (
                      <a
                        key={post.href + post.title}
                        href={post.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-black uppercase tracking-[.14em] text-fuchsia-200/70">
                            {post.platform} · {post.date ?? "canal oficial"}
                          </p>
                          <p className="mt-1 text-lg font-black tracking-[-.02em] text-white">{post.title}</p>
                          <p className="mt-1 line-clamp-2 text-sm leading-6 text-white/45">{post.description}</p>
                        </div>
                        <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-white/25 transition group-hover:text-fuchsia-200" />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="mt-10">
                  <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[.22em] text-fuchsia-300">Instagram oficial · mídia real</p>
                      <h3 className="mt-2 text-3xl font-black tracking-[-.04em] sm:text-4xl">Posts e reels da própria Centro Mega.</h3>
                    </div>
                    <a
                      href={CENTRO_MEGA_STORE_SOURCES.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-fuchsia-300/30 px-4 text-xs font-black uppercase tracking-[.12em] text-fuchsia-100 transition hover:bg-fuchsia-300/10"
                    >
                      Abrir perfil <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {CENTRO_MEGA_SOCIAL_SOURCES.filter(
                      (source) => source.kind === "Instagram" && /\/(?:p|reel)\//.test(source.href),
                    ).map((source) => {
                      if (!("mediaUrl" in source) || !("mediaAlt" in source) || !source.mediaUrl) return null;

                      return (
                        <a
                          key={source.href}
                          href={source.href}
                          target="_blank"
                          rel="noreferrer"
                          className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[.04] transition hover:-translate-y-1 hover:border-fuchsia-300/35 hover:bg-white/[.065]"
                        >
                          <div className="relative aspect-[4/5] overflow-hidden bg-white">
                            <PortfolioImage
                              src={source.mediaUrl}
                              alt={source.mediaAlt}
                              width={1080}
                              height={1350}
                              loading="lazy"
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-4 pb-4 pt-14">
                              <div className="flex items-center justify-between gap-3">
                                <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-black uppercase tracking-[.14em] text-white">
                                  {source.label}
                                </span>
                                <ExternalLink className="h-4 w-4 text-white/80" aria-hidden="true" />
                              </div>
                            </div>
                          </div>
                          <div className="border-t border-white/10 px-4 py-4">
                            <p className="text-xs leading-5 text-white/55">
                              {"provenance" in source ? source.provenance : "Instagram oficial @centro.mega"}
                            </p>
                            {"shortcode" in source && (
                              <p className="mt-2 text-[10px] font-black uppercase tracking-[.14em] text-fuchsia-200/75">
                                {source.shortcode}
                              </p>
                            )}
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="lojas" className="px-4 py-20 sm:py-28 lg:px-8">
            <div className="mx-auto max-w-[92rem]">
              <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
                <div className="overflow-hidden rounded-[2.5rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 via-white/[.035] to-violet-500/10 p-7 sm:p-10">
                  <div className="flex flex-wrap items-start justify-between gap-6">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[.24em] text-cyan-300">Ecossistema Centro Mega</p>
                      <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-.05em] sm:text-6xl">
                        Loja física, outlet e presença digital no mesmo fluxo.
                      </h2>
                    </div>
                    <Store className="h-16 w-16 text-cyan-200/50" strokeWidth={1} />
                  </div>
                  <p className="mt-6 max-w-3xl text-lg leading-8 text-white/55">
                    O Linktree oficial lista SAC, Centro Mega Outlet — São José dos Pinhais, Galeria Di Brunno, Shopping Cidade, Pinheirinho e Instagram. A loja organiza essa presença como uma jornada comercial única.
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {[
                      "Centro Mega Outlet · São José dos Pinhais",
                      "Centro Mega · Galeria Di Brunno",
                      "Centro Mega · Shopping Cidade",
                      "Centro Mega · Pinheirinho",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 py-4">
                        <MapPin className="h-5 w-5 shrink-0 text-cyan-300" />
                        <span className="text-sm font-bold text-white/75">{item}</span>
                      </div>
                    ))}
                  </div>
                  <a
                    href={CENTRO_MEGA_STORE_SOURCES.linktree}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-black text-[#06101f] transition hover:-translate-y-1"
                  >
                    Ver canais oficiais <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                <div className="rounded-[2.5rem] border border-white/10 bg-white/[.035] p-7 sm:p-10">
                  <p className="text-xs font-black uppercase tracking-[.24em] text-amber-300">Como comprar nesta loja</p>
                  <div className="mt-7 space-y-6">
                    {[
                      ["01", "Explore", "Filtre categorias e encontre produtos ou oportunidades."],
                      ["02", "Selecione", "Adicione itens à sua seleção sem assumir estoque ou preço atual."],
                      ["03", "Contexto", "A seleção entra automaticamente no funil individual da Centro Mega."],
                      ["04", "Confirme", "A equipe confirma disponibilidade, valor, tamanho, cor e forma de atendimento."],
                    ].map(([number, title, body]) => (
                      <div key={number} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-white/10 pb-6 last:border-b-0 last:pb-0">
                        <span className="font-mono text-sm font-black text-amber-300">{number}</span>
                        <div>
                          <h3 className="text-lg font-black">{title}</h3>
                          <p className="mt-1 text-sm leading-6 text-white/45">{body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 pb-20 lg:px-8">
            <div className="mx-auto max-w-[92rem] overflow-hidden rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,.18),transparent_30%),radial-gradient(circle_at_85%_70%,rgba(168,85,247,.18),transparent_35%),#090d18] p-7 sm:p-12 lg:p-16">
              <div className="grid gap-9 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.24em] text-cyan-300">Sua seleção está pronta?</p>
                  <h2 className="mt-4 max-w-5xl text-5xl font-black tracking-[-.06em] sm:text-7xl">
                    Da vitrine para a conversa,
                    <span className="block text-white/35">sem perder o contexto.</span>
                  </h2>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-white/55">
                    O pedido sai da vitrine com os itens escolhidos e segue pelo funil individual da Centro Mega. Nada de WhatsApp exposto, carrinho sem saída ou mistura de clientes.
                  </p>
                </div>
                <div className="min-w-[18rem]">
                  <StoreCTA
                    selected={selectedProducts}
                    className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-7 py-4 text-sm font-black text-[#06101f] shadow-[0_0_55px_rgba(34,211,238,.22)] transition hover:-translate-y-1 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {selectedProducts.length
                      ? `Consultar ${selectedProducts.length} item${selectedProducts.length > 1 ? "s" : ""}`
                      : "Consultar uma oferta"}
                    <ArrowRight className="h-4 w-4" />
                  </StoreCTA>
                  <p className="mt-3 text-center text-[11px] leading-5 text-white/35">
                    Estoque e valores atuais são confirmados pela equipe antes da compra.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 bg-[#030509] px-4 py-8 lg:px-8">
          <div className="mx-auto flex max-w-[92rem] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-4">
              <PortfolioImage
                src="/images/centro-mega/logo.png"
                alt="Centro Mega"
                width={500}
                height={500}
                managedField="logoUrl"
                loading="lazy"
                className="h-12 w-12 rounded-xl object-cover ring-1 ring-white/10"
              />
              <div>
                <p className="font-black uppercase tracking-[.12em]">Centro Mega · Loja Virtual</p>
                <p className="mt-1 text-sm text-white/35">Celulares · Outlet · Tênis · Bonés · Calçados · Acessórios</p>
              </div>
            </div>
            <PortfolioHostCredit linkClassName="font-semibold text-white/65 underline underline-offset-4" />
          </div>
        </footer>

        {activeProduct && (
          <div
            className="fixed inset-0 z-[80] grid place-items-end bg-black/80 p-3 backdrop-blur-xl sm:place-items-center sm:p-6"
            role="presentation"
            onMouseDown={(event) => {
              if (event.currentTarget === event.target) setActiveProduct(null);
            }}
          >
            <MotionOverlay className="w-full max-w-3xl overflow-hidden rounded-[2.5rem] border border-white/15 bg-[#0a0e18] shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.2em] text-cyan-300">{activeProduct.badge}</p>
                  <p className="mt-1 font-black">{activeProduct.category}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveProduct(null)}
                  className="rounded-full border border-white/10 p-2 text-white/55 transition hover:bg-white/10 hover:text-white"
                  aria-label="Fechar detalhes"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid md:grid-cols-[.85fr_1.15fr]">
                <div className="border-b border-white/10 bg-white/[.025] md:border-b-0 md:border-r">
                  <ProductVisual product={activeProduct} />
                  {activeProduct.gallery && activeProduct.gallery.length > 1 && (
                    <div className="grid grid-cols-3 gap-2 p-3">
                      {activeProduct.gallery.slice(0, 3).map((image) => (
                        <a
                          key={image.url}
                          href={image.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="overflow-hidden rounded-xl border border-white/10 bg-white"
                          title="Abrir fonte pública da imagem"
                        >
                          <PortfolioImage
                            src={image.url}
                            alt={image.alt}
                            width={320}
                            height={320}
                            className="aspect-square h-full w-full object-contain p-1"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-6 sm:p-8">
                  <h2 className="text-3xl font-black tracking-[-.04em]">{activeProduct.name}</h2>
                  <p className="mt-4 leading-7 text-white/55">{activeProduct.description}</p>

                  {activeProduct.detail && (
                    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[.035] p-4">
                      <Tag className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                      <p className="text-sm leading-6 text-white/60">{activeProduct.detail}</p>
                    </div>
                  )}

                  <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/[.05] p-4">
                    <p className="text-[10px] font-black uppercase tracking-[.18em] text-amber-200">Disponibilidade</p>
                    <p className="mt-2 text-sm leading-6 text-amber-50/65">{activeProduct.availabilityNote}</p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => toggleCart(activeProduct.id)}
                      className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 text-sm font-black text-[#06101f] transition hover:bg-white"
                    >
                      {cartIds.includes(activeProduct.id) ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                      {cartIds.includes(activeProduct.id) ? "Na seleção" : "Adicionar à seleção"}
                    </button>
                    {activeProduct.sourceUrl && (
                      <a
                        href={activeProduct.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 px-5 text-sm font-black text-white/70 transition hover:border-white/35 hover:text-white"
                      >
                        Ver fonte <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </MotionOverlay>
          </div>
        )}

        {cartOpen && (
          <div
            className="fixed inset-0 z-[90] flex justify-end bg-black/75 backdrop-blur-md"
            role="presentation"
            onMouseDown={(event) => {
              if (event.currentTarget === event.target) setCartOpen(false);
            }}
          >
            <MotionOverlay className="h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-[#080b13] shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#080b13]/95 px-5 py-5 backdrop-blur">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.2em] text-cyan-300">Minha seleção</p>
                  <h2 className="mt-1 text-xl font-black">{selectedProducts.length} item{selectedProducts.length === 1 ? "" : "s"}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="rounded-full border border-white/10 p-2 text-white/55 hover:bg-white/10 hover:text-white"
                  aria-label="Fechar seleção"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-5">
                {selectedProducts.length ? (
                  <div className="space-y-3">
                    {selectedProducts.map((product) => (
                      <div key={product.id} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-white/[.035] p-3">
                        <div className="rounded-xl bg-black/20">
                          <ProductVisual product={product} compact />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-black">{product.name}</p>
                          <p className="mt-1 text-xs text-white/35">{product.category}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleCart(product.id)}
                          className="rounded-xl p-2 text-white/35 transition hover:bg-red-400/10 hover:text-red-300"
                          aria-label={"Remover " + product.name}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-white/[.02] p-4">
                      <p className="text-[10px] font-black uppercase tracking-[.18em] text-white/35">Total</p>
                      <p className="mt-2 text-lg font-black">A confirmar com a loja</p>
                      <p className="mt-2 text-xs leading-5 text-white/35">A loja não soma valores históricos nem presume estoque atual.</p>
                    </div>

                    <StoreCTA
                      selected={selectedProducts}
                      className="mt-4 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 text-sm font-black text-[#06101f] transition hover:bg-white"
                    >
                      Consultar minha seleção <ArrowRight className="h-4 w-4" />
                    </StoreCTA>
                  </div>
                ) : (
                  <div className="py-16 text-center">
                    <ShoppingBag className="mx-auto h-10 w-10 text-white/20" />
                    <h3 className="mt-5 text-xl font-black">Sua seleção está vazia.</h3>
                    <p className="mt-2 text-sm leading-6 text-white/40">Adicione produtos ou categorias para levar contexto ao atendimento.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setCartOpen(false);
                        document.getElementById("vitrine")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-sm font-black text-white/70"
                    >
                      Explorar vitrine <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </MotionOverlay>
          </div>
        )}

        <PortfolioSocialProofPopup
          clientKey="centro-mega"
          eyebrow="Centro Mega Store"
          title="Achou algo interessante?"
          description="Monte uma seleção e leve os itens direto para o atendimento da Centro Mega."
          ctaLabel="Ver vitrine"
          ctaHref="#vitrine"
          delayMs={11000}
          className="border-cyan-300/25 bg-[#07111f]/95 text-white"
          accentClassName="text-cyan-300"
        />
      </div>
    </MotionScope>
  );
}
