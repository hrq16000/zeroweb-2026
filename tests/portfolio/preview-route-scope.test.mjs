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

const premiumHomePortfolioChanges = [
  "docs/portfolio/drafts/dona-garimpeira-brecho-manifest-v4.json",
  "docs/reports/CROSS_PROJECT_PREMIUM_EXPERIENCE_R3_2026-11-27.md",
  "scripts/playwright-portfolio-funnels.mjs",
  "scripts/resolve-visual-regression-scope.mjs",
  "src/components/site/AngelMixBrechoPage.tsx",
  "src/components/site/DonaGarimpeiraBrechoPage.tsx",
  "src/components/site/FeaturedServices.tsx",
  "src/components/site/HomeExperienceV2.css",
  "src/components/site/HomeExperienceV2.tsx",
  "src/components/site/ProjetosNoAr.tsx",
  "src/config/portfolio-cover-status.json",
  "src/config/portfolio-project-dates.json",
  "src/lib/home-project-selection.ts",
  "src/lib/portfolio-admin.ts",
  "src/routes/index.tsx",
  "src/routes/portfolio.$slug.tsx",
  "tests/home/home-showcase.test.ts",
  "tests/portfolio/dona-garimpeira-draft-contract.test.ts",
  "tests/portfolio/dona-garimpeira-seo-prepublish.test.ts",
  "tests/portfolio/preview-route-scope.test.mjs",
  ".lighthouserc.cjs",
  ".github/workflows/portfolio-gates.yml",
];

const donaScopedRouteDiff = [
  'diff --git a/src/routes/portfolio.$slug.tsx b/src/routes/portfolio.$slug.tsx',
  ' if (loaderData?.slug === "dona-garimpeira-brecho") {',
  '-        published: true,',
  '+        published: false,',
  '-        funnelVerified: true,',
  '+        funnelVerified: false,',
  '-        ownerApproved: true,',
  '+        ownerApproved: false,',
  '-        approvedWithoutSocialImage: true,',
  '+        approvedWithoutSocialImage: false,',
].join("\n");

test("home premium + páginas Angel Mix e Dona usam escopo visual/LHCI explícito", () => {
  assert.deepEqual(
    resolveVisualRegressionScope(premiumHomePortfolioChanges, [], {
      dynamicPortfolioRouteDiff: donaScopedRouteDiff,
    }),
    ["home", "angel-mix-brecho", "dona-garimpeira-brecho"],
  );
});

test("qualquer componente compartilhado adicional mantém o gate global", () => {
  assert.deepEqual(
    resolveVisualRegressionScope(
      [...premiumHomePortfolioChanges, "src/components/site/SharedHeader.tsx"],
      [],
      { dynamicPortfolioRouteDiff: donaScopedRouteDiff },
    ),
    [],
  );
});
