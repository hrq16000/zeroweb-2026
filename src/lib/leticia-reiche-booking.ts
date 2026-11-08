/** Fluxo piloto independente de contato. Nenhum horário é confirmado por este arquivo. */
export const LETICIA_REICHE_CLIENT_KEY = "leticia-reiche" as const;
export const LETICIA_REICHE_FUNNEL_SLUG = "funnel-leticia-reiche" as const;
export const LETICIA_REICHE_FUNNEL_MODE = "booking" as const;
export const LETICIA_REICHE_BOOKING_CONFIG = {
  services: ["Manicure", "Pedicure"],
  experienceOptions: [
    "É minha primeira visita",
    "Já sou cliente",
    "Quero tirar dúvidas sobre o atendimento",
    "Ainda estou escolhendo",
  ],
  periodOptions: ["Manhã", "Tarde", "Fim da tarde", "Tenho flexibilidade"],
  timingOptions: [
    "Nos próximos dias",
    "Na próxima semana",
    "No próximo mês",
    "Tenho uma data específica para informar",
  ],
  proposalKind: "service" as const,
  stepTitles: {
    service: "Qual cuidado você deseja?",
    experience: "Como você chega para esse atendimento?",
    period: "Qual período costuma ser melhor?",
    timing: "Para quando você gostaria?",
    note: "Quer indicar uma data ou referência?",
  },
  stepSubtitles: {
    timing: "Esta é uma preferência, não uma reserva. A disponibilidade será confirmada depois.",
    note: "Informe a data exata e detalhes do procedimento, se desejar.",
  },
  notePlaceholder: "Ex.: gostaria de manicure em 12 de novembro pela manhã. Podemos conversar sobre opções e valores?",
};

/** Exige PREVIEW + opt-in server-side. Nunca torna o formulário ativo em produção por engano. */
export function isLeticiaReichePilotAllowed(vercelEnv: string | undefined, pilotFlag: string | undefined): boolean {
  return vercelEnv === "preview" && pilotFlag === "enabled";
}

/** Um formulário da Letícia não pode cair no funil-service compartilhado nem em outro cliente. */
export function leticiaReicheFormSlugs(): readonly string[] {
  return [LETICIA_REICHE_FUNNEL_SLUG];
}
