import { describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { resolve } from "path";

const intentLanding = readFileSync(resolve(process.cwd(), "src/components/site/IntentLanding.tsx"), "utf8");
const consumers = [
  "src/routes/servicos.consultoria.tsx",
  "src/routes/servicos.site-pro.tsx",
  "src/routes/servicos.trafego-pago.tsx",
].map((path) => readFileSync(resolve(process.cwd(), path), "utf8"));

describe("IntentLanding funnel-only contract", () => {
  test("não carrega WhatsAppFloat na loja", () => {
    expect(intentLanding).not.toContain("WhatsAppFloat");
  });

  test("não mantém whatsappMessage como API morta", () => {
    expect(intentLanding).not.toContain("whatsappMessage");
    for (const src of consumers) expect(src).not.toContain("whatsappMessage=");
  });

  test("mantém os CTAs no FunnelCTAButton", () => {
    expect(intentLanding).toContain("FunnelCTAButton");
    expect(intentLanding).toContain('purpose: "proposal"');
    expect(intentLanding).toContain('purpose: "diagnosis"');
  });
});
