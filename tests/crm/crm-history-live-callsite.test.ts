import { expect, test } from 'bun:test';
import { persistCrmHistoryAtomic } from '../../src/lib/crm-history-atomic';

const input = { lead_id: 'synthetic-a', kind: 'note' as const, note: 'synthetic only' };
test('operação real consulta o cliente com acesso do usuário antes de gravar', async () => {
  let writes = 0;
  const reader = { from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }) }) }) };
  const writer = { rpc: async () => { writes++; return { data: 'id', error: null }; } };
  await expect(persistCrmHistoryAtomic(reader, writer, input)).rejects.toThrow();
  expect(writes).toBe(0);
});
test('operação real usa uma gravação conjunta e preserva portal null', async () => {
  const calls: unknown[] = [];
  const reader = { from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { portal_id: null }, error: null }) }) }) }) };
  const writer = { rpc: async (name: string, args: unknown) => { calls.push({ name, args }); return { data: 'id', error: null }; } };
  expect(await persistCrmHistoryAtomic(reader, writer, input)).toBe('id');
  expect(calls).toEqual([{ name: 'crm_add_history_atomic', args: { p_lead_id: 'synthetic-a', p_portal_id: null, p_kind: 'note', p_note: 'synthetic only', p_actor: 'admin' } }]);
});
test('falha de gravação conjunta não executa gravações separadas', async () => {
  let writes = 0;
  const reader = { from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { portal_id: 'synthetic-portal' }, error: null }) }) }) }) };
  const writer = { rpc: async () => { writes++; return { data: null, error: 'synthetic rejection' }; } };
  await expect(persistCrmHistoryAtomic(reader, writer, input)).rejects.toThrow();
  expect(writes).toBe(1);
});