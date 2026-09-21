import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Facebook,
  Headphones,
  Instagram,
  MapPin,
  PackageOpen,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Store,
  Tag,
  Wrench,
  X,
} from "lucide-react";
import { MotionReveal } from "@/components/motion";
import { PortfolioCTAQuiz, type PortfolioQuizConfig } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const links = {
  instagram: "https://www.instagram.com/centro.mega/",
  facebook: "https://www.facebook.com/CentroMega.com.br/",
  opening:
    "https://www.facebook.com/ShoppingCidadeCuritiba/posts/venha-conhecer-a-loja-centro-mega-que-inaugurou-hoje-aqui-no-cidade-a-loja-%C3%A9-esp/1850210055013641/",
  linktree: "https://linktr.ee/centro.mega",
  store: "https://www.vhsys.net/centromega/contato/",
  publicMirror:
    "https://www.findglocal.com/BR/S%C3%A3o-Jos%C3%A9-dos-Pinhais/148646501973380/Centro-Mega",
} as const;

const socialPosts = [
  ["Reel", "https://www.instagram.com/centro.mega/reel/DV8haszkdOy/"],
  ["Reel", "https://www.instagram.com/centro.mega/reel/DHzjkeutEKu/"],
  ["Post", "https://www.instagram.com/centro.mega/p/DDPCypWxVZZ/"],
  ["Reel", "https://www.instagram.com/centro.mega/reel/DHmlQd6tCNi/"],
  ["Post", "https://www.instagram.com/centro.mega/p/DGjBSGIPSKO/"],
  ["Post", "https://www.instagram.com/centro.mega/p/DCt4G0HxLRu/"],
] as const;

type SocialProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  sourceLabel: string;
  sourceDate: string;
  sourceUrl: string;
  historicalOffer?: string;
  historicalFrom?: string;
  currentState: string;
  visual: "phone" | "sneaker";
};

const socialProducts: SocialProduct[] = [
  {
    id: "poco-x5-pro-8-256",
    name: "Poco X5 Pro",
    category: "Celulares",
    description: "8 GB de RAM · 256 GB de memória interna",
    sourceLabel: "Produto registrado em postagem pública da Centro Mega",
    sourceDate: "25/01/2024",
    sourceUrl: links.publicMirror,
    historicalFrom: "R$ 2.399,00",
    historicalOffer: "R$ 1.899,00",
    currentState: "Preço e estoque atuais precisam ser confirmados com a loja.",
    visual: "phone",
  },
  {
    id: "tenis-dunk-low-pro",
    name: "Tênis Dunk Low Pro",
    category: "Outlet · Tênis",
    description: "Postagens registraram grades 34–39 e 34–43",
    sourceLabel: "Produto registrado em postagens públicas da Centro Mega",
    sourceDate: "08/11/2023",
    sourceUrl: links.publicMirror,
    currentState: "Grade, cores, preço e estoque atuais precisam ser confirmados com a loja.",
    visual: "sneaker",
  },
];

const departments = [
  {
    label: "Celulares",
    detail: "Smartphones e oportunidades publicadas pela marca.",
    Icon: Smartphone,
    tone: "from-cyan-400/25 via-blue-500/10 to-transparent",
  },
  {
    label: "Tênis & calçados",
    detail: "Outlet com modelos e grades que mudam conforme o estoque.",
    Icon: ShoppingBag,
    tone: "from-fuchsia-500/25 via-violet-500/10 to-transparent",
  },
  {
    label: "Bonés & outlet",
    detail: "Categoria rotativa informada pelo responsável da Centro Mega.",
    Icon: Tag,
    tone: "from-amber-400/25 via-orange-500/10 to-transparent",
  },
  {
    label: "Acessórios & tecnologia",
    detail: "Acessórios, suporte e itens ligados ao dia a dia digital.",
    Icon: Headphones,
    tone: "from-emerald-400/25 via-cyan-500/10 to-transparent",
  },
] as const;

