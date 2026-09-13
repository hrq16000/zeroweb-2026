/**
 * Solicitações de WhatsApp às marcas sem destino comprovado.
 * Registro operacional: envio, status e resposta — sempre com número mascarado.
 * Fonte única continua `portfolio_client_settings`; aqui é só o rastro do contato.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type DestinationRequestRow = {
  id: string;
  client_key: string;
  slug: string | null;
  channel: string;
  sent_at: string;
  sent_note: string | null;
  status: string;
  response_at: string | null;
  response_note: string | null;
};

const STATUS = ["ENVIADO", "RESPONDIDO", "SEM_RESPOSTA", "RECUSADO", "NUMERO_RECEBIDO"] as const;

/** Nunca persistir número completo em texto livre: sequências longas viram máscara. */
function maskDigits(text: string | null | undefined): string | null {
  if (!text) return null;
  return text.replace(/\d[\d\s().-]{7,}\d/g, (match) => {
    const digits = match.replace(/\D/g, "");
    return `••••${digits.slice(-4)}`;
  });
}

async function assertAdmin(context: { userId: string }) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [{ data: isAdmin }, { data: isSuper }] = await Promise.all([
    supabaseAdmin.rpc("has_role", { _user_id: context.userId, _role: "admin" }),
    supabaseAdmin.rpc("is_super_admin", { _uid: context.userId }),
  ]);
  if (!isAdmin && !isSuper) throw new Error("Acesso restrito a administradores.");
  return supabaseAdmin;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const listDestinationRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ rows: DestinationRequestRow[] }> => {
    const supabaseAdmin = await assertAdmin(context);
    const { data, error } = await (supabaseAdmin as any)
      .from("portfolio_destination_requests")
      .select("id, client_key, slug, channel, sent_at, sent_note, status, response_at, response_note")
      .order("sent_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return { rows: (data ?? []) as DestinationRequestRow[] };
  });

export const createDestinationRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z
      .object({
        client_key: z.string().min(1).max(80),
        slug: z.string().max(120).optional(),
        channel: z.string().min(1).max(40),
        sent_note: z.string().max(600).optional(),
      })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await assertAdmin(context);
    const { error } = await (supabaseAdmin as any)
      .from("portfolio_destination_requests")
      .insert({
        client_key: data.client_key,
        slug: data.slug ?? null,
        channel: data.channel,
        sent_note: maskDigits(data.sent_note ?? null),
        status: "ENVIADO",
        created_by: context.userId,
      });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateDestinationRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(STATUS),
        response_note: z.string().max(600).optional(),
      })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await assertAdmin(context);
    const answered = data.status !== "ENVIADO";
    const { error } = await (supabaseAdmin as any)
      .from("portfolio_destination_requests")
      .update({
        status: data.status,
        response_note: maskDigits(data.response_note ?? null),
        response_at: answered ? new Date().toISOString() : null,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
