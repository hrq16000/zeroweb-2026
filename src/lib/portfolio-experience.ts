import experienceLevels from "@/config/portfolio-experience-levels.json";

/**
 * Fonte canônica única do nível de experiência: gerado por
 * `bun run check:experience-standard`. O admin apenas lê — nunca classifica.
 * Taxonomia interna → leitura do padrão global:
 *   PREMIUM = IMMERSIVE · SIGNATURE = SIGNATURE · BASELINE = BASIC · STATIC = STATIC
 */
export type ExperienceLevel = "PREMIUM" | "SIGNATURE" | "BASELINE" | "STATIC";

const LEVELS = experienceLevels.levels as Record<string, ExperienceLevel>;

export const EXPERIENCE_SUMMARY = experienceLevels.summary;

export const EXPERIENCE_LABEL: Record<ExperienceLevel, string> = {
  PREMIUM: "IMMERSIVE",
  SIGNATURE: "SIGNATURE",
  BASELINE: "BASIC",
  STATIC: "STATIC",
};

export const EXPERIENCE_BADGE_STYLE: Record<ExperienceLevel, string> = {
  PREMIUM: "bg-primary/15 text-primary",
  SIGNATURE: "bg-primary/10 text-primary",
  BASELINE: "bg-muted text-foreground",
  STATIC: "bg-destructive/10 text-destructive",
};

export function getExperienceLevel(slug: string): ExperienceLevel | null {
  return LEVELS[slug] ?? null;
}
