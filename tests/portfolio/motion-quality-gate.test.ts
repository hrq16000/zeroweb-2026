import { describe, expect, it } from "bun:test";
// @ts-expect-error — script utilitário em .mjs sem tipos
import {
  MOTION_GATE_CHECKS,
  MOTION_PROFILE_FIELDS,
  MOTION_QUALITY_PROFILE_KEYS,
  evaluateMotion,
} from "../../scripts/check-portfolio-landing-quality.mjs";
import matrix from "../../docs/portfolio/quality-matrix/moreira-auto-mecanica.json";

/**
 * MOTION_QUALITY_GATE — docs/PORTFOLIO_LANDING_MOTION_ADDENDUM.md §15.
 * Projeto novo (contractVersion >= 3) não pode nascer sem estratégia de motion.
 */
describe("MOTION_QUALITY_GATE", () => {
  it("reprova projeto novo sem bloco de motion", () => {
    const result = evaluateMotion({}, 3);
    expect(result.failures.length).toBeGreaterThan(0);
  });

  it("não reprova retroativamente contrato antigo", () => {
    const result = evaluateMotion({}, 2);
    expect(result.failures).toHaveLength(0);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("reprova motion profile incompleto ou checklist faltando", () => {
    const result = evaluateMotion({ motion: { profile: { intensity: "BALANCED" }, gate: {} } }, 3);
    expect(result.failures.some((f: string) => f.includes("motionProfile.personality"))).toBe(true);
    expect(result.failures.some((f: string) => f.includes("MOTION_QUALITY_GATE"))).toBe(true);
  });

  it("aprova a Moreira Auto Mecânica com motion declarado e avaliado", () => {
    const result = evaluateMotion(matrix, 3);
    expect(result.failures).toHaveLength(0);
    for (const field of MOTION_PROFILE_FIELDS) {
      expect(matrix.motion.profile[field as keyof typeof matrix.motion.profile]).toBeTruthy();
    }
    for (const check of MOTION_GATE_CHECKS) {
      expect(matrix.motion.gate[check as keyof typeof matrix.motion.gate]).toBeTruthy();
    }
    for (const key of MOTION_QUALITY_PROFILE_KEYS) {
      expect(matrix.motion.qualityProfile[key as keyof typeof matrix.motion.qualityProfile]).toBeTruthy();
    }
  });

  it("mantém no máximo 3 efeitos assinatura", () => {
    expect(matrix.motion.profile.signatureEffects.length).toBeLessThanOrEqual(3);
  });
});
