import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "bun:test";

describe("RouteLoader performance contract", () => {
  const source = readFileSync(
    resolve(process.cwd(), "src/components/site/RouteLoader.tsx"),
    "utf8",
  );

  it("não mantém BrandLogo montada enquanto o overlay está invisível", () => {
    const guard = source.indexOf("{visible ? (");
    const logo = source.indexOf("<BrandLogo");
    const fallback = source.indexOf(") : null}", logo);
    expect(guard).toBeGreaterThan(-1);
    expect(logo).toBeGreaterThan(guard);
    expect(fallback).toBeGreaterThan(logo);
  });

  it("preserva o atraso de 120ms que evita flash em navegação instantânea", () => {
    expect(source).toContain("setTimeout(() => setVisible(true), 120)");
  });
});
