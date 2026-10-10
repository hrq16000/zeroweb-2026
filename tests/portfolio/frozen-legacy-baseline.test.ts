import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { checkFrozenLegacyBaseline } from "../../scripts/lib/portfolio-frozen-legacy-baseline.mjs";

const raw = readFileSync("src/config/portfolio-legacy-baseline.json", "utf8");

describe("portfolio: lista histórica de legados é imutável", () => {
  test("o snapshot congelado original passa", () => {
    expect(checkFrozenLegacyBaseline(raw)).toBeNull();
  });

  test("bloqueia injeção de novo slug, mesmo com count atualizado", () => {
    const baseline = JSON.parse(raw);
    baseline.slugs.push("cliente-novo-sem-manifesto");
    baseline.count = baseline.slugs.length;
    expect(checkFrozenLegacyBaseline(JSON.stringify(baseline, null, 2))).toContain(
      "baseline legado alterado",
    );
  });

  test("bloqueia troca de slug sem mudar o total de 90", () => {
    const baseline = JSON.parse(raw);
    baseline.slugs[0] = "cliente-novo-sem-manifesto";
    expect(baseline.slugs).toHaveLength(90);
    expect(checkFrozenLegacyBaseline(JSON.stringify(baseline, null, 2))).toContain(
      "baseline legado alterado",
    );
  });

  test("bloqueia exclusão ou edição silenciosa do baseline", () => {
    expect(checkFrozenLegacyBaseline("")).toContain("ausente");
    expect(checkFrozenLegacyBaseline(raw.replace("FROZEN_LEGACY_BASELINE", "OPEN_LEGACY_BASELINE")))
      .toContain("baseline legado alterado");
  });
});
