/**
 * Configuração PÚBLICA do backend, usada por validadores de CI.
 *
 * Estes dois valores não são segredos: a URL e a chave publicável (anon) já
 * são embarcadas no bundle do navegador e só dão acesso ao que as políticas de
 * RLS liberam para leitura pública. Mantê-los aqui evita que gates de conteúdo
 * público (SEO diff, imagens do catálogo) dependam de segredos de CI — que,
 * quando ausentes, transformavam uma verificação real em falha permanente.
 *
 * NUNCA adicionar aqui chave de service role ou qualquer credencial
 * administrativa.
 */
export const PUBLIC_SUPABASE_URL = "https://lxajhxocyqzwwbcfahya.supabase.co";
export const PUBLIC_SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4YWpoeG9jeXF6d3diY2ZhaHlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MDg5NTksImV4cCI6MjA5NjE4NDk1OX0.EI8SlFxmTAENDKUvH-N0FNDnLv_etfVVlMisNdnt3IQ";

/** Resolve a URL pública do backend (env tem precedência). */
export function resolvePublicSupabaseUrl() {
  return process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || PUBLIC_SUPABASE_URL;
}

/** Resolve a chave publicável (env tem precedência). */
export function resolvePublicSupabaseKey() {
  return (
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}
