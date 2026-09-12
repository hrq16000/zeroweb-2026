#!/usr/bin/env node
/**
 * Readiness gate do ciclo de vida oficial de /portfolio/:slug.
 *
 * Documento mestre: docs/PORTFOLIO_PROJECT_LIFECYCLE.md
 *
 * LEGADO PROTEGIDO: só avalia slugs com manifesto em
 * src/config/portfolio-project-manifests.json (lifecycleContract >= 1).
 * Projetos antigos continuam sob os gates existentes.
 *
 * Uso:
 *   node scripts/check-portfolio-project-readiness.mjs
 *   node scripts/check-portfolio-project-readiness.mjs --slug=carecas-infotec
 *   node scripts/check-portfolio-project-readiness.mjs --json
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateProjectQuality } from "./check-portfolio-landing-quality.mjs";
import { evaluateFunnelDestination } from "./lib/funnel-destination-gate.mjs";


const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const asJson = args.includes("--json");
const onlySlug = args.find((a) => a.startsWith("--slug="))?.split("=")[1];

const read = (p) => (existsSync(path.resolve(root, p)) ? readFileSync(path.resolve(root, p), "utf8") : "");
const readJson = (p, fallback) => {
  const raw = read(p);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const manifestFile = readJson("src/config/portfolio-project-manifests.json", { projects: {} });
const manifests = manifestFile.projects ?? {};
const clients = readJson("src/config/portfolio-clients.json", []);
const catalogRaw = readJson("src/config/portfolio-catalog.json", []);
const catalog = catalogRaw.projects ?? catalogRaw;
const catalogBySlug = new Map(catalog.map((p) => [p.slug, p]));
const discovery = readJson("src/config/portfolio-discovery.json", { projects: {} }).projects ?? {};
const blueprintRegistry = read("src/components/portfolio/blueprint/registry.ts");
const routeSource = read("src/routes/portfolio.$slug.tsx");

const SATISFIED = new Set(["complete", "not_applicable"]);
const VALID_STATES = new Set(["not_started", "in_progress", "complete", "blocked", "not_applicable"]);
const STEPS = [
  "intake",
  "entityDiscovery",
  "entityResolution",
  "evidence",
  "media",
  "mediaPlan",
  "content",
  "discovery",
  "blueprint",
  "seo",
  "funnel",
  "cover",
  "qa",
  "publish",
];

/** Etapas que, se não pesquisadas, reprovam mesmo com dado ausente. */
const RESEARCH_STEPS = ["entityDiscovery", "entityResolution", "evidence", "media"];

const COVER_STRATEGIES = [
  "REAL_PHOTO",
  "BRAND_LED",
  "SERVICE_LED",
  "PRODUCT_LED",
  "HYBRID",
  "GENERATED_EDITORIAL",
];
const RESOLUTION_OK = new Set(["RESOLVED", "VERIFIED", "resolved", "verified"]);
const VISUAL_QA = new Set(["PASS", "FAIL", "NOT_EXECUTED", "BLOCKED_ENVIRONMENT"]);

