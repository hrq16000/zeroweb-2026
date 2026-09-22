import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgePercent,
  Check,
  ExternalLink,
  Facebook,
  Footprints,
  Headphones,
  Instagram,
  MapPin,
  Package,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Store,
  X,
  Zap,
} from "lucide-react";
import { MotionReveal, MotionStagger } from "@/components/motion";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const links = {
  instagram: "https://www.instagram.com/centro.mega/",
  facebook: "https://www.facebook.com/CentroMega.com.br/",
  linktree: "https://linktr.ee/centro.mega",
  store: "https://www.vhsys.net/centromega/contato/",
};

const instagramPosts = [
  ["Reel", "https://www.instagram.com/centro.mega/reel/DV8haszkdOy/"],
  ["Reel", "https://www.instagram.com/centro.mega/reel/DHzjkeutEKu/"],
  ["Post", "https://www.instagram.com/centro.mega/p/DDPCypWxVZZ/"],
  ["Reel", "https://www.instagram.com/centro.mega/reel/DHmlQd6tCNi/"],
  ["Post", "https://www.instagram.com/centro.mega/p/DGjBSGIPSKO/"],
  ["Post", "https://www.instagram.com/centro.mega/p/DCt4G0HxLRu/"],
] as const;

type ProductKind = "phone" | "shoe" | "cap" | "accessory" | "outlet" | "audio";

type DemoProduct = {
  id: string;
  name: string;
  category: string;
  kicker: string;
  detail: string;
  price?: string;
  priceNote?: string;
  kind: ProductKind;
  source: "social" | "owner";
  sourceLabel: string;
  sourceHref?: string;
  accent: string;
};

const products: DemoProduct[] = [
  {
    id: "poco-x5-pro",
    name: "Poco X5 Pro · 8GB / 256GB",
    category: "Celulares",
    kicker: "Oferta publicada nas redes",
    detail: "Smartphone divulgado pela Centro Mega em postagem pública indexada em 25/01/2024.",
    price: "R$ 1.899",
    priceNote: "preço histórico do post — consulte valor e estoque atuais",
    kind: "phone",
    source: "social",
    sourceLabel: "Facebook · postagem indexada",
    sourceHref: links.facebook,
    accent: "from-cyan-400 via-blue-500 to-violet-600",
  },
  {
    id: "dunk-low-pro",
    name: "Tênis Dunk Low Pro",
    category: "Outlet",
    kicker: "Produto publicado nas redes",
    detail: "Modelo divulgado em postagem pública da Centro Mega, com numeração anunciada de 34 a 43.",
    priceNote: "valor e numeração sujeitos à disponibilidade atual",
    kind: "shoe",
    source: "social",
    sourceLabel: "Facebook · postagem indexada em 08/11/2023",
    sourceHref: links.facebook,
    accent: "from-fuchsia-500 via-rose-500 to-orange-400",
  },
  {
    id: "bones-outlet",
    name: "Bonés · seleção outlet",
    category: "Bonés",
    kicker: "Categoria da amostra",
    detail: "Vitrine demonstrativa baseada no mix informado pelo responsável da Centro Mega.",
    priceNote: "consulte os modelos disponíveis",
    kind: "cap",
    source: "owner",
    sourceLabel: "Mix informado pelo responsável",
    accent: "from-amber-300 via-orange-500 to-rose-600",
  },
  {
    id: "acessorios-mobile",
    name: "Acessórios para celular",
    category: "Acessórios",
    kicker: "Tecnologia do dia a dia",
    detail: "Espaço de amostra para capas, películas, carregadores, cabos e outros acessórios.",
    priceNote: "amostra de categoria — estoque a confirmar",
    kind: "accessory",
    source: "owner",
    sourceLabel: "Categoria compatível com a operação comercial",
    accent: "from-emerald-400 via-teal-500 to-cyan-500",
  },
  {
    id: "calcados-outlet",
    name: "Calçados & tênis",
    category: "Outlet",
    kicker: "Achadinhos de outlet",
    detail: "Categoria de amostra para produtos de giro rápido publicados nas redes e no outlet.",
    priceNote: "consulte pares e numerações atuais",
    kind: "outlet",
    source: "owner",
    sourceLabel: "Mix informado + categoria comercial pública",
    accent: "from-indigo-500 via-violet-500 to-fuchsia-500",
  },
  {
    id: "audio-tech",
    name: "Áudio & acessórios tech",
    category: "Acessórios",
    kicker: "Vitrine complementar",
    detail: "Espaço demonstrativo para fones e acessórios de tecnologia sem inventar marca ou estoque.",
    priceNote: "amostra de categoria — disponibilidade a confirmar",
    kind: "audio",
    source: "owner",
    sourceLabel: "Categoria de demonstração",
    accent: "from-sky-400 via-cyan-500 to-emerald-400",
  },
];

