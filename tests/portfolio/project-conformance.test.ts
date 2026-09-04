import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";

type GateResult = {
  slug: string;
  published: boolean;
  status: "COMPLETE" | "PARTIAL" | "LEGACY";
  issues: string[];
  blocking: string[];
};

const report = JSON.parse(
  execFileSync("node", ["scripts/check-portfolio-projects.mjs", "--json"], {
    encoding: "utf8",
  }),
) as { results: GateResult[]; summary: { total: number; blocking: number } };

const bySlug = new Map(report.results.map((r) => [r.slug, r]));

describe("contrato de conformidade /portfolio/:slug", () => {
  it("audita todos os projetos do catálogo", () => {
    expect(report.summary.total).toBeGreaterThan(50);
  });

  it("não permite projeto publicado com falha bloqueante", () => {
    const blocking = report.results.filter(
      (r) => r.published && r.blocking.length > 0,
    );
    expect(
      blocking.map((r) => `${r.slug}: ${r.blocking.join(",")}`),
    ).toEqual([]);
  });

  it.each([
    "aguia-sul-sinalizacao",
    "paulo-mestre-de-obras",
    "heloa-gas",
    "lolipa-arte-em-festas",
    "rm-fretes",
  ])("%s está COMPLETE", (slug) => {
    const result = bySlug.get(slug);
    expect(result, `slug ausente no catálogo: ${slug}`).toBeDefined();
    expect(result!.issues).toEqual([]);
    expect(result!.status).toBe("COMPLETE");
  });
});
