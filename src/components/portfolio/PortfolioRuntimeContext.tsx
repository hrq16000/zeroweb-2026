import { createContext, useContext, type ReactNode } from "react";
import type { PortfolioRuntimeEffective } from "@/lib/portfolio-runtime";

/**
 * Contrato compartilhado entre a rota e os componentes próprios (Frente E).
 *
 * CUSTOM COMPONENT + MANAGED DATA: cada projeto mantém layout, motion e
 * composição exclusivos; o que vem do admin chega por este contexto, sempre
 * com fallback para o valor já codificado no componente.
 */
const PortfolioRuntimeContext = createContext<PortfolioRuntimeEffective | null>(null);

export function PortfolioRuntimeProvider({
  value,
  children,
}: {
  value: PortfolioRuntimeEffective | null;
  children: ReactNode;
}) {
  return (
    <PortfolioRuntimeContext.Provider value={value}>{children}</PortfolioRuntimeContext.Provider>
  );
}

export function usePortfolioRuntime(): PortfolioRuntimeEffective | null {
  return useContext(PortfolioRuntimeContext);
}

/** Campo administrável com fallback obrigatório: nunca renderiza vazio. */
export function useManagedValue<K extends keyof PortfolioRuntimeEffective>(
  field: K,
  fallback: NonNullable<PortfolioRuntimeEffective[K]>,
): NonNullable<PortfolioRuntimeEffective[K]> {
  const runtime = usePortfolioRuntime();
  const value = runtime?.[field];
  if (value === undefined || value === null || value === "") return fallback;
  if (Array.isArray(value) && value.length === 0) return fallback;
  return value as NonNullable<PortfolioRuntimeEffective[K]>;
}
