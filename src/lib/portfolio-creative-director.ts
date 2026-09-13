import type { CompositionFingerprint } from "@/lib/portfolio-composition";

export type EvidenceConfidence = "VERIFIED" | "STRONG" | "WEAK" | "CONFLICT" | "UNKNOWN";

export type AutonomousEvidence = {
  field: string;
  value: string;
  source: string;
  sourceKind:
    | "CLIENT_SUPPLIED"
    | "EXISTING_VERIFIED_RECORD"
    | "OFFICIAL_WEBSITE"
    | "OFFICIAL_GOOGLE"
    | "OFFICIAL_SOCIAL"
    | "INTERNAL_HISTORY"
    | "PUBLIC_REGISTRY"
    | "THIRD_PARTY";
  confidence: EvidenceConfidence;
  entityKey?: string;
  city?: string;
  state?: string;
};

export type AutonomousIntake = {
  prompt: string;
  projectOwnerUserId?: string;
  businessName?: string;
  segment?: string;
  city?: string;
  state?: string;
  services?: string[];
  destination?: string;
  priceFacts?: string[];
  assets?: string[];
};

export type AdaptiveQuestion = {
  id: string;
  field: string;
  question: string;
  reason: string;
  blocking: boolean;
};

export type CreativeDirection = {
  id: string;
  label: string;
  rationale: string;
  businessPersonality: string;
  creativeConcept: string;
  visualMetaphor: string;
  heroGeometry: string;
  sectionGraph: string;
  gridTopology: string;
  typographyLanguage: string;
  colorStrategy: string;
  mediaNarrative: string;
  proofNarrative: string;
  conversionNarrative: string;
  motionNarrative: string;
  signatureMoments: string[];
  closingStructure: string;
};

export type DirectionPairSimilarity = {
  a: string;
  b: string;
  score: number;
  dimensions: Record<DirectionDimension, number>;
};

export type DirectionValidation = {
  ok: boolean;
  reasons: string[];
  pairs: DirectionPairSimilarity[];
};

export type DirectionDimension =
  | "hero"
  | "sections"
  | "grid"
  | "typography"
  | "media"
  | "motion"
  | "closing";

const DIRECTION_FIELDS: Record<DirectionDimension, (direction: CreativeDirection) => string> = {
  hero: (d) => d.heroGeometry,
  sections: (d) => d.sectionGraph,
  grid: (d) => d.gridTopology,
  typography: (d) => d.typographyLanguage,
  media: (d) => d.mediaNarrative,
  motion: (d) => d.motionNarrative,
  closing: (d) => d.closingStructure,
};

const WORD = /[\p{L}\p{N}]+/gu;

function tokens(value: string): Set<string> {
  const matches = value.toLocaleLowerCase("pt-BR").match(WORD) ?? [];
  return new Set(matches.filter((item) => item.length > 2));
}

export function jaccardText(a: string, b: string): number {
  const left = tokens(a);
  const right = tokens(b);
  if (!left.size && !right.size) return 1;
  if (!left.size || !right.size) return 0;
  let intersection = 0;
  for (const value of left) if (right.has(value)) intersection += 1;
  const union = new Set([...left, ...right]).size;
  return union ? intersection / union : 0;
}

export function compareDirections(a: CreativeDirection, b: CreativeDirection): DirectionPairSimilarity {
  const dimensions = Object.fromEntries(
    (Object.keys(DIRECTION_FIELDS) as DirectionDimension[]).map((key) => [
      key,
      Number(jaccardText(DIRECTION_FIELDS[key](a), DIRECTION_FIELDS[key](b)).toFixed(3)),
    ]),
  ) as Record<DirectionDimension, number>;

  // Hero, grafo e grid têm peso maior porque variação cosmética de copy/cor
  // não deve fazer duas composições estruturalmente iguais parecerem divergentes.
  const score =
    dimensions.hero * 0.2 +
    dimensions.sections * 0.22 +
    dimensions.grid * 0.18 +
    dimensions.typography * 0.1 +
    dimensions.media * 0.12 +
    dimensions.motion * 0.1 +
    dimensions.closing * 0.08;

  return { a: a.id, b: b.id, score: Number(score.toFixed(3)), dimensions };
}

