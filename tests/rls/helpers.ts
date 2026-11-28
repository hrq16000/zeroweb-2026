import { createClient } from "@supabase/supabase-js";

export const RLS_TEST_TIMEOUT_MS = 180_000;
const REQUEST_TIMEOUT_MS = 10_000;

export function rlsEnvironment() {
  const url = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
  const publishableKey = process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  return url && publishableKey && serviceKey ? { url, publishableKey, serviceKey } : null;
}

export function rlsClient(url: string, key: string) {
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: `rls-${crypto.randomUUID()}` },
    global: {
      fetch: (input, init) => fetch(input, {
        ...init,
        signal: init?.signal
          ? AbortSignal.any([init.signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)])
          : AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      }),
    },
  });
}

/** A failed request is not proof of isolation unless PostgreSQL denied access. */
export function assertHidden(result: { data: unknown[] | null; error: { code?: string; message: string } | null }, label: string) {
  if (result.error && result.error.code !== "42501") throw new Error(`${label}: request failed (${result.error.code ?? "unknown"})`);
  if ((result.data?.length ?? 0) !== 0) throw new Error(`${label}: protected rows were visible`);
}

export function assertDenied(error: { code?: string; message: string } | null, label: string) {
  if (error?.code !== "42501") throw new Error(`${label}: expected SQLSTATE 42501, received ${error?.code ?? "success"}`);
}