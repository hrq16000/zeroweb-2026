import { describe, expect, it } from "vitest";
import { classifySitemapInventoryDelta } from "../../scripts/sitemap-inventory-diff-policy.mjs";

const urls = (paths) => paths.map((p) => "https://0web.com.br" + p);

describe("inventario sitemap de producao vs preview", () => {
  it("nao acusa divergencia para as mesmas URLs canonicas", () => {
    const report = classifySitemapInventoryDelta(urls(["/", "/portfolio", "/portfolio/centro-mega"]), urls(["/", "/portfolio", "/portfolio/centro-mega"]));
    expect(report.hardProblems).toEqual([]);
    expect(report.warnings).toEqual([]);
  });

  it("bloqueia qualquer URL de portfolio ou pagina estatica ausente", () => {
    const report = classifySitemapInventoryDelta(
      urls(["/", "/portfolio", "/portfolio/centro-mega", "/servicos", "/blog/seo"]),
      urls(["/", "/portfolio"]),
    );
    expect(report.missingProtected).toEqual(["/blog/seo", "/portfolio/centro-mega", "/servicos"]);
    expect(report.hardProblems).toHaveLength(3);
  });

  it("explicita 27 capitais + 6 categorias sem inventar publicacao", () => {
    const caps = Array.from({ length: 27 }, (_, i) => "/criacao-de-site-institucional/capital-" + i);
    const cats = Array.from({ length: 6 }, (_, i) => "/categoria/categoria-" + i);
    const report = classifySitemapInventoryDelta(urls(["/portfolio", ...caps, ...cats]), urls(["/portfolio"]));
    expect(report.disappeared).toHaveLength(33);
    expect(report.dynamicLocal).toHaveLength(27);
    expect(report.dynamicCategories).toHaveLength(6);
    expect(report.warnings).toHaveLength(33);
    expect(report.hardProblems).toEqual([]);
  });

  it("nao dispensa nem mascara rotas adicionais ou query de portfolio", () => {
    const report = classifySitemapInventoryDelta(
      urls(["/portfolio/centro-mega?campanha=abc", "/criacao-de-site-institucional"]),
      [],
    );
    expect(report.missingProtected).toHaveLength(2);
  });

  it("bloqueia hostname temporario e URLs invalidas, mesmo com mesmos caminhos", () => {
    const report = classifySitemapInventoryDelta(
      urls(["/blog/mapa", "/portfolio/centro-mega"]),
      ["https://preview.example.com/blog/mapa", "file:///etc/passwd", "not a url", "https://0web.com.br/portfolio/centro-mega"],
    );
    expect(report.disappeared).toEqual([]);
    expect(report.nonCanonical).toEqual(["https://preview.example.com/blog/mapa"]);
    expect(report.invalid).toHaveLength(2);
    expect(report.hardProblems).toHaveLength(3);
  });

  it("bloqueia entrada duplicada no preview", () => {
    const report = classifySitemapInventoryDelta(
      urls(["/portfolio/x"]),
      urls(["/portfolio/x", "/portfolio/x"]),
    );
    expect(report.duplicatePaths).toEqual(["/portfolio/x"]);
    expect(report.hardProblems).toHaveLength(1);
  });

  it("lista inclusoes sem puni-las como regressao", () => {
    const report = classifySitemapInventoryDelta(
      urls(["/portfolio"]),
      urls(["/portfolio", "/portfolio/novo"]),
    );
    expect(report.added).toEqual(["/portfolio/novo"]);
    expect(report.hardProblems).toEqual([]);
  });
});
