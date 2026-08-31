import { describe, expect, test } from "bun:test";
import {
  BLOCKED_STATUSES,
  crossReview,
  evaluateGates,
  isRealEvidence,
  findSkills,
  rankCandidates,
  renderPipelineMarkdown,
  requiredPerspectives,
  reviewEvidence,
  runSkillPipeline,
  securityReview,
  selectStack,
  shipGate,
  type PipelineTask,
} from "./skill-pipeline";
import { SKILL_REGISTRY, skillStatusCounts, SKILL_STATUSES } from "@/data/skill-registry";

const task: PipelineTask = {
  id: "t-landing",
  title: "Landing de serviço",
  classes: ["landing-page"],
};

describe("registro de skills", () => {
  test("todo status registrado é conhecido", () => {
    for (const s of SKILL_REGISTRY) expect(SKILL_STATUSES).toContain(s.status);
  });

  test("skill sem origem revisada nunca é aprovada globalmente", () => {
    for (const s of SKILL_REGISTRY) {
      if (!s.originReviewed) expect(s.status).not.toBe("APPROVED_GLOBAL");
    }
  });

  test("contagem por status cobre todas as skills", () => {
    const counts = skillStatusCounts();
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    expect(total).toBe(SKILL_REGISTRY.length);
  });
});

describe("FIND", () => {
  test("mantém skills transversais e da categoria da tarefa", () => {
    const found = findSkills(task);
    expect(found.accepted.some((s) => s.category === "orquestração")).toBe(true);
    expect(found.accepted.some((s) => s.category === "conteúdo/SEO")).toBe(true);
  });

  test("registra motivo de cada rejeição", () => {
    const found = findSkills({ ...task, classes: ["backend/RLS"] });
    for (const r of found.rejected) expect(r.reason).toContain("não pertence");
  });
});

describe("RANK", () => {
  test("ordena aprovadas globalmente acima das somente referência", () => {
    const ranked = rankCandidates(findSkills(task).accepted);
    const first = ranked[0]!;
    expect(first.skill.status).toBe("APPROVED_GLOBAL");
    expect(first.reasons.length).toBeGreaterThan(0);
  });

  test("popularidade não é usada: score vem de fonte, status e objeções", () => {
    const ranked = rankCandidates(SKILL_REGISTRY);
    const quarantined = ranked.find((c) => c.skill.status === "QUARANTINED")!;
    expect(quarantined.score).toBeLessThan(ranked[0]!.score);
  });
});

describe("SECURITY REVIEW", () => {
  test("bloqueia todos os status não auditados", () => {
    const reviewed = securityReview(rankCandidates(SKILL_REGISTRY));
    for (const c of reviewed.accepted) expect(BLOCKED_STATUSES).not.toContain(c.skill.status);
  });

  test("bloqueia skill sem repositório original", () => {
    const reviewed = securityReview(rankCandidates(SKILL_REGISTRY));
    for (const c of reviewed.accepted) expect(c.skill.originReviewed).toBeTruthy();
    expect(reviewed.rejected.some((r) => r.reason.includes("fonte original"))).toBe(true);
  });
});

describe("SELECT STACK", () => {
  test("aplica anti-redundância por categoria", () => {
    const selected = selectStack(securityReview(rankCandidates(SKILL_REGISTRY)).accepted, 1);
    const cats = selected.accepted.map((c) => c.skill.category);
    expect(new Set(cats).size).toBe(cats.length);
    expect(selected.rejected.some((r) => r.reason.startsWith("redundante"))).toBe(true);
  });
});

describe("CROSS-REVIEW e SHIP", () => {
  test("exige perspectiva de design e de QA", () => {
    const stack = selectStack(securityReview(rankCandidates(findSkills(task).accepted)).accepted).accepted;
    expect(crossReview(stack).ok).toBe(true);
    expect(crossReview([]).missing).toContain("QA/a11y/perf");
  });

  test("gate sem evidência bloqueia o ship", () => {
    const gates = [
      { name: "bun test", passed: true, evidence: "183 pass" },
      { name: "visual QA", passed: true, evidence: "" },
    ];
    expect(evaluateGates(gates).passed).toBe(false);
    expect(shipGate({ ok: true }, gates).canShip).toBe(false);
  });

  test("libera com cross-review ok e evidências reais", () => {
    const gates = [{ name: "bun test", passed: true, evidence: "183 pass / 0 fail" }];
    expect(shipGate({ ok: true }, gates).canShip).toBe(true);
  });
});

