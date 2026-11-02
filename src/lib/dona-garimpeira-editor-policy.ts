/**
 * Política de permissões para o FUTURO painel Dona Garimpeira.
 *
 * PREPARAÇÃO ISOLADA: este módulo NÃO cria usuários, endpoint, sessão,
 * integração Google OAuth, regra RLS ou mecanismo de publicação.
 * Integração futura deve rodar somente no servidor, após verificar JWT
 * com o provedor e consultar permissões persistidas, nunca fornecidas
 * pelo navegador. Não basta conhecer um endereço de e-mail.
 */
export const DONA_GARIMPEIRA_TENANT = "dona-garimpeira-brecho" as const;

export type DonaGarimpeiraRole = "owner" | "platform_admin" | "editor";
export type DonaGarimpeiraAction =
  | "content:publish"
  | "content:restore"
  | "media:manage"
  | "history:read"
  | "users:grant"
  | "users:revoke"
  | "settings:update";

export type VerifiedProviderSession = Readonly<{
  /** Identidade obtida pelo middleware de autenticação, em servidor. */
  provider: "google";
  subject: string;
  emailVerified: boolean;
  expiresAtMs: number;
}>;

export type DonaGarimpeiraMembership = Readonly<{
  tenant: typeof DONA_GARIMPEIRA_TENANT;
  /** ID imutável do sujeito autenticado; não confundir com endereço de e-mail. */
  subject: string;
  role: DonaGarimpeiraRole;
  status: "active" | "revoked";
}>;

export type AuthorizationRequest = Readonly<{
  tenant: string;
  action: DonaGarimpeiraAction;
  session: VerifiedProviderSession | null;
  memberships: readonly DonaGarimpeiraMembership[];
  /** Para mutations de conteúdo: o servidor valida campos, não confia no client. */
  fields?: readonly string[];
  /** Concessão/revogação: apenas contas com perfil editor podem ser geridas. */
  target?: Pick<DonaGarimpeiraMembership, "subject" | "role" | "tenant">;
  nowMs: number;
}>;

export type AccessDecision =
  | { allow: true; role: DonaGarimpeiraRole }
  | { allow: false; reason: string };

const CONTENT_FIELDS = new Set([
  "gallery",
  "descriptions",
  "public_copy",
]);

const RESTRICTED_FIELDS = new Set([
  "business_contact",
  "business_address",
  "opening_hours",
  "identity",
  "seo",
]);

const ACTION_ROLES: Record<DonaGarimpeiraAction, readonly DonaGarimpeiraRole[]> = {
  "content:publish": ["owner", "platform_admin", "editor"],
  "content:restore": ["owner", "platform_admin"],
  "media:manage": ["owner", "platform_admin", "editor"],
  "history:read": ["owner", "platform_admin"],
  "users:grant": ["owner", "platform_admin"],
  "users:revoke": ["owner", "platform_admin"],
  "settings:update": ["owner", "platform_admin"],
};

function validSubject(subject: unknown): subject is string {
  return typeof subject === "string" &&
    subject.length >= 3 &&
    subject.length <= 256 &&
    !/[\u0000-\u001f]/.test(subject);
}

/**
 * Determinística, sem I/O. Em produção o chamador deve fornecer:
 * - sessão verificada por middleware server-side (não dados enviados pelo client);
 * - memberships lidos no banco usando conexão de confiança/RLS;
 * - relógio do servidor;
 * - gravação/auditoria transacional e revogação de sessões na camada auth.
 */
