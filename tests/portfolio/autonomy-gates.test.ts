/**
 * Regressões do adendo de autonomia
 * (docs/PORTFOLIO_PROJECT_AUTONOMY_ADDENDUM.md).
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
// @ts-expect-error — script utilitário em JS puro
import { evaluateAutonomy } from "../../scripts/check-portfolio-landing-quality.mjs";
// @ts-expect-error — script utilitário em JS puro
import { extractSkeleton, skeletonSimilarity } from "../../scripts/portfolio-skeleton.mjs";
import manifests from "../../src/config/portfolio-project-manifests.json";
import catalogRaw from "../../src/config/portfolio-catalog.json";

const moreiraSource = readFileSync("src/components/site/MoreiraAutoMecanicaPage.tsx", "utf8");
const carecasSource = readFileSync("src/components/site/CarecasInfotecPage.tsx", "utf8");
const matrix = JSON.parse(readFileSync("docs/portfolio/quality-matrix/moreira-auto-mecanica.json", "utf8"));
const catalog = ((catalogRaw as any).projects ?? catalogRaw) as any[];
const manifest = (manifests as any).projects["moreira-auto-mecanica"];

const base = {
  slug: "moreira-auto-mecanica",
  componentSource: moreiraSource,
  catalogItem: catalog.find((p) => p.slug === "moreira-auto-mecanica"),
  manifest,
  peers: [{ slug: "carecas-infotec", skeleton: extractSkeleton(carecasSource) }],
  contractVersion: 3,
};

describe("adendo de autonomia", () => {
  it("aprova o piloto Moreira com identidade, hero, motion, embed e CTA persistente", () => {
    const result = evaluateAutonomy({ ...base, matrix });
    expect(result.failures).toEqual([]);
  });

  it("reprova quando o bloco autonomy não existe em contrato >= 3", () => {
    const result = evaluateAutonomy({ ...base, matrix: { ...matrix, autonomy: undefined } });
    expect(result.failures.join(" ")).toContain("autonomy: bloco ausente");
  });

  it("reprova identidade sem decisão explícita (IDENTITY_COMPLETENESS_GATE)", () => {
    const broken = { ...matrix, autonomy: { ...matrix.autonomy, identity: {} } };
    expect(evaluateAutonomy({ ...base, matrix: broken }).failures.join(" ")).toContain(
      "IDENTITY_COMPLETENESS_GATE",
    );
  });

  it("reprova motion apenas declarado (MOTION_PRESENCE_GATE)", () => {
    const broken = {
      ...matrix,
      autonomy: { ...matrix.autonomy, motionPresence: { state: "MOTION_DECLARED" } },
    };
    expect(evaluateAutonomy({ ...base, matrix: broken }).failures.join(" ")).toContain("MOTION_PRESENCE_GATE");
  });

  it("reprova falha de embed como P0", () => {
    const broken = { ...matrix, autonomy: { ...matrix.autonomy, embed: { status: "FAIL" } } };
    expect(evaluateAutonomy({ ...base, matrix: broken }).failures.join(" ")).toContain(
      "P0 PORTFOLIO_EMBED_FAILURE",
    );
  });

  it("reprova projeto que o catálogo não conseguiria abrir no visualizador", () => {
    const result = evaluateAutonomy({
      ...base,
      matrix,
      catalogItem: { slug: "x", status: "draft" },
      manifest: { stage: "design" },
    });
    expect(result.failures.join(" ")).toContain("PORTFOLIO_EMBED_GATE");
  });

  it("detecta topologia clonada mesmo com cores e textos diferentes", () => {
    const clone = extractSkeleton(carecasSource);
    expect(skeletonSimilarity(clone, clone)).toBe(1);
    const result = evaluateAutonomy({ ...base, matrix, peers: [{ slug: "clone", skeleton: extractSkeleton(moreiraSource) }] });
    expect(result.failures.join(" ")).toContain("STRUCTURAL_SKELETON_SIMILARITY");
  });

  it("mantém a Moreira estruturalmente distante do Careca's", () => {
    const ratio = skeletonSimilarity(extractSkeleton(moreiraSource), extractSkeleton(carecasSource));
    expect(ratio).toBeLessThan(0.8);
  });

  it("o CTA flutuante da Moreira aponta para o funil, nunca telefone ou WhatsApp", () => {
    expect(moreiraSource).toMatch(/floatingConversion:\s*\{\s*\n\s*mode: "enabled"/);
    expect(moreiraSource).not.toMatch(/href\s*=\s*["'`]tel:/);
    expect(moreiraSource).not.toMatch(/wa\.me/);
  });
});
