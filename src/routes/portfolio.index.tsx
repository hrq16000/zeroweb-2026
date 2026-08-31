import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
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
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { FloatingFunnelCTA } from "@/components/funnel/FloatingFunnelCTA";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { InternalLinkCluster } from "@/components/site/InternalLinkCluster";
import { getIpGeo } from "@/lib/geo-location";
import portfolioCatalog from "@/config/portfolio-catalog.json";
import { PORTFOLIO_SEGMENTS, portfolioClusterLinks, placesForSegment, portfolioComboPath } from "@/lib/portfolio-clusters";
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

const CATEGORIES = [
  { id: "todos", label: "Todos os Projetos" },
  { id: "beleza", label: "Beleza & Estética" },
  { id: "saude", label: "Saúde & Clínicas" },
  { id: "servicos", label: "Serviços & Negócios Locais" },
  { id: "juridico", label: "Advocacia & Consultoria" },
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
    summary: "Landing page estruturada para captar pedidos de pequenos reparos, instalações e manutenção residencial por cidade e bairro.",
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
    summary: "Página publicada para apresentar a operação de divulgação da D.Y.Z Promo, com cobertura por bairros e contato direto para orçamento.",
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
    summary: "Experiência editorial para apresentar criações artesanais, ocasiões especiais e orçamento personalizado.",
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
    summary: "Landing page direta para pedidos de frete e carreto, com orçamento guiado e atendimento local em Curitiba e região.",
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
    summary: "Catálogo interativo com montagem do pedido, adicionais, escolha de entrega ou retirada e envio organizado pelo WhatsApp.",
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
    summary: "Landing page oficial criada para a inauguração do novo espaço físico, com visual fiel ao flyer original, mapa e agendamento instantâneo.",
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
    summary: "Versão com estética de alta costura, slider interativo de antes e depois, e tipografia cinética para posicionamento premium.",
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
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
    tags: ["Agendamento Online", "SEO Local", "Google Meu Negócio"],
    metrics: "Projeto publicado",
    summary: "Estrutura completa com páginas de procedimentos, depoimentos em vídeo e captação de pacientes para tratamentos de alto ticket.",
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
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    tags: ["Provimento 205 OAB", "Artigos Jurídicos", "Formulário LGPD"],
    metrics: "Projeto publicado",
    summary: "Site institucional sóbrio e moderno com autoridade técnica, artigos que ranqueiam no Google e conformidade ética total.",
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
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    tags: ["Cardápio Interativo", "Sem Taxas de iFood", "Google Maps"],
    metrics: "Projeto publicado",
    summary: "Página leve com carregamento em menos de 1 segundo, cardápio direto no celular e integração com pedidos no WhatsApp.",
  },
];

// O registro canônico controla identidade e descoberta; estes campos visuais
// históricos serão migrados para o catálogo no ciclo de conteúdo.
type LegacyItem = (typeof LEGACY_PORTFOLIO_ITEMS)[number];
type CatalogItem = (typeof portfolioCatalog)[number];
type PortfolioItem = Partial<LegacyItem> &
  CatalogItem & { id: string; slug: string; category: string; image?: string };

const PORTFOLIO_ITEMS: PortfolioItem[] = portfolioCatalog
  .map((canonical) => {
    const legacy = LEGACY_PORTFOLIO_ITEMS.find(
      (item) => item.slug === `/portfolio/${canonical.slug}`,
    ) as Partial<LegacyItem> | undefined;
    return {
      ...(legacy ?? {}),
      ...canonical,
      id: canonical.slug,
      slug: `/portfolio/${canonical.slug}`,
      category: canonical.segment,
    } as PortfolioItem;
  })
  .filter((item) => Boolean(item.image));


type PortfolioSearch = {
  segment?: string;
  q?: string;
  sort?: string;
  type?: string;
};

