import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const script = readFileSync("scripts/playwright-commerce-e2e.mjs", "utf8");
const pkg = JSON.parse(readFileSync("package.json", "utf8"));

describe("commerce browser E2E harness", () => {
  test("modo padrão é local e não grava telemetria operacional", () => {
    expect(script).toContain('process.env.E2E_BASE_URL || "http://localhost:8080"');
    expect(script).toContain('process.env.E2E_COMMERCE_WRITE === "1"');
    expect(script).toContain("if (allowTelemetryWrites)");
  });

  test("cobre loja, carrinho, checkout, validação e recorrência", () => {
    expect(script).toContain("/servicos?qa=1");
    expect(script).toContain("Continuar para checkout");
    expect(script).toContain("Finalizar pedido");
    expect(script).toContain("Finalizar com atendimento");
    expect(script).toContain("Plano recorrente");
    expect(script).toMatch(/Pagar agora\|Entrar com Google para pagar/);
  });

  test("modo de escrita cobre saída explícita e retorno de cancelamento sem concluir venda", () => {
    expect(script).toContain("Voltar à loja");
    expect(script).toContain("payment=cancelled");
    expect(script).not.toContain('click({ force: true })');
    expect(script).not.toContain("Pagar agora\").click");
  });

  test("package expõe comando dedicado", () => {
    expect(pkg.scripts["test:e2e:commerce"]).toBe("node scripts/playwright-commerce-e2e.mjs");
  });
});
