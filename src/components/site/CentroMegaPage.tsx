import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  CreditCard,
  Facebook,
  Footprints,
  Headphones,
  Instagram,
  MapPin,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Tag,
  Zap,
} from "lucide-react";
import {
  MotionCard,
  MotionParallax,
  MotionReveal,
  MotionScope,
  MotionStagger,
  MotionSwap,
  MotionTextReveal,
} from "@/components/motion";
import { PortfolioCTAQuiz, type PortfolioQuizConfig } from "@/components/site/BeautyBookingQuiz";
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

const socialPosts = [
  ["Reel", "https://www.instagram.com/centro.mega/reel/DV8haszkdOy/"],
  ["Reel", "https://www.instagram.com/centro.mega/reel/DHzjkeutEKu/"],
  ["Post", "https://www.instagram.com/centro.mega/p/DDPCypWxVZZ/"],
  ["Reel", "https://www.instagram.com/centro.mega/reel/DHmlQd6tCNi/"],
  ["Post", "https://www.instagram.com/centro.mega/p/DGjBSGIPSKO/"],
  ["Post", "https://www.instagram.com/centro.mega/p/DCt4G0HxLRu/"],
] as const;

type Product = {
  id: string;
  name: string;
  category: "tech" | "outlet" | "acessorios";
  eyebrow: string;
  description: string;
  evidence: "SOCIAL_POST" | "OWNER_CONTEXT" | "OFFICIAL_CHANNEL";
  historicalPrice?: string;
  historicalFrom?: string;
  publishedAt?: string;
  sourceLabel: string;
  sourceHref: string;
  accent: string;
  Icon: typeof Smartphone;
};

const products: Product[] = [
  {
    id: "poco-x5-pro",
    name: "Poco X5 Pro · 8GB / 256GB",
    category: "tech",
    eyebrow: "Produto visto nas redes",
    description:
      "Smartphone citado em publicação pública indexada da Centro Mega. A postagem histórica informava 8GB de RAM e 256GB de armazenamento.",
    evidence: "SOCIAL_POST",
    historicalPrice: "R$ 1.899",
    historicalFrom: "R$ 2.399",
    publishedAt: "25/01/2024",
    sourceLabel: "Publicação histórica indexada",
    sourceHref: links.facebook,
    accent: "from-cyan-400 via-sky-500 to-blue-700",
    Icon: Smartphone,
  },
  {
    id: "dunk-low-pro",
    name: "Tênis Dunk Low Pro",
    category: "outlet",
    eyebrow: "Produto visto nas redes",
    description:
      "Modelo divulgado em postagens públicas da marca. As publicações históricas mostravam grades 34–39 e 34–43; disponibilidade atual precisa ser consultada.",
    evidence: "SOCIAL_POST",
    publishedAt: "08/11/2023",
    sourceLabel: "Publicação histórica indexada",
    sourceHref: links.facebook,
    accent: "from-fuchsia-500 via-violet-500 to-indigo-700",
    Icon: Footprints,
  },
  {
    id: "bones-outlet",
    name: "Bonés · Outlet",
    category: "outlet",
    eyebrow: "Categoria da amostra",
    description:
      "Categoria adicionada à amostra a partir do mix comercial informado pelo responsável. Modelos, marcas, cores e preços dependem do estoque atual.",
    evidence: "OWNER_CONTEXT",
    sourceLabel: "Mix informado para a amostra",
    sourceHref: "#social",
    accent: "from-amber-300 via-orange-500 to-rose-600",
    Icon: Tag,
  },
  {
    id: "calcados-outlet",
    name: "Calçados · Achadinhos",
    category: "outlet",
    eyebrow: "Categoria da amostra",
    description:
      "Vitrine para calçados e oportunidades de outlet. A proposta visual permite alimentar novos itens a partir das próximas postagens sociais.",
    evidence: "OWNER_CONTEXT",
    sourceLabel: "Mix informado para a amostra",
    sourceHref: "#social",
    accent: "from-lime-300 via-emerald-500 to-teal-700",
    Icon: Footprints,
  },
  {
    id: "acessorios-celular",
    name: "Acessórios para celular",
    category: "acessorios",
    eyebrow: "Categoria oficial",
    description:
      "Área de vitrine para acessórios e soluções de tecnologia já associados à presença digital da Centro Mega.",
    evidence: "OFFICIAL_CHANNEL",
    sourceLabel: "Canais oficiais da Centro Mega",
    sourceHref: links.linktree,
    accent: "from-sky-300 via-cyan-400 to-teal-600",
    Icon: Headphones,
  },
  {
    id: "novidades-social",
    name: "Novidades das redes",
    category: "tech",
    eyebrow: "Coleção viva",
    description:
      "Espaço demonstrativo para transformar posts e reels em produtos consultáveis sem prometer estoque ou preço desatualizado.",
    evidence: "OFFICIAL_CHANNEL",
    sourceLabel: "Instagram oficial",
    sourceHref: links.instagram,
    accent: "from-pink-500 via-fuchsia-500 to-violet-700",
    Icon: Sparkles,
  },
];

