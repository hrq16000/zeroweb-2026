import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "bun:test";
import {
  listIndexableGeoCities,
  listIndexableGeoStates,
  isGeoCityIndexable,
  isGeoStateIndexable,
} from "./geo-hub-indexability";

describe("hubs geográficos baseados em evidência", () => {
  it("mantém somente cidades com ao menos uma combinação cidade×serviço qualificada", () => {
    expect(listIndexableGeoCities().map((city) => city.slug).sort()).toEqual([
      "araucaria",
      "belo-horizonte",
      "curitiba",
      "guaratuba",
      "pinhais",
      "sao-jose-dos-pinhais",
      "sao-paulo",
    ]);

    expect(isGeoCityIndexable("rio-de-janeiro")).toBe(false);
    expect(isGeoCityIndexable("recife")).toBe(false);
  });

  it("mantém somente estados com cidade qualificada", () => {
    expect(listIndexableGeoStates().map((state) => state.slug).sort()).toEqual([
      "mg",
      "pr",
      "sp",
    ]);

    expect(isGeoStateIndexable("rj")).toBe(false);
    expect(isGeoStateIndexable("rs")).toBe(false);
  });

  it("alinha páginas e sitemap ao mesmo gate", () => {
    const states = readFileSync(resolve(process.cwd(), "src/routes/estados.tsx"), "utf8");
    const state = readFileSync(resolve(process.cwd(), "src/routes/estados.$state.tsx"), "utf8");
    const cities = readFileSync(resolve(process.cwd(), "src/routes/cidades.tsx"), "utf8");
    const sitemap = readFileSync(resolve(process.cwd(), "src/routes/sitemap-cities[.]xml.ts"), "utf8");

    expect(states).toContain("isGeoStateIndexable");
    expect(cities).toContain("isGeoCityIndexable");
    expect(state).toContain('hasEvidence ? "index,follow,max-image-preview:large" : "noindex,follow"');
    expect(sitemap).toContain("isGeoStateIndexable");
  });
});
