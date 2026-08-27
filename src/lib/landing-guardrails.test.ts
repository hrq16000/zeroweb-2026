import { describe, expect, test } from "bun:test";
import {
  applyLandingGuardrails,
  evaluateSection,
  GUARDED_SECTIONS,
  type GuardEvidence,
} from "./landing-guardrails";

const noEvidence: GuardEvidence[] = [];

describe("guardrails de seções persuasivas", () => {
  test.each(GUARDED_SECTIONS)("bloqueia %s sem evidência", (section) => {
    const d = evaluateSection(section, noEvidence);
    expect(d.allowed).toBe(false);
    expect(d.reason).toContain("sem evidência");
  });

  test("bloqueia review com fonte mas sem consentimento", () => {
    const d = evaluateSection("reviews", [
      { kind: "review", claim: "cliente elogiou", source: "e-mail 2026-02", periodStart: "2026-01-01", periodEnd: "2026-02-01" },
    ]);
    expect(d.allowed).toBe(false);
    expect(d.reason).toContain("consentimento");
  });

  test("bloqueia rating sem período documentado", () => {
    const d = evaluateSection("ratings", [{ kind: "rating", claim: "4.8", source: "Google Business" }]);
    expect(d.allowed).toBe(false);
    expect(d.reason).toContain("período");
  });

  test("libera logo com fonte e consentimento", () => {
    const d = evaluateSection("logos", [
      { kind: "client-logo", claim: "Cliente X", source: "contrato assinado", consent: true },
    ]);
    expect(d.allowed).toBe(true);
  });

  test("seção não persuasiva não exige evidência", () => {
    expect(evaluateSection("hero", noEvidence).allowed).toBe(true);
    expect(evaluateSection("contact-funnel", noEvidence).allowed).toBe(true);
  });
});

describe("applyLandingGuardrails", () => {
  test("remove seções fabricadas e mantém as legítimas", () => {
    const result = applyLandingGuardrails({
      goal: "captação",
      sections: ["hero", "features", "reviews", "scarcity", "contact-funnel"],
      evidence: [],
    });
    expect(result.allowed).toEqual(["hero", "features", "contact-funnel"]);
    expect(result.blocked.map((b) => b.section)).toEqual(["reviews", "scarcity"]);
  });

  test("não impõe seções: o plano vazio permanece vazio", () => {
    const result = applyLandingGuardrails({ goal: "x", sections: [], evidence: [] });
    expect(result.allowed).toEqual([]);
    expect(result.decisions).toEqual([]);
  });
});
