import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  ExternalLink,
  ArrowRight,
  Eye,
  CheckCircle2,
  Layers,
  Zap,
  Globe,
  Phone,
  ShieldCheck,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  PackageCheck,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { FloatingFunnelCTA } from "@/components/funnel/FloatingFunnelCTA";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { PortfolioShareButton } from "@/components/site/PortfolioShareButton";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { InternalLinkCluster } from "@/components/site/InternalLinkCluster";
import { portfolioCityHubs } from "@/lib/portfolio-places";
import { getIpGeo } from "@/lib/geo-location";
import portfolioCatalog from "@/config/portfolio-catalog.json";
import portfolioCoverPlan from "@/config/portfolio-cover-plan.json";
import { listPublishedManagedProjects } from "@/lib/portfolio-managed.functions";
import type { ManagedProject } from "@/lib/portfolio-managed";
import { resolvePortfolioAssets } from "@/lib/portfolio-assets";
import { getProjectManifest } from "@/lib/portfolio-project-lifecycle";
import { searchItems } from "@/lib/portfolio-search";
import { MotionCard, MotionChoreo, MotionOverlay, MotionScope, MotionSwap } from "@/components/motion";
import {
  trackPortfolioSearch,
  trackPortfolioSearchClick,
} from "@/lib/portfolio-search-tracking";

import {
  PORTFOLIO_SEGMENTS,
  PORTFOLIO_PLACES,
  portfolioClusterLinks,
  placesForSegment,
  portfolioComboPath,
} from "@/lib/portfolio-clusters";
import {
  SITE_URL,
  breadcrumbNode,
  graph,
  itemListNode,
  localBusinessNode,
  organizationNode,
  serviceNode,
} from "@/lib/portfolio-seo";

const TITLE = "Portfólio & Vitrine de Sites · Projetos Reais Criados pela 0WEB";
const DESC =
  "Explore nossa galeria de sites, landing pages de alta conversão e sistemas desenvolvidos pela 0WEB para negócios locais, clínicas, beleza e serviços em todo o Brasil.";
const URL = "https://0web.com.br/portfolio";
const NATIONAL_GUIDE_PLACES = PORTFOLIO_PLACES.filter((place) =>
  ["São José dos Pinhais", "Curitiba", "Araucária", "Belo Horizonte", "Pinhais"].includes(
    place.city,
  ),
).slice(0, 12);

const SEGMENT_LABELS: Record<string, string> = {
  agencias: "Agências",
  beleza: "Beleza & estética",
  comercios: "Comércios",
  construcao: "Construção & reforma",
  juridico: "Jurídico",
  "prestadores-de-servicos": "Prestadores de serviços",
  restaurantes: "Alimentação",
  saude: "Saúde",
  servicos: "Serviços",
};

// A navegação nasce exclusivamente dos segmentos efetivamente cadastrados no
// catálogo canônico; nenhum ramo aparece apenas como hipótese editorial.
const CATEGORIES = [
  { id: "todos", label: "Todos os Projetos" },
  ...Array.from(new Set(portfolioCatalog.map((item) => item.segment)))
    .sort((a, b) => (SEGMENT_LABELS[a] ?? a).localeCompare(SEGMENT_LABELS[b] ?? b, "pt-BR"))
    .map((id) => ({ id, label: SEGMENT_LABELS[id] ?? id.replace(/-/g, " ") })),
];

