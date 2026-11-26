import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../..", import.meta.url));
const draftSlug = "panificadora-doce-coracao-santo-antonio";
const publishedSlug = "sos-presentes-cosmeticos";

function lighthouseConfig(scope, slug) {
  const script = [
    'const config = require("./.lighthouserc.cjs");',
    'process.stdout.write(JSON.stringify({ urls: config.ci.collect.url, assertions: config.ci.assert.assertions }));',
  ].join(" ");
  const result = spawnSync(process.execPath, ["-e", script], {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      GITHUB_EVENT_NAME: "test",
      LHCI_IS_PULL_REQUEST: "0",
      LHCI_USE_LOCAL: "0",
      LHCI_SCOPE: scope,
      LHCI_ONLY: slug,
      LHCI_TARGET_URL: "https://example.test",
    },
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  return JSON.parse(result.stdout);
}

test("noindex draft demo keeps SEO aggregate non-blocking without weakening other gates", () => {
  const config = lighthouseConfig("portfolio", draftSlug);

  assert.deepEqual(config.urls, [
    `https://example.test/portfolio/${draftSlug}`,
  ]);
  assert.equal(config.assertions["categories:seo"][0], "warn");
  assert.equal(config.assertions["categories:performance"][0], "error");
  assert.equal(config.assertions["categories:accessibility"][0], "error");
  for (const rule of [
    "meta-description",
    "document-title",
    "html-has-lang",
    "canonical",
    "robots-txt",
    "image-alt",
    "http-status-code",
  ]) {
    assert.equal(config.assertions[rule], "error", rule);
  }
});

test("published portfolio keeps the SEO aggregate blocking", () => {
  const config = lighthouseConfig("portfolio", publishedSlug);

  assert.deepEqual(config.urls, [
    `https://example.test/portfolio/${publishedSlug}`,
  ]);
  assert.equal(config.assertions["categories:seo"][0], "error");
  assert.equal(config.assertions["categories:performance"][0], "error");
  assert.equal(config.assertions["categories:accessibility"][0], "error");
});
