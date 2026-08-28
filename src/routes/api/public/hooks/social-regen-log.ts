/**
 * Recebe o resultado de cada execução do worker de regeneração de imagens
 * sociais (`scripts/regenerate-social-images.mjs`) e persiste o histórico em
 * `ops_job_runs`, que é a fonte lida pelo /painel-auditorias em produção
 * (o JSON em public/ não existe no runtime de borda).
 */
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const bodySchema = z.object({
  actor: z.string().max(120).default("cli"),
  scope: z.union([z.array(z.string().max(80)).max(100), z.literal("all")]).default("all"),
  totals: z.object({
    ok: z.number().int().min(0),
    failed: z.number().int().min(0),
    skipped: z.number().int().min(0),
  }),
  results: z
    .array(
      z.object({
        client: z.string().max(80),
        status: z.string().max(20),
        socialImage: z.string().max(300).optional(),
        touchIcon: z.string().max(300).optional(),
        version: z.string().max(40).optional(),
        reason: z.string().max(300).optional(),
        source: z.string().max(300).optional(),
      }),
    )
    .max(200)
    .default([]),
});

export const Route = createFileRoute("/api/public/hooks/social-regen-log")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { requireCronSecret } = await import("./_cron-auth");
        const unauth = requireCronSecret(request);
        if (unauth) return unauth;

        let parsed;
        try {
          parsed = bodySchema.parse(await request.json());
        } catch {
          return Response.json({ ok: false, error: "invalid payload" }, { status: 400 });
        }

        const { runJob } = await import("@/lib/ops-jobs.server");
        const outcome = await runJob("social_images_regen", async () => ({
          actor: parsed.actor,
          scope: parsed.scope,
          totals: parsed.totals,
          results: parsed.results,
        }));

        return Response.json(outcome, { status: outcome.ok || outcome.skipped ? 200 : 500 });
      },
    },
  },
});
