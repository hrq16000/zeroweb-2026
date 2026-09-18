import { createServerFn } from "@tanstack/react-start";
import { getRequest, getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";
import { PORTFOLIO_CLIENT_KEYS } from "@/lib/portfolio-client-keys";
import { scoreLead } from "./lead-scoring";

// ============ Types (also used by the client UI) ============
export type FunnelQuestionType =
  | "short_text" | "long_text" | "email" | "phone"
  | "select" | "radio" | "checkbox" | "number" | "statement";

export interface FunnelOption { value: string; label: string; emoji?: string }
export interface FunnelQuestion {
  id: string;
  key: string;
  type: FunnelQuestionType;
  label: string;
  hint: string | null;
  placeholder: string | null;
  required: boolean;
  order_index: number;
  options: FunnelOption[];
}
export interface FunnelCondition {
  id: string;
  from_question_id: string;
  operator: "equals" | "not_equals" | "contains" | "in" | "not_in" | "is_empty" | "is_not_empty";
  value: any;
  action: "skip_to" | "end_form";
  target_question_id: string | null;
  priority: number;
}
export interface FunnelDefinition {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  config: Record<string, any>;
  whatsapp_enabled: boolean;
  questions: FunnelQuestion[];
  conditions: FunnelCondition[];
}

// ============ getPublicFunnel ============
export const getPublicFunnel = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) =>
    z.object({ slug: z.string().min(1).max(120) }).parse(data),
  )
  .handler(async ({ data }): Promise<FunnelDefinition | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: form, error } = await supabaseAdmin
      .from("dynamic_forms")
      .select("id, slug, name, description, status, config_json, whatsapp_config")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!form) return null;

    const [{ data: qs }, { data: cs }] = await Promise.all([
      supabaseAdmin
        .from("dynamic_form_questions")
        .select("id, key, type, label, hint, placeholder, required, order_index, options_json")
        .eq("form_id", form.id)
        .order("order_index", { ascending: true }),
      supabaseAdmin
        .from("dynamic_form_conditions")
        .select("id, from_question_id, operator, value, action, target_question_id, priority")
        .eq("form_id", form.id)
        .order("priority", { ascending: true }),
    ]);

    const wa = (form.whatsapp_config ?? {}) as Record<string, unknown>;
    return {
      id: form.id,
      slug: form.slug,
      name: form.name,
      description: form.description,
      config: (form.config_json ?? {}) as Record<string, any>,
      whatsapp_enabled: Boolean(wa.enabled) && Boolean(wa.redirect_phone),
      questions: (qs ?? []).map((q) => ({
        id: q.id,
        key: q.key,
        type: q.type as FunnelQuestionType,
        label: q.label,
        hint: q.hint,
        placeholder: q.placeholder,
        required: q.required,
        order_index: q.order_index,
        options: Array.isArray(q.options_json) ? (q.options_json as unknown as FunnelOption[]) : [],
      })),
      conditions: (cs ?? []).map((c) => ({
        id: c.id,
        from_question_id: c.from_question_id,
        operator: c.operator as FunnelCondition["operator"],
        value: c.value,
        action: c.action as FunnelCondition["action"],
        target_question_id: c.target_question_id,
        priority: c.priority,
      })),
    };
  });

// ============ submitFunnel ============
const submitSchema = z.object({
  form_id: z.string().uuid(),
  answers: z.record(z.string(), z.any()),
  client_metadata: z
    .object({
      page_url: z.string().max(2000).optional(),
      referrer: z.string().max(2000).optional(),
      utm: z.record(z.string(), z.string().max(255)).optional(),
      gclid: z.string().max(255).optional(),
      fbclid: z.string().max(255).optional(),
      started_at: z.string().max(50).optional(),
      session_id: z.string().min(4).max(120).optional(),
      // Chave do cliente de portfólio: isola o lead e o destino pelo clientKey.
      client_key: z.enum(PORTFOLIO_CLIENT_KEYS).optional(),
      // Contexto de carrinho/pedido preservado em todas as transições.
      order_context: z
        .object({
          order_items: z.string().max(2000).optional(),
          order_total: z.string().max(40).optional(),
          fulfillment: z.string().max(60).optional(),
          customer_note: z.string().max(280).optional(),
        })
        .partial()
        .optional(),
    })
    .optional(),
  // Compatibilidade com fluxos institucionais que ainda coletam um meio de retorno.
  recovery_contact: z.string().max(40).optional(),
});

