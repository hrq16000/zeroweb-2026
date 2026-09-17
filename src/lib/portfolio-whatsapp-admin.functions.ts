/**
 * Painel: confirmação do WhatsApp oficial por portfolio, protocolos e leads.
 *
 * Política SEM COFRE: o número é dado operacional do próprio clientKey.
 * O painel grava em `portfolio_whatsapp_confirmations` (mesmo clientKey),
 * com precedência sobre o registro versionado. Nunca há fallback entre
 * clientes nem institucional, e o número completo nunca sai do servidor.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { maskPhoneForDisplay } from "@/lib/portfolio-host-leads";
import clientsData from "@/config/portfolio-clients.json";

type CatalogClient = { clientKey: string; slug: string; siteName: string };
const CLIENTS = (Array.isArray(clientsData)
  ? clientsData
  : ((clientsData as { clients?: CatalogClient[] }).clients ?? [])) as CatalogClient[];

const CLIENT_KEYS = new Set(CLIENTS.map((c) => c.clientKey));

export type PortfolioWhatsAppRow = {
  clientKey: string;
  slug: string;
  siteName: string;
  /** panel = confirmado no painel · catalog = dado versionado · none = sem número */
  source: "panel" | "catalog" | "none";
  masked: string | null;
  notApplicable: boolean;
  evidence: string | null;
  confirmedAt: string | null;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data: isAdmin } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  const { data: isSuper } = await context.supabase.rpc("is_super_admin", {
    _uid: context.userId,
  });
  if (!isAdmin && !isSuper) throw new Error("Acesso restrito a administradores.");
}

export const listPortfolioWhatsAppStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ rows: PortfolioWhatsAppRow[] }> => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { resolveVersionedPortfolioWhatsApp, isPortfolioWhatsAppNotApplicable } = await import(
      "@/lib/portfolio-whatsapp-registry.server"
    );

    const { data: confirmations } = await (supabaseAdmin as any)
      .from("portfolio_whatsapp_confirmations")
      .select("client_key, whatsapp_digits, evidence, confirmed_at, revoked_at")
      .is("revoked_at", null);

    const byKey = new Map<string, any>(
      ((confirmations ?? []) as any[]).map((r) => [r.client_key as string, r]),
    );

    const rows = CLIENTS.map((c) => {
      const confirmed = byKey.get(c.clientKey);
      const versioned = resolveVersionedPortfolioWhatsApp(c.clientKey);
      const digits = confirmed?.whatsapp_digits ?? versioned ?? null;
      return {
        clientKey: c.clientKey,
        slug: c.slug,
        siteName: c.siteName,
        source: confirmed ? "panel" : versioned ? "catalog" : "none",
        masked: digits ? maskPhoneForDisplay(digits) : null,
        notApplicable: isPortfolioWhatsAppNotApplicable(c.clientKey),
        evidence: confirmed?.evidence ?? null,
        confirmedAt: confirmed?.confirmed_at ?? null,
      } as PortfolioWhatsAppRow;
    }).sort((a, b) => a.siteName.localeCompare(b.siteName, "pt-BR"));

    return { rows };
  });

const confirmSchema = z.object({
  clientKey: z.string().min(1).max(80),
  whatsapp: z.string().min(8).max(32),
  evidence: z.string().min(3).max(400),
});

export const confirmPortfolioWhatsApp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => confirmSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    if (!CLIENT_KEYS.has(data.clientKey)) throw new Error("clientKey fora do catálogo.");
    const digits = data.whatsapp.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) {
      throw new Error("Número inválido: informe DDI + DDD + número.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: clash } = await (supabaseAdmin as any)
      .from("portfolio_whatsapp_confirmations")
      .select("client_key")
      .eq("whatsapp_digits", digits)
      .is("revoked_at", null)
      .neq("client_key", data.clientKey)
      .maybeSingle();
    if (clash) throw new Error("Este número já está confirmado para outro portfólio.");

    const { error } = await (supabaseAdmin as any)
      .from("portfolio_whatsapp_confirmations")
      .upsert(
        {
          client_key: data.clientKey,
          whatsapp_digits: digits,
          evidence: data.evidence,
          confirmed_by: context.userId,
          confirmed_at: new Date().toISOString(),
          revoked_at: null,
        },
        { onConflict: "client_key" },
      );
    if (error) throw new Error(error.message);
    return { ok: true, masked: maskPhoneForDisplay(digits) };
  });

