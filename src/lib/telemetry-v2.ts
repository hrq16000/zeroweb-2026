/**
 * MEASUREMENT_TRUTH — contrato de telemetria V2.
 *
 * Este módulo NÃO cria um segundo sistema de rastreamento: ele apenas define,
 * de forma pura e testável, como os eventos que já passam por
 * `trackEvent` → `persistEvent` → `analytics_events` devem ser qualificados.
 *
 * O que muda em relação ao V1:
 *  - a origem deixa de ser preenchida artificialmente com `utm_source = "site"`;
 *  - existe `page_view` canônico e idempotente por transição de rota;
 *  - prova social passa a ter granularidade mínima (1 por sessão + contexto);
 *  - todo evento carrega `tv: 2`, `traffic_type` e o contexto de aquisição.
 *
 * Nenhum dado pessoal entra aqui. Query strings externas não são persistidas:
 * apenas hostname normalizado e os parâmetros analíticos da allowlist.
 */

export const TELEMETRY_VERSION = 2 as const;

/** Momento a partir do qual os dados seguem o contrato V2 (UTC). */
export const MEASUREMENT_TRUTH_V2_CUTOVER = "2026-09-05T22:00:00.000Z";

export const FIRST_TOUCH_KEY = "0web_first_touch_v2";
const PAGE_VIEW_KEY = "0web:pv:v2";
const SOCIAL_PROOF_KEY = "0web:spv:v2";

/** Únicos parâmetros de URL que podem ser persistidos. */
export const ALLOWED_QUERY_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
] as const;

/** Chaves de propriedade que nunca podem entrar na telemetria. */
const PII_KEY_PATTERN =
  /(nome|name|email|mail|phone|tel|whats|celular|cpf|cnpj|cep|address|endereco|endereço|message|mensagem|texto|text|comment|obs|body|password|token)/i;

/** Propriedades analíticas sempre permitidas, mesmo que casem com o padrão acima. */
const ALWAYS_ALLOWED = new Set([
  "event_category",
  "location",
  "label",
  "step_index",
  "step_id",
  "steps",
  "percent",
  "conversion",
  "experiment",
  "variant",
  "client_key",
  "portfolio_slug",
  "service_slug",
  "project",
  "slug",
  "route",
  "path",
  "source",
  "channel",
  "form_name",
  "tv",
  "traffic_type",
]);

export type TrafficType = "human" | "bot" | "automation" | "internal" | "unknown";

export type AcquisitionChannel =
  | "utm"
  | "referral"
  | "direct"
  | "internal"
  | "unknown";

export type Acquisition = {
  channel: AcquisitionChannel;
  source: string | null;
  medium: string | null;
  campaign: string | null;
  content: string | null;
  term: string | null;
  referrer_host: string | null;
  landing_path: string | null;
};

export const EMPTY_ACQUISITION: Acquisition = {
  channel: "unknown",
  source: null,
  medium: null,
  campaign: null,
  content: null,
  term: null,
  referrer_host: null,
  landing_path: null,
};

/* ------------------------------------------------------------------ */
/* Normalização de rota                                                */
/* ------------------------------------------------------------------ */

/**
 * Reduz uma URL/caminho ao path canônico. Query strings irrelevantes não podem
 * fragmentar a mesma página em métricas distintas.
 */
