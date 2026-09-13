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

  it("aceita DDD + 8 dígitos (fixo) sem exigir confirmação extra", () => {
    const r = normalizeBrWhatsApp("(41) 3345-1122");
    // fixo é destino válido: ok=true; apenas sinalizado como fixo, sem conversão
    expect(r.ok).toBe(true);
    expect(r.ok && r.looksLikeLandline).toBe(true);
    expect(r.ok && r.digits).toBe("554133451122");
  });

  it("aceita DDD + 9 dígitos (celular)", () => {
    const r = normalizeBrWhatsApp("(41) 99999-1234");
    expect(r.ok && r.digits).toBe("5541999991234");
    expect(r.ok && r.looksLikeLandline).toBe(false);
  });

  it("nunca acrescenta nem remove dígitos", () => {
    const fixo = normalizeBrWhatsApp("4133451122");
    expect(fixo.ok && fixo.digits).toBe("554133451122"); // 12 dígitos, sem 9 inventado
    const cel = normalizeBrWhatsApp("41999991234");
    expect(cel.ok && cel.digits).toBe("5541999991234"); // 13 dígitos preservados
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
