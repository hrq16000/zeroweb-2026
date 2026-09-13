/**
 * Fila de revisão dos contatos encontrados em fonte oficial pública.
 * Somente admin/super_admin. O número completo nunca sai do servidor: o painel
 * vê apenas a máscara e a evidência da ficha pública.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { maskWhatsAppDigits } from "@/lib/portfolio-funnel-destination";

export type DestinationProposal = {
  id: string;
  slug: string;
  clientKey: string;
  candidateName: string | null;
  candidateAddress: string | null;
  candidateCategory: string | null;
  placeId: string | null;
  mapsUrl: string | null;
  masked: string | null;
  looksLikeLandline: boolean;
  matchStrength: string;
  source: string;
  query: string | null;
  status: string;
  createdAt: string;
};

async function assertAdmin(context: { supabase: { rpc: Function }; userId: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = context.supabase as any;
  const [{ data: isAdmin }, { data: isSuper }] = await Promise.all([
    sb.rpc("has_role", { _user_id: context.userId, _role: "admin" }),
    sb.rpc("has_role", { _user_id: context.userId, _role: "super_admin" }),
  ]);
  if (!isAdmin && !isSuper) throw new Error("Forbidden");
}

function isLandline(digits: string) {
  const national = digits.startsWith("55") ? digits.slice(2) : digits;
  return national.length === 10 || national[2] !== "9";
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function toPublic(row: any): DestinationProposal {
  const digits = String(row.phone_digits ?? "");
  return {
    id: row.id,
    slug: row.slug,
    clientKey: row.client_key,
    candidateName: row.candidate_name ?? null,
    candidateAddress: row.candidate_address ?? null,
    candidateCategory: row.candidate_category ?? null,
    placeId: row.place_id ?? null,
    mapsUrl: row.maps_url ?? null,
    masked: digits ? maskWhatsAppDigits(digits) : null,
    looksLikeLandline: isLandline(digits),
    matchStrength: row.match_strength,
    source: row.source,
    query: row.query ?? null,
    status: row.status,
    createdAt: row.created_at,
  };
}

/** Sugestões aguardando confirmação humana, agrupáveis por projeto. */
export const listDestinationProposals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({ status: z.enum(["PENDING", "APPROVED", "REJECTED", "SUPERSEDED", "ALL"]).default("PENDING") })
      .parse(data ?? {}),
  )
  .handler(async ({ data, context }): Promise<{ rows: DestinationProposal[] }> => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let query = (supabaseAdmin as any)
      .from("portfolio_destination_proposals")
      .select("*")
      .order("slug", { ascending: true })
      .order("match_strength", { ascending: true })
      .limit(500);
    if (data.status !== "ALL") query = query.eq("status", data.status);
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return { rows: ((rows ?? []) as any[]).map(toPublic) };
  });

/** Aprova a sugestão e grava o destino pelo mesmo caminho auditado do painel. */
export const approveDestinationProposal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        note: z.string().trim().max(400).optional(),
        acknowledgeShared: z.boolean().optional(),
        acknowledgeChange: z.boolean().optional(),
        acknowledgeLandline: z.boolean().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await (supabaseAdmin as any)
      .from("portfolio_destination_proposals")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Sugestão não encontrada");

    const { confirmDestination } = await import("@/lib/portfolio-destination-confirm.server");
    const fromClientMaterial = row.source === "CLIENT_MATERIAL";
    const evidence = [
      fromClientMaterial
        ? `Material do próprio cliente "${row.candidate_name ?? row.slug}"`
        : `Ficha pública Google "${row.candidate_name ?? "—"}"`,
      row.candidate_address ? `(${row.candidate_address})` : "",
      row.place_id ? `Place ID ${row.place_id}` : "",
      row.query ? `· ${row.query}` : "",
      `correspondência ${row.match_strength}`,
      data.note ? `· ${data.note}` : "",
    ]
      .filter(Boolean)
      .join(" ");

    const result = await confirmDestination(
      {
        slug: row.slug,
        whatsapp: String(row.phone_digits),
        provenanceSource: fromClientMaterial ? "CLIENT_SUPPLIED" : "OFFICIAL_GOOGLE",
        evidence,
        acknowledgeShared: data.acknowledgeShared ?? false,
        acknowledgeChange: data.acknowledgeChange ?? false,
        acknowledgeLandline: data.acknowledgeLandline ?? false,
      },
      context.userId,
    );


    if (result.ok) {
      await (supabaseAdmin as any)
        .from("portfolio_destination_proposals")
        .update({ status: "APPROVED", reviewed_by: context.userId, reviewed_at: new Date().toISOString(), review_note: data.note ?? null })
        .eq("id", data.id);
      await (supabaseAdmin as any)
        .from("portfolio_destination_proposals")
        .update({ status: "SUPERSEDED", reviewed_by: context.userId, reviewed_at: new Date().toISOString() })
        .eq("slug", row.slug)
        .eq("status", "PENDING")
        .neq("id", data.id);
    }
    return result;
  });

/** Descarta a sugestão sem gravar destino. */
export const rejectDestinationProposal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), note: z.string().trim().max(400).optional() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any)
      .from("portfolio_destination_proposals")
      .update({
        status: "REJECTED",
        reviewed_by: context.userId,
        reviewed_at: new Date().toISOString(),
        review_note: data.note ?? null,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
