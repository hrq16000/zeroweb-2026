import { createClient } from "@supabase/supabase-js";
import { ToolError, type ToolContext } from "@lovable.dev/mcp-js";
import type { Database } from "@/integrations/supabase/types";

/** Lazy caller-scoped client: no privileged client or anonymous fallback. */
export function supabaseForUser(ctx: ToolContext) {
  const token = ctx.getToken();
  if (!token) throw new ToolError("Entre na sua conta para consultar o catálogo.");
  const url = process.env['SUPABASE_URL'] ?? import.meta.env['VITE_SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'] ?? import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] ?? process.env['SUPABASE_ANON_KEY'] ?? import.meta.env['VITE_SUPABASE_ANON_KEY'];
  if (!url || !key) throw new ToolError("A conexão do catálogo está indisponível.");
  return createClient<Database>(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}