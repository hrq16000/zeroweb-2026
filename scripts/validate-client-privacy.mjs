#!/usr/bin/env node
/**
 * Validador: garante que o bundle público do cliente (dist/client/assets)
 * não contém wa.me, e-mails corporativos ou telefones em números literais.
 *
 * Gera um relatório detalhado (origem do leak, tamanho do chunk, rota provável,
 * trecho de contexto) em seo-reports/client-privacy-report.json e falha o build
 * quando um chunk público volta a vazar contato não-allowlisted.
 *
 * Chunks admin (painel autenticado) são inspecionados mas apenas emitem
 * warning — o painel só carrega após login e as strings encontradas são
 * de suporte a pedidos (número do próprio cliente do pedido), não da 0Web.
 */
import { readdirSync, readFileSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { randomUUID } from "node:crypto";
import {
  CLIENT_ALLOWED_PHONE,
  isAdminChunk,
  isAllowedWaDigits,
  isClientShowcaseChunk,
  routeHintFromChunk,
} from "./contact-allowlist.mjs";

const ROOT = process.cwd();
const DIST = "dist/client/assets";
const REPORT_DIR = join(ROOT, "seo-reports");
const REPORT_FILE = join(REPORT_DIR, "client-privacy-report.json");
const correlationId = process.env["BUILD_CORRELATION_ID"] || randomUUID();

const WA = /wa\.me\/?(\d+)?/g;
// e-mails: exclui domínios de vendors/schemas/typedefs conhecidos
const EMAIL = /[A-Za-z0-9._+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const EMAIL_ALLOW = /^(?:.*@)(?:sentry|example|schema\.org|w3\.org|whatwg|graphql|googleapis|gstatic|facebook|npmjs|types|radix|tanstack|babel|react|supabase|ai-sdk|floating|lovable|vite|fontsource|hookform|lookout|stripe|internal\.|noreply\.)|^(?:seu|email|nome|contato)@(?:email|exemplo|dominio)\./i;
// telefones BR reais: precisam de FORMATAÇÃO (parênteses, +55 ou hifens
// entre grupos) para não colidir com constantes numéricas (INT_MAX etc).
const PHONE_PATTERNS = [
  /\+55[- ]?\(?\d{2}\)?[- ]?9?\d{4}[- ]?\d{4}/g, // +55 41 99745-2053
  /\(\d{2}\)\s?9?\d{4}-?\d{4}/g, // (41) 99745-2053
  /(?<!\d)\d{2}-9\d{4}-\d{4}(?!\d)/g, // 41-99745-2053
];
// placeholders comuns em form inputs — não são leak
const PHONE_ALLOW = /^\(?\d?\d?\)?\s?9?9999-?9999$|^\(11\)\s?90000-0000$|^\(41\)\s?9\d{4}-\d{4}$/;

let errors = 0;
let warns = 0;
let scanned = 0;
const findings = [];

function snippet(src, index) {
  return src
    .slice(Math.max(0, index - 60), index + 60)
    .replace(/\s+/g, " ")
    .trim();
}

function scan(file) {
  const name = file.split("/").pop();
  const admin = isAdminChunk(name);
  const src = readFileSync(file, "utf8");
  const bytes = statSync(file).size;
  scanned++;

  const showcase = isClientShowcaseChunk(name);
  const hits = [];

  if (!showcase) {
    for (const m of src.matchAll(WA)) {
      if (isAllowedWaDigits(m[1])) continue;
      hits.push({ kind: "wa.me", value: m[0], offset: m.index, context: snippet(src, m.index) });
    }
  }
  for (const m of src.matchAll(EMAIL)) {
    if (EMAIL_ALLOW.test(m[0])) continue;
    hits.push({ kind: "email", value: m[0], offset: m.index, context: snippet(src, m.index) });
  }
  for (const rx of PHONE_PATTERNS) {
    for (const m of src.matchAll(rx)) {
      const v = m[0];
      if (PHONE_ALLOW.test(v)) continue;
      if (CLIENT_ALLOWED_PHONE.test(v.replace(/\s+/g, " ").trim())) continue;
      hits.push({ kind: "phone", value: v, offset: m.index, context: snippet(src, m.index) });
    }
  }

  if (hits.length === 0) return;

  const level = admin ? "warn" : "error";
  if (admin) warns++;
  else errors++;

  const entry = {
    correlationId,
    level,
    chunk: name,
    file: relative(ROOT, file),
    bytes,
    routeHint: routeHintFromChunk(name),
    hits: hits.slice(0, 20),
    totalHits: hits.length,
  };
  findings.push(entry);

  console.log(`\n[${level.toUpperCase()}] ${name}  (${(bytes / 1024).toFixed(1)} kB · ${entry.routeHint})`);
  for (const h of hits.slice(0, 5)) {
    console.log(`  ${h.kind}: ${h.value}  @${h.offset}`);
    console.log(`     ↳ ${h.context}`);
  }
  if (hits.length > 5) console.log(`  … +${hits.length - 5} ocorrência(s)`);
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (entry.endsWith(".js")) scan(p);
  }
}

console.log(`[client-privacy] scanning ${DIST} (correlationId=${correlationId})`);
walk(DIST);

try {
  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(
    REPORT_FILE,
    JSON.stringify(
      { correlationId, generatedAt: new Date().toISOString(), scanned, errors, warns, findings },
      null,
      2,
    ),
  );
  console.log(`[client-privacy] report → ${relative(ROOT, REPORT_FILE)}`);
} catch (e) {
  console.warn(`[client-privacy] não foi possível gravar o relatório: ${e.message}`);
}

if (errors) {
  console.error(`\n[client-privacy] FAIL — ${errors} public chunk(s) with leaks`);
  process.exit(1);
}
console.log(`\n[client-privacy] OK — public bundle clean (${scanned} chunks, ${warns} warning(s) in admin chunks)`);
