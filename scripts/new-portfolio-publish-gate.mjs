#!/usr/bin/env node
/**
 * Fail-closed: somente novas publicações (novo slug ou promoção a published).
 * Projetos já publicados não são retestados aqui: continuam nos gates atuais.
 *
 * Nunca cria baseline, nunca aprova hash e nunca afirma "indexado no Google".
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, appendFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const CATALOG = "src/config/portfolio-catalog.json";
const CLIENTS = "src/config/portfolio-clients.json";
const MANIFESTS = "src/config/portfolio-project-manifests.json";
const VIEWPORTS = ["desktop", "tablet", "mobile"];
const SITE_CORE_GATES = [
  "PORTFOLIO_INDIVIDUAL_SITE_GATE",
  "PORTFOLIO_ENTITY_GATE",
  "PORTFOLIO_DISCOVERY_GRAPH_GATE",
  "PORTFOLIO_INDEXABILITY_GATE",
];

export function publishedCandidates(baseCatalog, nextCatalog, baseClients = [], nextClients = []) {
  const before = new Map(baseCatalog.map((p) => [p.slug, p]));
  const oldClients = new Set(baseClients.map((p) => p.slug));
  const newClients = new Set(nextClients.map((p) => p.slug));
  return [...new Set(nextCatalog.filter((p) => {
    if (p.status !== "published") return false;
    const old = before.get(p.slug);
    return !old || old.status !== "published" ||
      (!oldClients.has(p.slug) && newClients.has(p.slug));
  }).map((p) => p.slug))].sort();
}

export function validatePublication(slug, catalog, clients, manifests, hasFile = existsSync) {
  const errors = [];
  const item = catalog.find((p) => p.slug === slug);
  const client = clients.find((c) => c.slug === slug);
  const manifest = manifests?.projects?.[slug];

  if (!item || item.status !== "published") errors.push("catálogo não publicado ou ausente");
  if (!client) errors.push("cliente não registrado");
  if (item && client && item.clientKey !== client.clientKey)
    errors.push("clientKey do catálogo diverge do cadastro");
  if (client && client.contactMode !== "funnelOnly")
    errors.push("novo cliente deve declarar contactMode=funnelOnly");
  if (client && (!client.componentFile || !hasFile(resolve(client.componentFile))))
    errors.push("componente exclusivo do cliente ausente");
  if (!item?.title || String(item.summary ?? "").trim().length < 80)
    errors.push("título próprio e resumo factual com pelo menos 80 caracteres são obrigatórios");

  if (!manifest) {
    errors.push("manifesto de ciclo de vida ausente");
  } else {
    if (manifest.stage !== "published") errors.push("manifesto não está na fase published");
    if (Number(manifest.contractVersion) < 4) errors.push("contrato individual v4 ausente");
    if (manifest.lifecycle?.qa !== "complete" || manifest.lifecycle?.publish !== "complete")
      errors.push("etapas qa/publish não concluídas");
    if (manifest.visualQa?.status !== "PASS")
      errors.push("visualQa precisa ser PASS com revisão humana");
    const contract = manifest.individualSiteContract;
    for (const gate of SITE_CORE_GATES) {
      if (contract?.gates?.[gate] !== "complete" ||
          !Array.isArray(contract?.evidence?.[gate]) ||
          contract.evidence[gate].length === 0)
        errors.push(gate + ": complete com evidência obrigatória");
    }
  }

  // O comparador legado gera baseline ausente; proibido considerar isso QA verde.
  for (const viewport of VIEWPORTS) {
    if (!hasFile(resolve("tests/visual/baseline", slug + "-" + viewport + ".png")))
      errors.push("baseline " + viewport + " ausente (revisar, versionar antes de publicar)");
  }
  return errors;
}

function gitJson(ref, file) {
  const result = spawnSync("git", ["show", ref + ":" + file], { encoding: "utf8" });
  if (result.status !== 0) throw Error("Não foi possível ler " + file + " no commit base " + ref);
  return JSON.parse(result.stdout);
}

function currentJson(file) {
  return JSON.parse(readFileSync(resolve(file), "utf8"));
}

function readiness(slug) {
  const result = spawnSync("node",
    ["scripts/check-portfolio-project-readiness.mjs", "--slug=" + slug, "--json"],
    { encoding: "utf8", env: { ...process.env, PORTFOLIO_READINESS_ENFORCE: "1" } });
  if (result.status !== 0) return [result.stderr || result.stdout || "readiness falhou"];
  try {
    const report = JSON.parse(result.stdout);
    const check = report.results?.find((r) => r.slug === slug);
    if (check?.status === "READY" && !check.blockers?.length) return [];
    return check?.blockers?.length ? check.blockers : ["readiness não retornou READY para " + slug];
  } catch {
    return ["readiness retornou JSON inválido"];
  }
}

function main() {
  const base = process.argv.find((x) => x.startsWith("--base="))?.slice(7);
  const output = process.argv.find((x) => x.startsWith("--output="))?.slice(9);
  if (!base || !/^[a-f0-9]{40}$/.test(base))
    throw Error("Informe --base=<SHA Git completo> para comparar com a base da PR");

  const catalog = currentJson(CATALOG);
  const clients = currentJson(CLIENTS);
  const manifests = currentJson(MANIFESTS);
  const slugs = publishedCandidates(
    gitJson(base, CATALOG), catalog, gitJson(base, CLIENTS), clients,
  );

  const violations = [];
  for (const slug of slugs) {
    for (const error of [...validatePublication(slug, catalog, clients, manifests), ...readiness(slug)])
      violations.push(slug + ": " + error);
  }

  if (output) appendFileSync(output, "slugs=" + slugs.join(",") + "\n");
  if (violations.length) {
    console.error("[new-portfolio-publish] BLOQUEADO — " + violations.length + " violação(ões):");
    for (const v of violations) console.error("- " + v);
    process.exitCode = 1;
  } else if (slugs.length) {
    console.log("[new-portfolio-publish] READY — exigir Lighthouse + funis + 3 viewports: " + slugs.join(", "));
  } else {
    console.log("[new-portfolio-publish] Nenhuma nova publicação; gates existentes permanecem ativos.");
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try { main(); } catch (err) { console.error("[new-portfolio-publish] " + err.message); process.exitCode = 1; }
}
