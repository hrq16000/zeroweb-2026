import { describe, expect, it } from "vitest";
// @ts-expect-error — script utilitário em JS puro
import { evaluateStructuralOriginality, FAMILIES, sectionOrderSimilarity } from "../../scripts/portfolio-structural-originality.mjs";

const baseSignature = {
  segment: "marcenaria",
  layoutFamily: "showcase-visual",
  heroFamily: "media-led",
  sectionRhythm: "long-scroll-immersive",
  proofStyle: "review-cards",
  mediaNarrative: "mosaic-gallery",
  ctaStyle: "post-proof",
  motionProfile: "cabinetry-settling",
};

const peer = {
  slug: "peer-a",
  lastUpdatedAt: "2026-09-11",
  segment: "marcenaria",
  signature: baseSignature,
  sectionOrder: ["hero.fullBleed", "signals.strip", "proof.reviews", "cta.immersive"],
};

const newProject = (overrides: Record<string, unknown> = {}) => ({
  structuralContract: 1,
  structuralSignature: { ...baseSignature, ...(overrides.signature as object) },
  structuralOriginalityReview: { approved: true },
  ...overrides,
});

describe("STRUCTURAL_ORIGINALITY_GATE", () => {
  it("reprova projeto novo sem assinatura estrutural", () => {
    const r = evaluateStructuralOriginality({
      slug: "novo",
      manifest: { structuralContract: 1 },
      sectionOrder: ["hero.split"],
      peers: [],
    });
    expect(r.status).toBe("FAIL");
    expect(r.enforced).toBe(true);
  });

  it("apenas avisa em projeto legado (sem structuralContract)", () => {
    const r = evaluateStructuralOriginality({ slug: "legado", manifest: {}, sectionOrder: [], peers: [] });
    expect(r.failures).toHaveLength(0);
    expect(r.warnings.length).toBeGreaterThan(0);
  });

  it("reprova skin swap: mesma assinatura de um par da janela", () => {
    const r = evaluateStructuralOriginality({
      slug: "novo",
      manifest: newProject(),
      sectionOrder: peer.sectionOrder,
      peers: [peer],
    });
    expect(r.status).toBe("FAIL");
    expect(r.checks.notPerceivedAsSkinSwap).toBe("FAIL");
    expect(r.checks.heroStructureUniqueEnough).toBe("FAIL");
  });

  it("aprova composição autoral distinta", () => {
    const r = evaluateStructuralOriginality({
      slug: "novo",
      manifest: newProject({
        signature: {
          layoutFamily: "processo-e-etapas",
          heroFamily: "process-first",
          sectionRhythm: "crescendo",
          proofStyle: "service-timeline",
          mediaNarrative: "before-after",
          ctaStyle: "next-step-block",
        },
      }),
      sectionOrder: ["hero.process", "process.timeline", "capabilities.band", "location.panel"],
      peers: [peer],
    });
    expect(r.failures).toEqual([]);
  });

  it("exige aprovação editorial de originalidade", () => {
    const r = evaluateStructuralOriginality({
      slug: "novo",
      manifest: { ...newProject(), structuralOriginalityReview: { approved: false } },
      sectionOrder: ["hero.process", "process.timeline"],
      peers: [],
    });
    expect(r.failures.join(" ")).toContain("aprovação editorial");
  });

  it("mede similaridade de ordem de seções", () => {
    expect(sectionOrderSimilarity(["a", "b", "c"], ["a", "b", "c"])).toBe(1);
    expect(sectionOrderSimilarity(["a", "b"], ["x", "y"])).toBe(0);
  });

  it("declara as oito famílias estruturais", () => {
    expect(FAMILIES.layoutFamilies).toHaveLength(8);
    expect(FAMILIES.comparisonWindow).toEqual({ recentProjects: 12, sameLayoutFamily: 5, sameSegment: 5 });
  });
});