async function lookupGeo(ip: string | null): Promise<Record<string, unknown>> {
  if (!ip || ip === "127.0.0.1" || ip === "::1") return {};
  try {
    const r = await fetch(`https://ipwho.is/${ip}`, { signal: AbortSignal.timeout(2500) });
    if (!r.ok) return {};
    const j = (await r.json()) as Record<string, unknown>;
    if (j && j.success === false) return {};
    return {
      city: j.city, region: j.region, country: j.country,
      neighborhood: j.district ?? j.suburb ?? j.neighborhood,
      isp: (j.connection as Record<string, unknown> | undefined)?.isp,
      org: (j.connection as Record<string, unknown> | undefined)?.org,
    };
  } catch { return {}; }
}

function fmtAnswers(answers: Record<string, unknown>, questions: { key: string; label: string; options: FunnelOption[] }[]): string {
  return questions
    .filter((q) => answers[q.key] !== undefined && answers[q.key] !== null && answers[q.key] !== "")
    .map((q) => {
      const raw = answers[q.key];
      const display = Array.isArray(raw)
        ? raw.map((v) => q.options.find((o) => o.value === v)?.label ?? String(v)).join(", ")
        : q.options.find((o) => o.value === raw)?.label ?? String(raw);
      return `• *${q.label}*: ${display}`;
    })
    .join("\n");
}

function fmtMetadata(meta: Record<string, unknown>): string {
  const lines: string[] = [];
  if (meta.city || meta.region) lines.push(`📍 ${meta.city ?? "?"} - ${meta.region ?? "?"} ${meta.country ? `(${meta.country})` : ""}`);
  if (meta.isp) lines.push(`🌐 ISP: ${meta.isp}`);
  if (meta.ip) lines.push(`🔢 IP: ${meta.ip}`);
  if (meta.page_url) lines.push(`📄 Página: ${meta.page_url}`);
  if (meta.referrer) lines.push(`↩️ Referrer: ${meta.referrer}`);
  const utm = meta.utm as Record<string, string> | undefined;
  if (utm && Object.keys(utm).length) {
    lines.push(`🎯 UTM: ${Object.entries(utm).map(([k, v]) => `${k}=${v}`).join(" | ")}`);
  }
  return lines.join("\n");
}

function applyTemplate(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? "");
}

function digitsOnly(p: string): string { return p.replace(/\D/g, ""); }

