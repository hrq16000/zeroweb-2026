import {
  classifyPageType,
  explainCoverage,
  gscConfigured,
  inspectUrl,
  listSitemaps,
  resolveSiteUrl,
  searchAnalyticsQuery,
  sitemapStatus,
  submitSitemap,
  type SiteResolution,
} from "@/lib/gsc.server";

export const SITE_URL = "https://0web.com.br";
export const PROPERTY_SETTING_KEY = "gsc.site_url";
export const ALERT_DAYS_SETTING_KEY = "gsc.alert_after_days";

export const SITEMAPS = [
  "sitemap.xml",
  "sitemap-pages.xml",
  "sitemap-portfolio.xml",
  "sitemap-services.xml",
  "sitemap-solutions.xml",
  "sitemap-blog.xml",
  "sitemap-cases.xml",
  "sitemap-cities.xml",
  "sitemap-city-services.xml",
  "sitemap-editorial.xml",
  "sitemap-marketplace.xml",
  "sitemap-skyscraper.xml",
  "sitemap-bh-neighborhoods.xml",
  "sitemap-cwb-neighborhoods.xml",
];

export async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const roles = (data ?? []).map((r: { role: string }) => r.role);
  if (!roles.includes("admin") && !roles.includes("super_admin")) throw new Error("forbidden");
}

async function selectedProperty(): Promise<string | null> {
  const { getSettingValue } = await import("@/lib/settings.functions");
  return getSettingValue(PROPERTY_SETTING_KEY);
}

export async function resolveProperty(): Promise<SiteResolution> {
  return resolveSiteUrl(SITE_URL, await selectedProperty());
}

async function logSync(
  supabase: any,
  kind: string,
  siteUrl: string | null,
  status: string,
  rows: number,
  error: string | null,
  started: number,
) {
  await supabase.from("gsc_sync_log").insert({
    kind,
    site_url: siteUrl,
    status,
    rows_count: rows,
    error_message: error,
    duration_ms: Date.now() - started,
  });
}

function isoDaysAgo(days: number) {
  return new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
}

/** Sincroniza métricas de performance (por página e por página+query). */
export async function syncPerformance(supabase: any, days: number) {
  const started = Date.now();
  const res = await resolveProperty();
  if (res.status !== "selected") {
    await logSync(supabase, "performance", null, res.status, 0, JSON.stringify(res), started);
    return { ...res, rows: 0 };
  }
  const body = {
    startDate: isoDaysAgo(days + 2),
    endDate: isoDaysAgo(2),
    dimensions: ["date", "page"],
    rowLimit: 5000,
  };
  try {
    const data = (await searchAnalyticsQuery(res.siteUrl, body)) as { rows?: any[] };
    const rows = (data.rows ?? []).map((r) => ({
      date: r.keys[0],
      page: r.keys[1],
      query: null as string | null,
      page_type: classifyPageType(r.keys[1]),
      clicks: Math.round(r.clicks ?? 0),
      impressions: Math.round(r.impressions ?? 0),
      ctr: Number(r.ctr ?? 0),
      position: Number(r.position ?? 0),
    }));

    const q = (await searchAnalyticsQuery(res.siteUrl, {
      startDate: isoDaysAgo(days + 2),
      endDate: isoDaysAgo(2),
      dimensions: ["date", "page", "query"],
      rowLimit: 5000,
    })) as { rows?: any[] };
    const queryRows = (q.rows ?? []).map((r) => ({
      date: r.keys[0],
      page: r.keys[1],
      query: r.keys[2] as string,
      page_type: classifyPageType(r.keys[1]),
      clicks: Math.round(r.clicks ?? 0),
      impressions: Math.round(r.impressions ?? 0),
      ctr: Number(r.ctr ?? 0),
      position: Number(r.position ?? 0),
    }));

    const all = [...rows, ...queryRows];
    for (let i = 0; i < all.length; i += 500) {
      const chunk = all.slice(i, i + 500);
      const { error } = await supabase
        .from("gsc_page_metrics")
        .upsert(chunk, { onConflict: "date,page,query" });
      if (error) throw new Error(error.message);
    }
    await logSync(supabase, "performance", res.siteUrl, "ok", all.length, null, started);
    return { status: "selected" as const, siteUrl: res.siteUrl, rows: all.length };
  } catch (e) {
    await logSync(supabase, "performance", res.siteUrl, "error", 0, (e as Error).message, started);
    throw e;
  }
}

