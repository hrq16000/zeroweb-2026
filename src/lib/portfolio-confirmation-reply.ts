/**
 * Resposta padrão para cada confirmação recebida pelo funil de um cliente.
 *
 * O texto é montado a partir dos fatos publicados na própria landing do
 * convite — nenhuma informação nova é inventada aqui. O painel apenas gera o
 * texto pronto; o envio continua sendo feito manualmente pelo responsável,
 * pela conversa já aberta no WhatsApp.
 */

export type ConfirmationReplyTemplate = {
  clientKey: string;
  /** Nome mostrado no painel. */
  label: string;
  /** Fatos exibidos junto do botão, para conferência antes de enviar. */
  facts: { label: string; value: string }[];
  build: (input: { name?: string | null }) => string;
};

const ADHONEP: ConfirmationReplyTemplate = {
  clientKey: "adhonep-curitiba",
  label: "ADHONEP Curitiba · reunião semanal",
  facts: [
    { label: "Capítulo", value: "Curitiba – Nikkey (0714)" },
    { label: "Data", value: "Quarta-feira, 16 de setembro de 2026" },
    { label: "Horário", value: "20:00" },
    { label: "Local", value: "Av. Cândido Hartmann, 570 · 32º andar · sala 324" },
    { label: "Palestrante", value: "Hélio Sato · tema “Vencendo o Medo”" },
    { label: "Participação", value: "Sem custo financeiro" },
  ],
  build: ({ name }) => {
    const greeting = name?.trim() ? `Olá, ${name.trim()}!` : "Olá! Tudo bem?";
    return [
      `${greeting} Recebemos a sua confirmação de presença na reunião semanal do Capítulo Curitiba – Nikkey (0714). Ficamos felizes em receber você.`,
      "",
      "*Quando*",
      "Quarta-feira, 16 de setembro de 2026, às 20:00.",
      "",
      "*Onde*",
      "Av. Cândido Hartmann, 570 — 32º andar, sala 324, Curitiba.",
      "",
      "*Como é o encontro*",
      "20:00 — Abertura da reunião, com acolhida de quem participa pela primeira vez.",
      "Palestra — “Vencendo o Medo”, com Hélio Sato.",
      "Depois — Café e networking, com espaço para conversar diretamente com o palestrante.",
      "",
      "*Orientações*",
      "• A participação não tem custo financeiro.",
      "• Chegue alguns minutos antes para a recepção no andar.",
      "• Se precisar remarcar ou tiver qualquer dúvida, é só responder por aqui.",
      "",
      "Até lá!",
    ].join("\n");
  },
};

const TEMPLATES: ConfirmationReplyTemplate[] = [ADHONEP];

export function getConfirmationReplyTemplate(
  clientKey: string | null | undefined,
): ConfirmationReplyTemplate | null {
  if (!clientKey) return null;
  return TEMPLATES.find((t) => t.clientKey === clientKey) ?? null;
}
