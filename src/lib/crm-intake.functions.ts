/**
 * Entrada de leads no CRM da equipe de atendimento.
 *
 * O lead continua sendo gravado em `lead_submissions` pelo cliente
 * (`persistLead`) — esta função apenas **despacha** o registro recém-criado:
 *  1. anexa uma linha na Planilha Google de CRM (quando configurada);
 *  2. cria uma notificação no portal para admin/super_admin.
 *
 * É pública por necessidade (o visitante não está autenticado), então:
 *  - só aceita leads criados nos últimos 5 minutos;
 *  - identifica o lead por telefone/e-mail + origem, nunca por id arbitrário;
 *  - é protegida por rate limit por IP;
 *  - nunca devolve dados do lead para o navegador.
 */
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

const GATEWAY = "https://connector-gateway.lovable.dev/google_sheets/v4";
const SHEET_TAB = "Leads";
const SETTING_KEY = "crm_sheet_id";

const Input = z.object({
  phone: z.string().max(40).optional(),
  email: z.string().max(200).optional(),
  source: z.string().max(80),
});

async function hashIp(): Promise<string> {
  try {
    const req = getRequest();
    const ip =
      req.headers.get("cf-connecting-ip") ??
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`crm-intake:${ip}`));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return "unknown";
  }
}

async function appendToSheet(
  row: string[],
): Promise<"sent" | "not_configured" | "failed"> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["GOOGLE_SHEETS_API_KEY"];
  if (!lovableKey || !connectionKey) return "not_configured";

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("app_settings")
    .select("value")
    .eq("key", SETTING_KEY)
    .maybeSingle();
  const sheetId = data?.value;
  if (!sheetId) return "not_configured";

  const res = await fetch(
    `${GATEWAY}/spreadsheets/${sheetId}/values/${SHEET_TAB}!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": connectionKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [row] }),
    },
  );
  if (!res.ok) {
    console.error(`[crm-intake] planilha respondeu ${res.status}: ${await res.text()}`);
    return "failed";
  }
  return "sent";
}

/** Despacha o lead recém-gravado para a planilha de CRM e notifica a equipe. */
export const dispatchCrmLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    if (!data.phone && !data.email) return { ok: false as const, reason: "missing_contact" };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const ipHash = await hashIp();
    const { data: allowed } = await (supabaseAdmin as never as {
      rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: boolean | null }>;
    }).rpc("check_and_record_rate_limit", {
      p_scope: "crm_intake",
      p_ip_hash: ipHash,
      p_window_seconds: 300,
      p_max_hits: 20,
    });
    if (allowed === false) return { ok: false as const, reason: "rate_limited" };

    const since = new Date(Date.now() - 5 * 60_000).toISOString();
    let query = supabaseAdmin
      .from("lead_submissions")
      .select("id, created_at, name, phone, email, source, offer_slug, company, status")
      .eq("source", data.source)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(1);
    query = data.phone ? query.eq("phone", data.phone) : query.eq("email", data.email!);

    const { data: rows, error } = await query;
    if (error || !rows?.length) return { ok: false as const, reason: "lead_not_found" };
    const lead = rows[0] as {
      id: string;
      created_at: string | null;
      name: string | null;
      phone: string | null;
      email: string | null;
      source: string | null;
      offer_slug: string | null;
      company: string | null;
      status: string | null;
    };

    const sheet = await appendToSheet([
      lead.id,
      lead.created_at ?? "",
      lead.name ?? "",
      lead.phone ?? "",
      lead.email ?? "",
      lead.source ?? "",
      lead.offer_slug ?? "",
      lead.company ?? "",
      lead.status ?? "novo",
      "",
      "",
      new Date().toISOString(),
    ]).catch((e) => {
      console.error("[crm-intake] falha ao anexar na planilha", e);
      return "failed" as const;
    });

    // Notificação interna para quem atende (sem PII sensível no corpo).
    let notified = 0;
    const { data: admins } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role")
      .in("role", ["admin", "super_admin"]);
    const ids = [...new Set((admins ?? []).map((r) => (r as { user_id: string }).user_id))];
    if (ids.length) {
      const { error: notifyError } = await supabaseAdmin.from("notifications").insert(
        ids.map((user_id) => ({
          user_id,
          kind: "lead",
          title: "Novo lead recebido",
          body: `Origem: ${lead.source ?? "site"}${lead.offer_slug ? ` · ${lead.offer_slug}` : ""}`,
          link: "/app/leads",
        })),
      );
      if (notifyError) console.error("[crm-intake] falha ao notificar", notifyError.message);
      else notified = ids.length;
    }

    return { ok: true as const, sheet, notified };
  });
