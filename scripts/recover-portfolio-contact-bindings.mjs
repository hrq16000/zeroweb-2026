#!/usr/bin/env node

/**
 * Recovery audit for portfolio contact bindings.
 *
 * Read-only by design: it scans the current worktree and Git history for
 * Brazilian phone/WhatsApp candidates and writes evidence reports. It NEVER
 * promotes a candidate to VERIFIED and NEVER rewrites the canonical registry.
 *
 * Run:
 *   node scripts/recover-portfolio-contact-bindings.mjs
 */

import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, "reports");
const JSON_REPORT = path.join(REPORT_DIR, "portfolio-contact-recovery.json");
const MD_REPORT = path.join(REPORT_DIR, "portfolio-contact-recovery.md");
const CLIENT_KEYS_FILE = path.join(ROOT, "src/lib/portfolio-client-keys.ts");
const BINDINGS_FILE = path.join(ROOT, "src/config/portfolio-contact-bindings.json");

const SCAN_ROOTS = [
  "src/components/site",
  "src/config",
  "src/lib",
  "docs/portfolio",
  "supabase/migrations",
];
const TEXT_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".md", ".sql", ".txt", ".yml", ".yaml"]);

function loadClientKeys() {
  const source = readFileSync(CLIENT_KEYS_FILE, "utf8");
  const block = source.match(/PORTFOLIO_CLIENT_KEYS\s*=\s*\[([\s\S]*?)\]\s*as const/);
  if (!block) throw new Error("Não foi possível ler PORTFOLIO_CLIENT_KEYS.");
  return [...block[1].matchAll(/["']([^"']+)["']/g)].map((m) => m[1]);
}

function normalizeKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeBrazilPhone(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (!digits || digits.includes("*")) return null;
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith("55")) return digits;
  return null;
}

const PHONE_PATTERNS = [
  /(?:wa\.me\/|phone=)(?:\+?55)?([1-9]{2}\d{8,9})/gi,
  /(?:\+?55[\s().-]*)?\(?([1-9]{2})\)?[\s.-]*(9?\d{4})[\s.-]*(\d{4})/g,
  /\b55([1-9]{2})(9?\d{4})(\d{4})\b/g,
];

function extractPhones(text) {
  const out = new Set();
  for (const pattern of PHONE_PATTERNS) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text))) {
      const raw = match[0];
      const normalized = normalizeBrazilPhone(raw);
      if (normalized) out.add(normalized);
    }
  }
  return [...out];
}

function walk(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, files);
    else if (TEXT_EXTENSIONS.has(path.extname(name).toLowerCase())) files.push(full);
  }
  return files;
}

function inferClientKey(filePath, clientKeys) {
  const normalizedPath = normalizeKey(filePath.replace(ROOT, ""));
  const exact = clientKeys.find((key) => normalizedPath.includes(normalizeKey(key)));
  if (exact) return exact;

  const base = normalizeKey(path.basename(filePath, path.extname(filePath)).replace(/Page$/i, ""));
  let best = null;
  let bestScore = 0;
  for (const key of clientKeys) {
    const a = new Set(base.split("-").filter(Boolean));
    const b = new Set(normalizeKey(key).split("-").filter(Boolean));
    const intersection = [...a].filter((token) => b.has(token)).length;
    const score = intersection / Math.max(a.size, b.size, 1);
    if (score > bestScore) {
      bestScore = score;
      best = key;
    }
  }
  return bestScore >= 0.5 ? best : null;
}

function addEvidence(map, { clientKey, phone, sourceKind, file, commit = null, line = null, context = null }) {
  const id = `${clientKey || "UNMAPPED"}:${phone}`;
  if (!map.has(id)) {
    map.set(id, {
      clientKey: clientKey || null,
      phoneE164: `+${phone}`,
      status: "CANDIDATE",
      evidence: [],
    });
  }
  const item = map.get(id);
  const fingerprint = `${sourceKind}:${file}:${commit || ""}:${line || ""}`;
  if (item.evidence.some((e) => e.fingerprint === fingerprint)) return;
  item.evidence.push({ fingerprint, sourceKind, file, commit, line, context });
}

function scanCurrentTree(clientKeys, candidates) {
  for (const root of SCAN_ROOTS) {
    const absRoot = path.join(ROOT, root);
    for (const file of walk(absRoot)) {
      let text;
      try {
        text = readFileSync(file, "utf8");
      } catch {
        continue;
      }
      const rel = path.relative(ROOT, file).replaceAll("\\", "/");
      const key = inferClientKey(file, clientKeys);
      const lines = text.split(/\r?\n/);
      lines.forEach((lineText, index) => {
        for (const phone of extractPhones(lineText)) {
          addEvidence(candidates, {
            clientKey: key,
            phone,
            sourceKind: "CURRENT_TREE",
            file: rel,
            line: index + 1,
            context: lineText.trim().slice(0, 240),
          });
        }
      });
    }
  }
}

