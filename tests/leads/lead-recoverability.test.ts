import { describe, expect, it } from "vitest";
import {
  decideLeadRecoverability,
  maskRecoveryPhone,
  normalizeRecoveryPhone,
} from "@/lib/lead-recoverability";

/**
 * LEAD_RECOVERABILITY_GATE — cenários obrigatórios.
 * O resultado nunca pode ser "lead perdido sem sinalização".
 */
describe("LEAD_RECOVERABILITY_GATE", () => {
  it("A) destino verificado → conclusão entrega normalmente", () => {
    const d = decideLeadRecoverability({ destinationConfigured: true, hasRecoverableContact: false });
    expect(d.deliveryStatus).toBe("PENDING");
    expect(d.isLossRisk).toBe(false);
    expect(decideLeadRecoverability({
      destinationConfigured: true,
      hasRecoverableContact: false,
      delivered: true,
    }).recoverability).toBe("DELIVERED");
  });

  it("B) destino ausente + contato → lead continua recuperável", () => {
    const d = decideLeadRecoverability({ destinationConfigured: false, hasRecoverableContact: true });
    expect(d.recoverability).toBe("RECOVERABLE");
    expect(d.deliveryStatus).toBe("DELIVERY_CONFIGURATION_REQUIRED");
    expect(d.isLossRisk).toBe(false);
  });

  it("B') destino ausente e sem contato → conclusão bloqueada, nunca silenciosa", () => {
    const d = decideLeadRecoverability({ destinationConfigured: false, hasRecoverableContact: false });
    expect(d.requiresRecoveryContact).toBe(true);
    expect(d.isLossRisk).toBe(true);
    expect(d.deliveryStatus).toBe("DELIVERY_CONFIGURATION_REQUIRED");
  });

  it("C) resolver falha / token inválido / timeout → falha explícita, com recuperação quando há contato", () => {
    for (const reason of ["resolver_error", "invalid_token", "timeout", "config_removed", "whatsapp_not_generated"]) {
      const withContact = decideLeadRecoverability({
        destinationConfigured: true,
        hasRecoverableContact: true,
        failureReason: reason,
      });
      expect(withContact.deliveryStatus).toBe("FAILED");
      expect(withContact.recoverability).toBe("RECOVERABLE");
      expect(withContact.isLossRisk).toBe(false);

      const without = decideLeadRecoverability({
        destinationConfigured: true,
        hasRecoverableContact: false,
        failureReason: reason,
      });
      expect(without.recoverability).toBe("DELIVERY_FAILED");
      expect(without.requiresRecoveryContact).toBe(true);
    }
  });

  it("D) nenhum cenário produz conclusão final sem entrega nem recuperação", () => {
    for (const destinationConfigured of [true, false]) {
      for (const hasRecoverableContact of [true, false]) {
        const d = decideLeadRecoverability({ destinationConfigured, hasRecoverableContact });
        const safe = d.recoverability !== "DELIVERY_PENDING" || !d.isLossRisk || d.requiresRecoveryContact;
        expect(safe).toBe(true);
      }
    }
  });
});

describe("contato de retorno", () => {
  it("normaliza celulares brasileiros e rejeita lixo", () => {
    expect(normalizeRecoveryPhone("(41) 99745-2053")).toBe("5541997452053");
    expect(normalizeRecoveryPhone("4133334444")).toBe("554133334444");
    expect(normalizeRecoveryPhone("123")).toBeNull();
    expect(normalizeRecoveryPhone("")).toBeNull();
    expect(normalizeRecoveryPhone(null)).toBeNull();
    expect(normalizeRecoveryPhone("100997452053")).toBeNull();
  });

  it("nunca expõe o número completo na máscara", () => {
    const masked = maskRecoveryPhone("5541997452053");
    expect(masked).not.toContain("997452053");
    expect(masked).toContain("••");
  });
});
