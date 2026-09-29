import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolvePortfolioRuntimeScope } from "../../scripts/resolve-portfolio-runtime-scope.mjs";

const clients = JSON.parse(readFileSync("src/config/portfolio-clients.json", "utf8"));
const bySlug = new Map(clients.map((client: any) => [client.slug, client]));

describe("escopo funcional seguro de portfólios", () => {
  test("componentes individuais + testes escopam somente clientes tocados", () => {
    const ag: any = bySlug.get("ag-electrical-services");
    const angel: any = bySlug.get("angel-mix-brecho");
    expect(ag?.componentFile).toBeTruthy();
    expect(angel?.componentFile).toBeTruthy();
    expect(
      resolvePortfolioRuntimeScope(
        [ag.componentFile, angel.componentFile, "tests/seo/portfolio-original-content-wave3.test.ts"],
        clients,
      ),
    ).toEqual(["ag-electrical-services", "angel-mix-brecho"]);
  });

  test("fonte compartilhada força gate global", () => {
    const ag: any = bySlug.get("ag-electrical-services");
    expect(
      resolvePortfolioRuntimeScope(
        [ag.componentFile, "src/components/portfolio/PortfolioSeoNetwork.tsx"],
        clients,
      ),
    ).toEqual([]);
  });

  test("mecanismo protegido ou config força gate global", () => {
    expect(
      resolvePortfolioRuntimeScope(
        ["src/lib/whatsapp.ts", "src/config/portfolio-whatsapp.json"],
        clients,
      ),
    ).toEqual([]);
  });

  test("infra visual do teste não amplia um escopo individual", () => {
    const ag: any = bySlug.get("ag-electrical-services");
    expect(
      resolvePortfolioRuntimeScope(
        [ag.componentFile, "scripts/playwright-visual-regression.mjs", "scripts/visual-screenshot-integrity.mjs"],
        clients,
      ),
    ).toEqual(["ag-electrical-services"]);
  });
});

describe("contrato de filtro do E2E de funis", () => {
  const source = readFileSync("scripts/playwright-portfolio-funnels.mjs", "utf8");
  const workflow = readFileSync(".github/workflows/portfolio-gates.yml", "utf8");

  test("mantém filtro singular e aceita CSV plural", () => {
    expect(source).toContain("E2E_ONLY_SLUG");
    expect(source).toContain("E2E_ONLY_SLUGS");
    expect(source).toContain("onlySlugs.has(client.slug)");
  });

  test("workflow injeta o mesmo escopo em popup e funis", () => {
    expect(workflow).toContain("POPUP_SLUGS: ${{ steps.portfolio-runtime-scope.outputs.only }}");
    expect(workflow).toContain("E2E_ONLY_SLUGS: ${{ steps.portfolio-runtime-scope.outputs.only }}");
  });
});
