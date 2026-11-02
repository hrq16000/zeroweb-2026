import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  DONA_GARIMPEIRA_SEO,
  createDonaGarimpeiraSeo,
  donaGarimpeiraSeoReady,
  type DonaGarimpeiraSeoState,
} from "@/lib/dona-garimpeira-seo";

const draft: DonaGarimpeiraSeoState = {
  published: false,
  mediaApproved: false,
  funnelVerified: false,
  ownerApproved: false,
};
const ready: DonaGarimpeiraSeoState = {
  published: true,
  mediaApproved: true,
  funnelVerified: true,
  ownerApproved: true,
  approvedSocialImage: "/images/dona-garimpeira-brecho/capa-og.webp",
};
const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("Dona Garimpeira — SEO preparado, sem indexação prematura", () => {
  test("draft e combinações parciais são sempre noindex sem schema ou OG", () => {
    for (const state of [
      draft,
      { ...ready, published: false },
      { ...ready, mediaApproved: false },
      { ...ready, funnelVerified: false },
      { ...ready, ownerApproved: false },
      { ...ready, approvedSocialImage: null },
      { ...ready, approvedSocialImage: "https://outrobrecho.com/foto.jpg" },
      { ...ready, approvedSocialImage: "/images/outro-cliente/capa.webp" },
    ]) {
      expect(donaGarimpeiraSeoReady(state)).toBe(false);
      const seo = createDonaGarimpeiraSeo(state);
      expect(seo.ready).toBe(false);
      expect(seo.meta).toContainEqual({
        name: "robots", content: "noindex,nofollow,noarchive",
      });
      expect(seo.links).toEqual([]);
      expect(seo.scripts).toEqual([]);
    }
  });

  test("projeto aprovado produz canonical próprio, Open Graph e ClothingStore", () => {
    expect(donaGarimpeiraSeoReady(ready)).toBe(true);
    const seo = createDonaGarimpeiraSeo(ready);
    expect(seo.ready).toBe(true);
    expect(seo.links).toContainEqual({
      rel: "canonical", href: DONA_GARIMPEIRA_SEO.canonical,
    });
    expect(seo.meta).toContainEqual({
      name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1",
    });
    const schema = JSON.parse(String(seo.scripts[0].children));
    const store = schema["@graph"].find((n: { "@type": string }) => n["@type"] === "ClothingStore");
    expect(store).toBeDefined();
    expect(store.address.streetAddress).toBe("Rua Loanda, 60");
    expect(store.address.addressLocality).toBe("São José dos Pinhais");
    expect(store.address.postalCode).toBe("83040-170");
    expect(store.sameAs).toEqual(["https://www.instagram.com/donagarimpeirasjp/"]);
    expect(store.openingHoursSpecification[0].dayOfWeek).toHaveLength(7);
    expect(store).not.toHaveProperty("review");
    expect(store).not.toHaveProperty("aggregateRating");
    expect(store).not.toHaveProperty("telephone");
    expect(store).not.toHaveProperty("hasMap");
    expect(store).not.toHaveProperty("offers");
  });

  test("a composição já tem registro autoral, porém a rota continua não-publicável", () => {
    const visual = read("src/components/portfolio/composition/registry.ts");
    const server = read("src/config/portfolio-authorial-compositions.ts");
    expect(visual).toContain('"dona-garimpeira-brecho": lazy(');
    expect(server).toContain('"dona-garimpeira-brecho"');
    const prototypes = read("src/lib/portfolio-site-registry.ts");
    expect(prototypes).not.toContain('slug: "dona-garimpeira-brecho"');
    const clients = JSON.parse(read("src/config/portfolio-clients.json"));
    expect(clients.find((p: { slug: string }) => p.slug === "dona-garimpeira-brecho")).toBeUndefined();
    const catalog = JSON.parse(read("src/config/portfolio-catalog.json"));
    expect(catalog.find((p: { slug: string }) => p.slug === "dona-garimpeira-brecho")).toBeUndefined();
  });

  test("galeria preserva ausência de fotos oficiais e não promete beneficência", () => {
    const media = JSON.parse(read("docs/portfolio/media-plans/dona-garimpeira-brecho.json"));
    expect(media.socialLatestSix.verifiedPostPermalinks).toEqual([]);
    const jsx = read("src/components/site/DonaGarimpeiraBrechoPage.tsx");
    expect(jsx).not.toContain("iniciativas solidárias");
    expect(jsx).not.toContain("wa.me/");
    expect(jsx).toContain("const GALLERY_ITEMS: GalleryItem[] = []");
  });
});
