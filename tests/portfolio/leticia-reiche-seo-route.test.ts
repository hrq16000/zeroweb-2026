import { describe, expect, it } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
const read = (path: string) => readFileSync(path, "utf8");
describe("Letícia Reiche — demonstração restrita R13", () => {
  it("mantém somente a rota de Preview protegida, canônica e noindex", () => {
    const route = read("src/routes/portfolio-preview.leticia-reiche.tsx");
    const routeTree = read("src/routeTree.gen.ts");
    expect(route).toContain('createFileRoute("/portfolio-preview/leticia-reiche")');
    expect(route).toContain("if (!(await isPreviewEnvironment())) throw notFound()");
    expect(route).toContain('rel: "canonical"');
    expect(route).toContain("noindex,nofollow,noarchive,noimageindex");
    expect(routeTree).toContain("portfolio-preview/leticia-reiche");
    expect(existsSync("src/routes/portfolio.leticia-reiche.tsx")).toBe(false);
  });
  it("não permite descoberta, publicação ou indexação comercial", () => {
    const item = JSON.parse(read("src/config/portfolio-catalog.json")).find((x: any) => x.slug === "leticia-reiche");
    const manifest = JSON.parse(read("src/config/portfolio-project-manifests.json")).projects["leticia-reiche"];
    expect(item.status).toBe("draft"); expect(item.live).toBe(false); expect(item.indexable).toBe(false);
    expect(manifest.stage).toBe("ready"); expect(manifest.decision).toBe("B_TECHNICALLY_COMPLETE_AWAITING_CLIENT");
    expect(manifest.blockers).toHaveLength(1);
  });
  it("usa somente identidade autoral e remove campanha sem confirmação", () => {
    const page = read("src/components/site/LeticiaReichePreviewPage.tsx");
    const brand = JSON.parse(read("src/config/portfolio-brand-review.json")).projects["leticia-reiche"];
    expect(page).toContain("não é site oficial");
    expect(page).not.toMatch(/Jotform|jotform|iframe|Natal 2026|40%|Belford Roxo/);
    expect(brand.authored).toBe(true); expect(brand.brandReview).toBe("PENDING_CLIENT_APPROVAL");
  });
});
