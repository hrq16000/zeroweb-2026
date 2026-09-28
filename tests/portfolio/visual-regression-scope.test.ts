import { describe, expect, test } from "bun:test";
import { resolveVisualRegressionScope } from "../../scripts/resolve-visual-regression-scope.mjs";

const clients = [
  {
    slug: "ag-electrical-services",
    componentFile: "src/components/site/AgElectricalServicesPage.tsx",
  },
  {
    slug: "angel-mix-brecho",
    componentFile: "src/components/site/AngelMixBrechoPage.tsx",
  },
  {
    slug: "miro-tech",
    componentFile: "src/components/site/MiroTechPage.tsx",
  },
];

describe("escopo seguro da regressão visual", () => {
  test("limita a slugs quando só componentes individuais mudaram", () => {
    expect(
      resolveVisualRegressionScope(
        [
          "src/components/site/MiroTechPage.tsx",
          "src/components/site/AgElectricalServicesPage.tsx",
          "tests/seo/portfolio-original-content-wave3.test.ts",
        ],
        clients,
      ),
    ).toEqual(["ag-electrical-services", "miro-tech"]);
  });

  test("reconhece ativos dentro do diretório exclusivo do portfolio", () => {
    expect(
      resolveVisualRegressionScope(
        ["public/images/angel-mix-brecho/hero.webp"],
        clients,
      ),
    ).toEqual(["angel-mix-brecho"]);
  });

  test("mantém escopo global para componente compartilhado", () => {
    expect(
      resolveVisualRegressionScope(
        ["src/components/portfolio/PortfolioStandardShell.tsx"],
        clients,
      ),
    ).toEqual([]);
  });

  test("mantém escopo global para ativo público não resolvido", () => {
    expect(
      resolveVisualRegressionScope(["public/0web-logo.png"], clients),
    ).toEqual([]);
  });
});
