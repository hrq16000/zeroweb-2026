/**
 * Fila de trabalho: marcas do portfólio que ainda não têm WhatsApp próprio
 * comprovado. Só leitura, só admin, número nunca sai do servidor.
 * Fonte única continua `portfolio_client_settings` + seed versionado.
 */
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import seed from "@/config/portfolio-admin-seed.json";

export type PendingDestinationRow = {
  client_key: string;
  slug: string;
  title: string;
  city: string;
  state: string;
  published: boolean;
  /** Estado da solicitação: sem sugestão, sugestão pendente, recusada. */
  request_status: "SEM_SUGESTAO" | "SUGESTAO_PENDENTE" | "SUGESTAO_RECUSADA";
  proposals_pending: number;
  last_activity_at: string | null;
};

type SeedProject = {
  slug: string;
  clientKey: string;
  title?: string;
  city?: string;
  state?: string;
};

const SEED = (Array.isArray(seed) ? seed : ((seed as { projects?: SeedProject[] }).projects ?? [])) as SeedProject[];

/* eslint-disable @typescript-eslint/no-explicit-any */
export const listPendingDestinations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ rows: PendingDestinationRow[]; cities: string[] }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: isAdmin }, { data: isSuper }] = await Promise.all([
      supabaseAdmin.rpc("has_role", { _user_id: context.userId, _role: "admin" }),
      supabaseAdmin.rpc("is_super_admin", { _uid: context.userId }),
    ]);
    if (!isAdmin && !isSuper) throw new Error("Acesso restrito a administradores.");

    const [{ data: settings }, { data: proposals }] = await Promise.all([
      (supabaseAdmin as any).from("portfolio_client_settings").select("*").limit(500),
      (supabaseAdmin as any)
        .from("portfolio_destination_proposals")
        .select("slug, client_key, status, created_at")
        .limit(2000),
    ]);

    const byKey = new Map<string, any>();
    for (const row of (settings ?? []) as any[]) byKey.set(row.client_key, row);

    const rows: PendingDestinationRow[] = [];
    const seenKeys = new Set<string>();

    const consider = (clientKey: string, slug: string, title: string, city: string, state: string) => {
      if (seenKeys.has(clientKey)) return;
      seenKeys.add(clientKey);
      const settingsRow = byKey.get(clientKey);
      const digits = String(settingsRow?.funnel_recipient ?? "").replace(/\D/g, "");
      if (digits.length >= 10) return; // já tem destino gravado

      const mine = ((proposals ?? []) as any[]).filter(
        (p) => p.client_key === clientKey || p.slug === slug,
      );
      const pending = mine.filter((p) => p.status === "PENDING");
      const rejected = mine.filter((p) => p.status === "REJECTED");
      const requestStatus: PendingDestinationRow["request_status"] = pending.length
        ? "SUGESTAO_PENDENTE"
        : rejected.length
          ? "SUGESTAO_RECUSADA"
          : "SEM_SUGESTAO";
      const lastActivity = mine
        .map((p) => p.created_at as string | null)
        .filter(Boolean)
        .sort()
        .pop() ?? (settingsRow?.updated_at ?? null);

      rows.push({
        client_key: clientKey,
        slug,
        title: title || settingsRow?.display_name || clientKey,
        city,
        state,
        published: Boolean(settingsRow?.published),
        request_status: requestStatus,
        proposals_pending: pending.length,
        last_activity_at: lastActivity,
      });
    };

    for (const project of SEED) {
      consider(project.clientKey, project.slug, project.title ?? "", project.city ?? "", project.state ?? "");
    }
    for (const row of (settings ?? []) as any[]) {
      consider(row.client_key, row.slug ?? row.client_key, row.display_name ?? "", "", "");
    }

    rows.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
    const cities = Array.from(new Set(rows.map((r) => r.city).filter(Boolean))).sort((a, b) =>
      a.localeCompare(b, "pt-BR"),
    );
    return { rows, cities };
  });
