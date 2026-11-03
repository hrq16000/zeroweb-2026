import { test } from "node:test";
import assert from "node:assert/strict";
import { prepareBatch } from "../../scripts/scaffold-portfolio-batch.mjs";

const data = [
  { name: "Loja da Ana", location: "Afonso Pena, São José dos Pinhais — PR" },
  { name: "Brechó Circular", location: "Curitiba — PR", slug: "brecho-curitiba", funnelType: "contato" },
  { name: "Oficina da Vila", location: "Pinhais — PR", funnelType: "orcamento" },
];

test("prepara lotes pequenos a partir de nome e localização, sem publicar", () => {
  const result = prepareBatch(data, { offset: 1, limit: 2 });
  assert.equal(result.total, 3);
  assert.equal(result.count, 2);
  assert.equal(result.records[0].slug, "brecho-curitiba");
  assert.equal(result.records[1].slug, "oficina-da-vila");
  assert.equal(result.records[1].funnelType, "orcamento");
});

test("não aceita nomes sem localidade informada", () => {
  assert.throws(() => prepareBatch([{ name: "Loja Nova" }]), /localização factual/);
});

test("rejeita filiais homônimas sem slug único antes de qualquer escrita", () => {
  assert.throws(() => prepareBatch([data[0], { ...data[0] }]), /Slug duplicado/);
});

test("limita lotes a 25 e recusa volume de entrada abusivo", () => {
  assert.throws(() => prepareBatch(data, { limit: 26 }), /limit deve ser 1/);
  assert.throws(() => prepareBatch(Array.from({ length: 1001 }, () => data[0])), /1000/);
});

test("nunca transforma intenção transacional em checkout pronto", () => {
  assert.equal(prepareBatch([{ name: "Pizzaria Exemplo", location: "Curitiba - PR", funnelType: "pedido" }]).records[0].funnelType, "pedido");
});

test("recusa nome que pudesse injetar código no scaffold legado", () => {
  assert.throws(() => prepareBatch([{ name: "Loja \"; alert(1)", location: "Curitiba - PR" }]), /inseguros/);
});

test("preserva acentos e normaliza o slug sem perder o nome do negócio", () => {
  const result = prepareBatch([{ name: "Empório São José", location: "São José dos Pinhais — PR" }]);
  assert.equal(result.records[0].slug, "emporio-sao-jose");
  assert.equal(result.records[0].name, "Empório São José");
});
