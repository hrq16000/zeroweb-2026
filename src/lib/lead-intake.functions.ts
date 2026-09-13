import { createServerFn } from "@tanstack/react-start";
import { getRequest, getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

const leadInput = z.object({
  name: z.string().max(200).nullable().optional(),
  email: z.string().email().max(200).nullable().optional(),
  phone: z.string().max(40).nullable().optional(),
  company: z.string().max(200).nullable().optional(),
  source: z.string().max(80).nullable().optional(),
  landing_page: z.string().max(500).nullable().optional(),
  hero_variant: z.string().max(80).nullable().optional(),
  cta_variant: z.string().max(80).nullable().optional(),
  utm_source: z.string().max(255).nullable().optional(),
  utm_medium: z.string().max(255).nullable().optional(),
  utm_campaign: z.string().max(255).nullable().optional(),
  utm_term: z.string().max(255).nullable().optional(),
  utm_content: z.string().max(255).nullable().optional(),
  gclid: z.string().max(255).nullable().optional(),
  fbclid: z.string().max(255).nullable().optional(),
  referrer: z.string().max(500).nullable().optional(),
  offer_slug: z.string().max(160).nullable().optional(),
  audience_tag: z.string().max(160).nullable().optional(),
  payload_json: z.unknown().nullable().optional(),
});

async function requestFingerprint() {
  let value = "unknown";
  try {
    value = getRequestHeader("cf-connecting-ip")
      ?? getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim()
      ?? getRequest().headers.get("user-agent")
      ?? "unknown";
  } catch { /* prerender/test */ }
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`lead-intake:${value}`));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** Grava na fonte canônica pelo servidor; nunca devolve PII ao navegador. */
export const submitPublicLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => leadInput.parse(input))
  .handler(async ({ data }) => {
    if (!data.phone && !data.email) return { ok: false as const, reason: "missing_contact" as const };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: allowed } = await (supabaseAdmin as any).rpc("check_and_record_rate_limit", {
      p_scope: "public_lead_intake",
      p_ip_hash: await requestFingerprint(),
      p_window_seconds: 300,
      p_max_hits: 12,
    });
    if (allowed === false) return { ok: false as const, reason: "rate_limited" as const };
    const { data: row, error } = await (supabaseAdmin as any)
      .from("lead_submissions")
      .insert(data)
      .select("id")
      .single();
    if (error || !row?.id) return { ok: false as const, reason: "db_error" as const };
    return { ok: true as const, leadId: row.id as string };
  });