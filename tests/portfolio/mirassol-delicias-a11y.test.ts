import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/DeliciasCaseirasMirassolPage.tsx", "utf8");

describe("Mirassol Delícias Caseiras · acessibilidade", () => {
  test("usa contraste reforçado nos elementos críticos", () => {
    expect(source).toContain('bg-[#b72e63]');
    expect(source).toContain('text-[#b72e63]">Centro · Mirassol — SP');
    expect(source).toContain('text-sm font-bold text-[#b72e63]');
  });

  test("mantém dt e dd em agrupamento sem wrapper MotionReveal", () => {
    expect(source).toContain('<div key={k} className="flex flex-wrap items-baseline justify-between');
    expect(source).not.toContain('<MotionReveal key={k} variant="left" delay={i * 100}');
  });
});
