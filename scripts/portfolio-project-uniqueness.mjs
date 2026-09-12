/**
 * PROJECT_UNIQUENESS_GATE — docs/PORTFOLIO_UNIQUE_COMPOSITION_STANDARD.md §12.
 *
 * Sucessor do STRUCTURAL_ORIGINALITY_GATE. Avalia oito dimensões separadas e
 * trata "mudou texto, cor e foto" como reprovação (skin swap). Bloqueante para
 * projetos com `compositionContract >= 1`; legados viram baseline/warning.
 */

export const COMPOSITION_CONTRACT_VERSION = 1;

export const UNIQUENESS_DIMENSIONS = [
  "CONTENT_UNIQUENESS",
  "STRUCTURAL_UNIQUENESS",
  "COMPOSITION_UNIQUENESS",
  "HERO_UNIQUENESS",
  "MEDIA_NARRATIVE_UNIQUENESS",
  "MOTION_UNIQUENESS",
  "CONVERSION_PRESENTATION_UNIQUENESS",
  "PERCEPTUAL_UNIQUENESS",
];

export const FINGERPRINT_FIELDS = [
  "heroGeometry",
  "headerTreatment",
  "sectionGraph",
  "contentOrder",
  "gridTopology",
  "mediaDistribution",
  "backgroundRhythm",
  "proofPlacement",
  "ctaDistribution",
  "navigationPattern",
  "motionSignature",
  "closingStructure",
];

const norm = (value) =>
  String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Similaridade de sequência (subsequência comum normalizada). */
export function sequenceSimilarity(a = [], b = []) {
  if (!a.length || !b.length) return 0;
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      dp[i][j] =
        norm(a[i - 1]) === norm(b[j - 1])
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length] / Math.max(a.length, b.length);
}

/** Similaridade textual por bag-of-words (Jaccard) — tolerante a redação. */
export function textSimilarity(a, b) {
  const wa = new Set(norm(a).split(" ").filter(Boolean));
  const wb = new Set(norm(b).split(" ").filter(Boolean));
  if (!wa.size || !wb.size) return 0;
  let inter = 0;
  for (const word of wa) if (wb.has(word)) inter += 1;
  return inter / new Set([...wa, ...wb]).size;
}

/** Compara dois fingerprints campo a campo. */
export function compareFingerprints(a, b) {
  const perField = {};
  for (const field of FINGERPRINT_FIELDS) {
    const va = a?.[field];
    const vb = b?.[field];
    perField[field] = Array.isArray(va) || Array.isArray(vb)
      ? sequenceSimilarity(va ?? [], vb ?? [])
      : textSimilarity(va, vb);
  }
  const values = Object.values(perField);
  const overall = values.reduce((sum, value) => sum + value, 0) / (values.length || 1);
  const identical = FINGERPRINT_FIELDS.filter((field) => perField[field] >= 0.95);
  return { perField, overall, identicalFields: identical };
}

/**
 * Skin swap: topologia praticamente igual à de outro projeto, ainda que copy,
 * paleta e mídias mudem. É a assinatura exata do problema descrito no §13.
 */
export function detectSkinSwap(comparison) {
  const structural = ["sectionGraph", "contentOrder", "gridTopology", "heroGeometry"];
  const structuralHits = structural.filter((field) => comparison.perField[field] >= 0.8);
  return {
    isSkinSwap: comparison.overall >= 0.7 || structuralHits.length >= 3,
    structuralHits,
  };
}

const THRESHOLDS = {
  COMPOSITION_UNIQUENESS: 0.7,
  STRUCTURAL_UNIQUENESS: 0.75,
  HERO_UNIQUENESS: 0.8,
  MEDIA_NARRATIVE_UNIQUENESS: 0.85,
  MOTION_UNIQUENESS: 0.85,
  CONVERSION_PRESENTATION_UNIQUENESS: 0.85,
  CONTENT_UNIQUENESS: 0.9,
};

/**
 * @param project  { slug, fingerprint, perceptualReview, contentFacts }
 * @param peers    lista de { slug, fingerprint } dos projetos recentes
 */
