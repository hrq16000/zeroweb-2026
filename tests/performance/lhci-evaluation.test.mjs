import { describe, expect, test } from 'bun:test';
import { evaluateLhci, aggregateLighthouse, normalizeAuditSnapshot } from '../../src/lib/lhci-evaluation.mjs';

const metrics = { performance: 0.9, seo: 0.95, accessibility: 0.95, lcp_ms: 2500, cls: 0.1, tbt_ms: 200 };
const run = { performance: 0.9, seo: 0.95, accessibility: 0.95, bestPractices: 0.8, lcp: 2500, cls: 0.1, tbt: 200 };

describe('Lighthouse: métricas obrigatórias e gates preservados', () => {
  test('sem métricas não aprova automaticamente', () => {
    expect(evaluateLhci({})).toEqual({ status: 'failed', failed: [], missing: Object.keys(metrics) });
  });
  for (const metric of Object.keys(metrics)) {
    test(`ausência de ${metric} reprova`, () => {
      const incomplete = { ...metrics }; delete incomplete[metric];
      expect(evaluateLhci(incomplete).missing).toEqual([metric]);
      expect(evaluateLhci(incomplete).status).toBe('failed');
    });
  }
  test('limites exatos são inclusivos e BP continua warning', () => {
    expect(evaluateLhci(metrics).status).toBe('passed');
    expect(aggregateLighthouse([run]).problems).toEqual([]);
  });
  for (const [metric, value, reason] of [
    ['performance', 0.89, 'performance<0.9'], ['seo', 0.94, 'seo<0.95'],
    ['accessibility', 0.94, 'accessibility<0.95'], ['lcp_ms', 2501, 'lcp_ms>2500'],
    ['cls', 0.101, 'cls>0.1'], ['tbt_ms', 400, 'tbt_ms>200'],
  ]) {
    test(`${metric} reprovado não some`, () => {
      expect(evaluateLhci({ ...metrics, [metric]: value }).failed).toEqual([reason]);
    });
  }
  test('configuração inválida ou mais fraca não afrouxa gates', () => {
    expect(evaluateLhci({ ...metrics, performance: 0.89, tbt_ms: 400 }, { performance: 0, tbt_ms: Infinity }).failed)
      .toEqual(['performance<0.9', 'tbt_ms>200']);
    expect(evaluateLhci(metrics, { performance: 0.95, tbt_ms: 100 }).failed).toEqual(['performance<0.95', 'tbt_ms>100']);
  });
  test('valores inválidos e null não são medições', () => {
    for (const value of [null, undefined, NaN, Infinity, -1, '0.95', 1.1]) {
      expect(evaluateLhci({ ...metrics, performance: value }).missing).toEqual(['performance']);
    }
  });
  test('a medição aprovada posterior não apaga a reprovação anterior', () => {
    const bad = { ...run, performance: 0.82, tbt: 400 };
    const summary = aggregateLighthouse([bad, run]);
    expect(summary.performance).toBe(0.82);
    expect(summary.tbt).toBe(400);
    expect(summary.runs).toHaveLength(2);
    expect(summary.problems).toEqual(['Lighthouse: performance<0.9', 'Lighthouse: tbt_ms>200']);
    expect(aggregateLighthouse([run, bad])).toEqual({ ...summary, runs: [...summary.runs].reverse() });
  });
  test('painel recalcula snapshot antigo sem alterar o artifact original', () => {
    const snapshot = { rows: [{ route: '/synthetic', lighthouse: { ...run, performance: 0.82 }, problems: [] }], totals: { routesWithProblems: 0, problems: 0 } };
    const normalized = normalizeAuditSnapshot(snapshot);
    expect(normalized.totals.routesWithProblems).toBe(1);
    expect(normalized.rows[0]?.problems).toEqual(['Lighthouse: performance<0.9']);
    expect(snapshot.totals.routesWithProblems).toBe(0);
    expect(snapshot.rows[0]?.problems).toEqual([]);
  });
});