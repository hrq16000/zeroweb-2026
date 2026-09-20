import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const wizard = readFileSync("src/routes/_authenticated/app.portfolio.novo.tsx", "utf8");
const managedFns = readFileSync("src/lib/portfolio-managed.functions.ts", "utf8");
const dynamicFunnel = readFileSync("src/lib/dynamic-funnel.functions.ts", "utf8");
const redirect = readFileSync("src/lib/whatsapp-redirect.server.ts", "utf8");
const view = readFileSync("src/components/portfolio/PortfolioManagedView.tsx", "utf8");

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
});
