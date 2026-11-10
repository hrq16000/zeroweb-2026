import test from 'node:test';
import assert from 'node:assert/strict';
import { createFirecrawlScrapeAdapter } from '../../scripts/firecrawl-scrape-adapter.mjs';

const enabledEnv = {
  FIRECRAWL_ENABLED: 'true',
  FIRECRAWL_API_KEY: 'test-key-only',
  FIRECRAWL_ALLOWED_HOSTS: 'empresa.example.com',
  FIRECRAWL_MAX_CREDITS: '2',
};
const URL = 'https://empresa.example.com/servicos';
const okResponse = () => new Response(JSON.stringify({
  success: true, data: { markdown: '# Serviços', metadata: { title: 'Serviços' } },
}), { status: 200, headers: { 'Content-Type': 'application/json' } });

test('disabled by default, without external network request', async () => {
  const adapter = createFirecrawlScrapeAdapter({
    env: {}, fetchImpl: () => { throw new Error('network should not be called'); },
  });
  assert.deepEqual(await adapter.scrape(URL), { status: 'disabled' });
  assert.equal(adapter.getBudget().reservedCredits, 0);
});

test('missing key and host allowlist fail closed', async () => {
  const adapter = createFirecrawlScrapeAdapter({ env: { FIRECRAWL_ENABLED: 'true' }, fetchImpl: okResponse });
  assert.equal((await adapter.scrape(URL)).status, 'not_configured');
  assert.equal(adapter.getBudget().reservedCredits, 0);
});

test('invalid cost limit blocks all provider calls', async () => {
  for (const limit of ['0', '11', '100000', 'garbage', '2.5']) {
    const adapter = createFirecrawlScrapeAdapter({
      env: { ...enabledEnv, FIRECRAWL_MAX_CREDITS: limit },
      fetchImpl: () => { throw new Error('network should not be called'); },
    });
    assert.equal((await adapter.scrape(URL)).status, 'invalid_configuration');
    assert.equal(adapter.getBudget().reservedCredits, 0);
  }
});

test('blocks non-HTTPS, private, authenticated, IP and disallowed URLs', async () => {
  const adapter = createFirecrawlScrapeAdapter({
    env: enabledEnv, fetchImpl: () => { throw new Error('network should not be called'); },
  });
  for (const unsafe of [
    'http://empresa.example.com/', 'https://127.0.0.1/', 'https://localhost/',
    'https://x.internal/', 'https://[::1]/', 'https://user:pass@empresa.example.com/',
    'https://outro.example.com/', 'https://sub.empresa.example.com/', 'not a url',
  ]) {
    const result = await adapter.scrape(unsafe);
    assert.ok(['invalid_url', 'host_not_allowed'].includes(result.status), unsafe + ': ' + result.status);
  }
  assert.equal(adapter.getBudget().reservedCredits, 0);
});

test('successful scrape is fixed markdown-only and remains UNVERIFIED', async () => {
  let requests = 0;
  const adapter = createFirecrawlScrapeAdapter({
    env: enabledEnv,
    fetchImpl: async (endpoint, options) => {
      requests++;
      assert.equal(endpoint, 'https://api.firecrawl.dev/v2/scrape');
      assert.equal(options.method, 'POST');
      assert.equal(options.headers.Authorization, 'Bearer test-key-only');
      assert.deepEqual(JSON.parse(options.body), {
        url: URL, formats: ['markdown'], onlyMainContent: true,
      });
      assert.ok(options.signal);
      return okResponse();
    },
  });
  const result = await adapter.scrape(URL);
  assert.equal(requests, 1);
  assert.equal(result.status, 'ok');
  assert.equal(result.evidence.verification, 'UNVERIFIED');
  assert.equal(result.evidence.sourceUrl, URL);
  assert.equal(result.evidence.markdown, '# Serviços');
  assert.equal(result.evidence.title, 'Serviços');
  assert.deepEqual(adapter.getBudget(), { maxCredits: 2, reservedCredits: 1 });
});

test('429 reserves a credit and never automatically retries', async () => {
  let calls = 0;
  const adapter = createFirecrawlScrapeAdapter({
    env: { ...enabledEnv, FIRECRAWL_MAX_CREDITS: '1' },
    fetchImpl: async () => { calls++; return new Response('too many requests', { status: 429 }); },
  });
  assert.deepEqual(await adapter.scrape(URL), { status: 'provider_error', httpStatus: 429 });
  assert.equal((await adapter.scrape(URL)).status, 'budget_exhausted');
  assert.equal(calls, 1);
});

test('network errors are sanitized and consume reservation', async () => {
  const adapter = createFirecrawlScrapeAdapter({
    env: { ...enabledEnv, FIRECRAWL_MAX_CREDITS: '1' },
    fetchImpl: async () => { throw new Error('sensitive secret from provider'); },
  });
  assert.deepEqual(await adapter.scrape(URL), { status: 'provider_unavailable' });
  assert.equal(adapter.getBudget().reservedCredits, 1);
});

test('malformed responses fail closed and do not create facts', async () => {
  const adapter = createFirecrawlScrapeAdapter({
    env: enabledEnv,
    fetchImpl: async () => new Response(JSON.stringify({ success: true, data: { html: '<html />' } }), { status: 200 }),
  });
  assert.deepEqual(await adapter.scrape(URL), { status: 'invalid_response' });
});

test('concurrent requests cannot exceed the per-instance budget', async () => {
  const release = [];
  let calls = 0;
  const adapter = createFirecrawlScrapeAdapter({
    env: enabledEnv,
    fetchImpl: () => new Promise((resolve) => { calls++; release.push(() => resolve(okResponse())); }),
  });
  const first = adapter.scrape(URL);
  const second = adapter.scrape(URL);
  assert.equal((await adapter.scrape(URL)).status, 'budget_exhausted');
  assert.equal(calls, 2);
  assert.equal(adapter.getBudget().reservedCredits, 2);
  release.forEach((done) => done());
  assert.equal((await first).status, 'ok');
  assert.equal((await second).status, 'ok');
});

test('returned markdown and titles are bounded', async () => {
  const adapter = createFirecrawlScrapeAdapter({
    env: enabledEnv,
    fetchImpl: async () => new Response(JSON.stringify({
      success: true, data: { markdown: 'x'.repeat(60_000), metadata: { title: 't'.repeat(250) } },
    }), { status: 200 }),
  });
  const result = await adapter.scrape(URL);
  assert.equal(result.status, 'ok');
  assert.equal(result.evidence.markdown.length, 40_000);
  assert.equal(result.evidence.title.length, 200);
});
