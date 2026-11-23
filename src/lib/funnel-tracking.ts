import type { Json } from '@/integrations/supabase/types';
export function leadTracking(metadata: Json) {
  const m = metadata && typeof metadata === 'object' && !Array.isArray(metadata) ? metadata : {};
  const jotform = m['jotform'];
  return {
    protocol: typeof m['protocol'] === 'string' ? m['protocol'] : null,
    clientKey: typeof m['client_key'] === 'string' ? m['client_key'] : null,
    jotform: jotform && typeof jotform === 'object' ? JSON.stringify(jotform) : null,
  };
}
export function nextFilterDay(day: string) {
  const date = new Date(`${day}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString();
}
