/**
 * Pipeline evidence-first de seleção de skills.
 *
 * FIND → RANK → SECURITY REVIEW → SELECT STACK → CROSS-REVIEW → TEST →
 * VISUAL QA → SHIP
 *
 * Cada etapa é uma função pura e testável isoladamente; `runSkillPipeline`
 * encadeia todas e devolve um relatório com as evidências que justificaram
 * cada inclusão e cada rejeição.
 */
import {
  SKILL_REGISTRY,
  type SkillRecord,
  type SkillStatus,
} from "@/data/skill-registry";

export type TaskClass =
  | "landing-page"
  | "portfolio-client-site"
  | "institutional-page"
  | "dashboard"
  | "form"
  | "funnel"
  | "component-refactor"
  | "design-system"
  | "content/SEO"
  | "motion"
  | "accessibility-fix"
  | "performance"
  | "bugfix"
  | "backend/RLS"
  | "docs";

export type PipelineTask = {
  id: string;
  title: string;
  classes: TaskClass[];
  /** Evidências disponíveis (dados auditáveis) para a tarefa. */
  evidence?: EvidenceItem[];
};

export type EvidenceItem = {
  kind: string;
  claim: string;
  /** Fonte auditável; sem fonte a evidência é rejeitada. */
  source: string | null;
  verifiedAt?: string;
};

export type RankedCandidate = {
  skill: SkillRecord;
  score: number;
  reasons: string[];
};

export type StageResult<T> = {
  stage: string;
  accepted: T[];
  rejected: { item: string; reason: string }[];
};

const CATEGORY_BY_CLASS: Record<TaskClass, SkillRecord["category"][]> = {
  "landing-page": ["design/UI", "conteúdo/SEO", "QA/a11y/perf"],
  "portfolio-client-site": ["design/UI", "QA/a11y/perf", "orquestração"],
  "institutional-page": ["design/UI", "conteúdo/SEO"],
  dashboard: ["design/UI", "QA/a11y/perf"],
  form: ["design/UI", "QA/a11y/perf", "acessibilidade"],
  funnel: ["design/UI", "QA/a11y/perf"],
  "component-refactor": ["engenharia", "design/UI"],
  "design-system": ["design/UI"],
  "content/SEO": ["conteúdo/SEO"],
  motion: ["design/UI", "acessibilidade"],
  "accessibility-fix": ["acessibilidade", "QA/a11y/perf"],
  performance: ["engenharia", "QA/a11y/perf"],
  bugfix: ["engenharia"],
  "backend/RLS": ["engenharia"],
  docs: ["orquestração", "descoberta"],
};

/** Status que jamais podem entrar no stack executável. */
export const BLOCKED_STATUSES: SkillStatus[] = [
  "SECURITY_REVIEW_REQUIRED",
  "QUARANTINED",
  "REJECTED",
  "REDUNDANT",
  "UNAVAILABLE_UPSTREAM",
];

/** 1. FIND — candidatas relevantes para as classes da tarefa. */
export function findSkills(task: PipelineTask, catalog: SkillRecord[] = SKILL_REGISTRY): StageResult<SkillRecord> {
  const wanted = new Set(task.classes.flatMap((c) => CATEGORY_BY_CLASS[c] ?? []));
  const accepted: SkillRecord[] = [];
  const rejected: { item: string; reason: string }[] = [];
  for (const skill of catalog) {
    // Orquestração e descoberta são transversais a qualquer tarefa.
    const transversal = skill.category === "orquestração" || skill.category === "descoberta";
    if (transversal || wanted.has(skill.category)) accepted.push(skill);
    else rejected.push({ item: skill.id, reason: `categoria ${skill.category} não pertence à tarefa` });
  }
  return { stage: "FIND", accepted, rejected };
}

