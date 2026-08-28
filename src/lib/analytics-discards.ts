/**
 * Leitura dos eventos de analytics descartados (`analytics_event_discarded`).
 *
 * Usado pelo `/painel-auditorias` para medir perda de telemetria por rota
 * numa janela de tempo configurável e disparar alerta acima de um limiar.
 * A leitura de `analytics_events` é restrita a admins/membros de portal pela RLS.
 */
import { supabase } from "@/integrations/supabase/client";
import { DISCARD_EVENT_NAME } from "@/lib/analytics-queue";

export type DiscardRow = {
  path: string;
  originalEventName: string;
  reason: string;
  count: number;
  lastSeen: string;
};

export type DiscardSummary = {
  windowHours: number;
  total: number;
  rows: DiscardRow[];
  /** Verdadeiro quando o total na janela cruza o limiar configurado. */
  alert: boolean;
  threshold: number;
  fetchedAt: string;
};

export const DEFAULT_DISCARD_THRESHOLD = 20;

export async function fetchAnalyticsDiscards(
  windowHours = 24,
  threshold = DEFAULT_DISCARD_THRESHOLD,
): Promise<DiscardSummary | null> {
  const since = new Date(Date.now() - windowHours * 3_600_000).toISOString();
  const { data, error } = await supabase
    .from("analytics_events")
    .select("path, created_at, metadata_json")
    .eq("event_name", DISCARD_EVENT_NAME)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(5000);
  if (error) return null;

  const grouped = new Map<string, DiscardRow>();
  for (const row of data ?? []) {
    const meta = (row.metadata_json ?? {}) as { reason?: string; original_event_name?: string };
    const path = (row.path as string) || "(sem rota)";
    const originalEventName = meta.original_event_name ?? "(desconhecido)";
    const reason = meta.reason ?? "invalid_event_name";
    const key = `${path}|${originalEventName}|${reason}`;
    const current = grouped.get(key);
    const createdAt = String(row.created_at);
    if (current) {
      current.count += 1;
      if (createdAt > current.lastSeen) current.lastSeen = createdAt;
    } else {
      grouped.set(key, { path, originalEventName, reason, count: 1, lastSeen: createdAt });
    }
  }

  const rows = [...grouped.values()].sort((a, b) => b.count - a.count);
  const total = rows.reduce((sum, r) => sum + r.count, 0);
  return {
    windowHours,
    total,
    rows,
    alert: total >= threshold,
    threshold,
    fetchedAt: new Date().toISOString(),
  };
}
