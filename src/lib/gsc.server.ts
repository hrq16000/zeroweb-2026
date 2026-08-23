/**
 * Cliente server-side do Google Search Console via connector gateway.
 * Nunca importar em código de cliente.
 */
const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";

export type SiteEntry = { siteUrl: string; permissionLevel?: string };
export type SiteResolution =
  | { status: "selected"; siteUrl: string }
  | { status: "selection_required"; candidates: string[] }
  | { status: "unavailable"; reason: string };

function headers() {
  const lovableApiKey = process.env.LOVABLE_API_KEY;
  const connectionApiKey = process.env.GOOGLE_SEARCH_CONSOLE_API_KEY;
  if (!lovableApiKey || !connectionApiKey) return null;
  return {
    Authorization: `Bearer ${lovableApiKey}`,
    "X-Connection-Api-Key": connectionApiKey,
  } as Record<string, string>;
}

export function gscConfigured() {
  return headers() !== null;
}

async function gscFetch(path: string, init?: RequestInit) {
  const h = headers();
  if (!h) throw new Error("gsc_not_configured");
  const res = await fetch(`${GATEWAY}${path}`, {
    ...init,
    headers: { ...h, ...(init?.headers as Record<string, string> | undefined) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`gsc_${res.status}: ${body.slice(0, 400)}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

export function coversTarget(siteUrl: string, target: URL) {
  if (siteUrl.startsWith("sc-domain:")) {
    const domain = siteUrl.slice("sc-domain:".length).toLowerCase();
    const host = target.hostname.toLowerCase();
    return host === domain || host.endsWith(`.${domain}`);
  }
  try {
    return target.href.startsWith(new URL(siteUrl).href);
  } catch {
    return false;
  }
}

export async function listVerifiedSites(): Promise<SiteEntry[]> {
  const json = (await gscFetch("/webmasters/v3/sites")) as { siteEntry?: SiteEntry[] };
  return (json.siteEntry ?? []).filter((e) => e.permissionLevel !== "siteUnverifiedUser");
}

/** Resolve a propriedade verificada que cobre targetUrl. */
export async function resolveSiteUrl(
  targetUrl: string,
  selectedSiteUrl?: string | null,
): Promise<SiteResolution> {
  if (!gscConfigured()) return { status: "unavailable", reason: "gsc_not_configured" };
  let sites: SiteEntry[];
  try {
    sites = await listVerifiedSites();
  } catch (e) {
    return { status: "unavailable", reason: (e as Error).message };
  }
  const target = new URL(targetUrl);
  const matches = sites.filter((e) => coversTarget(e.siteUrl, target));
  if (selectedSiteUrl) {
    const hit = matches.find((m) => m.siteUrl === selectedSiteUrl);
    if (!hit) return { status: "unavailable", reason: "selected_property_not_verified" };
    return { status: "selected", siteUrl: hit.siteUrl };
  }
  if (matches.length === 0) return { status: "unavailable", reason: "no_verified_property" };
  if (matches.length === 1) return { status: "selected", siteUrl: matches[0].siteUrl };
  return { status: "selection_required", candidates: matches.map((m) => m.siteUrl) };
}

export async function searchAnalyticsQuery(siteUrl: string, body: Record<string, unknown>) {
  return gscFetch(`/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function inspectUrl(siteUrl: string, inspectionUrl: string) {
  return gscFetch(`/v1/urlInspection/index:inspect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ siteUrl, inspectionUrl }),
  });
}

export async function submitSitemap(siteUrl: string, sitemapUrl: string) {
  return gscFetch(
    `/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
    { method: "PUT" },
  );
}

export async function sitemapStatus(siteUrl: string, sitemapUrl: string) {
  return gscFetch(
    `/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
  );
}

export async function listSitemaps(siteUrl: string) {
  return gscFetch(`/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`);
}

export async function verifyMetaToken(identifier: string) {
  return gscFetch(`/siteVerification/v1/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ site: { identifier, type: "SITE" }, verificationMethod: "META" }),
  });
}

export async function verifySite(identifier: string) {
  return gscFetch(`/siteVerification/v1/webResource?verificationMethod=META`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ site: { identifier, type: "SITE" } }),
  });
}

export async function addSite(siteUrl: string) {
  return gscFetch(`/webmasters/v3/sites/${encodeURIComponent(siteUrl)}`, { method: "PUT" });
}

/** Classifica uma URL do site em tipo de página para os relatórios. */
export function classifyPageType(url: string): string {
  const p = (() => {
    try {
      return new URL(url).pathname;
    } catch {
      return url;
    }
  })();
  if (p === "/") return "home";
  if (p.startsWith("/portfolio/") && p.split("/").length === 4) return "portfolio-programatico";
  if (p.startsWith("/portfolio")) return "portfolio";
  if (p.startsWith("/servicos")) return "servicos";
  if (p.startsWith("/solucoes")) return "solucoes";
  if (p.startsWith("/blog")) return "blog";
  if (p.startsWith("/bairros")) return "bairros";
  if (p.startsWith("/sites-robustos")) return "hub-sites-robustos";
  return "other";
}

/** Motivo provável + correção sugerida a partir do veredito do URL Inspection. */
export function explainCoverage(inspection: any): {
  coverageState: string;
  probableCause: string;
  suggestedFix: string;
} {
  const idx = inspection?.inspectionResult?.indexStatusResult ?? {};
  const verdict: string = idx.verdict ?? "UNKNOWN";
  const coverageState: string = idx.coverageState ?? verdict;
  const robots: string = idx.robotsTxtState ?? "";
  const canonical = idx.googleCanonical;
  const userCanonical = idx.userCanonical;

  if (robots === "DISALLOWED") {
    return {
      coverageState,
      probableCause: "A URL está bloqueada pelo robots.txt.",
      suggestedFix: "Remova a regra Disallow correspondente em public/robots.txt e reenvie o sitemap.",
    };
  }
  if (/noindex/i.test(coverageState)) {
    return {
      coverageState,
      probableCause: "A página envia a diretiva noindex.",
      suggestedFix: "Remova a meta robots noindex do head() da rota.",
    };
  }
  if (canonical && userCanonical && canonical !== userCanonical) {
    return {
      coverageState,
      probableCause: `Google escolheu outro canônico (${canonical}).`,
      suggestedFix: "Alinhe o link rel=canonical com a URL final e evite conteúdo duplicado entre bairros/segmentos.",
    };
  }
  if (/Discovered|Descoberta/i.test(coverageState)) {
    return {
      coverageState,
      probableCause: "Descoberta, mas ainda não rastreada — geralmente orçamento de rastreio ou poucos links internos.",
      suggestedFix: "Aumente links internos para a página (clusters do portfólio) e reenvie o sitemap.",
    };
  }
  if (/Crawled|Rastreada/i.test(coverageState)) {
    return {
      coverageState,
      probableCause: "Rastreada, mas não indexada — conteúdo considerado de baixo valor ou muito semelhante.",
      suggestedFix: "Diferencie o conteúdo (texto local exclusivo, provas, imagens) e reforce links internos.",
    };
  }
  if (verdict === "PASS") {
    return { coverageState, probableCause: "", suggestedFix: "" };
  }
  return {
    coverageState,
    probableCause: "Google ainda não indexou a URL.",
    suggestedFix: "Confirme canônico, sitemap e links internos; depois solicite indexação no Search Console.",
  };
}
