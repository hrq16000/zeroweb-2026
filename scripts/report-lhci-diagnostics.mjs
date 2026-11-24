#!/usr/bin/env node
/**
 * Diagnóstico não bloqueante de Lighthouse para o CI.
 * Lê relatórios já gerados pelo LHCI; não altera assertions nem budgets.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { summarizeLhr } from "./lib/lhci-diagnostics.mjs";

const args = process.argv.slice(2);
const dirIndex = args.indexOf("--dir");
const jsonIndex = args.indexOf("--json");
const directory = dirIndex >= 0 ? args[dirIndex + 1] : ".lighthouseci";
if (!directory || (jsonIndex >= 0 && !args[jsonIndex + 1])) throw new Error("Expected --dir <directory> or --json <output>");
if (!existsSync(directory)) {
  console.log("[lhci-diagnostic] Nenhum relatório local disponível");
  process.exit(0);
}
const files = readdirSync(directory).filter((file) => /(?:^|-)lhr-.*\.json$/.test(file)).sort();
if (!files.length) {
  console.log("[lhci-diagnostic] Relatórios LHR não encontrados");
  process.exit(0);
}
const summaries = [];
for (const file of files) {
  try {
    const lhr = JSON.parse(readFileSync(join(directory, file), "utf8"));
    const summary = summarizeLhr(lhr);
    summaries.push({ file, ...summary });
    console.log(`[lhci-diagnostic] ${file} ${summary.path}`);
    console.log(`[lhci-diagnostic] ${JSON.stringify(summary)}`);
  } catch (error) {
    // Não mascarar o status real do Lighthouse devido a diagnóstico.
    console.warn(`[lhci-diagnostic] Falha ao ler ${file}: ${error.message}`);
  }
}
if (jsonIndex >= 0) writeFileSync(args[jsonIndex + 1], JSON.stringify(summaries, null, 2) + "\n");
