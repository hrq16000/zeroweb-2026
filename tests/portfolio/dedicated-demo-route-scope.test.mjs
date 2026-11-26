import assert from "node:assert/strict";
import test from "node:test";
import { resolveVisualRegressionScope } from "../../scripts/resolve-visual-regression-scope.mjs";

const own = [
  "src/routes/portfolio.sao-francisco-pet-center.tsx",
  "src/components/site/SaoFranciscoPetCenterPage.tsx",
  "src/components/site/sao-francisco-pet-center.css",
  "public/images/sao-francisco-pet-center/favicon-demonstracao.svg",
  "src/routeTree.gen.ts",
  "docs/portfolio/briefs/sao-francisco-pet-center.md",
  "scripts/playwright-visual-regression.mjs",
  "scripts/resolve-visual-regression-scope.mjs",
  "tests/portfolio/dedicated-demo-route-scope.test.mjs",
];

const clients = [{
  slug: "sao-francisco-pet-center",
  componentFile: "src/components/site/SaoFranciscoPetCenterPage.tsx",
}];
const routeTreeDiff = [
  "diff --git a/src/routeTree.gen.ts b/src/routeTree.gen.ts",
  "+  '/portfolio/sao-francisco-pet-center': typeof PortfolioSaoFranciscoPetCenterRoute",
  "",
].join("\n");
const options = {
  addedFiles: new Set([
    "src/routes/portfolio.sao-francisco-pet-center.tsx",
    "src/components/site/SaoFranciscoPetCenterPage.tsx",
    "src/components/site/sao-francisco-pet-center.css",
  ]),
  routeTreeDiff,
};

test("novo site autoral tem scope próprio com página real", () => {
  assert.deepEqual(resolveVisualRegressionScope(own, clients, options), ["sao-francisco-pet-center"]);
});

test("nunca restringir mudança global junto de novo site", () => {
  assert.deepEqual(resolveVisualRegressionScope([...own, "src/components/portfolio/PortfolioStandardShell.tsx"], clients, options), []);
  assert.deepEqual(resolveVisualRegressionScope([...own, "src/styles/global.css"], clients, options), []);
});

test("routeTree isolada não remove gates globais", () => {
  assert.deepEqual(resolveVisualRegressionScope(["src/routeTree.gen.ts"], []), []);
});

test("edição isolada de JSX e CSS de rota dedicada existente não exige QA global", () => {
  assert.deepEqual(
    resolveVisualRegressionScope([
      "src/components/site/SaoFranciscoPetCenterPage.tsx",
      "src/components/site/sao-francisco-pet-center.css",
    ], clients),
    ["sao-francisco-pet-center"],
  );
});

test("asset no diretório da rota dedicada usa o mesmo escopo da rota", () => {
  assert.deepEqual(
    resolveVisualRegressionScope(["public/images/sao-francisco-pet-center/favicon-demonstracao.svg"], clients),
    ["sao-francisco-pet-center"],
  );
  assert.deepEqual(
    resolveVisualRegressionScope([...own, "public/images/sem-rota/favicon.svg"], clients, options),
    [],
  );
});

test("mudança de routeTree sem alteração da rota nunca é mascarada", () => {
  assert.deepEqual(
    resolveVisualRegressionScope([
      "src/routeTree.gen.ts",
      "src/components/site/SaoFranciscoPetCenterPage.tsx",
    ], []),
    [],
  );
});
