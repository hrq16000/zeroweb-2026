type Input = { lead_id: string; kind: 'note' | 'contact' | 'action'; note: string; actor?: string };
type Reader = {
  from(table: 'lead_submissions'): {
    select(columns: 'portal_id'): {
      eq(column: 'id', value: string): {
        maybeSingle(): PromiseLike<{ data: { portal_id: string | null } | null; error: unknown }>;
      };
    };
  };
};
type Writer = {
  rpc(name: 'crm_add_history_atomic', args: {
    p_lead_id: string; p_portal_id: string | null; p_kind: string; p_note: string; p_actor: string;
  }): PromiseLike<{ data: string | null; error: unknown }>;
};

export async function persistCrmHistoryAtomic(reader: Reader, writer: Writer, input: Input): Promise<string> {
  // Resolve through the caller's RLS client; never trust a portal supplied by a form.
  const { data: lead, error: readError } = await reader.from('lead_submissions').select('portal_id').eq('id', input.lead_id).maybeSingle();
  if (readError || !lead) throw new Error('Lead indisponível. Nenhuma interação foi registrada.');
  const { data: id, error } = await writer.rpc('crm_add_history_atomic', {
    p_lead_id: input.lead_id, p_portal_id: lead.portal_id,
    p_kind: input.kind, p_note: input.note, p_actor: input.actor ?? 'admin',
  });
  if (error || !id) throw new Error('Interação não registrada. O lead deve estar aberto e a nota deve ser gravada por inteiro.');
  return id;
}