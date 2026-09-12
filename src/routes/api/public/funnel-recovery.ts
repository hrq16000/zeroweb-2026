/**
 * FUNNEL_OPERATIONAL — recuperação a partir do redirect.
 *
 * Endpoint público mínimo usado pela página terminal de `/r/whatsapp/:token`
 * quando o destino operacional não pôde ser resolvido. O pedido já está salvo;
 * aqui apenas anexamos o meio de retorno informado pelo visitante para que a
 * conclusão nunca fique irrecuperável.
 *
 * Não expõe nenhum contato do cliente, não devolve dados do lead e não aceita
 * lead_id vindo do cliente: o lead é resolvido pelo token opaco.
 */
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  token: z.string().regex(/^[a-f0-9]{16,64}$/),
  contact: z.string().max(40),
});

export const Route = createFileRoute("/api/public/funnel-recovery")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let parsed: z.infer<typeof schema>;
        try {
          parsed = schema.parse(await request.json());
        } catch {
          return Response.json({ ok: false, reason: "invalid_payload" }, { status: 400 });
        }

        const { normalizeRecoveryPhone, RECOVERY_CONTACT_PURPOSE, decideLeadRecoverability } =
          await import("@/lib/lead-recoverability");
        const phone = normalizeRecoveryPhone(parsed.contact);
        if (!phone) {
          return Response.json({ ok: false, reason: "invalid_contact" }, { status: 422 });
        }

        const { resolveWhatsAppRedirectToken, hashIp, CONSUME_TOKEN_RATE_WINDOW_S } = await import(
          "@/lib/whatsapp-redirect.server"
        );
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const ip =
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          request.headers.get("cf-connecting-ip") ??
          null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: rlOk } = await (supabaseAdmin as any).rpc("check_and_record_rate_limit", {
          p_scope: `funnel_recovery:${parsed.token.slice(0, 16)}`,
          p_ip_hash: hashIp(ip) ?? "no-ip",
          p_window_seconds: CONSUME_TOKEN_RATE_WINDOW_S,
          p_max_hits: 10,
        });
        if (rlOk === false) {
          return Response.json({ ok: false, reason: "rate_limited" }, { status: 429 });
        }

        const resolved = await resolveWhatsAppRedirectToken(parsed.token);
        if (!resolved.ok || !resolved.row.lead_id) {
          return Response.json({ ok: false, reason: "not_found" }, { status: 404 });
        }
        const leadId = resolved.row.lead_id as string;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: lead } = await (supabaseAdmin as any)
          .from("dynamic_form_leads")
          .select("id, metadata_json")
          .eq("id", leadId)
          .maybeSingle();
        if (!lead) return Response.json({ ok: false, reason: "not_found" }, { status: 404 });

        const metadata = {
          ...((lead.metadata_json ?? {}) as Record<string, unknown>),
          recovery_contact_kind: "whatsapp",
          recovery_contact_purpose: RECOVERY_CONTACT_PURPOSE,
          recovery_contact_collected_at: new Date().toISOString(),
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabaseAdmin as any)
          .from("dynamic_form_leads")
          .update({ contact_phone: phone, metadata_json: metadata })
          .eq("id", leadId);
        if (error) {
          return Response.json({ ok: false, reason: "persist_failed" }, { status: 500 });
        }

        const clientKeyRaw = (metadata as Record<string, unknown>).client_key;
        const clientKey = typeof clientKeyRaw === "string" ? clientKeyRaw : null;
        const decision = decideLeadRecoverability({
          destinationConfigured: false,
          hasRecoverableContact: true,
        });
        const { recordLeadDelivery } = await import("@/lib/lead-delivery-ledger.server");
        await recordLeadDelivery({
          leadId,
          clientKey,
          destinationStatus: "NOT_CONFIGURED",
          deliveryStatus: decision.deliveryStatus,
          recoverability: decision.recoverability,
          hasRecoverableContact: true,
          failureReason: "missing_client_whatsapp_number",
        });

        return Response.json({ ok: true, recoverability: decision.recoverability });
      },
      GET: async () => new Response("Not found", { status: 404 }),
    },
  },
});
