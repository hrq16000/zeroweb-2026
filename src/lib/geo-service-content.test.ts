import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "bun:test";
import { GEO_SERVICE_SLUGS, SERVICES } from "./services-data";
import { geoDeliveryProcess, geoNeedSignals, geoScopeItems } from "./geo-service-content";

describe("conteúdo factual da página cidade x serviço", () => {
  it("tem conteúdo editorial próprio para todos os serviços geográficos", () => {
    for (const slug of GEO_SERVICE_SLUGS) {
      const service = SERVICES[slug];
      expect(geoNeedSignals(service).length).toBeGreaterThanOrEqual(4);
      expect(geoScopeItems(service).length).toBeGreaterThanOrEqual(4);
      expect(geoDeliveryProcess(service)).toHaveLength(4);
    }
  });

  it("não herda promessas comerciais do catálogo global", () => {
    const banned = [
      "4x",
      "95+",
      "7 dias",
      "15 a 30 dias",
      "roi mensurável",
      "primeiros ganhos",
      "topo do google",
      "resultado consistente",
    ];

    for (const slug of GEO_SERVICE_SLUGS) {
      const service = SERVICES[slug];
      const copy = [
        ...geoNeedSignals(service),
        ...geoScopeItems(service),
        ...geoDeliveryProcess(service).flatMap((item) => [item.step, item.desc]),
      ]
        .join(" ")
        .toLowerCase();

      for (const phrase of banned) expect(copy).not.toContain(phrase);
    }
  });

  it("a rota não usa benefícios, processo ou case inferido do catálogo global", () => {
    const route = readFileSync(
      resolve(process.cwd(), "src/routes/$city.$service.tsx"),
      "utf8",
    );

    expect(route).not.toContain("service.benefits");
    expect(route).not.toContain("service.process");
    expect(route).not.toContain("cases.find");
    expect(route).not.toContain('from "@/lib/cases-data"');
  });
});
