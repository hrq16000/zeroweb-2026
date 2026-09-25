import { describe, expect, test } from "bun:test";
import {
  buildManagedAuthorialCompositionPlan,
  sanitizeManagedAuthorialCompositionPlan,
} from "@/lib/portfolio-managed-composition";

const base = {
  slug: "cliente-exemplo",
  displayName: "Cliente Exemplo",
  segment: "servicos",
  city: "Curitiba",
  services: ["Projeto", "Instalação", "Manutenção", "Consultoria"],
  galleryCount: 6,
  hasDifferentials: true,
  hasSteps: true,
  hasAbout: true,
  hasFaq: true,
};

describe("managed authorial composition planner", () => {
  test("gera três direções materialmente divergentes e seleciona uma", () => {
    const plan = buildManagedAuthorialCompositionPlan(base);
    expect(plan.contract).toBe(1);
    expect(plan.status).toBe("selected");
    expect(plan.directions).toHaveLength(3);
    expect(new Set(plan.directions.map((item) => item.signature)).size).toBe(3);
    expect(new Set(plan.directions.map((item) => item.heroMode)).size).toBeGreaterThanOrEqual(2);
    expect(new Set(plan.directions.map((item) => item.sectionOrder.join(">"))).size).toBeGreaterThanOrEqual(2);
    expect(new Set(plan.directions.map((item) => item.serviceMode)).size).toBeGreaterThanOrEqual(2);
    expect(plan.directions.some((item) => item.signature === plan.selected.signature)).toBe(true);
    expect(sanitizeManagedAuthorialCompositionPlan(plan)?.selected.signature).toBe(
      plan.selected.signature,
    );
  });

  test("evita assinatura já usada quando recebe catálogo de colisões", () => {
    const first = buildManagedAuthorialCompositionPlan(base);
    const second = buildManagedAuthorialCompositionPlan(
      { ...base, slug: "cliente-exemplo-2", displayName: "Cliente Exemplo 2" },
      [first.selected.signature],
    );
    expect(second.selected.signature).not.toBe(first.selected.signature);
  });

  test("projetos diferentes não ficam presos a preset por segmento", () => {
    const a = buildManagedAuthorialCompositionPlan(base);
    const b = buildManagedAuthorialCompositionPlan({
      ...base,
      slug: "outra-marca",
      displayName: "Outra Marca",
      services: ["Diagnóstico", "Atendimento", "Entrega"],
    });
    expect(b.selected.signature).not.toBe(a.selected.signature);
    expect(b.basis).not.toBe(a.basis);
  });

  test("rejeita plano adulterado sem três direções", () => {
    const plan = buildManagedAuthorialCompositionPlan(base);
    const invalid = { ...plan, directions: [plan.directions[0]] };
    expect(sanitizeManagedAuthorialCompositionPlan(invalid)).toBeNull();
  });
});
