/**
 * STRUCTURAL_ORIGINALITY_GATE — docs/PORTFOLIO_STRUCTURAL_ORIGINALITY_ADDENDUM.md
 *
 * Originalidade de conteúdo (textos, provas, mídias) NÃO é originalidade
 * estrutural. Este gate mede a gramática visual: família de layout, hero,
 * ritmo de seções, forma de prova, narrativa de mídia e padrão de CTA,
 * comparando cada projeto com uma janela dos projetos mais recentes.
 *
 * Aplica-se a PROJETOS NOVOS (manifest.structuralContract >= 1).
 * Projetos anteriores são baseline de comparação: geram warning, nunca FAIL.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const FAMILIES = JSON.parse(
  readFileSync(path.join(root, "src/config/portfolio-structural-families.json"), "utf8"),
);

export const STRUCTURAL_CONTRACT_VERSION = 1;

export const STRUCTURAL_CHECKS = [
  "layoutFamilyDeclared",
  "heroStructureUniqueEnough",
  "sectionOrderDiverse",
  "mediaNarrativeDistinct",
  "proofPresentationDistinct",
  "ctaPatternDistinct",
  "visualRhythmDistinct",
  "notPerceivedAsSkinSwap",
];

const idsOf = (list) => new Set((list ?? []).map((item) => item.id));

const VOCABULARY = {
  layoutFamily: idsOf(FAMILIES.layoutFamilies),
  heroFamily: idsOf(FAMILIES.heroFamilies),
  sectionRhythm: idsOf(FAMILIES.sectionRhythms),
  proofStyle: idsOf(FAMILIES.proofStyles),
  mediaNarrative: idsOf(FAMILIES.mediaNarratives),
  ctaStyle: idsOf(FAMILIES.ctaStyles),
};

/** Similaridade de ordem de seções (subsequência comum sobre type.variant). */
export function sectionOrderSimilarity(a = [], b = []) {
  if (!a.length || !b.length) return 0;
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length] / Math.max(a.length, b.length);
}

/** Assinatura estrutural declarada no manifesto do projeto. */
export function readSignature(manifest) {
  return manifest?.structuralSignature ?? null;
}

function sortRecent(peers) {
  return [...peers].sort((a, b) =>
    String(b.lastUpdatedAt ?? "").localeCompare(String(a.lastUpdatedAt ?? "")),
  );
}

/** Janela de comparação: N recentes + N da mesma família + N do mesmo segmento. */
export function buildComparisonWindow(signature, peers = [], window = FAMILIES.comparisonWindow) {
  const recent = sortRecent(peers);
  const picked = new Map();
  const add = (list, limit) => {
    for (const peer of list.slice(0, limit)) picked.set(peer.slug, peer);
  };
  add(recent, window.recentProjects);
  add(
    recent.filter((p) => p.signature?.layoutFamily && p.signature.layoutFamily === signature?.layoutFamily),
    window.sameLayoutFamily,
  );
  add(
    recent.filter((p) => p.segment && signature?.segment && p.segment === signature.segment),
    window.sameSegment,
  );
  return [...picked.values()];
}

