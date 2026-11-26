/**
 * Sincronização bidirecional entre `lead_submissions` e uma Planilha Google.
 *
 * - Portal → Planilha: cada lead vira uma linha (aba "Leads"), atualizada quando
 *   o registro muda no portal.
 * - Planilha → Portal: as colunas "Status", "Responsável" e "Observação" podem
 *   ser editadas pela equipe de atendimento e voltam para o banco.
 *
 * Só admin/super_admin executa. A planilha usada fica em `app_settings`
 * (`crm_sheet_id`); nenhuma credencial trafega para o navegador.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { CRM_STATUSES } from "@/lib/crm.functions";
import { importSheetChanges } from "@/lib/crm-sheet-sync";

const GATEWAY = "https://connector-gateway.lovable.dev/google_sheets/v4";
const SHEET_TAB = "Leads";
const SETTING_KEY = "crm_sheet_id";

const HEADERS = [
  "ID",
  "Criado em",
  "Nome",
  "Telefone",
  "E-mail",
  "Origem",
  "Oferta",
  "Empresa",
  "Status",
  "Responsável",
  "Observação",
  "Atualizado em",
] as const;

function gatewayHeaders() {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["GOOGLE_SHEETS_API_KEY"];
  if (!lovableKey || !connectionKey) {
    throw new Error("Conexão com a Planilha Google não está configurada.");
  }
  return {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": connectionKey,
    "Content-Type": "application/json",
  };
}

async function sheetsFetch(path: string, init?: RequestInit) {
  const response = await fetch(`${GATEWAY}${path}`, { ...init, headers: gatewayHeaders() });
  if (!response.ok) {
    const body = await response.text();
    console.error(`[crm-sheets] falha ${response.status}: ${body}`);
    throw new Error(`Planilha Google respondeu ${response.status}: ${body}`);
  }
  return response.json() as Promise<Record<string, unknown>>;
}

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [{ data: roleRow }, { data: isSuper }] = await Promise.all([
    supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle(),
    supabaseAdmin.rpc("is_super_admin", { _uid: userId }),
  ]);
  if (!roleRow && !isSuper) throw new Error("Acesso negado");
}

async function readSheetId(): Promise<string | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("app_settings").select("value").eq("key", SETTING_KEY).maybeSingle();
  return data?.value ?? null;
}

async function writeSheetId(id: string, userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("app_settings").upsert(
    {
      key: SETTING_KEY,
      value: id,
      description: "ID da Planilha Google usada como CRM da equipe de atendimento.",
      updated_by: userId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );
}

/** Estado atual da integração (existe planilha? quantas linhas?). */
export const getCrmSheetStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const userId = (context as { userId: string }).userId;
    await assertAdmin(userId);
    const configured = Boolean(process.env["LOVABLE_API_KEY"] && process.env["GOOGLE_SHEETS_API_KEY"]);
    const sheetId = await readSheetId();
    return {
      connected: configured,
      sheetId,
      sheetUrl: sheetId ? `https://docs.google.com/spreadsheets/d/${sheetId}/edit` : null,
      tab: SHEET_TAB,
    };
  });

/** Cria a planilha de CRM (uma vez) ou apenas devolve a existente. */
export const ensureCrmSheet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const userId = (context as { userId: string }).userId;
    await assertAdmin(userId);

    const existing = await readSheetId();
    if (existing) return { sheetId: existing, created: false };

    const created = (await sheetsFetch("/spreadsheets", {
      method: "POST",
      body: JSON.stringify({
        properties: { title: "0WEB — CRM de Leads" },
        sheets: [{ properties: { title: SHEET_TAB } }],
      }),
    })) as { spreadsheetId?: string };

    const sheetId = created.spreadsheetId;
    if (!sheetId) throw new Error("A Planilha Google não retornou um identificador.");

    await sheetsFetch(`/spreadsheets/${sheetId}/values/${SHEET_TAB}!A1:L1?valueInputOption=RAW`, {
      method: "PUT",
      body: JSON.stringify({ values: [HEADERS] }),
    });
    await writeSheetId(sheetId, userId);
    return { sheetId, created: true };
  });

type LeadRow = {
  id: string;
  created_at: string | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  source: string | null;
  offer_slug: string | null;
  company: string | null;
  status: string | null;
  assignee: string | null;
  notes: string | null;
  updated_at?: string | null;
  portal_id: string | null;
};

