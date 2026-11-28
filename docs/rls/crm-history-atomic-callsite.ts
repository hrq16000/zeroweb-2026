// INACTIVE PREPARATION: not imported by src, never a fallback to two writes.
// After authorized migration + regenerated types, replace only the Promise.all
// block in addLeadHistory. Keep requireSupabaseAuth, input validation, the
// admin/super_admin check and the existing audit; do not expose a public RPC.
type Input = { lead_id: string; kind: 'note' | 'contact' | 'action'; note: string; actor?: string };
type Client = {
  from(table: 'lead_submissions'): {
    select(columns: 'portal_id'): {
      eq(column: 'id', value: string): {
        maybeSingle(): Promise<{ data: { portal_id: string | null } | null; error: unknown }>;
      };
    };
  };
  rpc(name: 'crm_add_history_atomic', args: {
    p_lead_id: string; p_portal_id: string | null; p_kind: string; p_note: string; p_actor: string;
  }): Promise<{ data: string | null; error: unknown }>;
};

export async function persistCrmHistoryAtomic(client: Client, input: Input): Promise<string> {
  const { data: lead, error: readError } = await client.from('lead_submissions').select('portal_id').eq('id', input.lead_id).maybeSingle();
  if (readError || !lead) throw new Error('Lead indisponível. Nenhuma interação foi registrada.');
  const { data: id, error } = await client.rpc('crm_add_history_atomic', {
    p_lead_id: input.lead_id, p_portal_id: lead.portal_id,
    p_kind: input.kind, p_note: input.note, p_actor: input.actor ?? 'admin',
  });
  if (error || !id) throw new Error('Interação não registrada. Nota e atualização devem ser gravadas juntas.');
  return id;
}