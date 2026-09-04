/**
 * Coerência semântica do funil de cada projeto `/portfolio/:slug`.
 *
 * Padroniza a ESTRUTURA (bloco "próximo passo" → CTA → funil → WhatsApp) e
 * personaliza a MENSAGEM e a AÇÃO por negócio. A intenção comercial (intent)
 * existe apenas para orientar a copy — nunca é exibida ao visitante.
 *
 * Precedência: contrato do projeto (`portfolio-funnel-context.json`)
 *   > fallback neutro por segmento do catálogo
 *   > fallback neutro global ("Fale com a empresa").
 *
 * Nada aqui inventa preço, prazo ou promessa comercial, e nada aqui mistura o
 * funil do CLIENTE com o pop-up comercial da 0WEB.
 */
import funnelContext from "@/config/portfolio-funnel-context.json";
import catalog from "@/config/portfolio-catalog.json";

export type PortfolioFunnelIntent =
  | "orcamento"
  | "agendamento"
  | "pedido"
  | "avaliacao"
  | "visita"
  | "contato"
  | "reserva"
  | "diagnostico"
  | "solicitacao";

export type PortfolioFunnelContextSource =
  | "PROJECT_CONTRACT"
  | "SEGMENT_FALLBACK"
  | "NEUTRAL_FALLBACK";

export type PortfolioFunnelContext = {
  slug: string;
  intent: PortfolioFunnelIntent;
  nextStepTitle: string;
  nextStepBody: string;
  primaryCtaLabel: string;
  whatsappPrompt: string;
  /** Assunto usado na abertura da mensagem ("quero conversar sobre …"). */
  whatsappSubject: string;
  theme: "pink" | "gold" | "navy";
  quizMode: "booking" | "proposal";
  proposalKind: "campaign" | "service";
  source: PortfolioFunnelContextSource;
};

type ContractEntry = {
  intent: PortfolioFunnelIntent;
  nextStepTitle: string;
  nextStepBody: string;
  primaryCtaLabel: string;
  theme: "pink" | "gold" | "navy";
  whatsappPrompt?: string;
  whatsappSubject?: string;
  proposalKind?: "campaign" | "service";
};

const CONTRACTS = funnelContext as Record<string, ContractEntry>;

type CatalogItem = { slug: string; clientKey?: string; title: string; segment: string };
const ITEMS = catalog as CatalogItem[];

export const FUNNEL_INTENT_PROMPTS: Record<PortfolioFunnelIntent, string> = {
  orcamento: "Pode me enviar um orçamento e as próximas etapas desse serviço, por favor?",
  agendamento: "Pode me enviar os horários disponíveis e confirmar o tempo do atendimento, por favor?",
  pedido: "Pode confirmar a disponibilidade, os valores e o tempo de entrega desse pedido, por favor?",
  avaliacao: "Pode me orientar sobre como funciona a avaliação e os próximos passos, por favor?",
  visita: "Pode me orientar sobre como combinar a visita e o que preciso deixar preparado, por favor?",
  contato: "Pode me orientar sobre os próximos passos, por favor?",
  reserva: "Pode confirmar a disponibilidade para essa data e o que preciso adiantar, por favor?",
  diagnostico: "Pode me orientar sobre o diagnóstico, o prazo e como levar o equipamento, por favor?",
  solicitacao: "Pode me orientar sobre os próximos passos dessa solicitação, por favor?",
};

export const FUNNEL_INTENT_SUBJECTS: Record<PortfolioFunnelIntent, string> = {
  orcamento: "um orçamento",
  agendamento: "um atendimento",
  pedido: "um pedido",
  avaliacao: "uma avaliação",
  visita: "uma visita",
  contato: "um atendimento",
  reserva: "uma reserva",
  diagnostico: "um diagnóstico técnico",
  solicitacao: "uma solicitação",
};

/** Termos que NÃO podem aparecer no funil de determinada intenção. */
export const FUNNEL_INTENT_FORBIDDEN_TERMS: Record<PortfolioFunnelIntent, string[]> = {
  pedido: ["visita técnica", "vistoria", "diagnóstico técnico", "orçamento de obra", "manutenção elétrica", "reforma"],
  agendamento: ["cardápio", "orçamento de obra", "vistoria", "frete", "diagnóstico técnico"],
  orcamento: ["cardápio", "reserva de mesa", "agendamento estético", "encomenda de bolo"],
  diagnostico: ["cardápio", "reserva de mesa", "encomenda", "orçamento de obra"],
  reserva: ["orçamento de obra", "diagnóstico técnico", "manutenção elétrica", "vistoria"],
  avaliacao: ["cardápio", "reserva de mesa"],
  visita: ["cardápio", "reserva de mesa"],
  contato: [],
  solicitacao: ["cardápio", "reserva de mesa"],
};

