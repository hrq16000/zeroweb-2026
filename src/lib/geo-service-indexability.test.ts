import { describe, expect, it } from "bun:test";
import { ALL_CITY_SLUGS } from "./geo-data";
import { GEO_SERVICE_SLUGS } from "./services-data";
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
});
