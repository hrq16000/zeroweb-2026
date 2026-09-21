import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgePercent,
  Check,
  Facebook,
  Footprints,
  Headphones,
  Instagram,
  PackageOpen,
  Search,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Store,
  X,
  Zap,
} from "lucide-react";
import {
  MotionReveal,
  MotionScope,
  MotionStagger,
  MotionTextReveal,
} from "@/components/motion";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import {
  centroMegaInstagramPosts,
  centroMegaOfficialLinks,
  centroMegaStoreCategories,
  centroMegaStoreProducts,
  type CentroMegaStoreProduct,
} from "@/config/centro-mega-store-products";

const quizConfig = {
  services: [
    "Celular / smartphone",
    "Tênis / calçado",
    "Boné / moda outlet",
    "Acessório para celular",
    "Quero consultar novidades",
  ],
  experienceOptions: [
    "Quero comprar para mim",
    "Estou pesquisando presente",
    "Quero comparar opções",
    "Só quero saber o que está disponível",
  ],
  periodOptions: [
    "São José dos Pinhais",
    "Curitiba",
    "Outra cidade / consultar envio",
    "Prefiro confirmar depois",
  ],
  timingOptions: [
    "Quero ver disponibilidade agora",
    "Ainda nesta semana",
    "Estou só pesquisando",
    "Quero acompanhar próximas ofertas",
  ],
  stepTitles: {
    service: "O que você quer encontrar?",
    experience: "Qual é a sua intenção de compra?",
    period: "Onde você está?",
    timing: "Quando pretende comprar?",
  },
  notePlaceholder:
    "Se quiser, informe modelo, numeração, cor, faixa de preço ou outro detalhe.",
  proposalKind: "service" as const,
};

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value);
}

function ProductVisual({ product }: { product: CentroMegaStoreProduct }) {
  const base =
    "relative isolate grid aspect-[4/3] place-items-center overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d1023]";

  if (product.visual === "phone") {
    return (
      <div className={base}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_24%,rgba(0,239,255,.28),transparent_28%),radial-gradient(circle_at_28%_72%,rgba(255,0,119,.25),transparent_28%)]" />
        <div className="mega-float relative h-44 w-24 rotate-[10deg] rounded-[1.7rem] border-4 border-[#11162a] bg-[linear-gradient(145deg,#0ef,#5d3df5_48%,#ff247c)] p-2 shadow-[0_28px_80px_rgba(0,239,255,.28)]">
          <div className="h-full rounded-[1.2rem] border border-white/20 bg-[radial-gradient(circle_at_50%_15%,#fff6,transparent_20%),linear-gradient(160deg,#161a34,#42137d_42%,#0ddbd0)]">
            <div className="mx-auto mt-2 h-1.5 w-8 rounded-full bg-black/60" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-[.2em] text-white/85">
              POCO
            </div>
          </div>
        </div>
        <div className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-cyan-200 backdrop-blur">
          visual editorial
        </div>
      </div>
    );
  }

  if (product.visual === "sneaker" || product.visual === "footwear") {
    return (
      <div className={base}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_28%,rgba(255,221,0,.22),transparent_24%),radial-gradient(circle_at_78%_68%,rgba(255,0,119,.23),transparent_28%)]" />
        <div className="mega-float relative h-28 w-56 -rotate-[8deg] rounded-[48%_55%_32%_40%] border-[5px] border-white bg-[linear-gradient(135deg,#f8f8f8_0_52%,#171717_52%_66%,#f8f8f8_66%)] shadow-[0_30px_80px_rgba(255,0,119,.22)]">
          <div className="absolute bottom-0 left-0 h-4 w-full rounded-b-[3rem] bg-[#e8e8e8]" />
          <div className="absolute left-16 top-10 h-5 w-24 -rotate-[20deg] rounded-full bg-[#121212]" />
          <div className="absolute left-8 top-5 text-[11px] font-black tracking-[.2em] text-black/45">
            {product.visual === "sneaker" ? "DUNK" : "OUTLET"}
          </div>
        </div>
        <div className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-fuchsia-200 backdrop-blur">
          visual editorial
        </div>
      </div>
    );
  }

  if (product.visual === "cap") {
    return (
      <div className={base}>
        <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(0,239,255,.15),rgba(255,0,119,.2),rgba(255,221,0,.15),rgba(0,239,255,.15))]" />
        <div className="mega-float relative h-28 w-40 rounded-t-[5rem] rounded-bl-[2rem] bg-[linear-gradient(145deg,#0de0ff,#29309d)] shadow-[0_28px_70px_rgba(0,239,255,.25)]">
          <div className="absolute -right-14 bottom-0 h-10 w-24 -rotate-6 rounded-[100%_20%_80%_20%] bg-[#ffdd00]" />
          <div className="absolute inset-x-0 top-8 text-center text-xs font-black tracking-[.22em] text-white">
            MEGA
          </div>
        </div>
      </div>
    );
  }

  if (product.visual === "accessory") {
    return (
      <div className={base}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(67,255,170,.24),transparent_36%)]" />
        <Headphones className="mega-float h-32 w-32 text-emerald-300 drop-shadow-[0_22px_35px_rgba(67,255,170,.28)]" strokeWidth={1.25} />
      </div>
    );
  }

  return (
    <div className={base}>
      <div className="mega-scan absolute inset-0 bg-[linear-gradient(115deg,transparent_0_35%,rgba(255,255,255,.12)_48%,transparent_61%)]" />
      <PackageOpen className="mega-float h-32 w-32 text-[#ffdd00] drop-shadow-[0_24px_36px_rgba(255,221,0,.18)]" strokeWidth={1.2} />
      <Sparkles className="absolute right-8 top-8 h-8 w-8 text-cyan-300" />
    </div>
  );
}