export const submitFunnel = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => submitSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: form, error: fErr } = await supabaseAdmin
      .from("dynamic_forms")
      .select("id, name, slug, status, whatsapp_config")
      .eq("id", data.form_id)
      .maybeSingle();
    if (fErr) throw new Error(fErr.message);
    if (!form || form.status !== "published") throw new Error("Funil não disponível");

    const { data: qs } = await supabaseAdmin
      .from("dynamic_form_questions")
      .select("key, label, type, options_json")
      .eq("form_id", form.id)
      .order("order_index", { ascending: true });
    const questions = (qs ?? []).map((q) => ({
      key: q.key, label: q.label, type: q.type,
      options: Array.isArray(q.options_json) ? (q.options_json as unknown as FunnelOption[]) : [],
    }));

    // ---- metadata ----
    let ip: string | null = null;
    try { ip = getRequestIP({ xForwardedFor: true }) ?? null; } catch { /* no req ctx */ }
    let user_agent = ""; let referrer = "";
    try {
      const req = getRequest();
      user_agent = req.headers.get("user-agent") ?? "";
      referrer = getRequestHeader("referer") ?? "";
    } catch { /* */ }
    // Antiabuso: teto generoso por IP para envios públicos. Nenhum lead é
    // descartado em silêncio — quem excede recebe erro explícito.
    const { allowPublicIntake } = await import("@/lib/public-intake-throttle.server");
    if (!(await allowPublicIntake("funnel_submit", ip))) {
      throw new Error("Muitos envios seguidos. Aguarde alguns minutos e tente novamente.");
    }

    const geo = await lookupGeo(ip);
    const metadata: Record<string, unknown> = {
      ip, user_agent,
      referrer: data.client_metadata?.referrer ?? referrer,
      page_url: data.client_metadata?.page_url,
      utm: data.client_metadata?.utm ?? {},
      gclid: data.client_metadata?.gclid,
      fbclid: data.client_metadata?.fbclid,
      started_at: data.client_metadata?.started_at,
      // Identificador técnico da sessão de telemetria (sem PII), quando o
      // cliente o envia: é o que liga o lead à origem já medida.
      ...(data.client_metadata?.session_id ? { session_id: data.client_metadata.session_id } : {}),
      ...(data.client_metadata?.client_key
        ? { client_key: data.client_metadata.client_key }
        : {}),
      ...(data.client_metadata?.order_context &&
      Object.values(data.client_metadata.order_context).some((v) => typeof v === "string" && v)
        ? { order_context: data.client_metadata.order_context }
        : {}),
      completed_at: new Date().toISOString(),
      ...geo,
    };

    // pull contact fields
    const contact_name = (data.answers.nome ?? data.answers.name ?? null) as string | null;
    const contact_email = (data.answers.email ?? null) as string | null;
    const answeredPhone = (data.answers.telefone ?? data.answers.phone ?? data.answers.whatsapp ?? null) as string | null;

    const { normalizeRecoveryPhone, RECOVERY_CONTACT_PURPOSE } = await import(
      "@/lib/lead-recoverability"
    );
    const recoveryPhone = normalizeRecoveryPhone(data.recovery_contact ?? null);
    const contact_phone = answeredPhone || recoveryPhone;
    if (recoveryPhone && !answeredPhone) {
      metadata.recovery_contact_kind = "whatsapp";
      metadata.recovery_contact_purpose = RECOVERY_CONTACT_PURPOSE;
      metadata.recovery_contact_collected_at = new Date().toISOString();
    }

    // ---- Internal notification metadata ----
    const wa = (form.whatsapp_config ?? {}) as Record<string, unknown>;
    const answersText = fmtAnswers(data.answers, questions);
    const metadataText = fmtMetadata(metadata);
    const whatsapp_user_url: string | null = null;

    // ---- Scoring + tags ----
    const scoring = scoreLead(data.answers);

    // ---- Insert lead: sempre antes da decisão de redirect ----
    const { data: lead, error: insErr } = await supabaseAdmin
      .from("dynamic_form_leads")
      .insert({
        form_id: form.id,
        answers_json: data.answers,
        metadata_json: metadata as any,
        contact_name, contact_email, contact_phone,
        whatsapp_user_url,
        whatsapp_alert_status: wa.enabled && wa.alert_phone ? "pending" : "disabled",
        score: scoring.score,
        score_breakdown: scoring.breakdown,
        tags: scoring.tags,
        intent_level: scoring.intent,
        pipeline_stage: scoring.intent === "hot" ? "qualificado" : "novo",
      } as any)
      .select("id")
      .single();
    if (insErr) throw new Error(insErr.message);

    // ---- Internal alert (best-effort, non-blocking semantics) ----
    let alertStatus: "sent" | "failed" | "disabled" = "disabled";
    let alertError: string | null = null;
    if (wa.enabled && wa.alert_phone) {
      try {
        const tpl = (wa.alert_message_template as string) ||
          "*Novo lead — {{form}}*\n\n{{answers}}\n\n{{metadata}}";
        const msg = applyTemplate(tpl, { answers: answersText, metadata: metadataText, form: form.name });

        const baseUrl = (wa.api_base_url as string) || process.env.UAZAPI_BASE_URL || "";
        const alertToken = (wa.api_token as string) || process.env.UAZAPI_TOKEN || "";
        const provider = (wa.provider as string) || "uazapi";

        if (baseUrl && alertToken && provider === "uazapi") {
          const r = await fetch(`${baseUrl.replace(/\/$/, "")}/send/text`, {
            method: "POST",
            headers: { "Content-Type": "application/json", token: alertToken },
            body: JSON.stringify({ number: digitsOnly(String(wa.alert_phone)), text: msg }),
            signal: AbortSignal.timeout(5000),
          });
          if (!r.ok) { alertStatus = "failed"; alertError = `HTTP ${r.status}`; }
          else { alertStatus = "sent"; }
        } else {
          alertStatus = "failed";
          alertError = "Provider/credenciais não configurados";
        }
      } catch (e) {
        alertStatus = "failed";
        alertError = e instanceof Error ? e.message : "Erro desconhecido";
      }

      await supabaseAdmin.from("dynamic_form_leads").update({
        whatsapp_alert_status: alertStatus,
        whatsapp_alert_error: alertError,
        whatsapp_alert_sent_at: alertStatus === "sent" ? new Date().toISOString() : null,
      }).eq("id", lead.id);
    }

    // ---- Tokenized WhatsApp redirect (funnel-first) ----
    const { createWhatsAppRedirectToken, hashIp, makeProtocol } = await import(
      "@/lib/whatsapp-redirect.server"
    );
    const protocol = makeProtocol();
    // O protocolo fica junto do lead para que o painel possa acompanhar a
    // requisição pelo mesmo código mostrado ao visitante.
    metadata.protocol = protocol;
    await supabaseAdmin
      .from("dynamic_form_leads")
      .update({ metadata_json: metadata as any })
      .eq("id", lead.id);

    // Best-effort: associate a client-created funnel session (if any).
    const clientSessionId = (data.client_metadata as unknown as { session_id?: string } | undefined)?.session_id;
    let funnelSessionUuid: string | null = null;
    if (clientSessionId && typeof clientSessionId === "string" && clientSessionId.length >= 4) {
      const { data: sess } = await supabaseAdmin
        .from("visitor_funnel_sessions" as never)
        .select("id")
        .eq("session_id", clientSessionId)
        .maybeSingle();
      if (sess && (sess as { id: string }).id) {
        funnelSessionUuid = (sess as { id: string }).id;
        await supabaseAdmin
          .from("visitor_funnel_sessions" as never)
          .update({
            status: "form_submitted",
            submitted_at: new Date().toISOString(),
            protocol,
          } as never)
          .eq("session_id", clientSessionId);
      }
    }

    const clientKey = (data.client_metadata?.client_key ?? null) as string | null;
    const { decideLeadRecoverability } = await import("@/lib/lead-recoverability");
    const {
      getPortfolioWhatsAppChannelStateAsync,
      getWhatsAppDestinationDigits,
    } = await import("@/lib/whatsapp-redirect.server");
    const destinationStatus = clientKey
      ? await getPortfolioWhatsAppChannelStateAsync(clientKey as never)
      : getWhatsAppDestinationDigits()
        ? ("CONFIGURED" as const)
        : ("NOT_CONFIGURED" as const);
    const destinationConfigured = destinationStatus === "CONFIGURED";

    const tokenResult = destinationConfigured
      ? await createWhatsAppRedirectToken({
          leadId: lead.id,
          funnelSessionId: funnelSessionUuid,
          ipHash: hashIp(ip),
        })
      : ({ ok: false as const, redirectPath: null });
    const redirectPath = tokenResult.ok ? tokenResult.redirectPath : null;

    const hasRecoverableContact = Boolean(
      normalizeRecoveryPhone(contact_phone ?? null) || contact_email,
    );
    const decision = decideLeadRecoverability({
      destinationConfigured,
      hasRecoverableContact,
      failureReason: destinationConfigured && !tokenResult.ok ? "token_creation_failed" : null,
    });
    const { recordLeadDelivery } = await import("@/lib/lead-delivery-ledger.server");
    await recordLeadDelivery({
      leadId: lead.id as string,
      clientKey,
      destinationStatus: destinationConfigured ? "CONFIGURED" : "NOT_CONFIGURED",
      deliveryStatus: decision.deliveryStatus,
      recoverability: decision.recoverability,
      hasRecoverableContact,
      failureReason: destinationConfigured
        ? tokenResult.ok
          ? null
          : "token_creation_failed"
        : "missing_client_whatsapp_number",
    });

    return {
      success: true as const,
      submissionId: lead.id,
      protocol,
      redirectPath,
      redirectAvailable: tokenResult.ok,
      nextPath: "/obrigado" as const,
      alert_status: alertStatus,
      deliveryState: decision.deliveryStatus,
      recoverability: decision.recoverability,
      // Portfolio sem WhatsApp é lead-only e conclui normalmente. A exigência
      // de contato de recuperação fica restrita aos fluxos institucionais.
      requiresRecoveryContact: clientKey ? false : decision.requiresRecoveryContact,
    };
  });

