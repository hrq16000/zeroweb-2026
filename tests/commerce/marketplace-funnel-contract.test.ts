import { describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { resolve } from "path";

const src = readFileSync(
  resolve(process.cwd(), "src/routes/servicos.marketplace.tsx"),
  "utf8",
);

describe("Marketplace funnel contract", () => {
  test("mantém a indicação dentro do funil de serviço da 0WEB", () => {
    expect(src).toContain('label="Quero uma indicação"');
    expect(src).toContain('purpose: "proposal"');
    expect(src).toContain('source: "marketplace_cta_final"');
    expect(src).toContain('pagePath: "/servicos/marketplace"');
    expect(src).toContain('serviceSlug: "marketplace"');
  });
});
