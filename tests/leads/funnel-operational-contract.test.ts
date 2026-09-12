import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

/**
 * PORTFOLIO_FUNNEL_OPERATIONAL_GATE — regressões estruturais.
 * Nenhuma variante de funil pode terminar em beco sem saída.
 */
const redirect = readFileSync("src/routes/r.whatsapp.$token.ts", "utf8");

describe("contrato terminal do funil", () => {
  it("o gate operacional passa para todos os projetos públicos", () => {
    const out = execFileSync("node", ["scripts/check-portfolio-funnel-operational.mjs", "--json"], {
      encoding: "utf8",
    });
    const report = JSON.parse(out) as {
      summary: { failures: string[]; deadEnds: number; projects: number };
    };
    expect(report.summary.projects).toBeGreaterThan(80);
    expect(report.summary.failures).toEqual([]);
    expect(report.summary.deadEnds).toBe(0);
  });

  it("a página terminal sem destino oferece contato de retorno", () => {
    expect(redirect).toContain("recoveryToken");
    expect(redirect).toContain("/api/public/funnel-recovery");
    expect(redirect).not.toContain("Canal indisponível");
  });

  it("o endpoint de recuperação resolve o lead pelo token, não pelo cliente", () => {
    expect(existsSync("src/routes/api/public/funnel-recovery.ts")).toBe(true);
    const api = readFileSync("src/routes/api/public/funnel-recovery.ts", "utf8");
    expect(api).toContain("resolveWhatsAppRedirectToken");
    expect(api).not.toMatch(/lead_id:\s*z\./);
    expect(api).toContain("check_and_record_rate_limit");
    expect(api).toContain("recordLeadDelivery");
  });
});
