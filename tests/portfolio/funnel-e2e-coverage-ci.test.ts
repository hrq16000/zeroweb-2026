import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const workflow = readFileSync(".github/workflows/portfolio-gates.yml", "utf8");
const e2e = readFileSync("scripts/playwright-portfolio-funnels.mjs", "utf8");

describe("CI de funis preserva a cobertura integral", () => {
  test("paralelismo conservador no job E2E sem usar sharding parcial", () => {
    const step = workflow.split("- name: Funis individuais de portfólio")[1]
      ?.split("- name: Prévias de link e ícones")[0];
    expect(step).toBeTruthy();
    expect(step).toContain("E2E_CONCURRENCY: 2");
    expect(step).toContain("E2E_ONLY_SLUGS: ${{ steps.e2e-scope.outputs.only }}");
    expect(step).not.toContain("E2E_SHARD_COUNT:");
    expect(step).not.toContain("E2E_SHARD_INDEX:");
  });

  test("fila mantém cada portfolio nos dois viewports e respeita falhas", () => {
    expect(e2e).toContain('{ name: "desktop", width: 1280, height: 1400 }');
    expect(e2e).toContain('{ name: "mobile", width: 393, height: 851 }');
    expect(e2e).toContain("for (const target of TARGETS) for (const viewport of VIEWPORTS) queue.push([target, viewport]);");
    expect(e2e).toContain("const CONCURRENCY = Number(process.env.E2E_CONCURRENCY || 1)");
    expect(e2e).toContain("if (failures.length)");
    expect(e2e).toContain("process.exit(1)");
  });
});
