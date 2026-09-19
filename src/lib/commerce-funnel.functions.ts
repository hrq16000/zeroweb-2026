import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  aggregateCommerceFunnel,
  COMMERCE_EVENT_NAMES,
  type CommerceEventRow,
} from "@/lib/commerce-funnel";

const Input = z.object({
  days: z.number().int().min(1).max(90).default(30),
});

async function assertCommerceAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roles } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const allowed = (roles ?? []).some(
    (row) => row.role === "admin" || row.role === "super_admin",
  );
  if (!allowed) throw new Error("forbidden");
  return supabaseAdmin;
}

export const getCommerceFunnelMetrics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => Input.parse(input ?? {}))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await assertCommerceAdmin(context.userId);
    const since = new Date(Date.now() - data.days * 24 * 60 * 60 * 1000).toISOString();
    const { data: rows, error } = await supabaseAdmin
      .from("analytics_events")
      .select("event_name,session_id,visitor_id,metadata_json,created_at")
      .in("event_name", [...COMMERCE_EVENT_NAMES])
      .gte("created_at", since)
      .order("created_at", { ascending: true })
      .limit(10000);

    if (error) throw error;
    const events = (rows ?? []) as CommerceEventRow[];
    return {
      days: data.days,
      since,
      truncated: events.length >= 10000,
      metrics: aggregateCommerceFunnel(events),
    };
  });
