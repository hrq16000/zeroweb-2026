/**
 * Gate mínimo do Portfolio Blueprint.
 *
 * Valida cada Blueprint registrado: slug, tipos de seção conhecidos, variantes
 * válidas, `order` sem conflito, hero presente e chamada de funil declarada.
 * Uso: bun scripts/validate-portfolio-blueprints.ts
 */
import { blueprintModules } from "../src/components/portfolio/blueprint/registry";
import { validatePortfolioBlueprint } from "../src/lib/portfolio-blueprint";

const errors: string[] = [];
let count = 0;

for (const [slug, load] of Object.entries(blueprintModules)) {
  const mod = await load();
  const blueprint = mod.blueprint;
  if (!blueprint) {
    errors.push(`${slug}: módulo não exporta \`blueprint\``);
    continue;
  }
  if (blueprint.slug !== slug) {
    errors.push(`${slug}: slug do Blueprint diverge do registry (${blueprint.slug})`);
  }
  errors.push(...validatePortfolioBlueprint(blueprint));
  count += 1;
}

if (errors.length) {
  console.error(`[portfolio-blueprints] FAIL — ${errors.length} problema(s)`);
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}

console.log(`[portfolio-blueprints] OK — ${count} blueprint(s) válido(s).`);
