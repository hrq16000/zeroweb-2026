import {
  resolvePortfolioFunnelContext,
  type PortfolioFunnelContext,
  type PortfolioFunnelIntent,
} from "@/lib/portfolio-funnel-context";

export type PortfolioQuizMode = "booking" | "proposal";

export type PortfolioProposalKind = "campaign" | "service";
export type PortfolioQuizLocale = "pt-BR" | "es-CL";

export type PortfolioQuizAnswers = {
  service: string;
  experience: string;
  period: string;
  timing: string;
  note: string;
};

type QuizStep = "service" | "experience" | "period" | "timing" | "note";

export type PortfolioQuizSemanticCopy = {
  requestKind: "booking" | "campaign" | "service";
  eyebrow: string;
  messageTitle: string;
  subject: string;
  intro: string;
  sectionTitle: string;
  labels: Record<Exclude<QuizStep, "note">, string>;
  fallbacks: Record<Exclude<QuizStep, "note">, string>;
  titles: Record<QuizStep, string>;
  subtitles: Record<QuizStep, string>;
  notePlaceholder: string;
  nextStep: string;
};

export function getPortfolioQuizSemanticCopy(
  mode: PortfolioQuizMode = "booking",
  proposalKind: PortfolioProposalKind = "service",
  recipientName = "a equipe",
  locale: PortfolioQuizLocale = "pt-BR",
): PortfolioQuizSemanticCopy {
  if (locale === "es-CL") {
    if (mode === "proposal" && proposalKind === "campaign") return { requestKind: "campaign", eyebrow: "Consulta de campaña", messageTitle: "*CONSULTA DE CAMPAÑA*", subject: "una campaña", intro: "Te comparto los detalles para orientar la propuesta:", sectionTitle: "*DETALLES DE LA CAMPAÑA*", labels: { service: "Tipo de acción", experience: "Objetivo", period: "Período", timing: "Plazo" }, fallbacks: { service: "Quiero orientación", experience: "Quiero conversar sobre el objetivo", period: "Aún por definir", timing: "Estoy planificando" }, titles: { service: "¿Qué acción quieres planificar?", experience: "¿Cuál es el objetivo principal?", period: "¿Cuándo debería realizarse?", timing: "¿Cuál es el plazo?", note: "¿Quieres agregar algún detalle?" }, subtitles: { service: "Así podremos entender el formato que buscas.", experience: "Esto ayuda a orientar la propuesta.", period: "La fecha se confirma al conversar.", timing: "Una referencia ayuda a organizar el trabajo.", note: "Puedes compartir región, cantidad o una necesidad especial." }, notePlaceholder: "Cuéntanos algún detalle adicional.", nextStep: "¿Podrías orientarme sobre disponibilidad y próximos pasos?" };
    if (mode === "proposal") return { requestKind: "service", eyebrow: "Consulta de servicio", messageTitle: "*CONSULTA DE SERVICIO*", subject: "un servicio", intro: "Te comparto mis preferencias para facilitar la orientación:", sectionTitle: "*DETALLES DE LA CONSULTA*", labels: { service: "Servicio", experience: "Contexto", period: "Preferencia", timing: "Plazo" }, fallbacks: { service: "Quiero orientación para elegir", experience: "Quiero conversar antes de decidir", period: "Tengo flexibilidad", timing: "Quiero coordinar" }, titles: { service: "¿Qué servicio te interesa?", experience: "¿Cuál es tu contexto?", period: "¿Qué horario prefieres?", timing: "¿Cuándo te gustaría coordinar?", note: "¿Quieres agregar algún detalle?" }, subtitles: { service: "Cuéntanos qué estás buscando.", experience: "Esto ayuda a orientar la conversación.", period: "La disponibilidad se confirma directamente.", timing: "Es una preferencia, no una reserva confirmada.", note: "Puedes dejar una pregunta para Roze." }, notePlaceholder: "Comparte una pregunta o preferencia.", nextStep: "¿Podrías contarme las opciones y disponibilidad?" };
    return { requestKind: "booking", eyebrow: "Consulta de masoterapia", messageTitle: "*CONSULTA DE MASOTERAPIA*", subject: "una sesión de masoterapia", intro: "Te comparto mis preferencias para orientar la consulta:", sectionTitle: "*PREFERENCIAS DE ATENCIÓN*", labels: { service: "Lo que busco", experience: "Experiencia previa", period: "Horario preferido", timing: "Cuándo" }, fallbacks: { service: "Quiero orientación para elegir", experience: "Prefiero conversar antes de decidir", period: "Tengo flexibilidad", timing: "Quiero coordinar" }, titles: { service: "¿Qué te gustaría consultar?", experience: "¿Ya has recibido masajes antes?", period: "¿Qué horario prefieres?", timing: "¿Cuándo te gustaría coordinar?", note: "¿Quieres agregar algún detalle?" }, subtitles: { service: "Cuéntanos qué atención estás buscando.", experience: "Esto ayuda a orientar mejor la conversación.", period: "La disponibilidad se confirma directamente.", timing: "Es una preferencia, no una reserva confirmada.", note: "Comparte cualquier pregunta o preferencia para Roze." }, notePlaceholder: "Qué buscas, alguna preferencia o una pregunta para Roze.", nextStep: "¿Podrías contarme qué tipos de masaje ofreces y qué horarios tienes disponibles?" };
  }
  if (mode === "proposal" && proposalKind === "campaign") {
    return {
      requestKind: "campaign",
      eyebrow: "Proposta inteligente",
      messageTitle: "*PEDIDO DE PROPOSTA*",
      subject: "uma campanha",
      intro: "Deixei o briefing abaixo para facilitar a proposta:",
      sectionTitle: "*BRIEFING DA CAMPANHA*",
      labels: { service: "Formato da ação", experience: "Objetivo/momento", period: "Janela da ação", timing: "Prazo da campanha" },
      fallbacks: { service: "Quero orientação para escolher", experience: "Quero conversar sobre o objetivo", period: "Ainda preciso de orientação", timing: "Estou planejando com antecedência" },
      titles: { service: "Qual ação você quer planejar?", experience: "Qual é o objetivo principal da ação?", period: "Quando a ação deve acontecer?", timing: "Qual é o prazo da campanha?", note: "Quer acrescentar algum detalhe?" },
      subtitles: {
        service: `Assim ${recipientName} já entende o formato ideal para sua campanha.`,
        experience: "Essa resposta ajuda a montar uma equipe alinhada ao que você precisa divulgar.",
        period: `Assim ${recipientName} consegue pensar em escala e pontos de maior movimento.`,
        timing: "Uma previsão de prazo deixa a proposta muito mais precisa.",
        note: "É opcional. Conte sobre região, quantidade, material ou alguma necessidade especial.",
      },
      notePlaceholder: "Ex.: ação em dois bairros, com entrega de brindes e previsão para o próximo mês.",
      nextStep: "Pode me orientar sobre equipe, locais, quantidade de promotores e investimento estimado, por favor?",
    };
  }

  if (mode === "proposal") {
    return {
      requestKind: "service",
      eyebrow: "Solicitação inteligente",
      messageTitle: "*PEDIDO DE ORÇAMENTO*",
      subject: "um serviço",
      intro: "Deixei os detalhes abaixo para facilitar a avaliação e o orçamento:",
      sectionTitle: "*DETALHES DO SERVIÇO*",
      labels: { service: "Serviço", experience: "Contexto/necessidade", period: "Local ou preferência", timing: "Prazo do serviço" },
      fallbacks: { service: "Quero orientação para escolher", experience: "Quero explicar minha necessidade", period: "Ainda vou confirmar", timing: "Quero combinar a melhor data" },
      titles: { service: "Qual serviço você precisa?", experience: "Qual é o contexto do atendimento?", period: "Onde ou como prefere o atendimento?", timing: "Quando você precisa do serviço?", note: "Quer acrescentar algum detalhe?" },
      subtitles: {
        service: `Assim ${recipientName} entende rapidamente o que você procura.`,
        experience: "Essa resposta ajuda a preparar uma orientação adequada à sua necessidade.",
        period: "A localização ou preferência ajuda a confirmar a disponibilidade do atendimento.",
        timing: "Uma previsão ajuda a organizar agenda, avaliação e orçamento.",
        note: "É opcional. Inclua medidas, quantidade, endereço ou qualquer necessidade especial.",
      },
      notePlaceholder: "Ex.: quantidade, medidas, endereço, fotos disponíveis e melhor horário para contato.",
      nextStep: "Pode me orientar sobre disponibilidade, avaliação e investimento estimado, por favor?",
    };
  }

  return {
    requestKind: "booking",
    eyebrow: "Agendamento inteligente",
    messageTitle: "*PEDIDO DE AGENDAMENTO*",
    subject: "um atendimento",
    intro: "Deixei as preferências abaixo para facilitar o agendamento:",
    sectionTitle: "*PREFERÊNCIAS DO ATENDIMENTO*",
    labels: { service: "Procedimento", experience: "Momento", period: "Melhor período", timing: "Quando gostaria" },
    fallbacks: { service: "Quero orientação para escolher", experience: "Quero conversar antes de decidir", period: "Tenho flexibilidade", timing: "Quero a primeira vaga disponível" },
    titles: { service: "Qual atendimento você quer agendar?", experience: "Você já conhece esse procedimento?", period: "Qual período costuma ser melhor para você?", timing: "Quando você gostaria de vir?", note: "Quer acrescentar algum detalhe?" },
    subtitles: {
      service: "Assim já preparamos a melhor orientação para você.",
      experience: "Isso ajuda a profissional a entender o seu momento.",
      period: "Vamos tentar encontrar a vaga mais confortável.",
      timing: "Escolha a opção mais próxima da sua necessidade.",
      note: "É opcional. Você pode contar se tem preferência de estilo, horário ou alguma dúvida.",
    },
    notePlaceholder: "Ex.: gosto de um efeito mais natural e consigo depois das 18h.",
    nextStep: "Pode me enviar as próximas vagas disponíveis e confirmar o tempo estimado do atendimento, por favor?",
  };
}

