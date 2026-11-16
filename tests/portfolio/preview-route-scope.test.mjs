import assert from "node:assert/strict";
import test from "node:test";
import { previewOnlyScope, resolveVisualRegressionScope } from "../../scripts/resolve-visual-regression-scope.mjs";

const previewChanges = [
  "src/routes/portfolio-preview.agropet-filt.tsx",
  "src/components/site/AgropetFiltPreviewPage.tsx",
  "src/components/site/agropet-filt-preview.css",
  "src/routeTree.gen.ts",
  "docs/portfolio/drafts/agropet-filt-pilot.md",
  "scripts/resolve-visual-regression-scope.mjs",
  "scripts/playwright-visual-regression.mjs",
  ".lighthouserc.cjs",
  ".github/workflows/lighthouse.yml",
  ".github/workflows/portfolio-gates.yml",
  "tests/portfolio/preview-route-scope.test.mjs",
];

test("prévia independente executa regressão e Lighthouse no próprio preview", () => {
  assert.deepEqual(previewOnlyScope(previewChanges), ["preview-agropet-filt"]);
  assert.deepEqual(resolveVisualRegressionScope(previewChanges, []), ["preview-agropet-filt"]);
});

test("mudança visual compartilhada NÃO é silenciosamente excluída", () => {
  assert.equal(previewOnlyScope([...previewChanges, "src/styles.css"]), null);
  assert.deepEqual(resolveVisualRegressionScope([...previewChanges, "src/styles.css"], []), []);
});

test("alterar uma rota pública junto com a prévia força gate global", () => {
  assert.equal(previewOnlyScope([...previewChanges, "src/routes/portfolio.$slug.tsx"]), null);
  assert.deepEqual(resolveVisualRegressionScope([...previewChanges, "src/routes/portfolio.$slug.tsx"], []), []);
});

test("escopo de prévia requer componente e CSS exclusivos", () => {
  assert.equal(previewOnlyScope(["src/routes/portfolio-preview.agropet-filt.tsx", "src/components/site/SharedHeader.tsx"]), null);
});

test("arquivo de outro cliente/serviço invalida a classificação", () => {
  assert.equal(previewOnlyScope([...previewChanges, "src/routes/servicos.index.tsx"]), null);
});