function toRow(lead: LeadRow): string[] {
  return [
    lead.id,
    lead.created_at ?? "",
    lead.name ?? "",
    lead.phone ?? "",
    lead.email ?? "",
    lead.source ?? "",
    lead.offer_slug ?? "",
    lead.company ?? "",
    lead.status ?? "novo",
    lead.assignee ?? "",
    lead.notes ?? "",
    new Date().toISOString(),
  ];
}

/**
 * Sincroniza nos dois sentidos:
 * 1) lê a planilha e aplica no banco alterações de status/responsável/observação;
 * 2) reescreve a planilha com o estado final do banco.
 */
export const syncCrmSheet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { days?: number } | undefined) =>
    z.object({ days: z.number().int().min(1).max(365).default(180) }).parse({ days: input?.days ?? 180 }),
  )
  .handler(async ({ data, context }) => {
    const userId = (context as { userId: string }).userId;
    await assertAdmin(userId);
    const sheetId = await readSheetId();
    if (!sheetId) throw new Error("Nenhuma planilha configurada. Crie a planilha de CRM primeiro.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const since = new Date(Date.now() - data.days * 86_400_000).toISOString();

    // ---------- 1. Planilha → Portal ----------
    const current = (await sheetsFetch(`/spreadsheets/${sheetId}/values/${SHEET_TAB}!A2:L100000`)) as {
      values?: string[][];
    };
    const sheetRows = current.values ?? [];
    const { data: dbRows, error: readError } = await supabaseAdmin
      .from("lead_submissions")
      .select("id, created_at, name, phone, email, source, offer_slug, company, status, assignee, notes, updated_at, portal_id")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5001);
    if (readError) throw new Error("Não foi possível ler os leads. A planilha não foi reescrita.");
    const leads = (dbRows ?? []) as unknown as LeadRow[];
    if (leads.length > 5000) throw new Error("O período excede 5.000 leads. Nenhuma alteração foi importada e a planilha foi preservada.");
    const imported = await importSheetChanges(sheetRows, leads, CRM_STATUSES, async (lead, patch) => {
      let update = supabaseAdmin.from("lead_submissions").update(patch).eq("id", lead.id);
      // Compare-and-set: a concurrent close, reassignment or portal move cannot
      // be overwritten after the read. All conditions run in the same UPDATE.
      for (const column of ["status", "assignee", "notes", "updated_at", "portal_id"] as const) {
        const expected = lead[column];
        update = expected == null ? update.is(column, null) : update.eq(column, expected);
      }
      const { data: changed, error } = await update.select("id").maybeSingle();
      if (error) return "failed";
      return changed ? "updated" : "conflict";
    });
    if (!imported.ok) return {
      ok: false, sheetId, sheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/edit`,
      leadsEnviados: 0, atualizadosPelaPlanilha: imported.updated,
      encerradosPreservados: imported.protectedTerminal, falhas: imported.failures,
      sincronizadoEm: null,
    };

    // Re-read the committed state (including triggers), never export the stale
    // pre-import snapshot or clear the sheet after an unsuccessful read.
    const { data: finalRows, error: finalError } = await supabaseAdmin.from("lead_submissions")
      .select("id, created_at, name, phone, email, source, offer_slug, company, status, assignee, notes, updated_at, portal_id")
      .gte("created_at", since).order("created_at", { ascending: false }).limit(5001);
    if (finalError || !finalRows || finalRows.length > 5000) {
      throw new Error(`${imported.updated} alteração(ões) importada(s), mas a leitura final falhou ou excedeu o limite. A planilha foi preservada.`);
    }

    // ---------- 2. Portal → Planilha ----------
    const values = (finalRows as unknown as LeadRow[]).map(toRow);
    // Never clear the only copy before the replacement has been accepted.
    await sheetsFetch(`/spreadsheets/${sheetId}/values/${SHEET_TAB}!A1?valueInputOption=RAW`, {
      method: "PUT",
      body: JSON.stringify({ values: [HEADERS as unknown as string[], ...values] }),
    });
    if (sheetRows.length > values.length) {
      await sheetsFetch(`/spreadsheets/${sheetId}/values/${SHEET_TAB}!A${values.length + 2}:L${sheetRows.length + 1}:clear`, {
        method: "POST", body: "{}",
      });
    }

    return {
      ok: true,
      sheetId,
      sheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/edit`,
      leadsEnviados: values.length,
      atualizadosPelaPlanilha: imported.updated,
      encerradosPreservados: imported.protectedTerminal,
      falhas: imported.failures,
      sincronizadoEm: new Date().toISOString(),
    };
  });
