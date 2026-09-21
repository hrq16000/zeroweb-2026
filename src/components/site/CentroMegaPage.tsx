import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  ArrowRight,
  BadgePercent,
  Check,
  ChevronRight,
  Facebook,
  Headphones,
  Instagram,
  MapPin,
  Minus,
  PackageOpen,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Store,
  Tag,
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
  indexedFeed:
    "https://www.findglocal.com/BR/S%C3%A3o-Jos%C3%A9-dos-Pinhais/148646501973380/Centro-Mega",
};

type Product = {
  id: string;
  title: string;
  category: "Celulares" | "Tênis" | "Bonés" | "Calçados" | "Acessórios" | "Outlet";
  kicker: string;
  description: string;
  visual: "phone" | "shoe" | "cap" | "bag" | "audio" | "mystery";
  accent: string;
  sourceType: "feed" | "owner-brief";
  sourceLabel: string;
  historicalPrice?: string;
  historicalMeta?: string;
};

const products: Product[] = [
  {
    id: "poco-x5-pro-8-256",
    title: "Poco X5 Pro · 8GB / 256GB",
    category: "Celulares",
    kicker: "Visto no feed da Centro Mega",
    description:
      "Smartphone anunciado publicamente pela marca. Nesta amostra, entra como produto de vitrine para consulta de disponibilidade e valor atual.",
    visual: "phone",
    accent: "#4df7ff",
    sourceType: "feed",
    sourceLabel: "Post público indexado · 25/01/2024",
    historicalPrice: "R$ 1.899,00",
    historicalMeta: "Preço histórico publicado: de R$ 2.399,00 por R$ 1.899,00.",
  },
  {
    id: "dunk-low-pro",
    title: "Tênis Dunk Low Pro",
    category: "Tênis",
    kicker: "Visto no feed da Centro Mega",
    description:
      "Modelo anunciado publicamente pela marca em 2023. Num e-commerce real, grade, cor, valor e estoque seriam confirmados em tempo real.",
    visual: "shoe",
    accent: "#ff3dbf",
    sourceType: "feed",
    sourceLabel: "Post público indexado · 08/11/2023",
    historicalMeta: "A publicação menciona grade de tamanhos e pagamento em cartões.",
  },
  {
    id: "bones-outlet",
    title: "Bonés · seleção outlet",
    category: "Bonés",
    kicker: "Categoria informada pelo responsável",
    description:
      "Espaço preparado para os bonés e achadinhos que entram e saem do feed. Ideal para giro rápido sem engessar o catálogo.",
    visual: "cap",
    accent: "#f8ea4b",
    sourceType: "owner-brief",
    sourceLabel: "Categoria da amostra · estoque variável",
  },
  {
    id: "calcados-outlet",
    title: "Calçados · seleção outlet",
    category: "Calçados",
    kicker: "Categoria informada pelo responsável",
    description:
      "Vitrine flexível para calçados de oportunidade. O produto real pode ser trocado no catálogo sem redesenhar a página.",
    visual: "bag",
    accent: "#8eff62",
    sourceType: "owner-brief",
    sourceLabel: "Categoria da amostra · estoque variável",
  },
  {
    id: "acessorios-mobile",
    title: "Acessórios para celular",
    category: "Acessórios",
    kicker: "Linha complementar da loja",
    description:
      "Área de catálogo para acessórios e itens de conveniência tech. Cada item pode virar produto, variação ou oferta-relâmpago.",
    visual: "audio",
    accent: "#7ba5ff",
    sourceType: "owner-brief",
    sourceLabel: "Categoria da loja · itens sob consulta",
  },
  {
    id: "achadinhos-do-feed",
    title: "Achadinhos do feed",
    category: "Outlet",
    kicker: "Drops e oportunidades",
    description:
      "Um espaço para produtos que aparecem nas redes por pouco tempo: moda, acessórios e itens de oportunidade sem criar um catálogo engessado.",
    visual: "mystery",
    accent: "#ff8a3d",
    sourceType: "owner-brief",
    sourceLabel: "Categoria dinâmica da amostra",
  },
];

