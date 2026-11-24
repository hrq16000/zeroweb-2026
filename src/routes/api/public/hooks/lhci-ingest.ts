// Public receiver: verify the raw-body signature before privileged access.
import { createFileRoute } from "@tanstack/react-router";
import { evaluateLhci } from "@/lib/lhci-evaluation.mjs";

export const Route = createFileRoute("/api/public/hooks/lhci-ingest")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { lighthouseReceiptSchema, validLighthouseSignature, lighthouseReceiptKey, readLighthouseBody } = await import("@/lib/lhci-receipts.server");
        const { getSettingValue } = await import("@/lib/settings.functions");
        if (Number(request.headers.get("content-length")) > 65536) return new Response("Payload too large", { status: 413 });
        let raw: string | null;
        try { raw = await readLighthouseBody(request); }
        catch { return new Response("Invalid request body", { status: 400 }); }
        if (raw === null) return new Response("Payload too large", { status: 413 });
        const secret = process.env["LHCI_HMAC_SECRET"];
        if (!secret) return new Response("Receiving key not configured", { status: 503 });
        if (!validLighthouseSignature(raw, request.headers.get("x-signature") ?? "", secret)) return new Response("Unauthorized", { status: 401 });

        let payload: unknown;
        try {
          payload = JSON.parse(raw);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const parsed = lighthouseReceiptSchema.safeParse(payload);
        if (!parsed.success) {
          return Response.json({ error: parsed.error.flatten() }, { status: 400 });
        }

        const env = parsed.data.environment;
        const perfMin = Number((await getSettingValue(`lhci.${env}.min_performance`)) ?? 0.9);
        const seoMin = Number((await getSettingValue(`lhci.${env}.min_seo`)) ?? 0.95);
        const lcpMax = Number((await getSettingValue(`lhci.${env}.max_lcp_ms`)) ?? 2500);
        const clsMax = Number((await getSettingValue(`lhci.${env}.max_cls`)) ?? 0.1);
        const { status, failed, missing } = evaluateLhci(parsed.data, {
          performance: perfMin, seo: seoMin, lcp_ms: lcpMax, cls: clsMax,
        });
        const reasons = [...failed, ...missing.map((metric) => `missing:${metric}`)];
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const ingestion_key = lighthouseReceiptKey(parsed.data);
        const { data, error } = await supabaseAdmin
          .from("lhci_runs")
          .insert({
            ...parsed.data,
            ingestion_key,
            logs: { ...parsed.data.logs, transport: "signed-webhook", measured_at: parsed.data.measured_at },
            status,
            decision_reason: reasons.length ? `Medição: ${reasons.join(", ")}` : null,
          })
          .select("id")
          .single();
        if (error?.code === "23505") {
          const { data: existing, error: readError } = await supabaseAdmin.from("lhci_runs").select("id,status").eq("ingestion_key", ingestion_key).single();
          if (readError) return new Response("Receipt lookup failed", { status: 500 });
          return Response.json({ ok: true, id: existing.id, status: existing.status, duplicate: true });
        }
        if (error) return new Response("Receipt storage failed", { status: 500 });

        return Response.json({ ok: true, id: data?.id, status, failedThresholds: failed, missingMetrics: missing });
      },
    },
  },
});
