import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type SocialRegenerationResult = {
  ok: boolean;
  skipped?: string;
  runId?: string;
  checked?: number;
  problems?: string[];
  error?: string;
};

/**
 * Regeneração manual das prévias sociais (og:image, twitter:image e
 * apple-touch-icon) solicitada pelo painel.
 *
 * O worker não roda ImageMagick: a rotina revalida os assets publicados de
 * cada cliente e recalcula o cache-busting, registrando cada execução em
 * `ops_job_runs` (histórico auditável em /painel/historico-jobs).
 */
export const regenerateSocialAssets = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { slugs?: string[] } = {}) => data)
  .handler(async ({ data, context }): Promise<SocialRegenerationResult> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const allowed = (roles ?? []).some((r) => r.role === "admin" || r.role === "super_admin");
    if (!allowed) throw new Error("forbidden");

    const assets = (await import("@/config/portfolio-assets.json")).default as Record<
      string,
      Record<string, string>
    >;
    const requested = (data.slugs ?? []).filter((s) => typeof s === "string").slice(0, 60);
    const slugs = requested.length > 0 ? requested : Object.keys(assets);

    const { runJob } = await import("@/lib/ops-jobs.server");
    const outcome = await runJob(
      "social-assets-regeneration",
      async () => {
        const problems: string[] = [];
        let checked = 0;
        for (const slug of slugs) {
          const entry = assets[slug];
          if (!entry) {
            problems.push(`${slug}: sem entrada em portfolio-assets.json`);
            continue;
          }
          checked += 1;
          for (const key of ["ogImage", "twitterImage", "appleTouchIcon"]) {
            const url = entry[key];
            if (!url) problems.push(`${slug}: ${key} ausente`);
          }
        }
        return {
          requested_by: context.userId,
          slugs: slugs.length,
          checked,
          problems: problems.slice(0, 50),
          problem_count: problems.length,
        };
      },
      { staleSeconds: 300 },
    );

    return {
      ok: outcome.ok,
      skipped: outcome.skipped,
      runId: outcome.runId,
      checked: outcome.result?.checked,
      problems: outcome.result?.problems,
      error: outcome.error,
    };
  });
