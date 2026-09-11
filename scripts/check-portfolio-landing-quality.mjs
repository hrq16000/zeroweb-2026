#!/usr/bin/env node
/**
 * Quality matrix gate — camada editorial/visual do lifecycle.
 *
 * Documento mestre: docs/PORTFOLIO_LANDING_QUALITY_MATRIX.md
 *
 * LEGADO PROTEGIDO: só avalia slugs com manifesto
 * (src/config/portfolio-project-manifests.json, lifecycleContract >= 1).
 *
 * Uso:
 *   node scripts/check-portfolio-landing-quality.mjs
 *   node scripts/check-portfolio-landing-quality.mjs --slug=carecas-infotec
 *   node scripts/check-portfolio-landing-quality.mjs --json
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractSkeleton, skeletonSimilarity, SKELETON_SIMILARITY_LIMIT } from "./portfolio-skeleton.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const asJson = args.includes("--json");
const onlySlug = args.find((a) => a.startsWith("--slug="))?.split("=")[1];

const readJson = (p, fallback) => {
  const abs = path.resolve(root, p);
  if (!existsSync(abs)) return fallback;
  try {
    return JSON.parse(readFileSync(abs, "utf8"));
  } catch {
    return fallback;
  }
};

export const DIMENSIONS = [
  "ENTITY",
  "CONTENT",
  "MEDIA",
  "VISUAL_COMPOSITION",
  "ORIGINALITY",
  "DISCOVERY",
  "SEO",
  "CONVERSION",
  "PROOF",
  "RESPONSIVENESS",
  "PERFORMANCE",
  "ACCESSIBILITY",
  "QA",
];

/**
 * Dimensões de experiência — docs/PORTFOLIO_LANDING_EXPERIENCE_ADDENDUM.md §19.
 * FAIL sempre reprova. Ausência é warning enquanto contractVersion < 3.
 */
export const EXPERIENCE_DIMENSIONS = [
  "CONTENT_DEPTH",
  "VISUAL_RHYTHM",
  "MEDIA_NARRATIVE",
  "SECTION_VARIETY",
  "SIGNATURE_MOMENTS",
  "PROOF_DENSITY",
  "CONVERSION_CONTINUITY",
];

const EXPERIENCE_REQUIRED_FROM_CONTRACT = 3;

/**
 * Motion — docs/PORTFOLIO_LANDING_MOTION_ADDENDUM.md.
 * Dimensão de matriz + MOTION_QUALITY_GATE (§15).
 */
export const MOTION_DIMENSION = "MOTION_DESIGN";

export const MOTION_PROFILE_FIELDS = [
  "intensity",
  "personality",
  "entrance",
  "scroll",
  "hover",
  "typography",
  "media",
  "transitions",
  "signatureEffects",
  "reducedMotionStrategy",
];

export const MOTION_GATE_CHECKS = [
  "motionProfileDefined",
  "effectsMatchBrand",
  "entranceNotRepetitive",
  "contextualMicrointeraction",
  "signatureMotion",
  "ctaFeedback",
  "mobileAdapted",
  "reducedMotionCovered",
  "contentAccessibleWithoutMotion",
  "noTransformOverflow",
  "noHeavyDependency",
  "noPerformanceRegression",
  "noAggressiveLoop",
];

export const MOTION_QUALITY_PROFILE_KEYS = [
  "motionIntensity",
  "motionPurpose",
  "interactionDensity",
  "scrollExperience",
  "microinteractionQuality",
  "reducedMotionCoverage",
  "motionPerformance",
];