describe("evidence-first", () => {
  test("rejeita evidência sem fonte", () => {
    const res = reviewEvidence([
      { kind: "review", claim: "4.9 estrelas", source: null },
      { kind: "gsc", claim: "120 cliques", source: "Search Console 2026-01" },
    ]);
    expect(res.accepted).toHaveLength(1);
    expect(res.rejected[0]!.reason).toBe("sem fonte auditável");
  });
});

describe("pipeline integrado", () => {
  test("percorre todas as etapas e produz relatório", () => {
    const report = runSkillPipeline(
      { ...task, evidence: [{ kind: "gsc", claim: "impressões", source: "GSC" }] },
      [{ name: "bun test", passed: true, evidence: "ok" }],
    );
    expect(report.stages.map((s) => s.stage)).toEqual([
      "FIND",
      "RANK",
      "SECURITY_REVIEW",
      "SELECT_STACK",
      "EVIDENCE",
    ]);
    expect(report.stack.length).toBeGreaterThan(0);
    expect(report.ship.canShip).toBe(true);
    const md = renderPipelineMarkdown(report);
    expect(md).toContain("Evidence-first");
    expect(md).toContain("SECURITY_REVIEW");
  });

  test("nenhuma skill em quarentena chega ao stack", () => {
    const report = runSkillPipeline(task);
    for (const id of report.stack) {
      const skill = SKILL_REGISTRY.find((s) => s.id === id)!;
      expect(skill.status === "QUARANTINED").toBe(false);
    }
  });
});

describe("cross-review contextual e evidência real", () => {
  test("tarefa de docs não exige design/UI nem QA", () => {
    const docsTask: PipelineTask = { id: "t-docs", title: "Docs", classes: ["docs"] };
    expect(requiredPerspectives(docsTask)).toEqual([]);
    expect(crossReview([], docsTask).ok).toBe(true);
  });

  test("tarefa de landing continua exigindo design/UI e QA", () => {
    expect(requiredPerspectives(task)).toEqual(["design/UI", "QA/a11y/perf"]);
    expect(crossReview([], task).missing).toContain("design/UI");
  });

  test("tarefa de acessibilidade exige perspectiva de QA", () => {
    const a11yTask: PipelineTask = { id: "t-a11y", title: "A11y", classes: ["accessibility-fix"] };
    expect(requiredPerspectives(a11yTask)).toContain("QA/a11y/perf");
  });

  test("sem tarefa mantém exigência padrão de design e QA", () => {
    expect(requiredPerspectives()).toEqual(["design/UI", "QA/a11y/perf"]);
  });

  test("evidência placeholder não aprova gate", () => {
    for (const evidence of ["ok", "—", "n/a", "TODO", "pass", "   "]) {
      expect(isRealEvidence(evidence)).toBe(false);
      expect(evaluateGates([{ name: "g", passed: true, evidence }]).passed).toBe(false);
    }
  });

  test("evidência textual real aprova gate", () => {
    expect(isRealEvidence("bun test: 230 pass / 0 fail")).toBe(true);
  });

  test("gate reprovado é distinguido de gate sem evidência", () => {
    const blockers = shipGate({ ok: true }, [
      { name: "build", passed: false, evidence: "vite build falhou no chunk X" },
      { name: "visual", passed: true, evidence: "ok" },
    ]).blockers;
    expect(blockers).toContain("gate reprovado: build");
    expect(blockers).toContain("gate sem evidência: visual");
  });

  test("skill bloqueada ou sem origem revisada nunca entra no stack", () => {
    const report = runSkillPipeline(task);
    for (const id of report.stack) {
      const skill = SKILL_REGISTRY.find((s) => s.id === id)!;
      expect(BLOCKED_STATUSES).not.toContain(skill.status);
      expect(skill.originReviewed).toBeTruthy();
    }
  });
});
