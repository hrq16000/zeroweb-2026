/**
 * /home2 — protótipo editorial da home 0WEB (comparação visual).
 *
 * Rota isolada: não altera `/`, não entra no menu global nem no sitemap e
 * fica `noindex,nofollow` enquanto for protótipo. Usa somente as primitives de
 * movimento já existentes (`GlobalMotionContract`) e dados reais do
 * repositório — nenhum número, depoimento ou prova é inventado.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import portfolioCatalog from "@/config/portfolio-catalog.json";
import heroDashboard from "@/assets/hero-dashboard.webp";
import { BrandLogo } from "@/components/site/BrandLogo";
import { Footer } from "@/components/site/Footer";
import { PortfolioCover } from "@/components/portfolio/PortfolioCover";
import {
  MotionCard,
  MotionChoreo,
  MotionCounter,
  MotionImageReveal,
  MotionParallax,
  MotionScope,
  MotionTextReveal,
} from "@/components/motion";

const TITLE = "0WEB · Protótipo editorial da home (home2)";
const DESC =
  "Protótipo interno de composição visual da home da 0WEB: criação de sites, presença digital e projetos publicados de clientes reais.";

export const Route = createFileRoute("/home2")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      // Protótipo: nunca indexar enquanto estiver em comparação visual.
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Home2Page,
});

/* ------------------------------------------------------------------ */
/* Dados reais, derivados do repositório (nada é digitado à mão).       */
/* ------------------------------------------------------------------ */

type CatalogItem = {
  slug: string;
  clientKey?: string;
  title: string;
  subtitle?: string;
  segment?: string;
  city?: string;
  state?: string;
  location?: string;
  status?: string;
  live?: boolean;
  image?: string;
  fallbackImage?: string;
};

const LIVE = (portfolioCatalog as CatalogItem[]).filter(
  (p) => p.status === "published" && p.live !== false && Boolean(p.slug),
);

const PUBLISHED_COUNT = LIVE.length;
const CITY_COUNT = new Set(LIVE.map((p) => p.city).filter(Boolean)).size;
const SEGMENT_COUNT = new Set(LIVE.map((p) => p.segment).filter(Boolean)).size;
const STATE_COUNT = new Set(LIVE.map((p) => p.state).filter(Boolean)).size;

/** Seleção determinística (SSR-safe): projetos com capa própria primeiro. */
const FEATURED = [...LIVE]
  .sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image)))
  .slice(0, 7);

const SOLUTIONS: Array<{
  n: string;
  to: string;
  title: string;
  text: string;
  span: string;
  tone: "light" | "dark" | "accent";
}> = [
  {
    n: "01",
    to: "/servicos/site-pro",
    title: "Sites que sustentam a operação",
    text: "Estrutura, velocidade e conteúdo pensados para o negócio ser encontrado, entendido e contratado.",
    span: "lg:col-span-7 lg:row-span-2",
    tone: "dark",
  },
  {
    n: "02",
    to: "/servicos/site-express",
    title: "Site express",
    text: "Presença publicada em pouco tempo, sem abrir mão de base técnica correta.",
    span: "lg:col-span-5",
    tone: "light",
  },
  {
    n: "03",
    to: "/servicos/google-meu-negocio",
    title: "Google Meu Negócio",
    text: "Ficha organizada, fotos, categorias e informações corretas para busca local.",
    span: "lg:col-span-5",
    tone: "accent",
  },
  {
    n: "04",
    to: "/servicos/trafego-pago",
    title: "Tráfego pago",
    text: "Campanhas ligadas a páginas preparadas para receber a visita — não a um link solto.",
    span: "lg:col-span-4",
    tone: "light",
  },
  {
    n: "05",
    to: "/servicos/presenca-digital",
    title: "Presença digital",
    text: "Site, mapa, redes e conteúdo falando a mesma língua sobre o mesmo negócio.",
    span: "lg:col-span-4",
    tone: "light",
  },
  {
    n: "06",
    to: "/servicos",
    title: "Catálogo completo",
    text: "Consultoria, marketplace, redes sociais e integrações sob medida.",
    span: "lg:col-span-4",
    tone: "dark",
  },
];

