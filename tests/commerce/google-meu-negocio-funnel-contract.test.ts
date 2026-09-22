import { describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { resolve } from "path";

const src = readFileSync(
  resolve(process.cwd(), "src/routes/servicos.google-meu-negocio.tsx"),
  "utf8",
);

describe("Google Meu Negócio funnel contract", () => {
  test("usa o FunnelCTAButton padrão para orientação", () => {
    expect(src).toContain('source: "gmb_diagnostic"');
    expect(src).toContain('serviceSlug: "google-meu-negocio"');
    expect(src).toContain('label="Receber orientação"');
    expect(src).not.toContain("InstitutionalDiagnosticQuizModal");
    expect(src).not.toContain("setQuizOpen");
  });

  test("não promete contato direto com a 0WEB via WhatsApp", () => {
    expect(src).not.toContain('fale conosco no WhatsApp');
    expect(src).toContain("peça orientação pelo funil");
  });

  test("preserva os dois produtos comerciais atuais", () => {
    expect(src).toContain("price: 397");
    expect(src).toContain("price: 247");
    expect(src).toContain('variantId: "plano-unico"');
    expect(src).toContain('variantId: "plano-pro"');
  });
});
