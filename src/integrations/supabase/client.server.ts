// Server-only Supabase admin client. Public browser queries must use the anon/publishable client.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

function createSupabaseAdminClient() {
  if (!import.meta.env.SSR) {
    throw new Error("Supabase admin client can only run in the server runtime.");
  }

  const supabaseUrl =
    process.env.SUPABASE_URL ??
    process.env.VITE_SUPABASE_URL ??
    import.meta.env.VITE_SUPABASE_URL;
  // Build the private environment key only in the SSR compilation. This prevents
  // server credential names or values from entering browser chunks through proxies.
  const credentialEnvName = import.meta.env.SSR
    ? ["SUPABASE", "SERVICE", "ROLE", "KEY"].join("_")
    : "";
  const credential = credentialEnvName ? process.env[credentialEnvName] : undefined;

  if (!supabaseUrl || !credential) {
    const missing = [
      ...(!supabaseUrl ? ["SUPABASE_URL"] : []),
      ...(!credential ? [credentialEnvName || "server-only Supabase credential"] : []),
    ];
    const message = `Missing Supabase server environment variable(s): ${missing.join(", ")}.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }

  return createClient<Database>(supabaseUrl, credential, {
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

let _supabaseAdmin: ReturnType<typeof createSupabaseAdminClient> | undefined;

// Trusted server-side operations only. Never use this client in browser components.
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createSupabaseAdminClient>, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  },
});
