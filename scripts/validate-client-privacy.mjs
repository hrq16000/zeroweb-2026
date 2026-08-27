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
import { readdirSync, readFileSync, statSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import {
  CLIENT_ALLOWED_PHONE,
  isAdminChunk,
  isAllowedWaDigits,
  isClientShowcaseChunk,
  routeHintFromChunk,
} from "./contact-allowlist.mjs";

const ROOT = process.cwd();
const DIST_CANDIDATES = ["dist/client/assets", ".output/public/assets", "dist/assets"];
const DIST = DIST_CANDIDATES.find((candidate) => existsSync(join(ROOT, candidate)));
const REPORT_DIR = join(ROOT, "seo-reports");
const REPORT_FILE = join(REPORT_DIR, "client-privacy-report.json");
const REPORT_MD = join(REPORT_DIR, "client-privacy-report.md");
const require = createRequire(import.meta.url);
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

/** Converte um offset absoluto em { line, column } 1-based/0-based para source maps. */
function offsetToLineColumn(src, offset) {
  let line = 1;
  let lastBreak = -1;
  for (let i = 0; i < offset; i++) {
    if (src.charCodeAt(i) === 10) {
      line++;
      lastBreak = i;
    }
  }
  return { line, column: offset - lastBreak - 1 };
}

const mapCache = new Map();
/** Carrega o source map de um chunk, se existir. Nunca lança. */
function loadSourceMap(file) {
  if (mapCache.has(file)) return mapCache.get(file);
  let consumer = null;
  try {
    const mapFile = `${file}.map`;
    if (existsSync(mapFile)) {
      const { SourceMapConsumer } = require("source-map-js");
      consumer = new SourceMapConsumer(JSON.parse(readFileSync(mapFile, "utf8")));
    }
  } catch {
    consumer = null;
  }
  mapCache.set(file, consumer);
  return consumer;
}

function scan(file) {
  const name = file.replaceAll("\\", "/").split("/").pop();
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

  // Mapeia cada ocorrência para o arquivo-fonte original quando há source map.
  const consumer = loadSourceMap(file);
  if (consumer) {
    for (const h of hits) {
      const pos = offsetToLineColumn(src, h.offset);
      try {
        const orig = consumer.originalPositionFor(pos);
        if (orig?.source) h.source = `${orig.source}:${orig.line ?? "?"}:${orig.column ?? "?"}`;
      } catch {
        /* map inválido */
      }
    }
  }

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

/** Relatório legível com origem mapeada para revisão humana e CI. */
function markdownReport() {
  const lines = [
    "# Relatório de privacidade do bundle público",
    "",
    `- correlationId: \`${correlationId}\``,
    `- gerado em: ${new Date().toISOString()}`,
    `- chunks analisados: ${scanned}`,
    `- erros (bloqueantes): ${errors}`,
    `- avisos (chunks admin): ${warns}`,
    "",
  ];
  if (findings.length === 0) {
    lines.push("Nenhum vazamento encontrado.", "");
    return lines.join("\n");
  }
  for (const f of findings) {
    lines.push(`## [${f.level.toUpperCase()}] ${f.chunk}`, "");
    lines.push(`- rota: ${f.routeHint}`, `- arquivo: \`${f.file}\``, `- ocorrências: ${f.totalHits}`, "");
    lines.push("| tipo | valor | origem | contexto |", "| --- | --- | --- | --- |");
    for (const h of f.hits) {
      const ctx = String(h.context ?? "").replaceAll("|", "\\|").slice(0, 160);
      lines.push(`| ${h.kind} | \`${h.value}\` | ${h.source ?? `offset ${h.offset}`} | ${ctx} |`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (entry.endsWith(".js")) scan(p);
  }
}

if (!DIST) {
  console.error(`[client-privacy] nenhum diretório de assets encontrado (${DIST_CANDIDATES.join(", ")})`);
  process.exit(1);
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
  writeFileSync(REPORT_MD, markdownReport());
  console.log(`[client-privacy] report → ${relative(ROOT, REPORT_FILE)}`);
  console.log(`[client-privacy] report → ${relative(ROOT, REPORT_MD)}`);
} catch (e) {
  console.warn(`[client-privacy] não foi possível gravar o relatório: ${e.message}`);
}

if (errors) {
  console.error(`\n[client-privacy] FAIL — ${errors} public chunk(s) with leaks`);
  process.exit(1);
}
console.log(`\n[client-privacy] OK — public bundle clean (${scanned} chunks, ${warns} warning(s) in admin chunks)`);
