// No I/O or credentials. The caller supplies compare-and-set persistence.
export type SheetLead = {
  id: string; status: string | null; assignee: string | null; notes: string | null;
};
export type SheetPatch = { status?: string; assignee?: string | null; notes?: string | null };
export type SheetFailure = { rowNumber: number; reason: 'duplicate' | 'unknown_lead' | 'invalid_status' | 'update_failed' | 'conflict' };

const aliases: Record<string, string> = { new: 'novo', contacted: 'em_atendimento', qualified: 'qualificado', won: 'fechado', lost: 'perdido' };
export function isTerminalLead(status: string | null): boolean {
  return ['fechado', 'perdido', 'arquivado', 'won', 'lost'].includes(status ?? '');
}

export async function importSheetChanges<T extends SheetLead>(
  sheetRows: readonly (readonly string[])[], leads: readonly T[], statuses: readonly string[],
  persist: (lead: T, patch: SheetPatch) => Promise<'updated' | 'conflict' | 'failed'>,
) {
  const byId = new Map(leads.map((lead) => [lead.id, lead]));
  const counts = new Map<string, number>();
  for (const row of sheetRows) {
    const id = row[0]; if (id) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  let updated = 0;
  let protectedTerminal = 0;
  const failures: SheetFailure[] = [];
  for (const [index, row] of sheetRows.entries()) {
    const id = row[0]; if (!id) continue;
    const rowNumber = index + 2;
    if ((counts.get(id) ?? 0) > 1) { failures.push({ rowNumber, reason: 'duplicate' }); continue; }
    const lead = byId.get(id);
    if (!lead) { failures.push({ rowNumber, reason: 'unknown_lead' }); continue; }
    // Preserve the whole terminal record, including notes, assignee and interaction.
    if (isTerminalLead(lead.status)) { protectedTerminal += 1; continue; }
    const status = (row[8] ?? '').trim();
    const current = lead.status == null ? 'novo' : aliases[lead.status] ?? lead.status;
    if (!statuses.includes(current) || (status && !statuses.includes(status))) {
      failures.push({ rowNumber, reason: 'invalid_status' }); continue;
    }
    const assignee = (row[9] ?? '').trim() || null;
    const notes = (row[10] ?? '').trim() || null;
    const patch: SheetPatch = {};
    if (status && status !== current) patch.status = status;
    if (assignee !== lead.assignee) patch.assignee = assignee;
    if (notes !== lead.notes) patch.notes = notes;
    if (!Object.keys(patch).length) continue;
    let result: 'updated' | 'conflict' | 'failed';
    try { result = await persist(lead, patch); } catch { result = 'failed'; }
    if (result !== 'updated') {
      failures.push({ rowNumber, reason: result === 'conflict' ? 'conflict' : 'update_failed' });
      continue;
    }
    updated += 1;
  }
  return { ok: failures.length === 0, updated, protectedTerminal, failures };
}