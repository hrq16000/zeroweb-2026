import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
// @ts-expect-error — helper de validacao em JavaScript puro
import { checkNewPortfolioSeoCopy, normalizedSeoCopy } from "../../scripts/lib/portfolio-v4-seo-copy-gate.mjs";

const slug = "novo-estudio-exemplo";
const originalSummary =
  "Estúdio Exemplo apresenta seus serviços de atendimento personalizado, portfólio próprio e orientações para solicitar um orçamento sem alegar números, filiais ou garantias.";
const project = (extra: Record<string, unknown> = {}) =>
  ({ slug, status: "published", title: "Estúdio Exemplo", summary: originalSummary, ...extra });
const publish = { contractVersion: 4, stage: "published" };

describe("PORTFOLIO_SEO_ORIGINALITY_GATE para novos v4 publicados", () => {
  test("texto original verificável passa sem inventar dados de localidade", () => {
    expect(checkNewPortfolioSeoCopy(slug, publish, project(), [])).toEqual([]);
  });

  test("rascunho e legado nao bloqueados nem alterados", () => {
    const invalid = project({ title: "Sua empresa aqui", summary: "Curto" });
    expect(checkNewPortfolioSeoCopy(slug, { contractVersion: 4, stage: "ready" }, invalid, [])).toEqual([]);
    expect(checkNewPortfolioSeoCopy(slug, { contractVersion: 3, stage: "published" }, invalid, [])).toEqual([]);
  });

  test("titulo ausente, generico, placeholder ou resumo curto bloqueiam publicacao", () => {
    for (const title of ["", "N", "Sua empresa aqui", "[PREENCHER]", "Nome da empresa"]) {
      expect(checkNewPortfolioSeoCopy(slug, publish, project({ title }), []).join(" ")).toContain("título editorial");
    }
    for (const summary of ["", "Texto curto", "Lorem ipsum", "[TODO] completar depois"]) {
      expect(checkNewPortfolioSeoCopy(slug, publish, project({ summary }), []).join(" ")).toContain("resumo original");
    }
  });

  test("copy repetida de outro portfolio publicado falha mesmo com acentos/capitalizacao", () => {
    const peer = {
      slug: "outra-marca",
      status: "published",
      title: "ESTÚDIO  EXEMPLO!!",
      summary: originalSummary.toUpperCase(),
    };
    const errors = checkNewPortfolioSeoCopy(slug, publish, project(), [peer]);
    expect(errors.some((e: string) => e.includes("título duplicado"))).toBe(true);
    expect(errors.some((e: string) => e.includes("resumo duplicado"))).toBe(true);
  });

  test("nao reprova simplesmente por pertencer ao mesmo segmento", () => {
    const peer = { slug: "outro-estudio", status: "published", title: "Studio Aurora", summary:
      "Studio Aurora oferece atendimento próprio e um canal de solicitação para conhecer o serviço, sem alegar avaliações, preços ou benefícios não documentados." };
    expect(checkNewPortfolioSeoCopy(slug, publish, project(), [peer])).toEqual([]);
  });

  test("exclui a propria linha de catalogo e peers nao publicados", () => {
    const self = project();
    const draft = { ...project(), slug: "outro-rascunho", status: "draft" };
    const hidden = { ...project(), slug: "outro-oculto", live: false };
    expect(checkNewPortfolioSeoCopy(slug, publish, project(), [self, draft, hidden])).toEqual([]);
  });

  test("normalizacao preserva palavras e compara apenas igualdade real", () => {
    expect(normalizedSeoCopy("  São José   dos Pinhais! ")).toBe("sao jose dos pinhais");
    expect(normalizedSeoCopy("Jardin Itália")).not.toBe(normalizedSeoCopy("Jardin Centro"));
  });

  test("regressao historica: seis manifestos antigos nao sofrem gate editorial novo", () => {
    const manifests = JSON.parse(readFileSync("src/config/portfolio-project-manifests.json", "utf8")).projects;
    const catalog = JSON.parse(readFileSync("src/config/portfolio-catalog.json", "utf8"));
    for (const [oldSlug, m] of Object.entries(manifests)) {
      expect(checkNewPortfolioSeoCopy(oldSlug, m, catalog.find((x: {slug:string}) => x.slug === oldSlug), catalog)).toEqual([]);
    }
  });

  test("gate exigido automaticamente no validador executado pelo prebuild", () => {
    const validator = readFileSync("scripts/validate-portfolio-scaffold.mjs", "utf8");
    const scripts = JSON.parse(readFileSync("package.json", "utf8")).scripts;
    expect(validator).toContain("checkNewPortfolioSeoCopy(");
    expect(scripts.prebuild).toContain("node scripts/validate-portfolio-scaffold.mjs");
  });
});
