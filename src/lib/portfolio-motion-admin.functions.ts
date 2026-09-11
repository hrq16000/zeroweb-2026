import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { sanitizeMotionSettings, type PortfolioMotionSettings } from "@/lib/portfolio-runtime";

/**
 * Painel de movimento por landing.
 *
 * Isto é REGULAGEM, não redesign: intensidade, teto de parallax, hover,
 * contadores e velocidade. A composição, o conteúdo e o perfil autoral de
 * cada projeto continuam no código do cliente — o painel só limita ou
 * desliga o que já foi declarado ali.
 */

export type PortfolioMotionRow = {
  clientKey: string;
  slug: string;
  displayName: string;
  motion: PortfolioMotionSettings | null;
};

const saveSchema = z.object({
  client_key: z.string().trim().min(2).max(80).regex(/^[a-z0-9][a-z0-9_-]*$/),
  motion: z
    .object({
      intensity: z.enum(["SUBTLE", "BALANCED", "EXPRESSIVE", "IMMERSIVE"]).optional(),
      parallaxMax: z.number().min(0).max(48).optional(),
      hover: z.boolean().optional(),
      counters: z.boolean().optional(),
      speed: z.number().min(0.5).max(2).optional(),
    })
    .nullable(),
});

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [{ data: isAdmin }, { data: isSuper }] = await Promise.all([
    supabaseAdmin.rpc("has_role", { _user_id: userId, _role: "admin" }),
    supabaseAdmin.rpc("is_super_admin", { _uid: userId }),
  ]);
  if (!isAdmin && !isSuper) throw new Error("Acesso restrito a administradores.");
  return supabaseAdmin;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const listPortfolioMotionSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ rows: PortfolioMotionRow[] }> => {
    const admin = await assertAdmin(context.userId);
    const { data, error } = await (admin as any)
      .from("portfolio_client_settings")
      .select("client_key, slug, display_name, motion_settings")
      .order("client_key", { ascending: true })
      .limit(500);
    if (error) throw new Error(error.message);
    return {
      rows: ((data ?? []) as any[]).map((row) => ({
        clientKey: row.client_key,
        slug: row.slug ?? "",
        displayName: row.display_name ?? "",
        motion: sanitizeMotionSettings(row.motion_settings) ?? null,
      })),
    };
  });

/** Salva a regulagem. `motion: null` remove o ajuste e devolve o perfil do projeto. */
export const savePortfolioMotionSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => saveSchema.parse(data))
  .handler(async ({ data, context }): Promise<{ row: PortfolioMotionRow }> => {
    const admin = await assertAdmin(context.userId);
    const clean = data.motion ? (sanitizeMotionSettings(data.motion) ?? null) : null;
    const { data: existing } = await (admin as any)
      .from("portfolio_client_settings")
      .select("slug, motion_settings")
      .eq("client_key", data.client_key)
      .maybeSingle();

    const { data: saved, error } = await (admin as any)
      .from("portfolio_client_settings")
      .upsert(
        {
          client_key: data.client_key,
          slug: existing?.slug ?? data.client_key,
          motion_settings: clean,
          updated_by: context.userId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "client_key" },
      )
      .select("client_key, slug, display_name, motion_settings")
      .single();
    if (error) throw new Error(error.message);

    await (admin as any).from("portfolio_client_settings_history").insert([
      {
        client_key: data.client_key,
        field: "motion_settings",
        old_value: existing?.motion_settings ? JSON.stringify(existing.motion_settings) : null,
        new_value: clean ? JSON.stringify(clean) : null,
        actor: context.userId,
      },
    ]);

    return {
      row: {
        clientKey: saved.client_key,
        slug: saved.slug ?? "",
        displayName: saved.display_name ?? "",
        motion: sanitizeMotionSettings(saved.motion_settings) ?? null,
      },
    };
  });
