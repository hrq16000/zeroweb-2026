import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const research = readFileSync("src/lib/portfolio-autonomous-research.server.ts", "utf8");
const managed = readFileSync("src/lib/portfolio-managed.functions.ts", "utf8");
const wizard = readFileSync("src/routes/_authenticated/app.portfolio.novo.tsx", "utf8");

describe("portfolio autônomo: intake mínimo e pesquisa", () => {
  test("entrada pública do admin exige somente nome e localização", () => {
    expect(wizard).toContain("Criação autônoma");
    expect(wizard).toContain("Nome do negócio");
    expect(wizard).toContain("Endereço, bairro ou cidade");
    expect(wizard).toContain("Pesquisar e criar");
  });

  test("pesquisa não depende de Google Maps existir", () => {
    expect(research).toContain("Se não existe ficha local confiável, ampliar a busca");
    expect(research).toContain('site:instagram.com');
    expect(research).toContain('site:facebook.com');
    expect(research).toContain('site:tiktok.com');
    expect(research).toContain('"NONE"');
  });

  test("conflito de identidade nunca é escolhido silenciosamente", () => {
    expect(research).toContain('"CONFLICT"');
    expect(research).toContain("não deve escolher silenciosamente");
  });

  test("telefone público não vira WhatsApp e o projeto nasce draft lead-only", () => {
    expect(research).toContain("Telefone público não é presumido WhatsApp");
    expect(managed).toContain('funnelDeliveryMode: "lead_only"');
    expect(managed).toContain('lifecycle_status: "draft"');
    expect(managed).toContain("funnel_enabled: false");
  });

  test("ledger de pesquisa é persistido no projeto managed", () => {
    expect(managed).toContain("autonomous_research: research");
    expect(managed).toContain('input_mode: "name_location_only"');
    expect(managed).toContain('status: "research_complete"');
  });
});