const quiz: PortfolioQuizConfig = {
  services: [
    "Celulares e smartphones",
    "Tênis e calçados",
    "Bonés e outlet",
    "Acessórios e tecnologia",
    "Assistência técnica",
    "Quero orientação",
  ],
  experienceOptions: [
    "Quero consultar um produto visto na vitrine",
    "Quero saber o que está disponível hoje",
    "Quero retirar em uma loja",
    "Quero entender as opções da Centro Mega",
  ],
  periodOptions: [
    "São José dos Pinhais",
    "Curitiba",
    "Outra região / envio",
    "Quero combinar com a equipe",
  ],
  timingOptions: ["Hoje", "Nesta semana", "Sem urgência — estou pesquisando"],
  proposalKind: "service",
  stepTitles: {
    service: "O que você procura na Centro Mega?",
    experience: "Como você quer comprar?",
    period: "Qual região faz mais sentido para você?",
    timing: "Quando pretende resolver isso?",
  },
  notePlaceholder:
    "Se veio de uma postagem, conte o produto, modelo, cor, numeração ou detalhe que você viu.",
};

function ProductVisual({ kind }: { kind: SocialProduct["visual"] }) {
  if (kind === "phone") {
    return (
      <div
        aria-hidden="true"
        className="relative mx-auto h-56 w-36 rotate-6 rounded-[2.2rem] border border-white/30 bg-gradient-to-br from-[#161d3d] via-[#4655ff] to-[#12e5ff] p-2 shadow-[0_28px_80px_rgba(35,199,255,.28)] transition duration-500 group-hover:rotate-2 group-hover:scale-105"
      >
        <div className="h-full rounded-[1.8rem] border border-white/20 bg-[#060817] p-3">
          <div className="mx-auto h-2 w-14 rounded-full bg-white/15" />
          <div className="mt-4 h-24 rounded-2xl bg-[radial-gradient(circle_at_25%_25%,#67e8f9,transparent_22%),radial-gradient(circle_at_75%_75%,#c026d3,transparent_28%),linear-gradient(135deg,#0b1028,#1e3a8a)]" />
          <div className="mt-4 grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <span key={index} className="aspect-square rounded-lg bg-white/10" />
            ))}
          </div>
        </div>
        <span className="absolute -right-5 top-7 rounded-full border border-cyan-200/30 bg-cyan-300 px-3 py-1 text-[10px] font-black uppercase tracking-[.18em] text-[#06101d] shadow-xl">
          8/256
        </span>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="relative mx-auto h-56 w-full max-w-xs">
      <div className="absolute left-[8%] top-[38%] h-20 w-[78%] -rotate-6 rounded-[52%_48%_35%_65%/58%_45%_55%_42%] bg-gradient-to-r from-white via-slate-100 to-slate-300 shadow-[0_28px_60px_rgba(168,85,247,.25)] transition duration-500 group-hover:-rotate-2 group-hover:scale-105">
        <div className="absolute -bottom-4 left-[8%] h-7 w-[88%] rounded-b-[2rem] rounded-t-lg border-t-4 border-[#0b0d16] bg-white" />
        <div className="absolute left-[30%] top-[20%] h-4 w-[35%] -rotate-12 rounded-full bg-[#111827]" />
        <div className="absolute left-[18%] top-[28%] grid gap-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <span key={index} className="h-1.5 w-16 -rotate-6 rounded-full bg-slate-400" />
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 right-3 rotate-6 rounded-2xl border border-fuchsia-300/25 bg-fuchsia-400/15 px-4 py-3 backdrop-blur">
        <p className="text-[10px] font-black uppercase tracking-[.2em] text-fuchsia-200">Outlet drop</p>
        <p className="mt-1 text-sm font-black text-white">Dunk Low Pro</p>
      </div>
    </div>
  );
}

