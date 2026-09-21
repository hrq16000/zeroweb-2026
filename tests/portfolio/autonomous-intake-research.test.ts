import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { buildAutonomousContentPlan } from "../../src/lib/portfolio-autonomous-content";
import { extractAutonomousStructuredEvidence } from "../../src/lib/portfolio-autonomous-evidence";

const research = readFileSync("src/lib/portfolio-autonomous-research.server.ts", "utf8");
const managed = readFileSync("src/lib/portfolio-managed.functions.ts", "utf8");
const wizard = readFileSync("src/routes/_authenticated/app.portfolio.novo.tsx", "utf8");
const contentComposer = readFileSync("src/lib/portfolio-autonomous-content.ts", "utf8");

describe("portfolio autônomo: intake mínimo e pesquisa", () => {
  test("entrada pública do admin exige somente nome e localização", () => {
    expect(wizard).toContain("Criação autônoma");
    expect(wizard).toContain("Nome do negócio");
    expect(wizard).toContain("Endereço, bairro ou cidade");
    expect(wizard).toContain("Pesquisar e criar");
  });

  test("pesquisa não depende de Google Maps existir", () => {
    expect(research).toContain("Se não existe ficha local confiável, ampliar a busca");
    expect(research).toContain('site:instagram.com');
    expect(research).toContain('site:facebook.com');
    expect(research).toContain('site:tiktok.com');
    expect(research).toContain('"NONE"');
  });

  test("conflito de identidade nunca é escolhido silenciosamente", () => {
    expect(research).toContain('"CONFLICT"');
    expect(research).toContain("não deve escolher silenciosamente");
  });

  test("telefone público não vira WhatsApp e o projeto nasce draft lead-only", () => {
    expect(research).toContain("Telefone público não é presumido WhatsApp");
    expect(managed).toContain('funnelDeliveryMode: "lead_only"');
    expect(managed).toContain('lifecycle_status: "draft"');
    expect(managed).toContain("funnel_enabled: false");
  });

  test("ledger da R1 é preservado e a R2 é persistida separadamente", () => {
    expect(managed).toContain("autonomous_research: research");
    expect(managed).toContain("autonomous_content: contentPlan");
    expect(managed).toContain('input_mode: "name_location_only"');
    expect(managed).toContain('research_status: "research_complete"');
    expect(managed).toContain("status: contentPlan.status");
  });

  test("R2 gera briefing, hero, SEO, CTA e FAQ sem inventar serviços", () => {
    const plan = buildAutonomousContentPlan({
      input: { name: "Studio Exemplo", locationText: "Centro, Curitiba - PR" },
      researchedAt: "2026-09-20T00:00:00.000Z",
      resolution: { status: "RESOLVED", confidence: 82, reason: "ok", placeId: "x" },
      footprint: "PARTIAL",
      locality: { city: "Curitiba", state: "PR", searchLocation: "Curitiba, PR, Brazil" },
      categoryHint: "beleza",
      segmentHint: "beleza",
      funnelIntentHint: "agendamento",
      facts: [
        { field: "name", value: "Studio Exemplo", sourceType: "OWNER_SUPPLIED", confidence: 100, sourceUrl: null },
        { field: "location", value: "Centro, Curitiba - PR", sourceType: "OWNER_SUPPLIED", confidence: 100, sourceUrl: null },
      ],
      mapCandidates: [],
      webResults: [],
      socialProfiles: [],
      mediaCandidates: [],
      reviewEvidence: [],
      website: null,
      providerCalls: [],
      providerErrors: [],
      missing: ["verified_services"],
      policy: "evidence only",
    });

    expect(plan.status).toBe("content_partial");
    expect(plan.services).toEqual([]);
    expect(plan.heroHeadline).toBe("Studio Exemplo");
    expect(plan.heroSubheadline).toContain("Curitiba");
    expect(plan.ctaLabel).toBe("Solicitar horário");
    expect(plan.seo.title).toContain("Studio Exemplo");
    expect(plan.content.faq.length).toBeGreaterThan(0);
    expect(plan.missing).toContain("verified_services");
  });

  test("R2 só promove serviço com evidência suficiente", () => {
    const plan = buildAutonomousContentPlan({
      input: { name: "Oficina Exemplo", locationText: "Curitiba - PR" },
      researchedAt: "2026-09-20T00:00:00.000Z",
      resolution: { status: "VERIFIED", confidence: 94, reason: "ok", placeId: "y" },
      footprint: "STRONG",
      locality: { city: "Curitiba", state: "PR", searchLocation: "Curitiba, PR, Brazil" },
      categoryHint: "serviços",
      segmentHint: "servicos",
      funnelIntentHint: "orcamento",
      facts: [
        { field: "name", value: "Oficina Exemplo", sourceType: "OWNER_SUPPLIED", confidence: 100, sourceUrl: null },
        { field: "location", value: "Curitiba - PR", sourceType: "OWNER_SUPPLIED", confidence: 100, sourceUrl: null },
        { field: "service", value: "Troca de óleo", sourceType: "PUBLIC_WEB", confidence: 90, sourceUrl: "https://example.com" },
        { field: "service", value: "Alinhamento", sourceType: "PUBLIC_WEB", confidence: 55, sourceUrl: "https://example.com" },
      ],
      mapCandidates: [],
      webResults: [],
      socialProfiles: [],
      mediaCandidates: [],
      reviewEvidence: [],
      website: null,
      providerCalls: [],
      providerErrors: [],
      missing: [],
      policy: "evidence only",
    });

    expect(plan.status).toBe("content_composed");
    expect(plan.services.map((service) => service.title)).toEqual(["Troca de óleo"]);
    expect(plan.services.map((service) => service.title)).not.toContain("Alinhamento");
  });

  test("R2 mantém inferências separadas de fatos", () => {
    expect(contentComposer).toContain("editorialInferences");
    expect(contentComposer).toContain("Inferências editoriais não podem ser publicadas como fatos");
    expect(contentComposer).toContain('services.length ? null : "verified_services"');
  });
  test("R1 promove apenas serviços explícitos em campos estruturados", () => {
    const facts = extractAutonomousStructuredEvidence({
      resolutionConfidence: 91,
      sourceUrl: "https://maps.example/business",
      placeServiceOptions: { dine_in: true, delivery: false },
      placeExtraFields: {
        services: ["Troca de óleo", "Alinhamento"],
        description: "Oficina completa com tudo que seu carro precisa.",
        products: ["Pneu"],
      },
      knowledgeGraph: { especialidades: "Balanceamento; Revisão preventiva" },
    });

    expect(facts.map((fact) => fact.value)).toEqual([
      "Troca de óleo",
      "Alinhamento",
      "Balanceamento",
      "Revisão preventiva",
    ]);
    expect(facts.every((fact) => fact.field === "service")).toBe(true);
    expect(facts.some((fact) => fact.value === "Pneu")).toBe(false);
    expect(facts.some((fact) => fact.value.includes("Oficina completa"))).toBe(false);
  });

  test("R1 não promove evidência estruturada quando a entidade ainda é fraca", () => {
    expect(
      extractAutonomousStructuredEvidence({
        resolutionConfidence: 60,
        sourceUrl: null,
        placeExtraFields: { services: ["Serviço não confirmado"] },
      }),
    ).toEqual([]);
  });

});
