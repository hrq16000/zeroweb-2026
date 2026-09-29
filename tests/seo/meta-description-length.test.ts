import { describe, expect, test } from "bun:test";
import { compactMetaDescription } from "@/lib/meta-description";

describe("compactMetaDescription", () => {
  test("preserva descriptions já adequadas", () => {
    const value = "Assistência técnica em São José dos Pinhais com atendimento por avaliação.";
    expect(compactMetaDescription(value)).toBe(value);
  });

  test("não ultrapassa 160 caracteres e corta em palavra", () => {
    const value =
      "Centro Mega em São José dos Pinhais: loja virtual de celulares, acessórios, moda e outlet, com produtos com mídia real, conteúdo social oficial, seleção de itens e pedido pelo funil da loja.";
    const compact = compactMetaDescription(value);
    expect(compact.length).toBeLessThanOrEqual(160);
    expect(compact.endsWith("…")).toBe(true);
    expect(compact).not.toContain("  ");
  });

  test("aceita teto explícito sem estourar o limite", () => {
    expect(compactMetaDescription("uma descrição longa ".repeat(20), 80).length).toBeLessThanOrEqual(80);
  });
});
