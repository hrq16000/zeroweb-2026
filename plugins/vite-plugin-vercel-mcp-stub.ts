import type { Plugin } from "vite";

/**
 * Vercel/Node cannot load the Cloudflare-only `@lovable.dev/mcp-js` runtime.
 * The source route remains intact for Lovable/Cloudflare; only Vercel's
 * compiled route is replaced with a safe 404. No funnel or public page changes.
 */
export function vercelOnlyMcpRouteReplacement(id: string): string | null {
  const cleanId = id.split("?")[0].replace(/\\/g, "/");
  if (!cleanId.endsWith("/src/routes/mcp.ts")) return null;

  return `import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/mcp")({
  server: { handlers: { ANY: () => new Response("Not Found", { status: 404 }) } },
});
`;
}

export function vercelMcpRouteStubPlugin(): Plugin {
  return {
    name: "0web-vercel-only-mcp-route-stub",
    enforce: "pre",
    transform(_code, id) {
      const code = vercelOnlyMcpRouteReplacement(id);
      return code === null ? null : { code, map: null };
    },
  };
}
