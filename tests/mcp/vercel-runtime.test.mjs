import assert from "node:assert/strict";
import { generateKeyPairSync, sign } from "node:crypto";
import { test } from "node:test";
import { auth, defineMcp, defineTool } from "@lovable.dev/mcp-js";
import {
  createTanStackMcpHandler,
  createTanStackOAuthProtectedResourceMetadataHandler,
} from "@lovable.dev/mcp-js/stacks/tanstack";

const origin = "https://0web-ci.example.test";
const issuer = "https://issuer.example.test/auth/v1";
let invoked = 0;
let observedBearer;
const definition = defineMcp({
  name: "0web-ci-synthetic",
  title: "0WEB CI synthetic fixture",
  version: "1.0.0",
  auth: auth.oauth.issuer({
    issuer,
    acceptedAudiences: "authenticated",
    requireOAuthClientClaim: true,
  }),
  tools: [defineTool({
    name: "read_fixture",
    title: "Synthetic read-only fixture",
    description: "No real data or writes.",
    handler: async (_args, ctx) => {
      invoked++;
      observedBearer = ctx.getToken();
      return { content: [{ type: "text", text: "synthetic" }] };
    },
  })],
});
const options = { resourcePath: "/mcp", metadataPath: "/.well-known/oauth-protected-resource" };
const metadata = createTanStackOAuthProtectedResourceMetadataHandler(definition, options);
const transport = createTanStackMcpHandler(definition, options);

test("real SDK serves protected-resource metadata on Node", async () => {
  const response = await metadata({ request: new Request(origin + options.metadataPath) });
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.resource, origin + options.resourcePath);
  assert.deepEqual(data.authorization_servers, [issuer]);
  assert.deepEqual(data.bearer_methods_supported, ["header"]);
});
test("real SDK rejects MCP tool call without bearer token", async () => {
  const response = await transport({ request: new Request(origin + options.resourcePath, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "read_fixture", arguments: {} } }),
  }) });
  assert.equal(response.status, 401);
  assert.match(response.headers.get("www-authenticate") ?? "", /Bearer/i);
  assert.equal(invoked, 0);
});

test("real SDK validates signed OAuth JWTs and executes a read-only synthetic tool", async () => {
  // Only the synthetic issuer is simulated. The MCP transport, signature
  // verification, audience checks, OAuth client claim and handler are real.
  const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const jwk = { ...publicKey.export({ format: "jwk" }), kid: "ci-key", alg: "RS256", use: "sig" };
  const jwksUri = issuer + "/.well-known/jwks.json";
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url);
    assert.equal(url.origin, new URL(issuer).origin, "No network outside isolated issuer");
    if (url.href === jwksUri) return Response.json({ keys: [jwk] });
    assert.match(url.pathname, /\.well-known\/.*(?:oauth-authorization-server|openid-configuration)/);
    return Response.json({ issuer, jwks_uri: jwksUri });
  };
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const jwt = (claims = {}) => {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: issuer, sub: "ci-user", aud: "authenticated",
      client_id: "ci-agent", iat: now, exp: now + 300, ...claims,
    };
    const message = encode({ alg: "RS256", kid: "ci-key", typ: "at+jwt" }) + "." + encode(payload);
    return message + "." + sign("RSA-SHA256", Buffer.from(message), privateKey).toString("base64url");
  };
  const request = (token, body, protocol = "2025-11-25", session) => transport({
    request: new Request(origin + options.resourcePath, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
        authorization: "Bearer " + token,
        "mcp-protocol-version": protocol,
        ...(session ? { "mcp-session-id": session } : {}),
      },
      body: JSON.stringify(body),
    }),
  });
  const rpc = async (response) => {
    assert.equal(response.status, 200);
    const raw = await response.text();
    if (response.headers.get("content-type")?.includes("text/event-stream")) {
      const data = raw.split(/\r?\n/).filter(line => line.startsWith("data:"))
        .map(line => JSON.parse(line.slice(5).trim()));
      return data.find(message => message.id !== undefined);
    }
    return JSON.parse(raw);
  };
  const call = { jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "read_fixture", arguments: {} } };
  try {
    const before = invoked;
    for (const invalid of [jwt({ aud: "wrong-audience" }), jwt({ client_id: undefined }), jwt({ exp: 1 })]) {
      assert.equal((await request(invalid, call)).status, 401);
    }
    assert.equal(invoked, before);
    const token = jwt();
    const initialized = await request(token, { jsonrpc: "2.0", id: 1, method: "initialize",
      params: { protocolVersion: "2025-11-25", capabilities: {}, clientInfo: { name: "ci-agent", version: "1.0.0" } } });
    const session = initialized.headers.get("mcp-session-id");
    const init = await rpc(initialized);
    assert.equal(init.id, 1);
    assert.ok(init.result?.protocolVersion, "MCP initialization must succeed");
    const protocol = init.result.protocolVersion;
    const notification = await request(token, { jsonrpc: "2.0", method: "notifications/initialized" }, protocol, session);
    assert.ok([200, 202, 204].includes(notification.status));
    const listed = await rpc(await request(token, { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} }, protocol, session));
    assert.ok(listed.result?.tools?.some(tool => tool.name === "read_fixture"));
    const result = await rpc(await request(token, call, protocol, session));
    assert.equal(result.id, 3);
    assert.equal(result.result?.isError ?? false, false);
    assert.ok(result.result?.content?.some(item => item.type === "text" && item.text === "synthetic"));
    assert.equal(invoked, before + 1);
    assert.equal(observedBearer === token, true, "Caller-scoped token preserved");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
