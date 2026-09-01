/**
 * Painel SEO (/app/seo).
 *
 * Lê o snapshot do Search Console gerado por `bun run gsc:export`
 * (`src/data/gsc-latest.json`, espelhado em `seo-reports/` para leitura
 * humana), calcula priorização de otimizações e alertas de queda. Nenhum
 * dado é sintetizado: sem snapshot, o painel responde `status: "pending"`.
 *
 * O snapshot precisa viver dentro de `src/` para ser empacotado pelo build
 * do worker — arquivos fora da raiz do app não são resolvidos pelo bundler.
 */
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import snapshot from "@/data/gsc-latest.json";
import { posts } from "./blog-data";

export type GscRow = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number };

export type SeoSnapshot = {
  status: "ok" | "pending";
  siteUrl: string;
  range: { startDate: string; endDate: string };
  refreshedAt: string | null;
  totals: { clicks: number; impressions: number; ctr: number; position: number } | null;
  queries: GscRow[];
  pages: GscRow[];
  days: GscRow[];
};

export type Priority = {
  query: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  score: number;
  reason: string;
};

export type SeoAlert = {
  level: "warning" | "critical";
  metric: "clicks" | "impressions" | "position";
  message: string;
  variation: number;
};

export type ContentSeoRow = {
  slug: string;
  path: string;
  title: string;
  description: string;
  schemas: string[];
  issues: string[];
};

/** Prioriza consultas com volume relevante e CTR abaixo do esperado para a posição. */
function prioritize(queries: GscRow[]): Priority[] {
  return queries
    .map((r) => {
      const query = r.keys[0] ?? "";
      // CTR de referência decrescente por faixa de posição (heurística conservadora).
      const expected = r.position <= 3 ? 0.15 : r.position <= 10 ? 0.05 : 0.01;
      const gap = Math.max(0, expected - r.ctr);
      const score = Math.round(r.impressions * gap * 100) / 100;
      const reason =
        r.position > 10
          ? "Fora da primeira página: reforçar conteúdo e links internos."
          : gap > 0
            ? "CTR abaixo do esperado para a posição: revisar título e descrição."
            : "Desempenho dentro do esperado.";
      return { query, impressions: r.impressions, clicks: r.clicks, ctr: r.ctr, position: r.position, score, reason };
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
}

/** Compara os últimos 7 dias com os 7 anteriores e emite alertas de queda. */
function buildAlerts(days: GscRow[], thresholdPct: number): SeoAlert[] {
  const sorted = [...days].sort((a, b) => (a.keys[0] ?? "").localeCompare(b.keys[0] ?? ""));
  if (sorted.length < 14) return [];
  const prev = sorted.slice(-14, -7);
  const last = sorted.slice(-7);
  const sum = (rows: GscRow[], k: "clicks" | "impressions") => rows.reduce((s, r) => s + (r[k] ?? 0), 0);
  const avgPos = (rows: GscRow[]) => rows.reduce((s, r) => s + (r.position ?? 0), 0) / (rows.length || 1);

  const alerts: SeoAlert[] = [];
  for (const metric of ["clicks", "impressions"] as const) {
    const before = sum(prev, metric);
    const now = sum(last, metric);
    if (before === 0) continue;
    const variation = ((now - before) / before) * 100;
    if (variation <= -thresholdPct) {
      alerts.push({
        level: variation <= -(thresholdPct * 2) ? "critical" : "warning",
        metric,
        variation: Math.round(variation * 10) / 10,
        message: `${metric === "clicks" ? "Cliques" : "Impressões"} caíram ${Math.abs(Math.round(variation))}% nos últimos 7 dias (${now} vs ${before}).`,
      });
    }
  }
  const posBefore = avgPos(prev);
  const posNow = avgPos(last);
  if (posBefore > 0 && posNow - posBefore >= 3) {
    alerts.push({
      level: "warning",
      metric: "position",
      variation: Math.round((posNow - posBefore) * 10) / 10,
      message: `Posição média piorou ${(posNow - posBefore).toFixed(1)} posições (de ${posBefore.toFixed(1)} para ${posNow.toFixed(1)}).`,
    });
  }
  return alerts;
}

/** Auditoria estática dos metadados do cluster de conteúdo. */
function contentRows(): ContentSeoRow[] {
  return posts.map((p) => {
    const issues: string[] = [];
    if (p.title.length > 60) issues.push(`Title com ${p.title.length} caracteres (ideal < 60).`);
    if (p.excerpt.length > 160) issues.push(`Description com ${p.excerpt.length} caracteres (ideal < 160).`);
    if (p.excerpt.length < 70) issues.push("Description curta demais (< 70 caracteres).");
    if (!p.faq?.length) issues.push("Sem FAQ — não gera FAQPage.");
    if (!p.landingLink) issues.push("Sem link interno para página de conversão.");
    const schemas = ["BlogPosting", "BreadcrumbList", ...(p.faq?.length ? ["FAQPage"] : [])];
    return {
      slug: p.slug,
      path: `/blog/${p.slug}`,
      title: p.title,
      description: p.excerpt,
      schemas,
      issues,
    };
  });
}

export const getSeoDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { alertThresholdPct?: number } | undefined) => ({
    alertThresholdPct: Math.min(90, Math.max(5, Number(data?.alertThresholdPct ?? 20))),
  }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const allowed = (roles ?? []).some((r) => r.role === "admin" || r.role === "super_admin");
    if (!allowed) throw new Error("forbidden");

    const snap = snapshot as unknown as SeoSnapshot;
    const hasData = Boolean(snap.refreshedAt) && (snap.queries?.length ?? 0) > 0;

    return {
      status: hasData ? ("ok" as const) : ("pending" as const),
      siteUrl: snap.siteUrl || "https://0web.com.br/",
      range: snap.range ?? { startDate: "", endDate: "" },
      refreshedAt: snap.refreshedAt ?? null,
      totals: snap.totals ?? null,
      queries: (snap.queries ?? []).slice(0, 50),
      pages: (snap.pages ?? []).slice(0, 50),
      priorities: prioritize(snap.queries ?? []),
      alerts: buildAlerts(snap.days ?? [], data.alertThresholdPct),
      alertThresholdPct: data.alertThresholdPct,
      content: contentRows(),
    };
  });