const SEGMENT_INTENT: Record<string, PortfolioFunnelIntent> = {
  restaurantes: "pedido",
  comercios: "pedido",
  beleza: "agendamento",
  saude: "agendamento",
  juridico: "contato",
  construcao: "orcamento",
  servicos: "orcamento",
  "prestadores-de-servicos": "orcamento",
  agencias: "contato",
};

function bookingIntent(intent: PortfolioFunnelIntent): boolean {
  return intent === "agendamento" || intent === "reserva";
}

function resolveSlug(slugOrKey: string): string {
  if (CONTRACTS[slugOrKey]) return slugOrKey;
  const item = ITEMS.find((i) => i.slug === slugOrKey || i.clientKey === slugOrKey);
  return item?.slug ?? slugOrKey;
}

/**
 * Contrato de funil efetivo do projeto. Sem contrato específico usamos um
 * fallback NEUTRO — nunca o texto de outro projeto.
 */
export function resolvePortfolioFunnelContext(slugOrKey: string): PortfolioFunnelContext {
  const slug = resolveSlug(slugOrKey);
  const item = ITEMS.find((i) => i.slug === slug);
  const contract = CONTRACTS[slug];

  if (contract) {
    return {
      slug,
      intent: contract.intent,
      nextStepTitle: contract.nextStepTitle,
      nextStepBody: contract.nextStepBody,
      primaryCtaLabel: contract.primaryCtaLabel,
      whatsappPrompt: contract.whatsappPrompt ?? FUNNEL_INTENT_PROMPTS[contract.intent],
      whatsappSubject: contract.whatsappSubject ?? FUNNEL_INTENT_SUBJECTS[contract.intent],
      theme: contract.theme,
      quizMode: bookingIntent(contract.intent) ? "booking" : "proposal",
      proposalKind: contract.proposalKind ?? "service",
      source: "PROJECT_CONTRACT",
    };
  }

  const intent = (item && SEGMENT_INTENT[item.segment]) ?? "contato";
  const name = item?.title ?? "a empresa";
  return {
    slug,
    intent,
    nextStepTitle: `Fale com ${name} sobre o que você precisa.`,
    nextStepBody: `Conte sua necessidade e os detalhes importantes para ${name}.`,
    primaryCtaLabel: "Fale com a empresa",
    whatsappPrompt: FUNNEL_INTENT_PROMPTS[intent],
    whatsappSubject: FUNNEL_INTENT_SUBJECTS[intent],
    theme: "navy",
    quizMode: bookingIntent(intent) ? "booking" : "proposal",
    proposalKind: "service",
    source: item ? "SEGMENT_FALLBACK" : "NEUTRAL_FALLBACK",
  };
}

export function resolvePortfolioFunnelIntent(slugOrKey: string): PortfolioFunnelIntent {
  return resolvePortfolioFunnelContext(slugOrKey).intent;
}

export type FunnelContextIssue = { code: string; detail: string };

/**
 * Auditoria semântica: detecta termos de outro segmento e textos herdados.
 * Reutilizada pelo script de auditoria e pelos testes.
 */
export function auditPortfolioFunnelContext(slugOrKey: string): {
  context: PortfolioFunnelContext;
  status: "PASS" | "WARNING" | "FAIL";
  issues: FunnelContextIssue[];
} {
  const context = resolvePortfolioFunnelContext(slugOrKey);
  const issues: FunnelContextIssue[] = [];
  const text = `${context.nextStepTitle} ${context.nextStepBody} ${context.primaryCtaLabel}`.toLowerCase();

  for (const term of FUNNEL_INTENT_FORBIDDEN_TERMS[context.intent]) {
    if (text.includes(term)) {
      issues.push({ code: "PORTFOLIO_FUNNEL_CONTEXT_MISMATCH", detail: `termo "${term}" incompatível com a intenção ${context.intent}` });
    }
  }
  if (/\bo projeto\b|\bdo projeto\b/.test(context.primaryCtaLabel.toLowerCase())) {
    issues.push({ code: "PORTFOLIO_FUNNEL_GENERIC_CTA", detail: "CTA fala do projeto/vitrine em vez do negócio do cliente" });
  }
  if (context.source !== "PROJECT_CONTRACT") {
    issues.push({ code: "PORTFOLIO_FUNNEL_FALLBACK", detail: `sem contrato próprio (${context.source})` });
  }

  const status = issues.some((i) => i.code === "PORTFOLIO_FUNNEL_CONTEXT_MISMATCH" || i.code === "PORTFOLIO_FUNNEL_GENERIC_CTA")
    ? "FAIL"
    : issues.length
      ? "WARNING"
      : "PASS";
  return { context, status, issues };
}