const LEGACY_PORTFOLIO_ITEMS = [
  {
    id: "marido-de-aluguel",
    live: true,
    slug: "/portfolio/marido-de-aluguel",
    category: "servicos",
    title: "Mestre dos Serviços",
    subtitle: "Reparos Residenciais & Manutenção",
    location: "Curitiba e região — PR",
    badge: "Projeto publicado",
    image: "/images/mestre-dos-servicos-logo.jpg",
    tags: ["Reparos", "Instalações", "Manutenção Local"],
    metrics: "SEO local",
    summary:
      "Landing page estruturada para captar pedidos de pequenos reparos, instalações e manutenção residencial por cidade e bairro.",
  },
  {
    id: "dyzpromo",
    live: true,
    slug: "/portfolio/dyzpromo",
    category: "servicos",
    title: "D.Y.Z Promo",
    subtitle: "Divulgação, Panfletagem & Ações Promocionais",
    location: "Curitiba e região — PR",
    badge: "Cliente 0WEB",
    image: "/images/dyzpromo/faixa-equipe.jpeg",
    tags: ["Panfletagem", "Ações de Rua", "Brindes", "Marketing Promocional"],
    metrics: "Presença local",
    summary:
      "Página publicada para apresentar a operação de divulgação da D.Y.Z Promo, com cobertura por bairros e contato direto para orçamento.",
  },
  {
    id: "emporio-lelecute",
    live: true,
    slug: "/portfolio/emporio-lelecute",
    category: "servicos",
    title: "Empório LeleCute",
    subtitle: "Lembrancinhas Artesanais & Presentes Personalizados",
    location: "São José dos Pinhais — PR",
    badge: "Projeto publicado",
    image: "/images/emporio-lelecute-og.webp",
    tags: ["Sabonetes", "Mini-velas", "Casamentos", "Presentes"],
    metrics: "Catálogo local",
    summary:
      "Experiência editorial para apresentar criações artesanais, ocasiões especiais e orçamento personalizado.",
  },
  {
    id: "rm-fretes",
    live: true,
    slug: "/portfolio/rm-fretes",
    category: "servicos",
    title: "RM Fretes",
    subtitle: "Fretes, Carretos & Pequenas Mudanças",
    location: "Curitiba e Região Metropolitana — PR",
    badge: "Projeto publicado",
    image: "/images/rm-fretes-hero.webp",
    tags: ["Fretes", "Carretos", "Mudanças", "Orçamento rápido"],
    metrics: "Orçamento por funil",
    summary:
      "Landing page direta para pedidos de frete e carreto, com orçamento guiado e atendimento local em Curitiba e região.",
  },

  {
    id: "paraiso-do-hot-dog",
    live: true,
    slug: "/portfolio/paraiso-do-hot-dog",
    category: "servicos",
    title: "Paraíso do Hot Dog",
    subtitle: "Pedidos Online · Hot Dogs, Pastéis & Porções",
    location: "São José dos Pinhais — PR",
    badge: "Projeto real",
    image: "/images/paraiso-hot-dog-cover.webp",
    tags: ["Cardápio Online", "Entrega", "Retirada", "WhatsApp"],
    metrics: "Pedido funcional",
    summary:
      "Catálogo interativo com montagem do pedido, adicionais, escolha de entrega ou retirada e envio organizado pelo WhatsApp.",
  },
  {
    id: "renata-beauty",
    live: true,
    slug: "/portfolio/renata-beauty",
    category: "beleza",
    title: "Renata Beauty Studio (Versão Oficial)",
    subtitle: "Lash Designer, Unhas de Fibra & Estética",
    location: "Boneca do Iguaçu — PR",
    badge: "Promoção R$ 100",
    image: "/images/volume-egipcio-fios-w.jpg",
    fallbackImage: "/images/r-beauty-cilios.jpg",
    tags: ["Volume Egípcio", "Unhas de Fibra", "WhatsApp Direct", "Design Dark Luxury"],
    metrics: "+300% cliques no WhatsApp",
    summary:
      "Landing page oficial criada para a inauguração do novo espaço físico, com visual fiel ao flyer original, mapa e agendamento instantâneo.",
  },
  {
    id: "r_beauty",
    live: true,
    slug: "/portfolio/r_beauty",
    category: "beleza",
    title: "R_Beauty Studio & Spa (Versão Editorial)",
    subtitle: "Haute Esthetics & Cuidados VIP",
    location: "Boneca do Iguaçu — PR",
    badge: "Design Editorial",
    image: "/images/r-beauty-cilios.jpg",
    tags: ["Tipografia Cinética", "Comparador Antes/Depois", "Champagne Gold"],
    metrics: "Experiência VIP",
    summary:
      "Versão com estética de alta costura, slider interativo de antes e depois, e tipografia cinética para posicionamento premium.",
  },
  {
    id: "clinica-sorriso",
    live: true,
    slug: "/portfolio/clinica-integrada",
    category: "saude",
    title: "Clínica Integrada de Saúde",
    subtitle: "Odontologia, Harmonização & Implantes",
    location: "Curitiba — PR",
    badge: "Projeto publicado",
    image:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
    tags: ["Agendamento Online", "SEO Local", "Google Meu Negócio"],
    metrics: "Projeto publicado",
    summary:
      "Estrutura completa com páginas de procedimentos, depoimentos em vídeo e captação de pacientes para tratamentos de alto ticket.",
  },
  {
    id: "advocacia-pro",
    live: true,
    slug: "/portfolio/almeida-torres",
    category: "juridico",
    title: "Escritório de Advocacia & Consultoria",
    subtitle: "Direito Empresarial, Trabalhista e Previdenciário",
    location: "São Paulo — SP",
    badge: "Projeto publicado",
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    tags: ["Provimento 205 OAB", "Artigos Jurídicos", "Formulário LGPD"],
    metrics: "Projeto publicado",
    summary:
      "Site institucional sóbrio e moderno com autoridade técnica, artigos que ranqueiam no Google e conformidade ética total.",
  },
  {
    id: "restaurante-express",
    live: true,
    slug: "/portfolio/casa-nativa",
    category: "servicos",
    title: "Bistrô & Gastronomia Artesanal",
    subtitle: "Cardápio Digital, Reservas & Delivery",
    location: "Belo Horizonte — MG",
    badge: "Projeto publicado",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    tags: ["Cardápio Interativo", "Sem Taxas de iFood", "Google Maps"],
    metrics: "Projeto publicado",
    summary:
      "Página leve com carregamento em menos de 1 segundo, cardápio direto no celular e integração com pedidos no WhatsApp.",
  },
];

