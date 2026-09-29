import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

describe("concorrência segura do gate E2E de funis", () => {
  const workflow = readFileSync(".github/workflows/portfolio-gates.yml", "utf8");
  const script = readFileSync("scripts/playwright-portfolio-funnels.mjs", "utf8");

  test("mantém cobertura completa e usa paralelismo moderado conforme o modo", () => {
    expect(script).toContain("for (const target of TARGETS) for (const viewport of VIEWPORTS)");
    expect(workflow).toContain("E2E_CONCURRENCY=2 node scripts/ci-with-prod-preview.mjs");
    expect(workflow).toContain("E2E_DRY_RUN=1 E2E_CONCURRENCY=4");
  });

  test("não altera o contrato de escrita externa", () => {
    expect(workflow).toContain('if [ -n "${SUPABASE_SERVICE_ROLE_KEY:-}" ]');
    expect(workflow).toContain("SUPABASE_SERVICE_ROLE_KEY");
  });
});