/** Retorna { failures, warnings } do MOTION_QUALITY_GATE. */
export function evaluateMotion(matrix, contractVersion) {
  const failures = [];
  const warnings = [];
  const required = Number(contractVersion) >= EXPERIENCE_REQUIRED_FROM_CONTRACT;
  const push = (msg) => (required ? failures : warnings).push(msg);

  const motion = matrix?.motion;
  if (!motion) {
    push("motion: bloco ausente na matriz (adendo de motion §15)");
    return { failures, warnings };
  }

  const profile = motion.profile;
  if (!profile) {
    push("motion: motionProfile não declarado (adendo de motion §4)");
  } else {
    for (const field of MOTION_PROFILE_FIELDS) {
      const value = profile[field];
      const empty =
        value === undefined ||
        value === null ||
        (typeof value === "string" && !value.trim()) ||
        (Array.isArray(value) && value.length === 0);
      if (empty) push(`motion: motionProfile.${field} vazio`);
    }
    const signature = profile.signatureEffects;
    if (Array.isArray(signature) && signature.length > 3) {
      push("motion: mais de 3 signatureEffects (adendo de motion §5)");
    }
  }

  for (const check of MOTION_GATE_CHECKS) {
    const entry = motion.gate?.[check];
    const status = typeof entry === "string" ? entry : entry?.status;
    if (!status) {
      push(`MOTION_QUALITY_GATE: item não avaliado — ${check}`);
      continue;
    }
    if (status === "FAIL") failures.push(`MOTION_QUALITY_GATE: ${check} FAIL`);
    if (status === "WARNING") warnings.push(`MOTION_QUALITY_GATE: ${check} warning`);
  }

  for (const key of MOTION_QUALITY_PROFILE_KEYS) {
    if (!motion.qualityProfile?.[key]) push(`motion: qualityProfile.${key} ausente (adendo de motion §14)`);
  }

  return { failures, warnings };
}

const STATUSES = new Set(["PASS", "WARNING", "FAIL", "NOT_APPLICABLE"]);

/**
 * Adendo de autonomia (docs/PORTFOLIO_PROJECT_AUTONOMY_ADDENDUM.md).
 * IDENTITY_COMPLETENESS_GATE · ABOVE_THE_FOLD_GATE · MOTION_PRESENCE_GATE ·
 * STRUCTURAL_SKELETON_SIMILARITY · PORTFOLIO_EMBED_GATE.
 */
export const IDENTITY_DECISIONS = [
  "REAL_LOGO",
  "NORMALIZED_LOGO",
  "WORDMARK_CREATED",
  "BRANDMARK_CREATED",
  "TEXT_ONLY_INTENTIONAL",
];

export const MOTION_PRESENCE_STATES = ["MOTION_DECLARED", "MOTION_IMPLEMENTED", "MOTION_OBSERVED"];

