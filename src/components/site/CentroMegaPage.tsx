import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  ArrowRight,
  BatteryCharging,
  Bike,
  Check,
  ChevronRight,
  Facebook,
  Footprints,
  Gamepad2,
  HardDrive,
  Instagram,
  MapPin,
  PackageCheck,
  Search,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Store,
  Tag,
  Tv2,
  X,
} from "lucide-react";
import {
  MotionCard,
  MotionImageReveal,
  MotionOverlay,
  MotionParallax,
  MotionReveal,
  MotionScope,
  MotionSwap,
  MotionTextReveal,
} from "@/components/motion";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import {
  CENTRO_MEGA_SOCIAL_POSTS,
  CENTRO_MEGA_STORE_CATEGORIES,
  CENTRO_MEGA_STORE_PRODUCTS,
  type CentroMegaProduct,
} from "@/config/centro-mega-storefront";

const links = {
  instagram: "https://www.instagram.com/centro.mega/",
  facebook: "https://www.facebook.com/CentroMega.com.br/",
  linktree: "https://linktr.ee/centro.mega",
  seller: "https://www.magazineluiza.com.br/lojista/centromega/",
};

const storeQuiz = {
  services: [
    "Celulares e smartphones",
    "Gaming",
    "Acessórios e tecnologia",
    "Outlet e calçados",
    "Perfumes",
    "Quero ajuda para escolher",
  ],
  experienceOptions: [
    "Compra para uso pessoal",
    "Quero presentear",
    "Estou comparando opções",
    "Quero consultar vários itens",
  ],
  periodOptions: [
    "Retirada em São José dos Pinhais",
    "Quero consultar outra unidade",
    "Preciso de envio",
    "Quero orientação da equipe",
  ],
  timingOptions: ["Hoje", "Nesta semana", "Ainda estou pesquisando", "Sem urgência"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "O que você quer encontrar?",
    experience: "Como pretende comprar?",
    period: "Como prefere receber ou retirar?",
    timing: "Quando pretende fechar?",
  },
  notePlaceholder:
    "Se quiser, informe modelo, cor, tamanho, capacidade, numeração ou outra preferência.",
};

const accentStyles: Record<CentroMegaProduct["accent"], { glow: string; border: string; pill: string }> = {
  cyan: {
    glow: "from-cyan-300/35 via-cyan-400/10 to-transparent",
    border: "hover:border-cyan-300/70",
    pill: "bg-cyan-300 text-slate-950",
  },
  violet: {
    glow: "from-violet-400/35 via-fuchsia-400/10 to-transparent",
    border: "hover:border-violet-300/70",
    pill: "bg-violet-300 text-slate-950",
  },
  lime: {
    glow: "from-lime-300/35 via-emerald-400/10 to-transparent",
    border: "hover:border-lime-300/70",
    pill: "bg-lime-300 text-slate-950",
  },
  amber: {
    glow: "from-amber-300/35 via-orange-400/10 to-transparent",
    border: "hover:border-amber-300/70",
    pill: "bg-amber-300 text-slate-950",
  },
  rose: {
    glow: "from-rose-300/35 via-pink-400/10 to-transparent",
    border: "hover:border-rose-300/70",
    pill: "bg-rose-300 text-slate-950",
  },
  blue: {
    glow: "from-blue-300/35 via-sky-400/10 to-transparent",
    border: "hover:border-blue-300/70",
    pill: "bg-blue-300 text-slate-950",
  },
};

function ProductGlyph({ product }: { product: CentroMegaProduct }) {
  const common = "h-20 w-20 stroke-[1.25]";
  const glyph =
    product.visual === "phone" ? (
      <Smartphone className={common} />
    ) : product.visual === "shoe" ? (
      <Footprints className={common} />
    ) : product.visual === "tvbox" ? (
      <Tv2 className={common} />
    ) : product.visual === "gamepad" ? (
      <Gamepad2 className={common} />
    ) : product.visual === "harddrive" ? (
      <HardDrive className={common} />
    ) : product.visual === "bike" ? (
      <Bike className={common} />
    ) : product.visual === "battery" ? (
      <BatteryCharging className={common} />
    ) : product.visual === "perfume" ? (
      <Sparkles className={common} />
    ) : (
      <Tag className={common} />
    );

  return (
    <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#071323]">
      <div
        className={[
          "absolute -inset-20 bg-gradient-to-br blur-3xl transition duration-500 group-hover:scale-125",
          accentStyles[product.accent].glow,
        ].join(" ")}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] bg-[size:28px_28px] opacity-35" />
      <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[10px] font-black uppercase tracking-[.18em] text-white/65 backdrop-blur">
        visual de amostra
      </div>
      <div className="relative text-white/90 transition duration-500 group-hover:-translate-y-2 group-hover:scale-110">
        {glyph}
      </div>
      <div className="absolute bottom-4 right-4 h-16 w-16 rounded-full border border-white/15 shadow-[0_0_60px_rgba(255,255,255,.08)]" />
    </div>
  );
}

