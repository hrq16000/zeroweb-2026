/**
 * Captação comercial da 0WEB originada nas páginas `/portfolio/:slug`.
 *
 * Arquitetura (Frente E — reuso, sem estrutura paralela):
 *  - persistência: `dynamic_form_leads` (mesma base de todos os leads),
 *    ligada ao formulário seeded `0web-portfolio-captacao`;
 *  - histórico: `lead_stage_history` (trigger já existente + notas);
 *  - WhatsApp: token opaco existente (`/r/whatsapp/:token`) — nenhum wa.me
 *    é montado no cliente e o número da 0WEB nunca entra no bundle;
 *  - rate limit: RPC `check_and_record_rate_limit` já existente.
 */
import { createServerFn } from "@tanstack/react-start";
import { getRequest, getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  HOST_CAPTURE_FUNNEL_SLUG,
  HOST_CAPTURE_SOURCE,
  buildAttribution,
  isHostLeadStatus,
  maskPhoneForDisplay,
  normalizeBrazilPhone,
  sanitizeField,
  type Attribution,
  type HostLeadStatus,
} from "@/lib/portfolio-host-leads";

/** Janela de deduplicação: mesmo telefone + mesmo projeto. */
export const HOST_LEAD_DEDUPE_WINDOW_MS = 30 * 60 * 1000;
/** Rate limit por IP: 5 envios a cada 10 minutos. */
export const HOST_LEAD_RATE_WINDOW_S = 600;
export const HOST_LEAD_RATE_MAX = 5;
/** Tempo mínimo entre abrir e enviar o formulário (anti-bot). */
export const HOST_LEAD_MIN_FILL_MS = 1200;

const submitSchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(8).max(40),
  city: z.string().min(2).max(120),
  /** Honeypot: precisa chegar vazio. */
  company: z.string().max(200).optional(),
  /** Epoch ms em que o formulário foi exibido. */
  startedAt: z.number().int().nonnegative().optional(),
  attribution: z
    .object({
      portfolioSlug: z.string().max(120).optional(),
      portfolioBusinessName: z.string().max(160).optional(),
      landingUrl: z.string().max(500).optional(),
      referrer: z.string().max(500).optional(),
      utmSource: z.string().max(120).nullable().optional(),
      utmMedium: z.string().max(120).nullable().optional(),
      utmCampaign: z.string().max(160).nullable().optional(),
      utmContent: z.string().max(160).nullable().optional(),
      utmTerm: z.string().max(160).nullable().optional(),
      sessionId: z.string().max(120).nullable().optional(),
      visitorId: z.string().max(120).nullable().optional(),
    })
    .partial()
    .optional(),
});

export type SubmitHostLeadResult =
  | { ok: true; leadId: string; redirectPath: string | null; deduped: boolean }
  | { ok: false; reason: "invalid_phone" | "rate_limited" | "spam" | "db_error" };

/**
 * Persiste o contato do pop-up e devolve o caminho opaco de redirect para o
 * WhatsApp. Público por natureza (visitante anônimo), protegido por
 * validação server-side, honeypot, janela mínima, rate limit e dedupe.
 */