const quiz: PortfolioQuizConfig = {
  services: [
    "Celular / smartphone",
    "Acessório para celular",
    "Tênis / calçado",
    "Boné / outlet",
    "Quero consultar outro item",
  ],
  experienceOptions: [
    "Vi um item nesta vitrine",
    "Vi uma oferta nas redes sociais",
    "Quero comparar opções",
    "Quero saber o que está disponível hoje",
  ],
  periodOptions: [
    "São José dos Pinhais",
    "Curitiba",
    "Outra cidade / região",
    "Quero confirmar retirada ou envio",
  ],
  timingOptions: [
    "Quero comprar agora",
    "Ainda hoje",
    "Nesta semana",
    "Só estou pesquisando",
  ],
  stepTitles: {
    service: "O que você quer consultar?",
    experience: "Como chegou até esse produto?",
    period: "Onde você está?",
    timing: "Quando pretende comprar?",
    note: "Quer deixar algum detalhe?",
  },
  notePlaceholder: "Modelo, cor, numeração, memória, marca ou qualquer detalhe que ajude a loja a localizar o item.",
  proposalKind: "service",
};

function ShopCTA({
  children,
  selected,
  className,
}: {
  children: ReactNode;
  selected?: Product[];
  className?: string;
}) {
  const labels = selected?.map((item) => item.name) ?? [];
  const selectedText = labels.join(" + ");
  return (
    <PortfolioCTAQuiz
      clientKey="centro-mega"
      studioName="Centro Mega"
      recipientName="a equipe Centro Mega"
      theme="navy"
      mode="proposal"
      funnelIntent="pedido"
      quizConfig={quiz}
      initialAnswers={selectedText ? { service: selectedText } : undefined}
      skipPrefilledSteps={Boolean(selectedText)}
      orderContext={
        selectedText
          ? {
              order_items: selectedText,
              customer_note:
                "Consulta originada na amostra de loja virtual Centro Mega. Confirmar estoque, preço e condições atuais antes de fechar.",
            }
          : undefined
      }
      className={className}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

function ProductVisual({ product }: { product: Product }) {
  const Icon = product.Icon;
  return (
    <div className={`relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${product.accent} p-6`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(255,255,255,.48),transparent_28%),linear-gradient(120deg,transparent_42%,rgba(255,255,255,.22)_50%,transparent_58%)] opacity-80" />
      <div className="mega-shine absolute -inset-y-20 -left-1/3 w-1/3 rotate-12 bg-white/25 blur-xl" />
      <div className="absolute right-5 top-5 rounded-full border border-white/30 bg-black/15 px-3 py-1 text-[10px] font-black uppercase tracking-[.18em] text-white backdrop-blur">
        {product.evidence === "SOCIAL_POST" ? "post real" : product.evidence === "OWNER_CONTEXT" ? "amostra" : "coleção"}
      </div>
      <div className="relative flex h-full items-center justify-center">
        <div className="mega-float relative grid h-36 w-36 place-items-center rounded-[2rem] border border-white/30 bg-black/20 shadow-2xl backdrop-blur-xl sm:h-44 sm:w-44">
          <div className="absolute inset-3 rounded-[1.4rem] border border-white/20" />
          <Icon className="h-16 w-16 text-white drop-shadow-[0_14px_24px_rgba(0,0,0,.35)] sm:h-20 sm:w-20" aria-hidden="true" />
        </div>
      </div>
      <span className="absolute bottom-5 left-5 text-[10px] font-black uppercase tracking-[.2em] text-white/80">
        visual ilustrativo da amostra
      </span>
    </div>
  );
}

export function CentroMegaPage() {
  const [filter, setFilter] = useState<"all" | Product["category"]>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const visibleProducts = useMemo(
    () => (filter === "all" ? products : products.filter((product) => product.category === filter)),
    [filter],
  );
  const selectedProducts = useMemo(
    () => products.filter((product) => selectedIds.includes(product.id)),
    [selectedIds],
  );

  const toggleProduct = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const filters = [
    ["all", "Tudo"],
    ["tech", "Celulares"],
    ["acessorios", "Acessórios"],
    ["outlet", "Outlet"],
  ] as const;

  return (
    <MotionScope intensity="EXPRESSIVE">
      <style>{`
        @keyframes megaTicker { from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%,0,0); } }
        @keyframes megaFloat { 0%,100% { transform: translate3d(0,-4px,0) rotate(-2deg); } 50% { transform: translate3d(0,7px,0) rotate(2deg); } }
        @keyframes megaShine { 0% { transform: translate3d(-180%,0,0) rotate(12deg); } 65%,100% { transform: translate3d(520%,0,0) rotate(12deg); } }
        .mega-ticker { animation: megaTicker 22s linear infinite; }
        .mega-float { animation: megaFloat 5.2s ease-in-out infinite; }
        .mega-shine { animation: megaShine 4.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .mega-ticker,.mega-float,.mega-shine { animation: none !important; }
        }
      `}</style>

      <div
        data-client-slug="centro-mega"
        className="min-h-dvh overflow-hidden bg-[#050611] text-white selection:bg-fuchsia-400 selection:text-black"
        style={
          {
            "--mega-ink": "#050611",
            "--mega-panel": "#0b1020",
            "--mega-cyan": "#2ee6ff",
            "--mega-lime": "#c8ff45",
            "--mega-pink": "#ff3cac",
            "--mega-violet": "#7a5cff",
          } as React.CSSProperties
        }
      >
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050611]/80 px-4 py-3 backdrop-blur-xl lg:px-8">
          <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4">
            <a href="#inicio" aria-label="Centro Mega Store — início" className="flex items-center gap-3">
              <PortfolioImage
                src="/images/centro-mega/logo.png"
                alt="Centro Mega"
                width={500}
                height={500}
                priority
                managedField="logoUrl"
                className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/15"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-black uppercase tracking-[.14em]">Centro Mega</p>
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-cyan-300">Store Sample</p>
              </div>
            </a>

            <nav aria-label="Navegação da amostra" className="hidden items-center gap-7 text-xs font-black uppercase tracking-[.16em] text-white/65 lg:flex">
              <a href="#vitrine" className="transition hover:text-cyan-300">Vitrine</a>
              <a href="#outlet" className="transition hover:text-fuchsia-300">Outlet</a>
              <a href="#social" className="transition hover:text-lime-300">Redes</a>
              <a href="#lojas" className="transition hover:text-white">Lojas</a>
            </nav>

            <ShopCTA
              selected={selectedProducts}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-black text-[#070816] shadow-[0_0_32px_rgba(46,230,255,.15)] transition hover:-translate-y-0.5 hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              {selectedProducts.length ? `Consultar ${selectedProducts.length}` : "Consultar produtos"}
            </ShopCTA>
          </div>
        </header>

        <main>
          <section id="inicio" className="relative isolate min-h-[92svh] overflow-hidden px-5 py-14 lg:px-8 lg:py-20">
            <div className="absolute inset-0 -z-40 bg-[radial-gradient(circle_at_78%_18%,rgba(122,92,255,.34),transparent_28%),radial-gradient(circle_at_15%_78%,rgba(255,60,172,.22),transparent_28%),linear-gradient(135deg,#03040b_10%,#091027_48%,#050611_100%)]" />
            <div className="absolute inset-0 -z-30 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:54px_54px]" />
            <div className="absolute -right-24 top-20 -z-20 h-[30rem] w-[30rem] rounded-full bg-cyan-400/20 blur-[100px]" />
            <div className="absolute left-[8%] top-[18%] -z-20 h-[24rem] w-[24rem] rounded-full bg-fuchsia-500/15 blur-[110px]" />

            <div className="mx-auto max-w-[90rem]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5 text-[10px] font-black uppercase tracking-[.2em] text-white/55">
                <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-cyan-300" /> amostra de loja virtual</span>
                <span>produtos das redes + outlet + tecnologia</span>
              </div>

              <div className="grid min-h-[74svh] items-center gap-10 py-10 lg:grid-cols-[1.02fr_.98fr]">
                <div className="relative z-10">
                  <MotionReveal variant="mask" intensity="EXPRESSIVE">
                    <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-cyan-200 backdrop-blur">
                      <Zap className="h-4 w-4" aria-hidden="true" />
                      Centro Mega · Tech + Outlet
                    </p>
                  </MotionReveal>

                  <h1 className="max-w-5xl font-black uppercase leading-[.82] tracking-[-.065em] text-[clamp(4rem,10vw,9rem)]">
                    <MotionTextReveal text="Achou." as="span" intensity="EXPRESSIVE" className="block" />
                    <span className="block bg-gradient-to-r from-cyan-300 via-white to-lime-300 bg-clip-text text-transparent">
                      Curtiu.
                    </span>
                    <span className="block text-fuchsia-400">Consultou.</span>
                  </h1>

                  <MotionReveal variant="up" delay={100}>
                    <p className="mt-7 max-w-2xl text-lg leading-8 text-white/68 sm:text-xl">
                      Uma loja virtual demonstrativa para transformar os posts da Centro Mega em uma vitrine navegável de celulares, acessórios, tênis, bonés, calçados e oportunidades de outlet.
                    </p>
                  </MotionReveal>

                  <MotionReveal variant="up" delay={180}>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <a
                        href="#vitrine"
                        className="inline-flex min-h-13 items-center gap-3 rounded-full bg-gradient-to-r from-cyan-300 to-lime-300 px-7 py-3.5 font-black text-[#050611] shadow-[0_0_48px_rgba(46,230,255,.25)] transition hover:-translate-y-1 hover:shadow-[0_0_68px_rgba(200,255,69,.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        Explorar vitrine <ArrowRight className="h-4 w-4" />
                      </a>
                      <ShopCTA
                        selected={selectedProducts}
                        className="inline-flex min-h-13 items-center gap-3 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 font-black text-white backdrop-blur transition hover:-translate-y-1 hover:border-fuchsia-300 hover:bg-fuchsia-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300"
                      >
                        Montar consulta <ShoppingCart className="h-4 w-4" />
                      </ShopCTA>
                    </div>
                  </MotionReveal>

                  <div className="mt-8 flex flex-wrap gap-5 text-xs font-bold uppercase tracking-[.12em] text-white/45">
                    <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-cyan-300" /> estoque a confirmar</span>
                    <span className="inline-flex items-center gap-2"><CreditCard className="h-4 w-4 text-lime-300" /> condições atuais na consulta</span>
                  </div>
                </div>

                <MotionParallax speed={30} className="relative">
                  <div className="relative mx-auto max-w-2xl">
                    <div className="absolute -inset-5 rounded-[3rem] bg-gradient-to-br from-cyan-300/25 via-violet-500/20 to-fuchsia-500/25 blur-2xl" />
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/[.06] p-4 shadow-[0_30px_100px_rgba(0,0,0,.45)] backdrop-blur-xl">
                      <PortfolioImage
                        src="/images/centro-mega/hero.png"
                        alt="Composição visual da Centro Mega"
                        width={1600}
                        height={900}
                        priority
                        managedField="heroImageUrl"
                        className="aspect-video w-full rounded-[1.8rem] object-cover"
                      />
                      <div className="absolute inset-x-8 bottom-8 rounded-2xl border border-white/15 bg-[#050611]/70 p-4 backdrop-blur-xl">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[.2em] text-cyan-300">Vitrine social</p>
                            <p className="mt-1 text-lg font-black">Posts viram produtos consultáveis.</p>
                          </div>
                          <div className="grid h-12 w-12 place-items-center rounded-full bg-fuchsia-500 text-white shadow-[0_0_30px_rgba(255,60,172,.35)]">
                            <ShoppingBag className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mega-float absolute -left-5 -top-6 rounded-2xl border border-cyan-200/25 bg-cyan-300/10 px-4 py-3 text-xs font-black uppercase tracking-[.14em] text-cyan-100 backdrop-blur-xl">
                      celulares
                    </div>
                    <div className="mega-float absolute -bottom-5 right-4 rounded-2xl border border-fuchsia-200/25 bg-fuchsia-400/10 px-4 py-3 text-xs font-black uppercase tracking-[.14em] text-fuchsia-100 backdrop-blur-xl [animation-delay:900ms]">
                      outlet
                    </div>
                  </div>
                </MotionParallax>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 overflow-hidden border-y border-white/10 bg-white/[.035] py-3 backdrop-blur">
              <div className="mega-ticker flex w-max whitespace-nowrap text-xs font-black uppercase tracking-[.18em] text-white/60">
                {[0, 1].map((group) => (
                  <div key={group} className="flex items-center gap-8 pr-8">
                    <span className="text-cyan-300">celulares</span><span>•</span>
                    <span className="text-lime-300">acessórios</span><span>•</span>
                    <span className="text-fuchsia-300">tênis</span><span>•</span>
                    <span>bonés</span><span>•</span>
                    <span className="text-violet-300">calçados</span><span>•</span>
                    <span>outlet</span><span>•</span>
                    <span className="text-cyan-300">novidades das redes</span><span>•</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="vitrine" className="relative bg-[#f4f5f7] px-5 py-20 text-[#080b14] lg:px-8 lg:py-28">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            <div className="mx-auto max-w-[90rem]">
              <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.22em] text-fuchsia-600">Vitrine construída a partir das redes</p>
                  <h2 className="mt-4 max-w-3xl text-5xl font-black uppercase leading-[.9] tracking-[-.045em] sm:text-7xl">
                    Produto de post não precisa morrer no feed.
                  </h2>
                </div>
                <div className="lg:justify-self-end">
                  <p className="max-w-2xl text-lg leading-8 text-slate-600">
                    Itens identificados em publicações entram como produtos históricos; categorias informadas pelo responsável entram como amostra. Preço, estoque, cor e grade nunca são tratados como atuais sem confirmação.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar produtos da vitrine">
                    {filters.map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setFilter(key)}
                        aria-pressed={filter === key}
                        className={[
                          "min-h-11 rounded-full px-5 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500",
                          filter === key ? "bg-[#080b14] text-white" : "border border-slate-300 bg-white text-slate-700 hover:border-slate-500",
                        ].join(" ")}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <MotionSwap swapKey={filter} variant="fade" className="mt-12">
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {visibleProducts.map((product, index) => {
                    const selected = selectedIds.includes(product.id);
                    return (
                      <MotionCard key={product.id} index={index}>
                        <article className="group flex h-full flex-col rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_16px_55px_rgba(12,17,29,.07)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(12,17,29,.14)]">
                          <ProductVisual product={product} />
                          <div className="flex flex-1 flex-col px-2 pb-2 pt-6">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-[.2em] text-fuchsia-600">{product.eyebrow}</p>
                                <h3 className="mt-2 text-2xl font-black leading-tight">{product.name}</h3>
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleProduct(product.id)}
                                aria-pressed={selected}
                                aria-label={selected ? `Remover ${product.name} da consulta` : `Adicionar ${product.name} à consulta`}
                                className={[
                                  "grid h-11 w-11 shrink-0 place-items-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500",
                                  selected ? "border-[#080b14] bg-[#080b14] text-white" : "border-slate-300 bg-white text-[#080b14] hover:border-fuchsia-400 hover:bg-fuchsia-50",
                                ].join(" ")}
                              >
                                {selected ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                              </button>
                            </div>

                            <p className="mt-4 flex-1 leading-7 text-slate-600">{product.description}</p>

                            {product.historicalPrice ? (
                              <div className="mt-5 rounded-2xl bg-slate-100 p-4">
                                <p className="text-[10px] font-black uppercase tracking-[.18em] text-slate-500">
                                  preço da postagem histórica · {product.publishedAt}
                                </p>
                                <div className="mt-2 flex items-end gap-3">
                                  {product.historicalFrom ? <span className="text-sm font-bold text-slate-400 line-through">{product.historicalFrom}</span> : null}
                                  <span className="text-3xl font-black">{product.historicalPrice}</span>
                                </div>
                                <p className="mt-2 text-xs font-semibold text-amber-700">Não representa preço atual. Consulte antes de comprar.</p>
                              </div>
                            ) : product.publishedAt ? (
                              <div className="mt-5 rounded-2xl bg-slate-100 p-4 text-xs font-bold text-slate-600">
                                Publicação histórica identificada em {product.publishedAt}. Estoque e condições atuais a confirmar.
                              </div>
                            ) : null}

                            <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
                              <a
                                href={product.sourceHref}
                                target={product.sourceHref.startsWith("http") ? "_blank" : undefined}
                                rel={product.sourceHref.startsWith("http") ? "noreferrer" : undefined}
                                className="text-xs font-black uppercase tracking-[.12em] text-slate-500 transition hover:text-fuchsia-600"
                              >
                                {product.sourceLabel}
                              </a>
                              <button
                                type="button"
                                onClick={() => toggleProduct(product.id)}
                                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#080b14] px-4 text-xs font-black text-white transition hover:bg-fuchsia-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
                              >
                                {selected ? "Na consulta" : "Quero consultar"} <ChevronRight className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </article>
                      </MotionCard>
                    );
                  })}
                </div>
              </MotionSwap>

              <div className="mt-8 flex flex-col gap-5 rounded-[2rem] bg-[#080b14] p-6 text-white shadow-2xl sm:flex-row sm:items-center sm:justify-between lg:p-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.2em] text-cyan-300">Sua consulta</p>
                  <p className="mt-2 text-xl font-black">
                    {selectedProducts.length
                      ? `${selectedProducts.length} ${selectedProducts.length === 1 ? "item selecionado" : "itens selecionados"}`
                      : "Selecione produtos para montar uma consulta."}
                  </p>
                  {selectedProducts.length ? (
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">
                      {selectedProducts.map((item) => item.name).join(" · ")}
                    </p>
                  ) : null}
                </div>
                <ShopCTA
                  selected={selectedProducts}
                  className="inline-flex min-h-13 shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-lime-300 px-7 py-3.5 font-black text-[#050611] transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Consultar seleção <ShoppingCart className="h-4 w-4" />
                </ShopCTA>
              </div>
            </div>
          </section>

          <section id="outlet" className="relative overflow-hidden bg-[#070816] px-5 py-20 lg:px-8 lg:py-28">
            <div className="absolute -left-20 top-1/3 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-[120px]" />
            <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-violet-500/20 blur-[120px]" />
            <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[.22em] text-fuchsia-300">Centro Mega Outlet</p>
                <h2 className="mt-4 text-5xl font-black uppercase leading-[.86] tracking-[-.05em] sm:text-7xl">
                  Tecnologia de um lado. <span className="text-fuchsia-400">Achadinhos do outro.</span>
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
                  O Linktree oficial identifica uma frente Centro Mega Outlet em São José dos Pinhais. Nesta amostra, o outlet ganha linguagem própria para tênis, bonés, calçados e outras oportunidades de giro rápido.
                </p>
                <a
                  href={links.linktree}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full border border-fuchsia-300/30 bg-fuchsia-400/10 px-6 font-black text-fuchsia-100 transition hover:-translate-y-1 hover:bg-fuchsia-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300"
                >
                  Ver canais oficiais <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <MotionStagger className="grid gap-4 sm:grid-cols-2" variant="scale">
                {[
                  ["Tênis", "Drops, numerações e novidades entram na vitrine a partir dos posts.", Footprints, "bg-fuchsia-500"],
                  ["Bonés", "Uma categoria pronta para receber modelos do estoque social.", Tag, "bg-amber-400"],
                  ["Calçados", "Espaço para oportunidades e giro rápido de outlet.", ShoppingBag, "bg-violet-500"],
                  ["Tech", "Celulares e acessórios convivem com o outlet sem perder clareza.", Smartphone, "bg-cyan-400"],
                ].map(([title, body, Icon, bg]) => {
                  const IconComponent = Icon as typeof Smartphone;
                  return (
                    <article key={String(title)} className="group min-h-60 rounded-[2rem] border border-white/10 bg-white/[.05] p-7 backdrop-blur transition hover:-translate-y-2 hover:border-white/25 hover:bg-white/[.08]">
                      <div className={`grid h-12 w-12 place-items-center rounded-2xl ${String(bg)} text-[#070816] shadow-[0_0_30px_rgba(255,255,255,.08)]`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <h3 className="mt-10 text-3xl font-black uppercase">{String(title)}</h3>
                      <p className="mt-3 leading-7 text-white/60">{String(body)}</p>
                    </article>
                  );
                })}
              </MotionStagger>
            </div>
          </section>

          <section id="social" className="bg-gradient-to-b from-[#10162a] to-[#070816] px-5 py-20 lg:px-8 lg:py-28">
            <div className="mx-auto max-w-[90rem]">
              <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.22em] text-lime-300">Radar social</p>
                  <h2 className="mt-4 text-5xl font-black uppercase leading-[.88] tracking-[-.05em] sm:text-7xl">
                    O feed vira <span className="text-cyan-300">estoque editorial.</span>
                  </h2>
                </div>
                <p className="max-w-2xl text-lg leading-8 text-white/60 lg:justify-self-end">
                  A amostra preserva os links sociais já identificados no projeto. Quando uma postagem trouxer produto, preço, grade ou condição, o dado entra com data e status histórico — nunca como estoque atual automático.
                </p>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {socialPosts.map(([kind, href], index) => (
                  <MotionCard key={href} index={index}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative block min-h-56 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.05] p-6 transition hover:-translate-y-2 hover:border-cyan-300/40 hover:bg-white/[.08]"
                    >
                      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-gradient-to-br from-fuchsia-500/30 to-cyan-400/20 blur-3xl transition group-hover:scale-125" />
                      <div className="relative">
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[.18em] text-cyan-200">
                            {kind} · social #{index + 1}
                          </span>
                          <Instagram className="h-5 w-5 text-fuchsia-300" />
                        </div>
                        <p className="mt-16 text-2xl font-black">Abrir publicação</p>
                        <p className="mt-2 text-sm leading-6 text-white/50">Fonte social já vinculada ao projeto Centro Mega.</p>
                        <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] text-lime-300">
                          Ver no Instagram <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </span>
                      </div>
                    </a>
                  </MotionCard>
                ))}
              </div>

              <div className="mt-8 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 text-sm leading-7 text-amber-50">
                <strong className="font-black">Transparência da amostra:</strong> a captura direta do conteúdo de Facebook/Instagram pode ser limitada pela própria plataforma. Por isso, produtos só entram como “postado” quando existe texto público/indexado suficiente; demais itens aparecem como categoria ou coleção de demonstração até nova evidência.
              </div>
            </div>
          </section>

          <section id="lojas" className="relative bg-white px-5 py-20 text-[#080b14] lg:px-8 lg:py-28">
            <div className="mx-auto max-w-[90rem]">
              <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.22em] text-sky-600">Presença comercial</p>
                  <h2 className="mt-4 text-5xl font-black uppercase leading-[.9] tracking-[-.045em] sm:text-7xl">
                    Loja virtual conectada com loja real.
                  </h2>
                  <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                    O Linktree oficial lista SAC, Centro Mega Outlet em São José dos Pinhais, Galeria Di Brunno, Shopping Cidade, Pinheirinho e Instagram.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["Outlet São José dos Pinhais", "frente oficial no Linktree", MapPin],
                    ["Galeria Di Brunno", "canal oficial no Linktree", ShoppingBag],
                    ["Shopping Cidade", "canal oficial no Linktree", ShoppingBag],
                    ["Pinheirinho", "canal oficial no Linktree", MapPin],
                  ].map(([title, body, Icon]) => {
                    const IconComponent = Icon as typeof MapPin;
                    return (
                      <article key={String(title)} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl">
                        <IconComponent className="h-6 w-6 text-fuchsia-600" />
                        <h3 className="mt-8 text-xl font-black">{String(title)}</h3>
                        <p className="mt-2 text-sm text-slate-500">{String(body)}</p>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="mt-12 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
                <div className="rounded-[2.5rem] bg-[#080b14] p-8 text-white lg:p-12">
                  <div className="flex flex-wrap items-start justify-between gap-8">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">Próximo passo</p>
                      <h2 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-[.95] sm:text-6xl">
                        Escolha o que chamou atenção. A loja confirma o que existe hoje.
                      </h2>
                    </div>
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-lime-300 text-[#080b14]">
                      <PackageCheck className="h-7 w-7" />
                    </div>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <ShopCTA
                      selected={selectedProducts}
                      className="inline-flex min-h-13 items-center gap-2 rounded-full bg-white px-7 py-3.5 font-black text-[#080b14] transition hover:-translate-y-1 hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                    >
                      {selectedProducts.length ? "Consultar minha seleção" : "Consultar produtos"} <ArrowRight className="h-4 w-4" />
                    </ShopCTA>
                    <a
                      href={links.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-13 items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 font-black transition hover:border-fuchsia-300 hover:text-fuchsia-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300"
                    >
                      <Instagram className="h-4 w-4" /> Ver Instagram
                    </a>
                  </div>
                </div>

                <div className="rounded-[2.5rem] border border-slate-200 bg-gradient-to-br from-cyan-50 via-white to-fuchsia-50 p-8 lg:p-10">
                  <Search className="h-7 w-7 text-sky-600" />
                  <h3 className="mt-8 text-3xl font-black">Não achou o item?</h3>
                  <p className="mt-4 leading-7 text-slate-600">
                    Use o funil para descrever modelo, marca, numeração ou categoria. A consulta continua no contexto da Centro Mega.
                  </p>
                  <ShopCTA className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#080b14] px-6 py-3 font-black text-white transition hover:bg-fuchsia-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500">
                    Procurar outro produto <Search className="h-4 w-4" />
                  </ShopCTA>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 bg-[#03040a] px-5 py-10 lg:px-8">
          <div className="mx-auto flex max-w-[90rem] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <PortfolioImage
                  src="/images/centro-mega/logo.png"
                  alt="Centro Mega"
                  width={500}
                  height={500}
                  managedField="logoUrl"
                  className="h-11 w-11 rounded-xl object-cover"
                />
                <div>
                  <p className="font-black uppercase tracking-[.12em]">Centro Mega</p>
                  <p className="text-xs text-white/45">Amostra de loja virtual · tecnologia + outlet</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/55">
                <a href={links.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white"><Instagram className="h-4 w-4" /> Instagram</a>
                <a href={links.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white"><Facebook className="h-4 w-4" /> Facebook</a>
                <a href={links.linktree} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white"><ShoppingBag className="h-4 w-4" /> Linktree</a>
              </div>
            </div>
            <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4" />
          </div>
        </footer>

        <PortfolioSocialProofPopup
          clientKey="centro-mega"
          eyebrow="Centro Mega Store"
          title="Viu algo nas redes? Agora dá para transformar o post em consulta."
          description="Selecione o item, preserve o contexto e confirme estoque e condições atuais com a loja."
          ctaLabel="Explorar vitrine"
          ctaHref="#vitrine"
          delayMs={11000}
          className="border-cyan-300/25 bg-[#080b14]/95 text-white"
          accentClassName="text-cyan-300"
        />
        <PortfolioUpsellPopup pageName="portfolio-centro-mega" />
      </div>
    </MotionScope>
  );
}
