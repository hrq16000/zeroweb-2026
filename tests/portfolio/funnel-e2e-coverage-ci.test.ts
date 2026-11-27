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

  test("formulários hospedados usam registry e interceptação sem escrita; demais contratos continuam cobertos", () => {
    const clients = JSON.parse(readFileSync("src/config/portfolio-clients.json", "utf8"));
    const forms = JSON.parse(readFileSync("src/config/portfolio-hosted-form-registry.json", "utf8")).forms;
    for (const slug of ["espaco-marli-nails-guaratuba", "panificadora-doce-coracao-santo-antonio"]) {
      const client = clients.find((entry: { slug: string }) => entry.slug === slug);
      expect(client?.funnelVariant).toBe("hosted_form");
      expect(forms[client.clientKey].clientKey).toBe(client.clientKey);
      expect(readFileSync(client.componentFile, "utf8")).toContain('data-funnel-provider-trigger="jotform"');
    }
    expect(e2e).toContain('target.funnelVariant === "hosted_form"');
    expect(e2e).toContain('request.url() !== form.url');
    expect(e2e).toContain('await route.abort()');
    expect(e2e).toContain('await route.fulfill(');
    expect(e2e).toContain('text/html; charset=utf-8');
    expect(e2e).toContain('getByTestId("hosted-form-fixture")');
    expect(e2e).toContain('await fixture.innerText()');
    expect(e2e).toContain('hostedDryRunOk.push(id)');
    expect(e2e).toContain('portfolio-cta-quiz-title');
    expect(e2e).toContain('direct_lead_form');
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