function StoreCTA({
  children,
  products,
  className,
}: {
  children: ReactNode;
  products?: CentroMegaProduct[];
  className?: string;
}) {
  const productNames = products?.map((item) => item.name) ?? [];
  const selected = productNames.length ? productNames.join(" + ") : undefined;
  return (
    <PortfolioCTAQuiz
      clientKey="centro-mega"
      studioName="Centro Mega Store"
      recipientName="a equipe Centro Mega"
      theme="navy"
      mode="proposal"
      funnelIntent="pedido"
      quizConfig={storeQuiz}
      initialAnswers={selected ? { service: selected } : undefined}
      skipPrefilledSteps={Boolean(selected)}
      orderContext={
        selected
          ? {
              order_items: productNames.join(" | "),
              customer_note:
                "Amostra de loja virtual Centro Mega — confirmar preço, estoque, cor, tamanho e condição antes de fechar o pedido.",
            }
          : undefined
      }
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
}: {
  product: CentroMegaProduct;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      className={[
        "group relative overflow-hidden rounded-[2rem] border bg-white/[.045] p-3 shadow-[0_22px_80px_rgba(0,0,0,.24)] backdrop-blur-xl transition duration-500 hover:-translate-y-2",
        selected ? "border-cyan-300/70 ring-1 ring-cyan-300/30" : "border-white/10",
        accentStyles[product.accent].border,
      ].join(" ")}
    >
      <ProductGlyph product={product} />
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          {product.badge ? (
            <span
              className={[
                "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[.16em]",
                accentStyles[product.accent].pill,
              ].join(" ")}
            >
              {product.badge}
            </span>
          ) : null}
          <span className="text-[10px] font-black uppercase tracking-[.18em] text-white/45">
            {product.category}
          </span>
        </div>

        <h3 className="mt-5 text-2xl font-black leading-tight tracking-[-.03em] text-white">
          {product.name}
        </h3>
        <p className="mt-2 text-sm font-semibold text-cyan-200/80">{product.subtitle}</p>
        <p className="mt-4 min-h-20 text-sm leading-6 text-white/58">{product.description}</p>

        {product.historicalPrice ? (
          <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/[.06] p-4">
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-amber-200">
              referência histórica da publicação
            </p>
            <div className="mt-2 flex flex-wrap items-end gap-3">
              {product.historicalCompareAt ? (
                <span className="text-sm font-bold text-white/35 line-through">
                  {product.historicalCompareAt}
                </span>
              ) : null}
              <span className="text-2xl font-black text-white">{product.historicalPrice}</span>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-white/45">
              Não representa preço ou estoque atual. Consulte a equipe.
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onToggle}
            aria-pressed={selected}
            className={[
              "inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300",
              selected
                ? "bg-cyan-300 text-slate-950 hover:bg-white"
                : "bg-white text-slate-950 hover:bg-cyan-200",
            ].join(" ")}
          >
            {selected ? <Check className="h-4 w-4" aria-hidden="true" /> : <ShoppingBag className="h-4 w-4" aria-hidden="true" />}
            {selected ? "Na sacola" : "Adicionar"}
          </button>
          <StoreCTA
            products={[product]}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 px-4 text-sm font-black text-white transition hover:border-cyan-300/70 hover:bg-cyan-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            Consultar
          </StoreCTA>
        </div>
      </div>
    </article>
  );
}

export function CentroMegaPage() {
  const [category, setCategory] = useState<(typeof CENTRO_MEGA_STORE_CATEGORIES)[number]>("Todos");
  const [query, setQuery] = useState("");
  const [cartIds, setCartIds] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return CENTRO_MEGA_STORE_PRODUCTS.filter((product) => {
      const categoryMatch = category === "Todos" || product.category === category;
      const searchMatch =
        !normalized ||
        [product.name, product.subtitle, product.description, product.category]
          .join(" ")
          .toLocaleLowerCase("pt-BR")
          .includes(normalized);
      return categoryMatch && searchMatch;
    });
  }, [category, query]);

  const cartProducts = useMemo(
    () => CENTRO_MEGA_STORE_PRODUCTS.filter((product) => cartIds.includes(product.id)),
    [cartIds],
  );

  useEffect(() => {
    if (!cartOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCartOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cartOpen]);

  const toggleProduct = (id: string) => {
    setCartIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <MotionScope intensity="IMMERSIVE">
      <div
        data-client-slug="centro-mega"
        className="min-h-dvh overflow-x-clip bg-[#030812] text-white selection:bg-cyan-300 selection:text-slate-950"
        style={
          {
            "--mega-cyan": "#59e7ff",
            "--mega-lime": "#c9ff4d",
            "--mega-violet": "#9c7cff",
            "--mega-pink": "#ff5fb8",
          } as CSSProperties
        }
      >
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#030812]/88 px-4 py-3 backdrop-blur-2xl lg:px-8">
          <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4">
            <a href="#inicio" className="flex min-w-0 items-center gap-3" aria-label="Centro Mega Store — início">
              <PortfolioImage
                src="/images/centro-mega/logo.png"
                alt="Logo Centro Mega"
                width={500}
                height={500}
                priority
                managedField="logoUrl"
                className="h-10 w-10 rounded-xl object-cover shadow-[0_0_35px_rgba(89,231,255,.22)] sm:h-12 sm:w-12"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-black uppercase tracking-[.12em] sm:text-base">Centro Mega</p>
                <p className="truncate text-[9px] font-black uppercase tracking-[.2em] text-cyan-300/70 sm:text-[10px]">
                  Store sample · tech + outlet
                </p>
              </div>
            </a>

            <nav className="hidden items-center gap-7 text-xs font-black uppercase tracking-[.16em] text-white/55 lg:flex">
              <a className="transition hover:text-cyan-300" href="#drops">Drops</a>
              <a className="transition hover:text-cyan-300" href="#catalogo">Catálogo</a>
              <a className="transition hover:text-cyan-300" href="#social">Social</a>
              <a className="transition hover:text-cyan-300" href="#lojas">Lojas</a>
            </nav>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative inline-flex min-h-11 items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 text-sm font-black text-cyan-100 transition hover:-translate-y-0.5 hover:border-cyan-300/70 hover:bg-cyan-300/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              aria-label={`Abrir sacola com ${cartProducts.length} itens`}
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Sacola</span>
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-cyan-300 px-1 text-xs text-slate-950">
                {cartProducts.length}
              </span>
            </button>
          </div>
        </header>

        <main>
          <section id="inicio" className="relative isolate overflow-hidden px-5 pb-20 pt-14 lg:px-8 lg:pb-28 lg:pt-20">
            <div className="pointer-events-none absolute inset-0 -z-30 bg-[#030812]" />
            <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(rgba(89,231,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(89,231,255,.055)_1px,transparent_1px)] bg-[size:64px_64px]" />
            <div className="pointer-events-none absolute -left-40 top-20 -z-10 h-[34rem] w-[34rem] rounded-full bg-cyan-400/20 blur-[120px]" />
            <div className="pointer-events-none absolute -right-40 top-1/3 -z-10 h-[38rem] w-[38rem] rounded-full bg-violet-500/20 blur-[130px]" />

            <div className="mx-auto max-w-[1480px]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5 text-[10px] font-black uppercase tracking-[.2em] text-white/45">
                <span className="inline-flex items-center gap-2 text-cyan-200">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  amostra interativa de loja virtual
                </span>
                <span>produtos derivados de fontes públicas + mix informado</span>
              </div>

              <div className="grid gap-12 pt-10 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
                <div className="relative z-10">
                  <MotionReveal variant="mask">
                    <p className="inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2 text-[10px] font-black uppercase tracking-[.2em] text-lime-200">
                      <PackageCheck className="h-4 w-4" aria-hidden="true" />
                      tecnologia · outlet · achados
                    </p>
                  </MotionReveal>

                  <h1 className="mt-7 max-w-4xl text-[clamp(3.8rem,9vw,8.7rem)] font-black uppercase leading-[.78] tracking-[-.075em]">
                    <MotionTextReveal text="Centro Mega" as="span" />
                    <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-white to-violet-300 bg-clip-text text-transparent">
                      Store.
                    </span>
                  </h1>

                  <MotionReveal variant="up" delay={140}>
                    <p className="mt-8 max-w-2xl text-lg leading-8 text-white/66 sm:text-xl">
                      Uma vitrine digital viva para celulares, gaming, acessórios, perfumes e produtos de outlet.
                      A seleção mistura itens encontrados em publicações públicas da marca e catálogo público do seller.
                    </p>
                  </MotionReveal>

                  <MotionReveal variant="up" delay={240}>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <a
                        href="#catalogo"
                        className="inline-flex min-h-13 items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-black text-slate-950 shadow-[0_0_50px_rgba(89,231,255,.2)] transition hover:-translate-y-1 hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                      >
                        Explorar catálogo
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </a>
                      <StoreCTA className="inline-flex min-h-13 items-center gap-3 rounded-full border border-white/15 bg-white/[.04] px-6 py-3.5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-1 hover:border-violet-300/60 hover:bg-violet-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300">
                        Pedir uma indicação
                        <Sparkles className="h-4 w-4" aria-hidden="true" />
                      </StoreCTA>
                    </div>
                  </MotionReveal>

                  <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
                    {[
                      ["10", "itens na amostra"],
                      ["6", "categorias"],
                      ["1", "sacola inteligente"],
                    ].map(([value, label]) => (
                      <div key={label} className="border-t border-white/15 pt-4">
                        <p className="text-2xl font-black text-cyan-200 sm:text-3xl">{value}</p>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-[.16em] text-white/40">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <MotionParallax speed={28} className="relative">
                  <div className="relative mx-auto max-w-3xl">
                    <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-cyan-300/15 via-violet-400/10 to-pink-400/10 blur-3xl" />
                    <MotionImageReveal direction="left">
                      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/[.04] p-3 shadow-[0_35px_120px_rgba(0,0,0,.45)] backdrop-blur">
                        <PortfolioImage
                          src="/images/centro-mega/hero.png"
                          alt="Composição visual Centro Mega"
                          width={1600}
                          height={900}
                          priority
                          managedField="heroImageUrl"
                          className="aspect-[4/3] w-full rounded-[2rem] object-cover"
                        />
                        <div className="absolute inset-3 rounded-[2rem] bg-gradient-to-t from-[#030812] via-transparent to-transparent" />
                        <div className="absolute bottom-7 left-7 right-7 flex flex-wrap items-end justify-between gap-4">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[.2em] text-cyan-200">social commerce demo</p>
                            <p className="mt-2 max-w-sm text-2xl font-black leading-tight">O feed vira vitrine. A vitrine vira pedido.</p>
                          </div>
                          <span className="rounded-full border border-white/20 bg-black/35 px-4 py-2 text-xs font-black backdrop-blur">
                            SJP · Curitiba
                          </span>
                        </div>
                      </div>
                    </MotionImageReveal>

                    <div className="absolute -left-5 top-10 hidden rounded-2xl border border-cyan-300/30 bg-[#071323]/90 p-4 shadow-2xl backdrop-blur sm:block lg:-left-10">
                      <Smartphone className="h-7 w-7 text-cyan-300" aria-hidden="true" />
                      <p className="mt-3 text-xs font-black uppercase tracking-[.16em]">Celulares</p>
                      <p className="mt-1 text-[11px] text-white/45">social drop</p>
                    </div>
                    <div className="absolute -right-4 bottom-10 hidden rounded-2xl border border-violet-300/30 bg-[#071323]/90 p-4 shadow-2xl backdrop-blur sm:block lg:-right-8">
                      <Footprints className="h-7 w-7 text-violet-300" aria-hidden="true" />
                      <p className="mt-3 text-xs font-black uppercase tracking-[.16em]">Outlet</p>
                      <p className="mt-1 text-[11px] text-white/45">achados rotativos</p>
                    </div>
                  </div>
                </MotionParallax>
              </div>
            </div>
          </section>

          <section id="drops" className="border-y border-white/10 bg-white/[.025]">
            <div className="mx-auto flex max-w-[1480px] gap-8 overflow-x-auto px-5 py-5 text-[11px] font-black uppercase tracking-[.18em] text-white/50 lg:px-8">
              {["SOCIAL DROPS", "CELULARES", "GAMING", "OUTLET", "PERFUMES", "ACESSÓRIOS", "ACHADOS", "SÃO JOSÉ DOS PINHAIS"].map((item) => (
                <span key={item} className="shrink-0">
                  {item} <span className="ml-8 text-cyan-300">✦</span>
                </span>
              ))}
            </div>
          </section>

          <section id="catalogo" className="px-5 py-20 lg:px-8 lg:py-28">
            <div className="mx-auto max-w-[1480px]">
              <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.24em] text-cyan-300">Vitrine dinâmica</p>
                  <h2 className="mt-4 text-5xl font-black uppercase leading-[.9] tracking-[-.055em] sm:text-7xl">
                    Do post
                    <span className="block text-white/35">para a sacola.</span>
                  </h2>
                </div>
                <div className="max-w-3xl lg:justify-self-end">
                  <p className="text-lg leading-8 text-white/58">
                    Produtos exatos quando a fonte pública permite; categorias rotativas quando o modelo específico não foi confirmado.
                    Preço e estoque só são tratados como atuais depois de confirmação.
                  </p>
                </div>
              </div>

              <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/[.035] p-3 sm:p-4">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" aria-hidden="true" />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Buscar produto, categoria ou tipo..."
                      aria-label="Buscar no catálogo Centro Mega"
                      className="min-h-12 w-full rounded-xl border border-white/10 bg-black/25 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/20"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 xl:pb-0">
                    {CENTRO_MEGA_STORE_CATEGORIES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setCategory(item)}
                        aria-pressed={category === item}
                        className={[
                          "min-h-11 shrink-0 rounded-xl px-4 text-xs font-black uppercase tracking-[.12em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300",
                          category === item
                            ? "bg-cyan-300 text-slate-950"
                            : "border border-white/10 bg-white/[.035] text-white/55 hover:border-white/25 hover:text-white",
                        ].join(" ")}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <MotionSwap swapKey={`${category}:${query}`} variant="fade" className="mt-8">
                {filteredProducts.length ? (
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filteredProducts.map((product, index) => (
                      <MotionCard key={product.id} index={index}>
                        <ProductCard
                          product={product}
                          selected={cartIds.includes(product.id)}
                          onToggle={() => toggleProduct(product.id)}
                        />
                      </MotionCard>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[2rem] border border-dashed border-white/15 py-20 text-center">
                    <p className="text-2xl font-black">Nenhum item encontrado.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setCategory("Todos");
                        setQuery("");
                      }}
                      className="mt-4 text-sm font-black text-cyan-300 underline underline-offset-4"
                    >
                      Limpar busca
                    </button>
                  </div>
                )}
              </MotionSwap>
            </div>
          </section>

          <section className="relative overflow-hidden bg-white px-5 py-20 text-[#071323] lg:px-8 lg:py-28">
            <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-cyan-200/60 blur-[120px]" />
            <div className="mx-auto max-w-[1480px]">
              <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.24em] text-violet-700">Social drop em destaque</p>
                  <h2 className="mt-4 text-5xl font-black uppercase leading-[.88] tracking-[-.055em] sm:text-7xl">
                    POCO X5 Pro.
                    <span className="block text-slate-300">O post virou produto.</span>
                  </h2>
                  <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                    A publicação pública de 25/01/2024 informa POCO X5 Pro com 8 GB de RAM e 256 GB de armazenamento.
                    A amostra preserva o preço daquele post apenas como referência histórica.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <StoreCTA
                      products={[CENTRO_MEGA_STORE_PRODUCTS[0]]}
                      className="inline-flex min-h-13 items-center gap-3 rounded-full bg-[#071323] px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                    >
                      Consultar o POCO
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </StoreCTA>
                    <button
                      type="button"
                      onClick={() => toggleProduct("poco-x5-pro-8-256")}
                      className="inline-flex min-h-13 items-center gap-2 rounded-full border border-slate-300 px-6 py-3.5 text-sm font-black transition hover:border-cyan-500 hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                    >
                      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                      {cartIds.includes("poco-x5-pro-8-256") ? "Remover da sacola" : "Adicionar à sacola"}
                    </button>
                  </div>
                </div>

                <MotionReveal variant="scale">
                  <div className="relative mx-auto max-w-2xl rounded-[2.5rem] bg-[#071323] p-5 shadow-[0_40px_120px_rgba(7,19,35,.25)]">
                    <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full bg-violet-400/40 blur-2xl" />
                    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(89,231,255,.22),transparent_34%),radial-gradient(circle_at_75%_75%,rgba(156,124,255,.24),transparent_35%),#06101e] px-8 py-12">
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:34px_34px]" />
                      <div className="relative mx-auto grid h-80 max-w-sm place-items-center">
                        <div className="absolute h-72 w-44 -rotate-6 rounded-[2.5rem] border-4 border-cyan-200/60 bg-gradient-to-br from-cyan-200/30 to-blue-700/20 shadow-[0_0_90px_rgba(89,231,255,.22)]" />
                        <div className="absolute h-72 w-44 rotate-6 rounded-[2.5rem] border-4 border-violet-200/50 bg-gradient-to-br from-violet-200/25 to-fuchsia-700/20 shadow-[0_0_90px_rgba(156,124,255,.22)]" />
                        <Smartphone className="relative h-28 w-28 text-white" strokeWidth={1.15} aria-hidden="true" />
                      </div>
                      <div className="relative mt-5 flex items-end justify-between gap-5">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-200">Preço publicado em 2024</p>
                          <p className="mt-2 text-4xl font-black text-white">R$ 1.899,00</p>
                          <p className="mt-1 text-sm text-white/35 line-through">R$ 2.399,00</p>
                        </div>
                        <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-[10px] font-black uppercase tracking-[.14em] text-amber-200">
                          referência histórica
                        </span>
                      </div>
                    </div>
                  </div>
                </MotionReveal>
              </div>
            </div>
          </section>

          <section id="social" className="px-5 py-20 lg:px-8 lg:py-28">
            <div className="mx-auto max-w-[1480px]">
              <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.24em] text-pink-300">Feed como motor comercial</p>
                  <h2 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-[.9] tracking-[-.055em] sm:text-7xl">
                    O social não fica
                    <span className="block text-white/35">separado da loja.</span>
                  </h2>
                </div>
                <p className="max-w-xl text-lg leading-8 text-white/58">
                  A amostra mantém links para publicações oficiais já registradas no projeto e usa produtos somente quando a fonte permite identificar o item com segurança.
                </p>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {CENTRO_MEGA_SOCIAL_POSTS.map((post, index) => (
                  <MotionCard key={post.href} index={index}>
                    <a
                      href={post.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group block min-h-48 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.04] p-6 transition hover:-translate-y-1 hover:border-pink-300/50 hover:bg-pink-300/[.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <Instagram className="h-7 w-7 text-pink-300" aria-hidden="true" />
                        <span className="text-[10px] font-black uppercase tracking-[.2em] text-white/35">#{String(index + 1).padStart(2, "0")}</span>
                      </div>
                      <p className="mt-10 text-xs font-black uppercase tracking-[.18em] text-pink-200/70">{post.label}</p>
                      <p className="mt-2 flex items-center justify-between gap-4 text-xl font-black">
                        Abrir publicação
                        <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" aria-hidden="true" />
                      </p>
                    </a>
                  </MotionCard>
                ))}
              </div>

              <div className="mt-8 grid gap-4 lg:grid-cols-2">
                <a
                  href={links.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex min-h-24 items-center justify-between gap-5 rounded-2xl border border-white/10 bg-gradient-to-r from-pink-400/10 to-violet-400/10 px-6 transition hover:border-pink-300/50"
                >
                  <span className="inline-flex items-center gap-3 font-black">
                    <Instagram className="h-5 w-5 text-pink-300" aria-hidden="true" />
                    Instagram oficial @centro.mega
                  </span>
                  <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" aria-hidden="true" />
                </a>
                <a
                  href={links.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex min-h-24 items-center justify-between gap-5 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 px-6 transition hover:border-cyan-300/50"
                >
                  <span className="inline-flex items-center gap-3 font-black">
                    <Facebook className="h-5 w-5 text-cyan-300" aria-hidden="true" />
                    Facebook oficial Centro Mega
                  </span>
                  <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>

          <section id="lojas" className="relative overflow-hidden border-y border-white/10 bg-[#071323] px-5 py-20 lg:px-8 lg:py-28">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(89,231,255,.13),transparent_25%),radial-gradient(circle_at_88%_78%,rgba(156,124,255,.15),transparent_30%)]" />
            <div className="relative mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
              <div>
                <p className="text-xs font-black uppercase tracking-[.24em] text-lime-300">Marca com presença física</p>
                <h2 className="mt-4 text-5xl font-black uppercase leading-[.9] tracking-[-.055em] sm:text-7xl">
                  Loja virtual
                  <span className="block text-white/35">com pé no balcão.</span>
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-white/58">
                  O Linktree público da Centro Mega lista SAC e canais para Outlet São José dos Pinhais, Galeria Di Brunno, Shopping Cidade e Pinheirinho.
                </p>
                <StoreCTA className="mt-8 inline-flex min-h-13 items-center gap-3 rounded-full bg-lime-300 px-6 py-3.5 text-sm font-black text-slate-950 transition hover:-translate-y-1 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300">
                  Consultar uma unidade
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                </StoreCTA>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Centro Mega Outlet", "São José dos Pinhais", "outlet"],
                  ["Galeria Di Brunno", "São José dos Pinhais", "loja"],
                  ["Shopping Cidade", "Curitiba", "loja"],
                  ["Pinheirinho", "Curitiba", "canal"],
                ].map(([name, city, kind], index) => (
                  <MotionCard key={name} index={index}>
                    <div className="rounded-[2rem] border border-white/10 bg-white/[.04] p-6">
                      <div className="flex items-center justify-between gap-4">
                        <Store className="h-6 w-6 text-lime-300" aria-hidden="true" />
                        <span className="text-[10px] font-black uppercase tracking-[.18em] text-white/30">{kind}</span>
                      </div>
                      <h3 className="mt-10 text-2xl font-black">{name}</h3>
                      <p className="mt-2 text-white/50">{city}</p>
                    </div>
                  </MotionCard>
                ))}
              </div>
            </div>
          </section>

          <section className="px-5 py-20 lg:px-8 lg:py-28">
            <div className="mx-auto max-w-[1480px] overflow-hidden rounded-[2.7rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/15 via-violet-400/10 to-pink-400/10 p-7 shadow-[0_40px_130px_rgba(0,0,0,.35)] sm:p-10 lg:p-14">
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.24em] text-cyan-200">Finalizar a experiência</p>
                  <h2 className="mt-4 max-w-5xl text-5xl font-black uppercase leading-[.88] tracking-[-.055em] sm:text-7xl">
                    Monte a sacola.
                    <span className="block text-white/45">A equipe confirma o resto.</span>
                  </h2>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
                    A amostra não inventa estoque nem preço. Ela leva o contexto do que você escolheu para o funil individual da Centro Mega.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-black text-slate-950 transition hover:-translate-y-1 hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                  Abrir sacola ({cartProducts.length})
                </button>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 bg-[#02060d] px-5 py-10 lg:px-8">
          <div className="mx-auto flex max-w-[1480px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <PortfolioImage
                src="/images/centro-mega/logo.png"
                alt="Centro Mega"
                width={500}
                height={500}
                managedField="logoUrl"
                className="h-14 w-14 rounded-xl object-cover"
              />
              <p className="mt-4 text-xl font-black">Centro Mega Store · amostra de loja virtual</p>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
                Produtos e categorias usados nesta demonstração vêm de publicações públicas, seller público e informações fornecidas pelo responsável. Disponibilidade e preço atual dependem de confirmação.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs font-black uppercase tracking-[.14em] text-white/45">
              <a className="hover:text-cyan-300" href={links.instagram} target="_blank" rel="noreferrer">Instagram</a>
              <a className="hover:text-cyan-300" href={links.facebook} target="_blank" rel="noreferrer">Facebook</a>
              <a className="hover:text-cyan-300" href={links.seller} target="_blank" rel="noreferrer">Seller público</a>
            </div>
          </div>
          <div className="mx-auto mt-8 max-w-[1480px]">
            <PortfolioHostCredit />
          </div>
        </footer>

        {cartProducts.length ? (
          <div className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-3xl rounded-[1.5rem] border border-cyan-300/30 bg-[#071323]/94 p-3 shadow-[0_30px_100px_rgba(0,0,0,.55)] backdrop-blur-xl sm:bottom-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="flex min-h-12 flex-1 items-center justify-between gap-4 rounded-xl px-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <span>
                  <span className="block text-[10px] font-black uppercase tracking-[.18em] text-cyan-300">sacola da amostra</span>
                  <span className="mt-1 block text-sm font-black">
                    {cartProducts.length} {cartProducts.length === 1 ? "item selecionado" : "itens selecionados"}
                  </span>
                </span>
                <ShoppingBag className="h-5 w-5 text-cyan-300" aria-hidden="true" />
              </button>
              <StoreCTA
                products={cartProducts}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-cyan-300 px-5 text-sm font-black text-slate-950 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Continuar
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </StoreCTA>
            </div>
          </div>
        ) : null}

        {cartOpen ? (
          <div className="fixed inset-0 z-50 bg-black/70 p-3 backdrop-blur-md sm:p-6" onMouseDown={() => setCartOpen(false)}>
            <MotionOverlay className="ml-auto h-full max-w-xl">
              <aside
                role="dialog"
                aria-modal="true"
                aria-label="Sacola Centro Mega"
                onMouseDown={(event) => event.stopPropagation()}
                className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#071323] shadow-[0_40px_140px_rgba(0,0,0,.65)]"
              >
                <div className="flex items-center justify-between border-b border-white/10 p-5 sm:p-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[.18em] text-cyan-300">Centro Mega Store</p>
                    <h2 className="mt-1 text-2xl font-black">Sua sacola</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCartOpen(false)}
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-white/60 transition hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                    aria-label="Fechar sacola"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 sm:p-6">
                  {cartProducts.length ? (
                    <div className="space-y-3">
                      {cartProducts.map((product) => (
                        <div key={product.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.035] p-4">
                          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200">
                            {product.visual === "phone" ? (
                              <Smartphone className="h-5 w-5" />
                            ) : product.visual === "shoe" ? (
                              <Footprints className="h-5 w-5" />
                            ) : product.visual === "gamepad" ? (
                              <Gamepad2 className="h-5 w-5" />
                            ) : (
                              <Tag className="h-5 w-5" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-black">{product.name}</p>
                            <p className="mt-1 text-xs text-white/40">{product.category} · confirmar disponibilidade</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleProduct(product.id)}
                            className="text-xs font-black uppercase tracking-[.12em] text-white/35 hover:text-rose-300"
                          >
                            remover
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid min-h-64 place-items-center text-center">
                      <div>
                        <ShoppingBag className="mx-auto h-10 w-10 text-white/25" />
                        <p className="mt-4 text-xl font-black">Sua sacola está vazia.</p>
                        <p className="mt-2 text-sm text-white/45">Volte ao catálogo e selecione os itens que quer consultar.</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/10 p-5 sm:p-6">
                  <div className="rounded-2xl border border-amber-300/15 bg-amber-300/[.055] p-4 text-xs leading-5 text-amber-100/70">
                    Esta é uma amostra de loja virtual. Preço, estoque, cor, tamanho, garantia e disponibilidade são confirmados antes de qualquer fechamento.
                  </div>
                  {cartProducts.length ? (
                    <StoreCTA
                      products={cartProducts}
                      className="mt-4 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-cyan-300 px-6 text-sm font-black text-slate-950 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      Enviar seleção para a Centro Mega
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </StoreCTA>
                  ) : null}
                </div>
              </aside>
            </MotionOverlay>
          </div>
        ) : null}

        <PortfolioSocialProofPopup
          clientKey="centro-mega"
          eyebrow="Centro Mega Store · amostra"
          title="Viu algo que combina com você?"
          description="Monte a sacola e leve a seleção para a equipe confirmar preço, estoque e disponibilidade."
          ctaLabel="Explorar catálogo"
          ctaHref="#catalogo"
          delayMs={12000}
          className="border-cyan-300/30 bg-[#071323]/95 text-white"
          accentClassName="text-cyan-300"
        />
        <PortfolioUpsellPopup pageName="portfolio-centro-mega-store-sample" />
      </div>
    </MotionScope>
  );
}