const INTENT_MESSAGE_TITLE: Record<PortfolioFunnelIntent, string> = {
  orcamento: "*PEDIDO DE ORÇAMENTO*",
  agendamento: "*PEDIDO DE AGENDAMENTO*",
  pedido: "*PEDIDO*",
  avaliacao: "*PEDIDO DE AVALIAÇÃO*",
  visita: "*PEDIDO DE VISITA*",
  contato: "*CONTATO PELA PÁGINA*",
  reserva: "*PEDIDO DE RESERVA*",
  diagnostico: "*PEDIDO DE DIAGNÓSTICO*",
  solicitacao: "*SOLICITAÇÃO*",
};

/**
 * Ajusta a copy do funil à intenção comercial do projeto — mesma estrutura,
 * mensagem própria. Sem contexto, a copy padrão do modo é preservada.
 */
export function applyPortfolioFunnelIntentCopy(
  copy: PortfolioQuizSemanticCopy,
  context?: Pick<PortfolioFunnelContext, "intent" | "whatsappPrompt" | "whatsappSubject">,
  locale: PortfolioQuizLocale = "pt-BR",
): PortfolioQuizSemanticCopy {
  if (!context) return copy;
  return {
    ...copy,
    messageTitle: locale === "es-CL" ? ({ orcamento: "*CONSULTA DE PRESUPUESTO*", agendamento: "*CONSULTA DE MASOTERAPIA*", pedido: "*SOLICITUD*", avaliacao: "*SOLICITUD DE EVALUACIÓN*", visita: "*SOLICITUD DE VISITA*", contato: "*CONTACTO DESDE LA PÁGINA*", reserva: "*SOLICITUD DE RESERVA*", diagnostico: "*SOLICITUD DE DIAGNÓSTICO*", solicitacao: "*SOLICITUD*" } as Record<PortfolioFunnelIntent, string>)[context.intent] : INTENT_MESSAGE_TITLE[context.intent],
    subject: context.whatsappSubject,
    nextStep: context.whatsappPrompt,
  };
}