export function evaluateProjectUniqueness(project, peers = []) {
  const results = {};
  const details = [];
  const fingerprint = project.fingerprint ?? null;

  if (!fingerprint) {
    for (const dimension of UNIQUENESS_DIMENSIONS) results[dimension] = "FAIL";
    return {
      slug: project.slug,
      status: "FAIL",
      results,
      details: ["compositionFingerprint ausente — o projeto não declarou composição própria."],
    };
  }

  const missing = FINGERPRINT_FIELDS.filter((field) => {
    const value = fingerprint[field];
    if (Array.isArray(value)) return value.length === 0;
    return !value || String(value).includes("[PREENCHER]");
  });

  const comparisons = peers
    .filter((peer) => peer.slug !== project.slug && peer.fingerprint)
    .map((peer) => ({ slug: peer.slug, ...compareFingerprints(fingerprint, peer.fingerprint) }));

  const worst = comparisons.reduce(
    (acc, item) => (acc && acc.overall >= item.overall ? acc : item),
    null,
  );

  const fieldWorst = (field) =>
    comparisons.reduce((max, item) => Math.max(max, item.perField[field] ?? 0), 0);

  results.COMPOSITION_UNIQUENESS =
    missing.length === 0 && (worst?.overall ?? 0) < THRESHOLDS.COMPOSITION_UNIQUENESS
      ? "PASS"
      : "FAIL";
  results.STRUCTURAL_UNIQUENESS =
    Math.max(fieldWorst("sectionGraph"), sequenceWorst(comparisons)) <
    THRESHOLDS.STRUCTURAL_UNIQUENESS
      ? "PASS"
      : "FAIL";
  results.HERO_UNIQUENESS =
    fieldWorst("heroGeometry") < THRESHOLDS.HERO_UNIQUENESS ? "PASS" : "FAIL";
  results.MEDIA_NARRATIVE_UNIQUENESS =
    fieldWorst("mediaDistribution") < THRESHOLDS.MEDIA_NARRATIVE_UNIQUENESS ? "PASS" : "FAIL";
  results.MOTION_UNIQUENESS =
    fieldWorst("motionSignature") < THRESHOLDS.MOTION_UNIQUENESS ? "PASS" : "FAIL";
  results.CONVERSION_PRESENTATION_UNIQUENESS =
    Math.max(fieldWorst("ctaDistribution"), fieldWorst("proofPlacement")) <
    THRESHOLDS.CONVERSION_PRESENTATION_UNIQUENESS
      ? "PASS"
      : "FAIL";
  results.CONTENT_UNIQUENESS = project.contentFacts?.ownSourcedContent ? "PASS" : "FAIL";

  const review = project.perceptualReview ?? null;
  results.PERCEPTUAL_UNIQUENESS =
    review?.screenshots?.["390"] &&
    review?.screenshots?.["1440"] &&
    review?.noBrandTest === "PASS" &&
    Array.isArray(review?.comparedWith) &&
    review.comparedWith.length > 0
      ? "PASS"
      : "FAIL";

  if (missing.length) details.push(`fingerprint incompleto: ${missing.join(", ")}`);
  for (const comparison of comparisons) {
    const skin = detectSkinSwap(comparison);
    if (skin.isSkinSwap) {
      details.push(
        `SKIN_SWAP vs ${comparison.slug}: similaridade ${(comparison.overall * 100).toFixed(0)}% ` +
          `(campos estruturais colididos: ${skin.structuralHits.join(", ") || "—"})`,
      );
      results.COMPOSITION_UNIQUENESS = "FAIL";
      results.STRUCTURAL_UNIQUENESS = "FAIL";
    }
  }
  if (!review) details.push("comparação perceptual ausente (screenshots 390/1440 + NO-BRAND TEST).");

  const status = Object.values(results).every((value) => value === "PASS") ? "PASS" : "FAIL";
  return { slug: project.slug, status, results, details, comparisons };
}

function sequenceWorst(comparisons) {
  return comparisons.reduce((max, item) => Math.max(max, item.perField.contentOrder ?? 0), 0);
}