export const submitPortfolioHostLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => submitSchema.parse(data))
  .handler(async ({ data }): Promise<SubmitHostLeadResult> => {
    // Honeypot + janela mínima de preenchimento.
    if (sanitizeField(data.company, 200)) return { ok: false, reason: "spam" };
    if (data.startedAt && Date.now() - data.startedAt < HOST_LEAD_MIN_FILL_MS) {
      return { ok: false, reason: "spam" };
    }

    const name = sanitizeField(data.name, 120);
    const city = sanitizeField(data.city, 120);
    const phone = normalizeBrazilPhone(data.phone);
    if (!name || !city) return { ok: false, reason: "spam" };
    if (!phone.ok) return { ok: false, reason: "invalid_phone" };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { createWhatsAppRedirectToken, hashIp } = await import("@/lib/whatsapp-redirect.server");

    let ip: string | null = null;
    let serverReferrer: string | null = null;
    let userAgent: string | null = null;
    try {
      ip = getRequestIP({ xForwardedFor: true }) ?? null;
      serverReferrer = getRequestHeader("referer") ?? null;
      userAgent = getRequest().headers.get("user-agent");
    } catch {
      /* sem contexto de request (testes/prerender) */
    }
    const ipHash = hashIp(ip);

    // Rate limit por IP (NAT-friendly: janela larga, teto baixo).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rlOk } = await (supabaseAdmin as any).rpc("check_and_record_rate_limit", {
      p_scope: "portfolio_host_lead",
      p_ip_hash: ipHash ?? "no-ip",
      p_window_seconds: HOST_LEAD_RATE_WINDOW_S,
      p_max_hits: HOST_LEAD_RATE_MAX,
    });
    if (rlOk === false) return { ok: false, reason: "rate_limited" };

    const attribution: Attribution = buildAttribution({
      ...(data.attribution ?? {}),
      referrer: data.attribution?.referrer ?? serverReferrer,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: form } = await (supabaseAdmin as any)
      .from("dynamic_forms")
      .select("id")
      .eq("slug", HOST_CAPTURE_FUNNEL_SLUG)
      .maybeSingle();
    if (!form?.id) return { ok: false, reason: "db_error" };

    // Dedupe: mesmo telefone + mesmo projeto dentro da janela reaproveita o lead.
    const since = new Date(Date.now() - HOST_LEAD_DEDUPE_WINDOW_MS).toISOString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: recent } = await (supabaseAdmin as any)
      .from("dynamic_form_leads")
      .select("id, metadata_json")
      .eq("form_id", form.id)
      .eq("contact_phone", phone.digits)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5);

    const duplicate = ((recent ?? []) as { id: string; metadata_json: Record<string, unknown> | null }[]).find(
      (r) => (r.metadata_json?.portfolio_slug ?? null) === attribution.portfolioSlug,
    );

    let leadId = duplicate?.id ?? null;

    if (!leadId) {
      const metadata: Record<string, unknown> = {
        source: HOST_CAPTURE_SOURCE,
        portfolio_slug: attribution.portfolioSlug,
        portfolio_business_name: attribution.portfolioBusinessName,
        landing_url: attribution.landingUrl,
        referrer: attribution.referrer,
        utm: {
          source: attribution.utmSource,
          medium: attribution.utmMedium,
          campaign: attribution.utmCampaign,
          content: attribution.utmContent,
          term: attribution.utmTerm,
        },
        session_id: attribution.sessionId,
        visitor_id: attribution.visitorId,
        ip_hash: ipHash,
        user_agent: userAgent,
        submitted_at: new Date().toISOString(),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: lead, error } = await (supabaseAdmin as any)
        .from("dynamic_form_leads")
        .insert({
          form_id: form.id,
          answers_json: {
            nome: name,
            telefone: phone.digits,
            cidade: city,
            projeto_origem: attribution.portfolioBusinessName ?? attribution.portfolioSlug,
          },
          metadata_json: metadata,
          contact_name: name,
          contact_phone: phone.digits,
          whatsapp_alert_status: "disabled",
          pipeline_stage: "novo",
        })
        .select("id")
        .single();
      if (error || !lead?.id) return { ok: false, reason: "db_error" };
      leadId = lead.id as string;
    }

    const token = await createWhatsAppRedirectToken({ leadId, ipHash });
    return {
      ok: true,
      leadId,
      redirectPath: token.ok ? token.redirectPath : null,
      deduped: Boolean(duplicate),
    };
  });

// ---------------------------------------------------------------------------
// Painel administrativo
// ---------------------------------------------------------------------------

