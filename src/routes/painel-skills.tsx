import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import {
  SKILL_REGISTRY,
  SKILL_STATUSES,
  SKILL_STATUS_META,
  skillStatusCounts,
  type SkillStatus,
} from "@/data/skill-registry";
import { renderPipelineMarkdown, runSkillPipeline, type TaskClass } from "@/lib/skill-pipeline";

export const Route = createFileRoute("/painel-skills")({
  head: () => ({
    meta: [
      { title: "Governança de skills · 0WEB" },
      {
        name: "description",
        content:
          "Status, justificativa e revisão de segurança de cada skill avaliada, com relatório evidence-first por tarefa.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SkillsDashboard,
});

const TONE_CLASS: Record<string, string> = {
  positive: "bg-emerald-700 text-white",
  neutral: "bg-secondary text-secondary-foreground",
  caution: "bg-amber-700 text-white",
  negative: "bg-destructive text-destructive-foreground",
};

const TASK_CLASSES: TaskClass[] = [
  "landing-page",
  "portfolio-client-site",
  "dashboard",
  "component-refactor",
  "content/SEO",
  "accessibility-fix",
  "performance",
  "backend/RLS",
];

function SkillsDashboard() {
  const counts = skillStatusCounts();
  const [filter, setFilter] = useState<SkillStatus | "all">("all");
  const [taskClass, setTaskClass] = useState<TaskClass>("landing-page");

  const skills = useMemo(
    () => (filter === "all" ? SKILL_REGISTRY : SKILL_REGISTRY.filter((s) => s.status === filter)),
    [filter],
  );

  const report = useMemo(
    () =>
      runSkillPipeline(
        { id: `preview-${taskClass}`, title: `Simulação — ${taskClass}`, classes: [taskClass] },
        [],
      ),
    [taskClass],
  );

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-28">
        <h1 className="text-2xl font-semibold">Governança de skills</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Cada skill avaliada recebe um status e uma justificativa auditável. Nenhuma skill externa é
          executada: marketplaces servem como triagem e só o repositório original aprova adoção.
        </p>

        <section aria-labelledby="status-heading" className="mt-8">
          <h2 id="status-heading" className="text-sm font-semibold">
            Status
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={filter === "all" ? "default" : "outline"}
              className="min-h-11"
              onClick={() => setFilter("all")}
            >
              Todas ({SKILL_REGISTRY.length})
            </Button>
            {SKILL_STATUSES.map((status) => (
              <Button
                key={status}
                size="sm"
                variant={filter === status ? "default" : "outline"}
                className="min-h-11"
                onClick={() => setFilter(status)}
              >
                {SKILL_STATUS_META[status].label} ({counts[status]})
              </Button>
            ))}
          </div>
        </section>

        <section aria-labelledby="skills-heading" className="mt-8 space-y-4">
          <h2 id="skills-heading" className="text-sm font-semibold">
            Skills avaliadas
          </h2>
          {skills.map((s) => {
            const meta = SKILL_STATUS_META[s.status];
            return (
              <article key={s.id} className="rounded-lg border border-border p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-base font-medium">{s.name}</h3>
                  <span className={`rounded px-2 py-0.5 text-xs font-semibold ${TONE_CLASS[meta.tone]}`}>
                    {meta.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{s.category}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{meta.description}</p>
                <dl className="mt-3 grid gap-3 text-sm md:grid-cols-2">
                  <div>
                    <dt className="font-medium">Fonte</dt>
                    <dd className="text-muted-foreground">{s.source}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Origem revisada</dt>
                    <dd className="text-muted-foreground">{s.originReviewed ?? "não localizada"}</dd>
                  </div>
                  {s.reasons.length > 0 && (
                    <div>
                      <dt className="font-medium">Justificativa</dt>
                      <dd>
                        <ul className="list-disc pl-5 text-muted-foreground">
                          {s.reasons.map((r) => (
                            <li key={r}>{r}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  )}
                  {s.objections.length > 0 && (
                    <div>
                      <dt className="font-medium">Restrições</dt>
                      <dd>
                        <ul className="list-disc pl-5 text-muted-foreground">
                          {s.objections.map((r) => (
                            <li key={r}>{r}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <dt className="font-medium">Revisão de segurança</dt>
                    <dd className="text-muted-foreground">{s.securityReview}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </section>

        <section aria-labelledby="pipeline-heading" className="mt-10">
          <h2 id="pipeline-heading" className="text-sm font-semibold">
            Relatório evidence-first por tarefa
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Simulação do pipeline FIND → RANK → SECURITY REVIEW → SELECT STACK → CROSS-REVIEW.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {TASK_CLASSES.map((c) => (
              <Button
                key={c}
                size="sm"
                className="min-h-11"
                variant={taskClass === c ? "default" : "outline"}
                onClick={() => setTaskClass(c)}
              >
                {c}
              </Button>
            ))}
          </div>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-muted p-4 text-xs">
            {renderPipelineMarkdown(report)}
          </pre>
        </section>
      </main>
      <Footer />
    </div>
  );
}