/** Submete todos os sitemaps e devolve o status reportado pelo Google. */
export async function submitAndCheckSitemaps(supabase: any) {
  const started = Date.now();
  const res = await resolveProperty();
  if (res.status !== "selected") return { ...res, sitemaps: [] as any[] };

  const out: any[] = [];
  for (const file of SITEMAPS) {
    const full = `${SITE_URL}/${file}`;
    try {
      await submitSitemap(res.siteUrl, full);
      const st = (await sitemapStatus(res.siteUrl, full)) as any;
      out.push({
        sitemap: file,
        submitted: true,
        lastDownloaded: st.lastDownloaded ?? null,
        errors: Number(st.errors ?? 0),
        warnings: Number(st.warnings ?? 0),
        isPending: Boolean(st.isPending),
        contents: st.contents ?? [],
      });
    } catch (e) {
      out.push({ sitemap: file, submitted: false, error: (e as Error).message });
    }
  }
  await logSync(supabase, "sitemaps", res.siteUrl, "ok", out.length, null, started);
  return { status: "selected" as const, siteUrl: res.siteUrl, sitemaps: out };
}

export async function readSitemaps() {
  const res = await resolveProperty();
  if (res.status !== "selected") return { ...res, sitemaps: [] as any[] };
  const data = (await listSitemaps(res.siteUrl)) as { sitemap?: any[] };
  return {
    status: "selected" as const,
    siteUrl: res.siteUrl,
    sitemaps: (data.sitemap ?? []).map((s) => ({
      sitemap: s.path,
      errors: Number(s.errors ?? 0),
      warnings: Number(s.warnings ?? 0),
      lastDownloaded: s.lastDownloaded ?? null,
      isPending: Boolean(s.isPending),
    })),
  };
}

/** Inspeciona URLs monitoradas ainda não indexadas e gera alertas com motivo provável. */
export async function inspectPendingUrls(supabase: any, limit: number) {
  const res = await resolveProperty();
  if (res.status !== "selected") return { ...res, inspected: 0, alerts: 0 };

  const { data: rows } = await supabase
    .from("url_index_watch")
    .select("url, first_seen_at, indexed")
    .eq("indexed", false)
    .order("first_seen_at", { ascending: true })
    .limit(limit);

  let alerts = 0;
  for (const row of rows ?? []) {
    try {
      const insp = await inspectUrl(res.siteUrl, row.url);
      const verdict = (insp as any)?.inspectionResult?.indexStatusResult?.verdict;
      const info = explainCoverage(insp);
      const indexed = verdict === "PASS";

      await supabase
        .from("url_index_watch")
        .update({
          indexed,
          indexed_at: indexed ? new Date().toISOString() : null,
          coverage_state: info.coverageState,
          last_checked_at: new Date().toISOString(),
          notes: info.probableCause || null,
          updated_at: new Date().toISOString(),
        })
        .eq("url", row.url);

      if (!indexed) {
        const days = Math.floor((Date.now() - new Date(row.first_seen_at).getTime()) / 86400000);
        await supabase.from("seo_alerts").insert({
          alert_type: "not_indexed",
          severity: days >= 30 ? "critical" : "warning",
          url: row.url,
          title: `Não indexada há ${days} dias — ${info.coverageState}`,
          probable_cause: info.probableCause,
          suggested_fix: info.suggestedFix,
          fix_link: `https://search.google.com/search-console/inspect?resource_id=${encodeURIComponent(res.siteUrl)}&id=${encodeURIComponent(row.url)}`,
        });
        alerts++;
      }
    } catch {
      /* segue para a próxima URL */
    }
  }
  return { status: "selected" as const, siteUrl: res.siteUrl, inspected: (rows ?? []).length, alerts };
}

