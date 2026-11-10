import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
const route = readFileSync("src/routes/portfolio.leticia-reiche.tsx","utf8");
const preview = readFileSync("src/routes/portfolio-preview.leticia-reiche.tsx","utf8");
const page = readFileSync("src/components/site/LeticiaReichePreviewPage.tsx","utf8");
const overrides = JSON.parse(readFileSync("src/config/portfolio-global-config.json","utf8"));
describe("Letícia Reiche — rota indexável demonstrativa isolada",()=>{
  test("canonical e robots próprios, sem schema LocalBusiness inventado",()=>{
    expect(route).toContain('createFileRoute("/portfolio/leticia-reiche")');
    expect(route).toContain('https://0web.com.br/portfolio/leticia-reiche');
    expect(route).toContain('index,follow,max-image-preview:large');
    expect(route).not.toContain('"@type": "LocalBusiness"');
    expect(route).toContain("não é o site oficial");
  });
  test("prévia permanece noindex e protegida",()=>{
    expect(preview).toContain('noindex,nofollow');
    expect(preview).toContain('if (!(await isPreviewEnvironment())) throw notFound()');
  });
  test("formulário real somente com consentimento e sem CTA quebrado do Supabase",()=>{
    expect(page).toContain('data-funnel-provider="jotform"');
    expect(page).toContain('data-client-key="leticia-reiche"');
    expect(page).toContain("https://form.jotform.com/263111116816044");
    expect(page).toContain('onClick={() => setFormOpen(true)}');
    expect(overrides.overrides["leticia-reiche"].contactFloating.enabled).toBe(false);
  });
});
