import { describe, expect, it } from "vitest";
// @ts-expect-error — gate utilitário em JS puro
import {
  evaluateProjectUniqueness,
  CURRENT_COMPOSITION_CONTRACT_VERSION,
  FINGERPRINT_FIELDS_V2,
} from "../../scripts/portfolio-project-uniqueness.mjs";

const baseFingerprint = {
  heroGeometry: "cinematic asymmetric stage with diagonal crop",
  headerTreatment: "floating compact rail",
  sectionGraph: "stage→editorial-proof→service-path→local-close",
  contentOrder: ["promessa", "prova", "serviços", "local", "ação"],
  gridTopology: "7/5 hero + editorial asymmetric flow",
  mediaDistribution: "hero dominant + process detail + local proof",
  backgroundRhythm: "paper→dark→paper→accent",
  proofPlacement: "adjacent to the material claim",
  ctaDistribution: "hero + contextual middle + closing",
  navigationPattern: "short anchor rail",
  motionSignature: "masked hero reveal + path progress",
  closingStructure: "compact decision panel",
};

const v2Fingerprint = {
  ...baseFingerprint,
  roleGraph: ["orientation", "proof", "decision-support", "conversion"],
  mediaCadence: ["media-dominant", "text-dominant", "balanced", "quiet-close"],
  interactionLoci: ["hero-choice", "decision-aid", "final-funnel"],
  decisionAidPlacement: "between proof and conversion where uncertainty peaks",
  densityRhythm: ["airy", "dense", "airy", "dense"],
  mobileCompositionStrategy: "recompose hero as media-first, collapse rail into contextual checkpoints",
};

const review = {
  screenshots: { "390": "390.png", "1440": "1440.png" },
  noBrandTest: "PASS",
  comparedWith: ["peer-a"],
};

const contentFacts = { ownSourcedContent: true };

describe("PROJECT_UNIQUENESS_GATE — composition contract v2", () => {
  it("mantém projetos v1 válidos sem exigir os campos novos", () => {
    const result = evaluateProjectUniqueness(
      {
        slug: "legacy-v1",
        compositionContract: 1,
        fingerprint: baseFingerprint,
        perceptualReview: review,
        contentFacts,
      },
      [],
    );

    expect(result.status).toBe("PASS");
    expect(result.results.JOURNEY_UNIQUENESS).toBeUndefined();
  });

  it("reprova v2 quando os novos campos estão ausentes ou com placeholder", () => {
    const result = evaluateProjectUniqueness(
      {
        slug: "new-v2-incomplete",
        compositionContract: 2,
        fingerprint: {
          ...baseFingerprint,
          roleGraph: ["[PREENCHER]"],
        },
        perceptualReview: review,
        contentFacts,
      },
      [],
    );

    expect(CURRENT_COMPOSITION_CONTRACT_VERSION).toBe(2);
    expect(result.status).toBe("FAIL");
    expect(result.details.join(" ")).toContain("fingerprint incompleto");
    for (const field of FINGERPRINT_FIELDS_V2) {
      expect(result.details.join(" ")).toContain(field);
    }
  });

  it("aprova v2 completo quando a jornada é autoral", () => {
    const result = evaluateProjectUniqueness(
      {
        slug: "new-v2-complete",
        compositionContract: 2,
        fingerprint: v2Fingerprint,
        perceptualReview: review,
        contentFacts,
      },
      [],
    );

    expect(result.status).toBe("PASS");
    expect(result.results.JOURNEY_UNIQUENESS).toBe("PASS");
    expect(result.results.MEDIA_CADENCE_UNIQUENESS).toBe("PASS");
    expect(result.results.INTERACTION_UNIQUENESS).toBe("PASS");
    expect(result.results.MOBILE_COMPOSITION_UNIQUENESS).toBe("PASS");
  });

  it("reprova mesma jornada mesmo com geometria e aparência diferentes", () => {
    const peerFingerprint = {
      heroGeometry: "full bleed product wall",
      headerTreatment: "vertical side navigation",
      sectionGraph: "wall→catalogue→comparison→immersive-close",
      contentOrder: ["produto", "catálogo", "comparação", "ação"],
      gridTopology: "masonry wall + full width bands",
      mediaDistribution: "catalogue heavy + full bleed closing",
      backgroundRhythm: "black→white→accent",
      proofPlacement: "inside comparison rail",
      ctaDistribution: "catalogue cards + close",
      navigationPattern: "side rail",
      motionSignature: "horizontal rail + crossfade",
      closingStructure: "full bleed product close",
      roleGraph: [...v2Fingerprint.roleGraph],
      mediaCadence: [...v2Fingerprint.mediaCadence],
      interactionLoci: [...v2Fingerprint.interactionLoci],
      decisionAidPlacement: v2Fingerprint.decisionAidPlacement,
      densityRhythm: [...v2Fingerprint.densityRhythm],
      mobileCompositionStrategy: "different mobile stack with catalogue-first navigation",
    };

    const result = evaluateProjectUniqueness(
      {
        slug: "new-v2-same-journey",
        compositionContract: 2,
        fingerprint: v2Fingerprint,
        perceptualReview: review,
        contentFacts,
      },
      [{ slug: "peer-a", fingerprint: peerFingerprint }],
    );

    expect(result.status).toBe("FAIL");
    expect(result.details.join(" ")).toContain("SAME_JOURNEY_DIFFERENT_COPY");
    expect(result.results.JOURNEY_UNIQUENESS).toBe("FAIL");
    expect(result.results.MEDIA_CADENCE_UNIQUENESS).toBe("FAIL");
    expect(result.results.INTERACTION_UNIQUENESS).toBe("FAIL");
  });
});
