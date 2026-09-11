/**
 * GlobalMotionContract — fonte única da linguagem de movimento pública da 0WEB.
 *
 * (A) Regras globais obrigatórias vivem aqui e valem para qualquer página:
 *     tokens, observação, limites, CTA flutuante, mobile e reduced motion.
 * (B) Personalidade (intensidade, preset, signature moments) continua local,
 *     por página institucional ou por projeto de portfólio.
 */
import contract from "@/config/global-motion-contract.json";

export type MotionIntensity = "SUBTLE" | "BALANCED" | "EXPRESSIVE" | "IMMERSIVE";
export type MotionRuntimeState = "idle" | "armed" | "played" | "static";

export const MOTION_CONTRACT = contract;

export const MOTION_TOKENS = contract.tokens;
export const MOTION_EASING = contract.tokens.easing;
export const MOTION_OBSERVER = contract.observer;
export const MOTION_LIMITS = contract.limits;
export const MOTION_FLOATING = contract.floatingConversion;
export const MOTION_MOBILE = contract.mobile;
export const MOTION_REDUCED = contract.reducedMotion;
export const MOTION_OBSERVABILITY = contract.observability;

export type IntensityTuning = {
  distance: number;
  duration: number;
  stagger: number;
  scale: number;
};

export const INTENSITY_TUNING = contract.tokens.intensity as Record<MotionIntensity, IntensityTuning>;

export function tuningFor(intensity: MotionIntensity): IntensityTuning {
  return INTENSITY_TUNING[intensity] ?? INTENSITY_TUNING.BALANCED;
}

/** Atributos de observabilidade: permitem auditar motion pelo DOM real. */
export function motionDataAttrs(
  primitive: string,
  state: MotionRuntimeState,
  intensity?: MotionIntensity,
) {
  return {
    [MOTION_OBSERVABILITY.attributes.primitive]: primitive,
    [MOTION_OBSERVABILITY.attributes.state]: state,
    ...(intensity ? { [MOTION_OBSERVABILITY.attributes.intensity]: intensity } : {}),
  } as Record<string, string>;
}

/** Clamp de parallax ao limite global (§limits). */
export function clampParallax(px: number): number {
  return Math.min(Math.abs(px), MOTION_LIMITS.maxParallaxOffsetPx) * Math.sign(px || 1);
}
