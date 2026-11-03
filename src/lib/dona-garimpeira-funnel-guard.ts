/**
 * Guard específico da Dona Garimpeira: um formulário que venha a ser publicado
 * no banco NÃO pode cair no atendimento institucional da 0WEB por ausência de
 * client_key, registro ou destino correto. Não afeta os demais formulários.
 *
 * Exige o cliente na allowlist, o site liberado e o destino próprio.
 */
export const DONA_GARIMPEIRA_CLIENT_KEY = "dona-garimpeira-brecho" as const;
export const DONA_GARIMPEIRA_FORM_SLUG = "funnel-dona-garimpeira-brecho" as const;

/** Os dois identificadores devem apontar para o brechó se qualquer um deles o identificar. */
export function isDonaGarimpeiraRoutingConsistent(formSlug: unknown, clientKey: unknown): boolean {
  return (formSlug === DONA_GARIMPEIRA_FORM_SLUG) === (clientKey === DONA_GARIMPEIRA_CLIENT_KEY);
}

export type DonaGarimpeiraSubmissionContext = Readonly<{
  formSlug: string;
  clientKey: string | null | undefined;
  registered: boolean;
  sitePublished: boolean;
  ownWhatsAppConfigured: boolean;
  answers: Readonly<Record<string, unknown>>;
}>;

/** Publicação do formulário precisa de três registros canônicos ativos. */
export function donaGarimpeiraIntakeReady(
  registered: boolean,
  sitePublished: boolean,
  ownWhatsAppConfigured: boolean,
): boolean {
  return registered && sitePublished && ownWhatsAppConfigured;
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
  if (!isDonaGarimpeiraRoutingConsistent(ctx.formSlug, ctx.clientKey)) {
    return { ok: false, reason: "WRONG_CLIENT" };
  }
  if (ctx.formSlug !== DONA_GARIMPEIRA_FORM_SLUG) return { ok: true };
  if (!donaGarimpeiraIntakeReady(ctx.registered, ctx.sitePublished, ctx.ownWhatsAppConfigured)) {
    return { ok: false, reason: "NOT_READY" };
  }
  const interest = ctx.answers.interesse;
  if (interest !== "comprar" && interest !== "vender" && interest !== "doar") {
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
