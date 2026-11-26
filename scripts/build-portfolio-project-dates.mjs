#!/usr/bin/env node
/**
 * Datas reais dos projetos do catálogo `/portfolio`, lidas do histórico Git.
 *
 * createdAt = data de autoria do commit mais antigo que tocou os arquivos do
 * projeto; updatedAt = a do commit mais recente. Nada é inventado: projeto sem
 * arquivo rastreável fica sem data e vai para o fim das ordenações por data.
 *
 * Exige histórico completo (clone não-shallow). Rode após criar ou alterar um
 * projeto: `bun run build:portfolio-project-dates`. `--check` só confere a
 * cobertura, sem regravar.
 */
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const OUT = "src/config/portfolio-project-dates.json";
const check = process.argv.includes("--check");

const catalog = [
  ...read("src/config/portfolio-catalog.json"),
  ...read("src/config/portfolio-catalog-standalone.json"),
];
const clients = new Map(read("src/config/portfolio-clients.json").map((c) => [c.slug, c]));

if (check) {
  const dates = read(OUT).projects;
  const missing = catalog.map((i) => i.slug).filter((slug) => !dates[slug]?.createdAt);
  if (missing.length) {
    console.error(`Projetos sem data real (${missing.length}): ${missing.join(", ")}`);
    console.error("Rode: bun run build:portfolio-project-dates");
    process.exit(1);
  }
  console.log(`portfolio-project-dates: ${catalog.length} projetos com data real.`);
  process.exit(0);
}

const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 << 20 });
if (git("rev-parse", "--is-shallow-repository").trim() === "true") {
  console.error("Histórico Git incompleto (shallow): as datas não seriam reais. Abortado.");
  process.exit(1);
}

const tracked = git("ls-files").split("\n").filter(Boolean);
// Arquivos de rota genéricos são compartilhados e não datam um projeto.
const SHARED = new Set(["src/routes/portfolio.$slug.tsx", "src/routes/portfolio.index.tsx"]);

function projectPaths(slug) {
  const client = clients.get(slug);
  const paths = new Set();
  for (const file of [client?.componentFile, client?.routeFile]) {
    if (file && !SHARED.has(file) && fs.existsSync(file)) paths.add(file);
  }
  for (const file of tracked) {
    if (SHARED.has(file)) continue;
    const base = file.slice(file.lastIndexOf("/") + 1);
    if (file.includes(`/${slug}/`) || base.startsWith(`${slug}.`) || base === `portfolio.${slug}.tsx`) {
      paths.add(file);
    }
  }
  return [...paths];
}

const projects = {};
for (const { slug } of catalog) {
  const paths = projectPaths(slug);
  if (!paths.length) continue;
  const log = git("log", "--format=%aI", "--", ...paths).split("\n").filter(Boolean);
  if (!log.length) continue;
  const stamps = log.map((d) => new Date(d).toISOString()).sort();
  projects[slug] = { createdAt: stamps[0], updatedAt: stamps[stamps.length - 1] };
}

const sorted = Object.fromEntries(Object.entries(projects).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(
  OUT,
  `${JSON.stringify({ source: "git-author-date", note: "Gerado por scripts/build-portfolio-project-dates.mjs; não editar à mão.", projects: sorted }, null, 2)}\n`,
);
const missing = catalog.map((i) => i.slug).filter((slug) => !sorted[slug]);
console.log(`Datas reais gravadas para ${Object.keys(sorted).length}/${catalog.length} projetos.`);
if (missing.length) console.warn(`Sem data: ${missing.join(", ")}`);
