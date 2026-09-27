import { describe, expect, it } from "bun:test";
import { CITIES } from "./geo-data";
import { GEO_SERVICE_SLUGS, SERVICES } from "./services-data";
import {
  cityFaq,
  heroSubtitle,
  localContext,
  pageDescription,
  pageTitle,
} from "./content-variations";

describe("copy factual de cidade x serviço", () => {
  it("explicita atendimento remoto em todas as combinações", () => {
    for (const city of Object.values(CITIES)) {
      for (const slug of GEO_SERVICE_SLUGS) {
        const service = SERVICES[slug];
        expect(heroSubtitle(city, service).toLowerCase()).toContain("remot");
        expect(localContext(city, service).toLowerCase()).toContain("remot");
        expect(pageDescription(city, service).toLowerCase()).toContain("remot");
      }
    }
  });

  it("não usa alegações comerciais ou de presença local sem prova", () => {
    const banned = [
      "mesma qualidade de quem está ao lado",
      "time sênior",
      "roi mensurável",
      "sla de resposta",
      "agência local em",
      "escritório em",
      "filial em",
    ];

    for (const city of Object.values(CITIES)) {
      for (const slug of GEO_SERVICE_SLUGS) {
        const service = SERVICES[slug];
        const copy = [
          pageTitle(city, service),
          pageDescription(city, service),
          heroSubtitle(city, service),
          localContext(city, service),
          ...cityFaq(city, service).flatMap((item) => [item.q, item.a]),
        ]
          .join(" ")
          .toLowerCase();

        for (const phrase of banned) expect(copy).not.toContain(phrase);
      }
    }
  });
});