/**
 * Compatibilidade para fluxos institucionais que ainda podem anexar um meio de
 * retorno a um lead já salvo. Portfolios não dependem deste passo para concluir.
 */
export const attachFunnelRecoveryContact = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({
      lead_id: z.string().uuid(),
      contact: z.string().max(40),
      client_key: z.enum(PORTFOLIO_CLIENT_KEYS).optional(),
    }).parse(data),
  )
  .handler(async ({ data }) => {
    const { normalizeRecoveryPhone, RECOVERY_CONTACT_PURPOSE, decideLeadRecoverability } =
      await import("@/lib/lead-recoverability");
    const phone = normalizeRecoveryPhone(data.contact);
    if (!phone) return { ok: false as const, reason: "invalid_contact" as const };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: lead } = await supabaseAdmin
      .from("dynamic_form_leads")
      .select("id, metadata_json")
      .eq("id", data.lead_id)
      .maybeSingle();
    if (!lead) return { ok: false as const, reason: "not_found" as const };

    const metadata = {
      ...((lead.metadata_json ?? {}) as Record<string, unknown>),
      recovery_contact_kind: "whatsapp",
      recovery_contact_purpose: RECOVERY_CONTACT_PURPOSE,
      recovery_contact_collected_at: new Date().toISOString(),
    };
    const { error } = await supabaseAdmin
      .from("dynamic_form_leads")
      .update({ contact_phone: phone, metadata_json: metadata as never })
      .eq("id", data.lead_id);
    if (error) return { ok: false as const, reason: "persist_failed" as const };

    const decision = decideLeadRecoverability({
      destinationConfigured: false,
      hasRecoverableContact: true,
    });
    const { recordLeadDelivery } = await import("@/lib/lead-delivery-ledger.server");
    await recordLeadDelivery({
      leadId: data.lead_id,
      clientKey: data.client_key ?? null,
      destinationStatus: "NOT_CONFIGURED",
      deliveryStatus: decision.deliveryStatus,
      recoverability: decision.recoverability,
      hasRecoverableContact: true,
      failureReason: "missing_client_whatsapp_number",
    });
    return { ok: true as const, recoverability: decision.recoverability };
  });

