#!/usr/bin/env node
/**
 * Resolve o menor escopo seguro para regressão visual.
 *
 * Retorna uma lista CSV de slugs somente quando TODOS os arquivos visuais
 * relevantes pertencem a portfolios individuais registrados. Se houver
 * componente compartilhado, rota, CSS global, ativo não resolvido ou qualquer
 * outra superfície visual ampla, retorna string vazia => gate global.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

function normalize(file) {
  return String(file ?? "").trim().replace(/\\/g, "/");
}

function isBroadVisualFile(file) {
  return (
    file.startsWith("src/components/") ||
    file.startsWith("src/pages/") ||
    file.startsWith("src/styles/") ||
    file.startsWith("src/assets/") ||
    file.startsWith("src/routes/") ||
    file.startsWith("public/") ||
    /\.(?:css|scss)$/.test(file) ||
    /^tailwind/.test(file) ||
    /^vite\.config/.test(file) ||
    file === "bun.lock"
  );
}

export function resolveVisualRegressionScope(files, clients) {
  const byComponent = new Map(
    clients
      .filter((client) => client?.componentFile && client?.slug)
      .map((client) => [normalize(client.componentFile), client.slug]),
  );
  const knownSlugs = new Set(clients.map((client) => client?.slug).filter(Boolean));
  const scoped = new Set();
  let sawVisualFile = false;

  for (const raw of files) {
    const file = normalize(raw);
    if (!file) continue;

    const componentSlug = byComponent.get(file);
    if (componentSlug) {
      sawVisualFile = true;
      scoped.add(componentSlug);
      continue;
    }

    const assetMatch = file.match(/^public\/images\/([^/]+)\//);
    if (assetMatch && knownSlugs.has(assetMatch[1])) {
      sawVisualFile = true;
      scoped.add(assetMatch[1]);
      continue;
    }

    if (isBroadVisualFile(file)) {
      // Há impacto visual que não pode ser atribuído com segurança a um único
      // portfolio. String vazia preserva o comportamento global existente.
      return [];
    }
  }

  return sawVisualFile ? [...scoped].sort() : [];
}

const invokedAsScript =
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (invokedAsScript) {
  const clients = JSON.parse(
    readFileSync(resolve(process.cwd(), "src/config/portfolio-clients.json"), "utf8"),
  );
  const input = readFileSync(0, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  process.stdout.write(resolveVisualRegressionScope(input, clients).join(","));
}
