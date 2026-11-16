import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const home = readFileSync("src/routes/index.tsx", "utf8");
const experience = readFileSync("src/components/site/HomeExperienceV2.tsx", "utf8");

describe("intenção de contato e WhatsApp na home", () => {
  test("responde a busca de WhatsApp sem furar o funil", () => {
    expect(experience).toContain("Como falar com a 0WEB pelo WhatsApp?");
    expect(experience).toContain("O atendimento comercial começa pelo botão");
    expect(experience).toContain("quando o atendimento pede continuidade no WhatsApp");
    expect(experience).not.toContain("wa.me/");
  });

  test("schema FAQ repete a mesma política factual", () => {
    expect(home).toContain('"@type": "FAQPage"');
    expect(home).toContain("Como falar com a 0WEB pelo WhatsApp?");
    expect(home).toContain("O atendimento comercial começa pelo funil da 0WEB");
  });
});
