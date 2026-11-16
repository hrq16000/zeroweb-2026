import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (name: string) => readFileSync(name, "utf8");

describe("rodada 2: recuperacao de imagens nas paginas de servicos", () => {
  const cover = read("src/components/site/ServiceCoverImage.tsx");
  const gallery = read("src/components/site/ProductGallery.tsx");
  const related = read("src/components/site/RelatedServicesCarousel.tsx");
  const route = read("src/routes/servicos.$slug.tsx");

  test("falha de imagem e comunicada ao link ampliado para evitar URL quebrada", () => {
    expect(cover).toContain("onImageError?.(current)");
    expect(gallery).toContain("onImageError={handleImageFailure}");
    expect(gallery).toContain("href={fullImageUrl}");
    expect(gallery).toContain("failedUrls.includes(url)");
    expect(route).toContain("href={imageHref(g.url)}");
    expect(route).toContain("href={imageHref(data.imageUrl)}");
  });

  test("produtos sem foto recebem capa institucional sem perder galeria", () => {
    expect(gallery).toContain("catalogImages.length ? catalogImages :");
    expect(gallery).toContain("serviceCoverFallback(slug, category)");
    expect(route).toContain("{isProduct ? (");
    expect(route).toContain("<ProductGallery key={slug}");
  });

  test("recomendacoes e galerias utilizam recuperacao compartilhada", () => {
    expect(related).toContain("<ServiceCoverImage");
    expect(related).not.toContain("<img src={s.imageUrl}");
    expect(route).toContain("<ServiceCoverImage");
    expect(cover).toContain("<ServiceImageFallback");
  });
});
