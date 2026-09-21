export type AutonomousStructuredFact = {
  field: "service";
  value: string;
  sourceType: "GOOGLE";
  confidence: number;
  sourceUrl: string | null;
};

type Input = {
  resolutionConfidence: number;
  sourceUrl: string | null;
  placeServiceOptions?: unknown;
  placeExtraFields?: Record<string, unknown> | null;
  knowledgeGraph?: Record<string, unknown> | null;
};

const SERVICE_KEYS = new Set([
  "service",
  "services",
  "servico",
  "servicos",
  "specialty",
  "specialties",
  "especialidade",
  "especialidades",
  "service_list",
  "services_list",
]);

function normKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function cleanLabel(value: string): string | null {
  const label = value.replace(/\s+/g, " ").trim();
  if (label.length < 2 || label.length > 80) return null;
  if (/^https?:\/\//i.test(label) || /www\./i.test(label)) return null;
  if (/[.!?].+[.!?]/.test(label)) return null;
  return label;
}

function labelsFromValue(value: unknown): string[] {
  if (typeof value === "string") {
    const raw = value.trim();
    if (!raw) return [];
    const parts = /[\n;•|]/.test(raw) ? raw.split(/[\n;•|]+/) : [raw];
    return parts.map(cleanLabel).filter((item): item is string => Boolean(item));
  }
  if (Array.isArray(value)) {
    return value.flatMap(labelsFromValue);
  }
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap(labelsFromValue);
  }
  return [];
}

function collectFromRecord(record: Record<string, unknown> | null | undefined): string[] {
  if (!record) return [];
  const out: string[] = [];
  for (const [key, value] of Object.entries(record)) {
    if (!SERVICE_KEYS.has(normKey(key))) continue;
    out.push(...labelsFromValue(value));
  }
  return out;
}

/**
 * Promove somente listas estruturadas explicitamente identificadas como
 * serviço/especialidade. Não lê description/snippet/categoria e ignora
 * flags booleanas de service_options (delivery, dine_in etc.).
 */
export function extractAutonomousStructuredEvidence(input: Input): AutonomousStructuredFact[] {
  if (input.resolutionConfidence < 70) return [];

  const labels = [
    ...collectFromRecord(
      input.placeServiceOptions &&
        typeof input.placeServiceOptions === "object" &&
        !Array.isArray(input.placeServiceOptions)
        ? (input.placeServiceOptions as Record<string, unknown>)
        : null,
    ),
    ...collectFromRecord(input.placeExtraFields),
    ...collectFromRecord(input.knowledgeGraph),
  ];

  const seen = new Set<string>();
  const confidence = Math.min(95, Math.max(70, Math.round(input.resolutionConfidence)));
  const facts: AutonomousStructuredFact[] = [];
  for (const label of labels) {
    const key = label
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    facts.push({
      field: "service",
      value: label,
      sourceType: "GOOGLE",
      confidence,
      sourceUrl: input.sourceUrl,
    });
    if (facts.length >= 20) break;
  }
  return facts;
}
