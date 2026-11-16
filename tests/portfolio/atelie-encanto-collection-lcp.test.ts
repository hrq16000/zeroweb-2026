import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/AtelieEncantoDaBaiaPage.tsx", "utf8");

describe("Ateliê Encanto da Baía · coleção crítica", () => {
  test("mantém os cards da coleção fora de MotionReveal scale", () => {
    expect(source).toContain('COLECAO.map(([titulo, texto, giro]) =>');
    expect(source).toContain('<div key={titulo} className="mb-5 break-inside-avoid">');
    expect(source).not.toContain('<MotionReveal variant="scale" delay={i * 90} key={titulo}');
  });

  test("preserva rotação, conteúdo e motions não críticos", () => {
    expect(source).toContain('bg-white p-6 ${giro}');
    expect(source).toContain("Panôs, capas e enfeites feitos em tecido e crochê.");
    expect(source).toContain('<MotionReveal variant="right" delay={140}>');
    expect(source).toContain('<MotionReveal variant="up" delay={i * 120}');
  });
});
