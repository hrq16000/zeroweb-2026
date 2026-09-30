import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

describe("escopo E2E de portfólios no CI", () => {
  const workflow = readFileSync(".github/workflows/portfolio-gates.yml", "utf8");
  const funnels = readFileSync("scripts/playwright-portfolio-funnels.mjs", "utf8");

  test("PR deriva o menor escopo seguro pelo resolvedor existente", () => {
    expect(workflow).toContain("Detectar escopo E2E do PR");
    expect(workflow).toContain("resolve-visual-regression-scope.mjs");
    expect(workflow).toContain("POPUP_SLUGS:");
    expect(workflow).toContain("E2E_ONLY_SLUGS:");
  });

  test("push em main preserva escopo global", () => {
    expect(workflow).toContain('if [ "${{ github.event_name }}" = "pull_request" ]');
    expect(workflow).toContain('echo "escopo E2E: ${ONLY:-global}"');
  });

  test("índice de portfólios não dispara funis individuais", () => {
    expect(workflow).toContain("steps.e2e-scope.outputs.only != 'portfolio-index'");
  });

  test("funil aceita CSV de slugs sem quebrar variável singular legada", () => {
    expect(funnels).toContain("E2E_ONLY_SLUGS");
    expect(funnels).toContain("E2E_ONLY_SLUG");
    expect(funnels).toContain("onlySlugs.includes(client.slug)");
  });
});
