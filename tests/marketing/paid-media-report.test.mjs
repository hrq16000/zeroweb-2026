import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPaidMediaReport, demoInput } from "../../scripts/paid-media-report.mjs";

test("compara janelas equivalentes e deriva custo por conversão sem somar plataformas", () => {
  const report = buildPaidMediaReport(demoInput());
  const [google, meta] = report.groups;
  assert.equal(google.current.costPerConversionMinor, 2000);
  assert.equal(google.previous.costPerConversionMinor, 3000);
  assert.equal(google.delta.costPerConversionMinor, -1000);
  assert.equal(google.current.ctr, 0.1);
  assert.equal(meta.previous.spendMinor, null);
  assert.equal(meta.current.conversions, null);
  assert.equal(meta.delta.conversions, null);
  assert.equal(report.totals, undefined);
});
test("janela incompleta não produz totais ou delta enganoso", () => {
  const input = demoInput();
  input.current.complete = false;
  const result = buildPaidMediaReport(input).groups[0];
  assert.equal(result.current.spendMinor, null);
  assert.equal(result.delta.spendMinor, null);
});
test("zero observado continua zero, denominador zero continua desconhecido", () => {
  const input = demoInput();
  input.current.rows[0].conversions = 0;
  const result = buildPaidMediaReport(input).groups[0].current;
  assert.equal(result.conversions, 0);
  assert.equal(result.costPerConversionMinor, null);
});
test("rejeita janela divergente ou sobreposição", () => {
  const input = demoInput();
  input.current.end = "2026-11-15";
  assert.throws(() => buildPaidMediaReport(input), /duração/);
  input.current.start = "2026-11-03"; input.current.end = "2026-11-09";
  assert.throws(() => buildPaidMediaReport(input), /sobrepor/);
});
test("rejeita repetição, métricas inválidas e campos extras", () => {
  const input = demoInput();
  input.current.rows.push({ ...input.current.rows[0] });
  assert.throws(() => buildPaidMediaReport(input), /duplicada/);
  input.current.rows.pop();
  input.current.rows[0].spendMinor = -1;
  assert.throws(() => buildPaidMediaReport(input), /métrica/);
  input.current.rows[0].spendMinor = 10;
  input.current.rows[0].email = "sintetico@example.invalid";
  assert.throws(() => buildPaidMediaReport(input), /campos/);
});
test("datas não existentes e fuso inválido recusados", () => {
  const input = demoInput();
  input.current.end = "2026-11-31";
  assert.throws(() => buildPaidMediaReport(input), /datas/);
  input.timezone = "invalid-zone";
  assert.throws(() => buildPaidMediaReport(input), /fuso/);
});
test("agregação não transforma parcial em zero", () => {
  const input = demoInput();
  input.current.rows.push({ ...input.current.rows[0], campaign: "outra", conversions: null });
  const google = buildPaidMediaReport(input).groups[0];
  assert.equal(google.current.conversions, null);
  assert.equal(google.current.spendMinor, 28000);
  assert.equal(google.current.costPerConversionMinor, null);
});
