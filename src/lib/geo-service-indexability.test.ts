import { describe, expect, it } from "bun:test";
import { ALL_CITY_SLUGS } from "./geo-data";
import { GEO_SERVICE_SLUGS } from "./services-data";
import portfolioCatalog from "@/config/portfolio-catalog.json";
import {
  getGeoServiceEvidence,
  isGeoServiceIndexable,
  listIndexableGeoServicePairs,
} from "./geo-service-indexability";

describe("indexabilidade cidade x servico", () => {
  it("mantem apenas combinacoes com evidencia editorial explicita", () => {
    const allPairs = ALL_CITY_SLUGS.flatMap((city) =>
      GEO_SERVICE_SLUGS.map((service) => ({ city, service })),
    );
    const indexable = allPairs.filter(({ city, service }) => isGeoServiceIndexable(city, service));

    expect(allPairs).toHaveLength(80);
    expect(indexable).toEqual([
      { city: "curitiba", service: "criacao-de-sites" },
      { city: "curitiba", service: "landing-pages" },
      { city: "sao-paulo", service: "criacao-de-sites" },
      { city: "belo-horizonte", service: "criacao-de-sites" },
    ]);
  });

  it("nao promove servicos sem prova por inferencia de tags", () => {
    expect(isGeoServiceIndexable("curitiba", "seo")).toBe(false);
    expect(isGeoServiceIndexable("curitiba", "marketing-digital")).toBe(false);
    expect(isGeoServiceIndexable("curitiba", "automacao-com-ia")).toBe(false);
    expect(isGeoServiceIndexable("curitiba", "chatbot-whatsapp")).toBe(false);
    expect(isGeoServiceIndexable("curitiba", "gestao-redes-sociais")).toBe(false);
  });

  it("mantem cidades sem projeto real fora do indice", () => {
    for (const city of ["rio-de-janeiro", "porto-alegre", "fortaleza", "salvador", "brasilia", "florianopolis", "recife"]) {
      for (const service of GEO_SERVICE_SLUGS) {
        expect(isGeoServiceIndexable(city, service)).toBe(false);
      }
    }
  });

  it("toda combinacao indexavel aponta para prova real nomeada", () => {
    for (const evidence of listIndexableGeoServicePairs()) {
      expect(evidence.projects.length).toBeGreaterThan(0);
      expect(evidence.proofSummary.length).toBeGreaterThan(40);
      expect(getGeoServiceEvidence(evidence.citySlug, evidence.serviceSlug)).toEqual(evidence);
    }
  });
  it("toda evidencia aponta para projeto publicado no catálogo", () => {
    const catalog = portfolioCatalog as Array<{
      slug: string;
      status?: string;
      city?: string;
      projectType?: string;
    }>;

    for (const evidence of listIndexableGeoServicePairs()) {
      for (const project of evidence.projects) {
        const item = catalog.find((candidate) => candidate.slug === project.slug);
        expect(item).toBeDefined();
        expect(item?.status).toBe("published");
        if (evidence.serviceSlug === "landing-pages") {
          expect(item?.projectType).toBe("landing");
        }
      }
    }
  });
});
