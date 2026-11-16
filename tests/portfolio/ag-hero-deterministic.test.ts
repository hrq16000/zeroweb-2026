import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

describe("A&G hero determinístico", () => {
  const source = readFileSync("src/components/site/AgElectricalServicesPage.tsx", "utf8");

  test("hero crítico não depende de opacity inicial do motion", () => {
    expect(source).not.toContain('from "motion/react"');
    expect(source).not.toContain("<motion.div");
    expect(source).toContain('<div className="mx-auto mt-10 max-w-7xl">');
  });

  test("imagem LCP e conteúdo técnico permanecem preservados", () => {
    expect(source).toContain("/images/ag-electrical-services/rack-2.webp");
    expect(source).toContain("priority");
    expect(source).toContain("Conformidade técnica");
    expect(source).toContain("Rack identificado");
  });
});
