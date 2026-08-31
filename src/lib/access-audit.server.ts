/**
 * Server-only helper to record access (read/write) metadata into audit_logs.
 *
 * PRIVACY: never pass PII (names, e-mails, phones, notes, message bodies).
 * Only counts, changed field NAMES, filter keys, operation types and
 * technical IDs are allowed in `meta`.
 */

export type AuditEntity = "lead_submissions" | "service_catalog";

export type AuditMeta = Record<string, string | number | boolean | string[] | null>;

/** Keys that must never reach the audit trail, even by accident. */
const FORBIDDEN_META_KEYS = new Set([
  "name",
  "email",
  "phone",
  "notes",
  "note",
  "message",
  "company",
  "answers",
  "payload",
  "payload_json",
  "content",
  "body",
]);

export function sanitizeAuditMeta(meta: AuditMeta): AuditMeta {
  const out: AuditMeta = {};
  for (const [k, v] of Object.entries(meta)) {
    if (FORBIDDEN_META_KEYS.has(k.toLowerCase())) continue;
    if (typeof v === "string" && v.length > 120) {
      out[k] = v.slice(0, 120);
      continue;
    }
    out[k] = v;
  }
  return out;
}

/**
 * Best-effort audit write. Never throws: an audit failure must not break the
 * operational flow it observes.
 */
export async function recordAccessAudit(params: {
  actorId: string;
  action: string;
  entity: AuditEntity;
  entityId?: string | null;
  meta?: AuditMeta;
}): Promise<void> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("audit_logs").insert({
      actor_id: params.actorId,
      action: params.action,
      entity: params.entity,
      entity_id: params.entityId ?? null,
      meta: sanitizeAuditMeta(params.meta ?? {}),
    });
  } catch (err) {
    if (process.env["NODE_ENV"] !== "production") {
      console.warn("[access-audit] falha ao registrar auditoria:", (err as Error)?.message);
    }
  }
}
