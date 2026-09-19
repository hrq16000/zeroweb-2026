export type LeadSource =
  | "contact_form_whatsapp"
  | "servicos_form_whatsapp"
  | "trafego_pago_local_form"
  | "site_express"
  | string;

export type Testimonial = { name: string; role: string; text: string };
export type Stat = { n: string; l: string };
export type FAQ = { q: string; a: string };
export type CTACard = {
  icon: "layers" | "help" | "file" | "sparkles" | "message" | "package";
  title: string;
  desc: string;
  to: "/solicitar-orcamento" | "/servicos" | "/planos" | "/faq" | "/cases" | "/app" | "/contato";
  label: string;
  id: string;
  event: string;
};

export type ThankYouContent = {
  title: string;
  subtitle: string;
  whatsappMessage: string;
  planosLabel: string;
  finalCtaTo: "/solicitar-orcamento" | "/servicos/trafego-pago-local" | "/planos" | "/servicos/site-express";
  finalCtaLabel: string;
  channel: "contato" | "servicos" | "trafego_pago_local" | "site_express" | "outro";
  stats: Stat[];
  testimonials: Testimonial[];
  socialProofHeadline: string;
  /** Optional service-specific status timeline. */
  status?: { label: string; eta: string; desc: string }[];
  /** Optional SLA badge (e.g. "Após aprovação"). */
  slaBadge?: string;
  /** Optional FAQ adapted to the checkout method. */
  faq?: FAQ[];
  /** Optional source-specific CTA cards (overrides defaults). */
  ctaCards?: CTACard[];
};


// Prova social só entra quando houver fonte auditável e consentimento documentados.
const DEFAULT_STATS: Stat[] = [];
const DEFAULT_TESTIMONIALS: Testimonial[] = [];

const DEFAULT: ThankYouContent = {
  title: "Recebemos seu contato!",
  subtitle: "Nossa equipe dará continuidade ao atendimento. Enquanto isso, dê uma olhada nas opções abaixo.",
  whatsappMessage: "Acabei de enviar um formulário pelo site da 0WEB. Pode confirmar o recebimento?",
  planosLabel: "Pacotes a partir de R$499/mês",
  finalCtaTo: "/solicitar-orcamento",
  finalCtaLabel: "Solicitar diagnóstico",
  channel: "outro",
  stats: DEFAULT_STATS,
  testimonials: DEFAULT_TESTIMONIALS,
  socialProofHeadline: "Próximos passos",
};