export type HostLead = {
  id: string;
  createdAt: string;
  name: string | null;
  phone: string | null;
  phoneMasked: string;
  city: string | null;
  portfolioSlug: string | null;
  portfolioBusinessName: string | null;
  landingUrl: string | null;
  referrer: string | null;
  utm: { source: string | null; medium: string | null; campaign: string | null; content: string | null; term: string | null };
  sessionId: string | null;
  visitorId: string | null;
  status: HostLeadStatus;
  whatsappOpenedAt: string | null;
  history: { at: string; kind: string; detail: string | null }[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function assertAdmin(supabase: any, userId: string) {
  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const allowed = (roles ?? []).some(
    (r: { role: string }) => r.role === "admin" || r.role === "super_admin",
  );
  if (!allowed) throw new Error("forbidden");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return supabaseAdmin as any;
}

const str = (v: unknown): string | null => (typeof v === "string" && v ? v : null);

export const listPortfolioHostLeads = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        days: z.number().int().min(1).max(365).default(30),
        slug: z.string().max(120).optional(),
        status: z.string().max(40).optional(),
        search: z.string().max(80).optional(),
        limit: z.number().int().min(1).max(500).default(200),
      })
      .parse(data ?? {}),
  )
  .handler(async ({ data, context }): Promise<{ leads: HostLead[]; slugs: string[] }> => {
    const supabaseAdmin = await assertAdmin(context.supabase, context.userId);
    const since = new Date(Date.now() - data.days * 24 * 60 * 60 * 1000).toISOString();

    const { data: form } = await supabaseAdmin
      .from("dynamic_forms")
      .select("id")
      .eq("slug", HOST_CAPTURE_FUNNEL_SLUG)
      .maybeSingle();
    if (!form?.id) return { leads: [], slugs: [] };

    const { data: rows, error } = await supabaseAdmin
      .from("dynamic_form_leads")
      .select("id, created_at, contact_name, contact_phone, answers_json, metadata_json, pipeline_stage")
      .eq("form_id", form.id)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (error) throw new Error(error.message);

    const ids = (rows ?? []).map((r: { id: string }) => r.id);
    const [{ data: stages }, { data: tokens }] = await Promise.all([
      ids.length
        ? supabaseAdmin
            .from("lead_stage_history")
            .select("lead_id, from_stage, to_stage, reason, created_at")
            .in("lead_id", ids)
            .order("created_at", { ascending: true })
        : Promise.resolve({ data: [] }),
      ids.length
        ? supabaseAdmin
            .from("whatsapp_redirect_tokens")
            .select("lead_id, used_at")
            .in("lead_id", ids)
            .not("used_at", "is", null)
        : Promise.resolve({ data: [] }),
    ]);

    const openedAt = new Map<string, string>();
    for (const t of (tokens ?? []) as { lead_id: string; used_at: string }[]) {
      const prev = openedAt.get(t.lead_id);
      if (!prev || t.used_at < prev) openedAt.set(t.lead_id, t.used_at);
    }

    const historyByLead = new Map<string, HostLead["history"]>();
    for (const s of (stages ?? []) as {
      lead_id: string;
      from_stage: string | null;
      to_stage: string;
      reason: string | null;
      created_at: string;
    }[]) {
      const list = historyByLead.get(s.lead_id) ?? [];
      list.push({
        at: s.created_at,
        kind: s.from_stage ? "status" : "criado",
        detail: s.from_stage ? `${s.from_stage} → ${s.to_stage}${s.reason ? ` · ${s.reason}` : ""}` : s.reason,
      });
      historyByLead.set(s.lead_id, list);
    }

    let leads: HostLead[] = ((rows ?? []) as Record<string, any>[]).map((r) => {
      const meta = (r.metadata_json ?? {}) as Record<string, unknown>;
      const utm = (meta.utm ?? {}) as Record<string, unknown>;
      const answers = (r.answers_json ?? {}) as Record<string, unknown>;
      const history = historyByLead.get(r.id) ?? [];
      const opened = openedAt.get(r.id) ?? null;
      return {
        id: r.id,
        createdAt: r.created_at,
        name: r.contact_name ?? null,
        phone: r.contact_phone ?? null,
        phoneMasked: maskPhoneForDisplay(r.contact_phone),
        city: str(answers.cidade),
        portfolioSlug: str(meta.portfolio_slug),
        portfolioBusinessName: str(meta.portfolio_business_name),
        landingUrl: str(meta.landing_url),
        referrer: str(meta.referrer),
        utm: {
          source: str(utm.source),
          medium: str(utm.medium),
          campaign: str(utm.campaign),
          content: str(utm.content),
          term: str(utm.term),
        },
        sessionId: str(meta.session_id),
        visitorId: str(meta.visitor_id),
        status: isHostLeadStatus(r.pipeline_stage) ? r.pipeline_stage : "novo",
        whatsappOpenedAt: opened,
        history: [
          { at: r.created_at, kind: "criado", detail: "Lead criado pelo pop-up do portfólio" },
          ...(opened ? [{ at: opened, kind: "whatsapp", detail: "WhatsApp aberto" }] : []),
          ...history.filter((h) => h.kind !== "criado"),
        ].sort((a, b) => a.at.localeCompare(b.at)),
      };
    });

    const slugs = Array.from(
      new Set(leads.map((l) => l.portfolioSlug).filter(Boolean) as string[]),
    ).sort();

    if (data.slug) leads = leads.filter((l) => l.portfolioSlug === data.slug);
    if (data.status) leads = leads.filter((l) => l.status === data.status);
    if (data.search) {
      const q = data.search.toLowerCase();
      const qDigits = data.search.replace(/\D/g, "");
      leads = leads.filter(
        (l) =>
          (l.name ?? "").toLowerCase().includes(q) ||
          (qDigits.length >= 4 && (l.phone ?? "").includes(qDigits)),
      );
    }

    return { leads, slugs };
  });

export const updatePortfolioHostLeadStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        leadId: z.string().uuid(),
        status: z.string().max(40),
        note: z.string().max(400).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await assertAdmin(context.supabase, context.userId);
    if (!isHostLeadStatus(data.status)) throw new Error("status inválido");
    const note = sanitizeField(data.note, 400) || null;

    const { data: current } = await supabaseAdmin
      .from("dynamic_form_leads")
      .select("pipeline_stage")
      .eq("id", data.leadId)
      .maybeSingle();

    const { error } = await supabaseAdmin
      .from("dynamic_form_leads")
      .update({ pipeline_stage: data.status })
      .eq("id", data.leadId);
    if (error) throw new Error(error.message);

    await supabaseAdmin.from("lead_stage_history").insert({
      lead_id: data.leadId,
      from_stage: current?.pipeline_stage ?? null,
      to_stage: data.status,
      reason: note,
      actor: context.userId,
    });

    return { ok: true, status: data.status as HostLeadStatus };
  });

/** Resumo por projeto. Métrica sem fonte contínua devolve `null` (nunca 0). */
export const getPortfolioHostLeadSummary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ days: z.number().int().min(1).max(365).default(30) }).parse(data ?? {}))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await assertAdmin(context.supabase, context.userId);
    const since = new Date(Date.now() - data.days * 24 * 60 * 60 * 1000).toISOString();

    const { data: form } = await supabaseAdmin
      .from("dynamic_forms")
      .select("id")
      .eq("slug", HOST_CAPTURE_FUNNEL_SLUG)
      .maybeSingle();
    if (!form?.id) return { rows: [] as { slug: string; leads: number; whatsapp: number }[] };

    const { data: rows } = await supabaseAdmin
      .from("dynamic_form_leads")
      .select("id, metadata_json")
      .eq("form_id", form.id)
      .gte("created_at", since);

    const ids = (rows ?? []).map((r: { id: string }) => r.id);
    const { data: tokens } = ids.length
      ? await supabaseAdmin
          .from("whatsapp_redirect_tokens")
          .select("lead_id")
          .in("lead_id", ids)
          .not("used_at", "is", null)
      : { data: [] };
    const opened = new Set((tokens ?? []).map((t: { lead_id: string }) => t.lead_id));

    const agg = new Map<string, { slug: string; leads: number; whatsapp: number }>();
    for (const r of (rows ?? []) as { id: string; metadata_json: Record<string, unknown> | null }[]) {
      const slug = str(r.metadata_json?.portfolio_slug) ?? "—";
      const entry = agg.get(slug) ?? { slug, leads: 0, whatsapp: 0 };
      entry.leads += 1;
      if (opened.has(r.id)) entry.whatsapp += 1;
      agg.set(slug, entry);
    }

    return { rows: Array.from(agg.values()).sort((a, b) => b.leads - a.leads) };
  });