export const revokePortfolioWhatsApp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ clientKey: z.string().min(1).max(80) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any)
      .from("portfolio_whatsapp_confirmations")
      .update({ revoked_at: new Date().toISOString() })
      .eq("client_key", data.clientKey);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============================================================================
// Protocolos por portfolio
// ============================================================================

export type PortfolioProtocolRow = {
  id: string;
  createdAt: string;
  protocol: string | null;
  slug: string;
  leadName: string | null;
  leadPhoneMasked: string | null;
  destinationMasked: string | null;
  opened: boolean;
  openedAt: string | null;
};

export const listPortfolioProtocols = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({ days: z.number().int().min(1).max(365).optional(), slug: z.string().max(120).optional() })
      .default({})
      .parse(data ?? {}),
  )
  .handler(async ({ data, context }): Promise<{ rows: PortfolioProtocolRow[] }> => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const since = new Date(Date.now() - (data.days ?? 30) * 86400000).toISOString();

    const { data: sessions, error } = await (supabaseAdmin as any)
      .from("visitor_funnel_sessions")
      .select("id, created_at, protocol, funnel_slug, page_path, lead_id, redirected_at, status")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);

    const rows = (sessions ?? []) as any[];
    const leadIds = rows.map((r) => r.lead_id).filter(Boolean);
    const { data: leads } = leadIds.length
      ? await (supabaseAdmin as any)
          .from("dynamic_form_leads")
          .select("id, contact_name, contact_phone")
          .in("id", leadIds)
      : { data: [] };
    const leadById = new Map(((leads ?? []) as any[]).map((l) => [l.id as string, l]));

    const { data: tokens } = leadIds.length
      ? await (supabaseAdmin as any)
          .from("whatsapp_redirect_tokens")
          .select("lead_id, destination_digits, used_at")
          .in("lead_id", leadIds)
      : { data: [] };
    const tokenByLead = new Map(((tokens ?? []) as any[]).map((t) => [t.lead_id as string, t]));

    const out: PortfolioProtocolRow[] = rows.map((r) => {
      const lead = r.lead_id ? leadById.get(r.lead_id as string) : null;
      const token = r.lead_id ? tokenByLead.get(r.lead_id as string) : null;
      const slug =
        (typeof r.funnel_slug === "string" && r.funnel_slug.replace(/^portfolio-/, "")) ||
        (typeof r.page_path === "string" ? r.page_path.replace("/portfolio/", "") : "—");
      return {
        id: r.id as string,
        createdAt: r.created_at as string,
        protocol: (r.protocol as string | null) ?? null,
        slug,
        leadName: lead?.contact_name ?? null,
        leadPhoneMasked: lead?.contact_phone ? maskPhoneForDisplay(lead.contact_phone) : null,
        destinationMasked: token?.destination_digits
          ? maskPhoneForDisplay(token.destination_digits)
          : null,
        opened: Boolean(r.redirected_at || token?.used_at),
        openedAt: (r.redirected_at as string | null) ?? token?.used_at ?? null,
      };
    });

    const filtered = data.slug ? out.filter((r) => r.slug === data.slug) : out;
    return { rows: filtered };
  });

// ============================================================================
// Leads por portfolio
// ============================================================================