const quizConfig = {
  services: [
    "Celular ou smartphone",
    "Tênis / calçados",
    "Bonés / moda outlet",
    "Acessórios mobile",
    "Outro produto visto nas redes",
  ],
  experienceOptions: [
    "Quero consultar disponibilidade",
    "Quero comprar ou reservar",
    "Quero saber o valor atual",
    "Quero comparar opções",
  ],
  periodOptions: [
    "Retirada em São José dos Pinhais",
    "Outra unidade Centro Mega",
    "Quero consultar envio",
    "Ainda não sei",
  ],
  timingOptions: ["Quero resolver hoje", "Nos próximos dias", "Estou pesquisando", "Sem urgência"],
  stepTitles: {
    service: "O que você quer encontrar na Centro Mega?",
    experience: "O que você quer fazer agora?",
    period: "Como prefere receber ou retirar?",
    timing: "Quando você pretende comprar?",
    note: "Quer deixar algum detalhe?",
  },
  stepSubtitles: {
    service: "Escolha uma categoria ou continue com os produtos que já colocou na sacola.",
    experience: "A equipe recebe sua intenção organizada antes do atendimento.",
    period: "A disponibilidade de unidade, retirada e envio é confirmada pela equipe.",
    timing: "Isso ajuda a priorizar o retorno sem criar promessa de estoque ou prazo.",
    note: "Modelo, cor, tamanho ou qualquer detalhe ajuda a equipe a responder melhor.",
  },
  notePlaceholder: "Ex.: quero tamanho 39, cor escura e gostaria de saber o valor atual.",
  proposalKind: "service" as const,
};

function ProductVisual({ product }: { product: Product }) {
  const iconClass = "h-24 w-24 sm:h-28 sm:w-28";
  const icon =
    product.visual === "phone" ? (
      <Smartphone className={iconClass} aria-hidden="true" />
    ) : product.visual === "shoe" ? (
      <ShoppingBag className={iconClass} aria-hidden="true" />
    ) : product.visual === "cap" ? (
      <Tag className={iconClass} aria-hidden="true" />
    ) : product.visual === "audio" ? (
      <Headphones className={iconClass} aria-hidden="true" />
    ) : product.visual === "mystery" ? (
      <PackageOpen className={iconClass} aria-hidden="true" />
    ) : (
      <ShoppingBag className={iconClass} aria-hidden="true" />
    );

  return (
    <div
      className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101f]"
      style={{ "--product-accent": product.accent } as CSSProperties}
    >
      <div className="absolute -left-12 top-7 h-44 w-44 rounded-full bg-[var(--product-accent)]/20 blur-3xl" />
      <div className="absolute -right-10 bottom-0 h-36 w-36 rounded-full bg-fuchsia-500/15 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] font-black uppercase tracking-[.18em] text-white/65 backdrop-blur">
        {product.sourceType === "feed" ? "do feed" : "amostra"}
      </div>
      <div
        className="relative grid h-48 w-48 place-items-center rounded-[3rem] border border-white/15 bg-white/[.055] text-white shadow-[0_0_80px_var(--product-accent)] backdrop-blur-xl transition duration-500 group-hover:-translate-y-2 group-hover:rotate-2"
        style={{ color: product.accent }}
      >
        {icon}
        <div className="absolute inset-3 rounded-[2.4rem] border border-white/10" />
      </div>
      <div className="pointer-events-none absolute -bottom-12 h-28 w-2/3 rounded-[50%] bg-[var(--product-accent)]/20 blur-2xl" />
    </div>
  );
}

function CTA({
  children,
  service,
  orderItems,
  className,
}: {
  children: ReactNode;
  service?: string;
  orderItems?: Product[];
  className?: string;
}) {
  const orderNames = orderItems?.map((item) => item.title).join(" | ");
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
        orderNames
          ? {
              order_items: orderNames,
              order_total: "Valores e estoque sob consulta — amostra de loja virtual",
              fulfillment: "Retirada/unidade/envio a confirmar com a Centro Mega",
              customer_note: "Seleção feita na amostra de loja virtual Centro Mega",
            }
          : undefined
      }
      className={className}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

