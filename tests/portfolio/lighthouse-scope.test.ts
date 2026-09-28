import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Lighthouse escopado por portfolio", () => {
  const workflow = readFileSync(resolve(".github/workflows/lighthouse.yml"), "utf8");
  const config = readFileSync(resolve(".lighthouserc.cjs"), "utf8");

  test("workflow resolve slugs individuais e preserva full para superfícies amplas", () => {
    expect(workflow).toContain("resolve-visual-regression-scope.mjs");
    expect(workflow).toContain("MODE=portfolio");
    expect(workflow).toContain('SHARDS=\'[0]\'');
    expect(workflow).toContain("LHCI_ONLY:");
  });

  test("config mede somente os slugs informados sem incluir rotas comuns", () => {
    expect(config).toContain("const onlySlugs");
    expect(config).toContain("const selectedClients");
    expect(config).toContain("const effectiveShardCount = onlySlugs.length ? 1 : shardCount");
    expect(config).toContain("!onlySlugs.length && shardIndex === 0");
  });

  test("budgets Lighthouse permanecem inalterados", () => {
    expect(config).toContain('"categories:performance": ["error", { minScore: 0.9 }]');
    expect(config).toContain('"categories:seo": ["error", { minScore: 0.95 }]');
    expect(config).toContain('"categories:accessibility": ["error", { minScore: 0.95 }]');
  });
});
