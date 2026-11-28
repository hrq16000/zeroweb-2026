import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
const read = (path: string) => readFileSync(path, "utf8");
describe("Letícia Reiche — handoff comercial desativado", () => {
  it("não renderiza formulário, iframe, Jotform ou coleta de dados", () => {
    const page = read("src/components/site/LeticiaReichePreviewPage.tsx");
    const media = JSON.parse(read("docs/portfolio/media-plans/leticia-reiche.json"));
    expect(page).not.toMatch(/Jotform|jotform|iframe|formOpen|form\.jotform/);
    expect(page).toContain("disabled");
    expect(media.page.formEnabled).toBe(false); expect(media.page.formProvider).toBeNull(); expect(media.page.formUrl).toBeNull();
  });
  it("não mantém telefone nem destino WhatsApp ativo", () => {
    const enrichment = JSON.parse(read("docs/portfolio/enrichment/leticia-reiche.json"));
    const whatsapp = JSON.parse(read("src/config/portfolio-whatsapp.json"));
    expect(enrichment.identity.telephone.value).toBeNull();
    expect(enrichment.identity.telephone.confirmedAsWhatsapp).toBe(false);
    expect(whatsapp.contacts["leticia-reiche"]?.whatsapp ?? null).toBeNull();
  });
});
