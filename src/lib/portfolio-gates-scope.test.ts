import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "bun:test";

describe("portfolio-gates scope", () => {
  const workflow = readFileSync(
    resolve(process.cwd(), ".github/workflows/portfolio-gates.yml"),
    "utf8",
  );

  it("mantém gates estáticos para toda mudança", () => {
    expect(workflow).toContain("static-gates:");
    expect(workflow).toContain("Typecheck");
    expect(workflow).toContain("Unit tests");
  });

  it("pula somente popup e funis quando o escopo é SEO", () => {
    expect(workflow).toContain("mode=seo");
    expect(workflow).toContain("if: needs.scope.outputs.mode != 'seo'");
    expect(workflow).toContain('Snapshot de indexabilidade (produção = "antes")');
    expect(workflow).toContain('Indexabilidade do build ("depois") e diff');
    expect(workflow).toContain("Acessibilidade (axe-core)");
    expect(workflow).toContain("Prévias de link e ícones (headless)");
  });
});
