import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/AutoSocorroDentinhoPage.tsx", "utf8");

describe("Auto Socorro Dentinho · LCP crítico", () => {
  test("mantém o H1 crítico fora de MotionReveal", () => {
    expect(source).toContain('<h1 className="mt-6 text-5xl font-black leading-[.9]');
    expect(source).not.toContain('<MotionReveal variant="up">\n                  <h1 className="mt-6 text-5xl');
  });

  test("preserva funil e motions não críticos", () => {
    expect(source).toContain("DentinhoCTA");
    expect(source).toContain("Descrever o problema");
    expect(source).toContain("<MotionReveal");
  });
});
