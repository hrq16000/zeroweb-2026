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

  test("telefone e e-mail permanecem mascarados no servidor, inclusive na leitura", () => {
    expect(requests).toContain("function maskContactText");
    expect(requests).toContain("[e-mail oculto]");
    expect(requests).toMatch(/sent_note:\s*maskContactText/);
    expect(requests).toMatch(/response_note:\s*maskContactText/);
    expect(requests).toMatch(/sent_note:\s*maskContactText\(row\.sent_note\)/);
    expect(requests).toMatch(/response_note:\s*maskContactText\(row\.response_note\)/);
  });

  test("a tela de leads não escreve no destino canônico", () => {
    expect(leads).not.toContain("portfolio-whatsapp.json");
    expect(leads).not.toContain("confirmDestination");
  });
});