export function normalizePath(input: string | null | undefined): string {
  if (!input) return "/";
  let raw = String(input).trim();
  try {
    if (/^https?:\/\//i.test(raw)) raw = new URL(raw).pathname;
  } catch {
    /* mantém a string original */
  }
  raw = raw.split("?")[0].split("#")[0];
  if (!raw.startsWith("/")) raw = `/${raw}`;
  raw = raw.replace(/\/{2,}/g, "/");
  if (raw.length > 1) raw = raw.replace(/\/+$/, "");
  return raw.toLowerCase() || "/";
}

/** Extrai apenas os parâmetros analíticos permitidos de uma query string. */
export function pickAllowedParams(search: string | null | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!search) return out;
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  for (const key of ALLOWED_QUERY_PARAMS) {
    const value = params.get(key);
    if (value) out[key] = value.slice(0, 128);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Atribuição                                                          */
/* ------------------------------------------------------------------ */

function hostOf(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return null;
  }
}

export function isInternalHost(host: string | null, siteHost: string): boolean {
  if (!host) return false;
  const site = siteHost.replace(/^www\./i, "").toLowerCase();
  return host === site || host.endsWith(`.${site}`) || host === "localhost";
}

/**
 * Classifica a origem de uma entrada. Nunca inventa valor:
 * sem UTM e sem referrer externo o resultado é `direct`; referrer do próprio
 * domínio é `internal` (contexto de navegação, não aquisição).
 */
export function classifyAcquisition(input: {
  search?: string | null;
  referrer?: string | null;
  siteHost: string;
  path?: string | null;
}): Acquisition {
  const utms = pickAllowedParams(input.search);
  const refHost = hostOf(input.referrer);
  const landing = normalizePath(input.path);

  if (utms.utm_source || utms.gclid || utms.fbclid) {
    return {
      channel: "utm",
      source: utms.utm_source ?? (utms.gclid ? "google" : "facebook"),
      medium: utms.utm_medium ?? (utms.gclid ? "cpc" : null),
      campaign: utms.utm_campaign ?? null,
      content: utms.utm_content ?? null,
      term: utms.utm_term ?? null,
      referrer_host: refHost,
      landing_path: landing,
    };
  }

  if (refHost && isInternalHost(refHost, input.siteHost)) {
    return { ...EMPTY_ACQUISITION, channel: "internal", source: "internal", referrer_host: refHost, landing_path: landing };
  }

  if (refHost) {
    return {
      ...EMPTY_ACQUISITION,
      channel: "referral",
      source: refHost,
      medium: "referral",
      referrer_host: refHost,
      landing_path: landing,
    };
  }

  return { ...EMPTY_ACQUISITION, channel: "direct", source: "direct", medium: "none", landing_path: landing };
}

/**
 * First touch da sessão: a primeira aquisição real observada.
 * Navegação interna nunca sobrescreve — só uma nova entrada externa
 * (UTM ou referrer externo) pode iniciar uma sessão de aquisição.
 */
export function mergeFirstTouch(stored: Acquisition | null, current: Acquisition): Acquisition {
  if (!stored) return current;
  if (stored.channel === "utm" || stored.channel === "referral") return stored;
  if (current.channel === "utm" || current.channel === "referral") return current;
  return stored;
}

function readJson<T>(storage: Storage | undefined, key: string): T | null {
  try {
    const raw = storage?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function currentTouch(): Acquisition {
  if (typeof window === "undefined") return EMPTY_ACQUISITION;
  return classifyAcquisition({
    search: window.location.search,
    referrer: typeof document !== "undefined" ? document.referrer || null : null,
    siteHost: window.location.hostname,
    path: window.location.pathname,
  });
}

/** Lê (e persiste, quando ainda não existir) o first touch da sessão. */
export function firstTouch(): Acquisition {
  if (typeof window === "undefined") return EMPTY_ACQUISITION;
  const stored = readJson<Acquisition>(window.sessionStorage, FIRST_TOUCH_KEY);
  const merged = mergeFirstTouch(stored, currentTouch());
  try {
    window.sessionStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(merged));
  } catch {
    /* storage indisponível: atribuição segue apenas em memória */
  }
  return merged;
}

/* ------------------------------------------------------------------ */
/* Classificação de tráfego                                            */
/* ------------------------------------------------------------------ */

const BOT_UA =
  /bot|crawl|spider|slurp|preview|monitor|axios|curl|wget|headless|lighthouse|python-requests|scrapy|java\//i;

export function classifyTraffic(input: {
  userAgent?: string | null;
  webdriver?: boolean;
  hostname?: string | null;
  path?: string | null;
  search?: string | null;
}): TrafficType {
  const host = (input.hostname ?? "").toLowerCase();
  const path = normalizePath(input.path);
  const qa = new URLSearchParams((input.search ?? "").replace(/^\?/, "")).get("qa");
  if (
    qa === "1" ||
    host === "localhost" ||
    host.endsWith(".lovable.app") ||
    path.startsWith("/app") ||
    path.startsWith("/qa")
  ) {
    return "internal";
  }
  if (input.webdriver) return "automation";
  if (!input.userAgent) return "unknown";
  if (BOT_UA.test(input.userAgent)) return "bot";
  return "human";
}

export function currentTrafficType(): TrafficType {
  if (typeof window === "undefined") return "unknown";
  return classifyTraffic({
    userAgent: navigator.userAgent,
    webdriver: Boolean((navigator as Navigator & { webdriver?: boolean }).webdriver),
    hostname: window.location.hostname,
    path: window.location.pathname,
    search: window.location.search,
  });
}

/* ------------------------------------------------------------------ */
/* Privacidade                                                         */
/* ------------------------------------------------------------------ */

/** Remove qualquer propriedade que possa carregar dado pessoal ou texto livre. */
export function sanitizeAnalyticsParams(
  params: Record<string, unknown> = {},
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (!ALWAYS_ALLOWED.has(key) && PII_KEY_PATTERN.test(key)) continue;
    if (typeof value === "number" || typeof value === "boolean") {
      out[key] = value;
      continue;
    }
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    // Texto livre e URLs completas nunca são persistidos.
    if (trimmed.length > 120) continue;
    if (/@|\+?\d[\d\s().-]{7,}/.test(trimmed)) continue;
    out[key] = trimmed;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Idempotência                                                        */
/* ------------------------------------------------------------------ */

const memoryOnce = new Set<string>();

/**
 * Retorna `true` apenas na primeira chamada para a mesma chave dentro da
 * sessão. Protege contra StrictMode, hidratação, remount e re-render.
 */
export function onceInSession(namespace: string, key: string): boolean {
  const full = `${namespace}:${key}`;
  if (memoryOnce.has(full)) return false;
  memoryOnce.add(full);
  if (typeof window === "undefined") return true;
  try {
    if (window.sessionStorage.getItem(full)) return false;
    window.sessionStorage.setItem(full, "1");
  } catch {
    /* memória já garante a deduplicação nesta aba */
  }
  return true;
}

/** Chave determinística de uma transição de rota. */
export function pageViewKey(path: string | null | undefined, transition: number): string {
  return `${normalizePath(path)}#${transition}`;
}

export function shouldEmitPageView(path: string | null | undefined, transition: number): boolean {
  return onceInSession(PAGE_VIEW_KEY, pageViewKey(path, transition));
}

export function shouldEmitSocialProof(context: string): boolean {
  return onceInSession(SOCIAL_PROOF_KEY, context || "global");
}

/** Apenas para testes: limpa a memória de idempotência. */
export function __resetOnceForTests() {
  memoryOnce.clear();
}

/* ------------------------------------------------------------------ */
/* Envelope V2                                                         */
/* ------------------------------------------------------------------ */

/** Campos que todo evento V2 carrega em `metadata_json`. */
export function telemetryEnvelope(): Record<string, string | number> {
  const ft = firstTouch();
  const ct = currentTouch();
  const env: Record<string, string | number> = {
    tv: TELEMETRY_VERSION,
    traffic_type: currentTrafficType(),
    ft_channel: ft.channel,
    ct_channel: ct.channel,
  };
  if (ft.source) env.ft_source = ft.source;
  if (ft.medium) env.ft_medium = ft.medium;
  if (ft.campaign) env.ft_campaign = ft.campaign;
  if (ft.landing_path) env.ft_landing_path = ft.landing_path;
  if (ct.source) env.ct_source = ct.source;
  return env;
}