/** 2. RANK — pontua por relevância, fonte oficial, origem revisada e status. */
export function rankCandidates(candidates: SkillRecord[]): RankedCandidate[] {
  return candidates
    .map((skill) => {
      const reasons: string[] = [];
      let score = 0;
      if (skill.status === "APPROVED_GLOBAL") {
        score += 50;
        reasons.push("aprovada globalmente");
      } else if (skill.status === "APPROVED_CONDITIONAL") {
        score += 30;
        reasons.push("aprovada com condição");
      } else if (skill.status === "REFERENCE_ONLY") {
        score += 15;
        reasons.push("referência textual");
      }
      if (skill.originReviewed) {
        score += 20;
        reasons.push("repositório original revisado");
      }
      if (/oficial|autoral/i.test(skill.source)) {
        score += 10;
        reasons.push("fonte oficial ou autoral");
      }
      score += Math.min(skill.reasons.length * 5, 15);
      score -= Math.min(skill.objections.length * 5, 15);
      return { skill, score, reasons };
    })
    .sort((a, b) => b.score - a.score || a.skill.id.localeCompare(b.skill.id));
}

/** 3. SECURITY REVIEW — remove tudo que não passou por auditoria. */
export function securityReview(ranked: RankedCandidate[]): StageResult<RankedCandidate> {
  const accepted: RankedCandidate[] = [];
  const rejected: { item: string; reason: string }[] = [];
  for (const c of ranked) {
    if (BLOCKED_STATUSES.includes(c.skill.status)) {
      rejected.push({ item: c.skill.id, reason: `status ${c.skill.status}: ${c.skill.securityReview}` });
      continue;
    }
    if (!c.skill.originReviewed) {
      rejected.push({ item: c.skill.id, reason: "fonte original não localizada/revisada" });
      continue;
    }
    accepted.push(c);
  }
  return { stage: "SECURITY_REVIEW", accepted, rejected };
}

/** 4. SELECT STACK — evita redundância: uma primária por categoria + complementares. */
export function selectStack(reviewed: RankedCandidate[], maxPerCategory = 2): StageResult<RankedCandidate> {
  const perCategory = new Map<string, number>();
  const accepted: RankedCandidate[] = [];
  const rejected: { item: string; reason: string }[] = [];
  for (const c of reviewed) {
    const used = perCategory.get(c.skill.category) ?? 0;
    if (used >= maxPerCategory) {
      rejected.push({ item: c.skill.id, reason: `redundante: já há ${maxPerCategory} skill(s) em ${c.skill.category}` });
      continue;
    }
    perCategory.set(c.skill.category, used + 1);
    accepted.push(c);
  }
  return { stage: "SELECT_STACK", accepted, rejected };
}

/** Perspectivas exigidas no cross-review, derivadas das classes da tarefa. */
export function requiredPerspectives(task?: PipelineTask): SkillRecord["category"][] {
  const base: SkillRecord["category"][] = ["design/UI", "QA/a11y/perf"];
  if (!task) return base;
  const wanted = new Set(task.classes.flatMap((c) => CATEGORY_BY_CLASS[c] ?? []));
  const applicable = base.filter((c) => wanted.has(c));
  // Acessibilidade é uma perspectiva de QA obrigatória quando a tarefa a cita.
  if (wanted.has("acessibilidade") && !applicable.includes("QA/a11y/perf")) {
    applicable.push("QA/a11y/perf");
  }
  return applicable;
}

/** 5. CROSS-REVIEW — exige perspectivas distintas de quem constrói. */
export function crossReview(
  stack: RankedCandidate[],
  task?: PipelineTask,
): { ok: boolean; missing: string[]; perspectives: string[]; required: string[] } {
  const perspectives = [...new Set(stack.map((c) => c.skill.category))];
  const required = requiredPerspectives(task);
  const missing = required.filter((r) => !perspectives.includes(r));
  return { ok: missing.length === 0, missing, perspectives, required };
}

export type GateResult = { name: string; passed: boolean; evidence: string };

/** Evidência textual real: descreve comando/resultado, não um placeholder. */
const PLACEHOLDER_EVIDENCE = /^(-+|—+|ok|okay|n\/?a|na|todo|tbd|pendente|sim|yes|true|pass(ed)?|\.+)$/i;

export function isRealEvidence(evidence: string): boolean {
  const text = evidence.trim();
  if (text.length < 12) return false;
  if (PLACEHOLDER_EVIDENCE.test(text)) return false;
  return true;
}

/** 6/7. TEST e VISUAL QA — só passam com evidência real informada. */
export function evaluateGates(gates: GateResult[]): { passed: boolean; blocking: GateResult[] } {
  const blocking = gates.filter((g) => !g.passed || !isRealEvidence(g.evidence));
  return { passed: blocking.length === 0, blocking };
}

