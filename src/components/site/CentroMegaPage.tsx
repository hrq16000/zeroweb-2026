import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Facebook,
  Footprints,
  Headphones,
  Instagram,
  MapPin,
  PackageCheck,
  Plus,
  Search,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Tags,
  X,
  Zap,
} from "lucide-react";
import { MotionReveal, MotionStagger } from "@/components/motion";
import { PortfolioCTAQuiz, type PortfolioQuizConfig } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import {
  CENTRO_MEGA_DEMO_PRODUCTS,
  CENTRO_MEGA_SOCIAL_SOURCES,
  type CentroMegaDemoProduct,
} from "@/config/centro-mega-demo-products";

const links = {
  instagram: "https://www.instagram.com/centro.mega/",
  facebook: "https://www.facebook.com/CentroMega.com.br/",
  linktree: "https://linktr.ee/centro.mega",
  store: "https://www.vhsys.net/centromega/contato/",
};

const categories = ["Todos", "Celulares", "Tênis", "Bonés", "Calçados", "Acessórios", "Outlet"] as const;
type Category = (typeof categories)[number];

const quizConfig: PortfolioQuizConfig = {
  services: [
    "Celulares e smartphones",
    "Tênis e calçados",
    "Bonés e outlet",
    "Acessórios",
    "Quero ajuda para escolher",
  ],
  experienceOptions: [
    "Quero um produto específico",
    "Estou comparando opções",
    "Quero ver ofertas e outlet",
    "Quero confirmar estoque e valor",
  ],
  periodOptions: ["Retirada em loja", "Entrega / envio", "Ainda vou decidir"],
  timingOptions: ["Quero resolver hoje", "Ainda nesta semana", "Só estou pesquisando"],
  proposalKind: "service",
  stepTitles: {
    service: "O que você quer encontrar?",
    experience: "Como podemos ajudar na compra?",
    period: "Como prefere receber?",
    timing: "Quando pretende comprar?",
    note: "Quer deixar algum detalhe?",
  },
  notePlaceholder: "Modelo, cor, tamanho, faixa de preço ou qualquer detalhe que ajude a loja a conferir a opção certa.",
};

const accentClasses: Record<CentroMegaDemoProduct["accent"], string> = {
  cyan: "from-cyan-400/35 via-sky-400/10 to-transparent text-cyan-200",
  violet: "from-violet-400/35 via-fuchsia-400/10 to-transparent text-violet-200",
  lime: "from-lime-300/35 via-emerald-400/10 to-transparent text-lime-200",
  amber: "from-amber-300/35 via-orange-400/10 to-transparent text-amber-100",
  pink: "from-pink-400/35 via-rose-400/10 to-transparent text-pink-100",
  blue: "from-blue-400/35 via-cyan-400/10 to-transparent text-blue-100",
};

function ProductGlyph({ category }: { category: CentroMegaDemoProduct["category"] }) {
  const iconClass = "h-16 w-16 sm:h-20 sm:w-20";
  if (category === "Celulares") return <Smartphone className={iconClass} strokeWidth={1.25} aria-hidden="true" />;
  if (category === "Tênis" || category === "Calçados") return <Footprints className={iconClass} strokeWidth={1.25} aria-hidden="true" />;
  if (category === "Bonés") return <Shirt className={iconClass} strokeWidth={1.25} aria-hidden="true" />;
  if (category === "Acessórios") return <Headphones className={iconClass} strokeWidth={1.25} aria-hidden="true" />;
  return <Tags className={iconClass} strokeWidth={1.25} aria-hidden="true" />;
}

