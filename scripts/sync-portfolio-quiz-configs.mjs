#!/usr/bin/env node
/**
 * Sincroniza e valida o registro central de funis dos projetos /portfolio/<slug>.
 *
 * Motivo: o CTA da página e o botão flutuante da casca padrão precisam abrir
 * exatamente o mesmo funil. Quando cada página declarava o funil inline, a
 * casca caía no funil padrão (beleza) e projetos industriais mostravam
 * perguntas de outro segmento.
 *
 * Modos:
 *   node scripts/sync-portfolio-quiz-configs.mjs          → gera o registro
 *   node scripts/sync-portfolio-quiz-configs.mjs --check  → falha se desatualizado
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";

const SITE_DIR = resolve("src/components/site");
const OUT = resolve("src/config/portfolio-quiz-configs.generated.ts");
const check = process.argv.includes("--check");

/** Extrai o literal de objeto que começa em `startIdx` (posição da `{`). */
function readObjectLiteral(source, startIdx) {
  let depth = 0;
  let inStr = null;
  for (let i = startIdx; i < source.length; i += 1) {
    const ch = source[i];
    if (inStr) {
      if (ch === "\\") i += 1;
      else if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") inStr = ch;
    else if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(startIdx, i + 1);
    }
  }
  return null;
}

const entries = new Map();
const problems = [];

for (const file of readdirSync(SITE_DIR).filter((f) => f.endsWith(".tsx"))) {
  const source = readFileSync(join(SITE_DIR, file), "utf8");
  if (!source.includes("PortfolioCTAQuiz")) continue;

  const keys = [...source.matchAll(/clientKey="([a-z0-9-]+)"/g)].map((m) => m[1]);
  const uniqueKeys = [...new Set(keys)];
  if (uniqueKeys.length !== 1) continue;
  const clientKey = uniqueKeys[0];

  const decl = source.match(/const (quiz|mestreQuiz|orderQuiz|quizConfig)(?::[^=]+)? = \{/);
  if (!decl) continue;
  const literal = readObjectLiteral(source, source.indexOf("{", decl.index));
  if (!literal) {
    problems.push(`${file}: não foi possível ler o literal do funil`);
    continue;
  }
  let value;
  try {
    // Remove asserções TypeScript (`as const`, `as Foo`) antes de avaliar o literal.
    const plain = literal.replace(/\s+as\s+(const|[A-Za-z_$][\w$.<>\[\]"']*)/g, "");
    // eslint-disable-next-line no-new-func
    value = new Function(`return (${plain});`)();
  } catch (err) {
    problems.push(`${file}: literal do funil inválido (${err.message})`);
    continue;
  }
  entries.set(clientKey, value);
}

if (problems.length) {
  for (const p of problems) console.error(`[quiz-configs] ${p}`);
  process.exit(1);
}

const sorted = [...entries.entries()].sort(([a], [b]) => a.localeCompare(b));
const body = sorted
  .map(([key, value]) => `  ${JSON.stringify(key)}: ${JSON.stringify(value, null, 2).replace(/\n/g, "\n  ")},`)
  .join("\n");

const output = `// GERADO por scripts/sync-portfolio-quiz-configs.mjs — não edite à mão.
// Registro central dos funis por cliente: garante que o CTA da página e o
// botão flutuante da casca padrão abram exatamente o mesmo funil.
import type { PortfolioQuizConfig } from "@/components/site/BeautyBookingQuiz";

export const PORTFOLIO_QUIZ_CONFIGS: Record<string, PortfolioQuizConfig> = {
${body}
};

export function resolvePortfolioQuizConfig(clientKey?: string): PortfolioQuizConfig | undefined {
  return clientKey ? PORTFOLIO_QUIZ_CONFIGS[clientKey] : undefined;
}
`;

const current = (() => {
  try {
    return readFileSync(OUT, "utf8");
  } catch {
    return "";
  }
})();

if (check) {
  if (current !== output) {
    console.error(
      "[quiz-configs] FAIL — registro desatualizado. Rode: node scripts/sync-portfolio-quiz-configs.mjs",
    );
    process.exit(1);
  }
  console.log(`[quiz-configs] OK — ${sorted.length} funil(is) sincronizado(s)`);
} else {
  writeFileSync(OUT, output);
  console.log(`[quiz-configs] OK — ${sorted.length} funil(is) escrito(s) em ${OUT}`);
}
