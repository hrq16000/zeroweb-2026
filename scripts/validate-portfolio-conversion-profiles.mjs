#!/usr/bin/env node
/** Impede regressão para narrativa genérica nos projetos do catálogo. */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const catalog = JSON.parse(readFileSync(resolve("src/config/portfolio-catalog.json"), "utf8"));
const source = readFileSync(resolve("src/components/portfolio/PortfolioConversionNarrative.tsx"), "utf8");
const map = source.match(/const narrativeBySlug:[\s\S]*?= \{([\s\S]*?)\n\};/)?.[1] ?? "";
const entries = [
  ...map.matchAll(
    /(?:"([a-z0-9_-]+)"|([a-z0-9_]+)):\s*\{\s*title:\s*"([^"]+)",\s*step:\s*"([^"]+)",\s*cta:\s*"([^"]+)"/g,
  ),
].map((entry) => [entry[0], entry[1] ?? entry[2], entry[3], entry[4], entry[5]]);
const errors = [];
const titles = new Set();
const steps = new Set();

for (const item of catalog) {
  const entry = entries.find((candidate) => candidate[1] === item.slug);
  if (!entry) { errors.push(`${item.slug}: perfil de conversão individual ausente`); continue; }
  const [, , title, step, cta] = entry;
  if (title.length < 20 || step.length < 20 || cta.length < 4) errors.push(`${item.slug}: perfil de conversão incompleto`);
  if (titles.has(title)) errors.push(`${item.slug}: título de conversão duplicado`); titles.add(title);
  if (steps.has(step)) errors.push(`${item.slug}: orientação de conversão duplicada`); steps.add(step);
  const forbidden = item.segment === "beleza" ? /(obra|frete|motor|sinaliza)/i : item.segment === "construcao" ? /(cílios|açaí|caneca)/i : null;
  if (forbidden && (forbidden.test(title) || forbidden.test(step) || forbidden.test(cta))) errors.push(`${item.slug}: perfil incompatível com segmento`);
}

if (errors.length) {
  console.error(`[portfolio-conversion-profiles] FAIL — ${errors.length} problema(s)`);
  errors.forEach((error) => console.error(` - ${error}`));
  process.exit(1);
}
console.log(`[portfolio-conversion-profiles] OK — ${catalog.length} narrativas individuais e distintas`);
