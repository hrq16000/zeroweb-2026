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

/**
 * Versão rica: o fallback é o JSX autoral do componente (com destaques,
 * quebras e spans). Quando existe override administrável válido, o texto do
 * admin substitui o bloco; sem override, o design original é preservado.
 */
export function ManagedRich({
  field,
  children,
}: {
  field: TextField;
  children: React.ReactNode;
}) {
  const runtime = usePortfolioRuntime();
  const value = runtime?.[field as keyof PortfolioRuntimeEffective];
  if (typeof value === "string" && value.trim()) return <>{value}</>;
  return <>{children}</>;
}
