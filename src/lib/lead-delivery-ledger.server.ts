/**
 * DELIVERY LEDGER — registro server-only por lead.
 *
 * Uma linha por lead em `lead_delivery_ledger`: estado do destino, estado da
 * entrega, recuperabilidade, tentativa/entrega e motivo de falha.
 * Nunca grava número completo, nome ou mensagem.
 */
if (typeof window !== "undefined") {
  throw new Error("lead-delivery-ledger.server.ts imported from client code");
}

import type {
  LeadDeliveryStatus,
  LeadRecoverabilityStatus,
} from "@/lib/lead-recoverability";

export type LedgerUpsert = {
  leadId: string;
  slug?: string | null;
  clientKey?: string | null;
  destinationStatus: string;
  deliveryStatus: LeadDeliveryStatus;
  recoverability: LeadRecoverabilityStatus;
  hasRecoverableContact: boolean;
  failureReason?: string | null;
  delivered?: boolean;
};

/** Best-effort: o ledger é observacional e nunca derruba o fluxo do visitante. */
export async function recordLeadDelivery(entry: LedgerUpsert): Promise<void> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const now = new Date().toISOString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseAdmin as any)
      .from("lead_delivery_ledger")
      .upsert(
        {
          lead_id: entry.leadId,
          lead_table: "dynamic_form_leads",
          slug: entry.slug ?? entry.clientKey ?? null,
          client_key: entry.clientKey ?? null,
          destination_status: entry.destinationStatus,
          delivery_status: entry.deliveryStatus,
          recoverability_status: entry.recoverability,
          has_recoverable_contact: entry.hasRecoverableContact,
          attempted_at: now,
          delivered_at: entry.delivered ? now : null,
          failure_reason: entry.failureReason ?? null,
          updated_at: now,
        },
        { onConflict: "lead_id" },
      );
  } catch (e) {
    console.error("[lead-delivery-ledger] upsert failed", e instanceof Error ? e.message : e);
  }
}

/** Marca entrega efetiva (redirect consumido com destino resolvido). */
export async function markLeadDelivered(leadId: string, clientKey: string | null): Promise<void> {
  await recordLeadDelivery({
    leadId,
    clientKey,
    destinationStatus: "RESOLVED",
    deliveryStatus: "DELIVERED",
    recoverability: "DELIVERED",
    hasRecoverableContact: true,
    delivered: true,
  });
}

/** Marca falha de entrega preservando a recuperabilidade já conhecida. */
export async function markLeadDeliveryFailed(
  leadId: string,
  clientKey: string | null,
  reason: string,
  hasRecoverableContact: boolean,
): Promise<void> {
  await recordLeadDelivery({
    leadId,
    clientKey,
    destinationStatus: "UNRESOLVED",
    deliveryStatus: "FAILED",
    recoverability: hasRecoverableContact ? "RECOVERABLE" : "DELIVERY_FAILED",
    hasRecoverableContact,
    failureReason: reason,
  });
}

export type DeliveryOverviewRow = {
  clientKey: string;
  total: number;
  delivered: number;
  pending: number;
  failed: number;
  configurationRequired: number;
  recoverable: number;
  unrecoverable: number;
};

export type DeliveryOverview = {
  totals: DeliveryOverviewRow;
  byClient: DeliveryOverviewRow[];
  generatedAt: string;
};

function emptyRow(clientKey: string): DeliveryOverviewRow {
  return {
    clientKey,
    total: 0,
    delivered: 0,
    pending: 0,
    failed: 0,
    configurationRequired: 0,
    recoverable: 0,
    unrecoverable: 0,
  };
}

/** Leitura operacional agregada. Sem PII: só contagens por projeto. */
export async function summarizeLeadDelivery(): Promise<DeliveryOverview> {
  const totals = emptyRow("__all__");
  const byClient = new Map<string, DeliveryOverviewRow>();
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const PAGE = 1000;
    for (let from = 0; from < 100000; from += PAGE) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabaseAdmin as any)
        .from("lead_delivery_ledger")
        .select("client_key, delivery_status, recoverability_status")
        .order("created_at", { ascending: false })
        .range(from, from + PAGE - 1);
      const page = (data ?? []) as {
        client_key: string | null;
        delivery_status: string;
        recoverability_status: string;
      }[];
      for (const r of page) {
        const key = r.client_key ?? "—";
        const row = byClient.get(key) ?? emptyRow(key);
        for (const target of [row, totals]) {
          target.total += 1;
          if (r.delivery_status === "DELIVERED") target.delivered += 1;
          if (r.delivery_status === "PENDING") target.pending += 1;
          if (r.delivery_status === "FAILED") target.failed += 1;
          if (r.delivery_status === "DELIVERY_CONFIGURATION_REQUIRED") {
            target.configurationRequired += 1;
          }
          if (r.recoverability_status === "RECOVERABLE") target.recoverable += 1;
          if (r.recoverability_status === "UNRECOVERABLE_LEGACY") target.unrecoverable += 1;
        }
        byClient.set(key, row);
      }
      if (page.length < PAGE) break;
    }
  } catch (e) {
    console.error("[lead-delivery-ledger] summary failed", e instanceof Error ? e.message : e);
  }
  return {
    totals,
    byClient: [...byClient.values()].sort(
      (a, b) =>
        b.configurationRequired + b.failed - (a.configurationRequired + a.failed) ||
        b.total - a.total,
    ),
    generatedAt: new Date().toISOString(),
  };
}
