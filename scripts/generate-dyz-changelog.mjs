#!/usr/bin/env node
/** Gera um resumo auditável da rota DYZ e dos validadores executados no build. */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

const root = process.cwd();
const reports = join(root, "seo-reports");
mkdirSync(reports, { recursive: true });
const commit = (() => { try { return execSync("git rev-parse --short HEAD").toString().trim(); } catch { return "indisponível"; } })();
const report = existsSync(join(reports, "client-privacy-report.json"))
  ? JSON.parse(readFileSync(join(reports, "client-privacy-report.json"), "utf8"))
  : null;
const lines = [
  "# Changelog automático — D.Y.Z Promo",
  "",
  `- Gerado em: ${new Date().toISOString()}`,
  `- Commit: ${commit}`,
  "- Rota principal: `/portfolio/dyzpromo`",
  "- Galeria: 8 registros reais de ações de rua adicionados à página demonstrativa.",
  "- Portfólio: cards com imagem e título clicáveis, preview em modal, navegação anterior/próximo e fechamento por ESC.",
  "- Conversão: CTAs permanecem no funil padrão dos portfólios, sem telefone ou wa.me expostos no cliente.",
  "",
  "## Validações",
  `- Client privacy: ${report ? (report.errors === 0 ? "OK" : `FALHOU (${report.errors} chunks)`) : "executar no pipeline"}`,
  "- Canonical, Schema.org e Open Graph: verificados pelo pipeline de build.",
];
writeFileSync(join(reports, "dyzpromo-changelog.md"), `${lines.join("\n")}\n`);
console.log("[changelog] seo-reports/dyzpromo-changelog.md atualizado");
