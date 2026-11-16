#!/usr/bin/env node
/**
 * Compara manifestos de IDs: nenhuma conexão de rede, banco ou segredo.
 * Não comprova igualdade de linhas completas, Storage, Auth, RLS ou cron.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const REQUIRED = Object.freeze([
  "auth.users", "public.dynamic_form_leads", "public.lead_delivery_ledger",
  "public.lead_submissions", "public.orders", "public.projects",
  "public.services", "public.visitor_funnel_sessions",
  "public.wa_dispatch_messages", "storage.buckets", "storage.objects",
]);
const SHA256 = /^[a-f0-9]{64}$/i;
const NONNEGATIVE_INT = /^(0|[1-9][0-9]*)$/;

export function parseManifest(source) {
  const rows = Array.isArray(source) ? source : source?.tables;
  if (!Array.isArray(rows)) throw new Error("Manifesto sem array de tabelas");
  const map = new Map();
  for (const entry of rows) {
    const table = entry?.table ?? entry?.table_key;
    if (typeof table !== "string" || !/^(auth|public|storage)\.[a-z][a-z0-9_]*$/.test(table)) {
      throw new Error("Nome de tabela inválido");
    }
    if (map.has(table)) throw new Error("Tabela duplicada: " + table);
    const raw = String(entry.count ?? entry.row_count);
    if (!NONNEGATIVE_INT.test(raw) || !Number.isSafeInteger(Number(raw))) {
      throw new Error("Contagem inválida: " + table);
    }
    const hash = entry.sha256_of_sorted_ids_only ?? entry.id_set_sha256;
    if (typeof hash !== "string" || !SHA256.test(hash)) {
      throw new Error("SHA-256 inválido: " + table);
    }
    map.set(table, { count: Number(raw), hash: hash.toLowerCase() });
  }
  for (const table of REQUIRED) if (!map.has(table)) {
    throw new Error("Tabela obrigatória ausente: " + table);
  }
  return map;
}

export function compareManifests(source, restored) {
  const left = parseManifest(source), right = parseManifest(restored);
  const rows = REQUIRED.map(table => {
    const from = left.get(table), to = right.get(table);
    const countMatches = from.count === to.count;
    const idsMatch = from.hash === to.hash;
    return {
      table, sourceCount: from.count, restoredCount: to.count,
      countMatches, idsMatch, status: countMatches && idsMatch ? "MATCH" : "DIFF",
    };
  });
  const matchingTables = rows.filter(x => x.status === "MATCH").length;
  return {
    ok: matchingTables === REQUIRED.length,
    checkedTables: REQUIRED.length,
    matchingTables,
    rows,
    caveat: "Igualdade dos IDs não prova igualdade de conteúdo, senhas, Storage, políticas, cron ou snapshot simultâneo. Conciliar leads posteriores ao export.",
  };
}

const invoked = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (invoked) {
  try {
    if (process.argv.length !== 6 || process.argv[2] !== "--source" || process.argv[4] !== "--restored") {
      throw new Error("Uso: node scripts/compare-migration-id-manifests.mjs --source origem.json --restored destino.json");
    }
    const source = JSON.parse(readFileSync(resolve(process.argv[3]), "utf8"));
    const restored = JSON.parse(readFileSync(resolve(process.argv[5]), "utf8"));
    const result = compareManifests(source, restored);
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
    process.exitCode = result.ok ? 0 : 1;
  } catch (e) {
    process.stderr.write("[migration-id-parity] " + e.message + "\n");
    process.exitCode = 2;
  }
}
