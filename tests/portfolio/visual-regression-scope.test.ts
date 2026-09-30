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

  test("família local-first usa conjunto representativo estável", () => {
    expect(
      resolveVisualRegressionScope(
        [
          "src/components/portfolio/PortfolioSeoNetwork.tsx",
          "src/lib/portfolio-place-directory.ts",
          "src/lib/portfolio-places.ts",
          "src/lib/portfolio-seo-network.ts",
          "src/routes/portfolio-em.$local.tsx",
          "tests/portfolio/portfolio-place-directory.test.ts",
          "tests/portfolio/universal-seo-network.test.ts",
          "scripts/resolve-visual-regression-scope.mjs",
        ],
        clients,
      ),
    ).toEqual([
      "ag-electrical-services",
      "marmitaria-dom-diego",
      "mirassol-conserta-celular",
      "guaratuba-oficina-nautica",
    ]);
  });

  test("família local-first volta ao global se surgir arquivo amplo fora do contrato", () => {
    expect(
      resolveVisualRegressionScope(
        [
          "src/lib/portfolio-seo-network.ts",
          "src/routes/portfolio-em.$local.tsx",
          "public/0web-logo.png",
        ],
        clients,
      ),
    ).toEqual([]);
  });

  test("índice de portfólios usa somente a rota portfolio-index", () => {
    expect(
      resolveVisualRegressionScope(
        [
          "src/routes/portfolio.index.tsx",
          "tests/portfolio/portfolio-crawl-directory.test.ts",
        ],
        clients,
      ),
    ).toEqual(["portfolio-index"]);
  });

  test("plumbing do próprio CI não amplia o índice para global", () => {
    expect(
      resolveVisualRegressionScope(
        [
          "src/routes/portfolio.index.tsx",
          ".lighthouserc.cjs",
          ".github/workflows/lighthouse.yml",
          ".github/workflows/portfolio-gates.yml",
          "scripts/resolve-visual-regression-scope.mjs",
          "tests/portfolio/lighthouse-scope.test.ts",
        ],
        clients,
      ),
    ).toEqual(["portfolio-index"]);
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