/**
 * Envia os cinco passos dos portfólios de clientes para o mesmo handoff
 * tokenizado usado pelos funis oficiais. O destinatário é resolvido pelo
 * clientKey a partir do dado versionado do próprio portfolio.
 */
const softText = (max: number) =>
  z.preprocess(
    (v) => (typeof v === "string" ? v.slice(0, max) : v),
    z.string().max(max),
  );

export const submitPortfolioQuiz = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({
    clientKey: z.enum(PORTFOLIO_CLIENT_KEYS),
    studioName: z.string().min(1).max(100),
    recipientName: z.string().min(1).max(80),
    mode: z.enum(["booking", "proposal"]),
    proposalKind: z.enum(["campaign", "service"]).default("service"),
    pageUrl: z.string().url().max(500).optional(),
    sessionId: z.string().min(4).max(120).optional(),
    visitorId: z.string().min(4).max(120).optional(),
    orderContext: z.object({
      order_items: softText(8000).optional(),
      order_total: softText(120).optional(),
      fulfillment: softText(120).optional(),
      customer_note: softText(2000).optional(),
    }).optional(),
    // Campo opcional mantido por compatibilidade; portfolio sem número não o exige.
    recoveryContact: z.string().max(40).optional(),
    previewLocation: softText(120).optional(),
    answers: z.object({
      service: softText(8000),
      experience: softText(400),
      period: softText(400),
      timing: softText(400),
      note: softText(2000),
    }),
  }).parse(data))

  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const orderContext = {
      order_items: data.orderContext?.order_items || data.answers.service || undefined,
      order_total: data.orderContext?.order_total || undefined,
      fulfillment: data.orderContext?.fulfillment || data.answers.period || undefined,
      customer_note: data.orderContext?.customer_note || data.answers.note || undefined,
    };
    const hasOrderContext = Object.values(orderContext).some(Boolean);
    const clientFunnelSlug = `portfolio-${data.clientKey}`;
    const clientFunnelSlugAlt = `funnel-${data.clientKey}`;
    const { data: forms, error: formError } = await supabaseAdmin
      .from("dynamic_forms")
      .select("id, slug")
      .in("slug", [clientFunnelSlug, clientFunnelSlugAlt, "funnel-service"])
      .eq("status", "published");
    if (formError) throw new Error("Funil de atendimento indisponível");
    const form =
      (forms ?? []).find((f) => f.slug === clientFunnelSlug) ??
      (forms ?? []).find((f) => f.slug === clientFunnelSlugAlt) ??
      (forms ?? []).find((f) => f.slug === "funnel-service");
    if (!form) throw new Error("Funil de atendimento indisponível");

    let ip: string | null = null;
    let pageUrl = "";
    try {
      ip = getRequestIP({ xForwardedFor: true }) ?? null;
      pageUrl = getRequest().url;
    } catch { /* request context unavailable in tests */ }

    const { allowPublicIntake } = await import("@/lib/public-intake-throttle.server");
    if (!(await allowPublicIntake("portfolio_quiz_submit", ip))) {
      throw new Error("Muitos envios seguidos. Aguarde alguns minutos e tente novamente.");
    }

    const geo = await lookupGeo(ip);
    const { normalizeRecoveryPhone, decideLeadRecoverability, RECOVERY_CONTACT_PURPOSE } =
      await import("@/lib/lead-recoverability");
    const recoveryPhone = normalizeRecoveryPhone(data.recoveryContact ?? null);

    const quizMetadata: Record<string, unknown> = {
      source: "portfolio_client",
      client_key: data.clientKey,
      funnel_slug: `portfolio-${data.clientKey}`,
      studio_name: data.studioName,
      recipient_name: data.recipientName,
      mode: data.mode,
      proposal_kind: data.proposalKind,
      ...(hasOrderContext ? { order_context: orderContext } : {}),
      completed_at: new Date().toISOString(),
      page_url: data.pageUrl ?? pageUrl,
      ...(data.previewLocation ? { preview_location: data.previewLocation } : {}),
      ...(data.sessionId ? { session_id: data.sessionId } : {}),
      ...(data.visitorId ? { visitor_id: data.visitorId } : {}),
      ...(geo.city ? { city: geo.city } : {}),
      ...(geo.region ? { region: geo.region } : {}),
      ...(geo.neighborhood ? { neighborhood: geo.neighborhood } : {}),
      ...(geo.isp ? { isp: geo.isp } : {}),
      ...(recoveryPhone
        ? {
            recovery_contact_kind: "whatsapp",
            recovery_contact_purpose: RECOVERY_CONTACT_PURPOSE,
            recovery_contact_collected_at: new Date().toISOString(),
          }
        : {}),
    };

    // O lead é persistido antes da resolução do canal.
    const { data: lead, error: leadError } = await supabaseAdmin
      .from("dynamic_form_leads")
      .insert({
        form_id: form.id,
        answers_json: data.answers,
        metadata_json: quizMetadata,
        contact_name: null,
        contact_email: null,
        contact_phone: recoveryPhone,
        whatsapp_user_url: null,
        whatsapp_alert_status: "disabled",
      } as any)
      .select("id")
      .single();
    if (leadError || !lead) throw new Error("Não foi possível registrar a solicitação");

    const { createWhatsAppRedirectToken, hashIp, makeProtocol, getPortfolioWhatsAppChannelStateAsync } =
      await import("@/lib/whatsapp-redirect.server");
    const { recordLeadDelivery } = await import("@/lib/lead-delivery-ledger.server");
    const protocol = makeProtocol();
    const channel = await getPortfolioWhatsAppChannelStateAsync(data.clientKey);
    const decision = decideLeadRecoverability({
      destinationConfigured: channel === "CONFIGURED",
      hasRecoverableContact: Boolean(recoveryPhone),
    });

    if (channel !== "CONFIGURED") {
      // Lead-only é um estado válido do portfolio. Não há incidente de roteamento
      // nem obrigação de pedir outro WhatsApp ao visitante.
      await recordLeadDelivery({
        leadId: lead.id as string,
        clientKey: data.clientKey,
        destinationStatus: channel,
        deliveryStatus: decision.deliveryStatus,
        recoverability: decision.recoverability,
        hasRecoverableContact: Boolean(recoveryPhone),
        failureReason: null,
      });
      return {
        redirectPath: null,
        protocol,
        whatsappChannel: channel,
        deliveryState: decision.deliveryStatus,
        recoverability: decision.recoverability,
        requiresRecoveryContact: false,
      };
    }

    const token = await createWhatsAppRedirectToken({ leadId: lead.id, ipHash: hashIp(ip) });
    if (!token.ok) {
      const failed = decideLeadRecoverability({
        destinationConfigured: true,
        hasRecoverableContact: Boolean(recoveryPhone),
        failureReason: "token_creation_failed",
      });
      await recordLeadDelivery({
        leadId: lead.id as string,
        clientKey: data.clientKey,
        destinationStatus: channel,
        deliveryStatus: failed.deliveryStatus,
        recoverability: failed.recoverability,
        hasRecoverableContact: Boolean(recoveryPhone),
        failureReason: "token_creation_failed",
      });
      return {
        redirectPath: null,
        protocol,
        whatsappChannel: "NOT_CONFIGURED" as const,
        deliveryState: failed.deliveryStatus,
        recoverability: failed.recoverability,
        requiresRecoveryContact: failed.requiresRecoveryContact,
      };
    }

    await recordLeadDelivery({
      leadId: lead.id as string,
      clientKey: data.clientKey,
      destinationStatus: channel,
      deliveryStatus: decision.deliveryStatus,
      recoverability: decision.recoverability,
      hasRecoverableContact: Boolean(recoveryPhone),
    });

    return {
      redirectPath: token.redirectPath,
      protocol,
      whatsappChannel: channel,
      deliveryState: decision.deliveryStatus,
      recoverability: decision.recoverability,
      requiresRecoveryContact: false,
    };
  });

/**
 * Estado público do canal do portfolio. Sem PII: nunca devolve número.
 * A UI usa apenas para saber se haverá redirect; ausência de número não exige
 * coleta adicional para concluir o funil.
 */
export const getPortfolioFunnelDelivery = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ clientKey: z.enum(PORTFOLIO_CLIENT_KEYS) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { getPortfolioWhatsAppChannelStateAsync } = await import(
      "@/lib/whatsapp-redirect.server"
    );
    const channel = await getPortfolioWhatsAppChannelStateAsync(data.clientKey);
    const destinationConfigured = channel === "CONFIGURED";
    return {
      destinationConfigured,
      leadOnly: !destinationConfigured,
      requiresRecoveryContact: false,
    };
  });