function scanGitHistory(clientKeys, candidates) {
  let log = "";
  try {
    log = execFileSync(
      "git",
      [
        "log",
        "--all",
        "--format=@@COMMIT:%H",
        "--patch",
        "-U0",
        "--no-ext-diff",
        "--",
        ...SCAN_ROOTS,
      ],
      { cwd: ROOT, encoding: "utf8", maxBuffer: 128 * 1024 * 1024 },
    );
  } catch (error) {
    console.warn("[contact-recovery] histórico Git não pôde ser lido:", error.message);
    return;
  }

  let commit = null;
  let file = null;
  for (const rawLine of log.split(/\r?\n/)) {
    if (rawLine.startsWith("@@COMMIT:")) {
      commit = rawLine.slice("@@COMMIT:".length).trim();
      continue;
    }
    if (rawLine.startsWith("+++ b/")) {
      file = rawLine.slice(6).trim();
      continue;
    }
    if (!file || (!rawLine.startsWith("+") && !rawLine.startsWith("-"))) continue;
    if (rawLine.startsWith("+++") || rawLine.startsWith("---")) continue;

    const content = rawLine.slice(1);
    const key = inferClientKey(path.join(ROOT, file), clientKeys);
    for (const phone of extractPhones(content)) {
      addEvidence(candidates, {
        clientKey: key,
        phone,
        sourceKind: rawLine.startsWith("+") ? "GIT_ADDED_LINE" : "GIT_REMOVED_LINE",
        file,
        commit,
        context: content.trim().slice(0, 240),
      });
    }
  }
}

function loadCurrentBindings() {
  if (!existsSync(BINDINGS_FILE)) return {};
  return JSON.parse(readFileSync(BINDINGS_FILE, "utf8")).entries || {};
}

function buildSummary(clientKeys, candidates, bindings) {
  const items = [...candidates.values()].map((item) => ({
    ...item,
    evidence: item.evidence.map(({ fingerprint, ...e }) => e),
  }));

  const candidatesByClient = new Map();
  for (const item of items) {
    if (!item.clientKey) continue;
    if (!candidatesByClient.has(item.clientKey)) candidatesByClient.set(item.clientKey, []);
    candidatesByClient.get(item.clientKey).push(item);
  }

  const projects = clientKeys.map((clientKey) => {
    const binding = bindings[clientKey] || null;
    const found = candidatesByClient.get(clientKey) || [];
    return {
      clientKey,
      bindingStatus: binding?.status || "NO_VERSIONED_BINDING",
      bindingPhone: binding?.phoneE164 || null,
      recoveredCandidates: found.map((x) => x.phoneE164),
      candidateCount: found.length,
      needsReview: !binding || binding.status !== "VERIFIED" || found.some((x) => binding?.phoneE164 && x.phoneE164 !== binding.phoneE164),
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    mode: "READ_ONLY_RECOVERY_AUDIT",
    rules: {
      autoPromoteCandidate: false,
      directWhatsAppCtaAllowed: false,
      leadMustPersistBeforeHandoff: true,
    },
    summary: {
      projects: projects.length,
      versionedVerified: projects.filter((p) => p.bindingStatus === "VERIFIED").length,
      projectsWithRecoveredCandidate: projects.filter((p) => p.candidateCount > 0).length,
      projectsNeedingReview: projects.filter((p) => p.needsReview).length,
      unmappedCandidates: items.filter((i) => !i.clientKey).length,
    },
    projects,
    candidates: items,
  };
}

function writeReports(report) {
  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(JSON_REPORT, `${JSON.stringify(report, null, 2)}\n`);

  const lines = [
    "# Recuperação de vínculos comerciais — /portfolio/:slug",
    "",
    `Gerado em ${report.generatedAt}`,
    "",
    `- Projetos: **${report.summary.projects}**`,
    `- Vínculos versionados VERIFIED: **${report.summary.versionedVerified}**`,
    `- Projetos com candidato recuperado: **${report.summary.projectsWithRecoveredCandidate}**`,
    `- Projetos que exigem revisão: **${report.summary.projectsNeedingReview}**`,
    `- Candidatos não mapeados automaticamente: **${report.summary.unmappedCandidates}**`,
    "",
    "> Este relatório é evidência de recuperação. Candidato encontrado no Git não equivale a titularidade verificada.",
    "",
    "| clientKey | binding atual | candidatos recuperados | revisão |",
    "|---|---|---|---|",
    ...report.projects.map(
      (p) => `| ${p.clientKey} | ${p.bindingStatus}${p.bindingPhone ? ` · ${p.bindingPhone}` : ""} | ${p.recoveredCandidates.join(", ") || "—"} | ${p.needsReview ? "SIM" : "não"} |`,
    ),
    "",
  ];
  writeFileSync(MD_REPORT, `${lines.join("\n")}\n`);
}

const clientKeys = loadClientKeys();
const bindings = loadCurrentBindings();
const candidates = new Map();
scanCurrentTree(clientKeys, candidates);
scanGitHistory(clientKeys, candidates);
const report = buildSummary(clientKeys, candidates, bindings);
writeReports(report);

console.log(`[contact-recovery] projetos=${report.summary.projects}`);
console.log(`[contact-recovery] verified-versioned=${report.summary.versionedVerified}`);
console.log(`[contact-recovery] com-candidato=${report.summary.projectsWithRecoveredCandidate}`);
console.log(`[contact-recovery] revisar=${report.summary.projectsNeedingReview}`);
console.log(`[contact-recovery] relatório=${path.relative(ROOT, JSON_REPORT)}`);
