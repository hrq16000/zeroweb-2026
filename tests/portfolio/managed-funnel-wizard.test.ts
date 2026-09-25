import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const wizard = readFileSync("src/routes/_authenticated/app.portfolio.novo.tsx", "utf8");
const managedFns = readFileSync("src/lib/portfolio-managed.functions.ts", "utf8");
const dynamicFunnel = readFileSync("src/lib/dynamic-funnel.functions.ts", "utf8");
const redirect = readFileSync("src/lib/whatsapp-redirect.server.ts", "utf8");
const view = readFileSync("src/components/portfolio/PortfolioManagedView.tsx", "utf8");
const managed = readFileSync("src/lib/portfolio-managed.ts", "utf8");
const authorialRegistry = readFileSync("src/config/portfolio-authorial-compositions.ts", "utf8");
const authorialView = readFileSync("src/components/portfolio/PortfolioManagedAuthorialView.tsx", "utf8");
const compositionPlanner = readFileSync("src/lib/portfolio-managed-composition.ts", "utf8");

describe("novo portfolio managed: funil isolado", () => {
  test("wizard exige intenção e modo de entrega", () => {
    expect(wizard).toContain("Funil & destino");
    expect(wizard).toContain("funnelIntent");
    expect(wizard).toContain("funnelDeliveryMode");
    expect(wizard).toContain("WhatsApp oficial do cliente");
  });

  test("cada projeto managed recebe dynamic_form próprio", () => {
    expect(managedFns).toContain("portfolio-${input.clientKey}");
    expect(managedFns).toContain("portfolio_managed: true");
    expect(managedFns).toContain('status: input.published ? "published" : "draft"');
  });

  test("managed nunca cai no funnel-service compartilhado", () => {
    expect(dynamicFunnel).toContain('routingKind === "managed"');
    expect(dynamicFunnel).toContain("[clientFunnelSlug, clientFunnelSlugAlt]");
    expect(dynamicFunnel).toContain('routingKind === "legacy"');
  });

  test("destino managed é resolvido por client_key exato e sem fallback", () => {
    expect(redirect).toContain('.eq("client_key", clientKey)');
    expect(redirect).toContain('.eq("project_kind", "managed")');
    expect(redirect).toContain("resolveVersionedPortfolioWhatsApp");
  });

  test("CTA visual do managed abre o funil real", () => {
    expect(view).toContain("<PortfolioCTAQuiz");
    expect(view).toContain("clientKey={project.clientKey}");
    expect(view).toContain("funnelIntent={project.funnelIntent}");
  });

  test("projeto managed novo não publica preset como composição final", () => {
    expect(managedFns).toContain("authorial_composition");
    expect(managedFns).toContain('reason: "new_managed_project"');
    expect(managedFns).toContain('reason: "new_autonomous_managed_project"');
    expect(managed).toContain("PORTFOLIO_AUTHORIAL_COMPOSITION_REQUIRED");
    expect(managed).toContain("hasAuthorialPortfolioComposition(slug)");
    expect(authorialRegistry).toContain("PORTFOLIO_AUTHORIAL_COMPOSITION_SLUGS");
    expect(view).toContain("WORKBENCH de compatibilidade");
    expect(view).toContain("project.compositionPlan");
    expect(authorialView).toContain('data-managed-authorial="true"');
    expect(authorialView).toContain("data-composition-signature");
    expect(compositionPlanner).toContain("directions");
    expect(compositionPlanner).toContain("managedCompositionSimilarity");
  });
});
