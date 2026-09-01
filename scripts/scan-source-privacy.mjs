#!/usr/bin/env node
/**
 * Scanner de privacidade em NÍVEL DE FONTE (pré-build).
 *
 * Detecta contatos operacionais e links públicos de contato em código que
 * pode chegar ao bundle do cliente, antes de gastar um build inteiro.
 * O scanner de bundle (`validate-client-privacy.mjs`) continua sendo o gate
 * final; este aqui antecipa o diagnóstico com arquivo e linha exatos.
 *
 * Uso: node scripts/scan-source-privacy.mjs [--strict]
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { resolve, relative } from "node:path";
import { execFileSync } from "node:child_process";

const strict = process.argv.includes("--strict");
const root = process.cwd();
const outDir = resolve(root, "seo-reports");
mkdirSync(outDir, { recursive: true });

/** Arquivos que legitimamente citam os padrões (validadores, docs, server-only). */
const ALLOWLIST = [
  /^scripts\//,
  /^docs\//,
  /\.test\.ts$/,
  /\.server\.ts$/,
  /\.functions\.ts$/,
  /^src\/lib\/whatsapp-redirect/,
  /^src\/routes\/r\.whatsapp/,
  /^src\/routes\/api\//,
  /^src\/routes\/_authenticated\//,
  /^src\/data\/skill-registry\.ts$/,
  /^src\/lib\/landing-guardrails\.ts$/,
  /^src\/lib\/skill-pipeline\.ts$/,
];

const PATTERNS = [
  { id: "wa.me", re: /wa\.me/g, severity: "error" },
  { id: "api.whatsapp", re: /api\.whatsapp\.com/g, severity: "error" },
  { id: "tel:", re: /href=["'`]tel:/g, severity: "error" },
  { id: "mailto:", re: /href=["'`]mailto:/g, severity: "error" },
  { id: "telefone BR", re: /\(?\b\d{2}\)?[\s.-]?9?\d{4}[\s.-]?\d{4}\b/g, severity: "warn" },
];

function listFiles() {
  try {
    const out = execFileSync("git", ["ls-files", "src"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return out.split("\n").filter((f) => /\.(ts|tsx|json)$/.test(f));
  } catch {
    // Workspaces sincronizados (ex.: OneDrive) podem deixar o índice do Git
    // temporariamente indisponível. O gate de privacidade não deve ser pulado:
    // nesse caso, varremos o diretório de fonte diretamente.
    const files = [];
    const walk = (directory) => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const absolute = resolve(directory, entry.name);
        if (entry.isDirectory()) walk(absolute);
        else if (/\.(ts|tsx|json)$/.test(entry.name)) {
          files.push(relative(root, absolute).replaceAll("\\", "/"));
        }
      }
    };
    walk(resolve(root, "src"));
    console.warn("[source-privacy] Git indisponível; usando varredura direta de src/");
    return files;
  }
}

const findings = [];
for (const file of listFiles()) {
  if (ALLOWLIST.some((re) => re.test(file))) continue;
  let content;
  try {
    content = readFileSync(resolve(root, file), "utf8");
  } catch {
    continue;
  }
  const lines = content.split("\n");
  for (const p of PATTERNS) {
    lines.forEach((line, i) => {
      const trimmed = line.trim();
      // Comentários não chegam ao bundle minificado.
      if (trimmed.startsWith("*") || trimmed.startsWith("//") || trimmed.startsWith("/*")) return;
      // URLs de imagem/asset e placeholders de formulário não são contato.
      if (p.id === "telefone BR" && /https?:\/\/|placeholder=|setAttribute/.test(line)) return;
      p.re.lastIndex = 0;
      if (!p.re.test(line)) return;
      findings.push({
        file: relative(root, file),
        line: i + 1,
        pattern: p.id,
        severity: p.severity,
        snippet: line.trim().slice(0, 160),
      });
    });
  }
}

const errors = findings.filter((f) => f.severity === "error");
const warns = findings.filter((f) => f.severity === "warn");

const report = {
  generatedAt: new Date().toISOString(),
  scanned: "src/**/*.{ts,tsx,json} (excluídos scripts, docs, server-only)",
  errors: errors.length,
  warnings: warns.length,
  findings,
};
writeFileSync(resolve(outDir, "source-privacy-report.json"), JSON.stringify(report, null, 2));

const md = [
  "# Relatório de privacidade (fonte)",
  "",
  `Gerado em ${report.generatedAt}`,
  "",
  `- erros: ${errors.length}`,
  `- avisos: ${warns.length}`,
  "",
  findings.length ? "| severidade | arquivo:linha | padrão | trecho |" : "Nenhuma ocorrência.",
  findings.length ? "| --- | --- | --- | --- |" : "",
  ...findings.map((f) => `| ${f.severity} | ${f.file}:${f.line} | ${f.pattern} | \`${f.snippet.replace(/\|/g, "\\|")}\` |`),
  "",
].join("\n");
writeFileSync(resolve(outDir, "source-privacy-report.md"), md);

for (const f of errors) console.error(`[ERROR] ${f.file}:${f.line} ${f.pattern} → ${f.snippet}`);
for (const f of warns) console.warn(`[WARN] ${f.file}:${f.line} ${f.pattern} → ${f.snippet}`);
console.log(`[source-privacy] report → seo-reports/source-privacy-report.json|.md`);

if (errors.length) {
  console.error(`[source-privacy] FAIL — ${errors.length} contato(s) público(s) no código do cliente`);
  process.exit(1);
}
if (strict && warns.length) {
  console.error(`[source-privacy] FAIL (strict) — ${warns.length} aviso(s)`);
  process.exit(1);
}
console.log(`[source-privacy] OK — nenhum contato operacional em código público`);
