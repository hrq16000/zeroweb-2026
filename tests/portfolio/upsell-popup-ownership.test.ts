import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";

/**
 * A captação da 0WEB é camada da hospedagem: a casca padrão é a dona única.
 * Landings do pipeline atual não podem montar uma segunda instância.
 */
const read = (p: string) => readFileSync(p, "utf8");

describe("PortfolioUpsellPopup — posse única", () => {
  it("a casca padrão monta o pop-up", () => {
    expect(read("src/components/portfolio/PortfolioStandardShell.tsx")).toContain(
      "<PortfolioUpsellPopup",
    );
  });

  it("landings do pipeline atual não montam o pop-up", () => {
    for (const file of [
      "src/components/site/CarecasInfotecPage.tsx",
      "src/components/site/MoreiraAutoMecanicaPage.tsx",
      "src/components/site/JklDecorPage.tsx",
    ]) {
      expect(read(file)).not.toContain("PortfolioUpsellPopup");
    }
  });

  it("o gerador de novos projetos não insere o pop-up na landing", () => {
    expect(read("scripts/scaffold-portfolio-client.mjs")).not.toContain("PortfolioUpsellPopup");
  });

  it("pré-visualização embutida (iframe) suprime a camada da hospedagem", () => {
    const src = read("src/lib/portfolio-preview.ts");
    expect(src).toContain("isPortfolioEmbedded");
    expect(src).toContain("window.self !== window.top");
  });

  it("o funil do cliente rearma a captação ao fechar", () => {
    const src = read("src/components/site/PortfolioUpsellPopup.tsx");
    expect(src).toContain("0web:portfolio-funnel-close");
    expect(src).toContain("FUNNEL_REARM_MS");
    expect(read("src/components/funnel/FunnelCTAButton.tsx")).toContain(
      "0web:portfolio-funnel-close",
    );
  });
});
