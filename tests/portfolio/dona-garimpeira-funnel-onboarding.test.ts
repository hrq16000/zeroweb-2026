import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
const read = (path: string) => readFileSync(path, "utf8");
describe("Dona Garimpeira — handoff comercial desativado R13", () => {
  it("não mantém WhatsApp, telefone, destino ou formulário ativos", () => {
    const whatsapp = JSON.parse(read("src/config/portfolio-whatsapp.json"));
    const destinations = JSON.parse(read("src/config/portfolio-funnel-destinations.json")).entries["dona-garimpeira-brecho"];
    const contact = JSON.parse(read("docs/portfolio/drafts/dona-garimpeira-brecho-contact.json"));
    const contract = JSON.parse(read("docs/portfolio/drafts/dona-garimpeira-brecho-funnel-contract.json"));
    expect(whatsapp.contacts["dona-garimpeira-brecho"]?.whatsapp ?? null).toBeNull();
    expect(destinations.enabled).toBe(false);
    expect(destinations.destination ?? null).toBeNull();
    expect(contact.publicContactEnabled).toBe(false);
    expect(contract.formEnabled).toBe(false);
    expect(contract.contactEnabled).toBe(false);
    expect(contract.whatsapp_config.enabled).toBe(false);
    expect(contract.whatsapp_config.number).toBeNull();
  });
  it("os CTAs são apenas controles desativados, sem envio ou coleta", () => {
    const page = read("src/components/site/DonaGarimpeiraBrechoPage.tsx");
    expect(page).toContain('disabled aria-disabled="true"');
    expect(page).not.toMatch(/DonaGarimpeiraOfflineFunnel|PreviewInterestContext|onPreviewInterest|href=\{INSTAGRAM\}/);
  });
});
