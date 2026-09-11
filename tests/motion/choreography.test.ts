import { describe, expect, it } from "vitest";
import {
  cardChoreography,
  distinctVariants,
  roleChoreography,
} from "@/lib/motion-choreography";
import contract from "@/config/global-motion-contract.json";
import choreography from "@/config/motion-choreography.json";

describe("coreografia por superfície", () => {
  it("nenhuma superfície usa uma única sequência fade-up", () => {
    for (const id of Object.keys(choreography.surfaces) as Array<
      keyof typeof choreography.surfaces
    >) {
      expect(distinctVariants(id).length).toBeGreaterThanOrEqual(
        choreography.rules.minDistinctVariantsPerSurface,
      );
    }
  });

  it("home e vitrine têm gramáticas diferentes", () => {
    const home = roleChoreography("root-editorial", "closing");
    const catalog = roleChoreography("catalog-showcase", "filters");
    expect(home.variant).not.toBe(catalog.variant);
  });

  it("stagger de card é limitado e cicla variantes", () => {
    const first = cardChoreography(0);
    const second = cardChoreography(1);
    const far = cardChoreography(40);
    expect(first.variant).not.toBe(second.variant);
    expect(far.delay).toBeLessThanOrEqual(
      choreography.surfaces["catalog-showcase"].cardStaggerMaxSteps *
        choreography.surfaces["catalog-showcase"].cardStaggerMs,
    );
  });

  it("intensidades declaradas existem no contrato global", () => {
    const allowed = Object.keys(contract.tokens.intensity);
    for (const s of Object.values(choreography.surfaces)) {
      expect(allowed).toContain(s.intensity);
      for (const role of Object.values(s.roles)) {
        if ("intensity" in role && role.intensity) expect(allowed).toContain(role.intensity);
      }
    }
  });
});
