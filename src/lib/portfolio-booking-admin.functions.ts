import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { canManagePortfolioBooking } from "@/lib/portfolio-booking-contract";
import { isVerifiedGoogleBookingSession } from "@/lib/portfolio-booking-google-auth";

const inputSchema = z.object({
  clientKey: z.string().regex(/^[a-z0-9][a-z0-9_-]{1,100}$/),
}).strict();

type ClientAdminAccess =
  | { authorized: false }
  | { authorized: true; role: "owner" | "manager" };

/**
 * Verificação exclusivamente no servidor, com a identidade real do Bearer
 * token e consultas sujeitas à RLS do banco compartilhado.
 *
 * Não usa a service-role key. A migração de schema #499 ainda precisa ser
 * aplicada, e as políticas RLS para leitura continuam deliberadamente
 * fechadas: até a homologação, esta função retorna authorized=false.
 *
 * Não confundir com uma tela de login ou painel já operacional.
 */
export const getPortfolioBookingAdminAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data, context }): Promise<ClientAdminAccess> => {
    const denied = { authorized: false } as const;
    const header = getRequest()?.headers.get("authorization") ?? "";
    if (!/^Bearer\s+\S+$/.test(header)) return denied;
    const token = header.slice(7).trim();

    // getUser(token) revalida a sessão no servidor de autenticação.
    const { data: authData, error: authError } = await context.supabase.auth.getUser(token);
    const user = authData?.user;
    if (authError || !user || user.id !== context.userId) return denied;
    if (!isVerifiedGoogleBookingSession(context.claims, user)) return denied;

    // O gerador de tipos do banco será atualizado após a migração efetiva.
    // A consulta preserva a sessão (publishable key + JWT), nunca bypass RLS.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db: any = context.supabase;

    const { data: tenant, error: tenantError } = await db
      .from("portfolio_booking_tenants")
      .select("client_key, enabled")
      .eq("client_key", data.clientKey)
      .maybeSingle();
    if (tenantError || !tenant?.enabled || tenant.client_key !== data.clientKey) return denied;

    const { data: membership, error: membershipError } = await db
      .from("portfolio_booking_memberships")
      .select("client_key, user_id, google_email, role, active")
      .eq("client_key", data.clientKey)
      .eq("user_id", user.id)
      .eq("active", true)
      .maybeSingle();

    if (membershipError || !membership) return denied;
    if (membership.role !== "owner" && membership.role !== "manager") return denied;

    const googleIdentity = {
      userId: user.id,
      email: user.email ?? "",
      provider: "google",
      emailVerified: Boolean(user.email_confirmed_at),
    };
    if (!canManagePortfolioBooking(googleIdentity, {
      clientKey: membership.client_key,
      userId: membership.user_id,
      googleEmail: membership.google_email,
      active: membership.active,
    }, data.clientKey)) return denied;

    return { authorized: true, role: membership.role };
  });
