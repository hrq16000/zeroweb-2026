import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const page = readFileSync("src/components/site/CatharineLimaStudioPage.tsx", "utf8");
const clients = JSON.parse(readFileSync("src/config/portfolio-clients.json", "utf8"));
const whatsapp = JSON.parse(readFileSync("src/config/portfolio-whatsapp.json", "utf8"));
const destinations = JSON.parse(readFileSync("src/config/portfolio-funnel-destinations.json", "utf8"));

describe("Catharine Lima Studio", () => {
  test("usa funil individual de agendamento", () => {
    expect(page).toContain('clientKey="catharine-lima-studio"');
    expect(page).toContain('mode="booking"');
    expect(page).not.toContain("wa.me/");
    expect(page).not.toContain("tel:");
  });

  test("destino confirmado fica isolado no client_key", () => {
    expect(whatsapp.contacts["catharine-lima-studio"].whatsapp).toBe("5541998884095");
    expect(destinations.entries["catharine-lima-studio"].status).toBe("VERIFIED");
  });

  test("registro declara funil individual e origem factual", () => {
    const client = clients.find((item: any) => item.clientKey === "catharine-lima-studio");
    expect(client?.funnelType).toBe("agendamento");
    expect(client?.contactMode).toBe("funnelOnly");
    expect(client?.provenance?.kind).toBe("OWNER_SUPPLIED_PUBLIC_EVIDENCE");
  });
});
