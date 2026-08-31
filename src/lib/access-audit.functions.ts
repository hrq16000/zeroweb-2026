import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ENTITIES = ["lead_submissions", "service_catalog"] as const;

const FiltersSchema = z
  .object({
    entity: z.enum([...ENTITIES, "all"]).default("all"),
    kind: z.enum(["all", "read", "write"]).default("all"),
    limit: z.number().int().min(1).max(500).default(100),
  })
  .partial();

export const listAccessAudit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => FiltersSchema.parse(i ?? {}))
  .handler(async ({ data, context }) => {
    const userId = (context as { userId: string }).userId;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: isSuper } = await supabaseAdmin.rpc("is_super_admin", { _uid: userId });
    const { data: isAdmin } = await supabaseAdmin.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!isSuper && !isAdmin) throw new Error("Acesso negado");

    let q = supabaseAdmin
      .from("audit_logs")
      .select("id, created_at, action, entity, entity_id, actor_id, meta")
      .in("entity", [...ENTITIES])
      .order("created_at", { ascending: false })
      .limit(data.limit ?? 100);

    if (data.entity && data.entity !== "all") q = q.eq("entity", data.entity);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);

    let list = (rows ?? []).map((r) => ({
      ...r,
      kind: /\.(read|list|detail)$/.test(String(r.action)) ? "read" : "write",
    }));
    if (data.kind && data.kind !== "all") list = list.filter((r) => r.kind === data.kind);

    // Resolve actor display without exposing e-mails.
    const actorIds = Array.from(new Set(list.map((r) => r.actor_id).filter(Boolean))) as string[];
    const actors: Record<string, string> = {};
    if (actorIds.length > 0) {
      const { data: profiles } = await supabaseAdmin
        .from("profiles")
        .select("id, display_name, user_ref")
        .in("id", actorIds);
      for (const p of profiles ?? []) {
        actors[p.id as string] =
          (p.user_ref as string | null) ?? (p.display_name as string | null) ?? String(p.id).slice(0, 8);
      }
    }

    return {
      rows: list.map((r) => ({
        id: r.id as string,
        created_at: r.created_at as string,
        action: r.action as string,
        entity: r.entity as string,
        entity_id: (r.entity_id as string | null) ?? null,
        kind: r.kind as "read" | "write",
        actor: r.actor_id ? (actors[r.actor_id as string] ?? String(r.actor_id).slice(0, 8)) : "sistema",
        meta: JSON.stringify(r.meta ?? {}),
      })),
      total: list.length,
    };
  });