/** Copy do funil já resolvida pelo contrato do projeto (slug ou clientKey). */
export function getPortfolioQuizCopyForClient(
  slugOrKey: string,
  recipientName: string,
  mode?: PortfolioQuizMode,
  proposalKind?: PortfolioProposalKind,
  locale?: PortfolioQuizLocale,
): PortfolioQuizSemanticCopy {
  const context = resolvePortfolioFunnelContext(slugOrKey);
  const base = getPortfolioQuizSemanticCopy(mode ?? context.quizMode, proposalKind ?? context.proposalKind, recipientName, locale);
  return applyPortfolioFunnelIntentCopy(base, context, locale);
}

export type PortfolioQuizMessageInput = {
  studioName: string;
  answers: PortfolioQuizAnswers;
  recipientName: string;
  mode?: PortfolioQuizMode;
  proposalKind?: PortfolioProposalKind;
  pageUrl?: string;
  location?: string;
  funnelContext?: Pick<PortfolioFunnelContext, "intent" | "whatsappPrompt" | "whatsappSubject">;
  locale?: PortfolioQuizLocale;
};

/**
 * Gerador canônico da mensagem do quiz de portfolio.
 *
 * A prévia e o redirect final usam esta mesma função. O redirect pode apenas
 * codificar o resultado; não pode reconstruir uma segunda mensagem.
 */
