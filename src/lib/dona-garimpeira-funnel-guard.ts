/**
 * Guard específico da Dona Garimpeira: um formulário que venha a ser publicado
 * no banco NÃO pode cair no atendimento institucional da 0WEB por ausência de
 * client_key, registro ou destino correto. Não afeta os demais formulários.
 *
 * A página continua em draft: o guard deve negar até que o cliente seja
 * incorporado de forma canônica à allowlist, ao catálogo e ao WhatsApp.
 */
export const DONA_GARIMPEIRA_CLIENT_KEY = "dona-garimpeira-brecho" as const;
export const DONA_GARIMPEIRA_FORM_SLUG = "funnel-dona-garimpeira-brecho" as const;

export type DonaGarimpeiraSubmissionContext = Readonly<{
  formSlug: string;
  clientKey: string | null | undefined;
  registered: boolean;
  catalogPublished: boolean;
  ownWhatsAppConfigured: boolean;
  answers: Readonly<Record<string, unknown>>;
}>;

/** Publicação do formulário precisa de três registros canônicos ativos. */
export function donaGarimpeiraIntakeReady(
  registered: boolean,
  catalogPublished: boolean,
  ownWhatsAppConfigured: boolean,
): boolean {
  return registered && catalogPublished && ownWhatsAppConfigured;
}

export type DonaGarimpeiraFunnelDecision =
  | Readonly<{ ok: true }>
  | Readonly<{ ok: false; reason:
      | "NOT_READY"
      | "WRONG_CLIENT"
      | "INVALID_INTEREST"
      | "INVALID_NAME"
      | "INVALID_PHONE"
      | "PRIVACY_NOT_ACKNOWLEDGED"
    }>;

export function checkDonaGarimpeiraSubmission(
  ctx: DonaGarimpeiraSubmissionContext,
): DonaGarimpeiraFunnelDecision {
  // Um formulário de OUTRO cliente nunca pode usar o destino da Dona Garimpeira.
  // Verificar os dois sentidos evita contaminação cruzada após a futura ativação.
  if (ctx.formSlug !== DONA_GARIMPEIRA_FORM_SLUG) {
    return ctx.clientKey === DONA_GARIMPEIRA_CLIENT_KEY
      ? { ok: false, reason: "WRONG_CLIENT" }
      : { ok: true };
  }
  if (!donaGarimpeiraIntakeReady(ctx.registered, ctx.catalogPublished, ctx.ownWhatsAppConfigured)) {
    return { ok: false, reason: "NOT_READY" };
  }
  if (ctx.clientKey !== DONA_GARIMPEIRA_CLIENT_KEY) {
    return { ok: false, reason: "WRONG_CLIENT" };
  }
  if (!["comprar", "vender", "doar"].includes(String(ctx.answers.interesse ?? ""))) {
    return { ok: false, reason: "INVALID_INTEREST" };
  }
  if (typeof ctx.answers.nome !== "string" ||
      ctx.answers.nome.trim().length < 2 ||
      ctx.answers.nome.trim().length > 90) {
    return { ok: false, reason: "INVALID_NAME" };
  }
  const phone = ctx.answers.whatsapp;
  const digits = typeof phone === "string" ? phone.replace(/\D/g, "") : "";
  if (!/^(?:55)?[1-9][0-9]9?[0-9]{8}$/.test(digits)) {
    return { ok: false, reason: "INVALID_PHONE" };
  }
  const privacy = ctx.answers.privacidade;
  if (!Array.isArray(privacy) || !privacy.includes("ciente")) {
    return { ok: false, reason: "PRIVACY_NOT_ACKNOWLEDGED" };
  }
  return { ok: true };
}
