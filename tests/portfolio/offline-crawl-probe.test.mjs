import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { probeOfflinePortfolioSite } from "../../scripts/portfolio-offline-crawl-probe.mjs";

const SEED = "https://exemplo.com.br/";
const DATE = "2026-11-10T16:00:00.000Z";
const base = {
  enabled: true, clientKey: "atelier-a", seedUrl: SEED,
  allowedHosts: ["exemplo.com.br"], retrievedAt: DATE,
};

const home = '<html><head><title>Ateliê A</title><meta name="description" content="Produtos artesanais"></head><body>' +
  '<a href="/servicos">Serviços</a><a href="/sobre">Sobre</a><a href="/contato">Contato</a>' +
  '<a href="https://outro.com.br/colecao">Externo</a><a href="/admin">Admin</a></body></html>';
const snapshots = {
  [SEED]: home,
  "https://exemplo.com.br/servicos": "<title>Serviços</title><a href='/nivel-2'>Nível 2</a>",
  "https://exemplo.com.br/sobre": "<title>Sobre</title>",
  "https://exemplo.com.br/contato": "<title>Contato</title>",
};

test("disabled by default: no pages and zero network calls", () => {
  assert.deepEqual(probeOfflinePortfolioSite({ seedUrl: SEED }), {
    status: "disabled", pages: [], visited: 0,
    limits: { maxPages: 3, maxDepth: 1, concurrency: 1, networkRequests: 0 },
  });
});

test("fails closed when clientKey is missing or malformed", () => {
  for (const clientKey of ["", "../admin", "a b", "<script>", null]) {
    assert.equal(probeOfflinePortfolioSite({ ...base, clientKey, snapshots }).status, "invalid_client");
  }
});

test("rejects non-HTTPS, localhost, private IP and foreign seed", () => {
  for (const seedUrl of [
    "http://exemplo.com.br", "https://localhost", "https://127.0.0.1",
    "https://169.254.169.254/latest", "https://other.com.br",
    "https://user:pass@exemplo.com.br", "https://exemplo.com.br:4443",
    "https://exemplo.com.br/admin", "not a url",
  ]) {
    assert.equal(probeOfflinePortfolioSite({ ...base, seedUrl, snapshots }).status, "invalid_seed", seedUrl);
  }
});

test("rejects invalid host allowlists and invalid dates", () => {
  for (const allowedHosts of [[], ["127.0.0.1"], ["localhost"], ["x.internal"], ["foo.com/path"]]) {
    assert.equal(probeOfflinePortfolioSite({ ...base, allowedHosts, snapshots }).status, "invalid_allowlist");
  }
  assert.equal(probeOfflinePortfolioSite({ ...base, retrievedAt: "invalid", snapshots }).status, "invalid_date");
});

test("crawls supplied snapshots only; preserves source URLs, provenance and hash", () => {
  const result = probeOfflinePortfolioSite({ ...base, snapshots });
  assert.equal(result.status, "offline_only");
  assert.equal(result.pages.length, 3);
  assert.equal(result.pages[0].sourceUrl, SEED);
  assert.equal(result.pages[0].verification, "UNVERIFIED");
  assert.equal(result.pages[0].usageRights, "UNKNOWN");
  assert.equal(result.pages[0].clientKey, "atelier-a");
  assert.equal(result.pages[0].title, "Ateliê A");
  assert.equal(result.pages[0].description, "Produtos artesanais");
  assert.equal(result.pages[0].retrievedAt, DATE);
  assert.equal(result.pages[0].contentSha256, createHash("sha256").update(home).digest("hex"));
  assert.ok(!("facts" in result));
});

test("hard cap is three visited URLs, depth one and concurrency one", () => {
  const result = probeOfflinePortfolioSite({ ...base, snapshots });
  assert.equal(result.visited, 3);
  assert.deepEqual(result.pages.map((p) => p.sourceUrl), [
    SEED, "https://exemplo.com.br/servicos", "https://exemplo.com.br/sobre",
  ]);
  assert.deepEqual(result.pages.map(p => p.depth), [0, 1, 1]);
  assert.deepEqual(result.limits, { maxPages: 3, maxDepth: 1, concurrency: 1, networkRequests: 0 });
  assert.ok(!result.pages.some(p => p.sourceUrl.endsWith("/nivel-2")));
});

test("external, admin and login URLs are excluded", () => {
  const result = probeOfflinePortfolioSite({
    ...base, snapshots: { [SEED]:
      '<a href="https://evil.com/">Evil</a><a href="/admin">Admin</a>' +
      '<a href="/auth">Auth</a><a href="/wp-admin">WP</a><a href="/login">Login</a>' +
      '<a href="/servicos">Serviços</a>'
    },
  });
  assert.deepEqual(result.pages[0].discoveredLinks, ["https://exemplo.com.br/servicos"]);
  assert.equal(result.pages.length, 2);
  assert.equal(result.pages[1].status, "snapshot_missing_or_oversize");
});

test("query tokens and fragments are stripped, duplicate links deduplicated", () => {
  const result = probeOfflinePortfolioSite({ ...base, snapshots: {
    [SEED]: '<a href="/servicos?token=topsecret#ofertas">A</a>' +
      '<a href="/servicos#topo">B</a>' +
      '<a href="https://sub.exemplo.com.br/servicos">Subdomain</a>',
    "https://exemplo.com.br/servicos": "<title>OK</title>",
  }});
  assert.deepEqual(result.pages[0].discoveredLinks, ["https://exemplo.com.br/servicos"]);
  assert.equal(result.pages[1].status, "candidate_unverified");
});

test("missing and oversize snapshots fail closed without HTML output", () => {
  const missing = probeOfflinePortfolioSite({ ...base, snapshots: {} });
  assert.equal(missing.pages[0].status, "snapshot_missing_or_oversize");
  const oversized = probeOfflinePortfolioSite({ ...base, snapshots: { [SEED]: "x".repeat(100_001) } });
  assert.equal(oversized.pages[0].status, "snapshot_missing_or_oversize");
  assert.equal(missing.visited, 1);
});

test("tenant data stays scoped to each independent invocation", () => {
  const first = probeOfflinePortfolioSite({ ...base, snapshots: { [SEED]: "<title>Empresa A</title>" } });
  const second = probeOfflinePortfolioSite({
    ...base, clientKey: "empresa-b",
    snapshots: { [SEED]: "<title>Empresa B</title>" },
  });
  assert.equal(first.pages[0].clientKey, "atelier-a");
  assert.equal(first.pages[0].title, "Empresa A");
  assert.equal(second.pages[0].clientKey, "empresa-b");
  assert.equal(second.pages[0].title, "Empresa B");
  assert.notEqual(first.pages[0].contentSha256, second.pages[0].contentSha256);
});
