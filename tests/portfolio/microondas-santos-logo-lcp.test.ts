import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/AssistenciaMicroondasSantosPage.tsx", "utf8");

describe("Assistência Microondas Santos · logo LCP", () => {
  test("mantém o logo prioritário com decode síncrono", () => {
    expect(source).toContain('src="/images/assistencia-microondas-santos/logo.png"');
    expect(source).toContain("priority");
    expect(source).toContain('decoding="sync"');
  });

  test("não altera hero, CTA ou funil", () => {
    expect(source).toContain('src="/images/assistencia-microondas-santos/hero.png"');
    expect(source).toContain('clientKey="assistencia-microondas-santos"');
    expect(source).toContain("Solicitar atendimento");
  });
});
