/**
 * Helpers puros da captação comercial da 0WEB dentro de `/portfolio/:slug`.
 *
 * Ficam separados das server functions para que os testes unitários possam
 * importá-los sem tocar em banco, env ou contexto de request.
 *
 * Regra de privacidade (Frente F): nada aqui produz payload de analytics com
 * nome, telefone ou e-mail. Eventos externos usam apenas slug/flags.
 */

/** Slug do funil interno seeded por migration. Não é funil de cliente. */
export const HOST_CAPTURE_FUNNEL_SLUG = "0web-portfolio-captacao";

/** Origem gravada em metadata_json.source. */
export const HOST_CAPTURE_SOURCE = "portfolio_host_popup";

/** Estados mínimos desta rodada, mapeados no pipeline já existente. */
export const HOST_LEAD_STATUSES = [
  "novo",
  "contatado",
  "qualificado",
  "ganho",
  "perdido",
] as const;
export type HostLeadStatus = (typeof HOST_LEAD_STATUSES)[number];

export const HOST_LEAD_STATUS_LABEL: Record<HostLeadStatus, string> = {
  novo: "Novo",
  contatado: "Contatado",
  qualificado: "Qualificado",
  ganho: "Ganho",
  perdido: "Perdido",
};

export function isHostLeadStatus(value: unknown): value is HostLeadStatus {
  return (HOST_LEAD_STATUSES as readonly string[]).includes(String(value));
}

/** Remove HTML, controles e espaços redundantes; aplica limite de tamanho. */
export function sanitizeField(input: unknown, maxLen: number): string {
  if (input === null || input === undefined) return "";
  return String(input)
    .replace(/<[^>]*>/g, " ")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen);
}

export type NormalizedPhone = { ok: true; digits: string; e164: string } | { ok: false };

/**
 * Normaliza telefones brasileiros usuais: com/sem DDI, com máscara, com 9º
 * dígito. Não "conserta" o que não é plausível — devolve `ok:false`.
 */
export function normalizeBrazilPhone(input: unknown): NormalizedPhone {
  let digits = String(input ?? "").replace(/\D/g, "");
  if (!digits) return { ok: false };
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length > 11 && digits.startsWith("55")) digits = digits.slice(2);
  // Descarta zero de operadora/tronco (ex.: 041 9...).
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length === 12 && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length < 10 || digits.length > 11) return { ok: false };
  const ddd = Number(digits.slice(0, 2));
  if (ddd < 11 || ddd > 99) return { ok: false };
  if (digits.length === 11 && digits[2] !== "9") return { ok: false };
  return { ok: true, digits, e164: `55${digits}` };
}

/** Mascara telefone para exibição em listas administrativas. */
export function maskPhoneForDisplay(value: unknown): string {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (digits.length < 8) return "—";
  return `••••${digits.slice(-4)}`;
}

export type Attribution = {
  portfolioSlug: string | null;
  portfolioBusinessName: string | null;
  landingUrl: string | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  sessionId: string | null;
  visitorId: string | null;
};

const orNull = (value: unknown, max = 300): string | null => {
  const clean = sanitizeField(value, max);
  return clean ? clean : null;
};

/**
 * Monta a atribuição a partir do que o cliente enviou. Campo ausente vira
 * `null` — nunca um valor inventado (Frente K).
 */
export function buildAttribution(raw: Record<string, unknown> | undefined | null): Attribution {
  const r = raw ?? {};
  return {
    portfolioSlug: orNull(r.portfolioSlug, 120),
    portfolioBusinessName: orNull(r.portfolioBusinessName, 160),
    landingUrl: orNull(r.landingUrl, 500),
    referrer: orNull(r.referrer, 500),
    utmSource: orNull(r.utmSource, 120),
    utmMedium: orNull(r.utmMedium, 120),
    utmCampaign: orNull(r.utmCampaign, 160),
    utmContent: orNull(r.utmContent, 160),
    utmTerm: orNull(r.utmTerm, 160),
    sessionId: orNull(r.sessionId, 120),
    visitorId: orNull(r.visitorId, 120),
  };
}

/** Lê UTMs e referrer do browser sem coletar nada identificável. */
export function readClientAttribution(win: Window | undefined = typeof window === "undefined" ? undefined : window) {
  if (!win) return {};
  const params = new URLSearchParams(win.location.search);
  const get = (k: string) => params.get(k) || null;
  return {
    landingUrl: `${win.location.origin}${win.location.pathname}`,
    referrer: win.document.referrer || null,
    utmSource: get("utm_source"),
    utmMedium: get("utm_medium"),
    utmCampaign: get("utm_campaign"),
    utmContent: get("utm_content"),
    utmTerm: get("utm_term"),
  };
}

/** Chaves de PII que jamais podem ir para GA4/GTM/Meta Pixel (Frente F). */
export const PII_EVENT_KEYS = ["name", "nome", "phone", "telefone", "whatsapp", "email", "city_input"];

/** Garante que um payload de analytics não carrega PII. */
export function assertNoPii(payload: Record<string, unknown>): boolean {
  return !Object.keys(payload).some((k) => PII_EVENT_KEYS.includes(k.toLowerCase()));
}
