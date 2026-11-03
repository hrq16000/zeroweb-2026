#!/usr/bin/env node
/**
 * Pré-voo barato, read-only e em lote para /portfolio.
 *
 * NÃO altera o catálogo nem publica nada; NÃO substitui os gates completos,
 * browser E2E, autorização de imagens, autenticação, SEO em produção ou teste
 * real de lead -> token -> WhatsApp. Nunca mostra contatos operacionais.
 *
 * Uso:
 *   node scripts/portfolio-batch-preflight.mjs --slug dona-garimpeira-brecho
 *   node scripts/portfolio-batch-preflight.mjs --all --strict
 *   node scripts/portfolio-batch-preflight.mjs --input docs/portfolio/prospects.json --json
 *   node scripts/portfolio-batch-preflight.mjs --all --check-global
 *   node scripts/portfolio-batch-preflight.mjs --all --fix-derived
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SLUG = /^[a-z0-9][a-z0-9_-]{0,80}$/;
const SAFE = new Set(["draft", "published", "approved", "archived"]);
const PUBLIC = new Set(["published", "approved"]);

function readJson(root, file, fallback) {
  const abs = resolve(root, file);
  return existsSync(abs) ? JSON.parse(readFileSync(abs, "utf8")) : fallback;
}
function readText(root, file) {
  const abs = resolve(root, file);
  return existsSync(abs) ? readFileSync(abs, "utf8") : "";
}
function own(obj, key) {
  return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
}
function normalizeSlug(input) {
  return String(input ?? "").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 81);
}
export function buildContext(root = ROOT) {
  const catalog = readJson(root, "src/config/portfolio-catalog.json", []);
  const clients = readJson(root, "src/config/portfolio-clients.json", []);
  const formContexts = readJson(root, "src/config/portfolio-funnel-context.json", {});
  const shareCopy = readJson(root, "src/config/portfolio-share-copy.json", {});
  const contacts = readJson(root, "src/config/portfolio-whatsapp.json", {}).contacts ?? {};
  const destinationLedger = readJson(root, "src/config/portfolio-funnel-destinations.json", {}).entries ?? {};
  const seed = readJson(root, "src/config/portfolio-admin-seed.json", {}).projects ?? [];
  const mediaCache = new Map();
  return {
    catalog, clients, formContexts, shareCopy, contacts, destinationLedger, seed,
    legacySlugs: new Set(readJson(root, "src/config/portfolio-legacy-baseline.json", {}).slugs ?? []),
    siteRegistry: readText(root, "src/lib/portfolio-site-registry.ts"),
    compositionRegistry: readText(root, "src/components/portfolio/composition/registry.ts"),
    getMedia(slug) {
      if (!mediaCache.has(slug)) {
        mediaCache.set(slug, readJson(root, "docs/portfolio/media-plans/" + slug + ".json", null));
      }
      return mediaCache.get(slug);
    },
  };
}

/** Reporta pendências em vez de interromper no primeiro erro.
 * BLOCK: impede considerar publicável. WARN: precisa verificação humana.
 * Uma saída "candidate" significa apenas apto a executar os gates reais.
 */
