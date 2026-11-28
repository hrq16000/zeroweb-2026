import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
const read = (path: string) => readFileSync(path, "utf8");
describe("Dona Garimpeira — contrato R13", () => {
  it("mantém catálogo e rota pública desativados", () => {
    const item = JSON.parse(read("src/config/portfolio-catalog.json")).find((x: any) => x.slug === "dona-garimpeira-brecho");
    const registry = read("src/lib/portfolio-site-registry.ts");
    const entry = registry.match(/\{\s*slug: "dona-garimpeira-brecho"[\s\S]*?\n\s*\}/)?.[0] ?? "";
    expect(item.status).toBe("draft"); expect(item.live).toBe(false); expect(item.indexable).toBe(false);
    expect(entry).toContain("indexable: false");
  });
  it("mantém a prévia protegida e sem dados comerciais operacionais", () => {
    const route = read("src/routes/portfolio-preview.dona-garimpeira-brecho.tsx");
    const page = read("src/components/site/DonaGarimpeiraBrechoPage.tsx");
    expect(route).toContain('createFileRoute("/portfolio-preview/dona-garimpeira-brecho")');
    expect(route).toContain("noindex,nofollow,noarchive,noimageindex");
    expect(route).toContain('rel: "canonical"');
    expect(route).not.toContain("FunnelPreview");
    expect(page).toContain("não é site oficial");
    expect(page).toContain("disabled");
    expect(page).not.toMatch(/Rua Loanda|83040-170|@donagarimpeirasjp|DonaGarimpeiraOfflineFunnel|href=\{INSTAGRAM\}/);
  });
  it("registra o bloqueio de release e uma única dependência comercial", () => {
    const manifest = JSON.parse(read("docs/portfolio/drafts/dona-garimpeira-brecho-manifest-v4.json"));
    expect(manifest.stage).toBe("ready");
    expect(manifest.decision).toBe("C_TECHNICAL_RELEASE_BLOCKED");
    expect(manifest.ownerRequired).toHaveLength(1);
    expect(manifest.blockers.some((x: string) => x.includes("PRODUCTION_RELEASE_REQUIRED"))).toBe(true);
    expect(manifest.blockers.some((x: string) => x.includes("CLIENT_APPROVAL_PENDING"))).toBe(true);
  });
});