/** 8. SHIP — libera apenas com cross-review ok e todos os gates com evidência. */
export function shipGate(cross: { ok: boolean }, gates: GateResult[]): { canShip: boolean; blockers: string[] } {
  const blockers: string[] = [];
  if (!cross.ok) blockers.push("cross-review incompleta");
  for (const g of evaluateGates(gates).blocking) {
    blockers.push(
      g.passed ? `gate sem evidência: ${g.name}` : `gate reprovado: ${g.name}`,
    );
  }
  return { canShip: blockers.length === 0, blockers };
}


/** Evidências sem fonte auditável são rejeitadas (regra evidence-first). */
export function reviewEvidence(items: EvidenceItem[]): StageResult<EvidenceItem> {
  const accepted: EvidenceItem[] = [];
  const rejected: { item: string; reason: string }[] = [];
  for (const e of items) {
    if (!e.source) rejected.push({ item: e.claim, reason: "sem fonte auditável" });
    else accepted.push(e);
  }
  return { stage: "EVIDENCE", accepted, rejected };
}

export type PipelineReport = {
  task: PipelineTask;
  stages: { stage: string; accepted: string[]; rejected: { item: string; reason: string }[] }[];
  stack: string[];
  crossReview: ReturnType<typeof crossReview>;
  gates: GateResult[];
  ship: ReturnType<typeof shipGate>;
  generatedAt: string;
};

export function runSkillPipeline(
  task: PipelineTask,
  gates: GateResult[] = [],
  catalog: SkillRecord[] = SKILL_REGISTRY,
): PipelineReport {
  const found = findSkills(task, catalog);
  const ranked = rankCandidates(found.accepted);
  const reviewed = securityReview(ranked);
  const selected = selectStack(reviewed.accepted);
  const cross = crossReview(selected.accepted, task);
  const evidence = reviewEvidence(task.evidence ?? []);
  const ship = shipGate(cross, gates);

  return {
    task,
    stages: [
      { stage: "FIND", accepted: found.accepted.map((s) => s.id), rejected: found.rejected },
      { stage: "RANK", accepted: ranked.map((c) => `${c.skill.id} (${c.score})`), rejected: [] },
      { stage: "SECURITY_REVIEW", accepted: reviewed.accepted.map((c) => c.skill.id), rejected: reviewed.rejected },
      { stage: "SELECT_STACK", accepted: selected.accepted.map((c) => c.skill.id), rejected: selected.rejected },
      { stage: "EVIDENCE", accepted: evidence.accepted.map((e) => e.claim), rejected: evidence.rejected },
    ],
    stack: selected.accepted.map((c) => c.skill.id),
    crossReview: cross,
    gates,
    ship,
    generatedAt: new Date().toISOString(),
  };
}

/** Relatório legível para PR/docs. */
export function renderPipelineMarkdown(report: PipelineReport): string {
  const lines = [
    `# Evidence-first — ${report.task.title}`,
    "",
    `- tarefa: \`${report.task.id}\``,
    `- classes: ${report.task.classes.join(", ")}`,
    `- gerado em: ${report.generatedAt}`,
    `- stack selecionado: ${report.stack.length ? report.stack.join(" → ") : "(vazio)"}`,
    `- cross-review: ${report.crossReview.ok ? "ok" : `faltando ${report.crossReview.missing.join(", ")}`}`,
    `- ship: ${report.ship.canShip ? "liberado" : `bloqueado (${report.ship.blockers.join("; ")})`}`,
    "",
  ];
  for (const s of report.stages) {
    lines.push(`## ${s.stage}`, "");
    lines.push(`Aceitos: ${s.accepted.length ? s.accepted.join(", ") : "—"}`, "");
    if (s.rejected.length) {
      lines.push("| rejeitado | motivo |", "| --- | --- |");
      for (const r of s.rejected) lines.push(`| ${r.item} | ${r.reason} |`);
      lines.push("");
    }
  }
  if (report.gates.length) {
    lines.push("## Gates", "", "| gate | resultado | evidência |", "| --- | --- | --- |");
    for (const g of report.gates) {
      lines.push(`| ${g.name} | ${g.passed ? "pass" : "fail"} | ${g.evidence || "—"} |`);
    }
    lines.push("");
  }
  return lines.join("\n");
}