function FunnelCTA({
  children,
  selectedNames,
  className,
}: {
  children: React.ReactNode;
  selectedNames?: string;
  className?: string;
}) {
  const hasSelection = Boolean(selectedNames?.trim());
  return (
    <PortfolioCTAQuiz
      clientKey="centro-mega"
      studioName="Centro Mega"
      recipientName="a equipe Centro Mega"
      theme="navy"
      mode="proposal"
      funnelIntent="pedido"
      quizConfig={quizConfig}
      initialAnswers={hasSelection ? { service: selectedNames } : undefined}
      skipPrefilledSteps={hasSelection}
      orderContext={
        hasSelection
          ? {
              order_items: selectedNames,
              customer_note: "Seleção iniciada na amostra de loja virtual Centro Mega",
            }
          : undefined
      }
      className={className}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function CentroMegaPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("Todos");
  const [bag, setBag] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return CENTRO_MEGA_DEMO_PRODUCTS.filter((product) => {
      const categoryMatches = activeCategory === "Todos" || product.category === activeCategory;
      const searchMatches =
        !normalized ||
        [product.name, product.category, product.description, product.detail ?? ""]
          .join(" ")
          .toLocaleLowerCase("pt-BR")
          .includes(normalized);
      return categoryMatches && searchMatches;
    });
  }, [activeCategory, query]);

  const selectedProducts = useMemo(
    () => CENTRO_MEGA_DEMO_PRODUCTS.filter((product) => bag.includes(product.id)),
    [bag],
  );

  const selectedNames = selectedProducts.map((product) => product.name).join(" + ");

  const toggleBag = (id: string) => {
    setBag((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <div
      data-client-slug="centro-mega"
      className="min-h-dvh overflow-x-hidden bg-[#030611] text-white selection:bg-cyan-300 selection:text-[#04101d]"
      style={
        {
          "--mega-cyan": "#30e7ff",
          "--mega-violet": "#7c4dff",
          "--mega-lime": "#b9ff49",
          "--mega-pink": "#ff3da7",
          "--mega-ink": "#030611",
        } as React.CSSProperties
      }
    >
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#030611]/78 px-4 py-3 backdrop-blur-2xl sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[88rem] items-center justify-between gap-4">
          <a href="#inicio" className="flex min-w-0 items-center gap-3" aria-label="Centro Mega Store — início">
            <PortfolioImage
              src="/images/centro-mega/logo.png"
              alt="Centro Mega"
              width={500}
              height={500}
              priority
              managedField="logoUrl"
              className="h-11 w-11 shrink-0 rounded-xl object-cover ring-1 ring-white/15"
            />
            <span className="hidden sm:block">
              <span className="block text-sm font-black uppercase tracking-[.18em]">Centro Mega</span>
              <span className="block text-[10px] font-bold uppercase tracking-[.24em] text-cyan-300">Store concept</span>
            </span>
          </a>

          <nav className="hidden items-center gap-6 text-[11px] font-black uppercase tracking-[.18em] text-white/65 lg:flex" aria-label="Loja virtual">
            <a href="#vitrine" className="transition hover:text-cyan-300">Vitrine</a>
            <a href="#outlet" className="transition hover:text-lime-300">Outlet</a>
            <a href="#feed" className="transition hover:text-pink-300">Redes</a>
            <a href="#lojas" className="transition hover:text-violet-300">Lojas</a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#vitrine"
              className="hidden min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[.04] px-4 text-xs font-black transition hover:border-cyan-300/50 hover:bg-cyan-300/10 sm:inline-flex"
            >
              Explorar
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#sacola"
              className="relative inline-flex min-h-11 items-center gap-2 rounded-full bg-cyan-300 px-4 text-xs font-black text-[#04101d] shadow-[0_0_32px_rgba(48,231,255,.24)] transition hover:-translate-y-0.5 hover:bg-white"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Minha seleção</span>
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#04101d] px-1.5 text-[10px] text-white">{bag.length}</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        <section id="inicio" className="relative isolate overflow-hidden px-4 pb-20 pt-14 sm:px-6 lg:px-10 lg:pb-28 lg:pt-24">
          <div className="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(circle_at_12%_20%,rgba(48,231,255,.18),transparent_30%),radial-gradient(circle_at_84%_16%,rgba(124,77,255,.24),transparent_32%),radial-gradient(circle_at_70%_82%,rgba(255,61,167,.13),transparent_28%),#030611]" />
          <div className="pointer-events-none absolute inset-0 -z-20 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:54px_54px]" />
          <div className="pointer-events-none absolute -right-24 top-10 -z-10 h-96 w-96 rounded-full border border-cyan-300/20 shadow-[0_0_100px_rgba(48,231,255,.18)]" />
          <div className="pointer-events-none absolute right-[8%] top-32 -z-10 h-64 w-64 rotate-12 rounded-[4rem] border border-violet-400/20 bg-violet-500/5 blur-[1px]" />

          <div className="mx-auto max-w-[88rem]">
            <div className="mb-8 flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-[.22em]">
              <span className="inline-flex items-center gap-2 rounded-full border border-lime-300/30 bg-lime-300/10 px-3 py-2 text-lime-200">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Amostra de loja virtual
              </span>
              <span className="rounded-full border border-white/10 px-3 py-2 text-white/55">Produtos sociais → vitrine organizada</span>
            </div>

            <div className="grid items-end gap-10 lg:grid-cols-[1.05fr_.95fr]">
              <div>
                <MotionReveal as="p" variant="left" intensity="EXPRESSIVE" className="text-xs font-black uppercase tracking-[.28em] text-cyan-300">
                  Tecnologia + outlet + oportunidades
                </MotionReveal>
                <MotionReveal
                  as="h1"
                  variant="mask"
                  intensity="EXPRESSIVE"
                  className="mt-5 max-w-5xl text-[clamp(4.3rem,11vw,10rem)] font-black uppercase leading-[.73] tracking-[-.07em]"
                >
                  Mega
                  <span className="block bg-gradient-to-r from-cyan-300 via-white to-violet-300 bg-clip-text text-transparent">
                    Store
                  </span>
                </MotionReveal>
                <p className="mt-8 max-w-2xl text-lg leading-8 text-white/68 sm:text-xl">
                  Uma amostra de e-commerce para transformar as postagens da Centro Mega em uma vitrine navegável de celulares, tênis, outlet, acessórios e achadinhos.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <a
                    href="#vitrine"
                    className="inline-flex min-h-13 items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-black text-[#04101d] shadow-[0_0_44px_rgba(255,255,255,.12)] transition hover:-translate-y-1 hover:bg-cyan-200"
                  >
                    Ver vitrine
                    <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <FunnelCTA
                    selectedNames={selectedNames}
                    className="inline-flex min-h-13 items-center gap-3 rounded-full border border-cyan-300/35 bg-cyan-300/10 px-6 py-3.5 text-sm font-black text-cyan-100 transition hover:-translate-y-1 hover:bg-cyan-300 hover:text-[#04101d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
                  >
                    Consultar disponibilidade
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </FunnelCTA>
                </div>

                <div className="mt-10 grid max-w-2xl grid-cols-3 gap-2 sm:gap-3">
                  {[
                    ["02", "produtos sociais já convertidos em cards"],
                    ["06", "categorias preparadas para abastecimento"],
                    ["01", "funil individual preservado"],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/[.035] p-4 backdrop-blur">
                      <strong className="block text-2xl font-black text-white sm:text-3xl">{value}</strong>
                      <span className="mt-1 block text-[10px] font-bold uppercase leading-4 tracking-[.12em] text-white/45">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <MotionReveal variant="right" intensity="EXPRESSIVE">
                <div className="relative mx-auto max-w-2xl">
                  <div className="absolute -inset-10 -z-10 rounded-[4rem] bg-gradient-to-br from-cyan-400/20 via-violet-500/15 to-pink-500/20 blur-3xl" />
                  <div className="relative overflow-hidden rounded-[2.2rem] border border-white/15 bg-white/[.055] p-4 shadow-[0_30px_120px_rgba(0,0,0,.55)] backdrop-blur-xl sm:p-5">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[.22em] text-cyan-300">Vitrine inteligente</p>
                        <p className="mt-1 text-sm font-bold text-white/70">Posts viram produtos pesquisáveis</p>
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-full bg-lime-300/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.16em] text-lime-200">
                        <span className="h-2 w-2 rounded-full bg-lime-300 shadow-[0_0_12px_#b9ff49]" />
                        demo ativa
                      </span>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="group relative min-h-72 overflow-hidden rounded-[1.7rem] border border-cyan-300/20 bg-[radial-gradient(circle_at_70%_20%,rgba(48,231,255,.27),transparent_35%),linear-gradient(145deg,#071428,#06101d)] p-5">
                        <div className="absolute -right-10 top-12 h-48 w-48 rounded-full border border-cyan-300/20" />
                        <Smartphone className="absolute bottom-4 right-5 h-36 w-36 text-cyan-200/80 transition duration-500 group-hover:-rotate-6 group-hover:scale-110" strokeWidth={1} aria-hidden="true" />
                        <span className="relative z-10 inline-flex rounded-full bg-cyan-300 px-3 py-1.5 text-[9px] font-black uppercase tracking-[.18em] text-[#04101d]">
                          do feed
                        </span>
                        <p className="relative z-10 mt-7 max-w-[9rem] text-2xl font-black leading-none">Poco X5 Pro</p>
                        <p className="relative z-10 mt-2 text-xs font-bold text-white/50">8GB / 256GB</p>
                        <p className="relative z-10 mt-8 text-xs text-cyan-100/70">Oferta histórica captada de publicação pública.</p>
                      </div>

                      <div className="group relative min-h-72 overflow-hidden rounded-[1.7rem] border border-violet-300/20 bg-[radial-gradient(circle_at_25%_15%,rgba(124,77,255,.32),transparent_38%),linear-gradient(145deg,#161024,#080711)] p-5">
                        <Footprints className="absolute bottom-2 right-1 h-40 w-40 rotate-[-14deg] text-violet-200/70 transition duration-500 group-hover:rotate-[-4deg] group-hover:scale-110" strokeWidth={1} aria-hidden="true" />
                        <span className="relative z-10 inline-flex rounded-full bg-violet-300 px-3 py-1.5 text-[9px] font-black uppercase tracking-[.18em] text-[#130e22]">
                          outlet social
                        </span>
                        <p className="relative z-10 mt-7 max-w-[11rem] text-2xl font-black leading-none">Dunk Low Pro</p>
                        <p className="relative z-10 mt-2 text-xs font-bold text-white/50">Numeração sob consulta</p>
                        <p className="relative z-10 mt-8 text-xs text-violet-100/70">Produto encontrado em postagem pública da marca.</p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs font-bold text-white/55">A loja real confirmaria preço, estoque, tamanho e entrega antes da compra.</p>
                        <BadgeCheck className="h-5 w-5 shrink-0 text-cyan-300" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </div>
              </MotionReveal>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[.025] py-4">
          <div className="mx-auto flex max-w-[88rem] flex-wrap items-center justify-center gap-x-7 gap-y-2 px-4 text-[10px] font-black uppercase tracking-[.2em] text-white/48 sm:px-6">
            {["celulares", "acessórios", "outlet", "tênis", "bonés", "calçados", "novidades das redes"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <Zap className="h-3 w-3 text-cyan-300" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </section>

        <section id="vitrine" className="relative px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-[88rem]">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[.26em] text-cyan-300">Vitrine de produtos</p>
                <h2 className="mt-4 max-w-4xl text-5xl font-black leading-[.88] tracking-[-.05em] sm:text-7xl">
                  Do post perdido no feed para uma loja que dá vontade de explorar.
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/58">
                  Os cards abaixo distinguem produto social verificado, categoria oficial e categoria demonstrativa. Nada vira “estoque atual” sem confirmação.
                </p>
              </div>

              <div className="w-full max-w-xl">
                <label className="relative block">
                  <span className="sr-only">Buscar na vitrine</span>
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" aria-hidden="true" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar celular, tênis, outlet..."
                    className="min-h-13 w-full rounded-full border border-white/15 bg-white/[.05] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                  />
                </label>
              </div>
            </div>

            <div className="mt-9 flex flex-wrap gap-2" role="group" aria-label="Filtrar produtos por categoria">
              {categories.map((category) => {
                const active = activeCategory === category;
                return (
                  <button
                    type="button"
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    aria-pressed={active}
                    className={[
                      "min-h-11 rounded-full border px-4 text-xs font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200",
                      active
                        ? "border-cyan-300 bg-cyan-300 text-[#04101d] shadow-[0_0_26px_rgba(48,231,255,.2)]"
                        : "border-white/12 bg-white/[.035] text-white/65 hover:border-white/30 hover:text-white",
                    ].join(" ")}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <MotionStagger className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => {
                const selected = bag.includes(product.id);
                return (
                  <article
                    key={product.id}
                    className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#080d1b] p-5 shadow-[0_22px_80px_rgba(0,0,0,.28)] transition duration-500 hover:-translate-y-2 hover:border-white/25"
                  >
                    <div className={`absolute inset-x-0 top-0 h-40 bg-gradient-to-b ${accentClasses[product.accent]}`} />
                    <div className="relative grid min-h-64 place-items-center overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
                      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:32px_32px]" />
                      <div className="relative z-10 transition duration-500 group-hover:scale-110 group-hover:-rotate-3">
                        <ProductGlyph category={product.category} />
                      </div>
                      <span className="absolute left-4 top-4 z-20 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[9px] font-black uppercase tracking-[.18em] backdrop-blur">
                        {product.badge}
                      </span>
                      <span className="absolute bottom-4 right-4 z-20 rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[.18em] text-white/65">
                        {product.category}
                      </span>
                    </div>

                    <div className="relative mt-6">
                      <p className="text-[10px] font-black uppercase tracking-[.2em] text-cyan-300/80">{product.eyebrow}</p>
                      <h3 className="mt-2 text-2xl font-black tracking-[-.03em]">{product.name}</h3>
                      <p className="mt-3 min-h-20 text-sm leading-6 text-white/55">{product.description}</p>

                      {product.historicalPrice ? (
                        <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/[.06] p-4">
                          <p className="text-[10px] font-black uppercase tracking-[.18em] text-amber-200">Preço da publicação histórica</p>
                          <div className="mt-2 flex flex-wrap items-end gap-3">
                            {product.historicalPrice.before ? (
                              <span className="text-sm font-bold text-white/35 line-through">{product.historicalPrice.before}</span>
                            ) : null}
                            <strong className="text-2xl font-black text-white">{product.historicalPrice.after}</strong>
                          </div>
                          <p className="mt-2 text-[11px] leading-5 text-white/40">{product.historicalPrice.label}</p>
                        </div>
                      ) : (
                        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[.03] p-4 text-xs leading-5 text-white/45">
                          {product.detail}
                        </div>
                      )}

                      <div className="mt-5 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleBag(product.id)}
                          aria-pressed={selected}
                          className={[
                            "inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-4 text-xs font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200",
                            selected
                              ? "bg-lime-300 text-[#08120b] hover:bg-lime-200"
                              : "bg-white text-[#07101f] hover:-translate-y-0.5 hover:bg-cyan-200",
                          ].join(" ")}
                        >
                          {selected ? (
                            <>
                              <X className="h-4 w-4" aria-hidden="true" />
                              Remover da seleção
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4" aria-hidden="true" />
                              Quero este
                            </>
                          )}
                        </button>
                        {product.sourceUrl ? (
                          <a
                            href={product.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Abrir fonte pública de ${product.name}`}
                            className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/12 bg-white/[.035] text-white/60 transition hover:border-cyan-300/50 hover:text-cyan-200"
                          >
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </MotionStagger>

            {filteredProducts.length === 0 ? (
              <div className="mt-10 rounded-[2rem] border border-dashed border-white/15 p-10 text-center">
                <p className="font-black">Nenhum item nesta combinação.</p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("Todos");
                    setQuery("");
                  }}
                  className="mt-4 text-sm font-bold text-cyan-300 underline underline-offset-4"
                >
                  Limpar filtros
                </button>
              </div>
            ) : null}
          </div>
        </section>

        <section id="outlet" className="relative overflow-hidden border-y border-white/10 bg-[#090313] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_30%,rgba(255,61,167,.18),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(185,255,73,.12),transparent_30%)]" />
          <div className="relative mx-auto max-w-[88rem]">
            <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
              <div className="lg:sticky lg:top-28">
                <p className="text-xs font-black uppercase tracking-[.26em] text-pink-300">Outlet mode</p>
                <h2 className="mt-4 text-5xl font-black uppercase leading-[.84] tracking-[-.06em] sm:text-7xl">
                  Oferta rápida.
                  <span className="block text-lime-300">Vitrine organizada.</span>
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-white/58">
                  A lógica da amostra é simples: aquilo que hoje aparece e desaparece no feed pode ganhar categoria, busca, seleção e contexto de compra.
                </p>
                <div className="mt-8 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[.16em] text-white/55">
                  {["ponta de grade", "novidade social", "produto único", "estoque curto", "oportunidade"].map((item) => (
                    <span key={item} className="rounded-full border border-white/12 bg-white/[.04] px-3 py-2">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    number: "01",
                    title: "Postagem vira item",
                    text: "Produto, legenda, data e origem entram no catálogo com provenance, sem transformar preço antigo em preço atual.",
                    tone: "border-cyan-300/20 bg-cyan-300/[.055]",
                  },
                  {
                    number: "02",
                    title: "Item ganha contexto",
                    text: "Categoria, busca, tamanho, variação e disponibilidade ficam organizados para a pessoa saber o que consultar.",
                    tone: "border-violet-300/20 bg-violet-300/[.055]",
                  },
                  {
                    number: "03",
                    title: "Seleção acompanha o funil",
                    text: "O visitante marca produtos e a escolha segue para o atendimento sem pedir a mesma informação outra vez.",
                    tone: "border-lime-300/20 bg-lime-300/[.05]",
                  },
                  {
                    number: "04",
                    title: "A loja confirma o que muda",
                    text: "Preço, estoque, numeração e entrega são confirmados no momento do atendimento, mantendo a amostra honesta.",
                    tone: "border-pink-300/20 bg-pink-300/[.05]",
                  },
                ].map((item) => (
                  <MotionReveal key={item.number} variant="up" intensity="EXPRESSIVE">
                    <article className={`min-h-64 rounded-[2rem] border p-6 ${item.tone}`}>
                      <span className="text-4xl font-black text-white/18">{item.number}</span>
                      <h3 className="mt-10 text-2xl font-black">{item.title}</h3>
                      <p className="mt-3 leading-7 text-white/52">{item.text}</p>
                    </article>
                  </MotionReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="feed" className="px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-[88rem]">
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[.26em] text-violet-300">Social commerce</p>
                <h2 className="mt-4 max-w-4xl text-5xl font-black leading-[.9] tracking-[-.05em] sm:text-7xl">
                  Facebook e Instagram viram a entrada da loja — não o fim da jornada.
                </h2>
              </div>
              <p className="max-w-xl text-lg leading-8 text-white/55 lg:justify-self-end">
                O perfil social continua servindo para descoberta. A amostra organiza o que é verificável e encaminha o cliente para uma consulta com contexto.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {CENTRO_MEGA_SOCIAL_SOURCES.map((source, index) => (
                <a
                  key={source.href}
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative min-h-52 overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[.035] p-5 transition duration-500 hover:-translate-y-2 hover:border-violet-300/45"
                >
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-400/10 blur-2xl transition group-hover:bg-cyan-300/15" />
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10">
                      {source.kind === "Instagram" ? <Instagram className="h-5 w-5 text-pink-300" aria-hidden="true" /> : <Facebook className="h-5 w-5 text-blue-300" aria-hidden="true" />}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[.2em] text-white/30">0{index + 1}</span>
                  </div>
                  <p className="mt-10 text-xs font-black uppercase tracking-[.18em] text-white/40">{source.kind}</p>
                  <p className="mt-2 font-black">{source.label}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-cyan-300">
                    Abrir fonte
                    <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-amber-300/15 bg-amber-300/[.05] p-5 text-sm leading-6 text-amber-100/70">
              Nesta amostra, postagens que não puderam ser lidas com segurança não tiveram produto/modelo inventado. Elas permanecem como fontes de descoberta até haver conteúdo verificável.
            </div>
          </div>
        </section>

        <section id="lojas" className="border-y border-white/10 bg-[#061226] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <div className="mx-auto grid max-w-[88rem] gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[.26em] text-cyan-300">Presença multicanal</p>
              <h2 className="mt-4 text-5xl font-black leading-[.9] tracking-[-.05em] sm:text-7xl">
                A loja digital conversa com as unidades que já existem.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/58">
                O Linktree oficial reúne SAC, Outlet São José dos Pinhais, Galeria Di Brunno, Shopping Cidade, Pinheirinho e Instagram.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={links.linktree}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-cyan-300 px-5 font-black text-[#04101d] transition hover:-translate-y-1 hover:bg-white"
                >
                  Ver canais oficiais
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href={links.store}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/15 px-5 font-black text-white/75 transition hover:border-white/35 hover:text-white"
                >
                  Loja / contato atual
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Outlet", "São José dos Pinhais", "lime"],
                ["Galeria Di Brunno", "São José dos Pinhais", "cyan"],
                ["Shopping Cidade", "Curitiba", "violet"],
                ["Pinheirinho", "Curitiba", "pink"],
              ].map(([name, city, tone]) => (
                <div key={name} className="relative min-h-52 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.045] p-6">
                  <div className={`absolute right-0 top-0 h-28 w-28 rounded-full blur-3xl ${tone === "lime" ? "bg-lime-300/15" : tone === "cyan" ? "bg-cyan-300/15" : tone === "violet" ? "bg-violet-400/15" : "bg-pink-400/15"}`} />
                  <MapPin className="h-7 w-7 text-cyan-300" aria-hidden="true" />
                  <p className="mt-10 text-xs font-black uppercase tracking-[.18em] text-white/35">Centro Mega</p>
                  <h3 className="mt-2 text-2xl font-black">{name}</h3>
                  <p className="mt-2 text-sm font-bold text-white/50">{city}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="sacola" className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_100%,rgba(48,231,255,.15),transparent_36%)]" />
          <div className="mx-auto max-w-[88rem]">
            <div className="grid gap-8 rounded-[2.4rem] border border-white/12 bg-white/[.04] p-6 shadow-[0_30px_120px_rgba(0,0,0,.34)] backdrop-blur-xl sm:p-10 lg:grid-cols-[1fr_.8fr] lg:p-12">
              <div>
                <p className="text-xs font-black uppercase tracking-[.26em] text-lime-300">Minha seleção</p>
                <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[.92] tracking-[-.04em] sm:text-6xl">
                  Monte uma sacola demonstrativa e leve o contexto para a equipe.
                </h2>
                <p className="mt-5 max-w-2xl leading-7 text-white/55">
                  Esta amostra não fecha pagamento nem promete estoque. Ela demonstra como a Centro Mega pode capturar intenção de compra com menos atrito.
                </p>

                {selectedProducts.length ? (
                  <div className="mt-8 space-y-3">
                    {selectedProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="min-w-0">
                          <p className="truncate font-black">{product.name}</p>
                          <p className="mt-1 text-xs font-bold uppercase tracking-[.14em] text-white/35">{product.category}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleBag(product.id)}
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 text-white/50 transition hover:border-pink-300/50 hover:text-pink-200"
                          aria-label={`Remover ${product.name} da seleção`}
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-8 rounded-2xl border border-dashed border-white/15 p-6 text-white/45">
                    <ShoppingBag className="h-7 w-7 text-white/30" aria-hidden="true" />
                    <p className="mt-4 font-bold">Sua seleção está vazia.</p>
                    <a href="#vitrine" className="mt-2 inline-flex items-center gap-2 text-sm font-black text-cyan-300">
                      Escolher produtos
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                )}
              </div>

              <div className="rounded-[2rem] border border-cyan-300/15 bg-[#061226] p-6 sm:p-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-lime-300/10 px-3 py-2 text-[10px] font-black uppercase tracking-[.16em] text-lime-200">
                  <PackageCheck className="h-4 w-4" aria-hidden="true" />
                  fluxo seguro
                </span>
                <p className="mt-6 text-2xl font-black">Pronto para consultar?</p>
                <p className="mt-3 leading-7 text-white/50">
                  {selectedProducts.length
                    ? `${selectedProducts.length} item(ns) seguem com você para o funil da Centro Mega.`
                    : "Você pode iniciar sem selecionar produto e explicar o que procura no funil."}
                </p>
                <FunnelCTA
                  selectedNames={selectedNames}
                  className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-cyan-300 px-6 py-4 font-black text-[#04101d] shadow-[0_0_34px_rgba(48,231,255,.18)] transition hover:-translate-y-1 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {selectedProducts.length ? "Consultar minha seleção" : "Falar sobre um produto"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </FunnelCTA>
                <p className="mt-4 text-center text-[11px] leading-5 text-white/35">
                  Preço, estoque, tamanho, cor e entrega são confirmados pela loja. Nenhum dado histórico é tratado como condição atual.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-10 lg:pb-28">
          <div className="mx-auto max-w-[88rem] overflow-hidden rounded-[2.4rem] border border-white/10 bg-gradient-to-r from-cyan-300 via-white to-lime-300 p-[1px]">
            <div className="rounded-[2.35rem] bg-[#030611] p-8 sm:p-12">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.24em] text-cyan-300">Conceito pronto para abastecer</p>
                  <h2 className="mt-4 max-w-4xl text-4xl font-black leading-[.92] tracking-[-.04em] sm:text-6xl">
                    Hoje é uma amostra. Amanhã pode receber catálogo real, estoque, preço e checkout.
                  </h2>
                </div>
                <FunnelCTA
                  selectedNames={selectedNames}
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-7 py-4 font-black text-[#04101d] transition hover:-translate-y-1 hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
                >
                  Quero ver funcionando
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </FunnelCTA>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#02040a] px-4 py-9 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[88rem] flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4">
            <PortfolioImage
              src="/images/centro-mega/logo.png"
              alt="Centro Mega"
              width={500}
              height={500}
              managedField="logoUrl"
              className="h-14 w-14 rounded-2xl object-cover"
            />
            <div>
              <p className="font-black uppercase tracking-[.12em]">Centro Mega Store</p>
              <p className="mt-1 text-sm text-white/40">Amostra de loja virtual · tecnologia + outlet</p>
              <div className="mt-4 flex gap-3">
                <a href={links.instagram} target="_blank" rel="noreferrer" aria-label="Instagram Centro Mega" className="text-white/45 transition hover:text-pink-300">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href={links.facebook} target="_blank" rel="noreferrer" aria-label="Facebook Centro Mega" className="text-white/45 transition hover:text-blue-300">
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="centro-mega"
        eyebrow="Centro Mega · Store Concept"
        title="Do feed para uma vitrine organizada."
        description="Explore a amostra, selecione produtos e leve o contexto direto para o atendimento."
        ctaLabel="Explorar a loja"
        ctaHref="#vitrine"
        delayMs={12000}
        className="border-cyan-300/25 bg-[#061226]/95 text-white"
        accentClassName="text-cyan-300"
      />
      <PortfolioUpsellPopup pageName="portfolio-centro-mega" />
    </div>
  );
}
