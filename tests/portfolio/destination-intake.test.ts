import { describe, expect, it } from "bun:test";
import {
  DESTINATION_PROVENANCE_SOURCES,
  maskWhatsAppDigits,
  normalizeBrWhatsApp,
} from "@/lib/portfolio-funnel-destination";

describe("normalização do destino operacional", () => {
  it("aceita celular com e sem DDI", () => {
    const a = normalizeBrWhatsApp("(41) 99507-2700");
    const b = normalizeBrWhatsApp("+55 41 99507 2700");
    expect(a.ok && a.digits).toBe("5541995072700");
    expect(b.ok && b.digits).toBe("5541995072700");
    expect(a.ok && a.looksLikeLandline).toBe(false);
  });

  it("sinaliza telefone fixo em vez de convertê-lo em WhatsApp", () => {
    const r = normalizeBrWhatsApp("(41) 3345-1122");
    expect(r.ok && r.looksLikeLandline).toBe(true);
  });

  it("rejeita número inválido", () => {
    expect(normalizeBrWhatsApp("12345").ok).toBe(false);
    expect(normalizeBrWhatsApp("(01) 99999-9999").ok).toBe(false);
  });

  it("nunca expõe o número inteiro na máscara", () => {
    const masked = maskWhatsAppDigits("5541995072700");
    expect(masked).not.toContain("99507");
    expect(masked).toContain("*");
  });

  it("mantém o vocabulário fechado de proveniência", () => {
    expect([...DESTINATION_PROVENANCE_SOURCES]).toEqual([
      "OWNER_CONFIRMED",
      "CLIENT_SUPPLIED",
      "OFFICIAL_GOOGLE",
      "OFFICIAL_WEBSITE",
      "OFFICIAL_SOCIAL",
      "EXISTING_VERIFIED_RECORD",
    ]);
  });
});

describe("privacidade do intake", () => {
  it("as funções administrativas não devolvem o número completo", async () => {
    const src = await Bun.file("src/lib/portfolio-destination-confirm.server.ts").text();
    expect(src).toContain("maskWhatsAppDigits");
    // o número bruto só é gravado no mecanismo canônico privado
    expect(src).not.toMatch(/return[^\n]*digits: parsed\.digits/);
  });

  it("exige admin nas server functions", async () => {
    const src = await Bun.file("src/lib/portfolio-destination-confirm.functions.ts").text();
    expect(src).toContain("requireSupabaseAuth");
    expect((src.match(/assertAdmin/g) ?? []).length).toBeGreaterThanOrEqual(3);
  });
});