export function diagnosePortfolio(slug, context) {
  if (!SLUG.test(slug)) throw new Error("slug inválido: " + slug);
  const issues = [];
  const add = (severity, code, message, action) =>
    issues.push({ severity, code, message, action });
  const cat = context.catalog.find((x) => x.slug === slug);
  if (!cat) {
    add("BLOCK", "ENTITY_NOT_ONBOARDED", "Negócio ausente do catálogo versionado.",
      "Iniciar pesquisa R1, brief e scaffold em draft; não publicar entidade sem evidência.");
    return { slug, stage: "NOT_STARTED", issues };
  }
  if (!SAFE.has(cat.status)) {
    add("BLOCK", "INVALID_STATUS", "Estado de catálogo não reconhecido.", "Definir draft ou published conforme gates.");
  }
  const publicPage = PUBLIC.has(cat.status);
  const level = publicPage ? "BLOCK" : "WARN";
  const client = context.clients.find((x) => x.slug === slug);
  const frozen = context.legacySlugs?.has(slug) ?? false;
  const mediaLevel = publicPage && !frozen ? "BLOCK" : "WARN";
  if (!client) {
    add(level, "CLIENT_RECORD", "Não há cadastro completo de cliente em portfolio-clients.json.",
      "Completar ciclo de vida, brief e registro de cliente antes de ativar published.");
  } else if (client.clientKey !== cat.clientKey) {
    add("BLOCK", "CLIENT_KEY_DRIFT", "clientKey diverge entre catálogo e cliente.",
      "Corrigir origem da chave; nunca herdar o WhatsApp de outro cliente.");
  }
  const matching = context.catalog.filter((x) => x.slug === slug);
  if (matching.length !== 1) {
    add("BLOCK", "CATALOG_DUPLICATE", "Slug duplicado no catálogo.", "Preservar exatamente uma entidade por slug.");
  }
  if (!Array.isArray(cat.tags) || cat.tags.length === 0 || !cat.title || !cat.city || !cat.state) {
    add(level, "ENTITY_FIELDS", "Entidade, tags ou localização incompletas.",
      "Completar fatos confirmados e registrar fonte, sem inventar informações.");
  }
  // O registry inclui entradas tanto inline quanto em várias linhas.
  // Avaliar somente o bloco da entidade, não outra ocorrência no arquivo.
  const at = context.siteRegistry.indexOf('slug: "' + slug + '"');
  const closeAt = at < 0 ? -1 : context.siteRegistry.indexOf("}", at);
  const entry = at >= 0 && closeAt > at ? context.siteRegistry.slice(at, closeAt + 1) : "";
  const individual = at >= 0;
  const isIndexable = /\\bindexable:\\s*true\\b/.test(entry);
  if (!individual && (!client || client.routeFile?.includes("portfolio.$slug.tsx"))) {
    add(level, "ROUTE_REGISTRY", "Slug ainda não consta no registro da rota individual.",
      "Registrar site/rota e verificar SSR/404, sem expor scaffold.");
  } else if (individual && publicPage && !isIndexable) {
    add("BLOCK", "ROUTE_NOINDEX", "Catálogo publicado, mas registro de rota não indexável.",
      "Concluir SEO, canonical e gates de publicação antes de liberar.");
  } else if (!publicPage && isIndexable) {
    add("WARN", "DRAFT_PUBLIC_ROUTE", "Catálogo em draft e rota marcada indexável; estados não são equivalentes.",
      "Conferir decisão editorial: draft oculto da galeria pode continuar acessível pela URL.");
  }
  if (!frozen && !context.compositionRegistry.includes('"' + slug + '"')) {
    add(level, "COMPOSITION", "Composição autoral ausente do registry.",
      "Concluir brief e registrar composição individual, sem copiar outro portfólio.");
  }
  const share = context.shareCopy[slug];
  const canonical = "https://0web.com.br/portfolio/" + slug;
  if (typeof share !== "string" || share.trim().length < 120 ||
      !share.split(/\r?\n/).some((line) => line.trim() === canonical) ||
      !share.trim().endsWith("#0WEB")) {
    add(level, "SHARE_COPY", "Divulgação individual ausente ou fora do contrato.",
      "Incluir texto factual >=120 caracteres, URL canônica isolada e hashtag final #0WEB.");
  }
  if (!own(context.formContexts, slug)) {
    add(level, "FUNNEL_CONTEXT", "Intenção e narrativa de conversão ainda não configuradas.",
      "Definir intenção e próximo passo específico do negócio.");
  }
  const contactPresent = Boolean(context.contacts[cat.clientKey]?.whatsapp);
  const destination = context.destinationLedger[cat.clientKey];
  if (contactPresent && !destination) {
    add(frozen ? "WARN" : "BLOCK", "CONTACT_LEDGER", "Contato versionado sem proveniência do destino.",
      "Registrar evidência/autorização do destino exclusivo; não expor número no bundle.");
  } else if (contactPresent && destination && destination.status !== "VERIFIED") {
    add("WARN", "CONTACT_UNVERIFIED", "Destino configurado, mas não há verificação conclusiva de atendimento.",
      "Validar lead persistido -> token exclusivo -> WhatsApp no domínio publicado.");
  } else if (!contactPresent) {
    add("WARN", "LEAD_ONLY", "Sem destino WhatsApp versionado para este cliente.",
      "Validar modo lead-only ou obter contato confirmado; nunca usar fallback da 0WEB.");
  }
  const seed = context.seed.find((x) => x.slug === slug);
  if (!seed) {
    add(level, "ADMIN_SEED_MISSING", "O painel não tem projeção derivada deste slug.",
      "Executar bun run build:portfolio-admin-seed e versionar artefato regenerado.");
  } else if (Boolean(seed.published) !== publicPage) {
    add("BLOCK", "ADMIN_SEED_STALE", "O estado do seed do painel diverge do catálogo.",
      "Regenerar seed via bun run build:portfolio-admin-seed; não editar o JSON derivado à mão.");
  }
  const media = context.getMedia?.(slug) ?? null;
  if (!media) {
    add(mediaLevel, "MEDIA_PLAN_MISSING", "Sem inventário/proveniência de mídia.",
      "Pesquisar fontes oficiais e criar media plan; nunca inventar fotos de fachada, equipe ou peças.");
  } else {
    const hasRealMedia = Array.isArray(media.inventory?.realBusinessPhotos) &&
      media.inventory.realBusinessPhotos.length > 0;
    if (!hasRealMedia) {
      add(mediaLevel, "REAL_MEDIA_PENDING", "Nenhuma fotografia real de negócio registrada no inventário.",
        "Obter fotos oficiais autorizadas; preservar a página e manter draft enquanto faltar aprovação.");
    }
    if (media.mediaApprovalGate?.status === "BLOCKED") {
      add(mediaLevel, "MEDIA_APPROVAL", "Plano de mídia registra aprovação bloqueada.",
        "Resolver pendências oficiais (logo, capa, origem, direitos) sem desabilitar gates.");
    }
  }
  const blocks = issues.filter((x) => x.severity === "BLOCK").length;
  const stage = publicPage ? blocks ? "BLOCKED_PUBLISHED" : "CANDIDATE_FOR_FULL_GATES" : "DRAFT_PENDING";
  return { slug, title: cat.title, catalogStatus: cat.status, stage, blocks, warnings: issues.length - blocks, issues };
}

