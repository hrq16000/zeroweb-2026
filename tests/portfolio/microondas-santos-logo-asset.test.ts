import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { statSync } from "node:fs";

const source = readFileSync("src/components/site/AssistenciaMicroondasSantosPage.tsx", "utf8");

describe("Assistência Microondas Santos · asset LCP do header", () => {
  test("usa variante leve e prioritária no logo LCP", () => {
    expect(source).toContain('src="/images/assistencia-microondas-santos/logo-header.webp"');
    expect(source).toContain("priority");
    expect(source).toContain("width={264} height={133}");
  });

  test("mantém a variante de header abaixo de 20 KB", () => {
    expect(statSync("public/images/assistencia-microondas-santos/logo-header.webp").size).toBeLessThan(20_000);
  });

  test("preserva hero e funil", () => {
    expect(source).toContain('src="/images/assistencia-microondas-santos/hero.png"');
    expect(source).toContain('clientKey="assistencia-microondas-santos"');
    expect(source).toContain("Solicitar atendimento");
  });
});
