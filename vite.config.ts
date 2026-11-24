// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { loadEnv } from "vite";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { routeWatcherPlugin } from "./plugins/vite-plugin-route-watcher";
import { vercelMcpIsolationPlugin } from "./plugins/vite-plugin-vercel-mcp";

// Load non-VITE_ env vars into process.env for server-side code only
// (never injected into the client bundle).
const serverEnv = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");
Object.assign(process.env, serverEnv);

// A static MCP import loads cloudflare:workers even when the plugin is disabled.
// The development plugin must not even be imported in a Vercel build.
const devMcpPlugins = process.env.VERCEL
  ? []
  : [(await import("@lovable.dev/mcp-js/stacks/tanstack/vite")).mcpPlugin()];

export default defineConfig({
  tanstackStart: {
    // Validate the SSR payload before TanStack's hydrateStart can run.
    client: { entry: "client" },
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    // Production on Vercel must not bundle Lovable's dev MCP runtime:
    // @lovable.dev/mcp-js imports cloudflare:workers (unresolvable by Vercel Rollup).
    // Keep the plugin available outside Vercel for existing development tooling.
    plugins: [
      routeWatcherPlugin(),
      ...(process.env.VERCEL ? [vercelMcpIsolationPlugin()] : []),
      ...devMcpPlugins,
    ],
    build: {
      rollupOptions: {
        // framer-motion/motion marcam módulos com "use client"; o Rollup avisa
        // que a diretiva foi ignorada ao concatenar chunks. A diretiva é
        // legítima e preservada pelo runtime do React — silenciamos apenas
        // esse aviso para não poluir (nem quebrar) o build de produção.
        onwarn(warning, defaultHandler) {
          if (
            warning.code === "MODULE_LEVEL_DIRECTIVE" &&
            /framer-motion|node_modules\/motion/.test(warning.message)
          ) {
            return;
          }
          defaultHandler(warning);
        },
      },
    },
  },
});