export function validateDirectionSet(
  directions: CreativeDirection[],
  options: { minimum?: number; maximumPairSimilarity?: number } = {},
): DirectionValidation {
  const minimum = options.minimum ?? 3;
  const maximumPairSimilarity = options.maximumPairSimilarity ?? 0.58;
  const reasons: string[] = [];

  if (directions.length < minimum) {
    reasons.push(`MINIMUM_DIRECTIONS_REQUIRED:${minimum}`);
  }

  const ids = new Set<string>();
  for (const direction of directions) {
    if (!direction.id.trim()) reasons.push("DIRECTION_ID_REQUIRED");
    if (ids.has(direction.id)) reasons.push(`DUPLICATE_DIRECTION_ID:${direction.id}`);
    ids.add(direction.id);

    const required = [
      direction.label,
      direction.rationale,
      direction.businessPersonality,
      direction.creativeConcept,
      direction.visualMetaphor,
      direction.heroGeometry,
      direction.sectionGraph,
      direction.gridTopology,
      direction.typographyLanguage,
      direction.colorStrategy,
      direction.mediaNarrative,
      direction.proofNarrative,
      direction.conversionNarrative,
      direction.motionNarrative,
      direction.closingStructure,
    ];
    if (required.some((value) => !value?.trim()) || !direction.signatureMoments.length) {
      reasons.push(`INCOMPLETE_DIRECTION:${direction.id || "unknown"}`);
    }
  }

  const pairs: DirectionPairSimilarity[] = [];
  for (let i = 0; i < directions.length; i += 1) {
    for (let j = i + 1; j < directions.length; j += 1) {
      const pair = compareDirections(directions[i], directions[j]);
      pairs.push(pair);
      if (pair.score > maximumPairSimilarity) {
        reasons.push(`DIRECTIONS_TOO_SIMILAR:${pair.a}:${pair.b}:${pair.score}`);
      }
    }
  }

  return { ok: reasons.length === 0, reasons, pairs };
}

function strongEvidenceFor(field: string, evidence: AutonomousEvidence[]): AutonomousEvidence[] {
  return evidence.filter(
    (item) =>
      item.field === field &&
      (item.confidence === "VERIFIED" || item.confidence === "STRONG") &&
      Boolean(item.value.trim()),
  );
}

function hasConflict(field: string, evidence: AutonomousEvidence[]): boolean {
  const values = new Set(strongEvidenceFor(field, evidence).map((item) => item.value.trim().toLocaleLowerCase("pt-BR")));
  return evidence.some((item) => item.field === field && item.confidence === "CONFLICT") || values.size > 1;
}

/**
 * Pergunta apenas o que ainda é material e não foi resolvido por evidência forte.
 * A função é deliberadamente pura: o agente de pesquisa pode coletar evidências
 * antes de chamar este passo sem acoplar o domínio a um provedor de IA.
 */
