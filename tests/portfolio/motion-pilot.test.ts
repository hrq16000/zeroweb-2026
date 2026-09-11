import { describe, expect, it } from "vitest";
import { blueprint } from "@/components/site/MotionPilotPage";
import { validatePortfolioBlueprint } from "@/lib/portfolio-blueprint";

describe("LAB motion pilot", () => {
  it("é um Blueprint válido", () => {
    expect(validatePortfolioBlueprint(blueprint)).toEqual([]);
  });

  it("declara motion profile e cobre as capacidades do adendo", () => {
    expect(blueprint.motionProfile?.signatureEffects.length).toBeGreaterThan(0);
    const motions = blueprint.sections.map((s) => s.motion ?? {});
    expect(motions.some((m) => (m.parallax ?? 0) > 0)).toBe(true);
    expect(motions.some((m) => m.hover === "lift")).toBe(true);
    expect(motions.some((m) => m.hover === "glow")).toBe(true);
    expect(motions.some((m) => m.scrollProgress === true)).toBe(true);
    expect(
      blueprint.sections.some((s) => s.type === "signals" && s.content.items.some((i) => typeof i.countTo === "number")),
    ).toBe(true);
  });

  it("não é um projeto de portfólio nem usa contato direto", () => {
    expect(blueprint.slug.startsWith("lab-")).toBe(true);
    const json = JSON.stringify(blueprint);
    expect(json).not.toMatch(/tel:|wa\.me|whatsapp/i);
  });
});