// O registro canônico controla identidade e descoberta; estes campos visuais
// históricos serão migrados para o catálogo no ciclo de conteúdo.
type LegacyItem = (typeof LEGACY_PORTFOLIO_ITEMS)[number];
type CatalogItem = (typeof portfolioCatalog)[number];
type PortfolioItem = Partial<LegacyItem> &
  CatalogItem & {
    id: string;
    slug: string;
    category: string;
    image?: string;
    objectPosition?: string;
  };

// Capas curadas: recorte 16:10 gerado do asset do próprio cliente, com focal point.
const COVER_PLAN = (portfolioCoverPlan as {
  projects: Record<string, { focal?: { x: number; y: number } }>;
}).projects;

function coverFor(slug: string) {
  const planned = COVER_PLAN[slug];
  if (!planned) return null;
  const focal = planned.focal ?? { x: 0.5, y: 0.5 };
  return {
    image: `/images/${slug}/capa-card.jpg`,
    objectPosition: `${Math.round(focal.x * 100)}% ${Math.round(focal.y * 100)}%`,
  };
}

const PORTFOLIO_ITEMS: PortfolioItem[] = portfolioCatalog.map((canonical) => {
  const legacy = LEGACY_PORTFOLIO_ITEMS.find(
    (item) => item.slug === `/portfolio/${canonical.slug}`,
  ) as Partial<LegacyItem> | undefined;
  const assetConfig = resolvePortfolioAssets(canonical.slug);
  return {
    ...(legacy ?? {}),
    ...canonical,
    id: canonical.slug,
    slug: `/portfolio/${canonical.slug}`,
    category: canonical.segment,
    image:
      coverFor(canonical.slug)?.image ??
      canonical.image ??
      assetConfig?.socialImage ??
      assetConfig?.icon ??
      "/og-default.jpg",
    objectPosition: coverFor(canonical.slug)?.objectPosition,
    fallbackImage:
      canonical.fallbackImage ?? assetConfig?.icon ?? assetConfig?.socialImage ?? "/og-default.jpg",
    /**
     * PORTFOLIO_EMBED_GATE (adendo de autonomia §24–§26): o visualizador do
     * catálogo precisa abrir toda página que já tem rota própria funcionando.
     * Projeto gerenciado em `ready` (ainda não publicado) também é embutível —
     * sem isso o card abre um modal vazio, classificado como P0.
     */
    live:
      canonical.live ??
      (canonical.status === "published" ||
        ["ready", "published"].includes(getProjectManifest(canonical.slug)?.stage ?? "")),
  } as PortfolioItem;
});

type PortfolioSearch = {
  segment?: string;
  ramo?: string;
  q?: string;
  sort?: string;
  type?: string;
};

