import { describe, expect, it } from "bun:test";
import {
  assertNoPii,
  buildAttribution,
  isHostLeadStatus,
  maskPhoneForDisplay,
  normalizeBrazilPhone,
  sanitizeField,
  HOST_CAPTURE_FUNNEL_SLUG,
} from "@/lib/portfolio-host-leads";

describe("normalizeBrazilPhone", () => {
  it("aceita celular com DDD e máscara", () => {
    const r = normalizeBrazilPhone("(41) 99745-2053");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.e164).toBe("5541997452053");
  });

  it("aceita número com DDI 55", () => {
    const r = normalizeBrazilPhone("+55 41 99745 2053");
    expect(r.ok && r.digits).toBe("41997452053");
  });

  it("aceita fixo de 10 dígitos", () => {
    expect(normalizeBrazilPhone("4133334444").ok).toBe(true);
  });

  it("remove zero de tronco", () => {
    const r = normalizeBrazilPhone("041997452053");
    expect(r.ok && r.digits).toBe("41997452053");
  });

  it("rejeita DDD inválido, curto e celular sem 9", () => {
    expect(normalizeBrazilPhone("0199745205").ok).toBe(false);
    expect(normalizeBrazilPhone("123").ok).toBe(false);
    expect(normalizeBrazilPhone("41897452053").ok).toBe(false);
    expect(normalizeBrazilPhone("").ok).toBe(false);
  });
});

describe("sanitizeField", () => {
  it("remove HTML e normaliza espaços", () => {
    expect(sanitizeField("  <b>João</b>   Silva ", 50)).toBe("João Silva");
  });
  it("aplica limite de tamanho", () => {
    expect(sanitizeField("a".repeat(200), 10)).toHaveLength(10);
  });
  it("trata nulo", () => {
    expect(sanitizeField(null, 10)).toBe("");
  });
});

describe("atribuição", () => {
  it("preenche null quando o dado não existe (sem inventar)", () => {
    const a = buildAttribution({ portfolioSlug: "heloa-gas" });
    expect(a.portfolioSlug).toBe("heloa-gas");
    expect(a.utmSource).toBeNull();
    expect(a.referrer).toBeNull();
    expect(a.sessionId).toBeNull();
  });

  it("sanitiza valores recebidos", () => {
    const a = buildAttribution({ utmCampaign: "<script>x</script> verao" });
    expect(a.utmCampaign).not.toContain("<");
  });
});

describe("privacidade e status", () => {
  it("mascara telefone para exibição", () => {
    expect(maskPhoneForDisplay("41997452053")).toBe("••••2053");
    expect(maskPhoneForDisplay("12")).toBe("—");
  });

  it("bloqueia PII em payload de analytics", () => {
    expect(assertNoPii({ slug: "heloa-gas", event_category: "conversion" })).toBe(true);
    expect(assertNoPii({ slug: "x", telefone: "41999999999" })).toBe(false);
    expect(assertNoPii({ Email: "a@b.com" })).toBe(false);
  });

  it("valida status do pipeline", () => {
    expect(isHostLeadStatus("novo")).toBe(true);
    expect(isHostLeadStatus("qualquer")).toBe(false);
  });

  it("usa o funil interno seeded", () => {
    expect(HOST_CAPTURE_FUNNEL_SLUG).toBe("0web-portfolio-captacao");
  });
});