export function deriveAdaptiveQuestions(
  intake: AutonomousIntake,
  evidence: AutonomousEvidence[],
): AdaptiveQuestion[] {
  const questions: AdaptiveQuestion[] = [];
  const add = (question: AdaptiveQuestion) => {
    if (!questions.some((item) => item.id === question.id)) questions.push(question);
  };

  if (!intake.projectOwnerUserId) {
    add({
      id: "owner",
      field: "project_owner",
      question: "Quem deve ser o proprietário deste projeto na 0WEB?",
      reason: "Todo projeto publicável precisa de ownership explícito.",
      blocking: true,
    });
  }

  if (!intake.businessName && strongEvidenceFor("business_name", evidence).length === 0) {
    add({
      id: "business_name",
      field: "business_name",
      question: "Qual é o nome da empresa ou marca que deve aparecer no site?",
      reason: "A identidade da entidade ainda não foi resolvida.",
      blocking: true,
    });
  }

  if (hasConflict("business_name", evidence)) {
    add({
      id: "business_identity_conflict",
      field: "business_name",
      question: "Encontrei mais de uma empresa plausível. Qual delas é a sua?",
      reason: "Há conflito de identidade; escolher automaticamente pode atribuir dados de outra empresa.",
      blocking: true,
    });
  }

  const cityKnown = Boolean(intake.city) || strongEvidenceFor("city", evidence).length > 0;
  if (!cityKnown) {
    add({
      id: "city",
      field: "city",
      question: "Qual cidade ou região principal este negócio atende?",
      reason: "Localidade é necessária para resolver a entidade e gerar SEO/localização coerentes.",
      blocking: true,
    });
  }

  const servicesKnown = Boolean(intake.services?.some(Boolean)) || strongEvidenceFor("service", evidence).length > 0;
  if (!servicesKnown) {
    add({
      id: "services",
      field: "services",
      question: "Quais são os principais serviços ou produtos que você quer destacar?",
      reason: "Não há oferta verificável suficiente para compor a página.",
      blocking: true,
    });
  }

  const destinationKnown = Boolean(intake.destination) || strongEvidenceFor("destination", evidence).length > 0;
  if (!destinationKnown || hasConflict("destination", evidence)) {
    add({
      id: "destination",
      field: "destination",
      question: hasConflict("destination", evidence)
        ? "Encontrei mais de um contato plausível. Qual número deve receber os pedidos deste site?"
        : "Qual número deve receber os pedidos e confirmações deste site?",
      reason: "O funil não pode direcionar leads para contato não comprovado.",
      blocking: false,
    });
  }

  if (!intake.assets?.length && strongEvidenceFor("official_asset", evidence).length === 0) {
    add({
      id: "assets",
      field: "assets",
      question: "Você tem logo ou fotos próprias que deseja usar?",
      reason: "A página pode avançar com mídia conceitual, mas ativos oficiais aumentam autenticidade.",
      blocking: false,
    });
  }

  return questions;
}

export type PortfolioNoveltyCandidate = {
  slug: string;
  fingerprint: CompositionFingerprint;
};

function fingerprintToDirection(fingerprint: CompositionFingerprint): Pick<CreativeDirection, keyof typeof DIRECTION_FIELDS extends never ? never : never> {
  // Marcador de tipo não utilizado em runtime; comparação real abaixo evita
  // converter o fingerprint inteiro para um template visual.
  return {} as never;
}

export function directionSimilarityToFingerprint(
  direction: CreativeDirection,
  fingerprint: CompositionFingerprint,
): number {
  void fingerprintToDirection;
  const dimensions = [
    jaccardText(direction.heroGeometry, fingerprint.heroGeometry),
    jaccardText(direction.sectionGraph, fingerprint.sectionGraph),
    jaccardText(direction.gridTopology, fingerprint.gridTopology),
    jaccardText(direction.mediaNarrative, fingerprint.mediaDistribution),
    jaccardText(direction.motionNarrative, fingerprint.motionSignature),
    jaccardText(direction.closingStructure, fingerprint.closingStructure),
  ];
  const weights = [0.22, 0.24, 0.2, 0.12, 0.12, 0.1];
  return Number(dimensions.reduce((sum, value, index) => sum + value * weights[index], 0).toFixed(3));
}

export function rankDirectionsByNovelty(
  directions: CreativeDirection[],
  existing: PortfolioNoveltyCandidate[],
): Array<CreativeDirection & { noveltyScore: number; nearestSlug: string | null; nearestSimilarity: number }> {
  return directions
    .map((direction) => {
      let nearestSlug: string | null = null;
      let nearestSimilarity = 0;
      for (const project of existing) {
        const similarity = directionSimilarityToFingerprint(direction, project.fingerprint);
        if (similarity > nearestSimilarity) {
          nearestSimilarity = similarity;
          nearestSlug = project.slug;
        }
      }
      return {
        ...direction,
        noveltyScore: Number((1 - nearestSimilarity).toFixed(3)),
        nearestSlug,
        nearestSimilarity,
      };
    })
    .sort((a, b) => b.noveltyScore - a.noveltyScore);
}
