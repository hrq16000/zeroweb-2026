import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import {
  LETICIA_REICHE_HOSTED_FORM_URL,
  isLeticiaReicheHostedFormUrl,
} from "../../src/lib/leticia-reiche-hosted-form";
import whatsapp from "../../src/config/portfolio-whatsapp.json";

const read = (name: string) => readFileSync(name,"utf8");

describe("Letícia Reiche — R4 Jotform demonstrativo sem Supabase", () => {
  test("host e form fixos para não rotearem para outro cliente", () => {
    expect(isLeticiaReicheHostedFormUrl("https://form.jotform.com/263111116816044")).toBe(true);
    expect(isLeticiaReicheHostedFormUrl("https://form.jotform.com/26307723391")).toBe(false);
    expect(new URL(LETICIA_REICHE_HOSTED_FORM_URL).hostname).toBe("form.jotform.com");
  });
  test("destino da profissional permanece sem redirecionamento até verificação", () => {
    const c = whatsapp.contacts as Record<string, { whatsapp: string | null }>;
    expect(c["leticia-reiche"]).toEqual({ whatsapp: null });
  });
  test("prévia não vaza dados e nunca entra em produção", () => {
    const page = read("src/components/site/LeticiaReichePreviewPage.tsx");
    const route = read("src/routes/portfolio-preview.leticia-reiche.tsx");
    expect(page).toContain("onClick={() => setFormOpen(true)}");
    expect(page).toContain("<iframe");
    expect(page).toContain("não um canal oficial");
    expect(page).not.toMatch(/wa\.me|api\.whatsapp|tel:/);
    expect(page).not.toContain("submitPortfolioQuiz");
    expect(route).toContain("process.env.VERCEL_ENV === \"preview\"");
    expect(route).toContain("if (!(await isPreviewEnvironment())) throw notFound()");
    expect(route).toContain("noindex,nofollow,noarchive,noimageindex");
  });
});
