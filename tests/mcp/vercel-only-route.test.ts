import { expect, test } from "bun:test";
import { vercelOnlyMcpRouteReplacement } from "../../plugins/vite-plugin-vercel-mcp-stub";

test("Vercel substitutes only the Cloudflare-only /mcp server route", () => {
  const route = vercelOnlyMcpRouteReplacement("/vercel/path0/src/routes/mcp.ts");
  expect(route).toContain('createFileRoute("/mcp")');
  expect(route).toContain("status: 404");
  expect(route).not.toContain("@lovable.dev/mcp-js");
  expect(vercelOnlyMcpRouteReplacement("/vercel/path0/src/routes/mcp.ts?split=1")).toBe(route);
  expect(vercelOnlyMcpRouteReplacement("/vercel/path0/src/routes/portfolio.$slug.tsx")).toBeNull();
  expect(vercelOnlyMcpRouteReplacement("/vercel/path0/src/lib/mcp/index.ts")).toBeNull();
});
