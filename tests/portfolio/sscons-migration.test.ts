/**
 * Contrato da migração autêntica S&S Construções → /portfolio/sscons (issue #60).
 *
 * Garante que a migração preservou a proveniência (assets originais byte a byte),
 * nasceu completa no padrão do playbook e não transportou contato público,
 * depoimentos não auditáveis ou fallback de WhatsApp.
 */
import { describe, expect, it } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import clients from "../../src/config/portfolio-clients.json";
import catalog from "../../src/config/portfolio-catalog.json";
import assets from "../../src/config/portfolio-assets.json";
import coverStatus from "../../src/config/portfolio-cover-status.json";
import motionProfiles from "../../src/config/portfolio-motion-profiles.json";
import experienceLevels from "../../src/config/portfolio-experience-levels.json";
import { PORTFOLIO_CLIENT_KEYS } from "../../src/lib/portfolio-client-keys";
import { findPortfolioPrototype } from "../../src/lib/portfolio-site-registry";
import { resolvePortfolioQuizConfig } from "../../src/config/portfolio-quiz-configs.generated";

const SLUG = "sscons";
const root = process.cwd();
const read = (p: string) => readFileSync(resolve(root, p), "utf8");
const sha256 = (p: string) =>
  createHash("sha256").update(readFileSync(resolve(root, p))).digest("hex");

/**
 * SHA-256 dos 8 assets originais publicados em sscons.lovable.app, copiados
 * byte a byte (ver docs/reports/PORTFOLIO-SSCONS-MIGRATION-2026-09-06.md).
 */
const ORIGINAL_ASSET_HASHES: Record<string, string> = {
  "public/images/sscons/hero.jpg":
    "fe539ee9e975e56793663f9e9bfc27ee1a8dba0efde8b919d313c50117828426",
  "public/images/sscons/sobre.jpg":
    "00039028ed8e006364efa59bcc1aa38f2627e26297683623faa5bc4085c0ee11",
  "public/images/sscons/projeto-01.jpg":
    "8c4ff9119bc49e9005571c7fc4a20352732f57af51a7e153169b7c2969c15ea1",
  "public/images/sscons/projeto-02.jpg":
    "63a527984c49367c1dd2b0e3f60f547b5ecd1063c4f197ce4d5ae6a547025e81",
  "public/images/sscons/projeto-03.jpg":
    "083bd61464abaf394365988106af6c2055459711d1d7a6077e29770e1ddd8814",
  "public/images/sscons/projeto-04.jpg":
    "5b910facfa46bdc87330914d30bc596f891d268fb6045a05fa4ce93e1817d773",
  "public/images/sscons/projeto-05.jpg":
    "23fc4793c0bd156e2c5134f9c3a92ee811d07bd8481d67fae6ba79283a67913b",
  "public/images/sscons/projeto-06.jpg":
    "9fcde083bb9da96d7bce69b7711eba0dc021567470eabb0518f793bc44941141",
};

const component = read("src/components/site/SsConsPage.tsx");
const route = read("src/routes/portfolio.$slug.tsx");

