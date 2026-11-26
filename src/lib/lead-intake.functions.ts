import { createServerFn } from "@tanstack/react-start";
import { getRequest, getRequestHeader } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
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

// Best-effort por instância; a RLS do Supabase continua sendo a barreira de escrita.
const leadRateBuckets = new Map<string, number[]>();
function allowPublicLeadIntake(fingerprint: string) {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000;
  const recent = (leadRateBuckets.get(fingerprint) ?? []).filter((stamp) => now - stamp < windowMs);
  if (recent.length >= 12) {
    leadRateBuckets.set(fingerprint, recent);
    return false;
  }
  recent.push(now);
  leadRateBuckets.set(fingerprint, recent);
  if (leadRateBuckets.size > 5000) {
    for (const [key, stamps] of leadRateBuckets) {
      if (!stamps.some((stamp) => now - stamp < windowMs)) leadRateBuckets.delete(key);
    }
  }
  return true;
}

/** Only exposes availability, never the operational destination. */
export const getInfinitoSpaWhatsAppAvailability = createServerFn({ method: "GET" })
  .handler(async () => {
    const { isPortfolioWhatsAppEnvironmentConfigured } = await import("@/lib/portfolio-whatsapp-registry.server");
    return { available: isPortfolioWhatsAppEnvironmentConfigured("infinito-spa") };
  });

/** Grava leads públicos usando a chave publishable e a política INSERT do RLS. */
export const submitPublicLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => leadInput.parse(input))
  .handler(async ({ data }) => {
    if (!data.phone && !data.email) return { ok: false as const, reason: "missing_contact" as const };
    if (!allowPublicLeadIntake(await requestFingerprint())) {
      return { ok: false as const, reason: "rate_limited" as const };
    }

    const supabaseUrl = process.env.SUPABASE_URL
      ?? process.env.VITE_SUPABASE_URL
      ?? import.meta.env.VITE_SUPABASE_URL;
    const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY
      ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY
      ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !publishableKey) {
      return { ok: false as const, reason: "config_error" as const };
    }

    try {
      // The previous Vercel configuration is explicitly excluded for this client.
      // Fail closed rather than writing private inquiries to that project.
      if (data.source === "portfolio:infinito-spa" &&
          new URL(supabaseUrl).hostname === "lxajhxocyqzwwbcfahya.supabase.co") {
        return { ok: false as const, reason: "config_error" as const };
      }
      const publicClient = createClient<Database>(supabaseUrl, publishableKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const leadId = crypto.randomUUID();
      const { error } = await publicClient.from("lead_submissions").insert({
        id: leadId,
        ...data,
      } as any);
      if (error) return { ok: false as const, reason: "db_error" as const };
      return { ok: true as const, leadId };
    } catch {
      return { ok: false as const, reason: "db_error" as const };
    }
  });