export function buildPortfolioQuizMessage({
  studioName,
  answers,
  recipientName,
  mode = "booking",
  proposalKind = "service",
  pageUrl = "",
  location = "",
  funnelContext,
  locale = "pt-BR",
}: PortfolioQuizMessageInput): string {
  const copy = applyPortfolioFunnelIntentCopy(
    getPortfolioQuizSemanticCopy(mode, proposalKind, recipientName),
    funnelContext,
    locale,
  );

  if (locale === "es-CL") {
    const lines = [copy.messageTitle, "", `Hola, ${recipientName}. ¿Cómo estás?`, "", `Te escribo desde la página de *${studioName}* para consultar por ${copy.subject}.`, ...(pageUrl ? [`🔗 Enlace: ${pageUrl}`] : []), ...(location ? [`📍 Mi ubicación: ${location}.`] : []), copy.intro, "", copy.sectionTitle, `• *${copy.labels.service}:* ${answers.service || copy.fallbacks.service}`, `• *${copy.labels.experience}:* ${answers.experience || copy.fallbacks.experience}`, `• *${copy.labels.period}:* ${answers.period || copy.fallbacks.period}`, `• *${copy.labels.timing}:* ${answers.timing || copy.fallbacks.timing}`];
    if (answers.note.trim()) lines.push("", "*COMENTARIO*", answers.note.trim());
    lines.push("", "*SIGUIENTE PASO*", copy.nextStep, "", "Quedo atento/a a tu respuesta.");
    return lines.join("\n");
  }

  const lines = [
    copy.messageTitle,
    "",
    `Olá, ${recipientName}! Tudo bem?`,
    "",
    `Vim pela página da *${studioName}* e quero conversar sobre ${copy.subject}.`,
    ...(pageUrl ? [`🔗 URL completa: ${pageUrl}`] : []),
    "✨ A página é linda, parabéns! Encontrei exatamente o que procurava.",
    ...(location ? [`📍 Sou de ${location}.`] : []),
    copy.intro,
    "",
    copy.sectionTitle,
    `• *${copy.labels.service}:* ${answers.service || copy.fallbacks.service}`,
    `• *${copy.labels.experience}:* ${answers.experience || copy.fallbacks.experience}`,
    `• *${copy.labels.period}:* ${answers.period || copy.fallbacks.period}`,
    `• *${copy.labels.timing}:* ${answers.timing || copy.fallbacks.timing}`,
  ];

  if (answers.note.trim()) lines.push("", "*OBSERVAÇÃO*", answers.note.trim());
  lines.push("", "*PRÓXIMO PASSO*", copy.nextStep, "", "Aguardo seu retorno.");
  return lines.join("\n");
}

/** A UI aponta para a mesma referência usada na entrega server-side. */
export const buildPortfolioQuizPreviewMessage = buildPortfolioQuizMessage;
