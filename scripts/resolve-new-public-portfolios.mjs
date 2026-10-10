#!/usr/bin/env node
/**
 * Detecta a primeira publicação de um portfolio no catálogo oficial.
 *
 * Escopo:
 * - slug novo que já nasce published;
 * - slug existente que muda de draft/archived para published.
 *
 * Não considera edição de descrição, imagem, status já published etc.
 * O CSV é consumido por Lighthouse/visual/E2E para impedir que um novo
 * portfolio fique sem medição quando o PR altera só arquivos de catálogo.
 *
 * Uso: node scripts/resolve-new-public-portfolios.mjs --base SHA --head SHA
 *      node scripts/resolve-new-public-portfolios.mjs --base SHA --head SHA --check
 */
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const CATALOG = "src/config/portfolio-catalog.json";
const CLIENTS = "src/config/portfolio-clients.json";
const MANIFESTS = "src/config/portfolio-project-manifests.json";

function records(value, label) {
  const rows = Array.isArray(value) ? value : value?.projects;
  if (!Array.isArray(rows)) throw new Error(`${label}: esperado array de projetos`);
  const seen = new Set();
  for (const row of rows) {
    if (!row || typeof row.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.slug)) {
      throw new Error(`${label}: slug ausente/inválido`);
    }
    if (seen.has(row.slug)) throw new Error(`${label}: slug duplicado ${row.slug}`);
    seen.add(row.slug);
  }
  return rows;
}

export function getNewPublicPortfolioSlugs(previous, next) {
  const before = new Map(records(previous, "catálogo base").map((row) => [row.slug, row]));
  return records(next, "catálogo head")
    .filter((row) => row.status === "published" && before.get(row.slug)?.status !== "published")
    .map((row) => row.slug)
    .sort();
}

export function assertNewPublicPortfolioContracts(slugs, clients, manifests) {
  const clientSlugs = new Set(records(clients, "clients").map((c) => c.slug));
  const projects = manifests?.projects ?? {};
  if (!projects || typeof projects !== "object" || Array.isArray(projects)) {
    throw new Error("manifests: projects inválido");
  }
  for (const slug of slugs) {
    if (!clientSlugs.has(slug)) throw new Error(`[${slug}] novo published sem cliente registrado`);
    if (!Object.hasOwn(projects, slug)) throw new Error(`[${slug}] novo published sem manifesto gerenciado`);
  }
  return slugs;
}

function gitJson(ref, file) {
  // git recebe argumentos separados, não há shell/eval.
  const result = spawnSync("git", ["show", `${ref}:${file}`], {
    encoding: "utf8",
    maxBuffer: 12 * 1024 * 1024,
  });
  if (result.status !== 0) {
    throw new Error(`não foi possível ler ${file} em ${ref}: ${result.stderr?.trim()}`);
  }
  return JSON.parse(result.stdout);
}

function flag(name) {
  const i = process.argv.findIndex((arg) => arg === name);
  return i >= 0 ? process.argv[i + 1] : process.argv.find((arg) => arg.startsWith(`${name}=`))?.slice(name.length + 1);
}

const invokedAsScript = process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (invokedAsScript) {
  try {
    const base = flag("--base");
    const head = flag("--head");
    if (!base || !head || !/^[a-f0-9]{40}$/i.test(base) || !/^[a-f0-9]{40}$/i.test(head)) {
      throw new Error("uso: --base SHA40 --head SHA40 [--check]");
    }
    const slugs = getNewPublicPortfolioSlugs(gitJson(base, CATALOG), gitJson(head, CATALOG));
    if (process.argv.includes("--check")) {
      assertNewPublicPortfolioContracts(slugs, gitJson(head, CLIENTS), gitJson(head, MANIFESTS));
      console.error(`[new-public-portfolio] OK: ${slugs.length} publicação(ões) nova(s): ${slugs.join(", ") || "nenhuma"}`);
    }
    process.stdout.write(slugs.join(","));
  } catch (error) {
    console.error(`[new-public-portfolio] FAIL: ${error.message}`);
    process.exitCode = 1;
  }
}
