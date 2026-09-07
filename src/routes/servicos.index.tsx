import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useTransition } from "react";
import { ArrowRight, Sparkles, Search, AlertCircle } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { Skeleton } from "@/components/ui/skeleton";
import { absUrl, ORIGIN, breadcrumbLd, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { SERVICES } from "@/lib/services-data";

import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import {
  SITE_EXPRESS_FAQ_KEYS,
  normalizeFaqKey,
} from "@/lib/site-express-faq";

const SERVICE_LIST = Object.values(SERVICES);

type ServicosSearch = { q?: string; cat?: string; sort?: SortKey; page?: number };

export const Route = createFileRoute("/servicos/")({
  validateSearch: (raw: Record<string, unknown>): ServicosSearch => {
    const q = typeof raw.q === "string" ? raw.q.slice(0, 100) : undefined;
    const cat = typeof raw.cat === "string" ? raw.cat.slice(0, 60) : undefined;
    const sortRaw = typeof raw.sort === "string" ? raw.sort : undefined;
    const sort: SortKey | undefined =
      sortRaw === "shop" || sortRaw === "recent" || sortRaw === "alpha" || sortRaw === "relevance"
        ? sortRaw
        : undefined;
    const pageNum = Number(raw.page);
    const page = Number.isFinite(pageNum) && pageNum >= 1 ? Math.floor(pageNum) : undefined;
    return { q, cat, sort, page };
  },
  head: () => {
    const url = absUrl("/servicos");
    const title = "Serviços da 0WEB · Sites, SEO, IA, Marketing Digital e Sistemas";
    const desc =
      "Catálogo completo de serviços da 0WEB: criação de sites, landing pages, e-commerce, SEO, marketing digital, automação com IA, chatbot WhatsApp, SaaS e sistemas web sob medida.";

    // FAQ agregado: exclui perguntas que já pertencem ao Site Express,
    // que terão seu próprio FAQPage dedicado no mesmo @graph.
    const seenQ = new Set<string>(SITE_EXPRESS_FAQ_KEYS);
    const faqItems: { q: string; a: string }[] = [];
    for (const s of SERVICE_LIST) {
      if (s.slug === "site-express") continue; // tratado separadamente
      for (const f of s.faq ?? []) {
        const key = normalizeFaqKey(f.q);
        if (seenQ.has(key)) continue;
        seenQ.add(key);
        faqItems.push(f);
        if (faqItems.length >= 20) break;
      }
      if (faqItems.length >= 20) break;
    }

    const itemList = {
      "@type": "ItemList",
      "@id": `${url}#services`,
      name: "Serviços 0WEB",
      numberOfItems: SERVICE_LIST.length,
      itemListElement: SERVICE_LIST.map((s, i) => {
        const sUrl = absUrl(`/servicos/${s.slug}`);
        const sId = `${sUrl}#service`;
        return {
          "@type": "ListItem",
          position: i + 1,
          url: sUrl,
          item: {
            "@type": "Service",
            "@id": sId,
            name: s.name,
            serviceType: s.serviceType,
            description: s.description,
            category: s.category,
            url: sUrl,
            areaServed: { "@type": "Country", name: "Brasil" },
            provider: { "@id": `${ORIGIN}/#org` },
          },
        };
      }),
    };

    // FAQPage do Site Express vive na página dedicada do produto
    // (/servicos/site-express) para evitar duplicar schema FAQ entre URLs.


    // FAQPage agregado dos demais serviços (sem duplicar Site Express)
    const aggregatedFaqPage = faqItems.length
      ? {
          "@type": "FAQPage",
          "@id": `${url}#faq-servicos`,
          name: "Perguntas sobre os demais serviços",
          inLanguage: "pt-BR",
          isPartOf: { "@id": url },
          mainEntity: faqItems.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

    const graph: unknown[] = [
      {
        "@type": "CollectionPage",
        "@id": url,
        url,
        name: title,
        description: desc,
        inLanguage: "pt-BR",
        isPartOf: { "@type": "WebSite", "@id": `${ORIGIN}/#website` },
        publisher: { "@id": `${ORIGIN}/#org` },
        about: SERVICE_LIST.map((s) => ({ "@type": "Service", name: s.name })),
        mainEntity: { "@id": `${url}#services` },
      },
      breadcrumbLd([{ name: "Serviços", path: "/servicos" }]),
      itemList,

    ];
    if (aggregatedFaqPage) graph.push(aggregatedFaqPage);

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "keywords", content: "serviços digitais, criação de sites, SEO, marketing digital, automação IA, chatbot WhatsApp, e-commerce, landing page, 0WEB" },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "0WEB" },
        { property: "og:locale", content: "pt_BR" },
        { property: "og:image", content: DEFAULT_OG_IMAGE },
        { property: "og:image:alt", content: "Catálogo de serviços da 0WEB" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: DEFAULT_OG_IMAGE },
        { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "pt-BR", href: url },
        { rel: "alternate", hrefLang: "x-default", href: url },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
        },
      ],
    };
  },
  loader: async () => {
    const { listServicesPublic } = await import("@/lib/services-public.functions");
    const { services: allServices } = await listServicesPublic();
    // /servicos é uma loja: produto publicado precisa ter capa e preço.
    // Soluções e cadastros incompletos ficam fora da vitrine até serem preparados.
    const services = allServices.filter((s) => {
      const galleryCover = s.gallery.find((g) => Boolean(g.url));
      // A capa pode estar no campo principal, na galeria ou no OG próprio.
      // O OG nunca deve ser substituído por imagem de outro produto/blog.
      const hasImage = Boolean(s.imageUrl || galleryCover?.url || s.ogImageUrl);
      const hasPrice = typeof s.price === "number" && s.price > 0;
      return !s.isSolution && hasImage && hasPrice;
    });
    return { services };
  },
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center p-8 text-center">
      <div>
        <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
        <h1 className="mt-4 text-2xl font-bold">Não foi possível carregar o catálogo</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <Link to="/" className="mt-4 inline-block text-primary underline">Voltar ao início</Link>
      </div>
    </div>
  ),
  component: ServicosHub,
});

