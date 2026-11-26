import { expect, test } from 'bun:test';

test('DOM preload preserves native fetch and response interoperability', async () => {
  const server = Bun.serve({
    hostname: '127.0.0.1', port: 0,
    fetch: () => new Response(JSON.stringify({ isolation: 'synthetic' }), {
      headers: new Headers({ 'Content-Type': 'application/json' }),
    }),
  });
  try {
    const response = await fetch(new Request(server.url));
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');
    expect(await response.json()).toEqual({ isolation: 'synthetic' });
  } finally { server.stop(true); }
});

test('DOM preload preserves native abort timeout for bounded integration requests', async () => {
  const server = Bun.serve({
    hostname: '127.0.0.1', port: 0,
    fetch: () => new Promise(() => {}),
  });
  try {
    const signal = AbortSignal.timeout(25);
    await expect(fetch(server.url, { signal })).rejects.toThrow();
    expect(signal.aborted).toBe(true);
  } finally { server.stop(true); }
});