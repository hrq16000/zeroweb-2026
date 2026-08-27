#!/usr/bin/env node
/**
 * Gera o relatório evidence-first de uma tarefa em docs/skills/evidence/.
 *
 * Uso:
 *   node scripts/skill-evidence-report.mjs --id popup-alerts \
 *     --title "Alertas do pop-up" --classes dashboard,performance \
 *     --gate "bun test=pass:183 pass / 0 fail" --gate "bun run build=pass:gates ok"
 *
 * O conteúdo do stack vem do pipeline tipado em src/lib/skill-pipeline.ts,
 * garantindo que dashboard, testes e relatório usem exatamente a mesma regra.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
function flag(name, fallback = null) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
}
const gates = args
  .map((a, i) => (a === "--gate" ? args[i + 1] : null))
  .filter(Boolean)
  .map((raw) => {
    const [name, rest = ""] = raw.split("=");
    const [result, ...evidence] = rest.split(":");
    return { name, passed: result === "pass", evidence: evidence.join(":") };
  });

const id = flag("id");
const title = flag("title", id);
const classes = (flag("classes", "docs") ?? "docs").split(",").map((c) => c.trim()).filter(Boolean);

if (!id) {
  console.error("uso: node scripts/skill-evidence-report.mjs --id <slug> --title <titulo> --classes a,b --gate nome=pass:evidencia");
  process.exit(2);
}

const { runSkillPipeline, renderPipelineMarkdown } = await import(
  pathToFileURL(resolve(process.cwd(), "src/lib/skill-pipeline.ts")).href
);

const report = runSkillPipeline({ id, title, classes }, gates);
const md = renderPipelineMarkdown(report);

const dir = resolve(process.cwd(), "docs/skills/evidence");
mkdirSync(dir, { recursive: true });
const file = resolve(dir, `${id}.md`);
writeFileSync(file, md);

console.log(md);
console.log(`\n[skill-evidence] relatório → docs/skills/evidence/${id}.md`);
if (!report.ship.canShip) {
  console.error(`[skill-evidence] SHIP bloqueado: ${report.ship.blockers.join("; ")}`);
  process.exit(1);
}
