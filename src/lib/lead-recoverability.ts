/**
 * LEAD_RECOVERABILITY — vocabulário e decisão pura (client-safe).
 *
 * Regra permanente: um funil comercial nunca pode terminar em
 * `COMPLETED + DESTINATION_UNRESOLVED + NO_RECOVERABLE_CONTACT`.
 * Toda submissão precisa acabar em DELIVERED (entregue ao cliente) ou
 * RECOVERABLE (salva com um meio mínimo de retorno).
 *
 * Este módulo não conhece números, segredos nem banco: só o contrato.
 */

export const LEAD_RECOVERABILITY_STATUSES = [
  "DELIVERED",
  "RECOVERABLE",
  "UNRECOVERABLE_LEGACY",
  "DELIVERY_PENDING",
  "DELIVERY_FAILED",
] as const;
export type LeadRecoverabilityStatus = (typeof LEAD_RECOVERABILITY_STATUSES)[number];

export const LEAD_DELIVERY_STATUSES = [
  "PENDING",
  "DELIVERED",
  "FAILED",
  "DELIVERY_CONFIGURATION_REQUIRED",
] as const;
export type LeadDeliveryStatus = (typeof LEAD_DELIVERY_STATUSES)[number];

export type RecoverabilityInput = {
  /** Existe destino operacional resolvível para este projeto. */
  destinationConfigured: boolean;
  /** O visitante deixou um meio de retorno explícito (WhatsApp/telefone). */
  hasRecoverableContact: boolean;
  /** O redirect foi efetivamente consumido e entregue. */
  delivered?: boolean;
  /** Motivo técnico de falha, quando houver. */
  failureReason?: string | null;
};

export type RecoverabilityDecision = {
  deliveryStatus: LeadDeliveryStatus;
  recoverability: LeadRecoverabilityStatus;
  /** UI deve exigir contato de retorno antes de concluir. */
  requiresRecoveryContact: boolean;
  /** Estado proibido: conclusão sem entrega e sem recuperação. */
  isLossRisk: boolean;
};

/**
 * Garantia global server-side. Nunca devolve "concluído" quando não existe
 * nem destino verificado nem contato recuperável.
 */
export function decideLeadRecoverability(input: RecoverabilityInput): RecoverabilityDecision {
  const { destinationConfigured, hasRecoverableContact } = input;

  if (input.failureReason && destinationConfigured) {
    return {
      deliveryStatus: "FAILED",
      recoverability: hasRecoverableContact ? "RECOVERABLE" : "DELIVERY_FAILED",
      requiresRecoveryContact: !hasRecoverableContact,
      isLossRisk: !hasRecoverableContact,
    };
  }

  if (input.delivered) {
    return {
      deliveryStatus: "DELIVERED",
      recoverability: "DELIVERED",
      requiresRecoveryContact: false,
      isLossRisk: false,
    };
  }

  if (destinationConfigured) {
    return {
      deliveryStatus: "PENDING",
      recoverability: hasRecoverableContact ? "RECOVERABLE" : "DELIVERY_PENDING",
      requiresRecoveryContact: false,
      isLossRisk: false,
    };
  }

  if (hasRecoverableContact) {
    return {
      deliveryStatus: "DELIVERY_CONFIGURATION_REQUIRED",
      recoverability: "RECOVERABLE",
      requiresRecoveryContact: false,
      isLossRisk: false,
    };
  }

  return {
    deliveryStatus: "DELIVERY_CONFIGURATION_REQUIRED",
    recoverability: "DELIVERY_PENDING",
    requiresRecoveryContact: true,
    isLossRisk: true,
  };
}

/**
 * Normaliza um WhatsApp/telefone brasileiro informado pelo visitante.
 * Devolve apenas dígitos com DDI 55, ou null quando o dado é insuficiente.
 * Nunca lança: dado ruim não pode derrubar a submissão.
 */
export function normalizeRecoveryPhone(raw: string | null | undefined): string | null {
  if (typeof raw !== "string") return null;
  let digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length === 10 || digits.length === 11) digits = `55${digits}`;
  if (digits.length === 12 || digits.length === 13) {
    if (!digits.startsWith("55")) return null;
    const ddd = Number(digits.slice(2, 4));
    if (!(ddd >= 11 && ddd <= 99)) return null;
    return digits;
  }
  return null;
}

/** Máscara para painel/telemetria. Número completo nunca sai do servidor. */
export function maskRecoveryPhone(digits: string | null | undefined): string | null {
  if (!digits) return null;
  const d = digits.replace(/\D/g, "");
  if (d.length < 6) return "•••";
  return `${d.slice(0, 4)}••••${d.slice(-2)}`;
}

/** Finalidade declarada da coleta (LGPD). Sempre gravada junto do contato. */
export const RECOVERY_CONTACT_PURPOSE =
  "contato relacionado exclusivamente à solicitação enviada neste site; não usado para marketing nem compartilhado com outros clientes";