const categories = ["Todos", "Celulares", "Acessórios", "Outlet", "Bonés"] as const;

const quiz = {
  services: [
    "Celulares",
    "Acessórios",
    "Tênis e calçados",
    "Bonés e outlet",
    "Quero ajuda para escolher",
  ],
  experienceOptions: [
    "Quero consultar um produto",
    "Quero montar uma seleção",
    "Quero saber o que tem disponível agora",
    "Quero atendimento da assistência técnica",
  ],
  periodOptions: [
    "São José dos Pinhais",
    "Curitiba",
    "Outra cidade / preciso confirmar entrega",
    "Prefiro retirada em loja",
  ],
  timingOptions: ["Quero comprar agora", "Ainda hoje", "Nesta semana", "Só estou pesquisando"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "O que você quer encontrar?",
    experience: "Como a Centro Mega pode ajudar?",
    period: "Onde você está?",
    timing: "Quando pretende comprar?",
  },
  notePlaceholder: "Modelo, cor, numeração, capacidade ou outro detalhe importante.",
};

function ProductArt({ kind, accent }: { kind: ProductKind; accent: string }) {
  const Icon =
    kind === "phone"
      ? Smartphone
      : kind === "shoe"
        ? Footprints
        : kind === "cap"
          ? Shirt
          : kind === "audio"
            ? Headphones
            : kind === "accessory"
              ? Package
              : ShoppingBag;

  return (
    <div className={`relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${accent}`}>
      <div className="absolute -left-8 -top-8 h-36 w-36 rounded-full border border-white/25 bg-white/10 blur-[1px]" />
      <div className="absolute -bottom-14 -right-10 h-48 w-48 rounded-full border-[18px] border-white/15" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,.26)_42%,transparent_55%)] opacity-60 transition duration-700 group-hover:translate-x-[35%]" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="grid h-28 w-28 place-items-center rounded-[2rem] border border-white/30 bg-black/20 shadow-2xl backdrop-blur-xl transition duration-500 group-hover:-translate-y-2 group-hover:rotate-3 group-hover:scale-105">
          <Icon className="h-14 w-14 text-white drop-shadow-lg" strokeWidth={1.45} aria-hidden="true" />
        </div>
      </div>
      <div className="absolute left-5 top-5 rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.2em] text-white backdrop-blur">
        Centro Mega
      </div>
      <div className="absolute bottom-5 right-5 h-3 w-3 rounded-full bg-white shadow-[0_0_30px_12px_rgba(255,255,255,.45)]" />
    </div>
  );
}

