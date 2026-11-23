import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
export async function requireAdmin(client: SupabaseClient<Database>, userId: string) {
  const { data, error } = await client.from('user_roles').select('role').eq('user_id', userId);
  if (error || !data?.some(r => r.role === 'admin' || r.role === 'super_admin')) throw new Error('Acesso restrito a administradores.');
}
