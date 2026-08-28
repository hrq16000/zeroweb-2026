/**
 * Fonte única do funil de cada projeto `/portfolio/:slug`.
 *
 * Invariante: o CTA principal da página e o botão flutuante da casca padrão
 * abrem exatamente o mesmo funil. A resolução é:
 *
 *   override explícito do cliente (portfolio-global-config.json)
 *     > registro gerado das páginas (portfolio-quiz-configs.generated.ts)
 *     > padrão global do componente
 *
 * Ajustes locais de uma chamada específica (ex.: carrinho do Paraíso do Hot
 * Dog, que monta perguntas em runtime) são mesclados POR CIMA da base, nunca
 * substituindo-a — assim nenhuma página cai num segmento diferente.
 */
import globalConfig from "@/config/portfolio-global-config.json";
import clients from "@/config/portfolio-clients.json";
import { resolvePortfolioQuizConfig } from "@/config/portfolio-quiz-configs.generated";
import type { PortfolioQuizConfig } from "@/components/site/BeautyBookingQuiz";

type ClientRecord = { clientKey: string; slug: string };

const CLIENTS = clients as ClientRecord[];

function toClientKey(slugOrKey: string): string {
  const found = CLIENTS.find((c) => c.slug === slugOrKey || c.clientKey === slugOrKey);
  return found?.clientKey ?? slugOrKey;
}

function overrideQuizConfig(clientKey: string): PortfolioQuizConfig | undefined {
  const overrides = (globalConfig as unknown as {
    overrides?: Record<string, { contactFloating?: { quizConfig?: PortfolioQuizConfig } }>;
  }).overrides;
  return overrides?.[clientKey]?.contactFloating?.quizConfig;
}

/** Funil canônico do cliente (sem ajustes locais de chamada). */
export function resolvePortfolioFunnelConfig(slugOrKey: string): PortfolioQuizConfig | undefined {
  const key = toClientKey(slugOrKey);
  return overrideQuizConfig(key) ?? resolvePortfolioQuizConfig(key);
}

/** Funil canônico + ajustes locais da chamada (os locais prevalecem campo a campo). */
export function mergePortfolioFunnelConfig(
  slugOrKey: string,
  local?: PortfolioQuizConfig,
): PortfolioQuizConfig | undefined {
  const base = resolvePortfolioFunnelConfig(slugOrKey);
  if (!base) return local;
  if (!local) return base;
  return {
    ...base,
    ...local,
    stepTitles: { ...base.stepTitles, ...local.stepTitles },
    stepSubtitles: { ...base.stepSubtitles, ...local.stepSubtitles },
  };
}