function StoreCTA({
  children,
  selection,
  className,
}: {
  children: React.ReactNode;
  selection: DemoProduct[];
  className?: string;
}) {
  const service = selection.length ? selection.map((item) => item.name).join(" + ") : undefined;
  const orderItems = selection.length
    ? selection.map((item) => `${item.name} [amostra]`).join(" | ")
    : "Vitrine Centro Mega — consulta de produtos";

  return (
    <PortfolioCTAQuiz
      clientKey="centro-mega"
      studioName="Centro Mega"
      recipientName="a equipe Centro Mega"
      theme="navy"
      mode="proposal"
      quizConfig={quiz}
      service={service}
      initialAnswers={service ? { service } : undefined}
      skipPrefilledSteps={Boolean(service)}
      orderContext={{
        order_items: orderItems,
        customer_note: "Amostra de loja virtual: confirmar estoque, preço e condição antes de fechar.",
      }}
      className={className}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function CentroMegaPage() {
  const [category, setCategory] = useState<(typeof categories)[number]>("Todos");
  const [selection, setSelection] = useState<string[]>([]);

  const visibleProducts = useMemo(
    () => products.filter((product) => category === "Todos" || product.category === category),
    [category],
  );
  const selectedProducts = useMemo(
    () => products.filter((product) => selection.includes(product.id)),
    [selection],
  );

  const toggleProduct = (id: string) => {
    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <div
      data-client-slug="centro-mega"
      className="min-h-dvh overflow-hidden bg-[#050816] text-white selection:bg-cyan-300 selection:text-[#050816]"
      style={
        {
          "--mega-ink": "#050816",
          "--mega-blue": "#0c2f66",
          "--mega-cyan": "#41e7ff",
          "--mega-lime": "#b6ff4a",
          "--mega-pink": "#ff3ea5",
          "--mega-gold": "#ffd44d",
        } as React.CSSProperties
      }
    >
      <style>{`
        @keyframes mega-orbit { to { transform: rotate(360deg); } }
        @keyframes mega-pulse { 0%,100% { opacity:.35; transform:scale(.94) } 50% { opacity:.9; transform:scale(1.04) } }
        @keyframes mega-marquee { to { transform: translateX(-50%); } }
        @keyframes mega-scan { 0% { transform:translateY(-130%); opacity:0 } 15%,80%{opacity:.7} 100% { transform:translateY(680%); opacity:0 } }
        .mega-orbit { animation: mega-orbit 24s linear infinite; }
        .mega-pulse { animation: mega-pulse 5s ease-in-out infinite; }
        .mega-marquee { animation: mega-marquee 24s linear infinite; width:max-content; }
        .mega-scan { animation: mega-scan 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .mega-orbit,.mega-pulse,.mega-marquee,.mega-scan { animation:none !important; }
        }
      `}</style>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050816]/82 px-4 py-3 backdrop-blur-2xl lg:px-8">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
          <a href="#inicio" className="group flex items-center gap-3" aria-label="Centro Mega — início">
            <PortfolioImage
              src="/images/centro-mega/logo.png"
              alt="Logo Centro Mega"
              width={500}
              height={500}
              priority
              managedField="logoUrl"
              className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/15 transition group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-black uppercase tracking-[.14em]">Centro Mega</p>
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-cyan-300">Store Demo</p>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-xs font-black uppercase tracking-[.14em] text-white/65 lg:flex">
            <a href="#vitrine" className="transition hover:text-cyan-300">Vitrine</a>
            <a href="#outlet" className="transition hover:text-cyan-300">Outlet</a>
            <a href="#social" className="transition hover:text-cyan-300">Drops</a>
            <a href="#lojas" className="transition hover:text-cyan-300">Lojas</a>
          </nav>

          <StoreCTA
            selection={selectedProducts}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-black text-[#050816] shadow-[0_0_35px_rgba(65,231,255,.18)] transition hover:-translate-y-0.5 hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 sm:text-sm"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            {selection.length ? `Consultar ${selection.length} ${selection.length === 1 ? "item" : "itens"}` : "Consultar produtos"}
          </StoreCTA>
        </div>
      </header>

      <main>
        <section id="inicio" className="relative isolate min-h-[88svh] overflow-hidden px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(circle_at_68%_25%,rgba(65,231,255,.22),transparent_24%),radial-gradient(circle_at_80%_70%,rgba(255,62,165,.18),transparent_26%),radial-gradient(circle_at_18%_75%,rgba(182,255,74,.12),transparent_24%),linear-gradient(180deg,#050816_0%,#07132b_100%)]" />
          <div className="pointer-events-none absolute inset-0 -z-20 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:64px_64px]" />
          <div className="mega-pulse pointer-events-none absolute -right-28 top-20 -z-10 h-[30rem] w-[30rem] rounded-full border border-cyan-300/25 shadow-[0_0_160px_rgba(65,231,255,.22)]" />
          <div className="mega-orbit pointer-events-none absolute -right-8 top-36 -z-10 h-[20rem] w-[20rem] rounded-full border border-dashed border-fuchsia-400/35" />
          <div className="mega-scan pointer-events-none absolute right-[8%] top-[8%] -z-10 h-20 w-[44%] bg-gradient-to-b from-transparent via-cyan-300/20 to-transparent blur-xl" />

          <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-[10px] font-black uppercase tracking-[.22em] text-cyan-200">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Amostra de loja virtual
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-lime-300/25 bg-lime-300/10 px-3 py-2 text-[10px] font-black uppercase tracking-[.22em] text-lime-200">
                  Tech + Outlet
                </span>
              </div>

              <MotionReveal as="h1" variant="mask" intensity="EXPRESSIVE" className="mt-7 max-w-4xl text-[clamp(4rem,9vw,8.5rem)] font-black uppercase leading-[.78] tracking-[-.07em]">
                <span className="block">Centro</span>
                <span className="block bg-gradient-to-r from-cyan-300 via-white to-fuchsia-400 bg-clip-text text-transparent">Mega</span>
                <span className="block text-[.44em] leading-none tracking-[-.04em] text-white/78">Store Demo</span>
              </MotionReveal>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-white/70 sm:text-xl">
                Celulares, acessórios e achadinhos de outlet em uma experiência de e-commerce criada para mostrar até onde a presença digital da Centro Mega pode chegar.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#vitrine"
                  className="inline-flex min-h-13 items-center gap-2 rounded-full bg-[var(--mega-lime)] px-6 py-3.5 font-black text-[#050816] shadow-[0_0_45px_rgba(182,255,74,.22)] transition hover:-translate-y-1 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Explorar ofertas
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <StoreCTA
                  selection={selectedProducts}
                  className="inline-flex min-h-13 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 font-black text-white backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  Consultar disponibilidade
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                </StoreCTA>
              </div>

              <div className="mt-9 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["Celulares", "tech"],
                  ["Acessórios", "mobile"],
                  ["Tênis", "outlet"],
                  ["Bonés", "drop"],
                ].map(([label, small]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[.045] p-4 backdrop-blur">
                    <p className="text-lg font-black">{label}</p>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-[.18em] text-cyan-300">{small}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[34rem]">
              <div className="absolute left-[10%] top-[5%] h-[82%] w-[70%] rounded-[3rem] border border-white/15 bg-white/[.04] shadow-[0_0_90px_rgba(65,231,255,.12)] backdrop-blur-xl" />
              <div className="absolute left-[18%] top-[12%] h-[67%] w-[55%] rounded-[2.5rem] bg-gradient-to-br from-[#0d234c] via-[#101b3e] to-[#250f39] p-3 shadow-2xl [transform:rotate(-5deg)]">
                <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/15 bg-[#050816]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(65,231,255,.28),transparent_35%),radial-gradient(circle_at_50%_76%,rgba(255,62,165,.22),transparent_36%)]" />
                  <Smartphone className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 text-cyan-200 drop-shadow-[0_0_25px_rgba(65,231,255,.5)]" strokeWidth={1} aria-hidden="true" />
                  <div className="absolute inset-x-5 top-5 flex justify-between text-[10px] font-black uppercase tracking-[.2em] text-white/55">
                    <span>Centro Mega</span><span>Tech Drop</span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-xl">
                    <p className="text-xs font-black uppercase tracking-[.2em] text-lime-300">Vitrine de demonstração</p>
                    <p className="mt-2 text-2xl font-black">Produtos que nascem das postagens.</p>
                  </div>
                </div>
              </div>

              <div className="absolute right-0 top-[18%] w-52 rounded-3xl border border-fuchsia-300/25 bg-fuchsia-500/10 p-5 shadow-2xl backdrop-blur-xl [transform:rotate(5deg)]">
                <BadgePercent className="h-7 w-7 text-fuchsia-300" aria-hidden="true" />
                <p className="mt-4 text-xs font-black uppercase tracking-[.18em] text-fuchsia-200">Outlet drop</p>
                <p className="mt-2 text-xl font-black">Tênis, bonés & achadinhos</p>
              </div>

              <div className="absolute bottom-[4%] left-0 w-56 rounded-3xl border border-lime-300/25 bg-lime-300/10 p-5 shadow-2xl backdrop-blur-xl [transform:rotate(-4deg)]">
                <Zap className="h-7 w-7 text-lime-300" aria-hidden="true" />
                <p className="mt-4 text-xs font-black uppercase tracking-[.18em] text-lime-200">Social commerce</p>
                <p className="mt-2 text-xl font-black">Do post para a vitrine.</p>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Faixa de categorias" className="overflow-hidden border-y border-white/10 bg-white/[.03] py-4">
          <div className="mega-marquee flex items-center gap-8 pr-8 text-xs font-black uppercase tracking-[.22em] text-white/65">
            {Array.from({ length: 2 }).flatMap((_, round) =>
              ["Celulares", "Acessórios", "Outlet", "Tênis", "Bonés", "Novidades", "São José dos Pinhais", "Centro Mega"].map((item) => (
                <span key={`${round}-${item}`} className="flex items-center gap-8 whitespace-nowrap">
                  {item}<span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                </span>
              )),
            )}
          </div>
        </section>

        <section id="vitrine" className="relative bg-[#f5f7fb] px-4 py-20 text-[#081128] sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-[1500px]">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[.24em] text-blue-700">Vitrine social</p>
                <h2 className="mt-4 max-w-5xl text-5xl font-black tracking-[-.055em] sm:text-7xl lg:text-8xl">
                  Produtos e categorias inspirados no que a Centro Mega publica.
                </h2>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                  Esta é uma amostra de loja: produtos retirados de postagens públicas são identificados como históricos, e categorias adicionais usam apenas o mix informado pelo responsável. Estoque e preço atual são sempre confirmados antes da compra.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-[#081128] px-4 py-3 text-xs font-black uppercase tracking-[.16em] text-white">
                <ShieldCheck className="h-4 w-4 text-lime-300" aria-hidden="true" />
                amostra sem inventar estoque
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                  className={[
                    "rounded-full px-5 py-3 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                    category === item
                      ? "bg-[#081128] text-white shadow-xl"
                      : "border border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-slate-400",
                  ].join(" ")}
                >
                  {item}
                </button>
              ))}
            </div>

            <MotionStagger className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => {
                const selected = selection.includes(product.id);
                return (
                  <article
                    key={product.id}
                    className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_18px_60px_rgba(20,30,60,.08)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_28px_90px_rgba(20,30,60,.16)]"
                  >
                    <ProductArt kind={product.kind} accent={product.accent} />
                    <div className="p-5 pb-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[.2em] text-blue-700">{product.category}</span>
                        <span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[.16em] ${product.source === "social" ? "bg-cyan-100 text-cyan-900" : "bg-amber-100 text-amber-900"}`}>
                          {product.source === "social" ? "post social" : "amostra"}
                        </span>
                      </div>
                      <p className="mt-4 text-xs font-black uppercase tracking-[.16em] text-slate-400">{product.kicker}</p>
                      <h3 className="mt-2 text-2xl font-black tracking-[-.03em]">{product.name}</h3>
                      <p className="mt-3 min-h-[4.5rem] leading-6 text-slate-600">{product.detail}</p>

                      {product.price ? (
                        <div className="mt-5">
                          <p className="text-3xl font-black tracking-[-.04em]">{product.price}</p>
                          <p className="mt-1 text-xs font-semibold text-slate-500">{product.priceNote}</p>
                        </div>
                      ) : (
                        <p className="mt-5 text-sm font-bold text-slate-500">{product.priceNote}</p>
                      )}

                      <div className="mt-6 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleProduct(product.id)}
                          className={[
                            "inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-4 font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                            selected
                              ? "bg-lime-300 text-[#081128]"
                              : "bg-[#081128] text-white hover:bg-blue-800",
                          ].join(" ")}
                        >
                          {selected ? <Check className="h-4 w-4" aria-hidden="true" /> : <ShoppingBag className="h-4 w-4" aria-hidden="true" />}
                          {selected ? "Na seleção" : "Adicionar"}
                        </button>
                        {product.sourceHref ? (
                          <a
                            href={product.sourceHref}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Abrir fonte social de ${product.name}`}
                            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-slate-200 text-slate-600 transition hover:border-blue-500 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                          >
                            <ExternalLink className="h-4 w-4" aria-hidden="true" />
                          </a>
                        ) : null}
                      </div>
                      <p className="mt-3 text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">{product.sourceLabel}</p>
                    </div>
                  </article>
                );
              })}
            </MotionStagger>
          </div>
        </section>

        <section id="outlet" className="relative overflow-hidden bg-[#090719] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="pointer-events-none absolute -left-28 top-0 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-32 bottom-0 h-[32rem] w-[32rem] rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[.24em] text-fuchsia-300">Centro Mega Outlet</p>
              <h2 className="mt-4 text-6xl font-black uppercase leading-[.86] tracking-[-.06em] sm:text-8xl">
                Achou.<br /><span className="text-fuchsia-400">Gostou.</span><br />Consultou.
              </h2>
              <p className="mt-7 max-w-xl text-lg leading-8 text-white/65">
                A proposta da amostra é transformar o giro das redes em uma vitrine organizada: celular de um lado, tênis e bonés do outro, sem perder o ritmo de novidade do outlet.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {["Tênis", "Bonés", "Calçados", "Achadinhos", "Tech"].map((tag) => (
                  <span key={tag} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-white/70">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative grid min-h-[34rem] grid-cols-2 gap-4">
              <div className="group relative overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-fuchsia-500 to-orange-400 p-7 shadow-2xl transition duration-500 hover:-translate-y-2">
                <Footprints className="h-16 w-16 text-white" strokeWidth={1.3} aria-hidden="true" />
                <p className="mt-20 text-xs font-black uppercase tracking-[.18em] text-white/70">Social drop</p>
                <p className="mt-2 text-3xl font-black">Dunk Low Pro</p>
                <p className="mt-3 text-sm leading-6 text-white/80">Produto já divulgado pela Centro Mega nas redes.</p>
              </div>
              <div className="group mt-14 relative overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-cyan-400 to-blue-700 p-7 shadow-2xl transition duration-500 hover:-translate-y-2">
                <Smartphone className="h-16 w-16 text-white" strokeWidth={1.3} aria-hidden="true" />
                <p className="mt-20 text-xs font-black uppercase tracking-[.18em] text-white/70">Tech drop</p>
                <p className="mt-2 text-3xl font-black">Poco X5 Pro</p>
                <p className="mt-3 text-sm leading-6 text-white/80">Exemplo real de produto publicado pela marca.</p>
              </div>
              <div className="group -mt-6 relative overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-amber-300 to-rose-600 p-7 shadow-2xl transition duration-500 hover:-translate-y-2">
                <Shirt className="h-16 w-16 text-white" strokeWidth={1.3} aria-hidden="true" />
                <p className="mt-16 text-xs font-black uppercase tracking-[.18em] text-white/70">Outlet mix</p>
                <p className="mt-2 text-3xl font-black">Bonés & estilo</p>
              </div>
              <div className="group mt-8 relative overflow-hidden rounded-[2.2rem] border border-white/15 bg-white/5 p-7 shadow-2xl backdrop-blur transition duration-500 hover:-translate-y-2">
                <ShoppingBag className="h-16 w-16 text-lime-300" strokeWidth={1.3} aria-hidden="true" />
                <p className="mt-16 text-xs font-black uppercase tracking-[.18em] text-white/45">Próximo drop</p>
                <p className="mt-2 text-3xl font-black">O que vier das redes.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="social" className="bg-white px-4 py-20 text-[#081128] sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-[1500px]">
            <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[.24em] text-fuchsia-600">Drops das redes</p>
                <h2 className="mt-4 text-5xl font-black tracking-[-.055em] sm:text-7xl">A vitrine pode acompanhar o que a Centro Mega publica.</h2>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 lg:justify-self-end">
                Os links abaixo apontam para publicações oficiais já versionadas no projeto. Como o conteúdo do Instagram não é ingerido de forma confiável pelo ambiente, a amostra não inventa título nem preço para esses posts: ela os trata como drops oficiais a consultar.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {instagramPosts.map(([kind, href], index) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative min-h-60 overflow-hidden rounded-[2rem] bg-[#081128] p-6 text-white shadow-xl transition duration-500 hover:-translate-y-2 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
                >
                  <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-fuchsia-500/50 to-cyan-400/20 blur-2xl transition group-hover:scale-125" />
                  <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[.2em] text-fuchsia-300">
                        <Instagram className="h-4 w-4" aria-hidden="true" />
                        {kind}
                      </span>
                      <span className="text-5xl font-black text-white/10">0{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-2xl font-black">Abrir drop oficial</p>
                      <p className="mt-2 text-sm leading-6 text-white/55">Ver a publicação diretamente no Instagram da Centro Mega.</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.15em] text-cyan-300">
                        Instagram <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="lojas" className="relative overflow-hidden bg-[#0b1d3f] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_center,rgba(65,231,255,.35)_1px,transparent_1px)] [background-size:26px_26px]" />
          <div className="relative mx-auto max-w-[1500px]">
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[.24em] text-cyan-300">Presença física + digital</p>
                <h2 className="mt-4 text-5xl font-black tracking-[-.05em] sm:text-7xl">Uma loja virtual que conversa com as unidades.</h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
                  O Linktree oficial concentra SAC, Centro Mega Outlet — São José dos Pinhais, Galeria Di Brunno, Shopping Cidade, Pinheirinho e Instagram.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={links.linktree}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center gap-2 rounded-full bg-cyan-300 px-6 py-3.5 font-black text-[#081128] transition hover:-translate-y-1"
                  >
                    Ver Linktree oficial <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href={links.store}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 font-black text-white transition hover:border-white/45"
                  >
                    Canal da loja <Store className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Outlet São José dos Pinhais", "frente listada no Linktree oficial"],
                  ["Galeria Di Brunno", "frente listada no Linktree oficial"],
                  ["Shopping Cidade", "frente listada no Linktree oficial"],
                  ["Pinheirinho", "frente listada no Linktree oficial"],
                ].map(([name, detail], index) => (
                  <div key={name} className="rounded-[1.75rem] border border-white/10 bg-white/[.055] p-6 backdrop-blur">
                    <div className="flex items-center justify-between">
                      <MapPin className="h-6 w-6 text-cyan-300" aria-hidden="true" />
                      <span className="text-3xl font-black text-white/10">0{index + 1}</span>
                    </div>
                    <p className="mt-8 text-xl font-black">{name}</p>
                    <p className="mt-2 text-sm leading-6 text-white/50">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[var(--mega-lime)] px-4 py-16 text-[#071022] sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[.22em] text-blue-800">Sacola demonstrativa</p>
              <h2 className="mt-3 max-w-5xl text-5xl font-black tracking-[-.055em] sm:text-7xl">
                Escolha na vitrine. A equipe confirma o que está disponível agora.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#20304d]">
                Esta amostra não fecha uma compra automática nem promete estoque. Ela transforma a seleção em um pedido organizado para o funil individual da Centro Mega.
              </p>
            </div>
            <StoreCTA
              selection={selectedProducts}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#071022] px-8 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900"
            >
              {selection.length ? `Consultar minha seleção (${selection.length})` : "Começar uma consulta"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </StoreCTA>
          </div>
        </section>
      </main>

      {selection.length > 0 ? (
        <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-[1.5rem] border border-white/15 bg-[#050816]/92 p-3 shadow-[0_20px_80px_rgba(0,0,0,.45)] backdrop-blur-2xl sm:bottom-5">
          <div className="flex items-center gap-3">
            <div className="hidden h-11 w-11 shrink-0 place-items-center rounded-xl bg-lime-300 text-[#050816] sm:grid">
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black">{selection.length} {selection.length === 1 ? "item selecionado" : "itens selecionados"}</p>
              <p className="truncate text-xs text-white/45">{selectedProducts.map((item) => item.name).join(" · ")}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelection([])}
              aria-label="Limpar seleção"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white/55 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
            <StoreCTA
              selection={selectedProducts}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-cyan-300 px-4 font-black text-[#050816] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Consultar
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </StoreCTA>
          </div>
        </div>
      ) : null}

      <footer className="border-t border-white/10 bg-[#050816] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <PortfolioImage
              src="/images/centro-mega/logo.png"
              alt="Logo Centro Mega"
              width={500}
              height={500}
              managedField="logoUrl"
              className="h-12 w-12 rounded-xl object-cover"
            />
            <div>
              <p className="text-lg font-black">Centro Mega · Store Demo</p>
              <p className="text-sm text-white/45">Amostra de loja virtual criada dentro do portfolio 0WEB.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href={links.instagram} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/65 transition hover:border-fuchsia-400 hover:text-fuchsia-300" aria-label="Instagram Centro Mega">
              <Instagram className="h-5 w-5" aria-hidden="true" />
            </a>
            <a href={links.facebook} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/65 transition hover:border-cyan-400 hover:text-cyan-300" aria-label="Facebook Centro Mega">
              <Facebook className="h-5 w-5" aria-hidden="true" />
            </a>
            <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4" />
          </div>
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="centro-mega"
        eyebrow="Centro Mega · Loja Virtual"
        title="Escolha seus produtos e leve a seleção para o atendimento."
        description="Amostra de e-commerce com consulta de estoque e preço atual pelo funil da Centro Mega."
        ctaLabel="Ver vitrine"
        ctaHref="#vitrine"
        delayMs={12000}
        className="border-cyan-300/30 bg-[#050816]/95 text-white"
        accentClassName="text-cyan-300"
      />
      <PortfolioUpsellPopup pageName="portfolio-centro-mega-store-demo" />
    </div>
  );
}
