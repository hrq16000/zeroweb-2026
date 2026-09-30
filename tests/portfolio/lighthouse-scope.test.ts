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
    expect(config).toContain("individualPortfolioOnly.map");
    expect(config).toContain("LIGHTHOUSE_ONLY.length === 0");
  });

  test("token portfolio-index mede apenas o hub /portfolio", () => {
    expect(config).toContain('LIGHTHOUSE_ONLY.includes("portfolio-index")');
    expect(config).toContain('slug !== "portfolio-index"');
    expect(config).toContain('[`${TARGET_URL}/portfolio`]');
  });

  test("push em main mede o próprio commit e não disputa com o deploy", () => {
    expect(workflow).toContain("LHCI_USE_LOCAL:");
    expect(workflow).toContain("github.event_name != 'workflow_dispatch'");
    expect(config).toContain("LHCI_USE_LOCAL");
    expect(config).toContain("USE_LOCAL_SERVER");
    expect(config).toContain("startServerCommand");
  });

  test("workflow_dispatch preserva auditoria explícita de URL externa", () => {
    expect(workflow).toContain("workflow_dispatch");
    expect(workflow).toContain("target_url");
    expect(config).toContain('process.env.LHCI_TARGET_URL || "https://0web.com.br"');
  });

  test("artefatos ocultos do Lighthouse são publicados", () => {
    expect(workflow).toContain("include-hidden-files: true");
    expect(workflow).toContain(".lighthouseci/**");
  });

  test("remoção do WebPage JSON-LD não dispara gate visual global", () => {
    const workflow = readFileSync(".github/workflows/lighthouse.yml", "utf8");
    expect(workflow).toContain("@type.*WebPage");
    expect(workflow).toContain("isPartOf:");
  });
});
