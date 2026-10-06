import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/AssistenciaMicroondasSantosPage.tsx", "utf8");

describe("Assistência Microondas Santos · acessibilidade", () => {
  test("deixa o nome acessível dos CTAs acompanhar o texto visível", () => {
    expect(source).not.toContain('ariaLabel="Falar com a Assistência Técnica Microondas Santos"');
    expect(source).toContain("Solicitar atendimento");
    expect(source).toContain("Falar com Ryan e Pedro");
    expect(source).toContain("Solicitar avaliação");
  });

  test("reforça os três contrastes apontados pelo Lighthouse", () => {
    expect(source).toContain("text-xs text-white/60");
    expect(source).toContain('tracking-[.2em] text-white">Presença digital');
    expect(source).toContain('leading-7 text-white">Veja restaurações');
    expect(source).not.toContain("text-xs text-white/45");
    expect(source).not.toContain("text-white/75");
    expect(source).not.toContain("text-white/80");
  });
});