export type PortfolioProjectLead = {
  id: string;
  createdAt: string;
  clientKey: string | null;
  slug: string;
  name: string | null;
  phoneMasked: string | null;
  answers: { label: string; value: string }[];
  whatsappStatus: "OPENED" | "PENDING" | "NO_DESTINATION";
  /**
   * Mensagem pronta para repasse manual ao WhatsApp oficial do próprio
   * cliente. Contém apenas dados do lead; nunca o destino do portfolio.
   */
  handoffMessage: string;
};

function buildLeadHandoffMessage(input: {
  siteName: string;
  slug: string;
  createdAt: string;
  name: string | null;
  phone: string | null;
  answers: { label: string; value: string }[];
}): string {
  const when = new Date(input.createdAt).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
  const lines = [
    `*Novo contato pela página ${input.siteName}*`,
    "",
    `• *Data:* ${when}`,
    `• *Nome:* ${input.name?.trim() || "não informado"}`,
    `• *Telefone:* ${input.phone?.trim() || "não informado"}`,
    `• *Página:* https://0web.com.br/portfolio/${input.slug}`,
  ];
  if (input.answers.length > 0) {
    lines.push("", "*Respostas do formulário*");
    for (const a of input.answers) lines.push(`• *${a.label}:* ${a.value}`);
  }
  lines.push("", "Retorne diretamente para esse contato.");
  return lines.join("\n");
}

export const listPortfolioProjectLeads = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({ days: z.number().int().min(1).max(365).optional(), clientKey: z.string().max(80).optional() })
      .default({})
      .parse(data ?? {}),
  )
  .handler(async ({ data, context }): Promise<{ rows: PortfolioProjectLead[] }> => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const since = new Date(Date.now() - (data.days ?? 30) * 86400000).toISOString();

    const { data: leads, error } = await (supabaseAdmin as any)
      .from("dynamic_form_leads")
      .select("id, created_at, contact_name, contact_phone, answers_json, metadata_json")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);

    const rows = (leads ?? []) as any[];
    const ids = rows.map((r) => r.id as string);
    const { data: tokens } = ids.length
      ? await (supabaseAdmin as any)
          .from("whatsapp_redirect_tokens")
          .select("lead_id, used_at")
          .in("lead_id", ids)
      : { data: [] };
    const tokenByLead = new Map(((tokens ?? []) as any[]).map((t) => [t.lead_id as string, t]));

    const out = rows
      .map((r) => {
        const meta = (r.metadata_json ?? {}) as Record<string, unknown>;
        const clientKey = typeof meta.client_key === "string" ? meta.client_key : null;
        if (!clientKey || !CLIENT_KEYS.has(clientKey)) return null;
        const answers = Object.entries((r.answers_json ?? {}) as Record<string, unknown>)
          .filter(([, v]) => v != null && String(v).trim() !== "")
          .slice(0, 12)
          .map(([label, value]) => ({ label, value: String(value).slice(0, 200) }));
        const token = tokenByLead.get(r.id as string);
        const client = CLIENTS.find((c) => c.clientKey === clientKey);
        return {
          id: r.id as string,
          createdAt: r.created_at as string,
          clientKey,
          slug: client?.slug ?? clientKey,
          name: r.contact_name ?? null,
          phoneMasked: r.contact_phone ? maskPhoneForDisplay(r.contact_phone) : null,
          answers,
          handoffMessage: buildLeadHandoffMessage({
            siteName: client?.siteName ?? clientKey,
            slug: client?.slug ?? clientKey,
            createdAt: r.created_at as string,
            name: (r.contact_name as string | null) ?? null,
            phone: (r.contact_phone as string | null) ?? null,
            answers,
          }),
          whatsappStatus: token
            ? token.used_at
              ? ("OPENED" as const)
              : ("PENDING" as const)
            : ("NO_DESTINATION" as const),
        };
      })
      .filter(Boolean) as PortfolioProjectLead[];

    const filtered = data.clientKey ? out.filter((r) => r.clientKey === data.clientKey) : out;
    return { rows: filtered };
  });
