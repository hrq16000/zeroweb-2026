import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

describe("Lighthouse escopado por portfolios alterados", () => {
  const workflow = readFileSync(".github/workflows/lighthouse.yml", "utf8");
  const config = readFileSync(".lighthouserc.cjs", "utf8");

  test("workflow reaproveita o resolvedor seguro de slugs", () => {
    expect(workflow).toContain("resolve-visual-regression-scope.mjs");
    expect(workflow).toContain("only=$ONLY");
    expect(workflow).toContain("LHCI_ONLY:");
  });

  test("escopo individual roda um único shard", () => {
    expect(workflow).toContain("MODE=portfolio");
    expect(workflow).toContain("SHARDS='[0]'");
  });

  test("config mede somente os slugs indicados quando LHCI_ONLY existe", () => {
    expect(config).toContain('process.env.LHCI_ONLY');
    expect(config).toContain("LIGHTHOUSE_ONLY.map");
    expect(config).toContain("LIGHTHOUSE_ONLY.length === 0");
  });
});
