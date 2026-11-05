import assert from "node:assert/strict";
import test from "node:test";
import { resolveVisualRegressionScope } from "../../scripts/resolve-visual-regression-scope.mjs";

const own = [
  "src/routes/portfolio.sao-francisco-pet-center.tsx",
  "src/components/site/SaoFranciscoPetCenterPage.tsx",
  "src/components/site/sao-francisco-pet-center.css",
  "src/routeTree.gen.ts",
  "docs/portfolio/briefs/sao-francisco-pet-center.md",
  "scripts/playwright-visual-regression.mjs",
  "scripts/resolve-visual-regression-scope.mjs",
  "tests/portfolio/dedicated-demo-route-scope.test.mjs",
];

test("novo site autoral tem scope próprio com página real", () => {
  assert.deepEqual(resolveVisualRegressionScope(own, []), ["sao-francisco-pet-center"]);
});

test("nunca restringir mudança global junto de novo site", () => {
  assert.deepEqual(resolveVisualRegressionScope([...own, "src/components/portfolio/PortfolioStandardShell.tsx"], []), []);
  assert.deepEqual(resolveVisualRegressionScope([...own, "src/styles/global.css"], []), []);
});

test("routeTree isolada não remove gates globais", () => {
  assert.deepEqual(resolveVisualRegressionScope(["src/routeTree.gen.ts"], []), []);
});
