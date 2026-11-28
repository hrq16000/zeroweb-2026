import { expect, test } from 'bun:test';
import { persistCrmHistoryAtomic } from '../../docs/rls/crm-history-atomic-callsite';

const input = { lead_id: 'synthetic-a', kind: 'note' as const, note: 'synthetic only' };

test('candidato: lead ausente impede qualquer RPC', async () => {
  let calls = 0;
  const client = {
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }) }) }),
    rpc: async () => { calls++; return { data: 'history', error: null }; },
  };
  await expect(persistCrmHistoryAtomic(client, input)).rejects.toThrow();
  expect(calls).toBe(0);
});

test('candidato: portal é relido do lead e a nota usa uma única operação', async () => {
  const calls: unknown[] = [];
  const client = {
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { portal_id: 'synthetic-portal' }, error: null }) }) }) }),
    rpc: async (name: string, args: unknown) => { calls.push({ name, args }); return { data: 'history-id', error: null }; },
  };
  expect(await persistCrmHistoryAtomic(client, input)).toBe('history-id');
  expect(calls).toEqual([{ name: 'crm_add_history_atomic', args: {
    p_lead_id: 'synthetic-a', p_portal_id: 'synthetic-portal', p_kind: 'note', p_note: 'synthetic only', p_actor: 'admin',
  } }]);
});

test('candidato: falha da RPC não cai no caminho antigo de gravações separadas', async () => {
  let calls = 0;
  const client = {
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { portal_id: null }, error: null }) }) }) }),
    rpc: async () => { calls++; return { data: null, error: { message: 'synthetic failure' } }; },
  };
  await expect(persistCrmHistoryAtomic(client, input)).rejects.toThrow();
  expect(calls).toBe(1);
});