export type PortfolioQuizMode = "booking" | "proposal";
export type PortfolioProposalKind = "campaign" | "service";

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
): PortfolioQuizSemanticCopy {
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

export function buildPortfolioQuizPreviewMessage({
  studioName,
  answers,
  recipientName,
  mode = "booking",
  proposalKind = "service",
  pageUrl = "",
  location = "",
}: {
  studioName: string;
  answers: PortfolioQuizAnswers;
  recipientName: string;
  mode?: PortfolioQuizMode;
  proposalKind?: PortfolioProposalKind;
  pageUrl?: string;
  location?: string;
}): string {
  const copy = getPortfolioQuizSemanticCopy(mode, proposalKind, recipientName);
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