function StoreCTA({
  children,
  selectedProducts = [],
  className,
}: {
  children: React.ReactNode;
  selectedProducts?: SocialProduct[];
  className?: string;
}) {
  const itemNames = selectedProducts.map((product) => product.name);
  const service = itemNames.length
    ? `Produtos da vitrine: ${itemNames.join(" + ")}`
    : undefined;

  return (
    <PortfolioCTAQuiz
      clientKey="centro-mega"
      studioName="Centro Mega"
      recipientName="a equipe Centro Mega"
      theme="navy"
      mode="proposal"
      funnelIntent="pedido"
      quizConfig={quiz}
      initialAnswers={
        service
          ? {
              service,
              experience: "Quero consultar um produto visto na vitrine",
            }
          : undefined
      }
      skipPrefilledSteps={Boolean(service)}
      orderContext={
        itemNames.length
          ? {
              order_items: itemNames.join(" | "),
              fulfillment: "A confirmar com a unidade Centro Mega",
              customer_note:
                "Itens adicionados à sacola de interesse da amostra de loja virtual.",
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedProducts = useMemo(
    () => socialProducts.filter((product) => selectedIds.includes(product.id)),
    [selectedIds],
  );

  const toggleProduct = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  return (
    <div
      data-client-slug="centro-mega"
      className="min-h-dvh overflow-hidden bg-[#050713] text-white selection:bg-cyan-300 selection:text-[#050713]"
      style={
        {
          "--mega-ink": "#050713",
          "--mega-panel": "#0b1020",
          "--mega-cyan": "#35e7ff",
          "--mega-violet": "#8b5cf6",
          "--mega-pink": "#ff3cac",
          "--mega-lime": "#c7ff4a",
        } as React.CSSProperties
      }
    >
      <div className="fixed inset-x-0 top-0 z-[70] h-px bg-gradient-to-r from-transparent via-[var(--mega-cyan)] to-transparent opacity-80" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050713]/82 px-4 py-3 backdrop-blur-2xl lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a href="#inicio" className="flex items-center gap-3" aria-label="Centro Mega Store — início">
            <PortfolioImage
              src="/images/centro-mega/logo.png"
              alt="Logo Centro Mega"
              width={500}
              height={500}
              priority
              managedField="logoUrl"
              className="h-11 w-11 rounded-2xl object-cover shadow-[0_0_30px_rgba(53,231,255,.18)]"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-black uppercase tracking-[.18em]">Centro Mega</p>
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-cyan-300">Store sample</p>
            </div>
          </a>

          <nav className="hidden items-center gap-6 text-[11px] font-black uppercase tracking-[.16em] text-white/65 lg:flex">
            <a href="#drops" className="transition hover:text-cyan-300">Drops reais</a>
            <a href="#departamentos" className="transition hover:text-cyan-300">Departamentos</a>
            <a href="#social" className="transition hover:text-cyan-300">Redes</a>
            <a href="#lojas" className="transition hover:text-cyan-300">Lojas</a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => document.getElementById("sacola")?.scrollIntoView({ behavior: "smooth" })}
              className="relative grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 transition hover:border-cyan-300/60 hover:bg-cyan-300/10"
              aria-label={`Sacola de interesse com ${selectedIds.length} item(ns)`}
            >
              <ShoppingCart className="h-5 w-5" />
              {selectedIds.length ? (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--mega-pink)] px-1 text-[10px] font-black">
                  {selectedIds.length}
                </span>
              ) : null}
            </button>
            <StoreCTA className="hidden min-h-11 items-center gap-2 rounded-full bg-cyan-300 px-5 text-sm font-black text-[#06101d] transition hover:-translate-y-0.5 hover:bg-white sm:inline-flex">
              Consultar agora <ArrowRight className="h-4 w-4" />
            </StoreCTA>
          </div>
        </div>
      </header>

      <main>
        <section id="inicio" className="relative isolate min-h-[88svh] overflow-hidden px-5 py-16 lg:px-8 lg:py-24">
          <div className="absolute inset-0 -z-30 bg-[#050713]" />
          <div className="absolute inset-0 -z-20 opacity-35 [background-image:linear-gradient(rgba(53,231,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(53,231,255,.12)_1px,transparent_1px)] [background-size:54px_54px]" />
          <div className="absolute -left-48 top-10 -z-20 h-[36rem] w-[36rem] rounded-full bg-fuchsia-600/20 blur-[120px]" />
          <div className="absolute -right-40 top-20 -z-20 h-[40rem] w-[40rem] rounded-full bg-cyan-400/20 blur-[140px]" />
          <div className="absolute left-[56%] top-[18%] -z-10 h-[32rem] w-[32rem] rounded-full border border-cyan-200/20 shadow-[0_0_100px_rgba(53,231,255,.15)]" />
          <div className="absolute left-[61%] top-[25%] -z-10 h-[24rem] w-[24rem] rounded-full border border-fuchsia-300/20" />

          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5 text-[10px] font-black uppercase tracking-[.22em] text-white/50">
              <span className="inline-flex items-center gap-2 text-cyan-300">
                <Sparkles className="h-4 w-4" />
                Amostra de loja virtual
              </span>
              <span>Produtos reais de postagens + categorias da operação</span>
            </div>

            <div className="grid gap-12 pt-12 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
              <div>
                <MotionReveal as="p" variant="up" className="text-xs font-black uppercase tracking-[.28em] text-fuchsia-300">
                  Centro Mega · Tech + Outlet
                </MotionReveal>
                <MotionReveal
                  as="h1"
                  variant="mask"
                  intensity="EXPRESSIVE"
                  className="mt-5 max-w-5xl text-[clamp(4rem,10vw,9.5rem)] font-black uppercase leading-[.77] tracking-[-.065em]"
                >
                  O drop
                  <span className="block bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-transparent">
                    mudou.
                  </span>
                  <span className="block">A vitrine também.</span>
                </MotionReveal>
                <p className="mt-8 max-w-2xl text-lg leading-8 text-white/68 sm:text-xl">
                  Celulares, tênis, bonés, calçados, acessórios e oportunidades de outlet em uma experiência de loja criada para acompanhar o giro real das redes da Centro Mega.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#drops"
                    className="inline-flex min-h-13 items-center gap-2 rounded-full bg-cyan-300 px-7 py-4 font-black text-[#06101d] shadow-[0_0_40px_rgba(53,231,255,.18)] transition hover:-translate-y-1 hover:bg-white"
                  >
                    Ver drops reais <ArrowRight className="h-4 w-4" />
                  </a>
                  <StoreCTA className="inline-flex min-h-13 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 font-black backdrop-blur transition hover:border-fuchsia-300/60 hover:bg-fuchsia-400/10">
                    Pedir atendimento
                  </StoreCTA>
                </div>
              </div>

              <MotionReveal variant="right">
                <div className="relative mx-auto max-w-xl">
                  <div className="absolute -inset-8 -z-10 rounded-full bg-gradient-to-br from-cyan-300/20 via-transparent to-fuchsia-400/20 blur-3xl" />
                  <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/[.05] p-6 shadow-[0_30px_120px_rgba(0,0,0,.45)] backdrop-blur-xl sm:p-8">
                    <div className="flex items-center justify-between border-b border-white/10 pb-5">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[.22em] text-cyan-300">Mega drop interface</p>
                        <p className="mt-1 text-2xl font-black">Vitrine social</p>
                      </div>
                      <span className="rounded-full border border-lime-300/25 bg-lime-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[.16em] text-lime-200">
                        base real
                      </span>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {socialProducts.map((product) => (
                        <div key={product.id} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#090d1b] p-5">
                          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-cyan-400/10 blur-2xl" />
                          <p className="text-[10px] font-black uppercase tracking-[.2em] text-fuchsia-300">{product.category}</p>
                          <p className="mt-3 text-xl font-black">{product.name}</p>
                          <p className="mt-2 text-sm leading-6 text-white/55">{product.description}</p>
                          <div className="mt-5 h-28 overflow-hidden">
                            <ProductVisual kind={product.visual} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 text-xs text-white/55">
                      <span>Estoque e valores atuais são confirmados no atendimento.</span>
                      <ScanStatus />
                    </div>
                  </div>
                </div>
              </MotionReveal>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[.025] py-4">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-5 text-[10px] font-black uppercase tracking-[.24em] text-white/55">
            {["celulares", "outlet", "tênis", "bonés", "calçados", "acessórios", "assistência"].map((item, index) => (
              <span key={item} className="inline-flex items-center gap-3">
                {index ? <span className="h-1.5 w-1.5 rounded-full bg-[var(--mega-pink)]" /> : null}
                {item}
              </span>
            ))}
          </div>
        </section>

        <section id="drops" className="px-5 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[.24em] text-cyan-300">Drops com origem rastreável</p>
                <h2 className="mt-4 text-5xl font-black uppercase leading-[.88] sm:text-7xl">
                  Post virou produto.
                  <span className="block text-fuchsia-300">Sem inventar estoque.</span>
                </h2>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-white/60">
                Estes itens entram na amostra porque aparecem em registros públicos da Centro Mega. Preços, cores, grades e disponibilidade atuais não são presumidos: a loja confirma antes da compra.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {socialProducts.map((product) => {
                const selected = selectedIds.includes(product.id);
                return (
                  <article
                    key={product.id}
                    className="group relative overflow-hidden rounded-[2.5rem] border border-white/12 bg-gradient-to-br from-white/[.075] via-white/[.035] to-transparent p-6 shadow-[0_30px_90px_rgba(0,0,0,.22)] transition duration-500 hover:-translate-y-2 hover:border-cyan-300/35 sm:p-8"
                  >
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl transition group-hover:bg-fuchsia-400/10" />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[.18em] text-cyan-200">
                          {product.category}
                        </span>
                        <h3 className="mt-5 text-3xl font-black sm:text-4xl">{product.name}</h3>
                        <p className="mt-3 text-white/58">{product.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleProduct(product.id)}
                        aria-pressed={selected}
                        className={[
                          "grid h-12 w-12 shrink-0 place-items-center rounded-full border transition",
                          selected
                            ? "border-lime-300 bg-lime-300 text-[#06101d]"
                            : "border-white/15 bg-white/5 hover:border-cyan-300/60 hover:bg-cyan-300/10",
                        ].join(" ")}
                        aria-label={selected ? `Remover ${product.name} da sacola` : `Adicionar ${product.name} à sacola`}
                      >
                        {selected ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                      </button>
                    </div>

                    <div className="mt-5 rounded-[2rem] border border-white/8 bg-[#070a15] px-4 py-2">
                      <ProductVisual kind={product.visual} />
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4">
                        <p className="text-[10px] font-black uppercase tracking-[.18em] text-white/40">Origem</p>
                        <p className="mt-2 text-sm font-bold leading-6">{product.sourceLabel}</p>
                        <p className="mt-1 text-xs text-white/45">{product.sourceDate}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4">
                        <p className="text-[10px] font-black uppercase tracking-[.18em] text-white/40">
                          {product.historicalOffer ? "Preço da publicação" : "Estado atual"}
                        </p>
                        {product.historicalOffer ? (
                          <>
                            <p className="mt-2 text-xs text-white/40 line-through">{product.historicalFrom}</p>
                            <p className="text-2xl font-black text-lime-300">{product.historicalOffer}</p>
                            <p className="mt-1 text-[11px] text-white/45">Valor histórico de {product.sourceDate}</p>
                          </>
                        ) : (
                          <p className="mt-2 text-sm font-bold leading-6">Consultar preço e disponibilidade</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                      <p className="max-w-md text-xs leading-5 text-amber-100/60">{product.currentState}</p>
                      <a
                        href={product.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] text-cyan-300 hover:text-white"
                      >
                        Ver registro público <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="departamentos" className="relative overflow-hidden bg-[#0a0e1d] px-5 py-20 lg:px-8 lg:py-28">
          <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_20%_20%,rgba(53,231,255,.12),transparent_25%),radial-gradient(circle_at_80%_80%,rgba(255,60,172,.12),transparent_28%)]" />
          <div className="relative mx-auto max-w-7xl">
            <div className="max-w-4xl">
              <p className="text-xs font-black uppercase tracking-[.24em] text-fuchsia-300">Departamentos da amostra</p>
              <h2 className="mt-4 text-5xl font-black uppercase leading-[.88] sm:text-7xl">
                Loja híbrida.
                <span className="block text-cyan-300">Tech de um lado. Outlet do outro.</span>
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/58">
                O catálogo pode crescer a partir do que a Centro Mega realmente publica. Categorias entram primeiro; SKUs, preço e estoque entram somente quando houver fonte atual.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {departments.map(({ label, detail, Icon, tone }) => (
                <article
                  key={label}
                  className={`group relative min-h-72 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br ${tone} p-6 transition duration-500 hover:-translate-y-2 hover:border-white/25`}
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-black/20 backdrop-blur">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-16 text-[10px] font-black uppercase tracking-[.2em] text-white/42">Departamento</p>
                  <h3 className="mt-2 text-2xl font-black">{label}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/56">{detail}</p>
                  <span className="absolute bottom-5 right-5 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 opacity-0 transition group-hover:opacity-100">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="sacola" className="px-5 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="overflow-hidden rounded-[2.6rem] border border-white/12 bg-gradient-to-br from-cyan-300/10 via-white/[.04] to-fuchsia-400/10 p-6 sm:p-10">
              <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.24em] text-lime-300">Sacola de interesse</p>
                  <h2 className="mt-4 text-5xl font-black uppercase leading-[.9] sm:text-7xl">
                    Experimente a lógica de compra sem fingir estoque.
                  </h2>
                  <p className="mt-6 max-w-xl text-lg leading-8 text-white/58">
                    Nesta amostra, adicionar um item guarda seu interesse e leva a seleção para o funil da própria Centro Mega. Preço, estoque, cor, numeração e entrega são confirmados pela equipe.
                  </p>
                </div>

                <div className="rounded-[2rem] border border-white/12 bg-[#060916]/80 p-5 shadow-2xl backdrop-blur sm:p-7">
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-300 text-[#06101d]">
                        <ShoppingCart className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-black">Sua seleção</p>
                        <p className="text-xs text-white/45">{selectedProducts.length} item(ns) de interesse</p>
                      </div>
                    </div>
                    {selectedProducts.length ? (
                      <button
                        type="button"
                        onClick={() => setSelectedIds([])}
                        className="inline-flex items-center gap-1 text-xs font-bold text-white/45 transition hover:text-white"
                      >
                        Limpar <X className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>

                  <div className="py-5">
                    {selectedProducts.length ? (
                      <div className="space-y-3">
                        {selectedProducts.map((product) => (
                          <div key={product.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[.03] p-4">
                            <div>
                              <p className="font-black">{product.name}</p>
                              <p className="mt-1 text-xs text-white/45">{product.category} · disponibilidade a confirmar</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleProduct(product.id)}
                              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/55 transition hover:border-fuchsia-300/50 hover:text-white"
                              aria-label={`Remover ${product.name}`}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-white/15 px-5 py-8 text-center">
                        <PackageOpen className="mx-auto h-8 w-8 text-white/30" />
                        <p className="mt-3 font-bold text-white/60">Sua sacola ainda está vazia.</p>
                        <p className="mt-1 text-sm text-white/38">Adicione um drop real acima para testar o fluxo.</p>
                      </div>
                    )}
                  </div>

                  <StoreCTA
                    selectedProducts={selectedProducts}
                    className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-300 to-lime-300 px-6 py-4 font-black text-[#06101d] shadow-[0_0_45px_rgba(53,231,255,.18)] transition hover:-translate-y-1 hover:brightness-110"
                  >
                    {selectedProducts.length ? "Consultar minha seleção" : "Explorar disponibilidade"}
                    <ArrowRight className="h-4 w-4" />
                  </StoreCTA>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="social" className="bg-white px-5 py-20 text-[#07101d] lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[.24em] text-fuchsia-600">Radar social</p>
                <h2 className="mt-4 text-5xl font-black uppercase leading-[.9] sm:text-7xl">
                  A rede vira a entrada do catálogo.
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                  A Centro Mega já publica novidades nas redes. Nesta amostra, publicações verificadas podem virar produtos; quando o conteúdo da postagem não está legível pelas fontes disponíveis, mantemos apenas o link oficial — sem inventar SKU, preço ou descrição.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={links.instagram} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#07101d] px-5 font-black text-white">
                    <Instagram className="h-5 w-5" /> Instagram oficial
                  </a>
                  <a href={links.facebook} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-slate-300 px-5 font-black">
                    <Facebook className="h-5 w-5" /> Facebook
                  </a>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {socialPosts.map(([kind, href], index) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative overflow-hidden rounded-[1.8rem] border border-slate-200 bg-slate-50 p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-xl"
                  >
                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-cyan-300/30 to-fuchsia-300/20 blur-2xl" />
                    <div className="relative flex items-start justify-between gap-4">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white">
                        <Instagram className="h-5 w-5" />
                      </span>
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-[9px] font-black uppercase tracking-[.18em] text-white">
                        fonte oficial
                      </span>
                    </div>
                    <p className="relative mt-8 text-[10px] font-black uppercase tracking-[.2em] text-slate-400">{kind} · publicação {index + 1}</p>
                    <p className="relative mt-2 text-lg font-black">Abrir publicação da Centro Mega</p>
                    <p className="relative mt-2 text-sm leading-6 text-slate-500">
                      Conteúdo não promovido a produto sem leitura verificável da postagem.
                    </p>
                    <span className="relative mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.14em]">
                      Ver no Instagram <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="lojas" className="relative overflow-hidden bg-[#07101d] px-5 py-20 lg:px-8 lg:py-28">
          <div className="absolute -left-28 bottom-0 h-80 w-80 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="relative mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[.24em] text-cyan-300">Marca multicanal</p>
                <h2 className="mt-4 text-5xl font-black uppercase leading-[.9] sm:text-7xl">
                  A loja virtual conversa com as unidades.
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">
                  O Linktree oficial lista SAC, Centro Mega Outlet — São José dos Pinhais, Galeria Di Brunno, Shopping Cidade, Pinheirinho e Instagram. A amostra usa essa presença como contexto, sem presumir estoque compartilhado entre unidades.
                </p>
                <a
                  href={links.linktree}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-300/10 px-6 font-black text-cyan-200 transition hover:bg-cyan-300 hover:text-[#06101d]"
                >
                  Abrir canais oficiais <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Centro Mega Outlet", "São José dos Pinhais", ShoppingBag],
                  ["Galeria Di Brunno", "Canal oficial no Linktree", Store],
                  ["Shopping Cidade", "Canal oficial no Linktree", Store],
                  ["Pinheirinho", "Canal oficial no Linktree", MapPin],
                ].map(([name, detail, Icon]) => (
                  <div key={String(name)} className="rounded-[1.8rem] border border-white/10 bg-white/[.04] p-6 backdrop-blur">
                    <Icon className="h-6 w-6 text-cyan-300" />
                    <p className="mt-8 text-xl font-black">{String(name)}</p>
                    <p className="mt-2 text-sm text-white/48">{String(detail)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-14 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/[.035] p-5">
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-white/35">Operação pública</p>
                <p className="mt-2 font-black">Loja de celulares · outlet</p>
              </div>
              <div className="rounded-2xl bg-white/[.035] p-5">
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-white/35">São José dos Pinhais</p>
                <p className="mt-2 font-black">Rua XV de Novembro · Centro</p>
              </div>
              <div className="rounded-2xl bg-white/[.035] p-5">
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-white/35">Compra</p>
                <p className="mt-2 font-black">Disponibilidade confirmada pela equipe</p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-gradient-to-r from-cyan-300 via-lime-300 to-fuchsia-300 px-5 py-16 text-[#06101d] lg:px-8">
          <div className="absolute inset-0 -z-10 opacity-25 [background-image:radial-gradient(circle_at_20%_50%,#fff_0,transparent_28%),radial-gradient(circle_at_80%_50%,#fff_0,transparent_24%)]" />
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[.24em]">Centro Mega Store · amostra</p>
              <h2 className="mt-3 max-w-5xl text-5xl font-black uppercase leading-[.86] sm:text-7xl">
                Viu um produto? Leve o contexto junto para o atendimento.
              </h2>
              <p className="mt-5 max-w-2xl font-bold leading-7 opacity-70">
                A sacola desta demonstração não cobra nem promete estoque. Ela organiza o interesse e entrega a seleção ao funil individual da Centro Mega.
              </p>
            </div>
            <StoreCTA
              selectedProducts={selectedProducts}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#07101d] px-7 py-4 font-black text-white shadow-xl transition hover:-translate-y-1"
            >
              Consultar produtos <ArrowRight className="h-4 w-4" />
            </StoreCTA>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#04060d] px-5 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <PortfolioImage
              src="/images/centro-mega/logo.png"
              alt=""
              width={120}
              height={120}
              className="h-10 w-10 rounded-xl object-cover"
            />
            <div>
              <p className="font-black">Centro Mega</p>
              <p className="text-xs text-white/45">Amostra de loja virtual · tecnologia + outlet</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-white/45">
            <a href={links.instagram} target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a>
            <a href={links.facebook} target="_blank" rel="noreferrer" className="hover:text-white">Facebook</a>
            <a href={links.linktree} target="_blank" rel="noreferrer" className="hover:text-white">Canais oficiais</a>
          </div>
        </div>
        <div className="mx-auto mt-6 max-w-7xl border-t border-white/8 pt-5">
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="centro-mega"
        eyebrow="Centro Mega Store"
        title="Do post para a vitrine — sem perder a origem."
        description="Produtos entram na amostra somente quando existe base verificável. Consulte disponibilidade e valor atual."
        ctaLabel="Ver drops"
        ctaHref="#drops"
        delayMs={12000}
        className="border-cyan-300/25 bg-[#07101d]/95 text-white"
        accentClassName="text-cyan-300"
      />
      <PortfolioUpsellPopup pageName="portfolio-centro-mega" />
    </div>
  );
}

function ScanStatus() {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap font-black text-lime-300">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-300 opacity-50" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime-300" />
      </span>
      origem verificada
    </span>
  );
}
