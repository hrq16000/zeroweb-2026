#!/usr/bin/env node
/**
 * Sobe o artefato REAL de produção (worker Cloudflare gerado em .output/server;
 * mantém compatibilidade com o layout legado dist/server).
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
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const CONFIG_CANDIDATES = [
  resolve(".output/server/wrangler.json"),
  resolve("dist/server/wrangler.json"),
];
const CONFIG = CONFIG_CANDIDATES.find((candidate) => existsSync(candidate));
if (!CONFIG) {
  console.error(
    "[preview:prod] wrangler.json ausente em .output/server e dist/server — rode `bun run build` antes.",
  );
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

/**
 * O build gera `compatibility_date` com a DATA DO BUILD. Quando o binário do
 * workerd instalado é mais antigo que essa data, o runtime se recusa a subir
 * com "This Worker requires compatibility date X, but the newest date
 * supported by this server binary is Y" — e o job de CI falha em "Subir
 * artefato de produção", sem nenhuma relação com o código da aplicação.
 *
 * Solução determinística: subir com uma configuração derivada e, se o runtime
 * reportar o teto suportado, reescrever a data para esse teto e subir de novo.
 * O artefato publicado permanece intacto.
 */
const PREVIEW_CONFIG = resolve(dirname(CONFIG), "wrangler.preview.json");

function writePreviewConfig(compatibilityDate) {
  const base = JSON.parse(readFileSync(CONFIG, "utf8"));
  if (compatibilityDate) base.compatibility_date = compatibilityDate;
  writeFileSync(PREVIEW_CONFIG, JSON.stringify(base, null, 2));
  return base.compatibility_date;
}

const UNSUPPORTED_DATE = /newest date supported by this server binary is "(\d{4}-\d{2}-\d{2})"/;

function start(compatibilityDate, { allowRetry }) {
  const used = writePreviewConfig(compatibilityDate);
  console.log(`[preview:prod] compatibility_date=${used}`);
  const args = ["dev", "--config", PREVIEW_CONFIG, "--ip", "127.0.0.1", "--port", port, ...vars];
  // `wrangler` só está no PATH quando o script roda por um gerenciador de
  // pacotes. Resolver o binário local mantém o comando utilizável por `node`
  // direto (CI, depuração) sem depender do PATH herdado.
  const localBin = resolve("node_modules/.bin/wrangler");
  // O runner já reportou crash interno do Wrangler 4.127.1. Em CI usamos uma
  // versão de runtime atual e fixa via bunx, sem alterar o lockfile da aplicação.
  // Localmente continua valendo a dependência versionada do projeto.
  const ciWranglerVersion = process.env.PREVIEW_WRANGLER_VERSION || "4.134.0";
  const useCiWrangler = Boolean(process.env.CI) && ciWranglerVersion !== "local";
  const bin = useCiWrangler ? "bunx" : (existsSync(localBin) ? localBin : "wrangler");
  const spawnArgs = useCiWrangler ? [`wrangler@${ciWranglerVersion}`, ...args] : args;
  if (useCiWrangler) console.log(`[preview:prod] CI Wrangler ${ciWranglerVersion}`);
  const child = spawn(bin, spawnArgs, {
    stdio: ["inherit", "inherit", "pipe"],
    env: process.env,
    shell: process.platform === "win32",
  });

  let supported = null;
  child.stderr.on("data", (chunk) => {
    const text = chunk.toString();
    process.stderr.write(text);
    const match = UNSUPPORTED_DATE.exec(text);
    if (match) supported = match[1];
  });

  child.on("exit", (code) => {
    if (code !== 0 && supported && allowRetry) {
      console.warn(
        `[preview:prod] workerd suporta no máximo ${supported}; reiniciando com essa data.`,
      );
      start(supported, { allowRetry: false });
      return;
    }
    process.exit(code ?? 1);
  });
}

start(null, { allowRetry: true });
