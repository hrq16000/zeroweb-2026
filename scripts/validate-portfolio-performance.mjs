#!/usr/bin/env node
/**
 * Portão de performance dos projetos /portfolio/<slug>.
 *
 * Regras (aplicadas a todo cliente registrado em portfolio-clients.json):
 *  - toda <img> crua precisa de `loading` e `decoding` explícitos
 *    (ou usar <PortfolioImage> / <Picture>, que já garantem isso);
 *  - no máximo 1 imagem `eager`/priority por projeto (candidata a LCP);
 *  - nenhuma imagem `eager` sem `fetchPriority`/priority.
 *
 * Uso: node scripts/validate-portfolio-performance.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const read = (p) => (existsSync(resolve(root, p)) ? readFileSync(resolve(root, p), "utf8") : "");

const clients = JSON.parse(read("src/config/portfolio-clients.json") || "[]");
const errors = [];
const warnings = [];

for (const client of clients) {
  const label = `[${client.slug}]`;
  const source = read(client.componentFile);
  if (!source) {
    errors.push(`${label} componente ausente: ${client.componentFile}`);
    continue;
  }

  const rawImages = [...source.matchAll(/<img\b[^>]*>/gs)];
  let eagerCount = 0;

  for (const match of rawImages) {
    const tag = match[0];
    const line = source.slice(0, match.index).split("\n").length;
    const where = `${client.componentFile}:${line}`;

    if (!/\bloading=/.test(tag)) {
      errors.push(`${label} <img> sem loading explícito (${where})`);
    }
    if (!/\bdecoding=/.test(tag)) {
      errors.push(`${label} <img> sem decoding="async" (${where})`);
    }
    if (/loading=["'{]?\s*["']?eager/.test(tag)) {
      eagerCount += 1;
      if (!/fetchPriority=/.test(tag)) {
        warnings.push(`${label} imagem eager sem fetchPriority (${where})`);
      }
    }
  }

  const priorityCount = (source.match(/priority(\s*=\s*\{true\}|\s*[/>])/g) || []).length;
  if (eagerCount + priorityCount > 1) {
    errors.push(
      `${label} ${eagerCount + priorityCount} imagens marcadas como LCP; use no máximo 1`,
    );
  }
}

for (const w of warnings) console.warn(`[portfolio-perf] WARN ${w}`);

if (errors.length) {
  console.error(`[portfolio-perf] FAIL — ${errors.length} problema(s)`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(
  `[portfolio-perf] OK — ${clients.length} projeto(s) com imagens otimizadas (${warnings.length} aviso(s))`,
);
