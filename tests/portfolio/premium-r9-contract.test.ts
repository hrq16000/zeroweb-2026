import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const page = (name: string) => readFileSync(`src/components/site/${name}.tsx`, "utf8");

describe("R9 — direção exclusiva e contratos individuais", () => {
  test("RJ: ilustração identificada, orçamento associado ao serviço, sem ocultar LCP", () => {
    const source = page("RjServicosDrywallPage");
    expect(source).toContain('clientKey="rj-servicos-drywall"');
    expect(source).toContain("Ilustração esquemática de possibilidades, não um projeto executivo");
    expect(source).toContain("service={title}");
    expect(source).toContain("service={service}");
    expect(source).toContain('id="inicio" style={{ animation: "none" }}');
    expect(source).toContain('pageName="portfolio-rj-servicos-drywall"');
  });
  test("D’Lara: mídia existente, H1 direto e mesmo funil com contexto da cozinha", () => {
    const source = page("DlaraPizzariaPage");
    expect(source).toContain('src="/images/dlara-pizzaria/capa-og.jpg"');
    expect(source).toContain("<h1 className=");
    expect(source).not.toContain('as="h1"');
    expect(source).toContain('href="#dl-frentes"');
    expect(source).toContain('formSlug="funnel-dlara-pizzaria"');
    expect(source).toContain("context={{ categoria: escolha }}");
    expect(source).toContain('pageName="portfolio-dlara-pizzaria"');
  });
  test("R_Beauty: âncoras de navegação existem, flyer não é cortado, agenda isolada", () => {
    const source = page("RBeautyEditorialView");
    for (const id of ["experiencia", "comparador", "menu", "localizacao"]) {
      expect(source).toContain(`href="#${id}"`);
      expect(source).toContain(`id="${id}"`);
    }
    expect(source).toContain("object-contain");
    expect(source).toContain("Confirme a validade da condição de abertura");
    expect(source).toContain('clientKey="r-beauty"');
    expect(source).toContain('pageName="r_beauty"');
  });
});
