import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

test("paridade publica e Vercel continua mesmo quando o gate SEO falha", () => {
  const workflow = readFileSync(".github/workflows/portfolio-seo-runtime.yml", "utf8");
  const start = workflow.indexOf("      - name: Paridade entre domínio público e Vercel (observacional)");
  const end = workflow.indexOf("      - name: Upload evidências", start);
  expect(start).toBeGreaterThan(-1);
  expect(end).toBeGreaterThan(start);
  const step = workflow.slice(start, end);
  expect(step).toContain("if: ${{ !cancelled() }}");
  expect(step).toContain("continue-on-error: true");
  expect(step).toContain("node scripts/audit-site-origin-parity.mjs");
  expect(workflow).not.toContain("continue-on-error: true\n        run: node scripts/audit-portfolio-seo-permanent-gate");
  expect(workflow).toContain("node scripts/audit-portfolio-seo-permanent-gate.mjs");
});
