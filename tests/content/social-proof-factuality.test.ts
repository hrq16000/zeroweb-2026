import { describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { resolve } from "path";

const server = readFileSync(
  resolve(process.cwd(), "src/lib/social-proof.functions.ts"),
  "utf8",
);
const component = readFileSync(
  resolve(process.cwd(), "src/components/site/SocialProof.tsx"),
  "utf8",
);

describe("SocialProof factuality contract", () => {
  test("não fabrica pessoa, cidade ou contratação a partir de serviço ativo", () => {
    expect(server).not.toContain("const CITIES");
    expect(server).not.toContain("const FIRST_NAMES");
    expect(server).not.toContain("cityForSeed");
    expect(server).not.toContain("serviceItems");
    expect(server).not.toContain("contratou ${s.name}");
    expect(server).toContain('if (!raw) return "Cliente"');
  });

  test("sem dados reais o feed fica vazio e a UI não inventa fallback", () => {
    expect(server).toContain("return { items: [] }");
    expect(component).not.toContain("FALLBACK_POOL");
    expect(component).toContain("if (!item) return null");
  });

  test("não publica métricas de confiança sem evidência", () => {
    expect(component).not.toContain("4.9/5");
    expect(component).not.toContain("+180 avaliações");
    expect(component).not.toContain("+500 empresas atendidas");
    expect(component).not.toContain("20 anos de mercado");
    expect(component).toContain('aria-label="Áreas de atuação"');
  });

  test("não exibe cidade porque lead_submissions não possui cidade canônica", () => {
    expect(server).not.toContain("city:");
    expect(component).not.toContain("item.city");
  });
});
