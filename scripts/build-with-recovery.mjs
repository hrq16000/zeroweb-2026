#!/usr/bin/env node
/**
 * Build com auto-recovery.
 *
 * O erro `Could not load .../node_modules/entities/lib/decode.js` acontece
 * quando o pacote `entities` é resolvido numa árvore de dependências
 * incompatível (o renderer usa o subpath lib/ fornecido pela v4). Quando esse erro
 * específico aparece, limpamos node_modules + cache do Vite, reinstalamos com
 * o lockfile e tentamos o build UMA vez.
 *
 * Uso: node scripts/build-with-recovery.mjs [--mode development]
 */
import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";

const dev = process.argv.includes("--mode") && process.argv.includes("development");
const buildScript = dev ? "build:dev" : "build";
const ENTITIES_ERROR = /(?:node_modules\/entities\/lib\/|Package subpath ['"]\.\/lib\/)(decode|encode)\.js/;

function run(cmd, args) {
  console.log(`\n$ ${cmd} ${args.join(" ")}`);
  return spawnSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function build() {
  const r = run("bun", ["run", buildScript]);
  process.stdout.write(r.stdout ?? "");
  process.stderr.write(r.stderr ?? "");
  return r;
}

let result = build();
if (result.status !== 0 && ENTITIES_ERROR.test(`${result.stdout}${result.stderr}`)) {
  console.error("\n[auto-recovery] falha por `entities/lib/*` — limpando dependências e reinstalando…");
  for (const dir of ["node_modules/.vite", "node_modules/entities", "node_modules", ".nitro", "dist"]) {
    try {
      rmSync(dir, { recursive: true, force: true });
    } catch {
      /* noop */
    }
  }
  const install = run("bun", ["install", "--frozen-lockfile"]);
  process.stdout.write(install.stdout ?? "");
  process.stderr.write(install.stderr ?? "");
  if (install.status !== 0) {
    console.error("[auto-recovery] reinstalação falhou.");
    process.exit(install.status ?? 1);
  }
  console.log("[auto-recovery] dependências reinstaladas — repetindo o build.");
  result = build();
}

process.exit(result.status ?? 1);
