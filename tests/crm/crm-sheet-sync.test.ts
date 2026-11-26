import { describe, expect, test } from 'bun:test';
import { importSheetChanges, type SheetLead, type SheetPatch } from '../../src/lib/crm-sheet-sync';

const statuses = ['novo', 'em_atendimento', 'qualificado', 'proposta', 'negociacao', 'fechado', 'perdido', 'arquivado'];
const lead = (status = 'novo', id = 'synthetic-a'): SheetLead => ({ id, status, assignee: 'fixture', notes: 'original' });
const row = (id = 'synthetic-a', status = 'em_atendimento'): string[] => [id, '', '', '', '', '', '', '', status, 'changed', 'new note'];

describe('Planilha CRM: resultado fiel e registros encerrados', () => {
  for (const status of ['fechado', 'perdido', 'arquivado', 'won', 'lost']) {
    test(`${status}: não altera nota, responsável nem reabre`, async () => {
      let writes = 0;
      const original = lead(status);
      const result = await importSheetChanges([row()], [original], statuses, async () => { writes++; return 'updated'; });
      expect(writes).toBe(0);
      expect(result.protectedTerminal).toBe(1);
      expect(original).toEqual(lead(status));
    });
  }
  test('sucesso parcial é explicitamente incompleto e conta apenas gravações reais', async () => {
    const result = await importSheetChanges([row(), row('synthetic-b')], [lead(), lead('novo', 'synthetic-b')], statuses,
      async (record) => record.id === 'synthetic-a' ? 'updated' : 'failed');
    expect(result.ok).toBe(false);
    expect(result.updated).toBe(1);
    expect(result.failures).toEqual([{ rowNumber: 3, reason: 'update_failed' }]);
  });
  test('nenhuma linha retornada não é sucesso; representa concorrência', async () => {
    const result = await importSheetChanges([row()], [lead()], statuses, async () => 'conflict');
    expect(result.ok).toBe(false);
    expect(result.updated).toBe(0);
    expect(result.failures[0]?.reason).toBe('conflict');
  });
  test('status inválido impede qualquer mudança da mesma linha', async () => {
    let writes = 0;
    const result = await importSheetChanges([row('synthetic-a', 'fake')], [lead()], statuses, async () => { writes++; return 'updated'; });
    expect(writes).toBe(0);
    expect(result.failures[0]?.reason).toBe('invalid_status');
  });
  test('IDs duplicados ou fora do conjunto lido não são ignorados silenciosamente', async () => {
    let writes = 0;
    const result = await importSheetChanges([row(), row(), row('unknown')], [lead()], statuses, async () => { writes++; return 'updated'; });
    expect(writes).toBe(0);
    expect(result.failures.map((failure) => failure.reason)).toEqual(['duplicate', 'duplicate', 'unknown_lead']);
  });
  test('gera patch válido sem modificar o snapshot original', async () => {
    const original = lead();
    const patches: SheetPatch[] = [];
    const result = await importSheetChanges([row()], [original], statuses, async (_, patch) => { patches.push(patch); return 'updated'; });
    expect(result.ok).toBe(true);
    expect(result.updated).toBe(1);
    expect(patches).toEqual([{ status: 'em_atendimento', assignee: 'changed', notes: 'new note' }]);
    expect(original).toEqual(lead());
  });
});