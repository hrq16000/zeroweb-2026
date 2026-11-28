import { describe, expect, test } from "bun:test";
import {
  DG_LEAD_SOURCE, DG_STATUSES, describeHistory, filterDgLeads, normalizeDgPhone,
  normalizeDgStatus, toHistoryEntry, type DgLeadRow,
} from "@/lib/dona-garimpeira-leads";
import { measurementState } from "@/lib/lhci-receipt-tracking";

const lead = (over: Partial<DgLeadRow>): DgLeadRow => ({
  id: "1", created_at: "2026-11-27T10:00:00Z", name: "Ana", phone: "5541999990000", email: null,
  status: "novo", assignee: null, last_interaction: null, product: "Vestido", origin: "whatsapp", message: null, ...over,
});

describe("central de leads da Dona Garimpeira", () => {
  test("leads ficam isolados na origem do próprio brechó", () => {
    expect(DG_LEAD_SOURCE).toBe("portfolio:dona-garimpeira-brecho");
  });
  test("acompanha novos, em atendimento, respondidos e concluídos", () => {
    expect([...DG_STATUSES]).toEqual(["novo", "em_atendimento", "respondido", "fechado"]);
    expect(normalizeDgStatus("qualquer")).toBe("novo");
  });
  test("telefone vira dígitos com DDI e rejeita número inválido", () => {
    expect(normalizeDgPhone("(41) 99999-0000")).toBe("5541999990000");
    expect(normalizeDgPhone("5541999990000")).toBe("5541999990000");
    expect(normalizeDgPhone("123")).toBeNull();
  });
  test("cada tipo de interação é gravado e relido com o mesmo nome", () => {
    const entry = toHistoryEntry("resposta_enviada", "print da conversa");
    expect(entry.kind).toBe("action");
    expect(describeHistory({ kind: entry.kind, note: entry.note, from_value: null, to_value: null }))
      .toEqual({ title: "Resposta enviada", text: "print da conversa" });
    expect(describeHistory({ kind: "status_change", note: null, from_value: "novo", to_value: "fechado" }).text)
      .toBe("Novo → Concluído");
  });
  test("filtra por status, origem, produto e data", () => {
    const rows = [lead({}), lead({ id: "2", status: "respondido", origin: "instagram", product: "Bolsa", created_at: "2026-11-20T10:00:00Z" })];
    expect(filterDgLeads(rows, { status: "respondido" }).map((r) => r.id)).toEqual(["2"]);
    expect(filterDgLeads(rows, { origin: "whatsapp" }).map((r) => r.id)).toEqual(["1"]);
    expect(filterDgLeads(rows, { product: "bol" }).map((r) => r.id)).toEqual(["2"]);
    expect(filterDgLeads(rows, { from: "2026-11-25" }).map((r) => r.id)).toEqual(["1"]);
  });
});

describe("status das medições Lighthouse", () => {
  const base = { performance: 0.95, seo: 1, accessibility: 1, best_practices: 1 };
  test("os cinco estados", () => {
    expect(measurementState({ ...base, status: "passed" })).toBe("aprovado");
    expect(measurementState({ ...base, status: "failed" })).toBe("reprovado");
    expect(measurementState({ ...base, status: "running" })).toBe("em_execucao");
    expect(measurementState({ ...base, status: "pending" })).toBe("pendente");
  });
  test("medição sem nenhuma nota é falha na coleta, nunca aprovada", () => {
    const empty = { performance: null, seo: null, accessibility: null, best_practices: null };
    expect(measurementState({ ...empty, status: "passed" })).toBe("falha_coleta");
    expect(measurementState({ ...empty, status: "failed" })).toBe("falha_coleta");
  });
});
