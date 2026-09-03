/**
 * Funil padrão derivado do catálogo — parametrização automática por segmento.
 *
 * Motivo: projetos publicados sem `quizConfig` explícito caíam no funil padrão
 * do componente (perguntas de beleza), exigindo correção manual projeto a
 * projeto. Aqui o funil é montado a partir de dados que TODO item do catálogo
 * já possui (segmento, título, cidade), de forma que qualquer projeto novo
 * nasce com perguntas coerentes com o próprio negócio.
 *
 * Precedência (ver `portfolio-funnel-config.ts`):
 *   override do cliente > registro gerado da página > este padrão por segmento
 *
 * Nada aqui inventa preço, prazo, prova social ou promessa comercial.
 */
import catalog from "@/config/portfolio-catalog.json";
import type { PortfolioQuizConfig } from "@/components/site/BeautyBookingQuiz";

type CatalogItem = {
  slug: string;
  clientKey?: string;
  title: string;
  segment: string;
  projectType?: string;
  city?: string;
  state?: string;
};

const ITEMS = catalog as CatalogItem[];

const TIMING = ["O quanto antes", "Nos próximos dias", "Ainda estou planejando"];

const BY_SEGMENT: Record<string, Pick<PortfolioQuizConfig, "services" | "experienceOptions">> = {
  restaurantes: {
    services: ["Pedido para agora", "Encomenda para uma data", "Pedido para grupo/evento", "Quero ver o cardápio"],
    experienceOptions: ["Retirada no local", "Entrega", "Consumo no local", "Ainda vou decidir"],
  },
  comercios: {
    services: ["Quero um produto do catálogo", "Quero algo personalizado", "Preciso de ajuda para escolher", "Compra para presente"],
    experienceOptions: ["Retirada", "Entrega", "Ainda vou decidir"],
  },
  beleza: {
    services: ["Agendar um serviço", "Conhecer os procedimentos", "Pacote/combo", "Quero uma orientação"],
    experienceOptions: ["Primeira vez", "Já sou cliente", "Retorno/manutenção"],
  },
  saude: {
    services: ["Agendar avaliação", "Tirar dúvidas sobre um tratamento", "Retorno", "Quero orientação"],
    experienceOptions: ["Primeiro atendimento", "Já sou paciente", "Indicação"],
  },
  juridico: {
    services: ["Consulta inicial", "Análise de documento", "Acompanhamento de processo", "Outro assunto"],
    experienceOptions: ["Primeiro contato", "Já sou cliente", "Indicação"],
  },
  construcao: {
    services: ["Orçamento de obra ou reforma", "Visita técnica", "Projeto", "Manutenção"],
    experienceOptions: ["Residencial", "Comercial", "Ainda vou definir"],
  },
  "prestadores-de-servicos": {
    services: ["Orçamento de serviço", "Visita técnica", "Manutenção", "Quero uma orientação"],
    experienceOptions: ["Residencial", "Comercial", "Ainda vou definir"],
  },
  agencias: {
    services: ["Quero uma proposta", "Campanha nova", "Reforçar campanha existente", "Quero orientação"],
    experienceOptions: ["Negócio local", "Rede/franquia", "Ainda vou definir"],
  },
  servicos: {
    services: ["Quero um orçamento", "Agendar atendimento", "Tirar dúvidas", "Quero uma orientação"],
    experienceOptions: ["Primeiro contato", "Já sou cliente", "Indicação"],
  },
};

const FALLBACK = BY_SEGMENT["servicos"]!;

/** Monta o funil padrão de um item de catálogo (sem depender do componente). */
export function buildDefaultFunnelConfig(item: {
  title: string;
  segment: string;
  city?: string;
}): PortfolioQuizConfig {
  const base = BY_SEGMENT[item.segment] ?? FALLBACK;
  const cityOptions = item.city
    ? [item.city, `Fora de ${item.city}`, "Vou confirmar o endereço"]
    : ["Vou confirmar o endereço"];

  return {
    services: base.services,
    experienceOptions: base.experienceOptions,
    periodOptions: cityOptions,
    timingOptions: TIMING,
    stepTitles: {
      service: "Como podemos ajudar?",
      experience: "Conte um pouco do seu caso",
      period: "Onde você está?",
      timing: "Para quando?",
      note: "Quer acrescentar algo?",
    },
    stepSubtitles: {
      service: `Atendimento de ${item.title}.`,
    },
    notePlaceholder: "Escreva aqui os detalhes do que você precisa (opcional).",
    proposalKind: "service",
  };
}

/** Funil padrão do projeto, resolvido por slug ou clientKey do catálogo. */
export function resolveCatalogFunnelConfig(slugOrKey: string): PortfolioQuizConfig | undefined {
  const item = ITEMS.find((i) => i.slug === slugOrKey || i.clientKey === slugOrKey);
  return item ? buildDefaultFunnelConfig(item) : undefined;
}
