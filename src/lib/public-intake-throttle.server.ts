/**
 * Limite antiabuso para escritas públicas (funis e telemetria do quiz).
 *
 * Reaproveita o RPC já existente `check_and_record_rate_limit`, que guarda o
 * contador em `rate_limit_buckets` por (escopo, hash de IP). O IP nunca é
 * gravado em texto: usamos o mesmo `hashIp` do redirect de WhatsApp.
 *
 * Política deliberada:
 *  - limites generosos, para nunca derrubar um envio legítimo (ZERO perda de
 *    lead continua valendo: quem passa do teto recebe erro explícito e pode
 *    tentar de novo, nada é descartado em silêncio);
 *  - fail-open: se o RPC falhar por qualquer motivo, a operação segue. O
 *    limite é hardening, não pode virar indisponibilidade do funil.
 */
import { hashIp } from "@/lib/whatsapp-redirect.server";

export type PublicIntakeScope = "funnel_submit" | "portfolio_quiz_submit" | "quiz_pixel_event";

const LIMITS: Record<PublicIntakeScope, { windowSeconds: number; maxHits: number }> = {
  // Envios de formulário: 12 por IP a cada 10 minutos.
  funnel_submit: { windowSeconds: 600, maxHits: 12 },
  portfolio_quiz_submit: { windowSeconds: 600, maxHits: 12 },
  // Telemetria: muitos eventos por sessão são normais; o teto só barra flood.
  quiz_pixel_event: { windowSeconds: 60, maxHits: 240 },
};

/** Retorna `true` quando a requisição pode prosseguir. */
export async function allowPublicIntake(
  scope: PublicIntakeScope,
  ip: string | null | undefined,
): Promise<boolean> {
  const ipHash = hashIp(ip);
  if (!ipHash) return true; // sem IP não há como contar — não bloqueia.
  const { windowSeconds, maxHits } = LIMITS[scope];
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin as any).rpc("check_and_record_rate_limit", {
      p_scope: scope,
      p_ip_hash: ipHash,
      p_window_seconds: windowSeconds,
      p_max_hits: maxHits,
    });
    if (error) return true; // fail-open
    return data !== false;
  } catch {
    return true; // fail-open
  }
}
