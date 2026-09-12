/**
 * Ações administrativas do fluxo de confirmação de destino.
 * Somente admin/super_admin; nenhuma resposta contém o número completo.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { DESTINATION_PROVENANCE_SOURCES } from "@/lib/portfolio-funnel-destination";

const confirmSchema = z.object({
  slug: z.string().min(1).max(120),
  whatsapp: z.string().min(8).max(32),
  provenanceSource: z.enum(DESTINATION_PROVENANCE_SOURCES),
  evidence: z.string().min(3).max(500),
  acknowledgeShared: z.boolean().optional(),
  acknowledgeChange: z.boolean().optional(),
  acknowledgeLandline: z.boolean().optional(),
});

async function assertAdmin(context: { supabase: { rpc: Function }; userId: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = context.supabase as any;
  const { data: isAdmin } = await sb.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  const { data: isSuper } = await sb.rpc("has_role", {
    _user_id: context.userId,
    _role: "super_admin",
  });
  if (!isAdmin && !isSuper) throw new Error("Forbidden");
}

export const confirmPortfolioDestination = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => confirmSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { confirmDestination } = await import("@/lib/portfolio-destination-confirm.server");
    return confirmDestination(data as z.infer<typeof confirmSchema>, context.userId);
  });

export const validatePortfolioDestination = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { validateDestination } = await import("@/lib/portfolio-destination-confirm.server");
    return validateDestination(data.slug);
  });
