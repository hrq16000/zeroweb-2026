/**
 * Guardrails de montagem de landing page.
 *
 * Nenhuma seção persuasiva pode ser montada automaticamente sem evidência
 * auditável. Reviews, ratings, logos, urgência e escassez exigem fonte,
 * consentimento e período documentado — caso contrário são bloqueadas.
 */
import type { EvidenceItem } from "./skill-pipeline";

export const GUARDED_SECTIONS = ["reviews", "ratings", "logos", "urgency", "scarcity"] as const;
export type GuardedSection = (typeof GUARDED_SECTIONS)[number];

export type LandingSection =
  | GuardedSection
  | "hero"
  | "problem"
  | "solution"
  | "features"
  | "how-it-works"
  | "faq"
  | "pricing"
  | "cta"
  | "contact-funnel";

/** Requisitos de evidência por seção protegida. */
const REQUIRED_EVIDENCE: Record<GuardedSection, { kind: string; needsConsent: boolean; needsPeriod: boolean }> = {
  reviews: { kind: "review", needsConsent: true, needsPeriod: true },
  ratings: { kind: "rating", needsConsent: false, needsPeriod: true },
  logos: { kind: "client-logo", needsConsent: true, needsPeriod: false },
  urgency: { kind: "deadline", needsConsent: false, needsPeriod: true },
  scarcity: { kind: "inventory", needsConsent: false, needsPeriod: true },
};

export type GuardEvidence = EvidenceItem & {
  consent?: boolean;
  periodStart?: string;
  periodEnd?: string;
  methodology?: string;
};

export type GuardDecision = {
  section: LandingSection;
  allowed: boolean;
  reason: string;
};

export function isGuardedSection(section: LandingSection): section is GuardedSection {
  return (GUARDED_SECTIONS as readonly string[]).includes(section);
}

/** Decide se uma seção pode ser montada, dada a evidência disponível. */
export function evaluateSection(section: LandingSection, evidence: GuardEvidence[]): GuardDecision {
  if (!isGuardedSection(section)) {
    return { section, allowed: true, reason: "seção não persuasiva: não exige evidência" };
  }
  const req = REQUIRED_EVIDENCE[section];
  const matches = evidence.filter((e) => e.kind === req.kind);
  if (matches.length === 0) {
    return { section, allowed: false, reason: `sem evidência do tipo "${req.kind}" para ${section}` };
  }
  const sourced = matches.filter((e) => Boolean(e.source));
  if (sourced.length === 0) {
    return { section, allowed: false, reason: `evidência de ${section} sem fonte auditável` };
  }
  if (req.needsConsent && !sourced.some((e) => e.consent === true)) {
    return { section, allowed: false, reason: `evidência de ${section} sem consentimento registrado` };
  }
  if (req.needsPeriod && !sourced.some((e) => Boolean(e.periodStart && e.periodEnd))) {
    return { section, allowed: false, reason: `evidência de ${section} sem período documentado` };
  }
  return { section, allowed: true, reason: `evidência auditável encontrada (${sourced.length})` };
}

export type LandingPlan = {
  goal: string;
  sections: LandingSection[];
  evidence: GuardEvidence[];
};

export type LandingPlanResult = {
  goal: string;
  allowed: LandingSection[];
  blocked: GuardDecision[];
  decisions: GuardDecision[];
};

/**
 * Filtra o plano da landing removendo seções sem evidência.
 * Nunca lança — a página é montada sem as seções bloqueadas.
 */
export function applyLandingGuardrails(plan: LandingPlan): LandingPlanResult {
  const decisions = plan.sections.map((s) => evaluateSection(s, plan.evidence));
  return {
    goal: plan.goal,
    allowed: decisions.filter((d) => d.allowed).map((d) => d.section),
    blocked: decisions.filter((d) => !d.allowed),
    decisions,
  };
}
