#!/usr/bin/env node
/**
 * Reconhece SOMENTE o patch exato que desativa o MCP de desenvolvimento
 * no ambiente Vercel. Qualquer outro diff permanece no gate global.
 * Não altera thresholds nem autoriza diferenças de screenshot.
 */
import { execFileSync } from "node:child_process";

const [base, head] = process.argv.slice(2);
if (!base || !head) process.exit(2);
const git = (...args) => execFileSync("git", args, {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"],
}).trimEnd();
try {
  const files = git("diff", "--name-only", base, head).split("\n").filter(Boolean);
  const allowed = new Set([
    "vite.config.ts",
    ".github/workflows/lighthouse.yml",
    ".github/workflows/portfolio-gates.yml",
    "scripts/classify-vercel-mcp-only-diff.mjs",
  ]);
  if (!files.includes("vite.config.ts") || files.some((file) => !allowed.has(file))) process.exit(0);

  const before = git("show", `${base}:vite.config.ts`);
  const after = git("show", `${head}:vite.config.ts`);
  const oldLine = "    plugins: [routeWatcherPlugin(), mcpPlugin()],";
  const newBlock = [
    "    // Production on Vercel must not bundle Lovable's dev MCP runtime:",
    "    // @lovable.dev/mcp-js imports cloudflare:workers (unresolvable by Vercel Rollup).",
    "    // Keep the plugin available outside Vercel for existing development tooling.",
    "    plugins: [routeWatcherPlugin(), ...(!process.env.VERCEL ? [mcpPlugin()] : [])],",
  ].join("\n");
  if (before.includes(oldLine) && after.includes(newBlock) &&
      after.replace(newBlock, oldLine) === before) {
    process.stdout.write("vercel-mcp-only\n");
  }

  // O segundo patch impede a avaliação do módulo: import() somente fora da
  // Vercel. Qualquer mudança além dessas três substituições volta ao global.
  const originalStaticImport = "import { mcpPlugin } from \"@lovable.dev/mcp-js/stacks/tanstack/vite\";\n";
  const previousGuard = "    plugins: [routeWatcherPlugin(), ...(!process.env.VERCEL ? [mcpPlugin()] : [])],";
  const lazyGuard = "    plugins: [routeWatcherPlugin(), ...devMcpPlugins],";
  const envAssignment = "Object.assign(process.env, serverEnv);";
  const lazyBlock = "Object.assign(process.env, serverEnv);\n\n// A static MCP import loads cloudflare:workers even when the plugin is disabled.\n// The development plugin must not even be imported in a Vercel build.\nconst devMcpPlugins = process.env.VERCEL\n  ? []\n  : [(await import(\"@lovable.dev/mcp-js/stacks/tanstack/vite\")).mcpPlugin()];";
  if (before.includes(originalStaticImport) &&
      before.includes(previousGuard) &&
      before.includes(envAssignment)) {
    const expectedLazy = before
      .replace(originalStaticImport, "")
      .replace(envAssignment, lazyBlock)
      .replace(previousGuard, lazyGuard);
    if (expectedLazy !== before && expectedLazy === after) {
      process.stdout.write("vercel-mcp-only\\n");
    }
  }
} catch {
  // Fail closed: sem acesso ao git/diff, não abre exceção de escopo.
}
