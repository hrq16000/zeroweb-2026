import { describe, expect, it } from "vitest";
import fs from "node:fs";

const component = fs.readFileSync("src/components/site/AutoescolaAptosPage.tsx", "utf8");
const catalog = JSON.parse(fs.readFileSync("src/config/portfolio-catalog.json", "utf8"));
const clients = JSON.parse(fs.readFileSync("src/config/portfolio-clients.json", "utf8"));

describe("Autoescola APTOS portfolio", () => {
  it("mantém contato comercial fora do bundle público", () => {
    expect(component).not.toMatch(/wa\.me|api\.whatsapp\.com|href=["']tel:/i);
    expect(component).not.toMatch(/99145|3383-3627|3081-3628/);
  });

  it("destaca os dois veículos automáticos sem inventar modelo", () => {
    expect(component).toContain("Carro automático");
    expect(component).toContain("Moto automática");
    expect(component).not.toMatch(/Corolla|Onix|HB20|Biz|PCX|NMax/i);
  });

  it("está isolado por slug e clientKey", () => {
    const item = catalog.find((x: { slug: string }) => x.slug === "autoescola-aptos");
    const client = clients.find((x: { clientKey: string }) => x.clientKey === "autoescola-aptos");
    expect(item?.clientKey).toBe("autoescola-aptos");
    expect(client?.slug).toBe("autoescola-aptos");
    expect(client?.contactMode).toBe("funnelOnly");
  });
});
