import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "bun:test";

describe("escopo dos portfolio-gates", () => {
  const workflow = readFileSync(
    resolve(process.cwd(), ".github/workflows/portfolio-gates.yml"),
    "utf8",
  );

  it("não obriga E2E de funil em mudanças puramente SEO", () => {
    expect(workflow).toContain("Detectar impacto em funis e portfólio interativo");
    expect(workflow).toContain("portfolio-runtime-scope.outputs.run == 'true'");
    expect(workflow).toContain("src/routes/(portfolio\\.\\$slug\\.tsx$|api/whatsapp-redirect");
  });

  it("mantém timeout explícito nos E2Es caros", () => {
    const timeoutMatches = workflow.match(/timeout-minutes: 20/g) ?? [];
    expect(timeoutMatches.length).toBeGreaterThanOrEqual(3);
  });

  it("mantém gates SEO/runtime mesmo quando funil é pulado", () => {
    expect(workflow).toContain('Prévias de link e ícones (headless)');
    expect(workflow).toContain('Indexabilidade do build ("depois") e diff');
    expect(workflow).toContain("Acessibilidade (axe-core)");
    expect(workflow).toContain("Detectar impacto visual da mudança");
  });
});
