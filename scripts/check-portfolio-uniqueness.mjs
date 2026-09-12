#!/usr/bin/env node
/**
 * Runner do PROJECT_UNIQUENESS_GATE.
 *
 * Bloqueante para projetos com `compositionContract >= 1` no manifesto
 * (docs/PORTFOLIO_UNIQUE_COMPOSITION_STANDARD.md §12/§17). Projetos legados
 * e os três pilotos do Blueprint entram como baseline de comparação: eles
 * geram warning, nunca falham o build.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  COMPOSITION_CONTRACT_VERSION,
  evaluateProjectUniqueness,
} from "./portfolio-project-uniqueness.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifests = JSON.parse(
  readFileSync(path.join(root, "src/config/portfolio-project-manifests.json"), "utf8"),
);

const projects = Object.values(manifests.projects ?? {});
const peers = projects
  .filter((project) => project.compositionFingerprint || project.structuralSignature)
  .map((project) => ({
    slug: project.slug,
    fingerprint: project.compositionFingerprint ?? legacyFingerprint(project.structuralSignature),
  }));

/** Baseline: os pilotos só têm assinatura estrutural antiga — mapeada para comparação. */
function legacyFingerprint(signature) {
  if (!signature) return null;
  return {
    heroGeometry: signature.heroFamily ?? "",
    headerTreatment: "sticky-bar-logo-left-cta-right",
    sectionGraph: signature.sectionRhythm ?? "",
    contentOrder: signature.sectionOrder ?? [],
    gridTopology: signature.layoutFamily ?? "",
    mediaDistribution: signature.mediaNarrative ?? "",
    backgroundRhythm: signature.layoutFamily ?? "",
    proofPlacement: signature.proofStyle ?? "",
    ctaDistribution: signature.ctaStyle ?? "",
    navigationPattern: "anchor-nav-header",
    motionSignature: signature.motionProfile ?? "",
    closingStructure: signature.ctaStyle ?? "",
  };
}

let failures = 0;
const lines = [];

for (const project of projects) {
  const governed = Number(project.compositionContract ?? 0) >= COMPOSITION_CONTRACT_VERSION;
  const evaluation = evaluateProjectUniqueness(
    {
      slug: project.slug,
      fingerprint: project.compositionFingerprint ?? null,
      perceptualReview: project.perceptualReview ?? null,
      contentFacts: project.contentFacts ?? null,
    },
    peers,
  );
  if (!governed) {
    lines.push(`· ${project.slug}: BASELINE (legado/piloto — não bloqueia)`);
    continue;
  }
  const tag = evaluation.status === "PASS" ? "PASS" : "FAIL";
  lines.push(`${tag === "PASS" ? "✓" : "✗"} ${project.slug}: ${tag}`);
  for (const detail of evaluation.details) lines.push(`    ${detail}`);
  for (const [dimension, value] of Object.entries(evaluation.results)) {
    if (value !== "PASS") lines.push(`    ${dimension} = FAIL`);
  }
  if (tag === "FAIL") failures += 1;
}

console.log("[project-uniqueness] PROJECT_UNIQUENESS_GATE");
console.log(lines.join("\n"));

if (failures > 0) {
  console.error(
    `\n[project-uniqueness] ${failures} projeto(s) reprovado(s). ` +
      "Ver docs/PORTFOLIO_UNIQUE_COMPOSITION_STANDARD.md.",
  );
  process.exit(1);
}
console.log("[project-uniqueness] OK — nenhum projeto sob o contrato de composição reprovado.");
