import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
  motionTemplateCoverage,
  motionTemplateRequiredEffects,
  motionTemplateSectionTypes,
} from "@/lib/motion-template";

/**
 * O laboratório /lab/motion-pilot é o canário da cobertura de motion e o
 * scaffold de novos /portfolio/:slug gera exatamente a mesma cobertura de
 * ENGENHARIA. Este teste impede que os três se separem silenciosamente.
 *
 * Ele NÃO valida criatividade: texto, paleta, densidade e signature moments
 * continuam livres em cada projeto (protegidos pelo gate de similaridade).
 */
const lab = readFileSync("src/components/site/MotionPilotPage.tsx", "utf8");
const scaffold = readFileSync("scripts/scaffold-portfolio-client.mjs", "utf8");

describe("motion template coverage", () => {
  it("cobre os seis slots de engenharia", () => {
    expect(motionTemplateSectionTypes()).toEqual([
      "hero",
      "signals",
      "capabilities",
      "useCases",
      "process",
      "cta",
    ]);
  });

  it("exige os efeitos observáveis do addendum de motion", () => {
    const effects = motionTemplateRequiredEffects();
    for (const effect of ["reveal", "parallax", "stagger", "counter", "hover", "imageZoom", "scrollProgress"]) {
      expect(effects).toContain(effect);
    }
  });

  it("o laboratório exercita todos os slots da cobertura", () => {
    for (const slot of motionTemplateCoverage.slots) {
      expect(lab).toContain(`type: "${slot.type}"`);
      expect(lab).toContain(`variant: "${slot.defaultVariant}"`);
    }
  });

  it("o scaffold consome a cobertura em vez de duplicá-la", () => {
    expect(scaffold).toContain("motion-template-coverage.json");
    expect(scaffold).toContain("--motion-template");
  });

  it("exige funil persistente e preserva conteúdo em reduced motion", () => {
    expect(motionTemplateCoverage.floatingConversion.required).toBe(true);
    expect(motionTemplateCoverage.reducedMotion.rule).toMatch(/nenhum conteúdo/i);
  });
});
