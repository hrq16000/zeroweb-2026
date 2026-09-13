import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import adminSeed from "@/config/portfolio-admin-seed.json";
import { managedStatus, sanitizeManagedProject } from "@/lib/portfolio-managed";

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
  canPublish: boolean;
  publishBlockers: string[];
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

function matrixPublishBlockers(matrix: any): string[] {
  if (!matrix) return ["Avaliação de qualidade ausente"];
  const blockers: string[] = [];
  if (matrix.technicalPass !== true) blockers.push("Validação técnica pendente");
  if (matrix.editorialPass !== true) blockers.push("Validação editorial pendente");
  const profile = matrix.qualityProfile ?? {};
  if (!profile.visualDensity) blockers.push("Densidade visual não avaliada");
  if (!profile.editorialDepth) blockers.push("Profundidade editorial não avaliada");
  if (!profile.proofLevel) blockers.push("Nível de prova não avaliado");
  return blockers;
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

    const seedSlugs = new Set(projects.map((project) => project.slug));
    const rows: PortfolioQualityRow[] = projects.map((project) => {
      const clientKey = project.clientKey ?? project.slug;
      const settingsRow = byKey.get(clientKey) ?? byKey.get(project.slug);
      const matrix = evaluations.get(project.slug);
      const profile = matrix?.qualityProfile ?? {};
      const digits = String(settingsRow?.funnel_recipient ?? "").replace(/\D/g, "");
      const publishBlockers = [
        ...matrixPublishBlockers(matrix),
        ...(Array.isArray(project.blocking) ? project.blocking.map(String) : []),
        ...(digits.length >= 10 ? [] : ["Destino do funil não comprovado"]),
      ];
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
        canPublish: publishBlockers.length === 0,
        publishBlockers,
      };
    });

    for (const settingsRow of (settings ?? []) as any[]) {
      if (settingsRow.project_kind !== "managed" || seedSlugs.has(String(settingsRow.slug))) continue;
      const project = sanitizeManagedProject(settingsRow);
      if (!project) continue;
      const matrix = evaluations.get(project.slug);
      const profile = matrix?.qualityProfile ?? {};
      const digits = String(settingsRow.funnel_recipient ?? "").replace(/\D/g, "");
      const status = managedStatus(project);
      const publishBlockers = [
        ...matrixPublishBlockers(matrix),
        ...status.blockers.map((issue) => issue.message),
        ...(digits.length >= 10 ? [] : ["Destino do funil não comprovado"]),
      ];
      rows.push({
        slug: project.slug,
        clientKey: project.clientKey,
        title: project.displayName,
        city: project.city || null,
        segment: project.segment || null,
        conformance: status.state,
        blocking: status.blockers.length > 0,
        issues: status.issues.map((issue) => issue.code),
        published: project.published,
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
        canPublish: publishBlockers.length === 0,
        publishBlockers,
      });
    }

    rows.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
    return { rows };
  });

/** Publicação unitária: só altera o estado após todos os gates verificáveis passarem. */
export const publishPortfolioQuality = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ slug: z.string().trim().min(2).max(120) }).parse(data))
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context.userId);
    const { data: settingsRow, error } = await (admin as any)
      .from("portfolio_client_settings")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!settingsRow) throw new Error("Projeto ainda não foi importado para a fonte administrável.");

    const blockers = matrixPublishBlockers(matrixBySlug().get(data.slug));
    const digits = String(settingsRow.funnel_recipient ?? "").replace(/\D/g, "");
    if (digits.length < 10) blockers.push("Destino do funil não comprovado");

    if (settingsRow.project_kind === "managed") {
      const project = sanitizeManagedProject(settingsRow);
      if (!project) blockers.push("Dados do projeto inválidos");
      else blockers.push(...managedStatus(project).blockers.map((issue) => issue.message));
    } else {
      const seed = ((adminSeed as { projects?: SeedProject[] }).projects ?? []).find(
        (project) => project.slug === data.slug,
      );
      if (!seed) blockers.push("Projeto ausente do registro versionado");
      else if (Array.isArray(seed.blocking)) blockers.push(...seed.blocking.map(String));
    }

    if (blockers.length > 0) {
      throw new Error(`Publicação bloqueada: ${Array.from(new Set(blockers)).join("; ")}.`);
    }

    const { error: updateError } = await (admin as any)
      .from("portfolio_client_settings")
      .update({
        published: true,
        lifecycle_status: "published",
        updated_by: context.userId,
        updated_at: new Date().toISOString(),
        content_version: Number(settingsRow.content_version ?? 0) + 1,
      })
      .eq("client_key", settingsRow.client_key);
    if (updateError) throw new Error(updateError.message);

    await (admin as any).from("portfolio_client_settings_history").insert({
      client_key: settingsRow.client_key,
      field: "published",
      old_value: String(Boolean(settingsRow.published)),
      new_value: "true",
      actor: context.userId,
    });
    const { syncPortfolioSitemapAndIndexing } = await import("@/lib/portfolio-sitemap.server");
    await syncPortfolioSitemapAndIndexing(admin as any, [data.slug]);
    return { slug: data.slug, published: true };
  });
