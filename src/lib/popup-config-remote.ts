/**
 * Leitura em runtime da configuração do pop-up por slug.
 *
 * O JSON versionado (`src/config/portfolio-upsell.json`) continua sendo o
 * padrão; a tabela `popup_configs` permite que o painel administrativo
 * sobrescreva título, CTA, textos e regras de exibição por projeto SEM deploy.
 * Nenhum contato operacional é armazenado ou lido aqui.
 */
import { supabase } from "@/integrations/supabase/client";
import {
  resolvePortfolioUpsellConfig,
  type PortfolioUpsellConfig,
} from "./portfolio-upsell-config";

export type PopupDisplayRules = {
  timerMs?: number;
  fallbackMs?: number;
  scrollPct?: number;
  oncePerSession?: boolean;
  /** ISO date — antes disso o pop-up não é exibido. */
  startsAt?: string | null;
  /** ISO date — depois disso o pop-up não é exibido. */
  endsAt?: string | null;
};

export type PopupAlertThresholds = {
  minImpressions?: number;
  minCtr?: number;
  minConversionRate?: number;
};

export type PopupConfigRow = {
  id: string;
  slug: string;
  enabled: boolean;
  kicker: string | null;
  title: string | null;
  description: string | null;
  highlight: string | null;
  cta_label: string | null;
  dismiss_label: string | null;
  funnel_slug: string | null;
  bullets: string[] | null;
  rules: PopupDisplayRules;
  alert_thresholds: PopupAlertThresholds;
  updated_at: string;
};

const CACHE_KEY = "0web:popup-config:v1";
const CACHE_TTL_MS = 60_000;

type CacheShape = { at: number; rows: Record<string, PopupConfigRow> };

function readCache(): CacheShape | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheShape;
    if (Date.now() - parsed.at > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(rows: Record<string, PopupConfigRow>) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), rows } satisfies CacheShape));
  } catch {
    /* noop */
  }
}

function withinSchedule(rules: PopupDisplayRules): boolean {
  const now = Date.now();
  if (rules.startsAt && now < Date.parse(rules.startsAt)) return false;
  if (rules.endsAt && now > Date.parse(rules.endsAt)) return false;
  return true;
}

/** Aplica o override remoto (se houver) sobre a configuração padrão do slug. */
export function mergePopupConfig(
  base: PortfolioUpsellConfig,
  row: PopupConfigRow | null | undefined,
): PortfolioUpsellConfig {
  if (!row) return base;
  const rules = row.rules ?? {};
  return {
    ...base,
    enabled: row.enabled && withinSchedule(rules),
    kicker: row.kicker ?? base.kicker,
    title: row.title ?? base.title,
    highlight: row.highlight ?? base.highlight,
    description: row.description ?? base.description,
    bullets: row.bullets?.length ? row.bullets : base.bullets,
    ctaLabel: row.cta_label ?? base.ctaLabel,
    dismissLabel: row.dismiss_label ?? base.dismissLabel,
    funnelSlug: row.funnel_slug ?? base.funnelSlug,
    display: {
      timerMs: rules.timerMs ?? base.display.timerMs,
      fallbackMs: rules.fallbackMs ?? base.display.fallbackMs,
      scrollPct: rules.scrollPct ?? base.display.scrollPct,
      oncePerSession: rules.oncePerSession ?? base.display.oncePerSession,
    },
  };
}

/** Busca a config do slug (com cache curto de sessão). Nunca lança. */
export async function fetchPopupConfig(slug: string): Promise<PortfolioUpsellConfig> {
  const base = resolvePortfolioUpsellConfig(slug);
  if (typeof window === "undefined") return base;

  const cached = readCache();
  if (cached) return mergePopupConfig(base, cached.rows[slug]);

  try {
    const { data, error } = await supabase
      .from("popup_configs")
      .select(
        "id, slug, enabled, kicker, title, description, highlight, cta_label, dismiss_label, funnel_slug, bullets, rules, alert_thresholds, updated_at",
      );
    if (error) return base;
    const rows: Record<string, PopupConfigRow> = {};
    for (const r of (data ?? []) as unknown as PopupConfigRow[]) rows[r.slug] = r;
    writeCache(rows);
    return mergePopupConfig(base, rows[slug]);
  } catch {
    return base;
  }
}
