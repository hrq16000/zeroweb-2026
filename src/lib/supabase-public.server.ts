// Cliente Supabase server-side com a chave publicável (anon).
//
// Motivo: leituras públicas de catálogo (tabela `services`, política
// `services_public_read_active`) NÃO precisam de service role. Usar a chave
// admin nessas rotas violava o princípio de menor privilégio e, na prática,
// derrubava o SSR sempre que `SUPABASE_SERVICE_ROLE_KEY` não estava presente
// no runtime (worker de preview/CI), devolvendo 404 em páginas válidas.
//
// Este cliente respeita RLS: só enxerga o que as políticas `anon` permitem.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type PublicClient = ReturnType<typeof createClient<Database>>;

let cached: PublicClient | null | undefined;

/** Retorna o cliente anon do servidor, ou `null` quando não há configuração. */
export function getSupabasePublicServer(): PublicClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    console.error(
      "[supabase-public.server] configuração ausente: SUPABASE_URL e/ou SUPABASE_PUBLISHABLE_KEY",
    );
    cached = null;
    return cached;
  }

  cached = createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

/**
 * Cliente admin OPCIONAL, usado apenas para assinar URLs de bucket privado.
 * Nunca é usado para decidir autorização, e a ausência dele degrada a imagem
 * para `null` em vez de derrubar a página inteira.
 */
export async function getSupabaseAdminOptional(): Promise<unknown | null> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    return supabaseAdmin;
  } catch {
    return null;
  }
}
