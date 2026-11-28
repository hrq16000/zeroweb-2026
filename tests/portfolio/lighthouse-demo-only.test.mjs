import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

function lighthouseAssertions(scope, only) {
  const script = `const config = require("./.lighthouserc.cjs"); process.stdout.write(JSON.stringify(config.ci.assert.assertions));`;
  const output = execFileSync(process.execPath, ["-e", script], {
    env: {
      ...process.env,
      LHCI_SCOPE: scope,
      LHCI_ONLY: only,
      LHCI_IS_PULL_REQUEST: "1",
    },
  });
  return JSON.parse(output.toString("utf8"));
}

test("portfólio draft registrado e noindex recebe exceção apenas no score agregado de SEO", () => {
  const assertions = lighthouseAssertions("portfolio", "salgados-da-fran");
  assert.equal(assertions["categories:seo"][0], "warn");
  assert.deepEqual(assertions["categories:performance"], ["error", { minScore: 0.9 }]);
  assert.deepEqual(assertions["categories:accessibility"], ["error", { minScore: 0.95 }]);
  assert.equal(assertions["meta-description"], "error");
  assert.equal(assertions["document-title"], "error");
  assert.equal(assertions.canonical, "error");
  assert.equal(assertions["http-status-code"], "error");
});

test("páginas fora do catálogo draft continuam com o gate de SEO bloqueante", () => {
  const assertions = lighthouseAssertions("portfolio", "portfolio-index");
  assert.equal(assertions["categories:seo"][0], "error");
});