export const Route = createFileRoute("/portfolio/")({
  validateSearch: (search: Record<string, unknown>): PortfolioSearch => {
    const parsed: PortfolioSearch = {};
    if (typeof search.segment === "string") parsed.segment = search.segment;
    if (typeof search.q === "string") parsed.q = search.q;
    if (typeof search.sort === "string") parsed.sort = search.sort;
    if (typeof search.type === "string") parsed.type = search.type;
    return parsed;
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
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
            url: URL,
            name: TITLE,
            description: DESC,
            inLanguage: "pt-BR",
            isPartOf: { "@id": `${SITE_URL}/#organization` },
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
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const routeSearch = Route.useSearch();
  const [activeCategory, setActiveCategory] = useState(routeSearch.segment ?? "todos");
  const [search, setSearch] = useState(routeSearch.q ?? "");
  const [sort, setSort] = useState(routeSearch.sort ?? "recent");
  const [projectType, setProjectType] = useState(routeSearch.type ?? "todos");
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [visitorCity, setVisitorCity] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    let active = true;
    void getIpGeo().then((geo) => {
      if (active && geo?.city) setVisitorCity(geo.city);
    });
    return () => { active = false; };
  }, []);

  const filteredItems = useMemo(() => {
    const query = deferredSearch.trim().toLocaleLowerCase("pt-BR");
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

    return PORTFOLIO_ITEMS.filter(
      (item) =>
        (activeCategory === "todos" || item.category === activeCategory) &&
        (projectType === "todos" || item.projectType === projectType) &&
        `${item.title} ${item.subtitle ?? ""} ${item.location ?? ""} ${item.tags.join(" ")}`
          .toLocaleLowerCase("pt-BR")
          .includes(query),
    ).sort((a, b) => {
      if (sort === "az") return a.title.localeCompare(b.title, "pt-BR");
      return locationScore(b.location) - locationScore(a.location);
    });
  }, [activeCategory, deferredSearch, projectType, sort, visitorCity]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory !== "todos") params.set("segment", activeCategory);
    if (search) params.set("q", search);
    if (sort !== "recent") params.set("sort", sort);
    if (projectType !== "todos") params.set("type", projectType);
    window.history.replaceState(null, "", `${window.location.pathname}${params.toString() ? `?${params}` : ""}`);
    setVisibleCount(6);
  }, [activeCategory, search, sort, projectType]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisibleCount((count) => Math.min(count + 6, filteredItems.length));
    }, { rootMargin: "320px" });
    observer.observe(target);
    return () => observer.disconnect();
  }, [filteredItems.length]);

  const selectedItem = selectedIndex === null ? null : filteredItems[selectedIndex];

  useEffect(() => {
    if (!selectedItem) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowRight") setSelectedIndex((current) => current === null ? null : (current + 1) % filteredItems.length);
      if (event.key === "ArrowLeft") setSelectedIndex((current) => current === null ? null : (current - 1 + filteredItems.length) % filteredItems.length);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKeyDown); };
  }, [selectedItem, filteredItems.length]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      <Header />
      
      <main className="flex-1 pt-16 lg:pt-20">
        {/* Breadcrumbs */}
        <div className="border-b border-border/40 bg-muted/20">
          <div className="container max-w-6xl mx-auto px-4 py-3">
            <Breadcrumbs items={[{ name: "Portfólio", path: "/portfolio" }]} />
          </div>
        </div>

        {/* Hero Showcase */}
        <section className="py-10 sm:py-14 px-4 bg-gradient-to-b from-muted/30 via-background to-background relative overflow-hidden">
          <div className="container max-w-6xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Vitrine Oficial 0WEB
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
              Do Zero à Web: Projetos que transformam <span className="text-primary underline decoration-primary/30 underline-offset-8">visitas em clientes reais.</span>
            </h1>

            <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto">
              Veja landing pages e portfólios desenvolvidos com design moderno, SEO de alta performance e integração direta para faturar no WhatsApp.
            </p>

            {/* CTA neutro: o catálogo não privilegia nenhum cliente. */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <FunnelCTAButton label="Quero Meu Site em 24h" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-semibold px-6 py-3.5 shadow-glow-primary hover:opacity-95 transition-opacity shadow-lg" />
              <a href="#catalogo" className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border text-foreground hover:border-primary hover:text-primary text-sm font-semibold transition-all">
                Explorar o catálogo <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="py-4 sm:py-6 px-4 border-y border-border/40 bg-card sticky top-16 lg:top-20 z-30 shadow-xs backdrop-blur-md">
          <div className="container max-w-6xl mx-auto flex items-center justify-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-sm scale-105"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Projects Showcase Grid */}
        <section id="catalogo" className="py-16 px-4">
          <div className="container max-w-6xl mx-auto space-y-12">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row"><label className="relative flex-1"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por serviço, cidade ou tecnologia" aria-label="Buscar projetos do portfólio" className="h-12 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-sm outline-none transition-shadow focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30" /></label><select aria-label="Filtrar por tipo de projeto" value={projectType} onChange={(e) => setProjectType(e.target.value)} className="h-12 rounded-2xl border border-border bg-card px-4 text-sm text-foreground"><option value="todos">Todos os tipos</option><option value="landing">Landing pages</option><option value="catalog">Catálogos</option><option value="institutional">Institucionais</option></select><select aria-label="Ordenar projetos" value={sort} onChange={(e) => setSort(e.target.value)} className="h-12 rounded-2xl border border-border bg-card px-4 text-sm text-foreground"><option value="recent">Mais recentes</option><option value="az">Nome (A–Z)</option></select><p aria-live="polite" className="flex items-center rounded-2xl bg-muted/50 px-4 text-sm text-muted-foreground">{filteredItems.length} resultados</p></div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Resumo do catálogo">
              <div className="rounded-2xl border border-border/60 bg-card p-4"><p className="text-2xl font-bold">{PORTFOLIO_ITEMS.length}</p><p className="mt-1 text-xs text-muted-foreground">projetos catalogados</p></div>
              <div className="rounded-2xl border border-border/60 bg-card p-4"><p className="text-2xl font-bold">{CATEGORIES.length - 1}</p><p className="mt-1 text-xs text-muted-foreground">segmentos</p></div>
              <div className="rounded-2xl border border-border/60 bg-card p-4"><p className="text-2xl font-bold">{PORTFOLIO_ITEMS.filter((item) => item.live).length}</p><p className="mt-1 text-xs text-muted-foreground">sites publicados</p></div>
              <div className="rounded-2xl border border-border/60 bg-card p-4"><p className="text-2xl font-bold">Atualizado</p><p className="mt-1 text-xs text-muted-foreground">mais recentes primeiro</p></div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              <AnimatePresence>
                {filteredItems.slice(0, visibleCount).map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="group rounded-2xl bg-card border border-border/60 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col"
                  >
                    {/* Card Media Preview */}
                    <button type="button" onClick={() => setSelectedIndex(filteredItems.findIndex((entry) => entry.id === item.id))} className="relative block h-36 w-full overflow-hidden bg-muted text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-primary sm:h-44 lg:h-40" aria-label={`Abrir preview de ${item.title}`}>
                      <img 
                        src={item.image} 
                        alt={item.title}
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={index === 0 ? "high" : "auto"}
                        sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, (max-width: 1279px) 25vw, 16vw"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          if (item.fallbackImage) {
                            (e.target as HTMLImageElement).src = item.fallbackImage;
                          }
                        }}
                      />
                      
                      <div className="absolute top-2 left-2 flex items-center gap-2">
                        <span className="px-2 py-1 rounded-full bg-background/90 backdrop-blur-md text-foreground text-[10px] font-bold shadow-sm">
                          {item.badge}
                        </span>
                      </div>

                      <div className="absolute bottom-2 right-2">
                        <span className="px-2 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold shadow-md">
                          {item.metrics}
                        </span>
                      </div>
                    </button>

                    {/* Card Content */}
                    <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider line-clamp-2">
                            {item.subtitle}
                          </span>
                          <span className="hidden text-[10px] text-muted-foreground sm:inline">{item.location}</span>
                        </div>

                        <button type="button" onClick={() => setSelectedIndex(filteredItems.findIndex((entry) => entry.id === item.id))} className="text-left text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </button>

                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                          {item.summary}
                        </p>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {item.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 rounded-lg bg-muted text-muted-foreground text-[10px] font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-2">
                        <Link 
                          to={item.slug}
                          className="inline-flex items-center gap-1 text-primary font-bold text-xs hover:underline"
                        >
                          Ver site <ExternalLink className="w-4 h-4" />
                        </Link>

                        <FunnelCTAButton label="Pedir igual" showArrow={false} className="inline-flex min-h-9 items-center rounded-full border border-primary/30 text-primary font-semibold px-2.5 py-1.5 text-[10px] hover:bg-primary/10 transition-colors" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {visibleCount < filteredItems.length ? <><div ref={loadMoreRef} className="h-2" aria-hidden="true" /><button type="button" onClick={() => setVisibleCount((count) => Math.min(count + 6, filteredItems.length))} className="mx-auto flex min-h-11 items-center rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:border-primary hover:text-primary">Carregar mais</button></> : null}

            {/* Banner Callout for Custom Sites */}
            <div className="rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 sm:p-12 text-center space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" /> Entrega em Tempo Recorde
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Quer um site profissional e vendedor para o seu negócio?
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
                Cuidamos do design, dos textos persuasivos, da configuração do Google e do botão de WhatsApp para o seu negócio começar a receber contatos imediatamente.
              </p>
              <div className="pt-2">
                <FunnelCTAButton label="Solicitar Proposta sem Compromisso" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-semibold px-6 py-3.5 shadow-glow-primary hover:opacity-95 transition-opacity shadow-lg" />
              </div>
            </div>

            {/* Silo programático: segmento × bairro */}
            <section aria-labelledby="silo-title" className="space-y-6">
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
            </section>

            <InternalLinkCluster
              links={portfolioClusterLinks({ segmentSlug: "beleza-estetica", limit: 10 })}
              title="Hubs, serviços e guias relacionados"
              description="Links internos automáticos que conectam portfólio, serviços e conteúdo."
            />


          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
      <FloatingFunnelCTA />
      <PortfolioUpsellPopup pageName="portfolio-index" />
      {selectedItem && selectedIndex !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/85 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-labelledby="portfolio-preview-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedIndex(null); }}>
          <div className="relative flex h-[min(92vh,860px)] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-background shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3 sm:px-6">
              <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wider text-primary">Site dentro do portfólio</p><h2 id="portfolio-preview-title" className="truncate text-lg font-bold sm:text-xl">{selectedItem.title}</h2></div>
              <button type="button" onClick={() => setSelectedIndex(null)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-muted text-foreground hover:bg-muted/70" aria-label="Fechar preview"><X className="h-5 w-5" /></button>
            </div>
            <div className="relative min-h-0 flex-1 bg-muted">
              {selectedItem.live ? (
                <iframe key={selectedItem.slug} src={`${selectedItem.slug}?preview=1&v=20260826`} title={`Preview de ${selectedItem.title}`} referrerPolicy="no-referrer" className="h-full w-full border-0" />
              ) : null}
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-border/60 px-4 py-3 sm:px-6">
              <button type="button" onClick={() => setSelectedIndex((selectedIndex - 1 + filteredItems.length) % filteredItems.length)} className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"><ChevronLeft className="h-4 w-4" /> Anterior</button>
              <span className="text-xs text-muted-foreground">{selectedIndex + 1} de {filteredItems.length}</span>
              <button type="button" onClick={() => setSelectedIndex((selectedIndex + 1) % filteredItems.length)} className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted">Próximo <ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
