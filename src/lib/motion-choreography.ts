/**
 * Coreografia por contexto (rodadas 3–4 do GlobalMotionContract).
 *
 * O contrato global (src/config/global-motion-contract.json) manda em
 * qualidade, duração, easing, limites e acessibilidade. Este módulo define
 * apenas a GRAMÁTICA de cada superfície pública: qual variante cabe em cada
 * papel narrativo, para que a home e a vitrine não usem a mesma sequência.
 *
 * Perfis locais de landing (portfolio-motion-profiles.json) continuam
 * prevalecendo dentro da própria landing — nada aqui é importado por elas.
 */
import choreography from "@/config/motion-choreography.json";
import type { MotionIntensity } from "@/lib/global-motion-contract";

export type MotionVariant = "fade" | "up" | "down" | "left" | "right" | "scale" | "mask";

export type SurfaceId = keyof typeof choreography.surfaces;

export type RoleChoreography = {
  variant: MotionVariant;
  intensity: MotionIntensity;
};

export const MOTION_CHOREOGRAPHY = choreography;

export function surface(id: SurfaceId) {
  return choreography.surfaces[id];
}

export function roleChoreography(id: SurfaceId, role: string): RoleChoreography {
  const s = choreography.surfaces[id] as {
    intensity: string;
    roles: Record<string, { variant: string; intensity?: string }>;
  };
  const found = s.roles[role];
  return {
    variant: (found?.variant ?? "fade") as MotionVariant,
    intensity: (found?.intensity ?? s.intensity) as MotionIntensity,
  };
}

/** Variantes distintas usadas por uma superfície — insumo do gate de variedade. */
export function distinctVariants(id: SurfaceId): MotionVariant[] {
  const s = choreography.surfaces[id] as { roles: Record<string, { variant: string }> };
  return [...new Set(Object.values(s.roles).map((r) => r.variant as MotionVariant))];
}

/**
 * Coreografia de um card de catálogo: cicla variantes e limita o atraso
 * acumulado, para que a última linha não fique esperando meio segundo.
 */
export function cardChoreography(index: number): RoleChoreography & { delay: number } {
  const s = choreography.surfaces["catalog-showcase"];
  const cycle = s.cardCycle as MotionVariant[];
  const steps = Math.min(index, s.cardStaggerMaxSteps);
  return {
    variant: cycle[index % cycle.length],
    intensity: "SUBTLE",
    delay: steps * s.cardStaggerMs,
  };
}
