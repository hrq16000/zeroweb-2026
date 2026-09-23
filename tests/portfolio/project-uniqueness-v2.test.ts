import { describe, expect, test } from "bun:test";
import {
  evaluateProjectUniqueness,
  fingerprintFieldsForContract,
} from "../../scripts/portfolio-project-uniqueness.mjs";

const baseFingerprint = {
  heroGeometry: "cinematic full bleed",
  headerTreatment: "overlay rail",
  sectionGraph: "hero→story→proof→close",
  contentOrder: ["identity", "story", "proof", "conversion"],
  gridTopology: "asymmetric editorial",
  mediaDistribution: "hero dominant + proof band",
  backgroundRhythm: "dark→paper→dark",
  proofPlacement: "adjacent to claim",
  ctaDistribution: "hero + close",
  navigationPattern: "section rail",
  motionSignature: "mask reveal",
  closingStructure: "editorial close",
};

const v2Fingerprint = {
  ...baseFingerprint,
  roleGraph: ["orientation", "decision-support", "proof", "conversion"],
  mediaCadence: ["media-dominant", "text-dominant", "balanced", "quiet"],
  interactionLoci: ["selector", "comparison", "funnel"],
  decisionAidPlacement: ["after-offer", "before-conversion"],
  densityRhythm: ["airy", "dense", "airy"],
  mobileCompositionStrategy: "selector-first, proof-inline, sticky conversion",
};

const perceptualReview = {
  screenshots: { "390": "390.png", "1440": "1440.png" },
  noBrandTest: "PASS",
  comparedWith: ["peer"],
};

describe("PROJECT_UNIQUENESS_GATE compositionContract v2", () => {
  test("mantém o contrato v1 retrocompatível", () => {
    expect(fingerprintFieldsForContract(1)).not.toContain("roleGraph");

    const result = evaluateProjectUniqueness({
      slug: "legacy-v1",
      compositionContract: 1,
      fingerprint: baseFingerprint,
      perceptualReview,
      contentFacts: { ownSourcedContent: true },
    });

    expect(result.status).toBe("PASS");
  });

  test("contrato v2 exige jornada, mídia, interação, densidade e mobile", () => {
    expect(fingerprintFieldsForContract(2)).toContain("roleGraph");
    expect(fingerprintFieldsForContract(2)).toContain("mobileCompositionStrategy");

    const result = evaluateProjectUniqueness({
      slug: "new-v2",
      compositionContract: 2,
      fingerprint: baseFingerprint,
      perceptualReview,
      contentFacts: { ownSourcedContent: true },
    });

    expect(result.status).toBe("FAIL");
    expect(result.details.join(" ")).toContain("roleGraph");
    expect(result.details.join(" ")).toContain("mobileCompositionStrategy");
  });

  test("detecta mesma jornada com copy/silhueta base diferentes", () => {
    const peer = {
      slug: "peer",
      fingerprint: {
        ...v2Fingerprint,
        heroGeometry: "technical diagonal stage",
        headerTreatment: "compact top bar",
        sectionGraph: "stage→catalog→process→close",
        contentOrder: ["offer", "catalog", "process", "conversion"],
        gridTopology: "broken grid",
      },
    };

    const result = evaluateProjectUniqueness(
      {
        slug: "new-v2",
        compositionContract: 2,
        fingerprint: v2Fingerprint,
        perceptualReview,
        contentFacts: { ownSourcedContent: true },
      },
      [peer],
    );

    expect(result.status).toBe("FAIL");
    expect(result.details.join(" ")).toContain("SAME_JOURNEY_DIFFERENT_COPY");
  });
});
