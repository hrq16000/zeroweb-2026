import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
// @ts-expect-error — validador de prebuild em JavaScript puro
import { checkNewPortfolioDiscoveryClaims, normalizeDiscoveryClaim } from "../../scripts/lib/portfolio-v4-discovery-claims-gate.mjs";

const slug = "oficina-piloto";
const published = { contractVersion: 4, stage: "published" };
const project = {
  slug, title: "Oficina Piloto", status: "published",
  city: "São José dos Pinhais", state: "PR",
  location: "Jardim Itália · São José dos Pinhais",
  subtitle: "Revisão automotiva e troca de óleo",
  summary: "Atendimento para revisão automotiva e troca de óleo, com orçamento individual e contato via site.",
  tags: ["revisão automotiva", "troca de óleo"],
};
const discovery = () => ({
  aliases: ["Oficina Piloto"],
  categories: ["oficina mecânica"],
  services: ["revisão automotiva", "troca de óleo"],
  products: [],
  locality: ["Jardim Itália", "São José dos Pinhais"],
  keywords: ["revisão de carro"],
});
const check = (value: unknown, p: unknown = project, m: unknown = published) =>
  checkNewPortfolioDiscoveryClaims(slug, m, p, value);

describe("PORTFOLIO_DISCOVERY_CLAIMS_GATE dos novos sites v4", () => {
  test("ofertas e localidades constantes do catalogo passam sem inferencias extras", () => {
    expect(check(discovery())).toEqual([]);
  });

  test("nao aplica a rascunhos nem a seis gerenciados antigos", () => {
    expect(check(null, project, { contractVersion: 4, stage: "ready" })).toEqual([]);
    const old = JSON.parse(readFileSync("src/config/portfolio-project-manifests.json", "utf8")).projects;
    for (const [name, m] of Object.entries(old)) {
      expect(checkNewPortfolioDiscoveryClaims(name, m, null, null)).toEqual([]);
    }
  });

  test("documento nao pode faltar ao publicar novo projeto", () => {
    expect(check(null).join(" ")).toContain("documento individual");
    expect(check([]).join(" ")).toContain("documento individual");
  });

  test("servicos e produtos nao publicados no texto ou tags sao bloqueados", () => {
    const d = discovery();
    expect(check({ ...d, services: ["revisão automotiva", "conserto de celulares"] }).join(" "))
      .toContain("conserto de celulares");
    expect(check({ ...d, products: ["pneu de competição"] }).join(" "))
      .toContain("pneu de competição");
    expect(check({ ...d, services: ["troca de óleo"] })).toEqual([]);
  });

  test("regiao ou bairro nao confirmado na apresentacao nao pode entrar no indice", () => {
    expect(check({ ...discovery(), locality: ["Belo Horizonte"] }).join(" "))
      .toContain("localidade Belo Horizonte nao documentada");
    expect(check({ ...discovery(), locality: ["Jardim Itália"] })).toEqual([]);
  });

  test("reprova termos vazios, placeholders e repeticoes normalizadas", () => {
    const d = discovery();
    expect(check({ ...d, services: ["troca de óleo", "Troca de Oleo"] }).join(" "))
      .toContain("termo repetido");
    expect(check({ ...d, keywords: ["Preencher aqui"] }).join(" "))
      .toContain("placeholder");
    expect(check({ ...d, categories: ["", "oficina"] }).join(" "))
      .toContain("termo vazio");
  });

  test("listas malformadas falham com diagnostico, sem explodir no build", () => {
    expect(check({ ...discovery(), services: "troca de óleo" }).join(" ")).toContain("services precisa ser uma lista");
    expect(check({ ...discovery(), locality: null }).join(" ")).toContain("locality precisa ser uma lista");
  });

  test("requer oferta real e contexto suficiente de busca", () => {
    expect(check({ ...discovery(), services: [], products: [] }).join(" ")).toContain("ao menos um produto ou servico");
    expect(check({ ...discovery(), categories: [], keywords: [] }).join(" ")).toContain("categoria ou termo");
  });

  test("comparacao de fatos ignora acentos, hifens e caixa", () => {
    expect(normalizeDiscoveryClaim("São-José dos PINHAIS")).toBe("sao jose dos pinhais");
  });

  test("checagem esta conectada ao validador estatico obrigatorio", () => {
    const validator = readFileSync("scripts/validate-portfolio-scaffold.mjs", "utf8");
    const scripts = JSON.parse(readFileSync("package.json", "utf8")).scripts;
    expect(validator).toContain("checkNewPortfolioDiscoveryClaims(");
    expect(scripts.prebuild).toContain("node scripts/validate-portfolio-scaffold.mjs");
  });
});