export function evaluateStructuralOriginality({
  slug,
  manifest,
  sectionOrder = [],
  peers = [],
} = {}) {
  const failures = [];
  const warnings = [];
  const enforced = Number(manifest?.structuralContract ?? 0) >= STRUCTURAL_CONTRACT_VERSION;
  const push = (message) => (enforced ? failures : warnings).push(message);
  const checks = Object.fromEntries(STRUCTURAL_CHECKS.map((c) => [c, "PASS"]));
  const fail = (check, message) => {
    checks[check] = enforced ? "FAIL" : "WARN";
    push(`STRUCTURAL_ORIGINALITY_GATE: ${message}`);
  };
  const warn = (check, message) => {
    if (checks[check] === "PASS") checks[check] = "WARN";
    warnings.push(`STRUCTURAL_ORIGINALITY_GATE: ${message}`);
  };

  const signature = readSignature(manifest);
  if (!signature) {
    for (const check of STRUCTURAL_CHECKS) checks[check] = enforced ? "FAIL" : "WARN";
    push("assinatura estrutural ausente (§4: layoutFamily, heroFamily, sectionRhythm, proofStyle, mediaNarrative, ctaStyle, motionProfile)");
    return { slug, status: enforced ? "FAIL" : "WARN", enforced, checks, failures, warnings, window: [] };
  }

  for (const axis of FAMILIES.axes) {
    const value = signature[axis];
    if (!value) fail(axis === "layoutFamily" ? "layoutFamilyDeclared" : "notPerceivedAsSkinSwap", `${axis} não declarado`);
    else if (!VOCABULARY[axis].has(value)) {
      fail(
        axis === "layoutFamily" ? "layoutFamilyDeclared" : "notPerceivedAsSkinSwap",
        `${axis}="${value}" fora do vocabulário de famílias (§5)`,
      );
    }
  }
  if (!signature.motionProfile) fail("visualRhythmDistinct", "motionProfile não declarado (§4)");

  const windowPeers = buildComparisonWindow(signature, peers);
  const t = FAMILIES.thresholds;

  // Hero: repetição de hero na janela é o sinal mais forte de "template com skin".
  const heroRepeats = windowPeers.filter((p) => p.signature?.heroFamily === signature.heroFamily);
  if (heroRepeats.length > t.heroSignatureMaxRepeatsInWindow) {
    fail(
      "heroStructureUniqueEnough",
      `heroFamily "${signature.heroFamily}" repetido em ${heroRepeats.length} projetos da janela (${heroRepeats.map((p) => p.slug).join(", ")})`,
    );
  } else if (heroRepeats.length) {
    warn("heroStructureUniqueEnough", `heroFamily já usado por ${heroRepeats.map((p) => p.slug).join(", ")}`);
  }

  // Ordem de seções medida no código, não declarada.
  if (!sectionOrder.length) {
    fail("sectionOrderDiverse", "não foi possível extrair a ordem de seções do componente");
  }
  for (const peer of windowPeers) {
    if (!peer.sectionOrder?.length || !sectionOrder.length) continue;
    const ratio = sectionOrderSimilarity(sectionOrder, peer.sectionOrder);
    if (ratio >= t.sectionOrderSimilarityFail) {
      fail("sectionOrderDiverse", `ordem de seções ${(ratio * 100).toFixed(0)}% igual a ${peer.slug} (limite ${t.sectionOrderSimilarityFail * 100}%)`);
    } else if (ratio >= t.sectionOrderSimilarityWarn) {
      warn("sectionOrderDiverse", `ordem de seções ${(ratio * 100).toFixed(0)}% próxima de ${peer.slug}`);
    }
  }

  // Eixos de composição: repetição excessiva na janela.
  const axisCheck = {
    mediaNarrative: "mediaNarrativeDistinct",
    proofStyle: "proofPresentationDistinct",
    ctaStyle: "ctaPatternDistinct",
    sectionRhythm: "visualRhythmDistinct",
  };
  for (const [axis, check] of Object.entries(axisCheck)) {
    const repeats = windowPeers.filter((p) => p.signature?.[axis] && p.signature[axis] === signature[axis]);
    if (repeats.length >= t.axisRepeatWarn) {
      fail(check, `${axis} "${signature[axis]}" repetido em ${repeats.length} projetos da janela (${repeats.map((p) => p.slug).join(", ")})`);
    } else if (repeats.length) {
      warn(check, `${axis} já usado por ${repeats[0].slug}`);
    }
  }

  // notPerceivedAsSkinSwap: precisa de N eixos distintos em relação a CADA par.
  for (const peer of windowPeers) {
    if (!peer.signature) continue;
    const distinct = FAMILIES.axes.filter((axis) => peer.signature[axis] !== signature[axis]).length;
    if (distinct < t.skinSwapMinDistinctAxes) {
      fail(
        "notPerceivedAsSkinSwap",
        `apenas ${distinct} eixo(s) de composição diferem de ${peer.slug} — mínimo ${t.skinSwapMinDistinctAxes} (§6)`,
      );
    }
  }

  const editorial = manifest?.structuralOriginalityReview;
  if (!editorial?.approved) {
    push("aprovação editorial de originalidade estrutural ausente (§9: structuralOriginalityReview.approved)");
    if (checks.notPerceivedAsSkinSwap === "PASS") checks.notPerceivedAsSkinSwap = enforced ? "FAIL" : "WARN";
  }

  return {
    slug,
    status: failures.length ? "FAIL" : warnings.length ? "WARN" : "PASS",
    enforced,
    checks,
    failures,
    warnings,
    window: windowPeers.map((p) => p.slug),
  };
}