const MAP: Record<string, ThankYouContent> = {
  contact_form_whatsapp: {
    ...DEFAULT,
    channel: "contato",
    title: "Mensagem enviada! 🚀",
    subtitle: "Nosso time comercial vai te chamar no atendimento em horário comercial com uma proposta sob medida.",
    whatsappMessage: "Olá! Enviei um formulário no site e quero falar com um especialista da 0WEB.",
    finalCtaTo: "/solicitar-orcamento",
    finalCtaLabel: "Solicitar diagnóstico",
    socialProofHeadline: "Empresas que escolheram a 0WEB como parceira",
  },
  servicos_form_whatsapp: {
    ...DEFAULT,
    channel: "servicos",
    title: "Sua proposta de serviços está a caminho",
    subtitle: "Vamos montar um pacote ideal de site + SEO + tráfego para o seu negócio. Atendimento em horário comercial.",
    whatsappMessage: "Olá! Enviei um formulário na página de serviços. Quero uma proposta personalizada da 0WEB.",
    planosLabel: "Compare planos e pacotes",
    finalCtaTo: "/planos",
    finalCtaLabel: "Ver planos completos",
    socialProofHeadline: "Pacotes completos que entregam resultado",
  },
  trafego_pago_local_form: {
    ...DEFAULT,
    channel: "trafego_pago_local",
    title: "Pronto para vender mais com tráfego pago!",
    subtitle: "Vamos configurar suas campanhas no Google e Meta Ads. Em horário comercial entramos em contato no atendimento.",
    whatsappMessage: "Olá! Quero começar com o tráfego pago local da 0WEB a partir de R$499/mês.",
    planosLabel: "Tráfego pago a partir de R$499/mês",
    finalCtaTo: "/servicos/trafego-pago-local",
    finalCtaLabel: "Ver detalhes do pacote",
    socialProofHeadline: "Negócios locais vendendo mais com tráfego pago",
  },
  site_express: {
    ...DEFAULT,
    channel: "site_express",
    title: "Pedido recebido! Seu Site Express entrou na fila 🚀",
    subtitle: "Já recebemos seu briefing do Site Express. Vamos te chamar no atendimento assim que possível para confirmar e iniciar a produção.",
    whatsappMessage: "Olá! Acabei de pedir meu Site Express pelo site da 0WEB. Pode confirmar o recebimento?",
    planosLabel: "Site Express · R$ 499 · pagamento único",
    finalCtaTo: "/servicos/site-express",
    finalCtaLabel: "Ver detalhes do Site Express",
    socialProofHeadline: "Negócios que saíram do zero ao site profissional",
    slaBadge: "Próximo contato em horário comercial · produção iniciada após briefing",
    status: [
      { label: "1. Confirmação", eta: "Em horário comercial", desc: "Te chamamos no atendimento para confirmar briefing, escopo e pagamento." },
      { label: "2. Produção", eta: "Conforme escopo confirmado", desc: "Nosso time inicia a produção após confirmar briefing, escopo e condições comerciais." },
      { label: "3. No ar", eta: "Após aprovação", desc: "Aprovou? Publicamos com domínio, SSL e WhatsApp integrado após sua aprovação final." },
    ],
  },
  "checkout-assisted": {
    ...DEFAULT,
    channel: "contato",
    title: "Pedido registrado!",
    subtitle: "Seu pedido foi salvo. Nossa equipe vai dar continuidade ao atendimento em horário comercial para confirmar o escopo e enviar a proposta.",
    whatsappMessage: "Olá! Finalizei meu pedido no site da 0WEB. Quero confirmar o escopo e receber a proposta.",
    planosLabel: "Conheça nossos planos",
    finalCtaTo: "/planos",
    finalCtaLabel: "Ver planos",
    slaBadge: "Atendimento em horário comercial",
    status: [
      { label: "1. Pedido registrado", eta: "Agora", desc: "Seu pedido foi salvo em nosso sistema e nosso time já foi notificado." },
      { label: "2. Contato da equipe", eta: "Em horário comercial", desc: "Te chamamos no atendimento para confirmar o escopo e enviar a proposta final." },
      { label: "3. Aprovação e início", eta: "Após aprovação", desc: "Assim que você aprovar, iniciamos o projeto conforme o prazo combinado." },
    ],
    stats: DEFAULT_STATS,
    testimonials: DEFAULT_TESTIMONIALS,
    faq: [
      { q: "Em quanto tempo recebo a proposta no atendimento?", a: "Nosso time comercial responde em horário comercial (seg–sex, 9h–18h). Fora desse horário, retornamos no próximo expediente." },
      { q: "Já paguei alguma coisa neste pedido?", a: "Não. Esse pedido está salvo como pendente. O pagamento (Pix, cartão ou boleto) é combinado com o consultor no atendimento antes de iniciar o projeto." },
      { q: "Posso ajustar o escopo antes de fechar?", a: "Sim. O atendimento serve exatamente para ajustar pacote, prazos e formas de pagamento ao seu cenário." },
      { q: "Como acompanho meu pedido depois?", a: "Sem login, guarde o protocolo exibido nesta página. Se você entrou com Google, o pedido também fica disponível no painel da sua conta." },
    ],
    ctaCards: [
      { icon: "layers", title: "Conhecer outros serviços", desc: "Veja outros produtos digitais disponíveis na loja 0WEB.", to: "/servicos", label: "Ver catálogo", id: "thankyou_catalog_card", event: "thank_you_cta_catalog" },
      { icon: "help", title: "Dúvidas frequentes", desc: "Consulte informações sobre contratação, prazos e entregáveis.", to: "/faq", label: "Ir para FAQ", id: "thankyou_faq_card", event: "thank_you_cta_faq" },
      { icon: "file", title: "Precisa de algo sob medida?", desc: "Use o diagnóstico para um escopo que não esteja pronto na loja.", to: "/solicitar-orcamento", label: "Solicitar diagnóstico", id: "thankyou_diagnostico_card", event: "thank_you_cta_diagnostico" },
    ],
  },
  "checkout-stripe": {
    ...DEFAULT,
    channel: "servicos",
    title: "Checkout concluído",
    subtitle: "Recebemos o retorno do checkout. O status do pedido será atualizado assim que a confirmação do pagamento for processada.",
    whatsappMessage: "Olá! Meu pagamento foi confirmado na 0WEB. Quero agendar o briefing de início do projeto.",
    planosLabel: "Conheça nossos planos",
    finalCtaTo: "/planos",
    finalCtaLabel: "Ver planos",
    slaBadge: "Briefing em horário comercial",
    status: [
      { label: "1. Validação do pagamento", eta: "Agora", desc: "Aguardamos ou confirmamos o evento do provedor de pagamento antes de marcar o pedido como pago." },
      { label: "2. Briefing de início", eta: "Em horário comercial", desc: "Entramos em contato para alinhar o escopo final e iniciar a produção." },
      { label: "3. Execução do projeto", eta: "Conforme prazo", desc: "Após o briefing, começamos a entrega conforme o pacote escolhido." },
    ],
    stats: DEFAULT_STATS,
    testimonials: DEFAULT_TESTIMONIALS,
    faq: [
      { q: "Meu pagamento já foi confirmado?", a: "A página de retorno indica que o checkout foi concluído. O status final do pedido depende da confirmação do provedor e aparece no acompanhamento da sua conta." },
      { q: "Quando começa o projeto?", a: "Em horário comercial entramos em contato para o briefing de início. A execução começa logo após o alinhamento do escopo." },
      { q: "Preciso enviar mais alguma coisa?", a: "Tenha em mãos logo, textos e referências do negócio. Quanto mais material no briefing, mais rápida a primeira entrega." },
      { q: "Quero a nota fiscal — como recebo?", a: "Emitimos NF-e no início da execução e enviamos pelo e-mail do cadastro. Caso precise de dados específicos, informe no atendimento." },
    ],
    ctaCards: [
      { icon: "package", title: "Ver meu pedido", desc: "Resumo, status do pagamento e próximos marcos.", to: "/app", label: "Abrir painel", id: "thankyou_order_card", event: "thank_you_cta_order" },
      { icon: "sparkles", title: "Agendar briefing", desc: "Acelere o início enviando suas referências agora.", to: "/contato", label: "Enviar briefing", id: "thankyou_briefing_card", event: "thank_you_cta_briefing" },
      { icon: "layers", title: "Conheça outros serviços", desc: "Combine pacotes para potencializar resultados.", to: "/servicos", label: "Ver catálogo", id: "thankyou_catalog_card", event: "thank_you_cta_catalog" },
    ],
  },
};


export function getThankYouContent(source?: string | null): ThankYouContent {
  if (!source) return DEFAULT;
  const normalized = source === "checkout-whatsapp" ? "checkout-assisted" : source;
  return MAP[normalized] ?? DEFAULT;
}
