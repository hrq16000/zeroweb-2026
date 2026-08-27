import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const rulesSchema = z
  .object({
    timerMs: z.number().int().min(0).max(600_000).optional(),
    fallbackMs: z.number().int().min(0).max(600_000).optional(),
    scrollPct: z.number().min(0).max(1).optional(),
    oncePerSession: z.boolean().optional(),
    startsAt: z.string().nullable().optional(),
    endsAt: z.string().nullable().optional(),
  })
  .default({});

const thresholdsSchema = z
  .object({
    minImpressions: z.number().int().min(0).max(1_000_000).optional(),
    minCtr: z.number().min(0).max(1).optional(),
    minConversionRate: z.number().min(0).max(1).optional(),
  })
  .default({});

const notifyChannelsSchema = z
  .object({
    slack_webhook_url: z.string().url().max(500).nullable().optional(),
    email: z.string().email().max(200).nullable().optional(),
    webhook_url: z.string().url().max(500).nullable().optional(),
  })
  .default({});

const upsertSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9-]+$/, "slug deve conter apenas letras minúsculas, números e hífen"),
  enabled: z.boolean().default(true),
  kicker: z.string().max(120).nullable().optional(),
  title: z.string().max(300).nullable().optional(),
  description: z.string().max(600).nullable().optional(),
  highlight: z.string().max(80).nullable().optional(),
  cta_label: z.string().max(120).nullable().optional(),
  dismiss_label: z.string().max(80).nullable().optional(),
  funnel_slug: z
    .string()
    .max(64)
    .regex(/^[a-z0-9-]*$/)
    .nullable()
    .optional(),
  bullets: z.array(z.string().max(240)).max(6).nullable().optional(),
  rules: rulesSchema,
  alert_thresholds: thresholdsSchema,
  /** 0..1 — reduz temporariamente a geração de eventos (staging). */
  sample_rate: z.number().min(0).max(1).default(1),
  simulation_enabled: z.boolean().default(false),
  notify_channels: notifyChannelsSchema,
});

export type PopupConfigAdminRow = z.infer<typeof upsertSchema> & {
  id: string;
  updated_at: string;
};

async function assertAdmin(context: { supabase: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown }> }; userId: string }) {
  const { data } = await context.supabase.rpc("is_admin_or_super", { _uid: context.userId });
  if (data !== true) throw new Error("Forbidden");
}

/** Lista todas as configurações de pop-up (somente admin). */
export const listPopupConfigs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PopupConfigAdminRow[]> => {
    await assertAdmin(context as never);
    const { data, error } = await context.supabase
      .from("popup_configs")
      .select("*")
      .order("slug", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as PopupConfigAdminRow[];
  });

/** Cria ou atualiza a configuração de um slug (somente admin, com auditoria no banco). */
export const upsertPopupConfig = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => upsertSchema.parse(data))
  .handler(async ({ data, context }): Promise<PopupConfigAdminRow> => {
    await assertAdmin(context as never);
    const { data: row, error } = await context.supabase
      .from("popup_configs")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .upsert({ ...(data as any), updated_by: context.userId }, { onConflict: "slug" })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row as unknown as PopupConfigAdminRow;
  });

/** Remove a configuração de um slug, voltando ao padrão versionado. */
export const deletePopupConfig = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(2).max(64) }).parse(data))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    await assertAdmin(context as never);
    const { error } = await context.supabase.from("popup_configs").delete().eq("slug", data.slug);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
