/**
 * Contrato público (client-safe) do destino operacional do funil.
 *
 * Aqui NÃO existe número: apenas o vocabulário de estados, a máscara e os
 * tipos usados pelo painel. A resolução real é server-only
 * (`portfolio-funnel-destination.server.ts`), sobre o resolver canônico já
 * existente (`whatsapp-redirect.server.ts`).
 */

/** Estados formais do destino operacional de conclusão do funil. */
export const DESTINATION_STATUSES = [
  "VERIFIED",
  "CONFIGURED_UNVERIFIED",
  "INSUFFICIENT_EVIDENCE",
  "AUTO_RESOLVED",
  "UNRESOLVED",
  "CONFLICT",
  "CHANGE_PENDING",
  "CONFIGURATION_ERROR",
  "NOT_APPLICABLE",
] as const;

export type DestinationStatus = (typeof DESTINATION_STATUSES)[number];

/** Origens aceitas para a confirmação humana do destino operacional. */
export const DESTINATION_PROVENANCE_SOURCES = [
  "OWNER_CONFIRMED",
  "CLIENT_SUPPLIED",
  "OFFICIAL_GOOGLE",
  "OFFICIAL_WEBSITE",
  "OFFICIAL_SOCIAL",
  "EXISTING_VERIFIED_RECORD",
] as const;

export type DestinationProvenanceSource = (typeof DESTINATION_PROVENANCE_SOURCES)[number];

/**
 * Normalização BR do WhatsApp: DDI 55 + DDD + número. Nunca "corrige"
 * silenciosamente um número improvável — apenas sinaliza.
 */
export function normalizeBrWhatsApp(
  raw: string,
): { ok: true; digits: string; looksLikeLandline: boolean } | { ok: false; message: string } {
  const d = String(raw ?? "").replace(/\D/g, "");
  let national = d;
  if (national.startsWith("55") && (national.length === 12 || national.length === 13)) {
    national = national.slice(2);
  }
  if (national.length !== 10 && national.length !== 11) {
    return { ok: false, message: "Informe DDD + número (10 ou 11 dígitos), com ou sem o 55." };
  }
  const ddd = Number(national.slice(0, 2));
  if (ddd < 11 || ddd > 99) return { ok: false, message: "DDD inválido." };
  const looksLikeLandline = national.length === 10 || !national.startsWith("9", 2);
  return { ok: true, digits: `55${national}`, looksLikeLandline };
}

/** Origem do destino. Nunca inclui valor. */
export type DestinationSource =
  | "OPERATIONAL_SECRET"
  | "CLIENT_SETTINGS"
  | "NONE";

/** Prioridade operacional de correção (risco real de perda de lead). */
export type DestinationPriority = "OK" | "P0" | "P1" | "P2" | "P3";

/** Telemetria já existente do portal, agregada por projeto. Nunca cria analytics paralelo. */
export type DestinationTelemetry = {
  views30: number;
  views90: number;
  funnelOpens90: number;
  funnelCompletes90: number;
  leads90: number;
  lastActivityAt: string | null;
};

export const EMPTY_TELEMETRY: DestinationTelemetry = {
  views30: 0,
  views90: 0,
  funnelOpens90: 0,
  funnelCompletes90: 0,
  leads90: 0,
  lastActivityAt: null,
};

export type DestinationRow = {
  slug: string;
  projectName: string;
  clientKey: string | null;
  funnelType: string;
  contactMode: "funnelOnly" | "none";
  destinationStatus: DestinationStatus;
  destinationSource: DestinationSource;
  /** Sempre mascarado. Número completo nunca sai do servidor. */
  destinationValueMasked: string | null;
  /** Proveniência textual da evidência (ledger). Nunca contém número. */
  evidenceSource: string | null;
  confidence: number | null;
  lastVerifiedAt: string | null;
  publicState: "published" | "draft" | "offline";
  /** Motivo legível quando o destino não está OK. Sem PII. */
  note: string | null;
  telemetry: DestinationTelemetry;
  priority: DestinationPriority;
  /** Conclusão de funil sem destino operacional configurado. */
  deliveryNotConfigured: boolean;
  /** Conclusões de funil que não puderam ser entregues ao cliente. */
  conversionsAtRisk: number;
};

/** Estados que representam entrega operacional garantida. */
export function isDestinationOk(status: DestinationStatus): boolean {
  return status === "VERIFIED" || status === "AUTO_RESOLVED" || status === "NOT_APPLICABLE";
}

/**
 * Prioridade por RISCO REAL, nunca alfabética:
 * P0 = conversão acontecendo sem entrega garantida;
 * P1 = tráfego relevante sem conversão recente;
 * P2 = publicado com pouca atividade;
 * P3 = sem sinais recentes (baixa prioridade, jamais "morto").
 */
export function computeDestinationPriority(
  status: DestinationStatus,
  t: DestinationTelemetry,
): DestinationPriority {
  if (isDestinationOk(status)) return "OK";
  if (t.funnelCompletes90 > 0 || t.leads90 > 0 || t.funnelOpens90 > 0) return "P0";
  if (t.views30 >= 100) return "P1";
  if (t.views90 > 0 || t.views30 > 0) return "P2";
  return "P3";
}

/** Ordenação operacional: risco primeiro; slug só desempata. */
export function compareByOperationalRisk(a: DestinationRow, b: DestinationRow): number {
  const rank = { P0: 0, P1: 1, P2: 2, P3: 3, OK: 4 } as const;
  if (rank[a.priority] !== rank[b.priority]) return rank[a.priority] - rank[b.priority];
  const risk = b.conversionsAtRisk - a.conversionsAtRisk;
  if (risk) return risk;
  const leads = b.telemetry.leads90 - a.telemetry.leads90;
  if (leads) return leads;
  const views = b.telemetry.views30 - a.telemetry.views30;
  if (views) return views;
  return a.slug.localeCompare(b.slug);
}


/**
 * Máscara canônica: `(41) 9****-0764`.
 * Recebe apenas dígitos (com ou sem DDI 55). Nunca registra o valor inteiro.
 */
export function maskWhatsAppDigits(digits: string | null | undefined): string | null {
  const d = String(digits ?? "").replace(/\D/g, "");
  if (d.length < 10) return null;
  const national = d.startsWith("55") && d.length > 11 ? d.slice(2) : d;
  const ddd = national.slice(0, 2);
  const rest = national.slice(2);
  const head = rest.slice(0, 1);
  const tail = rest.slice(-4);
  return `(${ddd}) ${head}${"*".repeat(Math.max(rest.length - 5, 0))}-${tail}`;
}
