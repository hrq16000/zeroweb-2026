import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const AUDITED_ENTITIES = ["lead_submissions", "service_catalog"] as const;
type AuditedEntity = (typeof AUDITED_ENTITIES)[number];

async function assertAuditAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [{ data: isSuper }, { data: adminRole }] = await Promise.all([
    supabaseAdmin.rpc("is_super_admin", { _uid: userId }),
    supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle(),
  ]);
  if (!isSuper && !adminRole) throw new Error("forbidden");
}

/**
 * Records metadata only. Never place lead content, contact data, tokens, or
 * free-form notes in this log: the audit trail must not become a second PII
 * store.
 */
export async function recordSensitiveAudit(input: {
  actorId: string;
  action: "sensitive.read" | "sensitive.write";
  entity: AuditedEntity;
  entityId?: string | null;
  meta?: Record<string, unknown>;
}) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.from("audit_logs").insert({
    actor_id: input.actorId,
    action: input.action,
    entity: input.entity,
    entity_id: input.entityId ?? null,
    meta: (input.meta ?? {}) as never,
  });
  if (error) throw new Error(`Não foi possível registrar a auditoria: ${error.message}`);
}

const filtersSchema = z
  .object({
    entity: z.enum(AUDITED_ENTITIES).optional(),
    action: z.enum(["sensitive.read", "sensitive.write"]).optional(),
    limit: z.number().int().min(1).max(500).default(100),
  })
  .default({});

export type SensitiveAuditRow = {
  id: string;
  actor_id: string | null;
  action: "sensitive.read" | "sensitive.write";
  entity: AuditedEntity;
  entity_id: string | null;
  meta: Record<string, string | number | boolean | null> | null;
  created_at: string;
};

export const listSensitiveAuditTrail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => filtersSchema.parse(input ?? {}))
  .handler(async ({ data, context }) => {
    const userId = (context as { userId: string }).userId;
    await assertAuditAdmin(userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let query = supabaseAdmin
      .from("audit_logs")
      .select("id,actor_id,action,entity,entity_id,meta,created_at")
      .in("action", ["sensitive.read", "sensitive.write"])
      .in("entity", [...AUDITED_ENTITIES])
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.entity) query = query.eq("entity", data.entity);
    if (data.action) query = query.eq("action", data.action);
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);

    await recordSensitiveAudit({
      actorId: userId,
      action: "sensitive.read",
      entity: "lead_submissions",
      meta: { scope: "audit_trail", result_count: rows?.length ?? 0 },
    });
    return { rows: (rows ?? []) as SensitiveAuditRow[] };
  });