type SortKey = "shop" | "recent" | "alpha" | "relevance";

function ServicosHub() {
  const { services } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/servicos" });
  type Svc = (typeof services)[number];
  const [q, setQ] = useState(search.q ?? "");
  const [page, setPage] = useState(search.page ?? 1);
  const [sort, setSort] = useState<SortKey>(search.sort ?? "shop");
  const [activeCat, setActiveCat] = useState<string>(search.cat ?? "all");
  const [isPending, startTransition] = useTransition();
  const PER_PAGE = 12;

  // Sincroniza estado → URL (debounced para a busca) para preservar SEO,
  // navegação back/forward e compartilhamento de links filtrados.
  useEffect(() => {
    const t = setTimeout(() => {
      navigate({
        search: () => ({
          q: q.trim() ? q.trim() : undefined,
          cat: activeCat !== "all" ? activeCat : undefined,
          sort: sort !== "shop" ? sort : undefined,
          page: page > 1 ? page : undefined,
        }),
        replace: true,
        resetScroll: true,
      });
    }, 250);
    return () => clearTimeout(t);
  }, [q, activeCat, sort, page, navigate]);

  const allCategories = useMemo(() => {
    const s = new Set<string>();
    services.forEach((x: Svc) => s.add(x.category));
    return Array.from(s);
  }, [services]);

  const filtered = useMemo<Svc[]>(() => {
    const term = q.trim().toLowerCase();
    let list = services as Svc[];
    if (activeCat !== "all") list = list.filter((s) => s.category === activeCat);
    if (term) {
      list = list.filter((s) =>
        [s.name, s.description, s.category, ...(s.keywords ?? [])]
          .join(" ")
          .toLowerCase()
          .includes(term),
      );
    }
    // Base "recentes primeiro" (loader vem em display_order asc → invertemos)
    const recentFirst = [...list].reverse();
    if (sort === "alpha") return [...list].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    if (sort === "relevance") return list;
    if (sort === "recent") return recentFirst;
    // "shop" (default): vitrine em ordem estável, sem embaralhar.
    return recentFirst;
  }, [services, q, sort, activeCat]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);
  const changePage = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [safePage]);
  // Index global (na lista filtrada) para badge "Novo" nos 3 primeiros.
  const newSet = new Set(filtered.slice(0, 3).map((s) => s.slug));


  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section className="border-b border-border bg-card/60">
          <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Loja 0WEB</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">Escolha o próximo avanço do seu negócio.</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">Produtos digitais com escopo claro, preço publicado e contratação simples.</p>
            <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3 border-t border-border pt-5 text-xs sm:gap-8 sm:text-sm">
              <div><strong className="block text-lg text-foreground sm:text-xl">{services.length}</strong><span className="text-muted-foreground">produtos ativos</span></div>
              <div><strong className="block text-lg text-foreground sm:text-xl">100%</strong><span className="text-muted-foreground">preço visível</span></div>
              <div><strong className="block text-lg text-foreground sm:text-xl">On-line</strong><span className="text-muted-foreground">compra assistida</span></div>
            </div>
          </div>
        </section>



        <section className="py-10 sm:py-12" id="catalogo" aria-labelledby="catalogo-title">
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <div className="mb-6 flex flex-col gap-5">
              <div>
                <h2 id="catalogo-title" className="text-2xl sm:text-3xl font-bold">
                  Produtos disponíveis
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {filtered.length} serviço{filtered.length === 1 ? "" : "s"} disponíve{filtered.length === 1 ? "l" : "is"}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="relative flex-1">
                  <span className="sr-only">Buscar serviço</span>
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    type="search"
                    value={q}
                    onChange={(e) => {
                      const v = e.target.value;
                      startTransition(() => {
                        setQ(v);
                        setPage(1);
                      });
                    }}
                    placeholder="Buscar produto..."
                    className="h-11 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </label>
                <label className="relative">
                  <span className="sr-only">Ordenar serviços</span>
                  <select
                    value={sort}
                    onChange={(e) => {
                      const v = e.target.value as SortKey;
                      startTransition(() => {
                        setSort(v);
                        setPage(1);
                      });
                    }}
                    className="h-11 rounded-xl border border-border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="shop">Vitrine</option>
                    <option value="recent">Mais recentes</option>
                    <option value="alpha">Alfabética (A→Z)</option>
                    <option value="relevance">Relevância</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="mb-8 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtrar por categoria">
              <button
                type="button"
                onClick={() => startTransition(() => { setActiveCat("all"); setPage(1); })}
                aria-pressed={activeCat === "all"}
                className={`px-3 h-8 text-xs rounded-full border transition-colors ${
                  activeCat === "all"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary"
                }`}
              >
                Todas ({services.length})
              </button>
              {allCategories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => startTransition(() => { setActiveCat(c); setPage(1); })}
                  aria-pressed={activeCat === c}
                  className={`px-3 h-8 text-xs rounded-full border transition-colors ${
                    activeCat === c
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {isPending ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4" aria-busy="true" aria-live="polite">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
                    <Skeleton className="aspect-video w-full rounded-none" />
                    <div className="p-5 space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : services.length === 0 ? (
              <div className="mx-auto max-w-2xl text-center py-14 rounded-3xl border border-dashed border-border bg-card px-6">
                <AlertCircle className="w-9 h-9 text-muted-foreground mx-auto" />
                <h3 className="mt-4 text-xl font-bold">Nenhum produto com preço publicado</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  A vitrine exibe apenas produtos com valor cadastrado. Se você quer publicar um novo item, solicite o cadastramento.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <FunnelCTAButton
                    intent={{ purpose: "proposal", source: "servicos_empty_state", pagePath: "/servicos", placement: "section" }}
                    label="Solicitar cadastramento"
                    location="servicos_empty_state"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold"
                  />
                  <Link to="/solucoes" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
                    Ver soluções sem preço
                  </Link>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto" />
                <p className="mt-3 text-muted-foreground">
                  Nenhum serviço encontrado{q ? ` para "${q}"` : ""}.
                </p>
                <button
                  type="button"
                  onClick={() => { setQ(""); setActiveCat("all"); setPage(1); }}
                  className="mt-3 text-sm text-primary underline"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
                {paginated.map((s) => {
                  // Capa da miniatura: prefere imagem principal do produto e,
                  // se ausente, usa a primeira imagem da galeria — assim
                  // produtos que só têm galeria não caem no placeholder de sigla.
                  const galleryCover = Array.isArray(s.gallery)
                    ? (s.gallery.find((g: { url?: string | null; alt?: string | null }) => typeof g?.url === "string" && g.url) ?? null)
                    : null;
                  const coverUrl = s.imageUrl || galleryCover?.url || s.ogImageUrl || null;
                  const coverAlt = s.imageAlt || galleryCover?.alt || s.name;
                  return (
                  <article
                    key={s.slug}
                    className="group relative flex flex-col rounded-2xl border border-border bg-card hover:border-primary hover:-translate-y-1 hover:shadow-elegant transition-all duration-300 overflow-hidden focus-within:ring-2 focus-within:ring-ring"
                  >
                    <Link
                      to="/servicos/$slug"
                      params={{ slug: s.slug }}
                      className="flex flex-col flex-1 focus-visible:outline-none"
                      aria-label={`Ver detalhes do serviço ${s.name}`}
                    >
                      {newSet.has(s.slug) && (
                        <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                          <Sparkles className="w-3 h-3" /> Novo
                        </span>
                      )}
                      {coverUrl ? (
                        <div className="aspect-video overflow-hidden bg-muted">
                          <img
                            src={coverUrl}
                            alt={coverAlt}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : null}
                      <div className="p-3 sm:p-4 flex-1 flex flex-col">
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-primary font-bold line-clamp-1">{s.category}</p>
                        <h4 className="mt-1 font-semibold text-sm sm:text-base leading-snug line-clamp-2">{s.name}</h4>
                        <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-2">{s.description}</p>

                        <div className="mt-auto pt-3">
                          <p className="text-base font-bold text-foreground">
                            R$ {Number(s.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            {s.pricePeriod ? <span className="ml-1 text-xs font-medium text-muted-foreground">/{s.pricePeriod}</span> : null}
                          </p>

                          <span
                            className="inline-flex items-center justify-center w-full gap-1 text-sm font-semibold rounded-full bg-foreground text-background px-3 py-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                            title={s.name}
                          >
                            <span className="truncate">Ver detalhes</span>
                            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                  );
                })}

              </div>
            )}

            <div className="mt-10 flex flex-col items-start justify-between gap-3 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-4 text-sm sm:flex-row sm:items-center">
              <span className="text-muted-foreground">Precisa de algo sob medida ou ainda sem preço?</span>
              <Link to="/solucoes" className="inline-flex items-center gap-1 font-semibold text-primary">Ver soluções consultivas <ArrowRight className="h-4 w-4" /></Link>
            </div>

            {totalPages > 1 && (
              <nav
                className="mt-10 flex items-center justify-center gap-2"
                aria-label="Paginação do catálogo"
              >
                  <button
                    type="button"
                  onClick={() => changePage(Math.max(1, safePage - 1))}
                  disabled={safePage === 1}
                  className="px-3 h-9 rounded-full border border-border text-sm disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                  onClick={() => changePage(p)}
                    aria-current={p === safePage ? "page" : undefined}
                    className={`w-9 h-9 rounded-full border text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      p === safePage
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => changePage(Math.min(totalPages, safePage + 1))}
                  disabled={safePage === totalPages}
                  className="px-3 h-9 rounded-full border border-border text-sm disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Próxima
                </button>
              </nav>
            )}
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
