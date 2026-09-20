import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const leads = readFileSync("src/routes/_authenticated/app.leads.marcas.tsx", "utf8");
const requests = readFileSync("src/lib/portfolio-destination-requests.functions.ts", "utf8");

describe("operação de destino no painel de leads", () => {
  test("Contatos por marca carrega e exibe o histórico de solicitações", () => {
    expect(leads).toContain("listDestinationRequests");
    expect(leads).toContain("Histórico de solicitações do destino");
    expect(leads).toContain("request.response_note ?? request.sent_note");
  });

  test("notas de solicitação permanecem mascaradas no servidor", () => {
    expect(requests).toContain("function maskDigits");
    expect(requests).toMatch(/sent_note:\s*maskDigits/);
    expect(requests).toMatch(/response_note:\s*maskDigits/);
  });

  test("a tela de leads não escreve no destino canônico", () => {
    expect(leads).not.toContain("portfolio-whatsapp.json");
    expect(leads).not.toContain("confirmDestination");
  });
});