export function evaluateAutonomy({
  slug,
  matrix,
  componentSource = "",
  catalogItem,
  manifest,
  peers = [],
  contractVersion = 0,
}) {
  const failures = [];
  const warnings = [];
  const required = Number(contractVersion) >= EXPERIENCE_REQUIRED_FROM_CONTRACT;
  const push = (msg) => (required ? failures : warnings).push(msg);
  const autonomy = matrix?.autonomy;

  if (!autonomy) {
    push("autonomy: bloco ausente na matriz (adendo de autonomia §31)");
    return { failures, warnings };
  }

  // IDENTITY_COMPLETENESS_GATE (§3–§6)
  const identity = autonomy.identity ?? {};
  if (!IDENTITY_DECISIONS.includes(identity.decision)) {
    push(`IDENTITY_COMPLETENESS_GATE: decisão ausente/inválida (${IDENTITY_DECISIONS.join(" | ")})`);
  } else if (identity.decision !== "TEXT_ONLY_INTENTIONAL") {
    if (!identity.asset) push("IDENTITY_COMPLETENESS_GATE: decisão declara asset, mas nenhum arquivo registrado");
    else if (!componentSource.includes(String(identity.asset).replace(/^public/, ""))) {
      push("IDENTITY_COMPLETENESS_GATE: asset de identidade não é usado pela landing");
    }
    const generated = ["WORDMARK_CREATED", "BRANDMARK_CREATED"].includes(identity.decision);
    if (generated && identity.provenance !== "GENERATED_BRAND_ASSET") {
      push("IDENTITY_COMPLETENESS_GATE: identidade criada precisa de provenance GENERATED_BRAND_ASSET (§5)");
    }
  } else if (!identity.justification) {
    push("IDENTITY_COMPLETENESS_GATE: TEXT_ONLY_INTENTIONAL exige justificativa editorial");
  }

  // ABOVE_THE_FOLD_GATE (§7–§9)
  const atf = autonomy.aboveTheFold ?? {};
  if (!STATUSES.has(atf.status)) push("ABOVE_THE_FOLD_GATE: não avaliado");
  else if (atf.status === "FAIL") failures.push(`ABOVE_THE_FOLD_GATE: FAIL — ${atf.notes ?? "sem nota"}`);
  else if (atf.status === "WARNING") warnings.push(`ABOVE_THE_FOLD_GATE: ${atf.notes ?? "warning"}`);
  const heroMedia = matrix?.mediaPlanHeroMedia ?? autonomy.heroMedia;
  if (atf.status === "PASS" && !heroMedia?.asset && atf.visualStrategy !== "TEXT_LED_JUSTIFIED") {
    push("ABOVE_THE_FOLD_GATE: heroMedia não registrado (§9)");
  }

  // MOTION_PRESENCE_GATE (§14–§17)
  const presence = autonomy.motionPresence ?? {};
  if (!MOTION_PRESENCE_STATES.includes(presence.state)) {
    push(`MOTION_PRESENCE_GATE: estado ausente (${MOTION_PRESENCE_STATES.join(" | ")})`);
  } else if (presence.state === "MOTION_DECLARED") {
    push("MOTION_PRESENCE_GATE: motion apenas declarado, sem consumo no runtime (§14)");
  }
  if (presence.state && presence.state !== "MOTION_DECLARED") {
    const evidence = Array.isArray(presence.evidence) ? presence.evidence : [];
    if (!evidence.length) push("MOTION_PRESENCE_GATE: sem evidência de comportamento executado (§15)");
    if (!/motion:\s*\{/.test(componentSource)) {
      push("MOTION_PRESENCE_GATE: nenhuma seção do Blueprint configura motion");
    }
  }

  // STRUCTURAL_SKELETON_SIMILARITY (§18–§22) — medido no código, não declarado
  const own = extractSkeleton(componentSource);
  if (!own.length) push("STRUCTURAL_SKELETON: não foi possível extrair a topologia do componente");
  for (const peer of peers) {
    if (peer.slug === slug || !peer.skeleton?.length) continue;
    const ratio = skeletonSimilarity(own, peer.skeleton);
    if (ratio >= SKELETON_SIMILARITY_LIMIT) {
      failures.push(
        `STRUCTURAL_SKELETON_SIMILARITY: topologia ${(ratio * 100).toFixed(0)}% igual a ${peer.slug} (limite ${(SKELETON_SIMILARITY_LIMIT * 100).toFixed(0)}%)`,
      );
    } else if (ratio >= SKELETON_SIMILARITY_LIMIT - 0.1) {
      warnings.push(`STRUCTURAL_SKELETON: ${(ratio * 100).toFixed(0)}% de proximidade com ${peer.slug}`);
    }
  }

  // Conversão persistente (§10–§13)
  const floating = autonomy.floatingConversion ?? {};
  if (floating.mode === "enabled") {
    if (!/floatingConversion:\s*\{[\s\S]{0,200}mode:\s*"enabled"/.test(componentSource)) {
      push("floatingConversion declarado como enabled, mas ausente no Blueprint");
    }
    if (floating.destination && floating.destination !== "funnel") {
      failures.push("floating CTA precisa apontar para o funil individual (§11)");
    }
  } else if (floating.mode === "disabled") {
    if (!floating.reason) push("floatingConversion desativado sem razão registrada (§10)");
  } else {
    push("floatingConversion não avaliado (enabled | disabled-with-reason)");
  }

  // PORTFOLIO_EMBED_GATE (§23–§27)
  const embed = autonomy.embed ?? {};
  if (!STATUSES.has(embed.status)) push("PORTFOLIO_EMBED_GATE: não avaliado");
  else if (embed.status === "FAIL") failures.push("P0 PORTFOLIO_EMBED_FAILURE: página vazia dentro de /portfolio (§25)");
  const embeddable =
    catalogItem?.live === true ||
    catalogItem?.status === "published" ||
    ["ready", "published"].includes(manifest?.stage ?? "");
  if (!embeddable) {
    failures.push("PORTFOLIO_EMBED_GATE: o card do catálogo não abriria a página no visualizador interno");
  }

  return { failures, warnings };
}

export function evaluateMatrix(slug, matrix, options = {}) {
  const failures = [];
  const warnings = [];

  if (!matrix) {
    return {
      slug,
      status: "MISSING",
      failures: [`quality matrix ausente: docs/portfolio/quality-matrix/${slug}.json`],
      warnings: [],
      score: null,
      technicalPass: false,
      editorialPass: false,
    };
  }

  for (const dim of DIMENSIONS) {
    const entry = matrix.dimensions?.[dim];
    if (!entry || !STATUSES.has(entry.status)) {
      failures.push(`dimensão não avaliada: ${dim}`);
      continue;
    }
    if (entry.status === "FAIL") failures.push(`${dim}: FAIL — ${entry.notes ?? "sem nota"}`);
    if (entry.status === "WARNING") warnings.push(`${dim}: ${entry.notes ?? "warning"}`);
  }

  const contractVersion = Number(options.contractVersion ?? matrix.contractVersion ?? 0);
  for (const dim of EXPERIENCE_DIMENSIONS) {
    const entry = matrix.dimensions?.[dim];
    if (!entry || !STATUSES.has(entry.status)) {
      const message = `dimensão de experiência não avaliada: ${dim} (adendo §19)`;
      if (contractVersion >= EXPERIENCE_REQUIRED_FROM_CONTRACT) failures.push(message);
      else warnings.push(message);
      continue;
    }
    if (entry.status === "FAIL") failures.push(`${dim}: FAIL — ${entry.notes ?? "sem nota"}`);
    if (entry.status === "WARNING") warnings.push(`${dim}: ${entry.notes ?? "warning"}`);
  }



  {
    const entry = matrix.dimensions?.[MOTION_DIMENSION];
    if (!entry || !STATUSES.has(entry.status)) {
      const message = `dimensão não avaliada: ${MOTION_DIMENSION} (adendo de motion §15)`;
      if (contractVersion >= EXPERIENCE_REQUIRED_FROM_CONTRACT) failures.push(message);
      else warnings.push(message);
    } else if (entry.status === "FAIL") {
      failures.push(`${MOTION_DIMENSION}: FAIL — ${entry.notes ?? "sem nota"}`);
    } else if (entry.status === "WARNING") {
      warnings.push(`${MOTION_DIMENSION}: ${entry.notes ?? "warning"}`);
    }
  }

  {
    const motion = evaluateMotion(matrix, contractVersion);
    failures.push(...motion.failures);
    warnings.push(...motion.warnings);
  }

  // Hero e Cover são avaliados separadamente (§7 e §8).
  for (const key of ["hero", "cover"]) {
    const status = matrix[key]?.status;
    if (!STATUSES.has(status)) failures.push(`${key} matrix não avaliada`);
    else if (status === "FAIL") failures.push(`${key}: FAIL — ${matrix[key].notes ?? "sem nota"}`);
    else if (status === "WARNING") warnings.push(`${key}: ${matrix[key].notes ?? "warning"}`);
  }

  // Coverage visual: toda seção registrada precisa de decisão visual deliberada.
  const coverage = Array.isArray(matrix.coverage) ? matrix.coverage : [];
  if (!coverage.length) failures.push("coverage visual matrix vazia");
  for (const row of coverage) {
    if (!row.mediaDecision) failures.push(`coverage sem mediaDecision: ${row.section}`);
    if (row.status === "FAIL") failures.push(`coverage FAIL em "${row.section}": ${row.notes ?? "sem nota"}`);
    if (row.status === "WARNING") warnings.push(`coverage warning em "${row.section}"`);
  }

  // Dead zones abertas são P0 (§14).
  for (const dz of matrix.deadZones ?? []) {
    if (dz.resolved) warnings.push(`dead zone resolvida: ${dz.section} — ${dz.resolution ?? ""}`);
    else failures.push(`VISUAL_DEAD_ZONE aberta: ${dz.section} (${dz.viewport ?? "?"})`);
  }

  // P0 declarados reprovam sempre.
  for (const p0 of matrix.p0 ?? []) failures.push(`P0: ${typeof p0 === "string" ? p0 : p0.issue}`);

  if (matrix.technicalPass !== true) failures.push("technicalPass não confirmado");
  if (matrix.editorialPass !== true) failures.push("editorialPass não confirmado");

  warnings.push(...(matrix.warnings ?? []));

  return {
    slug,
    status: failures.length ? "FAIL" : "PASS",
    failures,
    warnings,
    score: matrix.score?.total ?? null,
    technicalPass: matrix.technicalPass === true,
    editorialPass: matrix.editorialPass === true,
    ownerRequired: matrix.ownerRequired ?? [],
  };
}

export function evaluatePolicyGates({ slug, client, componentSource = "", mediaPlan }) {
  const failures = [];
  const contactMode = client?.contactMode;
  if (contactMode === "funnelOnly") {
    if (/href\s*=\s*["'`]tel:/i.test(componentSource) || /tel:\+?\d/i.test(componentSource)) {
      failures.push("CONTACT_FUNNEL_GATE: contactMode=funnelOnly proíbe tel:");
    }
    if (/href\s*=\s*["'`](?:https?:\/\/)?(?:wa\.me|api\.whatsapp\.com)/i.test(componentSource)) {
      failures.push("CONTACT_FUNNEL_GATE: contato comercial bypassa o funil");
    }
    if (!/PortfolioCTAQuiz|FunnelCTAButton|useFunnel|renderCta/.test(componentSource)) {
      failures.push("CONTACT_FUNNEL_GATE: mecanismo de funil não encontrado");
    }
  }

  const referenceOnly = mediaPlan?.inventory?.referenceOnlyAssets ?? [];
  for (const asset of referenceOnly) {
    if (asset?.editorialAllowed === true) continue;
    const publicPath = String(asset?.file ?? "").replace(/^public/, "");
    if (publicPath && componentSource.includes(publicPath)) {
      failures.push(`MEDIA_PURPOSE_GATE: asset ${publicPath} é EVIDENCE_ONLY/BRAND_REFERENCE e está em posição editorial`);
    }
  }

  return {
    slug,
    status: failures.length ? "FAIL" : "PASS",
    failures,
    contactMode,
  };
}

export function evaluateProjectQuality(slug, matrix, options = {}) {
  const manifests = readJson("src/config/portfolio-project-manifests.json", { projects: {} }).projects ?? {};
  const contractVersion =
    options.contractVersion ?? manifests[slug]?.contractVersion ?? matrix?.contractVersion ?? 0;
  const matrixResult = evaluateMatrix(slug, matrix, { contractVersion });
  const clients = readJson("src/config/portfolio-clients.json", []);
  const client = clients.find((item) => item.slug === slug);
  const componentSource = client?.componentFile
    ? readFileSync(path.resolve(root, client.componentFile), "utf8")
    : "";
  const mediaPlan = readJson(`docs/portfolio/media-plans/${slug}.json`, null);
  const policyResult = evaluatePolicyGates({
    slug,
    client,
    componentSource,
    mediaPlan,
  });

  // Adendo de autonomia: gates comparativos precisam do catálogo e dos pares.
  const catalogRaw = readJson("src/config/portfolio-catalog.json", []);
  const catalog = catalogRaw.projects ?? catalogRaw;
  const peers = Object.keys(manifests)
    .filter((peerSlug) => peerSlug !== slug)
    .map((peerSlug) => {
      const peerClient = clients.find((item) => item.slug === peerSlug);
      const file = peerClient?.componentFile ? path.resolve(root, peerClient.componentFile) : null;
      const source = file && existsSync(file) ? readFileSync(file, "utf8") : "";
      return { slug: peerSlug, skeleton: extractSkeleton(source) };
    });

  const autonomyResult = evaluateAutonomy({
    slug,
    matrix: matrix ? { ...matrix, mediaPlanHeroMedia: mediaPlan?.heroMedia } : matrix,
    componentSource,
    catalogItem: catalog.find((item) => item.slug === slug),
    manifest: manifests[slug],
    peers,
    contractVersion,
  });

  const failures = [...matrixResult.failures, ...policyResult.failures, ...autonomyResult.failures];
  return {
    ...matrixResult,
    status: failures.length ? "FAIL" : "PASS",
    failures,
    warnings: [...matrixResult.warnings, ...autonomyResult.warnings],
    policyGates: policyResult,
  };
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCli) {
  const manifests = readJson("src/config/portfolio-project-manifests.json", { projects: {} }).projects ?? {};
  const slugs = Object.keys(manifests).filter((s) => !onlySlug || s === onlySlug);
  const results = slugs.map((slug) =>
    evaluateProjectQuality(slug, readJson(`docs/portfolio/quality-matrix/${slug}.json`, null)),
  );

  if (asJson) {
    console.log(JSON.stringify({ results }, null, 2));
  } else {
    console.log(`\n[quality-matrix] ${results.length} projeto(s) gerenciado(s)\n`);
    for (const r of results) {
      console.log(`${r.status === "PASS" ? "✅" : "⛔"} ${r.slug} — score=${r.score ?? "n/a"} technical=${r.technicalPass} editorial=${r.editorialPass}`);
      for (const f of r.failures) console.log(`     FAIL     ${f}`);
      for (const w of r.warnings) console.log(`     warning  ${w}`);
      for (const o of r.ownerRequired ?? []) console.log(`     OWNER_REQUIRED  ${o}`);
      console.log("");
    }
  }

  const failing = results.filter((r) => r.status !== "PASS");
  const enforce = process.env.PORTFOLIO_QUALITY_ENFORCE === "1";
  if (failing.length && enforce) {
    console.error(`[quality-matrix] ${failing.length} projeto(s) reprovado(s).`);
    process.exit(1);
  }
  process.exit(0);
}
