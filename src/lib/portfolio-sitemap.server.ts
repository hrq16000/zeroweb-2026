import portfolioCatalog from "@/config/portfolio-catalog.json";
import { PORTFOLIO_PROTOTYPES } from "@/lib/portfolio-site-registry";
import type { SitemapEntry } from "@/lib/sitemap-utils";

/**
 * Fonte única das URLs de clientes que podem entrar no sitemap de portfólio.
 *
 * O catálogo versionado representa a aprovação editorial (`approved` ou
 * `published`). A tabela de configurações pode substituir esse estado em
 * runtime: quando existe uma linha para o slug, somente `published = true`
 * fica indexável. Assim, despublicar no painel remove a URL sem editar XML.
 */
export type PortfolioSitemapOverride = {
  slug: string;
  published: boolean;
  updated_at?: string | null;
  /** "managed" = projeto criado pelo painel, sem entrada no catálogo versionado. */
  project_kind?: string | null;
};

type CatalogItem = {
  slug: string;
  status?: string;
  live?: boolean;
};

const APPROVED_STATUSES = new Set(["approved", "published"]);

const knownSlugs = new Set([
  ...(portfolioCatalog as CatalogItem[]).map((item) => item.slug),
  ...PORTFOLIO_PROTOTYPES.map((site) => site.slug),
]);

/** Constrói a lista sem I/O; usada pela rota, pelos hooks e pelos testes. */
export function buildApprovedPortfolioEntries(
  overrides: readonly PortfolioSitemapOverride[] = [],
): SitemapEntry[] {
  const catalog = new Map((portfolioCatalog as CatalogItem[]).map((item) => [item.slug, item]));
  const runtime = new Map(overrides.map((item) => [item.slug, item]));

  // Projetos criados pelo painel não existem no catálogo versionado: entram no
  // sitemap apenas enquanto estiverem publicados, e saem ao serem arquivados.
  const managedSlugs = overrides
    .filter((item) => (item as { project_kind?: string }).project_kind === "managed" && item.published)
    .map((item) => item.slug);

  const slugs = [...new Set([...knownSlugs, ...managedSlugs])].filter((slug) => {
    const item = catalog.get(slug);
    const site = PORTFOLIO_PROTOTYPES.find((candidate) => candidate.slug === slug);
    const override = runtime.get(slug);
    if (!item && !site) return Boolean(override?.published);
    const approved = item
      ? APPROVED_STATUSES.has(item.status ?? "") && item.live !== false
      : Boolean(site?.indexable);
    return approved && (!override || override.published);
  });

  return [
    { path: "/portfolio", changefreq: "weekly", priority: "0.9" },
    ...slugs.sort().map((slug) => {
      const updatedAt = runtime.get(slug)?.updated_at;
      return {
        path: `/portfolio/${slug}`,
        ...(updatedAt ? { lastmod: updatedAt } : {}),
        changefreq: "monthly" as const,
        priority: "0.8",
      };
    }),
  ];

}

/** Lê somente estados publicados do painel; falhas preservam o catálogo. */
export async function getPublishedPortfolioOverrides(): Promise<PortfolioSitemapOverride[]> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin as any)
      .from("portfolio_client_settings")
      .select("slug,published,updated_at,project_kind,lifecycle_status")
      .limit(1000);
    if (error) throw new Error(error.message);
    return ((data ?? []) as Array<PortfolioSitemapOverride & { lifecycle_status?: string }>).map(
      (row) => ({
        ...row,
        published: Boolean(row.published) && row.lifecycle_status !== "archived",
      }),
    );
  } catch (error) {
    console.warn("[portfolio-sitemap] runtime overrides unavailable; using catalog", error);
    return [];
  }
}

export async function getApprovedPortfolioSitemapEntries(): Promise<SitemapEntry[]> {
  return buildApprovedPortfolioEntries(await getPublishedPortfolioOverrides());
}

/** URL canônica do sitemap dinâmico, usada pelo GSC e pelo IndexNow. */
export const PORTFOLIO_SITEMAP_URL = "https://0web.com.br/sitemap-portfolio.xml";

/**
 * Reenvia o sitemap e as URLs alteradas após um lote ser aprovado/publicado.
 * Falhas de integrações externas são retornadas como diagnóstico e não
 * desfazem a publicação do cliente.
 */
export async function syncPortfolioSitemapAndIndexing(
  supabase: any,
  changedSlugs: readonly string[] = [],
) {
  const entries = await getApprovedPortfolioSitemapEntries();
  const approvedUrls = entries.map((entry) => `https://0web.com.br${entry.path}`);
  const requested = new Set(changedSlugs);
  const changedUrls = requested.size
    ? approvedUrls.filter((url) =>
        [...requested].some((slug) => url.endsWith(`/portfolio/${slug}`)),
      )
    : approvedUrls.filter((url) => url !== "https://0web.com.br/portfolio");
  const indexNowUrls = [...new Set(["https://0web.com.br/portfolio", ...changedUrls])];

  const watchRows = approvedUrls.map((url) => ({
    url,
    section: "portfolio",
    sitemap: "sitemap-portfolio.xml",
  }));
  if (watchRows.length) {
    await supabase
      .from("url_index_watch")
      .upsert(watchRows, { onConflict: "url", ignoreDuplicates: true });
  }

  let gsc: { status: string; error?: string } = { status: "not_configured" };
  try {
    const { resolveProperty } = await import("@/lib/gsc-sync.server");
    const { submitSitemap } = await import("@/lib/gsc.server");
    const property = await resolveProperty();
    if (property.status === "selected") {
      await submitSitemap(property.siteUrl, PORTFOLIO_SITEMAP_URL);
      gsc = { status: "submitted" };
    } else {
      gsc = { status: property.status };
    }
  } catch (error) {
    gsc = { status: "error", error: error instanceof Error ? error.message : String(error) };
  }

  let indexNow: unknown = { submitted: 0, status: "not_run" };
  try {
    const { submitToIndexNow } = await import("@/lib/indexnow.server");
    indexNow = await submitToIndexNow(supabase, indexNowUrls);
  } catch (error) {
    indexNow = {
      submitted: 0,
      status: "error",
      error: error instanceof Error ? error.message : String(error),
    };
  }

  await supabase
    .from("gsc_sync_log")
    .insert({
      kind: "portfolio-sitemap",
      site_url: "https://0web.com.br",
      status: gsc.status,
      rows_count: approvedUrls.length,
      error_message: gsc.error ?? null,
      duration_ms: null,
    })
    .catch(() => null);

  return {
    sitemap: PORTFOLIO_SITEMAP_URL,
    approved: approvedUrls.length,
    changed: changedUrls.length,
    gsc,
    indexNow,
  };
}