export const Route = createFileRoute("/portfolio/")({
  // Projetos criados pelo painel entram no catálogo sem edição de JSON.
  loader: async () => {
    try {
      const managed = await listPublishedManagedProjects();
      return { managed };
    } catch {
      return { managed: [] as ManagedProject[] };
    }
  },
  validateSearch: (search: Record<string, unknown>): PortfolioSearch => {
    const parsed: PortfolioSearch = {};
    if (typeof search.segment === "string") parsed.segment = search.segment;
    if (typeof search.ramo === "string") parsed.ramo = search.ramo;
    if (typeof search.q === "string") parsed.q = search.q;
    if (typeof search.sort === "string") parsed.sort = search.sort;
    if (typeof search.type === "string") parsed.type = search.type;
    return parsed;
  },
  head: ({ match }: any) => {
    const query = typeof match?.search?.q === "string" ? match.search.q.trim().slice(0, 60) : "";
    const TITLE_Q = query ? `${query} — projetos no portfólio da 0WEB` : TITLE;
    const DESC_Q = query
      ? `Resultados para "${query}" no portfólio da 0WEB: sites de clientes reais, com serviços de criação de site, SEO local e landing pages.`
      : DESC;
    return {
    meta: [
      { title: TITLE_Q },
      { name: "description", content: DESC_Q },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { property: "og:title", content: TITLE_Q },
      { property: "og:description", content: DESC_Q },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { property: "og:image", content: "https://0web.com.br/og-default.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://0web.com.br/og-default.jpg" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: graph([
          organizationNode(),
          localBusinessNode(),
          {
            "@type": "CollectionPage",
            "@id": `${URL}#collection`,
            url: query ? `${URL}?q=${encodeURIComponent(query)}` : URL,
            name: TITLE_Q,
            description: DESC_Q,
            inLanguage: "pt-BR",
            isPartOf: { "@id": `${SITE_URL}/#organization` },
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${URL}?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          },
          ...PORTFOLIO_SEGMENTS.map((s) => serviceNode(s)),
          itemListNode(
            `${URL}#projetos`,
            "Projetos publicados pela 0WEB",
            PORTFOLIO_ITEMS.map((i) => ({ url: `https://0web.com.br${i.slug}`, name: i.title })),
          ),
          breadcrumbNode([
            { name: "Início", path: "/" },
            { name: "Portfólio", path: "/portfolio" },
          ]),
        ]),
      },
    ],
    };
  },
  component: PortfolioPage,
});

