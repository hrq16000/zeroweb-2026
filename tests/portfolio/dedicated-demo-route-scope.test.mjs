import assert from "node:assert/strict";
import test from "node:test";
import { resolveVisualRegressionScope } from "../../scripts/resolve-visual-regression-scope.mjs";

const saoSlug = "sao-francisco-pet-center";
const saoComponent = "src/components/site/SaoFranciscoPetCenterPage.tsx";
const saoCss = "src/components/site/sao-francisco-pet-center.css";
const saoRoute = "src/routes/portfolio.sao-francisco-pet-center.tsx";
const saoClients = [{ slug: saoSlug, componentFile: saoComponent }];
const saoFiles = [
  saoRoute,
  saoComponent,
  saoCss,
  "public/images/sao-francisco-pet-center/favicon-demonstracao.svg",
  "src/routeTree.gen.ts",
  "docs/portfolio/briefs/sao-francisco-pet-center.md",
  "scripts/playwright-visual-regression.mjs",
  "scripts/resolve-visual-regression-scope.mjs",
  "tests/portfolio/dedicated-demo-route-scope.test.mjs",
];
const saoOptions = {
  addedFiles: new Set([saoRoute, saoComponent, saoCss]),
  routeTreeDiff: [
    "diff --git a/src/routeTree.gen.ts b/src/routeTree.gen.ts",
    "+  '/portfolio/sao-francisco-pet-center': typeof PortfolioSaoFranciscoPetCenterRoute",
  ].join("\n"),
};

test("novo site autoral tem scope próprio com página real", () => {
  assert.deepEqual(resolveVisualRegressionScope(saoFiles, saoClients, saoOptions), [saoSlug]);
});

test("nunca restringir mudança global junto de novo site", () => {
  assert.deepEqual(
    resolveVisualRegressionScope([...saoFiles, "src/components/portfolio/PortfolioStandardShell.tsx"], saoClients, saoOptions),
    [],
  );
  assert.deepEqual(
    resolveVisualRegressionScope([...saoFiles, "src/styles/global.css"], saoClients, saoOptions),
    [],
  );
});

test("routeTree isolada não remove gates globais", () => {
  assert.deepEqual(resolveVisualRegressionScope(["src/routeTree.gen.ts"], saoClients), []);
});

test("edição isolada de JSX e CSS de rota dedicada existente usa o mesmo escopo", () => {
  assert.deepEqual(resolveVisualRegressionScope([saoComponent, saoCss], saoClients), [saoSlug]);
});

test("asset no diretório da rota dedicada usa o mesmo escopo da rota", () => {
  assert.deepEqual(
    resolveVisualRegressionScope(["public/images/sao-francisco-pet-center/favicon-demonstracao.svg"], saoClients),
    [saoSlug],
  );
  assert.deepEqual(
    resolveVisualRegressionScope([...saoFiles, "public/images/sem-rota/favicon.svg"], saoClients, saoOptions),
    [],
  );
});

test("mudança de routeTree sem alteração da rota nunca é mascarada", () => {
  assert.deepEqual(
    resolveVisualRegressionScope(["src/routeTree.gen.ts", saoComponent], saoClients),
    [],
  );
});

test("Toop Assados public and preview routes share only their own newly added component", () => {
  const files = [
    "src/routes/portfolio.toop-assados.tsx",
    "src/routes/portfolio-preview.toop-assados.tsx",
    "src/components/site/ToopAssadosPreviewPage.tsx",
    "src/components/portfolio/composition/registry.ts",
    "src/routeTree.gen.ts",
  ];
  const clients = [{
    slug: "toop-assados",
    componentFile: "src/components/site/ToopAssadosPreviewPage.tsx",
  }];
  const options = {
    addedFiles: new Set([
      "src/routes/portfolio.toop-assados.tsx",
      "src/routes/portfolio-preview.toop-assados.tsx",
      "src/components/site/ToopAssadosPreviewPage.tsx",
    ]),
    compositionRegistryDiff: [
      "diff --git a/src/components/portfolio/composition/registry.ts b/src/components/portfolio/composition/registry.ts",
      '+  "toop-assados": lazy(() => import("@/components/site/ToopAssadosPreviewPage").then((m) => ({ default: m.ToopAssadosPreviewPage }))),',
    ].join("\n"),
    routeTreeDiff: [
      "diff --git a/src/routeTree.gen.ts b/src/routeTree.gen.ts",
      "+ import { Route as PortfolioPreviewToopAssadosRouteImport } from './routes/portfolio-preview.toop-assados'",
      "+ import { Route as PortfolioToopAssadosRouteImport } from './routes/portfolio.toop-assados'",
      "+  '/portfolio-preview/toop-assados': typeof PortfolioPreviewToopAssadosRoute",
      "+  '/portfolio/toop-assados': typeof PortfolioToopAssadosRoute",
    ].join("\n"),
  };

  assert.deepEqual(resolveVisualRegressionScope(files, clients, options), ["toop-assados"]);
  assert.deepEqual(
    resolveVisualRegressionScope([...files, "src/styles/global.css"], clients, options),
    [],
  );
});