function evaluate(slug, manifest) {
  const blockers = [];
  const warnings = [];
  const checks = {};

  const project = catalogBySlug.get(slug);
  const client = clients.find((c) => c.slug === slug);
  const published = project?.status === "published";

  // --- estrutura do manifesto
  for (const step of STEPS) {
    const state = manifest.lifecycle?.[step];
    if (!VALID_STATES.has(state)) blockers.push(`manifesto: etapa "${step}" com estado inválido (${state ?? "ausente"})`);
  }

  // --- entityResearchDone
  const enrichmentPath = `docs/portfolio/enrichment/${slug}.json`;
  const enrichment = readJson(enrichmentPath, null);
  checks.entityResearchDone = Boolean(enrichment?.researchLedger);
  if (!checks.entityResearchDone) blockers.push(`entity research ausente: ${enrichmentPath} sem researchLedger`);
  else {
    const notSearched = Object.entries(enrichment.researchLedger)
      .filter(([, v]) => v && v.searched === false)
      .map(([k]) => k);
    if (notSearched.length) {
      // searched=false NUNCA conclui a etapa (ausência de dado é válida;
      // ausência de pesquisa não é).
      checks.entityResearchDone = false;
      blockers.push(`pesquisa não realizada: ${notSearched.join(", ")}`);
    }
  }
  for (const step of RESEARCH_STEPS) {
    const state = manifest.lifecycle?.[step];
    if (state === "not_started") blockers.push(`pesquisa não realizada: ${step} = not_started`);
  }

  // --- entityResolutionRecorded (FOUND/RESOLVED/VERIFIED/UNRESOLVED/CONFLICT)
  const resolutionStatus =
    enrichment?.entity?.resolutionStatus ?? enrichment?.entityResolution?.status ?? enrichment?.google?.status ?? null;
  checks.entityResolutionRecorded = Boolean(resolutionStatus);
  if (!resolutionStatus) blockers.push("entity resolution não registrada (FOUND/RESOLVED/VERIFIED/UNRESOLVED/CONFLICT)");
  else if (String(resolutionStatus).toUpperCase() === "CONFLICT") blockers.push("entity resolution em CONFLICT: homônimos não desambiguados");
  else if (!RESOLUTION_OK.has(resolutionStatus)) {
    const justified = enrichment?.entity?.unresolvedJustification ?? enrichment?.notes?.unresolvedJustification;
    if (justified) warnings.push(`entidade não resolvida com justificativa registrada: ${justified}`);
    else blockers.push(`entity resolution pendente (${resolutionStatus}) e sem justificativa registrada`);
  }

  // --- enrichmentExecuted: pesquisa profunda ocorreu e ficou persistida (cache/custo)
  const serpSnapshot = readJson(`docs/portfolio/enrichment/serpapi/${slug}.json`, null);
  const providerCalls = enrichment?.providerCalls ?? serpSnapshot?.callLog ?? null;
  const lastResearchAt = enrichment?.lastResearchAt ?? serpSnapshot?.generatedAt ?? null;
  checks.enrichmentExecuted = Boolean(lastResearchAt);
  if (!lastResearchAt) blockers.push("public enrichment não executado (lastResearchAt ausente)");
  if (!providerCalls) warnings.push("providerCalls não registrado: sem rastro de custo/cache do provider");

  // --- evidenceRecorded
  checks.evidenceRecorded = Boolean(enrichment?.identity && Object.keys(enrichment.identity).length > 0);
  if (!checks.evidenceRecorded) blockers.push("evidence registry vazio (sem procedência dos fatos)");

  // --- mediaPlanDone
  const mediaPlanPath = `docs/portfolio/media-plans/${slug}.json`;
  const mediaPlan = readJson(mediaPlanPath, null);
  checks.mediaPlanDone = Array.isArray(mediaPlan?.sections) && mediaPlan.sections.length > 0;
  if (!checks.mediaPlanDone) blockers.push(`media plan ausente ou vazio: ${mediaPlanPath}`);
  else {
    const silent = mediaPlan.sections.filter((s) => !s.asset && !s.resolution);
    if (silent.length) {
      blockers.push(`seções sem mídia e sem resolução: ${silent.map((s) => s.section).join(", ")}`);
    }
    const pending = mediaPlan.sections.filter((s) => ["planned", "blocked", "partial"].includes(s.status));
    if (pending.length) {
      warnings.push(`mídia pendente em: ${pending.map((s) => s.section).join(", ")}`);
    }
  }

  // --- coverApproved
  const coverAsset = project?.image?.replace(/^\//, "public/");
  checks.coverApproved = Boolean(mediaPlan?.cover?.approved) && Boolean(coverAsset && existsSync(path.resolve(root, coverAsset)));
  if (!coverAsset || !existsSync(path.resolve(root, coverAsset))) blockers.push("capa ausente no catálogo/disco");
  else if (!mediaPlan?.cover?.approved) warnings.push("cover gate ainda não aprovado no media plan");

  // --- coverStrategyValid (COVER GATE): capa nasce depois de identidade + mídia
  const coverStrategy = String(mediaPlan?.cover?.strategy ?? "");
  checks.coverStrategyValid = COVER_STRATEGIES.some((s) => coverStrategy.includes(s));
  if (!checks.coverStrategyValid) {
    blockers.push(`cover sem estratégia declarada (${COVER_STRATEGIES.join(" | ")})`);
  }

  // --- discoveryIndexPresent
  const doc = discovery[slug];
  const terms = doc ? ["services", "categories", "keywords"].filter((k) => Array.isArray(doc[k]) && doc[k].length) : [];
  checks.discoveryIndexPresent = terms.length >= 2;
  if (!checks.discoveryIndexPresent) blockers.push("discovery index ausente ou insuficiente em src/config/portfolio-discovery.json");

  // --- searchQa
  const mustFind = (manifest.searchQa ?? []).filter((c) => c.expect === "must_find");
  checks.searchQaDone = mustFind.length >= 4;
  if (!checks.searchQaDone) blockers.push("search QA insuficiente (mínimo: nome, segmento, serviço, produto/problema, localização)");

  // --- blueprintValid
  checks.blueprintValid =
    blueprintRegistry.includes(`"${slug}"`) || (Boolean(client?.componentFile) && existsSync(path.resolve(root, client.componentFile)));
  if (!checks.blueprintValid) blockers.push("componente/Blueprint do projeto não encontrado");

  // --- seoValid
  const summaryOk = typeof project?.summary === "string" && project.summary.length >= 80;
  const routeOk = routeSource.includes(slug);
  checks.seoValid = Boolean(project?.title && summaryOk && routeOk);
  if (!checks.seoValid) blockers.push("SEO incompleto (título, resumo >= 80 caracteres e metadata na rota)");

  // --- funnelValid
  const componentSource = client?.componentFile ? read(client.componentFile) : "";
  checks.funnelValid = /FunnelCTAButton|useFunnel|FloatingFunnelCTA|PortfolioCTAQuiz|renderCta/.test(componentSource);
  if (!checks.funnelValid) blockers.push("funil próprio não encontrado no componente do cliente");

  // --- contactMode / funnelType (canal comercial é sempre o funil individual)
  checks.contactModeDeclared = client?.contactMode === "funnelOnly";
  if (!checks.contactModeDeclared) blockers.push('contactMode ausente: projeto gerenciado exige "funnelOnly"');
  checks.funnelTypeDeclared = Boolean(client?.funnelType);
  if (!checks.funnelTypeDeclared) blockers.push("funnelType não declarado (orçamento, pedido, agendamento, diagnóstico, reserva…)");

  // --- FUNNEL_DESTINATION_GATE (projeto novo não chega a READY/PUBLISH só com protocolo)
  const destination = evaluateFunnelDestination(slug, { clients });
  checks.funnelDestinationGate = destination.status !== "FAIL";
  blockers.push(...destination.blockers);
  warnings.push(...destination.warnings);


  // --- direção visual consciente: scaffold não pode chegar a ready
  checks.creativeDirectionDone = !/CREATIVE_BRIEF_REQUIRED/.test(componentSource);
  if (!checks.creativeDirectionDone) blockers.push("workbench de scaffold ainda presente (direção criativa não definida)");
  checks.blueprintDriven = blueprintRegistry.includes(`"${slug}"`);
  if (!checks.blueprintDriven) blockers.push("projeto novo deve rodar pelo PortfolioBlueprintRenderer (ausente no registry)");

  // --- qaDone
  checks.qaDone = SATISFIED.has(manifest.lifecycle?.qa);
  if (!checks.qaDone) blockers.push("QA (mobile/desktop/a11y) não concluído no manifesto");

  // --- visualQA nunca é presumido aprovado
  const visualQa = manifest.visualQa?.status;
  checks.visualQaHonest = VISUAL_QA.has(visualQa);
  if (!VISUAL_QA.has(visualQa)) blockers.push("visualQA não declarado (PASS | FAIL | NOT_EXECUTED | BLOCKED_ENVIRONMENT)");
  else if (visualQa === "FAIL") blockers.push("visualQA = FAIL");
  else if (visualQa === "NOT_EXECUTED") blockers.push("visualQA = NOT_EXECUTED (não pode ser considerado aprovado)");
  else if (visualQa === "BLOCKED_ENVIRONMENT") warnings.push("visualQA = BLOCKED_ENVIRONMENT (≠ PASS): reexecutar em ambiente com navegador");

  // --- qualityMatrixPass (docs/PORTFOLIO_LANDING_QUALITY_MATRIX.md)
  const matrix = readJson(`docs/portfolio/quality-matrix/${slug}.json`, null);
  const matrixResult = evaluateProjectQuality(slug, matrix);
  checks.qualityMatrixPass = matrixResult.status === "PASS";
  if (!checks.qualityMatrixPass) {
    blockers.push(...matrixResult.failures.map((f) => `quality matrix — ${f}`));
  }
  warnings.push(...matrixResult.warnings.map((w) => `quality matrix — ${w}`));

  // --- adendo de autonomia (docs/PORTFOLIO_PROJECT_AUTONOMY_ADDENDUM.md §31)
  // As mensagens detalhadas vêm do quality gate; aqui ficam os estados visíveis.
  const autonomy = matrix?.autonomy ?? {};
  checks.identityCompleteness = Boolean(autonomy.identity?.decision);
  checks.aboveTheFoldValid = autonomy.aboveTheFold?.status === "PASS";
  checks.motionPresence = ["MOTION_IMPLEMENTED", "MOTION_OBSERVED"].includes(autonomy.motionPresence?.state);
  checks.structuralSkeletonOriginal = !matrixResult.failures.some((f) => f.startsWith("STRUCTURAL_SKELETON"));
  // STRUCTURAL_ORIGINALITY_GATE (docs/PORTFOLIO_STRUCTURAL_ORIGINALITY_ADDENDUM.md §7)
  checks.structuralOriginality = matrixResult.structuralOriginality
    ? matrixResult.structuralOriginality.status !== "FAIL"
    : true;

  checks.portfolioEmbedValid =
    autonomy.embed?.status === "PASS" && !matrixResult.failures.some((f) => f.includes("PORTFOLIO_EMBED"));
  checks.floatingConversionDecided = Boolean(autonomy.floatingConversion?.mode);

  // --- estados do manifesto: blocked reprova, in_progress vira aviso
  for (const step of STEPS) {
    const state = manifest.lifecycle?.[step];
    if (state === "blocked") blockers.push(`etapa bloqueada: ${step}`);
    else if (state === "in_progress" || state === "not_started") {
      if (step !== "publish") warnings.push(`etapa incompleta: ${step} (${state})`);
    }
  }

  blockers.push(...(manifest.blockers ?? []));
  warnings.push(...(manifest.warnings ?? []));

  const ready = blockers.length === 0;
  return {
    slug,
    stage: manifest.stage,
    published,
    checks,
    blockers,
    warnings,
    ownerRequired: manifest.ownerRequired ?? [],
    status: ready ? "READY" : "NOT_READY",
  };
}

const slugs = Object.keys(manifests).filter((s) => !onlySlug || s === onlySlug);
const results = slugs.map((slug) => evaluate(slug, manifests[slug]));

// projetos legados: informativos, nunca reprovados
const allSlugs = new Set(clients.map((c) => c.slug));
const legacy = [...allSlugs].filter((s) => !manifests[s]);

if (asJson) {
  console.log(JSON.stringify({ results, legacyProjects: legacy }, null, 2));
} else {
  console.log(`\n[readiness] ciclo de vida oficial — ${results.length} projeto(s) gerenciado(s), ${legacy.length} legado(s) ignorado(s)\n`);
  for (const r of results) {
    console.log(`${r.status === "READY" ? "✅" : "⛔"} ${r.slug} — stage=${r.stage}`);
    for (const [k, v] of Object.entries(r.checks)) console.log(`     ${v ? "ok " : "FAIL"} ${k}`);
    for (const b of r.blockers) console.log(`     BLOCKER  ${b}`);
    for (const w of r.warnings) console.log(`     warning  ${w}`);
    for (const o of r.ownerRequired) console.log(`     OWNER_REQUIRED  ${o}`);
    console.log("");
  }
}

// Só reprova build quando um projeto gerenciado é declarado ready/published com bloqueio.
const failing = results.filter((r) => ["ready", "published"].includes(r.stage) && r.blockers.length > 0);
if (failing.length && process.env.PORTFOLIO_READINESS_ENFORCE === "1") {
  console.error(`[readiness] ${failing.length} projeto(s) declarados ready/published com bloqueios.`);
  process.exit(1);
}
process.exit(0);