function PortfolioPage() {
  const routeSearch = Route.useSearch();
  const [activeCategory, setActiveCategory] = useState(routeSearch.segment ?? "todos");
  const [activeBranch, setActiveBranch] = useState(routeSearch.ramo ?? "todos");
  const [search, setSearch] = useState(routeSearch.q ?? "");
  const { managed } = Route.useLoaderData();
  const catalogItems = useMemo<PortfolioItem[]>(
    () => [
      ...PORTFOLIO_ITEMS,
      ...managed.map((project) => ({
        slug: `/portfolio/${project.slug}`,
        clientKey: project.clientKey,
        title: project.displayName,
        segment: project.segment || "servicos",
        projectType: "site",
        status: "published",
        city: project.city,
        state: project.state,
        tags: [] as string[],
        live: true,
        subtitle: project.summary,
        location: [project.city, project.state].filter(Boolean).join(" — "),
        image: project.catalogCoverUrl || project.socialImage || "/og-default.jpg",
        fallbackImage: project.socialImage || "/og-default.jpg",
        id: project.slug,
        category: project.segment || "servicos",
      })) as unknown as PortfolioItem[],
    ],
    [managed],
  );
  const [sort, setSort] = useState(routeSearch.sort ?? "recent");
  const [projectType, setProjectType] = useState(routeSearch.type ?? "todos");
  const [region, setRegion] = useState("todas");
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [visitorCity, setVisitorCity] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const deferredSearch = useDeferredValue(search);
  const availableRegions = useMemo(
    () =>
      Array.from(
        new Set(
          catalogItems.map((item) => item.location?.trim()).filter(
            (location): location is string => Boolean(location),
          ),
        ),
      ).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [catalogItems],
  );

  useEffect(() => {
    let active = true;
    void getIpGeo().then((geo) => {
      if (active && geo?.city) setVisitorCity(geo.city);
    });
    return () => {
      active = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const query = deferredSearch.trim();
    const city = visitorCity
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");
    const locationScore = (location?: string) =>
      city &&
      location
        ?.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("pt-BR")
        .includes(city)
        ? 1
        : 0;

    const recencyById = new Map(catalogItems.map((item, index) => [item.id, index]));
    const base = catalogItems.filter(
      (item) =>
        (activeCategory === "todos" || item.category === activeCategory) &&
        (activeBranch === "todos" || item.tags.includes(activeBranch)) &&
        (projectType === "todos" || item.projectType === projectType) &&
        (region === "todas" || item.location === region),
    );

    // Busca por intenção: "lanche", "pastel", "pedreiro" etc. encontram o
    // projeto certo mesmo sem a palavra exata. A ordem por relevância só vale
    // quando há busca; sem busca mantemos a ordenação escolhida.
    const found = searchItems(query, base);
    if (query && sort !== "az") return found;

    return [...found].sort((a, b) => {
      if (sort === "az") return a.title.localeCompare(b.title, "pt-BR");
      const proximity = locationScore(b.location) - locationScore(a.location);
      if (proximity !== 0) return proximity;

      // O catálogo canônico é append-only: o último registro publicado é o
      // mais recente. Sem este desempate, a tela dizia “Mais recentes”, mas
      // preservava a ordem antiga e escondia clientes novos atrás do load-more.
      return (recencyById.get(b.id) ?? -1) - (recencyById.get(a.id) ?? -1);
    });
  }, [activeBranch, activeCategory, catalogItems, deferredSearch, projectType, region, sort, visitorCity]);

  // Mede quem chega ao portfólio por busca ("pastel", "lanche", ...). Espera o
  // usuário parar de digitar para não contar termos incompletos.
  const resultCount = filteredItems.length;
  useEffect(() => {
    const term = deferredSearch.trim();
    if (term.length < 3) return;
    const timer = window.setTimeout(() => trackPortfolioSearch(term, resultCount), 900);
    return () => window.clearTimeout(timer);
  }, [deferredSearch, resultCount]);




  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory !== "todos") params.set("segment", activeCategory);
    if (activeBranch !== "todos") params.set("ramo", activeBranch);
    if (search) params.set("q", search);
    if (sort !== "recent") params.set("sort", sort);
    if (projectType !== "todos") params.set("type", projectType);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${params.toString() ? `?${params}` : ""}`,
    );
    setVisibleCount(12);
  }, [activeBranch, activeCategory, search, sort, projectType, region]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting)
          setVisibleCount((count) => Math.min(count + 6, filteredItems.length));
      },
      { rootMargin: "320px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [filteredItems.length]);

  const selectedItem = selectedIndex === null ? null : filteredItems[selectedIndex];
  const hasActiveFilters = Boolean(search || activeCategory !== "todos" || activeBranch !== "todos" || projectType !== "todos" || region !== "todas");
  const clearFilters = () => {
    setSearch("");
    setRegion("todas");
    setActiveCategory("todos");
    setActiveBranch("todos");
    setProjectType("todos");
    setSort("recent");
  };

  /**
   * Alcance real do embed: quantos visitantes da vitrine chegam a abrir o
   * site do cliente dentro do iframe. `location` carrega o slug porque o
   * `path` desta página é sempre /portfolio — sem isso a métrica não teria
   * a quem ser atribuída. Nenhum dado pessoal é enviado.
   */
  useEffect(() => {
    if (!selectedItem?.live) return;
    trackEvent("portfolio_embed_open", {
      location: selectedItem.slug,
      label: "portfolio_viewer",
      event_category: "portfolio",
    });
  }, [selectedItem?.live, selectedItem?.slug]);



  useEffect(() => {
    if (!selectedItem) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowRight")
        setSelectedIndex((current) =>
          current === null ? null : (current + 1) % filteredItems.length,
        );
      if (event.key === "ArrowLeft")
        setSelectedIndex((current) =>
          current === null ? null : (current - 1 + filteredItems.length) % filteredItems.length,
        );
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedItem, filteredItems.length]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      <Header />

      <MotionScope intensity="SUBTLE">
      <main className="flex-1 pt-20">
        {/* Breadcrumbs */}
        <div className="border-b border-border/40 bg-muted/20">
          <div className="container mx-auto max-w-6xl px-4 py-2">
            <Breadcrumbs compact items={[{ name: "Portfólio", path: "/portfolio" }]} />
          </div>
        </div>

        {/* Cabeçalho editorial da galeria */}
        <MotionChoreo surface="catalog-showcase" role="header"><section className="border-b border-border bg-muted/30 px-4 py-7 sm:py-9">
          <div className="mx-auto max-w-[1500px]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-primary">
                  <Sparkles className="h-4 w-4" /> Galeria comercial 0WEB
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                  Sites reais para conhecer, comparar e divulgar.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                  Explore negócios por segmento e região. Cada projeto reúne presença digital e
                  divulgação própria.
                </p>
              </div>
              <FunnelCTAButton
                label="Quero uma presença completa"
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-opacity hover:opacity-90"
              />
            </div>

            <div className="mt-6 grid max-w-3xl grid-cols-3 gap-2 sm:gap-3" aria-label="Resumo do catálogo">
              {[[String(portfolioCatalog.length), "projetos publicados"], [String(CATEGORIES.length - 1), "segmentos ativos"], ["100%", "com CTA e presença"]].map(([value, label]) => <div key={label} className="rounded-xl border border-border/70 bg-card/70 px-3 py-3 sm:px-4"><strong className="block text-lg font-black text-foreground sm:text-2xl">{value}</strong><span className="mt-1 block text-[10px] font-semibold uppercase tracking-[.12em] text-muted-foreground sm:text-xs">{label}</span></div>)}
            </div>

          </div>
        </section></MotionChoreo>

        {/* Projects Showcase Grid */}
        <section id="catalogo" className="bg-background px-4 py-8 sm:py-10">
          <div className="mx-auto max-w-[1500px] space-y-8">
            <div className="sticky top-16 z-30 rounded-2xl border border-border bg-card/95 p-2.5 shadow-soft backdrop-blur-md sm:p-3 lg:top-20">
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
                <label className="relative min-w-0 flex-1 lg:flex-[2]">
                  <Search
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground lg:left-4"
                    aria-hidden="true"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Busque por negócio, serviço, cidade ou bairro"
                    aria-label="Buscar projetos do portfólio"
                    className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 lg:h-12 lg:rounded-xl lg:pl-11 lg:pr-4 lg:text-base"
                  />
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:items-center lg:gap-3">
                  <select
                    aria-label="Filtrar por segmento"
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="h-9 truncate rounded-lg border border-border bg-background px-2.5 text-xs text-foreground sm:h-10 sm:text-sm lg:h-12 lg:min-w-44 lg:rounded-xl lg:px-4"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.id === "todos" ? "Todos os segmentos" : cat.label}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Filtrar por tipo de presença"
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="h-9 truncate rounded-lg border border-border bg-background px-2.5 text-xs text-foreground sm:h-10 sm:text-sm lg:h-12 lg:min-w-44 lg:rounded-xl lg:px-4"
                  >
                    <option value="todos">Todos os tipos</option>
                    <option value="landing">Landing pages</option>
                    <option value="catalog">Catálogos</option>
                    <option value="institutional">Institucionais</option>
                  </select>
                  <select
                    aria-label="Filtrar por região"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="h-9 truncate rounded-lg border border-border bg-background px-2.5 text-xs text-foreground sm:h-10 sm:text-sm lg:h-12 lg:min-w-48 lg:rounded-xl lg:px-4"
                  >
                    <option value="todas">Todas as regiões</option>
                    {availableRegions.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Ordenar projetos"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="h-9 truncate rounded-lg border border-border bg-background px-2.5 text-xs text-foreground sm:h-10 sm:text-sm lg:h-12 lg:rounded-xl lg:px-4"
                  >
                    <option value="recent">Mais recentes</option>
                    <option value="az">Nome (A–Z)</option>
                  </select>
                  {hasActiveFilters ? (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="h-9 rounded-lg px-2 text-xs font-semibold text-primary hover:bg-primary/10 sm:h-10 sm:text-sm lg:h-12 lg:px-3"
                    >
                      Limpar
                    </button>
                  ) : null}
                </div>
              </div>
              {hasActiveFilters ? (
                <div className="flex flex-wrap items-center gap-2 px-1 pt-2 text-xs text-muted-foreground" aria-live="polite">
                  <span className="font-semibold text-foreground">Filtros ativos:</span>
                  {activeCategory !== "todos" ? <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">{SEGMENT_LABELS[activeCategory] ?? activeCategory}</span> : null}
                  {activeBranch !== "todos" ? <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">{activeBranch}</span> : null}
                  {projectType !== "todos" ? <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">{projectType}</span> : null}
                  {region !== "todas" ? <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">{region}</span> : null}
                  {search ? <span className="max-w-[16rem] truncate rounded-full bg-primary/10 px-2.5 py-1 text-primary">“{search}”</span> : null}
                </div>
              ) : null}
            </div>

            <MotionSwap
              swapKey={`${deferredSearch}|${activeCategory}|${activeBranch}|${projectType}|${region}|${sort}`}
              variant="up"
            >
              <div>
                <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
                  {filteredItems.length}{" "}
                  {filteredItems.length === 1 ? "projeto encontrado" : "projetos encontrados"}
                </p>


                {filteredItems.length === 0 ? (
                  <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
                    <div>
                      <Search className="mx-auto h-8 w-8 text-muted-foreground" />
                      <h2 className="mt-4 text-xl font-bold">Nenhum projeto encontrado</h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Limpe a busca ou escolha outra região e segmento.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setRegion("todas");
                          setActiveCategory("todos");
                          setActiveBranch("todos");
                          setProjectType("todos");
                        }}
                        className="mt-5 min-h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
                      >
                        Limpar filtros
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-x-4 gap-y-7 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    <>
                      {filteredItems.slice(0, visibleCount).map((item, index) => (
                        <MotionCard key={item.id} index={index}>
                        <div
                          className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-soft focus-within:-translate-y-1 focus-within:border-primary/50 focus-within:shadow-soft motion-reduce:transform-none motion-reduce:transition-none"
                        >
                          {/* Card Media Preview */}
                          <button
                            type="button"
                            onClick={() => {
                              trackPortfolioSearchClick({
                                rawTerm: deferredSearch,
                                slug: item.slug,
                                position: index + 1,
                                target: "preview",
                              });
                              setSelectedIndex(
                                filteredItems.findIndex((entry) => entry.id === item.id),
                              );
                            }}
                            className="relative block aspect-[16/10] w-full overflow-hidden bg-muted text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-primary"
                            aria-label={`Abrir preview de ${item.title}`}
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              loading={index === 0 ? "eager" : "lazy"}
                              decoding="async"
                              fetchPriority={index === 0 ? "high" : "auto"}
                              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
                              style={
                                item.objectPosition
                                  ? { objectPosition: item.objectPosition }
                                  : undefined
                              }
                              className="h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.03]"
                              onError={(e) => {
                                if (item.fallbackImage) {
                                  (e.target as HTMLImageElement).src = item.fallbackImage;
                                }
                              }}
                            />

                            {/* A imagem contextual nunca atua sozinha como capa: cada card
                                recebe identificação editorial legível do próprio projeto. */}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/12 to-transparent" />

                            <div className="absolute top-2 left-2 flex items-center gap-2">
                              <span className="px-2 py-1 rounded-full bg-background/90 backdrop-blur-md text-foreground text-[10px] font-bold shadow-sm">
                                {item.badge}
                              </span>
                            </div>
                            <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                              <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-white/80 line-clamp-1">
                                {item.category.replace(/-/g, " ")}
                              </span>
                              <strong className="mt-1 block text-sm leading-tight drop-shadow-sm line-clamp-2">
                                {item.title}
                              </strong>
                            </div>
                          </button>

                          {/* Card Content */}
                          <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-3">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-wider line-clamp-2">
                                  {item.subtitle}
                                </span>
                                <span className="shrink-0 text-right text-[10px] text-muted-foreground">
                                  {item.location}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedIndex(
                                    filteredItems.findIndex((entry) => entry.id === item.id),
                                  )
                                }
                                className="text-left text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2"
                              >
                                {item.title}
                              </button>

                              <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                {item.summary}
                              </p>

                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {item.tags.slice(0, 3).map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 rounded-lg bg-muted text-muted-foreground text-[10px] font-medium"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
                              <Link
                                to={item.slug}
                                onClick={() =>
                                  trackPortfolioSearchClick({
                                    rawTerm: deferredSearch,
                                    slug: item.slug,
                                    position: index + 1,
                                    target: "site",
                                  })
                                }
                                className="inline-flex min-h-10 items-center gap-1 text-primary font-bold text-xs hover:underline"
                              >
                                Ver site <ExternalLink className="w-4 h-4" />
                              </Link>

                              <PortfolioShareButton
                                placement="inline"
                                slug={item.id}
                                siteName={item.title}
                                label="Copiar divulgação"
                                className="border border-border bg-muted text-muted-foreground hover:border-primary hover:text-primary"
                              />
                            </div>
                          </div>
                        </div>
                        </MotionCard>
                      ))}
                    </>
                  </div>
                )}
              </div>
            </MotionSwap>
            {visibleCount < filteredItems.length ? (
              <>
                <div ref={loadMoreRef} className="h-2" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((count) => Math.min(count + 12, filteredItems.length))
                  }
                  className="mx-auto flex min-h-11 items-center rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:border-primary hover:text-primary"
                >
                  Carregar mais projetos
                </button>
              </>
            ) : null}

            {/* Banner Callout for Custom Sites */}
            <MotionChoreo surface="catalog-showcase" role="callout">
            <div className="rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 sm:p-12 text-center space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" /> Entrega em Tempo Recorde
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Quer um site profissional e vendedor para o seu negócio?
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
                Cuidamos do design, dos textos persuasivos, da configuração do Google e do botão de
                WhatsApp para o seu negócio começar a receber contatos imediatamente.
              </p>
              <div className="pt-2">
                <FunnelCTAButton
                  label="Solicitar Proposta sem Compromisso"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-semibold px-6 py-3.5 shadow-glow-primary hover:opacity-95 transition-opacity shadow-lg"
                />
              </div>
            </div>
            </MotionChoreo>

            {/* Silo programático: segmento × bairro */}
            {NATIONAL_GUIDE_PLACES.length > 0 && (
              <section
                aria-labelledby="regional-guide-title"
                className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">
                      Guia comercial regional
                    </p>
                    <h2
                      id="regional-guide-title"
                      className="mt-2 text-2xl sm:text-3xl font-bold text-foreground"
                    >
                      Guia comercial nacional por região
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      Explore ramos, cidades e bairros atendidos pela 0WEB. Cada região abre seu
                      próprio catálogo de negócios e projetos próximos.
                    </p>
                  </div>
                  <Link
                    to="/areas-de-atendimento"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    Explorar todas as regiões <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {NATIONAL_GUIDE_PLACES.map((place) => (
                    <Link
                      key={place.slug}
                      to={portfolioComboPath("servicos-locais", place.slug)}
                      className="rounded-2xl border border-border bg-card p-4 transition hover:border-primary/50 hover:shadow-soft"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                        {place.state} · {place.region}
                      </span>
                      <span className="mt-2 block font-semibold text-foreground">{place.name}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {place.city} · guia por ramo
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
            <MotionChoreo surface="catalog-showcase" role="silo"><section aria-labelledby="silo-title" className="space-y-6">
              <h2 id="silo-title" className="text-2xl sm:text-3xl font-bold text-foreground">
                Criação de sites por segmento e bairro
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {PORTFOLIO_SEGMENTS.map((seg) => (
                  <div key={seg.slug} className="rounded-2xl border border-border/60 bg-card p-6">
                    <h3 className="text-lg font-bold text-foreground">{seg.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{seg.keyword}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {placesForSegment(seg, 8).map((place) => (
                        <li key={place.slug}>
                          <Link
                            to={portfolioComboPath(seg.slug, place.slug)}
                            className="inline-block rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            {place.name} — {place.city}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section></MotionChoreo>

            <MotionChoreo surface="catalog-showcase" role="places"><section className="mt-12" aria-labelledby="portfolio-por-local">
              <h2 id="portfolio-por-local" className="text-xl font-semibold text-foreground">
                Projetos por cidade e bairro
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Páginas regionais com os sites publicados em cada local.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {portfolioCityHubs().map((hub) => (
                  <li key={hub.slug}>
                    <Link
                      to="/portfolio-em/$local"
                      params={{ local: hub.slug }}
                      className="inline-flex rounded-full border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary/50"
                    >
                      {hub.label} ({hub.projects.length})
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/portfolio-em"
                    className="inline-flex rounded-full border border-primary/40 px-3 py-1.5 text-sm text-primary"
                  >
                    Ver todos os locais
                  </Link>
                </li>
              </ul>
            </section></MotionChoreo>

            <InternalLinkCluster
              links={portfolioClusterLinks({ segmentSlug: "beleza-estetica", limit: 10 })}
              title="Hubs, serviços e guias relacionados"
              description="Links internos automáticos que conectam portfólio, serviços e conteúdo."
            />

          </div>
        </section>
      </main>
      </MotionScope>

      <Footer />
      <WhatsAppFloat />
      <FloatingFunnelCTA />
      <PortfolioUpsellPopup pageName="portfolio-index" />
      {selectedItem && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/85 p-3 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-preview-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedIndex(null);
          }}
        >
          <MotionOverlay className="relative flex h-[min(92vh,860px)] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-background shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3 sm:px-6">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Site dentro do portfólio
                </p>
                <h2 id="portfolio-preview-title" className="truncate text-lg font-bold sm:text-xl">
                  {selectedItem.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-muted text-foreground hover:bg-muted/70"
                aria-label="Fechar preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <MotionSwap
              swapKey={selectedItem.slug}
              variant="fade"
              className="relative min-h-0 flex-1 bg-muted"
            >
              {selectedItem.live ? (
                <iframe
                  key={selectedItem.slug}
                  src={`${selectedItem.slug}?preview=1&v=20260826`}
                  title={`Preview de ${selectedItem.title}`}
                  referrerPolicy="no-referrer"
                  className="h-full w-full border-0"
                />
              ) : null}
            </MotionSwap>
            <div className="flex items-center justify-between gap-3 border-t border-border/60 px-4 py-3 sm:px-6">
              <button
                type="button"
                onClick={() =>
                  setSelectedIndex(
                    (selectedIndex - 1 + filteredItems.length) % filteredItems.length,
                  )
                }
                className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
              >
                <ChevronLeft className="h-4 w-4" /> Anterior
              </button>
              <span className="text-xs text-muted-foreground">
                {selectedIndex + 1} de {filteredItems.length}
              </span>
              <button
                type="button"
                onClick={() => setSelectedIndex((selectedIndex + 1) % filteredItems.length)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Próximo <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </MotionOverlay>
        </div>
      )}
    </div>
  );
}