export function authorizeDonaGarimpeira(request: AuthorizationRequest): AccessDecision {
  if (request.tenant !== DONA_GARIMPEIRA_TENANT) {
    return { allow: false, reason: "TENANT_MISMATCH" };
  }
  const session = request.session;
  if (!session ||
    session.provider !== "google" ||
    !session.emailVerified ||
    !validSubject(session.subject) ||
    !Number.isFinite(request.nowMs) ||
    !Number.isFinite(session.expiresAtMs) ||
    session.expiresAtMs <= request.nowMs) {
    return { allow: false, reason: "INVALID_SESSION" };
  }

  const matched = request.memberships.filter((m) =>
    m.tenant === DONA_GARIMPEIRA_TENANT &&
    m.subject === session.subject &&
    m.status === "active"
  );
  // Duplicated/contradictory roles are a configuration failure, never privilege escalation.
  if (matched.length !== 1) {
    return { allow: false, reason: "MEMBERSHIP_UNRESOLVED" };
  }

  const role = matched[0].role;
  if (!ACTION_ROLES[request.action]?.includes(role)) {
    return { allow: false, reason: "INSUFFICIENT_ROLE" };
  }

  if (request.action === "content:publish" || request.action === "media:manage") {
    const fields = request.fields ?? [];
    if (fields.length === 0 || fields.some((f) =>
      !CONTENT_FIELDS.has(f) && !(role !== "editor" && RESTRICTED_FIELDS.has(f))
    )) {
      return { allow: false, reason: "FIELD_NOT_ALLOWED" };
    }
  }

  if (request.action === "settings:update") {
    const fields = request.fields ?? [];
    if (!fields.length || fields.some((f) => !RESTRICTED_FIELDS.has(f))) {
      return { allow: false, reason: "SETTINGS_FIELD_NOT_ALLOWED" };
    }
  }

  if (request.action === "users:grant" || request.action === "users:revoke") {
    const target = request.target;
    if (!target ||
      target.tenant !== DONA_GARIMPEIRA_TENANT ||
      !validSubject(target.subject) ||
      target.subject === session.subject ||
      target.role !== "editor") {
      return { allow: false, reason: "TARGET_NOT_MANAGEABLE" };
    }
  }

  return { allow: true, role };
}

export type DonaGarimpeiraAuditEvent = Readonly<{
  tenant: typeof DONA_GARIMPEIRA_TENANT;
  actorSubject: string;
  action: DonaGarimpeiraAction;
  timestamp: string;
  revisionBefore: number;
  revisionAfter: number;
  fields: readonly string[];
}>;

/**
 * Planeja uma entrada de auditoria sem persistir. O armazenamento real deverá
 * ocorrer NA MESMA TRANSAÇÃO que modifica o conteúdo (ou reverter tudo).
 */
export function planDonaGarimpeiraAuditEvent(
  request: AuthorizationRequest,
  decision: AccessDecision,
  revisionBefore: number
): DonaGarimpeiraAuditEvent | null {
  if (!decision.allow || !request.session || !Number.isSafeInteger(revisionBefore) || revisionBefore < 0) return null;
  if (!Number.isSafeInteger(revisionBefore + 1)) return null;
  return {
    tenant: DONA_GARIMPEIRA_TENANT,
    actorSubject: request.session.subject,
    action: request.action,
    timestamp: new Date(request.nowMs).toISOString(),
    revisionBefore,
    revisionAfter: revisionBefore + 1,
    fields: [...(request.fields ?? [])],
  };
}

/** Alertas importantes apenas; mudanças comuns permanecem no histórico. */
export function donaGarimpeiraNeedsOwnerEmail(
  action: DonaGarimpeiraAction,
  fields: readonly string[] = []
): boolean {
  if (action === "users:grant" || action === "users:revoke" || action === "settings:update") return true;
  return fields.some((field) => RESTRICTED_FIELDS.has(field));
}


/**
 * Propriedades aceitas para uma FOTO REAL no futuro editor.
 * O link oficial identifica a origem, mas não substitui auditoria humana/API
 * da licença, autoria e mídia correspondente antes de publicar.
 */
export type DonaGarimpeiraGalleryInput = Readonly<{
  src: unknown;
  instagramPermalink: unknown;
  alt: unknown;
  category: unknown;
}>;

/**
 * Impede URLs externas arbitrárias, javascript:, traversal, HTML e posts sem
 * permalink por registro. A ingestão real do asset precisa ser server-side,
 * autorizada e preservada no bucket isolado do cliente.
 */
export function validateDonaGarimpeiraGalleryInput(
  input: DonaGarimpeiraGalleryInput
): boolean {
  if (typeof input.src !== "string" ||
      typeof input.instagramPermalink !== "string" ||
      typeof input.alt !== "string" ||
      typeof input.category !== "string") {
    return false;
  }
  const src = input.src;
  const permalink = input.instagramPermalink;
  const alt = input.alt.trim();

  return (
    src.length <= 240 &&
    /^\/images\/dona-garimpeira-brecho\/[a-z0-9][a-z0-9_-]*\.(?:webp|avif|png|jpg|jpeg)$/.test(src) &&
    /^https:\/\/www\.instagram\.com\/(?:p|reel)\/[A-Za-z0-9_-]{5,24}\/?$/.test(permalink) &&
    alt.length >= 12 &&
    alt.length <= 180 &&
    !/[<>]/.test(alt) &&
    ["feminino", "masculino", "infantil"].includes(input.category)
  );
}