const KNOWLEDGE: Array<{ to: string; label: string; text: string }> = [
  { to: "/blog/sites", label: "Sites", text: "O que muda quando o site é construído para converter." },
  { to: "/blog/seo", label: "SEO", text: "Como aparecer para quem já procura o seu serviço." },
  { to: "/blog/marketing-local", label: "Marketing local", text: "Bairro, cidade e região como território de disputa." },
  { to: "/blog/trafego-pago", label: "Tráfego pago", text: "Investir em anúncio sem queimar verba." },
];

/* ------------------------------------------------------------------ */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
      {children}
    </span>
  );
}

/** Cabeçalho próprio do protótipo — não altera o Header global. */
function Home2Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-[86rem] items-center justify-between gap-4 px-5 py-4 lg:px-10">
        <Link to="/" className="flex items-center gap-3" aria-label="0WEB — início">
          <BrandLogo size={28} priority />
          <span className="hidden text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:block">
            Protótipo home2
          </span>
        </Link>
        <nav aria-label="Navegação do protótipo" className="flex items-center gap-5 text-sm">
          <Link to="/servicos" className="hidden text-muted-foreground transition-colors hover:text-foreground sm:block">
            Serviços
          </Link>
          <Link to="/portfolio" className="hidden text-muted-foreground transition-colors hover:text-foreground sm:block">
            Portfólio
          </Link>
          <Link to="/blog" className="hidden text-muted-foreground transition-colors hover:text-foreground md:block">
            Conteúdo
          </Link>
          <Link
            to="/contato"
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
          >
            Falar com a 0WEB
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background" aria-labelledby="home2-hero">
      <div className="mx-auto max-w-[86rem] px-5 pb-16 pt-14 lg:px-10 lg:pb-28 lg:pt-24">
        <MotionChoreo surface="root-editorial" role="signal">
          <Eyebrow>Estúdio digital · Curitiba e região</Eyebrow>
        </MotionChoreo>

        <div className="mt-8 grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h1
              id="home2-hero"
              className="font-display text-[clamp(2.6rem,9vw,7.2rem)] font-bold leading-[0.92] tracking-[-0.04em]"
            >
              <MotionTextReveal as="span" text="Presença digital" className="block" />
              <span className="block text-muted-foreground">
                <MotionTextReveal as="span" text="feita para ser" />{" "}
                <span className="text-foreground">encontrada.</span>
              </span>
            </h1>
          </div>

          <div className="lg:col-span-4 lg:pb-4">
            <MotionChoreo surface="root-editorial" role="answer">
              <p className="max-w-sm text-base leading-relaxed text-muted-foreground lg:text-lg">
                A 0WEB constrói sites, presença local e conteúdo para negócios que precisam ser
                achados por quem já está procurando — e atendidos sem atrito.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/contato"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  Começar um projeto
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/portfolio"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:bg-muted"
                >
                  Ver projetos no ar
                </Link>
              </div>
            </MotionChoreo>
          </div>
        </div>

        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <MotionImageReveal className="rounded-2xl border border-border">
              <MotionParallax speed={22}>
                <img
                  src={heroDashboard}
                  alt="Painel de acompanhamento de presença digital usado nos projetos da 0WEB"
                  width={1280}
                  height={720}
                  loading="eager"
                  decoding="async"
                  className="aspect-[16/9] w-full object-cover"
                />
              </MotionParallax>
            </MotionImageReveal>
          </div>
          <div className="lg:col-span-4">
            <MotionChoreo surface="root-editorial" role="instrument">
              <dl className="divide-y divide-border border-y border-border">
                <div className="flex items-baseline justify-between gap-4 py-4">
                  <dt className="text-sm text-muted-foreground">Projetos publicados</dt>
                  <dd className="font-display text-3xl font-bold tabular-nums">
                    <MotionCounter value={PUBLISHED_COUNT} />
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-4">
                  <dt className="text-sm text-muted-foreground">Cidades atendidas</dt>
                  <dd className="font-display text-3xl font-bold tabular-nums">
                    <MotionCounter value={CITY_COUNT} />
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-4">
                  <dt className="text-sm text-muted-foreground">Segmentos diferentes</dt>
                  <dd className="font-display text-3xl font-bold tabular-nums">
                    <MotionCounter value={SEGMENT_COUNT} />
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-muted-foreground">
                Contagem calculada a partir do catálogo de projetos publicados neste repositório.
              </p>
            </MotionChoreo>
          </div>
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="bg-foreground text-background" aria-labelledby="home2-manifesto">
      <div className="mx-auto max-w-[86rem] px-5 py-20 lg:px-10 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <MotionChoreo surface="root-editorial" role="tension">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] opacity-60">
                Posicionamento
              </span>
              <p className="mt-6 font-display text-5xl font-bold leading-none tracking-[-0.03em] opacity-20 lg:text-7xl">
                01
              </p>
            </MotionChoreo>
          </div>
          <div className="lg:col-span-8">
            <MotionChoreo surface="root-editorial" role="answer">
              <h2
                id="home2-manifesto"
                className="font-display text-[clamp(1.9rem,4.4vw,3.6rem)] font-bold leading-[1.05] tracking-[-0.03em]"
              >
                Site não é peça de decoração. É o lugar onde a decisão de compra acontece.
              </h2>
            </MotionChoreo>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <MotionChoreo surface="root-editorial" role="proof" delay={60}>
                <p className="text-base leading-relaxed opacity-80">
                  Cada projeto nasce com endereço próprio, identidade própria e um caminho de
                  contato que funciona de verdade. Nada é template recolorido.
                </p>
              </MotionChoreo>
              <MotionChoreo surface="root-editorial" role="proof" delay={140}>
                <p className="text-base leading-relaxed opacity-80">
                  O que entra na página precisa ser verificável: foto real, informação conferida,
                  serviço que o negócio realmente entrega.
                </p>
              </MotionChoreo>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Solutions() {
  return (
    <section className="border-b border-border bg-background" aria-labelledby="home2-solucoes">
      <div className="mx-auto max-w-[86rem] px-5 py-20 lg:px-10 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <MotionChoreo surface="root-editorial" role="signal">
            <Eyebrow>O que fazemos</Eyebrow>
            <h2
              id="home2-solucoes"
              className="mt-5 max-w-2xl font-display text-[clamp(1.9rem,4.6vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.03em]"
            >
              Serviços que se conectam, em vez de competirem entre si.
            </h2>
          </MotionChoreo>
          <Link
            to="/servicos"
            className="inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
          >
            Ver todos os serviços
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          {SOLUTIONS.map((s, i) => (
            <MotionCard key={s.to + s.n} index={i} className={s.span}>
              <Link
                to={s.to}
                className={`group flex h-full min-h-[13rem] flex-col justify-between rounded-2xl border p-7 transition-transform duration-300 hover:-translate-y-1 lg:p-9 ${
                  s.tone === "dark"
                    ? "border-transparent bg-foreground text-background"
                    : s.tone === "accent"
                      ? "border-transparent bg-primary text-primary-foreground"
                      : "border-border bg-card text-card-foreground"
                }`}
              >
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] opacity-60">
                  {s.n}
                </span>
                <span className="mt-10 block">
                  <span className="block font-display text-2xl font-bold leading-tight tracking-[-0.02em] lg:text-3xl">
                    {s.title}
                  </span>
                  <span className="mt-3 block max-w-md text-sm leading-relaxed opacity-80">{s.text}</span>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                    Conhecer
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </Link>
            </MotionCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function Evidence() {
  return (
    <section className="bg-muted/30" aria-labelledby="home2-evidencia">
      <div className="mx-auto max-w-[86rem] px-5 py-16 lg:px-10 lg:py-20">
        <MotionChoreo surface="root-editorial" role="signal">
          <Eyebrow>Experiência verificável</Eyebrow>
          <h2 id="home2-evidencia" className="sr-only">
            Experiência verificável
          </h2>
        </MotionChoreo>
        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {[
            { v: PUBLISHED_COUNT, l: "sites de clientes no ar em /portfolio" },
            { v: CITY_COUNT, l: "cidades com projeto publicado" },
            { v: STATE_COUNT, l: "estados no catálogo" },
            { v: SEGMENT_COUNT, l: "segmentos de negócio atendidos" },
          ].map((item, i) => (
            <MotionCard key={item.l} index={i} className="bg-background">
              <div className="h-full p-7 lg:p-9">
                <p className="font-display text-5xl font-bold tabular-nums tracking-[-0.04em] lg:text-6xl">
                  <MotionCounter value={item.v} />
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.l}</p>
              </div>
            </MotionCard>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Todos os números são contados automaticamente a partir dos projetos publicados. Nenhuma
          métrica de resultado é estimada ou projetada.
        </p>
      </div>
    </section>
  );
}

function Showcase() {
  const [lead, ...rest] = FEATURED;
  if (!lead) return null;
  return (
    <section className="border-y border-border bg-background" aria-labelledby="home2-projetos">
      <div className="mx-auto max-w-[86rem] px-5 py-20 lg:px-10 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <MotionChoreo surface="root-editorial" role="signal">
            <Eyebrow>Projetos no ar</Eyebrow>
            <h2
              id="home2-projetos"
              className="mt-5 max-w-2xl font-display text-[clamp(1.9rem,4.6vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.03em]"
            >
              Sites de clientes reais, publicados e visitáveis agora.
            </h2>
          </MotionChoreo>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
          >
            Ver o portfólio completo
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <MotionChoreo surface="root-editorial" role="showcase" className="lg:col-span-7">
            <Link
              to="/portfolio/$slug"
              params={{ slug: lead.slug }}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border"
            >
              <div className="min-h-0 flex-1 overflow-hidden">
                <PortfolioCover
                  slug={lead.slug}
                  clientKey={lead.clientKey}
                  title={lead.title}
                  image={lead.image}
                  fallbackImage={lead.fallbackImage}
                  width={1120}
                  height={720}
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="aspect-[4/3] h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-wrap items-end justify-between gap-4 p-6 lg:p-8">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    {lead.location ?? [lead.city, lead.state].filter(Boolean).join(" — ")}
                  </p>
                  <p className="mt-2 font-display text-2xl font-bold tracking-[-0.02em] lg:text-3xl">
                    {lead.title}
                  </p>
                  {lead.subtitle ? (
                    <p className="mt-1 text-sm text-muted-foreground">{lead.subtitle}</p>
                  ) : null}
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-semibold">
                  Abrir
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          </MotionChoreo>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
            {rest.map((p, i) => (
              <MotionCard key={p.slug} index={i}>
                <Link
                  to="/portfolio/$slug"
                  params={{ slug: p.slug }}
                  className="group block h-full overflow-hidden rounded-2xl border border-border"
                >
                  <div className="overflow-hidden">
                    <PortfolioCover
                      slug={p.slug}
                      clientKey={p.clientKey}
                      title={p.title}
                      image={p.image}
                      fallbackImage={p.fallbackImage}
                      width={560}
                      height={420}
                      sizes="(max-width: 640px) 100vw, 22vw"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-4">
                    <p className="truncate font-display text-base font-semibold tracking-[-0.01em]">
                      {p.title}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {p.city ? `${p.city}${p.state ? ` — ${p.state}` : ""}` : (p.segment ?? "Projeto publicado")}
                    </p>
                  </div>
                </Link>
              </MotionCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Trust() {
  const items = [
    {
      n: "02",
      t: "Cada cliente com endereço próprio",
      d: `São ${PUBLISHED_COUNT} projetos publicados em /portfolio, cada um com identidade, conteúdo e caminho de contato próprios.`,
      to: "/portfolio",
      cta: "Conferir os projetos",
    },
    {
      n: "03",
      t: "Contato que chega a quem atende",
      d: "O pedido feito na página do cliente é registrado e encaminhado ao atendimento do próprio negócio — nunca a um número genérico.",
      to: "/servicos",
      cta: "Como trabalhamos",
    },
    {
      n: "04",
      t: "Conteúdo aberto, sem caixa-preta",
      d: "Publicamos o raciocínio por trás das decisões de site, busca local e anúncios para você cobrar resultado com critério.",
      to: "/blog",
      cta: "Ler o conteúdo",
    },
  ];
  return (
    <section className="bg-foreground text-background" aria-labelledby="home2-confianca">
      <div className="mx-auto max-w-[86rem] px-5 py-20 lg:px-10 lg:py-28">
        <MotionChoreo surface="root-editorial" role="tension">
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] opacity-60">
            Por que confiar
          </span>
          <h2
            id="home2-confianca"
            className="mt-5 max-w-3xl font-display text-[clamp(1.9rem,4.6vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.03em]"
          >
            Em vez de depoimento fabricado, evidência que você pode abrir e conferir.
          </h2>
        </MotionChoreo>

        <div className="mt-12 divide-y divide-background/15 border-y border-background/15">
          {items.map((item, i) => (
            <MotionCard key={item.n} index={i}>
              <Link
                to={item.to}
                className="group grid gap-4 py-8 transition-opacity hover:opacity-90 lg:grid-cols-12 lg:items-baseline lg:py-10"
              >
                <span className="font-display text-2xl font-bold opacity-40 lg:col-span-1">{item.n}</span>
                <span className="font-display text-2xl font-bold leading-tight tracking-[-0.02em] lg:col-span-4 lg:text-3xl">
                  {item.t}
                </span>
                <span className="text-base leading-relaxed opacity-75 lg:col-span-5">{item.d}</span>
                <span className="inline-flex items-center gap-2 text-sm font-semibold lg:col-span-2 lg:justify-end">
                  {item.cta}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </MotionCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function Knowledge() {
  return (
    <section className="bg-background" aria-labelledby="home2-conteudo">
      <div className="mx-auto max-w-[86rem] px-5 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <MotionChoreo surface="root-editorial" role="signal">
              <Eyebrow>Conhecimento</Eyebrow>
              <h2
                id="home2-conteudo"
                className="mt-5 font-display text-[clamp(1.8rem,4vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em]"
              >
                O que estudamos antes de propor qualquer coisa.
              </h2>
              <Link
                to="/blog"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
              >
                Ir para o blog
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </MotionChoreo>
          </div>
          <div className="lg:col-span-8">
            <div className="divide-y divide-border border-y border-border">
              {KNOWLEDGE.map((k, i) => (
                <MotionCard key={k.to} index={i}>
                  <Link
                    to={k.to}
                    className="group flex flex-wrap items-baseline justify-between gap-4 py-6 transition-colors hover:text-primary"
                  >
                    <span className="w-32 shrink-0 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      {k.label}
                    </span>
                    <span className="flex-1 font-display text-xl font-semibold tracking-[-0.01em] lg:text-2xl">
                      {k.text}
                    </span>
                    <ArrowUpRight
                      className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </MotionCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="border-t border-border bg-primary text-primary-foreground" aria-labelledby="home2-cta">
      <div className="mx-auto max-w-[86rem] px-5 py-24 lg:px-10 lg:py-36">
        <MotionChoreo surface="root-editorial" role="closing">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] opacity-70">
            Próximo passo
          </p>
          <h2
            id="home2-cta"
            className="mt-6 max-w-5xl font-display text-[clamp(2.2rem,7vw,5.6rem)] font-bold leading-[0.95] tracking-[-0.04em]"
          >
            Vamos colocar o seu negócio no ar do jeito certo.
          </h2>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/contato"
              className="inline-flex min-h-14 items-center gap-2 rounded-full bg-background px-8 text-base font-semibold text-foreground transition-transform hover:-translate-y-0.5"
            >
              Falar com a 0WEB
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex min-h-14 items-center gap-2 rounded-full border border-primary-foreground/40 px-8 text-base font-semibold transition-colors hover:bg-primary-foreground/10"
            >
              Ver projetos publicados
            </Link>
          </div>
        </MotionChoreo>
      </div>
    </section>
  );
}

function Home2Page() {
  return (
    <MotionScope intensity="EXPRESSIVE">
      <div className="min-h-screen overflow-x-clip bg-background">
        <Home2Header />
        <main>
          <Hero />
          <Manifesto />
          <Solutions />
          <Evidence />
          <Showcase />
          <Trust />
          <Knowledge />
          <FinalCta />
        </main>
        <Footer />
      </div>
    </MotionScope>
  );
}
