import { describe, expect, it } from "bun:test";
import {
  compareDirections,
  deriveAdaptiveQuestions,
  directionSimilarityToFingerprint,
  rankDirectionsByNovelty,
  validateDirectionSet,
  type CreativeDirection,
} from "./portfolio-creative-director";
import type { CompositionFingerprint } from "./portfolio-composition";

const direction = (id: string, patch: Partial<CreativeDirection> = {}): CreativeDirection => ({
  id,
  label: `Direção ${id}`,
  rationale: `Racional ${id}`,
  businessPersonality: "próximo, técnico e confiável",
  creativeConcept: `conceito autoral ${id}`,
  visualMetaphor: `metáfora ${id}`,
  heroGeometry: `hero geometry ${id}`,
  sectionGraph: `graph ${id} alpha beta`,
  gridTopology: `grid topology ${id}`,
  typographyLanguage: `typography ${id}`,
  colorStrategy: `color ${id}`,
  mediaNarrative: `media narrative ${id}`,
  proofNarrative: `proof narrative ${id}`,
  conversionNarrative: `conversion ${id}`,
  motionNarrative: `motion ${id}`,
  signatureMoments: [`signature ${id}`],
  closingStructure: `closing ${id}`,
  ...patch,
});

describe("portfolio creative director", () => {
  it("faz somente perguntas materiais ainda não resolvidas", () => {
    const questions = deriveAdaptiveQuestions(
      {
        prompt: "crie um site para minha oficina",
        projectOwnerUserId: "user-1",
        businessName: "Oficina Horizonte",
        city: "Curitiba",
        services: ["Mecânica geral"],
      },
      [],
    );

    expect(questions.map((item) => item.id)).toEqual(["destination", "assets"]);
    expect(questions.find((item) => item.id === "destination")?.blocking).toBe(false);
  });

  it("não pergunta destino quando evidência forte já resolveu o contato", () => {
    const questions = deriveAdaptiveQuestions(
      {
        prompt: "site da oficina",
        projectOwnerUserId: "user-1",
        businessName: "Oficina Horizonte",
        city: "Curitiba",
        services: ["Freios"],
      },
      [
        {
          field: "destination",
          value: "554133334444",
          source: "site oficial",
          sourceKind: "OFFICIAL_WEBSITE",
          confidence: "VERIFIED",
        },
      ],
    );

    expect(questions.some((item) => item.id === "destination")).toBe(false);
  });

  it("obriga decisão humana quando há conflito de entidade", () => {
    const questions = deriveAdaptiveQuestions(
      { prompt: "site para Almeida" },
      [
        {
          field: "business_name",
          value: "Almeida Serviços",
          source: "fonte A",
          sourceKind: "THIRD_PARTY",
          confidence: "STRONG",
        },
        {
          field: "business_name",
          value: "Almeida & Torres",
          source: "fonte B",
          sourceKind: "PUBLIC_REGISTRY",
          confidence: "STRONG",
        },
      ],
    );

    expect(questions.some((item) => item.id === "business_identity_conflict")).toBe(true);
  });

  it("rejeita conjunto com menos de três direções", () => {
    const result = validateDirectionSet([direction("a"), direction("b")]);
    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("MINIMUM_DIRECTIONS_REQUIRED:3");
  });

  it("rejeita direções estruturalmente iguais mesmo com nomes diferentes", () => {
    const common = {
      heroGeometry: "split hero imagem direita texto esquerda",
      sectionGraph: "hero services about faq cta",
      gridTopology: "twelve columns cards three by three",
      typographyLanguage: "sans geometric bold",
      mediaNarrative: "hero photo then card icons",
      motionNarrative: "fade up sections",
      closingStructure: "centered cta panel",
    };
    const result = validateDirectionSet([
      direction("a", common),
      direction("b", common),
      direction("c", {
        heroGeometry: "full bleed type over image",
        sectionGraph: "manifesto timeline proof map close",
        gridTopology: "editorial asymmetrical columns",
        typographyLanguage: "serif display with mono labels",
        mediaNarrative: "cinematic full width chapters",
        motionNarrative: "mask reveals and timeline progress",
        closingStructure: "editorial split conclusion",
      }),
    ]);
    expect(result.ok).toBe(false);
    expect(result.reasons.some((reason) => reason.startsWith("DIRECTIONS_TOO_SIMILAR:a:b"))).toBe(true);
  });

  it("aceita três composições realmente divergentes", () => {
    const result = validateDirectionSet([
      direction("editorial", {
        heroGeometry: "oversized editorial title with narrow portrait rail",
        sectionGraph: "manifesto→index→case-notes→map→quiet-close",
        gridTopology: "asymmetric five seven editorial grid",
        typographyLanguage: "serif display mono annotations",
        mediaNarrative: "portrait crops and document details",
        motionNarrative: "mask typography and sticky annotations",
        closingStructure: "quiet typographic closing statement",
      }),
      direction("immersive", {
        heroGeometry: "full viewport cinematic scene with bottom dock",
        sectionGraph: "scene→horizontal-story→service-frames→proof-wall→immersive-close",
        gridTopology: "full bleed layers with floating panels",
        typographyLanguage: "condensed grotesk uppercase captions",
        mediaNarrative: "cinematic scenes dominate every chapter",
        motionNarrative: "parallax scenes and horizontal transitions",
        closingStructure: "full bleed final scene with docked action",
      }),
      direction("technical", {
        heroGeometry: "diagnostic dashboard with live status column",
        sectionGraph: "diagnostic→systems-map→service-table→process-console→request-panel",
        gridTopology: "modular technical matrix with data rails",
        typographyLanguage: "neutral sans plus monospace operational data",
        mediaNarrative: "schematics diagrams equipment detail crops",
        motionNarrative: "status progress and deliberate panel transitions",
        closingStructure: "request console with structured summary",
      }),
    ]);
    expect(result.ok).toBe(true);
  });

  it("ranqueia direção mais distante do portfólio existente", () => {
    const fingerprint: CompositionFingerprint = {
      heroGeometry: "split hero image right text left",
      headerTreatment: "simple header",
      sectionGraph: "hero services about faq cta",
      contentOrder: ["hero", "services", "about", "faq", "cta"],
      gridTopology: "three card grid",
      mediaDistribution: "hero photo and service icons",
      backgroundRhythm: "white gray white",
      proofPlacement: "before faq",
      ctaDistribution: "hero and closing",
      navigationPattern: "top navigation",
      motionSignature: "fade up",
      closingStructure: "centered cta panel",
    };

    const familiar = direction("familiar", {
      heroGeometry: "split hero image right text left",
      sectionGraph: "hero services about faq cta",
      gridTopology: "three card grid",
      mediaNarrative: "hero photo and service icons",
      motionNarrative: "fade up",
      closingStructure: "centered cta panel",
    });
    const novel = direction("novel", {
      heroGeometry: "vertical manifesto with edge media ribbon",
      sectionGraph: "manifesto timeline workshop-map story-close",
      gridTopology: "asymmetric editorial ribbon layout",
      mediaNarrative: "document details and cinematic chapters",
      motionNarrative: "timeline progress and masked chapter transition",
      closingStructure: "offset narrative conclusion",
    });

    expect(compareDirections(familiar, novel).score).toBeLessThan(0.58);
    expect(directionSimilarityToFingerprint(familiar, fingerprint)).toBeGreaterThan(
      directionSimilarityToFingerprint(novel, fingerprint),
    );
    const ranked = rankDirectionsByNovelty([familiar, novel], [{ slug: "existing", fingerprint }]);
    expect(ranked[0].id).toBe("novel");
  });
});
