import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
// @ts-expect-error — validador independente em JS puro
import { HISTORICAL_MANAGED_PRE_V4_SLUGS, checkNewPortfolioIndividualSiteVersion } from "../../scripts/lib/portfolio-new-site-contract.mjs";

const existing = JSON.parse(readFileSync("src/config/portfolio-project-manifests.json", "utf8")).projects;

describe("contrato v4 obrigatorio para novos portfolio-sites", () => {
  test("baseline de seis projetos pre-v4 coincide com historico real", () => {
    expect(new Set(HISTORICAL_MANAGED_PRE_V4_SLUGS)).toEqual(new Set(Object.keys(existing)));
    expect(HISTORICAL_MANAGED_PRE_V4_SLUGS).toHaveLength(6);
    for (const slug of HISTORICAL_MANAGED_PRE_V4_SLUGS) {
      expect(checkNewPortfolioIndividualSiteVersion(slug, existing[slug])).toBeNull();
    }
  });

  test("novo portfolio com contrato v4 ou posterior passa", () => {
    expect(checkNewPortfolioIndividualSiteVersion("novo-cliente", { contractVersion: 4 })).toBeNull();
    expect(checkNewPortfolioIndividualSiteVersion("novo-cliente", { contractVersion: 5 })).toBeNull();
  });

  test("bloqueia downgrade ou ausencia de contrato em novo slug", () => {
    for (const manifest of [{ contractVersion: 3 }, { contractVersion: 0 }, {}, null, { contractVersion: "4" }, { contractVersion: 4.5 }]) {
      expect(checkNewPortfolioIndividualSiteVersion("novo-cliente", manifest))
        .toContain("PORTFOLIO_INDIVIDUAL_SITE_GATE");
    }
  });

  test("novo slug nunca herda excecao dos seis gerenciados", () => {
    expect(checkNewPortfolioIndividualSiteVersion("novo-cliente", existing["moreira-auto-mecanica"]))
      .toContain("portfolio novo exige contractVersion");
  });

  test("scaffold e readiness consomem a mesma validacao", () => {
    for (const file of ["scripts/validate-portfolio-scaffold.mjs", "scripts/check-portfolio-project-readiness.mjs"]) {
      const source = readFileSync(file, "utf8");
      expect(source).toContain("checkNewPortfolioIndividualSiteVersion");
    }
  });
});
