import assert from "node:assert/strict";
import { test } from "node:test";
import { auth, defineMcp, defineTool } from "@lovable.dev/mcp-js";
import {
  createTanStackMcpHandler,
  createTanStackOAuthProtectedResourceMetadataHandler,
} from "@lovable.dev/mcp-js/stacks/tanstack";

const origin = "https://0web-ci.example.test";
const issuer = "https://issuer.example.test/auth/v1";
let invoked = 0;
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
    handler: async () => {
      invoked++;
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
