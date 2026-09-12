import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { decideLeadRecoverability, normalizeRecoveryPhone } from "@/lib/lead-recoverability";

/**
 * P0.1 — PRÉ-PUBLICAÇÃO DA GARANTIA DE ENTREGA.
 * Um lead RECOVERABLE precisa ter contato completo guardado no banco, e o
 * número completo só pode sair por ação administrativa explícita.
 */
const funnel = readFileSync("src/lib/dynamic-funnel.functions.ts", "utf8");
const listing = readFileSync("src/lib/portfolio-funnel-leads.functions.ts", "utf8");
const reveal = readFileSync("src/lib/lead-recovery-contact.functions.ts", "utf8");
const migration = readFileSync(
  "supabase/migrations/20260912031541_fa834ca3-e3c9-4450-887d-4ac52c81e6ea.sql",
  "utf8",
);

describe("armazenamento do contato de retorno", () => {
  it("grava o número completo normalizado em dynamic_form_leads.contact_phone", () => {
    expect(funnel).toContain("contact_phone: recoveryPhone");
    expect(funnel).toContain("normalizeRecoveryPhone");
  });

  it("RECOVERABLE só existe quando há contato completo", () => {
    const d = decideLeadRecoverability({
      destinationConfigured: false,
      hasRecoverableContact: true,
    });
    expect(d.recoverability).toBe("RECOVERABLE");
    expect(normalizeRecoveryPhone("(41) 90000-0001")).toBe("5541900000001");
  });
});

describe("exposição do contato", () => {
  it("a listagem do painel devolve apenas máscara", () => {
    expect(listing).toContain("contact_phone_masked");
    expect(listing).not.toMatch(/contact_phone:\s*r\.contact_phone/);
  });

  it("a revelação exige papel administrativo e registra auditoria sem o número", () => {
    expect(reveal).toContain("requireSupabaseAuth");
    expect(reveal).toContain('r.role === "admin" || r.role === "super_admin"');
    expect(reveal).toContain("lead_recovery_contact_revealed");
    expect(reveal).toMatch(/meta:\s*\{\s*reason: data\.reason, had_contact/);
  });
});

describe("integridade do registro de entregas", () => {
  it("a migration impede combinações impossíveis e órfãos", () => {
    expect(migration).toContain("REFERENCES public.dynamic_form_leads(id) ON DELETE CASCADE");
    expect(migration).toContain("lead_delivery_ledger_consistency_chk");
    expect(migration).toContain("recoverability_status <> 'RECOVERABLE' OR has_recoverable_contact");
  });
});
