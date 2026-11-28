/**
 * Central de leads da Dona Garimpeira — regras puras (sem banco, sem rede).
 * Os contatos ficam em `lead_submissions` marcados com a origem do próprio
 * brechó; nunca são misturados com outro cliente nem com a 0WEB.
 */
export const DG_LEAD_SOURCE = "portfolio:dona-garimpeira-brecho" as const;
export const DG_CLIENT_KEY = "dona-garimpeira-brecho" as const;

export const DG_STATUSES = ["novo", "em_atendimento", "respondido", "fechado"] as const;
export type DgStatus = (typeof DG_STATUSES)[number];
export const DG_STATUS_LABEL: Record<DgStatus, string> = {
  novo: "Novo",
  em_atendimento: "Em atendimento",
  respondido: "Respondido",
  fechado: "Concluído",
};
export function normalizeDgStatus(value: unknown): DgStatus {
  if (value === "new") return "novo";
  return (DG_STATUSES as readonly unknown[]).includes(value) ? (value as DgStatus) : "novo";
}

export const DG_ORIGINS = ["whatsapp", "instagram", "loja", "formulario", "indicacao", "outro"] as const;
export type DgOrigin = (typeof DG_ORIGINS)[number];
export const DG_ORIGIN_LABEL: Record<DgOrigin, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  loja: "Loja física",
  formulario: "Formulário do site",
  indicacao: "Indicação",
  outro: "Outro",
};

export const DG_INTERACTIONS = [
  "contato_realizado",
  "mensagem_preparada",
  "resposta_enviada",
  "whatsapp_iniciado",
  "observacao",
] as const;
export type DgInteraction = (typeof DG_INTERACTIONS)[number];
export const DG_INTERACTION_LABEL: Record<DgInteraction, string> = {
  contato_realizado: "Contato realizado",
  mensagem_preparada: "Mensagem preparada",
  resposta_enviada: "Resposta enviada",
  whatsapp_iniciado: "Conversa iniciada pelo WhatsApp",
  observacao: "Observação administrativa",
};
/** Tipos aceitos pela gravação conjunta já existente no CRM. */
const HISTORY_KIND: Record<DgInteraction, "note" | "contact" | "action"> = {
  contato_realizado: "contact",
  mensagem_preparada: "action",
  resposta_enviada: "action",
  whatsapp_iniciado: "action",
  observacao: "note",
};

/** Registro gravado no histórico: o tipo fica legível também no CRM geral. */
export function toHistoryEntry(kind: DgInteraction, note: string) {
  const text = note.trim();
  const label = DG_INTERACTION_LABEL[kind];
  return { kind: HISTORY_KIND[kind], note: text ? `${label}: ${text}` : label };
}

export type DgHistoryRow = {
  kind: string;
  note: string | null;
  from_value: string | null;
  to_value: string | null;
};
/** Título e texto de um evento do histórico, sem inventar o que não foi gravado. */
export function describeHistory(row: DgHistoryRow): { title: string; text: string } {
  if (row.kind === "created") return { title: "Cadastro", text: "Lead cadastrado na central." };
  if (row.kind === "status_change") {
    const from = DG_STATUS_LABEL[normalizeDgStatus(row.from_value)];
    const to = DG_STATUS_LABEL[normalizeDgStatus(row.to_value)];
    return { title: "Alteração de status", text: `${from} → ${to}` };
  }
  if (row.kind === "assignment") {
    return { title: "Responsável", text: row.to_value ? `Atribuído a ${row.to_value}` : "Sem responsável" };
  }
  if (row.to_value === "duplicate_same_day") {
    return { title: "Tentativa repetida", text: "O mesmo telefone foi enviado de novo no mesmo dia." };
  }
  const note = row.note ?? "";
  for (const kind of DG_INTERACTIONS) {
    const label = DG_INTERACTION_LABEL[kind];
    if (note === label) return { title: label, text: "" };
    if (note.startsWith(`${label}: `)) return { title: label, text: note.slice(label.length + 2) };
  }
  return { title: row.kind === "contact" ? "Contato realizado" : "Observação administrativa", text: note };
}

/** Somente dígitos, com DDI 55; devolve null quando não parece um telefone brasileiro. */
export function normalizeDgPhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("55") && digits.length >= 12) digits = digits.slice(2);
  if (!/^[1-9][0-9]9?[0-9]{8}$/.test(digits)) return null;
  return `55${digits}`;
}

/** Rascunho inicial da resposta; a pessoa do atendimento sempre revisa antes. */
export function draftReply(lead: { name: string | null; product: string | null }): string {
  const first = (lead.name ?? "").trim().split(/\s+/)[0];
  const greeting = first ? `Olá, ${first}!` : "Olá!";
  const subject = lead.product?.trim() ? ` sobre ${lead.product.trim()}` : "";
  return `${greeting} Aqui é da Dona Garimpeira. Recebemos o seu contato${subject} e vamos te atender por aqui.`;
}

export type DgLeadFilters = {
  status?: DgStatus;
  origin?: DgOrigin;
  product?: string;
  from?: string;
  to?: string;
  search?: string;
};
export type DgLeadRow = {
  id: string;
  created_at: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  status: DgStatus;
  assignee: string | null;
  last_interaction: string | null;
  product: string | null;
  origin: DgOrigin;
  message: string | null;
};

/** Filtros aplicados depois da leitura: produto e origem vivem no detalhe do lead. */
export function filterDgLeads(rows: DgLeadRow[], filters: DgLeadFilters): DgLeadRow[] {
  const text = filters.search?.trim().toLowerCase();
  const product = filters.product?.trim().toLowerCase();
  return rows.filter((row) => {
    if (filters.status && row.status !== filters.status) return false;
    if (filters.origin && row.origin !== filters.origin) return false;
    if (product && !(row.product ?? "").toLowerCase().includes(product)) return false;
    if (filters.from && row.created_at.slice(0, 10) < filters.from) return false;
    if (filters.to && row.created_at.slice(0, 10) > filters.to) return false;
    if (text) {
      const haystack = [row.name, row.phone, row.email, row.product, row.message].join(" ").toLowerCase();
      if (!haystack.includes(text)) return false;
    }
    return true;
  });
}
