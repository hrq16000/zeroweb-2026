// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import path from "node:path";
import { loadEnv } from "vite";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { routeWatcherPlugin } from "./plugins/vite-plugin-route-watcher";

// Load non-VITE_ env vars into process.env for server-side code only
// (never injected into the client bundle).
const serverEnv = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");
Object.assign(process.env, serverEnv);

export default defineConfig({
  tanstackStart: {
    // Validate the SSR payload before TanStack's hydrateStart can run.
    client: { entry: "client" },
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [routeWatcherPlugin()],
    resolve: {
      alias: {
        "entities/lib/decode.js": path.resolve(
          import.meta.dirname,
          "node_modules/entities/decode.js",
        ),
        "entities/lib/encode.js": path.resolve(
          import.meta.dirname,
          "node_modules/entities/escape.js",
        ),
      },
    },
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
