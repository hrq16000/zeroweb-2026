import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type ClientSettings = {
  client_key: string;
  slug: string;
  display_name: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  canonical_url: string;
  social_image_url: string;
  funnel_recipient_masked: string;
  funnel_configured: boolean;
  funnel_enabled: boolean;
  published: boolean;
  updated_at: string;
};

export type SettingsHistoryRow = {
  id: string;
  client_key: string;
  field: string;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
};

const EDITABLE = [
  "slug",
  "display_name",
  "seo_title",
  "seo_description",
  "seo_keywords",
  "canonical_url",
  "social_image_url",
  "funnel_recipient",
  "funnel_enabled",
  "published",
] as const;

const upsertSchema = z.object({
  client_key: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9][a-z0-9_-]*$/, "clientKey deve ser minúsculo, sem espaços"),
  slug: z.string().trim().max(120).optional(),
  display_name: z.string().trim().max(160).optional(),
  seo_title: z.string().trim().max(160).optional(),
  seo_description: z.string().trim().max(400).optional(),
  seo_keywords: z.string().trim().max(400).optional(),
  canonical_url: z.string().trim().max(300).optional(),
  social_image_url: z.string().trim().max(300).optional(),
  /** Número/destinatário do funil. Nunca é devolvido em texto puro ao cliente. */
  funnel_recipient: z.string().trim().max(60).optional(),
  funnel_enabled: z.boolean().optional(),
  published: z.boolean().optional(),
});

/** Mascara o destinatário do funil: nunca expomos o número real no bundle/painel. */
export function maskRecipient(value: string): string {
  const digits = (value || "").replace(/\D/g, "");
  if (!digits) return "";
  return `••••${digits.slice(-4)}`;
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

/* eslint-disable @typescript-eslint/no-explicit-any */
function toPublic(row: any): ClientSettings {
  const recipient = String(row.funnel_recipient ?? "");
  return {
    client_key: row.client_key,
    slug: row.slug ?? "",
    display_name: row.display_name ?? "",
    seo_title: row.seo_title ?? "",
    seo_description: row.seo_description ?? "",
    seo_keywords: row.seo_keywords ?? "",
    canonical_url: row.canonical_url ?? "",
    social_image_url: row.social_image_url ?? "",
    funnel_recipient_masked: maskRecipient(recipient),
    funnel_configured: recipient.replace(/\D/g, "").length >= 10,
    funnel_enabled: Boolean(row.funnel_enabled),
    published: Boolean(row.published),
    updated_at: row.updated_at,
  };
}

/** Lista as configurações por cliente (SEO + estado do funil), sem expor o número real. */
export const listClientSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ rows: ClientSettings[] }> => {
    const admin = await assertAdmin(context.userId);
    const { data, error } = await (admin as any)
      .from("portfolio_client_settings")
      .select("*")
      .order("client_key", { ascending: true })
      .limit(500);
    if (error) throw new Error(error.message);
    return { rows: ((data ?? []) as any[]).map(toPublic) };
  });

/** Cria/atualiza a configuração de um cliente e grava histórico campo a campo. */
export const upsertClientSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => upsertSchema.parse(data))
  .handler(async ({ data, context }): Promise<{ row: ClientSettings }> => {
    const admin = await assertAdmin(context.userId);
    const { data: existing } = await (admin as any)
      .from("portfolio_client_settings")
      .select("*")
      .eq("client_key", data.client_key)
      .maybeSingle();

    const patch: Record<string, unknown> = { updated_by: context.userId, updated_at: new Date().toISOString() };
    const history: Array<Record<string, unknown>> = [];
    for (const field of EDITABLE) {
      const next = (data as Record<string, unknown>)[field];
      if (next === undefined) continue;
      const prev = existing ? existing[field] : undefined;
      if (String(prev ?? "") === String(next)) continue;
      patch[field] = next;
      const sensitive = field === "funnel_recipient";
      history.push({
        client_key: data.client_key,
        field,
        old_value: sensitive ? maskRecipient(String(prev ?? "")) : prev === undefined ? null : String(prev),
        new_value: sensitive ? maskRecipient(String(next)) : String(next),
        actor: context.userId,
      });
    }

    const { data: saved, error } = await (admin as any)
      .from("portfolio_client_settings")
      .upsert({ client_key: data.client_key, slug: data.slug ?? existing?.slug ?? data.client_key, ...patch }, { onConflict: "client_key" })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    if (history.length) {
      await (admin as any).from("portfolio_client_settings_history").insert(history);
    }
    const publicationChanged = data.published !== undefined && Boolean(saved.published) !== Boolean(existing?.published);
    if (publicationChanged) {
      const { syncPortfolioSitemapAndIndexing } = await import("@/lib/portfolio-sitemap.server");
      await syncPortfolioSitemapAndIndexing(admin, Boolean(saved.published) ? [saved.slug] : []);
    }
    return { row: toPublic(saved) };
  });

/** Histórico auditável das alterações (valores sensíveis já mascarados). */
export const listClientSettingsHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ client_key: z.string().trim().max(80).optional(), limit: z.number().int().min(1).max(200).default(100) })
      .parse(data ?? {}),
  )
  .handler(async ({ data, context }): Promise<{ rows: SettingsHistoryRow[] }> => {
    const admin = await assertAdmin(context.userId);
    let query = (admin as any)
      .from("portfolio_client_settings_history")
      .select("id, client_key, field, old_value, new_value, created_at")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.client_key) query = query.eq("client_key", data.client_key);
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return { rows: (rows ?? []) as SettingsHistoryRow[] };
  });
