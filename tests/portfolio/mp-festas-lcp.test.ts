import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/MpFestasEventosPage.tsx", "utf8");

describe("MP Festas · LCP do hero", () => {
  test("mantém o H1 crítico fora de MotionReveal", () => {
    expect(source).toContain('<h1 className="mt-4 max-w-[9ch] font-display');
    expect(source).toContain('fallback="Sua festa linda, do jeitinho que você sonhou."');
    expect(source).not.toContain('as="h1"');
  });

  test("preserva a mídia prioritária e o escopo de motion não crítico", () => {
    expect(source).toContain('src="/images/mp-festas-eventos/capa.webp"');
    expect(source).toContain("priority");
    expect(source).toContain("<MotionScope intensity=\"EXPRESSIVE\">");
  });
});