/** Diagnóstico: por que o portal não aparece no Google. */
export async function diagnose(supabase: any) {
  if (!gscConfigured()) {
    return {
      configured: false,
      conclusion:
        "Integração do Search Console indisponível: chaves do conector ausentes no runtime do servidor.",
      property: null,
      sitemaps: [],
      totals: null,
    };
  }
  const res = await resolveProperty();
  if (res.status !== "selected") {
    return {
      configured: true,
      property: res,
      conclusion:
        res.status === "selection_required"
          ? "Várias propriedades cobrem o site — escolha qual usar."
          : "Nenhuma propriedade verificada cobre 0web.com.br. Publique o site (a meta tag de verificação já está no código) e conclua a verificação.",
      sitemaps: [],
      totals: null,
    };
  }

  const sm = await readSitemaps();
  const { data: watch } = await supabase.from("url_index_watch").select("indexed");
  const total = (watch ?? []).length;
  const indexed = (watch ?? []).filter((r: any) => r.indexed).length;

  const since = isoDaysAgo(30);
  const { data: metrics } = await supabase
    .from("gsc_page_metrics")
    .select("clicks, impressions")
    .is("query", null)
    .gte("date", since);
  const clicks = (metrics ?? []).reduce((a: number, r: any) => a + r.clicks, 0);
  const impressions = (metrics ?? []).reduce((a: number, r: any) => a + r.impressions, 0);

  const conclusion =
    impressions === 0
      ? "Sem dados reportados nos últimos 30 dias. O Search Console pode ter atraso e omite consultas de baixo volume; verifique também se os sitemaps foram baixados sem erros."
      : `Nos últimos 30 dias: ${impressions} impressões e ${clicks} cliques reportados.`;

  return {
    configured: true,
    property: res,
    sitemaps: sm.status === "selected" ? sm.sitemaps : [],
    totals: { watched: total, indexed, notIndexed: total - indexed, clicks, impressions },
    conclusion,
  };
}

/** Relatório mensal: sitemap vs indexadas, evolução e recomendações priorizadas. */
export async function monthlyReport(supabase: any, month: string) {
  const start = `${month}-01`;
  const startDate = new Date(`${start}T00:00:00Z`);
  const end = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth() + 1, 0))
    .toISOString()
    .slice(0, 10);
  const prevStart = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth() - 1, 1))
    .toISOString()
    .slice(0, 10);

  const { data: cur } = await supabase
    .from("gsc_page_metrics")
    .select("page, page_type, clicks, impressions, position")
    .is("query", null)
    .gte("date", start)
    .lte("date", end);
  const { data: prev } = await supabase
    .from("gsc_page_metrics")
    .select("page_type, clicks, impressions")
    .is("query", null)
    .gte("date", prevStart)
    .lt("date", start);

  const agg = (rows: any[]) => {
    const m: Record<string, { clicks: number; impressions: number; positions: number[] }> = {};
    for (const r of rows ?? []) {
      const k = r.page_type ?? "other";
      m[k] ??= { clicks: 0, impressions: 0, positions: [] };
      m[k].clicks += r.clicks;
      m[k].impressions += r.impressions;
      if (r.position) m[k].positions.push(Number(r.position));
    }
    return m;
  };
  const a = agg(cur ?? []);
  const b = agg(prev ?? []);
  const byType = Object.keys({ ...a, ...b }).map((k) => ({
    page_type: k,
    clicks: a[k]?.clicks ?? 0,
    impressions: a[k]?.impressions ?? 0,
    prev_clicks: b[k]?.clicks ?? 0,
    prev_impressions: b[k]?.impressions ?? 0,
    avg_position: a[k]?.positions.length
      ? Number((a[k].positions.reduce((x, y) => x + y, 0) / a[k].positions.length).toFixed(1))
      : null,
  }));

  const { data: watch } = await supabase
    .from("url_index_watch")
    .select("url, indexed, coverage_state, notes, first_seen_at");
  const notIndexed = (watch ?? []).filter((r: any) => !r.indexed);

  const recommendations: { priority: number; title: string; detail: string }[] = [];
  if (notIndexed.length > 0) {
    recommendations.push({
      priority: 1,
      title: `${notIndexed.length} URLs no sitemap ainda não indexadas`,
      detail:
        "Reforce links internos a partir de /portfolio e dos hubs, diferencie o texto local e reenvie o sitemap.",
    });
  }
  const lowCtr = (cur ?? []).filter((r: any) => r.impressions >= 100 && r.clicks / Math.max(r.impressions, 1) < 0.01);
  if (lowCtr.length) {
    recommendations.push({
      priority: 2,
      title: `${lowCtr.length} páginas com CTR abaixo de 1%`,
      detail: "Reescreva title e meta description com proposta de valor e localidade.",
    });
  }
  const nearTop = (cur ?? []).filter((r: any) => Number(r.position) > 10 && Number(r.position) <= 20);
  if (nearTop.length) {
    recommendations.push({
      priority: 3,
      title: `${nearTop.length} páginas entre a 2ª e 3ª página do Google`,
      detail: "Ampliar conteúdo e links internos nessas URLs traz o maior ganho marginal.",
    });
  }

  return {
    month,
    range: { start, end },
    sitemapVsIndexed: {
      total: (watch ?? []).length,
      indexed: (watch ?? []).length - notIndexed.length,
      notIndexed: notIndexed.length,
      pending: notIndexed.slice(0, 50),
    },
    byType,
    recommendations,
  };
}
