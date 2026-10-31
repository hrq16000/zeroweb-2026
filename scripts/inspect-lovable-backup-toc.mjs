#!/usr/bin/env node
/**
 * Inspeção OFFLINE e somente leitura do índice de um export Lovable Cloud.
 * Nunca conecta ao banco; nunca executa SQL, pg_restore --restore ou pg_dump.
 * O stdout contém apenas contagens e nomes de tabelas exigidas pelo contrato.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export const REQUIRED_PUBLIC_TABLES = Object.freeze([
  "projects", "support_tickets", "notifications", "profiles", "user_roles",
  "lead_submissions", "services", "dynamic_forms", "dynamic_form_leads",
]);

const TYPES = [
  "TABLE DATA", "SEQUENCE SET", "MATERIALIZED VIEW DATA",
  "MATERIALIZED VIEW", "FOREIGN TABLE", "TABLE", "FUNCTION", "POLICY",
  "TRIGGER", "SCHEMA", "SEQUENCE", "EXTENSION", "ACL", "DEFAULT ACL",
  "VIEW", "INDEX", "CONSTRAINT", "FK CONSTRAINT", "COMMENT",
].sort((a, b) => b.length - a.length);

export function inspectToc(content) {
  if (typeof content !== "string") throw new TypeError("TOC precisa ser texto");
  const countByType = {};
  const tables = new Set();
  const dataTables = new Set();
  const schemas = new Set();
  let objects = 0;
  for (const line of content.split(/\r?\n/)) {
    // pg_restore --list: ID; catalogOid objectOid TYPE schema name owner
    const m = line.match(/^\s*\d+;\s+\d+\s+\d+\s+(.+)$/);
    if (!m) continue;
    const rest = m[1];
    const type = TYPES.find((t) => rest.startsWith(t + " "));
    if (!type) continue;
    objects++;
    countByType[type] = (countByType[type] || 0) + 1;
    if (type === "SCHEMA") {
      const v = rest.slice(type.length).trim().split(/\s+/);
      // Formato comum: "SCHEMA - public postgres"; "-" é namespace do objeto, não o nome.
      const name = v[0] === "-" ? v[1] : v[0];
      if (name && name !== "-") schemas.add(name);
    }
    if (type === "TABLE" || type === "TABLE DATA") {
      const payload = rest.slice(type.length).trim();
      const item = payload.match(/^([^\s]+)\s+([^\s]+)/);
      if (!item) continue;
      const key = item[1] + "." + item[2].replace(/^"|"$/g, "");
      if (type === "TABLE") tables.add(key);
      else dataTables.add(key);
      schemas.add(item[1]);
    }
  }
  if (objects === 0 || tables.size === 0) {
    return { ok: false, reason: "Arquivo não contém índice pg_restore utilizável", objects };
  }
  const missingPublicTables = REQUIRED_PUBLIC_TABLES.filter(x => !tables.has("public." + x));
  const missingDataEntries = REQUIRED_PUBLIC_TABLES.filter(x => !dataTables.has("public." + x));
  const requiredManaged = ["auth.users", "storage.buckets", "storage.objects"];
  const missingManagedTables = requiredManaged.filter(x => !tables.has(x));
  const missingManagedDataEntries = requiredManaged.filter(x => !dataTables.has(x));
  const ok = missingPublicTables.length === 0 && missingDataEntries.length === 0 &&
    missingManagedTables.length === 0 && missingManagedDataEntries.length === 0;
  return {
    ok, objects,
    schemas: [...schemas].sort(),
    tableCount: tables.size,
    tableDataEntries: dataTables.size,
    countByType,
    requiredPublicTables: REQUIRED_PUBLIC_TABLES.length,
    missingPublicTables,
    missingDataEntries,
    missingManagedTables,
    missingManagedDataEntries,
    note: "O índice não prova linhas, senhas, conteúdo de Storage, integridade do backup nem segurança da restauração.",
  };
}

function textFromArgs(args) {
  if (args.length !== 2 || !["--toc-file", "--archive"].includes(args[0])) {
    throw new Error("Uso: node scripts/inspect-lovable-backup-toc.mjs --archive /caminho/privado/export.backup (ou --toc-file /caminho/privado/listagem.toc)");
  }
  const file = resolve(args[1]);
  if (!existsSync(file)) throw new Error("Arquivo não encontrado; nenhum dado consultado");
  if (args[0] === "--toc-file") return readFileSync(file, "utf8");
  // --list SOMENTE: jamais passar --clean, --create, --dbname ou comandos SQL.
  const res = spawnSync("pg_restore", ["--list", file], {
    encoding: "utf8", maxBuffer: 32 * 1024 * 1024, timeout: 60000,
    shell: false,
  });
  if (res.error || res.status !== 0) throw new Error("pg_restore --list falhou; confira formato, ferramenta e zstd. Nada foi restaurado");
  return res.stdout;
}

const invoked = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (invoked) {
  try {
    const report = inspectToc(textFromArgs(process.argv.slice(2)));
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
    if (!report.ok) process.exitCode = 1;
  } catch (e) {
    process.stderr.write("[backup-preflight] " + e.message + "\n");
    process.exitCode = 2;
  }
}
