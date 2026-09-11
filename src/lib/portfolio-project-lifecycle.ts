/**
 * Contrato de estado do ciclo de vida de um projeto `/portfolio/:slug`.
 *
 * Documento mestre: docs/PORTFOLIO_PROJECT_LIFECYCLE.md
 * Dados: src/config/portfolio-project-manifests.json
 *
 * Projetos legados NÃO possuem manifesto e continuam sob os gates antigos.
 */
import manifestsRaw from "@/config/portfolio-project-manifests.json";

export type LifecycleState =
  | "not_started"
  | "in_progress"
  | "complete"
  | "blocked"
  | "not_applicable";

export type LifecycleStage =
  | "draft"
  | "research"
  | "enrichment"
  | "design"
  | "ready"
  | "published";

export const LIFECYCLE_STEPS = [
  "intake",
  "entityDiscovery",
  "entityResolution",
  "evidence",
  /** MEDIA DISCOVERY: procurar mídia real depois da entidade resolvida. */
  "media",
  /** MEDIA PLAN: intenção visual por seção (source/provenance/status). */
  "mediaPlan",
  "content",
  "discovery",
  "blueprint",
  "seo",
  "funnel",
  "cover",
  "qa",
  "publish",
] as const;

export type LifecycleStep = (typeof LIFECYCLE_STEPS)[number];

/**
 * QA visual nunca é presumido. `BLOCKED_ENVIRONMENT` registra que o navegador
 * não pôde ser executado — e não equivale a `PASS`.
 */
export const VISUAL_QA_STATUSES = ["PASS", "FAIL", "NOT_EXECUTED", "BLOCKED_ENVIRONMENT"] as const;
export type VisualQaStatus = (typeof VISUAL_QA_STATUSES)[number];

/** Estados de resolução de entidade (docs/PORTFOLIO_ENTITY_ENRICHMENT_STANDARD.md). */
export const ENTITY_RESOLUTION_STATUSES = [
  "FOUND",
  "RESOLVED",
  "VERIFIED",
  "UNRESOLVED",
  "CONFLICT",
] as const;
export type EntityResolutionStatus = (typeof ENTITY_RESOLUTION_STATUSES)[number];

export type SearchQaCase = {
  query: string;
  expect: "must_find" | "must_not_rank_high";
  slug?: string;
  verifiedAt?: string;
};

export type PortfolioProjectManifest = {
  slug: string;
  lifecycleContract: number;
  stage: LifecycleStage;
  lifecycle: Record<LifecycleStep, LifecycleState>;
  blockers: string[];
  warnings: string[];
  ownerRequired: string[];
  searchQa: SearchQaCase[];
  notes?: Record<string, string>;
  lastUpdatedAt: string;
};

type ManifestFile = {
  doc?: string;
  contractVersion: number;
  projects: Record<string, PortfolioProjectManifest>;
};

const file = manifestsRaw as unknown as ManifestFile;

export function getProjectManifest(slug: string): PortfolioProjectManifest | null {
  return file.projects[slug] ?? null;
}

/** Um projeto é "managed" quando adota o lifecycle novo; o resto é legado. */
export function isManagedLifecycleProject(slug: string): boolean {
  const m = getProjectManifest(slug);
  return Boolean(m && m.lifecycleContract >= 1);
}

export function listManagedLifecycleSlugs(): string[] {
  return Object.keys(file.projects);
}

/** Estados que não impedem avanço: dado ausente verificado é aceitável. */
export function isStepSatisfied(state: LifecycleState): boolean {
  return state === "complete" || state === "not_applicable";
}