function resolveSlugs(argv, ctx) {
  const arg = (name) => {
    const i = argv.indexOf(name);
    return i < 0 ? null : argv[i + 1];
  };
  const single = arg("--slug");
  const file = arg("--input");
  let values = [];
  if (single) values.push(single);
  if (file) {
    // Somente JSON local; não aceitar URL, segredo ou número de telefone.
    const arr = JSON.parse(readFileSync(resolve(process.cwd(), file), "utf8"));
    if (!Array.isArray(arr)) throw new Error("--input exige um array JSON");
    values.push(...arr.map((item) => typeof item === "string" ? item : item?.slug ?? normalizeSlug(item?.name)));
  }
  if (argv.includes("--all")) values.push(...ctx.catalog.map((x) => x.slug));
  if (values.length === 0) {
    throw new Error("Uso: --slug <slug> | --all | --input <array.json> [--json] [--strict] [--check-global] [--fix-derived]");
  }
  values = [...new Set(values)];
  if (values.length > 1000 || values.some((slug) => !SLUG.test(slug))) {
    throw new Error("Arquivo de entrada maior que 1000 itens ou com slug inválido.");
  }
  return values;
}

function checkGlobal(root) {
  const commands = [
    ["catálogo", "scripts/validate-portfolio-catalog.mjs"],
    ["conversão", "scripts/validate-portfolio-conversion-profiles.mjs"],
    ["região", "scripts/validate-portfolio-regional.mjs"],
    ["logos", "scripts/validate-portfolio-logos.mjs"],
    ["identidade/papelaria", "scripts/validate-portfolio-presence-kit.mjs"],
    ["seed admin", "scripts/build-portfolio-admin-seed.mjs", "--check"],
  ];
  return commands.map(([name, script, flag]) => {
    const proc = spawnSync(process.execPath, [script, ...(flag ? [flag] : [])], {
      cwd: root, encoding: "utf8", timeout: 120000, maxBuffer: 1024 * 1024 * 2,
    });
    return {
      name, ok: proc.status === 0,
      message: (proc.stderr || proc.stdout || proc.error?.message || "")
        .split("\n").filter(Boolean).slice(-9).join("\n"),
    };
  });
}

async function main(argv) {
  const json = argv.includes("--json");
  const root = process.cwd();
  if (argv.includes("--fix-derived")) {
    const run = spawnSync(process.execPath, ["scripts/build-portfolio-admin-seed.mjs"], {
      cwd: root, encoding: "utf8",
    });
    if (run.status !== 0) throw new Error("Regeneração do seed falhou: " + (run.stderr || run.stdout));
  }
  const ctx = buildContext(root);
  const slugs = resolveSlugs(argv, ctx);
  const results = slugs.map((slug) => diagnosePortfolio(slug, ctx));
  const global = argv.includes("--check-global") ? checkGlobal(root) : [];
  const summary = {
    inspected: results.length,
    publishedBlocked: results.filter((x) => x.stage === "BLOCKED_PUBLISHED").length,
    publishedCandidates: results.filter((x) => x.stage === "CANDIDATE_FOR_FULL_GATES").length,
    drafts: results.filter((x) => x.stage === "DRAFT_PENDING").length,
    notStarted: results.filter((x) => x.stage === "NOT_STARTED").length,
    globalFailed: global.filter((x) => !x.ok).length,
  };
  if (json) {
    console.log(JSON.stringify({ summary, results, global, disclaimer: "Preflight não substitui teste real de funil, SSR, QA visual, CI ou publicação." }, null, 2));
  } else {
    console.log("[portfolio-preflight] " + JSON.stringify(summary));
    for (const r of results) {
      if (results.length > 20 && r.issues.every((i) => i.severity !== "BLOCK")) continue;
      console.log("\n" + r.slug + ": " + r.stage + " (" + r.issues.length + " pendência(s))");
      for (const issue of r.issues) {
        console.log("  [" + issue.severity + "] " + issue.code + ": " + issue.message);
        if (results.length <= 20) console.log("    -> " + issue.action);
      }
    }
    for (const g of global) console.log("\n[global:" + (g.ok ? "PASS" : "FAIL") + "] " + g.name + "\n" + g.message);
    console.log("\nPreflight é diagnóstico barato; publicar requer gates completos + verificação no domínio real.");
  }
  if (argv.includes("--strict") && (summary.publishedBlocked || summary.globalFailed || summary.notStarted)) process.exitCode = 1;
}

const cli = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (cli) main(process.argv.slice(2)).catch((error) => {
  console.error("[portfolio-preflight] " + error.message);
  process.exitCode = 2;
});