describe("S&S Construções — registro canônico", () => {
  const client = (clients as Array<Record<string, unknown>>).find((c) => c.slug === SLUG);

  it("está registrada com clientKey própria, componente isolado e assets exclusivos", () => {
    expect(client).toBeDefined();
    expect(client?.clientKey).toBe(SLUG);
    expect(client?.componentFile).toBe("src/components/site/SsConsPage.tsx");
    expect(client?.assetsDir).toBe("public/images/sscons");
    expect(client?.legacySharedAssets).toBeUndefined();
    expect(PORTFOLIO_CLIENT_KEYS).toContain(SLUG);
    expect(findPortfolioPrototype(SLUG)?.indexable).toBe(true);
  });

  it("declara proveniência de migração autêntica (issue #60)", () => {
    const provenance = client?.provenance as Record<string, string> | undefined;
    expect(provenance?.kind).toBe("AUTHENTIC_MIGRATION");
    expect(provenance?.issue).toContain("#60");
    expect(provenance?.lovableSourceProjectId).toBe("a6148619-92b1-4e27-afdc-bd7864392fe5");
    expect(provenance?.publishedReference).toBe("https://sscons.lovable.app/");
  });

  it("aparece no catálogo com capa própria e imagem social própria", () => {
    const projects = ((catalog as { projects?: unknown[] }).projects ?? catalog) as Array<
      Record<string, string>
    >;
    const item = projects.find((p) => p.slug === SLUG);
    expect(item?.image).toBe("/images/sscons/capa-card.jpg");
    expect(item?.city).toBe("Curitiba");
    const assetEntry = (assets as { clients: Record<string, { icon: string; socialImage: string }> })
      .clients[SLUG];
    expect(assetEntry.icon).toBe("/images/sscons/logo.png");
    expect(assetEntry.socialImage).toBe("/images/sscons/social.jpg");
    for (const file of [item?.image ?? "", assetEntry.icon, assetEntry.socialImage]) {
      expect(existsSync(resolve(root, `public${file}`))).toBe(true);
    }
  });

  it("tem capa válida no inventário canônico (material real do próprio site)", () => {
    const row = (coverStatus as { projects: Array<{ slug: string; status: string }> }).projects.find(
      (r) => r.slug === SLUG,
    );
    expect(row?.status).toBe("VALID");
  });

  it("nasce com perfil de motion declarado e nível de experiência acima de STATIC", () => {
    const override = (motionProfiles as { overrides: Record<string, { intensity: string }> })
      .overrides[SLUG];
    expect(override?.intensity).toBe("EXPRESSIVE");
    const decision = (motionProfiles as { decisions: Record<string, { whyThisMotion: string }> })
      .decisions[SLUG];
    expect(decision?.whyThisMotion.length).toBeGreaterThan(20);
    const level = (experienceLevels as { levels: Record<string, string> }).levels[SLUG];
    expect(["SIGNATURE", "PREMIUM"]).toContain(level);
  });
});

describe("S&S Construções — proveniência dos assets", () => {
  it("preserva os 8 assets originais byte a byte", () => {
    for (const [file, hash] of Object.entries(ORIGINAL_ASSET_HASHES)) {
      expect(existsSync(resolve(root, file))).toBe(true);
      expect(sha256(file)).toBe(hash);
    }
  });

  it("mantém os 8 arquivos originais (hero + sobre + 6 projetos) na pasta exclusiva", () => {
    const originals = [
      "hero.jpg",
      "sobre.jpg",
      "projeto-01.jpg",
      "projeto-02.jpg",
      "projeto-03.jpg",
      "projeto-04.jpg",
      "projeto-05.jpg",
      "projeto-06.jpg",
    ];
    for (const name of originals) {
      expect(existsSync(resolve(root, `public/images/sscons/${name}`))).toBe(true);
    }
  });
});

describe("S&S Construções — funil, privacidade e casca", () => {
  it("usa funil próprio via clientKey literal e nunca um funil universal", () => {
    expect(component).toContain('clientKey="sscons"');
    expect(component).not.toMatch(/diagnostico-0web|funnel-service|funnel-order-support/);
    expect(resolvePortfolioQuizConfig(SLUG)?.services).toEqual([
      "Carpintaria",
      "Obras",
      "Alvenaria",
      "Pintura",
      "Reforma",
      "Azulejo",
    ]);
  });

  it("não transporta contato público, wa.me, depoimentos ou alegações não auditáveis", () => {
    expect(component).not.toMatch(/wa\.me/i);
    expect(component).not.toMatch(/(?<!\d)(?:\+?55\s*)?\(?\d{2}\)?\s*9\d{4}[-\s]?\d{4}(?!\d)/);
    expect(component).not.toMatch(/tel:|mailto:/);
    expect(component).not.toMatch(/depoimento|testimonial|24 horas|24h/i);
    expect(component).not.toMatch(/\+\d+\s*(clientes|obras|projetos)/i);
  });

  it("renderiza a casca obrigatória: main, imagens do padrão, crédito da hospedagem e pop-ups", () => {
    expect(component).toContain("<main");
    expect(component).toContain("PortfolioImage");
    expect(component).toContain("PortfolioHostCredit");
    expect(component).toContain("PortfolioSocialProofPopup");
    expect(component).toContain("PortfolioUpsellPopup");
    expect(component).not.toContain("@/components/site/Header");
    expect(component).not.toContain("@/components/site/Footer");
    expect(component).toMatch(/managedField="logoUrl"/);
    expect(component).toMatch(/managedField="heroImageUrl"/);
  });

  it("está ligada à rota compartilhada com chunk isolado e JSON-LD próprio", () => {
    expect(route).toMatch(/import\("@\/components\/site\/SsConsPage"\)/);
    expect(route).toContain('slug === "sscons"');
    expect(route).toContain('name: "S&S Construções"');
    expect(route).toMatch(/isSscons[\s\S]*HomeAndConstructionBusiness/);
  });
});