function CartDrawer({
  open,
  onClose,
  items,
  onRemove,
}: {
  open: boolean;
  onClose: () => void;
  items: Product[];
  onRemove: (id: string) => void;
}) {
  const service = items.length ? `Sacola: ${items.map((item) => item.title).join(" + ")}` : undefined;

  return (
    <div
      className={[
        "fixed inset-0 z-[80] transition",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Fechar sacola"
        onClick={onClose}
        className={[
          "absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
      <aside
        className={[
          "absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#060914] text-white shadow-2xl transition duration-500 motion-reduce:transition-none",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Sacola de interesse"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[.22em] text-cyan-300">Sacola de interesse</p>
            <h2 className="mt-1 text-2xl font-black">Sua seleção</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 p-2.5 text-white/70 hover:bg-white/10 hover:text-white" aria-label="Fechar">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length ? (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.04] p-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/[.06]" style={{ color: item.accent }}>
                    {item.visual === "phone" ? <Smartphone className="h-6 w-6" /> : <ShoppingBag className="h-6 w-6" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black">{item.title}</p>
                    <p className="mt-1 text-xs text-white/50">{item.category} · valor atual sob consulta</p>
                  </div>
                  <button type="button" onClick={() => onRemove(item.id)} className="rounded-full border border-white/10 p-2 text-white/55 hover:text-white" aria-label={`Remover ${item.title}`}>
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid min-h-72 place-items-center text-center">
              <div>
                <ShoppingBag className="mx-auto h-12 w-12 text-white/25" />
                <p className="mt-5 text-xl font-black">Sua sacola está vazia</p>
                <p className="mt-2 text-sm leading-6 text-white/50">Adicione produtos da vitrine para montar uma consulta personalizada.</p>
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-white/10 bg-white/[.025] p-6">
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-cyan-300/15 bg-cyan-300/[.05] p-4 text-xs leading-5 text-white/60">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
            Esta é uma amostra de loja. A equipe confirma estoque, valor atual, variação e forma de entrega antes da compra.
          </div>
          <CTA
            service={service}
            orderItems={items}
            className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-500 px-6 py-4 font-black text-[#04101d] shadow-[0_0_35px_rgba(83,220,255,.25)] transition hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(83,220,255,.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {items.length ? "Consultar esta sacola" : "Consultar um produto"}
            <ArrowRight className="h-4 w-4" />
          </CTA>
        </div>
      </aside>
    </div>
  );
}

export function CentroMegaPage() {
  const [category, setCategory] = useState<"Todos" | Product["category"]>("Todos");
  const [cartIds, setCartIds] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const visibleProducts = useMemo(
    () => (category === "Todos" ? products : products.filter((product) => product.category === category)),
    [category],
  );
  const cart = useMemo(() => products.filter((product) => cartIds.includes(product.id)), [cartIds]);

  const toggleCartProduct = (id: string) => {
    setCartIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const categories = ["Todos", "Celulares", "Tênis", "Bonés", "Calçados", "Acessórios", "Outlet"] as const;

  return (
    <div
      data-client-slug="centro-mega"
      className="min-h-dvh overflow-x-hidden bg-[#040711] text-white selection:bg-cyan-300 selection:text-[#04101d]"
      style={
        {
          "--mega-cyan": "#58efff",
          "--mega-blue": "#2478ff",
          "--mega-pink": "#ff3dbf",
          "--mega-yellow": "#f8ea4b",
        } as CSSProperties
      }
    >
      <style>{`
        @keyframes mega-float { 0%,100% { transform: translate3d(0,0,0) rotate(-1deg); } 50% { transform: translate3d(0,-14px,0) rotate(1deg); } }
        @keyframes mega-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) {
          .mega-float, .mega-marquee { animation: none !important; transform: none !important; }
        }
      `}</style>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#040711]/78 px-4 py-3 backdrop-blur-2xl lg:px-8">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
          <a href="#inicio" className="flex items-center gap-3" aria-label="Centro Mega Store — início">
            <PortfolioImage
              src="/images/centro-mega/logo.png"
              alt="Centro Mega"
              width={500}
              height={500}
              priority
              managedField="logoUrl"
              className="h-11 w-11 rounded-xl object-cover shadow-[0_0_30px_rgba(88,239,255,.18)]"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-black uppercase tracking-[.06em]">Centro Mega</p>
              <p className="text-[10px] font-black uppercase tracking-[.22em] text-cyan-300">Store concept</p>
            </div>
          </a>

          <nav className="hidden items-center gap-6 text-xs font-black uppercase tracking-[.14em] text-white/60 lg:flex" aria-label="Loja virtual">
            <a href="#vitrine" className="transition hover:text-cyan-300">Vitrine</a>
            <a href="#outlet" className="transition hover:text-cyan-300">Outlet</a>
            <a href="#feed" className="transition hover:text-cyan-300">Do feed</a>
            <a href="#lojas" className="transition hover:text-cyan-300">Lojas</a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-4 text-sm font-black backdrop-blur-xl transition hover:border-cyan-300/40 hover:bg-white/[.1]"
            >
              <ShoppingBag className="h-4 w-4 text-cyan-300" />
              <span className="hidden sm:inline">Sacola</span>
              {cart.length > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-fuchsia-500 px-1 text-[10px] text-white">
                  {cart.length}
                </span>
              )}
            </button>
            <CTA className="hidden min-h-11 items-center gap-2 rounded-full bg-cyan-300 px-5 text-sm font-black text-[#04101d] transition hover:-translate-y-0.5 hover:bg-white sm:inline-flex">
              Pedir agora <ArrowRight className="h-4 w-4" />
            </CTA>
          </div>
        </div>
      </header>

      <main>
        <section id="inicio" className="relative isolate min-h-[88svh] overflow-hidden px-5 py-14 lg:px-10 lg:py-20">
          <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_15%_20%,rgba(36,120,255,.28),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(255,61,191,.24),transparent_26%),radial-gradient(circle_at_58%_86%,rgba(88,239,255,.16),transparent_30%),#040711]" />
          <div className="absolute inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />
          <div className="absolute -right-24 top-24 -z-10 h-[34rem] w-[34rem] rounded-full border border-cyan-300/15 motion-safe:animate-[spin_26s_linear_infinite]" />
          <div className="absolute -right-4 top-44 -z-10 h-[23rem] w-[23rem] rounded-full border border-fuchsia-400/20 motion-safe:animate-[spin_18s_linear_infinite_reverse]" />

          <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[.88fr_1.12fr] lg:items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[.07] px-4 py-2 text-[10px] font-black uppercase tracking-[.22em] text-cyan-200 backdrop-blur-xl">
                <Zap className="h-4 w-4" />
                amostra de loja virtual
              </div>

              <MotionReveal as="h1" variant="mask" intensity="EXPRESSIVE" className="mt-7 max-w-4xl text-[clamp(4.4rem,10vw,9rem)] font-black uppercase leading-[.76] tracking-[-.075em]">
                Mega
                <span className="block bg-gradient-to-r from-cyan-200 via-white to-fuchsia-300 bg-clip-text text-transparent">
                  Store.
                </span>
              </MotionReveal>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-white/68 sm:text-xl">
                Celulares, acessórios e achadinhos de outlet numa experiência de compra inspirada no que a Centro Mega já publica nas redes.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="#vitrine"
                  className="inline-flex min-h-14 items-center gap-3 rounded-full bg-gradient-to-r from-cyan-300 to-sky-400 px-7 py-4 font-black text-[#04101d] shadow-[0_0_45px_rgba(88,239,255,.25)] transition hover:-translate-y-1 hover:shadow-[0_0_60px_rgba(88,239,255,.42)]"
                >
                  Explorar vitrine <ArrowRight className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  className="inline-flex min-h-14 items-center gap-3 rounded-full border border-white/15 bg-white/[.06] px-7 py-4 font-black backdrop-blur-xl transition hover:border-fuchsia-300/40 hover:bg-white/[.1]"
                >
                  <ShoppingCart className="h-4 w-4 text-fuchsia-300" />
                  Abrir sacola
                </button>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-2 text-center">
                {[
                  ["Tech", "celulares"],
                  ["Outlet", "achadinhos"],
                  ["Feed", "drops"],
                ].map(([strong, label]) => (
                  <div key={strong} className="rounded-2xl border border-white/10 bg-white/[.035] px-3 py-4 backdrop-blur">
                    <strong className="block text-lg font-black text-white">{strong}</strong>
                    <span className="mt-1 block text-[10px] font-bold uppercase tracking-[.14em] text-white/40">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[34rem] lg:min-h-[43rem]">
              <div className="absolute left-[12%] top-[10%] h-[72%] w-[70%] rounded-[4rem] border border-white/10 bg-white/[.04] shadow-[0_0_100px_rgba(36,120,255,.18)] backdrop-blur-2xl mega-float motion-safe:animate-[mega-float_6s_ease-in-out_infinite]" />
              <div className="absolute left-[19%] top-[16%] grid h-[60%] w-[56%] place-items-center overflow-hidden rounded-[3.5rem] border border-cyan-300/20 bg-[linear-gradient(145deg,#0b1424,#050812)] shadow-[0_0_80px_rgba(88,239,255,.16)]">
                <Smartphone className="h-48 w-48 text-cyan-300 drop-shadow-[0_0_35px_rgba(88,239,255,.5)] sm:h-56 sm:w-56" />
                <div className="absolute inset-5 rounded-[2.8rem] border border-white/10" />
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur">
                  <p className="text-[10px] font-black uppercase tracking-[.2em] text-cyan-300">do feed</p>
                  <p className="mt-1 text-lg font-black">Poco X5 Pro · 8/256</p>
                </div>
              </div>

              <div className="absolute right-[2%] top-[9%] w-48 rotate-3 rounded-[2rem] border border-fuchsia-300/20 bg-[#10091a]/85 p-5 shadow-[0_0_55px_rgba(255,61,191,.2)] backdrop-blur-xl transition hover:rotate-0 sm:w-56">
                <div className="grid aspect-square place-items-center rounded-2xl bg-fuchsia-400/[.08] text-fuchsia-300">
                  <ShoppingBag className="h-20 w-20" />
                </div>
                <p className="mt-4 text-[10px] font-black uppercase tracking-[.2em] text-fuchsia-300">outlet</p>
                <p className="mt-1 font-black">Dunk Low Pro</p>
              </div>

              <div className="absolute bottom-[7%] left-[1%] w-52 -rotate-3 rounded-[2rem] border border-yellow-300/20 bg-[#11110a]/90 p-5 shadow-[0_0_50px_rgba(248,234,75,.14)] backdrop-blur-xl transition hover:rotate-0">
                <BadgePercent className="h-9 w-9 text-yellow-300" />
                <p className="mt-4 text-[10px] font-black uppercase tracking-[.2em] text-yellow-300">drop rápido</p>
                <p className="mt-1 text-lg font-black">Achou? Consulte.</p>
                <p className="mt-2 text-xs leading-5 text-white/45">Estoque e valor confirmados antes do pedido.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="border-y border-white/10 bg-white/[.035] py-3">
          <div className="overflow-hidden whitespace-nowrap text-[10px] font-black uppercase tracking-[.22em] text-white/55">
            <div className="inline-flex min-w-full mega-marquee motion-safe:animate-[mega-marquee_22s_linear_infinite] motion-reduce:translate-x-0">
              {Array.from({ length: 2 }).map((_, group) => (
                <span key={group} className="inline-flex shrink-0 items-center gap-8 px-4">
                  {["smartphones", "outlet", "tênis", "bonés", "acessórios", "achadinhos", "novidades do feed"].map((item) => (
                    <span key={item} className="inline-flex items-center gap-8">
                      {item}
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>

        <section id="vitrine" className="relative px-5 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-[1500px]">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[.24em] text-cyan-300">Vitrine experimental</p>
                <h2 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-[.88] tracking-[-.045em] sm:text-7xl">
                  Do feed para uma loja que parece viva.
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/58">
                  Produtos vistos nas redes entram como referência editorial. Categorias complementares mostram como o catálogo pode crescer sem perder a identidade.
                </p>
              </div>
              <div className="max-w-md rounded-2xl border border-yellow-300/15 bg-yellow-300/[.05] p-4 text-xs leading-5 text-white/55">
                <strong className="text-yellow-200">Transparência da amostra:</strong> preço e estoque atuais não são presumidos. A equipe confirma antes da compra.
              </div>
            </div>

            <div className="mt-10 flex gap-2 overflow-x-auto pb-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={[
                    "shrink-0 rounded-full border px-4 py-2.5 text-xs font-black uppercase tracking-[.12em] transition",
                    category === item
                      ? "border-cyan-300 bg-cyan-300 text-[#04101d]"
                      : "border-white/10 bg-white/[.035] text-white/55 hover:border-white/25 hover:text-white",
                  ].join(" ")}
                >
                  {item}
                </button>
              ))}
            </div>

            <MotionStagger className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => {
                const inCart = cartIds.includes(product.id);
                return (
                  <article key={product.id} className="group rounded-[2.4rem] border border-white/10 bg-white/[.035] p-3 transition duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[.055]">
                    <ProductVisual product={product} />
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[.2em]" style={{ color: product.accent }}>
                            {product.kicker}
                          </p>
                          <h3 className="mt-2 text-2xl font-black leading-tight">{product.title}</h3>
                        </div>
                        <span className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[.12em] text-white/45">
                          {product.category}
                        </span>
                      </div>
                      <p className="mt-4 leading-7 text-white/55">{product.description}</p>

                      {product.historicalPrice && (
                        <div className="mt-5 rounded-2xl border border-cyan-300/15 bg-cyan-300/[.05] p-4">
                          <p className="text-[10px] font-black uppercase tracking-[.18em] text-cyan-300">preço da publicação histórica</p>
                          <p className="mt-1 text-2xl font-black">{product.historicalPrice}</p>
                          <p className="mt-1 text-xs leading-5 text-white/45">{product.historicalMeta}</p>
                        </div>
                      )}

                      {!product.historicalPrice && product.historicalMeta && (
                        <p className="mt-5 text-xs leading-5 text-white/45">{product.historicalMeta}</p>
                      )}

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
                        <div className="min-w-0">
                          <p className="truncate text-[10px] font-bold uppercase tracking-[.12em] text-white/35">{product.sourceLabel}</p>
                          <p className="mt-1 text-xs font-bold text-white/70">Valor atual sob consulta</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleCartProduct(product.id)}
                          className={[
                            "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-xs font-black transition",
                            inCart
                              ? "bg-white text-[#04101d]"
                              : "border border-white/15 bg-white/[.04] text-white hover:border-cyan-300/40 hover:bg-cyan-300/[.08]",
                          ].join(" ")}
                        >
                          {inCart ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                          {inCart ? "Na sacola" : "Adicionar"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </MotionStagger>
          </div>
        </section>

        <section id="outlet" className="relative overflow-hidden border-y border-white/10 bg-[#070816] px-5 py-20 lg:px-10 lg:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,61,191,.12),transparent_28%),radial-gradient(circle_at_78%_42%,rgba(248,234,75,.09),transparent_28%)]" />
          <div className="relative mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[.24em] text-fuchsia-300">Mega Outlet</p>
              <h2 className="mt-4 text-5xl font-black uppercase leading-[.86] tracking-[-.05em] sm:text-7xl">
                Um catálogo que acompanha o ritmo das redes.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/58">
                Em vez de fingir estoque fixo, a amostra trabalha com drops. Entrou no feed? Pode virar produto, coleção ou chamada de oportunidade.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CTA
                  service="Quero ver os itens atuais do outlet"
                  className="inline-flex min-h-14 items-center gap-3 rounded-full bg-fuchsia-400 px-7 py-4 font-black text-[#160716] transition hover:-translate-y-1 hover:bg-white"
                >
                  Ver outlet atual <ArrowRight className="h-4 w-4" />
                </CTA>
                <a href={links.instagram} target="_blank" rel="noreferrer" className="inline-flex min-h-14 items-center gap-3 rounded-full border border-white/15 px-6 py-4 font-black text-white/75 transition hover:border-white/30 hover:text-white">
                  <Instagram className="h-4 w-4" /> Instagram oficial
                </a>
              </div>
            </div>

            <div className="relative grid gap-4 sm:grid-cols-2">
              {[
                { icon: ShoppingBag, title: "Tênis", note: "Drops do feed", color: "#ff3dbf" },
                { icon: Tag, title: "Bonés", note: "Giro rápido", color: "#f8ea4b" },
                { icon: Store, title: "Calçados", note: "Seleção outlet", color: "#8eff62" },
                { icon: PackageOpen, title: "Achadinhos", note: "Entrou, apareceu", color: "#58efff" },
              ].map(({ icon: Icon, title, note, color }, index) => (
                <div
                  key={title}
                  className={[
                    "group relative min-h-56 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.04] p-6 transition duration-500 hover:-translate-y-2 hover:bg-white/[.07]",
                    index % 2 ? "sm:translate-y-8" : "",
                  ].join(" ")}
                >
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl" style={{ backgroundColor: color + "28" }} />
                  <Icon className="h-10 w-10" style={{ color }} />
                  <p className="mt-16 text-[10px] font-black uppercase tracking-[.2em] text-white/35">{note}</p>
                  <h3 className="mt-2 text-3xl font-black">{title}</h3>
                  <ChevronRight className="absolute bottom-6 right-6 h-5 w-5 text-white/35 transition group-hover:translate-x-1 group-hover:text-white" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="feed" className="px-5 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-[1500px]">
            <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[.24em] text-cyan-300">Produtos puxados das publicações</p>
                <h2 className="mt-4 text-5xl font-black uppercase leading-[.88] sm:text-7xl">
                  A rede social vira ponto de partida para o catálogo.
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-white/58">
                  A pesquisa pública encontrou duas ofertas concretas: Poco X5 Pro 8/256 e Dunk Low Pro. Elas entram como produtos editoriais da amostra, sempre com data e sem fingir que o estoque antigo continua disponível.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    tag: "25 jan 2024",
                    title: "Poco X5 Pro · 8GB RAM · 256GB",
                    note: "A publicação indexada anunciava de R$ 2.399,00 por R$ 1.899,00.",
                    accent: "text-cyan-300",
                  },
                  {
                    tag: "08 nov 2023",
                    title: "Tênis Dunk Low Pro",
                    note: "A publicação indexada anunciava grade de tamanhos, cartões e lojas físicas.",
                    accent: "text-fuchsia-300",
                  },
                ].map((post) => (
                  <article key={post.title} className="group grid gap-5 rounded-[2rem] border border-white/10 bg-white/[.035] p-6 transition hover:border-white/20 hover:bg-white/[.055] sm:grid-cols-[7rem_1fr_auto] sm:items-center">
                    <div>
                      <p className={`text-[10px] font-black uppercase tracking-[.18em] ${post.accent}`}>{post.tag}</p>
                      <p className="mt-1 text-xs text-white/35">post indexado</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-black">{post.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/50">{post.note}</p>
                    </div>
                    <a href={links.indexedFeed} target="_blank" rel="noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/50 transition group-hover:border-cyan-300/30 group-hover:text-cyan-300" aria-label={`Ver fonte pública de ${post.title}`}>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="lojas" className="border-y border-white/10 bg-white/[.025] px-5 py-20 lg:px-10">
          <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[.24em] text-cyan-300">Presença da marca</p>
              <h2 className="mt-4 text-4xl font-black uppercase leading-[.9] sm:text-6xl">
                Digital na vitrine. Presença física na história.
              </h2>
              <p className="mt-6 max-w-xl leading-7 text-white/55">
                O Linktree oficial lista SAC e frentes Centro Mega em São José dos Pinhais, Galeria Di Brunno, Shopping Cidade e Pinheirinho.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Outlet", "São José dos Pinhais"],
                ["Galeria Di Brunno", "Centro Mega"],
                ["Shopping Cidade", "Curitiba"],
                ["Pinheirinho", "Centro Mega"],
              ].map(([title, detail]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-[#060914] p-5">
                  <MapPin className="h-5 w-5 text-cyan-300" />
                  <p className="mt-4 font-black">{title}</p>
                  <p className="mt-1 text-sm text-white/40">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-5 py-20 lg:px-10 lg:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(36,120,255,.18),transparent_55%)]" />
          <div className="relative mx-auto max-w-[1500px] overflow-hidden rounded-[3rem] border border-white/10 bg-[linear-gradient(135deg,rgba(88,239,255,.1),rgba(255,61,191,.07),rgba(255,255,255,.03))] p-8 sm:p-12 lg:p-16">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border border-cyan-300/20 motion-safe:animate-[spin_18s_linear_infinite]" />
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[.24em] text-cyan-300">Fechar pedido</p>
                <h2 className="mt-4 max-w-5xl text-5xl font-black uppercase leading-[.86] tracking-[-.05em] sm:text-7xl">
                  Gostou da ideia? A sacola já sabe o que você escolheu.
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/55">
                  Monte a seleção e envie tudo de uma vez. A equipe confirma disponibilidade, valor atual e o melhor caminho de compra.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="inline-flex min-h-16 items-center justify-center gap-3 rounded-full bg-white px-8 py-5 font-black text-[#04101d] transition hover:-translate-y-1"
              >
                <ShoppingBag className="h-5 w-5" />
                Ver minha sacola
                {cart.length > 0 && <span className="rounded-full bg-fuchsia-500 px-2 py-0.5 text-xs text-white">{cart.length}</span>}
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#02040a] px-5 py-10 lg:px-10">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <PortfolioImage src="/images/centro-mega/logo.png" alt="Centro Mega" width={500} height={500} managedField="logoUrl" className="h-11 w-11 rounded-xl object-cover" />
              <div>
                <p className="font-black uppercase">Centro Mega</p>
                <p className="text-xs font-bold uppercase tracking-[.16em] text-cyan-300">Amostra de loja virtual</p>
              </div>
            </div>
            <p className="mt-5 max-w-xl text-sm leading-6 text-white/40">
              Produtos, preços e disponibilidade desta amostra devem ser confirmados pela equipe. Itens do feed histórico aparecem com data para não serem confundidos com estoque atual.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={links.instagram} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-4 text-sm font-black text-white/60 hover:text-white">
              <Instagram className="h-4 w-4" /> Instagram
            </a>
            <a href={links.facebook} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-4 text-sm font-black text-white/60 hover:text-white">
              <Facebook className="h-4 w-4" /> Facebook
            </a>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-[1500px]">
          <PortfolioHostCredit linkClassName="font-semibold text-white/55 underline underline-offset-4" />
        </div>
      </footer>

      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="fixed bottom-5 right-5 z-50 inline-flex min-h-14 items-center gap-3 rounded-full border border-white/10 bg-[#0b1324]/92 px-5 font-black text-white shadow-[0_16px_50px_rgba(0,0,0,.45)] backdrop-blur-2xl transition hover:-translate-y-1 sm:hidden"
      >
        <ShoppingBag className="h-5 w-5 text-cyan-300" />
        Sacola
        {cart.length > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-fuchsia-500 px-1 text-[10px]">{cart.length}</span>}
      </button>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onRemove={(id) => setCartIds((current) => current.filter((item) => item !== id))} />

      <PortfolioSocialProofPopup
        clientKey="centro-mega"
        eyebrow="Centro Mega · Store Concept"
        title="Do feed para uma loja virtual de verdade."
        description="Explore celulares, outlet e categorias que podem acompanhar o ritmo das publicações da marca."
        ctaLabel="Explorar vitrine"
        ctaHref="#vitrine"
        delayMs={11000}
        className="border-cyan-300/20 bg-[#07101f]/95 text-white"
        accentClassName="text-cyan-300"
      />
      <PortfolioUpsellPopup pageName="portfolio-centro-mega-store" />
    </div>
  );
}
