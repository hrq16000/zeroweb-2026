/**
 * Matriz de destinos do funil para o painel administrativo já existente.
 * Só administradores leem; o número nunca sai mascarado do servidor.
 */
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { DestinationRow } from "@/lib/portfolio-funnel-destination";

export type DestinationAudit = {
  rows: DestinationRow[];
  summary: { total: number; published: number; counts: Record<string, number> };
};

export const getPortfolioDestinationAudit = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DestinationAudit> => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    const { data: isSuper } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "super_admin",
    });
    if (!isAdmin && !isSuper) throw new Error("Forbidden");

    const { auditPortfolioDestinations, summarizeDestinations } = await import(
      "@/lib/portfolio-funnel-destination.server"
    );
    const rows = await auditPortfolioDestinations();
    return { rows, summary: summarizeDestinations(rows) };
  });
