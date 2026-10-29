import { describe, expect, test } from "bun:test";
import { readFileSync, statSync } from "node:fs";
import { compositionRegistryClients, resolveVisualRegressionScope, routeComponentClients } from "../../scripts/resolve-visual-regression-scope.mjs";

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

  test("escopa o índice /portfolio isoladamente sem atingir os 96 projetos", () => {
    expect(
      resolveVisualRegressionScope(
        [
          "src/routes/portfolio.index.tsx",
          "tests/portfolio/portfolio-crawl-directory.test.ts",
          "tests/portfolio/visual-regression-scope.test.ts",
          "scripts/resolve-visual-regression-scope.mjs",
          ".lighthouserc.cjs",
        ],
        clients,
      ),
    ).toEqual(["portfolio-index"]);
  });

  test("descobre portfólio legado pela rota canônica sem cair no gate global", () => {
    const routeSource = `
      const JklMarcenariaPage = lazy(() =>
        import("@/components/site/JklMarcenariaPage").then((m) => ({ default: m.JklMarcenariaPage })),
      );
      const render = slug === "jkl-marcenaria" ? (
        <JklMarcenariaPage />
      ) : null;
    `;
    const routeClients = routeComponentClients(routeSource);
    expect(routeClients).toEqual([
      {
        slug: "jkl-marcenaria",
        componentFile: "src/components/site/JklMarcenariaPage.tsx",
      },
    ]);
    expect(
      resolveVisualRegressionScope(
        ["src/components/site/JklMarcenariaPage.tsx"],
        [...clients, ...routeClients],
      ),
    ).toEqual(["jkl-marcenaria"]);
  });

  test("mapeia composição autoral ADHONEP sem escopar outros portfólios", () => {
    const registry = readFileSync("src/components/portfolio/composition/registry.ts", "utf8");
    const authors = compositionRegistryClients(registry);
    expect(authors).toContainEqual({
      slug: "adhonep-curitiba",
      componentFile: "src/components/site/AdhonepCuritibaPage.tsx",
    });
    expect(resolveVisualRegressionScope(
      ["src/components/site/AdhonepCuritibaPage.tsx"],
      [...clients, ...authors],
    )).toEqual(["adhonep-curitiba"]);
  });

  test("rota dedicada do D.Y.Z usa apenas seu slug, sem afrouxar limite visual", () => {
    const dedicatedClients = [
      ...clients,
      { slug: "dyzpromo", componentFile: "src/components/site/DyzPromoPage.tsx" },
    ];
    expect(resolveVisualRegressionScope(
      [
        "src/routes/portfolio.dyzpromo.tsx",
        "tests/portfolio/visual-regression-scope.test.ts",
        "scripts/resolve-visual-regression-scope.mjs",
      ],
      dedicatedClients,
    )).toEqual(["dyzpromo"]);
    expect(resolveVisualRegressionScope(
      ["src/routes/portfolio.dyzpromo.tsx", "src/components/portfolio/PortfolioStandardShell.tsx"],
      dedicatedClients,
    )).toEqual([]);
    expect(resolveVisualRegressionScope(
      ["src/routes/portfolio.nao-registrado.tsx"],
      dedicatedClients,
    )).toEqual([]);
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

  test("remoção do WebPage JSON-LD não dispara gate visual global", () => {
    const workflow = readFileSync(".github/workflows/portfolio-gates.yml", "utf8");
    expect(workflow).toContain("@type.*WebPage");
    expect(workflow).toContain("isPartOf:");
  });

  test("galeria responsiva da D.Y.Z preserva JPEGs originais e o lightbox", () => {
    const generator = readFileSync("scripts/generate-portfolio-perf-images.mjs", "utf8");
    const page = readFileSync("src/components/site/DyzPromoPage.tsx", "utf8");
    for (const image of ["faixa-equipe","cancela-mall","cancela-shopping","acao-semaforo","entrega-residencial","panfletagem-praca","bandeira-centro"]) {
      expect(generator).toContain('"' + image + '"');
      expect(statSync("public/images/dyzpromo/" + image + ".jpeg").size).toBeGreaterThan(0);
    }
    expect(generator).toContain("for (const width of [480, 800])");
    expect(generator).toContain("converted[0] >= converted[1]");
    expect(page).toContain("srcSet={srcSet}");
    expect(page).toContain("detail: { src, alt }");
    expect(page).toContain('imageName !== "panfletagem-semaforo"');
    expect(page).toContain("loading={priority ? \"eager\" : \"lazy\"}");
  });

  test("favicon da D.Y.Z reutiliza PNG local e leve, sem alterar canonical nem OG", () => {
    const route = readFileSync("src/routes/portfolio.dyzpromo.tsx", "utf8");
    expect(route).toContain('const ICON = "/images/dyzpromo/logo-dyz-promo-touch.png"');
    expect(route).toContain('{ rel: "icon", type: "image/png", href: ICON }');
    expect(route).toContain('const TOUCH_ICON = "/images/dyzpromo/logo-dyz-promo-touch.png"');
    expect(route).toContain('const URL = "https://0web.com.br/portfolio/dyzpromo"');
    expect(route).toContain('const SOCIAL_IMAGE = "https://0web.com.br/images/dyzpromo/logo-dyz-promo-og.jpg');
    const size = statSync("public/images/dyzpromo/logo-dyz-promo-touch.png").size;
    expect(size).toBeLessThan(40_000);
  });
});
