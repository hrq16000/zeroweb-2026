import type { Plugin } from "vite";

// These two generated server routes import a Cloudflare-only SDK even when its
// development plugin is disabled. Isolate only their known imports in Vercel.
// The generated routes and OAuth implementation remain intact elsewhere.
const transportId = "\0virtual:0web-vercel-mcp-transport";
const runtimeId = "\0virtual:0web-vercel-mcp-runtime";

export function vercelMcpIsolationPlugin(): Plugin {
  return {
    name: "0web-vercel-mcp-isolation",
    enforce: "pre",
    resolveId(source, importer) {
      const path = importer?.split("?")[0].replace(/\\/g, "/");
      const transportRoute = path?.endsWith("/src/routes/mcp.ts");
      const metadataRoute = path?.endsWith("/src/routes/[.well-known]/oauth-protected-resource.ts");
      if (!transportRoute && !metadataRoute) return null;

      if (source === "@lovable.dev/mcp-js/stacks/tanstack") return transportId;
      if (
        (transportRoute && source === "../lib/mcp/index") ||
        (metadataRoute && source === "../../lib/mcp/index")
      ) return runtimeId;

      return null;
    },
    load(id) {
      if (id === transportId) {
        // Fail closed: do not publish OAuth metadata, accept a token, query
        // Supabase, or masquerade as a working MCP service on Vercel.
        return `
          const unavailable = () => () => new Response(
            JSON.stringify({ error: "mcp_unavailable_on_this_host" }),
            { status: 503, headers: { "content-type": "application/json", "cache-control": "no-store" } }
          );
          export const createTanStackMcpHandler = unavailable;
          export const createTanStackOAuthProtectedResourceMetadataHandler = unavailable;
        `;
      }
      if (id === runtimeId) {
        return 'throw new Error("MCP runtime unavailable on Vercel"); export default null;';
      }
      return null;
    },
  };
}
