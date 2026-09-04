import { usePortfolioRuntime } from "@/components/portfolio/PortfolioRuntimeContext";
import type { PortfolioRuntimeEffective } from "@/lib/portfolio-runtime";

type TextField = "heroHeadline" | "heroSubheadline" | "ctaLabel" | "description" | "title";

/**
 * Texto administrável dentro de um componente próprio de cliente.
 *
 * CUSTOM COMPONENT + MANAGED DATA: o layout continua exclusivo do projeto;
 * apenas o conteúdo do núcleo comum passa a vir do admin. Sem override válido
 * o texto original do componente permanece — nunca renderiza vazio.
 */
export function ManagedText({ field, fallback }: { field: TextField; fallback: string }) {
  const runtime = usePortfolioRuntime();
  const value = runtime?.[field as keyof PortfolioRuntimeEffective];
  const text = typeof value === "string" && value.trim() ? value : fallback;
  return <>{text}</>;
}
