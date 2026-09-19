// Server fns para persistir progresso do funil do carrinho.
// Usado pelo CartDrawer (abrir, adicionar, remover) e pelo checkout
// (iniciar pagamento, pagar, atendimento assistido). Aceita usuários
// autenticados (RLS scope user_id=auth.uid()) e anônimos (sem user_id,
// fallback admin via service role).
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const StepSchema = z.enum([
  "cart_open",
  "cart_update",
  "checkout_started",
  "checkout_completed",
  "handoff_whatsapp",
  "handoff_assisted",
  "payment_pending",
  "payment_paid",
  "payment_failed",
  "payment_cancelled",
  "abandoned",
]);

const CartItemSchema = z.object({
  slug: z.string().min(1).max(120),
  name: z.string().min(1).max(200),
  qty: z.number().int().min(0).max(99),
  price: z.number().nullable().optional(),
  pricePeriod: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  variantId: z.string().max(120).nullable().optional(),
  variantLabel: z.string().max(200).nullable().optional(),
});

const Input = z.object({
  sessionKey: z.string().min(8).max(120),
  visitorId: z.string().max(120).optional(),
  step: StepSchema,
  cart: z.array(CartItemSchema).max(50),
  totalAmount: z.number().nullable().optional(),
  paymentChannel: z.enum(["site", "assisted", "whatsapp", "unknown"]).optional(),
  paymentStatus: z
    .enum(["open", "pending", "paid", "failed", "cancelled", "handoff"])
    .optional(),
  paymentRef: z.string().max(200).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

async function assistedProtocol(sessionKey: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`0web-assisted:${sessionKey}`),
  );
  const code = Array.from(new Uint8Array(digest))
    .slice(0, 5)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  return `0W-${code}`;
}

export const saveCartFunnelStep = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // O handoff anônimo é público por natureza, mas não irrestrito.
    if (data.step === "handoff_assisted") {
      let fingerprintSource = "unknown";
      try {
        const { getRequestHeader } = await import("@tanstack/react-start/server");
        fingerprintSource =
          getRequestHeader("cf-connecting-ip") ??
          getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ??
          getRequestHeader("user-agent") ??
          "unknown";
      } catch {
        /* testes/prerender */
      }
      const digest = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(`checkout-assisted:${fingerprintSource}`),
      );
      const ipHash = Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
      const { data: allowed } = await (supabaseAdmin as any).rpc("check_and_record_rate_limit", {
        p_scope: "checkout_assisted",
        p_ip_hash: ipHash,
        p_window_seconds: 600,
        p_max_hits: 8,
      });
      if (allowed === false) return { ok: false, error: "rate_limited" };
    }

    // Best-effort: tenta resolver user_id pelo bearer token quando presente.
    let userId: string | null = null;
    try {
      const { getRequestHeader } = await import("@tanstack/react-start/server");
      const auth = getRequestHeader("authorization") || getRequestHeader("Authorization");
      if (auth?.startsWith("Bearer ")) {
        const token = auth.slice("Bearer ".length);
        const { data: u } = await supabaseAdmin.auth.getUser(token);
        userId = u?.user?.id ?? null;
      }
    } catch {
      /* anônimo */
    }

    const protocol =
      data.step === "handoff_assisted"
        ? await assistedProtocol(data.sessionKey)
        : null;

    const payload = {
      user_id: userId,
      visitor_id: data.visitorId ?? null,
      session_key: data.sessionKey,
      step: data.step,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cart_snapshot: data.cart as any,
      payment_status: data.paymentStatus ?? "open",
      payment_channel: data.paymentChannel ?? "unknown",
      payment_ref: data.paymentRef ?? null,
      total_amount: data.totalAmount ?? null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      metadata: ({
        ...(data.metadata ?? {}),
        ...(protocol ? { protocol } : {}),
      }) as any,
      updated_at: new Date().toISOString(),
    };

    // Upsert por session_key (unique)
    const { error } = await supabaseAdmin
      .from("cart_funnel_progress")
      .upsert(payload, { onConflict: "session_key" });
    if (error) {
      console.error("[saveCartFunnelStep] upsert failed", error);
      return { ok: false, error: error.message };
    }
    return { ok: true, protocol };
  });
