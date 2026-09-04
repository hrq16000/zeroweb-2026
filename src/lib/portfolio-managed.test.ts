import { describe, expect, it } from "bun:test";
import {
  buildManagedRow,
  canTransition,
  evaluateManagedConformance,
  managedStatus,
  sanitizeManagedProject,
} from "@/lib/portfolio-managed";

const complete = {
  slug: "fixture-managed-demo",
  client_key: "fixture-managed-demo",
  display_name: "Fixture Managed Demo",
  segment: "servicos",
  city: "Curitiba",
  state: "PR",
  summary: "Projeto técnico de validação do fluxo administrável.",
  preset: "impact",
  seo_title: "Fixture Managed Demo — projeto de validação",
  seo_description:
    "Página técnica criada pelo painel para validar o ciclo de vida completo dos projetos administráveis do portfólio.",
  logo_url: "/images/fixture-managed-demo/logo.webp",
  hero_image_url: "/images/fixture-managed-demo/hero.webp",
  hero_focal: { x: 40, y: 30 },
  hero_headline: "Presença digital criada pelo painel",
  hero_subheadline: "Sem editar código.",
  catalog_cover_url: "/images/fixture-managed-demo/capa.webp",
  cover_focal: { x: 50, y: 20 },
  social_image_url: "/images/fixture-managed-demo/social.jpg",
  social_version: "1",
  cta_label: "Solicitar orçamento",
  share_copy: "Conheça a Fixture Managed Demo em 0web.com.br/portfolio/fixture-managed-demo",
  services: [
    { title: "Serviço A", description: "Descrição A" },
    { title: "Serviço B", description: "Descrição B" },
    { title: "Serviço C", description: "Descrição C" },
  ],
  gallery_items: [
    { url: "/images/fixture-managed-demo/g1.webp", alt: "Foto 1", focal: { x: 10, y: 90 } },
    { url: "/images/fixture-managed-demo/g2.webp", alt: "Foto 2" },
  ],
  content_blocks: { about: "Sobre o negócio.", differentials: ["Rapidez", "Atendimento"] },
  brand_colors: { primary: "#123456", accent: "#abcdef" },
  lifecycle_status: "published",
  published: true,
  content_version: 3,
};

describe("projetos managed do portfólio", () => {
  it("sanitiza a linha do banco em projeto público", () => {
    const project = sanitizeManagedProject(complete)!;
    expect(project.slug).toBe("fixture-managed-demo");
    expect(project.preset).toBe("impact");
    expect(project.services).toHaveLength(3);
    expect(project.gallery[0]?.focal).toEqual({ x: 10, y: 90 });
    expect(project.socialImage).toBe("/images/fixture-managed-demo/social.jpg?v=1");
    expect(project.canonicalUrl).toBe("https://0web.com.br/portfolio/fixture-managed-demo");
    expect(project.robots).toContain("index,follow");
  });

  it("bloqueia contato público, HTML e assets externos", () => {
    const project = sanitizeManagedProject({
      ...complete,
      hero_subheadline: "Chame no 41 99745-2053",
      display_name: "<script>x</script>",
      logo_url: "https://exemplo.com/logo.png",
      share_copy: "WhatsApp 41 99745-2053",
    })!;
    expect(project.heroSubheadline).toBe("");
    expect(project.displayName).toBe("fixture-managed-demo");
    expect(project.logoUrl).toBe("");
    expect(project.shareCopy).toBe("");
  });

  it("não indexa rascunho, pronto nem arquivado", () => {
    for (const status of ["draft", "ready", "archived"]) {
      const project = sanitizeManagedProject({ ...complete, lifecycle_status: status, published: false })!;
      expect(project.indexable).toBe(false);
      expect(project.robots).toBe("noindex,nofollow");
    }
  });

  it("conformidade bloqueia READY enquanto faltar identidade", () => {
    const incomplete = sanitizeManagedProject({
      ...complete,
      logo_url: "",
      catalog_cover_url: "",
      services: [],
    })!;
    const status = managedStatus(incomplete);
    expect(status.canBeReady).toBe(false);
    expect(status.blockers.map((b) => b.code)).toEqual(
      expect.arrayContaining([
        "PORTFOLIO_LOGO_MISSING",
        "PORTFOLIO_COVER_MISSING",
        "PORTFOLIO_SERVICES_MISSING",
      ]),
    );
    expect(evaluateManagedConformance(sanitizeManagedProject(complete)!).some((i) => i.level === "blocker")).toBe(
      false,
    );
  });

  it("respeita as transições do ciclo de vida", () => {
    expect(canTransition("draft", "ready")).toBe(true);
    expect(canTransition("draft", "published")).toBe(false);
    expect(canTransition("ready", "published")).toBe(true);
    expect(canTransition("published", "archived")).toBe(true);
    expect(canTransition("archived", "published")).toBe(false);
  });

  it("monta a linha do wizard já sanitizada", () => {
    const row = buildManagedRow({
      slug: "fixture-managed-demo",
      displayName: "Fixture Managed Demo",
      preset: "invalido",
      logoUrl: "javascript:alert(1)",
      services: [{ title: "A" }, { title: "" }],
      heroFocal: { x: 300, y: -20 },
    });
    expect(row.preset).toBe("editorial");
    expect(row.logo_url).toBe("");
    expect(row.services).toHaveLength(1);
    expect(row.hero_focal).toEqual({ x: 100, y: 0 });
    expect(row.canonical_url).toBe("https://0web.com.br/portfolio/fixture-managed-demo");
    expect(row.project_kind).toBe("managed");
  });
});
