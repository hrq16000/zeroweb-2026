/**
 * Cobertura de motion compartilhada (docs/PORTFOLIO_LANDING_MOTION_ADDENDUM.md).
 *
 * `/lab/motion-pilot` é o canário: exercita cada slot desta cobertura com
 * conteúdo fictício. O scaffold de novos `/portfolio/:slug` gera a mesma
 * cobertura já preenchida com nome, segmento, hero e funil REAIS do cliente.
 *
 * Isto padroniza ENGENHARIA, não criatividade: variant, ordem, densidade,
 * copy, paleta e signature moments continuam decisão de cada projeto e são
 * comparados pelo gate de similaridade estrutural.
 */
import coverage from "@/config/motion-template-coverage.json";

export type MotionTemplateSlot = {
  slot: string;
  type: string;
  defaultVariant: string;
  order: number;
  motion: Record<string, string | number | boolean>;
  requires: string[];
  purpose: string;
};

export type MotionTemplateCoverage = {
  version: number;
  source: string;
  note: string;
  slots: MotionTemplateSlot[];
  floatingConversion: { required: boolean; note: string };
  reducedMotion: { rule: string };
};

export const motionTemplateCoverage = coverage as MotionTemplateCoverage;

/** Slots exigidos por qualquer landing gerada a partir do template. */
export const motionTemplateSlots = motionTemplateCoverage.slots;

/** Tipos de seção que precisam existir para a cobertura estar completa. */
export function motionTemplateSectionTypes(): string[] {
  return motionTemplateSlots.map((s) => s.type);
}

/** Efeitos que a cobertura exige ao menos uma vez na página. */
export function motionTemplateRequiredEffects(): string[] {
  return Array.from(new Set(motionTemplateSlots.flatMap((s) => s.requires)));
}
