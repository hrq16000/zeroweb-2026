import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import adminSeed from "@/config/portfolio-admin-seed.json";

/**
 * Leitura do perfil de qualidade das landings (tela de priorização).
 *
 * Fontes reais, nada inferido:
 *  - `docs/portfolio/quality-matrix/<slug>.json` — avaliação editorial feita a
 *    mão no padrão da matriz (só existe para projetos já avaliados);
 *  - `src/config/portfolio-admin-seed.json` — conformidade técnica calculada
 *    pelo contrato único;
 *  - `portfolio_client_settings` — publicação e destino de funil configurado.
 *
 * Projeto sem avaliação aparece como "não avaliado". Nunca preenchemos
 * visualDensity/editorialDepth/proofLevel por estimativa.
 */
export type PortfolioQualityRow = {
  slug: string;
  clientKey: string;
  title: string;
  city: string | null;
  segment: string | null;
  /** COMPLETE | PARTIAL | LEGACY, vindo do contrato de conformidade. */
  conformance: string;
  blocking: boolean;
  issues: string[];
  published: boolean;
  funnelConfigured: boolean;
  evaluated: boolean;
  score: number | null;
  visualDensity: string | null;
  editorialDepth: string | null;
  proofLevel: string | null;
  mediaRichness: string | null;
  motionIntensity: string | null;
  conversionIntensity: string | null;
  evaluatedAt: string | null;
};

type SeedProject = {
  slug: string;
  clientKey?: string;
  title?: string;
  city?: string | null;
  segment?: string | null;
  status?: string;
  blocking?: unknown;
  issues?: unknown;
  published?: boolean;
};

const matrices = import.meta.glob("/docs/portfolio/quality-matrix/*.json", {
  eager: true,
}) as Record<string, { default?: unknown } | unknown>;

function matrixBySlug(): Map<string, any> {
  const map = new Map<string, any>();
  for (const [path, mod] of Object.entries(matrices)) {
    const data = ((mod as { default?: unknown }).default ?? mod) as any;
    const slug = data?.slug ?? path.split("/").pop()?.replace(/\.json$/, "");
    if (slug) map.set(String(slug), data);
  }
  return map;
}

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [{ data: isAdmin }, { data: isSuper }] = await Promise.all([
    supabaseAdmin.rpc("has_role", { _user_id: userId, _role: "admin" }),
    supabaseAdmin.rpc("is_super_admin", { _uid: userId }),
  ]);
  if (!isAdmin && !isSuper) throw new Error("Acesso restrito a administradores.");
  return supabaseAdmin;
}

export const listPortfolioQuality = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ rows: PortfolioQualityRow[] }> => {
    const admin = await assertAdmin(context.userId);
    const { data: settings } = await (admin as any)
      .from("portfolio_client_settings")
      .select("client_key,slug,published,funnel_recipient,lifecycle_status")
      .limit(500);

    const byKey = new Map<string, any>();
    for (const row of (settings ?? []) as any[]) {
      byKey.set(String(row.client_key), row);
      if (row.slug) byKey.set(String(row.slug), row);
    }

    const evaluations = matrixBySlug();
    const projects = ((adminSeed as unknown as { projects?: SeedProject[] }).projects ?? []) as SeedProject[];

    const rows: PortfolioQualityRow[] = projects.map((project) => {
      const clientKey = project.clientKey ?? project.slug;
      const settingsRow = byKey.get(clientKey) ?? byKey.get(project.slug);
      const matrix = evaluations.get(project.slug);
      const profile = matrix?.qualityProfile ?? {};
      const digits = String(settingsRow?.funnel_recipient ?? "").replace(/\D/g, "");
      return {
        slug: project.slug,
        clientKey,
        title: project.title ?? project.slug,
        city: project.city ?? null,
        segment: project.segment ?? null,
        conformance: project.status ?? "LEGACY",
        blocking: Array.isArray(project.blocking)
          ? project.blocking.length > 0
          : Boolean(project.blocking),
        issues: Array.isArray(project.issues) ? project.issues.map(String) : [],
        published: Boolean(settingsRow ? settingsRow.published : project.published),
        funnelConfigured: digits.length >= 10,
        evaluated: Boolean(matrix),
        score: typeof matrix?.score?.total === "number" ? matrix.score.total : null,
        visualDensity: profile.visualDensity ?? null,
        editorialDepth: profile.editorialDepth ?? null,
        proofLevel: profile.proofLevel ?? null,
        mediaRichness: profile.mediaRichness ?? null,
        motionIntensity: profile.motionIntensity ?? null,
        conversionIntensity: profile.conversionIntensity ?? null,
        evaluatedAt: matrix?.evaluatedAt ?? null,
      };
    });

    rows.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
    return { rows };
  });