function StoreCTA({
  children,
  selectedProducts,
  className,
}: {
  children: React.ReactNode;
  selectedProducts?: CentroMegaStoreProduct[];
  className?: string;
}) {
  const names = selectedProducts?.map((item) => item.name) ?? [];
  const orderItems = names.join(" | ");
  const service =
    names.length > 0
      ? names.length === 1
        ? names[0]
        : `Seleção da vitrine: ${names.join(" + ")}`
      : undefined;

  return (
    <PortfolioCTAQuiz
      clientKey="centro-mega"
      studioName="Centro Mega"
      recipientName="a equipe Centro Mega"
      theme="navy"
      mode="proposal"
      funnelIntent="pedido"
      quizConfig={quizConfig}
      initialAnswers={service ? { service } : undefined}
      skipPrefilledSteps={Boolean(service)}
      orderContext={
        names.length
          ? {
              order_items: orderItems,
              customer_note:
                "Seleção criada na amostra de loja virtual. Confirmar disponibilidade, preço e condições atuais.",
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
  const [category, setCategory] = useState<(typeof centroMegaStoreCategories)[number]["id"]>("todos");
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return centroMegaStoreProducts.filter((product) => {
      const categoryMatches = category === "todos" || product.category === category;
      const queryMatches =
        !normalized ||
        product.name.toLowerCase().includes(normalized) ||
        product.description.toLowerCase().includes(normalized) ||
        product.badges?.some((badge) => badge.toLowerCase().includes(normalized));
      return categoryMatches && queryMatches;
    });
  }, [category, query]);

  const selectedProducts = useMemo(
    () => centroMegaStoreProducts.filter((product) => selectedIds.includes(product.id)),
    [selectedIds],
  );

  const toggleProduct = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <MotionScope intensity="EXPRESSIVE">
      <div
        data-client-slug="centro-mega"
        className="min-h-dvh overflow-x-hidden bg-[#060711] text-white selection:bg-[#ffdd00] selection:text-black"
        style={
          {
            "--mega-cyan": "#1EE7FF",
            "--mega-pink": "#FF257E",
            "--mega-lime": "#A8FF35",
            "--mega-gold": "#FFDD00",
            "--mega-violet": "#725BFF",
          } as React.CSSProperties
        }
      >
        <style>{`
          @keyframes mega-float {
            0%,100% { transform: translate3d(0,0,0) rotate(var(--mega-rotate,0deg)); }
            50% { transform: translate3d(0,-10px,0) rotate(var(--mega-rotate,0deg)); }
          }
          @keyframes mega-scan {
            0% { transform: translateX(-55%); }
            100% { transform: translateX(55%); }
          }
          @keyframes mega-marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          @media (prefers-reduced-motion: no-preference) {
            .mega-float { animation: mega-float 5s ease-in-out infinite; }
            .mega-scan { animation: mega-scan 4.5s linear infinite; }
            .mega-marquee-track { animation: mega-marquee 22s linear infinite; }
          }
        `}</style>

        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#060711]/82 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-10">
          <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4">
            <a href="#inicio" className="flex min-w-0 items-center gap-3" aria-label="Centro Mega Store — início">
              <PortfolioImage
                src="/images/centro-mega/logo.png"
                alt="Centro Mega"
                width={500}
                height={500}
                priority
                managedField="logoUrl"
                className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/15"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-black uppercase tracking-[.08em]">Centro Mega Store</p>
                <p className="truncate text-[10px] font-black uppercase tracking-[.18em] text-cyan-300">
                  amostra de loja virtual
                </p>
              </div>
            </a>

            <nav className="hidden items-center gap-6 text-xs font-black uppercase tracking-[.14em] text-white/70 lg:flex">
              <a href="#vitrine" className="transition hover:text-white">Vitrine</a>
              <a href="#outlet" className="transition hover:text-white">Outlet</a>
              <a href="#redes" className="transition hover:text-white">Drops</a>
              <a href="#lojas" className="transition hover:text-white">Presença</a>
            </nav>

            <div className="flex items-center gap-2">
              <a
                href="#vitrine"
                className="hidden min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-xs font-black sm:inline-flex"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Explorar
              </a>
              <StoreCTA
                selectedProducts={selectedProducts}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--mega-gold)] px-4 text-xs font-black text-black transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                {selectedIds.length ? `Seleção (${selectedIds.length})` : "Consultar"}
              </StoreCTA>
            </div>
          </div>
        </header>

        <main>
          <section id="inicio" className="relative isolate overflow-hidden px-4 pb-16 pt-10 sm:px-6 lg:px-10 lg:pb-24 lg:pt-16">
            <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_12%_8%,rgba(30,231,255,.18),transparent_28%),radial-gradient(circle_at_86%_18%,rgba(255,37,126,.22),transparent_30%),radial-gradient(circle_at_66%_82%,rgba(114,91,255,.18),transparent_30%)]" />
            <div className="absolute inset-0 -z-20 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:48px_48px]" />
            <div className="absolute left-[8%] top-20 -z-10 h-64 w-64 rounded-full bg-cyan-400/15 blur-[90px]" />
            <div className="absolute right-[4%] top-10 -z-10 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-[110px]" />

            <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
              <div>
                <MotionReveal>
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-[10px] font-black uppercase tracking-[.22em] text-cyan-200">
                    <Zap className="h-4 w-4" aria-hidden="true" />
                    Centro Mega · Store Concept
                  </div>
                </MotionReveal>

                <h1 className="mt-6 max-w-5xl text-[clamp(3.25rem,8vw,8.4rem)] font-black uppercase leading-[.82] tracking-[-.065em]">
                  <MotionTextReveal text="Tech." className="block text-white" />
                  <MotionTextReveal text="Outlet." className="block text-[var(--mega-cyan)]" />
                  <MotionTextReveal text="Achados." className="block text-[var(--mega-pink)]" />
                </h1>

                <MotionReveal delay={180}>
                  <p className="mt-7 max-w-2xl text-lg leading-8 text-white/68 sm:text-xl">
                    Uma amostra de loja virtual inspirada no que a Centro Mega já publica:
                    celulares, acessórios e oportunidades de outlet em uma experiência muito mais
                    visual, navegável e pronta para transformar postagem em interesse de compra.
                  </p>
                </MotionReveal>

                <MotionReveal delay={260}>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href="#vitrine"
                      className="inline-flex min-h-13 items-center gap-2 rounded-full bg-white px-6 py-3.5 font-black text-black transition hover:-translate-y-1 hover:bg-[var(--mega-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                    >
                      Entrar na vitrine
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <StoreCTA
                      selectedProducts={selectedProducts}
                      className="inline-flex min-h-13 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 font-black text-white backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                    >
                      Montar pedido
                      <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                    </StoreCTA>
                  </div>
                </MotionReveal>

                <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    ["Celulares", "Produtos publicados"],
                    ["Outlet", "Tênis + moda"],
                    ["Acessórios", "Tech diária"],
                    ["Drops", "Redes oficiais"],
                  ].map(([title, subtitle]) => (
                    <div key={title} className="rounded-2xl border border-white/10 bg-white/[.035] p-4 backdrop-blur">
                      <p className="text-sm font-black">{title}</p>
                      <p className="mt-1 text-xs text-white/45">{subtitle}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[34rem] lg:min-h-[42rem]">
                <div className="absolute left-[4%] top-[10%] w-[58%] rotate-[-7deg]">
                  <ProductVisual product={centroMegaStoreProducts[0]} />
                </div>
                <div className="absolute bottom-[7%] right-[0%] w-[56%] rotate-[6deg]">
                  <ProductVisual product={centroMegaStoreProducts[1]} />
                </div>
                <div className="absolute right-[4%] top-[4%] rounded-2xl border border-white/15 bg-black/55 px-4 py-3 text-right shadow-2xl backdrop-blur">
                  <p className="text-[10px] font-black uppercase tracking-[.18em] text-[var(--mega-gold)]">
                    vitrine social
                  </p>
                  <p className="mt-1 text-sm font-black">Posts viram produtos</p>
                </div>
                <div className="absolute bottom-[14%] left-[2%] rounded-2xl border border-fuchsia-300/20 bg-fuchsia-500/10 px-4 py-3 backdrop-blur">
                  <p className="text-xs font-black uppercase tracking-[.14em] text-fuchsia-200">
                    disponibilidade sob consulta
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden border-y border-white/10 bg-[var(--mega-gold)] py-3 text-black">
            <div className="mega-marquee-track flex w-max gap-10 whitespace-nowrap text-xs font-black uppercase tracking-[.22em]">
              {Array.from({ length: 2 }).flatMap((_, loop) =>
                ["Celulares", "Outlet", "Tênis", "Bonés", "Calçados", "Acessórios", "Novidades"].map(
                  (item) => (
                    <span key={`${loop}-${item}`} className="inline-flex items-center gap-10">
                      {item}
                      <span aria-hidden="true">✦</span>
                    </span>
                  ),
                ),
              )}
            </div>
          </section>

          <section id="vitrine" className="px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
            <div className="mx-auto max-w-[90rem]">
              <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.24em] text-cyan-300">
                    Vitrine experimental
                  </p>
                  <h2 className="mt-4 text-5xl font-black uppercase leading-[.9] tracking-[-.04em] sm:text-7xl">
                    Produtos que já nasceram nas redes.
                  </h2>
                </div>
                <div className="max-w-2xl lg:justify-self-end">
                  <p className="text-lg leading-8 text-white/62">
                    Dois produtos abaixo vieram de publicações públicas indexadas da Centro Mega.
                    Os demais mostram como categorias reais da operação podem virar uma loja viva sem
                    inventar estoque, preço ou marca.
                  </p>
                </div>
              </div>

              <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="flex flex-wrap gap-2">
                  {centroMegaStoreCategories.map((item) => {
                    const active = category === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCategory(item.id)}
                        className={[
                          "rounded-full border px-4 py-2.5 text-xs font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300",
                          active
                            ? "border-white bg-white text-black"
                            : "border-white/12 bg-white/[.035] text-white/68 hover:border-white/30 hover:text-white",
                        ].join(" ")}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
                <label className="relative block min-w-0 lg:w-80">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" aria-hidden="true" />
                  <span className="sr-only">Buscar na vitrine</span>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar na vitrine..."
                    className="min-h-12 w-full rounded-full border border-white/12 bg-white/[.035] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-300/60"
                  />
                </label>
              </div>

              <MotionStagger className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {visibleProducts.map((product) => {
                  const selected = selectedIds.includes(product.id);
                  return (
                    <article
                      key={product.id}
                      className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.035] p-3 transition duration-300 hover:-translate-y-2 hover:border-white/25 hover:bg-white/[.055]"
                    >
                      <ProductVisual product={product} />
                      <div className="p-3 pt-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white/7 px-2.5 py-1 text-[9px] font-black uppercase tracking-[.16em] text-cyan-200">
                            {product.kicker}
                          </span>
                          {product.sampleOnly ? (
                            <span className="rounded-full border border-white/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[.16em] text-white/45">
                              demonstração
                            </span>
                          ) : null}
                        </div>

                        <h3 className="mt-4 text-2xl font-black leading-tight">{product.name}</h3>
                        <p className="mt-3 min-h-[4.5rem] text-sm leading-6 text-white/55">
                          {product.description}
                        </p>

                        {product.historicalPrice ? (
                          <div className="mt-5 rounded-2xl border border-[var(--mega-gold)]/20 bg-[var(--mega-gold)]/8 p-4">
                            {product.historicalPrice.from ? (
                              <p className="text-xs text-white/38 line-through">
                                {money(product.historicalPrice.from)}
                              </p>
                            ) : null}
                            <p className="mt-1 text-3xl font-black text-[var(--mega-gold)]">
                              {money(product.historicalPrice.to)}
                            </p>
                            <p className="mt-1 text-[10px] font-bold uppercase tracking-[.12em] text-white/40">
                              {product.historicalPrice.label} · não é preço atual garantido
                            </p>
                          </div>
                        ) : (
                          <div className="mt-5 flex min-h-[5.7rem] items-center rounded-2xl border border-white/8 bg-white/[.025] p-4">
                            <p className="text-sm font-black text-white/66">Preço e disponibilidade sob consulta</p>
                          </div>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                          {product.badges?.map((badge) => (
                            <span key={badge} className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-bold text-white/50">
                              {badge}
                            </span>
                          ))}
                        </div>

                        <div className="mt-5 flex gap-2">
                          <button
                            type="button"
                            onClick={() => toggleProduct(product.id)}
                            aria-pressed={selected}
                            className={[
                              "inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300",
                              selected
                                ? "bg-[var(--mega-lime)] text-black"
                                : "bg-white text-black hover:bg-[var(--mega-gold)]",
                            ].join(" ")}
                          >
                            {selected ? <Check className="h-4 w-4" aria-hidden="true" /> : <ShoppingCart className="h-4 w-4" aria-hidden="true" />}
                            {selected ? "Na seleção" : "Adicionar"}
                          </button>
                          <a
                            href={product.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="grid min-h-12 min-w-12 place-items-center rounded-full border border-white/12 text-white/60 transition hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                            aria-label={`Abrir fonte de ${product.name}`}
                            title={product.sourceLabel}
                          >
                            <ArrowRight className="h-4 w-4 -rotate-45" aria-hidden="true" />
                          </a>
                        </div>

                        <p className="mt-4 text-[10px] leading-5 text-white/32">
                          {product.sourceNote}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </MotionStagger>

              {visibleProducts.length === 0 ? (
                <div className="mt-10 rounded-[2rem] border border-dashed border-white/15 p-10 text-center">
                  <PackageOpen className="mx-auto h-10 w-10 text-white/30" aria-hidden="true" />
                  <p className="mt-4 font-black">Nada encontrado nesta combinação.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setCategory("todos");
                    }}
                    className="mt-4 text-sm font-black text-cyan-300 underline underline-offset-4"
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : null}
            </div>
          </section>

          <section id="outlet" className="relative overflow-hidden bg-white px-4 py-20 text-black sm:px-6 lg:px-10 lg:py-28">
            <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-fuchsia-400/25 blur-[120px]" />
            <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-cyan-300/30 blur-[120px]" />
            <div className="relative mx-auto max-w-[90rem]">
              <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-[10px] font-black uppercase tracking-[.2em] text-white">
                    <BadgePercent className="h-4 w-4 text-[var(--mega-gold)]" aria-hidden="true" />
                    Outlet Mode
                  </div>
                  <h2 className="mt-5 max-w-4xl text-5xl font-black uppercase leading-[.86] tracking-[-.05em] sm:text-7xl">
                    Uma loja que muda conforme as oportunidades aparecem.
                  </h2>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-black/60">
                    A proposta não é congelar um catálogo. É transformar as postagens recorrentes da
                    Centro Mega em uma vitrine digital com origem, data, categoria e CTA de consulta.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["01", "Post entra", "A publicação é verificada e ganha origem/data."],
                    ["02", "Produto nasce", "Nome, categoria e detalhes publicados viram card."],
                    ["03", "Estoque não é inventado", "Preço, grade e disponibilidade recebem tratamento de freshness."],
                    ["04", "Interesse continua", "A seleção segue para o funil individual da Centro Mega."],
                  ].map(([n, title, body], index) => (
                    <MotionReveal key={n} delay={index * 90}>
                      <article className="min-h-52 rounded-[2rem] border-2 border-black p-6 shadow-[8px_8px_0_#ffdd00]">
                        <p className="text-sm font-black text-fuchsia-600">{n}</p>
                        <h3 className="mt-8 text-2xl font-black uppercase">{title}</h3>
                        <p className="mt-3 text-sm leading-6 text-black/58">{body}</p>
                      </article>
                    </MotionReveal>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="redes" className="px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
            <div className="mx-auto max-w-[90rem]">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.24em] text-fuchsia-300">
                    Social commerce
                  </p>
                  <h2 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-[.9] tracking-[-.045em] sm:text-7xl">
                    A rede social vira a fila de abastecimento da loja.
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={centroMegaOfficialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/15 px-5 text-sm font-black hover:border-fuchsia-300/60"
                  >
                    <Instagram className="h-4 w-4" aria-hidden="true" />
                    @centro.mega
                  </a>
                  <a
                    href={centroMegaOfficialLinks.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/15 px-5 text-sm font-black hover:border-cyan-300/60"
                  >
                    <Facebook className="h-4 w-4" aria-hidden="true" />
                    Facebook
                  </a>
                </div>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {centroMegaInstagramPosts.map((href, index) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative min-h-40 overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,37,126,.12),rgba(30,231,255,.06))] p-6 transition hover:-translate-y-1 hover:border-white/25"
                  >
                    <div className="mega-scan absolute inset-0 bg-[linear-gradient(115deg,transparent_0_35%,rgba(255,255,255,.08)_48%,transparent_61%)]" />
                    <div className="relative">
                      <p className="text-[10px] font-black uppercase tracking-[.2em] text-fuchsia-200">
                        publicação oficial {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-12 flex items-center justify-between text-lg font-black">
                        Abrir no Instagram
                        <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" aria-hidden="true" />
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              <p className="mt-6 max-w-3xl text-xs leading-6 text-white/38">
                Os links oficiais são preservados como fonte. Quando o conteúdo da postagem não está
                acessível ao crawler, a loja não inventa produto, preço ou descrição: o item só entra
                após resolução verificável.
              </p>
            </div>
          </section>

          <section id="lojas" className="border-y border-white/10 bg-[#0c0e1d] px-4 py-20 sm:px-6 lg:px-10">
            <div className="mx-auto grid max-w-[90rem] gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[.24em] text-[var(--mega-lime)]">
                  Presença real
                </p>
                <h2 className="mt-4 text-5xl font-black uppercase leading-[.9] sm:text-7xl">
                  O digital aponta para uma operação que já existe.
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
                  O Linktree público da Centro Mega lista SAC e frentes como Outlet São José dos
                  Pinhais, Galeria Di Brunno, Shopping Cidade e Pinheirinho. A amostra usa essa
                  presença como contexto, sem transformar canais externos em atalhos que quebrem o
                  funil do portfolio.
                </p>
              </div>

              <div className="grid gap-3">
                {[
                  "Centro Mega Outlet · São José dos Pinhais",
                  "Centro Mega · Galeria Di Brunno",
                  "Centro Mega · Shopping Cidade",
                  "Centro Mega · Pinheirinho",
                  "SAC · canais oficiais",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[.035] p-5"
                  >
                    <div className="flex items-center gap-4">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-xs font-black text-cyan-200">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-black">{item}</span>
                    </div>
                    <Store className="h-5 w-5 text-white/30" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
            <div className="mx-auto max-w-[90rem] rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_18%_20%,rgba(30,231,255,.16),transparent_26%),radial-gradient(circle_at_78%_80%,rgba(255,37,126,.18),transparent_30%),#0c0e1d] p-7 sm:p-10 lg:p-14">
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.24em] text-[var(--mega-gold)]">
                    Sua seleção
                  </p>
                  <h2 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-[.88] sm:text-7xl">
                    Gostou? Leve os produtos escolhidos para o atendimento.
                  </h2>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
                    A amostra não fecha compra com preço antigo. Ela preserva o que você escolheu e
                    entrega esse contexto ao funil para confirmar estoque, valor e próximo passo.
                  </p>
                </div>
                <StoreCTA
                  selectedProducts={selectedProducts}
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[var(--mega-gold)] px-7 py-4 text-sm font-black text-black transition hover:-translate-y-1 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                  {selectedIds.length ? `Consultar ${selectedIds.length} item(ns)` : "Consultar produtos"}
                </StoreCTA>
              </div>

              {selectedProducts.length ? (
                <div className="mt-8 flex flex-wrap gap-2">
                  {selectedProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => toggleProduct(product.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[.04] px-3 py-2 text-xs font-bold text-white/70 hover:border-white/25"
                      aria-label={`Remover ${product.name} da seleção`}
                    >
                      {product.name}
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        </main>

        {selectedProducts.length ? (
          <div className="fixed inset-x-0 bottom-4 z-50 px-4 sm:bottom-6">
            <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 rounded-full border border-white/12 bg-black/80 p-2 pl-5 shadow-[0_25px_90px_rgba(0,0,0,.45)] backdrop-blur-xl">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-cyan-200">
                  sacola de interesse
                </p>
                <p className="truncate text-sm font-black">
                  {selectedProducts.length} item(ns) selecionado(s)
                </p>
              </div>
              <StoreCTA
                selectedProducts={selectedProducts}
                className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-white px-5 text-sm font-black text-black transition hover:bg-[var(--mega-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                Continuar
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </StoreCTA>
            </div>
          </div>
        ) : null}

        <footer className="border-t border-white/10 bg-[#03040a] px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto flex max-w-[90rem] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-black uppercase">Centro Mega Store</p>
              <p className="mt-1 text-xs text-white/40">
                Amostra de loja virtual · produtos e disponibilidade sujeitos a confirmação.
              </p>
            </div>
            <PortfolioHostCredit linkClassName="text-white/60 underline underline-offset-4" />
          </div>
        </footer>

        <PortfolioUpsellPopup pageName="portfolio-centro-mega" />
      </div>
    </MotionScope>
  );
}
