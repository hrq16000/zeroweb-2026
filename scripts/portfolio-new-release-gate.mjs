#!/usr/bin/env node
/**
 * Gate de publicação de novos /portfolio/:slug.
 * A transição para published também é nova publicação.
 * Falha fechado quando os refs Git não podem ser comparados.
 */
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const CATALOG = "src/config/portfolio-catalog.json";
const CLIENTS = "src/config/portfolio-clients.json";
const MANIFESTS = "src/config/portfolio-project-manifests.json";

const rows = (data) => Array.isArray(data) ? data : (data?.projects ?? []);
const entries = (data) => Array.isArray(rows(data)) ? rows(data) : Object.values(rows(data));

export function newlyPublishedPortfolios(before, after) {
  const previouslyPublished = new Set(
    entries(before).filter((p) => p?.status === "published").map((p) => p.slug),
  );
  return [...new Set(
    entries(after).filter((p) =>
      p?.status === "published" && !previouslyPublished.has(p.slug)
    ).map((p) => p.slug),
  )].sort();
}

export function mergePortfolioScopes(existing, incoming) {
  return [...new Set(
    [existing, incoming]
      .flatMap((value) => String(value ?? "").split(","))
      .map((slug) => slug.trim())
      .filter(Boolean),
  )].sort().join(",");
}

export function validateNewPortfolioRelease(slugs, clients, manifests) {
  const knownClients = new Map(entries(clients).map((p) => [p.slug, p]));
  const projects = manifests?.projects ?? {};
  const errors = [];
  for (const slug of slugs) {
    if (!/^[a-z0-9][a-z0-9_-]{0,80}$/.test(slug ?? "")) {
      errors.push(String(slug) + ": slug de publicação inválido");
      continue;
    }
    const client = knownClients.get(slug);
    if (!client?.componentFile || !client?.routeFile || !client?.clientKey) {
      errors.push(slug + ": catálogo publicado sem cliente, rota ou componente canônico");
    }
    const manifest = projects[slug];
    if (!manifest || Number(manifest.lifecycleContract ?? 0) < 1) {
      errors.push(slug + ": publicação nova sem manifesto de lifecycle gerenciado");
    }
  }
  return errors;
}

function gitJson(sha, file) {
  if (!/^[0-9a-f]{40}$/i.test(String(sha ?? "")) || /^0{40}$/.test(sha)) {
    throw new Error("referência Git inválida para " + file + ": " + (sha ?? "ausente"));
  }
  return JSON.parse(execFileSync("git", ["show", sha + ":" + file], {
    encoding: "utf8",
    maxBuffer: 12 * 1024 * 1024,
  }));
}

const invokedAsScript = process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (invokedAsScript) {
  try {
    const [mode, base, head] = process.argv.slice(2);
    if (mode === "--merge") {
      process.stdout.write(mergePortfolioScopes(base, head));
    } else if (mode === "--check" || mode === "--slugs") {
      const slugs = newlyPublishedPortfolios(gitJson(base, CATALOG), gitJson(head, CATALOG));
      const errors = validateNewPortfolioRelease(slugs, gitJson(head, CLIENTS), gitJson(head, MANIFESTS));
      if (errors.length) throw new Error(errors.join("\n"));
      if (mode === "--slugs") process.stdout.write(slugs.join(","));
      else console.log("[new-portfolio-gate] OK — " + slugs.length +
        " nova(s) publicação(ões): " + (slugs.join(", ") || "nenhuma") +
        ". Lighthouse/axe/visual/funis são obrigatórios antes do merge.");
    } else {
      throw new Error("Uso: --check BASE HEAD | --slugs BASE HEAD | --merge csv csv");
    }
  } catch (error) {
    console.error("[new-portfolio-gate] FAIL — " + error.message);
    process.exitCode = 1;
  }
}
