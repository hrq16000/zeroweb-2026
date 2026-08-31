#!/usr/bin/env node
/**
 * Sobe o artefato REAL de produção (worker Cloudflare gerado em dist/server)
 * com Wrangler local — nunca `vite dev`.
 *
 * Por que existe: `wrangler dev` não herda automaticamente o ambiente do
 * processo. Sem isso, o worker roda sem SUPABASE_URL/PUBLISHABLE_KEY e as
 * rotas SSR alimentadas pelo catálogo devolvem 404, quebrando os gates de
 * hidratação no CI. Aqui as variáveis públicas necessárias são repassadas
 * explicitamente via `--var`.
 *
 * Leitura pública NÃO usa service role (RLS + chave publicável). A chave de
 * service role só é repassada quando explicitamente presente no ambiente —
 * necessária apenas para os gates que exercitam escrita (funis/leads).
 */
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const CONFIG = resolve("dist/server/wrangler.json");
if (!existsSync(CONFIG)) {
  console.error("[preview:prod] dist/server/wrangler.json ausente — rode `bun run build` antes.");
  process.exit(1);
}

/** Lê .env local (dev) sem sobrescrever variáveis já definidas (CI). */
function loadDotEnv() {
  if (!existsSync(".env")) return;
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (!m) continue;
    const [, key, rawValue] = m;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}
loadDotEnv();

const PASSTHROUGH = {
  SUPABASE_URL: process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY:
    process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_PROJECT_ID: process.env.SUPABASE_PROJECT_ID ?? process.env.VITE_SUPABASE_PROJECT_ID,
};

// Opcional: só existe quando o ambiente realmente fornece a credencial.
if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  PASSTHROUGH.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
}

const vars = [];
for (const [key, value] of Object.entries(PASSTHROUGH)) {
  if (!value) {
    console.warn(`[preview:prod] variável ausente: ${key} (rotas dependentes do catálogo podem cair no fallback de arquivo)`);
    continue;
  }
  vars.push("--var", `${key}:${value}`);
}

const port = process.env.PREVIEW_PORT ?? "8080";
const args = ["dev", "--config", CONFIG, "--ip", "127.0.0.1", "--port", port, ...vars];

const child = spawn("wrangler", args, {
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
});
child.on("exit", (code) => process.exit(code ?? 1));
