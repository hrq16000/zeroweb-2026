/**
 * Registro server-side de incidentes de roteamento do lead para o WhatsApp.
 *
 * Nunca grava número de destino, telefone do visitante ou qualquer conteúdo de
 * mensagem — apenas correlação (client_key, lead_id, hash do token) suficiente
 * para diagnosticar quedas do funil.
 */
import { createHash } from "crypto";

export type RoutingIncidentReason =
  | "missing_client_whatsapp_number"
  | "missing_operational_whatsapp_number"
  | "invalid_destination";

export async function reportRoutingIncident(input: {
  clientKey: string | null;
  leadId: string | null;
  token: string;
  reason: RoutingIncidentReason;
  fellBackToCentral: boolean;
}): Promise<void> {
  const tokenHash = createHash("sha256").update(input.token).digest("hex").slice(0, 16);
  const payload = {
    client_key: input.clientKey,
    lead_id: input.leadId,
    token_hash: tokenHash,
    reason: input.reason,
    fell_back_to_central: input.fellBackToCentral,
  };

  console.warn("[funnel-routing]", JSON.stringify(payload));

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseAdmin as any).from("anomaly_alerts").insert({
      kind: "funnel_whatsapp_routing",
      severity: input.fellBackToCentral ? "warning" : "critical",
      channel: "funnel",
      message:
        input.reason === "missing_client_whatsapp_number"
          ? `Número privado ausente para o cliente "${input.clientKey}" — lead roteado para a central.`
          : "Nenhum número operacional configurado para atender o lead.",
      payload,
    });
  } catch {
    /* alerta é best-effort: nunca deve derrubar o redirect */
  }
}
