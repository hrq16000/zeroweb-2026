#!/usr/bin/env node
/**
 * Resolve o menor escopo SEGURO para gates funcionais de portfolio
 * (popup/funil). Só retorna slugs quando toda mudança de runtime relevante
 * pertence a portfolios individuais registrados.
 *
 * Arquivos de testes/docs e infraestrutura visual sem efeito no app podem
 * coexistir sem ampliar o escopo. Qualquer fonte compartilhada, rota, config,
 * dependência ou ativo não atribuível retorna [] => gate global.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

function normalize(file) {
  return String(file ?? "").trim().replace(/\\/g, "/");
}

function isNonRuntimeEvidence(file) {
  return (
    file.startsWith("tests/") ||
    file.startsWith("docs/") ||
    file === "README.md" ||
    file === "AGENTS.md" ||
    file === "scripts/playwright-visual-regression.mjs" ||
    file === "scripts/visual-screenshot-integrity.mjs"
  );
}

export function resolvePortfolioRuntimeScope(files, clients) {
  const byComponent = new Map(
    clients
      .filter((client) => client?.componentFile && client?.slug)
      .map((client) => [normalize(client.componentFile), client.slug]),
  );
  const knownSlugs = new Set(clients.map((client) => client?.slug).filter(Boolean));
  const scoped = new Set();
  let sawClientRuntime = false;

  for (const raw of files) {
    const file = normalize(raw);
    if (!file || isNonRuntimeEvidence(file)) continue;

    const componentSlug = byComponent.get(file);
    if (componentSlug) {
      scoped.add(componentSlug);
      sawClientRuntime = true;
      continue;
    }

    const assetMatch = file.match(/^public\/images\/([^/]+)\//);
    if (assetMatch && knownSlugs.has(assetMatch[1])) {
      scoped.add(assetMatch[1]);
      sawClientRuntime = true;
      continue;
    }

    // Conservador: qualquer outro arquivo pode alterar runtime compartilhado,
    // registro, rota, destino, build ou mecanismos protegidos.
    return [];
  }

  return sawClientRuntime ? [...scoped].sort() : [];
}

const invokedAsScript =
  process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (invokedAsScript) {
  const clients = JSON.parse(
    readFileSync(resolve(process.cwd(), "src/config/portfolio-clients.json"), "utf8"),
  );
  const input = readFileSync(0, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  process.stdout.write(resolvePortfolioRuntimeScope(input, clients).join(","));
}
