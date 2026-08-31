import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type UnifiedLead = {
  id_lead: string;
  nome: string;
  origem: "carrinho" | "funil";
  etapa_atual: string;
  dados_extras: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type LeadFilters = {
  origem?: "carrinho" | "funil" | "all";
  etapa?: string | "all";
  /** Busca livre pelo nome do lead. */
  q?: string;
  /** ISO date (YYYY-MM-DD) inicial, inclusivo, sobre updated_at. */
  from?: string;
  /** ISO date (YYYY-MM-DD) final, inclusivo, sobre updated_at. */
  to?: string;
  limit?: number;
};

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roles } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const allowed = (roles ?? []).some((r) => r.role === "admin" || r.role === "super_admin");
  if (!allowed) throw new Error("forbidden");
  return supabaseAdmin;
}

function sanitizeFilters(data: LeadFilters = {}): LeadFilters {
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  return {
    origem: data.origem ?? "all",
    etapa: data.etapa ?? "all",
    q: typeof data.q === "string" ? data.q.trim().slice(0, 80) : undefined,
    from: data.from && iso.test(data.from) ? data.from : undefined,
    to: data.to && iso.test(data.to) ? data.to : undefined,
    limit: Math.min(Math.max(Number(data.limit) || 200, 1), 500),
  };
}

async function queryLeads(userId: string, raw: LeadFilters) {
  const filters = sanitizeFilters(raw);
  const supabaseAdmin = await assertAdmin(userId);

  let q = (supabaseAdmin as any)
    .from("vw_unified_leads")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(filters.limit!);
  if (filters.origem && filters.origem !== "all") q = q.eq("origem", filters.origem);
  if (filters.etapa && filters.etapa !== "all") q = q.eq("etapa_atual", filters.etapa);
  if (filters.q) q = q.ilike("nome", `%${filters.q}%`);
  if (filters.from) q = q.gte("updated_at", `${filters.from}T00:00:00.000Z`);
  if (filters.to) q = q.lte("updated_at", `${filters.to}T23:59:59.999Z`);

  const { data: rows, error } = await q;
  if (error) throw error;

  const list = ((rows ?? []) as UnifiedLead[]).map((row) => ({
    ...row,
    dados_extras: redactContacts(row.dados_extras),
  }));
  const etapas = Array.from(new Set(list.map((r) => r.etapa_atual).filter(Boolean))).sort();
  return { leads: list, etapas, filters };
}

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
const EMAIL_KEY_RE = /(mail|e_?mail)/i;

/**
 * Remove e-mails do payload exibido no portal: a tela de propostas mostra
 * nome, etapa e histórico, nunca o e-mail do cliente.
 */
function redactContacts(value: unknown): any {
  if (typeof value === "string") return value.replace(EMAIL_RE, "[e-mail oculto]");
  if (Array.isArray(value)) return value.map(redactContacts);
  if (value && typeof value === "object") {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = EMAIL_KEY_RE.test(k) ? "[e-mail oculto]" : redactContacts(v);
    }
    return out;
  }
  return value;
}


export const listUnifiedLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: LeadFilters = {}) => data)
  .handler(async ({ data, context }) => {
    const { leads, etapas } = await queryLeads(context.userId, data);
    return { leads, etapas };
  });

function describeFilters(f: LeadFilters) {
  const parts = [
    `origem=${f.origem}`,
    `etapa=${f.etapa}`,
    f.q ? `busca="${f.q}"` : null,
    f.from ? `de=${f.from}` : null,
    f.to ? `ate=${f.to}` : null,
  ].filter(Boolean);
  return parts.join(" · ");
}

/**
 * Envia o recorte atual de leads (somente nome, origem, etapa e data — sem
 * telefone, e-mail ou payload bruto) para o e-mail da própria conta admin
 * autenticada. Não aceita destinatário arbitrário.
 */
export const emailLeadsDigest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: LeadFilters = {}) => data)
  .handler(async ({ data, context }) => {
    const { leads, filters } = await queryLeads(context.userId, data);
    const to = (context.claims as any)?.email as string | undefined;
    if (!to) return { sent: false as const, reason: "sem_email_na_conta" };

    const body =
      leads.length === 0
        ? "Nenhum lead no recorte selecionado."
        : leads
            .slice(0, 100)
            .map(
              (l) =>
                `• ${l.nome} — ${l.origem} — ${l.etapa_atual} — ${new Date(
                  l.updated_at,
                ).toLocaleString("pt-BR")}`,
            )
            .join("\n");

    const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
    const result = await sendTemplateEmail("leads-digest", to, {
      templateData: { count: leads.length, filters: describeFilters(filters), body },
    });
    return { sent: result.sent, count: leads.length };
  });
