import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const lighthouse = readFileSync(".github/workflows/lighthouse.yml", "utf8");
const gates = readFileSync(".github/workflows/portfolio-gates.yml", "utf8");
const lhci = readFileSync(".lighthouserc.cjs", "utf8");

describe("novo portfolio publicado nunca ignora CI", () => {
  test("Lighthouse descobre draft -> published e mistura slugs sem reduzir global", () => {
    expect(lighthouse).toContain('portfolio-new-release-gate.mjs --slugs "$BASE" "$HEAD"');
    expect(lighthouse).toContain('portfolio-new-release-gate.mjs --merge "$ONLY" "$NEW_PUBLISHED"');
    expect(lighthouse).toContain('elif [ "$RUN" = false ] || [ "$MODE" = "regional" ]; then');
    expect(lighthouse).toContain('SHARDS=');
    expect(lhci).toContain('"categories:performance": ["error", { minScore: 0.9 }]');
    expect(lhci).toContain('"categories:seo": ["error", { minScore: 0.95 }]');
    expect(lhci).toContain('"categories:accessibility": ["error", { minScore: 0.95 }]');
  });

  test("gate estático exige lifecycle e falha fechado com Git inválido", () => {
    expect(gates).toContain("Entrada de novos portfólios publicados (fail-closed)");
    expect(gates).toContain('portfolio-new-release-gate.mjs --check "$BASE" "$HEAD"');
    expect(gates).toContain("git fetch --no-tags --depth=1 origin");
    expect(gates).toContain("validate:portfolio-scaffold");
  });

  test("E2E mantém global para arquivo compartilhado e inclui novo slug em escopo específico", () => {
    expect(gates).toContain('portfolio-new-release-gate.mjs --merge "$ONLY" "$NEW_PUBLISHED"');
    expect(gates).toContain("ONLY vazio preserva gate E2E global");
    expect(gates).toContain("test:e2e:portfolio-funnels");
  });

  test("visual é obrigatório para novo published em três viewports sem alterar limite", () => {
    expect(gates).toContain('Uma publicação nova exige baseline/revisão visual 3 viewports');
    expect(gates).toContain('VISUAL_ONLY="$NEW_PUBLISHED"');
    expect(gates).toContain('RUN=true');
    expect(gates).toContain("bun run test:visual");
    const visualScript = readFileSync("scripts/playwright-visual-regression.mjs", "utf8");
    expect(visualScript).toContain("0.02");
  });
});
